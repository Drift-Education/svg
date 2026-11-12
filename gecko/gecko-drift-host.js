var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};


// resources/node_modules/@mercuryworkshop/wisp-js/src/client/index.mjs
var client_exports = {};
__export(client_exports, {
  ClientConnection: () => ClientConnection,
  WispWebSocket: () => WispWebSocket,
  _wisp_connections: () => _wisp_connections
});

// resources/node_modules/@mercuryworkshop/wisp-js/src/compat_browser.mjs
var global_this = typeof globalThis === "undefined" ? window : globalThis;
var WebSocket2 = global_this.WebSocket;
var crypto2 = global_this.crypto;

// resources/node_modules/@mercuryworkshop/wisp-js/src/packet.mjs
var text_encoder = new TextEncoder();
var encode_text = text_encoder.encode.bind(text_encoder);
var text_decoder = new TextDecoder();
var decode_text = text_decoder.decode.bind(text_decoder);
var WispBuffer = class _WispBuffer {
  constructor(data) {
    if (data instanceof Uint8Array) {
      this.from_array(data);
    } else if (typeof data === "number") {
      this.from_array(new Uint8Array(data));
    } else if (typeof data === "string") {
      this.from_array(encode_text(data));
    } else {
      console.trace();
      throw "invalid data type passed to wisp buffer constructor";
    }
  }
  from_array(bytes) {
    this.size = bytes.length;
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer);
  }
  concat(buffer) {
    let new_buffer = new _WispBuffer(this.size + buffer.size);
    new_buffer.bytes.set(this.bytes, 0);
    new_buffer.bytes.set(buffer.bytes, this.size);
    return new_buffer;
  }
  slice(index, size) {
    let bytes_slice = this.bytes.slice(index, size);
    return new _WispBuffer(bytes_slice);
  }
  get_string() {
    return text_decoder.decode(this.bytes);
  }
};
var WispPacket = class _WispPacket {
  static min_size = 5;
  constructor({ type, stream_id, payload, payload_bytes }) {
    this.type = type;
    this.stream_id = stream_id;
    this.payload_bytes = payload_bytes;
    this.payload = payload;
  }
  static parse(buffer) {
    return new _WispPacket({
      type: buffer.view.getUint8(0),
      stream_id: buffer.view.getUint32(1, true),
      payload_bytes: buffer.slice(5)
    });
  }
  static parse_all(buffer) {
    if (buffer.size < _WispPacket.min_size) {
      throw TypeError("packet too small");
    }
    let packet = _WispPacket.parse(buffer);
    let payload_class = packet_classes[packet.type];
    if (typeof payload_class === "undefined") {
      throw TypeError("invalid packet type");
    }
    if (packet.payload_bytes.size < payload_class.size) {
      throw TypeError("payload too small");
    }
    packet.payload = payload_class.parse(packet.payload_bytes);
    return packet;
  }
  serialize() {
    let buffer = new WispBuffer(5);
    buffer.view.setUint8(0, this.type);
    buffer.view.setUint32(1, this.stream_id, true);
    buffer = buffer.concat(this.payload.serialize());
    return buffer;
  }
};
var ConnectPayload = class _ConnectPayload {
  static min_size = 3;
  static type = 1;
  static name = "CONNECT";
  constructor({ stream_type, port, hostname }) {
    this.stream_type = stream_type;
    this.port = port;
    this.hostname = hostname;
  }
  static parse(buffer) {
    return new _ConnectPayload({
      stream_type: buffer.view.getUint8(0),
      port: buffer.view.getUint16(1, true),
      hostname: decode_text(buffer.slice(3).bytes)
    });
  }
  serialize() {
    let buffer = new WispBuffer(3);
    buffer.view.setUint8(0, this.stream_type);
    buffer.view.setUint16(1, this.port, true);
    buffer = buffer.concat(new WispBuffer(this.hostname));
    return buffer;
  }
};
var DataPayload = class _DataPayload {
  static min_size = 0;
  static type = 2;
  static name = "DATA";
  constructor({ data }) {
    this.data = data;
  }
  static parse(buffer) {
    return new _DataPayload({
      data: buffer
    });
  }
  serialize() {
    return this.data;
  }
};
var ContinuePayload = class _ContinuePayload {
  static type = 3;
  static name = "CONTINUE";
  constructor({ buffer_remaining }) {
    this.buffer_remaining = buffer_remaining;
  }
  static parse(buffer) {
    return new _ContinuePayload({
      buffer_remaining: buffer.view.getUint32(0, true)
    });
  }
  serialize() {
    let buffer = new WispBuffer(4);
    buffer.view.setUint32(0, this.buffer_remaining, true);
    return buffer;
  }
};
var ClosePayload = class _ClosePayload {
  static min_size = 1;
  static type = 4;
  static name = "CLOSE";
  constructor({ reason }) {
    this.reason = reason;
  }
  static parse(buffer) {
    return new _ClosePayload({
      reason: buffer.view.getUint8(0)
    });
  }
  serialize() {
    let buffer = new WispBuffer(1);
    buffer.view.setUint8(0, this.reason);
    return buffer;
  }
};
var InfoPayload = class _InfoPayload {
  static min_size = 2;
  static type = 5;
  static name = "INFO";
  constructor({ major_ver, minor_ver, extensions }) {
    this.major_ver = major_ver;
    this.minor_ver = minor_ver;
    this.extensions = extensions;
  }
  static parse(buffer) {
    return new _InfoPayload({
      major_ver: buffer.view.getUint8(0),
      minor_ver: buffer.view.getUint8(1),
      extensions: buffer.slice(2)
    });
  }
  serialize() {
    let buffer = new WispBuffer(2);
    buffer.view.setUint8(0, this.major_ver);
    buffer.view.setUint8(1, this.minor_ver);
    return buffer.concat(this.extensions);
  }
};
var packet_classes = {
  1: ConnectPayload,
  2: DataPayload,
  3: ContinuePayload,
  4: ClosePayload,
  5: InfoPayload
};
var packet_types = {
  CONNECT: 1,
  DATA: 2,
  CONTINUE: 3,
  CLOSE: 4,
  INFO: 5
};
var stream_types = {
  TCP: 1,
  UDP: 2
};

