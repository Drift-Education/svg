// WebTransport-shaped client for the local Webblox QUIC bridge.
//
// The Roblox engine is a worker and calls `new WebTransport(url)` for its game
// wire. Browsers cannot send Roblox's RUPP envelope over raw UDP, so this shim
// carries the engine's datagrams and streams over a WebSocket to
// `scripts/webblox-bridge.mjs`, which owns the aioquic QUIC client.
//
// Frame protocol (shared by the shim, the Node relay, and quic_bridge.py):
//   -> [0][data]                    datagram
//   -> [1][sid u32le][data]         stream data
//   -> [3][sid u32le]               stream close/FIN
//   <- [0][data]                    datagram
//   <- [1][sid][data]               stream data
//   <- [2][sid][uni u8]             incoming stream announce
//   <- [3][sid]                     stream close
//   <- [4]                          WT_READY
//   <- [5]                          WT_FAILED
//
// It only installs when the build set `self.__webbloxRelayBase`
// (VITE_WEBLOX_RELAY). Without it the engine keeps the browser's native
// WebTransport, loopback included, and never probes 127.0.0.1:8787.
(function () {
  var configuredBase =
    typeof self !== "undefined" && typeof self.__webbloxRelayBase === "string"
      ? self.__webbloxRelayBase.trim()
      : "";
  if (configuredBase === "") {
    return;
  }

  var configuredToken =
    typeof self !== "undefined" && typeof self.__webbloxRelayToken === "string"
      ? self.__webbloxRelayToken.trim()
      : "";

  var relayUrl =
    configuredBase.replace(/^http/i, "ws").replace(/\/+$/, "") +
    "/udp-relay" +
    (configuredToken === "" ? "" : "?token=" + encodeURIComponent(configuredToken));
  var MAX_DATAGRAM = 1472;
  var MAX_FRAME = 16 * 1024 * 1024;

  function WsTransport(url) {
    var self = this;
    var target = String(url || "");
    var relay = relayUrl + (relayUrl.indexOf("?") < 0 ? "?" : "&") + "proto=udp";
    try {
      var match = target.match(/(?:wss?|https?):\/\/([^/]+)(\/[^ ]*)?/i);
      if (match && match[2]) {
        relay += "&path=" + encodeURIComponent(match[2]);
      }
    } catch (_) {}

    this._ws = new WebSocket(relay);
    this._ws.binaryType = "arraybuffer";
    this._readyOk = false;
    this._pending = [];
    this._userClosed = false;
    this._streams = new Map();
    this._nextSid = 1;
    this._dgCtrl = null;
    this._inCtrl = null;
    this._inUniCtrl = null;

    this._send = function (frame) {
      if (self._readyOk && self._ws.readyState === 1) {
        self._ws.send(frame);
        return;
      }
      if (self._pending.length < 4096) {
        self._pending.push(frame);
      }
    };

    this.datagrams = {
      readable: new ReadableStream({
        start: function (controller) {
          self._dgCtrl = controller;
        }
      }),
      writable: new WritableStream({
        write: function (chunk) {
          // Datagrams are the lossy plane. Never queue stale position frames
          // behind a backed-up WebSocket; the newest sample wins.
          if (self._ws.bufferedAmount > 65536) {
            return;
          }
          var bytes = new Uint8Array(chunk);
          if (bytes.byteLength > MAX_DATAGRAM) {
            return;
          }
          var frame = new Uint8Array(1 + bytes.byteLength);
          frame[0] = 0;
          frame.set(bytes, 1);
          self._send(frame);
        },
        close: function () {
          self.close();
        }
      }),
      incomingMaxAge: null,
      outgoingMaxAge: null,
      maxDatagramSize: MAX_DATAGRAM
    };

    this.incomingBidirectionalStreams = new ReadableStream({
      start: function (controller) {
        self._inCtrl = controller;
      }
    });
    this.incomingUnidirectionalStreams = new ReadableStream({
      start: function (controller) {
        self._inUniCtrl = controller;
      }
    });

    this._makeStream = function (sid) {
      var stream = { sid: sid, _read: null };
      stream.readable = new ReadableStream({
        start: function (controller) {
          stream._read = controller;
        }
      });
      stream.writable = new WritableStream({
        write: function (chunk) {
          var bytes = new Uint8Array(chunk);
          var frame = new Uint8Array(5 + bytes.byteLength);
          frame[0] = 1;
          new DataView(frame.buffer).setUint32(1, sid, true);
          frame.set(bytes, 5);
          self._send(frame);
        },
        close: function () {
          var frame = new Uint8Array(5);
          frame[0] = 3;
          new DataView(frame.buffer).setUint32(1, sid, true);
          try {
            self._send(frame);
          } catch (_) {}
        }
      });
      self._streams.set(sid, stream);
      return stream;
    };

    this._openStream = function (unidirectional) {
      return self._makeStream(
        (unidirectional ? 0x80000000 : 0) | self._nextSid++
      );
    };

    this._ws.onmessage = function (event) {
      try {
        if (!(event.data instanceof ArrayBuffer) || event.data.byteLength < 1) {
          return;
        }
        var bytes = new Uint8Array(event.data);
        var type = bytes[0];
        if (type === 0) {
          if (self._dgCtrl && self._dgCtrl.desiredSize > 0) {
            self._dgCtrl.enqueue(bytes.subarray(1));
          }
          return;
        }
        if (type === 1 && bytes.byteLength >= 5) {
          var sid = new DataView(event.data).getUint32(1, true);
          var stream = self._streams.get(sid);
          if (stream && stream._read) {
            stream._read.enqueue(bytes.subarray(5));
          }
          return;
        }
        if (type === 2 && bytes.byteLength >= 5) {
          var announced = new DataView(event.data).getUint32(1, true);
          var unidirectional = bytes.byteLength >= 6 ? bytes[5] !== 0 : false;
          // Inbound data/close frames are keyed by the bare sid. Bit 31 is
          // only a marker on the sids this side allocates.
          var opened = self._makeStream(announced);
          var item = unidirectional
            ? opened.readable
            : { readable: opened.readable, writable: opened.writable };
          var control = unidirectional ? self._inUniCtrl : self._inCtrl;
          if (control) {
            control.enqueue(item);
          }
          return;
        }
        if (type === 3 && bytes.byteLength >= 5) {
          var closedSid = new DataView(event.data).getUint32(1, true);
          var closing = self._streams.get(closedSid & 0x7fffffff);
          if (closing && closing._read) {
            try {
              closing._read.close();
            } catch (_) {}
          }
          return;
        }
        if (type === 4) {
          self._readyOk = true;
          if (self._resolveReady) {
            self._resolveReady();
          }
          for (var i = 0; i < self._pending.length; i += 1) {
            try {
              self._ws.send(self._pending[i]);
            } catch (_) {}
          }
          self._pending.length = 0;
          return;
        }
        if (type === 5 && self._rejectReady) {
          self._rejectReady(new Error("Webblox QUIC bridge failed the session"));
        }
      } catch (error) {
        console.error("[webblox] transport frame error", error);
      }
    };

    this._ws.onclose = function () {
      if (self._dgCtrl) {
        try {
          self._dgCtrl.close();
        } catch (_) {}
      }
      if (!self._readyOk && self._rejectReady) {
        self._rejectReady(
          new Error(
            self._userClosed
              ? "Webblox transport closed"
              : "Webblox transport bridge is not running"
          )
        );
      }
    };

    this.ready = new Promise(function (resolve, reject) {
      self._resolveReady = resolve;
      self._rejectReady = reject;
      self._ws.onerror = function () {
        reject(new Error("Webblox transport bridge is not reachable"));
      };
    });

    this.closed = new Promise(function (resolve) {
      self._ws.addEventListener("close", function () {
        resolve({});
      });
    });

    this.createBidirectionalStream = function () {
      return Promise.resolve(self._openStream(false));
    };
    this.createUnidirectionalStream = function () {
      return Promise.resolve(self._openStream(true).writable);
    };
    this.close = function () {
      self._userClosed = true;
      try {
        self._ws.close();
      } catch (_) {}
    };
  }

  // The worker's WebClient.js is also loaded in the page, but importScripts
  // only exists in the worker; this guard is added by the build.
  globalThis.WebTransport = WsTransport;
  globalThis.__webbloxWsTransport = WsTransport;
  console.log("[webblox] local QUIC transport shim installed");
})();
