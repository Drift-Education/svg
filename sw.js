const appRoot = new URL(".", self.location.href);
importScripts(
  new URL("runtime/e2b749.js", appRoot).href,
  new URL("runtime-2/a1.js", appRoot).href,
  new URL("runtime-2/e5.js", appRoot).href,
  new URL("runtime-2/d4.js", appRoot).href
);

// Keyword content filter, mirrored from BLOCKED_KEYWORDS in
// src/proxy/blocklist.ts; tests/unit.spec.ts fails if the two lists drift.
// The app refuses filtered addresses before it renders a frame, but a link
// clicked inside a proxied page navigates the iframe directly, so the check has
// to happen here too: a matching navigation is answered without ever reaching
// the transport.
// Keep every entry lowercase and free of scheme, "www." and slashes.
const blockedKeywords = [
  "pornhub",
  "xvideos",
  "xnxx",
  "xhamster",
  "redtube",
  "youporn",
  "tube8",
  "spankbang",
  "eporner",
  "tnaflix",
  "txxx",
  "pornone",
  "beeg",
  "4tube",
  "drtuber",
  "brazzers",
  "naughtyamerica",
  "realitykings",
  "bangbros",
  "mofos",
  "babes.com",
  "onlyfans",
  "fansly",
  "chaturbate",
  "livejasmin",
  "myfreecams",
  "cam4",
  "stripchat",
  "bongacams",
  "streamate",
  "jerkmate",
  "camsoda",
  "sexier",
  "imlive",
  "camgirl",
  "sexcam",
  "liveshow",
  "escort",
  "callgirl",
  "yapchat",
  "yap.chat",
  "porn",
  "xxx",
  "hentai",
  "nsfw",
  "nude",
  "nudes",
  "naked",
  "erotic",
  "fetish",
  "milf"
];

const PATH_TOKEN_SPLIT = /[^a-z0-9]+/;

/** The keyword a target URL matches, or null. Mirrors matchBlockedKeyword. */
function blockedKeywordIn(targetUrl) {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  for (const keyword of blockedKeywords) {
    if (host.includes(keyword)) {
      return keyword;
    }
  }
  for (const token of parsed.pathname.toLowerCase().split(PATH_TOKEN_SPLIT)) {
    if (token !== "" && blockedKeywords.includes(token)) {
      return token;
    }
  }
  return null;
}

function isNavigation(request) {
  return (
    request.mode === "navigate" ||
    request.destination === "document" ||
    request.destination === "iframe"
  );
}

// Scramjet requests look like "<origin>/<prefix>/https%3A%2F%2Fexample.com%2F",
// so the encoded target is everything from the first encoded scheme onwards.
function decodeScramjetTarget(requestUrl) {
  const pathname = new URL(requestUrl).pathname;
  const marker = /https?%3a%2f%2f/i.exec(pathname);
  if (!marker) {
    return null;
  }
  try {
    return decodeURIComponent(pathname.slice(marker.index));
  } catch {
    return null;
  }
}

// Ultraviolet encodes the target by URI-encoding it after flipping every second
// character, so undo the encoding first and then the XOR.
function decodeUltravioletTarget(requestUrl, prefix) {
  if (!requestUrl.startsWith(prefix)) {
    return null;
  }
  try {
    const encoded = decodeURIComponent(requestUrl.slice(prefix.length).split("?")[0]);
    let decoded = "";
    for (let index = 0; index < encoded.length; index += 1) {
      decoded +=
        index % 2 === 1 ? String.fromCharCode(encoded.charCodeAt(index) ^ 2) : encoded[index];
    }
    return decoded;
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
}

// Answered as a real navigation response so the window keeps this document
// instead of showing a network error while the app swaps in its own card.
function blockedResponse(targetUrl, keyword) {
  let host = targetUrl;
  try {
    host = new URL(targetUrl).hostname;
  } catch {
    // Keep the raw address; it is escaped below either way.
  }
  const html =
    '<!doctype html><meta charset="utf-8">' +
    `<title>Blocked: ${escapeHtml(host)}</title>` +
    "<style>" +
    "html,body{height:100%;margin:0}" +
    "body{display:flex;align-items:center;justify-content:center;background:#0b1220;" +
    "color:#f7f9ff;font:15px/1.55 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    "main{max-width:460px;padding:26px 30px;border:1px solid #24324a;border-radius:18px;" +
    "background:#111925}" +
    "h1{margin:0 0 10px;font-size:17px}" +
    "p{margin:0 0 8px;color:#9fb0c9}" +
    "strong{color:#f7f9ff}" +
    "</style>" +
    "<main><h1>Blocked by the content filter</h1>" +
    `<p>Drift will not load <strong>${escapeHtml(host)}</strong>: its address matches the ` +
    `\u201c${escapeHtml(keyword)}\u201d keyword.</p>` +
    "<p>This list is built into Drift and applies to every tab.</p></main>";
  // A 4xx here is discarded by Chromium instead of being rendered
  // (net::ERR_BLOCKED_BY_RESPONSE), which left a clicked link looking dead. The
  // page is a document Drift serves, so it is answered as one; the target is
  // never contacted either way.
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // Drift's shell is isolated (COEP: credentialless), so a framed document
      // without its own COEP is refused with net::ERR_BLOCKED_BY_RESPONSE instead
      // of rendering. Routed Scramjet responses carry the same header.
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin"
    }
  });
}

// A UVServiceWorker constructs a BareClient, which looks for a bare-mux
// SharedWorker port that a service worker can never host; bare-mux then logs
// "failed to get a bare-mux SharedWorker MessagePort within 1s, retrying" once a
// second for the life of that worker. Build it only when a UV request arrives, so
// the Scramjet engine at the default setting never pays for it.
const uvRoutePrefix = new URL(__uv$config.prefix, self.location.origin).href;
let uv = null;

addEventListener("fetch", (event) => {
  if (new URL(event.request.url).pathname.startsWith(new URL("runtime-3/", appRoot).pathname)) {
    return;
  }
  if (event.request.url.startsWith(uvRoutePrefix)) {
    if (isNavigation(event.request)) {
      const target = decodeUltravioletTarget(event.request.url, uvRoutePrefix);
      const keyword = target === null ? null : blockedKeywordIn(target);
      if (keyword !== null) {
        event.respondWith(blockedResponse(target, keyword));
        return;
      }
    }
    uv ??= new UVServiceWorker();
    event.respondWith(uv.fetch(event));
    return;
  }
  if ($scramjetController.shouldRoute(event)) {
    if (isNavigation(event.request)) {
      const target = decodeScramjetTarget(event.request.url);
      const keyword = target === null ? null : blockedKeywordIn(target);
      if (keyword !== null) {
        event.respondWith(blockedResponse(target, keyword));
        return;
      }
    }
    event.respondWith($scramjetController.route(event));
  }
});
