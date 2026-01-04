import { defineComponent, provide, toRef, createElementBlock, openBlock, unref, normalizeStyle, renderSlot, createVNode, inject, computed, normalizeClass, createTextVNode, toDisplayString, ref, watchEffect, readonly, toValue, withModifiers, createElementVNode, withCtx, useModel, createBlock, createCommentVNode, Transition } from "vue";
import { useLoading } from "@lyrasoft/ts-toolkit/vue";
import { data, useS3MultipartUploader, useHttpClient, simpleAlert, route, deleteConfirm } from "@windwalker-io/unicorn-next";
import { u as useDefaults, p as progressInjectionKey, j as useColorVariantClasses, b as useToNumber, i as _export_sfc } from "./_plugin-vue_export-helper.js";
import { b as createEventHook, i as isClient, h as hasOwn, _ as _sfc_main$3, a as _sfc_main$4 } from "./index.js";
import { _ as _sfc_main$5, a as _sfc_main$6 } from "./BFormInput.vue_vue_type_script_setup_true_lang-DRDhfD8d.js";
import { g as getDefaultExportFromCjs } from "./_commonjsHelpers.js";
import { i as isObjectLike, b as baseGetTag, a as isArray, S as Symbol$1, c as isObject, r as root } from "./isObject.js";
import { u as useSegmentController } from "./useSegmentController.js";
const _sfc_main$1$1 = /* @__PURE__ */ defineComponent({
  __name: "BProgressBar",
  props: {
    animated: { type: Boolean, default: false },
    label: { default: void 0 },
    max: { default: void 0 },
    precision: { default: 0 },
    showProgress: { type: Boolean, default: false },
    showValue: { type: Boolean, default: false },
    striped: { type: Boolean, default: false },
    value: { default: 0 },
    variant: { default: null },
    bgVariant: { default: null },
    textVariant: { default: null }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BProgressBar");
    const parentData = inject(progressInjectionKey, null);
    const colorClasses = useColorVariantClasses(props);
    const computedClasses = computed(() => [
      colorClasses.value,
      {
        "progress-bar-animated": props.animated || parentData?.animated.value,
        "progress-bar-striped": props.striped || parentData?.striped.value || props.animated || parentData?.animated.value
      }
    ]);
    const numberPrecision = useToNumber(() => props.precision);
    const numberValue = useToNumber(() => props.value);
    const numberMax = useToNumber(() => props.max ?? Number.NaN);
    const parentMaxNumber = useToNumber(() => parentData?.max.value ?? Number.NaN);
    const computedLabel = computed(
      () => props.showValue || parentData?.showValue.value ? numberValue.value.toFixed(numberPrecision.value) : props.showProgress || parentData?.showProgress.value ? (numberValue.value * 100 / (numberMax.value || 100)).toFixed(numberPrecision.value) : props.label !== void 0 ? props.label : ""
    );
    const computedWidth = computed(
      () => parentMaxNumber.value ? `${numberValue.value * 100 / parentMaxNumber.value}%` : numberMax.value ? `${numberValue.value * 100 / numberMax.value}%` : typeof props.value === "string" ? props.value : `${props.value}%`
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["progress-bar", computedClasses.value]),
        style: normalizeStyle({ width: computedWidth.value })
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(computedLabel.value), 1)
        ])
      ], 6);
    };
  }
});
const _hoisted_1$2 = ["aria-valuenow", "aria-valuemax"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "BProgress",
  props: {
    height: { default: void 0 },
    animated: { type: Boolean, default: void 0 },
    max: { default: 100 },
    precision: { default: void 0 },
    showProgress: { type: Boolean, default: void 0 },
    showValue: { type: Boolean, default: void 0 },
    striped: { type: Boolean, default: void 0 },
    value: { default: void 0 },
    variant: { default: void 0 },
    bgVariant: { default: void 0 },
    textVariant: { default: void 0 }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BProgress");
    provide(progressInjectionKey, {
      animated: toRef(() => props.animated),
      max: toRef(() => props.max),
      showProgress: toRef(() => props.showProgress),
      showValue: toRef(() => props.showValue),
      striped: toRef(() => props.striped)
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "progress",
        role: "progressbar",
        style: normalizeStyle({ height: unref(props).height }),
        "aria-valuenow": unref(props).value,
        "aria-valuemin": "0",
        "aria-valuemax": unref(props).max
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createVNode(_sfc_main$1$1, {
            animated: unref(props).animated,
            max: unref(props).max,
            precision: unref(props).precision,
            "show-progress": unref(props).showProgress,
            "show-value": unref(props).showValue,
            striped: unref(props).striped,
            value: unref(props).value,
            variant: unref(props).variant,
            "text-variant": unref(props).textVariant,
            "bg-variant": unref(props).bgVariant
          }, null, 8, ["animated", "max", "precision", "show-progress", "show-value", "striped", "value", "variant", "text-variant", "bg-variant"])
        ])
      ], 12, _hoisted_1$2);
    };
  }
});
var jsVideoUrlParser$1 = { exports: {} };
var jsVideoUrlParser = jsVideoUrlParser$1.exports;
var hasRequiredJsVideoUrlParser;
function requireJsVideoUrlParser() {
  if (hasRequiredJsVideoUrlParser) return jsVideoUrlParser$1.exports;
  hasRequiredJsVideoUrlParser = 1;
  (function(module, exports$1) {
    (function(global, factory) {
      module.exports = factory();
    })(jsVideoUrlParser, (function() {
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      var getQueryParams = function getQueryParams2(qs) {
        if (typeof qs !== "string") {
          return {};
        }
        qs = qs.split("+").join(" ");
        var params = {};
        var match = qs.match(/(?:[?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/);
        var split;
        if (match === null) {
          return {};
        }
        split = match[0].substr(1).split(/[&#=]/);
        for (var i = 0; i < split.length; i += 2) {
          params[decodeURIComponent(split[i])] = decodeURIComponent(split[i + 1] || "");
        }
        return params;
      };
      var combineParams = function combineParams2(params, hasParams) {
        if (_typeof(params) !== "object") {
          return "";
        }
        var combined = "";
        var i = 0;
        var keys = Object.keys(params);
        if (keys.length === 0) {
          return "";
        }
        keys.sort();
        if (!hasParams) {
          combined += "?" + keys[0] + "=" + params[keys[0]];
          i += 1;
        }
        for (; i < keys.length; i += 1) {
          combined += "&" + keys[i] + "=" + params[keys[i]];
        }
        return combined;
      };
      function getLetterTime(timeString) {
        var totalSeconds = 0;
        var timeValues = {
          "s": 1,
          "m": 1 * 60,
          "h": 1 * 60 * 60,
          "d": 1 * 60 * 60 * 24,
          "w": 1 * 60 * 60 * 24 * 7
        };
        var timePairs;
        timeString = timeString.replace(/([smhdw])/g, " $1 ").trim();
        timePairs = timeString.split(" ");
        for (var i = 0; i < timePairs.length; i += 2) {
          totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || "s"];
        }
        return totalSeconds;
      }
      function getColonTime(timeString) {
        var totalSeconds = 0;
        var timeValues = [1, 1 * 60, 1 * 60 * 60, 1 * 60 * 60 * 24, 1 * 60 * 60 * 24 * 7];
        var timePairs = timeString.split(":");
        for (var i = 0; i < timePairs.length; i++) {
          totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs.length - i - 1];
        }
        return totalSeconds;
      }
      var getTime = function getTime2(timeString) {
        if (typeof timeString === "undefined") {
          return 0;
        }
        if (timeString.match(/^(\d+[smhdw]?)+$/)) {
          return getLetterTime(timeString);
        }
        if (timeString.match(/^(\d+:?)+$/)) {
          return getColonTime(timeString);
        }
        return 0;
      };
      var util = {
        getQueryParams,
        combineParams,
        getTime
      };
      var getQueryParams$1 = util.getQueryParams;
      function UrlParser() {
        for (var _i = 0, _arr = ["parseProvider", "parse", "bind", "create"]; _i < _arr.length; _i++) {
          var key = _arr[_i];
          this[key] = this[key].bind(this);
        }
        this.plugins = {};
      }
      var urlParser2 = UrlParser;
      UrlParser.prototype.parseProvider = function(url) {
        var match = url.match(/(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i);
        return match ? match[1] : void 0;
      };
      UrlParser.prototype.parse = function(url) {
        if (typeof url === "undefined") {
          return void 0;
        }
        var provider = this.parseProvider(url);
        var result;
        var plugin = this.plugins[provider];
        if (!provider || !plugin || !plugin.parse) {
          return void 0;
        }
        result = plugin.parse.call(plugin, url, getQueryParams$1(url));
        if (result) {
          result = removeEmptyParameters(result);
          result.provider = plugin.provider;
        }
        return result;
      };
      UrlParser.prototype.bind = function(plugin) {
        this.plugins[plugin.provider] = plugin;
        if (plugin.alternatives) {
          for (var i = 0; i < plugin.alternatives.length; i += 1) {
            this.plugins[plugin.alternatives[i]] = plugin;
          }
        }
      };
      UrlParser.prototype.create = function(op) {
        if (_typeof(op) !== "object" || _typeof(op.videoInfo) !== "object") {
          return void 0;
        }
        var vi = op.videoInfo;
        var params = op.params;
        var plugin = this.plugins[vi.provider];
        params = params === "internal" ? vi.params : params || {};
        if (plugin) {
          op.format = op.format || plugin.defaultFormat;
          if (plugin.formats.hasOwnProperty(op.format)) {
            return plugin.formats[op.format].apply(plugin, [vi, Object.assign({}, params)]);
          }
        }
        return void 0;
      };
      function removeEmptyParameters(result) {
        if (result.params && Object.keys(result.params).length === 0) {
          delete result.params;
        }
        return result;
      }
      var parser = new urlParser2();
      var base = parser;
      function Allocine() {
        this.provider = "allocine";
        this.alternatives = [];
        this.defaultFormat = "embed";
        this.formats = {
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Allocine.prototype.parseUrl = function(url) {
        var match = url.match(/(?:\/video\/player_gen_cmedia=)([A-Za-z0-9]+)/i);
        return match ? match[1] : void 0;
      };
      Allocine.prototype.parse = function(url) {
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          id: this.parseUrl(url)
        };
        return result.id ? result : void 0;
      };
      Allocine.prototype.createEmbedUrl = function(vi) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        return "https://player.allocine.fr/" + vi.id + ".html";
      };
      base.bind(new Allocine());
      var combineParams$1 = util.combineParams;
      function CanalPlus() {
        this.provider = "canalplus";
        this.defaultFormat = "embed";
        this.formats = {
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      CanalPlus.prototype.parseParameters = function(params) {
        delete params.vid;
        return params;
      };
      CanalPlus.prototype.parse = function(url, params) {
        var _this = this;
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          id: params.vid
        };
        result.params = _this.parseParameters(params);
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      CanalPlus.prototype.createEmbedUrl = function(vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = "http://player.canalplus.fr/embed/";
        params.vid = vi.id;
        url += combineParams$1(params);
        return url;
      };
      base.bind(new CanalPlus());
      var combineParams$2 = util.combineParams;
      function Coub() {
        this.provider = "coub";
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Coub.prototype.parseUrl = function(url) {
        var match = url.match(/(?:embed|view)\/([a-zA-Z\d]+)/i);
        return match ? match[1] : void 0;
      };
      Coub.prototype.parse = function(url, params) {
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          params,
          id: this.parseUrl(url)
        };
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      Coub.prototype.createUrl = function(baseUrl, vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = baseUrl + vi.id;
        url += combineParams$2(params);
        return url;
      };
      Coub.prototype.createLongUrl = function(vi, params) {
        return this.createUrl("https://coub.com/view/", vi, params);
      };
      Coub.prototype.createEmbedUrl = function(vi, params) {
        return this.createUrl("//coub.com/embed/", vi, params);
      };
      base.bind(new Coub());
      var combineParams$3 = util.combineParams, getTime$1 = util.getTime;
      function Dailymotion() {
        this.provider = "dailymotion";
        this.alternatives = ["dai"];
        this.defaultFormat = "long";
        this.formats = {
          "short": this.createShortUrl,
          "long": this.createLongUrl,
          embed: this.createEmbedUrl,
          image: this.createImageUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Dailymotion.prototype.parseParameters = function(params) {
        return this.parseTime(params);
      };
      Dailymotion.prototype.parseTime = function(params) {
        if (params.start) {
          params.start = getTime$1(params.start);
        }
        return params;
      };
      Dailymotion.prototype.parseUrl = function(url) {
        var match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
        return match ? match[1] : void 0;
      };
      Dailymotion.prototype.parse = function(url, params) {
        var _this = this;
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          params: _this.parseParameters(params),
          id: _this.parseUrl(url)
        };
        return result.id ? result : void 0;
      };
      Dailymotion.prototype.createUrl = function(base2, vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        return base2 + vi.id + combineParams$3(params);
      };
      Dailymotion.prototype.createShortUrl = function(vi, params) {
        return this.createUrl("https://dai.ly/", vi, params);
      };
      Dailymotion.prototype.createLongUrl = function(vi, params) {
        return this.createUrl("https://dailymotion.com/video/", vi, params);
      };
      Dailymotion.prototype.createEmbedUrl = function(vi, params) {
        return this.createUrl("https://www.dailymotion.com/embed/video/", vi, params);
      };
      Dailymotion.prototype.createImageUrl = function(vi, params) {
        delete params.start;
        return this.createUrl("https://www.dailymotion.com/thumbnail/video/", vi, params);
      };
      base.bind(new Dailymotion());
      var combineParams$4 = util.combineParams;
      function Loom() {
        this.provider = "loom";
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Loom.prototype.parseUrl = function(url) {
        var match = url.match(/(?:share|embed)\/([a-zA-Z\d]+)/i);
        return match ? match[1] : void 0;
      };
      Loom.prototype.parse = function(url, params) {
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          params,
          id: this.parseUrl(url)
        };
        return result.id ? result : void 0;
      };
      Loom.prototype.createUrl = function(baseUrl, vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = baseUrl + vi.id;
        url += combineParams$4(params);
        return url;
      };
      Loom.prototype.createLongUrl = function(vi, params) {
        return this.createUrl("https://loom.com/share/", vi, params);
      };
      Loom.prototype.createEmbedUrl = function(vi, params) {
        return this.createUrl("//loom.com/embed/", vi, params);
      };
      base.bind(new Loom());
      var combineParams$5 = util.combineParams, getTime$2 = util.getTime;
      function Twitch() {
        this.provider = "twitch";
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video",
          STREAM: "stream",
          CLIP: "clip"
        };
      }
      Twitch.prototype.seperateId = function(id) {
        return {
          pre: id[0],
          id: id.substr(1)
        };
      };
      Twitch.prototype.parseChannel = function(result, params) {
        var channel = params.channel || params.utm_content || result.channel;
        delete params.utm_content;
        delete params.channel;
        return channel;
      };
      Twitch.prototype.parseUrl = function(url, result, params) {
        var match;
        match = url.match(/(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+(?:-[\w\d-]+)?)(?:\/clip\/(\w+))?)/i);
        if (match && match[2]) {
          result.id = "v" + match[2];
        } else if (params.video) {
          result.id = params.video;
          delete params.video;
        } else if (params.clip) {
          result.id = params.clip;
          result.isClip = true;
          delete params.clip;
        } else if (match && match[1] && match[3]) {
          result.id = match[3];
          result.isClip = true;
        } else if (match && match[3] && match[4]) {
          result.channel = match[3];
          result.id = match[4];
          result.isClip = true;
        } else if (match && match[3]) {
          result.channel = match[3];
        }
        return result;
      };
      Twitch.prototype.parseMediaType = function(result) {
        var mediaType;
        if (result.id) {
          if (result.isClip) {
            mediaType = this.mediaTypes.CLIP;
            delete result.isClip;
          } else {
            mediaType = this.mediaTypes.VIDEO;
          }
        } else if (result.channel) {
          mediaType = this.mediaTypes.STREAM;
        }
        return mediaType;
      };
      Twitch.prototype.parseParameters = function(params) {
        if (params.t) {
          params.start = getTime$2(params.t);
          delete params.t;
        }
        return params;
      };
      Twitch.prototype.parse = function(url, params) {
        var _this = this;
        var result = {};
        result = _this.parseUrl(url, result, params);
        result.channel = _this.parseChannel(result, params);
        result.mediaType = _this.parseMediaType(result);
        result.params = _this.parseParameters(params);
        return result.channel || result.id ? result : void 0;
      };
      Twitch.prototype.createLongUrl = function(vi, params) {
        var url = "";
        if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
          url = "https://twitch.tv/" + vi.channel;
        } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          var sep = this.seperateId(vi.id);
          url = "https://twitch.tv/videos/" + sep.id;
          if (params.start) {
            params.t = params.start + "s";
            delete params.start;
          }
        } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
          if (vi.channel) {
            url = "https://www.twitch.tv/" + vi.channel + "/clip/" + vi.id;
          } else {
            url = "https://clips.twitch.tv/" + vi.id;
          }
        } else {
          return void 0;
        }
        url += combineParams$5(params);
        return url;
      };
      Twitch.prototype.createEmbedUrl = function(vi, params) {
        var url = "https://player.twitch.tv/";
        if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
          params.channel = vi.channel;
        } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          params.video = vi.id;
          if (params.start) {
            params.t = params.start + "s";
            delete params.start;
          }
        } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
          url = "https://clips.twitch.tv/embed";
          params.clip = vi.id;
        } else {
          return void 0;
        }
        url += combineParams$5(params);
        return url;
      };
      base.bind(new Twitch());
      var combineParams$6 = util.combineParams, getTime$3 = util.getTime;
      function Vimeo() {
        this.provider = "vimeo";
        this.alternatives = ["vimeopro"];
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Vimeo.prototype.parseUrl = function(url) {
        var match = url.match(/(?:\/showcase\/\d+)?(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i);
        return match ? match[1] : void 0;
      };
      Vimeo.prototype.parseHash = function(url) {
        var match = url.match(/\/\d+\/(\w+)$/i);
        return match ? match[1] : void 0;
      };
      Vimeo.prototype.parseParameters = function(params) {
        if (params.t) {
          params.start = getTime$3(params.t);
          delete params.t;
        }
        if (params.h) {
          params.hash = params.h;
          delete params.h;
        }
        return params;
      };
      Vimeo.prototype.parse = function(url, params) {
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          params: this.parseParameters(params),
          id: this.parseUrl(url)
        };
        var hash = this.parseHash(url, params);
        if (hash) {
          result.params.hash = hash;
        }
        return result.id ? result : void 0;
      };
      Vimeo.prototype.createUrl = function(baseUrl, vi, params, type) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = baseUrl + vi.id;
        var startTime = params.start;
        delete params.start;
        if (params.hash) {
          if (type === "embed") {
            params.h = params.hash;
          } else if (type === "long") {
            url += "/" + params.hash;
          }
          delete params.hash;
        }
        url += combineParams$6(params);
        if (startTime) {
          url += "#t=" + startTime;
        }
        return url;
      };
      Vimeo.prototype.createLongUrl = function(vi, params) {
        return this.createUrl("https://vimeo.com/", vi, params, "long");
      };
      Vimeo.prototype.createEmbedUrl = function(vi, params) {
        return this.createUrl("//player.vimeo.com/video/", vi, params, "embed");
      };
      base.bind(new Vimeo());
      var combineParams$7 = util.combineParams, getTime$4 = util.getTime;
      function Wistia() {
        this.provider = "wistia";
        this.alternatives = [];
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl,
          embedjsonp: this.createEmbedJsonpUrl
        };
        this.mediaTypes = {
          VIDEO: "video",
          EMBEDVIDEO: "embedvideo"
        };
      }
      Wistia.prototype.parseUrl = function(url) {
        var match = url.match(/(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/);
        return match ? match[1] : void 0;
      };
      Wistia.prototype.parseChannel = function(url) {
        var match = url.match(/(?:(?:https?:)?\/\/)?([^.]*)\.wistia\./);
        var channel = match ? match[1] : void 0;
        if (channel === "fast" || channel === "content") {
          return void 0;
        }
        return channel;
      };
      Wistia.prototype.parseParameters = function(params, result) {
        if (params.wtime) {
          params.start = getTime$4(params.wtime);
          delete params.wtime;
        }
        if (params.wvideo === result.id) {
          delete params.wvideo;
        }
        return params;
      };
      Wistia.prototype.parseMediaType = function(result) {
        if (result.id && result.channel) {
          return this.mediaTypes.VIDEO;
        } else if (result.id) {
          delete result.channel;
          return this.mediaTypes.EMBEDVIDEO;
        } else {
          return void 0;
        }
      };
      Wistia.prototype.parse = function(url, params) {
        var result = {
          id: this.parseUrl(url),
          channel: this.parseChannel(url)
        };
        result.params = this.parseParameters(params, result);
        result.mediaType = this.parseMediaType(result);
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      Wistia.prototype.createUrl = function(vi, params, url) {
        if (params.start) {
          params.wtime = params.start;
          delete params.start;
        }
        url += combineParams$7(params);
        return url;
      };
      Wistia.prototype.createLongUrl = function(vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = "https://" + vi.channel + ".wistia.com/medias/" + vi.id;
        return this.createUrl(vi, params, url);
      };
      Wistia.prototype.createEmbedUrl = function(vi, params) {
        if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
          return void 0;
        }
        var url = "https://fast.wistia.com/embed/iframe/" + vi.id;
        return this.createUrl(vi, params, url);
      };
      Wistia.prototype.createEmbedJsonpUrl = function(vi) {
        if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
          return void 0;
        }
        return "https://fast.wistia.com/embed/medias/" + vi.id + ".jsonp";
      };
      base.bind(new Wistia());
      var combineParams$8 = util.combineParams;
      function Youku() {
        this.provider = "youku";
        this.defaultFormat = "long";
        this.formats = {
          embed: this.createEmbedUrl,
          "long": this.createLongUrl,
          flash: this.createFlashUrl,
          "static": this.createStaticUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Youku.prototype.parseUrl = function(url) {
        var match = url.match(/(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/);
        return match ? match[1] : void 0;
      };
      Youku.prototype.parseParameters = function(params) {
        if (params.VideoIDS) {
          delete params.VideoIDS;
        }
        return params;
      };
      Youku.prototype.parse = function(url, params) {
        var _this = this;
        var result = {
          mediaType: this.mediaTypes.VIDEO,
          id: _this.parseUrl(url),
          params: _this.parseParameters(params)
        };
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      Youku.prototype.createUrl = function(baseUrl, vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = baseUrl + vi.id;
        url += combineParams$8(params);
        return url;
      };
      Youku.prototype.createEmbedUrl = function(vi, params) {
        return this.createUrl("http://player.youku.com/embed/", vi, params);
      };
      Youku.prototype.createLongUrl = function(vi, params) {
        return this.createUrl("http://v.youku.com/v_show/id_", vi, params);
      };
      Youku.prototype.createStaticUrl = function(vi, params) {
        return this.createUrl("http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=", vi, params);
      };
      Youku.prototype.createFlashUrl = function(vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = "http://player.youku.com/player.php/sid/" + vi.id + "/v.swf";
        url += combineParams$8(params);
        return url;
      };
      base.bind(new Youku());
      var combineParams$9 = util.combineParams, getTime$5 = util.getTime;
      function YouTube() {
        this.provider = "youtube";
        this.alternatives = ["youtu", "ytimg"];
        this.defaultFormat = "long";
        this.formats = {
          "short": this.createShortUrl,
          "long": this.createLongUrl,
          embed: this.createEmbedUrl,
          shortImage: this.createShortImageUrl,
          longImage: this.createLongImageUrl
        };
        this.imageQualities = {
          "0": "0",
          "1": "1",
          "2": "2",
          "3": "3",
          DEFAULT: "default",
          HQDEFAULT: "hqdefault",
          SDDEFAULT: "sddefault",
          MQDEFAULT: "mqdefault",
          MAXRESDEFAULT: "maxresdefault"
        };
        this.defaultImageQuality = this.imageQualities.HQDEFAULT;
        this.mediaTypes = {
          VIDEO: "video",
          PLAYLIST: "playlist",
          SHARE: "share",
          CHANNEL: "channel"
        };
      }
      YouTube.prototype.parseVideoUrl = function(url) {
        var match = url.match(/(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i);
        return match ? match[1] : void 0;
      };
      YouTube.prototype.parseChannelUrl = function(url) {
        var match = url.match(/\/channel\/([\w-]+)/);
        if (match) {
          return {
            id: match[1],
            mediaType: this.mediaTypes.CHANNEL
          };
        }
        match = url.match(/\/(?:c|user)\/([\w-]+)/);
        if (match) {
          return {
            name: match[1],
            mediaType: this.mediaTypes.CHANNEL
          };
        }
      };
      YouTube.prototype.parseParameters = function(params, result) {
        if (params.start || params.t) {
          params.start = getTime$5(params.start || params.t);
          delete params.t;
        }
        if (params.v === result.id) {
          delete params.v;
        }
        if (params.list === result.id) {
          delete params.list;
        }
        return params;
      };
      YouTube.prototype.parseMediaType = function(result) {
        if (result.params.list) {
          result.list = result.params.list;
          delete result.params.list;
        }
        if (result.id && !result.params.ci) {
          result.mediaType = this.mediaTypes.VIDEO;
        } else if (result.list) {
          delete result.id;
          result.mediaType = this.mediaTypes.PLAYLIST;
        } else if (result.params.ci) {
          delete result.params.ci;
          result.mediaType = this.mediaTypes.SHARE;
        } else {
          return void 0;
        }
        return result;
      };
      YouTube.prototype.parse = function(url, params) {
        var channelResult = this.parseChannelUrl(url);
        if (channelResult) {
          return channelResult;
        } else {
          var result = {
            params,
            id: this.parseVideoUrl(url)
          };
          result.params = this.parseParameters(params, result);
          result = this.parseMediaType(result);
          return result;
        }
      };
      YouTube.prototype.createShortUrl = function(vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = "https://youtu.be/" + vi.id;
        if (params.start) {
          url += "#t=" + params.start;
        }
        return url;
      };
      YouTube.prototype.createLongUrl = function(vi, params) {
        var url = "";
        var startTime = params.start;
        delete params.start;
        if (vi.mediaType === this.mediaTypes.CHANNEL) {
          if (vi.id) {
            url += "https://www.youtube.com/channel/" + vi.id;
          } else if (vi.name) {
            url += "https://www.youtube.com/c/" + vi.name;
          } else {
            return void 0;
          }
        } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
          params.feature = "share";
          url += "https://www.youtube.com/playlist";
        } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          params.v = vi.id;
          url += "https://www.youtube.com/watch";
        } else if (vi.mediaType === this.mediaTypes.SHARE && vi.id) {
          params.ci = vi.id;
          url += "https://www.youtube.com/shared";
        } else {
          return void 0;
        }
        if (vi.list) {
          params.list = vi.list;
        }
        url += combineParams$9(params);
        if (vi.mediaType !== this.mediaTypes.PLAYLIST && startTime) {
          url += "#t=" + startTime;
        }
        return url;
      };
      YouTube.prototype.createEmbedUrl = function(vi, params) {
        var url = "https://www.youtube.com/embed";
        if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
          params.listType = "playlist";
        } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          url += "/" + vi.id;
          if (params.loop === "1") {
            params.playlist = vi.id;
          }
        } else {
          return void 0;
        }
        if (vi.list) {
          params.list = vi.list;
        }
        url += combineParams$9(params);
        return url;
      };
      YouTube.prototype.createImageUrl = function(baseUrl, vi, params) {
        if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
          return void 0;
        }
        var url = baseUrl + vi.id + "/";
        var quality = params.imageQuality || this.defaultImageQuality;
        return url + quality + ".jpg";
      };
      YouTube.prototype.createShortImageUrl = function(vi, params) {
        return this.createImageUrl("https://i.ytimg.com/vi/", vi, params);
      };
      YouTube.prototype.createLongImageUrl = function(vi, params) {
        return this.createImageUrl("https://img.youtube.com/vi/", vi, params);
      };
      base.bind(new YouTube());
      var combineParams$a = util.combineParams, getTime$6 = util.getTime;
      function SoundCloud() {
        this.provider = "soundcloud";
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          TRACK: "track",
          PLAYLIST: "playlist",
          APITRACK: "apitrack",
          APIPLAYLIST: "apiplaylist"
        };
      }
      SoundCloud.prototype.parseUrl = function(url, result) {
        var match = url.match(/(?:m\.)?soundcloud\.com\/(?:([\w-]+)\/(sets\/)?)([\w-]+)/i);
        if (!match) {
          return result;
        }
        result.channel = match[1];
        if (match[1] === "playlists" || match[2]) {
          result.list = match[3];
        } else {
          result.id = match[3];
        }
        return result;
      };
      SoundCloud.prototype.parseParameters = function(params) {
        if (params.t) {
          params.start = getTime$6(params.t);
          delete params.t;
        }
        return params;
      };
      SoundCloud.prototype.parseMediaType = function(result) {
        if (result.id) {
          if (result.channel === "tracks") {
            delete result.channel;
            delete result.params.url;
            result.mediaType = this.mediaTypes.APITRACK;
          } else {
            result.mediaType = this.mediaTypes.TRACK;
          }
        }
        if (result.list) {
          if (result.channel === "playlists") {
            delete result.channel;
            delete result.params.url;
            result.mediaType = this.mediaTypes.APIPLAYLIST;
          } else {
            result.mediaType = this.mediaTypes.PLAYLIST;
          }
        }
        return result;
      };
      SoundCloud.prototype.parse = function(url, params) {
        var result = {};
        result = this.parseUrl(url, result);
        result.params = this.parseParameters(params);
        result = this.parseMediaType(result);
        if (!result.id && !result.list) {
          return void 0;
        }
        return result;
      };
      SoundCloud.prototype.createLongUrl = function(vi, params) {
        var url = "";
        var startTime = params.start;
        delete params.start;
        if (vi.mediaType === this.mediaTypes.TRACK && vi.id && vi.channel) {
          url = "https://soundcloud.com/" + vi.channel + "/" + vi.id;
        } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list && vi.channel) {
          url = "https://soundcloud.com/" + vi.channel + "/sets/" + vi.list;
        } else if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
          url = "https://api.soundcloud.com/tracks/" + vi.id;
        } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
          url = "https://api.soundcloud.com/playlists/" + vi.list;
        } else {
          return void 0;
        }
        url += combineParams$a(params);
        if (startTime) {
          url += "#t=" + startTime;
        }
        return url;
      };
      SoundCloud.prototype.createEmbedUrl = function(vi, params) {
        var url = "https://w.soundcloud.com/player/";
        delete params.start;
        if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
          params.url = "https%3A//api.soundcloud.com/tracks/" + vi.id;
        } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
          params.url = "https%3A//api.soundcloud.com/playlists/" + vi.list;
        } else {
          return void 0;
        }
        url += combineParams$a(params);
        return url;
      };
      base.bind(new SoundCloud());
      var combineParams$b = util.combineParams;
      function TeacherTube() {
        this.provider = "teachertube";
        this.alternatives = [];
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video",
          AUDIO: "audio",
          DOCUMENT: "document",
          CHANNEL: "channel",
          COLLECTION: "collection",
          GROUP: "group"
        };
      }
      TeacherTube.prototype.parse = function(url, params) {
        var result = {};
        result.list = this.parsePlaylist(params);
        result.params = params;
        var match = url.match(/\/(audio|video|document|user\/channel|collection|group)\/(?:[\w-]+-)?(\w+)/);
        if (!match) {
          return void 0;
        }
        result.mediaType = this.parseMediaType(match[1]);
        result.id = match[2];
        return result;
      };
      TeacherTube.prototype.parsePlaylist = function(params) {
        if (params["playlist-id"]) {
          var list = params["playlist-id"];
          delete params["playlist-id"];
          return list;
        }
        return void 0;
      };
      TeacherTube.prototype.parseMediaType = function(mediaTypeMatch) {
        switch (mediaTypeMatch) {
          case "audio":
            return this.mediaTypes.AUDIO;
          case "video":
            return this.mediaTypes.VIDEO;
          case "document":
            return this.mediaTypes.DOCUMENT;
          case "user/channel":
            return this.mediaTypes.CHANNEL;
          case "collection":
            return this.mediaTypes.COLLECTION;
          case "group":
            return this.mediaTypes.GROUP;
        }
      };
      TeacherTube.prototype.createLongUrl = function(vi, params) {
        if (!vi.id) {
          return void 0;
        }
        var url = "https://www.teachertube.com/";
        if (vi.list) {
          params["playlist-id"] = vi.list;
        }
        if (vi.mediaType === this.mediaTypes.CHANNEL) {
          url += "user/channel/";
        } else {
          url += vi.mediaType + "/";
        }
        url += vi.id;
        url += combineParams$b(params);
        return url;
      };
      TeacherTube.prototype.createEmbedUrl = function(vi, params) {
        if (!vi.id) {
          return void 0;
        }
        var url = "https://www.teachertube.com/embed/";
        if (vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.AUDIO) {
          url += vi.mediaType + "/" + vi.id;
        } else {
          return void 0;
        }
        url += combineParams$b(params);
        return url;
      };
      base.bind(new TeacherTube());
      var combineParams$c = util.combineParams;
      function TikTok() {
        this.provider = "tiktok";
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      TikTok.prototype.parse = function(url, params) {
        var result = {
          params,
          mediaType: this.mediaTypes.VIDEO
        };
        var match = url.match(/@([^/]+)\/video\/(\d{19})/);
        if (!match) {
          return;
        }
        result.channel = match[1];
        result.id = match[2];
        return result;
      };
      TikTok.prototype.createLongUrl = function(vi, params) {
        var url = "";
        if (vi.mediaType === this.mediaTypes.VIDEO && vi.id && vi.channel) {
          url += "https://www.tiktok.com/@".concat(vi.channel, "/video/").concat(vi.id);
        } else {
          return void 0;
        }
        url += combineParams$c(params);
        return url;
      };
      base.bind(new TikTok());
      var combineParams$d = util.combineParams;
      function Ted() {
        this.provider = "ted";
        this.formats = {
          "long": this.createLongUrl,
          embed: this.createEmbedUrl
        };
        this.mediaTypes = {
          VIDEO: "video",
          PLAYLIST: "playlist"
        };
      }
      Ted.prototype.parseUrl = function(url, result) {
        var match = url.match(/\/(talks|playlists\/(\d+))\/([\w-]+)/i);
        var channel = match ? match[1] : void 0;
        if (!channel) {
          return result;
        }
        result.channel = channel.split("/")[0];
        result.id = match[3];
        if (result.channel === "playlists") {
          result.list = match[2];
        }
        return result;
      };
      Ted.prototype.parseMediaType = function(result) {
        if (result.id && result.channel === "playlists") {
          delete result.channel;
          result.mediaType = this.mediaTypes.PLAYLIST;
        }
        if (result.id && result.channel === "talks") {
          delete result.channel;
          result.mediaType = this.mediaTypes.VIDEO;
        }
        return result;
      };
      Ted.prototype.parse = function(url, params) {
        var result = {
          params
        };
        result = this.parseUrl(url, result);
        result = this.parseMediaType(result);
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      Ted.prototype.createLongUrl = function(vi, params) {
        var url = "";
        if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          url += "https://ted.com/talks/" + vi.id;
        } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
          url += "https://ted.com/playlists/" + vi.list + "/" + vi.id;
        } else {
          return void 0;
        }
        url += combineParams$d(params);
        return url;
      };
      Ted.prototype.createEmbedUrl = function(vi, params) {
        var url = "https://embed.ted.com/";
        if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
          url += "playlists/" + vi.list + "/" + vi.id;
        } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          url += "talks/" + vi.id;
        } else {
          return void 0;
        }
        url += combineParams$d(params);
        return url;
      };
      base.bind(new Ted());
      var combineParams$e = util.combineParams;
      function Facebook() {
        this.provider = "facebook";
        this.alternatives = [];
        this.defaultFormat = "long";
        this.formats = {
          "long": this.createLongUrl,
          watch: this.createWatchUrl
        };
        this.mediaTypes = {
          VIDEO: "video"
        };
      }
      Facebook.prototype.parse = function(url, params) {
        var result = {
          params,
          mediaType: this.mediaTypes.VIDEO
        };
        var match = url.match(/(?:\/(\d+))?\/videos(?:\/.*?)?\/(\d+)/i);
        if (match) {
          if (match[1]) {
            result.pageId = match[1];
          }
          result.id = match[2];
        }
        if (params.v && !result.id) {
          result.id = params.v;
          delete params.v;
          result.params = params;
        }
        if (!result.id) {
          return void 0;
        }
        return result;
      };
      Facebook.prototype.createWatchUrl = function(vi, params) {
        var url = "https://facebook.com/watch/";
        if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
          return void 0;
        }
        params = {
          v: vi.id
        };
        url += combineParams$e(params);
        return url;
      };
      Facebook.prototype.createLongUrl = function(vi, params) {
        var url = "https://facebook.com/";
        if (vi.pageId) {
          url += vi.pageId;
        } else {
          return void 0;
        }
        if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
          url += "/videos/" + vi.id;
        } else {
          return void 0;
        }
        url += combineParams$e(params);
        return url;
      };
      base.bind(new Facebook());
      var lib = base;
      return lib;
    }));
  })(jsVideoUrlParser$1);
  return jsVideoUrlParser$1.exports;
}
var jsVideoUrlParserExports = requireJsVideoUrlParser();
const urlParser = /* @__PURE__ */ getDefaultExportFromCjs(jsVideoUrlParserExports);
const defaultDocument = isClient ? window.document : void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
const DEFAULT_OPTIONS = {
  multiple: true,
  accept: "*",
  reset: false,
  directory: false
};
function prepareInitialFiles(files) {
  if (!files) return null;
  if (files instanceof FileList) return files;
  const dt = new DataTransfer();
  for (const file of files) dt.items.add(file);
  return dt.files;
}
function useFileDialog(options = {}) {
  const { document: document$1 = defaultDocument } = options;
  const files = ref(prepareInitialFiles(options.initialFiles));
  const { on: onChange, trigger: changeTrigger } = createEventHook();
  const { on: onCancel, trigger: cancelTrigger } = createEventHook();
  const inputRef = computed(() => {
    var _unrefElement;
    const input = (_unrefElement = unrefElement(options.input)) !== null && _unrefElement !== void 0 ? _unrefElement : document$1 ? document$1.createElement("input") : void 0;
    if (input) {
      input.type = "file";
      input.onchange = (event) => {
        files.value = event.target.files;
        changeTrigger(files.value);
      };
      input.oncancel = () => {
        cancelTrigger();
      };
    }
    return input;
  });
  const reset = () => {
    files.value = null;
    if (inputRef.value && inputRef.value.value) {
      inputRef.value.value = "";
      changeTrigger(null);
    }
  };
  const applyOptions = (options$1) => {
    const el = inputRef.value;
    if (!el) return;
    el.multiple = toValue(options$1.multiple);
    el.accept = toValue(options$1.accept);
    el.webkitdirectory = toValue(options$1.directory);
    if (hasOwn(options$1, "capture")) el.capture = toValue(options$1.capture);
  };
  const open = (localOptions) => {
    const el = inputRef.value;
    if (!el) return;
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions
    };
    applyOptions(mergedOptions);
    if (toValue(mergedOptions.reset)) reset();
    el.click();
  };
  watchEffect(() => {
    applyOptions(options);
  });
  return {
    files: readonly(files),
    open,
    reset,
    onCancel,
    onChange
  };
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
function toInteger(value) {
  var result = toFinite(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
var nativeIsFinite = root.isFinite, nativeMin = Math.min;
function createRound(methodName) {
  var func = Math[methodName];
  return function(number, precision) {
    number = toNumber(number);
    precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
    if (precision && nativeIsFinite(number)) {
      var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
      pair = (toString(value) + "e").split("e");
      return +(pair[0] + "e" + (+pair[1] - precision));
    }
    return func(number);
  };
}
var round = createRound("round");
function useFileUploader() {
  async function classicUpload(uploadUrl, file, dest, options) {
    const { post } = await useHttpClient();
    const formData = new FormData();
    formData.append("file", file);
    if (dest) {
      formData.append("path", dest);
    }
    const res = await post(uploadUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          options?.onProgress?.(percentage);
        }
      }
    });
    return res.data.data.url;
  }
  async function s3MultiPartUpload(file, dest, options) {
    const profile = data("video.upload.profile");
    const s3 = await useS3MultipartUploader({
      profile,
      routes: (action) => {
        return `@ajax_segment/${action}`;
      },
      onProgress: (e) => {
        options?.onProgress?.(e.percentage);
      }
    });
    const { url } = await s3.upload(file, dest);
    return url.replace(/%2F/g, "/");
  }
  return {
    classicUpload,
    s3MultiPartUpload
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FileUploader",
  props: {
    s3Multipart: { type: Boolean },
    uploadUrl: {},
    dest: { type: [Function, String] },
    accept: {}
  },
  emits: ["uploaded", "clear"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { classicUpload, s3MultiPartUpload } = useFileUploader();
    const acceptString = computed(() => {
      if (Array.isArray(props.accept)) {
        return props.accept.join(",");
      }
      return props.accept;
    });
    const acceptList = computed(() => {
      if (Array.isArray(props.accept)) {
        return props.accept;
      }
      return props.accept.split(",").map((item) => item.trim());
    });
    const { files, open, reset, onChange, onCancel } = useFileDialog({
      accept: acceptString
    });
    onChange(() => {
      const file = files.value?.[0];
      if (file) {
        upload(file);
      }
      reset();
    });
    onCancel(reset);
    function getDest() {
      if (typeof props.dest === "function") {
        return props.dest();
      }
      return props.dest;
    }
    const progress = ref(0);
    const { loading: uploading, run, wrap } = useLoading();
    async function upload(file) {
      const fileTypeValid = checkFileType(file);
      if (!fileTypeValid) {
        console.warn("不支援的檔案類型");
        return;
      }
      const dest = getDest();
      try {
        return await run(async () => {
          const url = await uploadWithAdapter(file, dest);
          emit("uploaded", url);
          return url;
        });
      } catch (e) {
        if (e instanceof Error) {
          simpleAlert(e.message);
        } else {
          simpleAlert("上傳失敗");
        }
      } finally {
        progress.value = 0;
      }
    }
    async function uploadWithAdapter(file, dest) {
      if (props.s3Multipart) {
        if (!dest) {
          throw new Error("S3 MultiPart Must have destination path.");
        }
        return s3MultiPartUpload(file, dest, {
          onProgress: (percentage) => {
            progress.value = percentage;
          }
        });
      }
      if (!props.uploadUrl) {
        throw new Error("Upload URL is required for classic upload.");
      }
      return classicUpload(props.uploadUrl, file, dest, {
        onProgress: (percentage) => {
          progress.value = percentage;
        }
      });
    }
    function checkFileType(file) {
      return acceptList.value.some((accept) => {
        if (accept.startsWith(".")) {
          return file.name.endsWith(accept);
        } else {
          const regex = new RegExp("^" + accept.replace("*", ".*") + "$");
          return regex.test(file.type);
        }
      });
    }
    const dragging = ref(false);
    async function drop(event) {
      const files2 = event.target.files || event.dataTransfer?.files || [];
      if (!files2[0]) {
        return;
      }
      await upload(files2[0]);
      dragging.value = false;
    }
    const __returned__ = { props, emit, classicUpload, s3MultiPartUpload, acceptString, acceptList, files, open, reset, onChange, onCancel, getDest, progress, uploading, run, wrap, upload, uploadWithAdapter, checkFileType, dragging, drop, get BButton() {
      return _sfc_main$4;
    }, get BProgress() {
      return _sfc_main$2;
    }, get BSpinner() {
      return _sfc_main$3;
    }, get round() {
      return round;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "c-file-uploader__card-body card-body" };
const _hoisted_2$1 = { class: "c-file-uploader__inner w-100" };
const _hoisted_3$1 = {
  key: 0,
  class: "text-center d-flex flex-column gap-3 w-75 mx-auto"
};
const _hoisted_4$1 = { key: 1 };
const _hoisted_5$1 = { class: "text-center" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-file-uploader pb-3",
    style: { "cursor": "pointer" },
    onDragover: _cache[1] || (_cache[1] = withModifiers(($event) => $setup.dragging = true, ["prevent"])),
    onDragleave: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.dragging = false, ["prevent"])),
    onDrop: withModifiers($setup.drop, ["prevent"]),
    onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $setup.open(), ["prevent"]))
  }, [
    createElementVNode("div", {
      class: normalizeClass(["c-file-uploader__card card border overflow-hidden position-relative", { "bg-light": $setup.dragging }])
    }, [
      createElementVNode("div", _hoisted_1$1, [
        createElementVNode("div", _hoisted_2$1, [
          $setup.uploading ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
            createElementVNode("div", null, [
              createVNode($setup["BSpinner"]),
              _cache[4] || (_cache[4] = createTextVNode()),
              createElementVNode("div", null, "上傳中 " + toDisplayString($setup.round($setup.progress, 2)) + "%", 1)
            ]),
            _cache[5] || (_cache[5] = createTextVNode()),
            createVNode($setup["BProgress"], {
              style: { "width": "100%" },
              value: $setup.progress,
              max: 100
            }, null, 8, ["value"])
          ])) : (openBlock(), createElementBlock("div", _hoisted_4$1, [
            _cache[7] || (_cache[7] = createElementVNode("div", { class: "text-center mb-3" }, [
              createElementVNode("i", { class: "far fa-upload fa-fw fa-2x" })
            ], -1)),
            _cache[8] || (_cache[8] = createTextVNode()),
            _cache[9] || (_cache[9] = createElementVNode("div", { class: "text-center mb-3" }, "\n              上傳: 拖拉檔案或按此瀏覽\n            ", -1)),
            _cache[10] || (_cache[10] = createTextVNode()),
            createElementVNode("div", _hoisted_5$1, [
              createVNode($setup["BButton"], {
                variant: "primary",
                size: "sm",
                onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.open(), ["stop"])),
                style: { "min-width": "100px" }
              }, {
                default: withCtx(() => [..._cache[6] || (_cache[6] = [
                  createElementVNode("i", { class: "far fa-plus-circle" }, null, -1),
                  createTextVNode("\n                瀏覽檔案\n              ", -1)
                ])]),
                _: 1
              })
            ])
          ]))
        ])
      ])
    ], 2)
  ], 32);
}
const FileUploader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-da919be7"], ["__file", "FileUploader.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionVideoEdit",
  props: {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const { deleteFile } = useSegmentController();
    const { loading, run } = useLoading();
    const props = __props;
    const emit = __emit;
    const item = useModel(__props, "modelValue");
    const videoName = computed(() => isFile.value ? item.value.filename : item.value.src);
    const isFile = computed(() => item.value.src !== "" && videoInfo.value === null);
    const isCloudVideo = computed(() => item.value.src !== "" && videoInfo.value != null);
    const itemSrcVal = ref("");
    const videoInfo = computed(() => {
      if (item.value.src !== "") {
        return urlParser.parse(item.value.src);
      }
      return void 0;
    });
    const videoEmbedUrl = computed(() => {
      if (item.value.src !== "") {
        return urlParser.create(
          {
            videoInfo: videoInfo.value,
            format: "embed"
          }
        );
      }
      return void 0;
    });
    const previewSrc = computed(() => {
      if (isCloudVideo.value) {
        return item.value.src;
      }
      return route("@lesson_file/previewFile", { url: item.value.src });
    });
    const previewCaptionSrc = computed(() => {
      return route("@lesson_file/previewFile", { url: item.value.captionSrc });
    });
    async function clear(field) {
      const v = await deleteConfirm(
        "確定要刪除嗎？",
        "此動作無法重置"
      );
      if (v) {
        await run(async () => {
          if (!isCloudVideo.value) {
            await deleteFile(item.value[field], item.value.id, field);
          }
          item.value[field] = "";
        });
      }
    }
    function setItemSrc() {
      item.value.src = itemSrcVal.value;
      emit("save", item.value);
    }
    async function uploadVideo(src) {
      item.value.src = src;
      emit("save", item.value);
    }
    async function uploadCaption(src) {
      item.value.captionSrc = src;
      emit("save", item.value);
    }
    const __returned__ = { deleteFile, loading, run, props, emit, item, videoName, isFile, isCloudVideo, itemSrcVal, videoInfo, videoEmbedUrl, previewSrc, previewCaptionSrc, clear, setItemSrc, uploadVideo, uploadCaption, get route() {
      return route;
    }, get BButton() {
      return _sfc_main$4;
    }, get BFormGroup() {
      return _sfc_main$6;
    }, get BFormInput() {
      return _sfc_main$5;
    }, FileUploader };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "l-section-video-edit d-flex flex-column gap-4" };
