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
// The first visit is still unisolated (no worker is controlling it yet), so the
// document registers this worker and reloads itself once. See
// `scripts/build-preview-svg.mjs`.

const SHELL_DOCUMENT = /\/(?:index\.svg|index\.xml)$/;
const PLAYER_DOCUMENT = /\/webblox\/player\.html$/;

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
  const headers = shell ? SHELL_HEADERS : PLAYER_HEADERS;
  const type = shell
    ? url.pathname.endsWith(".xml")
      ? "application/xml; charset=utf-8"
      : "image/svg+xml"
    : "text/html; charset=utf-8";
  event.respondWith(
    (async () => {
      const upstream = await fetch(url.href, {
        cache: "no-store",
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
      return new Response(await upstream.arrayBuffer(), {
        status: upstream.status,
        headers: response
      });
    })()
  );
});

// The vendored proxy worker installs its own listeners from here. Ours was
// registered first, so it sees each request before that one and only claims
// these two documents; everything else falls through untouched.
importScripts(new URL("sw-runtime.js", self.location.href).href);
