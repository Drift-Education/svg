const appRoot = new URL(".", self.location.href);
importScripts(
  new URL("runtime/e2b749.js", appRoot).href,
  new URL("runtime-2/a1.js", appRoot).href,
  new URL("runtime-2/e5.js", appRoot).href,
  new URL("runtime-2/d4.js", appRoot).href
);
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
    uv ??= new UVServiceWorker();
    event.respondWith(uv.fetch(event));
    return;
  }
  if ($scramjetController.shouldRoute(event)) {
    event.respondWith($scramjetController.route(event));
  }
});
