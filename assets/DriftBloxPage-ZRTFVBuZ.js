import{c0 as Qe,c1 as H,ba as be,c2 as et,bq as Ne,r as f,j as s,c3 as tt,c4 as Ie,c5 as ke,c6 as Re,c7 as nt,c8 as rt,c9 as st,ca as ot,cb as at}from"./index-CK9pI5UC.js";import"./robloxJoin-Cax9Mxc7.js";const G=["https://sciencekids.online/ronoxide","https://summarizebooks.site/ronoxide","https://educatecomputers.site/ronoxide","https://readingstudies.online/ronoxide","https://donutshop.vip/ronoxide"],it="drift.roblox.source.v1";function ct(e){if(G.includes(e))try{if(typeof localStorage>"u")return;localStorage.setItem(it,e)}catch{}}const ye="https://www.roblox.com/signin",lt="https://play.roblox.com/games/start";function ut(e){const t=e.trim();return/^\d{1,20}$/.test(t)?`${lt}?placeId=${t}`:null}const dt=[["sec-fetch-dest","iframe"],["sec-fetch-mode","navigate"],["sec-fetch-site","cross-site"]],ft=[["accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],["accept-language","en-US,en;q=0.9"],["cache-control","no-cache"],...dt],z=new Map;function re(e,t){let n=z.get(e);n||(n=new Map,z.set(e,n));for(const[r,o]of t){if(r.toLowerCase()!=="set-cookie")continue;const a=o.split(";",1)[0]??"",i=a.indexOf("=");if(i<=0)continue;const c=a.slice(0,i).trim(),u=a.slice(i+1).trim();/;\s*max-age=0(?:\D|$)/i.test(o)?n.delete(c):n.set(c,u)}n.size===0&&z.delete(e)}function Ee(e,t){const n=z.get(t);return!n||n.size===0||e.some(([r])=>r.toLowerCase()==="cookie")?e:[...e,["cookie",Array.from(n,([r,o])=>`${r}=${o}`).join("; ")]]}async function pt(e,t){const n=[e,...G.filter(a=>a!==e)],r=[];let o=!1;for(const a of n){const i=new URL(a).origin,c=()=>H(a,"GET",null,t,Ee(ft,i));try{let u=await c();if(re(i,u.headers),(u.status===403||u.status===429||u.status>=500)&&!o&&!t.aborted&&(o=!0,await Qe(),t.aborted||(u=await c(),re(i,u.headers))),t.aborted)throw new DOMException("Aborted","AbortError");if(u.status<400&&u.text.trim()!=="")return ct(a),{source:a,html:u.text};r.push(`${new URL(a).host}: ${u.status>=400?u.status:"empty page"}`)}catch(u){if(t.aborted)throw u;r.push(`${new URL(a).host}: ${u instanceof Error?u.message:"request failed"}`)}}throw new Error(`Ronoxide unavailable (${r.join(", ")}).`)}async function mt(e,t,n){const r=new URL(e).origin,o=new URL(t.url);if(o.origin!==r)throw new Error("Sandbox request left the Ronoxide origin.");const a=t.method.toUpperCase(),i=a==="GET"||a==="HEAD"?null:t.body,c=await H(o.href,a,i,n,Ee(t.headers,o.origin));return re(o.origin,c.headers),c}function ht(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function Ae(e){return`(function () {
  var token = ${JSON.stringify(e)};
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
})();`}function bt(e,t,n){if(typeof DOMParser>"u")return null;try{const r=new DOMParser().parseFromString(t,"text/html"),o=r.head;if(!o)return null;let a=r.querySelector("script[nonce]")?.getAttribute("nonce")??null;for(const u of Array.from(r.querySelectorAll("meta[http-equiv]"))){const y=(u.getAttribute("http-equiv")??"").trim().toLowerCase();y!=="content-security-policy"&&y!=="content-security-policy-report-only"||(a===null&&(a=/'nonce-([^']+)'/.exec(u.getAttribute("content")??"")?.[1]??null),u.remove())}const i=r.createElement("base");i.setAttribute("href",e);const c=r.createElement("script");return c.textContent=Ae(n),a!==null&&c.setAttribute("nonce",a),c.setAttribute("style","display:none !important"),o.insertBefore(c,o.firstChild),o.insertBefore(i,o.firstChild),`<!doctype html>${r.documentElement.outerHTML}`}catch{return null}}function yt(e,t,n){const r=bt(e,t,n);if(r!==null)return r;const o=`<base href="${ht(e)}">${Ae(n)}`,a=/<html\b[^>]*>/i.exec(t),i=a?a.index+a[0].length:0;return`${t.slice(0,i)}${o}${t.slice(i)}`}const Ce="drift.roblox.places.v1",Le=12,Te=100;function gt(e){const t=e.trim();if(!/^\d{1,20}$/.test(t))return null;const n=Number(t);return Number.isSafeInteger(n)&&n>0?n:null}function x(e){return typeof e=="number"&&Number.isFinite(e)&&e>0?Math.floor(e):0}function xt(e){return`https://apis.roblox.com/explore-api/v1/get-sorts?sessionId=${encodeURIComponent(e)}`}function wt(e,t){return`https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(e)}&sessionId=${encodeURIComponent(t)}&pageToken=`}function vt(e){const t=e.filter(n=>Number.isSafeInteger(n)&&n>0);return t.length===0?null:`https://thumbnails.roblox.com/v1/games/icons?universeIds=${t.join(",")}&size=150x150&format=Webp`}function jt(e){const t=e.filter(n=>Number.isSafeInteger(n)&&n>0);return t.length===0?null:`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${t.join(",")}&size=150x150&format=Webp`}function St(e){if(typeof e!="object"||e===null)return null;const t=e,n=x(t.universeId),r=x(t.rootPlaceId),o=typeof t.name=="string"?t.name.trim():"";return n===0||r===0||o===""?null:{placeId:r,universeId:n,name:o,playing:x(t.playerCount)}}function Oe(e){if(!Array.isArray(e))return[];const t=[];for(const n of e){const r=St(n);r!==null&&t.push(r)}return t}function Nt(e){const t=new Set,n=[];for(const r of e)t.has(r.placeId)||(t.add(r.placeId),n.push(r));return n}function It(e){if(typeof e!="object"||e===null)return[];const t=e.sorts;if(!Array.isArray(t))return[];const n=[],r=new Set;for(const o of t){if(typeof o!="object"||o===null)continue;const a=o,i=typeof a.sortId=="string"?a.sortId:"",c=typeof a.sortDisplayName=="string"?a.sortDisplayName.trim():"";if(i===""||c===""||a.contentType!=="Games"||r.has(i))continue;const u=Oe(a.games);u.length!==0&&(r.add(i),n.push({sortId:i,title:c,games:u}))}return n}function kt(e){if(typeof e!="object"||e===null)return[];const t=e.searchResults;if(!Array.isArray(t))return[];const n=[];for(const r of t){if(typeof r!="object"||r===null)continue;const o=r;o.contentGroupType==="Game"&&n.push(...Oe(o.contents))}return Nt(n)}function Rt(e){if(typeof e!="object"||e===null)return{};const t=e.data;if(!Array.isArray(t))return{};const n={};for(const r of t){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.targetId),i=o.imageUrl;a===0||typeof i!="string"||!i.startsWith("https://")||(n[a]=i)}return n}function se(e){return e.split(";").some(t=>{const n=t.indexOf("=");return n<=0||t.slice(0,n).trim().replace(/^\./,"").toLowerCase()!=="roblosecurity"?!1:t.slice(n+1).trim().length>=Te})}function J(e){const t=[["cookie",e],["origin","https://www.roblox.com"],["referer","https://www.roblox.com/"],["accept","application/json, text/plain, */*"]],n=et();return n!==null&&t.push(["x-bound-auth-token",n]),t}function B(e){if(e.trim()==="")return null;try{return JSON.parse(e)}catch{return null}}async function E(e,t,n){const r=await be(e,t,n==null?[]:J(n));if(r.status<400)return B(r.text);if(n==null||r.status!==401&&r.status!==403)return null;const o=await be(e,t,[]);return o.status<400?B(o.text):null}async function Et(e,t){return It(await E(xt(e),t))}const At="https://apis.roblox.com/discovery-api/omni-recommendation";function Ct(e){const t=typeof e=="object"&&e!==null?e.sorts:void 0;if(!Array.isArray(t))return[];for(const n of t){if(typeof n!="object"||n===null)continue;const r=n;if(![r.sortDisplayName,r.sortId,r.contentType].filter(c=>typeof c=="string").join(" ").toLowerCase().includes("continue"))continue;const a=Array.isArray(r.games)?r.games:Array.isArray(r.content)?r.content:null;if(a===null)continue;const i=a.map(c=>typeof c=="object"&&c!==null?x(c.universeId):0).filter(c=>c>0);if(i.length>0)return Array.from(new Set(i))}return[]}function Lt(e){const t=typeof e=="object"&&e!==null?e.data:void 0;if(!Array.isArray(t))return[];const n=[];for(const r of t){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.id),i=x(o.rootPlaceId),c=typeof o.name=="string"?o.name.trim():"";a===0||i===0||c===""||n.push({universeId:a,placeId:i,name:c,playing:x(o.playing)})}return n}async function Tt(e,t,n){const r=await H(At,"POST",JSON.stringify({pageType:"Home",sessionId:t}),n,[...J(e),["content-type","application/json"]]);if(r.status>=400)return[];const o=Ct(B(r.text)),a=[];for(let i=0;i<o.length&&!n.aborted;i+=F){const c=o.slice(i,i+F),u=await E(`https://games.roblox.com/v1/games?universeIds=${c.join(",")}`,n);a.push(...Lt(u))}return a}async function Pe(e,t,n){return kt(await E(wt(e,t),n))}const ge=80;async function Ue(e,t,n){const r=Array.from(new Set(t.filter(a=>Number.isSafeInteger(a)&&a>0))),o={};for(let a=0;a<r.length&&!n.aborted;a+=ge){const i=e(r.slice(a,a+ge));i!==null&&Object.assign(o,Rt(await E(i,n)))}return o}async function Ot(e,t){return Ue(vt,e,t)}async function Pt(e,t){return Ue(jt,e,t)}function Ut(e){for(const t of e.split(";")){const n=t.trim(),r=n.indexOf("=");if(r<=0||n.slice(0,r).trim().replace(/^\./,"").toLowerCase()!=="roblosecurity")continue;const a=n.slice(r+1).trim();if(!(a.length<Te))return`.ROBLOSECURITY=${a}`}return null}const _t="https://users.roblox.com/v1/users/authenticated";function Mt(e){return`https://friends.roblox.com/v1/users/${e}/friends?userSort=StatusFrequents`}function _e(e){if(typeof e!="object"||e===null)return null;const t=e,n=x(t.id),r=typeof t.name=="string"?t.name:"";return n===0?null:{id:n,name:r,displayName:typeof t.displayName=="string"&&t.displayName!==""?t.displayName:r,isOnline:t.isOnline===!0}}function Ft(e){return _e(e)}function qt(e){if(typeof e!="object"||e===null)return[];const t=e.data;if(!Array.isArray(t))return[];const n=[],r=new Set;for(const o of t){const a=_e(o);a!==null&&!r.has(a.id)&&(r.add(a.id),n.push(a))}return n}async function Dt(e,t){return Ft(await E(_t,t,e))}async function $t(e,t,n){return qt(await E(Mt(e),n,t))}function Bt(){return"https://apis.roblox.com/user-profile-api/v1/user/profiles/get-profiles"}function Ht(e){const t=new Map;if(typeof e!="object"||e===null)return t;const n=e.profileDetails;if(!Array.isArray(n))return t;for(const r of n){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.userId),i=o.names;if(a===0||typeof i!="object"||i===null)continue;const c=i,u=typeof c.username=="string"?c.username:"",y=typeof c.displayName=="string"?c.displayName:"";u===""&&y===""||t.set(a,{name:u,displayName:y===""?u:y})}return t}function Gt(e,t){return e.map(n=>{const r=t.get(n.id);return r===void 0?n:{...n,name:r.name!==""?r.name:n.name,displayName:r.displayName!==""?r.displayName:n.displayName}})}async function Vt(e,t,n){const r=Array.from(new Set(e.filter(a=>Number.isSafeInteger(a)&&a>0))).slice(0,100);if(r.length===0)return new Map;const o=await H(Bt(),"POST",JSON.stringify({userIds:r,fields:["names.displayName","names.username"]}),n,[["content-type","application/json"],...t===null?[]:J(t)]);return o.status>=400?new Map:Ht(B(o.text))}async function Wt(e,t,n){const r=await $t(e,t,n);if(r.length===0)return r;const o=await Vt(r.map(a=>a.id),t,n).catch(()=>new Map);return Gt(r,o)}function zt(e){if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.placeId=="number"&&t.placeId>0&&typeof t.universeId=="number"&&typeof t.name=="string"&&t.name!==""&&typeof t.icon<"u"}function Me(){try{if(typeof localStorage>"u")return[];const e=localStorage.getItem(Ce),t=e===null?null:JSON.parse(e);return Array.isArray(t)?t.filter(zt).slice(0,Le):[]}catch{return[]}}function Kt(e){const n=[{...e,playedAt:Date.now()},...Me().filter(r=>r.placeId!==e.placeId)].slice(0,Le);try{typeof localStorage<"u"&&localStorage.setItem(Ce,JSON.stringify(n))}catch{}return n}function Jt(e){if(typeof e!="object"||e===null)return[];const t=e.userPresences;if(!Array.isArray(t))return[];const n=[];for(const r of t){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.userId);a!==0&&n.push({userId:a,presence:x(o.userPresenceType),placeId:x(o.placeId)||null,jobId:typeof o.gameId=="string"?o.gameId:null,universeId:x(o.universeId)||null,location:typeof o.lastLocation=="string"?o.lastLocation:null})}return n}async function Zt(e,t,n){const r=Array.from(new Set(e.filter(a=>a>0)));if(r.length===0)return[];const o=await H("https://presence.roblox.com/v1/presence/users","POST",JSON.stringify({userIds:r}),n,[["content-type","application/json"],...J(t)]);return o.status>=400?[]:Jt(B(o.text))}function Xt(e){const t=e.filter(n=>Number.isSafeInteger(n)&&n>0);return t.length===0?null:`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${t.join(",")}&size=768x432&format=Webp&isCircular=false`}function Yt(e){const t={};if(typeof e!="object"||e===null)return t;const n=e.data;if(!Array.isArray(n))return t;for(const r of n){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.universeId),i=o.thumbnails;if(a===0||!Array.isArray(i))continue;let c=null;for(const u of i){if(typeof u!="object"||u===null)continue;const y=u,v=y.imageUrl;if(!(typeof v!="string"||!v.startsWith("https://"))&&((c===null||y.state==="Completed")&&(c=v),y.state==="Completed"))break}c!==null&&(t[a]=c)}return t}const F=40;async function Fe(e,t){const n=Array.from(new Set(e.filter(o=>Number.isSafeInteger(o)&&o>0))),r={};for(let o=0;o<n.length&&!t.aborted;o+=F){const a=Xt(n.slice(o,o+F));a!==null&&Object.assign(r,Yt(await E(a,t)))}return r}function Qt(e,t){const n=e+t;return n<=0?null:Math.round(e/n*100)}function en(e){const t=e.filter(n=>Number.isSafeInteger(n)&&n>0);return t.length===0?null:`https://games.roblox.com/v1/games/votes?universeIds=${t.join(",")}`}function tn(e){const t={};if(typeof e!="object"||e===null)return t;const n=e.data;if(!Array.isArray(n))return t;for(const r of n){if(typeof r!="object"||r===null)continue;const o=r,a=x(o.id);a!==0&&(t[a]={up:x(o.upVotes),down:x(o.downVotes)})}return t}async function qe(e,t){const n=Array.from(new Set(e.filter(o=>Number.isSafeInteger(o)&&o>0))),r={};for(let o=0;o<n.length&&!t.aborted;o+=F){const a=en(n.slice(o,o+F));a!==null&&Object.assign(r,tn(await E(a,t)))}return r}function nn(e){return`https://economy.roblox.com/v1/users/${e}/currency`}function rn(e){if(typeof e!="object"||e===null)return null;const t=e.robux;return typeof t=="number"&&Number.isFinite(t)&&t>=0?Math.floor(t):null}async function sn(e,t,n){return rn(await E(nn(e),n,t))}const xe=new Map,Y=new Map;function on(e){return e.length>=8&&e[0]===137&&e[1]===80?"image/png":e.length>=3&&e[0]===255&&e[1]===216?"image/jpeg":e.length>=12&&e[8]===87&&e[9]===69?"image/webp":e.length>=4&&e[0]===71&&e[1]===73?"image/gif":"application/octet-stream"}function an(e,t){const n=xe.get(e);if(n!==void 0)return Promise.resolve(n);const r=Y.get(e);if(r!==void 0)return r;const o=(async()=>{const a=new AbortController,i=()=>a.abort();if(t?.aborted===!0)return null;t?.addEventListener("abort",i,{once:!0});try{const c=await Ne(e,a.signal,[["accept","image/avif,image/webp,image/apng,image/png,image/jpeg,image/*,*/*;q=0.8"]]);if(c.status>=400||c.bytes.byteLength===0||typeof URL>"u"||typeof URL.createObjectURL!="function")return null;const u=c.bytes.slice(),y=URL.createObjectURL(new Blob([u.buffer],{type:on(u)}));return xe.set(e,y),y}catch{return null}finally{t?.removeEventListener("abort",i),Y.delete(e)}})();return Y.set(e,o),o}function ie({src:e,alt:t,...n}){const[r,o]=f.useState(null);return f.useEffect(()=>{let a=!1;const i=new AbortController;return o(null),an(e,i.signal).then(c=>{a||o(c)}),()=>{a=!0,i.abort()}},[e]),r===null?null:s.jsx("img",{src:r,alt:t,...n})}const cn="https://www.roblox.com",oe=Math.random().toString(36).slice(2,12);function De(e){return e instanceof Error&&e.message!==""?e.message:"Roblox did not answer."}function we(){return Ut(Ie(cn))}function K(e){const t=e.displayName!==""?e.displayName:e.name;return t!==""?t:"Roblox user"}function ln(e){return!Number.isFinite(e)||e<=0?"0":e>=1e6?`${(e/1e6).toFixed(1).replace(/\.0$/,"")}M`:e>=1e4?`${Math.round(e/1e3)}K`:e>=1e3?`${(e/1e3).toFixed(1).replace(/\.0$/,"")}K`:String(e)}function ve(e){const t=e.presence?.location??"";return t!==""&&t!=="Website"?t:e.presence!==null&&e.presence.presence!==0?"Online":"Offline"}function ae(e,t,n){const r=n[e.universeId];return{placeId:e.placeId,universeId:e.universeId,name:e.name,playing:e.playing,thumb:t[e.universeId]??null,icon:null,rating:Qt(r?.up??0,r?.down??0)}}async function un(e){const t=we();if(t===null)return{kind:"no-session"};const[n,r,o]=await Promise.all([Dt(t,e).then(d=>({ok:!0,value:d}),d=>({ok:!1,reason:d})),Et(oe,e).catch(()=>[]),Tt(t,oe,e).catch(()=>[])]);if(!n.ok)return{kind:"failed",error:De(n.reason)};const a=n.value;if(a===null)return we()===null?{kind:"no-session"}:{kind:"failed",error:"Roblox rejected the saved session."};const i=await Wt(a.id,t,e).catch(()=>[]),c=await sn(a.id,t,e).catch(()=>null),u=Me(),y=o.length>0?o.map(d=>({game:d,icon:null})):u.map(d=>({game:{placeId:d.placeId,universeId:d.universeId,name:d.name,playing:d.playing},icon:d.icon})),v=r.slice(0,3).map(d=>({title:d.title,games:d.games.slice(0,9)})),k=[...v.flatMap(d=>d.games.map(N=>N.universeId)),...y.map(d=>d.game.universeId)],[j,C,S,A,U]=await Promise.all([Pt([a.id,...i.map(d=>d.id)],e).catch(()=>({})),i.length===0?Promise.resolve([]):Zt(i.map(d=>d.id),t,e).catch(()=>[]),Fe(k,e).catch(()=>({})),qe(k,e).catch(()=>({})),Ot(y.map(d=>d.game.universeId),e).catch(()=>({}))]),R=new Map(C.map(d=>[d.userId,d]));return{kind:"ok",data:{me:a,meAvatar:j[a.id]??null,robux:c,friends:i.map(d=>({person:d,avatar:j[d.id]??null,presence:R.get(d.id)??null})),continue:y.map(d=>({...ae(d.game,S,A),icon:d.icon??U[d.game.universeId]??null})),sections:v.map(d=>({title:d.title,games:d.games.map(N=>ae(N,S,A))}))}}}const dn={play:s.jsx("polygon",{points:"6 3 20 12 6 21 6 3"}),users:s.jsxs(s.Fragment,{children:[s.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}),s.jsx("circle",{cx:"9",cy:"7",r:"4"}),s.jsx("path",{d:"M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"})]}),thumb:s.jsx("path",{d:"M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"}),pad:s.jsx("path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"})};function fn(){return s.jsxs("svg",{className:"wb-search-icon",width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round","aria-hidden":"true",focusable:"false",children:[s.jsx("circle",{cx:"11",cy:"11",r:"7"}),s.jsx("path",{d:"m20 20-3.5-3.5"})]})}function pn({size:e=17}){return s.jsxs("svg",{width:e,height:e,viewBox:"0 0 32 32","aria-hidden":"true",focusable:"false",children:[s.jsx("path",{d:"M15.0762 7.29574C15.6479 6.96571 16.3521 6.96571 16.9238 7.29574L23.0762 10.8479C23.6479 11.1779 24 11.7878 24 12.4479V19.5521C24 20.2122 23.6479 20.8221 23.0762 21.1521L16.9238 24.7043C16.3521 25.0343 15.6479 25.0343 15.0762 24.7043L8.92376 21.1521C8.35214 20.8221 8 20.2122 8 19.5521V12.4479C8 11.7878 8.35214 11.1779 8.92376 10.8479L15.0762 7.29574ZM11.9998 13V19C11.9998 19.5523 12.4475 20 12.9998 20H18.9998C19.5521 20 19.9998 19.5523 19.9998 19V13C19.9998 12.4477 19.5521 12 18.9998 12H12.9998C12.4475 12 11.9998 12.4477 11.9998 13Z",fill:"currentColor"}),s.jsx("path",{d:"M13.8556 2.56068C15.1825 1.81311 16.8175 1.81311 18.1444 2.56068L26.8556 7.46819C28.1825 8.21577 29 9.59734 29 11.0925V20.9075C29 22.4027 28.1825 23.7842 26.8556 24.5318L18.1444 29.4393C16.8175 30.1869 15.1825 30.1869 13.8556 29.4393L5.14444 24.5318C3.81746 23.7842 3 22.4027 3 20.9075V11.0925C3 9.59734 3.81746 8.21577 5.14444 7.46819L13.8556 2.56068ZM17.1628 4.30319C16.4452 3.89894 15.5548 3.89894 14.8372 4.30319L6.12611 9.2107C5.41362 9.61209 5 10.336 5 11.0925V20.9075C5 21.664 5.41362 22.3879 6.12611 22.7893L14.8372 27.6968C15.5548 28.1011 16.4452 28.1011 17.1628 27.6968L25.8739 22.7893C26.5864 22.3879 27 21.664 27 20.9075V11.0925C27 10.336 26.5864 9.61209 25.8739 9.2107L17.1628 4.30319Z",fill:"currentColor"})]})}function $({name:e,size:t=12}){const n=e==="play";return s.jsx("svg",{className:"wb-glyph",width:t,height:t,viewBox:"0 0 24 24",fill:n?"currentColor":"none",stroke:n?"none":"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false",children:dn[e]})}function $e({src:e,size:t}){return s.jsx("span",{className:"wb-face",style:{width:t,height:t},children:e!==null&&s.jsx(ie,{src:e,alt:"",loading:"lazy",decoding:"async"})})}function Be(e,t){if(Kt({placeId:e.placeId,universeId:e.universeId,name:e.name,creator:"",playing:e.playing,visits:0,favorites:0,description:"",icon:e.icon??e.thumb}),t!==void 0){t(ke(e.placeId));return}Re(e.placeId)}function Q({game:e,launch:t}){const n=e.thumb??e.icon;return s.jsxs("button",{type:"button",className:"wb-card",onClick:()=>Be(e,t),children:[s.jsxs("span",{className:"wb-card-art",children:[n!==null&&s.jsx(ie,{src:n,alt:"",loading:"lazy"}),s.jsxs("span",{className:"wb-play",children:[s.jsx($,{name:"play",size:11})," Play"]})]}),s.jsxs("span",{className:"wb-card-body",children:[s.jsx("span",{className:"wb-card-title",title:e.name,children:e.name}),s.jsxs("span",{className:"wb-card-meta",children:[e.rating!==null&&s.jsxs("span",{children:[s.jsx($,{name:"thumb",size:11})," ",e.rating,"%"]}),s.jsxs("span",{children:[s.jsx($,{name:"users",size:11})," ",ln(e.playing)]})]})]})]})}function mn({friend:e}){const t=e.presence!==null&&e.presence.presence!==0,n=e.presence?.location??"",r=t&&n!==""&&n!=="Website";return s.jsxs("span",{className:"wb-friend",title:`${K(e.person)}, ${ve(e)}`,children:[s.jsxs("span",{className:"wb-av",children:[s.jsx($e,{src:e.avatar,size:72}),r&&s.jsx("span",{className:"wb-pad",children:s.jsx($,{name:"pad",size:13})}),!r&&t&&s.jsx("span",{className:"wb-dot"})]}),s.jsx("span",{className:"wb-nm",children:K(e.person)}),s.jsx("span",{className:"wb-st",children:ve(e)})]})}function hn({home:e,launch:t}){const n=e.continue[0],r=n?.icon??n?.thumb??null;return s.jsxs("section",{className:"wb-hero",children:[s.jsx("span",{className:"wb-hero-face",children:s.jsx($e,{src:e.meAvatar,size:54})}),s.jsxs("span",{className:"wb-hero-who",children:[s.jsx("span",{className:"wb-hero-name",title:K(e.me),children:K(e.me)}),n&&s.jsxs("span",{className:"wb-hero-game",title:n.name,children:[r!==null&&s.jsx(ie,{className:"wb-hero-game-icon",src:r,alt:"",loading:"lazy",decoding:"async"}),s.jsxs("span",{className:"wb-hero-game-name",children:["Last played: ",n.name]})]})]}),n&&s.jsxs("button",{type:"button",className:"wb-btn",onClick:()=>Be(n,t),children:[s.jsx($,{name:"play",size:12})," Resume"]})]})}function bn({onOpenPlayer:e,onSessionLost:t}){const[n,r]=f.useState(null),[o,a]=f.useState(!0),[i,c]=f.useState(null),[u,y]=f.useState(0),[v,k]=f.useState(""),[j,C]=f.useState(null),[S,A]=f.useState(!1),[U,R]=f.useState(null),L=f.useRef(t);L.current=t;async function d(){const p=v.trim();if(p===""){C(null),R(null);return}A(!0),R(null);const h=new AbortController;try{const T=await Pe(p,oe,h.signal),O=T.map(_=>_.universeId),[V,Z]=await Promise.all([Fe(O,h.signal).catch(()=>({})),qe(O,h.signal).catch(()=>({}))]);C(T.slice(0,18).map(_=>ae(_,V,Z))),T.length===0&&R("No games matched that search.")}catch{R("Roblox search is unavailable right now.")}finally{A(!1)}}f.useEffect(()=>{const p=new AbortController;return a(!0),un(p.signal).then(h=>{if(!p.signal.aborted){if(h.kind==="no-session"){L.current?.();return}if(h.kind==="failed"){r(null),c(h.error);return}r(h.data),c(null)}}).catch(h=>{p.signal.aborted||c(De(h))}).finally(()=>{p.signal.aborted||a(!1)}),()=>p.abort()},[u]);let N;return o&&n===null?N=s.jsxs("div",{className:"wb-skel-home","aria-hidden":"true",children:[s.jsx("span",{className:"wb-skel wb-skel-hero"}),s.jsxs("div",{className:"wb-block",children:[s.jsx("div",{className:"wb-sec",children:s.jsx("span",{className:"wb-skel wb-skel-line",style:{width:64,height:9}})}),s.jsx("div",{className:"wb-rail",children:Array.from({length:8},(p,h)=>s.jsxs("span",{className:"wb-friend",children:[s.jsx("span",{className:"wb-skel wb-skel-circle"}),s.jsx("span",{className:"wb-skel wb-skel-line",style:{width:62,marginTop:10}}),s.jsx("span",{className:"wb-skel wb-skel-line",style:{width:44,marginTop:6}})]},h))})]}),s.jsxs("div",{className:"wb-block",children:[s.jsx("div",{className:"wb-sec",children:s.jsx("span",{className:"wb-skel wb-skel-line",style:{width:104,height:9}})}),s.jsx("div",{className:"wb-grid",children:Array.from({length:4},(p,h)=>s.jsx("span",{className:"wb-skel wb-skel-card"},h))})]})]}):i!==null&&n===null?N=s.jsxs("div",{className:"wb-state",children:[s.jsx("b",{children:"Couldn't load your home."})," ",i,s.jsx("br",{}),s.jsx("button",{type:"button",className:"wb-btn wb-btn-ghost",onClick:()=>y(p=>p+1),children:"Try again"})]}):n===null?N=s.jsx("div",{className:"wb-state",children:"Loading your home…"}):N=s.jsxs(s.Fragment,{children:[s.jsx(hn,{home:n,launch:e}),j!==null&&s.jsxs("section",{className:"wb-block",children:[s.jsxs("div",{className:"wb-sec",children:[s.jsx("h2",{children:"Search results"}),S&&s.jsx("span",{className:"wb-n",children:"Searching…"})]}),U!==null?s.jsx("div",{className:"wb-state",children:U}):s.jsx("div",{className:"wb-grid",children:j.map(p=>s.jsx(Q,{game:p,launch:e},p.placeId))})]}),s.jsxs("section",{className:"wb-block",children:[s.jsxs("div",{className:"wb-sec",children:[s.jsx("h2",{children:"Friends"}),s.jsx("span",{className:"wb-n",children:n.friends.length})]}),s.jsx("div",{className:"wb-rail",children:n.friends.length===0?s.jsx("div",{className:"wb-state",children:"No friends yet."}):n.friends.slice(0,14).map(p=>s.jsx(mn,{friend:p},p.person.id))})]}),n.continue.length>0&&s.jsxs("section",{className:"wb-block",children:[s.jsx("div",{className:"wb-sec",children:s.jsx("h2",{children:"Continue playing"})}),s.jsx("div",{className:"wb-grid",children:n.continue.map(p=>s.jsx(Q,{game:p,launch:e},p.placeId))})]}),n.sections.map(p=>s.jsxs("section",{className:"wb-block",children:[s.jsx("div",{className:"wb-sec",children:s.jsx("h2",{children:p.title})}),s.jsx("div",{className:"wb-grid",children:p.games.map(h=>s.jsx(Q,{game:h,launch:e},h.placeId))})]},p.title))]}),s.jsx("div",{className:"wb-page",children:s.jsxs("div",{className:"wb-inner",children:[s.jsxs("header",{className:"wb-top",children:[s.jsxs("span",{className:"wb-brand",children:[s.jsx(tt,{size:26}),s.jsx("span",{className:"wb-word",children:"DriftBlox"})]}),s.jsxs("form",{className:"wb-search",role:"search",onSubmit:p=>{p.preventDefault(),d()},children:[s.jsx(fn,{}),s.jsx("input",{value:v,placeholder:"Search games","aria-label":"Search Roblox games",onChange:p=>{const h=p.target.value;k(h),h.trim()===""&&(C(null),R(null))}})]}),n!==null&&s.jsxs("span",{className:"wb-robux",title:"Robux balance",children:[s.jsx(pn,{size:16}),n.robux===null?"—":n.robux.toLocaleString()]})]}),N]})})}const yn=6e3,gn=12e3,xn=3e4,wn=15e3,He="rblx2016/ronoxide_logo.png",je=[137,80,78,71,13,10,26,10],vn=[["accept","image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"],["cache-control","no-cache"]],jn="allow-scripts allow-forms allow-modals allow-pointer-lock allow-downloads allow-orientation-lock allow-presentation",Sn="autoplay; fullscreen; gamepad; clipboard-write; cross-origin-isolated",ee="roblox-login",Nn=2500;function Se(){const e=new Uint8Array(16);if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function")crypto.getRandomValues(e);else for(let t=0;t<e.length;t+=1)e[t]=Math.floor(Math.random()*256);return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function In(e){return e.length>=je.length&&je.every((t,n)=>e[n]===t)}function Ge(e,t){return new Promise(n=>{const r=new Image;let o=!1;const a=window.setTimeout(()=>i(!1),yn);function i(u){o||(o=!0,window.clearTimeout(a),t.removeEventListener("abort",c),r.onload=null,r.onerror=null,u||(r.src=""),n(u))}function c(){i(!1)}if(t.aborted){i(!1);return}t.addEventListener("abort",c,{once:!0}),r.onload=()=>i(r.naturalWidth>0),r.onerror=()=>i(!1),r.src=`${e}/${He}?probe=${Date.now()}`})}async function Ve(e,t){const n=new AbortController,r=()=>n.abort();if(t.aborted)return!1;t.addEventListener("abort",r,{once:!0});const o=window.setTimeout(()=>n.abort(),gn);try{const a=await Ne(`${e}/${He}?probe=${Date.now()}`,n.signal,vn);return a.status<400&&In(a.bytes)}catch{return!1}finally{window.clearTimeout(o),t.removeEventListener("abort",r)}}async function te(e,t=null){const n=G.filter(o=>o!==t);return(await Promise.all(n.map(async o=>({source:o,works:await Ge(o,e)})))).find(o=>o.works)?.source??null}async function ne(e,t){const n=await Promise.all(G.map(async r=>({source:r,works:await Ve(r,e)})));for(const r of n){if(!r.works||e.aborted)continue;const o=new AbortController,a=()=>o.abort();e.addEventListener("abort",a,{once:!0});const i=window.setTimeout(()=>o.abort(),xn);try{const c=await pt(r.source,o.signal);return{kind:"wisp",source:c.source,html:yt(c.source,c.html,t)}}catch{}finally{window.clearTimeout(i),e.removeEventListener("abort",a)}}return null}function We(){return Ie("https://www.roblox.com")}function kn({onOpenTab:e,onSession:t}){const n=f.useRef(null),[r,o]=f.useState(null),a=f.useRef(t);return a.current=t,f.useEffect(()=>{const i=n.current;if(!i)return;if(rt()!=="scramjet"){o("Signing in reads the Scramjet cookie jar. Switch the proxy engine to Scramjet, or open sign in in a new tab.");return}let c=!1;st(ee,i,{adblock:!1}).then(()=>{c||ot(ee,ye)}).catch(j=>{c||o(j instanceof Error?j.message:"Roblox's sign-in page could not start.")});const u=()=>{let j="";try{j=n.current?.contentWindow?.document.cookie??""}catch{}a.current?.(se(We())||se(j))};u();const y=window.setTimeout(u,400),v=window.setInterval(u,Nn),k=()=>{document.visibilityState==="visible"&&u()};return window.addEventListener("focus",k),document.addEventListener("visibilitychange",k),()=>{c=!0,window.clearTimeout(y),window.clearInterval(v),window.removeEventListener("focus",k),document.removeEventListener("visibilitychange",k),at(ee)}},[]),s.jsxs("div",{className:"roblox-login",children:[s.jsx("iframe",{ref:n,className:"roblox-login-frame",title:"Roblox sign in"}),r!==null&&s.jsxs("div",{className:"roblox-login-error",role:"alert",children:[s.jsx("p",{children:r}),e!==void 0&&s.jsx("button",{className:"roblox-modern-signin",type:"button",onClick:()=>e(ye),children:"Open sign in in a new tab"})]})]})}function An({onOpenWindow:e,onOpenPage:t,onOpenPlayer:n}){const r=f.useRef(null),[o,a]=f.useState(null),[i,c]=f.useState(null),[u,y]=f.useState(0),[v,k]=f.useState(null),[j,C]=f.useState(0),[S]=f.useState(()=>Se()),[A,U]=f.useState(""),[R,L]=f.useState(null),[d,N]=f.useState(!1),[p,h]=f.useState(!0),[T,O]=f.useState(!1),[V,Z]=f.useState(!1),[_,ze]=f.useState(""),[ce,Ke]=f.useState([]),[le,ue]=f.useState(!1),[de,W]=f.useState(null);f.useEffect(()=>{if(!p)return;const l=m=>{m.key==="Escape"&&h(!1)};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[p]),f.useEffect(()=>{if(!d){a(null),c(null);return}const l=new AbortController;let m=!1,q=0;function I(w){q=window.setTimeout(()=>{g(w)},wn)}function P(){m||(a(null),c("Every Roblox launcher is blocked or unavailable."))}async function g(w){if(m)return;if(w.kind==="direct"){if(await Ge(w.source,l.signal)){m||I(w);return}const D=await te(l.signal,w.source);if(m)return;if(D!==null){const he={kind:"direct",source:D};a(he),I(he);return}const X=await ne(l.signal,S);if(m)return;if(X!==null){a(X),I(X);return}P();return}const b=await te(l.signal);if(m)return;if(b!==null){const D={kind:"direct",source:b};a(D),I(D);return}if(await Ve(w.source,l.signal)){m||I(w);return}const M=await ne(l.signal,S);if(!m){if(M!==null){a(M),I(M);return}P()}}if(v!==null){const w={kind:"direct",source:v};a(w),c(null),I(w)}else(async()=>{const w=await te(l.signal);if(m)return;if(w!==null){const M={kind:"direct",source:w};a(M),c(null),I(M);return}const b=await ne(l.signal,S);if(!m){if(b!==null){a(b),c(null),I(b);return}P()}})();return()=>{m=!0,l.abort(),window.clearTimeout(q)}},[u,S,v,j,d]),f.useEffect(()=>{const l=()=>{O(se(We())),Z(!0)},m=()=>{document.visibilityState==="visible"&&l()};return l(),window.addEventListener("focus",m),document.addEventListener("visibilitychange",m),()=>{window.removeEventListener("focus",m),document.removeEventListener("visibilitychange",m)}},[]),f.useEffect(()=>{const l=r.current;if(!(!l||o===null))return l.setAttribute("credentialless",""),o.kind==="direct"?(l.removeAttribute("srcdoc"),l.removeAttribute("sandbox"),l.src=o.source):(l.removeAttribute("src"),l.setAttribute("sandbox",jn),l.srcdoc=o.html),()=>{l.removeAttribute("src"),l.removeAttribute("srcdoc"),l.removeAttribute("sandbox"),l.removeAttribute("credentialless")}},[o]),f.useEffect(()=>{if(o?.kind!=="wisp")return;const l=o.source,m=new AbortController,q=I=>{if(I.source!==r.current?.contentWindow)return;const P=I.data;if(typeof P!="object"||P===null)return;const g=P;if(g.token!==S)return;if(g.type==="drift:sandbox-open"&&typeof g.url=="string"){let b;try{b=new URL(g.url)}catch{return}if(b.protocol!=="http:"&&b.protocol!=="https:")return;e?.(b.href);return}if(g.type!=="drift:sandbox-fetch"||typeof g.id!="string"||typeof g.url!="string")return;const w=[];if(Array.isArray(g.headers))for(const b of g.headers)Array.isArray(b)&&b.length>=2&&typeof b[0]=="string"&&typeof b[1]=="string"&&w.push([b[0],b[1]]);mt(l,{url:g.url,method:typeof g.method=="string"?g.method:"GET",headers:w,body:typeof g.body=="string"?g.body:null},m.signal).then(b=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:S,id:g.id,status:b.status,headers:b.headers,text:b.text},"*")}).catch(b=>{r.current?.contentWindow?.postMessage({type:"drift:sandbox-fetch-response",token:S,id:g.id,error:b instanceof Error?b.message:"Sandbox request failed."},"*")})};return window.addEventListener("message",q),()=>{m.abort(),window.removeEventListener("message",q)}},[o,S,e]);function Je(){const l=gt(A);if(l===null){L("Enter the numeric place ID from a roblox.com/games address.");return}L(null);const m=ut(String(l));m!==null&&t?.(m)}async function fe(){const l=_.trim();if(l!==""){ue(!0),W(null);try{const m=await Pe(l,Se(),new AbortController().signal);Ke(m.slice(0,12)),m.length===0&&W("No games matched that search.")}catch{W("Roblox search is unavailable right now.")}finally{ue(!1)}}}async function Ze(l){if(await nt(),n!==void 0){n(ke(l));return}Re(l)}const Xe=o?.source??v,pe=!d&&!V,me=!d&&V&&!T;function Ye(l){c(null),a({kind:"direct",source:l}),k(l),C(m=>m+1)}return s.jsxs("div",{className:"roblox",children:[!pe&&!me&&s.jsxs("form",{className:"roblox-modern",onSubmit:l=>{l.preventDefault(),Je()},children:[s.jsxs("div",{className:"roblox-modern-copy",children:[s.jsx("strong",{children:"DriftBlox"}),s.jsx("span",{className:"roblox-modern-session",role:"status",children:T?"Signed in":"Signed out"}),s.jsx("span",{children:"Plays the current Roblox client through the proxy. Sign in with your own Roblox account first; the relay sends its join the way the Roblox client does, so games you do not own start too, and the client downloads again on every cold load."})]}),s.jsxs("div",{className:"roblox-modern-actions",children:[s.jsxs("div",{className:"roblox-modern-row",children:[s.jsx("input",{className:"roblox-modern-input",inputMode:"numeric",placeholder:"Place ID","aria-label":"Roblox place ID",value:A,onChange:l=>{U(l.target.value),L(null)}}),s.jsx("button",{className:"roblox-modern-open",type:"submit",disabled:t===void 0,children:"Open"}),s.jsx("button",{className:"roblox-modern-signin",type:"button",onClick:()=>{O(!1),N(!1),h(!0)},children:"Sign in"})]}),s.jsxs("div",{className:"roblox-modern-row",children:[s.jsx("input",{className:"roblox-modern-input",placeholder:"Find a game","aria-label":"Search Roblox games",value:_,onChange:l=>{ze(l.target.value),W(null)},onKeyDown:l=>{l.key==="Enter"&&(l.preventDefault(),fe())}}),s.jsx("button",{className:"roblox-modern-open",type:"button",disabled:le,onClick:()=>{fe()},children:le?"Searching…":"Find"})]}),ce.length>0&&s.jsx("div",{className:"roblox-modern-results",role:"list","aria-label":"DriftBlox results",children:ce.map(l=>s.jsxs("button",{className:"roblox-modern-result",type:"button",role:"listitem",title:`Play ${l.name} in DriftBlox`,onClick:()=>{Ze(l.placeId)},children:[s.jsx("span",{children:l.name}),s.jsxs("small",{children:[l.playing.toLocaleString()," playing"]})]},l.placeId))}),de!==null&&s.jsx("p",{className:"roblox-modern-error",role:"alert",children:de}),s.jsx("button",{className:"roblox-modern-legacy",type:"button","aria-expanded":d,onClick:()=>N(l=>!l),children:d?"Hide the 2016 launcher":"Use the 2016 launcher instead"})]}),R!==null&&s.jsx("p",{className:"roblox-modern-error",role:"alert",children:R})]}),pe?s.jsx("p",{className:"roblox-status",role:"status",children:"Checking your Roblox session…"}):me?s.jsxs("section",{className:"roblox-signin-page","aria-label":"Roblox sign in",children:[s.jsx(kn,{onOpenTab:t,onSession:O}),p?s.jsx("div",{className:"roblox-signin-backdrop",role:"presentation",onMouseDown:l=>{l.target===l.currentTarget&&h(!1)},children:s.jsxs("div",{className:"roblox-signin-card",role:"dialog","aria-modal":"true","aria-label":"Roblox sign in",children:[s.jsx("button",{className:"roblox-signin-continue",type:"button",autoFocus:!0,onClick:()=>h(!1),children:"Continue to sign in"}),s.jsxs("details",{className:"roblox-signin-more",children:[s.jsx("summary",{children:"How sign in works"}),s.jsxs("ol",{className:"roblox-signin-steps",children:[s.jsxs("li",{children:[s.jsx("strong",{children:"Sign in behind this card"}),"Roblox's own sign-in page is already open underneath. Your password goes to Roblox, never to Drift."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"The session stays in the proxy"}),"Drift keeps it in Scramjet's cookie jar, so DriftBlox signs in on its own without a reload."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"If the page behind stays blank"}),"Switch the proxy engine to Scramjet, or open sign in in a new tab from the error card."]})]})]})]})}):s.jsxs("button",{className:"roblox-signin-help",type:"button",onClick:()=>h(!0),children:[s.jsx("span",{className:"roblox-signin-help-mark","aria-hidden":"true",children:"?"}),"Sign in help"]})]}):d?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"roblox-sources",role:"group","aria-label":"Roblox sources",children:G.map((l,m)=>s.jsxs("button",{className:"roblox-source",type:"button",title:l,"aria-pressed":Xe===l,onClick:()=>Ye(l),children:["Source ",m+1]},l))}),s.jsx("div",{className:"roblox-stage",children:i!==null?s.jsxs("div",{className:"roblox-blocked",role:"alert",children:[s.jsx("p",{children:i}),s.jsx("button",{className:"roblox-retry",type:"button",onClick:()=>{c(null),a(null),y(l=>l+1)},children:"Try again"})]}):o===null?s.jsx("p",{className:"roblox-status",role:"status",children:"Finding a working Roblox link…"}):s.jsx("iframe",{ref:r,className:"roblox-frame",title:"Roblox",allow:Sn},`${o.kind}-${o.source}-${j}`)})]}):T?s.jsx(bn,{onOpenPage:t,onOpenPlayer:n,onSessionLost:()=>O(!1)}):null]})}export{An as DriftBloxPage};
