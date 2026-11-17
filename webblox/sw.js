self.__webbloxEngineBase = "https://setup.rbxcdn.com/webclient/version-f807b21caba84809-RobloxWebClient";
// Service worker for the Webblox player (scope: /webblox/).
//
// Two kinds of request arrive here:
//
// 1. The Roblox engine fetches *.roblox.com and *.rbxcdn.com itself. The browser
//    would block those for lack of CORS, so every such request is handed to the
//    player page, which performs it over Drift's relayed transport and returns
//    the bytes.
// 2. The engine itself is not shipped with Drift. `self.__webbloxEngineBase`
//    names Roblox's own webclient upload, and requests under /webblox/engine/
//    are relayed there the same way, so a filtered network never has to reach
//    setup.rbxcdn.com directly.
//
// Responses are rebuilt here with the CORS/CORP headers the engine needs,
// including the exposure of x-csrf-token.

const BRIDGE_TIMEOUT_MS = 120000;
const BRIDGE_HOST = /(^|\.)roblox\.com$|(^|\.)rbxcdn\.com$/;
const ENGINE_MARKER = "/webblox/engine/";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function pageOrigin(client) {
  try {
    return new URL(client.url).origin;
  } catch {
    return "*";
  }
}

function corsHeaders(origin, requestedHeaders) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": requestedHeaders || "*",
    "Access-Control-Expose-Headers": "x-csrf-token, x-ratelimit-*, *",
    "Access-Control-Max-Age": "600",
    "Cross-Origin-Resource-Policy": "cross-origin"
  };
}

async function pickClient(event) {
  if (event.clientId) {
    const client = await self.clients.get(event.clientId);
    // The engine also fetches from its dedicated worker. That request's client is
    // the worker, which cannot answer the bridge, so only a player window may
    // relay it; otherwise the join would be posted to a listener that never
    // exists and the engine would wait forever for a server.
    if (client !== null && client.type === "window") {
      return client;
    }
  }
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  return clients.find((client) => client.url.includes("/webblox/")) ?? clients[0] ?? null;
}

/**
 * Maps a same-origin engine request onto Roblox's upload, keeping the path the
 * engine's metadata lists. Returns null when this build relays nothing, which is
 * how dev and preview serve the vendored copy from disk instead.
 */
function engineTarget(url) {
  const base = typeof self.__webbloxEngineBase === "string" ? self.__webbloxEngineBase : "";
  if (base === "") {
    return null;
  }
  const index = url.pathname.indexOf(ENGINE_MARKER);
  if (index === -1) {
    return null;
  }
  const rest = url.pathname.slice(index + ENGINE_MARKER.length);
  if (rest === "" || rest.includes("..")) {
    return null;
  }
  const lower = rest.toLowerCase();
  const type = lower.endsWith(".wasm")
    ? "application/wasm"
    : lower.endsWith(".json")
      ? "application/json"
      : lower.endsWith(".js")
        ? "text/javascript; charset=utf-8"
        : "";
  // WebClient.js runs both as a page script and as the engine worker, so it
  // needs the worker-only transport shim the build used to write into the
  // vendored copy.
  return { url: `${base}/${rest}`, type, script: rest === "WebClient.js" };
}

function engineScriptPreamble() {
  const relayBase = typeof self.__webbloxRelayBase === "string" ? self.__webbloxRelayBase : "";
  const relayToken = typeof self.__webbloxRelayToken === "string" ? self.__webbloxRelayToken : "";
  let head = "";
  if (relayBase !== "") {
    head += `self.__webbloxRelayBase = ${JSON.stringify(relayBase)};`;
    if (relayToken !== "") {
      head += ` self.__webbloxRelayToken = ${JSON.stringify(relayToken)};`;
    }
  }
  return (
    head +
    'if (typeof importScripts === "function") { try { importScripts("../ws-transport.js"); } catch (error) { console.error("[webblox] transport shim failed", error); } }\n'
  );
}

