if ("undefined" != typeof module && module.hasOwnProperty("exports"))
    var exports = module.exports;
else
    void 0 !== exports && Object.defineProperty(exports, "__esModule", {
        value: !0
    });
var ClassHelper = function() {
    function e() {}
    function t(t) {
        function i() {
            this.initialize.apply(this, arguments)
        }
        return t && (e.prototype = t.prototype,
        i.prototype = new e,
        e.prototype = {}),
        i.prototype.constructor = i,
        i._isConstructor = !0,
        i
    }
    function i() {}
    function s(e) {
        var t, i, s, n, r, a;
        if (t = "function" == typeof e ? e.$super : e.callee.$super)
            if (1 == arguments.length)
                a = t.call(this);
            else {
                for (s = arguments.length - 1,
                i = new Array(s),
                n = 1,
                r = 0; r < s; )
                    i[r++] = arguments[n++];
                a = t.apply(this, i)
            }
        return a
    }
    function n(e) {
        var t, i, s;
        t = [],
        s = 0;
        for (i in e)
            t[s++] = i;
        return r && void 0 !== e.toString && (t[s++] = "toString"),
        a && void 0 !== e.valueOf && (t[s++] = "valueOf"),
        t
    }
    var r, a;
    return function() {
        var e;
        r = a = !0;
        for (e in {
            toString: !0,
            valueOf: !0
        })
            "toString" == e && (r = !1),
            "valueOf" == e && (a = !1)
    }(),
    {
        makeClass: function() {
            var e, r, a, o, l, h, u, d, c;
            for ("function" == typeof arguments[r = 0] && arguments[r]._isConstructor && (e = arguments[r++]),
            a = t(e); r < arguments.length; )
                for ("function" == typeof (o = arguments[r++]) && (o = o()),
                h = (l = n(o)).length - 1; h >= 0; --h)
                    d = o[u = l[h]],
                    e && "function" == typeof d && !d._isMixinFunction && "function" == typeof (c = e.prototype[u]) && (d.$super = c),
                    a.prototype[u] = d;
            return "initialize"in a.prototype || (a.prototype.initialize = i),
            a.prototype.callSuper = s,
            a
        },
        makeMixin: function() {
            var e, t, i, s, r;
            for (e = {},
            t = 0; t < arguments.length; )
                for ("function" == typeof (i = arguments[t++]) && (i = i()),
                s = n(i),
                nameIndex = s.length - 1; nameIndex >= 0; --nameIndex)
                    name = s[nameIndex],
                    "function" == typeof (r = i[name]) && (r._isMixinFunction = !0),
                    e[name] = r;
            return e
        }
    }
}()
  , YSURL = ClassHelper.makeClass({
    initialize: function(e) {
        this._source = e,
        this._scheme = "",
        this._host = "",
        this._username = "",
        this._password = "",
        this._port = -1,
        this._path = "",
        this._query = "",
        this._fragment = "",
        this._parse()
    },
    auth: function() {
        var e = "";
        return "" !== this.userinfo() && (e += this.userinfo() + "@"),
        e += this.host(),
        "" !== this.host() && this.port() > -1 && (e += ":" + this.port()),
        e
    },
    fragment: function() {
        return this._fragment
    },
    host: function() {
        return this._host
    },
    path: function() {
        return this._path
    },
    port: function() {
        return this._port
    },
    scheme: function() {
        return this._scheme
    },
    source: function() {
        return this._source
    },
    userinfo: function() {
        if (!this._username)
            return "";
        var e = "";
        return e += this._username,
        e += ":" + this._password
    },
    query: function() {
        return this._query
    },
    queryByName: function(e) {
        if (this._query.length > 0) {
            var t = this._query.split("&");
            if (t.length > 0)
                for (var i = 0; i < t.length; i++) {
                    var s = t[i].split("=");
                    if (s.length > 0 && s[0] === e)
                        return s.length > 1 ? s[1] : ""
                }
        }
        return null
    },
    toString: function() {
        var e = "";
        return this.scheme() && (e += this.scheme() + ":"),
        this.auth() && (e += "//" + this.auth()),
        "" === this.auth() && "file" == this.scheme() && (e += "//"),
        e += this.path(),
        "" !== this.query() && (e += "?" + this.query()),
        "" !== this.fragment() && (e += "#" + this.fragment()),
        e
    },
    _parse: function() {
        var e = this._source;
        if (0 === e.length)
            throw new Error("Invalid URL supplied to YSURL");
        var t = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)([?]([^#]*))?(#(.*))?").exec(e);
        if (t[1] && t[2] && (this._scheme = t[2]),
        t[3]) {
            var i = t[4]
              , s = "";
            if (i.indexOf("@") > -1) {
                var n = i.split("@")[0];
                s = i.split("@")[1],
                -1 != n.indexOf(":") ? (this._username = n.split(":")[0],
                this._password = n.split(":")[1]) : this._username = n
            } else
                s = i;
            if (s.indexOf(":") > -1) {
                for (var r = s.split(":")[1], a = !0, o = 0; o < r.length; o++) {
                    var l = r.charAt(o);
                    if (l < "0" || l > "9") {
                        a = !1;
                        break
                    }
                }
                a && (s = s.split(":")[0],
                r && r.length > 0 && (this._port = parseInt(r, 10)))
            }
            this._host = s
        }
        t[5] && (this._path = t[5]),
        t[6] && (this._query = t[7]),
        t[8] && (this._fragment = t[9])
    }
});
YSURL.Base64Encode = function(e) {
    if (/([^\u0000-\u00ff])/.test(e))
        return e;
    var t, i, s, n, r, a, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", l = [], h = "";
    if ((i = e.length % 3) > 0)
        for (; i++ < 3; )
            h += "=",
            e += "\0";
    for (i = 0; i < e.length; i += 3)
        s = (t = e.charCodeAt(i) << 16 | e.charCodeAt(i + 1) << 8 | e.charCodeAt(i + 2)) >> 18 & 63,
        n = t >> 12 & 63,
        r = t >> 6 & 63,
        a = 63 & t,
        l[i / 3] = o.charAt(s) + o.charAt(n) + o.charAt(r) + o.charAt(a);
    return e = l.join(""),
    e = e.slice(0, e.length - h.length) + h
}
,
YSURL._r = /\\/g;
var ProtoAjax = {
    Browser: function() {
        if ("undefined" == typeof navigator || "undefined" == typeof window)
            return {
                IE: !1,
                Opera: !1,
                WebKit: !1,
                Gecko: !1,
                MobileSafari: !1
            };
        var e = navigator.userAgent
          , t = "[object Opera]" == Object.prototype.toString.call(window.opera);
        return {
            IE: e && !!window.attachEvent && !t,
            Opera: t,
            WebKit: e && e.indexOf("AppleWebKit/") > -1,
            Gecko: e && e.indexOf("Gecko") > -1 && -1 === e.indexOf("KHTML"),
            MobileSafari: e && /Apple.*Mobile/.test(e)
        }
    }(),
    getTransport: function() {
        if ("undefined" != typeof XMLHttpRequest)
            return new XMLHttpRequest;
        for (var e, t = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"], i = 0; i < t.length; i++)
            try {
                e = new ActiveXObject(t[i]);
                break
            } catch (e) {}
        return e
    },
    activeRequestCount: 0
};
ProtoAjax.Base = ClassHelper.makeClass({
    initialize: function(e) {
        this.options = {
            method: "post",
            asynchronous: !0,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: ""
        };
        for (var t in e)
            e.hasOwnProperty(t) && (this.options[t] = e[t]);
        this.options.method = this.options.method.toLowerCase()
    }
}),
ProtoAjax.Request = ClassHelper.makeClass(ProtoAjax.Base, {
    _complete: !1,
    initialize: function(e, t) {
        this.callSuper(this.initialize, t),
        this.transport = ProtoAjax.getTransport(),
        this.request(e)
    },
    request: function(e) {
        this.url = e,
        this.method = this.options.method;
        var t = this.options.parameters;
        "get" !== this.method && "post" !== this.method && (t += (t ? "&" : "") + "_method=" + this.method,
        this.method = "post"),
        t && "get" === this.method && (this.url += (this.url.include("?") ? "&" : "?") + t),
        this.parameters = t;
        try {
            var i = new ProtoAjax.Response(this);
            this.options.onCreate && this.options.onCreate(i),
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous),
            this.options.asynchronous && this.defer(this.respondToReadyState.bind(this, 1)),
            this.transport.onreadystatechange = this.onStateChange.bind(this),
            this.setRequestHeaders(),
            this.body = "post" == this.method ? this.options.postBody || t : null,
            this.transport.send(this.body),
            !this.options.asynchronous && this.transport.overrideMimeType && this.onStateChange()
        } catch (e) {
          console.error("ProtoAjax catchy", e);
        }
    },
    update: function(e, t) {
        for (var i = e.length, s = t.length; s--; )
            e[i + s] = t[s];
        return e
    },
    delay: function(e) {
        var t = this
          , i = Array.prototype.slice.call(arguments, 1);
        return e *= 1e3,
        setTimeout(function() {
            return t.apply(t, i)
        }, e)
    },
    defer: function(e) {
        var t = this.update([.01], arguments);
        return this.delay.apply(e, t)
    },
    onStateChange: function() {
        var e = this.transport.readyState;
        e > 1 && (4 != e || !this._complete) && this.respondToReadyState(this.transport.readyState)
    },
    setRequestHeaders: function() {
        var e = {
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if ("post" == this.method && (e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : ""),
        this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005 && (e.Connection = "close")),
        "object" == typeof this.options.requestHeaders) {
            var t = this.options.requestHeaders;
            if (Object.isFunction(t.push))
                for (var i = 0, s = t.length; i < s; i += 2)
                    e[t[i]] = t[i + 1];
            else
                $H(t).each(function(t) {
                    e[t.key] = t.value
                })
        }
        for (var n in e)
            null != e[n] && this.transport.setRequestHeader(n, e[n])
    },
    success: function() {
        var e = this.getStatus();
        return !e || e >= 200 && e < 300 || 304 == e
    },
    getStatus: function() {
        try {
            return 1223 === this.transport.status ? 204 : this.transport.status || 0
        } catch (e) {
            return 0
        }
    },
    respondToReadyState: function(e) {
        var t = ProtoAjax.Request.Events[e]
          , i = new ProtoAjax.Response(this);
        if ("Complete" == t)
            try {
                this._complete = !0,
                (this.options["on" + i.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || function() {}
                )(i)
            } catch (e) {
                Debugger.print("Error handling state: " + e)
            }
        try {
            (this.options["on" + t] || function() {}
            )(i)
        } catch (e) {}
        "Complete" == t && (this.transport.onreadystatechange = function() {}
        )
    },
    getHeader: function(e) {
        try {
            return this.transport.getResponseHeader(e) || null
        } catch (e) {
            return null
        }
    },
    evalResponse: function() {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch (e) {}
    }
}),
ProtoAjax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"],
ProtoAjax.Response = ClassHelper.makeClass({
    initialize: function(e) {
        this.request = e;
        var t = this.transport = e.transport
          , i = this.readyState = t.readyState;
        if ((i > 2 && !ProtoAjax.Browser.IE || 4 == i) && (this.status = this.getStatus(),
        this.statusText = this.getStatusText(),
        this.responseText = null === t.responseText ? "" : String(t.responseText)),
        4 == i) {
            var s = t.responseXML;
            this.responseXML = void 0 === s ? null : s
        }
    },
    status: 0,
    statusText: "",
    getStatus: ProtoAjax.Request.prototype.getStatus,
    getStatusText: function() {
        try {
            return this.transport.statusText || ""
        } catch (e) {
            return ""
        }
    },
    getHeader: ProtoAjax.Request.prototype.getHeader,
    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders()
        } catch (e) {
            return null
        }
    },
    getResponseHeader: function(e) {
        return this.transport.getResponseHeader(e)
    },
    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders()
    }
}),
ProtoAjax.DELEGATE = null;
var VMAPNS = "http://www.iab.net/videosuite/vmap"
  , TAG_VMAP_AD_BREAK = "AdBreak"
  , ATTR_AD_BREAK_START = "timeOffset"
  , ATTR_AD_BREAK_TYPE = "breakType"
  , ATTR_AD_BREAK_ID = "breakId"
  , TAG_AD_SOURCE = "AdSource"
  , TAG_VMAP_TRACKING_EVENTS = "TrackingEvents"
  , TAG_VMAP_EXTENSIONS = "Extensions"
  , TAG_VMAP_EXTENSION = "Extension"
  , TAG_YOEXT_ADBREAK = "http://www.yospace.com/extension/adbreak"
  , TAG_YOEXT_STREAM = "http://www.yospace.com/extension/stream"
  , TAG_VAST_AD_DATA = "VASTAdData"
  , TAG_YO_STREAM = "Stream"
  , ATTR_STREAM_DURATION = "duration"
  , ATTR_STREAM_PDTSTART = "pdtstart"
  , ATTR_STREAM_PDTEND = "pdtend"
  , ATTR_URL_DOMAIN = "urlDomain"
  , ATTR_URL_SUFFIX = "urlSuffix"
  , TAG_AD = "Ad"
  , TAG_AD_EXTENSIONS = "Extensions"
  , TAG_AD_EXTENSION = "Extension"
  , TAG_INLINE = "InLine"
  , TAG_INLINE_ADSYSTEM = "AdSystem"
  , TAG_INLINE_VERSION = "version"
  , TAG_INLINE_ADTITLE = "AdTitle"
  , TAG_INLINE_DESCRIPTION = "Description"
  , TAG_INLINE_ADVERTISER = "Advertiser"
  , TAG_INLINE_SURVEY = "Survey"
  , TAG_CREATIVES = "Creatives"
  , TAG_CREATIVE = "Creative"
  , TAG_IMPRESSION = "Impression"
  , TAG_VAST_TRACKING = "Tracking"
  , TAG_VAST_TRACKINGEVENTS = "TrackingEvents"
  , TAG_NONLINEARADS = "NonLinearAds"
  , TAG_STATICRESOURCE = "StaticResource"
  , TAG_IFRAMERESOURCE = "IFrameResource"
  , TAG_NONLINEARCLICKTHROUGH = "NonLinearClickThrough"
  , TAG_LINEAR = "Linear"
  , TAG_CLICKTHROUGH = "ClickThrough"
  , TAG_CLICKTRACKING = "ClickTracking"
  , TAG_HTMLRESOURCE = "HTMLResource"
  , TAG_EXTENSIONS = "CreativeExtensions"
  , TAG_EXTENSION = "CreativeExtension"
  , ANALYTICS_TOKEN = "#EXT-X-YOSPACE-ANALYTICS-URL"
  , PAUSE_TOKEN = "#EXT-X-YOSPACE-PAUSE"
  , YSParseUtils = {};
