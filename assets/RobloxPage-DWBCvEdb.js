import{bW as D,bX as q,r as m,j as y,ba as N}from"./index-D187aMI8.js";const S=["https://sciencekids.online/ronoxide","https://summarizebooks.site/ronoxide","https://educatecomputers.site/ronoxide","https://readingstudies.online/ronoxide","https://donutshop.vip/ronoxide"],H="drift.roblox.source.v1";function W(t){if(S.includes(t))try{if(typeof localStorage>"u")return;localStorage.setItem(H,t)}catch{}}const V=[["sec-fetch-dest","iframe"],["sec-fetch-mode","navigate"],["sec-fetch-site","cross-site"]],G=[["accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],["accept-language","en-US,en;q=0.9"],["cache-control","no-cache"],...V],E=new Map;function O(t,r){let n=E.get(t);n||(n=new Map,E.set(t,n));for(const[e,a]of r){if(e.toLowerCase()!=="set-cookie")continue;const o=a.split(";",1)[0]??"",c=o.indexOf("=");if(c<=0)continue;const l=o.slice(0,c).trim(),s=o.slice(c+1).trim();/;\s*max-age=0(?:\D|$)/i.test(a)?n.delete(l):n.set(l,s)}n.size===0&&E.delete(t)}function L(t,r){const n=E.get(r);return!n||n.size===0||t.some(([e])=>e.toLowerCase()==="cookie")?t:[...t,["cookie",Array.from(n,([e,a])=>`${e}=${a}`).join("; ")]]}async function K(t,r){const n=[t,...S.filter(o=>o!==t)],e=[];let a=!1;for(const o of n){const c=new URL(o).origin,l=()=>q(o,"GET",null,r,L(G,c));try{let s=await l();if(O(c,s.headers),(s.status===403||s.status===429||s.status>=500)&&!a&&!r.aborted&&(a=!0,await D(),r.aborted||(s=await l(),O(c,s.headers))),r.aborted)throw new DOMException("Aborted","AbortError");if(s.status<400&&s.text.trim()!=="")return W(o),{source:o,html:s.text};e.push(`${new URL(o).host}: ${s.status>=400?s.status:"empty page"}`)}catch(s){if(r.aborted)throw s;e.push(`${new URL(o).host}: ${s instanceof Error?s.message:"request failed"}`)}}throw new Error(`Ronoxide unavailable (${e.join(", ")}).`)}async function z(t,r,n){const e=new URL(t).origin,a=new URL(r.url);if(a.origin!==e)throw new Error("Sandbox request left the Ronoxide origin.");const o=r.method.toUpperCase(),c=o==="GET"||o==="HEAD"?null:r.body,l=await q(a.href,o,c,n,L(r.headers,a.origin));return O(a.origin,l.headers),l}function X(t){return t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function U(t){return`(function () {
  var token = ${JSON.stringify(t)};
  var nativeOpen = window.open;

  function memoryStorage() {
    var data = Object.create(null);
    return {
      getItem: function (key) {
        var value = data[String(key)];
        return value === undefined ? null : value;
      },
      setItem: function (key, value) {
        data[String(key)] = String(value);
      },
      removeItem: function (key) {
        delete data[String(key)];
      },
      clear: function () {
        data = Object.create(null);
      },
      key: function (index) {
        var keys = Object.keys(data);
        return index >= 0 && index < keys.length ? keys[index] : null;
      },
      get length() {
        return Object.keys(data).length;
      }
    };
  }

  // A sandbox without allow-same-origin has no storage. Keep a page that
  // expects the APIs from throwing before its launcher can render. Window
  // proxies can refuse an own-property definition, so also shadow the
  // prototype getter as a fallback.
  function installStorage(name) {
    var storage = memoryStorage();
    try {
      void window[name];
      return;
    } catch (_) {}
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        value: storage
      });
      return;
    } catch (_) {}
    try {
      Object.defineProperty(Window.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function () {
          return storage;
        },
        set: function () {}
      });
    } catch (_) {}
  }
  installStorage("localStorage");
  installStorage("sessionStorage");

  // Same-origin API calls are relayed through Drift. Native fetch would send
  // Origin: null from this opaque sandbox, which Ronoxide's API rejects.
  var nativeFetch = window.fetch;
  var pendingFetches = Object.create(null);
  var nextFetch = 0;
  var documentOrigin = new URL(document.baseURI).origin;
  var InputRequest = typeof Request === "function" ? Request : null;

  function headerList(headers) {
    var list = [];
    headers.forEach(function (value, key) {
      list.push([key, value]);
    });
    return list;
  }

  function bodyToText(body, headers) {
    if (body === undefined || body === null) {
      return Promise.resolve(null);
    }
    if (typeof body === "string") {
      return Promise.resolve(body);
    }
    if (typeof URLSearchParams === "function" && body instanceof URLSearchParams) {
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      }
      return Promise.resolve(body.toString());
    }
    if (typeof FormData === "function" && body instanceof FormData) {
      var params = new URLSearchParams();
      body.forEach(function (value, key) {
        if (typeof value === "string") {
          params.append(key, value);
        }
      });
      headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      return Promise.resolve(params.toString());
    }
    if (typeof Blob === "function" && body instanceof Blob) {
      if (!headers.has("content-type") && body.type) {
        headers.set("content-type", body.type);
      }
      return body.text();
    }
    if (typeof ArrayBuffer === "function" && body instanceof ArrayBuffer) {
      return Promise.resolve(new TextDecoder().decode(body));
    }
    if (typeof ArrayBuffer === "function" && ArrayBuffer.isView(body)) {
      return Promise.resolve(new TextDecoder().decode(body));
    }
    return Promise.resolve(String(body));
  }

  function requestBody(input, init, headers) {
    if (init && Object.prototype.hasOwnProperty.call(init, "body")) {
      return bodyToText(init.body, headers);
    }
    if (InputRequest && input instanceof InputRequest) {
      try {
        return input.clone().text();
      } catch (_) {
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }

  window.addEventListener("message", function (event) {
    if (event.source !== parent) {
      return;
    }
    var data = event.data;
    if (
      !data ||
      typeof data !== "object" ||
      data.type !== "drift:sandbox-fetch-response" ||
      data.token !== token
    ) {
      return;
    }
    var request = pendingFetches[data.id];
    if (!request) {
      return;
    }
    delete pendingFetches[data.id];
    window.clearTimeout(request.timer);
    if (data.error) {
      request.reject(new TypeError(String(data.error)));
      return;
    }
    var responseHeaders = new Headers();
    if (Array.isArray(data.headers)) {
      data.headers.forEach(function (pair) {
        if (!Array.isArray(pair) || pair.length < 2) {
          return;
        }
        var name = String(pair[0]).toLowerCase();
        if (name === "set-cookie" || name === "set-cookie2") {
          return;
        }
        try {
          responseHeaders.append(String(pair[0]), String(pair[1]));
        } catch (_) {}
      });
    }
    var status = typeof data.status === "number" ? data.status : 502;
    var noBody = status === 204 || status === 205 || status === 304;
    try {
      request.resolve(
        new Response(noBody ? null : String(data.text || ""), {
          status: status,
          headers: responseHeaders
        })
      );
    } catch (_) {
      request.reject(new TypeError("Sandbox request failed."));
    }
  });

  var wrappedFetch = function (input, init) {
    var request = InputRequest && input instanceof InputRequest ? input : null;
    var target;
    try {
      target = new URL(request ? request.url : String(input), document.baseURI);
    } catch (_) {
      return nativeFetch.apply(this, arguments);
    }
    if (target.origin !== documentOrigin) {
      return nativeFetch.apply(this, arguments);
    }
    var headers = new Headers(request ? request.headers : undefined);
    if (init && init.headers) {
      new Headers(init.headers).forEach(function (value, key) {
        headers.set(key, value);
      });
    }
    var method = String((init && init.method) || (request ? request.method : "GET")).toUpperCase();
    return requestBody(input, init, headers).then(function (body) {
      return new Promise(function (resolve, reject) {
        var id = String(++nextFetch);
        var timer = window.setTimeout(function () {
          delete pendingFetches[id];
          reject(new TypeError("Sandbox request timed out."));
        }, 30000);
        pendingFetches[id] = { resolve: resolve, reject: reject, timer: timer };
        try {
          parent.postMessage(
            {
              type: "drift:sandbox-fetch",
              token: token,
              id: id,
              url: target.href,
              method: method,
              headers: headerList(headers),
              body: body
            },
            "*"
          );
        } catch (error) {
          delete pendingFetches[id];
          window.clearTimeout(timer);
          reject(error);
        }
      });
    });
  };

  if (typeof nativeFetch === "function") {
    try {
      Object.defineProperty(window, "fetch", {
        configurable: true,
        writable: true,
        value: wrappedFetch
      });
    } catch (_) {
      try {
        window.fetch = wrappedFetch;
      } catch (_) {}
    }
  }

  function destinationFor(value) {
    if (value === undefined || value === null) {
      return null;
    }
    var raw = typeof value === "string" ? value : String(value);
    if (raw === "" || raw === "about:blank") {
      return null;
    }
    try {
      var parsed = new URL(raw, document.baseURI);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
    } catch (_) {
      return null;
    }
  }

  var wrapped = function (url, target, features) {
    var name = typeof target === "string" ? target : "";
    if (name === "_self" || name === "_parent" || name === "_top" || name === "_unfencedTop") {
      return nativeOpen.apply(this, arguments);
    }
    var destination = destinationFor(url);
    if (destination !== null) {
      try {
        parent.postMessage({ type: "drift:sandbox-open", token: token, url: destination }, "*");
        return null;
      } catch (_) {
        // Let the sandbox block the native popup if the parent is unavailable.
      }
    }
    return nativeOpen.apply(this, arguments);
  };

  try {
    Object.defineProperty(window, "open", {
      configurable: true,
      writable: true,
      value: wrapped
    });
  } catch (_) {
    try {
      window.open = wrapped;
    } catch (_) {}
  }
})();`}function J(t,r,n){if(typeof DOMParser>"u")return null;try{const e=new DOMParser().parseFromString(r,"text/html"),a=e.head;if(!a)return null;let o=e.querySelector("script[nonce]")?.getAttribute("nonce")??null;for(const s of Array.from(e.querySelectorAll("meta[http-equiv]"))){const k=(s.getAttribute("http-equiv")??"").trim().toLowerCase();k!=="content-security-policy"&&k!=="content-security-policy-report-only"||(o===null&&(o=/'nonce-([^']+)'/.exec(s.getAttribute("content")??"")?.[1]??null),s.remove())}const c=e.createElement("base");c.setAttribute("href",t);const l=e.createElement("script");return l.textContent=U(n),o!==null&&l.setAttribute("nonce",o),l.setAttribute("style","display:none !important"),a.insertBefore(l,a.firstChild),a.insertBefore(c,a.firstChild),`<!doctype html>${e.documentElement.outerHTML}`}catch{return null}}function Y(t,r,n){const e=J(t,r,n);if(e!==null)return e;const a=`<base href="${X(t)}">${U(n)}`,o=/<html\b[^>]*>/i.exec(r),c=o?o.index+o[0].length:0;return`${r.slice(0,c)}${a}${r.slice(c)}`}const Q=6e3,Z=12e3,ee=3e4,te=15e3,C="rblx2016/ronoxide_logo.png",_=[137,80,78,71,13,10,26,10],re=[["accept","image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"],["cache-control","no-cache"]],ne="allow-scripts allow-forms allow-modals allow-pointer-lock allow-downloads allow-orientation-lock allow-presentation",oe="autoplay; fullscreen; gamepad; clipboard-write; cross-origin-isolated";function ae(){const t=new Uint8Array(16);if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function")crypto.getRandomValues(t);else for(let r=0;r<t.length;r+=1)t[r]=Math.floor(Math.random()*256);return Array.from(t,r=>r.toString(16).padStart(2,"0")).join("")}function ie(t){return t.length>=_.length&&_.every((r,n)=>t[n]===r)}function F(t,r){return new Promise(n=>{const e=new Image;let a=!1;const o=window.setTimeout(()=>c(!1),Q);function c(s){a||(a=!0,window.clearTimeout(o),r.removeEventListener("abort",l),e.onload=null,e.onerror=null,s||(e.src=""),n(s))}function l(){c(!1)}if(r.aborted){c(!1);return}r.addEventListener("abort",l,{once:!0}),e.onload=()=>c(e.naturalWidth>0),e.onerror=()=>c(!1),e.src=`${t}/${C}?probe=${Date.now()}`})}async function $(t,r){const n=new AbortController,e=()=>n.abort();if(r.aborted)return!1;r.addEventListener("abort",e,{once:!0});const a=window.setTimeout(()=>n.abort(),Z);try{const o=await N(`${t}/${C}?probe=${Date.now()}`,n.signal,re);return o.status<400&&ie(o.bytes)}catch{return!1}finally{window.clearTimeout(a),r.removeEventListener("abort",e)}}async function R(t,r=null){const n=S.filter(a=>a!==r);return(await Promise.all(n.map(async a=>({source:a,works:await F(a,t)})))).find(a=>a.works)?.source??null}async function T(t,r){const n=await Promise.all(S.map(async e=>({source:e,works:await $(e,t)})));for(const e of n){if(!e.works||t.aborted)continue;const a=new AbortController,o=()=>a.abort();t.addEventListener("abort",o,{once:!0});const c=window.setTimeout(()=>a.abort(),ee);try{const l=await K(e.source,a.signal);return{kind:"wisp",source:l.source,html:Y(l.source,l.html,r)}}catch{}finally{window.clearTimeout(c),t.removeEventListener("abort",o)}}return null}function ce({onOpenWindow:t}){const r=m.useRef(null),[n,e]=m.useState(null),[a,o]=m.useState(null),[c,l]=m.useState(0),[s,k]=m.useState(null),[j,I]=m.useState(0),[b]=m.useState(()=>ae());m.useEffect(()=>{const i=new AbortController;let d=!1,v=0;function h(p){v=window.setTimeout(()=>{f(p)},te)}function w(){d||(e(null),o("Every Roblox launcher is blocked or unavailable."))}async function f(p){if(d)return;if(p.kind==="direct"){if(await F(p.source,i.signal)){d||h(p);return}const x=await R(i.signal,p.source);if(d)return;if(x!==null){const P={kind:"direct",source:x};e(P),h(P);return}const A=await T(i.signal,b);if(d)return;if(A!==null){e(A),h(A);return}w();return}const u=await R(i.signal);if(d)return;if(u!==null){const x={kind:"direct",source:u};e(x),h(x);return}if(await $(p.source,i.signal)){d||h(p);return}const g=await T(i.signal,b);if(!d){if(g!==null){e(g),h(g);return}w()}}if(s!==null){const p={kind:"direct",source:s};e(p),o(null),h(p)}else(async()=>{const p=await R(i.signal);if(d)return;if(p!==null){const g={kind:"direct",source:p};e(g),o(null),h(g);return}const u=await T(i.signal,b);if(!d){if(u!==null){e(u),o(null),h(u);return}w()}})();return()=>{d=!0,i.abort(),window.clearTimeout(v)}},[c,b,s,j]),m.useEffect(()=>{const i=r.current;if(!(!i||n===null))return i.setAttribute("credentialless",""),n.kind==="direct"?(i.removeAttribute("srcdoc"),i.removeAttribute("sandbox"),i.src=n.source):(i.removeAttribute("src"),i.setAttribute("sandbox",ne),i.srcdoc=n.html),()=>{i.removeAttribute("src"),i.removeAttribute("srcdoc"),i.removeAttribute("sandbox"),i.removeAttribute("credentialless")}},[n]),m.useEffect(()=>{if(n?.kind!=="wisp")return;const i=n.source,d=new AbortController,v=h=>{if(h.source!==r.current?.contentWindow)return;const w=h.data;if(typeof w!="object"||w===null)return;const f=w;if(f.token!==b)return;if(f.type==="drift:sandbox-open"&&typeof f.url=="string"){let u;try{u=new URL(f.url)}catch{return}if(u.protocol!=="http:"&&u.protocol!=="https:")return;t?.(u.href);return}if(f.type!=="drift:sandbox-fetch"||typeof f.id!="string"||typeof f.url!="string")return;const p=[];if(Array.isArray(f.headers))for(const u of f.headers)Array.isArray(u)&&u.length>=2&&typeof u[0]=="string"&&typeof u[1]=="string"&&p.push([u[0],u[1]]);z(i,{url:f.url,method:typeof f.method=="string"?f.method:"GET",headers:p,body:typeof f.body=="string"?f.body:null},d.signal).then(u=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:b,id:f.id,status:u.status,headers:u.headers,text:u.text},"*")}).catch(u=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:b,id:f.id,error:u instanceof Error?u.message:"Sandbox request failed."},"*")})};return window.addEventListener("message",v),()=>{d.abort(),window.removeEventListener("message",v)}},[n,b,t]);const M=n?.source??s;function B(i){o(null),e({kind:"direct",source:i}),k(i),I(d=>d+1)}return y.jsxs("div",{className:"roblox",children:[y.jsx("div",{className:"roblox-sources",role:"group","aria-label":"Roblox sources",children:S.map((i,d)=>y.jsxs("button",{className:"roblox-source",type:"button",title:i,"aria-pressed":M===i,onClick:()=>B(i),children:["Source ",d+1]},i))}),y.jsx("div",{className:"roblox-stage",children:a!==null?y.jsxs("div",{className:"roblox-blocked",role:"alert",children:[y.jsx("p",{children:a}),y.jsx("button",{className:"roblox-retry",type:"button",onClick:()=>{o(null),e(null),l(i=>i+1)},children:"Try again"})]}):n===null?y.jsx("p",{className:"roblox-status",role:"status",children:"Finding a working Roblox link…"}):y.jsx("iframe",{ref:r,className:"roblox-frame",title:"Roblox",allow:oe},`${n.kind}-${n.source}-${j}`)})]})}export{ce as RobloxPage};