async function relay(event, client, engine) {
  const request = event.request;
  const origin = pageOrigin(client);
  const requested = request.headers.get("access-control-request-headers");

  // Answer preflights locally: the real request would only reach the engine's own
  // headers, and Roblox never sees this origin anyway.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin, requested) });
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? null : await request.arrayBuffer();
  const id = crypto.randomUUID();
  const channel = new MessageChannel();
  const reply = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("relay timeout")), BRIDGE_TIMEOUT_MS);
    channel.port1.onmessage = (message) => {
      clearTimeout(timer);
      resolve(message.data);
    };
  });

  const transfer = [channel.port2];
  if (body !== null) {
    transfer.push(body);
  }
  client.postMessage(
    {
      type: "webblox-fetch",
      id,
      url: engine === null || engine === undefined ? request.url : engine.url,
      method: request.method,
      headers: [...request.headers],
      body
    },
    transfer
  );

  let answer;
  try {
    answer = await reply;
  } catch (error) {
    return new Response(String(error instanceof Error ? error.message : "relay timeout"), {
      status: 504,
      headers: corsHeaders(origin, requested)
    });
  }
  if (!answer || answer.error) {
    return new Response(String(answer?.error ?? "empty relay answer"), {
      status: 502,
      headers: corsHeaders(origin, requested)
    });
  }

  let payload = answer.body ?? null;
  if (engine?.script === true) {
    const source =
      payload === null ? "" : new TextDecoder().decode(new Uint8Array(payload));
    payload = new TextEncoder().encode(engineScriptPreamble() + source);
  }

  const headers = new Headers(corsHeaders(origin, requested));
  if (engine !== null && engine !== undefined && engine.type !== "") {
    headers.set("Content-Type", engine.type);
  }
  for (const [name, value] of answer.headers ?? []) {
    const lower = name.toLowerCase();
    // The browser must not see the relayed framing headers: the body it receives
    // is already decoded and complete. A reused engine script needs the content
    // type the target declared above, not the CDN's.
    if (
      lower === "content-encoding" ||
      lower === "content-length" ||
      lower === "transfer-encoding" ||
      (engine !== null && engine !== undefined && lower === "content-type")
    ) {
      continue;
    }
    if (lower.startsWith("access-control-")) {
      continue;
    }
    try {
      headers.append(name, value);
    } catch {
      // Unrepresentable header from the origin; the response still works without it.
    }
  }
  return new Response(payload, { status: answer.status, headers });
}

const PLAYER_DOCUMENT = "player.html";
const DOCUMENT_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-resource-policy": "same-origin",
  "cache-control": "no-store"
};

/**
 * The player is a top-level document, so it needs COOP `same-origin` and COEP
 * `require-corp` on its own response, plus an HTML content type. A plain static
 * host sends no such headers, and a CDN mirror types `.html` as `text/plain`
 * (jsDelivr does both). This worker owns the folder and Drift registers it
 * before the window opens, so it answers the document itself; every other file
 * in the folder still comes from the host.
 */
function servePlayerDocument(event) {
  const request = event.request;
  if (request.method !== "GET") {
    return false;
  }
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return false;
  }
  let document;
  try {
    const scope = self.registration && self.registration.scope;
    document = new URL(PLAYER_DOCUMENT, scope || self.location.href);
  } catch {
    return false;
  }
  if (url.origin !== document.origin || url.pathname !== document.pathname) {
    return false;
  }
  event.respondWith(
    (async () => {
      let response;
      try {
        // Service-worker fetches skip this handler, so this reads the host's own
        // copy without looping. The query string carries `placeId`.
        response = await fetch(url.href, { cache: "no-store", redirect: "follow" });
      } catch (error) {
        return new Response(`webblox: the player document is unavailable (${String(error)})`, {
          status: 502,
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
        });
      }
      const body = await response.text();
      return new Response(body, { status: response.status, headers: DOCUMENT_HEADERS });
    })()
  );
  return true;
}

self.addEventListener("fetch", (event) => {
  // The document is neither proxied nor bridged; it only needs the headers above.
  if (servePlayerDocument(event)) {
    return;
  }
  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }
  const engine = engineTarget(url);
  if (engine === null && !BRIDGE_HOST.test(url.hostname)) {
    return;
  }
  event.respondWith(
    (async () => {
      const client = await pickClient(event);
      if (!client) {
        return new Response("webblox: no player page to relay through", { status: 502 });
      }
      return relay(event, client, engine);
    })()
  );
});
