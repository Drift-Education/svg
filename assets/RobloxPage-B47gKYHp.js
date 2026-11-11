import{bN as C,bO as _,r as y,j as w,a_ as F}from"./index-DdBdqcEU.js";const S=["https://sciencekids.online/ronoxide","https://summarizebooks.site/ronoxide","https://educatecomputers.site/ronoxide","https://readingstudies.online/ronoxide","https://donutshop.vip/ronoxide"],I="drift.roblox.source.v1";function M(t){if(S.includes(t))try{if(typeof localStorage>"u")return;localStorage.setItem(I,t)}catch{}}const B=[["sec-fetch-dest","iframe"],["sec-fetch-mode","navigate"],["sec-fetch-site","cross-site"]],D=[["accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],["accept-language","en-US,en;q=0.9"],["cache-control","no-cache"],...B],x=new Map;function R(t,r){let n=x.get(t);n||(n=new Map,x.set(t,n));for(const[e,o]of r){if(e.toLowerCase()!=="set-cookie")continue;const a=o.split(";",1)[0]??"",c=a.indexOf("=");if(c<=0)continue;const l=a.slice(0,c).trim(),i=a.slice(c+1).trim();/;\s*max-age=0(?:\D|$)/i.test(o)?n.delete(l):n.set(l,i)}n.size===0&&x.delete(t)}function q(t,r){const n=x.get(r);return!n||n.size===0||t.some(([e])=>e.toLowerCase()==="cookie")?t:[...t,["cookie",Array.from(n,([e,o])=>`${e}=${o}`).join("; ")]]}async function $(t,r){const n=[t,...S.filter(a=>a!==t)],e=[];let o=!1;for(const a of n){const c=new URL(a).origin,l=()=>_(a,"GET",null,r,q(D,c));try{let i=await l();if(R(c,i.headers),(i.status===403||i.status===429||i.status>=500)&&!o&&!r.aborted&&(o=!0,await C(),r.aborted||(i=await l(),R(c,i.headers))),r.aborted)throw new DOMException("Aborted","AbortError");if(i.status<400&&i.text.trim()!=="")return M(a),{source:a,html:i.text};e.push(`${new URL(a).host}: ${i.status>=400?i.status:"empty page"}`)}catch(i){if(r.aborted)throw i;e.push(`${new URL(a).host}: ${i instanceof Error?i.message:"request failed"}`)}}throw new Error(`Ronoxide unavailable (${e.join(", ")}).`)}async function N(t,r,n){const e=new URL(t).origin,o=new URL(r.url);if(o.origin!==e)throw new Error("Sandbox request left the Ronoxide origin.");const a=r.method.toUpperCase(),c=a==="GET"||a==="HEAD"?null:r.body,l=await _(o.href,a,c,n,q(r.headers,o.origin));return R(o.origin,l.headers),l}function H(t){return t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function P(t){return`(function () {
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
})();`}function W(t,r,n){if(typeof DOMParser>"u")return null;try{const e=new DOMParser().parseFromString(r,"text/html"),o=e.head;if(!o)return null;let a=e.querySelector("script[nonce]")?.getAttribute("nonce")??null;for(const i of Array.from(e.querySelectorAll("meta[http-equiv]"))){const s=(i.getAttribute("http-equiv")??"").trim().toLowerCase();s!=="content-security-policy"&&s!=="content-security-policy-report-only"||(a===null&&(a=/'nonce-([^']+)'/.exec(i.getAttribute("content")??"")?.[1]??null),i.remove())}const c=e.createElement("base");c.setAttribute("href",t);const l=e.createElement("script");return l.textContent=P(n),a!==null&&l.setAttribute("nonce",a),l.setAttribute("style","display:none !important"),o.insertBefore(l,o.firstChild),o.insertBefore(c,o.firstChild),`<!doctype html>${e.documentElement.outerHTML}`}catch{return null}}function V(t,r,n){const e=W(t,r,n);if(e!==null)return e;const o=`<base href="${H(t)}">${P(n)}`,a=/<html\b[^>]*>/i.exec(r),c=a?a.index+a[0].length:0;return`${r.slice(0,c)}${o}${r.slice(c)}`}const G=6e3,K=12e3,z=3e4,X=15e3,j="rblx2016/ronoxide_logo.png",O=[137,80,78,71,13,10,26,10],J=[["accept","image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"],["cache-control","no-cache"]],Y="allow-scripts allow-forms allow-modals allow-pointer-lock allow-downloads allow-orientation-lock allow-presentation",Q="autoplay; fullscreen; gamepad; clipboard-write; cross-origin-isolated";function Z(){const t=new Uint8Array(16);if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function")crypto.getRandomValues(t);else for(let r=0;r<t.length;r+=1)t[r]=Math.floor(Math.random()*256);return Array.from(t,r=>r.toString(16).padStart(2,"0")).join("")}function ee(t){return t.length>=O.length&&O.every((r,n)=>t[n]===r)}function L(t,r){return new Promise(n=>{const e=new Image;let o=!1;const a=window.setTimeout(()=>c(!1),G);function c(i){o||(o=!0,window.clearTimeout(a),r.removeEventListener("abort",l),e.onload=null,e.onerror=null,i||(e.src=""),n(i))}function l(){c(!1)}if(r.aborted){c(!1);return}r.addEventListener("abort",l,{once:!0}),e.onload=()=>c(e.naturalWidth>0),e.onerror=()=>c(!1),e.src=`${t}/${j}?probe=${Date.now()}`})}async function U(t,r){const n=new AbortController,e=()=>n.abort();if(r.aborted)return!1;r.addEventListener("abort",e,{once:!0});const o=window.setTimeout(()=>n.abort(),K);try{const a=await F(`${t}/${j}?probe=${Date.now()}`,n.signal,J);return a.status<400&&ee(a.bytes)}catch{return!1}finally{window.clearTimeout(o),r.removeEventListener("abort",e)}}async function k(t,r=null){const n=S.filter(o=>o!==r);return(await Promise.all(n.map(async o=>({source:o,works:await L(o,t)})))).find(o=>o.works)?.source??null}async function A(t,r){const n=await Promise.all(S.map(async e=>({source:e,works:await U(e,t)})));for(const e of n){if(!e.works||t.aborted)continue;const o=new AbortController,a=()=>o.abort();t.addEventListener("abort",a,{once:!0});const c=window.setTimeout(()=>o.abort(),z);try{const l=await $(e.source,o.signal);return{kind:"wisp",source:l.source,html:V(l.source,l.html,r)}}catch{}finally{window.clearTimeout(c),t.removeEventListener("abort",a)}}return null}function re({onOpenWindow:t}){const r=y.useRef(null),[n,e]=y.useState(null),[o,a]=y.useState(null),[c,l]=y.useState(0),[i]=y.useState(()=>Z());return y.useEffect(()=>{const s=new AbortController;let f=!1,g=0;function h(p){g=window.setTimeout(()=>{d(p)},X)}function m(){f||(e(null),a("Every Roblox launcher is blocked or unavailable."))}async function d(p){if(f)return;if(p.kind==="direct"){if(await L(p.source,s.signal)){f||h(p);return}const v=await k(s.signal,p.source);if(f)return;if(v!==null){const T={kind:"direct",source:v};e(T),h(T);return}const E=await A(s.signal,i);if(f)return;if(E!==null){e(E),h(E);return}m();return}const u=await k(s.signal);if(f)return;if(u!==null){const v={kind:"direct",source:u};e(v),h(v);return}if(await U(p.source,s.signal)){f||h(p);return}const b=await A(s.signal,i);if(!f){if(b!==null){e(b),h(b);return}m()}}return(async()=>{const p=await k(s.signal);if(f)return;if(p!==null){const b={kind:"direct",source:p};e(b),a(null),h(b);return}const u=await A(s.signal,i);if(!f){if(u!==null){e(u),a(null),h(u);return}m()}})(),()=>{f=!0,s.abort(),window.clearTimeout(g)}},[c,i]),y.useEffect(()=>{const s=r.current;if(!(!s||n===null))return s.setAttribute("credentialless",""),n.kind==="direct"?(s.removeAttribute("srcdoc"),s.removeAttribute("sandbox"),s.src=n.source):(s.removeAttribute("src"),s.setAttribute("sandbox",Y),s.srcdoc=n.html),()=>{s.removeAttribute("src"),s.removeAttribute("srcdoc"),s.removeAttribute("sandbox"),s.removeAttribute("credentialless")}},[n]),y.useEffect(()=>{if(n?.kind!=="wisp")return;const s=n.source,f=new AbortController,g=h=>{if(h.source!==r.current?.contentWindow)return;const m=h.data;if(typeof m!="object"||m===null)return;const d=m;if(d.token!==i)return;if(d.type==="drift:sandbox-open"&&typeof d.url=="string"){let u;try{u=new URL(d.url)}catch{return}if(u.protocol!=="http:"&&u.protocol!=="https:")return;t?.(u.href);return}if(d.type!=="drift:sandbox-fetch"||typeof d.id!="string"||typeof d.url!="string")return;const p=[];if(Array.isArray(d.headers))for(const u of d.headers)Array.isArray(u)&&u.length>=2&&typeof u[0]=="string"&&typeof u[1]=="string"&&p.push([u[0],u[1]]);N(s,{url:d.url,method:typeof d.method=="string"?d.method:"GET",headers:p,body:typeof d.body=="string"?d.body:null},f.signal).then(u=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:i,id:d.id,status:u.status,headers:u.headers,text:u.text},"*")}).catch(u=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:i,id:d.id,error:u instanceof Error?u.message:"Sandbox request failed."},"*")})};return window.addEventListener("message",g),()=>{f.abort(),window.removeEventListener("message",g)}},[n,i,t]),w.jsx("div",{className:"roblox",children:o!==null?w.jsxs("div",{className:"roblox-blocked",role:"alert",children:[w.jsx("p",{children:o}),w.jsx("button",{className:"roblox-retry",type:"button",onClick:()=>{a(null),e(null),l(s=>s+1)},children:"Try again"})]}):n===null?w.jsx("p",{className:"roblox-status",role:"status",children:"Finding a working Roblox link…"}):w.jsx("iframe",{ref:r,className:"roblox-frame",title:"Roblox",allow:Q})})}export{re as RobloxPage};