YSParseUtils.NAMESPACES = !0,
YSParseUtils.NS_SEPARATOR = ":",
YSParseUtils.timecodeToString = function(e) {
    var t = "0" + e % 60;
    return (("0" + parseInt(e / 3600, 10) + ":" + ("0" + parseInt(e % 3600 / 60, 10)) + ":" + t).replace(/(^|:|\.)0(\d{2})/g, "$1$2") + ".000".substr(-1 === t.indexOf(".") ? 0 : 1)).substr(0, 12)
}
,
YSParseUtils.timecodeFromString = function(e) {
    return -1 === e.indexOf(":") ? e : 3600 * parseInt(e.substr(0, 2), 10) + 60 * parseInt(e.substr(3, 2), 10) + parseFloat(e.substr(6), 10)
}
,
YSParseUtils.getDOMElements = function(e, t, i, s) {
    if (!1 === YSParseUtils.NAMESPACES || void 0 === e.getElementsByTagNameNS) {
        var n = ("" === t ? "" : t + YSParseUtils.NS_SEPARATOR) + s;
        return e.getElementsByTagName(n)
    }
    return e.getElementsByTagNameNS(i, s)
}
;
var TrackingEvents = ClassHelper.makeClass({
    initialize: function(e, t) {
        if (this.events = {},
        this.suppressedCalls = [],
        this.isSuppressed = !1,
        this.ad = t,
        this.nsPrefix = "",
        null !== e) {
            var i = e.tagName.indexOf(TAG_VAST_TRACKINGEVENTS);
            if (-1 === i) {
                if (1 !== (e = e.getElementsByTagName(TAG_VAST_TRACKINGEVENTS)).length)
                    return;
                i = (e = e.item(0)).tagName.indexOf(TAG_VAST_TRACKINGEVENTS)
            }
            i > 0 && (this.nsPrefix = e.tagName.substr(0, i - 1));
            for (var s = YSParseUtils.getDOMElements(e, this.nsPrefix, "*", TAG_VAST_TRACKING), n = 0; n < s.length; n++) {
                var r = s.item(n).getAttribute("event");
                if (r) {
                    var a = null;
                    "progress" === r && (r += "-" + (a = s.item(n).getAttribute("offset")));
                    var o = {
                        url: s.item(n).textContent.replace(/\s+/g, ""),
                        offset: a,
                        event: r,
                        expired: !1
                    };
                    Debugger.print("Adding tracking for event: " + r),
                    this.events[r] = this.events[r] || [],
                    this.events[r].push(o)
                }
            }
        }
    },
    Destroy: function() {
        this.suppressedCalls = null;
        for (var e in this.events)
            this.events.hasOwnProperty(e) && delete this.events[e];
        this.events = null
    },
    addClickTracking: function(e) {
        this.addTracking("click", e)
    },
    addTracking: function(e, t) {
        var i = {
            url: t,
            event: e,
            offset: null,
            expired: !1
        };
        this.events[e] = this.events[e] || [],
        this.events[e].push(i)
    },
    getEventsOfType: function(e) {
        var t = []
          , i = e.indexOf("progress") > -1;
        for (var s in this.events)
            this.events.hasOwnProperty(s) && (e.indexOf(s) > -1 || i && 0 === s.indexOf("progress-")) && (t = t.concat(this.events[s]));
        return t
    },
    suppressAnalytics: function(e) {
        return e ? this.isSuppressed || (this.suppressedCalls = [],
        this.isSuppressed = !0) : this.isSuppressed = !1,
        this.suppressedCalls
    },
    fire: function(e, t) {
        if (t.expired = !0,
        this.isSuppressed)
            this.suppressedCalls.push({
                event: t.event,
                url: e
            }),
            Debugger.print(" ** SUPPRESSING CALL ** Suppressed length: " + this.suppressedCalls.length);
        else if (e.length > 0) {
            var i = new Image
              , s = new YSURL(e);
            !0 === TrackingEvents.FORCE_HTTPS && (s._scheme = "https"),
            i.src = s.toString()
        }
    },
    track: function(e, t) {
        this.ad ? Debugger.print("Tracking " + e + " in " + this.ad.id) : Debugger.print("Tracking " + e + " at global level.");
        var i = [];
        this.events[e] && 0 !== this.events[e].length ? i = [].concat(this.events[e]) : Debugger.print("No specific event to be tracked!");
        var s, n = {};
        for (var r in t)
            t.hasOwnProperty(r) && (n["[" + r + "]"] = encodeURIComponent(t[r]));
        if ("creativeView" === e)
            if (null === this.ad || this.ad.hasSentImpression())
                null === this.ad ? Debugger.print(" *** NO ADVERT FOR FIRING IMPRESSION") : Debugger.print(" *** IMPRESSION ALREADY SENT");
            else
                for (this.ad.impressionSent(),
                Debugger.print(" -=-> Ad Impression"),
                s = this.ad.impressions.length - 1; s >= 0; s--)
                    i.unshift({
                        url: this.ad.impressions[s],
                        expired: !1,
                        event: "impression"
                    });
        var a = this;
        for (s = 0; s < i.length; s++) {
            for (var o = i[s], l = o.url, h = String(parseInt(99999999 * Math.random(), 10)); 8 !== h.length; )
                h = "0" + h;
            n["[CACHEBUSTING]"] = h;
            for (r in n)
                n.hasOwnProperty(r) && (l = l.replace(r, n[r]));
            !1 === o.expired && (Debugger.print("Firing tracking of: " + l),
            a.fire(l, o))
        }
    },
    progressTrack: function(e, t, i) {
        var s = []
          , n = t;
        for (var r in this.events) {
            var a = this.events[r];
            if (a.length > 0)
                for (var o = 0; o < a.length; o++)
                    if ("progress-" === (c = a[o]).event.substr(0, 9)) {
                        var l = c.event.substr(9);
                        if (-1 !== l.indexOf("%")) {
                            var h = l.substr(0, l.length - 1);
                            n = parseFloat(h) * t / 100
                        } else
                            n = YSParseUtils.timecodeFromString(l);
                        i >= n && s.push(c)
                    }
        }
        if (s.length > 0) {
            var u = {};
            for (var d in e)
                e.hasOwnProperty(d) && (u["[" + d + "]"] = encodeURIComponent(e[d]));
            for (r = 0; r < s.length; r++) {
                for (var c = s[r], g = c.url, p = String(parseInt(99999999 * Math.random(), 10)); 8 !== p.length; )
                    p = "0" + p;
                u["[CACHEBUSTING]"] = p;
                for (d in u)
                    u.hasOwnProperty(d) && (g = g.replace(d, u[d]));
                !1 === c.expired && (Debugger.print("Firing timed tracking of: " + g),
                this.fire(g, c))
            }
        }
    }
});
TrackingEvents.FORCE_HTTPS = !1;
var YoExtension = ClassHelper.makeClass({
    initialize: function(e) {
        this.isValid = !1,
        this.extensionXml = e
    },
    Destroy: function() {
        this.extensionXml = null
    },
    getRaw: function() {
        return this.extensionXml
    },
    getTypeName: function() {
        return "YoExtension"
    }
})
  , YoStream = ClassHelper.makeClass(YoExtension, {
    initialize: function(e) {
        this.callSuper(this.initialize, e),
        this.isValid = !0,
        this.StartPDT = null,
        this.EndPDT = null;
        var t = e.firstElementChild;
        if (t)
            if (t.tagName === "yospace" + YSParseUtils.NS_SEPARATOR + TAG_YO_STREAM) {
                if (!t.hasAttribute(ATTR_STREAM_DURATION))
                    return void (this.isValid = !1);
                this.duration = t.getAttribute(ATTR_STREAM_DURATION),
                t.hasAttribute(ATTR_STREAM_PDTSTART) && (this.StartPDT = t.getAttribute(ATTR_STREAM_PDTSTART)),
                t.hasAttribute(ATTR_STREAM_PDTEND) && (this.EndPDT = t.getAttribute(ATTR_STREAM_PDTEND)),
                this.urlDomain = t.getAttribute(ATTR_URL_DOMAIN),
                this.urlSuffix = t.getAttribute(ATTR_URL_SUFFIX),
                this.id = t.getAttribute("id")
            } else
                Debugger.print("Invalid tag name for yospace" + YSParseUtils.NS_SEPARATOR + TAG_YO_STREAM),
                this.isValid = !1;
        else
            this.isValid = !1
    },
    Destroy: function() {
        this.callSuper(this.Destroy)
    },
    getTypeName: function() {
        return "YoStream"
    }
})
  , YoBreak = ClassHelper.makeClass(YoExtension, {
    initialize: function(e) {
        if (e) {
            this.callSuper(this.initialize, e),
            this.isValid = !0;
            var t = e.firstElementChild;
            t ? this.duration = t.getAttribute(ATTR_STREAM_DURATION) : this.isValid = !1
        }
    },
    Destroy: function() {
        this.callSuper(this.Destroy)
    },
    getTypeName: function() {
        return "YoBreak"
    }
})
  , Extensions = ClassHelper.makeClass({
    initialize: function(e) {
        if (this.extensions = [],
        e) {
            var t = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_VMAP_EXTENSION);
            if (t.length)
                for (var i = 0; i < t.length; i++) {
                    var s, n = t.item(i), r = n.getAttribute("type");
                    r === TAG_YOEXT_ADBREAK ? (s = new YoBreak(n),
                    this.extensions.push(s),
                    Debugger.print("Found BREAK extension in VMAP")) : r === TAG_YOEXT_STREAM ? (s = new YoStream(n),
                    this.extensions.push(s),
                    Debugger.print("Found STREAM extension in VMAP")) : Debugger.print("Unhandled Extension Type: " + r)
                }
            else
                Debugger.print("Empty Extensions section")
        } else
            Debugger.print("Adjustment/Extraction failed for VMAP extensions")
    },
    Destroy: function() {
        for (; this.extensions.length > 0; )
            this.extensions.pop().Destroy();
        this.extensions = null
    },
    getFirstOfType: function(e) {
        return getNextOfType(e, null)
    },
    getNextOfType: function(e, t) {
        var i = null
          , s = getClassForType(e)
          , n = !1;
        if (null !== s)
            for (var r = 0; r < this.extensions.length; r++)
                if (this.extensions[r].getTypeName() == s) {
                    if (null === t || !0 === n) {
                        i = this.extensions[r];
                        break
                    }
                    this.extensions[r] === t && (n = !0)
                }
        return i
    },
    getAllOfType: function(e) {
        var t = []
          , i = this.getClassForType(e);
        if (null !== i)
            for (var s = 0; s < this.extensions.length; s++)
                this.extensions[s].getTypeName() == i && t.push(this.extensions[s]);
        return t
    },
    getClassForType: function(e) {
        switch (e) {
        case TAG_YOEXT_ADBREAK:
            return "YoBreak";
        case TAG_YOEXT_STREAM:
            return "YoStream"
        }
        return null
    }
})
  , VASTIcon = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        this.id = i,
        this.linear = e,
        this.clickThrough = null,
        this.resources = {
            html: null,
            iframe: null,
            images: {}
        };
        var s, n;
        for ((n = t.getElementsByTagName(TAG_HTMLRESOURCE)).length > 0 && (this.resources.html = n.item(0).textContent.replace(/\s+/g, "")),
        (n = t.getElementsByTagName(TAG_IFRAMERESOURCE)).length > 0 && (this.resources.iframe = n.item(0).textContent.replace(/\s+/g, "")),
        n = t.getElementsByTagName(TAG_STATICRESOURCE),
        s = 0; s < n.length; s++)
            this.resources.images[n.item(s).getAttribute("creativeType")] = n.item(s).textContent.replace(/\s+/g, "");
        this.tracking = e.tracking;
        var r = t.getElementsByTagName("IconClicks");
        if (r.length) {
            var a = (r = r.item(0)).getElementsByTagName("IconClickThrough");
            if (a.length && (this.clickThrough = a.item(0).textContent.replace(/\s+/g, "")),
            (a = r.getElementsByTagName("IconClickTracking")).length)
                for (s = 0; s < a.length; s++)
                    Debugger.print("Adding Icon Click Tracking: " + s),
                    this.tracking.addTracking("IconClick_" + i, a.item(s).textContent.replace(/\s+/g, ""))
        }
        var o = t.getElementsByTagName("IconViewTracking");
        if (o.length)
            for (s = 0; s < o.length; s++)
                this.tracking.addTracking("IconView_" + i, o.item(s).textContent.replace(/\s+/g, ""))
    },
    Destroy: function() {
        this.resources = null,
        this.linear = null,
        this.tracking = null
    },
    getAllResources: function() {
        return this.resources
    }
})
  , VASTInteractive = ClassHelper.makeClass({
    initialize: function(e, t) {
        Debugger.print("Constructing VPAID Unit"),
        this.width = -1,
        this.height = -1,
        this.id = "",
        this.scalable = !1,
        this.type = "",
        this.maintainAspectRatio = !1,
        this.src = "",
        this.linear = e,
        this.bitrate = -1,
        this.parameters = "";
        for (var i in t)
            if (t.hasOwnProperty(i)) {
                var s = t[i].replace(/\s+/g, "");
                switch (i.toLowerCase()) {
                case "height":
                case "width":
                case "bitrate":
                    this[i.toLowerCase()] = parseInt(s, 10);
                    break;
                case "id":
                case "type":
                    this[i.toLowerCase()] = s;
                    break;
                case "maintainaspectratio":
                    this.maintainAspectRatio = "true" === s.toLowerCase();
                    break;
                case "scalable":
                    this.scalable = "true" === s.toLowerCase();
                    break;
                case "src":
                    this.src = s;
                    break;
                default:
                    Debugger.print("Unknown attribute: " + i + " with value: " + s)
                }
            }
        var n = e.root.getElementsByTagName("AdParameters");
        1 === n.length && (this.parameters = n.item(0).textContent),
        this.tracking = new TrackingEvents(e.root,e.vastAd)
    },
    Destroy: function() {
        this.resources = null,
        this.linear = null,
        this.tracking.Destroy(),
        this.tracking = null
    },
    track: function(e, t, i, s) {
        Debugger.print(" VPAID: Invoke Tracking: " + e),
        this.tracking.track(e, {
            CONTENTPLAYHEAD: YSParseUtils.timecodeToString(t),
            ASSETURI: i,
            "YO:ACTUAL_DURATION": s
        })
    }
})
  , VASTCreative = ClassHelper.makeClass({
    initialize: function(e, t, i, s) {
        this.vastAd = e,
        this.root = t,
        this.clickThrough = null,
        this.AdID = i,
        this.CreativeID = s,
        this.CreativeExtensions = [];
        var n = t.getElementsByTagName(TAG_EXTENSIONS);
        if (n.length > 0)
            for (var r = 0; r < n.length; r++) {
                var a = n.item(r).getElementsByTagName(TAG_EXTENSION);
                if (a.length > 0)
                    for (var o = 0; o < a.length; o++)
                        this.CreativeExtensions.push(a.item(o))
            }
        "NonLinear" === t.tagName && (t = t.parentNode),
        this.tracking = new TrackingEvents(t,e)
    },
    Destroy: function() {
        this.root = null,
        this.CreativeExtensions = null,
        this.tracking && (this.tracking.Destroy(),
        this.tracking = null)
    },
    track: function(e, t, i, s) {
        this.tracking.track(e, {
            CONTENTPLAYHEAD: YSParseUtils.timecodeToString(t),
            ASSETURI: i,
            "YO:ACTUAL_DURATION": s
        }),
        this.tracking.progressTrack({
            CONTENTPLAYHEAD: YSParseUtils.timecodeToString(t),
            ASSETURI: i,
            "YO:ACTUAL_DURATION": s
        }, this.getDuration(), t)
    },
    trackProgress: function(e, t, i) {
        this.tracking.progressTrack({
            CONTENTPLAYHEAD: YSParseUtils.timecodeToString(e),
            ASSETURI: t,
            "YO:ACTUAL_DURATION": i
        }, this.duration, e)
    },
    getClickThrough: function() {
        if (this.clickThrough) {
            var e = new YSURL(this.clickThrough);
            return !0 === TrackingEvents.FORCE_HTTPS && (e._scheme = "https"),
            e.toString()
        }
        return null
    },
    attribute: function(e, t) {
        if (!this.root.hasAttribute(e))
            return t;
        var i = this.root.getAttribute(e);
        switch (e) {
        case "skipoffset":
        case "duration":
        case "offset":
        case "minSuggestedDuration":
            i = YSParseUtils.timecodeFromString(i)
        }
        return i
    }
})
  , VASTLinear = ClassHelper.makeClass(VASTCreative, {
    initialize: function(e, t, i, s) {
        this.callSuper(this.initialize, e, t, i, s),
        this.mediaFiles = [],
        this.duration = null,
        this.skipOffset = -1,
        this.icons = [],
        this.interactiveUnit = null;
        var n = t.getElementsByTagName("VideoClicks");
        if (n.length) {
            var r = (n = n.item(0)).getElementsByTagName(TAG_CLICKTHROUGH);
            if (r.length && (this.clickThrough = r.item(0).textContent.replace(/\s+/g, "")),
            (r = n.getElementsByTagName(TAG_CLICKTRACKING)).length)
                for (g = 0; g < r.length; g++)
                    Debugger.print("Adding Click Tracking: " + g),
                    this.tracking.addClickTracking(r.item(g).textContent.replace(/\s+/g, ""))
        }
        var a = t.getElementsByTagName("Duration");
        if (a.length && (this.duration = YSParseUtils.timecodeFromString(a.item(0).textContent.replace(/\s+/g, ""))),
        t.hasAttribute("skipoffset")) {
            var o = t.getAttribute("skipoffset").replace(/\s+/g, "");
            if (o.indexOf("%") >= 0) {
                var l = this.duration * o.substring(0, o.length - 1) / 100;
                this.skipOffset = l
            } else
                this.skipOffset = YSParseUtils.timecodeFromString(o)
        }
        var h = t.getElementsByTagName("MediaFiles");
        if (h.length) {
            for (h = h.item(0).getElementsByTagName("MediaFile"),
            g = 0; g < h.length; g++) {
                var u = {};
                if (void 0 !== (p = h.item(g)).attributes)
                    for (var d = 0; d < p.attributes.length; d++)
                        u[p.attributes.item(d).name] = p.attributes.item(d).value;
                else
                    p.hasAttribute("id") && (u.id = p.getAttribute("id")),
                    p.hasAttribute("bitrate") && (u.bitrate = p.getAttribute("bitrate")),
                    p.hasAttribute("width") && (u.width = p.getAttribute("width")),
                    p.hasAttribute("height") && (u.height = p.getAttribute("height"));
                u.src = h.item(g).textContent.replace(/\s+/g, ""),
                u.hasOwnProperty("apiFramework") && "VPAID" === u.apiFramework.toUpperCase() && (this.interactiveUnit = new VASTInteractive(this,u)),
                this.mediaFiles.push(u)
            }
            var c = t.getElementsByTagName("Icons");
            if (c.length && (c = c.item(0).getElementsByTagName("Icon")).length)
                for (var g = 0; g < c.length; g++) {
                    var p = c.item(g);
                    "Icon" === p.tagName && this.icons.push(new VASTIcon(this,p,g))
                }
        }
    },
    Destroy: function() {
        if (this.callSuper(this.Destroy),
        this.mediaFiles = null,
        this.interactiveUnit && (this.interactiveUnit.Destroy(),
        this.interactiveUnit = null),
        this.icons) {
            for (; this.icons.length > 0; )
                this.icons.pop().Destroy();
            this.icons = null
        }
    },
    getDuration: function() {
        return this.duration
    },
    getSkipOffset: function() {
        return this.skipOffset
    },
    getAllMedias: function() {
        return this.mediaFiles
    },
    hasInteractiveUnit: function() {
        return null !== this.interactiveUnit
    }
})
  , VASTNonLinear = ClassHelper.makeClass(VASTCreative, {
    initialize: function(e, t, i, s) {
        this.callSuper(this.initialize, e, t, i, s),
        this.resources = {
            html: null,
            iframe: null,
            images: {}
        };
        var n, r;
        for ((r = t.getElementsByTagName(TAG_HTMLRESOURCE)).length > 0 && (this.resources.html = r.item(0).textContent.replace(/\s+/g, "")),
        (r = t.getElementsByTagName(TAG_IFRAMERESOURCE)).length > 0 && (this.resources.iframe = r.item(0).textContent.replace(/\s+/g, "")),
        r = t.getElementsByTagName(TAG_STATICRESOURCE),
        n = 0; n < r.length; n++)
            this.resources.images[r.item(n).getAttribute("creativeType")] = r.item(n).textContent.replace(/\s+/g, "");
        this.tracking = e.nonLinearsTracking;
        var a = t.getElementsByTagName("NonLinearClickTracking");
        if (a.length)
            for (n = 0; n < a.length; n++)
                this.tracking.addClickTracking(a.item(n).textContent.replace(/\s+/g, ""));
        (a = t.getElementsByTagName(TAG_NONLINEARCLICKTHROUGH)).length && (this.clickThrough = a.item(0).textContent.replace(/\s+/g, "")),
        this.attributes = {},
        t.hasAttribute("width") && (this.attributes.width = t.getAttribute("width")),
        t.hasAttribute("height") && (this.attributes.height = t.getAttribute("height")),
        t.hasAttribute("id") && (this.attributes.id = t.getAttribute("id")),
        t.hasAttribute("expandedWidth") && (this.attributes.expandedWidth = t.getAttribute("expandedWidth")),
        t.hasAttribute("expandedHeight") && (this.attributes.expandedHeight = t.getAttribute("expandedHeight")),
        t.hasAttribute("scalable") && (this.attributes.scalable = t.getAttribute("scalable")),
        t.hasAttribute("maintainAspectRatio") && (this.attributes.maintainAspectRatio = t.getAttribute("maintainAspectRatio")),
        t.hasAttribute("minSuggestedDuration") && (this.attributes.minSuggestedDuration = t.getAttribute("minSuggestedDuration")),
        t.hasAttribute("apiFramework") && (this.attributes.apiFramework = t.getAttribute("apiFramework"))
    },
    Destroy: function() {
        this.callSuper(this.Destroy),
        this.resources = null,
        this.attributes = null
    },
    getAllResources: function() {
        return this.resources
    }
})
  , VASTAd = ClassHelper.makeClass({
    initialize: function(e, t) {
        this.container = null,
        this.vast = e,
        this.vastXML = t,
        this.id = "",
        this.AdTitle = "",
        this.Description = "",
        this.Advertiser = "",
        this.Survey = "",
        this.version = "",
        this.AdSystem = "",
        this.sequence = null,
        this.linear = null,
        this.nonLinears = [],
        this.nonLinearsTracking = null,
        this.hasContent = !0,
        this.impressions = [],
        this.sentImpression = !1,
        this.Extensions = [],
        this.AdvertLineage = null;
        var i, s;
        this.nonLinearsTracking = new TrackingEvents(null,this),
        t.hasAttribute("sequence") && (this.sequence = parseInt(t.getAttribute("sequence"), 10),
        Debugger.print(" *VASTAd* Extracted sequence: " + this.sequence)),
        t.hasAttribute("id") && (this.id = t.getAttribute("id"),
        Debugger.print(" *VASTAd* Extracted id: " + this.id));
        var n = t.getElementsByTagName(TAG_INLINE);
        if (0 === n.length)
            return Debugger.print(" *VASTAd* Found no inline element"),
            void (this.hasContent = !1);
        Debugger.print(" *VASTAd* Inline located. Count (should be 1): " + n.length);
        var r = (n = n.item(0)).getElementsByTagName(TAG_INLINE_ADSYSTEM);
        if (0 !== r.length) {
            Debugger.print(" *VASTAd* Extracted AdSystem. Count: " + r.length);
            var a = r.item(0);
            this.AdSystem = a.textContent.replace(/\s+/g, ""),
            a.hasAttribute("version") && (this.version = a.getAttribute("version"),
            Debugger.print(" *VASTAd* Extracted AdSystem version: " + this.version))
        }
        0 !== (r = n.getElementsByTagName(TAG_INLINE_ADTITLE)).length && (this.AdTitle = r.item(0).textContent.replace(/\s+/g, ""),
        Debugger.print(" *VASTAd* Extracted AdTitle: " + this.AdTitle)),
        0 !== (r = n.getElementsByTagName(TAG_INLINE_DESCRIPTION)).length && (this.Description = r.item(0).textContent.replace(/\s+/g, ""),
        Debugger.print(" *VASTAd* Extracted Description: " + this.Description)),
        0 !== (r = n.getElementsByTagName(TAG_INLINE_SURVEY)).length && (this.Survey = r.item(0).textContent.replace(/\s+/g, ""),
        Debugger.print(" *VASTAd* Extracted Survey: " + this.Survey)),
        0 !== (r = n.getElementsByTagName(TAG_INLINE_ADVERTISER)).length && (this.Advertiser = r.item(0).textContent.replace(/\s+/g, ""),
        Debugger.print(" *VASTAd* Extracted Advertiser: " + this.Advertiser));
        var o = n.getElementsByTagName(TAG_IMPRESSION);
        for (Debugger.print(" *VASTAd* Extracted impressions. Count: " + o.length),
        i = 0; i < o.length; i++)
            this.impressions.push(o.item(i).textContent.replace(/\s+/g, "")),
            Debugger.print(" *VASTAd* Impression " + String(i + 1) + ". URL: " + o.item(i).textContent.replace(/\s+/g, ""));
        var l = t.getElementsByTagName(TAG_AD_EXTENSIONS);
        if (Debugger.print(" *VASTAd* Extracted Extensions. Count: " + l.length),
        l.length > 0)
            for (i = 0; i < l.length; i++) {
                var h = l.item(i).getElementsByTagName(TAG_AD_EXTENSION);
                if (Debugger.print(" *VASTAd* For Extensions tag " + String(i + 1) + ", Extension count: " + h.length),
                h.length > 0)
                    for (s = 0; s < h.length; s++)
                        if (Debugger.print(" *VASTAd* For Extensions tag " + String(i + 1) + ", Extension " + String(s + 1) + " have added item"),
                        h.item(s).hasAttribute("type") && "com.yospace.wrapperhierarchy" === h.item(s).getAttribute("type"))
                            for (var u = h.item(s).firstChild, d = null; null !== u; ) {
                                if ("AdWrapper" === u.tagName) {
                                    Debugger.print("Detected Hierarchy: " + u.getAttribute("id") + " / " + u.getAttribute("creativeId") + " / " + u.getAttribute("AdSystem"));
                                    var c = new AdvertWrapper(u.getAttribute("id"),u.getAttribute("creativeId"),u.getAttribute("AdSystem"));
                                    null === d ? this.AdvertLineage = c : d.child = c,
                                    d = c
                                }
                                u = u.firstChild
                            }
                        else
                            this.Extensions.push(h.item(s))
            }
        var g = n.getElementsByTagName(TAG_CREATIVES);
        if (Debugger.print(" *VASTAd* Extracted creatives tag. Count: " + g.length),
        0 !== g.length)
            for (g = g.item(0).getElementsByTagName(TAG_CREATIVE),
            Debugger.print(" *VASTAd* Extracted creatives. Count: " + g.length),
            i = 0; i < g.length; i++) {
                var p = ""
                  , f = "";
                g.item(i).hasAttribute("AdID") && (p = g.item(i).getAttribute("AdID")),
                g.item(i).hasAttribute("id") && (f = g.item(i).getAttribute("id")),
                Debugger.print(" *VASTAd* For creatives " + String(i + 1) + ", AdID: " + p + ", CreativeID: " + f);
                for (var A = g.item(i).firstChild; null !== A && 3 === A.nodeType; )
                    A = A.nextSibling;
                if (null !== A) {
                    var S;
                    switch (A.tagName) {
                    case TAG_LINEAR:
                        Debugger.print(" *VASTAd* For creatives " + String(i + 1) + ", Extracting Linear"),
                        this.linear = new VASTLinear(this,A,p,f);
                        break;
                    case TAG_NONLINEARADS:
                        Debugger.print(" *VASTAd* For creatives " + String(i + 1) + ", Extracting NonLinear");
                        var v = A.tagName.replace("Ads", "")
                          , m = A.getElementsByTagName(v);
                        for (s = 0; s < m.length; s++)
                            null !== (S = new VASTNonLinear(this,m.item(s),p,f)) && this.nonLinears.push(S)
                    }
                }
            }
    },
    Destroy: function() {
        if (this.hasContent = !1,
        this.vast = null,
        this.vastXML = null,
        this.impressions = null,
        this.Extensions = null,
        this.container = null,
        this.AdvertLineage = null,
        this.linear && (this.linear.Destroy(),
        this.linear = null),
        this.nonLinearsTracking && (this.nonLinearsTracking.Destroy(),
        this.nonLinearsTracking = null),
        this.nonLinears) {
            for (; this.nonLinears.length > 0; )
                this.nonLinears.pop().Destroy();
            this.nonLinears = null
        }
    },
    hasSentImpression: function() {
        return this.sentImpression
    },
    impressionSent: function() {
        this.sentImpression = !0
    },
    isNumber: function(e) {
        return this.sequence === e
    },
    hasSequence: function() {
        return null !== this.sequence
    },
    isEmpty: function() {
        return !this.hasContent
    },
    getLinear: function() {
        return this.linear
    },
    getNonLinears: function() {
        return this.nonLinears
    }
})
  , AdvertWrapper = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        this.AdId = e,
        this.AdSystem = i,
        this.CreativeID = t,
        this.child = null
    }
})
  , VASTAds = ClassHelper.makeClass({
    initialize: function(e, t) {
        this.ads = [],
        this.onAdsAvailable = e,
        this.onAdsError = t,
        this.onReceivedErrorCounter = 0
    },
    Destroy: function() {
        for (this.onAdsAvailable = null,
        this.onAdsError = null; this.ads.length > 0; )
            this.ads.pop().Destroy();
        this.ads = null
    },
    parse: function(e) {
        var t = YSParseUtils.getDOMElements(e, "", "*", TAG_AD)
          , i = this;
        if (0 !== t.length) {
            for (var s = 0; s < t.length; s++) {
                var n = new VASTAd(this,t.item(s));
                n.isEmpty() ? (Debugger.print("Parsed an empty ad"),
                function() {
                    i.onReceivedErrorCounter++,
                    i.onReceivedErrorCounter === t.length && "function" == typeof this.onAdsError && this.onAdsError.call(this, "All Ads Failed")
                }()) : this.ads.push(n)
            }
            "function" == typeof this.onAdsAvailable && this.onAdsAvailable.call(this, this.ads)
        } else
            "function" == typeof this.onAdsAvailable && this.onAdsAvailable.call(this, [])
    }
})
  , AdBreak = ClassHelper.makeClass({
    initialize: function(e) {
        this.adSource = null,
        this.vast = null,
        this.tracking = null,
        this.extensions = null,
        this.isValid = !1,
        this.position = e.getAttribute(ATTR_AD_BREAK_START),
        this.type = e.getAttribute(ATTR_AD_BREAK_TYPE),
        this.id = e.getAttribute(ATTR_AD_BREAK_ID);
        var t = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_AD_SOURCE);
        if (t.length) {
            var i = YSParseUtils.getDOMElements(t.item(0), "vmap", VMAPNS, TAG_VAST_AD_DATA);
            if (i.length) {
                var s = this;
                this.adSource = i.item(0).innerHTML,
                this.vast = new VASTAds(function(e) {
                    Debugger.print("VAST: " + e.length),
                    e.length > 0 && (s.isValid = !0)
                }
                ,function() {
                    Debugger.print("Vast Failed")
                }
                ),
                this.vast.parse(i.item(0))
            } else
                Debugger.print("Not a VASTAdData tag")
        } else
            Debugger.print("No AdSource section in AdBreak");
        var n = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_VMAP_TRACKING_EVENTS);
        n.length ? (this.tracking = new TrackingEvents(n.item(0),null),
        this.isValid = !0) : Debugger.print("No TrackingEvents section in AdBreak");
        var r = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_VMAP_EXTENSIONS);
        r.length ? this.extensions = new Extensions(r.item(0)) : Debugger.print("No Extensions section in AdBreak")
    },
    Destroy: function() {
        this.adSource = null,
        this.vast && (this.vast.Destroy(),
        this.vast = null),
        this.tracking && (this.tracking.Destroy(),
        this.tracking = null),
        this.extensions && (this.extensions.Destroy(),
        this.extensions = null)
    }
})
  , VMAPParser = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        this.breaks = [],
        this.extensions = null,
        this.server = e,
        this.onSuccess = t,
        this.onFailure = i,
        null !== e && (null !== ProtoAjax.DELEGATE ? ProtoAjax.DELEGATE(e, {
            onSuccess: this.onLoadSuccess.bind(this),
            onFailure: this.onLoadFailure.bind(this)
        }) : new ProtoAjax.Request(e,{
            method: "get",
            evalJSON: !1,
            evalJS: !1,
            onSuccess: this.onLoadSuccess.bind(this),
            onFailure: this.onLoadFailure.bind(this)
        }))
    },
    Destroy: function() {
        for (this.extensions && (this.extensions.Destroy(),
        this.extensions = null),
        this.onSuccess = null,
        this.onFailure = null; this.breaks.length > 0; )
            this.breaks.pop().Destroy();
        this.breaks = null
    },
    onLoadSuccess: function(e) {
        var t = e.responseText.indexOf("#EXTM3U") >= 0;
        null === e.responseXML ? "function" == typeof this.onFailure && (t ? this.onFailure.call(this, "ism3u8") : this.onFailure.call(this, e.status)) : (e = e.responseXML,
        this.parse(e))
    },
    onLoadFailure: function(e) {
      console.error("ProtoAjax; onLoadFailure", e);
        Debugger.printErr("Failed to load VMAP from '" + this.server + "': " + e.status),
        "function" == typeof this.onFailure && this.onFailure.call(this, e.status)
    },
    parse: function(e) {
        var t;
        if (null !== e) {
            if (9 == e.nodeType) {
                Debugger.print("Looks like VMAP document was provided. Stepping into root node");
                var i = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, "VMAP");
                if (1 != i.length)
                    return Debugger.print("VMAP root node count was not 1. This probably wont work: " + i.length),
                    void ("function" == typeof this.onFailure && this.onFailure.call(this, "error"));
                e = i.item(0),
                Debugger.print("Located root node")
            }
            if (!0 === YSSessionManager.DEFAULTS.AD_DEBUG && !0 === YSSessionManager.DEFAULTS.DEBUGGING) {
                var s = e.parentNode.children.item(0).nextSibling;
                null !== s && s.nodeType == Node.COMMENT_NODE && (Debugger.print(" ************* AD-CALL DIAGNOSTICS ****************"),
                Debugger.print(s.nodeValue),
                Debugger.print(" ************* END DIAGNOSTICS ****************"))
            }
            var n = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_VMAP_AD_BREAK);
            if (n.length)
                for (t = 0; t < n.length; t++) {
                    Debugger.print("Processing break: " + t);
                    var r = n.item(t);
                    if (void 0 !== r.parentNode && (r.parentNode == e || void 0 !== e.tagName && r.parentNode.tagName === e.tagName)) {
                        var a = new AdBreak(r);
                        a.isValid ? this.breaks.push(a) : Debugger.print("Break not valid")
                    } else
                        Debugger.print("Ignoring floating AdBreak")
                }
            else
                Debugger.print(" ** NO ADBREAK ELEMENTS LOCATED IN VMAP.");
            var o = YSParseUtils.getDOMElements(e, "vmap", VMAPNS, TAG_VMAP_EXTENSIONS);
            if (o.length)
                for (t = 0; t < o.length; t++) {
                    var l = o.item(t).parentNode;
                    if (void 0 !== l && (l == e || void 0 !== e.tagName && l.tagName === e.tagName)) {
                        this.extensions = new Extensions(o.item(t));
                        break
                    }
                    Debugger.print("Ignoring custom extension which is not top-level")
                }
            else
                Debugger.print(" ** NO EXTENSIONS LOCATED IN VMAP.");
            var h = !0;
            if (null !== this.extensions && null !== this.extensions.extensions) {
                for (t = 0; t < this.extensions.extensions.length; t++)
                    if (!this.extensions.extensions[t].isValid) {
                        Debugger.print("Extension " + t + " is not valid"),
                        h = !1;
                        break
                    }
            } else
                Debugger.print("extensions is " + (null !== this.extensions ? "NOT" : "") + " null"),
                null !== this.extensions && Debugger.print("extensions.extensions is " + (null !== this.extensions.extensions ? "NOT" : "") + " null");
            h ? "function" == typeof this.onSuccess && this.onSuccess.call(this, this.breaks) : "function" == typeof this.onFailure && this.onFailure.call(this, "error")
        } else
            "function" == typeof this.onFailure && this.onFailure.call(this, "error")
    }
})
  , PlaylistParser = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        Debugger.print("Loading M3U8 from: " + e),
        this.server = e,
        this.content = [],
        this.handleSuccess = t,
        this.handleFailure = i,
        this.isRedirect = !1,
        this.isXML = !1,
        null !== ProtoAjax.DELEGATE ? ProtoAjax.DELEGATE(e, {
            onSuccess: this.onLoadSucceeded.bind(this),
            onFailure: this.onLoadFailed.bind(this)
        }) : new ProtoAjax.Request(e,{
            method: "get",
            evalJSON: !1,
            evalJS: !1,
            onSuccess: this.onLoadSucceeded.bind(this),
            onFailure: this.onLoadFailed.bind(this)
        })
    },
    Destroy: function() {
        this.handleSuccess = null,
        this.handleFailure = null,
        this.content = null
    },
    onLoadSucceeded: function(e) {
        Debugger.print("Playlist loaded... parsing"),
        void 0 !== e.transport && void 0 !== e.transport.responseURL && 0 !== e.transport.status && e.transport.responseURL !== this.server && (this.server = e.transport.responseURL,
        Debugger.print("Detected a playlist redirect to: " + this.server),
        this.isRedirect = !0),
        null === e.responseXML ? this.content = this.textToArray(e.responseText) : (this.isXML = !0,
        this.content = [e.responseXML]),
        e.transport.status >= 200 && e.transport.status <= 399 ? "function" == typeof this.handleSuccess && this.handleSuccess.call(this) : "function" == typeof this.handleFailure && this.handleFailure.call(this, e.transport.status)
    },
    onLoadFailed: function(e) {
        Debugger.printErr("Failed to load Playlist from '" + this.server + "':" + e.status),
        "function" == typeof this.handleFailure && this.handleFailure.call(this, e.status)
    },
    textToArray: function(e) {
        return "string" != typeof e ? [] : (e = String(e).trim()) ? e.split(/\s+/) : []
    }
})
  , VASTParser = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        this.ads = null,
        this.server = e,
        this.onSuccess = t,
        this.onFailure = i
    },
    Destroy: function() {
        this.onSuccess = null,
        this.onFailure = null,
        null !== this.ads && (this.ads.Destroy(),
        this.ads = null)
    },
    load: function() {
        null !== this.server && (Debugger.print("Loading VAST from: " + this.server),
        null !== ProtoAjax.DELEGATE ? ProtoAjax.DELEGATE(this.server, {
            onSuccess: this.onLoadSuccess.bind(this),
            onFailure: this.onLoadFailure.bind(this)
        }) : new ProtoAjax.Request(this.server,{
            method: "get",
            evalJSON: !1,
            evalJS: !1,
            onSuccess: this.onLoadSuccess.bind(this),
            onFailure: this.onLoadFailure.bind(this)
        }))
    },
    onLoadSuccess: function(e) {
        e = e.responseXML,
        this.parse(e)
    },
    parse: function(e) {
        if (this.ads = new VASTAds(this.onVastReady.bind(this),this.onVastFailed.bind(this)),
        this.ads.parse(e),
        !0 === YSSessionManager.DEFAULTS.AD_DEBUG && !0 === YSSessionManager.DEFAULTS.DEBUGGING) {
            var t = e.children.item(0).nextSibling;
            null !== t && t.nodeType == Node.COMMENT_NODE && (Debugger.print(" ************* AD-CALL DIAGNOSTICS ****************"),
            Debugger.print(t.nodeValue),
            Debugger.print(" ************* END DIAGNOSTICS ****************"))
        }
    },
    onVastReady: function(e) {
        "function" == typeof this.onSuccess && this.onSuccess.call(this, this.ads.ads)
    },
    onVastFailed: function(e) {
        Debugger.print("ADS ERROR: " + e),
        "function" == typeof this.onFailure && this.onFailure.call(that, e)
    },
    onLoadFailure: function(e) {
        Debugger.printErr("Failed to load VAST from '" + this.server + "':" + e),
        "function" == typeof this.onFailure && this.onFailure.call(this, e)
    }
})
  , YOPoller = ClassHelper.makeClass({
    initialize: function(e, t) {
        this.longperiod = e,
        this.shortperiod = t,
        this.running = !1,
        this.highpriority = !1,
        this.timer = null,
        this.callback = null
    },
    Destroy: function() {
        this.isRunning() && this.stopPolling(),
        this.callback = null
    },
    isRunning: function() {
        return !0 === this.running && null !== this.timer
    },
    startPolling: function(e, t) {
        null !== this.timer && this.stopPolling(),
        this.callback = t,
        this.highpriority = e,
        this.running = !0,
        this.timer = setInterval(this.timerElapsed.bind(this), e ? this.shortperiod : this.longperiod)
    },
    stopPolling: function() {
        this.running = !1,
        null !== this.timer && clearInterval(this.timer),
        this.timer = null
    },
    timerElapsed: function() {
        this.callback && this.callback.call(this)
    }
})
  , Debugger = {};