// resources/node_modules/@mercuryworkshop/wisp-js/src/extensions.mjs
var EmptyPayload = class _EmptyPayload {
  constructor() {
  }
  static parse() {
    return new _EmptyPayload();
  }
  serialize() {
    return new WispBuffer(0);
  }
};
var BaseExtension = class {
  static id = 0;
  static name = "";
  static Server = EmptyPayload;
  static Client = EmptyPayload;
  constructor({ server_config, client_config } = {}) {
    this.id = this.constructor.id;
    this.name = this.constructor.name;
    if (server_config)
      this.payload = new this.constructor.Server(server_config);
    else if (client_config)
      this.payload = new this.constructor.Client(client_config);
  }
  static parse(ext_class, buffer, role) {
    let extension = new ext_class({});
    if (role === "client")
      extension.payload = ext_class.Client.parse(buffer.slice(5));
    else if (role === "server")
      extension.payload = ext_class.Server.parse(buffer.slice(5));
    else
      throw TypeError("invalid role");
    return extension;
  }
  serialize() {
    let buffer = new WispBuffer(5);
    let payload_buffer = this.payload.serialize();
    buffer.view.setInt8(0, this.constructor.id);
    buffer.view.setUint32(1, payload_buffer.size, true);
    return buffer.concat(payload_buffer);
  }
};
var UDPExtension = class extends BaseExtension {
  static id = 1;
  static name = "UDP";
};
var MOTDExtension = class _MOTDExtension extends BaseExtension {
  static id = 4;
  static name = "Server MOTD";
  static Server = class {
    constructor({ message }) {
      this.message = message;
    }
    static parse(buffer) {
      return new _MOTDExtension.Server({
        message: buffer.get_string()
      });
    }
    serialize() {
      return new WispBuffer(this.message);
    }
  };
  static Client = EmptyPayload;
};
function parse_extensions(payload_buffer, valid_extensions, role) {
  let index = 0;
  let parsed_extensions = [];
  while (payload_buffer.size) {
    let ext_id = payload_buffer.view.getUint8(index);
    let ext_len = payload_buffer.view.getUint32(index + 1, true);
    let ext_payload = payload_buffer.slice(0, 5 + ext_len);
    let ext_class;
    for (let extension of valid_extensions) {
      if (extension.id !== ext_id)
        continue;
      ext_class = extension.constructor;
      break;
    }
    if (ext_class) {
      let ext_parsed = BaseExtension.parse(ext_class, ext_payload, role);
      parsed_extensions.push(ext_parsed);
    }
    payload_buffer = payload_buffer.slice(5 + ext_len);
  }
  return parsed_extensions;
}
function serialize_extensions(extensions) {
  {
    let ext_buffer = new WispBuffer(0);
    for (let extension of extensions) {
      ext_buffer = ext_buffer.concat(extension.serialize());
    }
    return ext_buffer;
  }
}

// resources/node_modules/@mercuryworkshop/wisp-js/src/client/connection.mjs
var ClientStream = class {
  constructor(hostname, port, websocket, buffer_size, stream_id, connection, stream_type) {
    this.hostname = hostname;
    this.port = port;
    this.ws = websocket;
    this.buffer_size = buffer_size;
    this.stream_id = stream_id;
    this.connection = connection;
    this.stream_type = stream_type;
    this.send_buffer = [];
    this.open = true;
    this.onopen = () => {
    };
    this.onclose = () => {
    };
    this.onmessage = () => {
    };
  }
  send(data) {
    if (this.buffer_size > 0 || !this.open || this.stream_type === stream_types.UDP) {
      let packet = new WispPacket({
        type: packet_types.DATA,
        stream_id: this.stream_id,
        payload: new DataPayload({
          data: new WispBuffer(data)
        })
      });
      this.ws.send(packet.serialize().bytes);
      this.buffer_size--;
    } else {
      this.send_buffer.push(data);
    }
  }
  //handle receiving a CONTINUE packet
  continue_received(buffer_size) {
    this.buffer_size = buffer_size;
    while (this.buffer_size > 0 && this.send_buffer.length > 0) {
      this.send(this.send_buffer.shift());
    }
  }
  //construct and send a CLOSE packet
  close(reason = 1) {
    if (!this.open) return;
    let packet = new WispPacket({
      type: packet_types.CLOSE,
      stream_id: this.stream_id,
      payload: new ClosePayload({
        reason
      })
    });
    this.ws.send(packet.serialize().bytes);
    this.open = false;
    delete this.connection.active_streams[this.stream_id];
  }
};
var ClientConnection = class {
  constructor(wisp_url, { wisp_version, wisp_extensions } = {}) {
    if (!wisp_url.endsWith("/")) {
      throw new TypeError("wisp endpoints must end with a trailing forward slash");
    }
    this.wisp_url = wisp_url;
    this.wisp_version = wisp_version || 2;
    this.wisp_extensions = wisp_extensions || null;
    this.max_buffer_size = null;
    this.active_streams = {};
    this.connected = false;
    this.connecting = false;
    this.next_stream_id = 1;
    this.server_exts = {};
    this.client_exts = {};
    this.info_received = false;
    this.server_motd = null;
    this.udp_enabled = true;
    this.onopen = () => {
    };
    this.onclose = () => {
    };
    this.onerror = () => {
    };
    this.onmessage = () => {
    };
    if (this.wisp_version === 2 && this.wisp_extensions === null) {
      this.add_extensions();
    }
    this.connect_ws();
  }
  add_extensions() {
    this.wisp_extensions = [];
    this.wisp_extensions.push(new UDPExtension({ client_config: {} }));
    this.wisp_extensions.push(new MOTDExtension({ client_config: {} }));
  }
  connect_ws() {
    let subprotocol = this.wisp_version === 2 ? "wisp-v2" : void 0;
    this.ws = new WebSocket2(this.wisp_url, subprotocol);
    this.ws.binaryType = "arraybuffer";
    this.connecting = true;
    this.ws.onerror = () => {
      if (this.wisp_version === 2) {
        this.ws.onclose = null;
        this.cleanup();
        this.wisp_version = 1;
        this.connect_ws();
        return;
      }
      this.cleanup();
      this.onerror();
    };
    this.ws.onclose = () => {
      this.cleanup();
      this.onclose();
    };
    this.ws.onmessage = (event) => {
      this.on_ws_msg(event);
      if (this.connected && this.connecting) {
        this.connecting = false;
        this.onopen();
      }
    };
  }
  close() {
    this.ws.close();
  }
  create_stream(hostname, port, type = 1) {
    let stream_type = type;
    if (typeof stream_type === "string")
      stream_type = type === "udp" ? stream_types.UDP : stream_types.TCP;
    if (stream_type == stream_types.UDP && !this.udp_enabled) {
      throw new Error("udp is not enabled for this wisp connection");
    }
    let stream_id = this.next_stream_id++;
    let stream = new ClientStream(hostname, port, this.ws, this.max_buffer_size, stream_id, this, stream_type);
    this.active_streams[stream_id] = stream;
    stream.open = this.connected;
    let packet = new WispPacket({
      type: packet_types.CONNECT,
      stream_id,
      payload: new ConnectPayload({
        stream_type,
        port,
        hostname
      })
    });
    this.ws.send(packet.serialize().bytes);
    return stream;
  }
  close_stream(stream, reason) {
    stream.onclose(reason);
    delete this.active_streams[stream.stream_id];
  }
  on_ws_msg(event) {
    let buffer = new WispBuffer(new Uint8Array(event.data));
    if (buffer.size < WispPacket.min_size) {
      console.warn(`wisp client warning: received a packet which is too short`);
      return;
    }
    let packet = WispPacket.parse_all(buffer);
    let stream = this.active_streams[packet.stream_id];
    if (packet.stream_id === 0 && this.connecting) {
      if (packet.type === packet_types.CONTINUE) {
        this.max_buffer_size = packet.payload.buffer_remaining;
        this.connected = true;
        if (!this.info_received) {
          this.wisp_version = 1;
        }
      }
      if (packet.type === packet_types.INFO && this.wisp_version === 2) {
        let server_extensions = parse_extensions(packet.payload.extensions, this.wisp_extensions, "server");
        for (let server_ext of server_extensions) {
          for (let client_ext of this.wisp_extensions) {
            if (server_ext.id === client_ext.id) {
              this.server_exts[server_ext.id] = server_ext;
              this.client_exts[client_ext.id] = client_ext;
            }
          }
        }
        this.info_received = true;
        this.server_motd = this.server_exts[MOTDExtension.id]?.payload?.message;
        this.udp_enabled = !!this.server_exts[UDPExtension.id];
        let ext_buffer = serialize_extensions(this.wisp_extensions);
        let info_packet = new WispPacket({
          type: InfoPayload.type,
          stream_id: 0,
          payload: new InfoPayload({
            major_ver: this.wisp_version,
            minor_ver: 0,
            extensions: ext_buffer
          })
        });
        this.ws.send(info_packet.serialize().bytes);
      }
      return;
    }
    if (typeof stream === "undefined") {
      console.warn(`wisp client warning: received a ${packet_classes[packet.type].name} packet for a stream which doesn't exist`);
      return;
    }
    if (packet.type === packet_types.DATA) {
      stream.onmessage(packet.payload_bytes.bytes);
    } else if (packet.type === packet_types.CONTINUE) {
      stream.continue_received(packet.payload.buffer_remaining);
    } else if (packet.type === packet_types.CLOSE) {
      this.close_stream(stream, packet.payload.reason);
    } else {
      console.warn(`wisp client warning: received an invalid packet of type ${packet.type}`);
    }
  }
  cleanup() {
    this.connected = false;
    this.connecting = false;
    for (let stream_id of Object.keys(this.active_streams)) {
      this.close_stream(this.active_streams[stream_id], 3);
    }
  }
};