const _hoisted_2 = { class: "input-group" };
const _hoisted_3 = {
  key: 1,
  class: "d-flex flex-column gap-4"
};
const _hoisted_4 = { class: "input-group" };
const _hoisted_5 = ["value"];
const _hoisted_6 = {
  key: 0,
  class: "rwd-video"
};
const _hoisted_7 = ["src"];
const _hoisted_8 = { key: 1 };
const _hoisted_9 = {
  controls: "",
  class: "w-100",
  style: { "aspect-ratio": "16 / 9", "background-color": "black" },
  crossorigin: "anonymous"
};
const _hoisted_10 = ["src"];
const _hoisted_11 = ["src"];
const _hoisted_12 = { class: "input-group" };
const _hoisted_13 = ["value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode($setup["BFormGroup"], {
      label: "小節名稱編輯",
      "label-for": "input-section-title",
      "label-class": "mb-2",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormInput"], {
          id: "input-section-title",
          modelValue: $setup.item.title,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
          trim: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[22] || (_cache[22] = createTextVNode()),
    $setup.item.src === "" ? (openBlock(), createBlock($setup["BFormGroup"], {
      key: 0,
      label: "影片連結",
      "label-for": "input-section-video",
      "label-class": "mb-2",
      description: "支援以下平台: Youtube, Vimeo, Dailymotion",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createElementVNode("div", _hoisted_2, [
          createVNode($setup["BFormInput"], {
            id: "input-section-video",
            modelValue: $setup.itemSrcVal,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.itemSrcVal = $event),
            placeholder: "請輸入影片網址",
            trim: ""
          }, null, 8, ["modelValue"]),
          _cache[6] || (_cache[6] = createTextVNode()),
          createVNode($setup["BButton"], {
            variant: "primary",
            class: "text-nowrap c-video-submit px-3",
            onClick: $setup.setItemSrc
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createElementVNode("i", { class: "far fa-check" }, null, -1),
              createTextVNode("\n          送出\n        ", -1)
            ])]),
            _: 1
          })
        ])
      ]),
      _: 1
    })) : createCommentVNode("", true),
    _cache[23] || (_cache[23] = createTextVNode()),
    createVNode(Transition, {
      name: "fade",
      mode: "out-in"
    }, {
      default: withCtx(() => [
        $setup.item.src === "" ? (openBlock(), createBlock($setup["BFormGroup"], {
          key: 0,
          label: "上傳影片"
        }, {
          default: withCtx(() => [
            _cache[7] || (_cache[7] = createElementVNode("div", { class: "text-muted mb-2" }, [
              createElementVNode("small", null, "\n              請上傳1280x720(720p)或1920x1080(1080p)尺寸，格式為.mp4的文件\n            ")
            ], -1)),
            _cache[8] || (_cache[8] = createTextVNode()),
            createVNode($setup["FileUploader"], {
              accept: "video/mp4",
              "s3-multipart": "",
              onUploaded: $setup.uploadVideo,
              dest: () => `segments/${$setup.item.id}/video.{ext}`
            }, null, 8, ["dest"])
          ]),
          _: 1
        })) : (openBlock(), createElementBlock("div", _hoisted_3, [
          createVNode($setup["BFormGroup"], { label: "影片" }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_4, [
                _cache[10] || (_cache[10] = createElementVNode("div", { class: "input-group-text" }, [
                  createElementVNode("span", { class: "fal fa-fw fa-video me-2" })
                ], -1)),
                _cache[11] || (_cache[11] = createTextVNode()),
                createElementVNode("input", {
                  type: "text",
                  class: "form-control",
                  disabled: "",
                  value: $setup.videoName
                }, null, 8, _hoisted_5),
                _cache[12] || (_cache[12] = createTextVNode()),
                createVNode($setup["BButton"], {
                  variant: "danger",
                  onClick: _cache[2] || (_cache[2] = ($event) => $setup.clear("src")),
                  disabled: $setup.loading
                }, {
                  default: withCtx(() => [..._cache[9] || (_cache[9] = [
                    createElementVNode("span", { class: "fal fa-trash" }, null, -1),
                    createTextVNode("\n              移除\n            ", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ]),
            _: 1
          }),
          _cache[14] || (_cache[14] = createTextVNode()),
          $setup.item.src !== "" ? (openBlock(), createBlock($setup["BFormGroup"], {
            key: 0,
            class: "",
            label: "預覽"
          }, {
            default: withCtx(() => [
              $setup.videoEmbedUrl ? (openBlock(), createElementBlock("div", _hoisted_6, [
                createElementVNode("iframe", {
                  src: $setup.videoEmbedUrl,
                  frameborder: "0",
                  style: { "width": "100%" }
                }, null, 8, _hoisted_7)
              ])) : (openBlock(), createElementBlock("div", _hoisted_8, [
                createElementVNode("video", _hoisted_9, [
                  createElementVNode("source", {
                    src: $setup.previewSrc,
                    type: "video/mp4"
                  }, null, 8, _hoisted_10),
                  _cache[13] || (_cache[13] = createTextVNode()),
                  createElementVNode("track", {
                    default: "",
                    kind: "captions",
                    src: $setup.previewCaptionSrc,
                    srclang: "zh",
                    label: "中文"
                  }, null, 8, _hoisted_11)
                ])
              ]))
            ]),
            _: 1
          })) : createCommentVNode("", true),
          _cache[15] || (_cache[15] = createTextVNode()),
          $setup.isCloudVideo ? (openBlock(), createBlock($setup["BFormGroup"], {
            key: 1,
            label: "影片時數 (秒)",
            "label-for": "input-section-duration",
            "label-class": "mb-2",
            description: "雲端影片需要手動輸入時數"
          }, {
            default: withCtx(() => [
              createVNode($setup["BFormInput"], {
                id: "input-section-duration",
                modelValue: $setup.item.duration,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.item.duration = $event),
                trim: ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]))
      ]),
      _: 1
    }),
    _cache[24] || (_cache[24] = createTextVNode()),
    $setup.item.captionSrc === "" ? (openBlock(), createBlock($setup["BFormGroup"], {
      key: 1,
      label: "上傳字幕"
    }, {
      default: withCtx(() => [
        _cache[16] || (_cache[16] = createElementVNode("div", { class: "text-muted mb-2" }, [
          createElementVNode("small", null, "\n            僅支援格式為 .vtt .srt 的文件\n          ")
        ], -1)),
        _cache[17] || (_cache[17] = createTextVNode()),
        createVNode($setup["FileUploader"], {
          accept: ".vtt,.srt",
          onUploaded: $setup.uploadCaption,
          "upload-url": $setup.route("@file_upload"),
          dest: () => `segments/${$setup.item.id}/caption.{ext}`
        }, null, 8, ["upload-url", "dest"])
      ]),
      _: 1
    })) : (openBlock(), createBlock($setup["BFormGroup"], {
      key: 2,
      label: "字幕"
    }, {
      default: withCtx(() => [
        createElementVNode("div", _hoisted_12, [
          _cache[19] || (_cache[19] = createElementVNode("div", { class: "input-group-text" }, [
            createElementVNode("span", { class: "fal fa-fw fa-closed-captioning me-2" })
          ], -1)),
          _cache[20] || (_cache[20] = createTextVNode()),
          createElementVNode("input", {
            type: "text",
            class: "form-control",
            disabled: "",
            value: $setup.item.captionSrc
          }, null, 8, _hoisted_13),
          _cache[21] || (_cache[21] = createTextVNode()),
          createVNode($setup["BButton"], {
            variant: "danger",
            onClick: _cache[4] || (_cache[4] = ($event) => $setup.clear("captionSrc")),
            disabled: $setup.loading
          }, {
            default: withCtx(() => [..._cache[18] || (_cache[18] = [
              createElementVNode("span", { class: "fal fa-trash" }, null, -1),
              createTextVNode("\n            移除\n          ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]),
      _: 1
    }))
  ]);
}
const SectionVideoEdit = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6d0d1b37"], ["__file", "SectionVideoEdit.vue"]]);
export {
  SectionVideoEdit as default
};
//# sourceMappingURL=SectionVideoEdit.js.map