!function() {
    "use strict";
    Debugger.print = function(e) {
        YSSessionManager.DEFAULTS.DEBUGGING && console.log(e)
    }
    ,
    Debugger.printErr = function(e) {
        console.error(e)
    }
}();
var YSPlayerPolicy = ClassHelper.makeClass({
    initialize: function(e) {
        this.session = e
    },
    Destroy: function() {
        this.session = null
    },
    canSeekTo: function(e) {
        if (Debugger.print("Checking seek to: " + e),
        !(this.session instanceof YSLiveSession)) {
            Debugger.print("VOD can seek to: " + e);
            var t = this.session.timeline;
            if (t) {
                if (!this.canSeek())
                    return Debugger.print("Returning last position as we're in an active advert"),
                    this.session.lastPosition || 0;
                var i = t.getAllElements();
                t.getElementAtTime(this.session.lastPosition);
                if (i && 0 != i.length) {
                    for (var s = -1, n = !1, r = i.length - 1; r >= 0; r--)
                        if (Debugger.print("Checking element from " + i[r].offset + " with duration: " + i[r].duration),
                        i[r].getType() === YSTimelineElement.ADVERT)
                            if (n)
                                for (var a = i[r].getAdverts().adverts, o = 0; o < a.length; o++)
                                    a[o].setActive(!1);
                            else
                                e >= i[r].offset && i[r].getAdverts().isActive() && (Debugger.print("Break reports active"),
                                s = i[r].offset,
                                n = !0);
                    return n && null !== this.session.player && "function" == typeof this.session.player.UpdateTimeline && (Debugger.print("Reporting timeline to player: " + YSParseUtils.timecodeToString(t.getTotalDuration())),
                    this.session.player.UpdateTimeline(t)),
                    -1 == s ? e : s
                }
                Debugger.print("No elements")
            } else
                Debugger.print("No timeline");
            return e
        }
        return Debugger.print("Returning live default"),
        this.session.lastPosition
    },
    canStart: function() {
        return !0
    },
    canStop: function() {
        return !0
    },
    canPause: function() {
        return !(this.session instanceof YSLiveSession)
    },
    canSeek: function() {
        return !(this.session instanceof YSLiveSession) && (!this.session.isInAnAdvert() || !this.session.currentAdvert.isActive)
    },
    canSkip: function() {
        if (this.session.isInAnAdvert()) {
            if (this.session instanceof YSLiveSession)
                return -1;
            var e = this.session.currentAdvert.advert;
            if (null !== e) {
                var t = e.getLinear();
                if (null !== t) {
                    var i = t.getSkipOffset();
                    if (!1 === this.session.currentAdvert.isActive && (i = 0),
                    -1 === i)
                        return -1;
                    var s = this.session.currentAdvert.timeElapsed()
                      , n = s >= i ? 0 : i - s;
                    if (this.session instanceof YSVoDSession)
                        return n;
                    var r = t.getDuration() - s
                      , a = this.session.timeline
                      , o = a.getTotalDuration() + a.startOffset;
                    return this.session.lastPosition + r >= o - YSPlayerPolicy.LIVE_TOLERANCE ? -1 : n
                }
            }
        }
        return -1
    },
    canMute: function() {
        return !0
    },
    canChangeFullScreen: function(e) {
        return !0
    },
    canExpandCreative: function() {
        return !1
    },
    canClickThrough: function() {
        return !0
    }
});
YSPlayerPolicy.LIVE_TOLERANCE = 30;
var YSSession = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        Debugger.print("Constructing YSSession"),
        null !== t && t.length > 0 ? this.source = new YSURL(t) : this.source = null,
        this.manager = e,
        this.onComplete = i,
        null !== this.source ? this.hostnode = this.source.host() : this.hostnode = "",
        this.sessionId = "",
        this.analyticsUrl = "",
        this.livePauseUrl = "",
        this.masterURL = null,
        this.timeline = new YSTimeline,
        this.adBreakArray = {},
        this.currentAdvert = null,
        this.breakEndTimer = null,
        this.player = null,
        this.streamType = "hls",
        this.lastPosition = void 0,
        this.analyticsSuppressed = !1,
        this.isPaused = !1,
        this.isPlaying = !1,
        this.policy = new YSPlayerPolicy(this),
        this._missedBreaks = []
    },
    Destroy: function() {
        if (Debugger.print("Shutting down Session"),
        this.source = null,
        this.manager = null,
        this.masterURL = null,
        this.playlist = null,
        this.player = null,
        this.policy = null,
        this.currentAdvert = null,
        this.onComplete = null,
        this.stopBreakEndTimer(),
        this.timeline && (this.timeline.Destroy(),
        this.timeline = null),
        this.adBreakArray) {
            for (var e in this.adBreakArray)
                if (this.adBreakArray.hasOwnProperty(e)) {
                    for (var t = this.adBreakArray[e]; t.length > 0; )
                        t.pop().Destroy();
                    delete this.adBreakArray[e]
                }
            this.adBreakArray = null
        }
        if (this._missedBreaks.length > 0)
            for (var i = 0; i < this._missedBreaks.length; i++)
                this._missedBreaks[i].Destroy();
        this._missedBreaks = null
    },
    LateInit: function(e, t) {},
    setPaused: function(e) {
        this.isPaused = e,
        e && !this.isPlaying && (this.isPlaying = !0)
    },
    getCurrentBreak: function() {
        if (this instanceof YSLiveSession) {
            if (this.currentAdvert && this._currentBreak)
                return this._currentBreak
        } else {
            var e = this.timeline.getElementAtTime(this.lastPosition);
            if (e.getType() === YSTimelineElement.ADVERT)
                return e.adBreak;
            if (this.currentAdvert)
                return this.currentAdvert.adBreak
        }
        return null
    },
    addEmptyBreak: function(e) {
        if (this._missedBreaks.length > 0)
            for (var t = 0; t < this._missedBreaks.length; t++) {
                var i = this._missedBreaks[t];
                if (e.startPosition < i.startPosition)
                    return Debugger.print("Inserting empty break"),
                    void this._missedBreaks.splice(t, 0, e);
                if (e.startPosition == i.startPosition)
                    return void Debugger.print("Ignoring addition of duplicate empty break")
            }
        this._missedBreaks.push(e)
    },
    getAdById: function(e) {
        var t = null;
        if (this.adBreakArray.hasOwnProperty(e)) {
            var i = this.adBreakArray[e];
            i.length > 0 ? t = i.pop() : null === i ? Debugger.print("No adverts have yet been defined") : Debugger.print("Adverts previously seen for this ID, but none currently available: " + e)
        } else
            Debugger.print("No adverts found in array for this ID, and have not yet seen any: " + e),
            null === this.adBreakArray && Debugger.print("And ad break array is null");
        return t
    },
    getLinearClickthrough: function() {
        var e = void 0;
        return this.currentAdvert && this.currentAdvert.advert && this.currentAdvert.advert.getLinear() && (e = this.currentAdvert.advert.getLinear().getClickThrough()),
        e
    },
    setPlayer: function(e) {
        this.player = e
    },
    suppressAnalytics: function(e) {
        return e ? (this.currentAdvert && !this.analyticsSuppressed && this.currentAdvert.isSuppressed(!0),
        this.analyticsSuppressed = !0,
        this.stopBreakEndTimer(),
        null) : (this instanceof YSLiveSession && this.startBreakEndTimer(),
        this.currentAdvert && this.analyticsSuppressed ? (this.analyticsSuppressed = !1,
        this.currentAdvert.isSuppressed(!1)) : (this.analyticsSuppressed = !1,
        null))
    },
    pingAnalytics: function(e) {
        this.analyticsUrl.length > 0 ? null !== ProtoAjax.DELEGATE ? ProtoAjax.DELEGATE(this.analyticsUrl, {
            onSuccess: e.bind(this, !0),
            onFailure: e.bind(this, !1)
        }) : new ProtoAjax.Request(this.analyticsUrl,{
            method: "get",
            evalJSON: !1,
            evalJS: !1,
            onSuccess: e.bind(this, !0),
            onFailure: e.bind(this, !1)
        }) : Debugger.print("No analytics need to be fetched. Poller will not be initialized")
    },
    processAnalytics: function(e) {},
    handleMetadata: function(e) {},
    updatePosition: function(e) {
        this.lastPosition = e
    },
    isInAnAdvert: function() {
        return null !== this.currentAdvert
    },
    masterPlaylistUrl: function() {
        return this.masterURL.toString()
    },
    loadPlaylist: function() {
        this.playlist = new PlaylistParser(this.masterPlaylistUrl(),this.playlistLoaded.bind(this),this.playlistNotLoaded.bind(this))
    },
    playlistLoaded: function() {
        if (Debugger.print("Playlist was loaded"),
        this.playlist.isRedirect && (this.masterURL = new YSURL(this.playlist.server)),
        this.playlist.isXML) {
            Debugger.print("Playlist is XML - assuming DASH");
            var e = this.playlist.content[0].getElementsByTagName("MPD");
            e.length > 0 && ((e = e.item(0)).hasAttribute("analytics") && (this.analyticsUrl = e.getAttribute("analytics").replace(/\s+/g, ""),
            (n = (s = new YSURL(this.analyticsUrl)).path().split(";"))[0] = this.masterURL.path(),
            this.masterURL._path = n.join(";"),
            this.masterURL._host = s.host(),
            this.hostnode = s.host(),
            this.sessionId = n[1].split("=")[1]),
            e.hasAttribute("livepause") && (this.livePauseUrl = e.getAttribute("livepause").replace(/\s+/g, ""))),
            this.streamType = "dash"
        } else {
            var t = Object.keys(this.playlist.content);
            for (var i in t) {
                if (this.playlist.content.hasOwnProperty(i) && 0 === this.playlist.content[i].indexOf(ANALYTICS_TOKEN)) {
                    this.analyticsUrl = this.playlist.content[i].substr(ANALYTICS_TOKEN.length + 1),
                    '"' == this.analyticsUrl.charAt(0) && (this.analyticsUrl = this.analyticsUrl.substr(1, this.analyticsUrl.length - 2));
                    var s = new YSURL(this.analyticsUrl)
                      , n = s.path().split(";");
                    this.masterURL._path = this.masterURL.path() + ";" + n[1],
                    this.masterURL._host = s.host(),
                    this.hostnode = s.host(),
                    this.sessionId = n[1].split("=")[1]
                }
                this.playlist.content.hasOwnProperty(i) && 0 === this.playlist.content[i].indexOf(PAUSE_TOKEN) && (this.livePauseUrl = this.playlist.content[i].substr(PAUSE_TOKEN.length + 1),
                '"' == this.livePauseUrl.charAt(0) && (this.livePauseUrl = this.livePauseUrl.substr(1, this.livePauseUrl.length - 2)))
            }
        }
        Debugger.print("Modified URL: " + this.masterPlaylistUrl()),
        Debugger.print("Deduced analytics URL: " + this.analyticsUrl),
        this.livePauseUrl.length > 0 && Debugger.print("Deduced Live Pause URL: " + this.livePauseUrl),
        0 === this.analyticsUrl.length ? "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.NO_ANALYTICS, YSSessionStatus.NON_YOSPACE_URL, void 0) : this instanceof YSLivePauseSession ? 0 === this.livePauseUrl.length ? "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.INITIALISED, 0, YSSessionStatus.NO_LIVEPAUSE) : "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.INITIALISED, 0, 0) : "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.INITIALISED)
    },
    playlistNotLoaded: function(e) {
        Debugger.print("Playlist was NOT loaded"),
        "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.NOT_INITIALISED, e, YSSessionStatus.CONNECTION_ERROR)
    },
    startBreakEndTimer: function(e) {
        isNaN(e) && (e = YSSession.BREAK_TOLERANCE),
        null !== this.breakEndTimer && this.stopBreakEndTimer();
        var t = this._currentBreak;
        t && (console.log("Starting break end timer with break: " + t + " and duration: " + e),
        this.breakEndTimer = setTimeout(this.handleBreakEnd.bind(this, t), e))
    },
    stopBreakEndTimer: function() {
        null !== this.breakEndTimer && (clearTimeout(this.breakEndTimer),
        this.breakEndTimer = null)
    },
    handleBreakStart: function(e) {
        Debugger.print(" |||||||| CONTROL FLOW |||||||| HANDLE BREAK START"),
        e && e.vmapBreak && e.vmapBreak.tracking && e.vmapBreak.tracking.track("breakStart", []),
        e && (this._currentBreak = e),
        null === this.breakEndTimer && (null !== this.player && "function" == typeof this.player.AdBreakStart && this.player.AdBreakStart(e),
        this instanceof YSLiveSession && this.startBreakEndTimer())
    },
    handleBreakEnd: function(e) {
        Debugger.print(" |||||||| CONTROL FLOW |||||||| HANDLE BREAK END"),
        e && e.vmapBreak && e.vmapBreak.tracking && e.vmapBreak.tracking.track("breakEnd", []),
        this.isInAnAdvert() && (null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(this.currentAdvert.getMediaID()),
        this.currentAdvert.setActive(!1),
        this.currentAdvert = null),
        null !== this.breakEndTimer && this.stopBreakEndTimer(),
        e && (Debugger.print("Advert break ended - notifying consumer"),
        null !== this.player && "function" == typeof this.player.AdBreakEnd && this.player.AdBreakEnd(e)),
        this._currentBreak = null
    },
    handleAdvertStart: function(e) {
        null !== this.player && "function" == typeof this.player.AdvertStart && this.player.AdvertStart(e.getMediaID())
    },
    handleAdvertEnd: function(e) {
        e.setActive(!1),
        null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(e.getMediaID())
    },
    reportLinearEvent: function(e) {
        if (this.isInAnAdvert()) {
            var t = this.currentAdvert;
            null !== t && t.reportLinearEvent(e)
        }
    },
    reportNonLinearEvent: function(e, t) {
        if (this.isInAnAdvert()) {
            var i = this.currentAdvert;
            null !== i && i.reportNonLinearEvent(e, t)
        }
    },
    getPolicy: function() {
        return this.policy
    }
});
YSSession.idRE = new RegExp(/([^_]*)_YO_([\s\S]*)/i),
YSSession.BREAK_TOLERANCE = 6e3,
YSSession.READY = "ready",
YSSession.INIT_FAILED = "error";
var YSSessionResult = {};
YSSessionResult.INITIALISED = "ready",
YSSessionResult.NOT_INITIALISED = "error",
YSSessionResult.NO_ANALYTICS = "no-analytics";
var YSSessionStatus = {};
YSSessionStatus.CONNECTION_ERROR = -1,
YSSessionStatus.CONNECTION_TIMEOUT = -2,
YSSessionStatus.MALFORMED_URL = -3,
YSSessionStatus.NON_YOSPACE_URL = -10,
YSSessionStatus.NO_LIVEPAUSE = -11;
var YSVoDSession = ClassHelper.makeClass(YSSession, {
    initialize: function(e, t, i, s) {
        this.callSuper(this.initialize, e, t, i),
        Debugger.print("Constructing YSVoDSession"),
        this.isVLive = s,
        null !== t && t.length > 0 ? this.grabVMAP() : Debugger.print("Expecting late initialization")
    },
    Destroy: function() {
        Debugger.print("Shutting down VOD Session"),
        this.callSuper(this.Destroy),
        this.loader && (this.loader.Destroy(),
        this.loader = null)
    },
    grabVMAP: function() {
        var e = this;
        this.loader = new VMAPParser(this.source.toString(),this.onVMAPSuccess.bind(this),function(t) {
            Debugger.print("Ad Break Load Failed"),
            "function" == typeof e.onComplete && ("ism3u8" === t ? e.onComplete.call(e, YSSessionResult.NO_ANALYTICS, YSSessionStatus.NON_YOSPACE_URL, void 0) : e.onComplete.call(e, YSSessionResult.NOT_INITIALISED, t, YSSessionStatus.CONNECTION_ERROR))
        }
        )
    },
    onVMAPSuccess: function(e) {
        if (this.rebuildTimeline(e),
        !this.masterURL)
            return Debugger.printErr("VOD - Cannot start session without playback URL"),
            void ("function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.NOT_INITIALISED, 0, YSSessionStatus.CONNECTION_ERROR));
        this.isVLive ? this.loadPlaylist() : (Debugger.print("Standard VOD - Bypassing session initialisation"),
        this.masterURL.toString().indexOf("mpd") > 0 && (this.streamType = "dash"),
        "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.INITIALISED))
    },
    rebuildTimeline: function(e) {
        if (Debugger.print("\n<<<<<<<<<<<<<< PARSE COMPLETE >>>>>>>>>>>>>>>>\nBreaks returned. Length: " + e.length),
        null !== this.loader.extensions) {
            var t = this.loader.extensions.getAllOfType(TAG_YOEXT_STREAM);
            if (t.length > 0 && !this.masterURL) {
                var i = this.source.scheme() + "://" + t[0].urlDomain + t[0].urlSuffix;
                this.hostnode = t[0].urlDomain,
                this.masterURL = new YSURL(i),
                Debugger.print("URL: " + this.masterPlaylistUrl())
            }
            for (var s = 0, n = 0; n < e.length; n++) {
                var r = e[n];
                s = YSParseUtils.timecodeFromString(r.position);
                var a = new YSAdBreak(r);
                if (a.adBreakIdentifier = r.id,
                a.adBreakDescription = r.type,
                a.startPosition = s,
                r.vast) {
                    for (var o = r.vast.ads, l = 0; l < o.length; l++) {
                        var h = o[l].getLinear();
                        if (h) {
                            var u = YSSession.idRE.exec(o[l].id)[2]
                              , d = this
                              , c = new YSAdvert(o[l],d.onAdTimeout.bind(d, u),a);
                            c.trackingMonitor = d.onTrackingMonitor.bind(d),
                            a.adverts.push(c),
                            s += h.getDuration()
                        }
                    }
                    this.replaceOnTimeline(new YSTimelineAdvertElement(a.startPosition,a.getDuration(),a))
                } else
                    this.addEmptyBreak(a)
            }
            var g = t.length > 0 && t[0].isValid && t[0].duration.length > 0 ? YSParseUtils.timecodeFromString(t[0].duration) : s;
            g > 0 ? this.timeline.adjustContent(g) : Debugger.print("No duration info at this time"),
            null !== this.player && "function" == typeof this.player.UpdateTimeline && (Debugger.print("Reporting timeline to player: " + YSParseUtils.timecodeToString(this.timeline.getTotalDuration())),
            this.player.UpdateTimeline(this.timeline))
        } else
            Debugger.printErr("VMAP contained no extensions - this is a potential problem!")
    },
    replaceOnTimeline: function(e) {
        if (this.timeline) {
            var t = this.timeline.getElementAtTime(e.offset);
            if (t) {
                if (t.offset !== e.offset || t.duration !== e.duration || t.getType() !== e.getType()) {
                    var i = this.timeline.elements.indexOf(t);
                    this.timeline.elements.splice(i, 1, e)
                }
            } else
                this.timeline.appendElement(e)
        }
    },
    onTrackingMonitor: function(e, t, i) {
        null !== this.player && "function" == typeof this.player.AnalyticsFired && this.player.AnalyticsFired(e, {
            progress: t,
            asset: i
        })
    },
    processAnalytics: function(e, t) {
        Debugger.print("Processing VMAP Analytics Data (VOD)"),
        this.callSuper(this.processAnalytics, e);
        var i = this;
        this.loader = new VMAPParser(null,function(e) {
            Debugger.print("New breaks received: " + e.length),
            i.rebuildTimeline(e),
            Debugger.print("Timeline rebuilt. Total len: " + i.timeline.getTotalDuration() + " :: " + YSParseUtils.timecodeToString(i.timeline.getTotalDuration()));
            for (var s = 0; s < i.timeline.getAllElements().length; s++) {
                var n = i.timeline.getAllElements()[s];
                Debugger.print("$" + s + ": " + n.getType() + " start: " + YSParseUtils.timecodeToString(n.offset) + " dur: " + YSParseUtils.timecodeToString(n.duration))
            }
            "function" == typeof t && t.call(i, !0, e)
        }
        ,function(e) {
            Debugger.print("!no breaks"),
            "function" == typeof t && t.call(i, !1, e)
        }
        ),
        this.loader.parse(e.responseXML)
    },
    onAdTimeout: function(e) {
        Debugger.print(" !!! Advert Timeout flagged for item: " + e)
    },
    updatePosition: function(e) {
        if (!this.isPaused && this.isPlaying) {
            if (this.timeline) {
                var t = this.timeline.getTotalDuration();
                e = t > 0 && e > t ? t : e
            }
            if (this._missedBreaks.length > 0)
                for (r = 0; r < this._missedBreaks.length; r++) {
                    var i = this._missedBreaks[r];
                    if (!(this.lastPosition > i.startPosition) && e > i.startPosition) {
                        Debugger.print(" @@ MISSED BREAK @@ Transiting a missed break opportunity");
                        var s = i.vmapBreak;
                        s.tracking && (s.tracking.track("breakStart", []),
                        s.tracking.track("breakEnd", []));
                        break
                    }
                }
            if (this.callSuper(this.updatePosition, e),
            this.isInAnAdvert()) {
                this.currentAdvert.isSuppressed(this.analyticsSuppressed);
                var n = this.currentAdvert.pingWatchdog();
                if (n && n.length > 0)
                    for (var r = 0; r < n.length; r++)
                        if (null !== this.player && "function" == typeof this.player.AnalyticsFired) {
                            var a = n[r].track_id;
                            delete n[r].track_id,
                            this.player.AnalyticsFired(a, n[r])
                        }
            }
            if (null !== this.timeline) {
                var o = this.timeline.getElementAtTime(e);
                if (null === o)
                    return void Debugger.print("No timeline element was found");
                if (o.getType() === YSTimelineElement.ADVERT) {
                    var l = o.getAdverts().getAdvertForPosition(e);
                    if (!l)
                        return void Debugger.print("Could not locate current advert!");
                    var h = l.getMediaID()
                      , u = this.currentAdvert ? this.currentAdvert.getMediaID() : "";
                    this.currentAdvert === l || (Debugger.print("Different ad found"),
                    this.isInAnAdvert() ? (Debugger.print("Shutting down advert: " + u),
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(u),
                    this.currentAdvert.setActive(!1),
                    null !== this.player && "function" == typeof this.player.UpdateTimeline && this.player.UpdateTimeline(this.timeline),
                    this.currentAdvert = null) : this.handleBreakStart(this.getCurrentBreak()),
                    Debugger.print("Advert starting with ID: " + h),
                    Debugger.print("Advert Duration: " + l.duration),
                    this.currentAdvert = l,
                    this.currentAdvert.isSuppressed(this.analyticsSuppressed),
                    this.currentAdvert.setActive(!0),
                    null !== this.player && "function" == typeof this.player.AdvertStart && this.player.AdvertStart(h))
                } else if (this.isInAnAdvert()) {
                    u = this.currentAdvert.getMediaID();
                    Debugger.print("Shutting down advert: " + u),
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(u),
                    this.currentAdvert.setActive(!1),
                    null !== this.player && "function" == typeof this.player.UpdateTimeline && this.player.UpdateTimeline(this.timeline);
                    var d = this.currentAdvert.adBreak;
                    this.currentAdvert = null,
                    Debugger.print("BREAK ENDS!"),
                    this.handleBreakEnd(d)
                } else
                    null !== this.breakEndTimer && this.handleBreakEnd(this._currentBreak)
            }
        } else
            Debugger.print("Ignoring position update while not actively playing")
    },
    getContentPositionForPlayhead: function(e) {
        var t = e
          , i = 0;
        if (this.timeline) {
            for (var s = this.timeline.getAllElements(), n = 0; n < s.length && t > 0; ) {
                var r = s[n];
                r.getType() === YSTimelineElement.ADVERT ? t -= r.duration : (t > r.duration ? i += r.duration : i += t,
                t -= r.duration),
                n++
            }
            return i
        }
        return Debugger.print("Conversion from Playhead to Content failed"),
        e
    },
    getPlayheadPositionForContent: function(e) {
        var t = e
          , i = 0;
        if (this.timeline) {
            for (var s = this.timeline.getAllElements(), n = 0; n < s.length && t > 0; ) {
                var r = s[n];
                r.getType() === YSTimelineElement.ADVERT ? i += r.duration : (t > r.duration ? i += r.duration : i += t,
                t -= r.duration),
                n++
            }
            return i
        }
        return Debugger.print("Conversion from Content to Playhead failed"),
        e
    }
})
  , YSLiveSession = ClassHelper.makeClass(YSSession, {
    initialize: function(e, t, i) {
        this.callSuper(this.initialize, e, t, i),
        Debugger.print("Constructing YSLiveSession"),
        this.adBreakArray = {},
        this._pollCount = 0,
        this._deferred = !1,
        this._currentBreaks = [],
        this._currentBreak = null,
        this._cachedMetadata = [],
        null !== t && t.length > 0 ? (this.masterURL = new YSURL(this.source),
        this.loadPlaylist()) : Debugger.print("Expecting late initialization")
    },
    Destroy: function() {
        if (this.callSuper(this.Destroy),
        this._currentBreak = null,
        this._currentBreaks) {
            for (; this._currentBreaks.length > 0; )
                this._currentBreaks.pop().Destroy();
            this._currentBreaks = null
        }
        this.loader && (this.loader.Destroy(),
        this.loader = null)
    },
    LateInit: function(e, t) {
        this.masterURL = new YSURL(e);
        var i = new YSURL(t);
        this.masterURL._host = i.host();
        var s = i.path().split(";")[1];
        this.masterURL._path = this.masterURL._path + ";" + s,
        this.source = this.masterURL.toString(),
        console.log("=== LATE INIT === " + this.masterURL.toString()),
        this.loadPlaylist(!0)
    },
    processAnalytics: function(e, t) {
        Debugger.print("Processing VAST Analytics Data"),
        this._pollCount < 2 && this._pollCount++,
        this.callSuper(this.processAnalytics, e);
        var i = this
          , s = !1
          , n = e.responseText.indexOf("<vmap" + YSParseUtils.NS_SEPARATOR + "VMAP")
          , r = e.responseText.indexOf("<VAST");
        -1 != n && n < r && (Debugger.print(" +=+ USING ENHANCED ANALYTICS +=+ "),
        s = !0),
        this.loader = s ? new VMAPParser(null,function(e) {
            if (Debugger.print("New breaks received: " + e.length),
            e.length > 0)
                for (var s = 0; s < e.length; s++) {
                    var n = e[s]
                      , r = YSParseUtils.timecodeFromString(n.position);
                    offset = r;
                    var a = new YSAdBreak(n);
                    if (a.adBreakIdentifier = n.id,
                    a.adBreakDescription = n.type,
                    a.startPosition = offset,
                    n.vast) {
                        for (var o = n.vast.ads, l = 0; l < o.length; l++) {
                            var h = o[l].getLinear();
                            if (h) {
                                var u = YSSession.idRE.exec(o[l].id)[2]
                                  , d = new YSAdvert(o[l],i.onAdTimeout.bind(i, u),a);
                                d.trackingMonitor = i.onTrackingMonitor.bind(i),
                                a.adverts.push(d),
                                offset += h.getDuration(),
                                i.adBreakArray.hasOwnProperty(u) || (i.adBreakArray[u] = []),
                                i.adBreakArray[u].unshift(d)
                            }
                        }
                        i._currentBreaks.push(a)
                    } else
                        Debugger.print(" @@ MISSED BREAK @@ Transiting a missed break opportunity"),
                        n.tracking && (n.tracking.track("breakStart", []),
                        n.tracking.track("breakEnd", []))
                }
            e.length > 0 && i._deferred && i.processCachedMetadata(),
            "function" == typeof t && t.call(i, !0, e)
        }
        ,function(e) {
            Debugger.print("!no breaks"),
            "function" == typeof t && t.call(i, !1, e)
        }
        ) : new VASTParser(null,function(e) {
            if (Debugger.print("New breaks received: " + e.length),
            e.length > 0) {
                for (var s = new YSAdBreak(null), n = 0; n < e.length; n++) {
                    var r = YSSession.idRE.exec(e[n].id)
                      , a = r ? r[2] : e[n].id;
                    Debugger.print("Adding to bucket, MIID: " + a),
                    i.adBreakArray.hasOwnProperty(a) || (i.adBreakArray[a] = []);
                    var o = new YSAdvert(e[n],i.onAdTimeout.bind(i, a),s);
                    s.adverts.push(o),
                    o.trackingMonitor = i.onTrackingMonitor.bind(i),
                    i.adBreakArray[a].unshift(o);
                    var l = 0;
                    for (var h in i.adBreakArray)
                        i.adBreakArray.hasOwnProperty(h) && (l += i.adBreakArray[h].length);
                    Debugger.print("New bucket size: " + l)
                }
                i._currentBreaks.push(s)
            }
            e.length > 0 && i._deferred && i.processCachedMetadata(),
            "function" == typeof t && t.call(i, !0, e)
        }
        ,function(e) {
            Debugger.print("VAST Failure?"),
            "function" == typeof t && t.call(i, !1, e)
        }
        ),
        this.loader.parse(e.responseXML)
    },
    processCachedMetadata: function() {
        for (this._deferred && (Debugger.print("Received deferred VAST response"),
        this._deferred = !1); this._cachedMetadata.length > 0; ) {
            var e = this._cachedMetadata.shift()
              , t = e.metadata;
            if (this.handleMetadata(t),
            t.hasOwnProperty("YMID")) {
                var i = t.YTYP
                  , s = t.YSEQ.split(":")[0];
                "S" === i && "1" === s && (this.currentAdvert ? this.currentAdvert.startPosition = e.timestamp : Debugger.print("Cannot set back-time of current advert (no ad active)"))
            }
        }
    },
    onAdTimeout: function(e) {
        Debugger.print(" !!! Advert Timeout flagged for item: " + e)
    },
    onTrackingMonitor: function(e, t, i) {
        null !== this.player && "function" == typeof this.player.AnalyticsFired && this.player.AnalyticsFired(e, {
            progress: t,
            asset: i
        })
    },
    handleMetadata: function(e) {
        var t = !1;
        if (this.isPlaying)
            if (e) {
                Debugger.print("Live metadata is non-null");
                for (var i in e)
                    e.hasOwnProperty(i) && Debugger.print("Property '" + i + "' = '" + e[i] + "'");
                if (0 == this._currentBreaks.length && (this._pollCount < 2 || this._deferred)) {
                    if (Debugger.print("Waiting for initial VAST response... deferring"),
                    !this._deferred) {
                        this._deferred = !0;
                        var s = this;
                        this.pingAnalytics(function(e, t) {
                            Debugger.print("OK, have pinged: " + e),
                            s.processAnalytics(t, null)
                        })
                    }
                    this._cachedMetadata.push({
                        timestamp: (new Date).getTime(),
                        metadata: e
                    })
                } else if (this._deferred && this._cachedMetadata.length > 0)
                    this._cachedMetadata.push({
                        timestamp: (new Date).getTime(),
                        metadata: e
                    });
                else if (e.hasOwnProperty("YMID")) {
                    var n = e.YMID
                      , r = e.YTYP
                      , a = e.YSEQ.split(":")
                      , o = a[0]
                      , l = a[1];
                    if (Debugger.print("Valid ID3 found. MIID: " + n),
                    this.isInAnAdvert() && this.currentAdvert.getMediaID() === n) {
                        Debugger.print("Advert still running for MIID: " + n + " with type: " + r + " Seq " + o + " of " + l),
                        this.stopBreakEndTimer(),
                        this.startBreakEndTimer(),
                        this.currentAdvert.isSuppressed(this.analyticsSuppressed);
                        var h = this.currentAdvert.pingWatchdog();
                        if (h && h.length > 0)
                            for (var u = 0; u < h.length; u++)
                                if (null !== this.player && "function" == typeof this.player.AnalyticsFired) {
                                    var d = h[u].track_id;
                                    delete h[u].track_id,
                                    this.player.AnalyticsFired(d, h[u])
                                }
                    } else {
                        var c = this.isInAnAdvert();
                        c ? (Debugger.print("Currently in an advert, but the media ID has changed. Terminating current advert."),
                        this.handleAdvertEnd(this.currentAdvert),
                        this.currentAdvert = null) : Debugger.print("Not yet in an advert");
                        var g = this.getAdById(n);
                        null !== g ? (c || "S" === r && "1" === o ? (Debugger.print("Advert starting for MIID: " + n + " with type: " + r + " Seq " + o + " of " + l),
                        Debugger.print("Advert Duration: " + g.duration),
                        this.currentAdvert = g,
                        t = !0) : (Debugger.print("Ignoring advert with MIID: " + n + " because tag is not a start tag. Type: " + r + " Seq: " + o + " of " + l),
                        this.adBreakArray[n].unshift(g)),
                        null !== this.breakEndTimer || this._currentBreak ? (this.stopBreakEndTimer(),
                        this.startBreakEndTimer()) : (this._currentBreak = this._currentBreaks[0],
                        this._currentBreak ? this.handleBreakStart(this.getCurrentBreak()) : console.log("Could not find break")),
                        null !== this.currentAdvert && null !== this.player && "function" == typeof this.player.AdvertStart && this.player.AdvertStart(n),
                        this.currentAdvert && (this.currentAdvert.isSuppressed(this.analyticsSuppressed),
                        t && this.currentAdvert.setActive(!0))) : (Debugger.print("Could not locate ad for miid: " + n),
                        null !== this.breakEndTimer && (this.stopBreakEndTimer(),
                        this.startBreakEndTimer()))
                    }
                    "E" == r && null !== this.currentAdvert && (o == l || this.currentAdvert.timeElapsed() > this.currentAdvert.duration) && (Debugger.print("Advert ending for MIID: " + n + " with type: " + r + " Seq " + o + " of " + l),
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(n),
                    this.currentAdvert.setActive(!1),
                    this.currentAdvert = null)
                } else
                    Debugger.print("Ignoring unrecognized ID3 tag")
            } else
                Debugger.print("Live metadata is null");
        else
            Debugger.print("Dropping metadata reported before playback has started")
    },
    updatePosition: function(e) {
        if (this.callSuper(this.updatePosition, e),
        !this.paused && this.isPlaying)
            if (this.isInAnAdvert())
                if (this.currentAdvert.timeElapsed() > this.currentAdvert.duration) {
                    Debugger.print("******************* ADVERT HAS EXCEEDED DURATION!!! *************************");
                    var t = this.currentAdvert.getMediaID();
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(t),
                    this.currentAdvert.setActive(!1),
                    this.currentAdvert = null
                } else {
                    this.currentAdvert.isSuppressed(this.analyticsSuppressed);
                    var i = this.currentAdvert.pingWatchdog();
                    if (i && i.length > 0)
                        for (var s = 0; s < i.length; s++)
                            if (null !== this.player && "function" == typeof this.player.AnalyticsFired) {
                                var n = i[s].track_id;
                                delete i[s].track_id,
                                this.player.AnalyticsFired(n, i[s])
                            }
                }
            else
                null !== this.breakEndTimer && (this.haveMoreAds() ? Debugger.print("--- WAITING FOR NEXT AD!!!") : (Debugger.print("--- COULD STOP BREAK HERE!!!"),
                this.handleBreakEnd(this._currentBreak)));
        else
            Debugger.print("Ignoring position update while not actively playing")
    },
    haveMoreAds: function() {
        var e = 0;
        for (var t in this.adBreakArray)
            this.adBreakArray.hasOwnProperty(t) && (e += this.adBreakArray[t].length);
        return Debugger.print("Have more ads? " + e),
        e > 0
    },
    handleBreakEnd: function(e) {
        this.callSuper(this.handleBreakEnd, e),
        this._currentBreaks.length > 0 && this._currentBreaks.shift(),
        this._currentBreak = null
    }
})
  , YSLivePauseSession = ClassHelper.makeClass(YSSession, {
    initialize: function(e, t, i) {
        this.callSuper(this.initialize, e, t, i),
        Debugger.print("Constructing YSLivePauseSession"),
        this.streamStart = null,
        this.streamWindowStart = null,
        this.streamWindowEnd = null,
        this.streamWindowSize = 0,
        this.streamDuration = 0,
        this.adBreakArray = {},
        this._pollCount = 0,
        this._deferred = !1,
        this.masterURL = new YSURL(this.source),
        this.loadPlaylist(),
        this.livePauseURL = null
    },
    Destroy: function() {
        this.callSuper(this.Destroy),
        this.streamStart = null,
        this.streamWindowStart = null,
        this.streamWindowEnd = null,
        this._deferred = !1,
        this.isPaused = !1
    },
    setPaused: function(e) {
        this.callSuper(this.setPaused, e),
        this.isPaused = e
    },
    grabVMAP: function() {
        var e = this;
        this.loader = new VMAPParser(this.source.toString(),this.onVMAPSuccess.bind(this),function(t) {
            Debugger.print("Ad Break Load Failed"),
            "function" == typeof e.onComplete && ("ism3u8" === t ? e.onComplete.call(e, YSSessionResult.NO_ANALYTICS, YSSessionStatus.NON_YOSPACE_URL, void 0) : e.onComplete.call(e, YSSessionResult.NOT_INITIALISED, t, YSSessionStatus.CONNECTION_ERROR))
        }
        )
    },
    onVMAPSuccess: function(e) {
        this.rebuildTimeline(e),
        "function" == typeof this.onComplete && this.onComplete.call(this, YSSessionResult.INITIALISED)
    },
    rebuildTimeline: function(e) {
        var t = this.loader.extensions.getAllOfType(TAG_YOEXT_STREAM);
        if (t.length > 0) {
            if (!this.masterURL) {
                var i = this.source.scheme() + "://" + t[0].urlDomain + t[0].urlSuffix;
                this.hostnode = t[0].urlDomain,
                this.masterURL = new YSURL(i),
                Debugger.print("URL: " + this.masterPlaylistUrl())
            }
            var s = t[0].StartPDT
              , n = t[0].EndPDT;
            s && n && (this._streamStart || (this._streamStart = new Date(s)),
            this._streamWindowStart = new Date(s),
            this._streamWindowEnd = new Date(n),
            this._streamWindowSize = (this._streamWindowEnd - this._streamWindowStart) / 1e3,
            this._streamDuration = (this._streamWindowEnd - this._streamStart) / 1e3,
            Debugger.print("Stream start: " + this._streamStart.toISOString()),
            Debugger.print("Stream window start: " + this._streamWindowStart.toISOString()),
            Debugger.print("Stream window end: " + this._streamWindowEnd.toISOString()),
            Debugger.print("Stream Window Length: " + this._streamWindowSize),
            Debugger.print("Stream Duration: " + this._streamDuration))
        }
        for (var r = 0, a = 0; a < e.length; a++) {
            var o = e[a];
            r = YSParseUtils.timecodeFromString(o.position);
            var l = new YSAdBreak(o);
            l.adBreakIdentifier = o.id,
            l.adBreakDescription = o.type,
            l.startPosition = r;
            for (var h = o.vast.ads, u = 0; u < h.length; u++) {
                var d = h[u].getLinear();
                if (d) {
                    var c = YSSession.idRE.exec(h[u].id)[1]
                      , g = this
                      , p = new YSAdvert(h[u],g.onAdTimeout.bind(g, c),l);
                    p.trackingMonitor = g.onTrackingMonitor.bind(g),
                    l.adverts.push(p),
                    r += d.getDuration()
                }
            }
            this.replaceOnTimeline(new YSTimelineAdvertElement(l.startPosition,l.getDuration(),l))
        }
        this._streamWindowStart && this._streamStart ? this.timeline.UpdateOffset((this._streamWindowStart - this._streamStart) / 1e3) : this.timeline.startOffset = 0;
        var f = t.length > 0 && t[0].isValid && t[0].duration.length > 0 ? YSParseUtils.timecodeFromString(t[0].duration) : r;
        f > 0 ? this.timeline.adjustContent(f) : Debugger.print("No duration info at this time"),
        null !== this.player && "function" == typeof this.player.UpdateTimeline && (Debugger.print("Reporting timeline to player: " + YSParseUtils.timecodeToString(this.timeline.getTotalDuration())),
        this.player.UpdateTimeline(this.timeline))
    },
    replaceOnTimeline: function(e) {
        if (this.timeline) {
            var t = this.timeline.getElementAtTime(e.offset);
            if (t) {
                if (t.offset !== e.offset || t.duration !== e.duration || t.getType() !== e.getType()) {
                    var i = this.timeline.elements.indexOf(t);
                    this.timeline.elements.splice(i, 1, e)
                }
            } else
                this.timeline.appendElement(e)
        }
    },
    onTrackingMonitor: function(e, t, i) {
        null !== this.player && "function" == typeof this.player.AnalyticsFired && this.player.AnalyticsFired(e, {
            progress: t,
            asset: i
        })
    },
    processAnalytics: function(e, t) {
        this.callSuper(this.processAnalytics, e);
        var i = this;
        this.loader = new VMAPParser(null,function(e) {
            Debugger.print("New breaks received: " + e.length),
            i.rebuildTimeline(e),
            Debugger.print("Timeline rebuilt. Total len: " + i.timeline.getTotalDuration() + " :: " + YSParseUtils.timecodeToString(i.timeline.getTotalDuration()));
            for (var s = 0; s < i.timeline.getAllElements().length; s++) {
                var n = i.timeline.getAllElements()[s];
                Debugger.print("$" + s + ": " + n.getType() + " start: " + YSParseUtils.timecodeToString(n.offset) + " dur: " + YSParseUtils.timecodeToString(n.duration))
            }
            "function" == typeof t && t.call(i, !0, e)
        }
        ,function(e) {
            Debugger.print("!no breaks"),
            "function" == typeof t && t.call(i, !1, e)
        }
        ),
        this.loader.parse(e.responseXML),
        this.isPaused && (this.livePauseUrl.length > 0 ? (Debugger.print("Calling LivePause Handler..."),
        null !== ProtoAjax.DELEGATE ? ProtoAjax.DELEGATE(this.livePauseUrl, {
            onSuccess: function() {
                Debugger.print("Pause handler returned")
            },
            onFailure: function() {
                Debugger.print("Pause handler failed")
            }
        }) : new ProtoAjax.Request(this.livePauseUrl,{
            method: "get",
            evalJSON: !1,
            evalJS: !1,
            onSuccess: function() {
                Debugger.print("Pause handler returned")
            },
            onFailure: function() {
                Debugger.print("Pause handler failed")
            }
        })) : Debugger.print("No live pause URL available"))
    },
    onAdTimeout: function(e) {
        Debugger.print(" !!! Advert Timeout flagged for item: " + e)
    },
    updatePosition: function(e) {
        if (this.callSuper(this.updatePosition, e),
        !this.paused && this.isPlaying) {
            if (this.isInAnAdvert()) {
                this.currentAdvert.paused || (this.stopBreakEndTimer(),
                this.startBreakEndTimer()),
                this.currentAdvert.isSuppressed(this.analyticsSuppressed);
                var t = this.currentAdvert.pingWatchdog();
                if (t && t.length > 0)
                    for (var i = 0; i < t.length; i++)
                        if (null !== this.player && "function" == typeof this.player.AnalyticsFired) {
                            var s = t[i].track_id;
                            delete t[i].track_id,
                            this.player.AnalyticsFired(s, t[i])
                        }
            }
            if (null !== this.timeline) {
                var n = this.timeline.getElementAtTime(e);
                if (null === n)
                    return void Debugger.print("No timeline element was found");
                if (n.getType() === YSTimelineElement.ADVERT) {
                    var r = n.getAdverts().getAdvertForPosition(e);
                    if (!r)
                        return void Debugger.print("Could not locate current advert!");
                    var a = r.getMediaID()
                      , o = this.currentAdvert ? this.currentAdvert.getMediaID() : "";
                    this.currentAdvert === r || (Debugger.print("Different ad found"),
                    this.isInAnAdvert() && (Debugger.print("Shutting down advert: " + o),
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(o),
                    this.currentAdvert.setActive(!1),
                    null !== this.player && "function" == typeof this.player.UpdateTimeline && this.player.UpdateTimeline(this.timeline),
                    this.currentAdvert = null),
                    Debugger.print("Advert starting with ID: " + a),
                    Debugger.print("Advert Duration: " + r.duration),
                    this.currentAdvert = r,
                    this.currentAdvert.isSuppressed(this.analyticsSuppressed),
                    this.currentAdvert.setActive(!0),
                    this.handleBreakStart(this.getCurrentBreak()),
                    null !== this.player && "function" == typeof this.player.AdvertStart && this.player.AdvertStart(a))
                } else if (this.isInAnAdvert()) {
                    o = this.currentAdvert.getMediaID();
                    Debugger.print("Shutting down advert: " + o),
                    null !== this.player && "function" == typeof this.player.AdvertEnd && this.player.AdvertEnd(o),
                    this.currentAdvert.setActive(!1),
                    null !== this.player && "function" == typeof this.player.UpdateTimeline && this.player.UpdateTimeline(this.timeline);
                    var l = this.currentAdvert.adBreak;
                    this.currentAdvert = null,
                    Debugger.print("BREAK ENDS!"),
                    this.handleBreakEnd(l)
                }
            }
        } else
            Debugger.print("Ignoring position update while not actively playing")
    }
})
  , YSPlayerEvents = {};
YSPlayerEvents.READY = "ready",
YSPlayerEvents.START = "start",
YSPlayerEvents.END = "complete",
YSPlayerEvents.MUTE = "mute",
YSPlayerEvents.FULLSCREEN = "fullscreen",
YSPlayerEvents.POSITION = "position",
YSPlayerEvents.METADATA = "id3",
YSPlayerEvents.PAUSE = "pause",
YSPlayerEvents.RESUME = "resume",
YSPlayerEvents.SEEK_START = "seek_begin",
YSPlayerEvents.SEEK_END = "seek_end",
YSPlayerEvents.CLICK = "click",
YSPlayerEvents.NONLINEAR = "non_linear",
YSPlayerEvents.STALL = "buffer",
YSPlayerEvents.CONTINUE = "continue",
YSPlayerEvents.LINEAR_EVENT = "linear",
YSPlayerEvents.NONLINEAR_EVENT = "nonlinear",
YSPlayerEvents.ERROR = "error";
var YSSessionManager = ClassHelper.makeClass({
    initialize: function() {
        this.session = null,
        this.listener = null,
        this.poller = null,
        this.player = null,
        this.properties = YSSessionManager.DEFAULTS
    },
    getVersion: function() {
        return YSSessionManager.VERSION
    },
    isYospaceStream: function() {
        if (!this.session)
            return !1;
        if (this.session.analyticsUrl.length > 0)
            return !0;
        if (this.session instanceof YSVoDSession) {
            var e = this.getTimeline();
            if (e && e.getAllElements().length > 1)
                return !0
        }
        return !1
    },
    notifyDelegate: function(e, t) {
        "function" == typeof this.listener && this.listener.call(this, e, t)
    },
    mergeProperties: function(e, t) {
        var i = Object.keys(t);
        if (i.length > 0)
            for (var s = 0; s < i.length; s++) {
                var n = i[s];
                e.hasOwnProperty(n) && (t[n] = e[n])
            }
    },
    createNonLinearSession: function(e, t, i) {
        Debugger.print("Creating for nonLinear: " + e),
        null !== t && this.mergeProperties(t, this.properties),
        this.listener = i,
        this.session = new YSVoDSession(this,e,this.sessionConstructed.bind(this),!0)
    },
    createLivePauseSession: function(e, t, i) {
        Debugger.print("Creating for nonLinear: " + e),
        null !== t && this.mergeProperties(t, this.properties),
        this.listener = i,
        this.session = new YSLivePauseSession(this,e,this.sessionConstructed.bind(this))
    },
    createVODSession: function(e, t, i) {
        Debugger.print("Creating for VOD: " + e),
        null !== t && this.mergeProperties(t, this.properties),
        this.listener = i,
        this.session = new YSVoDSession(this,e,this.sessionConstructed.bind(this),!1)
    },
    createLiveSession: function(e, t, i) {
        Debugger.print("Creating for Live: " + e),
        null !== t && (Debugger.print("Merging properties"),
        this.mergeProperties(t, this.properties)),
        this.listener = i,
        this.session = new YSLiveSession(this,e,this.sessionConstructed.bind(this))
    },
    sessionConstructed: function(e, t, i) {
        Debugger.print("Session Init Result: " + e),
        Debugger.print("Session Init Status: " + t),
        Debugger.print("Session Init Code: " + i),
        this.session ? (e === YSSessionResult.INITIALISED && (this.poller = new YOPoller(this.properties.LOW_FREQ,this.properties.HIGH_FREQ),
        this._analyticsCB = this.onAnalytics.bind(this),
        this._pingCB = this.session.pingAnalytics.bind(this.session, this._analyticsCB),
        !this.session instanceof YSLivePauseSession && this.session.pingAnalytics(this._analyticsCB)),
        this.notifyDelegate(e, 0 === t ? i : t)) : Debugger.print("Session was constructed - but has now gone away?")
    },
    shutdown: function() {
        Debugger.print("Shutting down AdManagement session"),
        this.session && (this.session.Destroy(),
        this.session = null),
        this.poller && (this.poller.Destroy(),
        this.poller = null),
        this.player = null,
        this.listener = null,
        this._analyticsCB = null,
        this._pingCB = null
    },
    onAnalytics: function(e, t) {
        this.session ? e ? (this.session.processAnalytics(t, function(e, t) {
            e || Debugger.print("Failed to update analytics")
        }),
        this.poller.startPolling(!1, this._pingCB)) : (Debugger.print("ANALYTICS FAIL"),
        this.poller.startPolling(!1, this._pingCB)) : Debugger.print("Ignoring analytics response as there is no session")
    },
    reportPlayerEvent: function(e, t) {
        if (this.session)
            switch (e != YSPlayerEvents.POSITION && Debugger.print("Event reported: " + e),
            e) {
            case YSPlayerEvents.FULLSCREEN:
                !0 === Boolean(t) ? (this.invokeTracking("fullscreen"),
                this.invokeTracking("expand", !1)) : (this.invokeTracking("exitFullscreen"),
                this.invokeTracking("collapse", !1));
                break;
            case YSPlayerEvents.MUTE:
                !0 === Boolean(t) ? this.invokeTracking("mute") : this.invokeTracking("unmute");
                break;
            case YSPlayerEvents.POSITION:
                this.session.updatePosition(t);
                break;
            case YSPlayerEvents.NONLINEAR:
                if (this.session.isInAnAdvert()) {
                    var i = this.session.currentAdvert.advert.getNonLinears();
                    if (i && i.length > t) {
                        s = i[t].getClickThrough();
                        Debugger.print(" <<>> Should open" + s),
                        this.session.reportNonLinearEvent(t, "click")
                    }
                }
                break;
            case YSPlayerEvents.CLICK:
                if (this.session.isInAnAdvert()) {
                    var s = this.session.currentAdvert.advert.getLinear().getClickThrough();
                    Debugger.print(" <<>> Should open" + s),
                    this.invokeTracking("click")
                }
                break;
            case YSPlayerEvents.PAUSE:
            case YSPlayerEvents.STALL:
                if (e === YSPlayerEvents.PAUSE && (this.invokeTracking("pause"),
                this.session instanceof YSLivePauseSession && this.session.setPaused(!0)),
                this.session.isInAnAdvert() && (this.session.currentAdvert.adPaused(),
                this.session.stopBreakEndTimer()),
                this.session instanceof YSLivePauseSession)
                    break;
            case YSPlayerEvents.END:
                if (e === YSPlayerEvents.END && this.session.isInAnAdvert()) {
                    this.session.reportLinearEvent("closeLinear");
                    var n = this.session.currentAdvert.adBreak;
                    this.session.currentAdvert.paused = !1,
                    this.session.handleBreakEnd(n),
                    n && (Debugger.print("Advert break ended - notifying consumer"),
                    null !== this.session.player && "function" == typeof this.session.player.AdBreakEnd && this.session.player.AdBreakEnd(n))
                }
                this.session.isPlaying = !1;
                break;
            case YSPlayerEvents.RESUME:
            case YSPlayerEvents.CONTINUE:
                if (e === YSPlayerEvents.RESUME && (this.invokeTracking("resume"),
                this.session instanceof YSLivePauseSession && this.session.setPaused(!1)),
                this.session.isInAnAdvert() && (this.session.currentAdvert.adResumed(),
                this.session instanceof YSLiveSession && this.session.startBreakEndTimer()),
                this.session instanceof YSLivePauseSession)
                    break;
            case YSPlayerEvents.START:
                if (this.session.isPlaying = !0,
                e === YSPlayerEvents.START) {
                    var r = this;
                    setTimeout(function() {
                        r.session && r.session.pingAnalytics(r._analyticsCB)
                    }, 2e3)
                }
                break;
            case YSPlayerEvents.METADATA:
                this.session.handleMetadata(this.sanitize(t));
                break;
            case YSPlayerEvents.LINEAR_EVENT:
                this.session.reportLinearEvent(t);
                break;
            case YSPlayerEvents.NONLINEAR_EVENT:
                if (!t.hasOwnProperty("which"))
                    return;
                if (!t.hasOwnProperty("event"))
                    return;
                this.session.reportNonLinearEvent(t.which, t.event)
            }
    },
    sanitize: function(e) {
        var t = {};
        for (var i in e)
            if (e.hasOwnProperty(i)) {
                var s = this.makeClean(i)
                  , n = this.makeClean(e[i]);
                t[s] = n
            }
        return t
    },
    makeClean: function(e) {
        for (var t = "", i = 0; i < e.length; i++)
            e.charCodeAt(i) >= 32 && (t += String.fromCharCode(e.charCodeAt(i)));
        return t
    },
    invokeTracking: function(e, t, i) {
        this.session.isInAnAdvert() && this.session.currentAdvert.advert && (this.session.currentAdvert.invokeTracking(e, t, i),
        this.player && "function" == typeof this.player.AnalyticsFired && this.player.AnalyticsFired(e, null))
    },
    registerPlayer: function(e) {
        this.player = e,
        this.session.setPlayer(this.player)
    },
    masterPlaylist: function() {
        return this.session.masterPlaylistUrl()
    },
    getTimeline: function() {
        return this.session.timeline
    },
    RawID3: function(e) {
        var t = YSID3Parser.ParseArray(e);
        t ? this.reportPlayerEvent(YSPlayerEvents.METADATA, t) : Debugger.print("ID3 parse returned null")
    }
});
YSSessionManager.createForLivePause = function(e, t, i) {
    var s = new YSSessionManager;
    if (!s)
        throw new Error("Failed to create new SessionManager instance");
    return s.createLivePauseSession(e, t, i),
    s
}
,
YSSessionManager.createForLive = function(e, t, i) {
    var s;
    if (!(s = new YSSessionManager))
        throw new Error("Failed to create new SessionManager instance");
    return s.createLiveSession(e, t, i),
    s
}
,
YSSessionManager.createForNonLinear = function(e, t, i) {
    var s = new YSSessionManager;
    if (!s)
        throw new Error("Failed to create new SessionManager instance");
    return s.createNonLinearSession(e, t, i),
    s
}
,
YSSessionManager.createForVoD = function(e, t, i) {
    var s = new YSSessionManager;
    if (!s)
        throw new Error("Failed to create new SessionManager instance");
    return s.createVODSession(e, t, i),
    s
}
,
YSSessionManager.VERSION = "1.7.9",
YSSessionManager.DEFAULTS = {
    LOW_FREQ: 4e3,
    HIGH_FREQ: 500,
    AD_DEBUG: !1,
    DEBUGGING: !1
};
var YSID3Parser = ClassHelper.makeClass();
YSID3Parser.ID3SYNC = 1229206272,
YSID3Parser.UNSYNC = 128,
YSID3Parser.EXTHDR = 64,
YSID3Parser.GetU32 = function(e, t) {
    return YSID3Parser.GetU16(e, t) << 16 | YSID3Parser.GetU16(e, t + 2)
}
,
YSID3Parser.GetU16 = function(e, t) {
    return YSID3Parser.GetU8(e, t) << 8 | YSID3Parser.GetU8(e, t + 1)
}
,
YSID3Parser.GetU8 = function(e, t) {
    return e[t]
}
,
YSID3Parser.ParseArray = function(e) {
    var t = new Uint8Array(e);
    return YSID3Parser.ParseUint8Array(t)
}
,
YSID3Parser.ParseUint8Array = function(e) {
    var t = {}
      , i = 0
      , s = YSID3Parser.GetU32(e, i);
    if (i += 3,
    (4294967040 & s) != YSID3Parser.ID3SYNC)
        return Debugger.print("Source data is not an ID3 tag"),
        null;
    var n = YSID3Parser.GetU16(e, i);
    if (i += 2,
    n > 1024)
        return Debugger.print("ID3 tag version too new - not supported"),
        null;
    var r = YSID3Parser.GetU8(e, i++);
    if (r & YSID3Parser.UNSYNC || r & YSID3Parser.EXTHDR)
        return null;
    var a = ((127 & YSID3Parser.GetU8(e, i + 0)) << 21) + ((127 & YSID3Parser.GetU8(e, i + 1)) << 14) + ((127 & YSID3Parser.GetU8(e, i + 2)) << 7) + (127 & YSID3Parser.GetU8(e, i + 3));
    for (i += 4; i < a; ) {
        var o = String.fromCharCode(YSID3Parser.GetU8(e, i++)) + String.fromCharCode(YSID3Parser.GetU8(e, i++)) + String.fromCharCode(YSID3Parser.GetU8(e, i++)) + String.fromCharCode(YSID3Parser.GetU8(e, i++))
          , l = ((127 & YSID3Parser.GetU8(e, i + 0)) << 21) + ((127 & YSID3Parser.GetU8(e, i + 1)) << 14) + ((127 & YSID3Parser.GetU8(e, i + 2)) << 7) + (127 & YSID3Parser.GetU8(e, i + 3));
        if (i += 4,
        0 == l)
            break;
        i += 2;
        for (var h = "", u = 0; u < l; u++) {
            var d = YSID3Parser.GetU8(e, i++);
            d >= 32 && d < 127 && (h += String.fromCharCode(d))
        }
        t[o] = h
    }
    return t
}
;
var YSAdBreak = ClassHelper.makeClass({
    initialize: function(e) {
        this.vmapBreak = e,
        this.adBreakIdentifier = "",
        this.adBreakDescription = "",
        this.adverts = [],
        this.startPosition = 0
    },
    Destroy: function() {
        for (; this.adverts.length > 0; )
            this.adverts.pop().Destroy();
        this.adverts = null,
        this.vmapBreak = null
    },
    isActive: function() {
        if (!this.adverts || 0 === this.adverts.length)
            return !1;
        for (var e = 0; e < this.adverts.length; e++)
            if (this.adverts[e].isActive)
                return !0;
        return !1
    },
    getDuration: function() {
        var e = 0;
        if (this.adverts && 0 !== this.adverts.length)
            for (var t = 0; t < this.adverts.length; t++)
                e += this.adverts[t].duration;
        return e
    },
    getAdvertForPosition: function(e) {
        if (this.adverts && this.adverts.length > 0)
            for (var t = this.startPosition, i = 0; i < this.adverts.length; i++) {
                if (e >= t && e - t < this.adverts[i].duration)
                    return this.adverts[i];
                t += this.adverts[i].duration
            }
        else
            Debugger.print("No adverts!!");
        return null
    }
})
  , YSAdvert = ClassHelper.makeClass({
    initialize: function(e, t, i) {
        this.isActive = !0,
        this.advert = e,
        this.duration = e.getLinear().getDuration(),
        this.watchdogCallback = t,
        this.watchdog = null,
        this.trackingMonitor = null,
        this.startPosition = void 0,
        this.alreadyElapsed = 0,
        this.paused = !1,
        this.trackingPoint = 0,
        this.adBreak = i,
        e.container = this
    },
    Destroy: function() {
        this.adBreak = null
    },
    getBreak: function() {
        return this.adBreak
    },
    getAdvertID: function() {
        var e = "";
        return this.advert && (e = YSSession.idRE.exec(this.advert.id)[1]),
        e
    },
    getCreativeID: function() {
        var e = "";
        if (this.advert) {
            var t = this.advert.getLinear();
            t && (e = t.CreativeID)
        }
        return e
    },
    getMediaID: function() {
        var e = "";
        if (this.advert) {
            var t = YSSession.idRE.exec(this.advert.id);
            e = t ? t[2] : this.advert.id
        }
        return e
    },
    isFiller: function() {
        return "filler" === this.advert.AdTitle
    },
    hasInteractiveUnit: function() {
        return null !== this.advert && null !== this.advert.getLinear() && this.advert.getLinear().hasInteractiveUnit()
    },
    getInteractiveUnit: function() {
        return this.hasInteractiveUnit() ? this.advert.getLinear().interactiveUnit : null
    },
    pingWatchdog: function() {
        var e = [];
        if (!this.paused) {
            if (null !== this.watchdog && this.stopWatchdog(),
            this.startWatchdog(this.duration),
            this.duration > 0) {
                var t = this.timeElapsed()
                  , i = this.duration
                  , s = "dummyasset"
                  , n = this.adBreak
                  , r = "";
                if (this.advert.getLinear()) {
                    var a = this.advert.getLinear().getAllMedias();
                    a && a.length > 0 && (s = a[0].src),
                    r = YSParseUtils.timecodeToString(n.getDuration()),
                    this.advert.getLinear().trackProgress(t, s, r)
                }
                t > i / 4 && this.trackingPoint < 2 && (Debugger.print(" -=-> First Quartile"),
                e.push({
                    track_id: "firstQuartile",
                    progress: t,
                    asset: s
                }),
                this.advert.getLinear().track("firstQuartile", t, s, r),
                this.trackingPoint = 2),
                t > i / 2 && this.trackingPoint < 3 && (Debugger.print(" -=-> Midpoint"),
                e.push({
                    track_id: "midpoint",
                    progress: t,
                    asset: s
                }),
                this.advert.getLinear().track("midpoint", t, s, r),
                this.trackingPoint = 3),
                t > 3 * i / 4 && this.trackingPoint < 4 && (Debugger.print(" -=-> Third Quartile"),
                e.push({
                    track_id: "thirdQuartile",
                    progress: t,
                    asset: s
                }),
                this.advert.getLinear().track("thirdQuartile", t, s, r),
                this.trackingPoint = 4)
            }
            return e
        }
    },
    startWatchdog: function(e) {
        if (null === this.watchdog) {
            var t = this;
            this.watchdog = setTimeout(function() {
                console.log("Ad watchdog timer fired!"),
                "function" == typeof t.watchdogCallback && t.watchdogCallback.call(this)
            }, 1e3 * e)
        }
    },
    stopWatchdog: function() {
        null !== this.watchdog && (clearTimeout(this.watchdog),
        this.watchdog = null)
    },
    isSuppressed: function(e) {
        var t, i, s = [];
        if (this.advert && this.advert.getLinear() && (t = this.advert.getLinear().tracking.suppressAnalytics(e)),
        this.advert && this.advert.nonLinearsTracking && (i = this.advert.nonLinearsTracking.suppressAnalytics(e)),
        !e) {
            if (t)
                for (var n = 0; n < t.length; n++)
                    s.push(t[n]);
            if (i)
                for (n = 0; n < i.length; n++)
                    s.push(i[n]);
            return this.isActive && this.startWatchdog(this.duration),
            s
        }
        return this.stopWatchdog(),
        null
    },
    setActive: function(e) {
        this.isActive && (e ? (this.isActive = e,
        this.startPosition = (new Date).getTime(),
        this.alreadyElapsed = 0,
        this.trackingPoint = 0,
        this.startWatchdog(this.duration),
        Debugger.print(" -=-> Creative View/Start"),
        this.hasInteractiveUnit() || (this.invokeTracking("creativeView", !1),
        this.invokeTracking("start", !1))) : (Debugger.print(" -=-> Complete"),
        this.stopWatchdog(),
        this.paused || (this.trackingPoint >= 4 && this.invokeTracking("complete", !1, this.duration),
        this.isActive = e)))
    },
    invokeTracking: function(e, t, i) {
        var s = ""
          , n = void 0 === i ? 0 : i
          , r = this.adBreak
          , a = ""
          , o = this.advert.getLinear();
        if (o) {
            n = void 0 === i ? this.timeElapsed() : i;
            var l = o.getAllMedias();
            l && l.length > 0 && (s = l[0].src),
            a = YSParseUtils.timecodeToString(r.getDuration()),
            o.track(e, n, s, a),
            this.trackingMonitor && "function" == typeof this.trackingMonitor && this.trackingMonitor(e, n, s)
        }
        if (void 0 !== t && !1 === Boolean(t)) {
            Debugger.print("Tracking non-linears");
            var h = this.advert.nonLinearsTracking;
            h && h.track(e, n, s, a)
        }
    },
    reportLinearEvent: function(e) {
        this.invokeTracking(e, !0, this.duration)
    },
    reportNonLinearEvent: function(e, t) {
        var i = ""
          , s = 0
          , n = this.adBreak
          , r = ""
          , a = this.advert.getLinear();
        if (a) {
            s = this.timeElapsed();
            var o = a.getAllMedias();
            o && o.length > 0 && (i = o[0].src),
            r = YSParseUtils.timecodeToString(n.getDuration())
        }
        var l = this.advert.nonLinearsTracking;
        l && l.track(t, s, i, r)
    },
    timeElapsed: function() {
        return this.paused ? this.alreadyElapsed : this.alreadyElapsed + ((new Date).getTime() - this.startPosition) / 1e3
    },
    adPaused: function() {
        this.paused || (Debugger.print(" -=-> Paused"),
        this.stopWatchdog(),
        this.alreadyElapsed = this.timeElapsed(),
        this.paused = !0,
        this.startPosition = 0)
    },
    adResumed: function() {
        this.paused && (Debugger.print(" -=-> Resumed"),
        this.startPosition = (new Date).getTime(),
        this.paused = !1,
        this.pingWatchdog())
    }
})
  , YSTimeline = ClassHelper.makeClass({
    initialize: function() {
        this.elements = [],
        this.modified = !1,
        this.startOffset = 0
    },
    Destroy: function() {
        for (; this.elements.length > 0; )
            this.elements.pop().Destroy();
        this.elements = null
    },
    UpdateOffset: function(e) {
        for (this.startOffset = e; this.elements.length > 0; ) {
            var t = this.elements[0];
            if (t.offset >= e)
                break;
            {
                if (!(t.offset + t.duration <= e)) {
                    var i = e - t.offset;
                    if (t.duration -= i,
                    t.offset = e,
                    t instanceof YSTimelineAdvertElement) {
                        Debugger.print("Validating advert element");
                        var s = t.getAdverts();
                        if (t.duration < s.getDuration()) {
                            Debugger.print("Pruning is required");
                            var n = s.adverts
                              , r = 0;
                            if (n && n.length > 0) {
                                Debugger.print("Validating " + n.length + " adverts");
                                for (var a = n.length - 1; a >= 0; )
                                    if (r >= t.duration)
                                        for (Debugger.print("Winding up. Removing from index: " + a); a >= 0; )
                                            n.shift(),
                                            a--;
                                    else if (n[a].duration <= t.duration - r)
                                        Debugger.print("Preserving index: " + a),
                                        r += n[a].duration,
                                        a--;
                                    else {
                                        var o = t.duration - r;
                                        Debugger.print("Truncating index: " + a + " to duration: " + o),
                                        n[a].duration = o,
                                        r += o,
                                        a--
                                    }
                            }
                        } else
                            Debugger.print("Prune not required")
                    }
                    Debugger.print("New duration: " + t.duration);
                    break
                }
                this.elements.splice(0, 1)
            }
        }
    },
    appendElement: function(e) {
        this.elements.push(e),
        this.modified = !0
    },
    clear: function() {
        this.elements = [],
        this.modified = !0
    },
    getElementAtTime: function(e) {
        for (var t = 0; t < this.elements.length; t++) {
            var i = this.elements[t];
            if (e >= i.offset && e < i.offset + i.duration)
                return i
        }
        return null
    },
    getNextElementForTime: function(e) {
        for (var t = 0; t < this.elements.length; t++) {
            var i = this.elements[t];
            if (i.offset > e)
                return i
        }
        return null
    },
    getAllElements: function() {
        return this.elements
    },
    isModified: function() {
        var e = this.modified;
        return this.modified = !1,
        e
    },
    adjustContent: function(e) {
        var t = this.getAllElements()
          , i = 0
          , s = 0
          , n = 0
          , r = this.startOffset;
        for (e += this.startOffset; n < t.length; ) {
            var a = t[n];
            i += a.duration,
            a.getType() !== YSTimelineElement.ADVERT ? this.elements.splice(n, 1) : (a.offset > this.startOffset && (s += a.offset - r,
            s += a.duration,
            this.elements.splice(n, 0, new YSTimelineVODElement(r,a.offset - r)),
            n++),
            r = a.offset + a.duration,
            n++)
        }
        if (e > r && Math.abs(e - r) > 1 && (s += e - r,
        this.appendElement(new YSTimelineVODElement(r,e - r))),
        s != i) {
            if (this.elements.length > 0) {
                var o = this.elements[this.elements.length - 1];
                Debugger.print("Range: " + this.elements[0].offset + " to " + (o.offset + o.duration) + " with length: " + s)
            }
            this.modified = !0
        }
    },
    getTotalDuration: function() {
        for (var e = 0, t = 0; t < this.elements.length; t++)
            e += this.elements[t].duration;
        return e
    }
})
  , YSTimelineElement = ClassHelper.makeClass({
    initialize: function(e, t) {
        this.type = "",
        this.offset = e,
        this.duration = t
    },
    Destroy: function() {},
    getType: function() {
        return this.type
    }
});
YSTimelineElement.VOD = "vod",
YSTimelineElement.ADVERT = "advert",
YSTimelineElement.LIVE = "live";
var YSTimelineVODElement = ClassHelper.makeClass(YSTimelineElement, {
    initialize: function(e, t) {
        this.callSuper(this.initialize, e, t),
        this.type = YSTimelineElement.VOD
    },
    Destroy: function() {
        this.callSuper(this.Destroy)
    }
})
  , YSTimelineLiveElement = ClassHelper.makeClass(YSTimelineElement, {
    initialize: function(e, t) {
        this.callSuper(this.initialize, e, t),
        this.type = YSTimelineElement.LIVE
    },
    Destroy: function() {
        this.callSuper(this.Destroy)
    }
})
  , YSTimelineAdvertElement = ClassHelper.makeClass(YSTimelineElement, {
    initialize: function(e, t, i) {
        this.callSuper(this.initialize, e, t),
        this.type = YSTimelineElement.ADVERT,
        this.adBreak = i
    },
    Destroy: function() {
        this.callSuper(this.Destroy),
        this.adBreak = null
    },
    getAdverts: function() {
        return this.adBreak
    }
});
void 0 !== exports && (exports.YSSessionManager = YSSessionManager,
exports.AdBreak = AdBreak,
exports.YoExtension = YoExtension,
exports.YoStream = YoStream,
exports.YoBreak = YoBreak,
exports.Extensions = Extensions,
exports.TrackingEvents = TrackingEvents,
exports.VASTAd = VASTAd,
exports.VASTAds = VASTAds,
exports.VASTCreative = VASTCreative,
exports.VASTIcon = VASTIcon,
exports.VASTInteractive = VASTInteractive,
exports.VASTLinear = VASTLinear,
exports.VASTNonLinear = VASTNonLinear,
exports.YSAdBreak = YSAdBreak,
exports.YSAdvert = YSAdvert,
exports.YSID3Parser = YSID3Parser,
exports.YSLiveSession = YSLiveSession,
exports.YSPlayerEvents = YSPlayerEvents,
exports.YSSessionStatus = YSSessionStatus,
exports.YSSessionResult = YSSessionResult,
exports.YSPlayerPolicy = YSPlayerPolicy,
exports.YSSession = YSSession,
exports.YSTimeline = YSTimeline,
exports.YSTimelineElement = YSTimelineElement,
exports.YSTimelineVODElement = YSTimelineVODElement,
exports.YSTimelineLiveElement = YSTimelineLiveElement,
exports.YSTimelineAdvertElement = YSTimelineAdvertElement,
exports.YSVoDSession = YSVoDSession,
exports.YSParseUtils = YSParseUtils,
exports.Debugger = Debugger,
exports.ProtoAjax = ProtoAjax);
