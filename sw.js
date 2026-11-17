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
// The first visit is still unisolated (no worker is controlling it yet), so the
// document registers this worker and reloads itself once. See
// `scripts/build-preview-svg.mjs`.

const SHELL_DOCUMENT = /\/(?:index\.svg|index\.xml)$/;

const SHELL_HEADERS = {
  "cross-origin-opener-policy": "same-origin",
  // `credentialless` keeps Games/Music artwork loading from third parties
  // without CORP, which is the same pair `public/_headers` uses for the app.
  "cross-origin-embedder-policy": "credentialless",
  "cross-origin-resource-policy": "cross-origin",
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
  // Navigations only: the document is the one response whose headers decide
  // isolation. A navigation Request cannot be handed to `fetch()`, so the URL
  // is fetched instead.
  if (request.method !== "GET" || request.mode !== "navigate") {
    return;
  }
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (!SHELL_DOCUMENT.test(url.pathname)) {
    return;
  }
  const type = url.pathname.endsWith(".xml") ? "application/xml" : "image/svg+xml";
  event.respondWith(
    (async () => {
      const upstream = await fetch(url.href, {
        cache: "no-store",
        credentials: "same-origin",
        redirect: "follow"
      });
      const headers = new Headers(upstream.headers);
      for (const name of Object.keys(SHELL_HEADERS)) {
        headers.set(name, SHELL_HEADERS[name]);
      }
      headers.set("content-type", `${type}; charset=utf-8`);
      return new Response(await upstream.arrayBuffer(), {
        status: upstream.status,
        headers
      });
    })()
  );
});

// The vendored proxy worker installs its own listeners from here. Ours was
// registered first, so it sees each request before that one and only claims the
// document; everything else falls through untouched.
importScripts(new URL("sw-runtime.js", self.location.href).href);
