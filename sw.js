// Shell worker for the `dist/svg` mirror (scope: the app directory).
//
// A GitHub-backed CDN cannot send the headers Drift needs, and isolation is
// decided by the top-level document's own response, so a page served straight
// from jsDelivr can never be isolated and neither the proxy nor the Roblox
// engine can allocate shared memory. A service worker can answer that
// navigation, and this one does: the app document is re-emitted with the
// COOP/COEP pair, while every other request goes to the vendored proxy worker
// that is imported at the end of this file.
//
// It also answers the player document. jsDelivr types `.html` as
// `text/plain; charset=utf-8` with `nosniff`, so a player window that opens
// before its own worker controls `/webblox/` prints its source instead of the
// game. Serving it here as HTML means the frame is right from the first load;
// the player's own worker (a more specific scope) takes over with the same
// headers once it is active.
//
// It also answers `index.svg?build=<commit>`: that is the always-latest loader's
// handover, and it is served from the commit's own bytes while the URL keeps the
// branch directory the reader opened. A `<base>` element points the document's
// relative paths at that commit, so the branch copy — the one that goes stale —
// is never read.
//
// The first visit is still unisolated (no worker is controlling it yet), so the
// document registers this worker and reloads itself once. See
// `scripts/build-preview-svg.mjs`.

const SHELL_DOCUMENT = /\/(?:index\.svg|index\.xml)$/;
const PLAYER_DOCUMENT = /\/webblox\/player\.html$/;
const COMMIT = /^[0-9a-f]{40}$/;
// The loader registers `sw.js?entry=latest`, and that worker only answers
// documents: the proxy runtime beside it lives in the branch directory, where
// the copy is the stale one, and a proxy bound to this scope can never serve a
// frame anyway.
const ENTRY_ONLY = new URL(self.location.href).searchParams.has("entry");

const SHELL_HEADERS = {
  "cross-origin-opener-policy": "same-origin",
  // `credentialless` keeps Games/Music artwork loading from third parties
  // without CORP, which is the same pair `public/_headers` uses for the app.
  "cross-origin-embedder-policy": "credentialless",
  "cross-origin-resource-policy": "cross-origin",
  "cache-control": "no-store"
};

const PLAYER_HEADERS = {
  "cross-origin-opener-policy": "same-origin",
  // The engine runs pthreads over shared WebAssembly memory, so the player
  // folder opts into require-corp, exactly like `public/_headers`.
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-resource-policy": "same-origin",
  "cache-control": "no-store"
};

self.addEventListener("install", (event) => {
  // A redeploy must take over without leaving the old worker in charge.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // The open document was loaded by whatever ran before this; claim it so the
  // reload that follows is answered here.
  event.waitUntil(self.clients.claim());
});

// The loader asks before it hands over: a worker from before this handover
// existed cannot answer, and its branch copy is the stale one.
self.addEventListener("message", (event) => {
  if (!event.data || event.data.drift !== "shell?") {
    return;
  }
  const reply = { drift: "shell", build: true };
  const port = event.ports?.[0];
  if (port) {
    port.postMessage(reply);
  } else if (event.source) {
    event.source.postMessage(reply);
  }
});

// `/gh/<owner>/<repo>@<ref>/index.svg` -> the same file at `@<commit>`.
function commitDocument(url, build) {
  const source = new URL(url.href);
  source.pathname = url.pathname.replace(/@[^/]*(\/[^/]*)$/, `@${build}$1`);
  source.search = "";
  return source;
}

// The document was fetched from a commit URL, so its relative paths have to
// resolve there too; the page itself keeps the branch URL in the address bar.
function withCommitBase(bytes, source) {
  const text = new TextDecoder().decode(bytes);
  const head = /<head(\s[^>]*)?>/i;
  if (!head.test(text)) {
    return bytes;
  }
  const base = new URL("./", source).href;
  return new TextEncoder().encode(
    text.replace(head, (tag) => `${tag}<base href="${base}"/>`)
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  // Navigations only: these are the responses whose headers and content type
  // decide isolation and whether the frame is a document at all. A navigation
  // Request cannot be handed to `fetch()`, so the URL is fetched instead.
  if (request.method !== "GET" || request.mode !== "navigate") {
    return;
  }
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  const shell = SHELL_DOCUMENT.test(url.pathname);
  const player = !shell && PLAYER_DOCUMENT.test(url.pathname);
  if (!shell && !player) {
    return;
  }
  const requested = url.searchParams.get("build");
  const build = shell && requested !== null && COMMIT.test(requested) ? requested : null;
  const source = build ? commitDocument(url, build) : url;
  const headers = shell ? SHELL_HEADERS : PLAYER_HEADERS;
  const type = shell
    ? url.pathname.endsWith(".xml")
      ? "application/xml; charset=utf-8"
      : "image/svg+xml"
    : "text/html; charset=utf-8";
  event.respondWith(
    (async () => {
      const upstream = await fetch(source.href, {
        // A commit URL never changes, so it may be reused; the branch copy is
        // exactly what this handover exists to skip.
        cache: build ? "force-cache" : "no-store",
        credentials: "same-origin",
        redirect: "follow"
      });
      const response = new Headers(upstream.headers);
      // The body below is already decoded and re-wrapped, so framing headers
      // from the CDN (brotli/gzip and the length that described it) would make
      // the browser decode it twice.
      for (const name of ["content-encoding", "content-length", "transfer-encoding"]) {
        response.delete(name);
      }
      for (const name of Object.keys(headers)) {
        response.set(name, headers[name]);
      }
      response.set("content-type", type);
      const bytes = await upstream.arrayBuffer();
      return new Response(
        build && upstream.ok ? withCommitBase(bytes, source) : bytes,
        { status: upstream.status, headers: response }
      );
    })()
  );
});

// The vendored proxy worker installs its own listeners from here. Ours was
// registered first, so it sees each request before that one and only claims
// these two documents; everything else falls through untouched.
if (!ENTRY_ONLY) {
  importScripts(new URL("sw-runtime.js", self.location.href).href);
}
