// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// Single threaded MINIMAL_RUNTIME programs do not need access to
// document.currentScript, so a simple export declaration is enough.
var createGecko = (() => {
  // When MODULARIZE this JS may be executed later,
  // after document.currentScript is gone, so we save it.
  // In EXPORT_ES6 mode we can just use 'import.meta.url'.
  var _scriptName = globalThis.document?.currentScript?.src;
  return async function(moduleArg = {}) {
    var Module = moduleArg;
// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split("-")[0];
    // Remove any trailing part from e.g. "12.53.3-alpha"
    var vers = str.split(".").slice(0, 3);
    while (vers.length < 3) vers.push("00");
    vers = vers.map((n, i, arr) => n.padStart(2, "0"));
    return vers.join("");
  }
  // 300000 -> "30.0.0"
  var packedVersionToHumanReadable = n => [ n / 1e4 | 0, (n / 100 | 0) % 100, n % 100 ].join(".");
  var TARGET_NOT_SUPPORTED = 2147483647;
  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.
  var currentNodeVersion = typeof process !== "undefined" && process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
  if (currentNodeVersion < TARGET_NOT_SUPPORTED) {
    throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  }
  if (currentNodeVersion < 2147483647) {
    throw new Error(`This emscripten-generated code requires node v${packedVersionToHumanReadable(2147483647)} (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
  }
  var userAgent = typeof navigator !== "undefined" && navigator.userAgent;
  if (!userAgent) {
    return;
  }
  var currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 17e4) {
    throw new Error(`This emscripten-generated code requires Safari v${packedVersionToHumanReadable(17e4)} (detected v${currentSafariVersion})`);
  }
  var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 105) {
    throw new Error(`This emscripten-generated code requires Firefox v105 (detected v${currentFirefoxVersion})`);
  }
  var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;

var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() running directly in a worker. (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)
// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && globalThis.name?.startsWith("em-pthread");

if (ENVIRONMENT_IS_PTHREAD) {
  assert(!globalThis.moduleLoaded, "module should only be loaded once on each pthread worker");
  globalThis.moduleLoaded = true;
}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /tmp/tmpmneyhjal.js
if (!Module["expectedDataFileDownloads"]) Module["expectedDataFileDownloads"] = 0;

Module["expectedDataFileDownloads"]++;

(() => {
  // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
  var isPthread = typeof ENVIRONMENT_IS_PTHREAD != "undefined" && ENVIRONMENT_IS_PTHREAD;
  var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != "undefined" && ENVIRONMENT_IS_WASM_WORKER;
  if (isPthread || isWasmWorker) return;
  async function loadPackage(metadata) {
    var PACKAGE_PATH = "";
    if (typeof window === "object") {
      PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/");
    } else if (typeof process === "undefined" && typeof location !== "undefined") {
      // web worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
    }
    var PACKAGE_NAME = "/home/user/firefox-wasm/gecko.js/wasm/gecko.data";
    var REMOTE_PACKAGE_BASE = "gecko.data";
    var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
    var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
    async function fetchRemotePackage(packageName, packageSize) {
      if (!Module["dataFileDownloads"]) Module["dataFileDownloads"] = {};
      try {
        var response = await fetch(packageName);
      } catch (e) {
        throw new Error(`Network Error: ${packageName}`, {
          e
        });
      }
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.url}`);
      }
      const chunks = [];
      const headers = response.headers;
      const total = Number(headers.get("Content-Length") || packageSize);
      let loaded = 0;
      Module["setStatus"] && Module["setStatus"]("Downloading data...");
      const reader = response.body.getReader();
      while (1) {
        var {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        Module["dataFileDownloads"][packageName] = {
          loaded,
          total
        };
        let totalLoaded = 0;
        let totalSize = 0;
        for (const download of Object.values(Module["dataFileDownloads"])) {
          totalLoaded += download.loaded;
          totalSize += download.total;
        }
        Module["setStatus"] && Module["setStatus"](`Downloading data... (${totalLoaded}/${totalSize})`);
      }
      const packageData = new Uint8Array(chunks.map(c => c.length).reduce((a, b) => a + b, 0));
      let offset = 0;
      for (const chunk of chunks) {
        packageData.set(chunk, offset);
        offset += chunk.length;
      }
      return packageData.buffer;
    }
    var fetchPromise;
    var fetched = Module["getPreloadedPackage"] && Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    if (!fetched) {
      // Note that we don't use await here because we want to execute the
      // the rest of this function immediately.
      fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    }
    async function runWithFS(Module) {
      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
      Module["FS_createPath"]("/", "gre-baked", true, true);
      Module["FS_createPath"]("/gre-baked", "actors", true, true);
      Module["FS_createPath"]("/gre-baked", "chrome", true, true);
      Module["FS_createPath"]("/gre-baked/chrome", "en-US", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US", "locale", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale", "en-US", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "alerts", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "autoconfig", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "global-platform", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global-platform", "mac", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global-platform", "unix", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global-platform", "win", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "global", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global", "dom", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global", "layout", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global", "mathml", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global", "security", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/global", "svg", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "mozapps", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/mozapps", "downloads", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/mozapps", "profile", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US/mozapps", "update", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "necko", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "passwordmgr", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "pipnss", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "pippki", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/en-US/locale/en-US", "places", true, true);
      Module["FS_createPath"]("/gre-baked/chrome", "toolkit", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit", "content", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content", "extensions", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/extensions", "child", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/extensions", "parent", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/extensions", "schemas", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content", "global", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "aboutRestricted", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "aboutconfig", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "alerts", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "antitracking", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "autocomplete-row-item", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "bindings", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "cookiebanners", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "elements", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "errors", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "gmp-sources", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "httpsonlyerror", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "neterror", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global/neterror", "supportpages", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "pictureinpicture", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "preferences", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "reader", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "resistfingerprinting", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "third_party", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global/third_party", "cfworker", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global/third_party", "d3", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/global", "xml", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content", "mozapps", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps", "downloads", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps", "extensions", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps/extensions", "components", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps/extensions", "default-theme", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps", "handling", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps", "preferences", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/content/mozapps", "profile", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit", "passwordmgr", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit", "res", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit", "skin", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin", "classic", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic", "global", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "arrow", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "design-system", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "dirListing", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "icons", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "illustrations", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "in-content", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "media", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "narrate", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "pictureinpicture", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "reader", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/global", "tree", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic", "mozapps", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/mozapps", "downloads", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/mozapps", "extensions", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/mozapps", "handling", true, true);
      Module["FS_createPath"]("/gre-baked/chrome/toolkit/skin/classic/mozapps", "update", true, true);
      Module["FS_createPath"]("/gre-baked", "components", true, true);
      Module["FS_createPath"]("/gre-baked", "contentaccessible", true, true);
      Module["FS_createPath"]("/gre-baked/contentaccessible", "html", true, true);
      Module["FS_createPath"]("/gre-baked", "defaults", true, true);
      Module["FS_createPath"]("/gre-baked/defaults", "autoconfig", true, true);
      Module["FS_createPath"]("/gre-baked/defaults", "pref", true, true);
      Module["FS_createPath"]("/gre-baked", "fonts", true, true);
      Module["FS_createPath"]("/gre-baked", "localization", true, true);
      Module["FS_createPath"]("/gre-baked/localization", "en-US", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "crashreporter", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "dom", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "locales-preview", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "netwerk", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "preview", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "security", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/security", "certificates", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/security", "pippki", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "services", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US", "toolkit", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "about", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "branding", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "contentanalysis", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "downloads", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "firefoxlabs", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "formautofill", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "global", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "intl", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "main-window", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "neterror", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "passwordmgr", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "payments", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "pdfviewer", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "pictureinpicture", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "preferences", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "printing", true, true);
      Module["FS_createPath"]("/gre-baked/localization/en-US/toolkit", "updates", true, true);
      Module["FS_createPath"]("/gre-baked", "modules", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "backgroundtasks", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "components-utils", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "contentrelevancy", true, true);
      Module["FS_createPath"]("/gre-baked/modules/contentrelevancy", "private", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "handlers", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "media", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "megalist", true, true);
      Module["FS_createPath"]("/gre-baked/modules/megalist", "aggregator", true, true);
      Module["FS_createPath"]("/gre-baked/modules/megalist/aggregator", "datasources", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "narrate", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "psm", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "services-automation", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "sessionstore", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "subprocess", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "third_party", true, true);
      Module["FS_createPath"]("/gre-baked/modules/third_party", "fathom", true, true);
      Module["FS_createPath"]("/gre-baked/modules/third_party", "jsesc", true, true);
      Module["FS_createPath"]("/gre-baked/modules", "workers", true, true);
      Module["FS_createPath"]("/gre-baked", "moz-src", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src", "dom", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/dom", "geolocation", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/dom", "notification", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/dom", "quota", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src", "services", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/services", "crypto", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/services/crypto", "modules", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src", "third_party", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/third_party", "js", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/third_party/js", "qrcode", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src", "toolkit", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit", "actors", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit", "components", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components", "pageextractor", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components", "qrcode", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components", "uniffi-bindgen-gecko-js", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js", "components", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components", "generated", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components", "uniffi-js", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit/components/uniffi-js", "js", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit", "modules", true, true);
      Module["FS_createPath"]("/gre-baked/moz-src/toolkit", "profile", true, true);
      Module["FS_createPath"]("/gre-baked", "res", true, true);
      Module["FS_createPath"]("/gre-baked/res", "dtd", true, true);
      Module["FS_createPath"]("/gre-baked/res", "fonts", true, true);
      Module["FS_createPath"]("/gre-baked/res", "locale", true, true);
      Module["FS_createPath"]("/gre-baked/res/locale", "dom", true, true);
      Module["FS_createPath"]("/gre-baked/res/locale", "layout", true, true);
      Module["FS_createPath"]("/gre-baked/res/locale", "necko", true, true);
      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, "Loading data file failed.");
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData " + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
        for (var file of metadata["files"]) {
          var name = file["filename"];
          var data = byteArray.subarray(file["start"], file["end"]);
          // canOwn this data in the filesystem, it is a slice into the heap that will never change
          Module["FS_createDataFile"](name, null, data, true, true, true);
        }
        Module["removeRunDependency"]("datafile_/home/user/firefox-wasm/gecko.js/wasm/gecko.data");
      }
      Module["addRunDependency"]("datafile_/home/user/firefox-wasm/gecko.js/wasm/gecko.data");
      if (!Module["preloadResults"]) Module["preloadResults"] = {};
      Module["preloadResults"][PACKAGE_NAME] = {
        fromCache: false
      };
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);
    }
    // Detect whether the module JS file has already been loaded.
    if (Module["FS_createPath"]) {
      runWithFS(Module);
    } else {
      if (!Module["preRun"]) Module["preRun"] = [];
      Module["preRun"].push(runWithFS);
    }
  }
  loadPackage({
    "files": [ {
      "filename": "/gre-baked/.lldbinit",
      "start": 0,
      "end": 192
    }, {
      "filename": "/gre-baked/.mkdir.done",
      "start": 192,
      "end": 192
    }, {
      "filename": "/gre-baked/actors/AboutHttpsOnlyErrorChild.sys.mjs",
      "start": 192,
      "end": 2626
    }, {
      "filename": "/gre-baked/actors/AboutHttpsOnlyErrorParent.sys.mjs",
      "start": 2626,
      "end": 3211
    }, {
      "filename": "/gre-baked/actors/AboutPDFChild.sys.mjs",
      "start": 3211,
      "end": 4859
    }, {
      "filename": "/gre-baked/actors/AboutPDFParent.sys.mjs",
      "start": 4859,
      "end": 7131
    }, {
      "filename": "/gre-baked/actors/AboutRestrictedChild.sys.mjs",
      "start": 7131,
      "end": 7629
    }, {
      "filename": "/gre-baked/actors/AboutRestrictedParent.sys.mjs",
      "start": 7629,
      "end": 8210
    }, {
      "filename": "/gre-baked/actors/AboutTranslationsChild.sys.mjs",
      "start": 8210,
      "end": 18157
    }, {
      "filename": "/gre-baked/actors/AboutTranslationsParent.sys.mjs",
      "start": 18157,
      "end": 23424
    }, {
      "filename": "/gre-baked/actors/AudioPlaybackChild.sys.mjs",
      "start": 23424,
      "end": 24101
    }, {
      "filename": "/gre-baked/actors/AudioPlaybackParent.sys.mjs",
      "start": 24101,
      "end": 25411
    }, {
      "filename": "/gre-baked/actors/AutoCompleteChild.sys.mjs",
      "start": 25411,
      "end": 36564
    }, {
      "filename": "/gre-baked/actors/AutoCompleteParent.sys.mjs",
      "start": 36564,
      "end": 57164
    }, {
      "filename": "/gre-baked/actors/AutoScrollChild.sys.mjs",
      "start": 57164,
      "end": 70588
    }, {
      "filename": "/gre-baked/actors/AutoScrollParent.sys.mjs",
      "start": 70588,
      "end": 72489
    }, {
      "filename": "/gre-baked/actors/AutoplayChild.sys.mjs",
      "start": 72489,
      "end": 72833
    }, {
      "filename": "/gre-baked/actors/AutoplayParent.sys.mjs",
      "start": 72833,
      "end": 73475
    }, {
      "filename": "/gre-baked/actors/BackgroundThumbnailsChild.sys.mjs",
      "start": 73475,
      "end": 77102
    }, {
      "filename": "/gre-baked/actors/BrowserElementChild.sys.mjs",
      "start": 77102,
      "end": 77999
    }, {
      "filename": "/gre-baked/actors/BrowserElementParent.sys.mjs",
      "start": 77999,
      "end": 79430
    }, {
      "filename": "/gre-baked/actors/CaptchaDetectionChild.sys.mjs",
      "start": 79430,
      "end": 93497
    }, {
      "filename": "/gre-baked/actors/CaptchaDetectionCommunicationChild.sys.mjs",
      "start": 93497,
      "end": 95838
    }, {
      "filename": "/gre-baked/actors/CaptchaDetectionParent.sys.mjs",
      "start": 95838,
      "end": 109135
    }, {
      "filename": "/gre-baked/actors/ContentMetaChild.sys.mjs",
      "start": 109135,
      "end": 114813
    }, {
      "filename": "/gre-baked/actors/ContentMetaParent.sys.mjs",
      "start": 114813,
      "end": 115620
    }, {
      "filename": "/gre-baked/actors/ControllersChild.sys.mjs",
      "start": 115620,
      "end": 117703
    }, {
      "filename": "/gre-baked/actors/ControllersParent.sys.mjs",
      "start": 117703,
      "end": 120379
    }, {
      "filename": "/gre-baked/actors/CookieBannerChild.sys.mjs",
      "start": 120379,
      "end": 139957
    }, {
      "filename": "/gre-baked/actors/CookieBannerParent.sys.mjs",
      "start": 139957,
      "end": 147222
    }, {
      "filename": "/gre-baked/actors/ExtFindChild.sys.mjs",
      "start": 147222,
      "end": 148149
    }, {
      "filename": "/gre-baked/actors/FindBarChild.sys.mjs",
      "start": 148149,
      "end": 152352
    }, {
      "filename": "/gre-baked/actors/FindBarParent.sys.mjs",
      "start": 152352,
      "end": 153890
    }, {
      "filename": "/gre-baked/actors/FinderChild.sys.mjs",
      "start": 153890,
      "end": 157313
    }, {
      "filename": "/gre-baked/actors/FormHandlerChild.sys.mjs",
      "start": 157313,
      "end": 172105
    }, {
      "filename": "/gre-baked/actors/FormHandlerParent.sys.mjs",
      "start": 172105,
      "end": 174994
    }, {
      "filename": "/gre-baked/actors/FormHistoryChild.sys.mjs",
      "start": 174994,
      "end": 182487
    }, {
      "filename": "/gre-baked/actors/FormHistoryParent.sys.mjs",
      "start": 182487,
      "end": 187627
    }, {
      "filename": "/gre-baked/actors/InlineSpellCheckerChild.sys.mjs",
      "start": 187627,
      "end": 188755
    }, {
      "filename": "/gre-baked/actors/InlineSpellCheckerParent.sys.mjs",
      "start": 188755,
      "end": 190126
    }, {
      "filename": "/gre-baked/actors/KeyPressEventModelCheckerChild.sys.mjs",
      "start": 190126,
      "end": 193713
    }, {
      "filename": "/gre-baked/actors/MLEngineChild.sys.mjs",
      "start": 193713,
      "end": 222269
    }, {
      "filename": "/gre-baked/actors/MLEngineParent.sys.mjs",
      "start": 222269,
      "end": 279682
    }, {
      "filename": "/gre-baked/actors/MegalistChild.sys.mjs",
      "start": 279682,
      "end": 280259
    }, {
      "filename": "/gre-baked/actors/MegalistParent.sys.mjs",
      "start": 280259,
      "end": 281684
    }, {
      "filename": "/gre-baked/actors/NetErrorChild.sys.mjs",
      "start": 281684,
      "end": 289497
    }, {
      "filename": "/gre-baked/actors/NetErrorParent.sys.mjs",
      "start": 289497,
      "end": 299174
    }, {
      "filename": "/gre-baked/actors/PageExtractorChild.sys.mjs",
      "start": 299174,
      "end": 311996
    }, {
      "filename": "/gre-baked/actors/PageExtractorParent.sys.mjs",
      "start": 311996,
      "end": 323255
    }, {
      "filename": "/gre-baked/actors/PictureInPictureChild.sys.mjs",
      "start": 323255,
      "end": 441671
    }, {
      "filename": "/gre-baked/actors/PopupAndRedirectBlockingChild.sys.mjs",
      "start": 441671,
      "end": 447292
    }, {
      "filename": "/gre-baked/actors/PopupAndRedirectBlockingParent.sys.mjs",
      "start": 447292,
      "end": 456193
    }, {
      "filename": "/gre-baked/actors/PrintingChild.sys.mjs",
      "start": 456193,
      "end": 465672
    }, {
      "filename": "/gre-baked/actors/PrintingParent.sys.mjs",
      "start": 465672,
      "end": 466391
    }, {
      "filename": "/gre-baked/actors/PrintingSelectionChild.sys.mjs",
      "start": 466391,
      "end": 466984
    }, {
      "filename": "/gre-baked/actors/RemotePageChild.sys.mjs",
      "start": 466984,
      "end": 473265
    }, {
      "filename": "/gre-baked/actors/ReportBrokenSiteChild.sys.mjs",
      "start": 473265,
      "end": 484684
    }, {
      "filename": "/gre-baked/actors/ReportBrokenSiteParent.sys.mjs",
      "start": 484684,
      "end": 504948
    }, {
      "filename": "/gre-baked/actors/SelectChild.sys.mjs",
      "start": 504948,
      "end": 520284
    }, {
      "filename": "/gre-baked/actors/SelectParent.sys.mjs",
      "start": 520284,
      "end": 548112
    }, {
      "filename": "/gre-baked/actors/TLSCertificateBindingChild.sys.mjs",
      "start": 548112,
      "end": 549561
    }, {
      "filename": "/gre-baked/actors/ThumbnailsChild.sys.mjs",
      "start": 549561,
      "end": 552075
    }, {
      "filename": "/gre-baked/actors/TranslationsChild.sys.mjs",
      "start": 552075,
      "end": 556702
    }, {
      "filename": "/gre-baked/actors/TranslationsEngineChild.sys.mjs",
      "start": 556702,
      "end": 563413
    }, {
      "filename": "/gre-baked/actors/TranslationsEngineParent.sys.mjs",
      "start": 563413,
      "end": 568464
    }, {
      "filename": "/gre-baked/actors/TranslationsParent.sys.mjs",
      "start": 568464,
      "end": 738315
    }, {
      "filename": "/gre-baked/actors/UAWidgetsChild.sys.mjs",
      "start": 738315,
      "end": 745364
    }, {
      "filename": "/gre-baked/actors/UnselectedTabHoverChild.sys.mjs",
      "start": 745364,
      "end": 745944
    }, {
      "filename": "/gre-baked/actors/UnselectedTabHoverParent.sys.mjs",
      "start": 745944,
      "end": 746479
    }, {
      "filename": "/gre-baked/actors/UserCharacteristicsCanvasRenderingChild.sys.mjs",
      "start": 746479,
      "end": 774207
    }, {
      "filename": "/gre-baked/actors/UserCharacteristicsChild.sys.mjs",
      "start": 774207,
      "end": 777802
    }, {
      "filename": "/gre-baked/actors/UserCharacteristicsParent.sys.mjs",
      "start": 777802,
      "end": 779878
    }, {
      "filename": "/gre-baked/actors/UserCharacteristicsWindowInfoChild.sys.mjs",
      "start": 779878,
      "end": 785378
    }, {
      "filename": "/gre-baked/actors/ViewSourceChild.sys.mjs",
      "start": 785378,
      "end": 797678
    }, {
      "filename": "/gre-baked/actors/ViewSourcePageChild.sys.mjs",
      "start": 797678,
      "end": 807662
    }, {
      "filename": "/gre-baked/actors/ViewSourcePageParent.sys.mjs",
      "start": 807662,
      "end": 811099
    }, {
      "filename": "/gre-baked/actors/WebChannelChild.sys.mjs",
      "start": 811099,
      "end": 813771
    }, {
      "filename": "/gre-baked/actors/WebChannelParent.sys.mjs",
      "start": 813771,
      "end": 816370
    }, {
      "filename": "/gre-baked/application.ini",
      "start": 816370,
      "end": 816818
    }, {
      "filename": "/gre-baked/chrome.manifest",
      "start": 816818,
      "end": 817359
    }, {
      "filename": "/gre-baked/chrome/.mkdir.done",
      "start": 817359,
      "end": 817359
    }, {
      "filename": "/gre-baked/chrome/en-US.manifest",
      "start": 817359,
      "end": 818050
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/alerts/alert.properties",
      "start": 818050,
      "end": 818844
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/autoconfig/autoconfig.properties",
      "start": 818844,
      "end": 819402
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/mac/accessible.properties",
      "start": 819402,
      "end": 822019
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/mac/platformKeys.properties",
      "start": 822019,
      "end": 822872
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/unix/accessible.properties",
      "start": 822872,
      "end": 823795
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/unix/platformKeys.properties",
      "start": 823795,
      "end": 824499
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/win/accessible.properties",
      "start": 824499,
      "end": 825838
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global-platform/win/platformKeys.properties",
      "start": 825838,
      "end": 826537
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/aboutStudies.properties",
      "start": 826537,
      "end": 827964
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/appstrings.properties",
      "start": 827964,
      "end": 832176
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/autocomplete.properties",
      "start": 832176,
      "end": 832706
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/commonDialogs.properties",
      "start": 832706,
      "end": 834966
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/contentAreaCommands.properties",
      "start": 834966,
      "end": 835794
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/css.properties",
      "start": 835794,
      "end": 840243
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/dialog.properties",
      "start": 840243,
      "end": 840602
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/dom/dom.properties",
      "start": 840602,
      "end": 896445
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/extensions.properties",
      "start": 896445,
      "end": 897908
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/fallbackMenubar.properties",
      "start": 897908,
      "end": 898213
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/filepicker.properties",
      "start": 898213,
      "end": 898858
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/intl.css",
      "start": 898858,
      "end": 899240
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/keys.properties",
      "start": 899240,
      "end": 901496
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/layout/HtmlForm.properties",
      "start": 901496,
      "end": 903610
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/layout/MediaDocument.properties",
      "start": 903610,
      "end": 904908
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/layout/htmlparser.properties",
      "start": 904908,
      "end": 918579
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/layout/xmlparser.properties",
      "start": 918579,
      "end": 920421
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/layout_errors.properties",
      "start": 920421,
      "end": 925285
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/mathml/mathml.properties",
      "start": 925285,
      "end": 926485
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/narrate.properties",
      "start": 926485,
      "end": 927693
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/nsWebBrowserPersist.properties",
      "start": 927693,
      "end": 929480
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/printdialog.properties",
      "start": 929480,
      "end": 931172
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/printing.properties",
      "start": 931172,
      "end": 934028
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/resetProfile.properties",
      "start": 934028,
      "end": 934886
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/security/caps.properties",
      "start": 934886,
      "end": 935560
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/security/csp.properties",
      "start": 935560,
      "end": 953983
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/security/security.properties",
      "start": 953983,
      "end": 973146
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/svg/svg.properties",
      "start": 973146,
      "end": 973414
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/viewSource.properties",
      "start": 973414,
      "end": 974094
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/wizard.properties",
      "start": 974094,
      "end": 974440
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/global/xul.properties",
      "start": 974440,
      "end": 974732
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/mozapps/downloads/downloads.properties",
      "start": 974732,
      "end": 975001
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/mozapps/downloads/unknownContentType.properties",
      "start": 975001,
      "end": 976137
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/mozapps/profile/profileSelection.properties",
      "start": 976137,
      "end": 979493
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/mozapps/update/updates.properties",
      "start": 979493,
      "end": 981608
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/necko/necko.properties",
      "start": 981608,
      "end": 992878
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/passwordmgr/passwordmgr.properties",
      "start": 992878,
      "end": 994632
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/pipnss/nsserrors.properties",
      "start": 994632,
      "end": 1024184
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/pipnss/pipnss.properties",
      "start": 1024184,
      "end": 1031568
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/pippki/pippki.properties",
      "start": 1031568,
      "end": 1033825
    }, {
      "filename": "/gre-baked/chrome/en-US/locale/en-US/places/places.properties",
      "start": 1033825,
      "end": 1035048
    }, {
      "filename": "/gre-baked/chrome/toolkit.manifest",
      "start": 1035048,
      "end": 1036550
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-backgroundPage.js",
      "start": 1036550,
      "end": 1037814
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-contentScripts.js",
      "start": 1037814,
      "end": 1039886
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-declarativeNetRequest.js",
      "start": 1039886,
      "end": 1041910
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-extension.js",
      "start": 1041910,
      "end": 1044001
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-identity.js",
      "start": 1044001,
      "end": 1046561
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-publicSuffix.js",
      "start": 1046561,
      "end": 1050257
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-runtime.js",
      "start": 1050257,
      "end": 1055813
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-scripting.js",
      "start": 1055813,
      "end": 1057281
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-storage.js",
      "start": 1057281,
      "end": 1069940
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-test.js",
      "start": 1069940,
      "end": 1083213
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-toolkit.js",
      "start": 1083213,
      "end": 1085945
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-userScripts-content.js",
      "start": 1085945,
      "end": 1098489
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-userScripts.js",
      "start": 1098489,
      "end": 1103761
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/child/ext-webRequest.js",
      "start": 1103761,
      "end": 1108493
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/dummy.xhtml",
      "start": 1108493,
      "end": 1108789
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/ext-browser-content.js",
      "start": 1108789,
      "end": 1117359
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/ext-toolkit.json",
      "start": 1117359,
      "end": 1124596
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-activityLog.js",
      "start": 1124596,
      "end": 1125819
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-alarms.js",
      "start": 1125819,
      "end": 1129557
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-backgroundPage.js",
      "start": 1129557,
      "end": 1173136
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-browserSettings.js",
      "start": 1173136,
      "end": 1190968
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-browsingData.js",
      "start": 1190968,
      "end": 1204513
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-captivePortal.js",
      "start": 1204513,
      "end": 1208563
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-clipboard.js",
      "start": 1208563,
      "end": 1211906
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-contentScripts.js",
      "start": 1211906,
      "end": 1218679
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-contextualIdentities.js",
      "start": 1218679,
      "end": 1228978
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-cookies.js",
      "start": 1228978,
      "end": 1256577
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-declarativeNetRequest.js",
      "start": 1256577,
      "end": 1263143
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-dns.js",
      "start": 1263143,
      "end": 1266124
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-downloads.js",
      "start": 1266124,
      "end": 1302834
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-extension.js",
      "start": 1302834,
      "end": 1303932
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-geckoProfiler.js",
      "start": 1303932,
      "end": 1309491
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-i18n.js",
      "start": 1309491,
      "end": 1311085
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-identity.js",
      "start": 1311085,
      "end": 1316228
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-idle.js",
      "start": 1316228,
      "end": 1319613
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-management.js",
      "start": 1319613,
      "end": 1329739
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-networkStatus.js",
      "start": 1329739,
      "end": 1331937
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-notifications.js",
      "start": 1331937,
      "end": 1338700
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-permissions.js",
      "start": 1338700,
      "end": 1348207
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-privacy.js",
      "start": 1348207,
      "end": 1362324
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-protocolHandlers.js",
      "start": 1362324,
      "end": 1365249
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-proxy.js",
      "start": 1365249,
      "end": 1376510
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-runtime.js",
      "start": 1376510,
      "end": 1389094
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-scripting.js",
      "start": 1389094,
      "end": 1401845
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-storage.js",
      "start": 1401845,
      "end": 1415991
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-tabs-base.js",
      "start": 1415991,
      "end": 1493826
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-telemetry.js",
      "start": 1493826,
      "end": 1496818
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-theme.js",
      "start": 1496818,
      "end": 1505256
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-toolkit.js",
      "start": 1505256,
      "end": 1508703
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-trial-ml.js",
      "start": 1508703,
      "end": 1516055
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-userScripts.js",
      "start": 1516055,
      "end": 1525011
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-webNavigation.js",
      "start": 1525011,
      "end": 1535255
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/parent/ext-webRequest.js",
      "start": 1535255,
      "end": 1543248
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/activity_log.json",
      "start": 1543248,
      "end": 1546460
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/alarms.json",
      "start": 1546460,
      "end": 1551899
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/browser_action.json",
      "start": 1551899,
      "end": 1569996
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/browser_settings.json",
      "start": 1569996,
      "end": 1575755
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/browsing_data.json",
      "start": 1575755,
      "end": 1589066
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/captive_portal.json",
      "start": 1589066,
      "end": 1591380
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/clipboard.json",
      "start": 1591380,
      "end": 1592378
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/content_scripts.json",
      "start": 1592378,
      "end": 1596845
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/contextual_identities.json",
      "start": 1596845,
      "end": 1605918
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/cookies.json",
      "start": 1605918,
      "end": 1626134
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/declarative_net_request.json",
      "start": 1626134,
      "end": 1658504
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/dns.json",
      "start": 1658504,
      "end": 1660403
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/downloads.json",
      "start": 1660403,
      "end": 1689795
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/events.json",
      "start": 1689795,
      "end": 1703264
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/experiments.json",
      "start": 1703264,
      "end": 1706026
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/extension.json",
      "start": 1706026,
      "end": 1713658
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/extension_protocol_handlers.json",
      "start": 1713658,
      "end": 1716076
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/extension_types.json",
      "start": 1716076,
      "end": 1722497
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/geckoProfiler.json",
      "start": 1722497,
      "end": 1728517
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/i18n.json",
      "start": 1728517,
      "end": 1734275
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/identity.json",
      "start": 1734275,
      "end": 1740050
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/idle.json",
      "start": 1740050,
      "end": 1742172
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/management.json",
      "start": 1742172,
      "end": 1753868
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/manifest.json",
      "start": 1753868,
      "end": 1779488
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/native_manifest.json",
      "start": 1779488,
      "end": 1780935
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/network_status.json",
      "start": 1780935,
      "end": 1782730
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/notifications.json",
      "start": 1782730,
      "end": 1795750
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/page_action.json",
      "start": 1795750,
      "end": 1806725
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/permissions.json",
      "start": 1806725,
      "end": 1811009
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/privacy.json",
      "start": 1811009,
      "end": 1819324
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/proxy.json",
      "start": 1819324,
      "end": 1827676
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/public_suffix.json",
      "start": 1827676,
      "end": 1831208
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/runtime.json",
      "start": 1831208,
      "end": 1868057
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/scripting.json",
      "start": 1868057,
      "end": 1883111
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/storage.json",
      "start": 1883111,
      "end": 1895429
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/telemetry.json",
      "start": 1895429,
      "end": 1908616
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/test.json",
      "start": 1908616,
      "end": 1914938
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/theme.json",
      "start": 1914938,
      "end": 1930486
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/trial_ml.json",
      "start": 1930486,
      "end": 1932663
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/types.json",
      "start": 1932663,
      "end": 1939576
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/user_scripts.json",
      "start": 1939576,
      "end": 1958512
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/user_scripts_content.json",
      "start": 1958512,
      "end": 1960729
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/web_navigation.json",
      "start": 1960729,
      "end": 1986749
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/extensions/schemas/web_request.json",
      "start": 1986749,
      "end": 2052841
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/ScrollOffsets.mjs",
      "start": 2052841,
      "end": 2056750
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/TopLevelVideoDocument.js",
      "start": 2056750,
      "end": 2059043
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutAbout.html",
      "start": 2059043,
      "end": 2060143
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutAbout.js",
      "start": 2060143,
      "end": 2060896
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutCheckerboard.css",
      "start": 2060896,
      "end": 2061635
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutCheckerboard.html",
      "start": 2061635,
      "end": 2064048
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutCheckerboard.js",
      "start": 2064048,
      "end": 2072272
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutGlean.css",
      "start": 2072272,
      "end": 2075799
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutGlean.html",
      "start": 2075799,
      "end": 2090542
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutGlean.js",
      "start": 2090542,
      "end": 2124377
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutInference.css",
      "start": 2124377,
      "end": 2128072
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutInference.html",
      "start": 2128072,
      "end": 2135883
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutInference.js",
      "start": 2135883,
      "end": 2184444
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutMemory.css",
      "start": 2184444,
      "end": 2188776
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutMemory.xhtml",
      "start": 2188776,
      "end": 2190301
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutMozilla.css",
      "start": 2190301,
      "end": 2190999
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutNetError.html",
      "start": 2190999,
      "end": 2197430
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutNetError.mjs",
      "start": 2197430,
      "end": 2241636
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutNetErrorHelpers.mjs",
      "start": 2241636,
      "end": 2252038
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutNetworking.html",
      "start": 2252038,
      "end": 2260965
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutNetworking.js",
      "start": 2260965,
      "end": 2275536
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutPDF.css",
      "start": 2275536,
      "end": 2279676
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutPDF.html",
      "start": 2279676,
      "end": 2282786
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutPDF.mjs",
      "start": 2282786,
      "end": 2286869
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutProcesses.css",
      "start": 2286869,
      "end": 2294224
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutProcesses.html",
      "start": 2294224,
      "end": 2296375
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutProfiles.js",
      "start": 2296375,
      "end": 2307729
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutProfiles.xhtml",
      "start": 2307729,
      "end": 2309649
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutRestricted/aboutRestricted.css",
      "start": 2309649,
      "end": 2310223
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutRestricted/aboutRestricted.html",
      "start": 2310223,
      "end": 2311811
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutRestricted/aboutRestricted.mjs",
      "start": 2311811,
      "end": 2313006
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutServiceWorkers.js",
      "start": 2313006,
      "end": 2318005
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutServiceWorkers.xhtml",
      "start": 2318005,
      "end": 2319716
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutSupport.xhtml",
      "start": 2319716,
      "end": 2345838
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutTelemetry.css",
      "start": 2345838,
      "end": 2351419
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutTelemetry.xhtml",
      "start": 2351419,
      "end": 2362024
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutUrlClassifier.css",
      "start": 2362024,
      "end": 2362706
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutUrlClassifier.js",
      "start": 2362706,
      "end": 2384764
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutUrlClassifier.xhtml",
      "start": 2384764,
      "end": 2391031
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutWebauthn.css",
      "start": 2391031,
      "end": 2392581
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutWebauthn.html",
      "start": 2392581,
      "end": 2402259
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutWebauthn.js",
      "start": 2402259,
      "end": 2432553
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutconfig/aboutconfig.css",
      "start": 2432553,
      "end": 2439319
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutconfig/aboutconfig.html",
      "start": 2439319,
      "end": 2442487
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutconfig/aboutconfig.js",
      "start": 2442487,
      "end": 2464805
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutconfig/background.svg",
      "start": 2464805,
      "end": 2471660
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/aboutconfig/toggle.svg",
      "start": 2471660,
      "end": 2472163
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/adjustableTitle.js",
      "start": 2472163,
      "end": 2477770
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/alerts/alert.css",
      "start": 2477770,
      "end": 2478504
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/alerts/alert.js",
      "start": 2478504,
      "end": 2492015
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/alerts/alert.xhtml",
      "start": 2492015,
      "end": 2494065
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/antitracking/StripOnShare.json",
      "start": 2494065,
      "end": 2498357
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/antitracking/StripOnShareLGPL.json",
      "start": 2498357,
      "end": 2510621
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/appPicker.js",
      "start": 2510621,
      "end": 2516985
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/appPicker.xhtml",
      "start": 2516985,
      "end": 2518585
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/autocomplete-row-item/autocomplete-row-item.css",
      "start": 2518585,
      "end": 2519689
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/autocomplete-row-item/autocomplete-row-item.mjs",
      "start": 2519689,
      "end": 2523374
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/autocomplete.css",
      "start": 2523374,
      "end": 2523907
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/backgroundPageThumbs.xhtml",
      "start": 2523907,
      "end": 2524604
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/calendar.js",
      "start": 2524604,
      "end": 2541626
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/colorpicker-common.mjs",
      "start": 2541626,
      "end": 2551728
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/colorpicker.mjs",
      "start": 2551728,
      "end": 2552975
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/datekeeper.js",
      "start": 2552975,
      "end": 2566230
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/datepicker.js",
      "start": 2566230,
      "end": 2584386
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/datetimebox.css",
      "start": 2584386,
      "end": 2586904
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/spinner.js",
      "start": 2586904,
      "end": 2609618
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/timekeeper.js",
      "start": 2609618,
      "end": 2624465
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/bindings/timepicker.js",
      "start": 2624465,
      "end": 2639693
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/buildconfig.css",
      "start": 2639693,
      "end": 2639997
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/buildconfig.html",
      "start": 2639997,
      "end": 2642875
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/colorpicker.html",
      "start": 2642875,
      "end": 2643952
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/commonDialog.css",
      "start": 2643952,
      "end": 2646542
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/commonDialog.js",
      "start": 2646542,
      "end": 2652372
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/commonDialog.xhtml",
      "start": 2652372,
      "end": 2655627
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/contentAreaUtils.js",
      "start": 2655627,
      "end": 2696643
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/cookiebanners/CookieBannerRule.schema.json",
      "start": 2696643,
      "end": 2701986
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/customElements.js",
      "start": 2701986,
      "end": 2736202
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/datetimepicker.xhtml",
      "start": 2736202,
      "end": 2738920
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/editMenuOverlay.js",
      "start": 2738920,
      "end": 2744769
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/arrowscrollbox.js",
      "start": 2744769,
      "end": 2769741
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/autocomplete-input.js",
      "start": 2769741,
      "end": 2786714
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/autocomplete-popup.js",
      "start": 2786714,
      "end": 2808045
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/autocomplete-richlistitem.js",
      "start": 2808045,
      "end": 2836859
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/browser-custom-element.mjs",
      "start": 2836859,
      "end": 2896647
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/button.js",
      "start": 2896647,
      "end": 2905448
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/checkbox.js",
      "start": 2905448,
      "end": 2906770
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/datetimebox.js",
      "start": 2906770,
      "end": 2950749
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/dialog.js",
      "start": 2950749,
      "end": 2968864
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/editor.js",
      "start": 2968864,
      "end": 2974466
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/findbar.js",
      "start": 2974466,
      "end": 3020463
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/general.js",
      "start": 3020463,
      "end": 3021396
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/infobar.css",
      "start": 3021396,
      "end": 3023995
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/marquee.css",
      "start": 3023995,
      "end": 3024532
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/marquee.js",
      "start": 3024532,
      "end": 3034217
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/menu.js",
      "start": 3034217,
      "end": 3045483
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/menulist.js",
      "start": 3045483,
      "end": 3056996
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/menupopup.css",
      "start": 3056996,
      "end": 3057486
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/menupopup.js",
      "start": 3057486,
      "end": 3066827
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-badge.css",
      "start": 3066827,
      "end": 3067995
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-badge.mjs",
      "start": 3067995,
      "end": 3070057
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-badge.tokens.css",
      "start": 3070057,
      "end": 3072358
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-button.css",
      "start": 3072358,
      "end": 3072590
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-button.mjs",
      "start": 3072590,
      "end": 3074790
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-common.css",
      "start": 3074790,
      "end": 3079201
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-group.css",
      "start": 3079201,
      "end": 3080547
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-group.mjs",
      "start": 3080547,
      "end": 3093126
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-item.css",
      "start": 3093126,
      "end": 3095208
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-item.mjs",
      "start": 3095208,
      "end": 3104226
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-link.css",
      "start": 3104226,
      "end": 3104466
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box-link.mjs",
      "start": 3104466,
      "end": 3106666
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-box.tokens.css",
      "start": 3106666,
      "end": 3108338
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-breadcrumb-group.css",
      "start": 3108338,
      "end": 3109235
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-breadcrumb-group.mjs",
      "start": 3109235,
      "end": 3112506
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-breadcrumb.css",
      "start": 3112506,
      "end": 3113093
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-breadcrumb.tokens.css",
      "start": 3113093,
      "end": 3114016
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-button-group.css",
      "start": 3114016,
      "end": 3114493
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-button-group.mjs",
      "start": 3114493,
      "end": 3117777
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-button.css",
      "start": 3117777,
      "end": 3129284
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-button.mjs",
      "start": 3129284,
      "end": 3142807
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-card.css",
      "start": 3142807,
      "end": 3146487
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-card.mjs",
      "start": 3146487,
      "end": 3150903
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-checkbox-icon.svg",
      "start": 3150903,
      "end": 3151336
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-checkbox.css",
      "start": 3151336,
      "end": 3153301
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-checkbox.mjs",
      "start": 3153301,
      "end": 3156604
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-fieldset.css",
      "start": 3156604,
      "end": 3158201
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-fieldset.mjs",
      "start": 3158201,
      "end": 3163658
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-five-star.css",
      "start": 3163658,
      "end": 3165097
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-five-star.mjs",
      "start": 3165097,
      "end": 3169130
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-box.js",
      "start": 3169130,
      "end": 3177114
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-color.css",
      "start": 3177114,
      "end": 3178962
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-color.mjs",
      "start": 3178962,
      "end": 3181314
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-color.tokens.css",
      "start": 3181314,
      "end": 3183469
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-common.css",
      "start": 3183469,
      "end": 3188166
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-email.mjs",
      "start": 3188166,
      "end": 3189377
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-folder.css",
      "start": 3189377,
      "end": 3190082
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-folder.mjs",
      "start": 3190082,
      "end": 3196114
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-number.mjs",
      "start": 3196114,
      "end": 3197330
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-password.mjs",
      "start": 3197330,
      "end": 3198558
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-search.mjs",
      "start": 3198558,
      "end": 3201704
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-tel.mjs",
      "start": 3201704,
      "end": 3202908
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-text.css",
      "start": 3202908,
      "end": 3204635
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-text.mjs",
      "start": 3204635,
      "end": 3207254
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-input-url.mjs",
      "start": 3207254,
      "end": 3208452
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-label.css",
      "start": 3208452,
      "end": 3208747
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-label.mjs",
      "start": 3208747,
      "end": 3218260
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-message-bar.css",
      "start": 3218260,
      "end": 3222233
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-message-bar.mjs",
      "start": 3222233,
      "end": 3228873
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-message-bar.tokens.css",
      "start": 3228873,
      "end": 3233292
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-header.css",
      "start": 3233292,
      "end": 3234121
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-header.mjs",
      "start": 3234121,
      "end": 3238461
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-nav-button.css",
      "start": 3238461,
      "end": 3242590
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-nav.css",
      "start": 3242590,
      "end": 3245805
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-nav.mjs",
      "start": 3245805,
      "end": 3255540
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-page-nav.tokens.css",
      "start": 3255540,
      "end": 3256569
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-promo.css",
      "start": 3256569,
      "end": 3259700
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-promo.mjs",
      "start": 3259700,
      "end": 3262961
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-promo.tokens.css",
      "start": 3262961,
      "end": 3265568
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-radio-group.mjs",
      "start": 3265568,
      "end": 3269174
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-reorderable-list.css",
      "start": 3269174,
      "end": 3269999
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-reorderable-list.mjs",
      "start": 3269999,
      "end": 3284149
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-reorderable-list.tokens.css",
      "start": 3284149,
      "end": 3284954
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-select.css",
      "start": 3284954,
      "end": 3288365
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-select.mjs",
      "start": 3288365,
      "end": 3302866
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-select.tokens.css",
      "start": 3302866,
      "end": 3304467
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-support-link.mjs",
      "start": 3304467,
      "end": 3308793
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-textarea.css",
      "start": 3308793,
      "end": 3309131
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-textarea.mjs",
      "start": 3309131,
      "end": 3311613
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-toggle.css",
      "start": 3311613,
      "end": 3315175
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-toggle.mjs",
      "start": 3315175,
      "end": 3317592
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-toggle.tokens.css",
      "start": 3317592,
      "end": 3320381
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-visual-picker-item.css",
      "start": 3320381,
      "end": 3322574
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-visual-picker-item.tokens.css",
      "start": 3322574,
      "end": 3323455
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/moz-visual-picker.mjs",
      "start": 3323455,
      "end": 3328819
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/named-deck.js",
      "start": 3328819,
      "end": 3341165
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/notificationbox.js",
      "start": 3341165,
      "end": 3365578
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/panel-item.css",
      "start": 3365578,
      "end": 3368409
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/panel-list.css",
      "start": 3368409,
      "end": 3370682
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/panel-list.js",
      "start": 3370682,
      "end": 3371355
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/panel-list.mjs",
      "start": 3371355,
      "end": 3403503
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/panel.js",
      "start": 3403503,
      "end": 3411848
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/popupnotification.js",
      "start": 3411848,
      "end": 3421151
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/radio.js",
      "start": 3421151,
      "end": 3436060
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/richlistbox.js",
      "start": 3436060,
      "end": 3466190
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/stringbundle.js",
      "start": 3466190,
      "end": 3468002
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/tabbox.js",
      "start": 3468002,
      "end": 3504388
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/text.js",
      "start": 3504388,
      "end": 3515062
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/textrecognition.js",
      "start": 3515062,
      "end": 3525291
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/toolbarbutton.js",
      "start": 3525291,
      "end": 3531061
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/tree.js",
      "start": 3531061,
      "end": 3578939
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/videocontrols.js",
      "start": 3578939,
      "end": 3694495
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/elements/wizard.js",
      "start": 3694495,
      "end": 3712516
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/cert-errors.mjs",
      "start": 3712516,
      "end": 3727171
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/error-lookup.mjs",
      "start": 3727171,
      "end": 3735564
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/error-registry.mjs",
      "start": 3735564,
      "end": 3738871
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/net-error-illustrations.mjs",
      "start": 3738871,
      "end": 3739331
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/net-errors.mjs",
      "start": 3739331,
      "end": 3766981
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/pkix-errors.mjs",
      "start": 3766981,
      "end": 3773280
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/errors/ssl-errors.mjs",
      "start": 3773280,
      "end": 3779079
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/filepicker.properties",
      "start": 3779079,
      "end": 3779865
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/globalOverlay.js",
      "start": 3779865,
      "end": 3783731
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/gmp-sources/openh264.json",
      "start": 3783731,
      "end": 3787351
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/gmp-sources/widevinecdm.json",
      "start": 3787351,
      "end": 3792102
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/gmp-sources/widevinecdm_l1.json",
      "start": 3792102,
      "end": 3793139
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/httpsonlyerror/errorpage.html",
      "start": 3793139,
      "end": 3796182
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/httpsonlyerror/errorpage.js",
      "start": 3796182,
      "end": 3801298
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/httpsonlyerror/secure-broken.svg",
      "start": 3801298,
      "end": 3802005
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/lit-select-control.mjs",
      "start": 3802005,
      "end": 3814626
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/lit-utils.mjs",
      "start": 3814626,
      "end": 3832003
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/model-files-view.css",
      "start": 3832003,
      "end": 3834102
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/model-files-view.mjs",
      "start": 3834102,
      "end": 3838558
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/mozilla.html",
      "start": 3838558,
      "end": 3839371
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/net-error-card.mjs",
      "start": 3839371,
      "end": 3873567
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/neterror/aboutNetErrorCodes.js",
      "start": 3873567,
      "end": 3885723
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/neterror/supportpages/connection-not-secure.html",
      "start": 3885723,
      "end": 3894060
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/neterror/supportpages/time-errors.html",
      "start": 3894060,
      "end": 3904911
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/pictureinpicture/player.js",
      "start": 3904911,
      "end": 3950639
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/pictureinpicture/player.xhtml",
      "start": 3950639,
      "end": 3956840
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/preferences/AsyncSetting.mjs",
      "start": 3956840,
      "end": 3963768
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/preferences/Preference.mjs",
      "start": 3963768,
      "end": 3975304
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/preferences/Preferences.mjs",
      "start": 3975304,
      "end": 3986854
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/preferences/Setting.mjs",
      "start": 3986854,
      "end": 4001574
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/preferencesBindings.js",
      "start": 4001574,
      "end": 4001968
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/print.css",
      "start": 4001968,
      "end": 4007378
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/print.html",
      "start": 4007378,
      "end": 4025708
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/print.js",
      "start": 4025708,
      "end": 4117244
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/printPagination.css",
      "start": 4117244,
      "end": 4120348
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/printPreview.css",
      "start": 4120348,
      "end": 4122082
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/printPreviewPagination.js",
      "start": 4122082,
      "end": 4128139
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/printUtils.js",
      "start": 4128139,
      "end": 4156614
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/process-content.js",
      "start": 4156614,
      "end": 4157284
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/reader/aboutReader.html",
      "start": 4157284,
      "end": 4165664
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/reader/moz-slider.css",
      "start": 4165664,
      "end": 4166550
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/reader/moz-slider.mjs",
      "start": 4166550,
      "end": 4170209
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/resetProfile.css",
      "start": 4170209,
      "end": 4170523
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/resetProfile.js",
      "start": 4170523,
      "end": 4171300
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/resetProfile.xhtml",
      "start": 4171300,
      "end": 4173565
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/resetProfileProgress.xhtml",
      "start": 4173565,
      "end": 4174617
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/resistfingerprinting/letterboxing.css",
      "start": 4174617,
      "end": 4175814
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/selectDialog.css",
      "start": 4175814,
      "end": 4176105
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/selectDialog.js",
      "start": 4176105,
      "end": 4178320
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/selectDialog.xhtml",
      "start": 4178320,
      "end": 4179239
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/simplifyMode.css",
      "start": 4179239,
      "end": 4180189
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/third_party/cfworker/json-schema.js",
      "start": 4180189,
      "end": 4231870
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/third_party/d3/d3.js",
      "start": 4231870,
      "end": 4569815
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/toggle-group.css",
      "start": 4569815,
      "end": 4572007
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/treeUtils.js",
      "start": 4572007,
      "end": 4574187
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/viewSourceUtils.js",
      "start": 4574187,
      "end": 4588473
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/viewZoomOverlay.js",
      "start": 4588473,
      "end": 4592156
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/widgets.css",
      "start": 4592156,
      "end": 4593547
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/win.xhtml",
      "start": 4593547,
      "end": 4593833
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/xml/XMLPrettyPrint.css",
      "start": 4593833,
      "end": 4594993
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/xml/XMLPrettyPrint.xsl",
      "start": 4594993,
      "end": 4599414
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/global/xul.css",
      "start": 4599414,
      "end": 4612749
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/downloads/unknownContentType.xhtml",
      "start": 4612749,
      "end": 4616368
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/OpenH264-license.txt",
      "start": 4616368,
      "end": 4621039
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/aboutaddons-utils.mjs",
      "start": 4621039,
      "end": 4653013
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/aboutaddons.css",
      "start": 4653013,
      "end": 4669190
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/aboutaddons.html",
      "start": 4669190,
      "end": 4676896
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/aboutaddons.mjs",
      "start": 4676896,
      "end": 4684418
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/abuse-reports.mjs",
      "start": 4684418,
      "end": 4685328
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-card.mjs",
      "start": 4685328,
      "end": 4714956
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-details.mjs",
      "start": 4714956,
      "end": 4736224
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-list.mjs",
      "start": 4736224,
      "end": 4754192
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-mlmodel-details.css",
      "start": 4754192,
      "end": 4754742
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-mlmodel-details.mjs",
      "start": 4754742,
      "end": 4758676
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-options.mjs",
      "start": 4758676,
      "end": 4763446
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-page-header.mjs",
      "start": 4763446,
      "end": 4767137
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-page-options.mjs",
      "start": 4767137,
      "end": 4774276
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-permissions-list.mjs",
      "start": 4774276,
      "end": 4784875
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-shortcuts.mjs",
      "start": 4784875,
      "end": 4803999
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-sitepermissions-list.mjs",
      "start": 4803999,
      "end": 4806050
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/addon-updates-message.mjs",
      "start": 4806050,
      "end": 4807981
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/categories-box.mjs",
      "start": 4807981,
      "end": 4823432
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/colorway-removal-notice.mjs",
      "start": 4823432,
      "end": 4825707
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/discovery-pane.mjs",
      "start": 4825707,
      "end": 4827002
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/drag-drop-addon-installer.mjs",
      "start": 4827002,
      "end": 4829445
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/forced-colors-notice.mjs",
      "start": 4829445,
      "end": 4831008
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/global-warnings.mjs",
      "start": 4831008,
      "end": 4835337
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/inline-options-browser.mjs",
      "start": 4835337,
      "end": 4843235
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/message-bar-stack.mjs",
      "start": 4843235,
      "end": 4845388
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-card-header-additions.css",
      "start": 4845388,
      "end": 4846940
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-card-header-additions.mjs",
      "start": 4846940,
      "end": 4848617
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-card-list-additions.css",
      "start": 4848617,
      "end": 4849060
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-card-list-additions.mjs",
      "start": 4849060,
      "end": 4851563
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-list-intro.css",
      "start": 4851563,
      "end": 4851839
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/mlmodel-list-intro.mjs",
      "start": 4851839,
      "end": 4852792
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/plugin-options.mjs",
      "start": 4852792,
      "end": 4854418
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/proxy-context-menu.mjs",
      "start": 4854418,
      "end": 4854989
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-addon-card.mjs",
      "start": 4854989,
      "end": 4863328
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-addon-list.mjs",
      "start": 4863328,
      "end": 4867167
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-extensions-section.mjs",
      "start": 4867167,
      "end": 4868313
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-footer.mjs",
      "start": 4868313,
      "end": 4869792
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-section.mjs",
      "start": 4869792,
      "end": 4871283
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-themes-footer.mjs",
      "start": 4871283,
      "end": 4873017
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/recommended-themes-section.mjs",
      "start": 4873017,
      "end": 4874115
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/search-addons.mjs",
      "start": 4874115,
      "end": 4876169
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/smartwindow-themes-notice.mjs",
      "start": 4876169,
      "end": 4878543
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/taar-notice.mjs",
      "start": 4878543,
      "end": 4880135
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/components/update-release-notes.mjs",
      "start": 4880135,
      "end": 4882422
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/default-theme/icon.svg",
      "start": 4882422,
      "end": 4883026
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/default-theme/manifest.json",
      "start": 4883026,
      "end": 4883374
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/default-theme/preview.svg",
      "start": 4883374,
      "end": 4886348
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/shortcuts.css",
      "start": 4886348,
      "end": 4888934
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/extensions/view-controller.mjs",
      "start": 4888934,
      "end": 4893873
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/handling/appChooser.js",
      "start": 4893873,
      "end": 4906457
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/handling/appChooser.xhtml",
      "start": 4906457,
      "end": 4908582
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/handling/handler.css",
      "start": 4908582,
      "end": 4909901
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/handling/permissionDialog.js",
      "start": 4909901,
      "end": 4918955
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/handling/permissionDialog.xhtml",
      "start": 4918955,
      "end": 4920819
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/changemp.css",
      "start": 4920819,
      "end": 4922097
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/changemp.js",
      "start": 4922097,
      "end": 4926970
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/changemp.xhtml",
      "start": 4926970,
      "end": 4929889
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/fontbuilder.js",
      "start": 4929889,
      "end": 4934081
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/removemp.js",
      "start": 4934081,
      "end": 4935405
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/preferences/removemp.xhtml",
      "start": 4935405,
      "end": 4937120
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/createProfileWizard.js",
      "start": 4937120,
      "end": 4944458
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/createProfileWizard.xhtml",
      "start": 4944458,
      "end": 4948039
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/profileDowngrade.js",
      "start": 4948039,
      "end": 4949399
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/profileDowngrade.xhtml",
      "start": 4949399,
      "end": 4950846
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/profileSelection.js",
      "start": 4950846,
      "end": 4962191
    }, {
      "filename": "/gre-baked/chrome/toolkit/content/mozapps/profile/profileSelection.xhtml",
      "start": 4962191,
      "end": 4964739
    }, {
      "filename": "/gre-baked/chrome/toolkit/passwordmgr/passwordstorage.sys.mjs",
      "start": 4964739,
      "end": 4966180
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-normal@1.5x.png",
      "start": 4966180,
      "end": 4967633
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-normal@1x.png",
      "start": 4967633,
      "end": 4968632
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-normal@2.25x.png",
      "start": 4968632,
      "end": 4970685
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-normal@2x.png",
      "start": 4970685,
      "end": 4972803
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-left@1.5x.png",
      "start": 4972803,
      "end": 4974246
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-left@1x.png",
      "start": 4974246,
      "end": 4975239
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-left@2.25x.png",
      "start": 4975239,
      "end": 4977331
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-left@2x.png",
      "start": 4977331,
      "end": 4979106
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-right@1.5x.png",
      "start": 4979106,
      "end": 4980546
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-right@1x.png",
      "start": 4980546,
      "end": 4981528
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-right@2.25x.png",
      "start": 4981528,
      "end": 4983603
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret-tilt-right@2x.png",
      "start": 4983603,
      "end": 4985369
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/accessiblecaret.css",
      "start": 4985369,
      "end": 4988252
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/broken-image.png",
      "start": 4988252,
      "end": 4988412
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/counterstyles.css",
      "start": 4988412,
      "end": 5001771
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/details.css",
      "start": 5001771,
      "end": 5002487
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/forms.css",
      "start": 5002487,
      "end": 5029109
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/html.css",
      "start": 5029109,
      "end": 5054872
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/mathml.css",
      "start": 5054872,
      "end": 5065961
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/noframes.css",
      "start": 5065961,
      "end": 5066334
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/quirk.css",
      "start": 5066334,
      "end": 5069458
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/scrollbars.css",
      "start": 5069458,
      "end": 5073821
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/select.css",
      "start": 5073821,
      "end": 5074310
    }, {
      "filename": "/gre-baked/chrome/toolkit/res/ua.css",
      "start": 5074310,
      "end": 5088604
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutCache.css",
      "start": 5088604,
      "end": 5089727
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutCacheEntry.css",
      "start": 5089727,
      "end": 5090199
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutHttpsOnlyError.css",
      "start": 5090199,
      "end": 5092071
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutLicense.css",
      "start": 5092071,
      "end": 5092646
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutMemory.css",
      "start": 5092646,
      "end": 5092908
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutNetError.css",
      "start": 5092908,
      "end": 5098474
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutNetworking.css",
      "start": 5098474,
      "end": 5099727
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutReader.css",
      "start": 5099727,
      "end": 5129535
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/aboutSupport.css",
      "start": 5129535,
      "end": 5133109
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/alert.css",
      "start": 5133109,
      "end": 5137192
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/appPicker.css",
      "start": 5137192,
      "end": 5137814
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/arrow/panelarrow-vertical.svg",
      "start": 5137814,
      "end": 5138211
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/arrowscrollbox.css",
      "start": 5138211,
      "end": 5140493
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/autocomplete.css",
      "start": 5140493,
      "end": 5142357
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/button.css",
      "start": 5142357,
      "end": 5143703
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/checkbox.css",
      "start": 5143703,
      "end": 5145700
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/close-icon.css",
      "start": 5145700,
      "end": 5146847
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/colorpicker-common.css",
      "start": 5146847,
      "end": 5150714
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/colorpicker.css",
      "start": 5150714,
      "end": 5150979
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/commonDialog.css",
      "start": 5150979,
      "end": 5152462
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/datetimeinputpickers.css",
      "start": 5152462,
      "end": 5162689
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/panel.css",
      "start": 5162689,
      "end": 5163069
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/text-and-typography.css",
      "start": 5163069,
      "end": 5164886
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/tokens-brand.css",
      "start": 5164886,
      "end": 5169493
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/tokens-platform.css",
      "start": 5169493,
      "end": 5173295
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/tokens-shared.css",
      "start": 5173295,
      "end": 5231983
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/design-system/toolbar.css",
      "start": 5231983,
      "end": 5233582
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/dialog.css",
      "start": 5233582,
      "end": 5234236
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/dirListing/dirListing.css",
      "start": 5234236,
      "end": 5236083
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/dirListing/folder.png",
      "start": 5236083,
      "end": 5237703
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/dirListing/up.png",
      "start": 5237703,
      "end": 5238850
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/error-pages.css",
      "start": 5238850,
      "end": 5240796
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/findbar.css",
      "start": 5240796,
      "end": 5245981
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/global-shared.css",
      "start": 5245981,
      "end": 5257860
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/global.css",
      "start": 5257860,
      "end": 5261053
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/EU-trust-mark-inverted.svg",
      "start": 5261053,
      "end": 5264506
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/EU-trust-mark.svg",
      "start": 5264506,
      "end": 5267927
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/Landscape.png",
      "start": 5267927,
      "end": 5268296
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/Portrait.png",
      "start": 5268296,
      "end": 5268709
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-counterclockwise-16.svg",
      "start": 5268709,
      "end": 5269849
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-down-12.svg",
      "start": 5269849,
      "end": 5270745
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-down.svg",
      "start": 5270745,
      "end": 5271640
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-left-12.svg",
      "start": 5271640,
      "end": 5272540
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-left.svg",
      "start": 5272540,
      "end": 5273409
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-right-12.svg",
      "start": 5273409,
      "end": 5274332
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-right.svg",
      "start": 5274332,
      "end": 5275236
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-up-12.svg",
      "start": 5275236,
      "end": 5276148
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrow-up.svg",
      "start": 5276148,
      "end": 5277047
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/arrows-updown.svg",
      "start": 5277047,
      "end": 5278215
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/autoscroll-horizontal.svg",
      "start": 5278215,
      "end": 5278900
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/autoscroll-vertical.svg",
      "start": 5278900,
      "end": 5279550
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/autoscroll.svg",
      "start": 5279550,
      "end": 5280474
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/badge-blue.svg",
      "start": 5280474,
      "end": 5280936
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/block.svg",
      "start": 5280936,
      "end": 5282127
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/blocked.svg",
      "start": 5282127,
      "end": 5283012
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/check-filled.svg",
      "start": 5283012,
      "end": 5283909
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/check-partial.svg",
      "start": 5283909,
      "end": 5284404
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/check.svg",
      "start": 5284404,
      "end": 5285311
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/chevron.svg",
      "start": 5285311,
      "end": 5286557
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/clipboard.svg",
      "start": 5286557,
      "end": 5287307
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/close-fill.svg",
      "start": 5287307,
      "end": 5288471
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/close.svg",
      "start": 5288471,
      "end": 5289477
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/color-picker-20.svg",
      "start": 5289477,
      "end": 5291056
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/columnpicker.svg",
      "start": 5291056,
      "end": 5291533
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/content-analysis.svg",
      "start": 5291533,
      "end": 5292646
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/cursor-arrow.svg",
      "start": 5292646,
      "end": 5294133
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/defaultFavicon.svg",
      "start": 5294133,
      "end": 5295904
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/delete.svg",
      "start": 5295904,
      "end": 5297731
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/developer.svg",
      "start": 5297731,
      "end": 5298356
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/edit-copy.svg",
      "start": 5298356,
      "end": 5300204
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/edit-outline.svg",
      "start": 5300204,
      "end": 5302016
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/edit.svg",
      "start": 5302016,
      "end": 5303580
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/error.svg",
      "start": 5303580,
      "end": 5304415
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/experiments.svg",
      "start": 5304415,
      "end": 5306206
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/eye-slash.svg",
      "start": 5306206,
      "end": 5307276
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/eye.svg",
      "start": 5307276,
      "end": 5308058
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/folder.svg",
      "start": 5308058,
      "end": 5309438
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/heart.svg",
      "start": 5309438,
      "end": 5309851
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/help.svg",
      "start": 5309851,
      "end": 5311369
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/highlights.svg",
      "start": 5311369,
      "end": 5315076
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/indicator-private-browsing.svg",
      "start": 5315076,
      "end": 5316188
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/info-filled.svg",
      "start": 5316188,
      "end": 5317158
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/info.svg",
      "start": 5317158,
      "end": 5318314
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/lightbulb.svg",
      "start": 5318314,
      "end": 5320246
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/link.svg",
      "start": 5320246,
      "end": 5321144
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/loading.svg",
      "start": 5321144,
      "end": 5322948
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/mdn.svg",
      "start": 5322948,
      "end": 5323651
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/menu-check.svg",
      "start": 5323651,
      "end": 5324696
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/minus.svg",
      "start": 5324696,
      "end": 5325143
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/more.svg",
      "start": 5325143,
      "end": 5325988
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/move-16.svg",
      "start": 5325988,
      "end": 5326823
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/newsfeed.svg",
      "start": 5326823,
      "end": 5328331
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/open-in-new.svg",
      "start": 5328331,
      "end": 5329716
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/organizational-unit.svg",
      "start": 5329716,
      "end": 5330302
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/page-landscape.svg",
      "start": 5330302,
      "end": 5331534
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/page-portrait.svg",
      "start": 5331534,
      "end": 5332791
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/pdf.svg",
      "start": 5332791,
      "end": 5333963
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/pendingpaint.png",
      "start": 5333963,
      "end": 5346918
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/performance.svg",
      "start": 5346918,
      "end": 5347722
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/plugin.svg",
      "start": 5347722,
      "end": 5349128
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/plus-20.svg",
      "start": 5349128,
      "end": 5349924
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/plus.svg",
      "start": 5349924,
      "end": 5350786
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/print.svg",
      "start": 5350786,
      "end": 5352440
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/rating-star.svg",
      "start": 5352440,
      "end": 5354887
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/reload.svg",
      "start": 5354887,
      "end": 5356006
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/resizer.svg",
      "start": 5356006,
      "end": 5357492
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/search-glass.svg",
      "start": 5357492,
      "end": 5358547
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/search-textbox.svg",
      "start": 5358547,
      "end": 5359112
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/security-broken.svg",
      "start": 5359112,
      "end": 5360031
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/security-custom-root.svg",
      "start": 5360031,
      "end": 5360829
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/security-warning.svg",
      "start": 5360829,
      "end": 5362767
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/security.svg",
      "start": 5362767,
      "end": 5364080
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/settings.svg",
      "start": 5364080,
      "end": 5368581
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/shaft-arrow-down.svg",
      "start": 5368581,
      "end": 5369093
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/shaft-arrow-left.svg",
      "start": 5369093,
      "end": 5369692
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/shaft-arrow-right.svg",
      "start": 5369692,
      "end": 5370293
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/shaft-arrow-up.svg",
      "start": 5370293,
      "end": 5370782
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/sort-arrow.svg",
      "start": 5370782,
      "end": 5371127
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/swap-horizontal-20.svg",
      "start": 5371127,
      "end": 5372175
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/tab-notes-12.svg",
      "start": 5372175,
      "end": 5372931
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/tab-notes.svg",
      "start": 5372931,
      "end": 5374198
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/thumbs-down-20.svg",
      "start": 5374198,
      "end": 5376126
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/thumbs-up-20.svg",
      "start": 5376126,
      "end": 5378042
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/trending.svg",
      "start": 5378042,
      "end": 5379277
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/trophy.svg",
      "start": 5379277,
      "end": 5380089
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/undo.svg",
      "start": 5380089,
      "end": 5380873
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/update-icon.svg",
      "start": 5380873,
      "end": 5381882
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/warning-fill-12.svg",
      "start": 5381882,
      "end": 5382513
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/warning-large.png",
      "start": 5382513,
      "end": 5384956
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/icons/warning.svg",
      "start": 5384956,
      "end": 5386179
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/about-license.svg",
      "start": 5386179,
      "end": 5392764
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/error-malformed-url.svg",
      "start": 5392764,
      "end": 5410514
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/kit-concerned.svg",
      "start": 5410514,
      "end": 5419401
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/kit-happy.svg",
      "start": 5419401,
      "end": 5424356
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/kit-in-circle.svg",
      "start": 5424356,
      "end": 5435313
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/no-connection.svg",
      "start": 5435313,
      "end": 5474855
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/security-error.svg",
      "start": 5474855,
      "end": 5486437
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/shield-alert.svg",
      "start": 5486437,
      "end": 5492931
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/illustrations/shield-check.svg",
      "start": 5492931,
      "end": 5499453
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/in-content/common-shared.css",
      "start": 5499453,
      "end": 5530264
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/in-content/common.css",
      "start": 5530264,
      "end": 5530901
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/in-content/info-pages.css",
      "start": 5530901,
      "end": 5534575
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/in-content/wifi.svg",
      "start": 5534575,
      "end": 5535709
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/audio-muted.svg",
      "start": 5535709,
      "end": 5537370
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/audio.svg",
      "start": 5537370,
      "end": 5538965
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/audioNoAudioButton.svg",
      "start": 5538965,
      "end": 5539559
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/closed-caption-settings-button.svg",
      "start": 5539559,
      "end": 5541583
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/closedCaptionButton-cc-off.svg",
      "start": 5541583,
      "end": 5542860
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/closedCaptionButton-cc-on.svg",
      "start": 5542860,
      "end": 5544128
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/error.png",
      "start": 5544128,
      "end": 5546171
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/fullscreenEnterButton.svg",
      "start": 5546171,
      "end": 5547046
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/fullscreenExitButton.svg",
      "start": 5547046,
      "end": 5547901
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/imagedoc-darknoise.png",
      "start": 5547901,
      "end": 5550951
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/imagedoc-lightnoise.png",
      "start": 5550951,
      "end": 5554938
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/pause-fill.svg",
      "start": 5554938,
      "end": 5556054
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-closed.svg",
      "start": 5556054,
      "end": 5557719
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-enter-fullscreen-button.svg",
      "start": 5557719,
      "end": 5558662
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-exit-fullscreen-button.svg",
      "start": 5558662,
      "end": 5559904
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-open.svg",
      "start": 5559904,
      "end": 5561562
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-seekBackward-button.svg",
      "start": 5561562,
      "end": 5562625
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/picture-in-picture-seekForward-button.svg",
      "start": 5562625,
      "end": 5563842
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/pipToggle.css",
      "start": 5563842,
      "end": 5575726
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/play-fill.svg",
      "start": 5575726,
      "end": 5576550
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/stalled.png",
      "start": 5576550,
      "end": 5597313
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/textrecognition.css",
      "start": 5597313,
      "end": 5597918
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/throbber.png",
      "start": 5597918,
      "end": 5628636
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/media/videocontrols.css",
      "start": 5628636,
      "end": 5641738
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/menu.css",
      "start": 5641738,
      "end": 5654264
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/menulist.css",
      "start": 5654264,
      "end": 5657026
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate.css",
      "start": 5657026,
      "end": 5663610
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/fast.svg",
      "start": 5663610,
      "end": 5664742
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/headphone-active.svg",
      "start": 5664742,
      "end": 5667885
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/headphone.svg",
      "start": 5667885,
      "end": 5668541
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/skip-backward-20.svg",
      "start": 5668541,
      "end": 5669455
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/skip-forward-20.svg",
      "start": 5669455,
      "end": 5670357
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/narrate/slow.svg",
      "start": 5670357,
      "end": 5672182
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/notification.css",
      "start": 5672182,
      "end": 5672805
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/numberinput.css",
      "start": 5672805,
      "end": 5673398
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/offlineSupportPages.css",
      "start": 5673398,
      "end": 5673865
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/pictureinpicture/player.css",
      "start": 5673865,
      "end": 5688945
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/pictureinpicture/texttracks.css",
      "start": 5688945,
      "end": 5691511
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/popup.css",
      "start": 5691511,
      "end": 5697410
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/popupnotification.css",
      "start": 5697410,
      "end": 5700226
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/printPageSetup.css",
      "start": 5700226,
      "end": 5700908
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/radio.css",
      "start": 5700908,
      "end": 5702517
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/RM-Type-Controls-24x24.svg",
      "start": 5702517,
      "end": 5703446
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/align-center-20.svg",
      "start": 5703446,
      "end": 5704322
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/align-justify-20.svg",
      "start": 5704322,
      "end": 5704773
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/align-left-20.svg",
      "start": 5704773,
      "end": 5705651
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/align-right-20.svg",
      "start": 5705651,
      "end": 5706526
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/character-spacing-20.svg",
      "start": 5706526,
      "end": 5707761
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/content-width-20.svg",
      "start": 5707761,
      "end": 5708971
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/line-spacing-20.svg",
      "start": 5708971,
      "end": 5710126
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/reader/word-spacing-20.svg",
      "start": 5710126,
      "end": 5711593
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/richlistbox.css",
      "start": 5711593,
      "end": 5715847
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/splitter.css",
      "start": 5715847,
      "end": 5717962
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/tabbox.css",
      "start": 5717962,
      "end": 5719037
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/toolbar.css",
      "start": 5719037,
      "end": 5721635
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/toolbarbutton.css",
      "start": 5721635,
      "end": 5724276
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/tree/sort-asc.svg",
      "start": 5724276,
      "end": 5724723
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/tree/sort-dsc.svg",
      "start": 5724723,
      "end": 5725171
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/tree/tree.css",
      "start": 5725171,
      "end": 5731734
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/global/wizard.css",
      "start": 5731734,
      "end": 5732752
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/aboutProfiles.css",
      "start": 5732752,
      "end": 5733129
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/aboutServiceWorkers.css",
      "start": 5733129,
      "end": 5733844
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/downloads/unknownContentType.css",
      "start": 5733844,
      "end": 5734665
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/category-available.svg",
      "start": 5734665,
      "end": 5735864
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/category-extensions.svg",
      "start": 5735864,
      "end": 5737886
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/category-plugins.svg",
      "start": 5737886,
      "end": 5739405
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/category-recent.svg",
      "start": 5739405,
      "end": 5740086
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/category-sitepermission.svg",
      "start": 5740086,
      "end": 5741805
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/dictionaryGeneric.svg",
      "start": 5741805,
      "end": 5742510
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/extension.svg",
      "start": 5742510,
      "end": 5744438
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/extensionGeneric.svg",
      "start": 5744438,
      "end": 5745589
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/line.svg",
      "start": 5745589,
      "end": 5756921
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/extensions/themeGeneric.svg",
      "start": 5756921,
      "end": 5758666
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/handling/handling.css",
      "start": 5758666,
      "end": 5759338
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/profileDowngrade.css",
      "start": 5759338,
      "end": 5759699
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/profileSelection.css",
      "start": 5759699,
      "end": 5760075
    }, {
      "filename": "/gre-baked/chrome/toolkit/skin/classic/mozapps/update/updates.css",
      "start": 5760075,
      "end": 5761697
    }, {
      "filename": "/gre-baked/components/ProcessSingleton.manifest",
      "start": 5761697,
      "end": 5761790
    }, {
      "filename": "/gre-baked/components/Push.manifest",
      "start": 5761790,
      "end": 5761946
    }, {
      "filename": "/gre-baked/components/SyncComponents.manifest",
      "start": 5761946,
      "end": 5762097
    }, {
      "filename": "/gre-baked/components/TelemetryStartup.manifest",
      "start": 5762097,
      "end": 5762194
    }, {
      "filename": "/gre-baked/components/antitracking.manifest",
      "start": 5762194,
      "end": 5762316
    }, {
      "filename": "/gre-baked/components/extensions-toolkit.manifest",
      "start": 5762316,
      "end": 5763151
    }, {
      "filename": "/gre-baked/components/extensions.manifest",
      "start": 5763151,
      "end": 5763757
    }, {
      "filename": "/gre-baked/components/l10n-registry.manifest",
      "start": 5763757,
      "end": 5763933
    }, {
      "filename": "/gre-baked/components/servicesComponents.manifest",
      "start": 5763933,
      "end": 5764026
    }, {
      "filename": "/gre-baked/components/servicesSettings.manifest",
      "start": 5764026,
      "end": 5764515
    }, {
      "filename": "/gre-baked/components/terminator.manifest",
      "start": 5764515,
      "end": 5764601
    }, {
      "filename": "/gre-baked/contentaccessible/ImageDocument.css",
      "start": 5764601,
      "end": 5765433
    }, {
      "filename": "/gre-baked/contentaccessible/TopLevelImageDocument.css",
      "start": 5765433,
      "end": 5766905
    }, {
      "filename": "/gre-baked/contentaccessible/TopLevelVideoDocument.css",
      "start": 5766905,
      "end": 5767726
    }, {
      "filename": "/gre-baked/contentaccessible/close-12.svg",
      "start": 5767726,
      "end": 5768189
    }, {
      "filename": "/gre-baked/contentaccessible/html/folder.png",
      "start": 5768189,
      "end": 5768718
    }, {
      "filename": "/gre-baked/contentaccessible/plaintext.css",
      "start": 5768718,
      "end": 5769712
    }, {
      "filename": "/gre-baked/contentaccessible/viewsource.css",
      "start": 5769712,
      "end": 5771609
    }, {
      "filename": "/gre-baked/default.locale",
      "start": 5771609,
      "end": 5771615
    }, {
      "filename": "/gre-baked/defaults/autoconfig/prefcalls.js",
      "start": 5771615,
      "end": 5776678
    }, {
      "filename": "/gre-baked/defaults/pref/PdfJsDefaultPrefs.js",
      "start": 5776678,
      "end": 5781008
    }, {
      "filename": "/gre-baked/defaults/pref/channel-prefs.js",
      "start": 5781008,
      "end": 5781437
    }, {
      "filename": "/gre-baked/dependentlibs.list",
      "start": 5781437,
      "end": 5781447
    }, {
      "filename": "/gre-baked/dependentlibs.list.gtest",
      "start": 5781447,
      "end": 5781463
    }, {
      "filename": "/gre-baked/fonts/LiberationSans-Bold.ttf",
      "start": 5781463,
      "end": 5918515
    }, {
      "filename": "/gre-baked/fonts/LiberationSans-BoldItalic.ttf",
      "start": 5918515,
      "end": 6053639
    }, {
      "filename": "/gre-baked/fonts/LiberationSans-Italic.ttf",
      "start": 6053639,
      "end": 6215675
    }, {
      "filename": "/gre-baked/fonts/LiberationSans-Regular.ttf",
      "start": 6215675,
      "end": 6355187
    }, {
      "filename": "/gre-baked/greprefs.js",
      "start": 6355187,
      "end": 6443680
    }, {
      "filename": "/gre-baked/localization/en-US/crashreporter/aboutcrashes.ftl",
      "start": 6443680,
      "end": 6444889
    }, {
      "filename": "/gre-baked/localization/en-US/crashreporter/crashreporter.ftl",
      "start": 6444889,
      "end": 6448213
    }, {
      "filename": "/gre-baked/localization/en-US/dom/XMLPrettyPrint.ftl",
      "start": 6448213,
      "end": 6448546
    }, {
      "filename": "/gre-baked/localization/en-US/dom/media.ftl",
      "start": 6448546,
      "end": 6448878
    }, {
      "filename": "/gre-baked/localization/en-US/dom/xslt.ftl",
      "start": 6448878,
      "end": 6451747
    }, {
      "filename": "/gre-baked/localization/en-US/locales-preview/aboutRestricted.ftl",
      "start": 6451747,
      "end": 6453239
    }, {
      "filename": "/gre-baked/localization/en-US/locales-preview/smartWindow-aboutAddons.ftl",
      "start": 6453239,
      "end": 6453683
    }, {
      "filename": "/gre-baked/localization/en-US/netwerk/necko.ftl",
      "start": 6453683,
      "end": 6454693
    }, {
      "filename": "/gre-baked/localization/en-US/preview/aboutInference.ftl",
      "start": 6454693,
      "end": 6456469
    }, {
      "filename": "/gre-baked/localization/en-US/security/certificates/certManager.ftl",
      "start": 6456469,
      "end": 6464490
    }, {
      "filename": "/gre-baked/localization/en-US/security/certificates/deviceManager.ftl",
      "start": 6464490,
      "end": 6467426
    }, {
      "filename": "/gre-baked/localization/en-US/security/pippki/pippki.ftl",
      "start": 6467426,
      "end": 6472791
    }, {
      "filename": "/gre-baked/localization/en-US/services/accounts.ftl",
      "start": 6472791,
      "end": 6473183
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutAbout.ftl",
      "start": 6473183,
      "end": 6473643
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutAddons.ftl",
      "start": 6473643,
      "end": 6500491
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutCompat.ftl",
      "start": 6500491,
      "end": 6501476
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutGlean.ftl",
      "start": 6501476,
      "end": 6513865
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutHttpsOnlyError.ftl",
      "start": 6513865,
      "end": 6515750
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutLogging.ftl",
      "start": 6515750,
      "end": 6523486
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutMozilla.ftl",
      "start": 6523486,
      "end": 6524164
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutNetworking.ftl",
      "start": 6524164,
      "end": 6526618
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutPDF.ftl",
      "start": 6526618,
      "end": 6527752
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutProcesses.ftl",
      "start": 6527752,
      "end": 6535936
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutProfiles.ftl",
      "start": 6535936,
      "end": 6539343
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutReader.ftl",
      "start": 6539343,
      "end": 6542532
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutServiceWorkers.ftl",
      "start": 6542532,
      "end": 6544127
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutSupport.ftl",
      "start": 6544127,
      "end": 6563083
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutTelemetry.ftl",
      "start": 6563083,
      "end": 6570959
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutThirdParty.ftl",
      "start": 6570959,
      "end": 6574462
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutTranslations.ftl",
      "start": 6574462,
      "end": 6578824
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutWebauthn.ftl",
      "start": 6578824,
      "end": 6588775
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutWebrtc.ftl",
      "start": 6588775,
      "end": 6602510
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/aboutWindowsMessages.ftl",
      "start": 6602510,
      "end": 6603520
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/certviewer.ftl",
      "start": 6603520,
      "end": 6609176
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/config.ftl",
      "start": 6609176,
      "end": 6611195
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/about/url-classifier.ftl",
      "start": 6611195,
      "end": 6614009
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/branding/brandings.ftl",
      "start": 6614009,
      "end": 6616233
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/contentanalysis/contentanalysis.ftl",
      "start": 6616233,
      "end": 6623304
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/downloads/downloadUI.ftl",
      "start": 6623304,
      "end": 6625702
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/downloads/downloadUtils.ftl",
      "start": 6625702,
      "end": 6628876
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/firefoxlabs/features.ftl",
      "start": 6628876,
      "end": 6636705
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/formautofill/formAutofill.ftl",
      "start": 6636705,
      "end": 6640769
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/alert.ftl",
      "start": 6640769,
      "end": 6641144
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/antiTracking.ftl",
      "start": 6641144,
      "end": 6642413
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/appPicker.ftl",
      "start": 6642413,
      "end": 6642815
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/arrowscrollbox.ftl",
      "start": 6642815,
      "end": 6643946
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/browser-utils.ftl",
      "start": 6643946,
      "end": 6644688
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/commonDialog.ftl",
      "start": 6644688,
      "end": 6645422
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/contextual-identity.ftl",
      "start": 6645422,
      "end": 6647513
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/cookieBannerHandling.ftl",
      "start": 6647513,
      "end": 6647819
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/createProfileWizard.ftl",
      "start": 6647819,
      "end": 6649868
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/cspErrors.ftl",
      "start": 6649868,
      "end": 6651726
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/datetimebox.ftl",
      "start": 6651726,
      "end": 6652826
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/datetimepicker.ftl",
      "start": 6652826,
      "end": 6656178
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/extensionPermissions.ftl",
      "start": 6656178,
      "end": 6661747
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/extensions.ftl",
      "start": 6661747,
      "end": 6670988
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/handlerDialog.ftl",
      "start": 6670988,
      "end": 6675932
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/htmlForm.ftl",
      "start": 6675932,
      "end": 6676869
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozBadge.ftl",
      "start": 6676869,
      "end": 6677238
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozBoxBase.ftl",
      "start": 6677238,
      "end": 6677806
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozBreadcrumbGroup.ftl",
      "start": 6677806,
      "end": 6678214
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozButton.ftl",
      "start": 6678214,
      "end": 6678497
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozFiveStar.ftl",
      "start": 6678497,
      "end": 6679252
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozInputFolder.ftl",
      "start": 6679252,
      "end": 6679677
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozMessageBar.ftl",
      "start": 6679677,
      "end": 6680133
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozPageHeader.ftl",
      "start": 6680133,
      "end": 6680378
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/mozSupportLink.ftl",
      "start": 6680378,
      "end": 6680613
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/notification.ftl",
      "start": 6680613,
      "end": 6681194
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/popupnotification.ftl",
      "start": 6681194,
      "end": 6681581
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/processTypes.ftl",
      "start": 6681581,
      "end": 6683767
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/profileDowngrade.ftl",
      "start": 6683767,
      "end": 6684956
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/profileSelection.ftl",
      "start": 6684956,
      "end": 6686539
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/resetProfile.ftl",
      "start": 6686539,
      "end": 6687376
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/resistFingerPrinting.ftl",
      "start": 6687376,
      "end": 6687803
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/run-from-dmg.ftl",
      "start": 6687803,
      "end": 6689401
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/textActions.ftl",
      "start": 6689401,
      "end": 6692247
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/tree.ftl",
      "start": 6692247,
      "end": 6692515
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/unknownContentType.ftl",
      "start": 6692515,
      "end": 6693905
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/videocontrols.ftl",
      "start": 6693905,
      "end": 6697413
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/global/wizard.ftl",
      "start": 6697413,
      "end": 6698259
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/intl/languageNames.ftl",
      "start": 6698259,
      "end": 6704334
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/intl/regionNames.ftl",
      "start": 6704334,
      "end": 6712369
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/main-window/autocomplete.ftl",
      "start": 6712369,
      "end": 6713260
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/main-window/findbar.ftl",
      "start": 6713260,
      "end": 6715490
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/neterror/certError.ftl",
      "start": 6715490,
      "end": 6738319
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/neterror/netError.ftl",
      "start": 6738319,
      "end": 6756983
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/neterror/nsserrors.ftl",
      "start": 6756983,
      "end": 6787853
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/passwordmgr/passwordmgr.ftl",
      "start": 6787853,
      "end": 6789342
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/payments/payments.ftl",
      "start": 6789342,
      "end": 6791354
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/pdfviewer/viewer.ftl",
      "start": 6791354,
      "end": 6821154
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/pictureinpicture/pictureinpicture.ftl",
      "start": 6821154,
      "end": 6823616
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/preferences/preferences.ftl",
      "start": 6823616,
      "end": 6825940
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/printing/printDialogs.ftl",
      "start": 6825940,
      "end": 6828472
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/printing/printPreview.ftl",
      "start": 6828472,
      "end": 6830599
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/printing/printUI.ftl",
      "start": 6830599,
      "end": 6835749
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/updates/backgroundupdate.ftl",
      "start": 6835749,
      "end": 6836346
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/updates/elevation.ftl",
      "start": 6836346,
      "end": 6837764
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/updates/history.ftl",
      "start": 6837764,
      "end": 6838720
    }, {
      "filename": "/gre-baked/localization/en-US/toolkit/webauthnDialog.ftl",
      "start": 6838720,
      "end": 6843524
    }, {
      "filename": "/gre-baked/modules/AboutCertViewerChild.sys.mjs",
      "start": 6843524,
      "end": 6843873
    }, {
      "filename": "/gre-baked/modules/AboutCertViewerParent.sys.mjs",
      "start": 6843873,
      "end": 6844990
    }, {
      "filename": "/gre-baked/modules/AboutPagesUtils.sys.mjs",
      "start": 6844990,
      "end": 6845979
    }, {
      "filename": "/gre-baked/modules/AbuseReporter.sys.mjs",
      "start": 6845979,
      "end": 6853922
    }, {
      "filename": "/gre-baked/modules/ActorManagerParent.sys.mjs",
      "start": 6853922,
      "end": 6877517
    }, {
      "filename": "/gre-baked/modules/AppConstants.sys.mjs",
      "start": 6877517,
      "end": 6883535
    }, {
      "filename": "/gre-baked/modules/AppMenuNotifications.sys.mjs",
      "start": 6883535,
      "end": 6888862
    }, {
      "filename": "/gre-baked/modules/AppServicesTracing.sys.mjs",
      "start": 6888862,
      "end": 6901528
    }, {
      "filename": "/gre-baked/modules/AsyncPrefs.sys.mjs",
      "start": 6901528,
      "end": 6907005
    }, {
      "filename": "/gre-baked/modules/AsyncShutdown.sys.mjs",
      "start": 6907005,
      "end": 6943893
    }, {
      "filename": "/gre-baked/modules/AutoCompleteSimpleSearch.sys.mjs",
      "start": 6943893,
      "end": 6945092
    }, {
      "filename": "/gre-baked/modules/BHRTelemetryService.sys.mjs",
      "start": 6945092,
      "end": 6950402
    }, {
      "filename": "/gre-baked/modules/BTPRemoteExceptionList.sys.mjs",
      "start": 6950402,
      "end": 6953280
    }, {
      "filename": "/gre-baked/modules/BackgroundPageThumbs.sys.mjs",
      "start": 6953280,
      "end": 6978734
    }, {
      "filename": "/gre-baked/modules/BinarySearch.sys.mjs",
      "start": 6978734,
      "end": 6981332
    }, {
      "filename": "/gre-baked/modules/Bits.sys.mjs",
      "start": 6981332,
      "end": 7006696
    }, {
      "filename": "/gre-baked/modules/Blocklist.sys.mjs",
      "start": 7006696,
      "end": 7060855
    }, {
      "filename": "/gre-baked/modules/BookmarkHTMLUtils.sys.mjs",
      "start": 7060855,
      "end": 7095977
    }, {
      "filename": "/gre-baked/modules/BookmarkJSONUtils.sys.mjs",
      "start": 7095977,
      "end": 7114342
    }, {
      "filename": "/gre-baked/modules/BookmarkList.sys.mjs",
      "start": 7114342,
      "end": 7121867
    }, {
      "filename": "/gre-baked/modules/Bookmarks.sys.mjs",
      "start": 7121867,
      "end": 7238836
    }, {
      "filename": "/gre-baked/modules/BreachAlertStore.sys.mjs",
      "start": 7238836,
      "end": 7241928
    }, {
      "filename": "/gre-baked/modules/BrowserTelemetryUtils.sys.mjs",
      "start": 7241928,
      "end": 7244163
    }, {
      "filename": "/gre-baked/modules/BrowserUtils.sys.mjs",
      "start": 7244163,
      "end": 7277912
    }, {
      "filename": "/gre-baked/modules/CSV.sys.mjs",
      "start": 7277912,
      "end": 7281347
    }, {
      "filename": "/gre-baked/modules/CanonicalJSON.sys.mjs",
      "start": 7281347,
      "end": 7283560
    }, {
      "filename": "/gre-baked/modules/CanvasHashData.sys.mjs",
      "start": 7283560,
      "end": 7325824
    }, {
      "filename": "/gre-baked/modules/CaptchaDetectionPingUtils.sys.mjs",
      "start": 7325824,
      "end": 7333209
    }, {
      "filename": "/gre-baked/modules/CaptchaResponseObserver.sys.mjs",
      "start": 7333209,
      "end": 7337043
    }, {
      "filename": "/gre-baked/modules/CaptiveDetect.sys.mjs",
      "start": 7337043,
      "end": 7354348
    }, {
      "filename": "/gre-baked/modules/CertUtils.sys.mjs",
      "start": 7354348,
      "end": 7357028
    }, {
      "filename": "/gre-baked/modules/ChromePushSubscription.sys.mjs",
      "start": 7357028,
      "end": 7359531
    }, {
      "filename": "/gre-baked/modules/ClearBySiteEntry.sys.mjs",
      "start": 7359531,
      "end": 7360237
    }, {
      "filename": "/gre-baked/modules/ClearDataService.sys.mjs",
      "start": 7360237,
      "end": 7442712
    }, {
      "filename": "/gre-baked/modules/ClientID.sys.mjs",
      "start": 7442712,
      "end": 7474163
    }, {
      "filename": "/gre-baked/modules/ClipboardContextMenu.sys.mjs",
      "start": 7474163,
      "end": 7480600
    }, {
      "filename": "/gre-baked/modules/Color.sys.mjs",
      "start": 7480600,
      "end": 7484298
    }, {
      "filename": "/gre-baked/modules/ColorwayThemeMigration.sys.mjs",
      "start": 7484298,
      "end": 7487453
    }, {
      "filename": "/gre-baked/modules/CommonDialog.sys.mjs",
      "start": 7487453,
      "end": 7499049
    }, {
      "filename": "/gre-baked/modules/ComponentUtils.sys.mjs",
      "start": 7499049,
      "end": 7500039
    }, {
      "filename": "/gre-baked/modules/ConduitsChild.sys.mjs",
      "start": 7500039,
      "end": 7506421
    }, {
      "filename": "/gre-baked/modules/ConduitsParent.sys.mjs",
      "start": 7506421,
      "end": 7522121
    }, {
      "filename": "/gre-baked/modules/Console.sys.mjs",
      "start": 7522121,
      "end": 7544691
    }, {
      "filename": "/gre-baked/modules/ConsoleAPIStorage.sys.mjs",
      "start": 7544691,
      "end": 7552014
    }, {
      "filename": "/gre-baked/modules/ContentAnalysisUtils.sys.mjs",
      "start": 7552014,
      "end": 7556433
    }, {
      "filename": "/gre-baked/modules/ContentAreaDropListener.sys.mjs",
      "start": 7556433,
      "end": 7567242
    }, {
      "filename": "/gre-baked/modules/ContentBlockingAllowList.sys.mjs",
      "start": 7567242,
      "end": 7570568
    }, {
      "filename": "/gre-baked/modules/ContentClassifierRemoteSettingsClient.sys.mjs",
      "start": 7570568,
      "end": 7575783
    }, {
      "filename": "/gre-baked/modules/ContentDOMReference.sys.mjs",
      "start": 7575783,
      "end": 7581287
    }, {
      "filename": "/gre-baked/modules/ContentDispatchChooser.sys.mjs",
      "start": 7581287,
      "end": 7596210
    }, {
      "filename": "/gre-baked/modules/ContentPrefService2.sys.mjs",
      "start": 7596210,
      "end": 7643647
    }, {
      "filename": "/gre-baked/modules/ContentPrefServiceChild.sys.mjs",
      "start": 7643647,
      "end": 7648442
    }, {
      "filename": "/gre-baked/modules/ContentPrefServiceParent.sys.mjs",
      "start": 7648442,
      "end": 7653029
    }, {
      "filename": "/gre-baked/modules/ContentPrefStore.sys.mjs",
      "start": 7653029,
      "end": 7656033
    }, {
      "filename": "/gre-baked/modules/ContentPrefUtils.sys.mjs",
      "start": 7656033,
      "end": 7657926
    }, {
      "filename": "/gre-baked/modules/ContentRelevancyManager.sys.mjs",
      "start": 7657926,
      "end": 7674667
    }, {
      "filename": "/gre-baked/modules/ContextualIdentityService.sys.mjs",
      "start": 7674667,
      "end": 7700240
    }, {
      "filename": "/gre-baked/modules/CookieBannerListService.sys.mjs",
      "start": 7700240,
      "end": 7710620
    }, {
      "filename": "/gre-baked/modules/CoveragePing.sys.mjs",
      "start": 7710620,
      "end": 7716006
    }, {
      "filename": "/gre-baked/modules/CrashMonitor.sys.mjs",
      "start": 7716006,
      "end": 7723900
    }, {
      "filename": "/gre-baked/modules/CredentialChooserService.sys.mjs",
      "start": 7723900,
      "end": 7731667
    }, {
      "filename": "/gre-baked/modules/Credentials.sys.mjs",
      "start": 7731667,
      "end": 7735740
    }, {
      "filename": "/gre-baked/modules/CreditCard.sys.mjs",
      "start": 7735740,
      "end": 7749966
    }, {
      "filename": "/gre-baked/modules/CustomElementsListener.sys.mjs",
      "start": 7749966,
      "end": 7751099
    }, {
      "filename": "/gre-baked/modules/DAPIncrementality.sys.mjs",
      "start": 7751099,
      "end": 7759688
    }, {
      "filename": "/gre-baked/modules/DAPReportController.sys.mjs",
      "start": 7759688,
      "end": 7767244
    }, {
      "filename": "/gre-baked/modules/DAPSender.sys.mjs",
      "start": 7767244,
      "end": 7777786
    }, {
      "filename": "/gre-baked/modules/DAPTelemetrySender.sys.mjs",
      "start": 7777786,
      "end": 7782493
    }, {
      "filename": "/gre-baked/modules/DAPVisitCounter.sys.mjs",
      "start": 7782493,
      "end": 7787708
    }, {
      "filename": "/gre-baked/modules/DefaultCLH.sys.mjs",
      "start": 7787708,
      "end": 7790865
    }, {
      "filename": "/gre-baked/modules/DeferredTask.sys.mjs",
      "start": 7790865,
      "end": 7806417
    }, {
      "filename": "/gre-baked/modules/E10SUtils.sys.mjs",
      "start": 7806417,
      "end": 7819475
    }, {
      "filename": "/gre-baked/modules/EnterprisePolicies.sys.mjs",
      "start": 7819475,
      "end": 7820305
    }, {
      "filename": "/gre-baked/modules/EnterprisePoliciesContent.sys.mjs",
      "start": 7820305,
      "end": 7822154
    }, {
      "filename": "/gre-baked/modules/EnterprisePoliciesParent.sys.mjs",
      "start": 7822154,
      "end": 7848086
    }, {
      "filename": "/gre-baked/modules/EssentialDomainsRemoteSettings.sys.mjs",
      "start": 7848086,
      "end": 7852048
    }, {
      "filename": "/gre-baked/modules/EventEmitter.sys.mjs",
      "start": 7852048,
      "end": 7857611
    }, {
      "filename": "/gre-baked/modules/EventPing.sys.mjs",
      "start": 7857611,
      "end": 7864781
    }, {
      "filename": "/gre-baked/modules/ExtHandlerService.sys.mjs",
      "start": 7864781,
      "end": 7891284
    }, {
      "filename": "/gre-baked/modules/FileUtils.sys.mjs",
      "start": 7891284,
      "end": 7895513
    }, {
      "filename": "/gre-baked/modules/FillHelpers.sys.mjs",
      "start": 7895513,
      "end": 7897113
    }, {
      "filename": "/gre-baked/modules/FindBarContent.sys.mjs",
      "start": 7897113,
      "end": 7899897
    }, {
      "filename": "/gre-baked/modules/FindContent.sys.mjs",
      "start": 7899897,
      "end": 7907463
    }, {
      "filename": "/gre-baked/modules/Finder.sys.mjs",
      "start": 7907463,
      "end": 7932583
    }, {
      "filename": "/gre-baked/modules/FinderHighlighter.sys.mjs",
      "start": 7932583,
      "end": 8005371
    }, {
      "filename": "/gre-baked/modules/FinderIterator.sys.mjs",
      "start": 8005371,
      "end": 8034851
    }, {
      "filename": "/gre-baked/modules/FinderParent.sys.mjs",
      "start": 8034851,
      "end": 8052002
    }, {
      "filename": "/gre-baked/modules/FinderSound.sys.mjs",
      "start": 8052002,
      "end": 8053469
    }, {
      "filename": "/gre-baked/modules/FingerprintingWebCompatService.sys.mjs",
      "start": 8053469,
      "end": 8062831
    }, {
      "filename": "/gre-baked/modules/FirefoxRelay.sys.mjs",
      "start": 8062831,
      "end": 8101816
    }, {
      "filename": "/gre-baked/modules/FirefoxRelayUtils.sys.mjs",
      "start": 8101816,
      "end": 8102559
    }, {
      "filename": "/gre-baked/modules/FirstStartup.sys.mjs",
      "start": 8102559,
      "end": 8109302
    }, {
      "filename": "/gre-baked/modules/ForgetAboutSite.sys.mjs",
      "start": 8109302,
      "end": 8110932
    }, {
      "filename": "/gre-baked/modules/FormHistory.sys.mjs",
      "start": 8110932,
      "end": 8153056
    }, {
      "filename": "/gre-baked/modules/FormHistoryAutoComplete.sys.mjs",
      "start": 8153056,
      "end": 8157089
    }, {
      "filename": "/gre-baked/modules/FormHistoryStartup.sys.mjs",
      "start": 8157089,
      "end": 8158173
    }, {
      "filename": "/gre-baked/modules/FormLikeFactory.sys.mjs",
      "start": 8158173,
      "end": 8167149
    }, {
      "filename": "/gre-baked/modules/FormScenarios.sys.mjs",
      "start": 8167149,
      "end": 8170029
    }, {
      "filename": "/gre-baked/modules/GMPExtractor.worker.js",
      "start": 8170029,
      "end": 8173620
    }, {
      "filename": "/gre-baked/modules/GMPInstallManager.sys.mjs",
      "start": 8173620,
      "end": 8206062
    }, {
      "filename": "/gre-baked/modules/GMPUtils.sys.mjs",
      "start": 8206062,
      "end": 8216269
    }, {
      "filename": "/gre-baked/modules/Geometry.sys.mjs",
      "start": 8216269,
      "end": 8225446
    }, {
      "filename": "/gre-baked/modules/HPKEConfigManager.sys.mjs",
      "start": 8225446,
      "end": 8227949
    }, {
      "filename": "/gre-baked/modules/HealthPing.sys.mjs",
      "start": 8227949,
      "end": 8235641
    }, {
      "filename": "/gre-baked/modules/HelperAppDlg.sys.mjs",
      "start": 8235641,
      "end": 8283611
    }, {
      "filename": "/gre-baked/modules/HiddenFrame.sys.mjs",
      "start": 8283611,
      "end": 8290021
    }, {
      "filename": "/gre-baked/modules/History.sys.mjs",
      "start": 8290021,
      "end": 8347005
    }, {
      "filename": "/gre-baked/modules/IdentityCredentialPromptService.sys.mjs",
      "start": 8347005,
      "end": 8366028
    }, {
      "filename": "/gre-baked/modules/IgnoreLists.sys.mjs",
      "start": 8366028,
      "end": 8369585
    }, {
      "filename": "/gre-baked/modules/ImageObjectProcessor.sys.mjs",
      "start": 8369585,
      "end": 8376283
    }, {
      "filename": "/gre-baked/modules/IndexedDB.sys.mjs",
      "start": 8376283,
      "end": 8387519
    }, {
      "filename": "/gre-baked/modules/IndexedDBHelper.sys.mjs",
      "start": 8387519,
      "end": 8394362
    }, {
      "filename": "/gre-baked/modules/InlineSpellChecker.sys.mjs",
      "start": 8394362,
      "end": 8413315
    }, {
      "filename": "/gre-baked/modules/InlineSpellCheckerContent.sys.mjs",
      "start": 8413315,
      "end": 8416606
    }, {
      "filename": "/gre-baked/modules/InsecurePasswordUtils.sys.mjs",
      "start": 8416606,
      "end": 8423221
    }, {
      "filename": "/gre-baked/modules/Integration.sys.mjs",
      "start": 8423221,
      "end": 8433818
    }, {
      "filename": "/gre-baked/modules/JSONFile.sys.mjs",
      "start": 8433818,
      "end": 8450989
    }, {
      "filename": "/gre-baked/modules/JsonSchema.sys.mjs",
      "start": 8450989,
      "end": 8456526
    }, {
      "filename": "/gre-baked/modules/KeyboardLockUtils.sys.mjs",
      "start": 8456526,
      "end": 8457904
    }, {
      "filename": "/gre-baked/modules/KeywordUtils.sys.mjs",
      "start": 8457904,
      "end": 8461143
    }, {
      "filename": "/gre-baked/modules/LangPackMatcher.sys.mjs",
      "start": 8461143,
      "end": 8474142
    }, {
      "filename": "/gre-baked/modules/LightweightThemeConsumer.sys.mjs",
      "start": 8474142,
      "end": 8500194
    }, {
      "filename": "/gre-baked/modules/LightweightThemeManager.sys.mjs",
      "start": 8500194,
      "end": 8509856
    }, {
      "filename": "/gre-baked/modules/LocationHelper.sys.mjs",
      "start": 8509856,
      "end": 8511164
    }, {
      "filename": "/gre-baked/modules/Log.sys.mjs",
      "start": 8511164,
      "end": 8530564
    }, {
      "filename": "/gre-baked/modules/LogManager.sys.mjs",
      "start": 8530564,
      "end": 8546953
    }, {
      "filename": "/gre-baked/modules/LoginAutoComplete.sys.mjs",
      "start": 8546953,
      "end": 8559270
    }, {
      "filename": "/gre-baked/modules/LoginCSVImport.sys.mjs",
      "start": 8559270,
      "end": 8565591
    }, {
      "filename": "/gre-baked/modules/LoginExport.sys.mjs",
      "start": 8565591,
      "end": 8567717
    }, {
      "filename": "/gre-baked/modules/LoginHelper.sys.mjs",
      "start": 8567717,
      "end": 8631078
    }, {
      "filename": "/gre-baked/modules/LoginInfo.sys.mjs",
      "start": 8631078,
      "end": 8634616
    }, {
      "filename": "/gre-baked/modules/LoginManager.shared.sys.mjs",
      "start": 8634616,
      "end": 8643869
    }, {
      "filename": "/gre-baked/modules/LoginManager.sys.mjs",
      "start": 8643869,
      "end": 8660088
    }, {
      "filename": "/gre-baked/modules/LoginManagerAuthPrompter.sys.mjs",
      "start": 8660088,
      "end": 8692491
    }, {
      "filename": "/gre-baked/modules/LoginManagerChild.sys.mjs",
      "start": 8692491,
      "end": 8807025
    }, {
      "filename": "/gre-baked/modules/LoginManagerContextMenu.sys.mjs",
      "start": 8807025,
      "end": 8814336
    }, {
      "filename": "/gre-baked/modules/LoginManagerParent.sys.mjs",
      "start": 8814336,
      "end": 8866481
    }, {
      "filename": "/gre-baked/modules/LoginManagerPrompter.sys.mjs",
      "start": 8866481,
      "end": 8902611
    }, {
      "filename": "/gre-baked/modules/LoginManagerRustMirror.sys.mjs",
      "start": 8902611,
      "end": 8917763
    }, {
      "filename": "/gre-baked/modules/LoginRecipes.sys.mjs",
      "start": 8917763,
      "end": 8929378
    }, {
      "filename": "/gre-baked/modules/LoginRelatedRealms.sys.mjs",
      "start": 8929378,
      "end": 8932917
    }, {
      "filename": "/gre-baked/modules/LoginStore.sys.mjs",
      "start": 8932917,
      "end": 8938736
    }, {
      "filename": "/gre-baked/modules/MainProcessSingleton.sys.mjs",
      "start": 8938736,
      "end": 8939577
    }, {
      "filename": "/gre-baked/modules/Manifest.sys.mjs",
      "start": 8939577,
      "end": 8947734
    }, {
      "filename": "/gre-baked/modules/ManifestFinder.sys.mjs",
      "start": 8947734,
      "end": 8949540
    }, {
      "filename": "/gre-baked/modules/ManifestIcons.sys.mjs",
      "start": 8949540,
      "end": 8952254
    }, {
      "filename": "/gre-baked/modules/ManifestMessagesChild.sys.mjs",
      "start": 8952254,
      "end": 8955483
    }, {
      "filename": "/gre-baked/modules/ManifestObtainer.sys.mjs",
      "start": 8955483,
      "end": 8960897
    }, {
      "filename": "/gre-baked/modules/ManifestProcessor.sys.mjs",
      "start": 8960897,
      "end": 8970983
    }, {
      "filename": "/gre-baked/modules/MatchURLFilters.sys.mjs",
      "start": 8970983,
      "end": 8976190
    }, {
      "filename": "/gre-baked/modules/MessageManagerProxy.sys.mjs",
      "start": 8976190,
      "end": 8982452
    }, {
      "filename": "/gre-baked/modules/MozProtocolHandler.sys.mjs",
      "start": 8982452,
      "end": 8983547
    }, {
      "filename": "/gre-baked/modules/NLP.sys.mjs",
      "start": 8983547,
      "end": 8985512
    }, {
      "filename": "/gre-baked/modules/NativeManifests.sys.mjs",
      "start": 8985512,
      "end": 8992169
    }, {
      "filename": "/gre-baked/modules/NativeMessaging.sys.mjs",
      "start": 8992169,
      "end": 9007221
    }, {
      "filename": "/gre-baked/modules/NetUtil.sys.mjs",
      "start": 9007221,
      "end": 9022134
    }, {
      "filename": "/gre-baked/modules/NetworkErrorLogging.sys.mjs",
      "start": 9022134,
      "end": 9036214
    }, {
      "filename": "/gre-baked/modules/NetworkGeolocationProvider.sys.mjs",
      "start": 9036214,
      "end": 9048399
    }, {
      "filename": "/gre-baked/modules/NewTabUtils.sys.mjs",
      "start": 9048399,
      "end": 9112635
    }, {
      "filename": "/gre-baked/modules/OSKeyStore.sys.mjs",
      "start": 9112635,
      "end": 9127081
    }, {
      "filename": "/gre-baked/modules/ObjectUtils.sys.mjs",
      "start": 9127081,
      "end": 9132960
    }, {
      "filename": "/gre-baked/modules/ObliviousHTTP.sys.mjs",
      "start": 9132960,
      "end": 9140491
    }, {
      "filename": "/gre-baked/modules/OsEnvironment.sys.mjs",
      "start": 9140491,
      "end": 9143362
    }, {
      "filename": "/gre-baked/modules/PageThumbUtils.sys.mjs",
      "start": 9143362,
      "end": 9158310
    }, {
      "filename": "/gre-baked/modules/PageThumbs.sys.mjs",
      "start": 9158310,
      "end": 9189606
    }, {
      "filename": "/gre-baked/modules/PageThumbs.worker.js",
      "start": 9189606,
      "end": 9193841
    }, {
      "filename": "/gre-baked/modules/PageThumbsStorageService.sys.mjs",
      "start": 9193841,
      "end": 9195530
    }, {
      "filename": "/gre-baked/modules/PartitioningExceptionListService.sys.mjs",
      "start": 9195530,
      "end": 9199601
    }, {
      "filename": "/gre-baked/modules/PasswordRulesManager.sys.mjs",
      "start": 9199601,
      "end": 9202611
    }, {
      "filename": "/gre-baked/modules/PermissionsUtils.sys.mjs",
      "start": 9202611,
      "end": 9206060
    }, {
      "filename": "/gre-baked/modules/PictureInPicture.sys.mjs",
      "start": 9206060,
      "end": 9265328
    }, {
      "filename": "/gre-baked/modules/PictureInPictureControls.sys.mjs",
      "start": 9265328,
      "end": 9266499
    }, {
      "filename": "/gre-baked/modules/PlacesBackups.sys.mjs",
      "start": 9266499,
      "end": 9283768
    }, {
      "filename": "/gre-baked/modules/PlacesDBUtils.sys.mjs",
      "start": 9283768,
      "end": 9337307
    }, {
      "filename": "/gre-baked/modules/PlacesExpiration.sys.mjs",
      "start": 9337307,
      "end": 9371044
    }, {
      "filename": "/gre-baked/modules/PlacesFrecencyRecalculator.sys.mjs",
      "start": 9371044,
      "end": 9399163
    }, {
      "filename": "/gre-baked/modules/PlacesPreviews.sys.mjs",
      "start": 9399163,
      "end": 9413535
    }, {
      "filename": "/gre-baked/modules/PlacesQuery.sys.mjs",
      "start": 9413535,
      "end": 9433298
    }, {
      "filename": "/gre-baked/modules/PlacesSemanticHistoryDatabase.sys.mjs",
      "start": 9433298,
      "end": 9452696
    }, {
      "filename": "/gre-baked/modules/PlacesSemanticHistoryManager.sys.mjs",
      "start": 9452696,
      "end": 9489397
    }, {
      "filename": "/gre-baked/modules/PlacesSyncUtils.sys.mjs",
      "start": 9489397,
      "end": 9561713
    }, {
      "filename": "/gre-baked/modules/PlacesTransactions.sys.mjs",
      "start": 9561713,
      "end": 9618001
    }, {
      "filename": "/gre-baked/modules/PlacesUtils.sys.mjs",
      "start": 9618001,
      "end": 9721247
    }, {
      "filename": "/gre-baked/modules/PopupNotifications.sys.mjs",
      "start": 9721247,
      "end": 9796207
    }, {
      "filename": "/gre-baked/modules/Preferences.sys.mjs",
      "start": 9796207,
      "end": 9810474
    }, {
      "filename": "/gre-baked/modules/PrincipalsCollector.sys.mjs",
      "start": 9810474,
      "end": 9816681
    }, {
      "filename": "/gre-baked/modules/PrivateAttributionService.sys.mjs",
      "start": 9816681,
      "end": 9825087
    }, {
      "filename": "/gre-baked/modules/PrivateBrowsingUtils.sys.mjs",
      "start": 9825087,
      "end": 9827549
    }, {
      "filename": "/gre-baked/modules/ProcessType.sys.mjs",
      "start": 9827549,
      "end": 9829374
    }, {
      "filename": "/gre-baked/modules/ProfileAge.sys.mjs",
      "start": 9829374,
      "end": 9836322
    }, {
      "filename": "/gre-baked/modules/PromiseWorker.sys.mjs",
      "start": 9836322,
      "end": 9851256
    }, {
      "filename": "/gre-baked/modules/PromptUtils.sys.mjs",
      "start": 9851256,
      "end": 9858285
    }, {
      "filename": "/gre-baked/modules/Prompter.sys.mjs",
      "start": 9858285,
      "end": 9922166
    }, {
      "filename": "/gre-baked/modules/ProxyChannelFilter.sys.mjs",
      "start": 9922166,
      "end": 9936080
    }, {
      "filename": "/gre-baked/modules/PurgeTrackerService.sys.mjs",
      "start": 9936080,
      "end": 9952634
    }, {
      "filename": "/gre-baked/modules/Push.sys.mjs",
      "start": 9952634,
      "end": 9962178
    }, {
      "filename": "/gre-baked/modules/PushBroadcastService.sys.mjs",
      "start": 9962178,
      "end": 9970873
    }, {
      "filename": "/gre-baked/modules/PushComponents.sys.mjs",
      "start": 9970873,
      "end": 9983842
    }, {
      "filename": "/gre-baked/modules/PushCrypto.sys.mjs",
      "start": 9983842,
      "end": 10009632
    }, {
      "filename": "/gre-baked/modules/PushDB.sys.mjs",
      "start": 10009632,
      "end": 10022609
    }, {
      "filename": "/gre-baked/modules/PushRecord.sys.mjs",
      "start": 10022609,
      "end": 10031980
    }, {
      "filename": "/gre-baked/modules/PushService.sys.mjs",
      "start": 10031980,
      "end": 10080695
    }, {
      "filename": "/gre-baked/modules/PushServiceWebSocket.sys.mjs",
      "start": 10080695,
      "end": 10118936
    }, {
      "filename": "/gre-baked/modules/RFPHelper.sys.mjs",
      "start": 10118936,
      "end": 10141456
    }, {
      "filename": "/gre-baked/modules/RFPTargetConstants.sys.mjs",
      "start": 10141456,
      "end": 10146698
    }, {
      "filename": "/gre-baked/modules/Readerable.sys.mjs",
      "start": 10146698,
      "end": 10153808
    }, {
      "filename": "/gre-baked/modules/Region.sys.mjs",
      "start": 10153808,
      "end": 10180499
    }, {
      "filename": "/gre-baked/modules/RemotePageAccessManager.sys.mjs",
      "start": 10180499,
      "end": 10194930
    }, {
      "filename": "/gre-baked/modules/RemotePermissionService.sys.mjs",
      "start": 10194930,
      "end": 10201034
    }, {
      "filename": "/gre-baked/modules/RemoteWebNavigation.sys.mjs",
      "start": 10201034,
      "end": 10207872
    }, {
      "filename": "/gre-baked/modules/ResetProfile.sys.mjs",
      "start": 10207872,
      "end": 10212096
    }, {
      "filename": "/gre-baked/modules/RustSharedRemoteSettingsService.sys.mjs",
      "start": 10212096,
      "end": 10217730
    }, {
      "filename": "/gre-baked/modules/SafeBrowsing.sys.mjs",
      "start": 10217730,
      "end": 10236106
    }, {
      "filename": "/gre-baked/modules/ScheduledTask.sys.mjs",
      "start": 10236106,
      "end": 10239933
    }, {
      "filename": "/gre-baked/modules/SearchSuggestions.sys.mjs",
      "start": 10239933,
      "end": 10253300
    }, {
      "filename": "/gre-baked/modules/SecurityInfo.sys.mjs",
      "start": 10253300,
      "end": 10265602
    }, {
      "filename": "/gre-baked/modules/SelectionUtils.sys.mjs",
      "start": 10265602,
      "end": 10271007
    }, {
      "filename": "/gre-baked/modules/ServiceRequest.sys.mjs",
      "start": 10271007,
      "end": 10275649
    }, {
      "filename": "/gre-baked/modules/ServiceWorkerCleanUp.sys.mjs",
      "start": 10275649,
      "end": 10278475
    }, {
      "filename": "/gre-baked/modules/ShieldContentProcess.sys.mjs",
      "start": 10278475,
      "end": 10279077
    }, {
      "filename": "/gre-baked/modules/ShortcutUtils.sys.mjs",
      "start": 10279077,
      "end": 10293756
    }, {
      "filename": "/gre-baked/modules/SignUpFormRuleset.sys.mjs",
      "start": 10293756,
      "end": 10314568
    }, {
      "filename": "/gre-baked/modules/SimpleServices.sys.mjs",
      "start": 10314568,
      "end": 10320650
    }, {
      "filename": "/gre-baked/modules/SimpleURIUnknownSchemesRemoteObserver.sys.mjs",
      "start": 10320650,
      "end": 10324783
    }, {
      "filename": "/gre-baked/modules/SitePolicyUtils.sys.mjs",
      "start": 10324783,
      "end": 10325850
    }, {
      "filename": "/gre-baked/modules/SlowScriptDebug.sys.mjs",
      "start": 10325850,
      "end": 10326544
    }, {
      "filename": "/gre-baked/modules/Sqlite.sys.mjs",
      "start": 10326544,
      "end": 10401030
    }, {
      "filename": "/gre-baked/modules/SubDialog.sys.mjs",
      "start": 10401030,
      "end": 10439918
    }, {
      "filename": "/gre-baked/modules/Subprocess.sys.mjs",
      "start": 10439918,
      "end": 10447081
    }, {
      "filename": "/gre-baked/modules/SyncedBookmarksMirror.sys.mjs",
      "start": 10447081,
      "end": 10536398
    }, {
      "filename": "/gre-baked/modules/TaggingService.sys.mjs",
      "start": 10536398,
      "end": 10553747
    }, {
      "filename": "/gre-baked/modules/ThirdPartyCookieBlockingExceptionListService.sys.mjs",
      "start": 10553747,
      "end": 10561143
    }, {
      "filename": "/gre-baked/modules/Timer.sys.mjs",
      "start": 10561143,
      "end": 10565535
    }, {
      "filename": "/gre-baked/modules/TooltipTextProvider.sys.mjs",
      "start": 10565535,
      "end": 10570770
    }, {
      "filename": "/gre-baked/modules/TrackingDBService.sys.mjs",
      "start": 10570770,
      "end": 10586558
    }, {
      "filename": "/gre-baked/modules/Troubleshoot.sys.mjs",
      "start": 10586558,
      "end": 10622859
    }, {
      "filename": "/gre-baked/modules/URIFixup.sys.mjs",
      "start": 10622859,
      "end": 10664207
    }, {
      "filename": "/gre-baked/modules/URLDecorationAnnotationsService.sys.mjs",
      "start": 10664207,
      "end": 10666222
    }, {
      "filename": "/gre-baked/modules/URLFormatter.sys.mjs",
      "start": 10666222,
      "end": 10671740
    }, {
      "filename": "/gre-baked/modules/URLQueryStrippingListService.sys.mjs",
      "start": 10671740,
      "end": 10685443
    }, {
      "filename": "/gre-baked/modules/UntrustedModulesPing.sys.mjs",
      "start": 10685443,
      "end": 10687627
    }, {
      "filename": "/gre-baked/modules/UpdatePing.sys.mjs",
      "start": 10687627,
      "end": 10693657
    }, {
      "filename": "/gre-baked/modules/UpdateTimerManager.sys.mjs",
      "start": 10693657,
      "end": 10706596
    }, {
      "filename": "/gre-baked/modules/UpdateUtils.sys.mjs",
      "start": 10706596,
      "end": 10743788
    }, {
      "filename": "/gre-baked/modules/UrlClassifierExceptionListService.sys.mjs",
      "start": 10743788,
      "end": 10754909
    }, {
      "filename": "/gre-baked/modules/UrlClassifierHashCompleter.sys.mjs",
      "start": 10754909,
      "end": 10790452
    }, {
      "filename": "/gre-baked/modules/UrlClassifierLib.sys.mjs",
      "start": 10790452,
      "end": 10796228
    }, {
      "filename": "/gre-baked/modules/UrlClassifierListManager.sys.mjs",
      "start": 10796228,
      "end": 10823857
    }, {
      "filename": "/gre-baked/modules/UrlClassifierRemoteSettingsService.sys.mjs",
      "start": 10823857,
      "end": 10828166
    }, {
      "filename": "/gre-baked/modules/UrlUtils.sys.mjs",
      "start": 10828166,
      "end": 10836662
    }, {
      "filename": "/gre-baked/modules/UsageReporting.sys.mjs",
      "start": 10836662,
      "end": 10843675
    }, {
      "filename": "/gre-baked/modules/UserCharacteristicsPageService.sys.mjs",
      "start": 10843675,
      "end": 10900845
    }, {
      "filename": "/gre-baked/modules/ValueExtractor.sys.mjs",
      "start": 10900845,
      "end": 10903968
    }, {
      "filename": "/gre-baked/modules/WPTEventsChild.sys.mjs",
      "start": 10903968,
      "end": 10905880
    }, {
      "filename": "/gre-baked/modules/WPTEventsParent.sys.mjs",
      "start": 10905880,
      "end": 10908982
    }, {
      "filename": "/gre-baked/modules/WebAuthnFeature.sys.mjs",
      "start": 10908982,
      "end": 10913138
    }, {
      "filename": "/gre-baked/modules/WebAuthnRelatedOriginFetcher.sys.mjs",
      "start": 10913138,
      "end": 10921183
    }, {
      "filename": "/gre-baked/modules/WebChannel.sys.mjs",
      "start": 10921183,
      "end": 10930576
    }, {
      "filename": "/gre-baked/modules/WebHandlerApp.sys.mjs",
      "start": 10930576,
      "end": 10936736
    }, {
      "filename": "/gre-baked/modules/WebNavigation.sys.mjs",
      "start": 10936736,
      "end": 10949566
    }, {
      "filename": "/gre-baked/modules/WebNavigationFrames.sys.mjs",
      "start": 10949566,
      "end": 10952636
    }, {
      "filename": "/gre-baked/modules/WebRequest.sys.mjs",
      "start": 10952636,
      "end": 10993311
    }, {
      "filename": "/gre-baked/modules/WebRequestUpload.sys.mjs",
      "start": 10993311,
      "end": 11009571
    }, {
      "filename": "/gre-baked/modules/WebVTTParserWrapper.sys.mjs",
      "start": 11009571,
      "end": 11011168
    }, {
      "filename": "/gre-baked/modules/WellKnownOpportunisticUtils.sys.mjs",
      "start": 11011168,
      "end": 11011867
    }, {
      "filename": "/gre-baked/modules/WindowsMediaFoundationCDMOriginsListService.sys.mjs",
      "start": 11011867,
      "end": 11016441
    }, {
      "filename": "/gre-baked/modules/XPCOMUtils.sys.mjs",
      "start": 11016441,
      "end": 11030355
    }, {
      "filename": "/gre-baked/modules/XULStore.sys.mjs",
      "start": 11030355,
      "end": 11039070
    }, {
      "filename": "/gre-baked/modules/amContentHandler.sys.mjs",
      "start": 11039070,
      "end": 11042343
    }, {
      "filename": "/gre-baked/modules/amManager.sys.mjs",
      "start": 11042343,
      "end": 11053324
    }, {
      "filename": "/gre-baked/modules/amWebAPI.sys.mjs",
      "start": 11053324,
      "end": 11061607
    }, {
      "filename": "/gre-baked/modules/backgroundtasks/BackgroundTask_pingsender.sys.mjs",
      "start": 11061607,
      "end": 11063070
    }, {
      "filename": "/gre-baked/modules/components-utils/ClientEnvironment.sys.mjs",
      "start": 11063070,
      "end": 11071580
    }, {
      "filename": "/gre-baked/modules/components-utils/FilterExpressions.sys.mjs",
      "start": 11071580,
      "end": 11075595
    }, {
      "filename": "/gre-baked/modules/components-utils/JsonSchemaValidator.sys.mjs",
      "start": 11075595,
      "end": 11095015
    }, {
      "filename": "/gre-baked/modules/components-utils/Sampling.sys.mjs",
      "start": 11095015,
      "end": 11101477
    }, {
      "filename": "/gre-baked/modules/components-utils/WindowsInstallsInfo.sys.mjs",
      "start": 11101477,
      "end": 11104457
    }, {
      "filename": "/gre-baked/modules/components-utils/WindowsVersionInfo.sys.mjs",
      "start": 11104457,
      "end": 11107894
    }, {
      "filename": "/gre-baked/modules/components-utils/mozjexl.sys.mjs",
      "start": 11107894,
      "end": 11121504
    }, {
      "filename": "/gre-baked/modules/contentrelevancy/private/InputUtils.sys.mjs",
      "start": 11121504,
      "end": 11125076
    }, {
      "filename": "/gre-baked/modules/crypto-SDR.sys.mjs",
      "start": 11125076,
      "end": 11133825
    }, {
      "filename": "/gre-baked/modules/extensionProcessScriptLoader.js",
      "start": 11133825,
      "end": 11134135
    }, {
      "filename": "/gre-baked/modules/handlers/HandlerList.sys.mjs",
      "start": 11134135,
      "end": 11138829
    }, {
      "filename": "/gre-baked/modules/jsdebugger.sys.mjs",
      "start": 11138829,
      "end": 11142048
    }, {
      "filename": "/gre-baked/modules/kvstore.sys.mjs",
      "start": 11142048,
      "end": 11150138
    }, {
      "filename": "/gre-baked/modules/media/IdpSandbox.sys.mjs",
      "start": 11150138,
      "end": 11158410
    }, {
      "filename": "/gre-baked/modules/media/PeerConnectionIdp.sys.mjs",
      "start": 11158410,
      "end": 11169523
    }, {
      "filename": "/gre-baked/modules/megalist/MegalistViewModel.sys.mjs",
      "start": 11169523,
      "end": 11176106
    }, {
      "filename": "/gre-baked/modules/megalist/aggregator/Aggregator.sys.mjs",
      "start": 11176106,
      "end": 11179387
    }, {
      "filename": "/gre-baked/modules/megalist/aggregator/DefaultAggregator.sys.mjs",
      "start": 11179387,
      "end": 11179962
    }, {
      "filename": "/gre-baked/modules/megalist/aggregator/datasources/DataSourceBase.sys.mjs",
      "start": 11179962,
      "end": 11189852
    }, {
      "filename": "/gre-baked/modules/megalist/aggregator/datasources/LoginDataSource.sys.mjs",
      "start": 11189852,
      "end": 11218222
    }, {
      "filename": "/gre-baked/modules/mozIntl.sys.mjs",
      "start": 11218222,
      "end": 11240183
    }, {
      "filename": "/gre-baked/modules/narrate/NarrateControls.sys.mjs",
      "start": 11240183,
      "end": 11255117
    }, {
      "filename": "/gre-baked/modules/narrate/Narrator.sys.mjs",
      "start": 11255117,
      "end": 11267757
    }, {
      "filename": "/gre-baked/modules/narrate/VoiceSelect.sys.mjs",
      "start": 11267757,
      "end": 11275422
    }, {
      "filename": "/gre-baked/modules/nsAsyncShutdown.sys.mjs",
      "start": 11275422,
      "end": 11282469
    }, {
      "filename": "/gre-baked/modules/nsCrashMonitor.sys.mjs",
      "start": 11282469,
      "end": 11283157
    }, {
      "filename": "/gre-baked/modules/pdfjs.sys.mjs",
      "start": 11283157,
      "end": 11284166
    }, {
      "filename": "/gre-baked/modules/psm/ClientAuthDialogService.sys.mjs",
      "start": 11284166,
      "end": 11289031
    }, {
      "filename": "/gre-baked/modules/psm/DER.sys.mjs",
      "start": 11289031,
      "end": 11299259
    }, {
      "filename": "/gre-baked/modules/psm/QWACs.sys.mjs",
      "start": 11299259,
      "end": 11316422
    }, {
      "filename": "/gre-baked/modules/psm/RemoteSecuritySettings.sys.mjs",
      "start": 11316422,
      "end": 11339975
    }, {
      "filename": "/gre-baked/modules/psm/X509.sys.mjs",
      "start": 11339975,
      "end": 11358302
    }, {
      "filename": "/gre-baked/modules/psm/pippki.sys.mjs",
      "start": 11358302,
      "end": 11367609
    }, {
      "filename": "/gre-baked/modules/reflect.sys.mjs",
      "start": 11367609,
      "end": 11368344
    }, {
      "filename": "/gre-baked/modules/services-automation/ServicesAutomation.sys.mjs",
      "start": 11368344,
      "end": 11379138
    }, {
      "filename": "/gre-baked/modules/sessionstore/PrivacyFilter.sys.mjs",
      "start": 11379138,
      "end": 11382854
    }, {
      "filename": "/gre-baked/modules/sessionstore/PrivacyLevel.sys.mjs",
      "start": 11382854,
      "end": 11384614
    }, {
      "filename": "/gre-baked/modules/sessionstore/SessionHistory.sys.mjs",
      "start": 11384614,
      "end": 11405814
    }, {
      "filename": "/gre-baked/modules/sessionstore/SessionStoreHelper.sys.mjs",
      "start": 11405814,
      "end": 11409140
    }, {
      "filename": "/gre-baked/modules/storage-json.sys.mjs",
      "start": 11409140,
      "end": 11448561
    }, {
      "filename": "/gre-baked/modules/storage-rust.sys.mjs",
      "start": 11448561,
      "end": 11473610
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_common.sys.mjs",
      "start": 11473610,
      "end": 11494507
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_shared.js",
      "start": 11494507,
      "end": 11497434
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_shared_unix.js",
      "start": 11497434,
      "end": 11499926
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_unix.sys.mjs",
      "start": 11499926,
      "end": 11504946
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_unix.worker.js",
      "start": 11504946,
      "end": 11522773
    }, {
      "filename": "/gre-baked/modules/subprocess/subprocess_worker_common.js",
      "start": 11522773,
      "end": 11527729
    }, {
      "filename": "/gre-baked/modules/third_party/fathom/fathom.mjs",
      "start": 11527729,
      "end": 11626327
    }, {
      "filename": "/gre-baked/modules/third_party/jsesc/jsesc.mjs",
      "start": 11626327,
      "end": 11634972
    }, {
      "filename": "/gre-baked/modules/txEXSLTRegExFunctions.sys.mjs",
      "start": 11634972,
      "end": 11635881
    }, {
      "filename": "/gre-baked/modules/vtt.sys.mjs",
      "start": 11635881,
      "end": 11692839
    }, {
      "filename": "/gre-baked/modules/workers/PromiseWorker.js",
      "start": 11692839,
      "end": 11701351
    }, {
      "filename": "/gre-baked/modules/workers/PromiseWorker.mjs",
      "start": 11701351,
      "end": 11709502
    }, {
      "filename": "/gre-baked/modules/workers/require.js",
      "start": 11709502,
      "end": 11715026
    }, {
      "filename": "/gre-baked/moz-src/dom/geolocation/GeolocationUIUtils.sys.mjs",
      "start": 11715026,
      "end": 11715914
    }, {
      "filename": "/gre-baked/moz-src/dom/notification/MemoryNotificationDB.sys.mjs",
      "start": 11715914,
      "end": 11716444
    }, {
      "filename": "/gre-baked/moz-src/dom/notification/NotificationDB.sys.mjs",
      "start": 11716444,
      "end": 11726567
    }, {
      "filename": "/gre-baked/moz-src/dom/notification/NotificationStorage.sys.mjs",
      "start": 11726567,
      "end": 11728906
    }, {
      "filename": "/gre-baked/moz-src/dom/quota/QuotaUtilsService.sys.mjs",
      "start": 11728906,
      "end": 11729733
    }, {
      "filename": "/gre-baked/moz-src/services/crypto/modules/WeaveCrypto.sys.mjs",
      "start": 11729733,
      "end": 11736090
    }, {
      "filename": "/gre-baked/moz-src/services/crypto/modules/jwcrypto.sys.mjs",
      "start": 11736090,
      "end": 11743504
    }, {
      "filename": "/gre-baked/moz-src/services/crypto/modules/utils.sys.mjs",
      "start": 11743504,
      "end": 11759915
    }, {
      "filename": "/gre-baked/moz-src/third_party/js/qrcode/qrcode.mjs",
      "start": 11759915,
      "end": 11811836
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/ColorPickerChild.sys.mjs",
      "start": 11811836,
      "end": 11813449
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/ColorPickerParent.sys.mjs",
      "start": 11813449,
      "end": 11814243
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/DateTimePickerChild.sys.mjs",
      "start": 11814243,
      "end": 11817245
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/DateTimePickerParent.sys.mjs",
      "start": 11817245,
      "end": 11818054
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/InputPickerChildCommon.sys.mjs",
      "start": 11818054,
      "end": 11823256
    }, {
      "filename": "/gre-baked/moz-src/toolkit/actors/InputPickerParentCommon.sys.mjs",
      "start": 11823256,
      "end": 11827728
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/pageextractor/DOMExtractor.sys.mjs",
      "start": 11827728,
      "end": 11865062
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/qrcode/encoder.mjs",
      "start": 11865062,
      "end": 11869783
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustBreachAlerts.sys.mjs",
      "start": 11869783,
      "end": 11885013
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustContextId.sys.mjs",
      "start": 11885013,
      "end": 11894834
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustFilterAdult.sys.mjs",
      "start": 11894834,
      "end": 11900421
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustInitRustComponents.sys.mjs",
      "start": 11900421,
      "end": 11902047
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustLogins.sys.mjs",
      "start": 11902047,
      "end": 12026024
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustRelevancy.sys.mjs",
      "start": 12026024,
      "end": 12081043
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustRemoteSettings.sys.mjs",
      "start": 12081043,
      "end": 12160404
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustSearch.sys.mjs",
      "start": 12160404,
      "end": 12261735
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustSuggest.sys.mjs",
      "start": 12261735,
      "end": 12423778
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustSync15.sys.mjs",
      "start": 12423778,
      "end": 12428532
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustTabs.sys.mjs",
      "start": 12428532,
      "end": 12508597
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustTracing.sys.mjs",
      "start": 12508597,
      "end": 12528087
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-bindgen-gecko-js/components/generated/RustWebextstorage.sys.mjs",
      "start": 12528087,
      "end": 12573010
    }, {
      "filename": "/gre-baked/moz-src/toolkit/components/uniffi-js/js/UniFFI.sys.mjs",
      "start": 12573010,
      "end": 12597712
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/ColorPickerPanel.sys.mjs",
      "start": 12597712,
      "end": 12599541
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/DateTimePickerPanel.sys.mjs",
      "start": 12599541,
      "end": 12604637
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/FaviconUtils.sys.mjs",
      "start": 12604637,
      "end": 12606889
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/InputPickerPanelCommon.sys.mjs",
      "start": 12606889,
      "end": 12611233
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/PrefUtils.sys.mjs",
      "start": 12611233,
      "end": 12615184
    }, {
      "filename": "/gre-baked/moz-src/toolkit/modules/WebAuthnPromptHelper.sys.mjs",
      "start": 12615184,
      "end": 12627725
    }, {
      "filename": "/gre-baked/moz-src/toolkit/profile/ProfilesDatastoreService.sys.mjs",
      "start": 12627725,
      "end": 12644944
    }, {
      "filename": "/gre-baked/platform.ini",
      "start": 12644944,
      "end": 12644993
    }, {
      "filename": "/gre-baked/res/EditorOverride.css",
      "start": 12644993,
      "end": 12645250
    }, {
      "filename": "/gre-baked/res/contenteditable.css",
      "start": 12645250,
      "end": 12645508
    }, {
      "filename": "/gre-baked/res/designmode.css",
      "start": 12645508,
      "end": 12645761
    }, {
      "filename": "/gre-baked/res/dtd/htmlmathml-f.ent",
      "start": 12645761,
      "end": 12804943
    }, {
      "filename": "/gre-baked/res/fonts/mathfont.properties",
      "start": 12804943,
      "end": 12913857
    }, {
      "filename": "/gre-baked/res/grabber.gif",
      "start": 12913857,
      "end": 12914715
    }, {
      "filename": "/gre-baked/res/language.properties",
      "start": 12914715,
      "end": 12920947
    }, {
      "filename": "/gre-baked/res/locale/dom/dom.properties",
      "start": 12920947,
      "end": 12976790
    }, {
      "filename": "/gre-baked/res/locale/layout/HtmlForm.properties",
      "start": 12976790,
      "end": 12978904
    }, {
      "filename": "/gre-baked/res/locale/layout/MediaDocument.properties",
      "start": 12978904,
      "end": 12980202
    }, {
      "filename": "/gre-baked/res/locale/layout/xmlparser.properties",
      "start": 12980202,
      "end": 12982044
    }, {
      "filename": "/gre-baked/res/locale/necko/necko.properties",
      "start": 12982044,
      "end": 12993314
    }, {
      "filename": "/gre-baked/res/multilocale.txt",
      "start": 12993314,
      "end": 12993320
    }, {
      "filename": "/gre-baked/res/svg.css",
      "start": 12993320,
      "end": 12995333
    }, {
      "filename": "/gre-baked/res/table-add-column-after-active.gif",
      "start": 12995333,
      "end": 12995391
    }, {
      "filename": "/gre-baked/res/table-add-column-after-hover.gif",
      "start": 12995391,
      "end": 12996217
    }, {
      "filename": "/gre-baked/res/table-add-column-after.gif",
      "start": 12996217,
      "end": 12997043
    }, {
      "filename": "/gre-baked/res/table-add-column-before-active.gif",
      "start": 12997043,
      "end": 12997100
    }, {
      "filename": "/gre-baked/res/table-add-column-before-hover.gif",
      "start": 12997100,
      "end": 12997925
    }, {
      "filename": "/gre-baked/res/table-add-column-before.gif",
      "start": 12997925,
      "end": 12998750
    }, {
      "filename": "/gre-baked/res/table-add-row-after-active.gif",
      "start": 12998750,
      "end": 12998807
    }, {
      "filename": "/gre-baked/res/table-add-row-after-hover.gif",
      "start": 12998807,
      "end": 12999633
    }, {
      "filename": "/gre-baked/res/table-add-row-after.gif",
      "start": 12999633,
      "end": 13000459
    }, {
      "filename": "/gre-baked/res/table-add-row-before-active.gif",
      "start": 13000459,
      "end": 13000516
    }, {
      "filename": "/gre-baked/res/table-add-row-before-hover.gif",
      "start": 13000516,
      "end": 13001341
    }, {
      "filename": "/gre-baked/res/table-add-row-before.gif",
      "start": 13001341,
      "end": 13002166
    }, {
      "filename": "/gre-baked/res/table-remove-column-active.gif",
      "start": 13002166,
      "end": 13003001
    }, {
      "filename": "/gre-baked/res/table-remove-column-hover.gif",
      "start": 13003001,
      "end": 13003842
    }, {
      "filename": "/gre-baked/res/table-remove-column.gif",
      "start": 13003842,
      "end": 13004683
    }, {
      "filename": "/gre-baked/res/table-remove-row-active.gif",
      "start": 13004683,
      "end": 13005518
    }, {
      "filename": "/gre-baked/res/table-remove-row-hover.gif",
      "start": 13005518,
      "end": 13006359
    }, {
      "filename": "/gre-baked/res/table-remove-row.gif",
      "start": 13006359,
      "end": 13007200
    } ],
    "remote_package_size": 13007200
  });
})();

// end include: /tmp/tmpmneyhjal.js
// include: /tmp/tmpq7cw06ge.js
// All the pre-js content up to here must remain later on, we need to run
// it.
if ((typeof ENVIRONMENT_IS_WASM_WORKER != "undefined" && ENVIRONMENT_IS_WASM_WORKER) || (typeof ENVIRONMENT_IS_PTHREAD != "undefined" && ENVIRONMENT_IS_PTHREAD) || (typeof ENVIRONMENT_IS_AUDIO_WORKLET != "undefined" && ENVIRONMENT_IS_AUDIO_WORKLET)) Module["preRun"] = [];

var necessaryPreJSTasks = Module["preRun"].slice();

// end include: /tmp/tmpq7cw06ge.js
// include: /tmp/tmpyrx6kzjn.js
if (!Module["preRun"]) throw "Module.preRun should exist because file support used it; did a pre-js delete it?";

necessaryPreJSTasks.forEach(task => {
  if (Module["preRun"].indexOf(task) < 0) throw "All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?";
});

// end include: /tmp/tmpyrx6kzjn.js
var programArgs = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_SHELL) {} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = async url => {
      assert(!isFileURI(url), "readAsync does not work with file:// URLs");
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {
  throw new Error("environment detection error");
}

var out = console.log.bind(console);

var err = console.error.bind(console);

var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";

var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";

var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";

var FETCHFS = "FETCHFS is no longer included by default; build with -lfetchfs.js";

var ICASEFS = "ICASEFS is no longer included by default; build with -licasefs.js";

var JSFILEFS = "JSFILEFS is no longer included by default; build with -ljsfilefs.js";

var OPFS = "OPFS is no longer included by default; build with -lopfs.js";

var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message
assert(ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER || ENVIRONMENT_IS_NODE, "pthreads do not work in this environment yet (need Web Workers, or an alternative to them)");

assert(!ENVIRONMENT_IS_NODE, "node environment detected but not enabled at build time (add `node` to `-sENVIRONMENT` to enable)");

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time (add `shell` to `-sENVIRONMENT` to enable)");

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;

if (!globalThis.WebAssembly) {
  err("no native wasm support detected");
}

// Wasm globals
// For sending to workers.
var wasmModule;

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed" + (text ? ": " + text : ""));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  (growMemViews(), HEAPU32)[((max) >>> 2) >>> 0] = 34821223;
  (growMemViews(), HEAPU32)[(((max) + (4)) >>> 2) >>> 0] = 2310721022;
  // Also test the global address 0 for integrity.
  (growMemViews(), HEAPU32)[((0) >>> 2) >>> 0] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = (growMemViews(), HEAPU32)[((max) >>> 2) >>> 0];
  var cookie2 = (growMemViews(), HEAPU32)[(((max) + (4)) >>> 2) >>> 0];
  if (cookie1 != 34821223 || cookie2 != 2310721022) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if ((growMemViews(), HEAPU32)[((0) >>> 2) >>> 0] != 1668509029) {
    abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
  }
}

// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH {}

class EmscriptenSjLj extends EmscriptenEH {}

// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true;

// Switch to false at runtime to disable logging at the right times
// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != "undefined") return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 25459;
  if (h8[0] !== 115 || h8[1] !== 99) abort("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
})();

function consumedModuleProp(prop) {
  var value = Module[prop];
  var msg = `Attempt to modify \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`;
  if (Array.isArray(value)) {
    value = new Proxy(value, {
      set(target, key, val) {
        abort(msg);
        return false;
      },
      defineProperty(target, key, descriptor) {
        abort(msg);
        return false;
      },
      deleteProperty(target, key) {
        abort(msg);
        return false;
      }
    });
  }
  Object.defineProperty(Module, prop, {
    configurable: true,
    get() {
      return value;
    },
    set() {
      abort(msg);
    }
  });
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_preloadFile" || name === "FS_unlink" || name === "addRunDependency" || name === "removeRunDependency";
}

function missingLibrarySymbol(sym) {
  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return;
  }
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
        }
        abort(msg);
      }
    });
  }
}

/**
 * Override `err`/`out`/`dbg` to report thread / worker information
 */ function initWorkerLogging() {
  function getLogPrefix() {
    var t = 0;
    if (runtimeInitialized && typeof _pthread_self != "undefined") {
      t = _pthread_self();
    }
    return `w:${workerID},t:${ptrToString(t)}:`;
  }
  // Prefix all dbg() messages with the calling thread info.
  var origDbg = dbg;
  dbg = (...args) => origDbg(getLogPrefix(), ...args);
}

initWorkerLogging();

// end include: runtime_debug.js
// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function growMemViews() {
  // `updateMemoryViews` updates all the views simultaneously, so it's enough to check any of them.
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
}

// include: runtime_pthread.js
// Pthread Web Worker handling code.
// This code runs only on pthread web workers and handles pthread setup
// and communication with the main thread via postMessage.
// Unique ID of the current pthread worker (zero on non-pthread-workers
// including the main thread).
var workerID = 0;

var startWorker;

if (ENVIRONMENT_IS_PTHREAD) {
  // Thread-local guard variable for one-time init of the JS state
  var initializedJS = false;
  // Turn unhandled rejected promises into errors so that the main thread will be
  // notified about them.
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  function handleMessage(e) {
    try {
      var msgData = e.data;
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd == 1) {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        workerID = msgData.workerID;
        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = e => messageQueue.push(e);
        // And add a callback for when the runtime is initialized.
        startWorker = () => {
          // Notify the main thread that this thread has loaded.
          postMessage({
            cmd: 3
          });
          // Process any messages that were queued before the thread was ready.
          for (let msg of messageQueue) {
            handleMessage(msg);
          }
          // Restore the real message handler.
          self.onmessage = handleMessage;
        };
        // Use `const` here to ensure that the variable is scoped only to
        // that iteration, allowing safe reference from a closure.
        for (const handler of msgData.handlers) {
          // If the main module has a handler for a certain event, but no
          // handler exists on the pthread worker, then proxy that handler
          // back to the main thread.
          if (!Module[handler] || Module[handler].proxy) {
            Module[handler] = (...args) => {
              postMessage({
                cmd: 9,
                handler,
                args
              });
            };
            // Rebind the out / err handlers if needed
            if (handler == "print") out = Module[handler];
            if (handler == "printErr") err = Module[handler];
          }
        }
        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();
        wasmModule = msgData.wasmModule;
        if (typeof __geckoCoop != "undefined" && __geckoCoop.active) createWasm().then(() => run(), (e) => { err(`worker: instantiation failed: ${e}`); throw e; });
        else {
          createWasm();
          run();
        }
      } else if (cmd == 2) {
        assert(msgData.pthread_ptr);
        assert(wasmMemory, "CMD_RUN received before CMD_LOAD");
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);
        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/ 0, /*is_runtime=*/ 0, /*can_block=*/ 1, 0, 0);
        PThread.receiveOffscreenCanvases(msgData);
        PThread.threadInitTLS();
        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);
        if (!initializedJS) {
          initializedJS = true;
        }
        try {
          invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch (ex) {
          if (ex != "unwind") {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (cmd == 4) {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a cmd field present), but is not one of the
        // recognized commands:
        err(`worker: received unknown command ${cmd}`);
        err(msgData);
      }
    } catch (ex) {
      err(`worker: onmessage() captured an uncaught exception: ${ex}`);
      if (ex?.stack) err(ex.stack);
      if (runtimeInitialized) __emscripten_thread_crashed();
      throw ex;
    }
  }
  self.onmessage = handleMessage;
}

// ENVIRONMENT_IS_PTHREAD
// end include: runtime_pthread.js
// Memory management
var runtimeInitialized = false;

function updateMemoryViews() {
  if (typeof __geckoCoop != "undefined" && __geckoCoop.active) __geckoCoop.setMemory(wasmMemory);
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
function initMemory() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"];
  } else {
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 536870912;
    assert(INITIAL_MEMORY >= 67108864, `INITIAL_MEMORY should be larger than STACK_SIZE, was ${INITIAL_MEMORY}! (STACK_SIZE=67108864)`);
    /** @suppress {checkTypes} */ wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      // In theory we should not need to emit the maximum if we want "unlimited"
      // or 4GB of memory, but VMs error on that atm, see
      // https://github.com/emscripten-core/emscripten/issues/14130
      // And in the pthreads case we definitely need to emit a maximum. So
      // always emit one.
      "maximum": 65536,
      "shared": true
    });
  }
  updateMemoryViews();
}

// end include: runtime_init_memory.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");

function preRun() {
  assert(!ENVIRONMENT_IS_PTHREAD);
  // PThreads reuse the runtime from the main thread.
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  consumedModuleProp("preRun");
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  if (ENVIRONMENT_IS_PTHREAD) return startWorker();
  checkStackCookie();
  // No ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
}

function preMain() {
  checkStackCookie();
}

function postRun() {
  checkStackCookie();
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  // PThreads reuse the runtime from the main thread.
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  consumedModuleProp("postRun");
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

/**
 * @param {string|number=} what
 */ function abort(what) {
  Module["onAbort"]?.(what);
  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("gecko.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    // Warn on some common problems.
    if (isFileURI(binaryFile)) {
      err(`warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // prepare imports
  var imports = {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmExports = applySignatureConversions(wasmExports);
    if (typeof __geckoCoop != "undefined" && __geckoCoop.active) wasmExports = __geckoCoop.wrapExports(wasmExports, coopCtx);
    registerTLSInit(wasmExports["_emscripten_tls_init"]);
    assignWasmExports(wasmExports);
    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    return wasmExports;
  }
  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
    trueModule = null;
    return receiveInstance(result["instance"], result["module"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      try {
        Module["instantiateWasm"](info, (inst, mod) => {
          resolve(receiveInstance(inst, mod));
        });
      } catch (e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        reject(e);
      }
    });
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    // Instantiate from the module that was received via postMessage from
    // the main thread. We can just use sync instantiation in the worker.
    assert(wasmModule, "wasmModule should have been received via postMessage");
    var instance = (typeof __geckoCoop != "undefined" && __geckoCoop.active) ? await WebAssembly.instantiate(wasmModule, getWasmImports()) : new WebAssembly.Instance(wasmModule, getWasmImports());
    return receiveInstance(instance, wasmModule);
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js
// Begin JS library code
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

/** @type {!Int16Array} */ var HEAP16;

/** @type {!Int32Array} */ var HEAP32;

/** not-@type {!BigInt64Array} */ var HEAP64;

/** @type {!Int8Array} */ var HEAP8;

/** @type {!Float32Array} */ var HEAPF32;

/** @type {!Float64Array} */ var HEAPF64;

/** @type {!Uint16Array} */ var HEAPU16;

/** @type {!Uint32Array} */ var HEAPU32;

/** not-@type {!BigUint64Array} */ var HEAPU64;

/** @type {!Uint8Array} */ var HEAPU8;

var terminateWorker = worker => {
  worker.terminate();
  // terminate() can be asynchronous, so in theory the worker can continue
  // to run for some amount of time after termination.  However from our POV
  // the worker is now dead and we don't want to hear from it again, so we stub
  // out its message handler here.  This avoids having to check in each of
  // the onmessage handlers if the message was coming from a valid worker.
  worker.onmessage = e => {
    var cmd = e.data.cmd;
    err(`received "${cmd}" command from terminated worker: ${worker.workerID}`);
  };
};

var cleanupThread = pthread_ptr => {
  assert(!ENVIRONMENT_IS_PTHREAD, "cleanupThread() should only be called from the main thread");
  assert(pthread_ptr, "null pthread_ptr passed to cleanupThread");
  var worker = PThread.pthreads[pthread_ptr];
  assert(worker);
  PThread.returnWorkerToPool(worker);
};

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

var runDependencies = 0;

var dependenciesFulfilled = null;

var runDependencyTracking = {};

var runDependencyWatcher = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  assert(id, "removeRunDependency requires an ID");
  assert(runDependencyTracking[id]);
  delete runDependencyTracking[id];
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
};

var addRunDependency = id => {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
  assert(id, "addRunDependency requires an ID");
  assert(!runDependencyTracking[id]);
  runDependencyTracking[id] = 1;
  if (runDependencyWatcher === null && globalThis.setInterval) {
    // Check for missing dependencies every few seconds
    runDependencyWatcher = setInterval(() => {
      if (ABORT) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
        return;
      }
      var shown = false;
      for (var dep in runDependencyTracking) {
        if (!shown) {
          shown = true;
          err("still waiting on run dependencies:");
        }
        err(`dependency: ${dep}`);
      }
      if (shown) {
        err("(end of list)");
      }
    }, 1e4);
  }
};

var spawnThread = threadParams => {
  assert(!ENVIRONMENT_IS_PTHREAD, "spawnThread() should only be called from the main thread");
  assert(threadParams.pthread_ptr, "spawnThread called with null pthread ptr");
  var worker = PThread.getNewWorker();
  if (!worker) {
    // No available workers in the PThread pool.
    return 6;
  }
  assert(!worker.pthread_ptr);
  // Add to pthreads map
  PThread.pthreads[threadParams.pthread_ptr] = worker;
  worker.pthread_ptr = threadParams.pthread_ptr;
  var msg = {
    cmd: 2,
    start_routine: threadParams.startRoutine,
    arg: threadParams.arg,
    pthread_ptr: threadParams.pthread_ptr
  };
  // Note that we do not need to quote these names because they are only used
  // in this file, and not from the external worker.js.
  msg.moduleCanvasId = threadParams.moduleCanvasId;
  msg.offscreenCanvases = threadParams.offscreenCanvases;
  // Ask the worker to start executing its pthread entry point function.
  worker.postMessage(msg, threadParams.transferList);
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, proxyMode, ...callArgs) => {
  if (typeof __geckoCoop != "undefined" && __geckoCoop.active) return __geckoCoop.callOnMain(funcIndex, emAsmAddr, _pthread_self(), proxyMode, callArgs);
  // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
  // content as `emAsmAddr`.  JS library proxying is done by passing an index
  // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
  // `funcIndex` will be ignored.
  // Additional arguments are passed after the first three are the actual
  // function arguments.
  // The serialization buffer contains the number of call params, and then
  // all the args here.
  // We also pass 'proxyMode' to C separately, since C needs to look at it.
  // Allocate a buffer (on the stack), which will be copied if necessary by
  // the C code.
  // First passed parameter specifies the number of arguments to the function.
  // When BigInt support is enabled, we must handle types in a more complex
  // way, detecting at runtime if a value is a BigInt or not (as we have no
  // type info here). To do that, add a "prefix" before each value that
  // indicates if it is a BigInt, which effectively doubles the number of
  // values we serialize for proxying. TODO: pack this?
  var bufSize = 8 * callArgs.length * 2;
  var sp = stackSave();
  var args = stackAlloc(bufSize);
  var b = ((args) >>> 3);
  for (var arg of callArgs) {
    if (typeof arg == "bigint") {
      // The prefix is non-zero to indicate a bigint.
      (growMemViews(), HEAP64)[b++ >>> 0] = 1n;
      (growMemViews(), HEAP64)[b++ >>> 0] = arg;
    } else {
      // The prefix is zero to indicate a JS Number.
      (growMemViews(), HEAP64)[b++ >>> 0] = 0n;
      (growMemViews(), HEAPF64)[b++ >>> 0] = arg;
    }
  }
  var rtn = __emscripten_run_js_on_main_thread(funcIndex, emAsmAddr, bufSize, args, proxyMode);
  stackRestore(sp);
  return rtn;
};

function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

var runtimeKeepalivePop = () => {
  assert(runtimeKeepaliveCounter > 0);
  runtimeKeepaliveCounter -= 1;
};

function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
  runtimeKeepalivePop();
  _exit(returnCode);
}

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  checkUnflushedContent();
  if (ENVIRONMENT_IS_PTHREAD) {
    // implicit exit can never happen on a pthread
    assert(!implicit);
    // When running in a pthread we propagate the exit back to the main thread
    // where it can decide if the whole process should be shut down or not.
    // The pthread may have decided not to exit its own runtime, for example
    // because it runs a main loop, but that doesn't affect the main thread.
    exitOnMainThread(status);
    throw "unwind";
  }
  // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
  if (keepRuntimeAlive() && !implicit) {
    var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
    err(msg);
  }
  _proc_exit(status);
};

var _exit = exitJS;

var waitAsyncPolyfilled = (!Atomics.waitAsync || (globalThis.navigator?.userAgent && Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]) < 91));

function ptrToString(ptr) {
  assert(typeof ptr === "number", `ptrToString expects a number, got ${typeof ptr}`);
  // Convert to 32-bit unsigned value
  ptr >>>= 0;
  return "0x" + ptr.toString(16).padStart(8, "0");
}

var PThread = {
  unusedWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  nextWorkerID: 1,
  init() {
    if ((!(ENVIRONMENT_IS_PTHREAD))) {
      PThread.initMainThread();
    }
  },
  initMainThread() {
    var pthreadPoolSize = (typeof __geckoCoop != "undefined" && __geckoCoop.active) ? __geckoCoop.poolSize : 20;
    // Start loading up the Worker pool, if requested.
    while (pthreadPoolSize--) {
      PThread.allocateUnusedWorker();
    }
    // MINIMAL_RUNTIME takes care of calling loadWasmModuleToAllWorkers
    // in postamble_minimal.js
    addOnPreRun(async () => {
      var pthreadPoolReady = PThread.loadWasmModuleToAllWorkers();
      addRunDependency("loading-workers");
      await pthreadPoolReady;
      removeRunDependency("loading-workers");
    });
  },
  terminateAllThreads: () => {
    assert(!ENVIRONMENT_IS_PTHREAD, "terminateAllThreads() should only be called from the main thread");
    // Attempt to kill all workers.  Sadly (at least on the web) there is no
    // way to terminate a worker synchronously, or to be notified when a
    // worker is actually terminated.  This means there is some risk that
    // pthreads will continue to be executing after `worker.terminate` has
    // returned.  For this reason, we don't call `returnWorkerToPool` here or
    // free the underlying pthread data structures.
    for (var worker of Object.values(PThread.pthreads)) {
      terminateWorker(worker);
    }
    for (var worker of PThread.unusedWorkers) {
      terminateWorker(worker);
    }
    PThread.unusedWorkers = [];
    PThread.pthreads = {};
  },
  terminateRuntime: () => {
    assert(!ENVIRONMENT_IS_PTHREAD, "terminateRuntime() should only be called from the main thread");
    PThread.terminateAllThreads();
    var pthread_ptr = _pthread_self();
    ___set_thread_state(0, 0, 0, 1);
    if (!waitAsyncPolyfilled) {
      // Break the waitAsync loop.  Note that checkMailbox will not
      // re-register since the `___set_thread_state` above causes _pthread_self
      // to return 0.
      Atomics.notify((growMemViews(), HEAP32), ((pthread_ptr) >>> 2));
    }
  },
  returnWorkerToPool: worker => {
    // We don't want to run main thread queued calls here, since we are doing
    // some operations that leave the worker queue in an invalid state until
    // we are completely done (it would be bad if free() ends up calling a
    // queued pthread_create which looks at the global data structures we are
    // modifying). To achieve that, defer the free() until the very end, when
    // we are all done.
    var pthread_ptr = worker.pthread_ptr;
    delete PThread.pthreads[pthread_ptr];
    // Note: worker is intentionally not terminated so the pool can
    // dynamically grow.
    PThread.unusedWorkers.push(worker);
    // Not a running Worker anymore
    // Detach the worker from the pthread object, and return it to the
    // worker pool as an unused worker.
    worker.pthread_ptr = 0;
    // Finally, free the underlying (and now-unused) pthread structure in
    // linear memory.
    __emscripten_thread_free_data(pthread_ptr);
  },
  receiveOffscreenCanvases(data) {
    if (typeof GL != "undefined") {
      Object.assign(GL.offscreenCanvases, data.offscreenCanvases);
      if (!Module["canvas"] && data.moduleCanvasId && GL.offscreenCanvases[data.moduleCanvasId]) {
        Module["canvas"] = GL.offscreenCanvases[data.moduleCanvasId].offscreenCanvas;
        Module["canvas"].id = data.moduleCanvasId;
      }
    }
  },
  threadInitTLS() {
    // Call thread init functions (these are the _emscripten_tls_init for each
    // module loaded.
    PThread.tlsInitFunctions.forEach(f => f());
  },
  loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
    worker.onmessage = e => {
      var d = e.data;
      var cmd = d.cmd;
      // If this message is intended to a recipient that is not the main
      // thread, forward it to the target thread. This is currently only
      // used by `CMD_CHECK_MAILBOX`.
      if (d.targetThread) {
        // pthreads should not be relaying messages to themselves.
        assert(d.targetThread != _pthread_self());
        var targetWorker = PThread.pthreads[d.targetThread];
        if (!targetWorker) err(`worker sent message (${cmd}) to pthread (${d.targetThread}) that no longer exists`);
        targetWorker?.postMessage(d);
        return;
      }
      if (d === "setimmediate" || d === "_si") {
        // Worker wants to postMessage() to itself to implement setImmediate()
        // emulation.
        worker.postMessage(d);
        return;
      }
      switch (cmd) {
       case 4:
        checkMailbox();
        break;

       case 5:
        spawnThread(d);
        break;

       case 6:
        // cleanupThread needs to be run via callUserCallback since it calls
        // back into user code to free thread data. Without this it's possible
        // the unwind or ExitStatus exception could escape here.
        callUserCallback(() => cleanupThread(d.thread));
        break;

       case 3:
        onFinishedLoading(worker);
        break;

       case 9:
        Module[d.handler](...d.args);
        break;

       default:
        // The received message looks like something that should be handled by this message
        // handler, (since there is a e.data.cmd field present), but is not one of the
        // recognized commands:
        if (cmd) err(`worker sent an unknown command ${cmd}`);
      }
    };
    worker.onerror = e => {
      var message = "worker sent an error!";
      if (worker.pthread_ptr) {
        message = `Pthread ${ptrToString(worker.pthread_ptr)} sent an error!`;
      }
      err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    assert(wasmMemory instanceof WebAssembly.Memory, "wasmMemory should have been loaded by now");
    assert(wasmModule instanceof WebAssembly.Module, "wasmModule should have been loaded by now");
    // When running on a pthread, none of the incoming parameters on the module
    // object are present. Proxy known handlers back to the main thread if specified.
    var handlers = [];
    var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
    for (var handler of knownHandlers) {
      if (Module.propertyIsEnumerable(handler)) {
        handlers.push(handler);
      }
    }
    // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
    worker.postMessage({
      cmd: 1,
      handlers,
      wasmMemory,
      wasmModule,
      workerID: worker.workerID
    });
  }),
  async loadWasmModuleToAllWorkers() {
    // Instantiation is synchronous in pthreads.
    if (ENVIRONMENT_IS_PTHREAD) {
      return;
    }
    let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
    return pthreadPoolReady;
  },
  allocateUnusedWorker() {
    var worker;
    var pthreadMainJs = _scriptName;
    // We can't use makeModuleReceiveWithVar here since we want to also
    // call URL.createObjectURL on the mainScriptUrlOrBlob.
    if (Module["mainScriptUrlOrBlob"]) {
      pthreadMainJs = Module["mainScriptUrlOrBlob"];
      if (typeof pthreadMainJs != "string") {
        pthreadMainJs = URL.createObjectURL(pthreadMainJs);
      }
    }
    worker = new (typeof __geckoCoop != "undefined" && __geckoCoop.active ? __geckoCoop.Worker : Worker)(pthreadMainJs, {
      // This is the way that we signal to the Web Worker that it is hosting
      // a pthread.
      "name": "em-pthread-" + PThread.nextWorkerID
    });
    worker.workerID = PThread.nextWorkerID++;
    PThread.unusedWorkers.push(worker);
    return worker;
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
      var newWorker = PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(newWorker);
    }
    return PThread.unusedWorkers.pop();
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

function establishStackSpace(pthread_ptr) {
  var stackHigh = (growMemViews(), HEAPU32)[(((pthread_ptr) + (48)) >>> 2) >>> 0];
  var stackSize = (growMemViews(), HEAPU32)[(((pthread_ptr) + (52)) >>> 2) >>> 0];
  var stackLow = stackHigh - stackSize;
  assert(stackHigh != 0);
  assert(stackLow != 0);
  assert(stackHigh > stackLow, "stackHigh must be higher then stackLow");
  // Set stack limits used by `emscripten/stack.h` function.  These limits are
  // cached in wasm-side globals to make checks as fast as possible.
  _emscripten_stack_set_limits(stackHigh, stackLow);
  // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
  stackRestore(stackHigh);
  // Write the stack cookie last, after we have set up the proper bounds and
  // current position of the stack.
  writeStackCookie();
}

/**
   * @param {number} ptr
   * @param {string} type
   */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return (growMemViews(), HEAP8)[ptr >>> 0];

   case "i8":
    return (growMemViews(), HEAP8)[ptr >>> 0];

   case "i16":
    return (growMemViews(), HEAP16)[((ptr) >>> 1) >>> 0];

   case "i32":
    return (growMemViews(), HEAP32)[((ptr) >>> 2) >>> 0];

   case "i64":
    return (growMemViews(), HEAP64)[((ptr) >>> 3) >>> 0];

   case "float":
    return (growMemViews(), HEAPF32)[((ptr) >>> 2) >>> 0];

   case "double":
    return (growMemViews(), HEAPF64)[((ptr) >>> 3) >>> 0];

   case "*":
    return (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var wasmTableMirror = [];

var getWasmTableEntry = funcPtr => {
  var func = wasmTableMirror[funcPtr];
  if (!func) {
    func = wasmTable.get(funcPtr);
    if (func && typeof __geckoCoop != "undefined" && __geckoCoop.active) func = __geckoCoop.wrapFunction(func, coopCtx);
    wasmTableMirror[funcPtr] = func;
  }
  return func;
};

var invokeEntryPoint = (ptr, arg) => {
  // An old thread on this worker may have been canceled without returning the
  // `runtimeKeepaliveCounter` to zero. Reset it now so the new thread won't
  // be affected.
  runtimeKeepaliveCounter = 0;
  // Same for noExitRuntime.  The default for pthreads should always be false
  // otherwise pthreads would never complete and attempts to pthread_join to
  // them would block forever.
  // pthreads can still choose to set `noExitRuntime` explicitly, or
  // call emscripten_unwind_to_js_event_loop to extend their lifetime beyond
  // their main function.  See comment in src/runtime_pthread.js for more.
  noExitRuntime = 0;
  // pthread entry points are always of signature 'void *ThreadMain(void *arg)'
  // Native codebases sometimes spawn threads with other thread entry point
  // signatures, such as void ThreadMain(void *arg), void *ThreadMain(), or
  // void ThreadMain().  That is not acceptable per C/C++ specification, but
  // x86 compiler ABI extensions enable that to work. If you find the
  // following line to crash, either change the signature to "proper" void
  // *ThreadMain(void *arg) form, or try linking with the Emscripten linker
  // flag -sEMULATE_FUNCTION_POINTER_CASTS to add in emulation for this x86
  // ABI extension.
  // [manual JSPI] promising entry so gl_present_yield (SwapBuffers) can suspend.
  var result = WebAssembly.promising(wasmTable.get(ptr))(arg);
  function finish(result) {
    checkStackCookie();
    if (keepRuntimeAlive()) {
      EXITSTATUS = result;
      return;
    }
    __emscripten_thread_exit(result);
  }
  // Mirror the onmessage('run') try/catch: WebAssembly.promising turns a
  // synchronous throw inside the entry into a Promise rejection, so the try/catch
  // around invokeEntryPoint no longer sees it. 'unwind' (thrown by
  // emscripten_unwind_to_js_event_loop -- the normal keep-the-thread-alive signal,
  // a real throw here because we are NOT global -sJSPI) must be swallowed; anything
  // else is re-thrown so the worker still surfaces real pthread crashes.
  result.then(finish, (ex) => { if (ex != "unwind") throw ex; });
};

var noExitRuntime = true;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

/**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    (growMemViews(), HEAP8)[ptr >>> 0] = value;
    break;

   case "i8":
    (growMemViews(), HEAP8)[ptr >>> 0] = value;
    break;

   case "i16":
    (growMemViews(), HEAP16)[((ptr) >>> 1) >>> 0] = value;
    break;

   case "i32":
    (growMemViews(), HEAP32)[((ptr) >>> 2) >>> 0] = value;
    break;

   case "i64":
    (growMemViews(), HEAP64)[((ptr) >>> 3) >>> 0] = BigInt(value);
    break;

   case "float":
    (growMemViews(), HEAPF32)[((ptr) >>> 2) >>> 0] = value;
    break;

   case "double":
    (growMemViews(), HEAPF64)[((ptr) >>> 3) >>> 0] = value;
    break;

   case "*":
    (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
};

var wasmMemory;

var jsStackTrace = () => (new Error).stack.toString();

/** @param {number=} flags */ var getCallstack = flags => {
  var callstack = jsStackTrace();
  if (flags & 8) {
    warnOnce("emscripten_log with EM_LOG_C_STACK no longer has any effect");
  }
  // Process all lines:
  var lines = callstack.split("\n");
  callstack = "";
  // Extract components of form:
  // '       Object._main@http://server.com:4324:12'
  var firefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
  // Extract components of form:
  // '    at Object._main (http://server.com/file.html:4324:12)'
  var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
  for (var line of lines) {
    var symbolName = "";
    var file = "";
    var lineno = 0;
    var column = 0;
    var parts = chromeRe.exec(line);
    if (parts?.length == 5) {
      symbolName = parts[1];
      file = parts[2];
      lineno = parts[3];
      column = parts[4];
    } else {
      parts = firefoxRe.exec(line);
      if (parts?.length >= 4) {
        symbolName = parts[1];
        file = parts[2];
        lineno = parts[3];
        // Old Firefox doesn't carry column information, but in new FF30, it
        // is present. See https://bugzil.la/762556
        column = parts[4] | 0;
      } else {
        // Was not able to extract this line for demangling/sourcemapping
        // purposes. Output it as-is.
        callstack += line + "\n";
        continue;
      }
    }
    // Find the symbols in the callstack that corresponds to the functions that
    // report callstack information, and remove everything up to these from the
    // output.
    if (symbolName == "_emscripten_log" || symbolName == "_emscripten_get_callstack") {
      callstack = "";
      continue;
    }
    if ((flags & 24)) {
      if (flags & 64) {
        file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
      }
      callstack += `    at ${symbolName} (${file}:${lineno}:${column})\n`;
    }
  }
  // Trim extra whitespace at the end of the output.
  callstack = callstack.replace(/\s+$/, "");
  return callstack;
};

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function __Unwind_Backtrace(func, arg) {
  func >>>= 0;
  arg >>>= 0;
  var trace = getCallstack();
  var parts = trace.split("\n");
  for (var i = 0; i < parts.length; i++) {
    var ret = getWasmTableEntry(func)(0, arg);
    if (ret !== 0) return;
  }
}

function __Unwind_GetIP(...args) {
  abort("missing function: _Unwind_GetIP");
}

__Unwind_GetIP.stub = true;

function __ZN16nsBaseFilePicker13AppendFiltersEi(...args) {
  abort("missing function: _ZN16nsBaseFilePicker13AppendFiltersEi");
}

__ZN16nsBaseFilePicker13AppendFiltersEi.stub = true;

function __ZN16nsBaseFilePicker15AppendRawFilterERK12nsTSubstringIDsE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker15AppendRawFilterERK12nsTSubstringIDsE");
}

__ZN16nsBaseFilePicker15AppendRawFilterERK12nsTSubstringIDsE.stub = true;

function __ZN16nsBaseFilePicker15IsModeSupportedEN13nsIFilePicker4ModeEP9JSContextPPN7mozilla3dom7PromiseE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker15IsModeSupportedEN13nsIFilePicker4ModeEP9JSContextPPN7mozilla3dom7PromiseE");
}

__ZN16nsBaseFilePicker15IsModeSupportedEN13nsIFilePicker4ModeEP9JSContextPPN7mozilla3dom7PromiseE.stub = true;

function __ZN16nsBaseFilePicker16GetOkButtonLabelER12nsTSubstringIDsE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker16GetOkButtonLabelER12nsTSubstringIDsE");
}

__ZN16nsBaseFilePicker16GetOkButtonLabelER12nsTSubstringIDsE.stub = true;

function __ZN16nsBaseFilePicker16SetOkButtonLabelERK12nsTSubstringIDsE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker16SetOkButtonLabelERK12nsTSubstringIDsE");
}

__ZN16nsBaseFilePicker16SetOkButtonLabelERK12nsTSubstringIDsE.stub = true;

function __ZN16nsBaseFilePicker18GetAddToRecentDocsEPb(...args) {
  abort("missing function: _ZN16nsBaseFilePicker18GetAddToRecentDocsEPb");
}

__ZN16nsBaseFilePicker18GetAddToRecentDocsEPb.stub = true;

function __ZN16nsBaseFilePicker18SetAddToRecentDocsEb(...args) {
  abort("missing function: _ZN16nsBaseFilePicker18SetAddToRecentDocsEb");
}

__ZN16nsBaseFilePicker18SetAddToRecentDocsEb.stub = true;

function __ZN16nsBaseFilePicker19GetDisplayDirectoryEPP7nsIFile(...args) {
  abort("missing function: _ZN16nsBaseFilePicker19GetDisplayDirectoryEPP7nsIFile");
}

__ZN16nsBaseFilePicker19GetDisplayDirectoryEPP7nsIFile.stub = true;

function __ZN16nsBaseFilePicker19SetDisplayDirectoryEP7nsIFile(...args) {
  abort("missing function: _ZN16nsBaseFilePicker19SetDisplayDirectoryEP7nsIFile");
}

__ZN16nsBaseFilePicker19SetDisplayDirectoryEP7nsIFile.stub = true;

function __ZN16nsBaseFilePicker26GetDisplaySpecialDirectoryER12nsTSubstringIDsE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker26GetDisplaySpecialDirectoryER12nsTSubstringIDsE");
}

__ZN16nsBaseFilePicker26GetDisplaySpecialDirectoryER12nsTSubstringIDsE.stub = true;

function __ZN16nsBaseFilePicker26SetDisplaySpecialDirectoryERK12nsTSubstringIDsE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker26SetDisplaySpecialDirectoryERK12nsTSubstringIDsE");
}

__ZN16nsBaseFilePicker26SetDisplaySpecialDirectoryERK12nsTSubstringIDsE.stub = true;

function __ZN16nsBaseFilePicker7GetModeEPN13nsIFilePicker4ModeE(...args) {
  abort("missing function: _ZN16nsBaseFilePicker7GetModeEPN13nsIFilePicker4ModeE");
}

__ZN16nsBaseFilePicker7GetModeEPN13nsIFilePicker4ModeE.stub = true;

function __ZN16nsBaseFilePickerC2Ev(...args) {
  abort("missing function: _ZN16nsBaseFilePickerC2Ev");
}

__ZN16nsBaseFilePickerC2Ev.stub = true;

function __ZN16nsBaseFilePickerD2Ev(...args) {
  abort("missing function: _ZN16nsBaseFilePickerD2Ev");
}

__ZN16nsBaseFilePickerD2Ev.stub = true;

function __ZN4base9LaunchAppERKNSt3__26vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEONS_13LaunchOptionsEPi(...args) {
  abort("missing function: _ZN4base9LaunchAppERKNSt3__26vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEONS_13LaunchOptionsEPi");
}

__ZN4base9LaunchAppERKNSt3__26vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEONS_13LaunchOptionsEPi.stub = true;

function __ZN7mozilla15GetProcInfoSyncEO8nsTArrayINS_15ProcInfoRequestEE(...args) {
  abort("missing function: _ZN7mozilla15GetProcInfoSyncEO8nsTArrayINS_15ProcInfoRequestEE");
}

__ZN7mozilla15GetProcInfoSyncEO8nsTArrayINS_15ProcInfoRequestEE.stub = true;

function __ZN7mozilla15RLBoxSoundTouch10numSamplesEv(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch10numSamplesEv");
}

__ZN7mozilla15RLBoxSoundTouch10numSamplesEv.stub = true;

function __ZN7mozilla15RLBoxSoundTouch10putSamplesEPKfj(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch10putSamplesEPKfj");
}

__ZN7mozilla15RLBoxSoundTouch10putSamplesEPKfj.stub = true;

function __ZN7mozilla15RLBoxSoundTouch10setSettingEii(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch10setSettingEii");
}

__ZN7mozilla15RLBoxSoundTouch10setSettingEii.stub = true;

function __ZN7mozilla15RLBoxSoundTouch11setChannelsEj(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch11setChannelsEj");
}

__ZN7mozilla15RLBoxSoundTouch11setChannelsEj.stub = true;

function __ZN7mozilla15RLBoxSoundTouch13setSampleRateEj(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch13setSampleRateEj");
}

__ZN7mozilla15RLBoxSoundTouch13setSampleRateEj.stub = true;

function __ZN7mozilla15RLBoxSoundTouch14receiveSamplesEPfj(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch14receiveSamplesEPfj");
}

__ZN7mozilla15RLBoxSoundTouch14receiveSamplesEPfj.stub = true;

function __ZN7mozilla15RLBoxSoundTouch21numUnprocessedSamplesEv(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch21numUnprocessedSamplesEv");
}

__ZN7mozilla15RLBoxSoundTouch21numUnprocessedSamplesEv.stub = true;

function __ZN7mozilla15RLBoxSoundTouch4InitEv(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch4InitEv");
}

__ZN7mozilla15RLBoxSoundTouch4InitEv.stub = true;

function __ZN7mozilla15RLBoxSoundTouch5flushEv(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch5flushEv");
}

__ZN7mozilla15RLBoxSoundTouch5flushEv.stub = true;

function __ZN7mozilla15RLBoxSoundTouch7setRateEd(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch7setRateEd");
}

__ZN7mozilla15RLBoxSoundTouch7setRateEd.stub = true;

function __ZN7mozilla15RLBoxSoundTouch8setPitchEd(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch8setPitchEd");
}

__ZN7mozilla15RLBoxSoundTouch8setPitchEd.stub = true;

function __ZN7mozilla15RLBoxSoundTouch8setTempoEd(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouch8setTempoEd");
}

__ZN7mozilla15RLBoxSoundTouch8setTempoEd.stub = true;

function __ZN7mozilla15RLBoxSoundTouchC1Ev(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouchC1Ev");
}

__ZN7mozilla15RLBoxSoundTouchC1Ev.stub = true;

function __ZN7mozilla15RLBoxSoundTouchD1Ev(...args) {
  abort("missing function: _ZN7mozilla15RLBoxSoundTouchD1Ev");
}

__ZN7mozilla15RLBoxSoundTouchD1Ev.stub = true;

function __ZN7mozilla4a11y30GetCacheDomainsForKnownClientsEy(...args) {
  abort("missing function: _ZN7mozilla4a11y30GetCacheDomainsForKnownClientsEy");
}

__ZN7mozilla4a11y30GetCacheDomainsForKnownClientsEy.stub = true;

function __ZN9nsIWidget17CreateChildWindowEv(...args) {
  abort("missing function: _ZN9nsIWidget17CreateChildWindowEv");
}

__ZN9nsIWidget17CreateChildWindowEv.stub = true;

function __ZN9nsIWidget20CreateTopLevelWindowEv(...args) {
  abort("missing function: _ZN9nsIWidget20CreateTopLevelWindowEv");
}

__ZN9nsIWidget20CreateTopLevelWindowEv.stub = true;

function __ZN9nsIWidget23CreateBidiKeyboardInnerEv(...args) {
  abort("missing function: _ZN9nsIWidget23CreateBidiKeyboardInnerEv");
}

__ZN9nsIWidget23CreateBidiKeyboardInnerEv.stub = true;

function __ZNK16nsBaseFilePicker17GetRelevantGlobalEv(...args) {
  abort("missing function: _ZNK16nsBaseFilePicker17GetRelevantGlobalEv");
}

__ZNK16nsBaseFilePicker17GetRelevantGlobalEv.stub = true;

var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;

var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // As a tiny code save trick, compare idx against maxIdx using a negation,
  // so that maxBytesToRead=undefined/NaN means Infinity.
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

/**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  idx >>>= 0;
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      if ((u0 & 248) != 240) warnOnce(`Invalid UTF-8 leading byte ${ptrToString(u0)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`);
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
  assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
  ptr >>>= 0;
  return ptr ? UTF8ArrayToString((growMemViews(), HEAPU8), ptr, maxBytesToRead, ignoreNul) : "";
};

function ___assert_fail(condition, filename, line, func) {
  condition >>>= 0;
  filename >>>= 0;
  func >>>= 0;
  return abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

function ___call_sighandler(fp, sig) {
  fp >>>= 0;
  return getWasmTableEntry(fp)(sig);
}

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var _emscripten_has_threading_support = () => !!globalThis.SharedArrayBuffer;

function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
  pthread_ptr >>>= 0;
  attr >>>= 0;
  startRoutine >>>= 0;
  arg >>>= 0;
  if (!_emscripten_has_threading_support()) {
    dbg("pthread_create: environment does not support SharedArrayBuffer, pthreads are not available");
    return 6;
  }
  // List of JS objects that will transfer ownership to the Worker hosting the thread
  var transferList = [];
  var error = 0;
  // Deduce which WebGL canvases (HTMLCanvasElements or OffscreenCanvases) should be passed over to the
  // Worker that hosts the spawned pthread.
  // Comma-delimited list of CSS selectors that must identify canvases by IDs: "#canvas1, #canvas2, ..."
  var transferredCanvasNames = attr ? (growMemViews(), HEAPU32)[(((attr) + (40)) >>> 2) >>> 0] : 0;
  // Proxied canvases string pointer -1/MAX_PTR is used as a special token to
  // fetch whatever canvases were passed to build in
  // -sOFFSCREENCANVASES_TO_PTHREAD= command line.
  if (transferredCanvasNames == 4294967295) {
    transferredCanvasNames = "#gldummy";
  } else {
    transferredCanvasNames = UTF8ToString(transferredCanvasNames).trim();
  }
  transferredCanvasNames = transferredCanvasNames ? transferredCanvasNames.split(",") : [];
  var offscreenCanvases = {};
  // Dictionary of OffscreenCanvas objects we'll transfer to the created thread to own
  var moduleCanvasId = Module["canvas"]?.id ?? "";
  // Note that transferredCanvasNames might be null (so we cannot do a for-of loop).
  for (var name of transferredCanvasNames) {
    name = name.trim();
    var offscreenCanvasInfo;
    try {
      if (name == "#canvas") {
        if (!Module["canvas"]) {
          err(`pthread_create: could not find canvas with ID "${name}" to transfer to thread!`);
          error = 28;
          break;
        }
        name = Module["canvas"].id;
      }
      assert(typeof GL == "object", "OFFSCREENCANVAS_SUPPORT assumes GL is in use (you can force-include it with '-sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE=$GL')");
      if (GL.offscreenCanvases[name]) {
        offscreenCanvasInfo = GL.offscreenCanvases[name];
        GL.offscreenCanvases[name] = null;
        // This thread no longer owns this canvas.
        if (Module["canvas"] instanceof OffscreenCanvas && name === Module["canvas"].id) Module["canvas"] = null;
      } else if (!ENVIRONMENT_IS_PTHREAD) {
        var canvas = (Module["canvas"] && Module["canvas"].id === name) ? Module["canvas"] : document.querySelector(name);
        if (!canvas) {
          // gecko-wasm: synthesize a standalone decoy OffscreenCanvas. The canvas
          // named in OFFSCREENCANVASES_TO_PTHREAD exists only to be transferred to
          // the proxied main() pthread INSTEAD of the real Module.canvas, so it need
          // not exist in the DOM -- create a 1x1 OffscreenCanvas directly (no
          // throwaway <canvas> element required). See patch-emsdk-wasmfs.mjs.
          var oc = new OffscreenCanvas(1, 1);
          oc.id = name.replace(/^#/, "");
          var sp = _malloc(12);
          (growMemViews(), HEAP32)[((sp) >>> 2) >>> 0] = 1;
          (growMemViews(), HEAP32)[(((sp) + (4)) >>> 2) >>> 0] = 1;
          (growMemViews(), HEAPU32)[(((sp) + (8)) >>> 2) >>> 0] = 0;
          offscreenCanvasInfo = {
            offscreenCanvas: oc,
            canvasSharedPtr: sp,
            id: oc.id
          };
          transferList.push(oc);
          offscreenCanvases[oc.id] = offscreenCanvasInfo;
          continue;
        }
        if (canvas.controlTransferredOffscreen) {
          err(`pthread_create: cannot transfer canvas with ID "${name}" to thread, since the current thread does not have control over it!`);
          error = 63;
          // Operation not permitted, some other thread is accessing the canvas.
          break;
        }
        if (canvas.transferControlToOffscreen) {
          // Create a shared information block in heap so that we can control
          // the canvas size from any thread.
          if (!canvas.canvasSharedPtr) {
            canvas.canvasSharedPtr = _malloc(12);
            (growMemViews(), HEAP32)[((canvas.canvasSharedPtr) >>> 2) >>> 0] = canvas.width;
            (growMemViews(), HEAP32)[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0] = canvas.height;
            (growMemViews(), HEAPU32)[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0] = 0;
          }
          offscreenCanvasInfo = {
            offscreenCanvas: canvas.transferControlToOffscreen(),
            canvasSharedPtr: canvas.canvasSharedPtr,
            id: canvas.id
          };
          // After calling canvas.transferControlToOffscreen(), it is no
          // longer possible to access certain operations on the canvas, such
          // as resizing it or obtaining GL contexts via it.
          // Use this field to remember that we have permanently converted
          // this Canvas to be controlled via an OffscreenCanvas (there is no
          // way to undo this in the spec)
          canvas.controlTransferredOffscreen = true;
        } else {
          err(`pthread_create: cannot transfer control of canvas "${name}" to pthread, because current browser does not support OffscreenCanvas!`);
        }
      }
      if (offscreenCanvasInfo) {
        transferList.push(offscreenCanvasInfo.offscreenCanvas);
        offscreenCanvases[offscreenCanvasInfo.id] = offscreenCanvasInfo;
      }
    } catch (e) {
      err(`pthread_create: failed to transfer control of canvas "${name}" to OffscreenCanvas! Error: ${e}`);
      return 28;
    }
  }
  // Synchronously proxy the thread creation to main thread if possible. If we
  // need to transfer ownership of objects, then proxy asynchronously via
  // postMessage.
  if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
    return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
  }
  // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
  // with the detected error.
  if (error) return error;
  // Register for each of the transferred canvases that the new thread now
  // owns the OffscreenCanvas.
  for (var canvas of Object.values(offscreenCanvases)) {
    // pthread ptr to the thread that owns this canvas.
    (growMemViews(), HEAPU32)[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0] = pthread_ptr;
  }
  var threadParams = {
    startRoutine,
    pthread_ptr,
    arg,
    moduleCanvasId,
    offscreenCanvases,
    transferList
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    // The prepopulated pool of web workers that can host pthreads is stored
    // in the main JS thread. Therefore if a pthread is attempting to spawn a
    // new thread, the thread creation must be deferred to the main JS thread.
    threadParams.cmd = 5;
    postMessage(threadParams, transferList);
    // When we defer thread creation this way, we have no way to detect thread
    // creation synchronously today, so we have to assume success and return 0.
    return 0;
  }
  // We are the main thread, so we have the pthread warmup pool in this
  // thread and can fire off JS thread creation directly ourselves.
  return spawnThread(threadParams);
}

var coopCtx = {
  depth: 0
};

var __emscripten_coop_can_suspend = () => (ENVIRONMENT_IS_PTHREAD && coopCtx.depth === 0) ? 1 : 0;

var __emscripten_coop_deadlock = (addr, val, maxWaitMs) => {
  __geckoCoop.deadlock(addr >>> 0, val | 0, maxWaitMs, ENVIRONMENT_IS_PTHREAD ? workerID : 0);
};

var __emscripten_coop_mode = () => (typeof __geckoCoop != "undefined" && __geckoCoop.active) ? 1 : 0;

var __emscripten_coop_wait = (addr, val, maxWaitMs) => __geckoCoop.wait(addr >>> 0, val | 0, maxWaitMs);

var __emscripten_coop_wake = (addr, count) => __geckoCoop.wake(addr >>> 0, count);

var __emscripten_coop_yield = () => __geckoCoop.yieldNow();

function __emscripten_init_main_thread_js(tb) {
  tb >>>= 0;
  var can_block = !ENVIRONMENT_IS_WEB;
  // Feature detect whether the main thread can block.
  try {
    Atomics.wait((growMemViews(), HEAP32), 0, 0, 0);
    can_block = true;
  } catch (e) {}
  // Pass the thread address to the native code where they are stored in wasm
  // globals which act as a form of TLS. Global constructors trying
  // to access this value will read the wrong value, but that is UB anyway.
  __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, can_block, /*default_stacksize=*/ 67108864, /*start_profiling=*/ false);
  PThread.threadInitTLS();
}

var inetPton4 = str => {
  var b = str.split(".");
  for (var i = 0; i < 4; i++) {
    var tmp = Number(b[i]);
    if (isNaN(tmp)) return null;
    b[i] = tmp;
  }
  return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
};

var inetPton6 = str => {
  var words;
  var w, offset, z, i;
  /* http://home.deds.nl/~aeron/regex/ */ var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
  var parts = [];
  if (!valid6regx.test(str)) {
    return null;
  }
  if (str === "::") {
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }
  // Z placeholder to keep track of zeros when splitting the string on ":"
  if (str.startsWith("::")) {
    str = str.replace("::", "Z:");
  } else {
    str = str.replace("::", ":Z:");
  }
  if (str.indexOf(".") > 0) {
    // parse IPv4 embedded address
    str = str.replace(new RegExp("[.]", "g"), ":");
    words = str.split(":");
    words[words.length - 4] = Number(words[words.length - 4]) + Number(words[words.length - 3]) * 256;
    words[words.length - 3] = Number(words[words.length - 2]) + Number(words[words.length - 1]) * 256;
    words = words.slice(0, words.length - 2);
  } else {
    words = str.split(":");
  }
  offset = 0;
  z = 0;
  for (w = 0; w < words.length; w++) {
    if (typeof words[w] == "string") {
      if (words[w] === "Z") {
        // compressed zeros - write appropriate number of zero words
        for (z = 0; z < (8 - words.length + 1); z++) {
          parts[w + z] = 0;
        }
        offset = z - 1;
      } else {
        // parse hex field to 16-bit value and write it in network byte-order
        parts[w + offset] = _htons(parseInt(words[w], 16));
      }
    } else {
      // parsed IPv4 words
      parts[w + offset] = words[w];
    }
  }
  return [ (parts[1] << 16) | parts[0], (parts[3] << 16) | parts[2], (parts[5] << 16) | parts[4], (parts[7] << 16) | parts[6] ];
};

var DNS = {
  address_map: {
    id: 1,
    addrs: {},
    names: {}
  },
  lookup_name(name) {
    // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
    var res = inetPton4(name);
    if (res !== null) {
      return name;
    }
    res = inetPton6(name);
    if (res !== null) {
      return name;
    }
    // See if this name is already mapped.
    var addr;
    if (DNS.address_map.addrs[name]) {
      addr = DNS.address_map.addrs[name];
    } else {
      var id = DNS.address_map.id++;
      assert(id < 65535, "exceeded max address mappings of 65535");
      addr = "172.29." + (id & 255) + "." + (id & 65280);
      DNS.address_map.names[addr] = name;
      DNS.address_map.addrs[name] = addr;
    }
    return addr;
  },
  lookup_addr(addr) {
    if (DNS.address_map.names[addr]) {
      return DNS.address_map.names[addr];
    }
    return null;
  }
};

function __emscripten_lookup_name(name) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1, name);
  name >>>= 0;
  return inetPton4(DNS.lookup_name(UTF8ToString(name)));
}

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  checkStackCookie();
  if (e instanceof WebAssembly.RuntimeError) {
    if (_emscripten_stack_get_current() <= 0) {
      err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 67108864)");
    }
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) {
        // exit the current thread, but only if there is one active.
        // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
        // Unify this check with the runtimeExited check above
        if (_pthread_self()) __emscripten_thread_exit(EXITSTATUS);
        return;
      }
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    err("user callback triggered after runtime exited or application aborted.  Ignoring.");
    return;
  }
  try {
    return func();
  } catch (e) {
    handleException(e);
  } finally {
    maybeExit();
  }
};

function __emscripten_thread_mailbox_await(pthread_ptr) {
  pthread_ptr >>>= 0;
  if (!waitAsyncPolyfilled) {
    // Wait on the pthread's initial self-pointer field because it is easy and
    // safe to access from sending threads that need to notify the waiting
    // thread.
    // Note: Under wasm64 only the low 32-bit of the pthread_ptr are
    // read/compared here, but we don't actually care about the exact values
    // here as long as they match.
    var wait = Atomics.waitAsync((growMemViews(), HEAP32), ((pthread_ptr) >>> 2), pthread_ptr);
    assert(wait.async);
    wait.value.then(checkMailbox);
    var waitingAsync = pthread_ptr + 112;
    Atomics.store((growMemViews(), HEAP32), ((waitingAsync) >>> 2), 1);
  }
}

var checkMailbox = () => {
  // checkMailbox can be called after the pthread has shut down. See
  // Pthread.terminateRuntime().
  // In this case we return silently without re-registering using waitAsync.
  // Perhaps there is a more universal way we can detect runtime has exited.
  // TODO(https://github.com/emscripten-core/emscripten/issues/25076)
  var pthread_ptr = _pthread_self();
  if (!pthread_ptr) return;
  callUserCallback(() => {
    // If we are using Atomics.waitAsync as our notification mechanism, wait
    // for a notification before processing the mailbox to avoid missing any
    // work that could otherwise arrive after we've finished processing the
    // mailbox and before we're ready for the next notification.
    __emscripten_thread_mailbox_await(pthread_ptr);
    __emscripten_check_mailbox();
  });
};

function __emscripten_notify_mailbox_postmessage(targetThread, currThreadId) {
  targetThread >>>= 0;
  currThreadId >>>= 0;
  if (targetThread == currThreadId) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread,
      cmd: 4
    });
  } else {
    var worker = PThread.pthreads[targetThread];
    if (!worker) {
      err(`Cannot send message to thread with ID ${targetThread}, unknown thread ID!`);
      return;
    }
    worker.postMessage({
      cmd: 4
    });
  }
}

var registerPreMainLoop = f => {
  // Does nothing unless $MainLoop is included/used.
  typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f);
};

var GLctx;

var webgl_enable_ANGLE_instanced_arrays = ctx => {
  // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("ANGLE_instanced_arrays");
  // Because this extension is a core function in WebGL 2, assign the extension entry points in place of
  // where the core functions will reside in WebGL 2. This way the calling code can call these without
  // having to dynamically branch depending if running against WebGL 1 or WebGL 2.
  if (ext) {
    ctx["vertexAttribDivisor"] = (index, divisor) => ext["vertexAttribDivisorANGLE"](index, divisor);
    ctx["drawArraysInstanced"] = (mode, first, count, primcount) => ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
    ctx["drawElementsInstanced"] = (mode, count, type, indices, primcount) => ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    return 1;
  }
};

var webgl_enable_OES_vertex_array_object = ctx => {
  // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("OES_vertex_array_object");
  if (ext) {
    ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
    ctx["deleteVertexArray"] = vao => ext["deleteVertexArrayOES"](vao);
    ctx["bindVertexArray"] = vao => ext["bindVertexArrayOES"](vao);
    ctx["isVertexArray"] = vao => ext["isVertexArrayOES"](vao);
    return 1;
  }
};

var webgl_enable_WEBGL_draw_buffers = ctx => {
  // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("WEBGL_draw_buffers");
  if (ext) {
    ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
    return 1;
  }
};

var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx => // Closure is expected to be allowed to minify the '.dibvbi' property, so not accessing it quoted.
!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));

var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx => !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx => // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
  // Restrict the list of advertised extensions to those that we actually
  // support.
  var supportedExtensions = [ // WebGL 1 extensions
  "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", // WebGL 2 extensions
  "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", // WebGL 1 and WebGL 2 extensions
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
  // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
  return ctx.getSupportedExtensions()?.filter(ext => supportedExtensions.includes(ext)) ?? [];
};

var webglBufferSubData = (target, offset, size, data, src = (growMemViews(), HEAPU8)) => {
  GLctx.bufferSubData(target, offset, src.subarray(data, data + size));
};

var GL = {
  counter: 1,
  buffers: [],
  mappedBuffers: {},
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: {},
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    // Skip over any non-null elements that might have been created by
    // glBindBuffer.
    while (table[ret]) {
      ret = GL.counter++;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >>> 2) >>> 0] = id;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: i => 32 - Math.clz32(i === 0 ? 0 : i - 1),
  generateTempBuffers: (quads, context) => {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      // Created on-demand
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      // GL_QUAD indexes can be precalculated
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0, v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? (growMemViews(), HEAPU32)[(((length) + (i * 4)) >>> 2) >>> 0] : undefined;
      source += UTF8ToString((growMemViews(), HEAPU32)[(((string) + (i * 4)) >>> 2) >>> 0], len);
    }
    return source;
  },
  calcBufLength: (size, type, stride, count) => {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings: count => {
    GL.resetBufferBinding = false;
    // TODO: initial pass to detect ranges we need to upload, might not need
    // an upload per attrib
    for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
      var cb = GL.currentContext.clientBuffers[i];
      if (!cb.clientside || !cb.enabled) continue;
      assert(count || !GLctx.currentElementArrayBufferBinding, "must use array buffers when using element buffer");
      GL.resetBufferBinding = true;
      var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
      var buf = GL.getTempVertexBuffer(size);
      GLctx.bindBuffer(34962, buf);
      webglBufferSubData(34962, 0, size, cb.ptr);
      cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0);
    }
  },
  postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
    }
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // In proxied operation mode, rAF()/setTimeout() functions do not delimit
    // frame boundaries, so can't have WebGL implementation try to detect when
    // it's ok to discard contents of the rendered backbuffer.
    if (webGLContextAttributes.renderViaOffscreenBackBuffer) webGLContextAttributes["preserveDrawingBuffer"] = true;
    // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
    // context on a canvas, calling .getContext() will always return that
    // context independent of which 'webgl' or 'webgl2'
    // context version was passed. See:
    //   https://webkit.org/b/222758
    // and:
    //   https://github.com/emscripten-core/emscripten/issues/13295.
    // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
    // version field in above check.
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */ function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = (webGLContextAttributes.majorVersion > 1) ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  enableOffscreenFramebufferAttributes: webGLContextAttributes => {
    webGLContextAttributes.renderViaOffscreenBackBuffer = true;
    webGLContextAttributes.preserveDrawingBuffer = true;
  },
  createOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    // Create FBO
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(36160, fbo);
    context.defaultFbo = fbo;
    context.defaultFboForbidBlitFramebuffer = false;
    if (gl.getContextAttributes().antialias) {
      context.defaultFboForbidBlitFramebuffer = true;
    }
    // Create render targets to the FBO
    context.defaultColorTarget = gl.createTexture();
    context.defaultDepthTarget = gl.createRenderbuffer();
    // Size them up correctly (use the same mechanism when resizing on demand)
    GL.resizeOffscreenFramebuffer(context);
    gl.bindTexture(3553, context.defaultColorTarget);
    gl.texParameteri(3553, 10241, 9728);
    gl.texParameteri(3553, 10240, 9728);
    gl.texParameteri(3553, 10242, 33071);
    gl.texParameteri(3553, 10243, 33071);
    gl.texImage2D(3553, 0, 6408, gl.canvas.width, gl.canvas.height, 0, 6408, 5121, null);
    gl.framebufferTexture2D(36160, 36064, 3553, context.defaultColorTarget, 0);
    gl.bindTexture(3553, null);
    // Create depth render target to the FBO
    var depthTarget = gl.createRenderbuffer();
    gl.bindRenderbuffer(36161, context.defaultDepthTarget);
    gl.renderbufferStorage(36161, 33189, gl.canvas.width, gl.canvas.height);
    gl.framebufferRenderbuffer(36160, 36096, 36161, context.defaultDepthTarget);
    gl.bindRenderbuffer(36161, null);
    // Create blitter
    var vertices = [ -1, -1, -1, 1, 1, -1, 1, 1 ];
    var vb = gl.createBuffer();
    gl.bindBuffer(34962, vb);
    gl.bufferData(34962, new Float32Array(vertices), 35044);
    gl.bindBuffer(34962, null);
    context.blitVB = vb;
    var vsCode = "attribute vec2 pos;" + "varying lowp vec2 tex;" + "void main() { tex = pos * 0.5 + vec2(0.5,0.5); gl_Position = vec4(pos, 0.0, 1.0); }";
    var vs = gl.createShader(35633);
    gl.shaderSource(vs, vsCode);
    gl.compileShader(vs);
    var fsCode = "varying lowp vec2 tex;" + "uniform sampler2D sampler;" + "void main() { gl_FragColor = texture2D(sampler, tex); }";
    var fs = gl.createShader(35632);
    gl.shaderSource(fs, fsCode);
    gl.compileShader(fs);
    var blitProgram = gl.createProgram();
    gl.attachShader(blitProgram, vs);
    gl.attachShader(blitProgram, fs);
    gl.linkProgram(blitProgram);
    context.blitProgram = blitProgram;
    context.blitPosLoc = gl.getAttribLocation(blitProgram, "pos");
    gl.useProgram(blitProgram);
    gl.uniform1i(gl.getUniformLocation(blitProgram, "sampler"), 0);
    gl.useProgram(null);
    if (gl.createVertexArray) {
      context.defaultVao = gl.createVertexArray();
      gl.bindVertexArray(context.defaultVao);
      gl.enableVertexAttribArray(context.blitPosLoc);
      gl.bindVertexArray(null);
    }
  },
  resizeOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    // Resize color buffer
    if (context.defaultColorTarget) {
      var prevTextureBinding = gl.getParameter(32873);
      gl.bindTexture(3553, context.defaultColorTarget);
      gl.texImage2D(3553, 0, 6408, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, 6408, 5121, null);
      gl.bindTexture(3553, prevTextureBinding);
    }
    // Resize depth buffer
    if (context.defaultDepthTarget) {
      var prevRenderBufferBinding = gl.getParameter(36007);
      gl.bindRenderbuffer(36161, context.defaultDepthTarget);
      gl.renderbufferStorage(36161, 33189, gl.drawingBufferWidth, gl.drawingBufferHeight);
      // TODO: Read context creation parameters for what type of depth and stencil to use
      gl.bindRenderbuffer(36161, prevRenderBufferBinding);
    }
  },
  blitOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    var prevScissorTest = gl.getParameter(3089);
    if (prevScissorTest) gl.disable(3089);
    var prevFbo = gl.getParameter(36006);
    if (gl.blitFramebuffer && !context.defaultFboForbidBlitFramebuffer) {
      gl.bindFramebuffer(36008, context.defaultFbo);
      gl.bindFramebuffer(36009, null);
      gl.blitFramebuffer(0, 0, gl.canvas.width, gl.canvas.height, 0, 0, gl.canvas.width, gl.canvas.height, 16384, 9728);
    } else {
      gl.bindFramebuffer(36160, null);
      var prevProgram = gl.getParameter(35725);
      gl.useProgram(context.blitProgram);
      // If prevProgram was already marked for deletion, then, since it was
      // still bound, it was not *actually* deleted. Binding a new program
      // just now, thus, deleted the old one. This makes it impossible to
      // restore. Hopefully the application didn't actually need it!
      if (!gl.isProgram(prevProgram)) prevProgram = null;
      var prevVB = gl.getParameter(34964);
      gl.bindBuffer(34962, context.blitVB);
      var prevActiveTexture = gl.getParameter(34016);
      gl.activeTexture(33984);
      var prevTextureBinding = gl.getParameter(32873);
      gl.bindTexture(3553, context.defaultColorTarget);
      var prevBlend = gl.getParameter(3042);
      if (prevBlend) gl.disable(3042);
      var prevCullFace = gl.getParameter(2884);
      if (prevCullFace) gl.disable(2884);
      var prevDepthTest = gl.getParameter(2929);
      if (prevDepthTest) gl.disable(2929);
      var prevStencilTest = gl.getParameter(2960);
      if (prevStencilTest) gl.disable(2960);
      function draw() {
        gl.vertexAttribPointer(context.blitPosLoc, 2, 5126, false, 0, 0);
        gl.drawArrays(5, 0, 4);
      }
      if (context.defaultVao) {
        // WebGL 2 or OES_vertex_array_object
        var prevVAO = gl.getParameter(34229);
        gl.bindVertexArray(context.defaultVao);
        draw();
        gl.bindVertexArray(prevVAO);
      } else {
        var prevVertexAttribPointer = {
          buffer: gl.getVertexAttrib(context.blitPosLoc, 34975),
          size: gl.getVertexAttrib(context.blitPosLoc, 34339),
          stride: gl.getVertexAttrib(context.blitPosLoc, 34340),
          type: gl.getVertexAttrib(context.blitPosLoc, 34341),
          normalized: gl.getVertexAttrib(context.blitPosLoc, 34922),
          pointer: gl.getVertexAttribOffset(context.blitPosLoc, 34373)
        };
        var maxVertexAttribs = gl.getParameter(34921);
        var prevVertexAttribEnables = [];
        for (var i = 0; i < maxVertexAttribs; ++i) {
          var prevEnabled = gl.getVertexAttrib(i, 34338);
          var wantEnabled = i == context.blitPosLoc;
          if (prevEnabled && !wantEnabled) {
            gl.disableVertexAttribArray(i);
          }
          if (!prevEnabled && wantEnabled) {
            gl.enableVertexAttribArray(i);
          }
          prevVertexAttribEnables[i] = prevEnabled;
        }
        draw();
        for (var i = 0; i < maxVertexAttribs; ++i) {
          var prevEnabled = prevVertexAttribEnables[i];
          var nowEnabled = i == context.blitPosLoc;
          if (prevEnabled && !nowEnabled) {
            gl.enableVertexAttribArray(i);
          }
          if (!prevEnabled && nowEnabled) {
            gl.disableVertexAttribArray(i);
          }
        }
        gl.bindBuffer(34962, prevVertexAttribPointer.buffer);
        gl.vertexAttribPointer(context.blitPosLoc, prevVertexAttribPointer.size, prevVertexAttribPointer.type, prevVertexAttribPointer.normalized, prevVertexAttribPointer.stride, prevVertexAttribPointer.offset);
      }
      if (prevStencilTest) gl.enable(2960);
      if (prevDepthTest) gl.enable(2929);
      if (prevCullFace) gl.enable(2884);
      if (prevBlend) gl.enable(3042);
      gl.bindTexture(3553, prevTextureBinding);
      gl.activeTexture(prevActiveTexture);
      gl.bindBuffer(34962, prevVB);
      gl.useProgram(prevProgram);
    }
    gl.bindFramebuffer(36160, prevFbo);
    if (prevScissorTest) gl.enable(3089);
  },
  registerContext: (ctx, webGLContextAttributes) => {
    // with pthreads a context is a location in memory with some synchronized
    // data between threads
    var handle = _malloc(8);
    (growMemViews(), HEAP8)[handle >>> 0] = webGLContextAttributes.explicitSwapControl;
    (growMemViews(), HEAPU32)[(((handle) + (4)) >>> 2) >>> 0] = _pthread_self();
    // the thread pointer of the thread that owns the control of the context
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
    // Store the created context object so that we can access the context
    // given a canvas without having to pass the parameters again.
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null
      };
    }
    GL.generateTempBuffers(false, context);
    if (webGLContextAttributes.renderViaOffscreenBackBuffer) GL.createOffscreenFramebuffer(context);
    return handle;
  },
  makeContextCurrent: contextHandle => {
    // Active Emscripten GL layer context object.
    GL.currentContext = GL.contexts[contextHandle];
    // Active WebGL context object.
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      // Release all JS event handlers on the DOM element that the GL context is
      // associated with since the context is now deleted.
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
    // Make sure the canvas object no longer refers to the context object so
    // there are no GC surprises.
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    _free(GL.contexts[contextHandle].handle);
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
    // If this function is called without a specific context object, init the
    // extensions of the currently active context.
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    // Detect the presence of a few extensions manually, since the GL interop
    // layer itself will need to know if they exist.
    // Extensions that are available in both WebGL 1 and WebGL 2
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
    // Extensions that are only available in WebGL 1 (the calls will be no-ops
    // if called on a WebGL 2 context active)
    webgl_enable_ANGLE_instanced_arrays(GLctx);
    webgl_enable_OES_vertex_array_object(GLctx);
    webgl_enable_WEBGL_draw_buffers(GLctx);
    // Extensions that are available from WebGL >= 2 (no-op if called on a WebGL 1 context active)
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
    // On WebGL 2, EXT_disjoint_timer_query is replaced with an alternative
    // that's based on core APIs, and exposes only the queryCounterEXT()
    // entrypoint.
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
    }
    // However, Firefox exposes the WebGL 1 version on WebGL 2 as well and
    // thus we look for the WebGL 1 version again if the WebGL 2 version
    // isn't present. https://bugzil.la/1328882
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
      // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
      // are not enabled by default.
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        // Call .getExtension() to enable that extension permanently.
        GLctx.getExtension(ext);
      }
    }
  }
};

var __emscripten_proxied_gl_context_activated_from_main_browser_thread = contextHandle => {
  GLctx = Module["ctx"] = GL.currentContext = contextHandle;
  GL.currentContextIsProxied = true;
};

var proxiedJSCallArgs = [];

function __emscripten_receive_on_main_thread_js(funcIndex, emAsmAddr, callingThread, bufSize, args, ctx, ctxArgs) {
  emAsmAddr >>>= 0;
  callingThread >>>= 0;
  args >>>= 0;
  ctx >>>= 0;
  ctxArgs >>>= 0;
  // Sometimes we need to backproxy events to the calling thread (e.g.
  // HTML5 DOM events handlers such as
  // emscripten_set_mousemove_callback()), so keep track in a globally
  // accessible variable about the thread that initiated the proxying.
  proxiedJSCallArgs.length = 0;
  var b = ((args) >>> 3);
  var end = ((args + bufSize) >>> 3);
  while (b < end) {
    var arg;
    if ((growMemViews(), HEAP64)[b++ >>> 0]) {
      // It's a BigInt.
      arg = (growMemViews(), HEAP64)[b++ >>> 0];
    } else {
      // It's a Number.
      arg = (growMemViews(), HEAPF64)[b++ >>> 0];
    }
    proxiedJSCallArgs.push(arg);
  }
  // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  assert(!(funcIndex && emAsmAddr));
  assert(func.length == proxiedJSCallArgs.length, "Call args mismatch in _emscripten_receive_on_main_thread_js");
  PThread.currentProxiedOperationCallerThread = callingThread;
  var rtn = func(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  if (ctx) {
    Promise.resolve(rtn).then(rtn => __emscripten_run_js_on_main_thread_done(ctx, ctxArgs, rtn));
    return;
  }
  // Proxied functions can return any type except bigint.  All other types
  // coerce to f64/double (the return type of this function in C) but not
  // bigint.
  assert(typeof rtn != "bigint");
  return rtn;
}

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

function __emscripten_thread_cleanup(thread) {
  thread >>>= 0;
  // Called when a thread needs to be cleaned up so it can be reused.
  // A thread is considered reusable when it either returns from its
  // entry point, calls pthread_exit, or acts upon a cancellation.
  // Detached threads are responsible for calling this themselves,
  // otherwise pthread_join is responsible for calling this.
  if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
    cmd: 6,
    thread
  });
}

function __emscripten_thread_set_strongref(thread) {
  thread >>>= 0;
}

function __gmtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  (growMemViews(), HEAP32)[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  (growMemViews(), HEAP32)[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
  (growMemViews(), HEAP32)[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var __mktime_js = function(tmPtr) {
  tmPtr >>>= 0;
  var ret = (() => {
    var date = new Date((growMemViews(), HEAP32)[(((tmPtr) + (20)) >>> 2) >>> 0] + 1900, (growMemViews(), 
    HEAP32)[(((tmPtr) + (16)) >>> 2) >>> 0], (growMemViews(), HEAP32)[(((tmPtr) + (12)) >>> 2) >>> 0], (growMemViews(), 
    HEAP32)[(((tmPtr) + (8)) >>> 2) >>> 0], (growMemViews(), HEAP32)[(((tmPtr) + (4)) >>> 2) >>> 0], (growMemViews(), 
    HEAP32)[((tmPtr) >>> 2) >>> 0], 0);
    if (isNaN(date.getTime())) {
      return -1;
    }
    // There's an ambiguous hour when the time goes back; the tm_isdst field is
    // used to disambiguate it.  Date() basically guesses, so we fix it up if it
    // guessed wrong, or fill in tm_isdst with the guess if it's -1.
    var dst = (growMemViews(), HEAP32)[(((tmPtr) + (32)) >>> 2) >>> 0];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    // DST is in December in South
    if (dst < 0) {
      // Attention: some regions don't have DST at all.
      (growMemViews(), HEAP32)[(((tmPtr) + (32)) >>> 2) >>> 0] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
    } else if ((dst > 0) != (dstOffset == guessedOffset)) {
      var nonDstOffset = Math.max(winterOffset, summerOffset);
      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
      // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
    }
    (growMemViews(), HEAP32)[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
    var yday = ydayFromDate(date) | 0;
    (growMemViews(), HEAP32)[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
    // To match expected behavior, update fields from date
    (growMemViews(), HEAP32)[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
    (growMemViews(), HEAP32)[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
    (growMemViews(), HEAP32)[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
    (growMemViews(), HEAP32)[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
    (growMemViews(), HEAP32)[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
    (growMemViews(), HEAP32)[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getYear();
    // Return time in seconds
    return date.getTime() / 1e3;
  })();
  return BigInt(ret);
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  outIdx >>>= 0;
  assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++ >>> 0] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++ >>> 0] = 192 | (u >> 6);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++ >>> 0] = 224 | (u >> 12);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u > 1114111) warnOnce(`Invalid Unicode code point ${ptrToString(u)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).`);
      heap[outIdx++ >>> 0] = 240 | (u >> 18);
      heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
      // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
      // We need to manually skip over the second code unit for correct iteration.
      i++;
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx >>> 0] = 0;
  return outIdx - startIdx;
};

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
  assert(typeof maxBytesToWrite == "number", "stringToUTF8 requires a third parameter that specifies the length of the output buffer");
  return stringToUTF8Array(str, (growMemViews(), HEAPU8), outPtr, maxBytesToWrite);
};

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var __tzset_js = function(timezone, daylight, std_name, dst_name) {
  timezone >>>= 0;
  daylight >>>= 0;
  std_name >>>= 0;
  dst_name >>>= 0;
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  (growMemViews(), HEAPU32)[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
  (growMemViews(), HEAP32)[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  assert(winterName);
  assert(summerName);
  assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
  assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

function __wasmfs_copy_preloaded_file_data(index, buffer) {
  buffer >>>= 0;
  return (growMemViews(), HEAPU8).set(wasmFSPreloadedFiles[index].fileData, buffer >>> 0);
}

var wasmFSPreloadedDirs = [];

var __wasmfs_get_num_preloaded_dirs = () => wasmFSPreloadedDirs.length;

var wasmFSPreloadedFiles = [];

var wasmFSPreloadingFlushed = false;

var __wasmfs_get_num_preloaded_files = () => {
  // When this method is called from WasmFS it means that we are about to
  // flush all the preloaded data, so mark that. (There is no call that
  // occurs at the end of that flushing, which would be more natural, but it
  // is fine to mark the flushing here as during the flushing itself no user
  // code can run, so nothing will check whether we have flushed or not.)
  wasmFSPreloadingFlushed = true;
  return wasmFSPreloadedFiles.length;
};

function __wasmfs_get_preloaded_child_path(index, childNameBuffer) {
  childNameBuffer >>>= 0;
  var s = wasmFSPreloadedDirs[index].childName;
  var len = lengthBytesUTF8(s) + 1;
  stringToUTF8(s, childNameBuffer, len);
}

var __wasmfs_get_preloaded_file_mode = index => wasmFSPreloadedFiles[index].mode;

function __wasmfs_get_preloaded_file_size(index) {
  return wasmFSPreloadedFiles[index].fileData.length;
}

function __wasmfs_get_preloaded_parent_path(index, parentPathBuffer) {
  parentPathBuffer >>>= 0;
  var s = wasmFSPreloadedDirs[index].parentPath;
  var len = lengthBytesUTF8(s) + 1;
  stringToUTF8(s, parentPathBuffer, len);
}

function __wasmfs_get_preloaded_path_name(index, fileNameBuffer) {
  fileNameBuffer >>>= 0;
  var s = wasmFSPreloadedFiles[index].pathName;
  var len = lengthBytesUTF8(s) + 1;
  stringToUTF8(s, fileNameBuffer, len);
}

function __wasmfs_jsimpl_alloc_file(backend, file) {
  backend >>>= 0;
  file >>>= 0;
  assert(wasmFS$backends[backend]);
  return wasmFS$backends[backend].allocFile(file);
}

function __wasmfs_jsimpl_free_file(backend, file) {
  backend >>>= 0;
  file >>>= 0;
  assert(wasmFS$backends[backend]);
  return wasmFS$backends[backend].freeFile(file);
}

function __wasmfs_jsimpl_get_size(backend, file) {
  backend >>>= 0;
  file >>>= 0;
  assert(wasmFS$backends[backend]);
  return wasmFS$backends[backend].getSize(file);
}

function __wasmfs_jsimpl_read(backend, file, buffer, length, offset) {
  backend >>>= 0;
  file >>>= 0;
  buffer >>>= 0;
  length >>>= 0;
  offset = bigintToI53Checked(offset);
  assert(wasmFS$backends[backend]);
  if (!wasmFS$backends[backend].read) {
    return -28;
  }
  return wasmFS$backends[backend].read(file, buffer, length, offset);
}

function __wasmfs_jsimpl_set_size(backend, file, size) {
  backend >>>= 0;
  file >>>= 0;
  size = bigintToI53Checked(size);
  assert(wasmFS$backends[backend]);
  return wasmFS$backends[backend].setSize(file, size);
}

function __wasmfs_jsimpl_write(backend, file, buffer, length, offset) {
  backend >>>= 0;
  file >>>= 0;
  buffer >>>= 0;
  length >>>= 0;
  offset = bigintToI53Checked(offset);
  assert(wasmFS$backends[backend]);
  if (!wasmFS$backends[backend].write) {
    return -28;
  }
  return wasmFS$backends[backend].write(file, buffer, length, offset);
}

class HandleAllocator {
  allocated=[ undefined ];
  freelist=[];
  get(id) {
    assert(this.allocated[id] !== undefined, `invalid handle: ${id}`);
    return this.allocated[id];
  }
  has(id) {
    return this.allocated[id] !== undefined;
  }
  allocate(handle) {
    var id = this.freelist.pop() ?? this.allocated.length;
    this.allocated[id] = handle;
    return id;
  }
  free(id) {
    assert(this.allocated[id] !== undefined);
    // Set the slot to `undefined` rather than using `delete` here since
    // apparently arrays with holes in them can be less efficient.
    this.allocated[id] = undefined;
    this.freelist.push(id);
  }
}

var wasmfsOPFSAccessHandles = new HandleAllocator;

var wasmfsOPFSProxyFinish = ctx => {
  // When using pthreads the proxy needs to know when the work is finished.
  // When used with JSPI the work will be executed in an async block so there
  // is no need to notify when done.
  _emscripten_proxy_finish(ctx);
};

async function __wasmfs_opfs_close_access(ctx, accessID, errPtr) {
  ctx >>>= 0;
  errPtr >>>= 0;
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  try {
    await accessHandle.close();
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSAccessHandles.free(accessID);
  wasmfsOPFSProxyFinish(ctx);
}

var wasmfsOPFSBlobs = new HandleAllocator;

var __wasmfs_opfs_close_blob = blobID => {
  wasmfsOPFSBlobs.free(blobID);
};

async function __wasmfs_opfs_flush_access(ctx, accessID, errPtr) {
  ctx >>>= 0;
  errPtr >>>= 0;
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  try {
    await accessHandle.flush();
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

var wasmfsOPFSDirectoryHandles = new HandleAllocator;

var __wasmfs_opfs_free_directory = dirID => {
  wasmfsOPFSDirectoryHandles.free(dirID);
};

var wasmfsOPFSFileHandles = new HandleAllocator;

var __wasmfs_opfs_free_file = fileID => {
  wasmfsOPFSFileHandles.free(fileID);
};

var wasmfsOPFSGetOrCreateFile = async (parent, name, create) => {
  let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
  let fileHandle;
  try {
    fileHandle = await parentHandle.getFileHandle(name, {
      create
    });
  } catch (e) {
    if (e.name === "NotFoundError") {
      return -20;
    }
    if (e.name === "TypeMismatchError") {
      return -31;
    }
    err("unexpected error:", e, e.stack);
    return -29;
  }
  return wasmfsOPFSFileHandles.allocate(fileHandle);
};

var wasmfsOPFSGetOrCreateDir = async (parent, name, create) => {
  let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
  let childHandle;
  try {
    childHandle = await parentHandle.getDirectoryHandle(name, {
      create
    });
  } catch (e) {
    if (e.name === "NotFoundError") {
      return -20;
    }
    if (e.name === "TypeMismatchError") {
      return -54;
    }
    err("unexpected error:", e, e.stack);
    return -29;
  }
  return wasmfsOPFSDirectoryHandles.allocate(childHandle);
};

async function __wasmfs_opfs_get_child(ctx, parent, namePtr, childTypePtr, childIDPtr) {
  ctx >>>= 0;
  namePtr >>>= 0;
  childTypePtr >>>= 0;
  childIDPtr >>>= 0;
  let name = UTF8ToString(namePtr);
  let childType = 1;
  let childID = await wasmfsOPFSGetOrCreateFile(parent, name, false);
  if (childID == -31) {
    childType = 2;
    childID = await wasmfsOPFSGetOrCreateDir(parent, name, false);
  }
  (growMemViews(), HEAP32)[((childTypePtr) >>> 2) >>> 0] = childType;
  (growMemViews(), HEAP32)[((childIDPtr) >>> 2) >>> 0] = childID;
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_get_entries(ctx, dirID, entriesPtr, errPtr) {
  ctx >>>= 0;
  entriesPtr >>>= 0;
  errPtr >>>= 0;
  let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
  // TODO: Use 'for await' once Acorn supports that.
  try {
    let iter = dirHandle.entries();
    for (let entry; entry = await iter.next(), !entry.done; ) {
      let [name, child] = entry.value;
      let sp = stackSave();
      let namePtr = stringToUTF8OnStack(name);
      let type = child.kind == "file" ? 1 : 2;
      __wasmfs_opfs_record_entry(entriesPtr, namePtr, type);
      stackRestore(sp);
    }
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_get_size_access(ctx, accessID, sizePtr) {
  ctx >>>= 0;
  sizePtr >>>= 0;
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  let size;
  try {
    size = await accessHandle.getSize();
  } catch {
    size = -29;
  }
  (growMemViews(), HEAP64)[((sizePtr) >>> 3) >>> 0] = BigInt(size);
  wasmfsOPFSProxyFinish(ctx);
}

var __wasmfs_opfs_get_size_blob = function(blobID) {
  var ret = (() => wasmfsOPFSBlobs.get(blobID).size)();
  return BigInt(ret);
};

async function __wasmfs_opfs_get_size_file(ctx, fileID, sizePtr) {
  ctx >>>= 0;
  sizePtr >>>= 0;
  let fileHandle = wasmfsOPFSFileHandles.get(fileID);
  let size;
  try {
    size = (await fileHandle.getFile()).size;
  } catch {
    size = -29;
  }
  (growMemViews(), HEAP64)[((sizePtr) >>> 3) >>> 0] = BigInt(size);
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_init_root_directory(ctx) {
  ctx >>>= 0;
  // allocated.length starts off as 1 since 0 is a reserved handle
  if (wasmfsOPFSDirectoryHandles.allocated.length == 1) {
    // Closure compiler errors on this as it does not recognize the OPFS
    // API yet, it seems. Unfortunately an existing annotation for this is in
    // the closure compiler codebase, and cannot be overridden in user code
    // (it complains on a duplicate type annotation), so just suppress it.
    /** @suppress {checkTypes} */ let root = await navigator.storage.getDirectory();
    wasmfsOPFSDirectoryHandles.allocated.push(root);
  }
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_insert_directory(ctx, parent, namePtr, childIDPtr) {
  ctx >>>= 0;
  namePtr >>>= 0;
  childIDPtr >>>= 0;
  let name = UTF8ToString(namePtr);
  let childID = await wasmfsOPFSGetOrCreateDir(parent, name, true);
  (growMemViews(), HEAP32)[((childIDPtr) >>> 2) >>> 0] = childID;
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_insert_file(ctx, parent, namePtr, childIDPtr) {
  ctx >>>= 0;
  namePtr >>>= 0;
  childIDPtr >>>= 0;
  let name = UTF8ToString(namePtr);
  let childID = await wasmfsOPFSGetOrCreateFile(parent, name, true);
  (growMemViews(), HEAP32)[((childIDPtr) >>> 2) >>> 0] = childID;
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_move_file(ctx, fileID, newParentID, namePtr, errPtr) {
  ctx >>>= 0;
  namePtr >>>= 0;
  errPtr >>>= 0;
  let name = UTF8ToString(namePtr);
  let fileHandle = wasmfsOPFSFileHandles.get(fileID);
  let newDirHandle = wasmfsOPFSDirectoryHandles.get(newParentID);
  try {
    await fileHandle.move(newDirHandle, name);
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_open_access(ctx, fileID, accessIDPtr) {
  ctx >>>= 0;
  accessIDPtr >>>= 0;
  let fileHandle = wasmfsOPFSFileHandles.get(fileID);
  let accessID;
  try {
    let accessHandle;
    // TODO: Remove this once the Access Handles API has settled.
    // TODO: Closure is confused by this code that supports two versions of
    //       the same API, so suppress type checking on it.
    /** @suppress {checkTypes} */ var len = FileSystemFileHandle.prototype.createSyncAccessHandle.length;
    if (len == 0) {
      accessHandle = await fileHandle.createSyncAccessHandle();
    } else {
      accessHandle = await fileHandle.createSyncAccessHandle({
        mode: "in-place"
      });
    }
    accessID = wasmfsOPFSAccessHandles.allocate(accessHandle);
  } catch (e) {
    // TODO: Presumably only one of these will appear in the final API?
    if (e.name === "InvalidStateError" || e.name === "NoModificationAllowedError") {
      accessID = -2;
    } else {
      err("unexpected error:", e, e.stack);
      accessID = -29;
    }
  }
  (growMemViews(), HEAP32)[((accessIDPtr) >>> 2) >>> 0] = accessID;
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_open_blob(ctx, fileID, blobIDPtr) {
  ctx >>>= 0;
  blobIDPtr >>>= 0;
  let fileHandle = wasmfsOPFSFileHandles.get(fileID);
  let blobID;
  try {
    let blob = await fileHandle.getFile();
    blobID = wasmfsOPFSBlobs.allocate(blob);
  } catch (e) {
    if (e.name === "NotAllowedError") {
      blobID = -2;
    } else {
      err("unexpected error:", e, e.stack);
      blobID = -29;
    }
  }
  (growMemViews(), HEAP32)[((blobIDPtr) >>> 2) >>> 0] = blobID;
  wasmfsOPFSProxyFinish(ctx);
}

function __wasmfs_opfs_read_access(accessID, bufPtr, len, pos) {
  bufPtr >>>= 0;
  pos = bigintToI53Checked(pos);
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  let data = (growMemViews(), HEAPU8).subarray(bufPtr >>> 0, bufPtr + len >>> 0);
  try {
    return accessHandle.read(data, {
      at: pos
    });
  } catch (e) {
    if (e.name == "TypeError") {
      return -28;
    }
    err("unexpected error:", e, e.stack);
    return -29;
  }
}

async function __wasmfs_opfs_read_blob(ctx, blobID, bufPtr, len, pos, nreadPtr) {
  ctx >>>= 0;
  bufPtr >>>= 0;
  pos = bigintToI53Checked(pos);
  nreadPtr >>>= 0;
  let blob = wasmfsOPFSBlobs.get(blobID);
  let slice = blob.slice(pos, pos + len);
  let nread = 0;
  try {
    // TODO: Use ReadableStreamBYOBReader once
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1189621 is
    // resolved.
    let buf = await slice.arrayBuffer();
    let data = new Uint8Array(buf);
    (growMemViews(), HEAPU8).set(data, bufPtr >>> 0);
    nread += data.length;
  } catch (e) {
    if (e instanceof RangeError) {
      nread = -21;
    } else {
      err("unexpected error:", e, e.stack);
      nread = -29;
    }
  }
  (growMemViews(), HEAP32)[((nreadPtr) >>> 2) >>> 0] = nread;
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_remove_child(ctx, dirID, namePtr, errPtr) {
  ctx >>>= 0;
  namePtr >>>= 0;
  errPtr >>>= 0;
  let name = UTF8ToString(namePtr);
  let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
  try {
    await dirHandle.removeEntry(name);
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_set_size_access(ctx, accessID, size, errPtr) {
  ctx >>>= 0;
  size = bigintToI53Checked(size);
  errPtr >>>= 0;
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  try {
    await accessHandle.truncate(size);
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_set_size_file(ctx, fileID, size, errPtr) {
  ctx >>>= 0;
  size = bigintToI53Checked(size);
  errPtr >>>= 0;
  let fileHandle = wasmfsOPFSFileHandles.get(fileID);
  try {
    let writable = await fileHandle.createWritable({
      keepExistingData: true
    });
    await writable.truncate(size);
    await writable.close();
  } catch {
    let err = -29;
    (growMemViews(), HEAP32)[((errPtr) >>> 2) >>> 0] = err;
  }
  wasmfsOPFSProxyFinish(ctx);
}

function __wasmfs_opfs_write_access(accessID, bufPtr, len, pos) {
  bufPtr >>>= 0;
  pos = bigintToI53Checked(pos);
  let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
  let data = (growMemViews(), HEAPU8).subarray(bufPtr >>> 0, bufPtr + len >>> 0);
  try {
    return accessHandle.write(data, {
      at: pos
    });
  } catch (e) {
    if (e.name == "TypeError") {
      return -28;
    }
    err("unexpected error:", e, e.stack);
    return -29;
  }
}

var FS_stdin_getChar_buffer = [];

/** @type {function(string, boolean=, number=)} */ var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (globalThis.window?.prompt) {
      // Browser.
      result = window.prompt("Input: ");
      // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var __wasmfs_stdin_get_char = () => {
  // Return the read character, or -1 to indicate EOF.
  var c = FS_stdin_getChar();
  if (typeof c === "number") {
    return c;
  }
  return -1;
};

var __wasmfs_thread_utils_heartbeat = function(queue) {
  queue >>>= 0;
  var intervalID = setInterval(() => {
    if (ABORT) {
      clearInterval(intervalID);
    } else {
      _emscripten_proxy_execute_queue(queue);
    }
  }, 50);
};

var wcaOff = {
  WC_WRITE: 0,
  WC_READ: 1,
  WC_FLUSH: 2,
  WC_ERROR: 3,
  WC_FUTEX: 4,
  WC_HDR: 5,
  RING_N: 64,
  SLOT_INTS: 7,
  AL_PTR: 0,
  AL_BYTES: 1,
  AL_FRAMES: 2,
  AL_CH: 3,
  AL_RATE: 4,
  AL_TSLO: 5,
  AL_TSHI: 6
};

var wcaRT = {
  decoders: null,
  nextId: 1,
  ctx: null,
  sink: null,
  sinkReady: null,
  ringCtrl: null,
  ringPcm: null,
  ringFrames: 0,
  ringChannels: 2,
  resumeBound: false,
  playing: true,
  preferredRate: 0,
  mediaClockUs: 0,
  mediaClockWall: 0,
  audioGen: 0,
  justResumed: false,
  justSeeked: false,
  pending: [],
  pendingTimer: 0,
  lastWriteL: 0,
  lastWriteR: 0,
  haveLastWrite: false,
  ensure: function() {
    if (!wcaRT.decoders) wcaRT.decoders = new Map;
    wcaRT.ensureAudioContext();
  },
  ensureAudioContext: function() {
    if (wcaRT.ctx || typeof window === "undefined") return;
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) {
      console.warn("[webcodecs-audio] AudioContext unavailable");
      return;
    }
    try {
      var opts = {
        latencyHint: "playback"
      };
      if (wcaRT.preferredRate) opts.sampleRate = wcaRT.preferredRate;
      wcaRT.ctx = new Ctor(opts);
    } catch (_) {
      try {
        wcaRT.ctx = new Ctor;
      } catch (e) {
        console.warn("[webcodecs-audio] AudioContext create failed:", e && e.message ? e.message : e);
        return;
      }
    }
    if (!wcaRT.resumeBound) {
      wcaRT.resumeBound = true;
      var resume = function() {
        if (!wcaRT.ctx || wcaRT.ctx.state === "running") return;
        wcaRT.ctx.resume().catch(function() {});
      };
      [ "pointerdown", "mousedown", "touchstart", "keydown" ].forEach(function(type) {
        window.addEventListener(type, resume, {
          passive: true
        });
      });
    }
    wcaRT.ensureSink();
  },
  ensureSink: function() {
    if (wcaRT.sink || wcaRT.sinkReady || !wcaRT.ctx || !wcaRT.ctx.audioWorklet) return;
    var code = "class HostAudioSink extends AudioWorkletProcessor {" + "constructor(o){super();this.ctrl=new Int32Array(o.processorOptions.ctrl);this.pcm=new Float32Array(o.processorOptions.pcm);this.started=false;this.fade=0;this.prebuffer=Math.floor(sampleRate*0.06);}" + "process(i,o){var out=o[0];if(!out||!out.length)return true;var n=out[0].length;for(var c=0;c<out.length;c++)out[c].fill(0);if(!Atomics.load(this.ctrl,4))return true;var cap=Atomics.load(this.ctrl,2),ch=Atomics.load(this.ctrl,3),w=Atomics.load(this.ctrl,0),r=Atomics.load(this.ctrl,1),avail=w-r;if(!this.started){if(avail<this.prebuffer)return true;this.started=true;this.fade=0;}for(var f=0;f<n&&r<w;f++,r++){var base=(r%cap)*ch;for(var c=0;c<out.length;c++){var srcCh=ch===1?0:Math.min(c,ch-1),g=this.fade<128?this.fade/128:1;out[c][f]=this.pcm[base+srcCh]*g;}if(this.fade<128)this.fade++;}Atomics.store(this.ctrl,1,r);if(r>=w){this.started=false;this.fade=0;}return true;}} registerProcessor('host-audio-sink', HostAudioSink);";
    var url = "data:application/javascript;charset=utf-8," + encodeURIComponent(code);
    wcaRT.ringFrames = Math.max(8192, Math.floor(wcaRT.ctx.sampleRate * 2));
    wcaRT.ringCtrl = new Int32Array(new SharedArrayBuffer(8 * 4));
    wcaRT.ringPcm = new Float32Array(new SharedArrayBuffer(wcaRT.ringFrames * wcaRT.ringChannels * 4));
    Atomics.store(wcaRT.ringCtrl, 2, wcaRT.ringFrames);
    Atomics.store(wcaRT.ringCtrl, 3, wcaRT.ringChannels);
    Atomics.store(wcaRT.ringCtrl, 4, wcaRT.playing ? 1 : 0);
    wcaRT.sinkReady = wcaRT.ctx.audioWorklet.addModule(url).then(function() {
      wcaRT.sink = new AudioWorkletNode(wcaRT.ctx, "host-audio-sink", {
        outputChannelCount: [ 2 ],
        processorOptions: {
          ctrl: wcaRT.ringCtrl.buffer,
          pcm: wcaRT.ringPcm.buffer
        }
      });
      wcaRT.sink.connect(wcaRT.ctx.destination);
    }).catch(function(e) {
      console.warn("[webcodecs-audio] AudioWorklet create failed:", e && e.message ? e.message : e);
    });
  },
  enqueueToHostAudio: function(reg, data, ptr, bytes) {
    var ctx = wcaRT.ctx;
    if (!ctx || !data || !bytes) return false;
    if (!wcaRT.playing) return false;
    if (!wcaRT.sink) return false;
    if (ctx.state === "suspended") ctx.resume().catch(function() {});
    var frames = data.numberOfFrames;
    var channels = data.numberOfChannels;
    var rate = data.sampleRate;
    var ts = data.timestamp;
    if (!frames || !channels || !rate) return false;
    if (reg.lastScheduledTs != null && ts <= reg.lastScheduledTs) return false;
    var src = (growMemViews(), HEAPF32).subarray(ptr >>> 2, (ptr + bytes) >>> 2);
    var outFrames = frames;
    var samples;
    if (rate === ctx.sampleRate) {
      samples = new Float32Array(src);
    } else {
      outFrames = Math.max(1, Math.round(frames * ctx.sampleRate / rate));
      samples = new Float32Array(outFrames * channels);
      var scale = rate / ctx.sampleRate;
      for (var i = 0; i < outFrames; i++) {
        var pos = i * scale;
        var i0 = Math.min(frames - 1, pos | 0);
        var i1 = Math.min(frames - 1, i0 + 1);
        var frac = pos - i0;
        for (var ch = 0; ch < channels; ch++) {
          var a = src[i0 * channels + ch];
          var b = src[i1 * channels + ch];
          samples[i * channels + ch] = a + (b - a) * frac;
        }
      }
    }
    reg.lastScheduledTs = ts;
    wcaRT.queueTimedSamples(ts, samples, outFrames, channels, wcaRT.audioGen);
    return true;
  },
  currentMediaUs: function() {
    if (!wcaRT.mediaClockWall) return 0;
    return wcaRT.mediaClockUs + (performance.now() - wcaRT.mediaClockWall) * 1e3;
  },
  queueTimedSamples: function(ts, samples, frames, channels, gen) {
    if (!wcaRT.sink || !wcaRT.playing || gen !== wcaRT.audioGen) return;
    wcaRT.pending.push({
      ts,
      samples,
      frames,
      channels,
      gen
    });
    if (!wcaRT.pendingTimer) wcaRT.pendingTimer = setTimeout(wcaRT.drainPending, 0);
  },
  drainPending: function() {
    wcaRT.pendingTimer = 0;
    if (!wcaRT.sink) {
      wcaRT.pending.length = 0;
      return;
    }
    if (!wcaRT.playing) return;
    wcaRT.pending.sort(function(a, b) {
      return a.ts - b.ts;
    });
    var nowUs = wcaRT.currentMediaUs();
    while (wcaRT.pending.length) {
      var p = wcaRT.pending[0];
      if (p.gen !== wcaRT.audioGen) {
        wcaRT.pending.shift();
        continue;
      }
      var leadUs = p.ts - nowUs;
      var maxLeadUs = (wcaRT.justResumed || wcaRT.justSeeked) ? 9e4 : 42e4;
      if (leadUs > maxLeadUs) break;
      wcaRT.pending.shift();
      wcaRT.writeRing(p.samples, p.frames, p.channels, p.ts);
      wcaRT.justResumed = false;
      wcaRT.justSeeked = false;
    }
    if (wcaRT.pending.length) {
      var targetLeadUs = (wcaRT.justResumed || wcaRT.justSeeked) ? 4e4 : 3e5;
      var wait = Math.min(100, Math.max(5, (wcaRT.pending[0].ts - wcaRT.currentMediaUs() - targetLeadUs) / 1e3));
      wcaRT.pendingTimer = setTimeout(wcaRT.drainPending, wait);
    }
  },
  writeRing: function(samples, frames, channels, ts) {
    var ctrl = wcaRT.ringCtrl, pcm = wcaRT.ringPcm;
    if (!ctrl || !pcm || !frames) return;
    var cap = wcaRT.ringFrames, outCh = wcaRT.ringChannels;
    var w = Atomics.load(ctrl, 0), r = Atomics.load(ctrl, 1);
    if (frames > cap) {
      var skip = frames - cap;
      samples = samples.subarray(skip * channels);
      frames = cap;
    }
    var overflow = (w - r) + frames - cap;
    if (overflow > 0) {
      r += overflow;
      Atomics.store(ctrl, 1, r);
    }
    if (wcaRT.haveLastWrite && frames > 0) {
      var firstL = samples[0];
      var firstR = channels > 1 ? samples[1] : firstL;
      var jump = Math.max(Math.abs(firstL - wcaRT.lastWriteL), Math.abs(firstR - wcaRT.lastWriteR));
      if (jump > .35) {
        var n = Math.min(frames, 64);
        for (var j = 0; j < n; j++) {
          var t = (j + 1) / (n + 1);
          samples[j * channels] = wcaRT.lastWriteL + (samples[j * channels] - wcaRT.lastWriteL) * t;
          if (channels > 1) {
            samples[j * channels + 1] = wcaRT.lastWriteR + (samples[j * channels + 1] - wcaRT.lastWriteR) * t;
          }
        }
      }
    }
    for (var i = 0; i < frames; i++) {
      var dst = ((w + i) % cap) * outCh;
      var src = i * channels;
      pcm[dst] = samples[src];
      pcm[dst + 1] = channels > 1 ? samples[src + 1] : samples[src];
    }
    var tail = (frames - 1) * channels;
    wcaRT.lastWriteL = samples[tail];
    wcaRT.lastWriteR = channels > 1 ? samples[tail + 1] : samples[tail];
    wcaRT.haveLastWrite = true;
    Atomics.store(ctrl, 0, w + frames);
  },
  stopPlayback: function(reg) {
    if (reg) reg.lastScheduledTs = null;
    wcaRT.audioGen++;
    wcaRT.pending.length = 0;
    if (wcaRT.pendingTimer) {
      clearTimeout(wcaRT.pendingTimer);
      wcaRT.pendingTimer = 0;
    }
    wcaRT.haveLastWrite = false;
    if (wcaRT.ringCtrl) {
      var w = Atomics.load(wcaRT.ringCtrl, 0);
      Atomics.store(wcaRT.ringCtrl, 1, w);
    }
  },
  stopAllPlayback: function() {
    if (wcaRT.decoders) {
      wcaRT.decoders.forEach(function(reg) {
        wcaRT.stopPlayback(reg);
      });
    }
    wcaRT.pending.length = 0;
    if (wcaRT.pendingTimer) {
      clearTimeout(wcaRT.pendingTimer);
      wcaRT.pendingTimer = 0;
    }
    wcaRT.haveLastWrite = false;
    if (wcaRT.ringCtrl) {
      var w = Atomics.load(wcaRT.ringCtrl, 0);
      Atomics.store(wcaRT.ringCtrl, 1, w);
    }
  },
  setPlaying: function(playing) {
    wcaRT.playing = !!playing;
    wcaRT.justResumed = wcaRT.playing;
    wcaRT.mediaClockWall = performance.now();
    wcaRT.ensureAudioContext();
    if (!wcaRT.ctx) return;
    if (wcaRT.ringCtrl) Atomics.store(wcaRT.ringCtrl, 4, wcaRT.playing ? 1 : 0);
    if (wcaRT.playing) {
      if (wcaRT.pending.length && !wcaRT.pendingTimer) {
        wcaRT.pendingTimer = setTimeout(wcaRT.drainPending, 0);
      }
      wcaRT.ctx.resume().catch(function() {});
    }
  },
  wake: function(reg) {
    var fi = (reg.ctrl >> 2) + wcaOff.WC_FUTEX;
    Atomics.add((growMemViews(), HEAP32), fi, 1);
    Atomics.notify((growMemViews(), HEAP32), fi, 1);
  },
  setError: function(reg) {
    Atomics.store((growMemViews(), HEAP32), (reg.ctrl >> 2) + wcaOff.WC_ERROR, 1);
    wcaRT.wake(reg);
  },
  onAudioData: function(reg, data) {
    var ptr = 0;
    try {
      if (reg.dead) {
        data.close();
        return;
      }
      wcaRT.ensureAudioContext();
      var frames = data.numberOfFrames;
      var channels = data.numberOfChannels;
      if (!frames || !channels) {
        data.close();
        return;
      }
      var bytes = frames * channels * 4;
      // interleaved float32
      ptr = Module._malloc(bytes);
      if (!ptr) {
        data.close();
        return;
      }
      // Synchronous; converts to interleaved f32 regardless of the decoder's
      // native sample format. planeIndex 0 is the only plane for interleaved.
      data.copyTo((growMemViews(), HEAPU8).subarray(ptr >>> 0, ptr + bytes >>> 0), {
        planeIndex: 0,
        format: "f32"
      });
      var ts = data.timestamp;
      // microseconds
      var rate = data.sampleRate;
      try {
        wcaRT.enqueueToHostAudio(reg, data, ptr, bytes);
      } catch (e) {
        console.warn("[webcodecs-audio] host playback failed:", e && e.message ? e.message : e);
      }
      data.close();
      var ci = reg.ctrl >> 2;
      var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcaOff.WC_READ);
      if (reg.writeCount - readCount >= wcaOff.RING_N) {
        console.warn("[webcodecs-audio] ring overflow; block dropped");
        Module._free(ptr);
        return;
      }
      var tsHi = Math.floor(ts / 4294967296);
      var tsLo = ts - tsHi * 4294967296;
      var slot = ci + wcaOff.WC_HDR + (reg.writeCount % wcaOff.RING_N) * wcaOff.SLOT_INTS;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_PTR >>> 0] = ptr;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_BYTES >>> 0] = bytes;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_FRAMES >>> 0] = frames;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_CH >>> 0] = channels;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_RATE >>> 0] = rate;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_TSLO >>> 0] = tsLo | 0;
      (growMemViews(), HEAP32)[slot + wcaOff.AL_TSHI >>> 0] = tsHi | 0;
      reg.writeCount++;
      Atomics.store((growMemViews(), HEAP32), ci + wcaOff.WC_WRITE, reg.writeCount);
      wcaRT.wake(reg);
    } catch (e) {
      console.warn("[webcodecs-audio] onAudioData failed:", e && e.message ? e.message : e);
      if (ptr) Module._free(ptr);
      try {
        data.close();
      } catch (_) {}
      var msg = e && e.message ? e.message : e;
      if (!reg.dead && msg !== "unwind") wcaRT.setError(reg);
    }
  }
};

function _audiodecoder_create(ctrl, codecPtr, descPtr, descLen, rate, channels) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, ctrl, codecPtr, descPtr, descLen, rate, channels);
  if (rate > 0) wcaRT.preferredRate = rate;
  wcaRT.ensure();
  if (typeof AudioDecoder === "undefined") {
    console.warn("[webcodecs-audio] AudioDecoder unavailable in this browser");
    return -1;
  }
  var codec = codecPtr ? UTF8ToString(codecPtr) : "mp4a.40.2";
  var description = descLen >= 1 ? (growMemViews(), HEAPU8).slice(descPtr, descPtr + descLen) : null;
  var id = wcaRT.nextId++;
  var reg = {
    id,
    ctrl,
    dead: false,
    writeCount: 0,
    decoder: null,
    config: null,
    lastScheduledTs: null
  };
  var config = {
    codec,
    sampleRate: rate,
    numberOfChannels: channels
  };
  if (description) config.description = description;
  reg.config = config;
  try {
    var dec = new AudioDecoder({
      output: function(data) {
        wcaRT.onAudioData(reg, data);
      },
      error: function(e) {
        console.warn("[webcodecs-audio] decoder error:", e && e.message ? e.message : e);
        wcaRT.setError(reg);
      }
    });
    dec.configure(config);
    reg.decoder = dec;
  } catch (e) {
    console.warn("[webcodecs-audio] configure failed:", e && e.message ? e.message : e);
    return -1;
  }
  wcaRT.decoders.set(id, reg);
  return id;
}

function _audiodecoder_destroy(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, handle);
  var reg = wcaRT.decoders && wcaRT.decoders.get(handle);
  if (!reg) return;
  reg.dead = true;
  wcaRT.stopPlayback(reg);
  try {
    reg.decoder.close();
  } catch (_) {}
  var ci = reg.ctrl >> 2;
  var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcaOff.WC_READ);
  for (var c = readCount; c < reg.writeCount; c++) {
    var slot = ci + wcaOff.WC_HDR + (c % wcaOff.RING_N) * wcaOff.SLOT_INTS;
    var p = (growMemViews(), HEAP32)[slot + wcaOff.AL_PTR >>> 0];
    if (p) Module._free(p);
  }
  wcaRT.decoders.delete(handle);
}

function _audiodecoder_feed(handle, dataPtr, dataLen, isKey, tsLo, tsHi) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1, handle, dataPtr, dataLen, isKey, tsLo, tsHi);
  var reg = wcaRT.decoders && wcaRT.decoders.get(handle);
  if (!reg || reg.dead || !reg.decoder) return;
  var ts = (tsHi | 0) * 4294967296 + (tsLo >>> 0);
  try {
    var chunk = new EncodedAudioChunk({
      type: isKey ? "key" : "delta",
      timestamp: ts,
      data: (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + dataLen)
    });
    reg.decoder.decode(chunk);
  } catch (e) {
    console.warn("[webcodecs-audio] decode() threw:", e && e.message ? e.message : e);
    wcaRT.setError(reg);
  }
}

function _audiodecoder_flush(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, handle);
  var reg = wcaRT.decoders && wcaRT.decoders.get(handle);
  if (!reg || reg.dead || !reg.decoder) return;
  var ci = reg.ctrl >> 2;
  var done = function() {
    if (reg.dead) return;
    Atomics.add((growMemViews(), HEAP32), ci + wcaOff.WC_FLUSH, 1);
    wcaRT.wake(reg);
  };
  reg.decoder.flush().then(done).catch(function() {
    done();
  });
}

function _audiodecoder_reset(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1, handle);
  var reg = wcaRT.decoders && wcaRT.decoders.get(handle);
  if (!reg || reg.dead) return;
  wcaRT.justSeeked = true;
  wcaRT.stopPlayback(reg);
  try {
    reg.decoder.reset();
  } catch (_) {}
  var ci = reg.ctrl >> 2;
  var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcaOff.WC_READ);
  for (var c = readCount; c < reg.writeCount; c++) {
    var slot = ci + wcaOff.WC_HDR + (c % wcaOff.RING_N) * wcaOff.SLOT_INTS;
    var p = (growMemViews(), HEAP32)[slot + wcaOff.AL_PTR >>> 0];
    if (p) Module._free(p);
  }
  reg.writeCount = 0;
  reg.lastScheduledTs = null;
  Atomics.store((growMemViews(), HEAP32), ci + wcaOff.WC_WRITE, 0);
  Atomics.store((growMemViews(), HEAP32), ci + wcaOff.WC_READ, 0);
  Atomics.store((growMemViews(), HEAP32), ci + wcaOff.WC_ERROR, 0);
  try {
    reg.decoder.configure(reg.config);
  } catch (_) {}
}

var _emscripten_get_now = () => performance.timeOrigin + performance.now();

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  if (typeof __geckoCoop != "undefined" && __geckoCoop.active) __geckoCoop.clockCall();
  ignored_precision = bigintToI53Checked(ignored_precision);
  ptime >>>= 0;
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  (growMemViews(), HEAP64)[((ptime) >>> 3) >>> 0] = BigInt(nsec);
  return 0;
}

function _emaudio_get_rate() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1);
  try {
    var A = globalThis.__emAudio || (globalThis.__emAudio = {});
    if (!A.ctx) {
      var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return 0;
      A.ctx = new AC;
      var src = [ "class GeckoOut extends AudioWorkletProcessor {", "  constructor() {", "    super();", "    this.i32 = null;", "    this.port.onmessage = (e) => {", "      const d = e.data;", "      if (d.stop) { this.i32 = null; return; }", "      this.i32 = new Int32Array(d.sab);", "      this.f32 = new Float32Array(d.sab);", "      this.wIdx = d.ring >> 2;", "      this.rIdx = (d.ring + 4) >> 2;", "      this.dataF = (d.ring + 8) >> 2;", "      this.cap = d.cap;", "      this.ch = d.channels;", "    };", "  }", "  process(inputs, outputs) {", "    const out = outputs[0];", "    const frames = out[0].length;", "    if (!this.i32) { for (let c = 0; c < out.length; c++) out[c].fill(0); return true; }", "    const w = Atomics.load(this.i32, this.wIdx);", "    const r = Atomics.load(this.i32, this.rIdx);", "    const avail = (w - r) >>> 0;", "    const n = avail < frames ? avail : frames;", "    const ch = this.ch, cap = this.cap, dataF = this.dataF, f32 = this.f32;", "    for (let i = 0; i < n; i++) {", "      const pos = dataF + (((r + i) & (cap - 1)) * ch);", "      for (let c = 0; c < out.length; c++) out[c][i] = f32[pos + (c < ch ? c : ch - 1)];", "    }", "    for (let i = n; i < frames; i++) { for (let c = 0; c < out.length; c++) out[c][i] = 0; }", "    Atomics.store(this.i32, this.rIdx, (r + n) >>> 0);", "    return true;", "  }", "}", 'registerProcessor("gecko-out", GeckoOut);' ].join("\n");
      var url = URL.createObjectURL(new Blob([ src ], {
        type: "text/javascript"
      }));
      A.ctx.audioWorklet.addModule(url).then(function() {
        A.node = new AudioWorkletNode(A.ctx, "gecko-out", {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [ 2 ]
        });
        A.node.connect(A.ctx.destination);
        A.ready = true;
        if (A.pending) A.node.port.postMessage(A.pending);
      }).catch(function(e) {
        console.error("[emaudio] worklet addModule failed:", e && e.message ? e.message : e);
      });
      // Autoplay policy: an AudioContext stays suspended until a user gesture.
      var resume = function() {
        if (A.ctx && A.ctx.state !== "running") A.ctx.resume();
      };
      [ "pointerdown", "keydown", "touchstart" ].forEach(function(ev) {
        addEventListener(ev, resume, {
          capture: true
        });
      });
    }
    return A.ctx.sampleRate | 0;
  } catch (e) {
    console.error("[emaudio] get_rate failed:", e && e.message ? e.message : e);
    return 0;
  }
}

function _emaudio_start(ring, capFrames, channels, rate) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1, ring, capFrames, channels, rate);
  try {
    var A = globalThis.__emAudio;
    if (!A || !A.ctx) return -1;
    var msg = {
      sab: wasmMemory.buffer,
      ring,
      cap: capFrames,
      channels
    };
    A.pending = msg;
    if (A.ready && A.node) A.node.port.postMessage(msg);
    if (A.ctx.state !== "running") A.ctx.resume();
    // best-effort; real start needs a gesture
    return 0;
  } catch (e) {
    console.error("[emaudio] start failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _emaudio_stop() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1);
  try {
    var A = globalThis.__emAudio;
    if (A && A.node) A.node.port.postMessage({
      stop: true
    });
    if (A) A.pending = null;
  } catch (e) {}
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  // Nobody should have mutated _readEmAsmArgsArray underneath us to be something else than an array.
  assert(Array.isArray(readEmAsmArgsArray));
  // The input buffer is allocated on the stack, so it must be stack-aligned.
  assert(buf % 16 == 0);
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = (growMemViews(), HEAPU8)[sigPtr++ >>> 0]) {
    var chr = String.fromCharCode(ch);
    var validChars = [ "d", "f", "i", "p" ];
    // In WASM_BIGINT mode we support passing i64 values as bigint.
    validChars.push("j");
    assert(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? (growMemViews(), HEAPU32)[((buf) >>> 2) >>> 0] : ch == 106 ? (growMemViews(), 
    HEAP64)[((buf) >>> 3) >>> 0] : ch == 105 ? (growMemViews(), HEAP32)[((buf) >>> 2) >>> 0] : (growMemViews(), 
    HEAPF64)[((buf) >>> 3) >>> 0]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  assert(ASM_CONSTS.hasOwnProperty(code), `No EM_ASM constant found at address ${code}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
  return ASM_CONSTS[code](...args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
  code >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runEmAsmFunction(code, sigPtr, argbuf);
}

var runMainThreadEmAsm = (emAsmAddr, sigPtr, argbuf, sync) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  if (ENVIRONMENT_IS_PTHREAD) {
    // EM_ASM functions are variadic, receiving the actual arguments as a buffer
    // in memory. the last parameter (argBuf) points to that data. We need to
    // always un-variadify that, *before proxying*, as in the async case this
    // is a stack allocation that LLVM made, which may go away before the main
    // thread gets the message. For that reason we handle proxying *after* the
    // call to readEmAsmArgs, and therefore we do that manually here instead
    // of using __proxy. (And for simplicity, do the same in the sync
    // case as well, even though it's not strictly necessary, to keep the two
    // code paths as similar as possible on both sides.)
    return proxyToMainThread(0, emAsmAddr, sync, ...args);
  }
  assert(ASM_CONSTS.hasOwnProperty(emAsmAddr), `No EM_ASM constant found at address ${emAsmAddr}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
  return ASM_CONSTS[emAsmAddr](...args);
};

function _emscripten_asm_const_int_sync_on_main_thread(emAsmAddr, sigPtr, argbuf) {
  emAsmAddr >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
}

var _emscripten_check_blocking_allowed = () => {
  if (ENVIRONMENT_IS_WORKER) return;
  // Blocking in a worker/pthread is fine.
  warnOnce("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread");
};

function _emscripten_err(str) {
  str >>>= 0;
  return err(UTF8ToString(str));
}

function _emscripten_errn(str, len) {
  str >>>= 0;
  len >>>= 0;
  return err(UTF8ToString(str, len));
}

var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

/** @type {Object} */ var specialHTMLTargets = [ 0, globalThis.document ?? 0, globalThis.window ?? 0 ];

var findCanvasEventTarget = target => {
  target = maybeCStringToJsString(target);
  // When compiling with OffscreenCanvas support and looking up a canvas to target,
  // we first look up if the target Canvas has been transferred to OffscreenCanvas use.
  // These transfers are represented/tracked by GL.offscreenCanvases object, which contain
  // the OffscreenCanvas element for each regular Canvas element that has been transferred.
  // Note that each pthread/worker have their own set of GL.offscreenCanvases. That is,
  // when an OffscreenCanvas is transferred from a pthread/main thread to another pthread,
  // it will move in the GL.offscreenCanvases array between threads. Hence GL.offscreenCanvases
  // represents the set of OffscreenCanvases owned by the current calling thread.
  // First check out the list of OffscreenCanvases by CSS selector ID ('#myCanvasID')
  return GL.offscreenCanvases[target.slice(1)] || (target == "canvas" && Object.values(GL.offscreenCanvases)[0]) || specialHTMLTargets[target] || globalThis.document?.querySelector(target);
};

var getCanvasSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (canvas.canvasSharedPtr) {
    // N.B. Reading the size of the Canvas takes priority from our shared state structure, which is not the actual size.
    // However if is possible that there is a canvas size set event pending on an OffscreenCanvas owned by another thread,
    // so that the real sizes of the canvas have not updated yet. Therefore reading the real values would be racy.
    var w = (growMemViews(), HEAP32)[((canvas.canvasSharedPtr) >>> 2) >>> 0];
    var h = (growMemViews(), HEAP32)[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0];
    (growMemViews(), HEAP32)[((width) >>> 2) >>> 0] = w;
    (growMemViews(), HEAP32)[((height) >>> 2) >>> 0] = h;
  } else if (canvas.offscreenCanvas) {
    (growMemViews(), HEAP32)[((width) >>> 2) >>> 0] = canvas.offscreenCanvas.width;
    (growMemViews(), HEAP32)[((height) >>> 2) >>> 0] = canvas.offscreenCanvas.height;
  } else if (!canvas.controlTransferredOffscreen) {
    (growMemViews(), HEAP32)[((width) >>> 2) >>> 0] = canvas.width;
    (growMemViews(), HEAP32)[((height) >>> 2) >>> 0] = canvas.height;
  } else {
    return -4;
  }
  return 0;
};

function getCanvasSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, target, width, height);
  return getCanvasSizeCallingThread(target, width, height);
}

function _emscripten_get_canvas_element_size(target, width, height) {
  target >>>= 0;
  width >>>= 0;
  height >>>= 0;
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return getCanvasSizeCallingThread(target, width, height);
  }
  return getCanvasSizeMainThread(target, width, height);
}

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
4294901760;

function _emscripten_get_heap_max() {
  return getHeapMax();
}

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _emscripten_glBeginQueryEXT = (target, id) => {
  GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
};

var _emscripten_glBeginTransformFeedback = x0 => GLctx.beginTransformFeedback(x0);

function _emscripten_glBindAttribLocation(program, index, name) {
  name >>>= 0;
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}

var _emscripten_glBindBuffer = (target, buffer) => {
  // Calling glBindBuffer with an unknown buffer will implicitly create a
  // new one.  Here we bypass `GL.counter` and directly using the ID passed
  // in.
  if (buffer && !GL.buffers[buffer]) {
    var b = GLctx.createBuffer();
    b.name = buffer;
    GL.buffers[buffer] = b;
  }
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  if (target == 35051) {
    // In WebGL 2 glReadPixels entry point, we need to use a different WebGL 2
    // API function call when a buffer is bound to
    // GL_PIXEL_PACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
    // In WebGL 2 gl(Compressed)Tex(Sub)Image[23]D entry points, we need to
    // use a different WebGL 2 API function call when a buffer is bound to
    // GL_PIXEL_UNPACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _emscripten_glBindBufferBase = (target, index, buffer) => {
  GLctx.bindBufferBase(target, index, GL.buffers[buffer]);
};

function _emscripten_glBindBufferRange(target, index, buffer, offset, ptrsize) {
  offset >>>= 0;
  ptrsize >>>= 0;
  GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
}

var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  // defaultFbo may not be present if 'renderViaOffscreenBackBuffer' was not enabled during context creation time,
  // i.e. setting -sOFFSCREEN_FRAMEBUFFER at compilation time does not yet mandate that offscreen back buffer
  // is being used, but that is ultimately decided at context creation time.
  GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : GL.currentContext.defaultFbo);
};

var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _emscripten_glBindTransformFeedback = (target, id) => {
  GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id]);
};

var _emscripten_glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
};

var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _emscripten_glBlendEquation = x0 => GLctx.blendEquation(x0);

var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _emscripten_glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

function _emscripten_glBufferData(target, size, data, usage) {
  size >>>= 0;
  data >>>= 0;
  // N.b. here first form specifies a heap subarray, second form an integer
  // size, so the ?: code here is polymorphic. It is advised to avoid
  // randomly mixing both uses in calling code, to avoid any potential JS
  // engine JIT issues.
  GLctx.bufferData(target, data ? (growMemViews(), HEAPU8).subarray(data >>> 0, data + size >>> 0) : size, usage);
}

function _emscripten_glBufferSubData(target, offset, size, data) {
  offset >>>= 0;
  size >>>= 0;
  data >>>= 0;
  return webglBufferSubData(target, offset, size, data);
}

var _emscripten_glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _emscripten_glClearBufferfi = (x0, x1, x2, x3) => GLctx.clearBufferfi(x0, x1, x2, x3);

function _emscripten_glClearBufferfv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferfv(buffer, drawbuffer, (growMemViews(), HEAPF32), ((value) >>> 2));
}

function _emscripten_glClearBufferiv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferiv(buffer, drawbuffer, (growMemViews(), HEAP32), ((value) >>> 2));
}

function _emscripten_glClearBufferuiv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferuiv(buffer, drawbuffer, (growMemViews(), HEAPU32), ((value) >>> 2));
}

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _emscripten_glClearDepthf = x0 => GLctx.clearDepth(x0);

var _emscripten_glClearStencil = x0 => GLctx.clearStencil(x0);

function _emscripten_glClientWaitSync(sync, flags, timeout) {
  sync >>>= 0;
  // WebGL2 vs GLES3 differences: in GLES3, the timeout parameter is a uint64, where 0xFFFFFFFFFFFFFFFFULL means GL_TIMEOUT_IGNORED.
  // In JS, there's no 64-bit value types, so instead timeout is taken to be signed, and GL_TIMEOUT_IGNORED is given value -1.
  // Inherently the value accepted in the timeout is lossy, and can't take in arbitrary u64 bit pattern (but most likely doesn't matter)
  // See https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15
  timeout = Number(timeout);
  return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
}

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
  data >>>= 0;
  // `data` may be null here, which means "allocate uninitialized space but
  // don't upload" in GLES parlance, but `compressedTexImage2D` requires the
  // final data parameter, so we simply pass a heap view starting at zero
  // effectively uploading whatever happens to be near address zero.  See
  // https://github.com/emscripten-core/emscripten/issues/19300.
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
      return;
    }
  }
  GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, (growMemViews(), 
  HEAPU8).subarray(data >>> 0, data + imageSize >>> 0));
}

function _emscripten_glCompressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data) {
  data >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data);
  } else {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
}

function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
  data >>>= 0;
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
      return;
    }
  }
  GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, (growMemViews(), 
  HEAPU8).subarray(data >>> 0, data + imageSize >>> 0));
}

function _emscripten_glCompressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) {
  data >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data);
  } else {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
}

function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
  x2 >>>= 0;
  x3 >>>= 0;
  x4 >>>= 0;
  return GLctx.copyBufferSubData(x0, x1, x2, x3, x4);
}

var _emscripten_glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage3D = (x0, x1, x2, x3, x4, x5, x6, x7, x8) => GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);

var _emscripten_glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  // Store additional information needed for each shader program:
  program.name = id;
  // Lazy cache results of
  // glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
  program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
};

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

function _emscripten_glDeleteBuffers(n, buffers) {
  buffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >>> 2) >>> 0];
    var buffer = GL.buffers[id];
    // From spec: "glDeleteBuffers silently ignores 0's and names that do not
    // correspond to existing buffer objects."
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
  }
}

function _emscripten_glDeleteFramebuffers(n, framebuffers) {
  framebuffers >>>= 0;
  for (var i = 0; i < n; ++i) {
    var id = (growMemViews(), HEAP32)[(((framebuffers) + (i * 4)) >>> 2) >>> 0];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
}

var _emscripten_glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    // glDeleteProgram actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

function _emscripten_glDeleteQueries(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >>> 2) >>> 0];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteQuery(query);
    GL.queries[id] = null;
  }
}

function _emscripten_glDeleteQueriesEXT(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >>> 2) >>> 0];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
    GL.queries[id] = null;
  }
}

function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((renderbuffers) + (i * 4)) >>> 2) >>> 0];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
}

function _emscripten_glDeleteSamplers(n, samplers) {
  samplers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((samplers) + (i * 4)) >>> 2) >>> 0];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx.deleteSampler(sampler);
    sampler.name = 0;
    GL.samplers[id] = null;
  }
}

var _emscripten_glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    // glDeleteShader actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
};

function _emscripten_glDeleteSync(id) {
  id >>>= 0;
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    // glDeleteSync signals an error when deleting a nonexisting object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null;
}

function _emscripten_glDeleteTextures(n, textures) {
  textures >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((textures) + (i * 4)) >>> 2) >>> 0];
    var texture = GL.textures[id];
    // GL spec: "glDeleteTextures silently ignores 0s and names that do not
    // correspond to existing textures".
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
}

function _emscripten_glDeleteTransformFeedbacks(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >>> 2) >>> 0];
    var transformFeedback = GL.transformFeedbacks[id];
    if (!transformFeedback) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteTransformFeedback(transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null;
  }
}

function _emscripten_glDeleteVertexArrays(n, vaos) {
  vaos >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((vaos) + (i * 4)) >>> 2) >>> 0];
    GLctx.deleteVertexArray(GL.vaos[id]);
    GL.vaos[id] = null;
  }
}

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _emscripten_glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _emscripten_glDisableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
};

var _emscripten_glDrawArrays = (mode, first, count) => {
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
};

var _emscripten_glDrawArraysInstanced = (mode, first, count, primcount) => {
  GLctx.drawArraysInstanced(mode, first, count, primcount);
};

var tempFixedLengthArray = [];

function _emscripten_glDrawBuffers(n, bufs) {
  bufs >>>= 0;
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = (growMemViews(), HEAP32)[(((bufs) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.drawBuffers(bufArray);
}

function _emscripten_glDrawElements(mode, count, type, indices) {
  indices >>>= 0;
  var buf;
  var vertexes = 0;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    webglBufferSubData(34963, 0, size, indices);
    // Calculating vertex count if shader's attribute data is on client side
    if (count > 0) {
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (cb.clientside && cb.enabled) {
          let arrayClass;
          switch (type) {
           case 5121:
            arrayClass = Uint8Array;
            break;

           case 5123:
            arrayClass = Uint16Array;
            break;

           case 5125:
            arrayClass = Uint32Array;
            break;

           default:
            GL.recordError(1282);
            return;
          }
          vertexes = new arrayClass((growMemViews(), HEAPU8).buffer, indices, count).reduce((max, current) => Math.max(max, current)) + 1;
          break;
        }
      }
    }
    // the index is now 0
    indices = 0;
  }
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(vertexes);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
  indices >>>= 0;
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
}

var _glDrawElements = _emscripten_glDrawElements;

function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
  indices >>>= 0;
  // TODO: This should be a trivial pass-through function registered at the bottom of this page as
  // glFuncs[6][1] += ' drawRangeElements';
  // but due to https://bugzil.la/1202427,
  // we work around by ignoring the range.
  _glDrawElements(mode, count, type, indices);
}

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _emscripten_glEnableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
};

var _emscripten_glEndQuery = x0 => GLctx.endQuery(x0);

var _emscripten_glEndQueryEXT = target => {
  GLctx.disjointTimerQueryExt["endQueryEXT"](target);
};

var _emscripten_glEndTransformFeedback = () => GLctx.endTransformFeedback();

function _emscripten_glFenceSync(condition, flags) {
  var sync = GLctx.fenceSync(condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id;
  }
  return 0;
}

var _emscripten_glFinish = () => GLctx.finish();

var _emscripten_glFlush = () => GLctx.flush();

var emscriptenWebGLGetBufferBinding = target => {
  switch (target) {
   case 34962:
    target = 34964;
    break;

   case 34963:
    target = 34965;
    break;

   case 35051:
    target = 35053;
    break;

   case 35052:
    target = 35055;
    break;

   case 35982:
    target = 35983;
    break;

   case 36662:
    target = 36662;
    break;

   case 36663:
    target = 36663;
    break;

   case 35345:
    target = 35368;
    break;
  }
  var buffer = GLctx.getParameter(target);
  if (buffer) return buffer.name | 0; else return 0;
};

var emscriptenWebGLValidateMapBufferTarget = target => {
  switch (target) {
   case 34962:
   // GL_ARRAY_BUFFER
    case 34963:
   // GL_ELEMENT_ARRAY_BUFFER
    case 36662:
   // GL_COPY_READ_BUFFER
    case 36663:
   // GL_COPY_WRITE_BUFFER
    case 35051:
   // GL_PIXEL_PACK_BUFFER
    case 35052:
   // GL_PIXEL_UNPACK_BUFFER
    case 35882:
   // GL_TEXTURE_BUFFER
    case 35982:
   // GL_TRANSFORM_FEEDBACK_BUFFER
    case 35345:
    // GL_UNIFORM_BUFFER
    return true;

   default:
    return false;
  }
};

function _emscripten_glFlushMappedBufferRange(target, offset, length) {
  offset >>>= 0;
  length >>>= 0;
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glFlushMappedBufferRange");
    return;
  }
  var mapping = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
  if (!mapping) {
    GL.recordError(1282);
    err("buffer was never mapped in glFlushMappedBufferRange");
    return;
  }
  if (!(mapping.access & 16)) {
    GL.recordError(1282);
    err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
    return;
  }
  if (offset < 0 || length < 0 || offset + length > mapping.length) {
    GL.recordError(1281);
    err("invalid range in glFlushMappedBufferRange");
    return;
  }
  webglBufferSubData(target, mapping.offset, length, mapping.mem + offset);
}

var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _emscripten_glFramebufferTextureLayer = (target, attachment, texture, level, layer) => {
  GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer);
};

var _emscripten_glFrontFace = x0 => GLctx.frontFace(x0);

function _emscripten_glGenBuffers(n, buffers) {
  buffers >>>= 0;
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
}

function _emscripten_glGenFramebuffers(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
}

function _emscripten_glGenQueries(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createQuery", GL.queries);
}

function _emscripten_glGenQueriesEXT(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) (growMemViews(), HEAP32)[(((ids) + (i++ * 4)) >>> 2) >>> 0] = 0;
      return;
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    (growMemViews(), HEAP32)[(((ids) + (i * 4)) >>> 2) >>> 0] = id;
  }
}

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}

function _emscripten_glGenSamplers(n, samplers) {
  samplers >>>= 0;
  GL.genObject(n, samplers, "createSampler", GL.samplers);
}

function _emscripten_glGenTextures(n, textures) {
  textures >>>= 0;
  GL.genObject(n, textures, "createTexture", GL.textures);
}

function _emscripten_glGenTransformFeedbacks(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createTransformFeedback", GL.transformFeedbacks);
}

function _emscripten_glGenVertexArrays(n, arrays) {
  arrays >>>= 0;
  GL.genObject(n, arrays, "createVertexArray", GL.vaos);
}

var _emscripten_glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    // If an error occurs, nothing will be written to length, size and type and name.
    var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
    if (size) (growMemViews(), HEAP32)[((size) >>> 2) >>> 0] = info.size;
    if (type) (growMemViews(), HEAP32)[((type) >>> 2) >>> 0] = info.type;
  }
};

function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);
}

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
}

function _emscripten_glGetActiveUniformBlockName(program, uniformBlockIndex, bufSize, length, uniformBlockName) {
  length >>>= 0;
  uniformBlockName >>>= 0;
  program = GL.programs[program];
  var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
  if (!result) return;
  // If an error occurs, nothing will be written to uniformBlockName or length.
  if (uniformBlockName && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = 0;
  }
}

function _emscripten_glGetActiveUniformBlockiv(program, uniformBlockIndex, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
    (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = name.length + 1;
    return;
  }
  var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
  if (result === null) return;
  // If an error occurs, nothing should be written to params.
  if (pname == 35395) {
    for (var i = 0; i < result.length; i++) {
      (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = result[i];
    }
  } else {
    (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = result;
  }
}

function _emscripten_glGetActiveUniformsiv(program, uniformCount, uniformIndices, pname, params) {
  uniformIndices >>>= 0;
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && uniformIndices == 0) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i < uniformCount; i++) {
    ids.push((growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >>> 2) >>> 0]);
  }
  var result = GLctx.getActiveUniforms(program, ids, pname);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to params.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = result[i];
  }
}

function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
  count >>>= 0;
  shaders >>>= 0;
  var result = GLctx.getAttachedShaders(GL.programs[program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount;
  }
  (growMemViews(), HEAP32)[((count) >>> 2) >>> 0] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(result[i]);
    (growMemViews(), HEAP32)[(((shaders) + (i * 4)) >>> 2) >>> 0] = id;
  }
}

function _emscripten_glGetAttribLocation(program, name) {
  name >>>= 0;
  return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}

var readI53FromI64 = ptr => (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0] + (growMemViews(), 
HEAP32)[(((ptr) + (4)) >>> 2) >>> 0] * 4294967296;

var readI53FromU64 = ptr => (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0] + (growMemViews(), 
HEAPU32)[(((ptr) + (4)) >>> 2) >>> 0] * 4294967296;

var writeI53ToI64 = (ptr, num) => {
  (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0] = num;
  var lower = (growMemViews(), HEAPU32)[((ptr) >>> 2) >>> 0];
  (growMemViews(), HEAPU32)[(((ptr) + (4)) >>> 2) >>> 0] = (num - lower) / 4294967296;
  var deserialized = (num >= 0) ? readI53FromU64(ptr) : readI53FromI64(ptr);
  var offset = ((ptr) >>> 2);
  if (deserialized != num) warnOnce(`writeI53ToI64() out of range: serialized JS Number ${num} to Wasm heap as bytes lo=${ptrToString((growMemViews(), 
  HEAPU32)[offset >>> 0])}, hi=${ptrToString((growMemViews(), HEAPU32)[offset + 1 >>> 0])}, which deserializes back to ${deserialized} instead!`);
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var emscriptenWebGLGet = (name_, p, type) => {
  // Guard against user passing a null pointer.
  // Note that GLES2 spec does not say anything about how passing a null
  // pointer should be treated.  Testing on desktop core GL 3, the application
  // crashes on glGetIntegerv to a null pointer, but better to report an error
  // instead of doing anything random.
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
   // Handle a few trivial GLES values
    case 36346:
    // GL_SHADER_COMPILER
    ret = 1;
    break;

   case 36344:
    // GL_SHADER_BINARY_FORMATS
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
    // Do not write anything to the out pointer, since no binary formats are
    // supported.
    return;

   case 34814:
   // GL_NUM_PROGRAM_BINARY_FORMATS
    case 36345:
    // GL_NUM_SHADER_BINARY_FORMATS
    ret = 0;
    break;

   case 34466:
    // GL_NUM_COMPRESSED_TEXTURE_FORMATS
    // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
    // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
    // queried for length), so implement it ourselves to allow C++ GLES2
    // code to get the length.
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;

   case 33309:
    // GL_NUM_EXTENSIONS
    if (GL.currentContext.version < 2) {
      // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
      GL.recordError(1282);
      return;
    }
    ret = webglGetExtensions().length;
    break;

   case 33307:
   // GL_MAJOR_VERSION
    case 33308:
    // GL_MINOR_VERSION
    if (GL.currentContext.version < 2) {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    ret = name_ == 33307 ? 3 : 0;
    // return version 3.0
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;

     case "object":
      if (result === null) {
        // null is a valid result for some (e.g., which buffer is bound -
        // perhaps nothing is bound), but otherwise can mean an invalid
        // name_, which we need to report as an error
        switch (name_) {
         case 34964:
         // ARRAY_BUFFER_BINDING
          case 35725:
         // CURRENT_PROGRAM
          case 34965:
         // ELEMENT_ARRAY_BUFFER_BINDING
          case 36006:
         // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
          case 36007:
         // RENDERBUFFER_BINDING
          case 32873:
         // TEXTURE_BINDING_2D
          case 34229:
         // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
          case 36662:
         // COPY_READ_BUFFER_BINDING or COPY_READ_BUFFER
          case 36663:
         // COPY_WRITE_BUFFER_BINDING or COPY_WRITE_BUFFER
          case 35053:
         // PIXEL_PACK_BUFFER_BINDING
          case 35055:
         // PIXEL_UNPACK_BUFFER_BINDING
          case 36010:
         // READ_FRAMEBUFFER_BINDING
          case 35097:
         // SAMPLER_BINDING
          case 35869:
         // TEXTURE_BINDING_2D_ARRAY
          case 32874:
         // TEXTURE_BINDING_3D
          case 36389:
         // TRANSFORM_FEEDBACK_BINDING
          case 35983:
         // TRANSFORM_FEEDBACK_BUFFER_BINDING
          case 35368:
         // UNIFORM_BUFFER_BINDING
          case 34068:
          {
            // TEXTURE_BINDING_CUBE_MAP
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
            // GL_INVALID_ENUM
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            (growMemViews(), HEAP32)[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 2:
            (growMemViews(), HEAPF32)[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 4:
            (growMemViews(), HEAP8)[(p) + (i) >>> 0] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
      // GL_INVALID_ENUM
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((p) >>> 2) >>> 0] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[p >>> 0] = ret ? 1 : 0;
    break;
  }
};

function _emscripten_glGetBooleanv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 4);
}

function _emscripten_glGetBufferParameteri64v(target, value, data) {
  data >>>= 0;
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  writeI53ToI64(data, GLctx.getBufferParameter(target, value));
}

function _emscripten_glGetBufferParameteriv(target, value, data) {
  data >>>= 0;
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null
    // pointer. Since calling this function does not make sense if data ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((data) >>> 2) >>> 0] = GLctx.getBufferParameter(target, value);
}

function _emscripten_glGetBufferPointerv(target, pname, params) {
  params >>>= 0;
  if (pname == 35005) {
    var ptr = 0;
    var mappedBuffer = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
    if (mappedBuffer) {
      ptr = mappedBuffer.mem;
    }
    (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = ptr;
  } else {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glGetBufferPointerv");
  }
}

var _emscripten_glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

function _emscripten_glGetFloatv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 2);
}

function _emscripten_glGetFragDataLocation(program, name) {
  name >>>= 0;
  return GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));
}

function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
  params >>>= 0;
  var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
  if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
    result = result.name | 0;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = result;
}

var emscriptenWebGLGetIndexed = (target, index, data, type) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var result = GLctx.getIndexedParameter(target, index);
  var ret;
  switch (typeof result) {
   case "boolean":
    ret = result ? 1 : 0;
    break;

   case "number":
    ret = result;
    break;

   case "object":
    if (result === null) {
      switch (target) {
       case 35983:
       // TRANSFORM_FEEDBACK_BUFFER_BINDING
        case 35368:
        // UNIFORM_BUFFER_BINDING
        ret = 0;
        break;

       default:
        {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          return;
        }
      }
    } else if (result instanceof WebGLBuffer) {
      ret = result.name | 0;
    } else {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    break;

   default:
    GL.recordError(1280);
    // GL_INVALID_ENUM
    return;
  }
  switch (type) {
   case 1:
    writeI53ToI64(data, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((data) >>> 2) >>> 0] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((data) >>> 2) >>> 0] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[data >>> 0] = ret ? 1 : 0;
    break;

   default:
    abort("internal emscriptenWebGLGetIndexed() error, bad type: " + type);
  }
};

function _emscripten_glGetInteger64i_v(target, index, data) {
  data >>>= 0;
  return emscriptenWebGLGetIndexed(target, index, data, 1);
}

function _emscripten_glGetInteger64v(name_, p) {
  p >>>= 0;
  emscriptenWebGLGet(name_, p, 1);
}

function _emscripten_glGetIntegeri_v(target, index, data) {
  data >>>= 0;
  return emscriptenWebGLGetIndexed(target, index, data, 0);
}

function _emscripten_glGetIntegerv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 0);
}

function _emscripten_glGetInternalformativ(target, internalformat, pname, bufSize, params) {
  params >>>= 0;
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!params) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length && i < bufSize; ++i) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = ret[i];
  }
}

function _emscripten_glGetProgramBinary(program, bufSize, length, binaryFormat, binary) {
  length >>>= 0;
  binaryFormat >>>= 0;
  binary >>>= 0;
  GL.recordError(1282);
}

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetProgramiv(program, pname, p) {
  p >>>= 0;
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
      for (var i = 0; i < numActiveUniforms; ++i) {
        program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
      for (var i = 0; i < numActiveAttributes; ++i) {
        program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
      for (var i = 0; i < numActiveUniformBlocks; ++i) {
        program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = program.maxUniformBlockNameLength;
  } else {
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = GLctx.getProgramParameter(program, pname);
  }
}

function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx.getQueryParameter(query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
}

function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = ret;
}

var _glGetQueryObjecti64vEXT = _emscripten_glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

function _emscripten_glGetQueryObjectuiv(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = ret;
}

var _glGetQueryObjectivEXT = _emscripten_glGetQueryObjectivEXT;

var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

function _emscripten_glGetQueryiv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = GLctx.getQuery(target, pname);
}

function _emscripten_glGetQueryivEXT(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
}

function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = GLctx.getRenderbufferParameter(target, pname);
}

function _emscripten_glGetSamplerParameterfv(sampler, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
}

function _emscripten_glGetSamplerParameteriv(sampler, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
}

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
  range >>>= 0;
  precision >>>= 0;
  var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
  (growMemViews(), HEAP32)[((range) >>> 2) >>> 0] = result.rangeMin;
  (growMemViews(), HEAP32)[(((range) + (4)) >>> 2) >>> 0] = result.rangeMax;
  (growMemViews(), HEAP32)[((precision) >>> 2) >>> 0] = result.precision;
}

function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
  length >>>= 0;
  source >>>= 0;
  var result = GLctx.getShaderSource(GL.shaders[shader]);
  if (!result) return;
  // If an error occurs, nothing will be written to length or source.
  var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetShaderiv(shader, pname, p) {
  p >>>= 0;
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    // The GLES2 specification says that if the shader has an empty info log,
    // a value of 0 is returned. Otherwise the log has a null char appended.
    // (An empty string is falsey, so we can just check that instead of
    // looking at log.length.)
    var logLength = log ? log.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = logLength;
  } else if (pname == 35720) {
    // GL_SHADER_SOURCE_LENGTH
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    // source may be a null, or the empty string, both of which are falsey
    // values that we report a 0 length for.
    var sourceLength = source ? source.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = sourceLength;
  } else {
    (growMemViews(), HEAP32)[((p) >>> 2) >>> 0] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
}

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

function _emscripten_glGetString(name_) {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
      // return GLES version string corresponding to the version of the WebGL context
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      if (GL.currentContext.version >= 2) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
      // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        // ensure minor version has 2 digits
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
}

function _emscripten_glGetStringi(name, index) {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
    return 0;
  }
  var stringiCache = GL.stringiCache[name];
  if (stringiCache) {
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];
  }
  switch (name) {
   case 7939:
    var exts = webglGetExtensions().map(stringToNewUTF8);
    stringiCache = GL.stringiCache[name] = exts;
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];

   default:
    GL.recordError(1280);
    return 0;
  }
}

function _emscripten_glGetSynciv(sync, pname, bufSize, length, values) {
  sync >>>= 0;
  length >>>= 0;
  values >>>= 0;
  if (bufSize < 0) {
    // GLES3 specification does not specify how to behave if bufSize < 0, however in the spec wording for glGetInternalformativ, it does say that GL_INVALID_VALUE should be raised,
    // so raise GL_INVALID_VALUE here as well.
    GL.recordError(1281);
    return;
  }
  if (!values) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
  if (ret !== null) {
    (growMemViews(), HEAP32)[((values) >>> 2) >>> 0] = ret;
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = 1;
  }
}

function _emscripten_glGetTexParameterfv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

function _emscripten_glGetTexParameteriv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

function _emscripten_glGetTransformFeedbackVarying(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  program = GL.programs[program];
  var info = GLctx.getTransformFeedbackVarying(program, index);
  if (!info) return;
  // If an error occurred, the return parameters length, size, type and name will be unmodified.
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >>> 2) >>> 0] = 0;
  }
  if (size) (growMemViews(), HEAP32)[((size) >>> 2) >>> 0] = info.size;
  if (type) (growMemViews(), HEAP32)[((type) >>> 2) >>> 0] = info.type;
}

function _emscripten_glGetUniformBlockIndex(program, uniformBlockName) {
  uniformBlockName >>>= 0;
  return GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));
}

function _emscripten_glGetUniformIndices(program, uniformCount, uniformNames, uniformIndices) {
  uniformNames >>>= 0;
  uniformIndices >>>= 0;
  if (!uniformIndices) {
    // GLES2 specification does not specify how to behave if uniformIndices is a null pointer. Since calling this function does not make sense
    // if uniformIndices == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString((growMemViews(), 
  HEAPU32)[(((uniformNames) + (i * 4)) >>> 2) >>> 0]));
  var result = GLctx.getUniformIndices(program, names);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to uniformIndices.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >>> 2) >>> 0] = result[i];
  }
}

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

/** @noinline */ var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
  var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
  uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
  i, j;
  // On the first time invocation of glGetUniformLocation on this shader program:
  // initialize cache data structures and discover which uniforms are arrays.
  if (!uniformLocsById) {
    // maps GLint integer locations to WebGLUniformLocations
    program.uniformLocsById = uniformLocsById = {};
    // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
    program.uniformArrayNamesById = {};
    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
    for (i = 0; i < numActiveUniforms; ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = webglGetLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
      // Assign a new location.
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
      // Eagerly get the location of the uniformArray[0] base element.
      // The remaining indices >0 will be left for lazy evaluation to
      // improve performance. Those may never be needed to fetch, if the
      // application fills arrays always in full starting from the first
      // element of the array.
      uniformSizeAndIdsByName[arrayName] = [ sz, id ];
      // Store placeholder integers in place that highlight that these
      // >0 index locations are array indices pending population.
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
};

function _emscripten_glGetUniformLocation(program, name) {
  name >>>= 0;
  name = UTF8ToString(name);
  if (program = GL.programs[program]) {
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var uniformLocsById = program.uniformLocsById;
    // Maps GLuint -> WebGLUniformLocation
    var arrayIndex = 0;
    var uniformBaseName = name;
    // Invariant: when populating integer IDs for uniform locations, we must
    // maintain the precondition that arrays reside in contiguous addresses,
    // i.e. for a 'vec4 colors[10];', colors[4] must be at location
    // colors[0]+4.  However, user might call glGetUniformLocation(program,
    // "colors") for an array, so we cannot discover based on the user input
    // arguments whether the uniform we are dealing with is an array. The only
    // way to discover which uniforms are arrays is to enumerate over all the
    // active uniforms in the program.
    var leftBrace = webglGetLeftBracePos(name);
    // If user passed an array accessor "[index]", parse the array index off the accessor.
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
      // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
      uniformBaseName = name.slice(0, leftBrace);
    }
    // Have we cached the location of this uniform before?
    // A pair [array length, GLint of the uniform location]
    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
    // If a uniform with this name exists, and if its index is within the
    // array limits (if it's even an array), query the WebGLlocation, or
    // return an existing cached location.
    if (sizeAndId && arrayIndex < sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
      // Add the base location of the uniform to the array index offset.
      if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
        return arrayIndex;
      }
    }
  } else {
    // N.b. we are currently unable to distinguish between GL program IDs that
    // never existed vs GL program IDs that have been deleted, so report
    // GL_INVALID_VALUE in both cases.
    GL.recordError(1281);
  }
  return -1;
}

var webglGetProgramUniformLocation = (program, location) => {
  if (program) {
    var webglLoc = program.uniformLocsById[location];
    // program.uniformLocsById[location] stores either an integer, or a
    // WebGLUniformLocation.
    // If an integer, we have not yet bound the location, so do it now. The
    // integer value specifies the array index we should bind to.
    if (typeof webglLoc == "number") {
      program.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(program, program.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
    }
    // Else an already cached WebGLUniformLocation, return it.
    return webglLoc;
  } else {
    GL.recordError(1282);
  }
};

/** @suppress{checkTypes} */ var emscriptenWebGLGetUniform = (program, location, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  webglPrepareUniformLocationsBeforeFirstUse(program);
  var data = GLctx.getUniform(program, webglGetProgramUniformLocation(program, location));
  if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0] = data;
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;
      }
    }
  }
};

function _emscripten_glGetUniformfv(program, location, params) {
  params >>>= 0;
  emscriptenWebGLGetUniform(program, location, params, 2);
}

function _emscripten_glGetUniformiv(program, location, params) {
  params >>>= 0;
  emscriptenWebGLGetUniform(program, location, params, 0);
}

function _emscripten_glGetUniformuiv(program, location, params) {
  params >>>= 0;
  return emscriptenWebGLGetUniform(program, location, params, 0);
}

/** @suppress{checkTypes} */ var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttrib*v on client-side array: not supported, bad data returned");
  }
  var data = GLctx.getVertexAttrib(index, pname);
  if (pname == 34975) {
    (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = data && data["name"];
  } else if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0] = data;
      break;

     case 5:
      (growMemViews(), HEAP32)[((params) >>> 2) >>> 0] = Math.fround(data);
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 5:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >>> 2) >>> 0] = Math.fround(data[i]);
        break;
      }
    }
  }
};

function _emscripten_glGetVertexAttribIiv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttribI4iv(),
  // otherwise the results are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
}

var _glGetVertexAttribIiv = _emscripten_glGetVertexAttribIiv;

var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIiv;

function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
  pointer >>>= 0;
  if (!pointer) {
    // GLES2 specification does not specify how to behave if pointer is a null
    // pointer. Since calling this function does not make sense if pointer ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttribPointer on client-side array: not supported, bad data returned");
  }
  (growMemViews(), HEAP32)[((pointer) >>> 2) >>> 0] = GLctx.getVertexAttribOffset(index, pname);
}

function _emscripten_glGetVertexAttribfv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
}

function _emscripten_glGetVertexAttribiv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
}

var _emscripten_glHint = (x0, x1) => GLctx.hint(x0, x1);

function _emscripten_glInvalidateFramebuffer(target, numAttachments, attachments) {
  attachments >>>= 0;
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.invalidateFramebuffer(target, list);
}

function _emscripten_glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
  attachments >>>= 0;
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.invalidateSubFramebuffer(target, list, x, y, width, height);
}

var _emscripten_glIsBuffer = buffer => {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b);
};

var _emscripten_glIsEnabled = x0 => GLctx.isEnabled(x0);

var _emscripten_glIsFramebuffer = framebuffer => {
  var fb = GL.framebuffers[framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb);
};

var _emscripten_glIsProgram = program => {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program);
};

var _emscripten_glIsQuery = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.isQuery(query);
};

var _emscripten_glIsQueryEXT = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
};

var _emscripten_glIsRenderbuffer = renderbuffer => {
  var rb = GL.renderbuffers[renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb);
};

var _emscripten_glIsSampler = id => {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx.isSampler(sampler);
};

var _emscripten_glIsShader = shader => {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s);
};

function _emscripten_glIsSync(sync) {
  sync >>>= 0;
  return GLctx.isSync(GL.syncs[sync]);
}

var _emscripten_glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
};

var _emscripten_glIsTransformFeedback = id => GLctx.isTransformFeedback(GL.transformFeedbacks[id]);

var _emscripten_glIsVertexArray = array => {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx.isVertexArray(vao);
};

var _emscripten_glLineWidth = x0 => GLctx.lineWidth(x0);

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

function _emscripten_glMapBufferRange(target, offset, length, access) {
  offset >>>= 0;
  length >>>= 0;
  if ((access & (1 | 32)) != 0) {
    err("glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED");
    return 0;
  }
  if ((access & 2) == 0) {
    err("glMapBufferRange access must include MAP_WRITE");
    return 0;
  }
  if ((access & (4 | 8)) == 0) {
    err("glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
    return 0;
  }
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glMapBufferRange");
    return 0;
  }
  var mem = _malloc(length), binding = emscriptenWebGLGetBufferBinding(target);
  if (!mem) return 0;
  binding = GL.mappedBuffers[binding] ??= {};
  binding.offset = offset;
  binding.length = length;
  binding.mem = mem;
  binding.access = access;
  return mem;
}

var _emscripten_glPauseTransformFeedback = () => GLctx.pauseTransformFeedback();

var _emscripten_glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

function _emscripten_glProgramBinary(program, binaryFormat, binary, length) {
  binary >>>= 0;
  GL.recordError(1280);
}

var _emscripten_glProgramParameteri = (program, pname, value) => {
  GL.recordError(1280);
};

var _emscripten_glQueryCounterEXT = (id, target) => {
  GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
};

var _emscripten_glReadBuffer = x0 => GLctx.readBuffer(x0);

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
  // Micro-optimizations for size: map format to size by subtracting smallest
  // enum value (0x1902) from all values first.  Also omit the most common
  // size value (1) from the list, which is assumed by formats not on the
  // list.
  var colorChannels = {
    // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
    // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
    5: 3,
    6: 4,
    // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
    8: 2,
    29502: 3,
    29504: 4,
    // 0x1903 /* GL_RED */ - 0x1902: 1,
    26917: 2,
    26918: 2,
    // 0x8D94 /* GL_RED_INTEGER */ - 0x1902: 1,
    29846: 3,
    29847: 4
  };
  return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
  // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
  // smaller values for the heap, for shorter generated code size.
  // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
  // (since most types are HEAPU16)
  type -= 5120;
  if (type == 0) return (growMemViews(), HEAP8);
  if (type == 1) return (growMemViews(), HEAPU8);
  if (type == 2) return (growMemViews(), HEAP16);
  if (type == 4) return (growMemViews(), HEAP32);
  if (type == 6) return (growMemViews(), HEAPF32);
  if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return (growMemViews(), 
  HEAPU32);
  return (growMemViews(), HEAPU16);
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap) >>> 0, toTypedArrayIndex(pixels + bytes, heap) >>> 0);
};

function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels);
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
}

var _emscripten_glReleaseShaderCompiler = () => {};

var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _emscripten_glRenderbufferStorageMultisample = (x0, x1, x2, x3, x4) => GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);

var _emscripten_glResumeTransformFeedback = () => GLctx.resumeTransformFeedback();

var _emscripten_glSampleCoverage = (value, invert) => {
  GLctx.sampleCoverage(value, !!invert);
};

var _emscripten_glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

function _emscripten_glSamplerParameterfv(sampler, pname, params) {
  params >>>= 0;
  var param = (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0];
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
}

var _emscripten_glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

function _emscripten_glSamplerParameteriv(sampler, pname, params) {
  params >>>= 0;
  var param = (growMemViews(), HEAP32)[((params) >>> 2) >>> 0];
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
}

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

function _emscripten_glShaderBinary(count, shaders, binaryformat, binary, length) {
  shaders >>>= 0;
  binary >>>= 0;
  GL.recordError(1280);
}

function _emscripten_glShaderSource(shader, count, string, length) {
  string >>>= 0;
  length >>>= 0;
  
function __wrHoistVaryings(src) {
 if (!/^#define WR_VERTEX_SHADER\s*$/m.test(src)) return src;
 var lines = src.split('\n');
 var declRe = /^\s*(?:flat\s+|smooth\s+)?(?:varying|out)\s+(?:(?:highp|mediump|lowp)\s+)?(?:float|int|uint|vec[234]|ivec[234]|uvec[234]|mat[234])\s+\w+\s*;\s*$/;
 var condStack = [], braceDepth = 0, pastMain = false, insertIdx = -1, hoist = [];
 for (var j = 0; j < lines.length; j++) {
  var L = lines[j], t = L.trim();
  if (insertIdx < 0 && !(/^#version/.test(t) || /^\/\/ shader:/.test(t) || t === '' ||
      /^#define (WR_VERTEX_SHADER|WR_FRAGMENT_SHADER|PLATFORM_\w+|WR_MAX_VERTEX_TEXTURE_WIDTH\b|WR_FEATURE_\w+)/.test(t))) insertIdx = j;
  if (/^#\s*(if|ifdef|ifndef)\b/.test(t)) { condStack.push({ line: t, isElse: false }); continue; }
  if (/^#\s*(else|elif)\b/.test(t)) { if (condStack.length) condStack[condStack.length - 1].isElse = true; continue; }
  if (/^#\s*endif\b/.test(t)) { condStack.pop(); continue; }
  if (!pastMain && /\bvoid\s+main\s*\(/.test(L)) pastMain = true;
  if (pastMain && braceDepth === 0 && declRe.test(L) && !condStack.some(function (f) { return f.isElse; })) {
   hoist.push({ decl: t.replace(/\bvarying\b/, 'out'), guards: condStack.map(function (f) { return f.line; }) });
   lines[j] = '';
  }
  for (var k = 0; k < L.length; k++) { var c = L[k]; if (c === '{') braceDepth++; else if (c === '}') { if (braceDepth > 0) braceDepth--; } }
 }
 if (!hoist.length) return src;
 if (insertIdx < 0) insertIdx = 1;
 var block = [];
 for (var h = 0; h < hoist.length; h++) {
  var g = hoist[h].guards;
  for (var a = 0; a < g.length; a++) block.push(g[a]);
  block.push(hoist[h].decl);
  for (var b2 = 0; b2 < g.length; b2++) block.push('#endif');
 }
 lines.splice(insertIdx, 0, block.join('\n'));
 return lines.join('\n');
}

var source = GL.getSource(shader, count, string, length);
  try { source = __wrHoistVaryings(source); } catch(e){}
  GLctx.shaderSource(GL.shaders[shader], source);
}

var _emscripten_glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _emscripten_glStencilMask = x0 => GLctx.stencilMask(x0);

var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _emscripten_glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
  pixels >>>= 0;
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}

function _emscripten_glTexImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels) {
  pixels >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height * depth, pixels);
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixelData);
  } else {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null);
  }
}

var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

function _emscripten_glTexParameterfv(target, pname, params) {
  params >>>= 0;
  var param = (growMemViews(), HEAPF32)[((params) >>> 2) >>> 0];
  GLctx.texParameterf(target, pname, param);
}

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

function _emscripten_glTexParameteriv(target, pname, params) {
  params >>>= 0;
  var param = (growMemViews(), HEAP32)[((params) >>> 2) >>> 0];
  GLctx.texParameteri(target, pname, param);
}

var _emscripten_glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _emscripten_glTexStorage3D = (x0, x1, x2, x3, x4, x5) => GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);

function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}

function _emscripten_glTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels) {
  pixels >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height * depth, pixels);
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixelData);
  } else {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null);
  }
}

function _emscripten_glTransformFeedbackVaryings(program, count, varyings, bufferMode) {
  varyings >>>= 0;
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++) vars.push(UTF8ToString((growMemViews(), HEAPU32)[(((varyings) + (i * 4)) >>> 2) >>> 0]));
  GLctx.transformFeedbackVaryings(program, vars, bufferMode);
}

var webglGetUniformLocation = location => webglGetProgramUniformLocation(GLctx.currentProgram, location);

var _emscripten_glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var miniTempWebGLFloatBuffers = [];

function _emscripten_glUniform1fv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var miniTempWebGLIntBuffers = [];

function _emscripten_glUniform1iv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1ui = (location, v0) => {
  GLctx.uniform1ui(webglGetUniformLocation(location), v0);
};

function _emscripten_glUniform1uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform1uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >>> 2), count);
}

var _emscripten_glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2fv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2iv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2ui = (location, v0, v1) => {
  GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform2uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >>> 2), count * 2);
}

var _emscripten_glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3fv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3iv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = (growMemViews(), HEAP32)[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3ui = (location, v0, v1, v2) => {
  GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform3uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >>> 2), count * 3);
}

var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4fv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[4 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = (growMemViews(), HEAPF32);
    value = ((value) >>> 2);
    count *= 4;
    for (var i = 0; i < count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4iv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = (growMemViews(), HEAP32)[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = (growMemViews(), HEAP32)[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4ui = (location, v0, v1, v2, v3) => {
  GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform4uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >>> 2), count * 4);
}

var _emscripten_glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
  program = GL.programs[program];
  GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
};

function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix2x3fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 6);
}

function _emscripten_glUniformMatrix2x4fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 8);
}

function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 32) {
    // avoid allocation when uploading few enough uniforms
    count *= 9;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 9) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 12)) >>> 2) >>> 0];
      view[i + 4] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 16)) >>> 2) >>> 0];
      view[i + 5] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 20)) >>> 2) >>> 0];
      view[i + 6] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 24)) >>> 2) >>> 0];
      view[i + 7] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 28)) >>> 2) >>> 0];
      view[i + 8] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 32)) >>> 2) >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 36) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix3x2fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 6);
}

function _emscripten_glUniformMatrix3x4fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 12);
}

function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 18) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[16 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = (growMemViews(), HEAPF32);
    value = ((value) >>> 2);
    count *= 16;
    for (var i = 0; i < count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
      view[i + 4] = heap[dst + 4 >>> 0];
      view[i + 5] = heap[dst + 5 >>> 0];
      view[i + 6] = heap[dst + 6 >>> 0];
      view[i + 7] = heap[dst + 7 >>> 0];
      view[i + 8] = heap[dst + 8 >>> 0];
      view[i + 9] = heap[dst + 9 >>> 0];
      view[i + 10] = heap[dst + 10 >>> 0];
      view[i + 11] = heap[dst + 11 >>> 0];
      view[i + 12] = heap[dst + 12 >>> 0];
      view[i + 13] = heap[dst + 13 >>> 0];
      view[i + 14] = heap[dst + 14 >>> 0];
      view[i + 15] = heap[dst + 15 >>> 0];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >>> 2)) >>> 0, ((value + count * 64) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix4x2fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 8);
}

function _emscripten_glUniformMatrix4x3fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >>> 2), count * 12);
}

var _emscripten_glUnmapBuffer = target => {
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glUnmapBuffer");
    return 0;
  }
  var buffer = emscriptenWebGLGetBufferBinding(target);
  var mapping = GL.mappedBuffers[buffer];
  if (!mapping || !mapping.mem) {
    GL.recordError(1282);
    err("buffer was never mapped in glUnmapBuffer");
    return 0;
  }
  if (!(mapping.access & 16)) {
    /* GL_MAP_FLUSH_EXPLICIT_BIT */ webglBufferSubData(target, mapping.offset, mapping.length, mapping.mem);
  }
  _free(mapping.mem);
  mapping.mem = 0;
  return 1;
};

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _emscripten_glValidateProgram = program => {
  GLctx.validateProgram(GL.programs[program]);
};

var _emscripten_glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

function _emscripten_glVertexAttrib1fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib1f(index, (growMemViews(), HEAPF32)[v >>> 2]);
}

var _emscripten_glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

function _emscripten_glVertexAttrib2fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib2f(index, (growMemViews(), HEAPF32)[v >>> 2], (growMemViews(), 
  HEAPF32)[v + 4 >>> 2]);
}

var _emscripten_glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

function _emscripten_glVertexAttrib3fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib3f(index, (growMemViews(), HEAPF32)[v >>> 2], (growMemViews(), 
  HEAPF32)[v + 4 >>> 2], (growMemViews(), HEAPF32)[v + 8 >>> 2]);
}

var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttrib4fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib4f(index, (growMemViews(), HEAPF32)[v >>> 2], (growMemViews(), 
  HEAPF32)[v + 4 >>> 2], (growMemViews(), HEAPF32)[v + 8 >>> 2], (growMemViews(), 
  HEAPF32)[v + 12 >>> 2]);
}

var _emscripten_glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _emscripten_glVertexAttribI4i = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttribI4iv(index, v) {
  v >>>= 0;
  GLctx.vertexAttribI4i(index, (growMemViews(), HEAP32)[v >>> 2], (growMemViews(), 
  HEAP32)[v + 4 >>> 2], (growMemViews(), HEAP32)[v + 8 >>> 2], (growMemViews(), HEAP32)[v + 12 >>> 2]);
}

var _emscripten_glVertexAttribI4ui = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttribI4uiv(index, v) {
  v >>>= 0;
  GLctx.vertexAttribI4ui(index, (growMemViews(), HEAPU32)[v >>> 2], (growMemViews(), 
  HEAPU32)[v + 4 >>> 2], (growMemViews(), HEAPU32)[v + 8 >>> 2], (growMemViews(), 
  HEAPU32)[v + 12 >>> 2]);
}

function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) {
  ptr >>>= 0;
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = false;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = /** @this {WebGLRenderingContext} */ function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribIPointer(index, size, type, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribIPointer(index, size, type, stride, ptr);
}

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
  ptr >>>= 0;
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = /** @this {WebGLRenderingContext} */ function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

function _emscripten_glWaitSync(sync, flags, timeout) {
  sync >>>= 0;
  // See WebGL2 vs GLES3 difference on GL_TIMEOUT_IGNORED above (https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15)
  timeout = Number(timeout);
  GLctx.waitSync(GL.syncs[sync], flags, timeout);
}

var _emscripten_has_asyncify = () => 0;

var _emscripten_num_logical_cores = () => (typeof __geckoCoop != "undefined" && __geckoCoop.active) ? __geckoCoop.cores : navigator["hardwareConcurrency"];

function _emscripten_out(str) {
  str >>>= 0;
  return out(UTF8ToString(str));
}

var UNWIND_CACHE = {};

/** @returns {number} */ var convertFrameToPC = frame => {
  var match;
  if (match = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(frame)) {
    // Wasm engines give the binary offset directly, so we use that as return address
    return +match[1];
  } else if (match = /\bwasm-function\[(\d+)\]:(\d+)/.exec(frame)) {
    // Older versions of v8 (e.g node v10) give function index and offset in
    // the function.  That format is not supported since it does not provide
    // the information we need to map the frame to a global program counter.
    warnOnce("legacy backtrace format detected, this version of v8 is no longer supported by the emscripten backtrace mechanism");
  } else if (match = /:(\d+):\d+(?:\)|$)/.exec(frame)) {
    // If we are in js, we can use the js line number as the "return address".
    // This should work for wasm2js.  We tag the high bit to distinguish this
    // from wasm addresses.
    return 2147483648 | +match[1];
  }
  // return 0 if we can't find any
  return 0;
};

var saveInUnwindCache = callstack => {
  for (var line of callstack) {
    var pc = convertFrameToPC(line);
    if (pc) {
      UNWIND_CACHE[pc] = line;
    }
  }
};

function _emscripten_stack_snapshot() {
  var callstack = jsStackTrace().split("\n");
  if (callstack[0] == "Error") {
    callstack.shift();
  }
  saveInUnwindCache(callstack);
  // Caches the stack snapshot so that emscripten_stack_unwind_buffer() can
  // unwind from this spot.
  UNWIND_CACHE.last_addr = convertFrameToPC(callstack[3]);
  UNWIND_CACHE.last_stack = callstack;
  return UNWIND_CACHE.last_addr;
}

function _emscripten_pc_get_function(pc) {
  pc >>>= 0;
  var frame = UNWIND_CACHE[pc];
  if (!frame) return 0;
  var name;
  var match;
  // First try to match foo.wasm.sym files explcitly. e.g.
  //   at test_return_address.wasm.main (wasm://wasm/test_return_address.wasm-0012cc2a:wasm-function[26]:0x9f3
  // Then match JS symbols which don't include that module name:
  //   at invokeEntryPoint (.../test_return_address.js:1500:42)
  // Finally match firefox format:
  //   Object._main@http://server.com:4324:12'
  if (match = /^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(frame)) {
    name = match[1];
  } else if (match = /^\s+at (.*) \(.*\)$/.exec(frame)) {
    name = match[1];
  } else if (match = /^(.+?)@/.exec(frame)) {
    name = match[1];
  } else {
    return 0;
  }
  _free(_emscripten_pc_get_function.ret ?? 0);
  _emscripten_pc_get_function.ret = stringToNewUTF8(name);
  return _emscripten_pc_get_function.ret;
}

var alignMemory = (size, alignment) => {
  assert(alignment, "alignment argument is required");
  return Math.ceil(size / alignment) * alignment;
};

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {
    err(`growMemory: Attempted to grow heap from ${oldHeapSize} bytes to ${size} bytes, but got error: ${e}`);
  }
};

function _emscripten_resize_heap(requestedSize) {
  requestedSize >>>= 0;
  var oldSize = (growMemViews(), HEAPU8).length;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  if (requestedSize <= oldSize) {
    return false;
  }
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
  return false;
}

function _emscripten_return_address(level) {
  var callstack = jsStackTrace().split("\n");
  if (callstack[0] == "Error") {
    callstack.shift();
  }
  // skip this function and the caller to get caller's return address
  var caller = callstack[level + 3];
  return convertFrameToPC(caller);
}

var _emscripten_runtime_keepalive_check = keepRuntimeAlive;

var setOffscreenCanvasSizeOnTargetThread = (targetThread, targetCanvas, width, height) => {
  targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : "";
  var targetCanvasPtr = 0;
  if (targetCanvas) {
    targetCanvasPtr = stringToNewUTF8(targetCanvas);
  }
  __emscripten_set_offscreencanvas_size_on_thread(targetThread, targetCanvasPtr, width, height);
};

var setCanvasElementSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (canvas.canvasSharedPtr) {
    // N.B. We hold the canvasSharedPtr info structure as the authoritative source for specifying the size of a canvas
    // since the actual canvas size changes are asynchronous if the canvas is owned by an OffscreenCanvas on another thread.
    // Therefore when setting the size, eagerly set the size of the canvas on the calling thread here, though this thread
    // might not be the one that actually ends up specifying the size, but the actual size change may be dispatched
    // as an asynchronous event below.
    (growMemViews(), HEAP32)[((canvas.canvasSharedPtr) >>> 2) >>> 0] = width;
    (growMemViews(), HEAP32)[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0] = height;
  }
  if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
    if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
    var autoResizeViewport = false;
    if (canvas.GLctxObject?.GLctx) {
      var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
      // TODO: Perhaps autoResizeViewport should only be true if FBO 0 is currently active?
      autoResizeViewport = (prevViewport[0] === 0 && prevViewport[1] === 0 && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height);
    }
    canvas.width = width;
    canvas.height = height;
    if (autoResizeViewport) {
      // TODO: Add -sCANVAS_RESIZE_SETS_GL_VIEWPORT=0/1 option (default=1). This is commonly done and several graphics engines depend on this,
      // but this can be quite disruptive.
      canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
    }
  } else if (canvas.canvasSharedPtr) {
    var targetThread = (growMemViews(), HEAPU32)[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0];
    setOffscreenCanvasSizeOnTargetThread(targetThread, target, width, height);
    return 1;
  } else {
    return -4;
  }
  if (canvas.GLctxObject) GL.resizeOffscreenFramebuffer(canvas.GLctxObject);
  return 0;
};

function setCanvasElementSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, target, width, height);
  return setCanvasElementSizeCallingThread(target, width, height);
}

function _emscripten_set_canvas_element_size(target, width, height) {
  target >>>= 0;
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return setCanvasElementSizeCallingThread(target, width, height);
  }
  return setCanvasElementSizeMainThread(target, width, height);
}

function _emscripten_stack_unwind_buffer(addr, buffer, count) {
  addr >>>= 0;
  buffer >>>= 0;
  var stack;
  if (UNWIND_CACHE.last_addr == addr) {
    stack = UNWIND_CACHE.last_stack;
  } else {
    stack = jsStackTrace().split("\n");
    if (stack[0] == "Error") {
      stack.shift();
    }
    saveInUnwindCache(stack);
  }
  var offset = 3;
  while (stack[offset] && convertFrameToPC(stack[offset]) != addr) {
    ++offset;
  }
  for (var i = 0; i < count && stack[i + offset]; ++i) {
    (growMemViews(), HEAPU32)[(((buffer) + (i * 4)) >>> 2) >>> 0] = convertFrameToPC(stack[i + offset]);
  }
  return i;
}

var _emscripten_supports_offscreencanvas = () => // TODO: Add a new build mode, e.g. OFFSCREENCANVAS_SUPPORT=2, which
// necessitates OffscreenCanvas support at build time, and "return 1;" here in that build mode.
typeof OffscreenCanvas != "undefined";

var _emscripten_unwind_to_js_event_loop = () => {
  throw "unwind";
};

var _emscripten_webgl_destroy_context_calling_thread = contextHandle => {
  if (GL.currentContext == contextHandle) GL.currentContext = 0;
  GL.deleteContext(contextHandle);
};

var _emscripten_webgl_destroy_context_main_thread = _emscripten_webgl_destroy_context_calling_thread;

function _emscripten_webgl_destroy_context(p0) {
  p0 >>>= 0;
  return GL.contexts[p0] ? _emscripten_webgl_destroy_context_calling_thread(p0) : _emscripten_webgl_destroy_context_main_thread(p0);
}

function _emscripten_webgl_create_context_proxied(target, attributes) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1, target, attributes);
  return _emscripten_webgl_do_create_context(target, attributes);
}

var webglPowerPreferences = [ "default", "low-power", "high-performance" ];

function _emscripten_webgl_do_create_context(target, attributes) {
  target >>>= 0;
  attributes >>>= 0;
  assert(attributes);
  var attr32 = ((attributes) >>> 2);
  var powerPreference = (growMemViews(), HEAP32)[attr32 + (8 >> 2) >>> 0];
  var contextAttributes = {
    "alpha": !!(growMemViews(), HEAP8)[attributes + 0 >>> 0],
    "depth": !!(growMemViews(), HEAP8)[attributes + 1 >>> 0],
    "stencil": !!(growMemViews(), HEAP8)[attributes + 2 >>> 0],
    "antialias": !!(growMemViews(), HEAP8)[attributes + 3 >>> 0],
    "premultipliedAlpha": !!(growMemViews(), HEAP8)[attributes + 4 >>> 0],
    "preserveDrawingBuffer": !!(growMemViews(), HEAP8)[attributes + 5 >>> 0],
    "powerPreference": webglPowerPreferences[powerPreference],
    "failIfMajorPerformanceCaveat": !!(growMemViews(), HEAP8)[attributes + 12 >>> 0],
    // The following are not predefined WebGL context attributes in the WebGL specification, so the property names can be minified by Closure.
    majorVersion: (growMemViews(), HEAP32)[attr32 + (16 >> 2) >>> 0],
    minorVersion: (growMemViews(), HEAP32)[attr32 + (20 >> 2) >>> 0],
    enableExtensionsByDefault: (growMemViews(), HEAP8)[attributes + 24 >>> 0],
    explicitSwapControl: (growMemViews(), HEAP8)[attributes + 25 >>> 0],
    proxyContextToMainThread: (growMemViews(), HEAP32)[attr32 + (28 >> 2) >>> 0],
    renderViaOffscreenBackBuffer: (growMemViews(), HEAP8)[attributes + 32 >>> 0]
  };
  //  TODO: Make these into hard errors at some point in the future
  if (contextAttributes.majorVersion !== 1 && contextAttributes.majorVersion !== 2) {
    err(`Invalid WebGL version requested: ${contextAttributes.majorVersion}`);
  }
  var canvas = findCanvasEventTarget(target);
  // If our canvas from findCanvasEventTarget is actually an offscreen canvas record, we should extract the inner canvas.
  if (canvas?.canvas) {
    canvas = canvas.canvas;
  }
  // Create a WebGL context that is proxied to main thread if canvas was not found on worker, or if explicitly requested to do so.
  if (ENVIRONMENT_IS_PTHREAD) {
    if (contextAttributes.proxyContextToMainThread === 2 || (!canvas && contextAttributes.proxyContextToMainThread === 1)) {
      // When WebGL context is being proxied via the main thread, we must render using an offscreen FBO render target to avoid WebGL's
      // "implicit swap when callback exits" behavior. TODO: If OffscreenCanvas is supported, explicitSwapControl=true and still proxying,
      // then this can be avoided, since OffscreenCanvas enables explicit swap control.
      // We will be proxying - if OffscreenCanvas is supported, we can proxy a bit more efficiently by avoiding having to create an Offscreen FBO.
      if (!_emscripten_supports_offscreencanvas()) {
        (growMemViews(), HEAP8)[(attributes) + (32) >>> 0] = 1;
        (growMemViews(), HEAP8)[(attributes) + (5) >>> 0] = 1;
      }
      return _emscripten_webgl_create_context_proxied(target, attributes);
    }
  }
  if (!canvas) {
    return 0;
  }
  if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
  if (contextAttributes.explicitSwapControl) {
    var supportsOffscreenCanvas = canvas.transferControlToOffscreen || (_emscripten_supports_offscreencanvas() && canvas instanceof OffscreenCanvas);
    if (!supportsOffscreenCanvas) {
      if (!contextAttributes.renderViaOffscreenBackBuffer) {
        contextAttributes.renderViaOffscreenBackBuffer = true;
      }
    }
    if (canvas.transferControlToOffscreen) {
      if (!canvas.controlTransferredOffscreen) {
        GL.offscreenCanvases[canvas.id] = {
          canvas: canvas.transferControlToOffscreen(),
          canvasSharedPtr: _malloc(12),
          id: canvas.id
        };
        canvas.controlTransferredOffscreen = true;
      } else if (!GL.offscreenCanvases[canvas.id]) {
        return 0;
      }
      canvas = GL.offscreenCanvases[canvas.id].canvas;
    }
  }
  var contextHandle = GL.createContext(canvas, contextAttributes);
  return contextHandle;
}

function _emscripten_webgl_make_context_current_calling_thread(contextHandle) {
  contextHandle >>>= 0;
  var success = GL.makeContextCurrent(contextHandle);
  if (success) GL.currentContextIsProxied = false;
  // If succeeded above, we will have a local GL context from this thread (worker or main).
  return success ? 0 : -5;
}

var ENV = {};

var getExecutableName = () => thisProgram;

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, __environ, environ_buf);
  __environ >>>= 0;
  environ_buf >>>= 0;
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    (growMemViews(), HEAPU32)[(((__environ) + (envp)) >>> 2) >>> 0] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1, penviron_count, penviron_buf_size);
  penviron_count >>>= 0;
  penviron_buf_size >>>= 0;
  var strings = getEnvStrings();
  (growMemViews(), HEAPU32)[((penviron_count) >>> 2) >>> 0] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  (growMemViews(), HEAPU32)[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
  return 0;
}

function _gecko_coarse_clock_start() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1);
  try {
    if (globalThis.__geckoCoarseClock) return;
    // idempotent
    if (typeof _gecko_coarse_now_ptr !== "function") return;
    var ptr = _gecko_coarse_now_ptr();
    // 8-aligned byte offset
    if (!ptr) return;
    globalThis.__geckoCoarseClock = true;
    // The heap is a SharedArrayBuffer (-pthread); a fresh view is needed after a
    // memory growth detaches the old buffer.
    var view = null;
    var current = function() {
      if (!view || view.buffer !== wasmMemory.buffer) {
        view = new BigInt64Array(wasmMemory.buffer, ptr, 1);
      }
      return view;
    };
    var nowMs = (typeof _emscripten_get_now === "function") ? function() {
      return _emscripten_get_now();
    } : function() {
      return performance.timeOrigin + performance.now();
    };
    var tick = function() {
      Atomics.store(current(), 0, BigInt(Math.round(nowMs() * 1e6)));
    };
    tick();
    setInterval(tick, 1);
  } catch (e) {}
}

var _emscripten_glClipControlEXT = (origin, depth) => {
  GLctx.extClipControl["clipControlEXT"](origin, depth);
};

var _glClipControlEXT = _emscripten_glClipControlEXT;

var _emscripten_glPolygonModeWEBGL = (face, mode) => {
  GLctx.webglPolygonMode["polygonModeWEBGL"](face, mode);
};

var _glPolygonModeWEBGL = _emscripten_glPolygonModeWEBGL;

var _emscripten_glPolygonOffsetClampEXT = (factor, units, clamp) => {
  GLctx.extPolygonOffsetClamp["polygonOffsetClampEXT"](factor, units, clamp);
};

var _glPolygonOffsetClampEXT = _emscripten_glPolygonOffsetClampEXT;

function _gl_present_yield() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 0);
  });
}

function _hostaudio_set_media_time(seconds) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1, seconds);
  wcaRT.mediaClockUs = seconds * 1e6;
  wcaRT.mediaClockWall = performance.now();
}

function _hostaudio_set_playing(playing) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, playing);
  wcaRT.setPlaying(!!playing);
}

function _hostimg_decode(ctrl, mimePtr, dataPtr, dataLen) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1, ctrl, mimePtr, dataPtr, dataLen);
  var c = ctrl >> 2;
  // int32 index of the control block
  function finish(status) {
    Atomics.store((growMemViews(), HEAP32), c + 0, status);
    Atomics.notify((growMemViews(), HEAP32), c + 0);
  }
  if (typeof ImageDecoder === "undefined") {
    console.warn("[hostimg] ImageDecoder unavailable in this browser");
    finish(2);
    return;
  }
  var mime = UTF8ToString(mimePtr);
  // Copy the encoded bytes out of the shared heap now (synchronously, before
  // the worker proceeds): the worker stays blocked but its buffer is its own.
  var enc = (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + dataLen);
  var dec;
  try {
    dec = new ImageDecoder({
      data: enc,
      type: mime
    });
  } catch (e) {
    console.warn("[hostimg] ctor failed:", e && e.message ? e.message : e);
    finish(2);
    return;
  }
  dec.decode({
    frameIndex: 0,
    completeFramesOnly: true
  }).then(function(res) {
    var frame = res.image;
    var w = frame.displayWidth | 0;
    var h = frame.displayHeight | 0;
    var stride = w * 4;
    var size = stride * h;
    var ptr = Module._malloc(size);
    var frames = 1;
    try {
      frames = (dec.tracks && dec.tracks.selectedTrack && dec.tracks.selectedTrack.frameCount) || 1;
    } catch (_) {}
    // Ask copyTo to hand us packed BGRA so the SurfacePipe input format is
    // OS_RGBA (B8G8R8A8 on little-endian) with a known w*4 stride.
    frame.copyTo((growMemViews(), HEAPU8).subarray(ptr >>> 0, ptr + size >>> 0), {
      format: "BGRA",
      layout: [ {
        offset: 0,
        stride
      } ]
    }).then(function() {
      (growMemViews(), HEAP32)[c + 1 >>> 0] = w;
      (growMemViews(), HEAP32)[c + 2 >>> 0] = h;
      (growMemViews(), HEAP32)[c + 3 >>> 0] = stride;
      (growMemViews(), HEAP32)[c + 4 >>> 0] = ptr;
      (growMemViews(), HEAP32)[c + 5 >>> 0] = frames;
      finish(1);
      try {
        frame.close();
      } catch (_) {}
      try {
        dec.close();
      } catch (_) {}
    }).catch(function(e) {
      console.warn("[hostimg] copyTo failed:", e && e.message ? e.message : e);
      Module._free(ptr);
      try {
        frame.close();
      } catch (_) {}
      try {
        dec.close();
      } catch (_) {}
      finish(2);
    });
  }).catch(function(e) {
    console.warn("[hostimg] decode failed:", e && e.message ? e.message : e);
    try {
      dec.close();
    } catch (_) {}
    finish(2);
  });
}

function _hostimg_gpu_decode(ctrl, idLo, idHi, mimePtr, dataPtr, dataLen) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1, ctrl, idLo, idHi, mimePtr, dataPtr, dataLen);
  var c = ctrl >> 2;
  function fail() {
    Atomics.store((growMemViews(), HEAP32), c + 0, 2);
    Atomics.notify((growMemViews(), HEAP32), c + 0);
  }
  if (typeof ImageDecoder === "undefined") {
    console.warn("[hostimg-gpu] ImageDecoder unavailable");
    fail();
    return;
  }
  var tid = _hostimg_renderer_tid();
  var rworker = (typeof PThread !== "undefined" && PThread.pthreads) ? PThread.pthreads[tid] : null;
  if (!tid || !rworker) {
    console.warn("[hostimg-gpu] renderer worker not found (tid=" + tid + ")");
    fail();
    return;
  }
  var mime = UTF8ToString(mimePtr);
  var enc = (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + dataLen);
  var dec;
  try {
    dec = new ImageDecoder({
      data: enc,
      type: mime
    });
  } catch (e) {
    console.warn("[hostimg-gpu] ctor failed:", e && e.message ? e.message : e);
    fail();
    return;
  }
  dec.decode({
    frameIndex: 0,
    completeFramesOnly: true
  }).then(function(res) {
    var frame = res.image;
    try {
      // The Renderer worker finishes the control block after the GL upload.
      rworker.postMessage({
        __hostimg: 1,
        ctrl,
        idLo,
        idHi,
        w: frame.displayWidth | 0,
        h: frame.displayHeight | 0,
        frame
      }, [ frame ]);
    } catch (e) {
      console.warn("[hostimg-gpu] transfer failed:", e && e.message ? e.message : e);
      try {
        frame.close();
      } catch (_) {}
      fail();
    }
    try {
      dec.close();
    } catch (_) {}
  }).catch(function(e) {
    console.warn("[hostimg-gpu] decode failed:", e && e.message ? e.message : e);
    try {
      dec.close();
    } catch (_) {}
    fail();
  });
}

function _hostimg_renderer_install() {
  if (globalThis.__geckoHostImgInstalled) {
    return;
  }
  globalThis.__geckoHostImgInstalled = true;
  globalThis.geckoHostImgTex = globalThis.geckoHostImgTex || new Map;
  self.addEventListener("message", function(e) {
    var d = e.data;
    if (!d || !d.__hostimg) {
      return;
    }
    var c = d.ctrl >> 2;
    var frame = d.frame;
    function done(status) {
      (growMemViews(), HEAP32)[c + 1 >>> 0] = d.w;
      (growMemViews(), HEAP32)[c + 2 >>> 0] = d.h;
      Atomics.store((growMemViews(), HEAP32), c + 0, status);
      Atomics.notify((growMemViews(), HEAP32), c + 0);
    }
    try {
      var t = GLctx.createTexture();
      var id = GL.getNewId(GL.textures);
      t.name = id;
      GL.textures[id] = t;
      GLctx.bindTexture(GLctx.TEXTURE_2D, t);
      // WebRender composites premultiplied; the host frame has straight alpha.
      GLctx.pixelStorei(GLctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, frame);
      GLctx.pixelStorei(GLctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
      GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MAG_FILTER, GLctx.LINEAR);
      GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
      GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
      var id64 = d.idHi * 4294967296 + (d.idLo >>> 0);
      globalThis.geckoHostImgTex.set(id64, {
        tex: id,
        w: d.w,
        h: d.h,
        ready: true
      });
      try {
        frame.close();
      } catch (_) {}
      done(1);
    } catch (err) {
      console.warn("[hostimg-gpu] upload failed:", err && err.message ? err.message : err);
      try {
        frame.close();
      } catch (_) {}
      done(2);
    }
  });
}

var geckoProv = mountId => (typeof Module !== "undefined" && Module.geckoProviders) ? Module.geckoProviders[mountId] : undefined;

async function _provider_mkdir(ctx, mountId, pathPtr, outErr) {
  let err = 0;
  try {
    await geckoProv(mountId).mkdir(UTF8ToString(pathPtr));
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

async function _provider_read(ctx, mountId, pathPtr, outPtr, outLen, outErr) {
  let p = 0, n = 0, err = 0;
  try {
    const data = await geckoProv(mountId).readFile(UTF8ToString(pathPtr));
    n = data.length;
    if (n > 0) {
      p = _malloc(n);
      (growMemViews(), HEAPU8).set(data, p >>> 0);
    }
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAPU32)[outPtr >>> 2] = p;
  (growMemViews(), HEAP32)[outLen >>> 2] = n;
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

async function _provider_readdir(ctx, mountId, pathPtr, entriesVec, outErr) {
  let err = 0;
  try {
    const prov = geckoProv(mountId);
    const dir = UTF8ToString(pathPtr);
    const names = await prov.readdir(dir);
    for (const name of names) {
      let isDir = 0;
      try {
        const st = await prov.stat(dir ? dir + "/" + name : name);
        if (st && st.isDir) isDir = 1;
      } catch (e) {}
      const sp = stackSave();
      _provider_record_entry(entriesVec, stringToUTF8OnStack(name), isDir);
      stackRestore(sp);
    }
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

async function _provider_rename(ctx, mountId, fromPtr, toPtr, outErr) {
  let err = 0;
  try {
    await geckoProv(mountId).rename(UTF8ToString(fromPtr), UTF8ToString(toPtr));
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

async function _provider_stat(ctx, mountId, pathPtr, outExists, outIsDir, outSize) {
  let exists = 0, isDir = 0, size = 0;
  try {
    const st = await geckoProv(mountId).stat(UTF8ToString(pathPtr));
    if (st) {
      exists = 1;
      isDir = st.isDir ? 1 : 0;
      size = st.size || 0;
    }
  } catch (e) {}
  (growMemViews(), HEAP32)[outExists >>> 2] = exists;
  (growMemViews(), HEAP32)[outIsDir >>> 2] = isDir;
  (growMemViews(), HEAPU32)[outSize >>> 2] = size >>> 0;
  (growMemViews(), HEAPU32)[(outSize >> 2) + 1 >>> 0] = Math.floor(size / 4294967296);
  _emscripten_proxy_finish(ctx);
}

async function _provider_unlink(ctx, mountId, pathPtr, outErr) {
  let err = 0;
  try {
    await geckoProv(mountId).unlink(UTF8ToString(pathPtr));
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

async function _provider_write(ctx, mountId, pathPtr, dataPtr, len, outErr) {
  let err = 0;
  try {
    // Copy out of the heap (the provider call is async; the heap may move/grow).
    await geckoProv(mountId).writeFile(UTF8ToString(pathPtr), (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + len));
  } catch (e) {
    err = 1;
  }
  (growMemViews(), HEAP32)[outErr >>> 2] = err;
  _emscripten_proxy_finish(ctx);
}

var initRandomFill = () => view => (view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), 
0);

var randomFill = view => (randomFill = initRandomFill())(view);

function _random_get(buffer, size) {
  buffer >>>= 0;
  size >>>= 0;
  return randomFill((growMemViews(), HEAPU8).subarray(buffer >>> 0, buffer + size >>> 0));
}

function _sendfile(...args) {
  abort("missing function: sendfile");
}

_sendfile.stub = true;

function whSyncMem(h, dir) {
  var r = globalThis.__whReg[h];
  if (!r || r.memObjId < 0) return;
  var mem = globalThis.__whObj[r.memObjId];
  // A JIT module imports the guest's own memory and has NO mirror (it shares
  // the guest ArrayBuffer): nothing to copy, and __whObjMirror may be unset.
  var mir = globalThis.__whObjMirror && globalThis.__whObjMirror[r.memObjId];
  if (!mem || !mir) return;
  var hb = new Uint8Array(mem.buffer);
  var n = mir.len < hb.length ? mir.len : hb.length;
  if (dir === 0) hb.set((growMemViews(), HEAPU8).subarray(mir.ptr >>> 0, mir.ptr + n >>> 0)); else (growMemViews(), 
  HEAPU8).set(hb.subarray(0, n), mir.ptr >>> 0);
}

var updateTableMap = (offset, count) => {
  if (functionsInTableMap) {
    for (var i = offset; i < offset + count; i++) {
      var item = getWasmTableEntry(i);
      // Ignore null values.
      if (item) {
        functionsInTableMap.set(item, i);
      }
    }
  }
};

var functionsInTableMap;

var getFunctionAddress = func => {
  // First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap;
    updateTableMap(0, wasmTable.length);
  }
  return functionsInTableMap.get(func) || 0;
};

var freeTableIndexes = [];

var getEmptyTableSlot = () => {
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    return freeTableIndexes.pop();
  }
  try {
    // Grow the table
    return wasmTable["grow"](1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    abort("Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.");
  }
};

var setWasmTableEntry = (idx, func) => {
  /** @suppress {checkTypes} */ wasmTable.set(idx, func);
  // With ABORT_ON_WASM_EXCEPTIONS wasmTable.get is overridden to return wrapped
  // functions so we need to call it here to retrieve the potential wrapper correctly
  // instead of just storing 'func' directly into wasmTableMirror
  /** @suppress {checkTypes} */ wasmTableMirror[idx] = wasmTable.get(idx);
};

var uleb128EncodeWithLen = arr => {
  const n = arr.length;
  assert(n < 16384);
  // Note: this LEB128 length encoding produces extra byte for n < 128,
  // but we don't care as it's only used in a temporary representation.
  return [ (n % 128) | 128, n >> 7, ...arr ];
};

var wasmTypeCodes = {
  "i": 127,
  // i32
  "p": 127,
  // i32
  "j": 126,
  // i64
  "f": 125,
  // f32
  "d": 124,
  // f64
  "e": 111
};

var generateTypePack = types => uleb128EncodeWithLen(Array.from(types, type => {
  var code = wasmTypeCodes[type];
  assert(code, `invalid signature char: ${type}`);
  return code;
}));

var convertJsFunctionToWasm = (func, sig) => {
  // TODO: If the type reflection proposal ever makes progress we can use
  // it here instead of creatign a new module.
  var bytes = Uint8Array.of(0, 97, 115, 109, // magic ("\0asm")
  1, 0, 0, 0, // version: 1
  1, // Type section code
  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  ...uleb128EncodeWithLen([ 1, // count: 1
  96, // param types
  ...generateTypePack(sig.slice(1)), // return types (for now only supporting [] if `void` and single [T] otherwise)
  ...generateTypePack(sig[0] === "v" ? "" : sig[0]) ]), // The rest of the module is static
  2, 7, // import section
  // (import "e" "f" (func 0 (type 0)))
  1, 1, 101, 1, 102, 0, 0, 7, 5, // export section
  // (export "f" (func 0 (type 0)))
  1, 1, 102, 0, 0);
  // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    "e": {
      "f": func
    }
  });
  var wrappedFunc = instance.exports["f"];
  return wrappedFunc;
};

/** @param {string=} sig */ var addFunction = (func, sig) => {
  assert(typeof func != "undefined");
  // Check if the function is already in the table, to ensure each function
  // gets a unique index.
  var rtn = getFunctionAddress(func);
  if (rtn) {
    return rtn;
  }
  // It's not in the table, add it now.
  var ret = getEmptyTableSlot();
  // Set the new value.
  try {
    // Attempting to call this with JS function will cause table.set() to fail
    setWasmTableEntry(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig != "undefined", "Missing signature argument to addFunction: " + func);
    var wrapped = convertJsFunctionToWasm(func, sig);
    setWasmTableEntry(ret, wrapped);
  }
  functionsInTableMap.set(func, ret);
  return ret;
};

function _wasmhost_call(h, idx, argsptr, argc) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r || !r.fns) return 0;
  // idx === -1: register the trampoline export (f: (f64)->f64) into the MAIN
  // indirect table so the engine can call the JIT'd fn via a C function pointer
  // (no JS hop). Returns the slot (a valid fn pointer); 0 if it can't be
  // registered (C++ treats <= 0 as "no direct entry" and falls back to the shim).
  if (idx === -1) {
    if (r.directIdx === undefined) {
      var f0 = r.fns[0];
      try {
        r.directIdx = (typeof f0 === "function") ? addFunction(f0, "dd") : 0;
      } catch (e) {
        r.directIdx = 0;
      }
    }
    return r.directIdx;
  }
  var fn = r.fns[idx];
  if (typeof fn !== "function") return 0;
  var base = argsptr >> 3;
  var args = new Array(argc);
  for (var i = 0; i < argc; i++) args[i] = (growMemViews(), HEAPF64)[base + i >>> 0];
  whSyncMem(h, 0);
  // guest -> host before the export runs
  var v = fn.apply(null, args);
  whSyncMem(h, 1);
  // host -> guest after
  return typeof v === "number" ? v : (typeof v === "bigint" ? Number(v) : 0);
}

function _wasmhost_compile(ptr, len) {
  try {
    if (typeof WebAssembly === "undefined") return -1;
    var bytes = (growMemViews(), HEAPU8).slice(ptr, ptr + len);
    var mod = new WebAssembly.Module(bytes);
    var reg = globalThis.__whReg || (globalThis.__whReg = []);
    var h = reg.length;
    reg.push({
      mod,
      inst: null,
      imports: WebAssembly.Module.imports(mod),
      exps: WebAssembly.Module.exports(mod),
      fns: null,
      memObjId: -1
    });
    return h;
  } catch (e) {
    console.error("[wasm-host] compile failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _wasmhost_export_count(h) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  return r ? r.exps.length : 0;
}

function _wasmhost_export_kind(h, i) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r) return -1;
  var k = r.exps[i].kind;
  return k === "function" ? 0 : k === "table" ? 1 : k === "memory" ? 2 : 3;
}

function _wasmhost_export_name(h, i, buf, buflen) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r) return 0;
  var s = r.exps[i].name, need = lengthBytesUTF8(s);
  stringToUTF8(s, buf, buflen);
  return need < buflen ? need : buflen - 1;
}

function _wasmhost_export_register_mem(h, idx) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r || !r.inst) return -1;
  var mem = r.inst.exports[r.exps[idx].name];
  if (!(mem instanceof WebAssembly.Memory)) return -1;
  var reg = globalThis.__whObj || (globalThis.__whObj = []);
  var id = reg.length;
  reg.push(mem);
  r.memObjId = id;
  return id;
}

function _wasmhost_export_register_obj(h, idx) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r || !r.inst) return -1;
  var obj = r.inst.exports[r.exps[idx].name];
  if (obj == null) return -1;
  var reg = globalThis.__whObj || (globalThis.__whObj = []);
  var id = reg.length;
  reg.push(obj);
  (globalThis.__whObjOwner || (globalThis.__whObjOwner = {}))[id] = h;
  return id;
}

function _wasmhost_global_get(id) {
  var g = globalThis.__whObj && globalThis.__whObj[id];
  if (!g) return 0;
  var v = g.value;
  return typeof v === "bigint" ? Number(v) : (typeof v === "number" ? v : 0);
}

function _wasmhost_global_new(val, kind, mut) {
  try {
    var type = kind === 0 ? "i32" : kind === 1 ? "i64" : kind === 2 ? "f32" : "f64";
    var g = new WebAssembly.Global({
      value: type,
      mutable: !!mut
    }, kind === 1 ? BigInt(Math.trunc(val)) : val);
    var reg = globalThis.__whObj || (globalThis.__whObj = []);
    var id = reg.length;
    reg.push(g);
    return id;
  } catch (e) {
    console.error("[wasm-host] global_new failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _wasmhost_global_set(id, val) {
  var g = globalThis.__whObj && globalThis.__whObj[id];
  if (!g) return -1;
  try {
    g.value = val;
    return 0;
  } catch (e) {
    return -1;
  }
}

function _wasmhost_guest_mem_objid() {
  if (globalThis.__whGuestMemId !== undefined) return globalThis.__whGuestMemId;
  var mem = (typeof wasmMemory !== "undefined" && wasmMemory) ? wasmMemory : (typeof Module !== "undefined" && Module.wasmMemory) ? Module.wasmMemory : null;
  if (!mem || !mem.buffer) {
    globalThis.__whGuestMemId = -1;
    return -1;
  }
  var reg = globalThis.__whObj || (globalThis.__whObj = []);
  var id = reg.length;
  reg.push(mem);
  globalThis.__whGuestMemId = id;
  return id;
}

function _wasmhost_guest_mem_shared() {
  var mem = (typeof wasmMemory !== "undefined" && wasmMemory) ? wasmMemory : (typeof Module !== "undefined" && Module.wasmMemory) ? Module.wasmMemory : null;
  return (mem && mem.buffer && typeof SharedArrayBuffer !== "undefined" && (mem.buffer instanceof SharedArrayBuffer)) ? 1 : 0;
}

function _wasmhost_import_count(h) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  return r ? r.imports.length : 0;
}

function _wasmhost_import_kind(h, i) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r) return -1;
  var k = r.imports[i].kind;
  return k === "function" ? 0 : k === "table" ? 1 : k === "memory" ? 2 : 3;
}

function _wasmhost_import_module(h, i, buf, buflen) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r) return 0;
  var s = r.imports[i].module, need = lengthBytesUTF8(s);
  stringToUTF8(s, buf, buflen);
  return need < buflen ? need : buflen - 1;
}

function _wasmhost_import_name(h, i, buf, buflen) {
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!r) return 0;
  var s = r.imports[i].name, need = lengthBytesUTF8(s);
  stringToUTF8(s, buf, buflen);
  return need < buflen ? need : buflen - 1;
}

function _wasmhost_instantiate(h, callbackIdsPtr, importCount) {
  try {
    var r = globalThis.__whReg && globalThis.__whReg[h];
    if (!r) return -1;
    function shimFor(cbid, hh) {
      return function() {
        whSyncMem(hh, 1);
        // host -> guest, so the guest import sees live memory
        var argc = arguments.length;
        if (argc > 64) argc = 64;
        var scratch = globalThis.__whScratch;
        if (!scratch) scratch = globalThis.__whScratch = Module._malloc(64 * 8);
        var base = scratch >> 3;
        for (var i = 0; i < argc; i++) {
          var a = arguments[i];
          (growMemViews(), HEAPF64)[base + i >>> 0] = typeof a === "bigint" ? Number(a) : a;
        }
        var ret = Module._wasmhost_invoke_import(cbid, scratch, argc);
        whSyncMem(hh, 0);
        // guest -> host, capture the import's writes
        return ret;
      };
    }
    var hostImports = {};
    // callbackIdsPtr is a wasm32 pointer arriving as a SIGNED i32: when the
    // engine memory is large (>2GB, e.g. the nested inner engine), a C-stack
    // address has its high bit set and shows up negative here, so HEAP32[ptr>>2]
    // reads out of bounds (undefined). Also HEAP32 itself can be a stale
    // pre-growth view. Re-derive a live Int32Array over the current buffer at
    // the UNSIGNED offset for this read.
    var __uptr = callbackIdsPtr >>> 0;
    var __mem = (typeof wasmMemory !== "undefined" && wasmMemory) ? wasmMemory : (typeof Module !== "undefined" && Module.wasmMemory) ? Module.wasmMemory : null;
    var __ids = (__mem && (__uptr + importCount * 4) <= __mem.buffer.byteLength) ? new Int32Array(__mem.buffer, __uptr, importCount) : null;
    for (var i = 0; i < importCount; i++) {
      var imp = r.imports[i];
      if (!hostImports[imp.module]) hostImports[imp.module] = {};
      var id = __ids ? __ids[i] : (growMemViews(), HEAP32)[(__uptr >>> 2) + i >>> 0];
      if (id === -2) {
        // JS->wasm JIT call dispatch: a JIT module's "m"."call" import re-enters
        // C++ to invoke the cached callee's wasm (args already in gWJScratch).
        hostImports[imp.module][imp.name] = function(site, argc) {
          return Module._wasmjit_invoke(site, argc);
        };
        continue;
      }
      if (id === -3) {
        // Mode VS no-restart helper: a JIT module's "m"."help" import re-enters
        // C++ to complete one op (operands in gWJHelp*; shares the guest heap, so
        // no whSyncMem). Returns 0 ok / 1 threw / (engine may grow guest memory).
        hostImports[imp.module][imp.name] = function(kind, site) {
          return Module._wjhelp(kind, site);
        };
        continue;
      }
      if (id === -10) {
        // Flavor-B wasm->wasm JIT dispatch (WasmInterpJit-inl.h): the host
        // module shares the guest/engine memory (no mirror), so b_help re-enters
        // the interpreter for calls/grow/traps. (kind, a, b, c) -> i32 status.
        hostImports[imp.module][imp.name] = function(kind, a, b, c) {
          return Module._b_help(kind, a, b, c);
        };
        continue;
      }
      if (id < 0) continue;
      if (imp.kind === "function") {
        hostImports[imp.module][imp.name] = shimFor(id, h);
      } else {
        // memory / table / global: host-backed object from the registry
        hostImports[imp.module][imp.name] = globalThis.__whObj[id];
        if (imp.kind === "memory") r.memObjId = id;
      }
    }
    var inst = new WebAssembly.Instance(r.mod, hostImports);
    r.inst = inst;
    var fns = [];
    for (var j = 0; j < r.exps.length; j++) {
      fns.push(r.exps[j].kind === "function" ? inst.exports[r.exps[j].name] : null);
    }
    r.fns = fns;
    return 0;
  } catch (e) {
    console.error("[wasm-host] instantiate failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _wasmhost_jit_table() {
  if (globalThis.__whJitTableId !== undefined) return globalThis.__whJitTableId;
  try {
    var t = new WebAssembly.Table({
      element: "anyfunc",
      initial: 4096
    });
    var reg = globalThis.__whObj || (globalThis.__whObj = []);
    var id = reg.length;
    reg.push(t);
    globalThis.__whJitTableId = id;
    return id;
  } catch (e) {
    console.error("[wasm-host] jit_table failed:", e && e.message ? e.message : e);
    globalThis.__whJitTableId = -1;
    return -1;
  }
}

function _wasmhost_jit_table_set(h, idx) {
  var tid = globalThis.__whJitTableId;
  if (tid === undefined || tid < 0) return -1;
  var t = globalThis.__whObj[tid];
  var r = globalThis.__whReg && globalThis.__whReg[h];
  if (!t || !r || !r.fns) return -1;
  var fn = null;
  for (var i = 0; i < r.exps.length; i++) {
    if (r.exps[i].name === "m") {
      fn = r.fns[i];
      break;
    }
  }
  if (!fn) fn = r.fns[0];
  if (typeof fn !== "function") return -1;
  try {
    t.set(idx, fn);
    return 0;
  } catch (e) {
    return -1;
  }
}

function _wasmhost_mem_bytelength(id) {
  var m = globalThis.__whObj && globalThis.__whObj[id];
  return m && m.buffer ? m.buffer.byteLength : 0;
}

function _wasmhost_mem_is_shared(id) {
  var m = globalThis.__whObj && globalThis.__whObj[id];
  return m && m.buffer && (typeof SharedArrayBuffer !== "undefined") && (m.buffer instanceof SharedArrayBuffer) ? 1 : 0;
}

function _wasmhost_mem_new(initialPages, maxPages, shared) {
  try {
    var desc = {
      initial: initialPages
    };
    if (maxPages >= 0) desc.maximum = maxPages; else if (shared) desc.maximum = initialPages;
    if (shared) desc.shared = true;
    var mem = new WebAssembly.Memory(desc);
    var reg = globalThis.__whObj || (globalThis.__whObj = []);
    var id = reg.length;
    reg.push(mem);
    return id;
  } catch (e) {
    console.error("[wasm-host] mem_new failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _wasmhost_obj_set_mirror(id, ptr, len) {
  var reg = globalThis.__whObjMirror || (globalThis.__whObjMirror = {});
  reg[id] = {
    ptr,
    len
  };
  var mem = globalThis.__whObj && globalThis.__whObj[id];
  if (mem && mem.buffer) {
    var hb = new Uint8Array(mem.buffer);
    (growMemViews(), HEAPU8).set(hb.subarray(0, len < hb.length ? len : hb.length), ptr >>> 0);
  }
}

function _wasmhost_table_call(id, idx, argsptr, argc) {
  var t = globalThis.__whObj && globalThis.__whObj[id];
  if (!t) return 0;
  var fn;
  try {
    fn = t.get(idx);
  } catch (e) {
    return 0;
  }
  if (typeof fn !== "function") return 0;
  var owner = globalThis.__whObjOwner && globalThis.__whObjOwner[id];
  if (owner !== undefined) whSyncMem(owner, 0);
  // guest -> host
  var base = argsptr >> 3;
  var args = new Array(argc);
  for (var i = 0; i < argc; i++) args[i] = (growMemViews(), HEAPF64)[base + i >>> 0];
  var v = fn.apply(null, args);
  if (owner !== undefined) whSyncMem(owner, 1);
  // host -> guest
  return typeof v === "number" ? v : (typeof v === "bigint" ? Number(v) : 0);
}

function _wasmhost_table_grow(id, delta) {
  var t = globalThis.__whObj && globalThis.__whObj[id];
  if (!t) return -1;
  try {
    return t.grow(delta);
  } catch (e) {
    return -1;
  }
}

function _wasmhost_table_length(id) {
  var t = globalThis.__whObj && globalThis.__whObj[id];
  return t && typeof t.length === "number" ? t.length : -1;
}

function _wasmhost_table_new(initial, maxN, isExternref) {
  try {
    var desc = {
      initial,
      element: isExternref ? "externref" : "anyfunc"
    };
    if (maxN >= 0) desc.maximum = maxN;
    var t = new WebAssembly.Table(desc);
    var reg = globalThis.__whObj || (globalThis.__whObj = []);
    var id = reg.length;
    reg.push(t);
    return id;
  } catch (e) {
    console.error("[wasm-host] table_new failed:", e && e.message ? e.message : e);
    return -1;
  }
}

function _wasmhost_table_set_hostfn(tableId, idx, srcHandle, srcIdx) {
  var t = globalThis.__whObj && globalThis.__whObj[tableId];
  var r = globalThis.__whReg && globalThis.__whReg[srcHandle];
  if (!t || !r || !r.fns) return -1;
  var fn = r.fns[srcIdx];
  if (typeof fn !== "function") return -1;
  try {
    t.set(idx, fn);
    return 0;
  } catch (e) {
    return -1;
  }
}

function _wasmhost_table_set_null(id, idx) {
  var t = globalThis.__whObj && globalThis.__whObj[id];
  if (!t) return -1;
  try {
    t.set(idx, null);
    return 0;
  } catch (e) {
    return -1;
  }
}

var wcOff = {
  WC_WRITE: 0,
  WC_READ: 1,
  WC_FLUSH: 2,
  WC_ERROR: 3,
  WC_FUTEX: 4,
  WC_HDR: 5,
  RING_N: 64,
  SLOT_INTS: 14,
  SL_PTR: 0,
  SL_LEN: 1,
  SL_W: 2,
  SL_H: 3,
  SL_SY: 4,
  SL_SU: 5,
  SL_SV: 6,
  SL_OY: 7,
  SL_OU: 8,
  SL_OV: 9,
  SL_TSLO: 10,
  SL_TSHI: 11,
  SL_MTX: 12,
  SL_RANGE: 13
};

var wcRT = {
  decoders: null,
  nextId: 1,
  warnedFmt: false,
  ensure: function() {
    if (!wcRT.decoders) wcRT.decoders = new Map;
  },
  matrixCode: function(s) {
    if (s === "rgb") return 3;
    if (s === "bt470bg" || s === "smpte170m") return 0;
    if (s === "bt2020-ncl") return 2;
    return 1;
  },
  wake: function(reg) {
    var fi = (reg.ctrl >> 2) + wcOff.WC_FUTEX;
    Atomics.add((growMemViews(), HEAP32), fi, 1);
    Atomics.notify((growMemViews(), HEAP32), fi, 1);
  },
  setError: function(reg) {
    Atomics.store((growMemViews(), HEAP32), (reg.ctrl >> 2) + wcOff.WC_ERROR, 1);
    wcRT.wake(reg);
  },
  onFrame: async function(reg, frame) {
    var myGen = reg.gen;
    var ptr = 0;
    try {
      var fmt = frame.format;
      var isI420 = (fmt === "I420" || fmt === "I420A");
      var isNV12 = (fmt === "NV12");
      // RGB family -> [rOff, gOff, bOff] within each 4-byte packed pixel.
      var rgb = (fmt === "RGBA" || fmt === "RGBX") ? [ 0, 1, 2 ] : (fmt === "BGRA" || fmt === "BGRX") ? [ 2, 1, 0 ] : null;
      if (!isI420 && !isNV12 && !rgb) {
        if (!wcRT.warnedFmt) {
          wcRT.warnedFmt = true;
          console.warn("[webcodecs] unsupported VideoFrame format:", fmt);
        }
        frame.close();
        return;
      }
      var vr = frame.visibleRect;
      var opts = {};
      if (vr) opts.rect = vr;
      var w = vr ? vr.width : frame.codedWidth;
      var h = vr ? vr.height : frame.codedHeight;
      var ts = frame.timestamp;
      // microseconds
      var mtx = 1, range = 0;
      if (frame.colorSpace) {
        mtx = wcRT.matrixCode(frame.colorSpace.matrix);
        range = frame.colorSpace.fullRange ? 1 : 0;
      }
      // Y/U/V strides + offsets within the published buffer (filled per format).
      var sy, su, sv, oy, ou, ov, size;
      if (isI420) {
        // Native planar: copy straight into the shared buffer and report the
        // implementation's own layout (strides may be padded; alpha ignored).
        size = frame.allocationSize(opts);
        ptr = Module._malloc(size);
        if (!ptr) {
          frame.close();
          return;
        }
        var layout;
        var copy = frame.copyTo((growMemViews(), HEAPU8).subarray(ptr >>> 0, ptr + size >>> 0), opts).then(function(lay) {
          layout = lay;
        });
        reg.pending = reg.pending.then(function() {
          return copy;
        });
        await copy;
        frame.close();
        frame = null;
        sy = layout[0].stride;
        oy = layout[0].offset;
        su = layout[1].stride;
        ou = layout[1].offset;
        sv = layout[2].stride;
        ov = layout[2].offset;
      } else if (isNV12) {
        // NV12: copy native (Y + interleaved CbCr) into a temp, then build a tight
        // I420 in the shared buffer by deinterleaving the UV plane into U,V.
        var cw = (w + 1) >> 1, ch = (h + 1) >> 1;
        var nsize = frame.allocationSize(opts);
        var tmp = new Uint8Array(nsize);
        var nlayout;
        var copyN = frame.copyTo(tmp, opts).then(function(lay) {
          nlayout = lay;
        });
        reg.pending = reg.pending.then(function() {
          return copyN;
        });
        await copyN;
        frame.close();
        frame = null;
        sy = w;
        oy = 0;
        su = cw;
        ou = w * h;
        sv = cw;
        ov = w * h + cw * ch;
        size = w * h + 2 * cw * ch;
        ptr = Module._malloc(size);
        if (!ptr) return;
        var dst = (growMemViews(), HEAPU8);
        // re-acquire post-await (heap may have grown)
        var yOff = nlayout[0].offset, yStride = nlayout[0].stride;
        var uvOff = nlayout[1].offset, uvStride = nlayout[1].stride;
        for (var y = 0; y < h; y++) {
          var ysrc = yOff + y * yStride;
          dst.set(tmp.subarray(ysrc, ysrc + w), ptr + oy + y * w);
        }
        for (var cy = 0; cy < ch; cy++) {
          var srow = uvOff + cy * uvStride;
          var urow = ptr + ou + cy * cw;
          var vrow = ptr + ov + cy * cw;
          for (var cx = 0; cx < cw; cx++) {
            dst[urow + cx] = tmp[srow + 2 * cx];
            dst[vrow + cx] = tmp[srow + 2 * cx + 1];
          }
        }
      } else {
        // RGB family (Chrome's GPU H.264 emits BGRX here). Convert packed RGB ->
        // full-range BT.601 I420: Y per pixel, U/V from 2x2-box-averaged RGB. We
        // tag matrix=BT.601(0)/range=full(1) so Gecko's inverse recovers the same
        // RGB (chroma subsampling aside).
        var cw = (w + 1) >> 1, ch = (h + 1) >> 1;
        var nsize = frame.allocationSize(opts);
        var tmp = new Uint8Array(nsize);
        var rlayout;
        var copyR = frame.copyTo(tmp, opts).then(function(lay) {
          rlayout = lay;
        });
        reg.pending = reg.pending.then(function() {
          return copyR;
        });
        await copyR;
        frame.close();
        frame = null;
        sy = w;
        oy = 0;
        su = cw;
        ou = w * h;
        sv = cw;
        ov = w * h + cw * ch;
        size = w * h + 2 * cw * ch;
        ptr = Module._malloc(size);
        if (!ptr) return;
        mtx = 0;
        range = 1;
        // produced as BT.601 full-range
        var dst = (growMemViews(), HEAPU8);
        // re-acquire post-await/malloc
        var pOff = rlayout[0].offset, pStride = rlayout[0].stride;
        var rO = rgb[0], gO = rgb[1], bO = rgb[2];
        for (var y = 0; y < h; y++) {
          var prow = pOff + y * pStride, yd = ptr + y * w;
          for (var x = 0; x < w; x++) {
            var px = prow + (x << 2);
            dst[yd + x] = (.299 * tmp[px + rO] + .587 * tmp[px + gO] + .114 * tmp[px + bO] + .5) | 0;
          }
        }
        for (var cy = 0; cy < ch; cy++) {
          var y0 = cy << 1, y1 = (y0 + 1 < h) ? y0 + 1 : y0;
          var o0 = pOff + y0 * pStride, o1 = pOff + y1 * pStride;
          var ud = ptr + ou + cy * cw, vd = ptr + ov + cy * cw;
          for (var cx = 0; cx < cw; cx++) {
            var x0 = cx << 1, x1 = (x0 + 1 < w) ? x0 + 1 : x0;
            var p00 = o0 + (x0 << 2), p01 = o0 + (x1 << 2), p10 = o1 + (x0 << 2), p11 = o1 + (x1 << 2);
            var r = (tmp[p00 + rO] + tmp[p01 + rO] + tmp[p10 + rO] + tmp[p11 + rO] + 2) >> 2;
            var g = (tmp[p00 + gO] + tmp[p01 + gO] + tmp[p10 + gO] + tmp[p11 + gO] + 2) >> 2;
            var b = (tmp[p00 + bO] + tmp[p01 + bO] + tmp[p10 + bO] + tmp[p11 + bO] + 2) >> 2;
            var u = (-.168736 * r - .331264 * g + .5 * b + 128.5) | 0;
            var v = (.5 * r - .418688 * g - .081312 * b + 128.5) | 0;
            dst[ud + cx] = u < 0 ? 0 : (u > 255 ? 255 : u);
            dst[vd + cx] = v < 0 ? 0 : (v > 255 ? 255 : v);
          }
        }
      }
      // A reset()/destroy() may have happened during the await. If so this frame
      // is stale: free our own buffer and drop it WITHOUT touching the control
      // block (the worker may already have freed it).
      if (myGen !== reg.gen || reg.dead) {
        Module._free(ptr);
        return;
      }
      var ci = reg.ctrl >> 2;
      // Ring full? (worker is RING_N frames behind.) Drop this frame.
      var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcOff.WC_READ);
      if (reg.writeCount - readCount >= wcOff.RING_N) {
        console.warn("[webcodecs] ring overflow; frame dropped");
        Module._free(ptr);
        return;
      }
      var tsHi = Math.floor(ts / 4294967296);
      var tsLo = ts - tsHi * 4294967296;
      var slot = ci + wcOff.WC_HDR + (reg.writeCount % wcOff.RING_N) * wcOff.SLOT_INTS;
      (growMemViews(), HEAP32)[slot + wcOff.SL_PTR >>> 0] = ptr;
      (growMemViews(), HEAP32)[slot + wcOff.SL_LEN >>> 0] = size;
      (growMemViews(), HEAP32)[slot + wcOff.SL_W >>> 0] = w;
      (growMemViews(), HEAP32)[slot + wcOff.SL_H >>> 0] = h;
      (growMemViews(), HEAP32)[slot + wcOff.SL_SY >>> 0] = sy;
      (growMemViews(), HEAP32)[slot + wcOff.SL_SU >>> 0] = su;
      (growMemViews(), HEAP32)[slot + wcOff.SL_SV >>> 0] = sv;
      (growMemViews(), HEAP32)[slot + wcOff.SL_OY >>> 0] = oy;
      (growMemViews(), HEAP32)[slot + wcOff.SL_OU >>> 0] = ou;
      (growMemViews(), HEAP32)[slot + wcOff.SL_OV >>> 0] = ov;
      (growMemViews(), HEAP32)[slot + wcOff.SL_TSLO >>> 0] = tsLo | 0;
      (growMemViews(), HEAP32)[slot + wcOff.SL_TSHI >>> 0] = tsHi | 0;
      (growMemViews(), HEAP32)[slot + wcOff.SL_MTX >>> 0] = mtx;
      (growMemViews(), HEAP32)[slot + wcOff.SL_RANGE >>> 0] = range;
      reg.writeCount++;
      Atomics.store((growMemViews(), HEAP32), ci + wcOff.WC_WRITE, reg.writeCount);
      wcRT.wake(reg);
    } catch (e) {
      console.warn("[webcodecs] onFrame failed:", e && e.message ? e.message : e);
      if (ptr) Module._free(ptr);
      if (frame) {
        try {
          frame.close();
        } catch (_) {}
      }
      if (myGen === reg.gen && !reg.dead) wcRT.setError(reg);
    }
  }
};

function _webcodecs_create(ctrl, codecPtr, descPtr, descLen, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, ctrl, codecPtr, descPtr, descLen, width, height);
  wcRT.ensure();
  if (typeof VideoDecoder === "undefined") {
    console.warn("[webcodecs] VideoDecoder unavailable in this browser");
    return -1;
  }
  var codec = codecPtr ? UTF8ToString(codecPtr) : "avc1.42E01E";
  var description = descLen >= 1 ? (growMemViews(), HEAPU8).slice(descPtr, descPtr + descLen) : null;
  var id = wcRT.nextId++;
  var reg = {
    id,
    ctrl,
    gen: 0,
    dead: false,
    writeCount: 0,
    width,
    height,
    pending: Promise.resolve(),
    decoder: null,
    config: null
  };
  var config = {
    codec,
    codedWidth: width,
    codedHeight: height,
    optimizeForLatency: true
  };
  if (description) config.description = description;
  reg.config = config;
  try {
    var dec = new VideoDecoder({
      output: function(frame) {
        wcRT.onFrame(reg, frame);
      },
      error: function(e) {
        console.warn("[webcodecs] decoder error:", e && e.message ? e.message : e);
        wcRT.setError(reg);
      }
    });
    dec.configure(config);
    reg.decoder = dec;
  } catch (e) {
    console.warn("[webcodecs] configure failed:", e && e.message ? e.message : e);
    return -1;
  }
  wcRT.decoders.set(id, reg);
  return id;
}

function _webcodecs_destroy(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, handle);
  var reg = wcRT.decoders && wcRT.decoders.get(handle);
  if (!reg) return;
  reg.gen++;
  reg.dead = true;
  try {
    reg.decoder.close();
  } catch (_) {}
  var ci = reg.ctrl >> 2;
  var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcOff.WC_READ);
  for (var c = readCount; c < reg.writeCount; c++) {
    var slot = ci + wcOff.WC_HDR + (c % wcOff.RING_N) * wcOff.SLOT_INTS;
    var p = (growMemViews(), HEAP32)[slot + wcOff.SL_PTR >>> 0];
    if (p) Module._free(p);
  }
  wcRT.decoders.delete(handle);
}

function _webcodecs_feed(handle, dataPtr, dataLen, isKey, tsLo, tsHi) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, handle, dataPtr, dataLen, isKey, tsLo, tsHi);
  var reg = wcRT.decoders && wcRT.decoders.get(handle);
  if (!reg || reg.dead || !reg.decoder) return;
  var ts = (tsHi | 0) * 4294967296 + (tsLo >>> 0);
  try {
    var chunk = new EncodedVideoChunk({
      type: isKey ? "key" : "delta",
      timestamp: ts,
      data: (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + dataLen)
    });
    reg.decoder.decode(chunk);
  } catch (e) {
    console.warn("[webcodecs] decode() threw:", e && e.message ? e.message : e);
    wcRT.setError(reg);
  }
}

function _webcodecs_flush(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 0, 1, handle);
  var reg = wcRT.decoders && wcRT.decoders.get(handle);
  if (!reg || reg.dead || !reg.decoder) return;
  var ci = reg.ctrl >> 2;
  var done = function() {
    if (reg.dead) return;
    Atomics.add((growMemViews(), HEAP32), ci + wcOff.WC_FLUSH, 1);
    wcRT.wake(reg);
  };
  reg.decoder.flush().then(function() {
    return reg.pending;
  }).then(done).catch(function() {
    done();
  });
}

function _webcodecs_reset(handle) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 0, 1, handle);
  var reg = wcRT.decoders && wcRT.decoders.get(handle);
  if (!reg || reg.dead) return;
  reg.gen++;
  // invalidate in-flight onFrame stragglers
  try {
    reg.decoder.reset();
  } catch (_) {}
  var ci = reg.ctrl >> 2;
  var readCount = Atomics.load((growMemViews(), HEAP32), ci + wcOff.WC_READ);
  for (var c = readCount; c < reg.writeCount; c++) {
    var slot = ci + wcOff.WC_HDR + (c % wcOff.RING_N) * wcOff.SLOT_INTS;
    var p = (growMemViews(), HEAP32)[slot + wcOff.SL_PTR >>> 0];
    if (p) Module._free(p);
  }
  reg.writeCount = 0;
  Atomics.store((growMemViews(), HEAP32), ci + wcOff.WC_WRITE, 0);
  Atomics.store((growMemViews(), HEAP32), ci + wcOff.WC_READ, 0);
  Atomics.store((growMemViews(), HEAP32), ci + wcOff.WC_ERROR, 0);
  reg.pending = Promise.resolve();
  try {
    reg.decoder.configure(reg.config);
  } catch (_) {}
}

var WISP = {
  conn: null,
  ensureConn: function() {
    if (WISP.conn) return WISP.conn;
    var url = (typeof Module !== "undefined") && Module.wispUrl;
    if (!url) {
      err("[wisp] Module.wispUrl unset; networking disabled");
      return null;
    }
    var Ctor = (typeof Module !== "undefined") && Module.WispClientConnection;
    if (!Ctor) {
      err("[wisp] Module.WispClientConnection unset; networking disabled");
      return null;
    }
    // wisp-js requires the endpoint to end with a trailing slash; be lenient.
    if (url[url.length - 1] !== "/") url += "/";
    var conn = {
      client: null,
      ready: false,
      pending: [],
      streams: {}
    };
    var client = new Ctor(url);
    conn.client = client;
    client.onopen = function() {
      conn.ready = true;
      var p = conn.pending;
      conn.pending = [];
      for (var i = 0; i < p.length; i++) {
        try {
          p[i]();
        } catch (e) {}
      }
    };
    // Connection-level teardown: EOF every live stream and fail queued connects.
    var teardown = function(errno) {
      conn.ready = false;
      var ids = Object.keys(conn.streams);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i] >>> 0;
        try {
          errno ? _wisp_set_error(id, errno) : _wisp_set_eof(id);
        } catch (e) {}
      }
      conn.streams = {};
      var p = conn.pending;
      conn.pending = [];
      for (var j = 0; j < p.length; j++) {
        try {
          p[j](errno || 111);
        } catch (e) {}
      }
    };
    client.onclose = function() {
      teardown(0);
    };
    client.onerror = function() {
      teardown(111);
    };
    WISP.conn = conn;
    return conn;
  },
  doConnect: function(id, ipBe, port) {
    var conn = WISP.ensureConn();
    if (!conn) {
      try {
        _wisp_set_error(id, 111);
      } catch (e) {}
      return;
    }
    // ipBe is network order; on little-endian wasm byte 0 is the first octet.
    var dotted = (ipBe & 255) + "." + ((ipBe >>> 8) & 255) + "." + ((ipBe >>> 16) & 255) + "." + ((ipBe >>> 24) & 255);
    var host = dotted;
    try {
      if (DNS.lookup_addr) {
        var nm = DNS.lookup_addr(dotted);
        if (nm) host = nm;
      }
    } catch (e) {}
    // `failed` is set (with an errno) if the handshake collapsed while this
    // connect was still queued (teardown calls the pending thunk with an arg).
    var go = function(failed) {
      if (failed) {
        try {
          _wisp_set_error(id, failed);
        } catch (e) {}
        return;
      }
      var stream;
      try {
        stream = conn.client.create_stream(host, port & 65535);
      } catch (e) {
        err("[wisp] create_stream failed: " + e);
        try {
          _wisp_set_error(id, 111);
        } catch (e2) {}
        return;
      }
      conn.streams[id] = stream;
      stream.onmessage = function(bytes) {
        var u8 = (bytes instanceof Uint8Array) ? bytes : new Uint8Array(bytes);
        var n = u8.length;
        if (n > 0) {
          // Copy the payload into the wasm heap; _wisp_deliver appends it to the
          // socket's rx buffer (under the File lock) and wakes the poll() futex.
          var ptr = _malloc(n);
          (growMemViews(), HEAPU8).set(u8, ptr >>> 0);
          try {
            _wisp_deliver(id, ptr, n);
          } finally {
            _free(ptr);
          }
        }
      };
      // wisp-js calls onclose(reason) when the server sends CLOSE for this stream.
      stream.onclose = function() {
        if (conn.streams[id]) {
          delete conn.streams[id];
          try {
            _wisp_set_eof(id);
          } catch (e) {}
        }
      };
      // WISP TCP doesn't ack connects; treat the stream as connected once CONNECT
      // is sent (matches the old shim's optimistic OPEN). Necko's poll then sees
      // POLLOUT and proceeds.
      try {
        _wisp_set_connected(id);
      } catch (e) {}
    };
    if (conn.ready) go(); else conn.pending.push(go);
  },
  doSend: function(id, ptr, len) {
    var conn = WISP.conn;
    if (!conn) return;
    var stream = conn.streams[id];
    if (!stream) return;
    // Copy out of the heap: wisp-js may buffer the reference (per-stream flow
    // control) and send it after this sync-proxied call returns, by which point
    // the heap view is no longer valid.
    stream.send((growMemViews(), HEAPU8).slice(ptr, ptr + len));
  },
  doClose: function(id) {
    var conn = WISP.conn;
    if (!conn) return;
    var stream = conn.streams[id];
    if (!stream) return;
    delete conn.streams[id];
    try {
      stream.close();
    } catch (e) {}
  }
};

function _wisp_close(id) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 0, 1, id);
  WISP.doClose(id >>> 0);
}

function _wisp_connect(id, ipBe, port) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 0, 1, id, ipBe, port);
  WISP.doConnect(id >>> 0, ipBe >>> 0, port >>> 0);
}

function _wisp_open(id) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 0, 1, id);
  WISP.ensureConn();
}

function _wisp_send(id, ptr, len) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(30, 0, 1, id, ptr, len);
  WISP.doSend(id >>> 0, ptr, len);
}

var MEMFS = {
  createBackend(opts) {
    return _wasmfs_create_memory_backend();
  }
};

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var withStackSave = f => {
  var stack = stackSave();
  var ret = f();
  stackRestore(stack);
  return ret;
};

var FS_mknod = (path, mode, dev) => FS.handleError(withStackSave(() => {
  var pathBuffer = stringToUTF8OnStack(path);
  return __wasmfs_mknod(pathBuffer, mode, dev);
}));

var FS_create = (path, mode = 438) => {
  mode &= 4095;
  mode |= 32768;
  return FS_mknod(path, mode, 0);
};

var FS_fileDataToTypedArray = data => {
  if (typeof data == "string") {
    data = intArrayFromString(data, true);
  }
  if (!data.subarray) {
    data = new Uint8Array(data);
  }
  return data;
};

var FS_writeFile = (path, data) => {
  var sp = stackSave();
  var pathBuffer = stringToUTF8OnStack(path);
  data = FS_fileDataToTypedArray(data);
  var len = data.length;
  var dataBuffer = _malloc(len);
  assert(dataBuffer);
  (growMemViews(), HEAPU8).set(data, dataBuffer >>> 0);
  var ret = __wasmfs_write_file(pathBuffer, dataBuffer, len);
  _free(dataBuffer);
  stackRestore(sp);
  return ret;
};

var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
  var pathName = name ? parent + "/" + name : parent;
  var mode = FS_getMode(canRead, canWrite);
  if (!wasmFSPreloadingFlushed) {
    // WasmFS code in the wasm is not ready to be called yet. Cache the
    // files we want to create here in JS, and WasmFS will read them
    // later.
    wasmFSPreloadedFiles.push({
      pathName,
      fileData,
      mode
    });
  } else {
    // WasmFS is already running, so create the file normally.
    FS_create(pathName, mode);
    FS_writeFile(pathName, fileData);
  }
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
  return new Uint8Array(arrayBuffer);
};

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var getUniqueRunDependency = id => {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
};

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      assert(plugin["handle"].constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)");
      return plugin["handle"](byteArray, fullname);
    }
  }
  // If no plugin handled this file then return the original/unmodified
  // byteArray.
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var FS_modeStringToFlags = str => {
  if (typeof str != "string") return str;
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_mkdir = (path, mode = 511) => FS.handleError(withStackSave(() => {
  var buffer = stringToUTF8OnStack(path);
  return __wasmfs_mkdir(buffer, mode);
}));

/**
   * @param {number=} mode Optionally, the mode to create in. Uses mkdir's
   *                       default if not set.
   */ var FS_mkdirTree = (path, mode) => {
  var dirs = path.split("/");
  var d = "";
  for (var dir of dirs) {
    if (!dir) continue;
    if (d || PATH.isAbs(path)) d += "/";
    d += dir;
    try {
      FS_mkdir(d, mode);
    } catch (e) {
      if (e.errno != 20) throw e;
    }
  }
};

var FS_unlink = path => withStackSave(() => {
  var buffer = stringToUTF8OnStack(path);
  return __wasmfs_unlink(buffer);
});

var wasmFS$backends = {};

var wasmFSDevices = {};

var wasmFSDeviceStreams = {};

var FS = {
  ErrnoError: class extends Error {
    name="ErrnoError";
    message="FS error";
    constructor(code) {
      super();
      this.errno = code;
    }
  },
  handleError(returnValue) {
    // Assume errors correspond to negative returnValues
    // since some functions like _wasmfs_open() return positive
    // numbers on success (some callers of this function may need to negate the parameter).
    if (returnValue < 0) {
      throw new FS.ErrnoError(-returnValue);
    }
    return returnValue;
  },
  createDataFile(parent, name, fileData, canRead, canWrite, canOwn) {
    FS_createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
  },
  createPath(parent, path, canRead, canWrite) {
    // Cache file path directory names.
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      if (!wasmFSPreloadingFlushed) {
        wasmFSPreloadedDirs.push({
          parentPath: parent,
          childName: part
        });
      } else {
        try {
          FS.mkdir(current);
        } catch (e) {
          if (e.errno != 20) throw e;
        }
      }
      parent = current;
    }
    return current;
  },
  createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
    return FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish);
  },
  async preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) {
    return FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish);
  },
  readFile(path, opts = {}) {
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error(`Invalid encoding type "${opts.encoding}"`);
    }
    var buf, length;
    // Copy the file into a JS buffer on the heap.
    withStackSave(() => {
      var bufPtr = stackAlloc(4);
      var sizePtr = stackAlloc(4);
      FS.handleError(-__wasmfs_read_file(stringToUTF8OnStack(path), bufPtr, sizePtr));
      buf = (growMemViews(), HEAPU32)[((bufPtr) >>> 2) >>> 0];
      length = readI53FromI64(sizePtr);
    });
    // Default return type is binary.
    // The buffer contents exist 8 bytes after the returned pointer.
    return opts.encoding === "utf8" ? UTF8ToString(buf, length) : (growMemViews(), HEAPU8).slice(buf, buf + length);
  },
  cwd: () => UTF8ToString(__wasmfs_get_cwd()),
  analyzePath(path) {
    // TODO: Consider simplifying this API, which for now matches the JS FS.
    var exists = !!FS.findObject(path);
    return {
      exists,
      object: {
        contents: exists ? FS.readFile(path) : null
      }
    };
  },
  mkdir: (path, mode) => FS_mkdir(path, mode),
  mkdirTree: (path, mode) => FS_mkdirTree(path, mode),
  rmdir: path => FS.handleError(withStackSave(() => __wasmfs_rmdir(stringToUTF8OnStack(path)))),
  open: (path, flags, mode = 438) => withStackSave(() => {
    flags = FS_modeStringToFlags(flags);
    var buffer = stringToUTF8OnStack(path);
    var fd = FS.handleError(__wasmfs_open(buffer, flags, mode));
    return {
      fd
    };
  }),
  create: (path, mode) => FS_create(path, mode),
  close: stream => FS.handleError(-__wasmfs_close(stream.fd)),
  unlink: path => FS_unlink(path),
  chdir: path => withStackSave(() => __wasmfs_chdir(stringToUTF8OnStack(path))),
  read(stream, buffer, offset, length, position) {
    var seeking = typeof position != "undefined";
    var dataBuffer = _malloc(length);
    var bytesRead;
    if (seeking) {
      bytesRead = __wasmfs_pread(stream.fd, dataBuffer, length, BigInt(position));
    } else {
      bytesRead = __wasmfs_read(stream.fd, dataBuffer, length);
    }
    if (bytesRead > 0) {
      buffer.set((growMemViews(), HEAPU8).subarray(dataBuffer >>> 0, dataBuffer + bytesRead >>> 0), offset);
    }
    _free(dataBuffer);
    return FS.handleError(bytesRead);
  },
  write(stream, buffer, offset, length, position, canOwn) {
    var seeking = typeof position != "undefined";
    var dataBuffer = _malloc(length);
    for (var i = 0; i < length; i++) {
      (growMemViews(), HEAP8)[(dataBuffer) + (i) >>> 0] = buffer[offset + i];
    }
    var bytesRead;
    if (seeking) {
      bytesRead = __wasmfs_pwrite(stream.fd, dataBuffer, length, BigInt(position));
    } else {
      bytesRead = __wasmfs_write(stream.fd, dataBuffer, length);
    }
    _free(dataBuffer);
    return FS.handleError(bytesRead);
  },
  writeFile: (path, data) => FS_writeFile(path, data),
  mmap: (stream, length, offset, prot, flags) => {
    var buf = FS.handleError(__wasmfs_mmap(length, prot, flags, stream.fd, BigInt(offset)));
    return {
      ptr: buf,
      allocated: true
    };
  },
  msync: (stream, bufferPtr, offset, length, mmapFlags) => {
    assert(offset === 0);
    // TODO: assert that stream has the fd corresponding to the mapped buffer (bufferPtr).
    return FS.handleError(__wasmfs_msync(bufferPtr, length, mmapFlags));
  },
  munmap: (addr, length) => (FS.handleError(__wasmfs_munmap(addr, length))),
  symlink: (target, linkpath) => withStackSave(() => (__wasmfs_symlink(stringToUTF8OnStack(target), stringToUTF8OnStack(linkpath)))),
  readlink(path) {
    return withStackSave(() => {
      var bufPtr = stackAlloc(4);
      FS.handleError(__wasmfs_readlink(stringToUTF8OnStack(path), bufPtr));
      var readBuffer = (growMemViews(), HEAPU32)[((bufPtr) >>> 2) >>> 0];
      return UTF8ToString(readBuffer);
    });
  },
  statBufToObject(statBuf) {
    // i53/u53 are enough for times and ino in practice.
    return {
      dev: (growMemViews(), HEAPU32)[((statBuf) >>> 2) >>> 0],
      mode: (growMemViews(), HEAPU32)[(((statBuf) + (4)) >>> 2) >>> 0],
      nlink: (growMemViews(), HEAPU32)[(((statBuf) + (8)) >>> 2) >>> 0],
      uid: (growMemViews(), HEAPU32)[(((statBuf) + (12)) >>> 2) >>> 0],
      gid: (growMemViews(), HEAPU32)[(((statBuf) + (16)) >>> 2) >>> 0],
      rdev: (growMemViews(), HEAPU32)[(((statBuf) + (20)) >>> 2) >>> 0],
      size: readI53FromI64((statBuf) + (24)),
      blksize: (growMemViews(), HEAP32)[(((statBuf) + (32)) >>> 2) >>> 0],
      blocks: (growMemViews(), HEAP32)[(((statBuf) + (36)) >>> 2) >>> 0],
      atime: readI53FromI64((statBuf) + (40)),
      mtime: readI53FromI64((statBuf) + (56)),
      ctime: readI53FromI64((statBuf) + (72)),
      ino: readI53FromU64((statBuf) + (88))
    };
  },
  stat(path) {
    return withStackSave(() => {
      var statBuf = stackAlloc(96);
      FS.handleError(__wasmfs_stat(stringToUTF8OnStack(path), statBuf));
      return FS.statBufToObject(statBuf);
    });
  },
  lstat(path) {
    return withStackSave(() => {
      var statBuf = stackAlloc(96);
      FS.handleError(__wasmfs_lstat(stringToUTF8OnStack(path), statBuf));
      return FS.statBufToObject(statBuf);
    });
  },
  chmod(path, mode) {
    return FS.handleError(withStackSave(() => {
      var buffer = stringToUTF8OnStack(path);
      return __wasmfs_chmod(buffer, mode);
    }));
  },
  lchmod(path, mode) {
    return FS.handleError(withStackSave(() => {
      var buffer = stringToUTF8OnStack(path);
      return __wasmfs_lchmod(buffer, mode);
    }));
  },
  fchmod(fd, mode) {
    return FS.handleError(__wasmfs_fchmod(fd, mode));
  },
  utime: (path, atime, mtime) => (FS.handleError(withStackSave(() => (__wasmfs_utime(stringToUTF8OnStack(path), atime, mtime))))),
  truncate(path, len) {
    return FS.handleError(withStackSave(() => (__wasmfs_truncate(stringToUTF8OnStack(path), BigInt(len)))));
  },
  ftruncate(fd, len) {
    return FS.handleError(__wasmfs_ftruncate(fd, BigInt(len)));
  },
  findObject(path) {
    var result = withStackSave(() => __wasmfs_identify(stringToUTF8OnStack(path)));
    if (result == 44) {
      return null;
    }
    return {
      isFolder: result == 31,
      isDevice: false
    };
  },
  readdir: path => withStackSave(() => {
    var pathBuffer = stringToUTF8OnStack(path);
    var entries = [];
    var state = __wasmfs_readdir_start(pathBuffer);
    if (!state) {
      // TODO: The old FS threw an ErrnoError here.
      throw new Error("No such directory");
    }
    var entry;
    while (entry = __wasmfs_readdir_get(state)) {
      entries.push(UTF8ToString(entry));
    }
    __wasmfs_readdir_finish(state);
    return entries;
  }),
  mount: (type, opts, mountpoint) => {
    if (typeof type == "string") {
      // The filesystem was not included, and instead we have an error
      // message stored in the variable.
      throw type;
    }
    var backendPointer = type.createBackend(opts);
    return FS.handleError(withStackSave(() => __wasmfs_mount(stringToUTF8OnStack(mountpoint), backendPointer)));
  },
  unmount: mountpoint => (FS.handleError(withStackSave(() => _wasmfs_unmount(stringToUTF8OnStack(mountpoint))))),
  mknod: (path, mode, dev) => FS_mknod(path, mode, dev),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    var backendPointer = _wasmfs_create_jsimpl_backend();
    var definedOps = {
      userRead: ops.read,
      userWrite: ops.write,
      allocFile: file => {
        wasmFSDeviceStreams[file] = {};
      },
      freeFile: file => {
        wasmFSDeviceStreams[file] = undefined;
      },
      getSize: file => {},
      // Devices cannot be resized.
      setSize: (file, size) => 0,
      read: (file, buffer, length, offset) => {
        var bufferArray = (growMemViews(), HEAP8).subarray(buffer >>> 0, buffer + length >>> 0);
        try {
          var bytesRead = definedOps.userRead(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
        } catch (e) {
          return -e.errno;
        }
        (growMemViews(), HEAP8).set(bufferArray, buffer >>> 0);
        return bytesRead;
      },
      write: (file, buffer, length, offset) => {
        var bufferArray = (growMemViews(), HEAP8).subarray(buffer >>> 0, buffer + length >>> 0);
        try {
          var bytesWritten = definedOps.userWrite(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
        } catch (e) {
          return -e.errno;
        }
        (growMemViews(), HEAP8).set(bufferArray, buffer >>> 0);
        return bytesWritten;
      }
    };
    wasmFS$backends[backendPointer] = definedOps;
    wasmFSDevices[dev] = backendPointer;
  },
  createDevice(parent, name, input, output) {
    if (typeof parent != "string") {
      // The old API allowed parents to be objects, which do not exist in WasmFS.
      throw new Error("Only string paths are accepted");
    }
    var path = PATH.join2(parent, name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device with a set of stream ops to emulate
    // the old API's createDevice().
    FS.registerDevice(dev, {
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  mkdev(path, mode, dev) {
    if (typeof dev === "undefined") {
      dev = mode;
      mode = 438;
    }
    var deviceBackend = wasmFSDevices[dev];
    if (!deviceBackend) {
      throw new Error("Invalid device ID.");
    }
    return FS.handleError(withStackSave(() => (_wasmfs_create_file(stringToUTF8OnStack(path), mode, deviceBackend))));
  },
  rename(oldPath, newPath) {
    return FS.handleError(withStackSave(() => {
      var oldPathBuffer = stringToUTF8OnStack(oldPath);
      var newPathBuffer = stringToUTF8OnStack(newPath);
      return __wasmfs_rename(oldPathBuffer, newPathBuffer);
    }));
  },
  llseek(stream, offset, whence) {
    return FS.handleError(__wasmfs_llseek(stream.fd, BigInt(offset), whence));
  }
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  assert(func, `Cannot call unknown function ${ident}, make sure it is exported`);
  return func;
};

var writeArrayToMemory = (array, buffer) => {
  assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
  (growMemViews(), HEAP8).set(array, buffer >>> 0);
};

/**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */ var ccall = (ident, returnType, argTypes, args, opts) => {
  // For fast lookup of conversion functions
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
        ret = stringToUTF8OnStack(str);
      }
      return ret;
    },
    "array": arr => {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret);
    }
    if (returnType === "pointer") return ret >>> 0;
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== "array", 'return type should not be "array"');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func(...cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }
  ret = onDone(ret);
  return ret;
};

/**
   * @param {string=} returnType
   * @param {Array=} argTypes
   * @param {Object=} opts
   */ var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args, opts);

var removeFunction = index => {
  functionsInTableMap.delete(getWasmTableEntry(index));
  setWasmTableEntry(index, null);
  freeTableIndexes.push(index);
};

var FS_createPath = FS.createPath;

PThread.init();

// Signal GL rendering layer that processing of a new frame is about to
// start. This helps it optimize VBO double-buffering and reduce GPU stalls.
registerPreMainLoop(() => GL.newRenderingFrameStarted());

for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

var miniTempWebGLFloatBuffersStorage = new Float32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
}

var miniTempWebGLIntBuffersStorage = new Int32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
}

registerPreMainLoop(() => {
  // If the current GL context is an OffscreenCanvas, but it was initialized
  // with implicit swap mode, perform the swap on behalf of the user.
  if (GL.currentContext && !GL.currentContextIsProxied && !GL.currentContext.attributes.explicitSwapControl && GL.currentContext.GLctx.commit) {
    GL.currentContext.GLctx.commit();
  }
});

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // With WASM_ESM_INTEGRATION this has to happen at the top level and not
  // delayed until processModuleArgs.
  initMemory();
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  // End ATMODULES hooks
  checkIncomingModuleAPI();
  if (Module["arguments"]) programArgs = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["read"] == "undefined", "Module.read option was removed");
  assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
  assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
  assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
  assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
  assert(typeof Module["ENVIRONMENT"] == "undefined", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
  assert(typeof Module["STACK_SIZE"] == "undefined", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
  consumedModuleProp("preInit");
}

// Begin runtime exports
Module["ENV"] = ENV;

Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

Module["addFunction"] = addFunction;

Module["removeFunction"] = removeFunction;

Module["UTF8ToString"] = UTF8ToString;

Module["FS_preloadFile"] = FS_preloadFile;

Module["FS_unlink"] = FS_unlink;

Module["FS_createPath"] = FS_createPath;

Module["FS"] = FS;

Module["FS_createDataFile"] = FS_createDataFile;

var missingLibrarySymbols = [ "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "convertI32PairToI53", "convertI32PairToI53Checked", "convertU32PairToI53", "getTempRet0", "setTempRet0", "createNamedFunction", "zeroMemory", "strError", "inetNtop4", "inetNtop6", "readSockaddr", "writeSockaddr", "autoResumeAudioContext", "getDynCaller", "dynCall", "asmjsMangle", "mmapAlloc", "addOnInit", "addOnPostCtor", "addOnPreMain", "addOnExit", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "intArrayToString", "AsciiToString", "stringToAscii", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "registerKeyEventCallback", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "convertPCtoSourceLocation", "flush_NO_FILESYSTEM", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "safeSetTimeout", "setImmediateWrapped", "safeRequestAnimationFrame", "clearImmediateWrapped", "registerPostMainLoop", "getPromise", "makePromise", "addPromise", "idsToPromises", "makePromiseCallback", "ExceptionInfo", "findMatchingCatch", "incrementUncaughtExceptionCount", "decrementUncaughtExceptionCount", "Browser_asyncPrepareDataCounter", "arraySum", "addDays", "wasmfsNodeConvertNodeCode", "wasmfsTry", "wasmfsNodeFixStat", "wasmfsNodeLstat", "wasmfsNodeFstat", "writeGLArray", "emscripten_webgl_destroy_context_before_on_calling_thread", "registerWebGlEventCallback", "runAndAbortIfError", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "allocateUTF8", "allocateUTF8OnStack", "demangle", "stackTrace", "getNativeTypeSize" ];

missingLibrarySymbols.forEach(missingLibrarySymbol);

var unexportedSymbols = [ "run", "out", "err", "callMain", "abort", "wasmExports", "writeStackCookie", "checkStackCookie", "writeI53ToI64", "readI53FromI64", "readI53FromU64", "INT53_MAX", "INT53_MIN", "bigintToI53Checked", "HEAP8", "HEAP16", "HEAPU16", "HEAPU32", "HEAPF64", "HEAP64", "HEAPU64", "stackSave", "stackRestore", "stackAlloc", "ptrToString", "exitJS", "getHeapMax", "growMemory", "withStackSave", "ERRNO_CODES", "inetPton4", "inetPton6", "DNS", "Protocols", "Sockets", "timers", "warnOnce", "readEmAsmArgsArray", "readEmAsmArgs", "runEmAsmFunction", "runMainThreadEmAsm", "jstoi_q", "getExecutableName", "handleException", "keepRuntimeAlive", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asyncLoad", "alignMemory", "HandleAllocator", "wasmTable", "wasmMemory", "getUniqueRunDependency", "noExitRuntime", "addOnPreRun", "addOnPostRun", "convertJsFunctionToWasm", "freeTableIndexes", "functionsInTableMap", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "intArrayFromString", "UTF16Decoder", "stringToNewUTF8", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "maybeCStringToJsString", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "setCanvasElementSizeCallingThread", "setOffscreenCanvasSizeOnTargetThread", "setCanvasElementSizeMainThread", "getCanvasSizeCallingThread", "getCanvasSizeMainThread", "jsStackTrace", "getCallstack", "UNWIND_CACHE", "ExitStatus", "getEnvStrings", "checkWasiClock", "initRandomFill", "randomFill", "emSetImmediate", "emClearImmediate_deps", "emClearImmediate", "registerPreMainLoop", "promiseMap", "uncaughtExceptionCount", "exceptionCaught", "Browser", "requestFullscreen", "requestFullScreen", "setCanvasSize", "getUserMedia", "createContext", "getPreloadedImageData__data", "wget", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "ydayFromDate", "preloadPlugins", "FS_createPreloadedFile", "FS_modeStringToFlags", "FS_getMode", "FS_fileDataToTypedArray", "FS_stdin_getChar_buffer", "FS_stdin_getChar", "FS_createDevice", "FS_readFile", "MEMFS", "wasmFSPreloadedFiles", "wasmFSPreloadedDirs", "wasmFSPreloadingFlushed", "wasmFSDevices", "wasmFSDeviceStreams", "FS_mknod", "FS_create", "FS_writeFile", "FS_mkdir", "FS_mkdirTree", "wasmFS$JSMemoryFiles", "wasmFS$backends", "wasmFS$JSMemoryRanges", "wasmfsNodeIsWindows", "wasmfsOPFSDirectoryHandles", "wasmfsOPFSFileHandles", "wasmfsOPFSAccessHandles", "wasmfsOPFSBlobs", "wasmfsOPFSProxyFinish", "wasmfsOPFSGetOrCreateFile", "wasmfsOPFSGetOrCreateDir", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "webgl_enable_EXT_polygon_offset_clamp", "webgl_enable_EXT_clip_control", "webgl_enable_WEBGL_polygon_mode", "GL", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetProgramUniformLocation", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "emscriptenWebGLGetBufferBinding", "emscriptenWebGLValidateMapBufferTarget", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "SDL", "SDL_gfx", "waitAsyncPolyfilled", "emscriptenWebGLGetIndexed", "webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance", "webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance", "print", "printErr", "jstoi_s", "PThread", "terminateWorker", "cleanupThread", "registerTLSInit", "spawnThread", "exitOnMainThread", "proxyToMainThread", "proxiedJSCallArgs", "invokeEntryPoint", "checkMailbox", "WISP", "geckoProv", "whSyncMem", "coopCtx", "wcOff", "wcRT", "wcaOff", "wcaRT" ];

unexportedSymbols.forEach(unexportedRuntimeSymbol);

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, __emscripten_lookup_name, _audiodecoder_create, _audiodecoder_destroy, _audiodecoder_feed, _audiodecoder_flush, _audiodecoder_reset, _emaudio_get_rate, _emaudio_start, _emaudio_stop, getCanvasSizeMainThread, setCanvasElementSizeMainThread, _emscripten_webgl_create_context_proxied, _environ_get, _environ_sizes_get, _gecko_coarse_clock_start, _hostaudio_set_media_time, _hostaudio_set_playing, _hostimg_decode, _hostimg_gpu_decode, _webcodecs_create, _webcodecs_destroy, _webcodecs_feed, _webcodecs_flush, _webcodecs_reset, _wisp_close, _wisp_connect, _wisp_open, _wisp_send ];
if (!ENVIRONMENT_IS_PTHREAD && typeof __geckoCoop != "undefined" && __geckoCoop.active) __geckoCoop.mainReceive = (funcIndex, emAsmAddr, callingThread, args) => {
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  PThread.currentProxiedOperationCallerThread = callingThread;
  try {
    return func(...args);
  } finally {
    PThread.currentProxiedOperationCallerThread = 0;
  }
};

function checkIncomingModuleAPI() {
  ignoredModuleProp("fetchSettings");
  ignoredModuleProp("logReadFiles");
  ignoredModuleProp("loadSplitModule");
  ignoredModuleProp("onMalloc");
  ignoredModuleProp("onRealloc");
  ignoredModuleProp("onFree");
  ignoredModuleProp("onSbrkGrow");
  ignoredModuleProp("onCOSCacheHit");
  ignoredModuleProp("onCOSCacheMiss");
  ignoredModuleProp("onCOSStore");
}

var ASM_CONSTS = {
  110082044: $0 => {
    try {
      var oc = new OffscreenCanvas(300, 150);
      var attrs = {};
      attrs.majorVersion = $0 ? 2 : 1;
      attrs.minorVersion = 0;
      attrs.alpha = true;
      attrs.depth = true;
      attrs.stencil = true;
      attrs.antialias = false;
      attrs.premultipliedAlpha = true;
      attrs.preserveDrawingBuffer = true;
      attrs.failIfMajorPerformanceCaveat = false;
      attrs.enableExtensionsByDefault = true;
      var glctx = oc.getContext($0 ? "webgl2" : "webgl", attrs);
      if (!glctx) return 0;
      return GL.registerContext(glctx, attrs);
    } catch (e) {
      return 0;
    }
  },
  110082555: ($0, $1) => {
    var id = $1 * 4294967296 + ($0 >>> 0);
    var m = globalThis.geckoHostImgTex;
    if (!m) {
      return;
    }
    var e = m.get(id);
    if (!e) {
      return;
    }
    try {
      if (typeof GL !== "undefined" && GL.textures && e.tex) {
        var t = GL.textures[e.tex];
        if (t && typeof GLctx !== "undefined") {
          GLctx.deleteTexture(t);
        }
        GL.textures[e.tex] = null;
      }
    } catch (_) {}
    m.delete(id);
  },
  110082909: ($0, $1) => {
    var id = $1 * 4294967296 + ($0 >>> 0);
    var m = globalThis.geckoHostImgTex;
    var e = m ? m.get(id) : null;
    return (e && e.ready) ? e.tex : 0;
  },
  110083053: $0 => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(UTF8ToString($0));
      }
    } catch (e) {}
  },
  110083189: () => (typeof wasmOffsetConverter !== "undefined")
};

function WasmInvoke(fp, thisPtr, argbuf, sigPtr, nparams) {
  var sig = UTF8ToString(sigPtr);
  var f = wasmTable.get(fp);
  var args = new Array(nparams + 1);
  args[0] = thisPtr;
  for (var i = 0; i < nparams; i++) {
    var c = sig.charAt(2 + i);
    var off = argbuf + i * 8;
    if (c == "d") {
      args[i + 1] = (growMemViews(), HEAPF64)[off >>> 3];
    } else if (c == "f") {
      args[i + 1] = (growMemViews(), HEAPF32)[off >>> 2];
    } else if (c == "j") {
      args[i + 1] = (growMemViews(), HEAP64)[off >>> 3];
    } else {
      args[i + 1] = (growMemViews(), HEAP32)[off >>> 2];
    }
  }
  return f.apply(null, args);
}

function WasmAddStub(methodIndex, sigPtr) {
  var sig = UTF8ToString(sigPtr);
  var fn = function() {
    var nargs = arguments.length - 1;
    var thisPtr = arguments[0];
    var buf = _malloc(nargs * 8);
    for (var i = 0; i < nargs; i++) {
      var c = sig.charAt(2 + i);
      var v = arguments[1 + i];
      var off = buf + i * 8;
      if (c == "d") {
        (growMemViews(), HEAPF64)[off >>> 3] = v;
      } else if (c == "f") {
        (growMemViews(), HEAPF32)[off >>> 2] = v;
      } else if (c == "j") {
        (growMemViews(), HEAP64)[off >>> 3] = BigInt(v);
      } else {
        (growMemViews(), HEAP32)[off >>> 2] = v;
        (growMemViews(), HEAP32)[(off >> 2) + 1 >>> 0] = 0;
      }
    }
    var ret = _WasmXPTCStubDispatch(thisPtr, methodIndex, buf, nargs);
    _free(buf);
    return ret;
  };
  return addFunction(fn, sig);
}

function HaveOffsetConverter() {
  return typeof wasmOffsetConverter !== "undefined";
}

// Imports from the Wasm binary.
var _gecko_coarse_now_ptr = Module["_gecko_coarse_now_ptr"] = makeInvalidEarlyAccess("_gecko_coarse_now_ptr");

var _xul_cmd_ptr = Module["_xul_cmd_ptr"] = makeInvalidEarlyAccess("_xul_cmd_ptr");

var _fflush = makeInvalidEarlyAccess("_fflush");

var _calloc = makeInvalidEarlyAccess("_calloc");

var _xul_init = Module["_xul_init"] = makeInvalidEarlyAccess("_xul_init");

var _free = Module["_free"] = makeInvalidEarlyAccess("_free");

var _main = Module["_main"] = makeInvalidEarlyAccess("_main");

var _wasmfs_create_provider_backend = Module["_wasmfs_create_provider_backend"] = makeInvalidEarlyAccess("_wasmfs_create_provider_backend");

var _malloc = Module["_malloc"] = makeInvalidEarlyAccess("_malloc");

var _realloc = makeInvalidEarlyAccess("_realloc");

var _ntohs = makeInvalidEarlyAccess("_ntohs");

var _htons = makeInvalidEarlyAccess("_htons");

var _htonl = makeInvalidEarlyAccess("_htonl");

var _wisp_wakeword = Module["_wisp_wakeword"] = makeInvalidEarlyAccess("_wisp_wakeword");

var __ZdlPv = Module["__ZdlPv"] = makeInvalidEarlyAccess("__ZdlPv");

var _WasmXPTCStubDispatch = Module["_WasmXPTCStubDispatch"] = makeInvalidEarlyAccess("_WasmXPTCStubDispatch");

var _pthread_self = makeInvalidEarlyAccess("_pthread_self");

var __Znwm = Module["__Znwm"] = makeInvalidEarlyAccess("__Znwm");

var _hostimg_renderer_tid = Module["_hostimg_renderer_tid"] = makeInvalidEarlyAccess("_hostimg_renderer_tid");

var __ZdaPv = Module["__ZdaPv"] = makeInvalidEarlyAccess("__ZdaPv");

var __Znam = Module["__Znam"] = makeInvalidEarlyAccess("__Znam");

var _WJTraceRoots = Module["_WJTraceRoots"] = makeInvalidEarlyAccess("_WJTraceRoots");

var _emscripten_stack_get_base = makeInvalidEarlyAccess("_emscripten_stack_get_base");

var _WJTraceDumpNow = Module["_WJTraceDumpNow"] = makeInvalidEarlyAccess("_WJTraceDumpNow");

var _WJDumpCrashState = Module["_WJDumpCrashState"] = makeInvalidEarlyAccess("_WJDumpCrashState");

var _wjhelp = Module["_wjhelp"] = makeInvalidEarlyAccess("_wjhelp");

var _wasmjit_invoke = Module["_wasmjit_invoke"] = makeInvalidEarlyAccess("_wasmjit_invoke");

var _InterpTraceRoots = Module["_InterpTraceRoots"] = makeInvalidEarlyAccess("_InterpTraceRoots");

var _b_help = Module["_b_help"] = makeInvalidEarlyAccess("_b_help");

var _wasmhost_invoke_import = Module["_wasmhost_invoke_import"] = makeInvalidEarlyAccess("_wasmhost_invoke_import");

var _malloc_usable_size = Module["_malloc_usable_size"] = makeInvalidEarlyAccess("_malloc_usable_size");

var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = makeInvalidEarlyAccess("_emscripten_builtin_free");

var __emscripten_tls_init = makeInvalidEarlyAccess("__emscripten_tls_init");

var _emscripten_builtin_memalign = makeInvalidEarlyAccess("_emscripten_builtin_memalign");

var __emscripten_proxy_main = Module["__emscripten_proxy_main"] = makeInvalidEarlyAccess("__emscripten_proxy_main");

var _emscripten_stack_get_end = makeInvalidEarlyAccess("_emscripten_stack_get_end");

var __emscripten_set_offscreencanvas_size_on_thread = makeInvalidEarlyAccess("__emscripten_set_offscreencanvas_size_on_thread");

var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = makeInvalidEarlyAccess("_emscripten_builtin_malloc");

var ___libc_free = Module["___libc_free"] = makeInvalidEarlyAccess("___libc_free");

var ___libc_malloc = Module["___libc_malloc"] = makeInvalidEarlyAccess("___libc_malloc");

var __emscripten_thread_init = makeInvalidEarlyAccess("__emscripten_thread_init");

var ___set_thread_state = makeInvalidEarlyAccess("___set_thread_state");

var __emscripten_thread_crashed = makeInvalidEarlyAccess("__emscripten_thread_crashed");

var _emscripten_proxy_execute_queue = makeInvalidEarlyAccess("_emscripten_proxy_execute_queue");

var _emscripten_proxy_finish = makeInvalidEarlyAccess("_emscripten_proxy_finish");

var __emscripten_run_js_on_main_thread_done = makeInvalidEarlyAccess("__emscripten_run_js_on_main_thread_done");

var __emscripten_run_js_on_main_thread = makeInvalidEarlyAccess("__emscripten_run_js_on_main_thread");

var __emscripten_thread_free_data = makeInvalidEarlyAccess("__emscripten_thread_free_data");

var __emscripten_thread_exit = makeInvalidEarlyAccess("__emscripten_thread_exit");

var __emscripten_check_mailbox = makeInvalidEarlyAccess("__emscripten_check_mailbox");

var __ZdaPvm = Module["__ZdaPvm"] = makeInvalidEarlyAccess("__ZdaPvm");

var __ZdlPvm = Module["__ZdlPvm"] = makeInvalidEarlyAccess("__ZdlPvm");

var __ZnamSt11align_val_t = Module["__ZnamSt11align_val_t"] = makeInvalidEarlyAccess("__ZnamSt11align_val_t");

var __ZnwmSt11align_val_t = Module["__ZnwmSt11align_val_t"] = makeInvalidEarlyAccess("__ZnwmSt11align_val_t");

var ___libc_calloc = Module["___libc_calloc"] = makeInvalidEarlyAccess("___libc_calloc");

var ___libc_realloc = Module["___libc_realloc"] = makeInvalidEarlyAccess("___libc_realloc");

var _emscripten_builtin_calloc = Module["_emscripten_builtin_calloc"] = makeInvalidEarlyAccess("_emscripten_builtin_calloc");

var _emscripten_builtin_realloc = Module["_emscripten_builtin_realloc"] = makeInvalidEarlyAccess("_emscripten_builtin_realloc");

var _malloc_size = Module["_malloc_size"] = makeInvalidEarlyAccess("_malloc_size");

var _reallocf = Module["_reallocf"] = makeInvalidEarlyAccess("_reallocf");

var _emscripten_stack_init = makeInvalidEarlyAccess("_emscripten_stack_init");

var _emscripten_stack_set_limits = makeInvalidEarlyAccess("_emscripten_stack_set_limits");

var _emscripten_stack_get_free = makeInvalidEarlyAccess("_emscripten_stack_get_free");

var __emscripten_stack_restore = makeInvalidEarlyAccess("__emscripten_stack_restore");

var __emscripten_stack_alloc = makeInvalidEarlyAccess("__emscripten_stack_alloc");

var _emscripten_stack_get_current = makeInvalidEarlyAccess("_emscripten_stack_get_current");

var __wasmfs_read_file = makeInvalidEarlyAccess("__wasmfs_read_file");

var __wasmfs_write_file = makeInvalidEarlyAccess("__wasmfs_write_file");

var __wasmfs_mkdir = makeInvalidEarlyAccess("__wasmfs_mkdir");

var __wasmfs_rmdir = makeInvalidEarlyAccess("__wasmfs_rmdir");

var __wasmfs_open = makeInvalidEarlyAccess("__wasmfs_open");

var __wasmfs_mknod = makeInvalidEarlyAccess("__wasmfs_mknod");

var __wasmfs_unlink = makeInvalidEarlyAccess("__wasmfs_unlink");

var __wasmfs_chdir = makeInvalidEarlyAccess("__wasmfs_chdir");

var __wasmfs_symlink = makeInvalidEarlyAccess("__wasmfs_symlink");

var __wasmfs_readlink = makeInvalidEarlyAccess("__wasmfs_readlink");

var __wasmfs_write = makeInvalidEarlyAccess("__wasmfs_write");

var __wasmfs_pwrite = makeInvalidEarlyAccess("__wasmfs_pwrite");

var __wasmfs_chmod = makeInvalidEarlyAccess("__wasmfs_chmod");

var __wasmfs_fchmod = makeInvalidEarlyAccess("__wasmfs_fchmod");

var __wasmfs_lchmod = makeInvalidEarlyAccess("__wasmfs_lchmod");

var __wasmfs_llseek = makeInvalidEarlyAccess("__wasmfs_llseek");

var __wasmfs_rename = makeInvalidEarlyAccess("__wasmfs_rename");

var __wasmfs_read = makeInvalidEarlyAccess("__wasmfs_read");

var __wasmfs_pread = makeInvalidEarlyAccess("__wasmfs_pread");

var __wasmfs_truncate = makeInvalidEarlyAccess("__wasmfs_truncate");

var __wasmfs_ftruncate = makeInvalidEarlyAccess("__wasmfs_ftruncate");

var __wasmfs_close = makeInvalidEarlyAccess("__wasmfs_close");

var __wasmfs_mmap = makeInvalidEarlyAccess("__wasmfs_mmap");

var __wasmfs_msync = makeInvalidEarlyAccess("__wasmfs_msync");

var __wasmfs_munmap = makeInvalidEarlyAccess("__wasmfs_munmap");

var __wasmfs_utime = makeInvalidEarlyAccess("__wasmfs_utime");

var __wasmfs_stat = makeInvalidEarlyAccess("__wasmfs_stat");

var __wasmfs_lstat = makeInvalidEarlyAccess("__wasmfs_lstat");

var __wasmfs_mount = makeInvalidEarlyAccess("__wasmfs_mount");

var __wasmfs_identify = makeInvalidEarlyAccess("__wasmfs_identify");

var __wasmfs_readdir_start = makeInvalidEarlyAccess("__wasmfs_readdir_start");

var __wasmfs_readdir_get = makeInvalidEarlyAccess("__wasmfs_readdir_get");

var __wasmfs_readdir_finish = makeInvalidEarlyAccess("__wasmfs_readdir_finish");

var __wasmfs_get_cwd = makeInvalidEarlyAccess("__wasmfs_get_cwd");

var _wasmfs_create_jsimpl_backend = makeInvalidEarlyAccess("_wasmfs_create_jsimpl_backend");

var _wasmfs_create_memory_backend = makeInvalidEarlyAccess("_wasmfs_create_memory_backend");

var __wasmfs_opfs_record_entry = makeInvalidEarlyAccess("__wasmfs_opfs_record_entry");

var _wisp_deliver = Module["_wisp_deliver"] = makeInvalidEarlyAccess("_wisp_deliver");

var _wisp_set_connected = Module["_wisp_set_connected"] = makeInvalidEarlyAccess("_wisp_set_connected");

var _wisp_set_eof = Module["_wisp_set_eof"] = makeInvalidEarlyAccess("_wisp_set_eof");

var _wisp_set_error = Module["_wisp_set_error"] = makeInvalidEarlyAccess("_wisp_set_error");

var _provider_record_entry = Module["_provider_record_entry"] = makeInvalidEarlyAccess("_provider_record_entry");

var _wasmfs_create_file = makeInvalidEarlyAccess("_wasmfs_create_file");

var _wasmfs_unmount = makeInvalidEarlyAccess("_wasmfs_unmount");

var _wasmfs_flush = makeInvalidEarlyAccess("_wasmfs_flush");

var __indirect_function_table = makeInvalidEarlyAccess("__indirect_function_table");

var _gNoteToolkitBuildID = Module["_gNoteToolkitBuildID"] = makeInvalidEarlyAccess("_gNoteToolkitBuildID");

var wasmTable = makeInvalidEarlyAccess("wasmTable");

function assignWasmExports(wasmExports) {
  assert(typeof wasmExports["gecko_coarse_now_ptr"] != "undefined", "missing Wasm export: gecko_coarse_now_ptr");
  assert(typeof wasmExports["xul_cmd_ptr"] != "undefined", "missing Wasm export: xul_cmd_ptr");
  assert(typeof wasmExports["fflush"] != "undefined", "missing Wasm export: fflush");
  assert(typeof wasmExports["calloc"] != "undefined", "missing Wasm export: calloc");
  assert(typeof wasmExports["xul_init"] != "undefined", "missing Wasm export: xul_init");
  assert(typeof wasmExports["free"] != "undefined", "missing Wasm export: free");
  assert(typeof wasmExports["main"] != "undefined", "missing Wasm export: main");
  assert(typeof wasmExports["wasmfs_create_provider_backend"] != "undefined", "missing Wasm export: wasmfs_create_provider_backend");
  assert(typeof wasmExports["malloc"] != "undefined", "missing Wasm export: malloc");
  assert(typeof wasmExports["realloc"] != "undefined", "missing Wasm export: realloc");
  assert(typeof wasmExports["ntohs"] != "undefined", "missing Wasm export: ntohs");
  assert(typeof wasmExports["htons"] != "undefined", "missing Wasm export: htons");
  assert(typeof wasmExports["htonl"] != "undefined", "missing Wasm export: htonl");
  assert(typeof wasmExports["wisp_wakeword"] != "undefined", "missing Wasm export: wisp_wakeword");
  assert(typeof wasmExports["_ZdlPv"] != "undefined", "missing Wasm export: _ZdlPv");
  assert(typeof wasmExports["WasmXPTCStubDispatch"] != "undefined", "missing Wasm export: WasmXPTCStubDispatch");
  assert(typeof wasmExports["pthread_self"] != "undefined", "missing Wasm export: pthread_self");
  assert(typeof wasmExports["_Znwm"] != "undefined", "missing Wasm export: _Znwm");
  assert(typeof wasmExports["hostimg_renderer_tid"] != "undefined", "missing Wasm export: hostimg_renderer_tid");
  assert(typeof wasmExports["_ZdaPv"] != "undefined", "missing Wasm export: _ZdaPv");
  assert(typeof wasmExports["_Znam"] != "undefined", "missing Wasm export: _Znam");
  assert(typeof wasmExports["WJTraceRoots"] != "undefined", "missing Wasm export: WJTraceRoots");
  assert(typeof wasmExports["emscripten_stack_get_base"] != "undefined", "missing Wasm export: emscripten_stack_get_base");
  assert(typeof wasmExports["WJTraceDumpNow"] != "undefined", "missing Wasm export: WJTraceDumpNow");
  assert(typeof wasmExports["WJDumpCrashState"] != "undefined", "missing Wasm export: WJDumpCrashState");
  assert(typeof wasmExports["wjhelp"] != "undefined", "missing Wasm export: wjhelp");
  assert(typeof wasmExports["wasmjit_invoke"] != "undefined", "missing Wasm export: wasmjit_invoke");
  assert(typeof wasmExports["InterpTraceRoots"] != "undefined", "missing Wasm export: InterpTraceRoots");
  assert(typeof wasmExports["b_help"] != "undefined", "missing Wasm export: b_help");
  assert(typeof wasmExports["wasmhost_invoke_import"] != "undefined", "missing Wasm export: wasmhost_invoke_import");
  assert(typeof wasmExports["malloc_usable_size"] != "undefined", "missing Wasm export: malloc_usable_size");
  assert(typeof wasmExports["emscripten_builtin_free"] != "undefined", "missing Wasm export: emscripten_builtin_free");
  assert(typeof wasmExports["_emscripten_tls_init"] != "undefined", "missing Wasm export: _emscripten_tls_init");
  assert(typeof wasmExports["emscripten_builtin_memalign"] != "undefined", "missing Wasm export: emscripten_builtin_memalign");
  assert(typeof wasmExports["_emscripten_proxy_main"] != "undefined", "missing Wasm export: _emscripten_proxy_main");
  assert(typeof wasmExports["emscripten_stack_get_end"] != "undefined", "missing Wasm export: emscripten_stack_get_end");
  assert(typeof wasmExports["_emscripten_set_offscreencanvas_size_on_thread"] != "undefined", "missing Wasm export: _emscripten_set_offscreencanvas_size_on_thread");
  assert(typeof wasmExports["emscripten_builtin_malloc"] != "undefined", "missing Wasm export: emscripten_builtin_malloc");
  assert(typeof wasmExports["__libc_free"] != "undefined", "missing Wasm export: __libc_free");
  assert(typeof wasmExports["__libc_malloc"] != "undefined", "missing Wasm export: __libc_malloc");
  assert(typeof wasmExports["_emscripten_thread_init"] != "undefined", "missing Wasm export: _emscripten_thread_init");
  assert(typeof wasmExports["__set_thread_state"] != "undefined", "missing Wasm export: __set_thread_state");
  assert(typeof wasmExports["_emscripten_thread_crashed"] != "undefined", "missing Wasm export: _emscripten_thread_crashed");
  assert(typeof wasmExports["emscripten_proxy_execute_queue"] != "undefined", "missing Wasm export: emscripten_proxy_execute_queue");
  assert(typeof wasmExports["emscripten_proxy_finish"] != "undefined", "missing Wasm export: emscripten_proxy_finish");
  assert(typeof wasmExports["_emscripten_run_js_on_main_thread_done"] != "undefined", "missing Wasm export: _emscripten_run_js_on_main_thread_done");
  assert(typeof wasmExports["_emscripten_run_js_on_main_thread"] != "undefined", "missing Wasm export: _emscripten_run_js_on_main_thread");
  assert(typeof wasmExports["_emscripten_thread_free_data"] != "undefined", "missing Wasm export: _emscripten_thread_free_data");
  assert(typeof wasmExports["_emscripten_thread_exit"] != "undefined", "missing Wasm export: _emscripten_thread_exit");
  assert(typeof wasmExports["_emscripten_check_mailbox"] != "undefined", "missing Wasm export: _emscripten_check_mailbox");
  assert(typeof wasmExports["_ZdaPvm"] != "undefined", "missing Wasm export: _ZdaPvm");
  assert(typeof wasmExports["_ZdlPvm"] != "undefined", "missing Wasm export: _ZdlPvm");
  assert(typeof wasmExports["_ZnamSt11align_val_t"] != "undefined", "missing Wasm export: _ZnamSt11align_val_t");
  assert(typeof wasmExports["_ZnwmSt11align_val_t"] != "undefined", "missing Wasm export: _ZnwmSt11align_val_t");
  assert(typeof wasmExports["__libc_calloc"] != "undefined", "missing Wasm export: __libc_calloc");
  assert(typeof wasmExports["__libc_realloc"] != "undefined", "missing Wasm export: __libc_realloc");
  assert(typeof wasmExports["emscripten_builtin_calloc"] != "undefined", "missing Wasm export: emscripten_builtin_calloc");
  assert(typeof wasmExports["emscripten_builtin_realloc"] != "undefined", "missing Wasm export: emscripten_builtin_realloc");
  assert(typeof wasmExports["malloc_size"] != "undefined", "missing Wasm export: malloc_size");
  assert(typeof wasmExports["reallocf"] != "undefined", "missing Wasm export: reallocf");
  assert(typeof wasmExports["emscripten_stack_init"] != "undefined", "missing Wasm export: emscripten_stack_init");
  assert(typeof wasmExports["emscripten_stack_set_limits"] != "undefined", "missing Wasm export: emscripten_stack_set_limits");
  assert(typeof wasmExports["emscripten_stack_get_free"] != "undefined", "missing Wasm export: emscripten_stack_get_free");
  assert(typeof wasmExports["_emscripten_stack_restore"] != "undefined", "missing Wasm export: _emscripten_stack_restore");
  assert(typeof wasmExports["_emscripten_stack_alloc"] != "undefined", "missing Wasm export: _emscripten_stack_alloc");
  assert(typeof wasmExports["emscripten_stack_get_current"] != "undefined", "missing Wasm export: emscripten_stack_get_current");
  assert(typeof wasmExports["_wasmfs_read_file"] != "undefined", "missing Wasm export: _wasmfs_read_file");
  assert(typeof wasmExports["_wasmfs_write_file"] != "undefined", "missing Wasm export: _wasmfs_write_file");
  assert(typeof wasmExports["_wasmfs_mkdir"] != "undefined", "missing Wasm export: _wasmfs_mkdir");
  assert(typeof wasmExports["_wasmfs_rmdir"] != "undefined", "missing Wasm export: _wasmfs_rmdir");
  assert(typeof wasmExports["_wasmfs_open"] != "undefined", "missing Wasm export: _wasmfs_open");
  assert(typeof wasmExports["_wasmfs_mknod"] != "undefined", "missing Wasm export: _wasmfs_mknod");
  assert(typeof wasmExports["_wasmfs_unlink"] != "undefined", "missing Wasm export: _wasmfs_unlink");
  assert(typeof wasmExports["_wasmfs_chdir"] != "undefined", "missing Wasm export: _wasmfs_chdir");
  assert(typeof wasmExports["_wasmfs_symlink"] != "undefined", "missing Wasm export: _wasmfs_symlink");
  assert(typeof wasmExports["_wasmfs_readlink"] != "undefined", "missing Wasm export: _wasmfs_readlink");
  assert(typeof wasmExports["_wasmfs_write"] != "undefined", "missing Wasm export: _wasmfs_write");
  assert(typeof wasmExports["_wasmfs_pwrite"] != "undefined", "missing Wasm export: _wasmfs_pwrite");
  assert(typeof wasmExports["_wasmfs_chmod"] != "undefined", "missing Wasm export: _wasmfs_chmod");
  assert(typeof wasmExports["_wasmfs_fchmod"] != "undefined", "missing Wasm export: _wasmfs_fchmod");
  assert(typeof wasmExports["_wasmfs_lchmod"] != "undefined", "missing Wasm export: _wasmfs_lchmod");
  assert(typeof wasmExports["_wasmfs_llseek"] != "undefined", "missing Wasm export: _wasmfs_llseek");
  assert(typeof wasmExports["_wasmfs_rename"] != "undefined", "missing Wasm export: _wasmfs_rename");
  assert(typeof wasmExports["_wasmfs_read"] != "undefined", "missing Wasm export: _wasmfs_read");
  assert(typeof wasmExports["_wasmfs_pread"] != "undefined", "missing Wasm export: _wasmfs_pread");
  assert(typeof wasmExports["_wasmfs_truncate"] != "undefined", "missing Wasm export: _wasmfs_truncate");
  assert(typeof wasmExports["_wasmfs_ftruncate"] != "undefined", "missing Wasm export: _wasmfs_ftruncate");
  assert(typeof wasmExports["_wasmfs_close"] != "undefined", "missing Wasm export: _wasmfs_close");
  assert(typeof wasmExports["_wasmfs_mmap"] != "undefined", "missing Wasm export: _wasmfs_mmap");
  assert(typeof wasmExports["_wasmfs_msync"] != "undefined", "missing Wasm export: _wasmfs_msync");
  assert(typeof wasmExports["_wasmfs_munmap"] != "undefined", "missing Wasm export: _wasmfs_munmap");
  assert(typeof wasmExports["_wasmfs_utime"] != "undefined", "missing Wasm export: _wasmfs_utime");
  assert(typeof wasmExports["_wasmfs_stat"] != "undefined", "missing Wasm export: _wasmfs_stat");
  assert(typeof wasmExports["_wasmfs_lstat"] != "undefined", "missing Wasm export: _wasmfs_lstat");
  assert(typeof wasmExports["_wasmfs_mount"] != "undefined", "missing Wasm export: _wasmfs_mount");
  assert(typeof wasmExports["_wasmfs_identify"] != "undefined", "missing Wasm export: _wasmfs_identify");
  assert(typeof wasmExports["_wasmfs_readdir_start"] != "undefined", "missing Wasm export: _wasmfs_readdir_start");
  assert(typeof wasmExports["_wasmfs_readdir_get"] != "undefined", "missing Wasm export: _wasmfs_readdir_get");
  assert(typeof wasmExports["_wasmfs_readdir_finish"] != "undefined", "missing Wasm export: _wasmfs_readdir_finish");
  assert(typeof wasmExports["_wasmfs_get_cwd"] != "undefined", "missing Wasm export: _wasmfs_get_cwd");
  assert(typeof wasmExports["wasmfs_create_jsimpl_backend"] != "undefined", "missing Wasm export: wasmfs_create_jsimpl_backend");
  assert(typeof wasmExports["wasmfs_create_memory_backend"] != "undefined", "missing Wasm export: wasmfs_create_memory_backend");
  assert(typeof wasmExports["_wasmfs_opfs_record_entry"] != "undefined", "missing Wasm export: _wasmfs_opfs_record_entry");
  assert(typeof wasmExports["wisp_deliver"] != "undefined", "missing Wasm export: wisp_deliver");
  assert(typeof wasmExports["wisp_set_connected"] != "undefined", "missing Wasm export: wisp_set_connected");
  assert(typeof wasmExports["wisp_set_eof"] != "undefined", "missing Wasm export: wisp_set_eof");
  assert(typeof wasmExports["wisp_set_error"] != "undefined", "missing Wasm export: wisp_set_error");
  assert(typeof wasmExports["provider_record_entry"] != "undefined", "missing Wasm export: provider_record_entry");
  assert(typeof wasmExports["wasmfs_create_file"] != "undefined", "missing Wasm export: wasmfs_create_file");
  assert(typeof wasmExports["wasmfs_unmount"] != "undefined", "missing Wasm export: wasmfs_unmount");
  assert(typeof wasmExports["wasmfs_flush"] != "undefined", "missing Wasm export: wasmfs_flush");
  assert(typeof wasmExports["__indirect_function_table"] != "undefined", "missing Wasm export: __indirect_function_table");
  assert(typeof wasmExports["gNoteToolkitBuildID"] != "undefined", "missing Wasm export: gNoteToolkitBuildID");
  _gecko_coarse_now_ptr = Module["_gecko_coarse_now_ptr"] = createExportWrapper("gecko_coarse_now_ptr", 0);
  _xul_cmd_ptr = Module["_xul_cmd_ptr"] = createExportWrapper("xul_cmd_ptr", 0);
  _fflush = createExportWrapper("fflush", 1);
  _calloc = createExportWrapper("calloc", 2);
  _xul_init = Module["_xul_init"] = createExportWrapper("xul_init", 1);
  _free = Module["_free"] = createExportWrapper("free", 1);
  _main = Module["_main"] = createExportWrapper("main", 2);
  _wasmfs_create_provider_backend = Module["_wasmfs_create_provider_backend"] = createExportWrapper("wasmfs_create_provider_backend", 1);
  _malloc = Module["_malloc"] = createExportWrapper("malloc", 1);
  _realloc = createExportWrapper("realloc", 2);
  _ntohs = createExportWrapper("ntohs", 1);
  _htons = createExportWrapper("htons", 1);
  _htonl = createExportWrapper("htonl", 1);
  _wisp_wakeword = Module["_wisp_wakeword"] = createExportWrapper("wisp_wakeword", 0);
  __ZdlPv = Module["__ZdlPv"] = createExportWrapper("_ZdlPv", 1);
  _WasmXPTCStubDispatch = Module["_WasmXPTCStubDispatch"] = createExportWrapper("WasmXPTCStubDispatch", 4);
  _pthread_self = wasmExports["pthread_self"];
  __Znwm = Module["__Znwm"] = createExportWrapper("_Znwm", 1);
  _hostimg_renderer_tid = Module["_hostimg_renderer_tid"] = createExportWrapper("hostimg_renderer_tid", 0);
  __ZdaPv = Module["__ZdaPv"] = createExportWrapper("_ZdaPv", 1);
  __Znam = Module["__Znam"] = createExportWrapper("_Znam", 1);
  _WJTraceRoots = Module["_WJTraceRoots"] = createExportWrapper("WJTraceRoots", 2);
  _emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"];
  _WJTraceDumpNow = Module["_WJTraceDumpNow"] = createExportWrapper("WJTraceDumpNow", 0);
  _WJDumpCrashState = Module["_WJDumpCrashState"] = createExportWrapper("WJDumpCrashState", 0);
  _wjhelp = Module["_wjhelp"] = createExportWrapper("wjhelp", 2);
  _wasmjit_invoke = Module["_wasmjit_invoke"] = createExportWrapper("wasmjit_invoke", 2);
  _InterpTraceRoots = Module["_InterpTraceRoots"] = createExportWrapper("InterpTraceRoots", 2);
  _b_help = Module["_b_help"] = createExportWrapper("b_help", 4);
  _wasmhost_invoke_import = Module["_wasmhost_invoke_import"] = createExportWrapper("wasmhost_invoke_import", 3);
  _malloc_usable_size = Module["_malloc_usable_size"] = createExportWrapper("malloc_usable_size", 1);
  _emscripten_builtin_free = Module["_emscripten_builtin_free"] = createExportWrapper("emscripten_builtin_free", 1);
  __emscripten_tls_init = createExportWrapper("_emscripten_tls_init", 0);
  _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign", 2);
  __emscripten_proxy_main = Module["__emscripten_proxy_main"] = createExportWrapper("_emscripten_proxy_main", 2);
  _emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"];
  __emscripten_set_offscreencanvas_size_on_thread = createExportWrapper("_emscripten_set_offscreencanvas_size_on_thread", 4);
  _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = createExportWrapper("emscripten_builtin_malloc", 1);
  ___libc_free = Module["___libc_free"] = createExportWrapper("__libc_free", 1);
  ___libc_malloc = Module["___libc_malloc"] = createExportWrapper("__libc_malloc", 1);
  __emscripten_thread_init = createExportWrapper("_emscripten_thread_init", 6);
  ___set_thread_state = createExportWrapper("__set_thread_state", 4);
  __emscripten_thread_crashed = createExportWrapper("_emscripten_thread_crashed", 0);
  _emscripten_proxy_execute_queue = createExportWrapper("emscripten_proxy_execute_queue", 1);
  _emscripten_proxy_finish = createExportWrapper("emscripten_proxy_finish", 1);
  __emscripten_run_js_on_main_thread_done = createExportWrapper("_emscripten_run_js_on_main_thread_done", 3);
  __emscripten_run_js_on_main_thread = createExportWrapper("_emscripten_run_js_on_main_thread", 5);
  __emscripten_thread_free_data = createExportWrapper("_emscripten_thread_free_data", 1);
  __emscripten_thread_exit = createExportWrapper("_emscripten_thread_exit", 1);
  __emscripten_check_mailbox = createExportWrapper("_emscripten_check_mailbox", 0);
  __ZdaPvm = Module["__ZdaPvm"] = createExportWrapper("_ZdaPvm", 2);
  __ZdlPvm = Module["__ZdlPvm"] = createExportWrapper("_ZdlPvm", 2);
  __ZnamSt11align_val_t = Module["__ZnamSt11align_val_t"] = createExportWrapper("_ZnamSt11align_val_t", 2);
  __ZnwmSt11align_val_t = Module["__ZnwmSt11align_val_t"] = createExportWrapper("_ZnwmSt11align_val_t", 2);
  ___libc_calloc = Module["___libc_calloc"] = createExportWrapper("__libc_calloc", 2);
  ___libc_realloc = Module["___libc_realloc"] = createExportWrapper("__libc_realloc", 2);
  _emscripten_builtin_calloc = Module["_emscripten_builtin_calloc"] = createExportWrapper("emscripten_builtin_calloc", 2);
  _emscripten_builtin_realloc = Module["_emscripten_builtin_realloc"] = createExportWrapper("emscripten_builtin_realloc", 2);
  _malloc_size = Module["_malloc_size"] = createExportWrapper("malloc_size", 1);
  _reallocf = Module["_reallocf"] = createExportWrapper("reallocf", 2);
  _emscripten_stack_init = wasmExports["emscripten_stack_init"];
  _emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"];
  _emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
  __wasmfs_read_file = createExportWrapper("_wasmfs_read_file", 3);
  __wasmfs_write_file = createExportWrapper("_wasmfs_write_file", 3);
  __wasmfs_mkdir = createExportWrapper("_wasmfs_mkdir", 2);
  __wasmfs_rmdir = createExportWrapper("_wasmfs_rmdir", 1);
  __wasmfs_open = createExportWrapper("_wasmfs_open", 3);
  __wasmfs_mknod = createExportWrapper("_wasmfs_mknod", 3);
  __wasmfs_unlink = createExportWrapper("_wasmfs_unlink", 1);
  __wasmfs_chdir = createExportWrapper("_wasmfs_chdir", 1);
  __wasmfs_symlink = createExportWrapper("_wasmfs_symlink", 2);
  __wasmfs_readlink = createExportWrapper("_wasmfs_readlink", 2);
  __wasmfs_write = createExportWrapper("_wasmfs_write", 3);
  __wasmfs_pwrite = createExportWrapper("_wasmfs_pwrite", 4);
  __wasmfs_chmod = createExportWrapper("_wasmfs_chmod", 2);
  __wasmfs_fchmod = createExportWrapper("_wasmfs_fchmod", 2);
  __wasmfs_lchmod = createExportWrapper("_wasmfs_lchmod", 2);
  __wasmfs_llseek = createExportWrapper("_wasmfs_llseek", 3);
  __wasmfs_rename = createExportWrapper("_wasmfs_rename", 2);
  __wasmfs_read = createExportWrapper("_wasmfs_read", 3);
  __wasmfs_pread = createExportWrapper("_wasmfs_pread", 4);
  __wasmfs_truncate = createExportWrapper("_wasmfs_truncate", 2);
  __wasmfs_ftruncate = createExportWrapper("_wasmfs_ftruncate", 2);
  __wasmfs_close = createExportWrapper("_wasmfs_close", 1);
  __wasmfs_mmap = createExportWrapper("_wasmfs_mmap", 5);
  __wasmfs_msync = createExportWrapper("_wasmfs_msync", 3);
  __wasmfs_munmap = createExportWrapper("_wasmfs_munmap", 2);
  __wasmfs_utime = createExportWrapper("_wasmfs_utime", 3);
  __wasmfs_stat = createExportWrapper("_wasmfs_stat", 2);
  __wasmfs_lstat = createExportWrapper("_wasmfs_lstat", 2);
  __wasmfs_mount = createExportWrapper("_wasmfs_mount", 2);
  __wasmfs_identify = createExportWrapper("_wasmfs_identify", 1);
  __wasmfs_readdir_start = createExportWrapper("_wasmfs_readdir_start", 1);
  __wasmfs_readdir_get = createExportWrapper("_wasmfs_readdir_get", 1);
  __wasmfs_readdir_finish = createExportWrapper("_wasmfs_readdir_finish", 1);
  __wasmfs_get_cwd = createExportWrapper("_wasmfs_get_cwd", 0);
  _wasmfs_create_jsimpl_backend = createExportWrapper("wasmfs_create_jsimpl_backend", 0);
  _wasmfs_create_memory_backend = createExportWrapper("wasmfs_create_memory_backend", 0);
  __wasmfs_opfs_record_entry = createExportWrapper("_wasmfs_opfs_record_entry", 3);
  _wisp_deliver = Module["_wisp_deliver"] = createExportWrapper("wisp_deliver", 3);
  _wisp_set_connected = Module["_wisp_set_connected"] = createExportWrapper("wisp_set_connected", 1);
  _wisp_set_eof = Module["_wisp_set_eof"] = createExportWrapper("wisp_set_eof", 1);
  _wisp_set_error = Module["_wisp_set_error"] = createExportWrapper("wisp_set_error", 2);
  _provider_record_entry = Module["_provider_record_entry"] = createExportWrapper("provider_record_entry", 3);
  _wasmfs_create_file = createExportWrapper("wasmfs_create_file", 3);
  _wasmfs_unmount = createExportWrapper("wasmfs_unmount", 1);
  _wasmfs_flush = createExportWrapper("wasmfs_flush", 0);
  __indirect_function_table = wasmTable = wasmExports["__indirect_function_table"];
  _gNoteToolkitBuildID = Module["_gNoteToolkitBuildID"] = (wasmExports["gNoteToolkitBuildID"].value) >>> 0;
}

var wasmImports;

function assignWasmImports() {
  wasmImports = {
    /** @export */ HaveOffsetConverter,
    /** @export */ WasmAddStub,
    /** @export */ WasmInvoke,
    /** @export */ _Unwind_Backtrace: __Unwind_Backtrace,
    /** @export */ _Unwind_GetIP: __Unwind_GetIP,
    /** @export */ _ZN16nsBaseFilePicker13AppendFiltersEi: __ZN16nsBaseFilePicker13AppendFiltersEi,
    /** @export */ _ZN16nsBaseFilePicker15AppendRawFilterERK12nsTSubstringIDsE: __ZN16nsBaseFilePicker15AppendRawFilterERK12nsTSubstringIDsE,
    /** @export */ _ZN16nsBaseFilePicker15IsModeSupportedEN13nsIFilePicker4ModeEP9JSContextPPN7mozilla3dom7PromiseE: __ZN16nsBaseFilePicker15IsModeSupportedEN13nsIFilePicker4ModeEP9JSContextPPN7mozilla3dom7PromiseE,
    /** @export */ _ZN16nsBaseFilePicker16GetOkButtonLabelER12nsTSubstringIDsE: __ZN16nsBaseFilePicker16GetOkButtonLabelER12nsTSubstringIDsE,
    /** @export */ _ZN16nsBaseFilePicker16SetOkButtonLabelERK12nsTSubstringIDsE: __ZN16nsBaseFilePicker16SetOkButtonLabelERK12nsTSubstringIDsE,
    /** @export */ _ZN16nsBaseFilePicker18GetAddToRecentDocsEPb: __ZN16nsBaseFilePicker18GetAddToRecentDocsEPb,
    /** @export */ _ZN16nsBaseFilePicker18SetAddToRecentDocsEb: __ZN16nsBaseFilePicker18SetAddToRecentDocsEb,
    /** @export */ _ZN16nsBaseFilePicker19GetDisplayDirectoryEPP7nsIFile: __ZN16nsBaseFilePicker19GetDisplayDirectoryEPP7nsIFile,
    /** @export */ _ZN16nsBaseFilePicker19SetDisplayDirectoryEP7nsIFile: __ZN16nsBaseFilePicker19SetDisplayDirectoryEP7nsIFile,
    /** @export */ _ZN16nsBaseFilePicker26GetDisplaySpecialDirectoryER12nsTSubstringIDsE: __ZN16nsBaseFilePicker26GetDisplaySpecialDirectoryER12nsTSubstringIDsE,
    /** @export */ _ZN16nsBaseFilePicker26SetDisplaySpecialDirectoryERK12nsTSubstringIDsE: __ZN16nsBaseFilePicker26SetDisplaySpecialDirectoryERK12nsTSubstringIDsE,
    /** @export */ _ZN16nsBaseFilePicker7GetModeEPN13nsIFilePicker4ModeE: __ZN16nsBaseFilePicker7GetModeEPN13nsIFilePicker4ModeE,
    /** @export */ _ZN16nsBaseFilePickerC2Ev: __ZN16nsBaseFilePickerC2Ev,
    /** @export */ _ZN16nsBaseFilePickerD2Ev: __ZN16nsBaseFilePickerD2Ev,
    /** @export */ _ZN4base9LaunchAppERKNSt3__26vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEONS_13LaunchOptionsEPi: __ZN4base9LaunchAppERKNSt3__26vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEONS_13LaunchOptionsEPi,
    /** @export */ _ZN7mozilla15GetProcInfoSyncEO8nsTArrayINS_15ProcInfoRequestEE: __ZN7mozilla15GetProcInfoSyncEO8nsTArrayINS_15ProcInfoRequestEE,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch10numSamplesEv: __ZN7mozilla15RLBoxSoundTouch10numSamplesEv,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch10putSamplesEPKfj: __ZN7mozilla15RLBoxSoundTouch10putSamplesEPKfj,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch10setSettingEii: __ZN7mozilla15RLBoxSoundTouch10setSettingEii,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch11setChannelsEj: __ZN7mozilla15RLBoxSoundTouch11setChannelsEj,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch13setSampleRateEj: __ZN7mozilla15RLBoxSoundTouch13setSampleRateEj,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch14receiveSamplesEPfj: __ZN7mozilla15RLBoxSoundTouch14receiveSamplesEPfj,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch21numUnprocessedSamplesEv: __ZN7mozilla15RLBoxSoundTouch21numUnprocessedSamplesEv,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch4InitEv: __ZN7mozilla15RLBoxSoundTouch4InitEv,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch5flushEv: __ZN7mozilla15RLBoxSoundTouch5flushEv,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch7setRateEd: __ZN7mozilla15RLBoxSoundTouch7setRateEd,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch8setPitchEd: __ZN7mozilla15RLBoxSoundTouch8setPitchEd,
    /** @export */ _ZN7mozilla15RLBoxSoundTouch8setTempoEd: __ZN7mozilla15RLBoxSoundTouch8setTempoEd,
    /** @export */ _ZN7mozilla15RLBoxSoundTouchC1Ev: __ZN7mozilla15RLBoxSoundTouchC1Ev,
    /** @export */ _ZN7mozilla15RLBoxSoundTouchD1Ev: __ZN7mozilla15RLBoxSoundTouchD1Ev,
    /** @export */ _ZN7mozilla4a11y30GetCacheDomainsForKnownClientsEy: __ZN7mozilla4a11y30GetCacheDomainsForKnownClientsEy,
    /** @export */ _ZN9nsIWidget17CreateChildWindowEv: __ZN9nsIWidget17CreateChildWindowEv,
    /** @export */ _ZN9nsIWidget20CreateTopLevelWindowEv: __ZN9nsIWidget20CreateTopLevelWindowEv,
    /** @export */ _ZN9nsIWidget23CreateBidiKeyboardInnerEv: __ZN9nsIWidget23CreateBidiKeyboardInnerEv,
    /** @export */ _ZNK16nsBaseFilePicker17GetRelevantGlobalEv: __ZNK16nsBaseFilePicker17GetRelevantGlobalEv,
    /** @export */ __assert_fail: ___assert_fail,
    /** @export */ __call_sighandler: ___call_sighandler,
    /** @export */ __pthread_create_js: ___pthread_create_js,
    /** @export */ _emscripten_coop_can_suspend: __emscripten_coop_can_suspend,
    /** @export */ _emscripten_coop_deadlock: __emscripten_coop_deadlock,
    /** @export */ _emscripten_coop_mode: __emscripten_coop_mode,
    /** @export */ _emscripten_coop_wait: new WebAssembly.Suspending(__emscripten_coop_wait),
    /** @export */ _emscripten_coop_wake: __emscripten_coop_wake,
    /** @export */ _emscripten_coop_yield: new WebAssembly.Suspending(__emscripten_coop_yield),
    /** @export */ _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    /** @export */ _emscripten_lookup_name: __emscripten_lookup_name,
    /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    /** @export */ _emscripten_proxied_gl_context_activated_from_main_browser_thread: __emscripten_proxied_gl_context_activated_from_main_browser_thread,
    /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    /** @export */ _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
    /** @export */ _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    /** @export */ _gmtime_js: __gmtime_js,
    /** @export */ _localtime_js: __localtime_js,
    /** @export */ _mktime_js: __mktime_js,
    /** @export */ _tzset_js: __tzset_js,
    /** @export */ _wasmfs_copy_preloaded_file_data: __wasmfs_copy_preloaded_file_data,
    /** @export */ _wasmfs_get_num_preloaded_dirs: __wasmfs_get_num_preloaded_dirs,
    /** @export */ _wasmfs_get_num_preloaded_files: __wasmfs_get_num_preloaded_files,
    /** @export */ _wasmfs_get_preloaded_child_path: __wasmfs_get_preloaded_child_path,
    /** @export */ _wasmfs_get_preloaded_file_mode: __wasmfs_get_preloaded_file_mode,
    /** @export */ _wasmfs_get_preloaded_file_size: __wasmfs_get_preloaded_file_size,
    /** @export */ _wasmfs_get_preloaded_parent_path: __wasmfs_get_preloaded_parent_path,
    /** @export */ _wasmfs_get_preloaded_path_name: __wasmfs_get_preloaded_path_name,
    /** @export */ _wasmfs_jsimpl_alloc_file: __wasmfs_jsimpl_alloc_file,
    /** @export */ _wasmfs_jsimpl_free_file: __wasmfs_jsimpl_free_file,
    /** @export */ _wasmfs_jsimpl_get_size: __wasmfs_jsimpl_get_size,
    /** @export */ _wasmfs_jsimpl_read: __wasmfs_jsimpl_read,
    /** @export */ _wasmfs_jsimpl_set_size: __wasmfs_jsimpl_set_size,
    /** @export */ _wasmfs_jsimpl_write: __wasmfs_jsimpl_write,
    /** @export */ _wasmfs_opfs_close_access: __wasmfs_opfs_close_access,
    /** @export */ _wasmfs_opfs_close_blob: __wasmfs_opfs_close_blob,
    /** @export */ _wasmfs_opfs_flush_access: __wasmfs_opfs_flush_access,
    /** @export */ _wasmfs_opfs_free_directory: __wasmfs_opfs_free_directory,
    /** @export */ _wasmfs_opfs_free_file: __wasmfs_opfs_free_file,
    /** @export */ _wasmfs_opfs_get_child: __wasmfs_opfs_get_child,
    /** @export */ _wasmfs_opfs_get_entries: __wasmfs_opfs_get_entries,
    /** @export */ _wasmfs_opfs_get_size_access: __wasmfs_opfs_get_size_access,
    /** @export */ _wasmfs_opfs_get_size_blob: __wasmfs_opfs_get_size_blob,
    /** @export */ _wasmfs_opfs_get_size_file: __wasmfs_opfs_get_size_file,
    /** @export */ _wasmfs_opfs_init_root_directory: __wasmfs_opfs_init_root_directory,
    /** @export */ _wasmfs_opfs_insert_directory: __wasmfs_opfs_insert_directory,
    /** @export */ _wasmfs_opfs_insert_file: __wasmfs_opfs_insert_file,
    /** @export */ _wasmfs_opfs_move_file: __wasmfs_opfs_move_file,
    /** @export */ _wasmfs_opfs_open_access: __wasmfs_opfs_open_access,
    /** @export */ _wasmfs_opfs_open_blob: __wasmfs_opfs_open_blob,
    /** @export */ _wasmfs_opfs_read_access: __wasmfs_opfs_read_access,
    /** @export */ _wasmfs_opfs_read_blob: __wasmfs_opfs_read_blob,
    /** @export */ _wasmfs_opfs_remove_child: __wasmfs_opfs_remove_child,
    /** @export */ _wasmfs_opfs_set_size_access: __wasmfs_opfs_set_size_access,
    /** @export */ _wasmfs_opfs_set_size_file: __wasmfs_opfs_set_size_file,
    /** @export */ _wasmfs_opfs_write_access: __wasmfs_opfs_write_access,
    /** @export */ _wasmfs_stdin_get_char: __wasmfs_stdin_get_char,
    /** @export */ _wasmfs_thread_utils_heartbeat: __wasmfs_thread_utils_heartbeat,
    /** @export */ audiodecoder_create: _audiodecoder_create,
    /** @export */ audiodecoder_destroy: _audiodecoder_destroy,
    /** @export */ audiodecoder_feed: _audiodecoder_feed,
    /** @export */ audiodecoder_flush: _audiodecoder_flush,
    /** @export */ audiodecoder_reset: _audiodecoder_reset,
    /** @export */ clock_time_get: _clock_time_get,
    /** @export */ emaudio_get_rate: _emaudio_get_rate,
    /** @export */ emaudio_start: _emaudio_start,
    /** @export */ emaudio_stop: _emaudio_stop,
    /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
    /** @export */ emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
    /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    /** @export */ emscripten_date_now: _emscripten_date_now,
    /** @export */ emscripten_err: _emscripten_err,
    /** @export */ emscripten_errn: _emscripten_errn,
    /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    /** @export */ emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
    /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
    /** @export */ emscripten_get_now: _emscripten_get_now,
    /** @export */ emscripten_glActiveTexture: _emscripten_glActiveTexture,
    /** @export */ emscripten_glAttachShader: _emscripten_glAttachShader,
    /** @export */ emscripten_glBeginQuery: _emscripten_glBeginQuery,
    /** @export */ emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
    /** @export */ emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
    /** @export */ emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
    /** @export */ emscripten_glBindBuffer: _emscripten_glBindBuffer,
    /** @export */ emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
    /** @export */ emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
    /** @export */ emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
    /** @export */ emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
    /** @export */ emscripten_glBindSampler: _emscripten_glBindSampler,
    /** @export */ emscripten_glBindTexture: _emscripten_glBindTexture,
    /** @export */ emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
    /** @export */ emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
    /** @export */ emscripten_glBlendColor: _emscripten_glBlendColor,
    /** @export */ emscripten_glBlendEquation: _emscripten_glBlendEquation,
    /** @export */ emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
    /** @export */ emscripten_glBlendFunc: _emscripten_glBlendFunc,
    /** @export */ emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
    /** @export */ emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
    /** @export */ emscripten_glBufferData: _emscripten_glBufferData,
    /** @export */ emscripten_glBufferSubData: _emscripten_glBufferSubData,
    /** @export */ emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
    /** @export */ emscripten_glClear: _emscripten_glClear,
    /** @export */ emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
    /** @export */ emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
    /** @export */ emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
    /** @export */ emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
    /** @export */ emscripten_glClearColor: _emscripten_glClearColor,
    /** @export */ emscripten_glClearDepthf: _emscripten_glClearDepthf,
    /** @export */ emscripten_glClearStencil: _emscripten_glClearStencil,
    /** @export */ emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
    /** @export */ emscripten_glColorMask: _emscripten_glColorMask,
    /** @export */ emscripten_glCompileShader: _emscripten_glCompileShader,
    /** @export */ emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
    /** @export */ emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
    /** @export */ emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
    /** @export */ emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
    /** @export */ emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
    /** @export */ emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
    /** @export */ emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
    /** @export */ emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
    /** @export */ emscripten_glCreateProgram: _emscripten_glCreateProgram,
    /** @export */ emscripten_glCreateShader: _emscripten_glCreateShader,
    /** @export */ emscripten_glCullFace: _emscripten_glCullFace,
    /** @export */ emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
    /** @export */ emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
    /** @export */ emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
    /** @export */ emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
    /** @export */ emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
    /** @export */ emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
    /** @export */ emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
    /** @export */ emscripten_glDeleteShader: _emscripten_glDeleteShader,
    /** @export */ emscripten_glDeleteSync: _emscripten_glDeleteSync,
    /** @export */ emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
    /** @export */ emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
    /** @export */ emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
    /** @export */ emscripten_glDepthFunc: _emscripten_glDepthFunc,
    /** @export */ emscripten_glDepthMask: _emscripten_glDepthMask,
    /** @export */ emscripten_glDepthRangef: _emscripten_glDepthRangef,
    /** @export */ emscripten_glDetachShader: _emscripten_glDetachShader,
    /** @export */ emscripten_glDisable: _emscripten_glDisable,
    /** @export */ emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
    /** @export */ emscripten_glDrawArrays: _emscripten_glDrawArrays,
    /** @export */ emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
    /** @export */ emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
    /** @export */ emscripten_glDrawElements: _emscripten_glDrawElements,
    /** @export */ emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
    /** @export */ emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
    /** @export */ emscripten_glEnable: _emscripten_glEnable,
    /** @export */ emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
    /** @export */ emscripten_glEndQuery: _emscripten_glEndQuery,
    /** @export */ emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
    /** @export */ emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
    /** @export */ emscripten_glFenceSync: _emscripten_glFenceSync,
    /** @export */ emscripten_glFinish: _emscripten_glFinish,
    /** @export */ emscripten_glFlush: _emscripten_glFlush,
    /** @export */ emscripten_glFlushMappedBufferRange: _emscripten_glFlushMappedBufferRange,
    /** @export */ emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
    /** @export */ emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
    /** @export */ emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
    /** @export */ emscripten_glFrontFace: _emscripten_glFrontFace,
    /** @export */ emscripten_glGenBuffers: _emscripten_glGenBuffers,
    /** @export */ emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
    /** @export */ emscripten_glGenQueries: _emscripten_glGenQueries,
    /** @export */ emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
    /** @export */ emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
    /** @export */ emscripten_glGenSamplers: _emscripten_glGenSamplers,
    /** @export */ emscripten_glGenTextures: _emscripten_glGenTextures,
    /** @export */ emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
    /** @export */ emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
    /** @export */ emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
    /** @export */ emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
    /** @export */ emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
    /** @export */ emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
    /** @export */ emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
    /** @export */ emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
    /** @export */ emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
    /** @export */ emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
    /** @export */ emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
    /** @export */ emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
    /** @export */ emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
    /** @export */ emscripten_glGetBufferPointerv: _emscripten_glGetBufferPointerv,
    /** @export */ emscripten_glGetError: _emscripten_glGetError,
    /** @export */ emscripten_glGetFloatv: _emscripten_glGetFloatv,
    /** @export */ emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
    /** @export */ emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
    /** @export */ emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
    /** @export */ emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
    /** @export */ emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
    /** @export */ emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
    /** @export */ emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
    /** @export */ emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
    /** @export */ emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
    /** @export */ emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
    /** @export */ emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
    /** @export */ emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
    /** @export */ emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
    /** @export */ emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
    /** @export */ emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
    /** @export */ emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
    /** @export */ emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
    /** @export */ emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
    /** @export */ emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
    /** @export */ emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
    /** @export */ emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
    /** @export */ emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
    /** @export */ emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
    /** @export */ emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
    /** @export */ emscripten_glGetString: _emscripten_glGetString,
    /** @export */ emscripten_glGetStringi: _emscripten_glGetStringi,
    /** @export */ emscripten_glGetSynciv: _emscripten_glGetSynciv,
    /** @export */ emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
    /** @export */ emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
    /** @export */ emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
    /** @export */ emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
    /** @export */ emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
    /** @export */ emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
    /** @export */ emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
    /** @export */ emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
    /** @export */ emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
    /** @export */ emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
    /** @export */ emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
    /** @export */ emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
    /** @export */ emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
    /** @export */ emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
    /** @export */ emscripten_glHint: _emscripten_glHint,
    /** @export */ emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
    /** @export */ emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
    /** @export */ emscripten_glIsBuffer: _emscripten_glIsBuffer,
    /** @export */ emscripten_glIsEnabled: _emscripten_glIsEnabled,
    /** @export */ emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
    /** @export */ emscripten_glIsProgram: _emscripten_glIsProgram,
    /** @export */ emscripten_glIsQuery: _emscripten_glIsQuery,
    /** @export */ emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
    /** @export */ emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
    /** @export */ emscripten_glIsSampler: _emscripten_glIsSampler,
    /** @export */ emscripten_glIsShader: _emscripten_glIsShader,
    /** @export */ emscripten_glIsSync: _emscripten_glIsSync,
    /** @export */ emscripten_glIsTexture: _emscripten_glIsTexture,
    /** @export */ emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
    /** @export */ emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
    /** @export */ emscripten_glLineWidth: _emscripten_glLineWidth,
    /** @export */ emscripten_glLinkProgram: _emscripten_glLinkProgram,
    /** @export */ emscripten_glMapBufferRange: _emscripten_glMapBufferRange,
    /** @export */ emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
    /** @export */ emscripten_glPixelStorei: _emscripten_glPixelStorei,
    /** @export */ emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
    /** @export */ emscripten_glProgramBinary: _emscripten_glProgramBinary,
    /** @export */ emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
    /** @export */ emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
    /** @export */ emscripten_glReadBuffer: _emscripten_glReadBuffer,
    /** @export */ emscripten_glReadPixels: _emscripten_glReadPixels,
    /** @export */ emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
    /** @export */ emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
    /** @export */ emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
    /** @export */ emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
    /** @export */ emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
    /** @export */ emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
    /** @export */ emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
    /** @export */ emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
    /** @export */ emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
    /** @export */ emscripten_glScissor: _emscripten_glScissor,
    /** @export */ emscripten_glShaderBinary: _emscripten_glShaderBinary,
    /** @export */ emscripten_glShaderSource: _emscripten_glShaderSource,
    /** @export */ emscripten_glStencilFunc: _emscripten_glStencilFunc,
    /** @export */ emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
    /** @export */ emscripten_glStencilMask: _emscripten_glStencilMask,
    /** @export */ emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
    /** @export */ emscripten_glStencilOp: _emscripten_glStencilOp,
    /** @export */ emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
    /** @export */ emscripten_glTexImage2D: _emscripten_glTexImage2D,
    /** @export */ emscripten_glTexImage3D: _emscripten_glTexImage3D,
    /** @export */ emscripten_glTexParameterf: _emscripten_glTexParameterf,
    /** @export */ emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
    /** @export */ emscripten_glTexParameteri: _emscripten_glTexParameteri,
    /** @export */ emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
    /** @export */ emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
    /** @export */ emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
    /** @export */ emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
    /** @export */ emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
    /** @export */ emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
    /** @export */ emscripten_glUniform1f: _emscripten_glUniform1f,
    /** @export */ emscripten_glUniform1fv: _emscripten_glUniform1fv,
    /** @export */ emscripten_glUniform1i: _emscripten_glUniform1i,
    /** @export */ emscripten_glUniform1iv: _emscripten_glUniform1iv,
    /** @export */ emscripten_glUniform1ui: _emscripten_glUniform1ui,
    /** @export */ emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
    /** @export */ emscripten_glUniform2f: _emscripten_glUniform2f,
    /** @export */ emscripten_glUniform2fv: _emscripten_glUniform2fv,
    /** @export */ emscripten_glUniform2i: _emscripten_glUniform2i,
    /** @export */ emscripten_glUniform2iv: _emscripten_glUniform2iv,
    /** @export */ emscripten_glUniform2ui: _emscripten_glUniform2ui,
    /** @export */ emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
    /** @export */ emscripten_glUniform3f: _emscripten_glUniform3f,
    /** @export */ emscripten_glUniform3fv: _emscripten_glUniform3fv,
    /** @export */ emscripten_glUniform3i: _emscripten_glUniform3i,
    /** @export */ emscripten_glUniform3iv: _emscripten_glUniform3iv,
    /** @export */ emscripten_glUniform3ui: _emscripten_glUniform3ui,
    /** @export */ emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
    /** @export */ emscripten_glUniform4f: _emscripten_glUniform4f,
    /** @export */ emscripten_glUniform4fv: _emscripten_glUniform4fv,
    /** @export */ emscripten_glUniform4i: _emscripten_glUniform4i,
    /** @export */ emscripten_glUniform4iv: _emscripten_glUniform4iv,
    /** @export */ emscripten_glUniform4ui: _emscripten_glUniform4ui,
    /** @export */ emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
    /** @export */ emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
    /** @export */ emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
    /** @export */ emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
    /** @export */ emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
    /** @export */ emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
    /** @export */ emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
    /** @export */ emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
    /** @export */ emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
    /** @export */ emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
    /** @export */ emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
    /** @export */ emscripten_glUnmapBuffer: _emscripten_glUnmapBuffer,
    /** @export */ emscripten_glUseProgram: _emscripten_glUseProgram,
    /** @export */ emscripten_glValidateProgram: _emscripten_glValidateProgram,
    /** @export */ emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
    /** @export */ emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
    /** @export */ emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
    /** @export */ emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
    /** @export */ emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
    /** @export */ emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
    /** @export */ emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
    /** @export */ emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
    /** @export */ emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
    /** @export */ emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
    /** @export */ emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
    /** @export */ emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
    /** @export */ emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
    /** @export */ emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
    /** @export */ emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
    /** @export */ emscripten_glViewport: _emscripten_glViewport,
    /** @export */ emscripten_glWaitSync: _emscripten_glWaitSync,
    /** @export */ emscripten_has_asyncify: _emscripten_has_asyncify,
    /** @export */ emscripten_num_logical_cores: _emscripten_num_logical_cores,
    /** @export */ emscripten_out: _emscripten_out,
    /** @export */ emscripten_pc_get_function: _emscripten_pc_get_function,
    /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */ emscripten_return_address: _emscripten_return_address,
    /** @export */ emscripten_runtime_keepalive_check: _emscripten_runtime_keepalive_check,
    /** @export */ emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
    /** @export */ emscripten_stack_snapshot: _emscripten_stack_snapshot,
    /** @export */ emscripten_stack_unwind_buffer: _emscripten_stack_unwind_buffer,
    /** @export */ emscripten_supports_offscreencanvas: _emscripten_supports_offscreencanvas,
    /** @export */ emscripten_unwind_to_js_event_loop: _emscripten_unwind_to_js_event_loop,
    /** @export */ emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
    /** @export */ emscripten_webgl_do_create_context: _emscripten_webgl_do_create_context,
    /** @export */ emscripten_webgl_make_context_current_calling_thread: _emscripten_webgl_make_context_current_calling_thread,
    /** @export */ environ_get: _environ_get,
    /** @export */ environ_sizes_get: _environ_sizes_get,
    /** @export */ exit: _exit,
    /** @export */ gecko_coarse_clock_start: _gecko_coarse_clock_start,
    /** @export */ glClipControlEXT: _glClipControlEXT,
    /** @export */ glPolygonModeWEBGL: _glPolygonModeWEBGL,
    /** @export */ glPolygonOffsetClampEXT: _glPolygonOffsetClampEXT,
    /** @export */ gl_present_yield: new WebAssembly.Suspending(_gl_present_yield),
    /** @export */ hostaudio_set_media_time: _hostaudio_set_media_time,
    /** @export */ hostaudio_set_playing: _hostaudio_set_playing,
    /** @export */ hostimg_decode: _hostimg_decode,
    /** @export */ hostimg_gpu_decode: _hostimg_gpu_decode,
    /** @export */ hostimg_renderer_install: _hostimg_renderer_install,
    /** @export */ memory: wasmMemory,
    /** @export */ proc_exit: _proc_exit,
    /** @export */ provider_mkdir: _provider_mkdir,
    /** @export */ provider_read: _provider_read,
    /** @export */ provider_readdir: _provider_readdir,
    /** @export */ provider_rename: _provider_rename,
    /** @export */ provider_stat: _provider_stat,
    /** @export */ provider_unlink: _provider_unlink,
    /** @export */ provider_write: _provider_write,
    /** @export */ random_get: _random_get,
    /** @export */ sendfile: _sendfile,
    /** @export */ wasmhost_call: _wasmhost_call,
    /** @export */ wasmhost_compile: _wasmhost_compile,
    /** @export */ wasmhost_export_count: _wasmhost_export_count,
    /** @export */ wasmhost_export_kind: _wasmhost_export_kind,
    /** @export */ wasmhost_export_name: _wasmhost_export_name,
    /** @export */ wasmhost_export_register_mem: _wasmhost_export_register_mem,
    /** @export */ wasmhost_export_register_obj: _wasmhost_export_register_obj,
    /** @export */ wasmhost_global_get: _wasmhost_global_get,
    /** @export */ wasmhost_global_new: _wasmhost_global_new,
    /** @export */ wasmhost_global_set: _wasmhost_global_set,
    /** @export */ wasmhost_guest_mem_objid: _wasmhost_guest_mem_objid,
    /** @export */ wasmhost_guest_mem_shared: _wasmhost_guest_mem_shared,
    /** @export */ wasmhost_import_count: _wasmhost_import_count,
    /** @export */ wasmhost_import_kind: _wasmhost_import_kind,
    /** @export */ wasmhost_import_module: _wasmhost_import_module,
    /** @export */ wasmhost_import_name: _wasmhost_import_name,
    /** @export */ wasmhost_instantiate: _wasmhost_instantiate,
    /** @export */ wasmhost_jit_table: _wasmhost_jit_table,
    /** @export */ wasmhost_jit_table_set: _wasmhost_jit_table_set,
    /** @export */ wasmhost_mem_bytelength: _wasmhost_mem_bytelength,
    /** @export */ wasmhost_mem_is_shared: _wasmhost_mem_is_shared,
    /** @export */ wasmhost_mem_new: _wasmhost_mem_new,
    /** @export */ wasmhost_obj_set_mirror: _wasmhost_obj_set_mirror,
    /** @export */ wasmhost_table_call: _wasmhost_table_call,
    /** @export */ wasmhost_table_grow: _wasmhost_table_grow,
    /** @export */ wasmhost_table_length: _wasmhost_table_length,
    /** @export */ wasmhost_table_new: _wasmhost_table_new,
    /** @export */ wasmhost_table_set_hostfn: _wasmhost_table_set_hostfn,
    /** @export */ wasmhost_table_set_null: _wasmhost_table_set_null,
    /** @export */ webcodecs_create: _webcodecs_create,
    /** @export */ webcodecs_destroy: _webcodecs_destroy,
    /** @export */ webcodecs_feed: _webcodecs_feed,
    /** @export */ webcodecs_flush: _webcodecs_flush,
    /** @export */ webcodecs_reset: _webcodecs_reset,
    /** @export */ wisp_close: _wisp_close,
    /** @export */ wisp_connect: _wisp_connect,
    /** @export */ wisp_open: _wisp_open,
    /** @export */ wisp_send: _wisp_send
  };
}

// Argument name here must shadow the `wasmExports` global so
// that it is recognised by metadce and minify-import-export-names
// passes.
function applySignatureConversions(wasmExports) {
  // First, make a copy of the incoming exports object
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_ppp = f => (a0, a1) => f(a0, a1) >>> 0;
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  var makeWrapper_p = f => () => f() >>> 0;
  var makeWrapper_pp____ = f => (a0, a1, a2, a3, a4) => f(a0, a1, a2, a3, a4) >>> 0;
  var makeWrapper_p_ = f => a0 => f(a0) >>> 0;
  wasmExports["calloc"] = makeWrapper_ppp(wasmExports["calloc"]);
  wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
  wasmExports["realloc"] = makeWrapper_ppp(wasmExports["realloc"]);
  wasmExports["pthread_self"] = makeWrapper_p(wasmExports["pthread_self"]);
  wasmExports["emscripten_stack_get_base"] = makeWrapper_p(wasmExports["emscripten_stack_get_base"]);
  wasmExports["emscripten_builtin_memalign"] = makeWrapper_ppp(wasmExports["emscripten_builtin_memalign"]);
  wasmExports["emscripten_stack_get_end"] = makeWrapper_p(wasmExports["emscripten_stack_get_end"]);
  wasmExports["emscripten_builtin_malloc"] = makeWrapper_pp(wasmExports["emscripten_builtin_malloc"]);
  wasmExports["emscripten_builtin_calloc"] = makeWrapper_ppp(wasmExports["emscripten_builtin_calloc"]);
  wasmExports["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports["_emscripten_stack_alloc"]);
  wasmExports["emscripten_stack_get_current"] = makeWrapper_p(wasmExports["emscripten_stack_get_current"]);
  wasmExports["_wasmfs_mmap"] = makeWrapper_pp____(wasmExports["_wasmfs_mmap"]);
  wasmExports["_wasmfs_get_cwd"] = makeWrapper_p_(wasmExports["_wasmfs_get_cwd"]);
  return wasmExports;
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
var calledRun;

function callMain() {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(typeof onPreRuns === "undefined" || onPreRuns.length == 0, "cannot call main when preRun functions remain to be called");
  var entryFunction = __emscripten_proxy_main;
  // With PROXY_TO_PTHREAD make sure we keep the runtime alive until the
  // proxied main calls exit (see exitOnMainThread() for where Pop is called).
  runtimeKeepalivePush();
  var argc = 0;
  var argv = 0;
  try {
    var ret = entryFunction(argc, argv);
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  // See $establishStackSpace for the equivalent code that runs on a thread
  assert(!ENVIRONMENT_IS_PTHREAD);
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

async function run() {
  assert(!calledRun);
  calledRun = true;
  if ((ENVIRONMENT_IS_PTHREAD)) {
    initRuntime();
    return;
  }
  stackCheckInit();
  preRun();
  if (runDependencies > 0) {
    await new Promise(resolve => dependenciesFulfilled = resolve);
  }
  var setStatus = Module["setStatus"];
  if (setStatus) {
    setStatus("Running...");
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise(resolve => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, "");
  }
  if (ABORT) return;
  initRuntime();
  preMain();
  Module["onRuntimeInitialized"]?.();
  consumedModuleProp("onRuntimeInitialized");
  var noInitialRun = Module["noInitialRun"] || false;
  if (!noInitialRun) callMain();
  postRun();
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = x => {
    has = true;
  };
  try {
    // it doesn't matter if it fails
    // In WasmFS we must also flush the WasmFS internal buffers, for this check
    // to work.
    _wasmfs_flush();
  } catch (e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
    warnOnce("(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)");
  }
}

var wasmExports;

if ((!(ENVIRONMENT_IS_PTHREAD))) {
  // Call createWasm on startup if we are the main thread.
  // Worker threads call this once they receive the module via postMessage
  // In modularize mode the generated code is within a factory function so we
  // can use await here (since it's not top-level-await).
  wasmExports = await createWasm();
  await run();
}

// end include: postamble.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
  }
}


    return Module;
  };
})();

// Export using a UMD style export, or ES6 exports if selected
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = createGecko;
  // This default export looks redundant, but it allows TS to import this
  // commonjs style module.
  module.exports.default = createGecko;
} else if (typeof define === 'function' && define['amd'])
  define([], () => createGecko);

// Create code for detecting if we are running in a pthread.
// Normally this detection is done when the module is itself run but
// when running in MODULARIZE mode we need use this to know if we should
// run the module constructor on startup (true only for pthreads).
var isPthread = globalThis.name?.startsWith('em-pthread');

isPthread && createGecko();