// resources/node_modules/@mercuryworkshop/wisp-js/src/client/polyfill.mjs
var RealCloseEvent = global_this.CloseEvent || Event;
var _wisp_connections = {};
var WispWebSocket = class extends EventTarget {
  constructor(url, protocols = null, options = {}) {
    super();
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    this.binaryType = "blob";
    this.stream = null;
    this.connection = null;
    this.onopen = () => {
    };
    this.onerror = () => {
    };
    this.onmessage = () => {
    };
    this.onclose = () => {
    };
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;
    this._ready_state = this.CONNECTING;
    let url_split = this.url.split("/");
    let wsproxy_path = url_split.pop().split(":");
    this.host = wsproxy_path[0];
    this.port = parseInt(wsproxy_path[1]);
    this.real_url = url_split.join("/") + "/";
    this.init_connection();
  }
  on_conn_close() {
    this._ready_state = this.CLOSED;
    if (_wisp_connections[this.real_url]) {
      this.onerror(new Event("error"));
      this.dispatchEvent(new Event("error"));
    }
    delete _wisp_connections[this.real_url];
  }
  init_connection() {
    this.connection = _wisp_connections[this.real_url];
    if (!this.connection) {
      this.connection = new ClientConnection(this.real_url, this.options);
      this.connection.onopen = () => {
        this.init_stream();
      };
      this.connection.onclose = () => {
        this.on_conn_close();
      };
      this.connection.onerror = () => {
        this.on_conn_close();
      };
      _wisp_connections[this.real_url] = this.connection;
    } else if (!this.connection.connected) {
      let old_onopen = this.connection.onopen;
      this.connection.onopen = () => {
        old_onopen();
        this.init_stream();
      };
    } else {
      this.connection = _wisp_connections[this.real_url];
      this.init_stream();
    }
  }
  init_stream() {
    this._ready_state = this.OPEN;
    this.stream = this.connection.create_stream(this.host, this.port);
    this.stream.onmessage = (raw_data) => {
      let data;
      if (this.binaryType == "blob") {
        data = new Blob(raw_data);
      } else if (this.binaryType == "arraybuffer") {
        data = raw_data.buffer;
      } else {
        throw "invalid binaryType string";
      }
      let msg_event = new MessageEvent("message", { data });
      this.onmessage(msg_event);
      this.dispatchEvent(msg_event);
    };
    this.stream.onclose = (reason) => {
      this._ready_state = this.CLOSED;
      let close_event = new RealCloseEvent("close", { code: reason });
      this.onclose(close_event);
      this.dispatchEvent(close_event);
    };
    let open_event = new Event("open");
    this.onopen(open_event);
    this.dispatchEvent(open_event);
  }
  send(data) {
    let data_array;
    if (data instanceof Uint8Array) {
      data_array = data;
    } else if (typeof data === "string") {
      data_array = new TextEncoder().encode(data);
    } else if (data instanceof Blob) {
      data.arrayBuffer().then((array_buffer) => {
        this.send(array_buffer);
      });
      return;
    } else if (data instanceof ArrayBuffer) {
      data_array = new Uint8Array(data);
    } else if (ArrayBuffer.isView(data)) {
      data_array = new Uint8Array(data.buffer);
    } else {
      throw "invalid data type to be sent";
    }
    if (!this.stream) {
      throw "websocket is not ready";
    }
    this.stream.send(data_array);
  }
  close() {
    this.stream.close(2);
  }
  get bufferedAmount() {
    let total = 0;
    for (let msg of this.stream.send_buffer) {
      total += msg.length;
    }
    return total;
  }
  get extensions() {
    return "";
  }
  get protocol() {
    return "binary";
  }
  get readyState() {
    return this._ready_state;
  }
};


