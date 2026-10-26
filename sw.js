const appRoot = new URL(".", self.location.href);
importScripts(
  new URL("runtime/e2b749.js", appRoot).href,
  new URL("runtime-2/a1.js", appRoot).href,
  new URL("runtime-2/e5.js", appRoot).href,
  new URL("runtime-2/d4.js", appRoot).href
);
const uv = new UVServiceWorker();

addEventListener("fetch", (event) => {
  if (new URL(event.request.url).pathname.startsWith(new URL("runtime-3/", appRoot).pathname)) {
    return;
  }
  if (uv.route(event)) {
    event.respondWith(uv.fetch(event));
    return;
  }
  if ($scramjetController.shouldRoute(event)) {
    event.respondWith($scramjetController.route(event));
  }
});
