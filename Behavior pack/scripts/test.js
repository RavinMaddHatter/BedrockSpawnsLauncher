var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/ts.cryptojs256/ts.cryptojs256.js
var require_ts_cryptojs256 = __commonJS({
  "node_modules/ts.cryptojs256/ts.cryptojs256.js"(exports) {
    var CryptoJS = CryptoJS || function(h, s) {
      var f = {}, g = f.lib = {}, q = function() {
      }, m = g.Base = { extend: function(a) {
        q.prototype = this;
        var c = new q();
        a && c.mixIn(a);
        c.hasOwnProperty("init") || (c.init = function() {
          c.$super.init.apply(this, arguments);
        });
        c.init.prototype = c;
        c.$super = this;
        return c;
      }, create: function() {
        var a = this.extend();
        a.init.apply(a, arguments);
        return a;
      }, init: function() {
      }, mixIn: function(a) {
        for (var c in a)
          a.hasOwnProperty(c) && (this[c] = a[c]);
        a.hasOwnProperty("toString") && (this.toString = a.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, r = g.WordArray = m.extend({ init: function(a, c) {
        a = this.words = a || [];
        this.sigBytes = c != s ? c : 4 * a.length;
      }, toString: function(a) {
        return (a || k).stringify(this);
      }, concat: function(a) {
        var c = this.words, d = a.words, b = this.sigBytes;
        a = a.sigBytes;
        this.clamp();
        if (b % 4)
          for (var e = 0; e < a; e++)
            c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
        else if (65535 < d.length)
          for (e = 0; e < a; e += 4)
            c[b + e >>> 2] = d[e >>> 2];
        else
          c.push.apply(c, d);
        this.sigBytes += a;
        return this;
      }, clamp: function() {
        var a = this.words, c = this.sigBytes;
        a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
        a.length = h.ceil(c / 4);
      }, clone: function() {
        var a = m.clone.call(this);
        a.words = this.words.slice(0);
        return a;
      }, random: function(a) {
        for (var c = [], d = 0; d < a; d += 4)
          c.push(4294967296 * h.random() | 0);
        return new r.init(c, a);
      } }), l = f.enc = {}, k = l.Hex = { stringify: function(a) {
        var c = a.words;
        a = a.sigBytes;
        for (var d = [], b = 0; b < a; b++) {
          var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
          d.push((e >>> 4).toString(16));
          d.push((e & 15).toString(16));
        }
        return d.join("");
      }, parse: function(a) {
        for (var c = a.length, d = [], b = 0; b < c; b += 2)
          d[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
        return new r.init(d, c / 2);
      } }, n = l.Latin1 = { stringify: function(a) {
        var c = a.words;
        a = a.sigBytes;
        for (var d = [], b = 0; b < a; b++)
          d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
        return d.join("");
      }, parse: function(a) {
        for (var c = a.length, d = [], b = 0; b < c; b++)
          d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
        return new r.init(d, c);
      } }, j = l.Utf8 = { stringify: function(a) {
        try {
          return decodeURIComponent(escape(n.stringify(a)));
        } catch (c) {
          throw Error("Malformed UTF-8 data");
        }
      }, parse: function(a) {
        return n.parse(unescape(encodeURIComponent(a)));
      } }, u = g.BufferedBlockAlgorithm = m.extend({ reset: function() {
        this._data = new r.init();
        this._nDataBytes = 0;
      }, _append: function(a) {
        "string" == typeof a && (a = j.parse(a));
        this._data.concat(a);
        this._nDataBytes += a.sigBytes;
      }, _process: function(a) {
        var c = this._data, d = c.words, b = c.sigBytes, e = this.blockSize, f2 = b / (4 * e), f2 = a ? h.ceil(f2) : h.max((f2 | 0) - this._minBufferSize, 0);
        a = f2 * e;
        b = h.min(4 * a, b);
        if (a) {
          for (var g2 = 0; g2 < a; g2 += e)
            this._doProcessBlock(d, g2);
          g2 = d.splice(0, a);
          c.sigBytes -= b;
        }
        return new r.init(g2, b);
      }, clone: function() {
        var a = m.clone.call(this);
        a._data = this._data.clone();
        return a;
      }, _minBufferSize: 0 });
      g.Hasher = u.extend({ cfg: m.extend(), init: function(a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      }, reset: function() {
        u.reset.call(this);
        this._doReset();
      }, update: function(a) {
        this._append(a);
        this._process();
        return this;
      }, finalize: function(a) {
        a && this._append(a);
        return this._doFinalize();
      }, blockSize: 16, _createHelper: function(a) {
        return function(c, d) {
          return new a.init(d).finalize(c);
        };
      }, _createHmacHelper: function(a) {
        return function(c, d) {
          return new t.HMAC.init(a, d).finalize(c);
        };
      } });
      var t = f.algo = {};
      return f;
    }(Math);
    (function(h) {
      for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function(a2) {
        return 4294967296 * (a2 - (a2 | 0)) | 0;
      }, k = 2, n = 0; 64 > n; ) {
        var j;
        a: {
          j = k;
          for (var u = h.sqrt(j), t = 2; t <= u; t++)
            if (!(j % t)) {
              j = false;
              break a;
            }
          j = true;
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++;
      }
      var a = [], f = f.SHA256 = q.extend({ _doReset: function() {
        this._hash = new g.init(m.slice(0));
      }, _doProcessBlock: function(c, d) {
        for (var b = this._hash.words, e = b[0], f2 = b[1], g2 = b[2], j2 = b[3], h2 = b[4], m2 = b[5], n2 = b[6], q2 = b[7], p = 0; 64 > p; p++) {
          if (16 > p)
            a[p] = c[d + p] | 0;
          else {
            var k2 = a[p - 15], l2 = a[p - 2];
            a[p] = ((k2 << 25 | k2 >>> 7) ^ (k2 << 14 | k2 >>> 18) ^ k2 >>> 3) + a[p - 7] + ((l2 << 15 | l2 >>> 17) ^ (l2 << 13 | l2 >>> 19) ^ l2 >>> 10) + a[p - 16];
          }
          k2 = q2 + ((h2 << 26 | h2 >>> 6) ^ (h2 << 21 | h2 >>> 11) ^ (h2 << 7 | h2 >>> 25)) + (h2 & m2 ^ ~h2 & n2) + r[p] + a[p];
          l2 = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f2 ^ e & g2 ^ f2 & g2);
          q2 = n2;
          n2 = m2;
          m2 = h2;
          h2 = j2 + k2 | 0;
          j2 = g2;
          g2 = f2;
          f2 = e;
          e = k2 + l2 | 0;
        }
        b[0] = b[0] + e | 0;
        b[1] = b[1] + f2 | 0;
        b[2] = b[2] + g2 | 0;
        b[3] = b[3] + j2 | 0;
        b[4] = b[4] + h2 | 0;
        b[5] = b[5] + m2 | 0;
        b[6] = b[6] + n2 | 0;
        b[7] = b[7] + q2 | 0;
      }, _doFinalize: function() {
        var a2 = this._data, d = a2.words, b = 8 * this._nDataBytes, e = 8 * a2.sigBytes;
        d[e >>> 5] |= 128 << 24 - e % 32;
        d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
        d[(e + 64 >>> 9 << 4) + 15] = b;
        a2.sigBytes = 4 * d.length;
        this._process();
        return this._hash;
      }, clone: function() {
        var a2 = q.clone.call(this);
        a2._hash = this._hash.clone();
        return a2;
      } });
      s.SHA256 = q._createHelper(f);
      s.HmacSHA256 = q._createHmacHelper(f);
    })(Math);
    (function() {
      var h = CryptoJS, s = h.enc.Utf8;
      h.algo.HMAC = h.lib.Base.extend({ init: function(f, g) {
        f = this._hasher = new f.init();
        "string" == typeof g && (g = s.parse(g));
        var h2 = f.blockSize, m = 4 * h2;
        g.sigBytes > m && (g = f.finalize(g));
        g.clamp();
        for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h2; j++)
          k[j] ^= 1549556828, n[j] ^= 909522486;
        r.sigBytes = l.sigBytes = m;
        this.reset();
      }, reset: function() {
        var f = this._hasher;
        f.reset();
        f.update(this._iKey);
      }, update: function(f) {
        this._hasher.update(f);
        return this;
      }, finalize: function(f) {
        var g = this._hasher;
        f = g.finalize(f);
        g.reset();
        return g.finalize(this._oKey.clone().concat(f));
      } });
    })();
    (function() {
      var h = CryptoJS, j = h.lib.WordArray;
      h.enc.Base64 = { stringify: function(b) {
        var e = b.words, f = b.sigBytes, c = this._map;
        b.clamp();
        b = [];
        for (var a = 0; a < f; a += 3)
          for (var d = (e[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++)
            b.push(c.charAt(d >>> 6 * (3 - g) & 63));
        if (e = c.charAt(64))
          for (; b.length % 4; )
            b.push(e);
        return b.join("");
      }, parse: function(b) {
        var e = b.length, f = this._map, c = f.charAt(64);
        c && (c = b.indexOf(c), -1 != c && (e = c));
        for (var c = [], a = 0, d = 0; d < e; d++)
          if (d % 4) {
            var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4), h2 = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4);
            c[a >>> 2] |= (g | h2) << 24 - 8 * (a % 4);
            a++;
          }
        return j.create(c, a);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    })();
    (function(h) {
      for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function(a2) {
        return 4294967296 * (a2 - (a2 | 0)) | 0;
      }, k = 2, n = 0; 64 > n; ) {
        var j;
        a: {
          j = k;
          for (var u = h.sqrt(j), t = 2; t <= u; t++)
            if (!(j % t)) {
              j = false;
              break a;
            }
          j = true;
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++;
      }
      var a = [], f = f.SHA256 = q.extend({ _doReset: function() {
        this._hash = new g.init(m.slice(0));
      }, _doProcessBlock: function(c, d) {
        for (var b = this._hash.words, e = b[0], f2 = b[1], g2 = b[2], j2 = b[3], h2 = b[4], m2 = b[5], n2 = b[6], q2 = b[7], p = 0; 64 > p; p++) {
          if (16 > p)
            a[p] = c[d + p] | 0;
          else {
            var k2 = a[p - 15], l2 = a[p - 2];
            a[p] = ((k2 << 25 | k2 >>> 7) ^ (k2 << 14 | k2 >>> 18) ^ k2 >>> 3) + a[p - 7] + ((l2 << 15 | l2 >>> 17) ^ (l2 << 13 | l2 >>> 19) ^ l2 >>> 10) + a[p - 16];
          }
          k2 = q2 + ((h2 << 26 | h2 >>> 6) ^ (h2 << 21 | h2 >>> 11) ^ (h2 << 7 | h2 >>> 25)) + (h2 & m2 ^ ~h2 & n2) + r[p] + a[p];
          l2 = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f2 ^ e & g2 ^ f2 & g2);
          q2 = n2;
          n2 = m2;
          m2 = h2;
          h2 = j2 + k2 | 0;
          j2 = g2;
          g2 = f2;
          f2 = e;
          e = k2 + l2 | 0;
        }
        b[0] = b[0] + e | 0;
        b[1] = b[1] + f2 | 0;
        b[2] = b[2] + g2 | 0;
        b[3] = b[3] + j2 | 0;
        b[4] = b[4] + h2 | 0;
        b[5] = b[5] + m2 | 0;
        b[6] = b[6] + n2 | 0;
        b[7] = b[7] + q2 | 0;
      }, _doFinalize: function() {
        var a2 = this._data, d = a2.words, b = 8 * this._nDataBytes, e = 8 * a2.sigBytes;
        d[e >>> 5] |= 128 << 24 - e % 32;
        d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
        d[(e + 64 >>> 9 << 4) + 15] = b;
        a2.sigBytes = 4 * d.length;
        this._process();
        return this._hash;
      }, clone: function() {
        var a2 = q.clone.call(this);
        a2._hash = this._hash.clone();
        return a2;
      } });
      s.SHA256 = q._createHelper(f);
      s.HmacSHA256 = q._createHmacHelper(f);
    })(Math);
    exports.enc = {
      Base64: CryptoJS.enc.Base64,
      Utf8: CryptoJS.enc.Utf8,
      Latin1: CryptoJS.enc.Latin1
    };
    exports.SHA256 = CryptoJS.SHA256;
    exports.HmacSHA256 = CryptoJS.HmacSHA256;
  }
});

// node_modules/jwt-encode/src/index.js
var require_src = __commonJS({
  "node_modules/jwt-encode/src/index.js"(exports, module) {
    var CryptoJS = require_ts_cryptojs256();
    var defaultHeader = { alg: "HS256", typ: "JWT" };
    function base64url(data) {
      return CryptoJS.enc.Base64.stringify(data).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function sign2(data, secret2, options = {}) {
      const header = Object.assign(defaultHeader, options);
      if (header.alg !== "HS256" && header.typ !== "JWT") {
        throw new Error("jwt-encode only support the HS256 algorithm and the JWT type of hash");
      }
      const encodedHeader = encode(header);
      const encodedData = encode(data);
      let signature = `${encodedHeader}.${encodedData}`;
      signature = CryptoJS.HmacSHA256(signature, secret2);
      signature = base64url(signature);
      return `${encodedHeader}.${encodedData}.${signature}`;
    }
    function encode(data) {
      const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
      return base64url(stringifiedData);
    }
    module.exports = sign2;
  }
});

// test.jsx
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "mojang-net";
import { world, EntityQueryOptions, BlockLocation, Location } from "mojang-minecraft";
import { variables } from "mojang-minecraft-server-admin";
var sign = require_src();
var lastComandTime = Date.now();
var connected = false;
var connectTime = 0;
var slowMode = false;
var commandQueue = {};
var secret = variables.get("key");
var serverName = variables.get("severName");
var nickName = variables.get("nickName");
var owner = variables.get("owner");
var endpoint = "https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup";
var completedRedeems = [];
function parseModCommands(eventData) {
  if (eventData.sender.hasTag("host")) {
    if (eventData.message.includes("!help")) {
      eventData.cancel = true;
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " !connect: This command starts the connection to the Twitch Spawns Server. BDS will stay connected for 10 hours, until server restart or until disconnect is commanded");
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " !disconnect: If the BDS instance is connected, the connection is droped, this does not clear the que of commands");
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " !dump: Deletes all pending commands, this is not recoverable.");
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " !slow: Caps the redeems per section to 1 per second. ");
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " !normal: returns to running all redeems as soon as they are recieved");
    }
    if (eventData.message.includes("!connect")) {
      eventData.cancel = true;
      if (connected) {
        world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " timeout reset, 10 hours until disconnect");
      } else {
        world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " attempting connection");
        connectTime = Date.now();
        connected = true;
      }
    }
    if (eventData.message.includes("!disconnect")) {
      eventData.cancel = true;
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " disconnected");
      connected = false;
    }
    if (eventData.message.includes("!dump")) {
      eventData.cancel = true;
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " NOT IMPLMENTED");
    }
    if (eventData.message.includes("!normal")) {
      eventData.cancel = true;
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " slow mode active");
      slowMode = false;
    }
    if (eventData.message.includes("!slow")) {
      eventData.cancel = true;
      world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " slow mode active");
      slowMode = true;
    }
  }
}
function getCommandsFromServer() {
  var payload = {};
  payload["exp"] = Date.now() + 60;
  payload["serverName"] = serverName;
  payload["completed"] = completedRedeems;
  var token = "Bearer " + sign(payload, secret);
  console.log(completedRedeems);
  console.log(token);
  const request = new HttpRequest(endpoint);
  request.headers = [new HttpHeader("authorizationtoken", token)];
  request.method = HttpRequestMethod.GET;
  request.setTimeout(2);
  http.request(request).then((res) => {
    const { body, headers, request: request2, status } = res;
    var data = JSON.parse(body);
    console.log(JSON.stringify(data["redeems"]));
    var commandTimestamps = Object.keys(data["redeems"]);
    commandTimestamps.sort();
    for (var i = 0; i < commandTimestamps.length; i++) {
      var inqueue = Object.keys(commandQueue);
      if (!(commandTimestamps[i] in commandQueue)) {
        if (!completedRedeems.includes(commandTimestamps[i])) {
          commandQueue[commandTimestamps[i]] = data["redeems"][commandTimestamps[i]];
        }
      }
    }
    completedRedeems = completedRedeems.filter((el) => !data["completed"].includes(el));
  }).catch((err) => {
    console.error(err);
  });
}
function pollCommand() {
  var numCommands = 0;
  if (Date.now() / 1e3 > lastComandTime + 36e3 * 1e3) {
    connected = false;
  }
  getCommandsFromServer();
  var commandTimestamps = Object.keys(commandQueue);
  if (slowMode && commandTimestamps.length > 1) {
    numCommands = 1;
  } else {
    numCommands = commandTimestamps.length;
  }
  for (var i = 0; i < numCommands; i++) {
    var commandTimeStamp = commandTimestamps[i];
    var redeem = commandQueue[commandTimeStamp];
    completedRedeems.push(commandTimeStamp);
    delete commandQueue[commandTimeStamp];
    for (var j = 0; j < redeem.length; j++) {
      var cmd = redeem[j];
      world.getDimension("overworld").runCommand(cmd);
    }
  }
}
world.events.tick.subscribe(() => {
  if (Date.now() > lastComandTime + 2e3) {
    lastComandTime = Date.now();
    if (connected) {
      pollCommand();
    }
  }
});
world.events.beforeChat.subscribe((eventData) => {
  if (eventData.message.includes("!help")) {
    eventData.cancel = true;
    world.getDimension("overworld").runCommand("tell " + eventData.sender.name + " HELP: You have the permissions to run the following commands");
  }
  parseModCommands(eventData);
});