// ../heyputer/firefox-wasm/gecko.js/js/index.ts
var DEFAULT_PROFILE_PATH = "gecko-profile";
var PROFILE_MOUNT = 1;
var GRE_MOUNT = 0;
var opfsAbs = (p) => "/opfs/" + p.replace(/^\/+|\/+$/g, "");
var ST = 0;
var W = 4;
var H = 8;
var RES = 12;
var LEN = 16;
var URLOFF = 20;
var OP = URLOFF + 8192;
var EVTYPE = OP + 4;
var EX = OP + 8;
var EY = OP + 12;
var BTN = OP + 16;
var BTNS = OP + 20;
var CLICKS = OP + 24;
var MODS = OP + 28;
var KEYCODE = OP + 32;
var CHARCODE = OP + 36;
var DX = OP + 40;
var DY = OP + 44;
var KEYVAL = OP + 48;
var CURSOR = KEYVAL + 64;
var OP_LOAD = 0;
var OP_MOUSE = 1;
var OP_KEY = 2;
var OP_WHEEL = 3;
var OP_PAINT = 4;
var OP_EVAL = 5;
var OP_CLIP_SET = 9;
var MOD_ALT = 1;
var MOD_CTRL = 2;
var MOD_SHIFT = 4;
var MOD_META = 8;
var CURSORS = [
  "none",
  "default",
  "pointer",
  "context-menu",
  "help",
  "progress",
  "wait",
  "cell",
  "crosshair",
  "text",
  "vertical-text",
  "alias",
  "copy",
  "move",
  "no-drop",
  "not-allowed",
  "grab",
  "grabbing",
  "e-resize",
  "n-resize",
  "ne-resize",
  "nw-resize",
  "s-resize",
  "se-resize",
  "sw-resize",
  "w-resize",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "col-resize",
  "row-resize",
  "all-scroll",
  "zoom-in",
  "zoom-out",
  "auto"
];
var toBlobUrl = (src) => URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
var _geckoUrl;
var geckoBlobUrl = () => _geckoUrl ??= toBlobUrl(geckoGlueSource);
var _engine;
function loadEngine() {
  return _engine ??= new Promise((resolve, reject) => {
    const have = globalThis.createGecko;
    if (have) return resolve(have);
    const s = document.createElement("script");
    s.src = geckoBlobUrl();
    s.async = true;
    s.onload = () => {
      const f = globalThis.createGecko;
      f ? resolve(f) : reject(new Error("gecko.js: engine evaluated but createGecko is missing"));
    };
    s.onerror = () => reject(new Error("gecko.js: failed to evaluate the bundled engine"));
    document.head.appendChild(s);
  });
}
function createGlBlit(canvas2, force) {
  const probe = document.createElement("canvas").getContext("webgl2");
  if (!probe) return null;
  const info = probe.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(probe.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : probe.RENDERER) || "");
  probe.getExtension("WEBGL_lose_context")?.loseContext();
  if (!force && /swiftshader|llvmpipe|softpipe|software|basic render|microsoft warp/i.test(renderer)) return null;
  const gl = canvas2.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const BAND = 16;
  let texW = 0, texH = 0, lost = false, all = true, direct = true;
  let bands = new Int32Array(0);
  let staging = null;
  const setup = () => {
    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, "#version 300 es\nin vec2 p; out vec2 uv; void main() { uv = vec2(p.x + 1.0, 1.0 - p.y) * 0.5; gl_Position = vec4(p, 0.0, 1.0); }"));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, "#version 300 es\nprecision mediump float; uniform sampler2D t; in vec2 uv; out vec4 o; void main() { o = vec4(texture(t, uv).bgr, 1.0); }"));
    gl.bindAttribLocation(prog, 0, "p");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("blit program: " + gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texW = texH = 0;
    all = true;
  };
  setup();
  canvas2.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
  });
  canvas2.addEventListener("webglcontextrestored", () => {
    lost = false;
    setup();
  });
  const upload = (heap2, off, y, w, h) => {
    const n = w * h * 4;
    if (direct) {
      try {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(heap2, off, n));
        return;
      } catch (e) {
        direct = false;
      }
    }
    if (!staging || staging.length < n) staging = new Uint8Array(n);
    const part = staging.subarray(0, n);
    part.set(new Uint8Array(heap2, off, n));
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, part);
  };
  return {
    invalidate() {
      all = true;
    },
    frame(heap2, ptr, W2, H2) {
      const nb = Math.ceil(H2 / BAND);
      if (bands.length !== nb) {
        bands = new Int32Array(nb);
        all = true;
      }
      const px = new Uint32Array(heap2, ptr, W2 * H2);
      let frameHash = 0, first = -1;
      let runs = [];
      for (let b = 0; b < nb; b++) {
        let h = 0;
        for (let i = b * BAND * W2, end = Math.min((b + 1) * BAND, H2) * W2; i < end; i++) h = Math.imul(h, 31) + px[i] | 0;
        frameHash = Math.imul(frameHash, 31) + h | 0;
        const changed = all || h !== bands[b];
        bands[b] = h;
        if (changed && first < 0) first = b;
        if (!changed && first >= 0) {
          runs.push(first, b);
          first = -1;
        }
      }
      if (first >= 0) runs.push(first, nb);
      if (lost) {
        all = true;
        return frameHash;
      }
      if (!runs.length) return frameHash;
      if (texW !== W2 || texH !== H2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W2, H2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        texW = W2;
        texH = H2;
        runs = [0, nb];
      }
      all = false;
      for (let r = 0; r < runs.length; r += 2) {
        const y0 = runs[r] * BAND, y1 = Math.min(runs[r + 1] * BAND, H2);
        upload(heap2, ptr + y0 * W2 * 4, y0, W2, y1 - y0);
      }
      gl.viewport(0, 0, W2, H2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return frameHash;
    }
  };
}
var Gecko = class {
  opts;
  canvas;
  ctx = null;
  gpu = false;
  W;
  /** Engine (device) pixels per CSS pixel, set by the page for its Resolution option. */
  cssScale = 1;
  H;
  mod = null;
  cmd = 0;
  queue = [];
  running = false;
  painting = false;
  enc = new TextEncoder();
  dec = new TextDecoder();
  blitImg = null;
  blitDst32 = null;
  coopFrameHash = 0;
  coopLastInput = 0;
  // GPU mode: the engine keeps popups (menus, context menus, panels, <select>
  // dropdowns) off the WebGL compositor and paints them into a separate BGRA
  // buffer; we draw that onto a 2D canvas stacked above #glout. (Software mode
  // composites popups into the main buffer, so this is GPU-only.)
  popupCtx = null;
  popupImg = null;
  popupDst32 = null;
  popupShown = false;
  detach = [];
  destroyed = false;
  /** Hash of the frame on the 2D canvas, valid until a resize or a context loss. */
  blitDrawnHash = 0;
  blitValid = false;
  /** The canvas box input positions are mapped through (refreshBox). */
  box = null;
  /** Software mode: the WebGL2 blitter (createGlBlit), or null for the 2D path. */
  glBlit = null;
  constructor(opts) {
    this.opts = opts;
    this.canvas = opts.canvas;
    this.W = opts.width ?? this.canvas.width ?? 800;
    this.H = opts.height ?? this.canvas.height ?? 600;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.gpu = !!this.opts.env?.GECKO_GPU;
    if (this.gpu) {
      if (this.canvas.id !== "screen") this.canvas.id = "screen";
    } else {
      this.glBlit = this.opts.env?.GECKO_BLIT_2D ? null : createGlBlit(this.canvas, !!this.opts.env?.GECKO_BLIT_GL);
      if (!this.glBlit) {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("gecko.js: canvas already has a non-2d context");
        this.ctx = ctx;
        this.canvas.addEventListener("contextrestored", () => {
          this.blitValid = false;
        });
      }
    }
  }
  /** Instantiate the engine, mount GRE files, and wait until it is ready. */
  async init() {
    if (this.gpu) this.setupGpuPresent();
    const print = this.opts.print ?? ((s) => console.log(s));
    const printErr = this.opts.printErr ?? ((s) => console.warn(s));
    if (!this.opts.wasm?.url) {
      throw new Error(
        "gecko.js: the `wasm` option is required \u2014 set it to where you serve the engine wasm, e.g. { url: '/gecko.wasm' } (or { url: '/gecko.wasm.zst', compressed: true })."
      );
    }
    const wasmUrl = this.opts.wasm.url;
    const wasmCompressed = this.opts.wasm.compressed ?? false;
    const createGecko = await loadEngine();
    let resolveReady;
    const ready = new Promise((r) => resolveReady = r);
    let profOpfsPath;
    let profProv;
    if (typeof this.opts.profile === "string") profOpfsPath = this.opts.profile;
    else if (this.opts.profile) profProv = this.opts.profile;
    else profOpfsPath = DEFAULT_PROFILE_PATH;
    let greOpfsPath;
    let greProv;
    if (typeof this.opts.fs === "string") greOpfsPath = this.opts.fs;
    else if (this.opts.fs) greProv = this.opts.fs;
    const moduleOpts = {
      print: (t) => {
        if (typeof t === "string" && t.includes("READY cmd=")) resolveReady();
        print(t);
      },
      printErr,
      onAbort: (w) => printErr("[libxul] abort: " + w),
      preRun: [(m) => {
        if (greOpfsPath || profOpfsPath) m.ENV["GECKO_OPFS_MOUNT"] = "1";
        m.ENV["GRE_DIR"] = greOpfsPath ? opfsAbs(greOpfsPath) : greProv ? "/gre" : "/gre-baked";
        if (profOpfsPath) m.ENV["PROFILE_DIR"] = opfsAbs(profOpfsPath);
        m.ENV["MOZ_FORCE_DISABLE_E10S"] = "1";
        const hostMatchMedia = globalThis.matchMedia;
        m.ENV["GECKO_DARK"] = hostMatchMedia && hostMatchMedia("(prefers-color-scheme: dark)").matches ? "1" : "0";
        for (const [k, v] of Object.entries(this.opts.env ?? {})) m.ENV[k] = v;
        m.WispClientConnection = client_exports.ClientConnection;
        if (this.opts.wispUrl) m.wispUrl = this.opts.wispUrl;
        const mm = m;
        mm.geckoProviders = {};
        if (profProv) {
          mm.geckoProviders[PROFILE_MOUNT] = profProv;
          m.ENV["GECKO_PROFILE_PROVIDER"] = "1";
        }
        if (greProv) {
          mm.geckoProviders[GRE_MOUNT] = greProv;
          m.ENV["GECKO_GRE_PROVIDER"] = "1";
        }
      }]
    };
    moduleOpts.mainScriptUrlOrBlob = geckoBlobUrl();
    if (this.opts.locateFile) moduleOpts.locateFile = this.opts.locateFile;
    {
      moduleOpts.getPreloadedPackage = () => globalThis.__driftData.buffer;
      moduleOpts.instantiateWasm = (imports, success) => {
        (async () => {
          const warm = globalThis.__driftModule;
          if (warm) {
            const instance = await WebAssembly.instantiate(warm, imports);
            success(instance, warm);
          } else {
            const r = await WebAssembly.instantiate(globalThis.__driftWasm, imports);
            success(r.instance, r.module);
          }
        })().catch((e) => printErr("[libxul] wasm instantiate failed: " + e));
        return {};
      };
    }
    this.mod = await createGecko(moduleOpts);
    await ready;
    this.cmd = this.mod._xul_cmd_ptr();
    if (this.opts.forwardInput !== false) this.attachInput();
    this.startPaintLoop();
  }
  /** Navigate the embedded engine to a URL (http(s):// fetched over WISP). */
  async load(url) {
    await this.run({ op: OP_LOAD, url });
  }
  /**
   * Resize the rendering surface. The engine reads the new dimensions from the
   * next command and reflows/recomposites to fit. Software mode resizes the 2D
   * canvas backing; GPU mode resizes the canvas box (the transferred #screen
   * drawing buffer is owned by the engine, so only its CSS size is set here) and
   * the #glout overlay follows. Safe to call repeatedly at runtime.
   */
  async resize(width, height) {
    this.W = Math.max(1, Math.round(width));
    this.H = Math.max(1, Math.round(height));
    if (this.gpu) {
      this.syncGpuSize();
    } else {
      this.canvas.width = this.W;
      this.canvas.height = this.H;
      this.blitImg = null;
      this.blitDst32 = null;
      this.blitValid = false;
      this.glBlit?.invalidate();
    }
    this.refreshBox();
    await this.run({ op: OP_PAINT });
  }
  /** Evaluate JS in the chrome context; returns the stringified result. */
  async evalChrome(js) {
    const r = await this.run({ op: OP_EVAL, url: js });
    return typeof r === "string" ? r : "";
  }
  /** Stop loops, detach input handlers. (The wasm module is not torn down.) */
  destroy() {
    this.running = false;
    this.destroyed = true;
    for (const d of this.detach) d();
    this.detach = [];
  }
  // ---- command protocol --------------------------------------------------
  run(item) {
    if (item.op !== OP_PAINT) this.coopLastInput = performance.now();
    return new Promise((resolve) => {
      item.resolve = resolve;
      let at = this.queue.length;
      if (item.op !== OP_PAINT) while (at > 0 && this.queue[at - 1].op === OP_PAINT) at--;
      const last = this.queue[at - 1];
      if (item.op === OP_MOUSE && item.evType === 0 && last && last.op === OP_MOUSE && last.evType === 0) {
        last.resolve?.(null);
        this.queue[at - 1] = item;
      } else {
        this.queue.splice(at, 0, item);
      }
      this.pump();
    });
  }
  async pump() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length) {
      const item = this.queue.shift();
      const r = await this.runCmd(item);
      item.resolve?.(r);
    }
    this.running = false;
  }
  async runCmd(item) {
    if (item.press) {
      const js = `(() => { try { return typeof __fhtmlPress == 'function' ? __fhtmlPress(${item.x}, ${item.y}, ${item.button || 0}) : 'none'; } catch (e) { return 'none'; } })()`;
      if (await this.runCmd({ op: OP_EVAL, url: js }) !== "none") return null;
    }
    const m = this.mod;
    const i32 = () => m.HEAP32, u8 = () => m.HEAPU8;
    const set = (off, v) => {
      i32()[this.cmd + off >> 2] = v | 0;
    };
    set(W, this.W);
    set(H, this.H);
    set(OP, item.op);
    set(EVTYPE, item.evType || 0);
    set(EX, item.x || 0);
    set(EY, item.y || 0);
    set(BTN, item.button || 0);
    set(BTNS, item.buttons == null ? -1 : item.buttons);
    set(CLICKS, item.clickCount || 0);
    set(MODS, item.modifiers || 0);
    set(KEYCODE, item.keyCode || 0);
    set(CHARCODE, item.charCode || 0);
    set(DX, item.deltaX || 0);
    set(DY, item.deltaY || 0);
    if (item.op === OP_LOAD || item.op === OP_EVAL || item.op === OP_CLIP_SET) {
      const bytes = this.enc.encode(item.url || "");
      if (bytes.length >= 8190) return null;
      u8().set(bytes, this.cmd + URLOFF);
      u8()[this.cmd + URLOFF + bytes.length] = 0;
    }
    if (item.op === OP_KEY) {
      const kb = this.enc.encode(item.key || "");
      const n2 = Math.min(kb.length, 63);
      u8().set(kb.subarray(0, n2), this.cmd + KEYVAL);
      u8()[this.cmd + KEYVAL + n2] = 0;
    }
    Atomics.store(i32(), this.cmd + ST >> 2, 1);
    Atomics.notify(i32(), this.cmd + ST >> 2, 1);
    const start = performance.now();
    const at = this.cmd + ST >> 2, waitMs = item.op === OP_LOAD ? 20 : 1;
    let st = Atomics.load(i32(), at);
    while (st !== 3 && st !== -1 && performance.now() - start < 12e4) {
      let w = null;
      try {
        w = Atomics.waitAsync(i32(), at, st, waitMs);
      } catch {
      }
      if (w?.async) await w.value;
      else if (!w) await new Promise((r) => setTimeout(r, waitMs));
      st = Atomics.load(i32(), at);
    }
    if (st !== 3) return null;
    if (item.op >= 5 && item.op <= 8) {
      const resPtr = i32()[this.cmd + RES >> 2] >>> 0, len = i32()[this.cmd + LEN >> 2] >>> 0;
      return resPtr && len ? this.dec.decode(new Uint8Array(u8().subarray(resPtr, resPtr + len))) : "";
    }
    const n = this.blit();
    if (item.op === OP_MOUSE) {
      const ck = i32()[this.cmd + CURSOR >> 2];
      this.canvas.style.cursor = CURSORS[ck] || "auto";
    }
    return n;
  }
  // BGRA (engine) -> RGBA (canvas), a 32-bit word at a time, reusing one ImageData.
  blit() {
    const m = this.mod;
    const i32 = m.HEAP32, u8 = m.HEAPU8;
    const resPtr = i32[this.cmd + RES >> 2] >>> 0, len = i32[this.cmd + LEN >> 2] >>> 0;
    if (this.gpu) {
      this.drawPopupOverlay(resPtr, len);
      return 0;
    }
    if (this.glBlit) {
      if (!resPtr || !len || resPtr & 3 || len < this.W * this.H * 4 || resPtr + len > u8.buffer.byteLength) return 0;
      this.coopFrameHash = this.glBlit.frame(u8.buffer, resPtr, this.W, this.H);
      return 1;
    }
    if (!this.ctx) return 0;
    if (!resPtr || !len) return 0;
    if (!this.blitImg) {
      this.blitImg = this.ctx.createImageData(this.W, this.H);
      this.blitDst32 = new Uint32Array(this.blitImg.data.buffer);
    }
    const n = len >>> 2;
    if (resPtr & 3 || resPtr + len > u8.buffer.byteLength) return 0;
    const src32 = new Uint32Array(u8.buffer, resPtr, n);
    const dst = this.blitDst32;
    let nonWhite = 0;
    let hash = 0;
    for (let i = 0; i < n; i++) {
      const p = src32[i];
      dst[i] = p >>> 16 & 255 | p & 65280 | (p & 255) << 16 | 4278190080;
      if ((p & 16777215) !== 16777215) nonWhite++;
      hash = Math.imul(hash, 31) + p | 0;
    }
    this.coopFrameHash = hash;
    if (hash !== this.blitDrawnHash || !this.blitValid) {
      this.ctx.putImageData(this.blitImg, 0, 0);
      this.blitDrawnHash = hash;
      this.blitValid = true;
    }
    return nonWhite;
  }
  // GPU mode: draw the engine's popup overlay buffer (BGRA: transparent backdrop +
  // opaque popup pixels) onto the 2D #popup-overlay canvas above #glout. A null/empty
  // result means no popup is open -> clear the overlay (dismisses the last popup).
  // putImageData replaces the whole canvas, so a shrunken/moved popup leaves no trail.
  drawPopupOverlay(resPtr, len) {
    const octx = this.popupCtx;
    if (!octx) return;
    if (!resPtr || !len) {
      if (this.popupShown) {
        octx.clearRect(0, 0, this.W, this.H);
        this.popupShown = false;
      }
      return;
    }
    if (!this.popupImg || this.popupImg.width !== this.W || this.popupImg.height !== this.H) {
      this.popupImg = octx.createImageData(this.W, this.H);
      this.popupDst32 = new Uint32Array(this.popupImg.data.buffer);
    }
    const buf = this.mod.HEAPU8.buffer;
    const n = len >>> 2;
    if (resPtr & 3 || resPtr + len > buf.byteLength) return;
    const src32 = new Uint32Array(buf, resPtr, n);
    const dst = this.popupDst32;
    for (let i = 0; i < n; i++) {
      const p = src32[i];
      dst[i] = p >>> 16 & 255 | p & 65280 | (p & 255) << 16 | p & 4278190080;
    }
    octx.putImageData(this.popupImg, 0, 0);
    this.popupShown = true;
  }
  startPaintLoop() {
    if (!this.gpu) {
      let backoff = 0, lastChange = 0;
      let queued2 = false, timer = 0;
      const go = () => {
        queued2 = false;
        timer = 0;
        requestAnimationFrame(tick3);
      };
      const next2 = (ms) => {
        if (queued2 || this.destroyed) return;
        queued2 = true;
        if (ms) timer = setTimeout(go, ms);
        else go();
      };
      globalThis.__geckoNetWake = () => {
        if (!timer || backoff <= 50) return;
        clearTimeout(timer);
        backoff = 50;
        timer = setTimeout(go, 32);
      };
      const tick3 = async () => {
        if (!this.mod || this.destroyed || document.hidden) return;
        const before = this.coopFrameHash;
        await this.run({ op: OP_PAINT });
        if (!this.mod || this.destroyed) return;
        const now = performance.now();
        if (this.coopFrameHash !== before) lastChange = now;
        const busy = now - lastChange < 250 || now - this.coopLastInput < 1500;
        const net = now - (globalThis.__geckoNetAt || -1e9) < 1e3;
        backoff = busy ? 0 : Math.min(backoff ? backoff * 2 : 32, net ? 50 : 500);
        next2(backoff);
      };
      const onVisible2 = () => {
        if (!document.hidden) {
          backoff = 0;
          next2(0);
        }
      };
      document.addEventListener("visibilitychange", onVisible2);
      this.detach.push(() => document.removeEventListener("visibilitychange", onVisible2));
      next2(0);
      return;
    }
    const IDLE_POLL_MS = 250;
    let lastPull = 0;
    let queued = false;
    const next = (ms) => {
      if (queued || this.destroyed) return;
      queued = true;
      const go = () => {
        queued = false;
        requestAnimationFrame(tick2);
      };
      if (ms) setTimeout(go, ms);
      else go();
    };
    const tick2 = async (now) => {
      if (!this.mod || this.destroyed || document.hidden) return;
      const interval = this.popupShown ? 0 : IDLE_POLL_MS;
      if (now - lastPull >= interval) {
        lastPull = now;
        await this.run({ op: OP_PAINT });
      }
      if (!this.mod || this.destroyed) return;
      next(this.popupShown ? 0 : IDLE_POLL_MS);
    };
    const onVisible = () => {
      if (!document.hidden) {
        lastPull = 0;
        next(0);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    this.detach.push(() => document.removeEventListener("visibilitychange", onVisible));
    next(0);
  }
  // ---- input -------------------------------------------------------------
  // GPU mode renders to #screen's transferred OffscreenCanvas and presents to the
  // #screen placeholder directly (the engine's SwapBuffers JSPI-yields so the browser
  // implicit-presents it -- see gl-present.js). So #screen IS the visible surface; we
  // only add a transparent popup overlay above it, inside a relative wrapper so the
  // overlay tracks the canvas box at whatever size the embedder picks (and resize()).
  setupGpuPresent() {
    const c = this.canvas;
    let wrap = c.parentElement;
    if (!wrap || wrap.dataset.libxulGlwrap !== "1") {
      wrap = document.createElement("div");
      wrap.dataset.libxulGlwrap = "1";
      c.parentNode.insertBefore(wrap, c);
      wrap.appendChild(c);
    }
    wrap.style.position = "relative";
    wrap.style.display = "inline-block";
    wrap.style.lineHeight = "0";
    c.style.display = "block";
    let ov = document.getElementById("popup-overlay");
    if (!ov) {
      ov = document.createElement("canvas");
      ov.id = "popup-overlay";
      ov.style.position = "absolute";
      ov.style.left = "0";
      ov.style.top = "0";
      ov.style.zIndex = "2";
      ov.style.pointerEvents = "none";
      wrap.appendChild(ov);
    }
    this.popupCtx = ov.getContext("2d");
    this.syncGpuSize();
  }
  // Set every surface to the real pixel size (no CSS down/upscaling): the wrapper box,
  // the #screen box, and the popup overlay's backing AND css all equal W*H.
  syncGpuSize() {
    const c = this.canvas;
    const wrap = c.parentElement;
    if (wrap && wrap.dataset.libxulGlwrap === "1") {
      wrap.style.width = this.W + "px";
      wrap.style.height = this.H + "px";
    }
    c.style.width = this.W + "px";
    c.style.height = this.H + "px";
    const el = document.getElementById("popup-overlay");
    if (el) {
      el.width = this.W;
      el.height = this.H;
      el.style.width = this.W + "px";
      el.style.height = this.H + "px";
    }
    this.popupImg = null;
    this.popupShown = false;
  }
  mods(e) {
    return (e.altKey ? MOD_ALT : 0) | (e.ctrlKey ? MOD_CTRL : 0) | (e.shiftKey ? MOD_SHIFT : 0) | (e.metaKey ? MOD_META : 0);
  }
  touchCarry = { x: 0, y: 0 };
  /** Scroll what is under page point (clientX, clientY) by (dx, dy) CSS pixels (touch scrolling). */
  touchScroll(clientX, clientY, dx, dy) {
    const p = this.xy({ clientX, clientY });
    const cx = this.touchCarry.x + dx * this.cssScale;
    const cy = this.touchCarry.y + dy * this.cssScale;
    const ix = Math.trunc(cx), iy = Math.trunc(cy);
    this.touchCarry = { x: cx - ix, y: cy - iy };
    if (!ix && !iy) return Promise.resolve(null);
    return this.run({ op: OP_WHEEL, x: p.x, y: p.y, deltaX: ix, deltaY: iy, modifiers: 0 });
  }
  /** Measure the canvas box page positions are mapped through (again after it moves). */
  refreshBox() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    this.box = r;
    return r;
  }
  xy(e) {
    const r = this.box ?? this.refreshBox() ?? this.canvas.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - r.left) * (this.W / r.width) / this.cssScale),
      y: Math.round((e.clientY - r.top) * (this.H / r.height) / this.cssScale)
    };
  }
  attachInput() {
    const c = this.canvas;
    const on = (t, h) => {
      c.addEventListener(t, h);
      this.detach.push(() => c.removeEventListener(t, h));
    };
    const onResize = () => {
      this.refreshBox();
    };
    addEventListener("resize", onResize);
    this.detach.push(() => removeEventListener("resize", onResize));
    on("mousemove", (e) => {
      const p = this.xy(e);
      this.run({ op: OP_MOUSE, evType: 0, x: p.x, y: p.y, buttons: e.buttons, modifiers: this.mods(e) });
    });
    on("mousedown", (e) => {
      c.focus();
      const p = this.xy(e);
      this.run({ op: OP_MOUSE, evType: 1, x: p.x, y: p.y, button: e.button, buttons: e.buttons, clickCount: e.detail, modifiers: this.mods(e), press: this.cssScale !== 1 });
    });
    on("mouseup", (e) => {
      const p = this.xy(e);
      this.run({ op: OP_MOUSE, evType: 2, x: p.x, y: p.y, button: e.button, buttons: e.buttons, clickCount: e.detail, modifiers: this.mods(e) });
    });
    on("contextmenu", (e) => {
      e.preventDefault();
      const p = this.xy(e);
      this.run({ op: OP_MOUSE, evType: 3, x: p.x, y: p.y, button: 2, buttons: e.buttons, modifiers: this.mods(e) });
    });
    on("wheel", (e) => {
      const p = this.xy(e);
      this.run({ op: OP_WHEEL, x: p.x, y: p.y, deltaX: e.deltaX * this.cssScale, deltaY: e.deltaY * this.cssScale, modifiers: this.mods(e) });
      e.preventDefault();
    });
    const keyItem = (e, evType) => ({
      op: OP_KEY,
      evType,
      key: e.key,
      keyCode: e.keyCode,
      charCode: e.key.length === 1 ? e.key.codePointAt(0) : 0,
      modifiers: this.mods(e)
    });
    on("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        void this.pasteThenKey(keyItem(e, 0));
        return;
      }
      this.run(keyItem(e, 0));
      e.preventDefault();
    });
    on("keyup", (e) => {
      this.run(keyItem(e, 1));
      e.preventDefault();
    });
    if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "0");
  }
  // Prime the engine's clipboard from the system clipboard, then forward the paste
  // key. The serial command queue guarantees the OP_CLIP_SET lands before the key,
  // so the engine's native cmd_paste reads the just-written text.
  async pasteThenKey(key) {
    try {
      const text = navigator.clipboard?.readText ? await navigator.clipboard.readText() : "";
      if (text) await this.run({ op: OP_CLIP_SET, url: text });
    } catch (e) {
      (this.opts.printErr ?? ((s) => console.warn(s)))(
        "[libxul] clipboard read: " + (e instanceof Error ? e.message : String(e))
      );
    }
    this.run(key);
  }
};



// ---- Drift host ---------------------------------------------------------
// The driver's engine loader evaluates this source with a blob URL and reads
// the asset metadata; the launcher used to fill them from embedded blobs.
var geckoGlueSource = "";
var geckoAssetsMeta = { dataCompressed: false, dataSize: 0, wasmCompressed: false, wasmSize: 0 };

function driftFileProvider(chrome, index, overlay) {
  var normalize = function (p) { return String(p).split("/").filter(Boolean).join("/"); };
  var dirs = new Map(index.dirs);
  for (var key of overlay.keys()) {
    var parts = key.split("/").filter(Boolean);
    var dir = "";
    for (var i = 0; i < parts.length - 1; i += 1) {
      dir = dir ? dir + "/" + parts[i] : parts[i];
      if (!dirs.has(dir)) dirs.set(dir, new Set());
      var parent = i === 0 ? "" : parts.slice(0, i).join("/");
      if (!dirs.has(parent)) dirs.set(parent, new Set());
      dirs.get(parent).add(parts[i]);
    }
  }
  var bytesOf = function (p) {
    if (overlay.has(p)) return overlay.get(p);
    var entry = index.files.get(p);
    if (!entry) return null;
    return chrome.subarray(entry.offset, entry.offset + entry.size);
  };
  return {
    stat: function (path) {
      var p = normalize(path);
      var file = bytesOf(p);
      if (file) return Promise.resolve({ size: file.byteLength, isDir: false });
      if (dirs.has(p)) return Promise.resolve({ size: 0, isDir: true });
      return Promise.resolve(null);
    },
    readdir: function (path) {
      var p = normalize(path);
      var children = dirs.get(p);
      if (!children) return Promise.reject(new Error("chrome-assets: no such directory " + path));
      return Promise.resolve(Array.from(children));
    },
    readFile: function (path) {
      var p = normalize(path);
      var file = bytesOf(p);
      if (!file) return Promise.reject(new Error("chrome-assets: no such file " + path));
      return Promise.resolve(file);
    }
  };
}

export async function createGecko(o) {
  geckoGlueSource = o.glue;
  geckoAssetsMeta = {
    dataCompressed: false,
    dataSize: o.data.byteLength,
    wasmCompressed: false,
    wasmSize: o.wasm.byteLength
  };
  globalThis.__driftData = o.data;
  globalThis.__driftWasm = o.wasm;
  globalThis.__driftModule = o.module || null;

  var overlay = new Map();
  for (var pair of o.files || []) overlay.set(pair[0], pair[1]);
  var provider = driftFileProvider(o.chrome, o.chromeIndex, overlay);

  // A page can override engine environment for a probe without rebuilding the
  // adapter; normal boots use the environment the loader derived.
  var env = Object.assign({}, o.env || {}, globalThis.__driftGeckoEnv || {});

  // First local boot runs the software path so a canvas context is never the
  // reason a page stays blank; GPU blitting can be re-enabled once it is known
  // to work on the target machine.
  delete env.GECKO_GPU;
  delete env.GECKO_GL_PASSTHROUGH;
  delete env.GECKO_WR_DIRECT;

  var engine = new Gecko({
    canvas: o.canvas,
    width: o.width,
    height: o.height,
    wasm: { url: "drift" },
    env: env,
    fs: provider,
    profile: "profile",
    wispUrl: o.wispUrl,
    print: function (s) { if (o.log) o.log(String(s)); },
    printErr: function (s) { if (o.log) o.log(String(s)); }
  });

  // With GECKO_CHROME unset the embed builds no browser window at all: it
  // paints the page straight onto the canvas, so there is no front-end to hide
  // and no chrome global to read state from. Navigation is the adapter's own
  // history, and the engine loads exactly the addresses it is handed.
  await engine.init();

  var state = { url: "", title: "", loading: false };
  var entries = [];
  var cursor = -1;

  function open(url) {
    state.url = url;
    state.loading = true;
    return engine.load(url).then(
      function () { state.loading = false; },
      function (error) { state.loading = false; throw error; }
    );
  }

  function travel(next) {
    if (next < 0 || next >= entries.length || next === cursor) return;
    cursor = next;
    void open(entries[cursor]);
  }

  return {
    load: function (url) {
      if (entries[cursor] !== url) {
        entries = entries.slice(0, cursor + 1);
        entries.push(url);
        cursor = entries.length - 1;
      }
      return open(url);
    },
    back: function () { travel(cursor - 1); },
    forward: function () { travel(cursor + 1); },
    reload: function () { if (state.url) void open(state.url); },
    state: function () { return state; },
    resize: function (width, height) { return engine.resize(width, height); },
    destroy: function () { engine.destroy(); }
  };
}
