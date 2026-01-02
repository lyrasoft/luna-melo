import { getCurrentScope, onScopeDispose, effectScope, watch, computed, toValue as toValue$1, isRef, toRef as toRef$1, readonly, ref, customRef, shallowRef, defineComponent, unref, getCurrentInstance as getCurrentInstance$1, onMounted, nextTick, h, Teleport, useId as useId$1, onUnmounted, inject, watchEffect, provide, useSlots, createBlock, openBlock, resolveDynamicComponent, normalizeClass, withCtx, createElementBlock, createCommentVNode, renderSlot, createTextVNode, toDisplayString, useAttrs, mergeProps, mergeModels, useTemplateRef, useModel, Fragment, createVNode, onBeforeUnmount, Transition, withDirectives, createElementVNode, withModifiers, normalizeProps, guardReactiveProps, vShow, normalizeStyle, markRaw, isReadonly, render, shallowReadonly, onActivated, toRefs, renderList, defineAsyncComponent, createApp } from "vue";
import { useHttpClient, route, sleep, slideDown, slideUp } from "@windwalker-io/unicorn-next";
import { useLoading, uniqueItemList, uniqueItem } from "@lyrasoft/ts-toolkit/vue";
import { VueDraggable } from "vue-draggable-plus";
const genericBvnPrefix = "BootstrapVueNext__";
const withBvnPrefix = (value, suffix = "") => {
  const suffixWithTrail = `${suffix}___`;
  return `${genericBvnPrefix}ID__${value}__${suffix ? suffixWithTrail : ""}`;
};
const createBvnInjectionKey = (name) => withBvnPrefix(name);
const createBvnRegistryInjectionKey = (name) => withBvnPrefix(`${name}__registry`);
const radioGroupKey = createBvnInjectionKey("radioGroup");
const collapseInjectionKey = createBvnInjectionKey("collapse");
const showHideRegistryKey = createBvnRegistryInjectionKey("showHide");
const navbarInjectionKey = createBvnInjectionKey("navbar");
const rtlRegistryKey = createBvnRegistryInjectionKey("rtl");
const breadcrumbGlobalIndexKey = `${genericBvnPrefix}global_breadcrumb`;
const breadcrumbRegistryKey = createBvnRegistryInjectionKey("breadcrumb");
const modalManagerKey = createBvnRegistryInjectionKey("modalManager");
const defaultsKey = createBvnRegistryInjectionKey("defaults");
const orchestratorRegistryKey = createBvnRegistryInjectionKey("orchestrator");
const formGroupKey = createBvnInjectionKey("formGroupPlugin");
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
// @__NO_SIDE_EFFECTS__
function createSharedComposable(composable) {
  let subscribers = 0;
  let state;
  let scope;
  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = void 0;
      scope = void 0;
    }
  };
  return (...args) => {
    subscribers += 1;
    if (!scope) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    tryOnScopeDispose(dispose);
    return state;
  };
}
// @__NO_SIDE_EFFECTS__
function makeDestructurable(obj, arr) {
  if (typeof Symbol !== "undefined") {
    const clone = { ...obj };
    Object.defineProperty(clone, Symbol.iterator, {
      enumerable: false,
      value() {
        let index = 0;
        return {
          next: () => ({
            value: arr[index++],
            done: index > arr.length
          })
        };
      }
    });
    return clone;
  } else {
    return Object.assign([...arr], obj);
  }
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const notNullish = (val) => val != null;
const toString = Object.prototype.toString;
const isObject$1 = (val) => toString.call(val) === "[object Object]";
const noop$2 = () => {
};
const isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
  var _a, _b;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop$2 }))) : ref(r);
}
function createFilterWrapper$2(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
function throttleFilter(...args) {
  let lastExec = 0;
  let timer;
  let isLeading = true;
  let lastRejector = noop$2;
  let lastValue;
  let ms;
  let trailing;
  let leading;
  let rejectOnCancel;
  if (!isRef(args[0]) && typeof args[0] === "object")
    ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0]);
  else
    [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      lastRejector();
      lastRejector = noop$2;
    }
  };
  const filter = (_invoke) => {
    const duration = toValue$1(ms);
    const elapsed = Date.now() - lastExec;
    const invoke = () => {
      return lastValue = _invoke();
    };
    clear();
    if (duration <= 0) {
      lastExec = Date.now();
      return invoke();
    }
    if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke();
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve;
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          resolve(invoke());
          clear();
        }, Math.max(0, duration - elapsed));
      });
    }
    if (!leading && !timer)
      timer = setTimeout(() => isLeading = true, duration);
    isLeading = false;
    return lastValue;
  };
  return filter;
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function cacheStringFunction(fn) {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
// @__NO_SIDE_EFFECTS__
function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
  return createFilterWrapper$2(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn
  );
}
// @__NO_SIDE_EFFECTS__
function useToNumber(value, options = {}) {
  const {
    method = "parseFloat",
    radix,
    nanToZero
  } = options;
  return computed(() => {
    let resolved = toValue$1(value);
    if (typeof method === "function")
      resolved = method(resolved);
    else if (typeof resolved === "string")
      resolved = Number[method](resolved, radix);
    if (nanToZero && Number.isNaN(resolved))
      resolved = 0;
    return resolved;
  });
}
function watchImmediate(source, cb, options) {
  return watch(
    source,
    cb,
    {
      ...options,
      immediate: true
    }
  );
}
// @__NO_SIDE_EFFECTS__
function createReusableTemplate(options = {}) {
  const {
    inheritAttrs = true
  } = options;
  const render2 = shallowRef();
  const define = /* @__PURE__ */ defineComponent({
    setup(_, { slots }) {
      return () => {
        render2.value = slots.default;
      };
    }
  });
  const reuse = /* @__PURE__ */ defineComponent({
    inheritAttrs,
    props: options.props,
    setup(props, { attrs, slots }) {
      return () => {
        var _a;
        if (!render2.value && process.env.NODE_ENV !== "production")
          throw new Error("[VueUse] Failed to find the definition of reusable template");
        const vnode = (_a = render2.value) == null ? void 0 : _a.call(render2, {
          ...options.props == null ? keysToCamelKebabCase(attrs) : props,
          $slots: slots
        });
        return inheritAttrs && (vnode == null ? void 0 : vnode.length) === 1 ? vnode[0] : vnode;
      };
    }
  });
  return /* @__PURE__ */ makeDestructurable(
    { define, reuse },
    [define, reuse]
  );
}
function keysToCamelKebabCase(obj) {
  const newObj = {};
  for (const key in obj)
    newObj[camelize(key)] = obj[key];
  return newObj;
}
const defaultWindow = isClient ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue$1(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test = toArray(toValue$1(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  const stopWatch = watchImmediate(
    () => {
      var _a, _b;
      return [
        (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
        toArray(toValue$1(firstParamTargets.value ? args[1] : args[0])),
        toArray(unref(firstParamTargets.value ? args[2] : args[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue$1(firstParamTargets.value ? args[3] : args[2])
      ];
    },
    ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
        return;
      const optionsClone = isObject$1(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(
        ...raw_targets.flatMap(
          (el) => raw_events.flatMap(
            (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
          )
        )
      );
    },
    { flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(cleanup);
  return stop;
}
let _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
  if (!window2) {
    return controls ? { stop: noop$2, cancel: noop$2, trigger: noop$2 } : noop$2;
  }
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    const listenerOptions = { passive: true };
    Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop$2, listenerOptions));
    window2.document.documentElement.addEventListener("click", noop$2, listenerOptions);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return toValue$1(ignore).some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  function hasMultipleRoots(target2) {
    const vm = toValue$1(target2);
    return vm && vm.$.subTree.shapeFlag === 16;
  }
  function checkMultipleRoots(target2, event) {
    const vm = toValue$1(target2);
    const children = vm.$.subTree && vm.$.subTree.children;
    if (children == null || !Array.isArray(children))
      return false;
    return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
  }
  const listener = (event) => {
    const el = unrefElement(target);
    if (event.target == null)
      return;
    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event))
      return;
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if ("detail" in event && event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  let isProcessingClick = false;
  const cleanup = [
    useEventListener(window2, "click", (event) => {
      if (!isProcessingClick) {
        isProcessingClick = true;
        setTimeout(() => {
          isProcessingClick = false;
        }, 0);
        listener(event);
      }
    }, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    }, { passive: true })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  if (controls) {
    return {
      stop,
      cancel: () => {
        shouldListen = false;
      },
      trigger: (event) => {
        shouldListen = true;
        listener(event);
        shouldListen = false;
      }
    };
  }
  return stop;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = shallowRef(false);
  const instance = getCurrentInstance$1();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    }, instance);
  }
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useMutationObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...mutationOptions } = options;
  let observer;
  const isSupported = /* @__PURE__ */ useSupported(() => window2 && "MutationObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const value = toValue$1(target);
    const items = toArray(value).map(unrefElement).filter(notNullish);
    return new Set(items);
  });
  const stopWatch = watch(
    () => targets.value,
    (targets2) => {
      cleanup();
      if (isSupported.value && targets2.size) {
        observer = new MutationObserver(callback);
        targets2.forEach((el) => observer.observe(el, mutationOptions));
      }
    },
    { immediate: true, flush: "post" }
  );
  const takeRecords = () => {
    return observer == null ? void 0 : observer.takeRecords();
  };
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop,
    takeRecords
  };
}
function createKeyPredicate(keyFilter) {
  if (typeof keyFilter === "function")
    return keyFilter;
  else if (typeof keyFilter === "string")
    return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter))
    return (event) => keyFilter.includes(event.key);
  return () => true;
}
function onKeyStroke(...args) {
  let key;
  let handler;
  let options = {};
  if (args.length === 3) {
    key = args[0];
    handler = args[1];
    options = args[2];
  } else if (args.length === 2) {
    if (typeof args[1] === "object") {
      key = true;
      handler = args[0];
      options = args[1];
    } else {
      key = args[0];
      handler = args[1];
    }
  } else {
    key = true;
    handler = args[0];
  }
  const {
    target = defaultWindow,
    eventName = "keydown",
    passive = false,
    dedupe = false
  } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (e.repeat && toValue$1(dedupe))
      return;
    if (predicate(e))
      handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
const handlers = /* @__PURE__ */ getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function useFocus(target, options = {}) {
  const { initialValue = false, focusVisible = false, preventScroll = false } = options;
  const innerFocused = shallowRef(false);
  const targetElement = computed(() => unrefElement(target));
  const listenerOptions = { passive: true };
  useEventListener(targetElement, "focus", (event) => {
    var _a, _b;
    if (!focusVisible || ((_b = (_a = event.target).matches) == null ? void 0 : _b.call(_a, ":focus-visible")))
      innerFocused.value = true;
  }, listenerOptions);
  useEventListener(targetElement, "blur", () => innerFocused.value = false, listenerOptions);
  const focused = computed({
    get: () => innerFocused.value,
    set(value) {
      var _a, _b;
      if (!value && innerFocused.value)
        (_a = targetElement.value) == null ? void 0 : _a.blur();
      else if (value && !innerFocused.value)
        (_b = targetElement.value) == null ? void 0 : _b.focus({ preventScroll });
    }
  });
  watch(
    targetElement,
    () => {
      focused.value = initialValue;
    },
    { immediate: true, flush: "post" }
  );
  return { focused };
}
function resolveElement(el) {
  if (typeof Window !== "undefined" && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== "undefined" && el instanceof Document)
    return el.documentElement;
  return el;
}
const UseMouseBuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => event instanceof MouseEvent ? [event.movementX, event.movementY] : null
};
function useMouse$1(options = {}) {
  const {
    type = "page",
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    target = window2,
    scroll = true,
    eventFilter
  } = options;
  let _prevMouseEvent = null;
  let _prevScrollX = 0;
  let _prevScrollY = 0;
  const x = shallowRef(initialValue.x);
  const y = shallowRef(initialValue.y);
  const sourceType = shallowRef(null);
  const extractor = typeof type === "function" ? type : UseMouseBuiltinExtractors[type];
  const mouseHandler = (event) => {
    const result = extractor(event);
    _prevMouseEvent = event;
    if (result) {
      [x.value, y.value] = result;
      sourceType.value = "mouse";
    }
    if (window2) {
      _prevScrollX = window2.scrollX;
      _prevScrollY = window2.scrollY;
    }
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = "touch";
      }
    }
  };
  const scrollHandler = () => {
    if (!_prevMouseEvent || !window2)
      return;
    const pos = extractor(_prevMouseEvent);
    if (_prevMouseEvent instanceof MouseEvent && pos) {
      x.value = pos[0] + window2.scrollX - _prevScrollX;
      y.value = pos[1] + window2.scrollY - _prevScrollY;
    }
  };
  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };
  const mouseHandlerWrapper = eventFilter ? (event) => eventFilter(() => mouseHandler(event), {}) : (event) => mouseHandler(event);
  const touchHandlerWrapper = eventFilter ? (event) => eventFilter(() => touchHandler(event), {}) : (event) => touchHandler(event);
  const scrollHandlerWrapper = eventFilter ? () => eventFilter(() => scrollHandler(), {}) : () => scrollHandler();
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(target, ["mousemove", "dragover"], mouseHandlerWrapper, listenerOptions);
    if (touch && type !== "movement") {
      useEventListener(target, ["touchstart", "touchmove"], touchHandlerWrapper, listenerOptions);
      if (resetOnTouchEnds)
        useEventListener(target, "touchend", reset, listenerOptions);
    }
    if (scroll && type === "page")
      useEventListener(window2, "scroll", scrollHandlerWrapper, listenerOptions);
  }
  return {
    x,
    y,
    sourceType
  };
}
function checkOverflowScroll(ele) {
  const style = window.getComputedStyle(ele);
  if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) {
    return true;
  } else {
    const parent = ele.parentNode;
    if (!parent || parent.tagName === "BODY")
      return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e = rawEvent || window.event;
  const _target = e.target;
  if (checkOverflowScroll(_target))
    return false;
  if (e.touches.length > 1)
    return true;
  if (e.preventDefault)
    e.preventDefault();
  return false;
}
const elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock$1(element, initialState = false) {
  const isLocked = shallowRef(initialState);
  let stopTouchMoveListener = null;
  let initialOverflow = "";
  watch(toRef(element), (el) => {
    const target = resolveElement(toValue$1(el));
    if (target) {
      const ele = target;
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow);
      if (ele.style.overflow !== "hidden")
        initialOverflow = ele.style.overflow;
      if (ele.style.overflow === "hidden")
        return isLocked.value = true;
      if (isLocked.value)
        return ele.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const lock = () => {
    const el = resolveElement(toValue$1(element));
    if (!el || isLocked.value)
      return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        "touchmove",
        (e) => {
          preventDefault(e);
        },
        { passive: false }
      );
    }
    el.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const el = resolveElement(toValue$1(element));
    if (!el || !isLocked.value)
      return;
    if (isIOS)
      stopTouchMoveListener == null ? void 0 : stopTouchMoveListener();
    el.style.overflow = initialOverflow;
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v)
        lock();
      else unlock();
    }
  });
}
function buildPromise(_id, store) {
  let resolveFunc = () => {
  };
  const promise = new Promise((resolve) => {
    resolveFunc = resolve;
  });
  Object.assign(promise, {
    id: _id,
    ref: null,
    show() {
      const refWithMethods = this.ref;
      if (refWithMethods?.show) {
        refWithMethods.show();
      } else return this.set({ modelValue: true });
      return promise;
    },
    hide(trigger) {
      const refWithMethods = this.ref;
      if (refWithMethods?.hide) {
        refWithMethods.hide(trigger, true);
      } else return this.set({ modelValue: false });
      return promise;
    },
    toggle() {
      const currentItem = this.get();
      const refWithMethods = this.ref;
      if (refWithMethods?.toggle) {
        refWithMethods.toggle();
      } else return this.set({ modelValue: !currentItem?.modelValue });
      return promise;
    },
    get() {
      return store.value.find((el) => el._self === _id);
    },
    set(val) {
      const itemIndex = store.value.findIndex((el) => el._self === _id);
      const item = store.value[itemIndex];
      if (item) {
        const v = { ...toValue$1(item), ...toValue$1(val) };
        if (item.modelValue !== v.modelValue) {
          item["onUpdate:modelValue"]?.(v.modelValue);
        }
        const updatedItem = {
          ...v,
          modelValue: toValue$1(v.modelValue)
        };
        const vRecord = v;
        if ("title" in vRecord && vRecord.title !== void 0) {
          updatedItem.title = toValue$1(vRecord.title);
        }
        if ("body" in vRecord && vRecord.body !== void 0) {
          updatedItem.body = toValue$1(vRecord.body);
        }
        store.value.splice(itemIndex, 1, updatedItem);
      }
      return promise;
    },
    async destroy() {
      const item = store.value.find((el) => el._self === _id);
      if (!item) return;
      item.promise.stop?.();
      if (item.modelValue) {
        await new Promise((resolve) => {
          const prev = item["onHidden"];
          item["onHidden"] = (e) => {
            prev?.(e);
            resolve(e);
          };
          nextTick(() => {
            this.hide("destroy");
          });
        });
      }
      store.value.splice(
        store.value.findIndex((el) => el._self === _id),
        1
      );
    },
    async [Symbol.asyncDispose]() {
      await this.destroy();
    }
  });
  return {
    value: promise,
    resolve: resolveFunc,
    stop: void 0
  };
}
const _newOrchestratorRegistry = () => ({
  store: ref([]),
  _isOrchestratorInstalled: ref(false),
  _isToastAppend: ref(false)
});
const componentsWithExternalPath = {
  BAccordion: "/components/BAccordion",
  BAccordionItem: "/components/BAccordion",
  BAlert: "/components/BAlert",
  BApp: "/components/BApp",
  BAvatar: "/components/BAvatar",
  BAvatarGroup: "/components/BAvatar",
  BBadge: "/components/BBadge",
  BBreadcrumb: "/components/BBreadcrumb",
  BBreadcrumbItem: "/components/BBreadcrumb",
  BButton: "/components/BButton",
  BButtonGroup: "/components/BButton",
  BButtonToolbar: "/components/BButton",
  BCloseButton: "/components/BButton",
  BCard: "/components/BCard",
  BCardBody: "/components/BCard",
  BCardFooter: "/components/BCard",
  BCardGroup: "/components/BCard",
  BCardHeader: "/components/BCard",
  BCardImg: "/components/BCard",
  BCardSubtitle: "/components/BCard",
  BCardText: "/components/BCard",
  BCardTitle: "/components/BCard",
  BCarousel: "/components/BCarousel",
  BCarouselSlide: "/components/BCarousel",
  BCol: "/components/BContainer",
  BCollapse: "/components/BCollapse",
  BContainer: "/components/BContainer",
  BDropdown: "/components/BDropdown",
  BDropdownDivider: "/components/BDropdown",
  BDropdownForm: "/components/BDropdown",
  BDropdownGroup: "/components/BDropdown",
  BDropdownHeader: "/components/BDropdown",
  BDropdownItem: "/components/BDropdown",
  BDropdownItemButton: "/components/BDropdown",
  BDropdownText: "/components/BDropdown",
  BForm: "/components/BForm",
  BFormCheckbox: "/components/BFormCheckbox",
  BFormCheckboxGroup: "/components/BFormCheckbox",
  BFormDatalist: "/components/BForm",
  BFormFile: "/components/BFormFile",
  BFormFloatingLabel: "/components/BForm",
  BFormGroup: "/components/BFormGroup",
  BFormInput: "/components/BFormInput",
  BFormInvalidFeedback: "/components/BForm",
  BFormRadio: "/components/BFormRadio",
  BFormRadioGroup: "/components/BFormRadio",
  BFormRating: "/components/BFormRating",
  BFormRow: "/components/BForm",
  BFormSelect: "/components/BFormSelect",
  BFormSelectOption: "/components/BFormSelect",
  BFormSelectOptionGroup: "/components/BFormSelect",
  BFormSpinbutton: "/components/BFormSpinbutton",
  BFormTag: "/components/BFormTags",
  BFormTags: "/components/BFormTags",
  BFormText: "/components/BForm",
  BFormTextarea: "/components/BFormTextarea",
  BFormValidFeedback: "/components/BForm",
  BImg: "/components/BImg",
  BInput: "/components/BFormInput",
  BInputGroup: "/components/BInputGroup",
  BInputGroupText: "/components/BInputGroup",
  BListGroup: "/components/BListGroup",
  BListGroupItem: "/components/BListGroup",
  BModal: "/components/BModal",
  BModalOrchestrator: "/components/BModal",
  BNav: "/components/BNav",
  BNavForm: "/components/BNav",
  BNavItem: "/components/BNav",
  BNavItemDropdown: "/components/BNav",
  BNavText: "/components/BNav",
  BNavbar: "/components/BNavbar",
  BNavbarBrand: "/components/BNavbar",
  BNavbarNav: "/components/BNavbar",
  BNavbarToggle: "/components/BNavbar",
  BOffcanvas: "/components/BOffcanvas",
  BOverlay: "/components/BOverlay",
  BOrchestrator: "/components/BApp",
  BPagination: "/components/BPagination",
  BPlaceholder: "/components/BPlaceholder",
  BPlaceholderButton: "/components/BPlaceholder",
  BPlaceholderCard: "/components/BPlaceholder",
  BPlaceholderTable: "/components/BPlaceholder",
  BPlaceholderWrapper: "/components/BPlaceholder",
  BPopover: "/components/BPopover",
  BProgress: "/components/BProgress",
  BRow: "/components/BContainer",
  BSpinner: "/components/BSpinner",
  BTab: "/components/BTabs",
  BTabs: "/components/BTabs",
  BToast: "/components/BToast",
  BToastOrchestrator: "/components/BToast",
  BTooltip: "/components/BTooltip",
  BLink: "/components/BLink",
  BProgressBar: "/components/BProgress",
  BTableSimple: "/components/BTable",
  BTableLite: "/components/BTable",
  BTable: "/components/BTable",
  BTbody: "/components/BTable",
  BTd: "/components/BTable",
  BTh: "/components/BTable",
  BThead: "/components/BTable",
  BTfoot: "/components/BTable",
  BTr: "/components/BTable",
  BPopoverOrchestrator: "/components/BPopover"
};
const componentNames = Object.freeze(
  Object.keys(componentsWithExternalPath)
);
const directivesWithExternalPath = {
  vBColorMode: "/directives/BColorMode",
  vBModal: "/directives/BModal",
  vBPopover: "/directives/BPopover",
  vBScrollspy: "/directives/BScrollspy",
  vBToggle: "/directives/BToggle",
  vBTooltip: "/directives/BTooltip"
};
const directiveNames = Object.freeze(
  Object.keys(directivesWithExternalPath)
);
const composablesWithExternalPath = {
  useBreadcrumb: "/composables/useBreadcrumb",
  useColorMode: "/composables/useColorMode",
  useModal: "/composables/useModal",
  useModalController: "/composables/useModal",
  useScrollLock: "/composables/useScrollLock",
  useScrollspy: "/composables/useScrollspy",
  useToast: "/composables/useToast",
  useToastController: "/composables/useToast",
  useToggle: "/composables/useToggle",
  usePopover: "/composables/usePopover",
  usePopoverController: "/composables/usePopover",
  useRegistry: "/composables/useRegistry",
  useProvideDefaults: "/composables/useProvideDefaults",
  useOrchestratorRegistry: "/composables/orchestratorShared"
};
Object.freeze(
  Object.keys(composablesWithExternalPath)
);
const _sfc_main$f = defineComponent({
  name: "ConditionalTeleport",
  inheritAttrs: false,
  props: {
    to: {
      type: [String, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  slots: Object,
  setup(props, { slots }) {
    return () => !props.to ? slots.default?.({}) : h(Teleport, { to: props.to, disabled: props.disabled || !props.to }, [slots.default?.({})]);
  }
});
const _sfc_main$e = defineComponent({
  name: "ConditionalWrapper",
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: "div"
    },
    skip: {
      type: Boolean,
      required: true
    }
  },
  slots: Object,
  setup(props, { slots, attrs }) {
    return () => props.skip ? slots.default?.({}) : h(props.tag, { ...attrs }, [slots.default?.({})]);
  }
});
var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var isInert = function isInert2(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && isInert2(node.parentNode);
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var activeFocusTraps = {
  activateTrap: function activateTrap(trapStack, trap) {
    if (trapStack.length > 0) {
      var activeTrap = trapStack[trapStack.length - 1];
      if (activeTrap !== trap) {
        activeTrap._setPausedState(true);
      }
    }
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex === -1) {
      trapStack.push(trap);
    } else {
      trapStack.splice(trapIndex, 1);
      trapStack.push(trap);
    }
  },
  deactivateTrap: function deactivateTrap(trapStack, trap) {
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex !== -1) {
      trapStack.splice(trapIndex, 1);
    }
    if (trapStack.length > 0 && !trapStack[trapStack.length - 1]._isManuallyPaused()) {
      trapStack[trapStack.length - 1]._setPausedState(false);
    }
  }
};
var isSelectableInput = function isSelectableInput2(node) {
  return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
};
var isTabEvent = function isTabEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
};
var isKeyForward = function isKeyForward2(e) {
  return isTabEvent(e) && !e.shiftKey;
};
var isKeyBackward = function isKeyBackward2(e) {
  return isTabEvent(e) && e.shiftKey;
};
var delay = function delay2(fn) {
  return setTimeout(fn, 0);
};
var valueOrHandler = function valueOrHandler2(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event) {
  return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var internalTrapStack = [];
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true,
    isKeyForward,
    isKeyBackward
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   posTabIndexesFound: boolean,
    //   firstTabbableNode: HTMLElement|undefined,
    //   lastTabbableNode: HTMLElement|undefined,
    //   firstDomTabbableNode: HTMLElement|undefined,
    //   lastDomTabbableNode: HTMLElement|undefined,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    manuallyPaused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0,
    // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
    recentNavEvent: void 0
  };
  var trap;
  var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };
  var findContainerIndex = function findContainerIndex2(element, event) {
    var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
    return state.containerGroups.findIndex(function(_ref) {
      var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
        return node === element;
      });
    });
  };
  var getNodeForOption = function getNodeForOption2(optionName) {
    var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$hasFallback = _ref2.hasFallback, hasFallback = _ref2$hasFallback === void 0 ? false : _ref2$hasFallback, _ref2$params = _ref2.params, params = _ref2$params === void 0 ? [] : _ref2$params;
    var optionValue = config[optionName];
    if (typeof optionValue === "function") {
      optionValue = optionValue.apply(void 0, _toConsumableArray(params));
    }
    if (optionValue === true) {
      optionValue = void 0;
    }
    if (!optionValue) {
      if (optionValue === void 0 || optionValue === false) {
        return optionValue;
      }
      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue;
    if (typeof optionValue === "string") {
      try {
        node = doc.querySelector(optionValue);
      } catch (err) {
        throw new Error("`".concat(optionName, '` appears to be an invalid selector; error="').concat(err.message, '"'));
      }
      if (!node) {
        if (!hasFallback) {
          throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        }
      }
    }
    return node;
  };
  var getInitialFocusNode = function getInitialFocusNode2() {
    var node = getNodeForOption("initialFocus", {
      hasFallback: true
    });
    if (node === false) {
      return false;
    }
    if (node === void 0 || node && !isFocusable(node, config.tabbableOptions)) {
      if (findContainerIndex(doc.activeElement) >= 0) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
        node = firstTabbableNode || getNodeForOption("fallbackFocus");
      }
    } else if (node === null) {
      node = getNodeForOption("fallbackFocus");
    }
    if (!node) {
      throw new Error("Your focus-trap needs to have at least one focusable element");
    }
    return node;
  };
  var updateTabbableNodes = function updateTabbableNodes2() {
    state.containerGroups = state.containers.map(function(container) {
      var tabbableNodes = tabbable(container, config.tabbableOptions);
      var focusableNodes = focusable(container, config.tabbableOptions);
      var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
      var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
      var firstDomTabbableNode = focusableNodes.find(function(node) {
        return isTabbable(node);
      });
      var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
        return isTabbable(node);
      });
      var posTabIndexesFound = !!tabbableNodes.find(function(node) {
        return getTabIndex(node) > 0;
      });
      return {
        container,
        tabbableNodes,
        focusableNodes,
        /** True if at least one node with positive `tabindex` was found in this container. */
        posTabIndexesFound,
        /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
        firstTabbableNode,
        /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
        lastTabbableNode,
        // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
        //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        //  because that API doesn't work with Shadow DOM as well as it should (@see
        //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
        //  to address an edge case related to positive tabindex support, this seems like a much easier,
        //  "close enough most of the time" alternative for positive tabindexes which should generally
        //  be avoided anyway...
        /** First tabbable node in container, __DOM__ order; `undefined` if none. */
        firstDomTabbableNode,
        /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
        lastDomTabbableNode,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function nextTabbableNode(node) {
          var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var nodeIdx = tabbableNodes.indexOf(node);
          if (nodeIdx < 0) {
            if (forward) {
              return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
                return isTabbable(el);
              });
            }
            return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
              return isTabbable(el);
            });
          }
          return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function(group) {
      return group.tabbableNodes.length > 0;
    });
    if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
    if (state.containerGroups.find(function(g) {
      return g.posTabIndexesFound;
    }) && state.containerGroups.length > 1) {
      throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
    }
  };
  var _getActiveElement = function getActiveElement2(el) {
    var activeElement = el.activeElement;
    if (!activeElement) {
      return;
    }
    if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
      return _getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  };
  var _tryFocus = function tryFocus(node) {
    if (node === false) {
      return;
    }
    if (node === _getActiveElement(document)) {
      return;
    }
    if (!node || !node.focus) {
      _tryFocus(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
    var node = getNodeForOption("setReturnFocus", {
      params: [previousActiveElement]
    });
    return node ? node : node === false ? false : previousActiveElement;
  };
  var findNextNavNode = function findNextNavNode2(_ref3) {
    var target = _ref3.target, event = _ref3.event, _ref3$isBackward = _ref3.isBackward, isBackward = _ref3$isBackward === void 0 ? false : _ref3$isBackward;
    target = target || getActualTarget(event);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      var containerIndex = findContainerIndex(target, event);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
      if (containerIndex < 0) {
        if (isBackward) {
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (isBackward) {
        var startOfGroupIndex = state.tabbableGroups.findIndex(function(_ref4) {
          var firstTabbableNode = _ref4.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target, false);
        }
      } else {
        var lastOfGroupIndex = state.tabbableGroups.findIndex(function(_ref5) {
          var lastTabbableNode = _ref5.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target);
        }
      }
    } else {
      destinationNode = getNodeForOption("fallbackFocus");
    }
    return destinationNode;
  };
  var checkPointerDown = function checkPointerDown2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      trap.deactivate({
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked (and if not focusable, to "nothing"); by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node), whether the
        //  outside click was on a focusable node or not
        returnFocus: config.returnFocusOnDeactivate
      });
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
  };
  var checkFocusIn = function checkFocusIn2(event) {
    var target = getActualTarget(event);
    var targetContained = findContainerIndex(target, event) >= 0;
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      event.stopImmediatePropagation();
      var nextNode;
      var navAcrossContainers = true;
      if (state.mostRecentlyFocusedNode) {
        if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
          var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
          var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
          if (tabbableNodes.length > 0) {
            var mruTabIdx = tabbableNodes.findIndex(function(node) {
              return node === state.mostRecentlyFocusedNode;
            });
            if (mruTabIdx >= 0) {
              if (config.isKeyForward(state.recentNavEvent)) {
                if (mruTabIdx + 1 < tabbableNodes.length) {
                  nextNode = tabbableNodes[mruTabIdx + 1];
                  navAcrossContainers = false;
                }
              } else {
                if (mruTabIdx - 1 >= 0) {
                  nextNode = tabbableNodes[mruTabIdx - 1];
                  navAcrossContainers = false;
                }
              }
            }
          }
        } else {
          if (!state.containerGroups.some(function(g) {
            return g.tabbableNodes.some(function(n) {
              return getTabIndex(n) > 0;
            });
          })) {
            navAcrossContainers = false;
          }
        }
      } else {
        navAcrossContainers = false;
      }
      if (navAcrossContainers) {
        nextNode = findNextNavNode({
          // move FROM the MRU node, not event-related node (which will be the node that is
          //  outside the trap causing the focus escape we're trying to fix)
          target: state.mostRecentlyFocusedNode,
          isBackward: config.isKeyBackward(state.recentNavEvent)
        });
      }
      if (nextNode) {
        _tryFocus(nextNode);
      } else {
        _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
      }
    }
    state.recentNavEvent = void 0;
  };
  var checkKeyNav = function checkKeyNav2(event) {
    var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    state.recentNavEvent = event;
    var destinationNode = findNextNavNode({
      event,
      isBackward
    });
    if (destinationNode) {
      if (isTabEvent(event)) {
        event.preventDefault();
      }
      _tryFocus(destinationNode);
    }
  };
  var checkTabKey = function checkTabKey2(event) {
    if (config.isKeyForward(event) || config.isKeyBackward(event)) {
      checkKeyNav(event, config.isKeyBackward(event));
    }
  };
  var checkEscapeKey = function checkEscapeKey2(event) {
    if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
      event.preventDefault();
      trap.deactivate();
    }
  };
  var checkClick = function checkClick2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  var addListeners = function addListeners2() {
    if (!state.active) {
      return;
    }
    activeFocusTraps.activateTrap(trapStack, trap);
    state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function() {
      _tryFocus(getInitialFocusNode());
    }) : _tryFocus(getInitialFocusNode());
    doc.addEventListener("focusin", checkFocusIn, true);
    doc.addEventListener("mousedown", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("touchstart", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("click", checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkTabKey, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkEscapeKey);
    return trap;
  };
  var removeListeners = function removeListeners2() {
    if (!state.active) {
      return;
    }
    doc.removeEventListener("focusin", checkFocusIn, true);
    doc.removeEventListener("mousedown", checkPointerDown, true);
    doc.removeEventListener("touchstart", checkPointerDown, true);
    doc.removeEventListener("click", checkClick, true);
    doc.removeEventListener("keydown", checkTabKey, true);
    doc.removeEventListener("keydown", checkEscapeKey);
    return trap;
  };
  var checkDomRemoval = function checkDomRemoval2(mutations) {
    var isFocusedNodeRemoved = mutations.some(function(mutation) {
      var removedNodes = Array.from(mutation.removedNodes);
      return removedNodes.some(function(node) {
        return node === state.mostRecentlyFocusedNode;
      });
    });
    if (isFocusedNodeRemoved) {
      _tryFocus(getInitialFocusNode());
    }
  };
  var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0;
  var updateObservedNodes = function updateObservedNodes2() {
    if (!mutationObserver) {
      return;
    }
    mutationObserver.disconnect();
    if (state.active && !state.paused) {
      state.containers.map(function(container) {
        mutationObserver.observe(container, {
          subtree: true,
          childList: true
        });
      });
    }
  };
  trap = {
    get active() {
      return state.active;
    },
    get paused() {
      return state.paused;
    },
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, "onActivate");
      var onPostActivate = getOption(activateOptions, "onPostActivate");
      var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = _getActiveElement(doc);
      onActivate === null || onActivate === void 0 || onActivate();
      var finishActivation = function finishActivation2() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }
        addListeners();
        updateObservedNodes();
        onPostActivate === null || onPostActivate === void 0 || onPostActivate();
      };
      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }
      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
      var options = _objectSpread2({
        onDeactivate: config.onDeactivate,
        onPostDeactivate: config.onPostDeactivate,
        checkCanReturnFocus: config.checkCanReturnFocus
      }, deactivateOptions);
      clearTimeout(state.delayInitialFocusTimer);
      state.delayInitialFocusTimer = void 0;
      removeListeners();
      state.active = false;
      state.paused = false;
      updateObservedNodes();
      activeFocusTraps.deactivateTrap(trapStack, trap);
      var onDeactivate = getOption(options, "onDeactivate");
      var onPostDeactivate = getOption(options, "onPostDeactivate");
      var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
      var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
      onDeactivate === null || onDeactivate === void 0 || onDeactivate();
      var finishDeactivation = function finishDeactivation2() {
        delay(function() {
          if (returnFocus) {
            _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }
          onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate();
        });
      };
      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }
      finishDeactivation();
      return this;
    },
    pause: function pause(pauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = true;
      return this._setPausedState(true, pauseOptions);
    },
    unpause: function unpause(unpauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = false;
      if (trapStack[trapStack.length - 1] !== this) {
        return this;
      }
      return this._setPausedState(false, unpauseOptions);
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function(element) {
        return typeof element === "string" ? doc.querySelector(element) : element;
      });
      if (state.active) {
        updateTabbableNodes();
      }
      updateObservedNodes();
      return this;
    }
  };
  Object.defineProperties(trap, {
    _isManuallyPaused: {
      value: function value() {
        return state.manuallyPaused;
      }
    },
    _setPausedState: {
      value: function value(paused, options) {
        if (state.paused === paused) {
          return this;
        }
        state.paused = paused;
        if (paused) {
          var onPause = getOption(options, "onPause");
          var onPostPause = getOption(options, "onPostPause");
          onPause === null || onPause === void 0 || onPause();
          removeListeners();
          updateObservedNodes();
          onPostPause === null || onPostPause === void 0 || onPostPause();
        } else {
          var onUnpause = getOption(options, "onUnpause");
          var onPostUnpause = getOption(options, "onPostUnpause");
          onUnpause === null || onUnpause === void 0 || onUnpause();
          updateTabbableNodes();
          addListeners();
          updateObservedNodes();
          onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause();
        }
        return this;
      }
    }
  });
  trap.updateContainerElements(elements);
  return trap;
};
function useFocusTrap(target, options = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = options;
  const hasFocus = shallowRef(false);
  const isPaused = shallowRef(false);
  const activate = (opts) => trap && trap.activate(opts);
  const deactivate = (opts) => trap && trap.deactivate(opts);
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.value = true;
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.value = false;
    }
  };
  const targets = computed(() => {
    const _targets = toValue$1(target);
    return toArray(_targets).map((el) => {
      const _el = toValue$1(el);
      return typeof _el === "string" ? _el : unrefElement(_el);
    }).filter(notNullish);
  });
  watch(
    targets,
    (els) => {
      if (!els.length)
        return;
      if (!trap) {
        trap = createFocusTrap(els, {
          ...focusTrapOptions,
          onActivate() {
            hasFocus.value = true;
            if (options.onActivate)
              options.onActivate();
          },
          onDeactivate() {
            hasFocus.value = false;
            if (options.onDeactivate)
              options.onDeactivate();
          }
        });
        if (immediate)
          activate();
      } else {
        const isActive = trap == null ? void 0 : trap.active;
        trap == null ? void 0 : trap.updateContainerElements(els);
        if (!isActive && immediate) {
          activate();
        }
      }
    },
    { flush: "post" }
  );
  tryOnScopeDispose(() => deactivate());
  return {
    hasFocus,
    isPaused,
    activate,
    deactivate,
    pause,
    unpause
  };
}
const useActivatedFocusTrap = ({
  element,
  isActive,
  noTrap,
  fallbackFocus,
  focus
}, focusTrapOpts = {
  allowOutsideClick: true,
  fallbackFocus: () => fallbackFocus.ref.value || (typeof document !== "undefined" ? document.body : "body"),
  escapeDeactivates: false,
  clickOutsideDeactivates: false,
  initialFocus: focus
}) => {
  const resolvedIsActive = readonly(toRef$1(isActive));
  const resolvedNoTrap = readonly(toRef$1(noTrap));
  const checkNeedsFallback = () => {
    const tabbableElements = element.value?.querySelectorAll(
      `a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]):not(.${fallbackFocus.classSelector})`
    );
    return !tabbableElements?.length;
  };
  const needsFallback = ref(false);
  onMounted(() => {
    needsFallback.value = checkNeedsFallback();
    useMutationObserver(
      element,
      () => {
        needsFallback.value = checkNeedsFallback();
      },
      { childList: true, subtree: true }
    );
  });
  const trap = useFocusTrap(element, focusTrapOpts);
  watch(resolvedIsActive, async (newValue) => {
    if (newValue && resolvedNoTrap.value === false) {
      trap.activate();
    } else {
      trap.deactivate();
    }
  });
  watch(resolvedNoTrap, (newValue) => {
    if (newValue === true) {
      trap.deactivate();
    }
  });
  return {
    needsFallback: readonly(needsFallback)
  };
};
const useScrollLock = /* @__PURE__ */ createSharedComposable(useScrollLock$1);
let prevousRightPadding = "";
const lockRegistry = /* @__PURE__ */ new Map();
const useSafeScrollLock = (isOpen, bodyScroll) => {
  const resolvedIsOpen = readonly(toRef$1(isOpen));
  const id = useId$1();
  const inverseBodyScrollingValue = computed(() => !toValue$1(bodyScroll));
  const isLocked = useScrollLock(
    typeof document !== "undefined" ? document.body : null,
    resolvedIsOpen.value && inverseBodyScrollingValue.value
  );
  onMounted(() => {
    if (typeof document === "undefined") return;
    lockRegistry.set(id, false);
    watch(
      [resolvedIsOpen, inverseBodyScrollingValue],
      ([modelVal, bodyVal]) => {
        const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
        const hasLocked = Array.from(lockRegistry.values()).some((val) => val === true);
        const myLocked = modelVal && bodyVal;
        lockRegistry.set(id, myLocked);
        if (myLocked && !hasLocked && !isLocked.value) {
          isLocked.value = true;
          if (scrollBarGap > 0) {
            prevousRightPadding = document.body.style.paddingRight;
            document.body.style.paddingRight = `${scrollBarGap + prevousRightPadding}px`;
          }
        }
        const hasLockedAfter = Array.from(lockRegistry.values()).some((val) => val === true);
        if (hasLocked && !hasLockedAfter) {
          lockRegistry.set(id, false);
          isLocked.value = false;
          document.body.style.paddingRight = prevousRightPadding;
        }
      },
      { immediate: true }
    );
  });
  onUnmounted(() => {
    lockRegistry.delete(id);
    const hasLockedAfter = Array.from(lockRegistry.values()).some((val) => val === true);
    if (!hasLockedAfter) {
      document.body.style.paddingRight = prevousRightPadding;
      isLocked.value = false;
    }
  });
};
const getActiveElement = (excludes = []) => {
  const { activeElement } = document;
  return activeElement && !excludes?.some((el) => el === activeElement) ? activeElement : null;
};
const attemptFocus = (el, options = {}) => {
  const isActiveElement = (el2) => el2 === getActiveElement();
  try {
    el.focus(options);
  } catch (e) {
    console.error(e);
  }
  return isActiveElement(el);
};
const isEmptySlot = (el) => (el?.() ?? []).length === 0;
const isVisible = (el) => {
  if (el.getAttribute("display") === "none") {
    return false;
  }
  const bcr = el.getBoundingClientRect();
  return !!(bcr && bcr.height > 0 && bcr.width > 0);
};
const getModalZIndex = (element) => {
  if (typeof window === "undefined") return 1055;
  const target = element ?? document.body;
  const raw = window.getComputedStyle(target).getPropertyValue("--bs-modal-zindex").trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 1055;
};
function injectSelf(key, vm = getCurrentInstance("injectSelf")) {
  const { provides } = vm;
  if (provides && key in provides) {
    return provides[key];
  }
  return void 0;
}
function getCurrentInstance(name, message) {
  const vm = getCurrentInstance$1();
  if (!vm) {
    throw new Error(`[Bvn] ${name} ${"must be called from inside a setup function"}`);
  }
  return vm;
}
const toKebabCase = (str = "") => str.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
const isObject = (obj) => obj !== null && typeof obj === "object" && !Array.isArray(obj);
function mergeDeep(source = {}, target = {}, arrayFn) {
  const out = {};
  for (const key in source) {
    out[key] = source[key];
  }
  for (const key in target) {
    const sourceProperty = source[key];
    const targetProperty = target[key];
    if (isObject(sourceProperty) && isObject(targetProperty)) {
      out[key] = mergeDeep(sourceProperty, targetProperty);
      continue;
    }
    out[key] = targetProperty;
  }
  return out;
}
const propIsDefined = (vnode, prop) => typeof vnode.props?.[prop] !== "undefined" || typeof vnode.props?.[toKebabCase(prop)] !== "undefined";
function internalUseDefaults(props = {}, name) {
  const defaults = inject(defaultsKey, ref({}));
  const vm = getCurrentInstance("useDefaults");
  name = name ?? vm.type.name ?? vm.type.__name;
  if (!name) {
    throw new Error("[Bvn] Could not determine component name");
  }
  const componentDefaults = computed(() => defaults.value?.[props._as ?? name]);
  const _props = new Proxy(props, {
    get(target, prop) {
      const propValue = Reflect.get(target, prop);
      if (prop === "class" || prop === "style") {
        return [componentDefaults.value?.[prop], propValue].filter((v) => v != null);
      } else if (typeof prop === "string" && !propIsDefined(vm.vnode, prop)) {
        return componentDefaults.value?.[prop] ?? defaults.value?.global?.[prop] ?? propValue;
      }
      return propValue;
    }
  });
  const _subcomponentDefaults = shallowRef();
  watchEffect(() => {
    if (componentDefaults.value) {
      const subComponents = Object.entries(componentDefaults.value).filter(
        ([key]) => key.startsWith(key[0].toUpperCase())
      );
      _subcomponentDefaults.value = subComponents.length ? Object.fromEntries(subComponents) : void 0;
    } else {
      _subcomponentDefaults.value = void 0;
    }
  });
  function provideSubDefaults() {
    const injected = injectSelf(defaultsKey, vm);
    provide(
      defaultsKey,
      computed(
        () => _subcomponentDefaults.value ? mergeDeep(injected?.value ?? {}, _subcomponentDefaults.value) : injected?.value
      )
    );
  }
  return { props: _props, provideSubDefaults };
}
function useDefaults(props, name) {
  const { props: _props, provideSubDefaults } = internalUseDefaults(props, name);
  provideSubDefaults();
  return _props;
}
const useColorVariantClasses = (obj) => computed(() => {
  let props = toValue$1(obj);
  props = {
    variant: props.variant ?? null,
    bgVariant: props.bgVariant ?? null,
    textVariant: props.textVariant ?? null,
    borderVariant: props.borderVariant ?? null
  };
  return {
    [`text-bg-${props.variant}`]: props.variant !== null,
    [`text-${props.textVariant}`]: props.textVariant !== null,
    [`bg-${props.bgVariant}`]: props.bgVariant !== null,
    [`border-${props.borderVariant}`]: props.borderVariant !== null
  };
});
const _hoisted_1$9 = {
  key: 0,
  class: "visually-hidden"
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "BSpinner",
  props: {
    label: { default: void 0 },
    role: { default: "status" },
    small: { type: Boolean, default: false },
    tag: { default: "span" },
    type: { default: "border" },
    variant: { default: null }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BSpinner");
    const slots = useSlots();
    const colorClasses = useColorVariantClasses(
      computed(() => ({
        textVariant: props.variant
      }))
    );
    const computedClasses = computed(() => [
      `spinner-${props.type}`,
      colorClasses.value,
      {
        [`spinner-${props.type}-sm`]: props.small
      }
    ]);
    const hasLabelSlot = computed(() => !isEmptySlot(slots.label));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), {
        class: normalizeClass(computedClasses.value),
        role: unref(props).label || hasLabelSlot.value ? unref(props).role : null,
        "aria-hidden": unref(props).label || hasLabelSlot.value ? null : true
      }, {
        default: withCtx(() => [
          unref(props).label || hasLabelSlot.value ? (openBlock(), createElementBlock("span", _hoisted_1$9, [
            renderSlot(_ctx.$slots, "label", {}, () => [
              createTextVNode(toDisplayString(unref(props).label), 1)
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "role", "aria-hidden"]);
    };
  }
});
const pick = (objToPluck, keysToPluck) => [...keysToPluck].reduce(
  (memo, prop) => {
    memo[prop] = objToPluck[prop];
    return memo;
  },
  {}
);
const upperFirst = (str) => {
  const trim = str.trim();
  return trim.charAt(0).toUpperCase() + trim.slice(1);
};
const toPascalCase = (str) => str.replace(/-./g, (match) => match.charAt(1).toUpperCase()).replace(/\b\w/g, (match) => match.toUpperCase()).replace(/\s+/g, "");
const isLink = (props) => !!(props.href || props.to);
const useBLinkHelper = (props, pickProps) => {
  const pickPropsResolved = readonly(toRef$1(pickProps));
  const resolvedProps = readonly(toRef$1(props));
  const computedLink = computed(() => isLink(resolvedProps.value));
  const computedLinkProps = computed(
    () => computedLink.value ? pick(
      resolvedProps.value,
      pickPropsResolved.value ?? [
        "active",
        "activeClass",
        "append",
        "exactActiveClass",
        "href",
        "rel",
        "replace",
        "routerComponentName",
        "target",
        "to",
        "variant",
        "opacity",
        "opacityHover",
        "underlineVariant",
        "underlineOffset",
        "underlineOffsetHover",
        "underlineOpacity",
        "underlineOpacityHover"
      ]
    ) : {}
  );
  return { computedLink, computedLinkProps };
};
const useBLinkTagResolver = ({
  to,
  disabled,
  href,
  replace,
  routerComponentName
}) => {
  const instance = getCurrentInstance$1();
  const router = instance?.appContext?.app?.config?.globalProperties?.$router;
  const route2 = instance?.appContext?.app?.config?.globalProperties?.$route;
  const RouterLinkComponent = resolveDynamicComponent("RouterLink");
  const useLink = !!RouterLinkComponent && typeof RouterLinkComponent !== "string" && "useLink" in RouterLinkComponent ? RouterLinkComponent.useLink : null;
  const resolvedTo = computed(() => toValue$1(to) || "");
  const resolvedReplace = readonly(toRef$1(replace));
  const routerName = computed(() => toPascalCase(toValue$1(routerComponentName)));
  const tag = computed(() => {
    const hasRouter = instance?.appContext?.app?.component(routerName.value) !== void 0;
    if (!hasRouter || toValue$1(disabled) || !resolvedTo.value) {
      return "a";
    }
    return routerName.value;
  });
  const isRouterLink = computed(() => tag.value === "RouterLink");
  const isNuxtLink = computed(
    // @ts-expect-error we're doing an explicit check for Nuxt, so we can safely ignore this
    () => isRouterLink.value && typeof instance?.appContext?.app?.$nuxt !== "undefined"
  );
  const isNonStandardTag = computed(
    () => tag.value !== "a" && !isRouterLink.value && !isNuxtLink.value
  );
  const isOfRouterType = computed(() => isRouterLink.value || isNuxtLink.value);
  const linkProps = computed(() => ({
    to: resolvedTo.value,
    replace: resolvedReplace.value
  }));
  const _link = useLink?.({
    to: resolvedTo,
    replace: resolvedReplace
  });
  const link = computed(() => isOfRouterType.value ? _link : null);
  const computedHref = computed(() => {
    if (link.value?.href.value) return link.value.href.value;
    const toFallback = "#";
    const resolvedHref = toValue$1(href);
    if (resolvedHref) return resolvedHref;
    if (typeof resolvedTo.value === "string") return resolvedTo.value || toFallback;
    const stableTo = resolvedTo.value;
    if (stableTo !== void 0 && "path" in stableTo) {
      const path = stableTo.path || "";
      const query = stableTo.query ? `?${Object.keys(stableTo.query).map((e) => `${e}=${stableTo.query?.[e]}`).join("=")}` : "";
      const hash = !stableTo.hash || stableTo.hash.charAt(0) === "#" ? stableTo.hash || "" : `#${stableTo.hash}`;
      return `${path}${query}${hash}` || toFallback;
    }
    return toFallback;
  });
  return {
    isNonStandardTag,
    tag,
    isRouterLink,
    isNuxtLink,
    computedHref,
    routerName,
    router,
    route: route2,
    link,
    linkProps
  };
};
const useLinkClasses = (linkProps) => computed(() => {
  const props = toValue$1(linkProps);
  return {
    [`link-${props.variant}`]: props.variant !== null,
    [`link-opacity-${props.opacity}`]: props.opacity !== void 0,
    [`link-opacity-${props.opacityHover}-hover`]: props.opacityHover !== void 0,
    [`link-underline-${props.underlineVariant}`]: props.underlineVariant !== null,
    [`link-offset-${props.underlineOffset}`]: props.underlineOffset !== void 0,
    [`link-offset-${props.underlineOffsetHover}-hover`]: props.underlineOffsetHover !== void 0,
    ["link-underline"]: props.underlineVariant === null && (props.underlineOpacity !== void 0 || props.underlineOpacityHover !== void 0),
    [`link-underline-opacity-${props.underlineOpacity}`]: props.underlineOpacity !== void 0,
    [`link-underline-opacity-${props.underlineOpacityHover}-hover`]: props.underlineOpacityHover !== void 0,
    "icon-link": props.icon === true
  };
});
const defaultActiveClass = "active";
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "BLink",
  props: {
    active: { type: Boolean, default: void 0 },
    activeClass: { default: "router-link-active" },
    disabled: { type: Boolean, default: false },
    exactActiveClass: { default: "router-link-exact-active" },
    href: { default: void 0 },
    icon: { type: Boolean, default: false },
    noRel: { type: Boolean, default: false },
    opacity: { default: void 0 },
    opacityHover: { default: void 0 },
    prefetch: { type: Boolean, default: void 0 },
    prefetchOn: { default: void 0 },
    noPrefetch: { type: Boolean, default: void 0 },
    prefetchedClass: { default: void 0 },
    rel: { default: void 0 },
    replace: { type: Boolean, default: false },
    routerComponentName: { default: "router-link" },
    routerTag: { default: "a" },
    stretched: { type: Boolean, default: false },
    target: { default: void 0 },
    to: { default: void 0 },
    underlineOffset: { default: void 0 },
    underlineOffsetHover: { default: void 0 },
    underlineOpacity: { default: void 0 },
    underlineOpacityHover: { default: void 0 },
    underlineVariant: { default: null },
    variant: { default: null }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BLink");
    const emit = __emit;
    const attrs = useAttrs();
    const { computedHref, tag, link, isNuxtLink, isRouterLink, linkProps, isNonStandardTag } = useBLinkTagResolver({
      routerComponentName: () => props.routerComponentName,
      disabled: () => props.disabled,
      to: () => props.to,
      replace: () => props.replace,
      href: () => props.href
    });
    const collapseData = inject(collapseInjectionKey, null);
    const navbarData = inject(navbarInjectionKey, null);
    const linkValueClasses = useLinkClasses(props);
    const computedClasses = computed(() => [
      linkValueClasses.value,
      attrs.class,
      computedLinkClasses.value,
      {
        [defaultActiveClass]: props.active,
        [props.activeClass]: link.value?.isActive.value || false,
        [props.exactActiveClass]: link.value?.isExactActive.value || false,
        "stretched-link": props.stretched === true
      }
    ]);
    const computedLinkClasses = computed(() => ({
      [defaultActiveClass]: props.active,
      disabled: props.disabled
    }));
    const clicked = (e) => {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (collapseData?.isNav?.value === true && navbarData === null || navbarData !== null && navbarData.noAutoClose?.value !== true) {
        collapseData?.hide?.();
      }
      emit("click", e);
    };
    const computedRel = computed(
      () => props.target === "_blank" ? !props.rel && props.noRel ? "noopener" : props.rel : void 0
    );
    const computedTabIndex = computed(
      () => props.disabled ? "-1" : typeof attrs.tabindex === "undefined" ? null : attrs.tabindex
    );
    const nuxtSpecificProps = computed(() => ({
      prefetch: props.prefetch,
      noPrefetch: props.noPrefetch,
      prefetchOn: props.prefetchOn,
      prefetchedClass: props.prefetchedClass,
      ...linkProps.value
    }));
    const computedSpecificProps = computed(() => ({
      ...isRouterLink.value ? linkProps.value : void 0,
      // In addition to being Nuxt specific, we add these values if it's some non-standard tag. We don't know what it is,
      // So we just add it anyways. It will be made as an attr if it's unused so it's fine
      ...isNuxtLink.value || isNonStandardTag.value ? nuxtSpecificProps.value : void 0
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(tag)), mergeProps({
        class: computedClasses.value,
        target: unref(props).target,
        href: unref(computedHref),
        rel: computedRel.value,
        tabindex: computedTabIndex.value,
        "aria-disabled": unref(props).disabled ? true : null
      }, computedSpecificProps.value, {
        onClick: _cache[0] || (_cache[0] = (e) => {
          clicked(e);
          unref(link)?.navigate(e);
        })
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["class", "target", "href", "rel", "tabindex", "aria-disabled"]);
    };
  }
});
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "BButton",
  props: /* @__PURE__ */ mergeModels({
    loading: { type: Boolean, default: false },
    loadingFill: { type: Boolean, default: false },
    loadingText: { default: "Loading..." },
    pill: { type: Boolean, default: false },
    size: { default: "md" },
    squared: { type: Boolean, default: false },
    tag: { default: "button" },
    type: { default: "button" },
    variant: { default: "secondary" },
    active: { type: Boolean, default: false },
    activeClass: { default: void 0 },
    disabled: { type: Boolean, default: void 0 },
    exactActiveClass: { default: void 0 },
    href: { default: void 0 },
    icon: { type: Boolean, default: false },
    noRel: { type: Boolean },
    opacity: { default: void 0 },
    opacityHover: { default: void 0 },
    prefetch: { type: Boolean },
    prefetchOn: {},
    noPrefetch: { type: Boolean },
    prefetchedClass: {},
    rel: { default: void 0 },
    replace: { type: Boolean, default: void 0 },
    routerComponentName: { default: void 0 },
    routerTag: { default: void 0 },
    stretched: { type: Boolean, default: false },
    target: { default: void 0 },
    to: { default: void 0 },
    underlineOffset: { default: void 0 },
    underlineOffsetHover: { default: void 0 },
    underlineOpacity: { default: void 0 },
    underlineOpacityHover: { default: void 0 },
    underlineVariant: { default: null }
  }, {
    "pressed": { type: Boolean, ...{ default: void 0 } },
    "pressedModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["click"], ["update:pressed"]),
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BButton");
    const emit = __emit;
    const element = useTemplateRef("_element");
    const pressedValue = useModel(__props, "pressed");
    const { computedLink, computedLinkProps } = useBLinkHelper(props, [
      "active-class",
      "exact-active-class",
      "replace",
      "routerComponentName",
      "routerTag"
    ]);
    const isToggle = computed(() => typeof pressedValue.value === "boolean");
    const isButton = computed(
      () => props.tag === "button" && props.href === void 0 && props.to === void 0
    );
    const isBLink = computed(() => props.to !== void 0);
    const nonStandardTag = computed(() => props.href !== void 0 ? false : !isButton.value);
    const linkProps = computed(() => isBLink.value ? computedLinkProps.value : []);
    const computedAriaDisabled = computed(() => {
      if (props.href === "#" && props.disabled) return true;
      return nonStandardTag.value ? props.disabled : null;
    });
    const variantIsLinkType = computed(() => props.variant?.startsWith("link") || false);
    const variantIsLinkTypeSubset = computed(() => props.variant?.startsWith("link-") || false);
    const linkValueClasses = useLinkClasses(
      computed(() => ({
        ...variantIsLinkType.value ? {
          icon: props.icon,
          opacity: props.opacity,
          opacityHover: props.opacityHover,
          underlineOffset: props.underlineOffset,
          underlineOffsetHover: props.underlineOffsetHover,
          underlineOpacity: props.underlineOpacity,
          underlineOpacityHover: props.underlineOpacityHover,
          underlineVariant: props.underlineVariant,
          variant: variantIsLinkTypeSubset.value === true ? props.variant?.slice(5) : null
        } : void 0
      }))
    );
    const computedClasses = computed(() => [
      variantIsLinkType.value === true && computedLink.value === false ? linkValueClasses.value : void 0,
      [`btn-${props.size}`],
      {
        [`btn-${props.variant}`]: props.variant !== null && variantIsLinkTypeSubset.value === false,
        "active": props.active || pressedValue.value,
        "rounded-pill": props.pill,
        "rounded-0": props.squared,
        "disabled": props.disabled
      }
    ]);
    const computedTag = computed(() => isBLink.value ? _sfc_main$c : props.href ? "a" : props.tag);
    const clicked = (e) => {
      if (props.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      emit("click", e);
      if (isToggle.value) pressedValue.value = !pressedValue.value;
    };
    onKeyStroke(
      [" ", "enter"],
      (e) => {
        if (props.href === "#") {
          e.preventDefault();
          element.value?.click();
        }
      },
      { target: element }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(computedTag.value), mergeProps({
        ref: "_element",
        class: "btn"
      }, linkProps.value, {
        class: computedClasses.value,
        "aria-disabled": computedAriaDisabled.value,
        "aria-pressed": isToggle.value ? pressedValue.value : null,
        autocomplete: isToggle.value ? "off" : null,
        disabled: isButton.value ? unref(props).disabled : null,
        href: unref(props).href,
        rel: unref(computedLink) ? unref(props).rel : null,
        role: nonStandardTag.value || unref(computedLink) ? "button" : null,
        target: unref(computedLink) ? unref(props).target : null,
        type: isButton.value ? unref(props).type : null,
        to: !isButton.value ? unref(props).to : null,
        onClick: clicked
      }), {
        default: withCtx(() => [
          unref(props).loading ? renderSlot(_ctx.$slots, "loading", { key: 0 }, () => [
            !unref(props).loadingFill ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(unref(props).loadingText), 1)
            ], 64)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "loading-spinner", {}, () => [
              createVNode(_sfc_main$d, {
                small: unref(props).size !== "lg",
                label: unref(props).loadingFill ? unref(props).loadingText : void 0
              }, null, 8, ["small", "label"])
            ])
          ]) : renderSlot(_ctx.$slots, "default", { key: 1 })
        ]),
        _: 3
      }, 16, ["class", "aria-disabled", "aria-pressed", "autocomplete", "disabled", "href", "rel", "role", "target", "type", "to"]);
    };
  }
});
const _hoisted_1$8 = ["type", "disabled", "aria-label"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "BCloseButton",
  props: {
    ariaLabel: { default: "Close" },
    disabled: { type: Boolean, default: false },
    type: { default: "button" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BCloseButton");
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        type: unref(props).type,
        class: "btn-close",
        disabled: unref(props).disabled,
        "aria-label": unref(props).ariaLabel,
        onClick: _cache[0] || (_cache[0] = ($event) => emit("click", $event))
      }, null, 8, _hoisted_1$8);
    };
  }
});
const useId = (id, suffix) => {
  const genId = useId$1();
  return computed(() => toValue$1(id) || withBvnPrefix(genId || "", suffix));
};
class BvEvent {
  cancelable = true;
  componentId = null;
  _defaultPrevented = false;
  eventType = "";
  nativeEvent = null;
  _preventDefault;
  relatedTarget = null;
  target = null;
  // Readable by everyone,
  // But only overwritten by inherrited constructors
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  set defaultPrevented(prop) {
    this._defaultPrevented = prop;
  }
  // I think this is right
  // We want to be able to have it callable to everyone,
  // But only overwritten by inherrited constructors
  get preventDefault() {
    return this._preventDefault;
  }
  // This may not be correct, because it doesn't get correct type inferences in children
  // Ex overwrite this.preventDefault = () => true is valid. Could be a TS issue
  set preventDefault(setter) {
    this._preventDefault = setter;
  }
  constructor(eventType, eventInit = {}) {
    if (!eventType) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}'. 1 argument required, ${arguments.length} given.`
      );
    }
    Object.assign(this, BvEvent.Defaults, eventInit, { eventType });
    this._preventDefault = function _preventDefault() {
      if (this.cancelable) {
        this.defaultPrevented = true;
      }
    };
  }
  static get Defaults() {
    return {
      cancelable: true,
      componentId: null,
      eventType: "",
      nativeEvent: null,
      relatedTarget: null,
      target: null
    };
  }
}
class BvTriggerableEvent extends BvEvent {
  trigger = null;
  ok = void 0;
  constructor(eventType, eventInit = {}) {
    super(eventType, eventInit);
    Object.assign(this, BvEvent.Defaults, eventInit, { eventType });
  }
  static get Defaults() {
    return {
      ...super.Defaults,
      trigger: null,
      ok: void 0
    };
  }
}
const fadeBaseTransitionProps = {
  name: "fade",
  enterActiveClass: "",
  enterFromClass: "showing",
  enterToClass: "",
  leaveActiveClass: "",
  leaveFromClass: "",
  leaveToClass: "showing",
  css: true
};
const useShowHide = (modelValue, props, emit, element, computedId, options = {
  transitionProps: {},
  showFn: () => {
  },
  hideFn: () => {
  }
}) => {
  let noAction = false;
  const initialShow = !!modelValue.value && !props.initialAnimation || props.visible || false;
  const showRef = ref(initialShow);
  const renderRef = ref(initialShow);
  const renderBackdropRef = ref(initialShow);
  let isCountdown = typeof modelValue.value !== "boolean";
  watch(modelValue, () => {
    isCountdown = typeof modelValue.value !== "boolean";
    if (noAction) {
      noAction = false;
      return;
    }
    if (modelValue.value) {
      show();
    } else {
      hide2("modelValue", true);
    }
  });
  const localNoAnimation = ref(initialShow);
  const localTemporaryHide = ref(false);
  const computedNoAnimation = computed(
    () => props.noAnimation || props.noFade || localNoAnimation.value || false
  );
  let isMounted = false;
  onMounted(() => {
    isMounted = true;
    if (!props.show && initialShow) {
      const event = buildTriggerableEvent("show", { cancelable: true });
      emit("show", event);
      if (event.defaultPrevented) {
        emit("show-prevented", buildTriggerableEvent("show-prevented"));
        return;
      }
      localNoAnimation.value = true;
      if (!modelValue.value) {
        noAction = true;
        modelValue.value = true;
      }
      renderRef.value = true;
      renderBackdropRef.value = true;
      isVisible2.value = true;
      backdropVisible.value = true;
      backdropReady.value = true;
      showRef.value = true;
      options.showFn?.();
    } else if (props.show || !!modelValue.value && props.initialAnimation) {
      show();
    }
  });
  watch(
    () => props.visible,
    (newval) => {
      localNoAnimation.value = true;
      nextTick(() => {
        if (newval) isVisible2.value = true;
        if (newval) {
          show();
        } else {
          hide2("visible-prop", true);
        }
      });
    }
  );
  watch(
    () => props.show,
    (newval) => {
      if (newval) {
        show();
      } else {
        hide2("show-prop", true);
      }
    }
  );
  useEventListener(element, "bv-toggle", () => {
    modelValue.value = !modelValue.value;
  });
  const buildTriggerableEvent = (type, opts = {}) => new BvTriggerableEvent(type, {
    cancelable: false,
    target: element?.value || null,
    relatedTarget: null,
    trigger: null,
    ...opts,
    componentId: computedId?.value
  });
  let showTimeout;
  let hideTimeout;
  let _Resolve;
  let _Promise;
  let _resolveOnHide;
  const show = (resolveOnHide = false) => {
    if (showRef.value && !hideTimeout && !_Promise) return Promise.resolve(true);
    _resolveOnHide = resolveOnHide;
    if (showRef.value && !hideTimeout && _Promise) return _Promise;
    _Promise = new Promise((resolve) => {
      _Resolve = resolve;
    });
    const event = buildTriggerableEvent("show", { cancelable: true });
    emit("show", event);
    if (event.defaultPrevented) {
      emit("show-prevented", buildTriggerableEvent("show-prevented"));
      if (isVisible2.value) {
        isVisible2.value = false;
      }
      if (modelValue.value && !isCountdown) {
        noAction = true;
        nextTick(() => {
          modelValue.value = false;
        });
      }
      _Resolve?.("show-prevented");
      return _Promise;
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = void 0;
    }
    renderRef.value = true;
    renderBackdropRef.value = true;
    requestAnimationFrame(() => {
      if (localNoAnimation.value || props.delay === void 0) {
        if (!isMounted) return;
        showTimeout = void 0;
        showRef.value = true;
        options.showFn?.();
        if (!modelValue.value) {
          noAction = true;
          nextTick(() => {
            modelValue.value = true;
          });
        }
        return;
      }
      showTimeout = setTimeout(
        () => {
          if (!isMounted) return;
          showTimeout = void 0;
          showRef.value = true;
          options.showFn?.();
          if (!modelValue.value) {
            noAction = true;
            nextTick(() => {
              modelValue.value = true;
            });
          }
        },
        typeof props.delay === "number" ? props.delay : props.delay?.show || 0
      );
    });
    return _Promise;
  };
  let leaveTrigger;
  const hide2 = (trigger, noTriggerEmit) => {
    if (!showRef.value && !showTimeout) return Promise.resolve("");
    if (!_Promise)
      _Promise = new Promise((resolve) => {
        _Resolve = resolve;
      });
    if (typeof trigger !== "string") trigger = void 0;
    leaveTrigger = trigger;
    const event = buildTriggerableEvent("hide", { cancelable: true, trigger });
    const event2 = buildTriggerableEvent(trigger || "ignore", { cancelable: true, trigger });
    if (trigger === "backdrop" && props.noCloseOnBackdrop || trigger === "esc" && props.noCloseOnEsc) {
      emit("hide-prevented", buildTriggerableEvent("hide-prevented", { trigger }));
      _Resolve?.("hide-prevented");
      return _Promise;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = void 0;
    }
    if (trigger && !noTriggerEmit) {
      emit(trigger, event2);
    }
    emit("hide", event);
    if (event.defaultPrevented || event2.defaultPrevented) {
      emit("hide-prevented", buildTriggerableEvent("hide-prevented", { trigger }));
      if (!modelValue.value) {
        nextTick(() => {
          noAction = true;
          modelValue.value = true;
        });
      }
      _Resolve?.("hide-prevented");
      return _Promise;
    }
    trapActive.value = false;
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = void 0;
      if (!localTemporaryHide.value) renderRef.value = false;
      renderBackdropRef.value = false;
    }
    hideTimeout = setTimeout(
      () => {
        if (!isMounted) return;
        hideTimeout = void 0;
        isLeaving.value = true;
        showRef.value = false;
        options.hideFn?.();
        if (modelValue.value) {
          noAction = true;
          modelValue.value = isCountdown ? 0 : false;
        }
      },
      localNoAnimation.value ? 0 : typeof props.delay === "number" ? props.delay : props.delay?.hide || 0
    );
    return _Promise;
  };
  const throttleHide = /* @__PURE__ */ useThrottleFn((a) => hide2(a), 500);
  const throttleShow = /* @__PURE__ */ useThrottleFn(() => show(), 500);
  const toggle = (resolveOnHide = false) => {
    const e = buildTriggerableEvent("toggle", { cancelable: true });
    emit("toggle", e);
    if (e.defaultPrevented) {
      emit("toggle-prevented", buildTriggerableEvent("toggle-prevented"));
      return Promise.resolve("toggle-prevented");
    }
    if (showRef.value) {
      return hide2("toggle-function", true);
    }
    return show(resolveOnHide);
  };
  const triggerToggle = () => {
    const e = buildTriggerableEvent("toggle", { cancelable: true });
    emit("toggle", e);
    if (e.defaultPrevented) {
      emit("toggle-prevented", buildTriggerableEvent("toggle-prevented"));
      return;
    }
    if (showRef.value) {
      hide2("toggle-trigger", true);
    } else {
      show();
    }
  };
  const triggerRegistry = [];
  const registerTrigger = (trigger, el) => {
    triggerRegistry.push({ trigger, el });
    el.addEventListener(trigger, triggerToggle);
    checkVisibility(el);
  };
  const unregisterTrigger = (trigger, el, clean = true) => {
    const idx = triggerRegistry.findIndex((t) => t?.trigger === trigger && t.el === el);
    if (idx > -1) {
      triggerRegistry.splice(idx, 1);
      el.removeEventListener(trigger, triggerToggle);
      if (clean) {
        el.removeAttribute("aria-expanded");
        el.classList.remove("collapsed");
        el.classList.remove("not-collapsed");
      }
    }
  };
  const appRegistry = inject(showHideRegistryKey, void 0)?.register({
    id: computedId.value,
    toggle,
    show,
    hide: hide2,
    value: readonly(showRef),
    registerTrigger,
    unregisterTrigger,
    component: getCurrentInstance$1()
  });
  const checkVisibility = (el) => {
    el.setAttribute("aria-expanded", modelValue.value ? "true" : "false");
    el.classList.toggle("collapsed", !modelValue.value);
    el.classList.toggle("not-collapsed", !!modelValue.value);
  };
  watch(modelValue, () => {
    triggerRegistry.forEach((t) => {
      checkVisibility(t.el);
    });
  });
  watch(computedId, (newId, oldId) => {
    appRegistry?.updateId(newId, oldId);
  });
  onBeforeUnmount(() => {
    appRegistry?.unregister();
    triggerRegistry.forEach((t) => {
      t.el.removeEventListener(t.trigger, triggerToggle);
    });
  });
  onUnmounted(() => {
    isMounted = false;
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    showTimeout = void 0;
    hideTimeout = void 0;
  });
  const lazyLoadCompleted = ref(false);
  const markLazyLoadCompleted = () => {
    if (props.lazy === true) lazyLoadCompleted.value = true;
  };
  const isLeaving = ref(false);
  const isActive = ref(initialShow);
  const isVisible2 = ref(initialShow);
  const onBeforeEnter = (el) => {
    options.transitionProps?.onBeforeEnter?.(el);
    props.transitionProps?.onBeforeEnter?.(el);
    isActive.value = true;
  };
  const onEnter = (el) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isVisible2.value = true;
      });
    });
    options.transitionProps?.onEnter?.(el);
    props.transitionProps?.onEnter?.(el);
  };
  const onAfterEnter = (el) => {
    markLazyLoadCompleted();
    options.transitionProps?.onAfterEnter?.(el);
    props.transitionProps?.onAfterEnter?.(el);
    if (localNoAnimation.value) {
      requestAnimationFrame(() => {
        localNoAnimation.value = false;
      });
    }
    if (localTemporaryHide.value) {
      localTemporaryHide.value = false;
    }
    requestAnimationFrame(() => {
      trapActive.value = true;
      nextTick(() => {
        emit("shown", buildTriggerableEvent("shown", { cancelable: false }));
      });
    });
    if (!_resolveOnHide) {
      _Resolve?.(true);
      _Promise = void 0;
      _Resolve = void 0;
    }
  };
  const onBeforeLeave = (el) => {
    if (!isLeaving.value) isLeaving.value = true;
    options.transitionProps?.onBeforeLeave?.(el);
    props.transitionProps?.onBeforeLeave?.(el);
    trapActive.value = false;
  };
  const onLeave = (el) => {
    isVisible2.value = false;
    options.transitionProps?.onLeave?.(el);
    props.transitionProps?.onLeave?.(el);
  };
  const onAfterLeave = (el) => {
    emit("hidden", buildTriggerableEvent("hidden", { trigger: leaveTrigger, cancelable: false }));
    options.transitionProps?.onAfterLeave?.(el);
    props.transitionProps?.onAfterLeave?.(el);
    isLeaving.value = false;
    isActive.value = false;
    if (localNoAnimation.value) {
      requestAnimationFrame(() => {
        localNoAnimation.value = false;
      });
    }
    requestAnimationFrame(() => {
      if (!localTemporaryHide.value) renderRef.value = false;
    });
    _Resolve?.(leaveTrigger || "");
    _Promise = void 0;
    _Resolve = void 0;
    leaveTrigger = void 0;
  };
  const contentShowing = computed(
    () => localTemporaryHide.value === true || isActive.value === true || props.lazy === false || props.lazy === true && lazyLoadCompleted.value === true && props.unmountLazy === false
  );
  const trapActive = ref(false);
  const backdropVisible = ref(false);
  const backdropReady = ref(false);
  const transitionFunctions = {
    ...options.transitionProps,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave
  };
  return {
    showRef,
    renderRef,
    renderBackdropRef,
    isVisible: isVisible2,
    isActive,
    trapActive,
    show,
    hide: hide2,
    toggle,
    throttleHide,
    throttleShow,
    buildTriggerableEvent,
    computedNoAnimation,
    localNoAnimation,
    localTemporaryHide,
    isLeaving,
    transitionProps: {
      ...fadeBaseTransitionProps,
      ...props.transitionProps,
      ...transitionFunctions
    },
    lazyLoadCompleted,
    markLazyLoadCompleted,
    contentShowing,
    backdropReady,
    backdropVisible,
    backdropTransitionProps: {
      ...fadeBaseTransitionProps,
      onBeforeEnter: () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            backdropVisible.value = true;
          });
        });
        backdropReady.value = false;
      },
      onAfterEnter: () => {
        backdropReady.value = true;
      },
      onBeforeLeave: () => {
        backdropVisible.value = false;
      },
      onAfterLeave: () => {
        backdropReady.value = false;
        requestAnimationFrame(() => {
          renderBackdropRef.value = false;
        });
      }
    }
  };
};
const getElement = (element, root = typeof document !== "undefined" ? document : void 0) => {
  if (!element) return void 0;
  if (typeof element === "string") {
    if (typeof root === "undefined" || typeof document === "undefined") return void 0;
    const idElement = document.getElementById(element);
    return idElement ?? root.querySelector(element) ?? void 0;
  }
  return element.$el ?? element;
};
Object.freeze(
  Object.keys({
    bordered: 0,
    borderless: 0,
    borderVariant: 0,
    captionTop: 0,
    dark: 0,
    fixed: 0,
    hover: 0,
    id: 0,
    noBorderCollapse: 0,
    outlined: 0,
    responsive: 0,
    small: 0,
    stacked: 0,
    stickyHeader: 0,
    striped: 0,
    stripedColumns: 0,
    variant: 0,
    tableAttrs: 0,
    tableClass: 0
  })
);
Object.freeze(
  Object.keys({
    align: 0,
    caption: 0,
    detailsTdClass: 0,
    fieldColumnClass: 0,
    fields: 0,
    footClone: 0,
    footRowVariant: 0,
    footVariant: 0,
    headRowVariant: 0,
    headVariant: 0,
    items: 0,
    labelStacked: 0,
    modelValue: 0,
    primaryKey: 0,
    tbodyClass: 0,
    tbodyTrAttrs: 0,
    tbodyTrClass: 0,
    tfootClass: 0,
    tfootTrClass: 0,
    theadClass: 0,
    theadTrClass: 0
  })
);
const modalOpenClassName = "modal-open";
const useSharedModalStack = () => {
  const modalManagerPlugin = inject(modalManagerKey);
  const dispose = (modal) => {
    modalManagerPlugin?.removeStack(modal);
    modalManagerPlugin?.removeRegistry(modal);
  };
  const updateHTMLAttrs = getSSRHandler("updateHTMLAttrs", (selector, attribute, value) => {
    const el = typeof selector === "string" ? window?.document.querySelector(selector) : unrefElement(selector);
    if (!el) return;
    if (attribute === "class") {
      el.classList.toggle(modalOpenClassName, value === modalOpenClassName);
    } else {
      el.setAttribute(attribute, value);
    }
  });
  tryOnScopeDispose(() => {
    if (modalManagerPlugin?.countStack.value === 0) {
      updateHTMLAttrs("body", "class", "");
    }
  });
  watch(
    () => modalManagerPlugin?.countStack.value,
    (newValue) => {
      if (newValue === void 0) return;
      updateHTMLAttrs("body", "class", newValue > 0 ? modalOpenClassName : "");
    }
  );
  return {
    ...modalManagerPlugin,
    dispose
  };
};
const useModalManager = (modalOpen, initialValue) => {
  const { pushRegistry, pushStack, removeStack, stack, dispose, countStack } = useSharedModalStack();
  const currentModal = getCurrentInstance$1();
  if (!currentModal || currentModal.type.__name !== "BModal") {
    throw new Error("useModalManager must only use in BModal component");
  }
  pushRegistry?.(currentModal);
  tryOnScopeDispose(() => {
    dispose(currentModal);
  });
  const setInStack = (newValue, oldValue) => {
    if (newValue) {
      pushStack?.(currentModal);
    } else if (oldValue && !newValue) {
      removeStack?.(currentModal);
    }
  };
  setInStack(initialValue, initialValue);
  watch(modalOpen, setInStack);
  return {
    activePosition: computed(
      () => stack?.value.findIndex((el) => toValue$1(el.exposed?.id) === toValue$1(currentModal.exposed?.id))
    ),
    activeModalCount: countStack,
    stackWithoutSelf: computed(
      () => stack?.value.filter(
        (el) => toValue$1(el.exposed?.id) !== toValue$1(currentModal.exposed?.id)
      ) ?? []
    )
  };
};
const _hoisted_1$7 = ["id", "aria-labelledby", "aria-describedby"];
const _hoisted_2$5 = ["id"];
const fallbackClassSelector = "modal-fallback-focus";
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BModal",
  props: /* @__PURE__ */ mergeModels({
    focus: { type: [String, Boolean, Object, null], default: void 0 },
    backdropFirst: { type: Boolean, default: false },
    body: { default: void 0 },
    bodyAttrs: { default: void 0 },
    bodyBgVariant: { default: null },
    bodyClass: { default: null },
    bodyScrolling: { type: Boolean, default: false },
    bodyTextVariant: { default: null },
    bodyVariant: { default: null },
    busy: { type: Boolean, default: false },
    buttonSize: { default: "md" },
    cancelClass: { default: void 0 },
    cancelDisabled: { type: Boolean, default: false },
    cancelTitle: { default: "Cancel" },
    cancelVariant: { default: "secondary" },
    centered: { type: Boolean, default: false },
    contentClass: { default: void 0 },
    dialogClass: { default: void 0 },
    footerBgVariant: { default: null },
    footerBorderVariant: { default: null },
    footerClass: { default: void 0 },
    footerTextVariant: { default: null },
    footerVariant: { default: null },
    fullscreen: { type: [Boolean, String], default: false },
    headerAttrs: { default: void 0 },
    headerBgVariant: { default: null },
    headerBorderVariant: { default: null },
    headerClass: { default: void 0 },
    headerCloseClass: { default: void 0 },
    headerCloseLabel: { default: "Close" },
    headerCloseVariant: { default: "secondary" },
    headerTextVariant: { default: null },
    headerVariant: { default: null },
    noBackdrop: { type: Boolean, default: false },
    noFooter: { type: Boolean, default: false },
    noHeader: { type: Boolean, default: false },
    noHeaderClose: { type: Boolean, default: false },
    id: { default: void 0 },
    modalClass: { default: void 0 },
    noCloseOnBackdrop: { type: Boolean, default: false },
    noCloseOnEsc: { type: Boolean, default: false },
    noTrap: { type: Boolean, default: false },
    noStacking: { type: Boolean },
    okClass: { default: void 0 },
    okDisabled: { type: Boolean, default: false },
    okOnly: { type: Boolean, default: false },
    okTitle: { default: "OK" },
    okVariant: { default: "primary" },
    scrollable: { type: Boolean, default: false },
    size: { default: "md" },
    title: { default: void 0 },
    titleClass: { default: void 0 },
    titleVisuallyHidden: { type: Boolean, default: false },
    titleTag: { default: "h5" },
    teleportDisabled: { type: Boolean, default: false },
    teleportTo: { default: "body" },
    initialAnimation: { type: Boolean, default: false },
    noAnimation: { type: Boolean },
    noFade: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
    unmountLazy: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    transProps: { default: void 0 },
    visible: { type: Boolean, default: false }
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["backdrop", "close", "esc", "hide", "hide-prevented", "hidden", "show", "show-prevented", "shown", "toggle", "toggle-prevented", "cancel", "ok"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BModal");
    const emit = __emit;
    const slots = useSlots();
    const computedId = useId(() => props.id, "modal");
    const modelValue = useModel(__props, "modelValue");
    const element = useTemplateRef("_element");
    const fallbackFocusElement = useTemplateRef("_fallbackFocusElement");
    const okButton = useTemplateRef("_okButton");
    const cancelButton = useTemplateRef("_cancelButton");
    const closeButton = useTemplateRef("_closeButton");
    const pickFocusItem = () => {
      if (props.focus && typeof props.focus !== "boolean") {
        if (props.focus === "ok") {
          return okButton;
        } else if (props.focus === "close") {
          return closeButton;
        } else if (props.focus === "cancel") {
          return cancelButton;
        }
        return getElement(props.focus, element.value ?? void 0) ?? element.value;
      }
      return element;
    };
    let activeElement = null;
    const onAfterEnter = () => {
      if (props.noTrap && props.focus !== false) {
        activeElement = document.activeElement;
        if (activeElement === element.value) {
          activeElement = null;
        }
        const el = unrefElement(pickFocusItem());
        if (!el) return;
        el?.focus();
        if (el.tagName && el.tagName.toLowerCase() === "input" && typeof el.select === "function") {
          el.select();
        }
      }
    };
    const onAfterLeave = () => {
      if (props.noTrap && props.focus !== false && activeElement) {
        activeElement?.focus();
        activeElement = null;
      }
    };
    const {
      showRef,
      renderRef,
      renderBackdropRef,
      hide: hide2,
      show,
      toggle,
      computedNoAnimation,
      transitionProps,
      backdropTransitionProps,
      isLeaving,
      isVisible: isVisible2,
      trapActive,
      contentShowing,
      backdropReady,
      backdropVisible
    } = useShowHide(modelValue, props, emit, element, computedId, {
      // addShowClass: false,
      transitionProps: {
        onAfterEnter,
        onAfterLeave
      }
    });
    const { needsFallback } = useActivatedFocusTrap({
      element,
      isActive: trapActive,
      noTrap: () => props.noTrap,
      fallbackFocus: {
        ref: fallbackFocusElement,
        classSelector: fallbackClassSelector
      },
      focus: () => props.focus === false ? false : unrefElement(pickFocusItem()) ?? void 0
      // () => (typeof focus === 'boolean' ? focus : (unrefElement(focus) ?? undefined)),
    });
    onKeyStroke(
      "Escape",
      () => {
        hide2("esc");
      },
      { target: element }
    );
    useSafeScrollLock(showRef, () => props.bodyScrolling);
    const hasHeaderCloseSlot = computed(() => !isEmptySlot(slots["header-close"]));
    const modalDialogClasses = computed(() => [
      props.dialogClass,
      {
        "modal-fullscreen": props.fullscreen === true,
        [`modal-fullscreen-${props.fullscreen}-down`]: typeof props.fullscreen === "string",
        [`modal-${props.size}`]: props.size !== "md",
        "modal-dialog-centered": props.centered,
        "modal-dialog-scrollable": props.scrollable
      }
    ]);
    const bodyColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.bodyBgVariant,
      textVariant: props.bodyTextVariant,
      variant: props.bodyVariant
    }));
    const bodyClasses = computed(() => [props.bodyClass, bodyColorClasses.value]);
    const headerColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.headerBgVariant,
      textVariant: props.headerTextVariant,
      variant: props.headerVariant,
      borderVariant: props.headerBorderVariant
    }));
    const headerClasses = computed(() => [props.headerClass, headerColorClasses.value]);
    const headerCloseAttrs = computed(() => ({
      variant: hasHeaderCloseSlot.value ? props.headerCloseVariant : void 0,
      class: props.headerCloseClass
    }));
    const footerColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.footerBgVariant,
      textVariant: props.footerTextVariant,
      variant: props.footerVariant,
      borderVariant: props.footerBorderVariant
    }));
    const footerClasses = computed(() => [props.footerClass, footerColorClasses.value]);
    const titleClasses = computed(() => [
      props.titleClass,
      {
        ["visually-hidden"]: props.titleVisuallyHidden
      }
    ]);
    const disableCancel = computed(() => props.cancelDisabled || props.busy);
    const disableOk = computed(() => props.okDisabled || props.busy);
    const { activePosition, activeModalCount, stackWithoutSelf } = useModalManager(
      showRef,
      modelValue.value
    );
    const sharedClasses = computed(() => ({
      [`stack-position-${activePosition?.value ?? 0}`]: true,
      [`stack-inverse-position-${(activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0)}`]: true
    }));
    watch(stackWithoutSelf, (newValue, oldValue) => {
      if (newValue.length > oldValue.length && showRef.value === true && props.noStacking === true)
        hide2();
    });
    const defaultModalDialogZIndex = ref(
      getModalZIndex(element.value ?? (typeof document !== "undefined" ? document.body : void 0))
    );
    onMounted(() => {
      watch(
        renderRef,
        (v) => {
          if (!v) return;
          nextTick(() => {
            if (!element.value) return;
            defaultModalDialogZIndex.value = getModalZIndex(element.value);
          });
        },
        { immediate: true }
      );
    });
    const computedZIndexNumber = computed(
      () => (
        // Make sure that newly opened modals have a higher z-index than currently active ones.
        // All active modals have a z-index of ('defaultZIndex' - 'stackSize' - 'positionInStack').
        //
        // This means inactive modals will already be higher than active ones when opened.
        showRef.value || isLeaving.value ? (
          // Just for reference there is a single frame in which the modal is not active but still has a higher z-index than the active ones due to _when_ it calculates its position. It's a small visual effect
          defaultModalDialogZIndex.value - ((activeModalCount?.value ?? 0) * 2 - (activePosition?.value ?? 0) * 2)
        ) : defaultModalDialogZIndex.value
      )
    );
    const computedZIndex = computed(() => ({
      "z-index": computedZIndexNumber.value,
      "--b-position": activePosition?.value ?? 0,
      "--b-inverse-position": (activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0),
      "--b-count": activeModalCount?.value ?? 0
    }));
    const computedZIndexBackdrop = computed(() => ({
      "z-index": computedZIndexNumber.value - 1,
      "--b-position": activePosition?.value ?? 0,
      "--b-inverse-position": (activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0),
      "--b-count": activeModalCount?.value ?? 0
    }));
    const sharedSlots = computed(() => ({
      id: computedId.value,
      cancel: () => {
        hide2("cancel");
      },
      close: () => {
        hide2("close");
      },
      hide: hide2,
      show,
      toggle,
      ok: () => {
        hide2("ok");
      },
      active: showRef.value,
      visible: showRef.value
    }));
    __expose({
      hide: hide2,
      id: computedId,
      show,
      toggle,
      visible: showRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$f, {
        to: unref(props).teleportTo,
        disabled: unref(props).teleportDisabled
      }, {
        default: withCtx(() => [
          unref(renderRef) || unref(contentShowing) ? (openBlock(), createBlock(Transition, mergeProps({ key: 0 }, unref(transitionProps), {
            appear: modelValue.value || unref(props).visible
          }), {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", mergeProps({
                id: unref(computedId),
                ref: "_element",
                class: ["modal", [
                  unref(props).modalClass,
                  {
                    fade: !unref(computedNoAnimation),
                    show: unref(isVisible2),
                    ...sharedClasses.value
                  }
                ]],
                role: "dialog",
                "aria-labelledby": !unref(props).noHeader ? `${unref(computedId)}-label` : void 0,
                "aria-describedby": `${unref(computedId)}-body`,
                tabindex: "-1"
              }, _ctx.$attrs, {
                style: [computedZIndex.value, { "display": "block" }],
                onMousedown: _cache[4] || (_cache[4] = withModifiers(($event) => unref(hide2)("backdrop"), ["left", "self"]))
              }), [
                createElementVNode("div", {
                  class: normalizeClass(["modal-dialog", modalDialogClasses.value])
                }, [
                  unref(contentShowing) ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass(["modal-content", unref(props).contentClass])
                  }, [
                    !unref(props).noHeader ? (openBlock(), createElementBlock("div", mergeProps({
                      key: 0,
                      class: ["modal-header", headerClasses.value]
                    }, unref(props).headerAttrs), [
                      renderSlot(_ctx.$slots, "header", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        (openBlock(), createBlock(resolveDynamicComponent(unref(props).titleTag), {
                          id: `${unref(computedId)}-label`,
                          class: normalizeClass(["modal-title", titleClasses.value])
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "title", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                              createTextVNode(toDisplayString(unref(props).title), 1)
                            ])
                          ]),
                          _: 3
                        }, 8, ["id", "class"])),
                        !unref(props).noHeaderClose ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                          hasHeaderCloseSlot.value ? (openBlock(), createBlock(_sfc_main$b, mergeProps({
                            key: 0,
                            ref: "_closeButton"
                          }, headerCloseAttrs.value, {
                            onClick: _cache[0] || (_cache[0] = ($event) => unref(hide2)("close"))
                          }), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "header-close", normalizeProps(guardReactiveProps(sharedSlots.value)))
                            ]),
                            _: 3
                          }, 16)) : (openBlock(), createBlock(_sfc_main$a, mergeProps({
                            key: 1,
                            ref: "_closeButton",
                            "aria-label": unref(props).headerCloseLabel
                          }, headerCloseAttrs.value, {
                            onClick: _cache[1] || (_cache[1] = ($event) => unref(hide2)("close"))
                          }), null, 16, ["aria-label"]))
                        ], 64)) : createCommentVNode("", true)
                      ])
                    ], 16)) : createCommentVNode("", true),
                    createElementVNode("div", mergeProps({
                      id: `${unref(computedId)}-body`,
                      class: ["modal-body", bodyClasses.value]
                    }, unref(props).bodyAttrs), [
                      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        createTextVNode(toDisplayString(unref(props).body), 1)
                      ])
                    ], 16, _hoisted_2$5),
                    !unref(props).noFooter ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: normalizeClass(["modal-footer", footerClasses.value])
                    }, [
                      renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        renderSlot(_ctx.$slots, "cancel", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                          !unref(props).okOnly ? (openBlock(), createBlock(_sfc_main$b, {
                            key: 0,
                            ref: "_cancelButton",
                            disabled: disableCancel.value,
                            size: unref(props).buttonSize,
                            variant: unref(props).cancelVariant,
                            class: normalizeClass(unref(props).cancelClass),
                            onClick: _cache[2] || (_cache[2] = ($event) => unref(hide2)("cancel"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(props).cancelTitle), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled", "size", "variant", "class"])) : createCommentVNode("", true)
                        ]),
                        renderSlot(_ctx.$slots, "ok", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                          createVNode(_sfc_main$b, {
                            ref: "_okButton",
                            disabled: disableOk.value,
                            size: unref(props).buttonSize,
                            variant: unref(props).okVariant,
                            class: normalizeClass(unref(props).okClass),
                            onClick: _cache[3] || (_cache[3] = ($event) => unref(hide2)("ok"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(props).okTitle), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled", "size", "variant", "class"])
                        ])
                      ])
                    ], 2)) : createCommentVNode("", true)
                  ], 2)) : createCommentVNode("", true)
                ], 2),
                unref(needsFallback) ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  ref: "_fallbackFocusElement",
                  class: normalizeClass(fallbackClassSelector),
                  tabindex: "0",
                  style: { "width": "0", "height": "0", "overflow": "hidden" }
                }, null, 512)) : createCommentVNode("", true)
              ], 16, _hoisted_1$7), [
                [vShow, unref(showRef) && (unref(backdropReady) && unref(props).backdropFirst || !unref(props).backdropFirst)]
              ])
            ]),
            _: 3
          }, 16, ["appear"])) : createCommentVNode("", true),
          !unref(props).noBackdrop ? renderSlot(_ctx.$slots, "backdrop", normalizeProps(mergeProps({ key: 1 }, sharedSlots.value)), () => [
            unref(renderBackdropRef) ? (openBlock(), createBlock(Transition, normalizeProps(mergeProps({ key: 0 }, unref(backdropTransitionProps))), {
              default: withCtx(() => [
                withDirectives(createElementVNode("div", {
                  class: normalizeClass(["modal-backdrop", {
                    fade: !unref(computedNoAnimation),
                    show: unref(backdropVisible) || unref(computedNoAnimation),
                    ...sharedClasses.value
                  }]),
                  style: normalizeStyle(computedZIndexBackdrop.value),
                  onClick: _cache[5] || (_cache[5] = ($event) => unref(hide2)("backdrop"))
                }, null, 6), [
                  [vShow, unref(showRef) || unref(isLeaving) && unref(props).backdropFirst && !unref(computedNoAnimation)]
                ])
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true)
          ]) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["to", "disabled"]);
    };
  }
});
const useModal = () => {
  const orchestratorRegistry = inject(orchestratorRegistryKey);
  if (!orchestratorRegistry) {
    throw Error(
      "useModal() must be called within setup(), and BApp, useRegistry or plugin must be installed/provided."
    );
  }
  const { store, _isOrchestratorInstalled } = orchestratorRegistry;
  const create = (obj = {}, options = {}) => {
    if (!_isOrchestratorInstalled.value) {
      throw new Error("BApp or BOrchestrator component must be mounted to use the modal controller");
    }
    const resolvedProps = isRef(obj) ? obj : shallowRef(obj);
    const _self = resolvedProps.value?.id || /* @__PURE__ */ Symbol("Modals controller");
    const promise = buildPromise(_self, store);
    promise.stop = watch(
      resolvedProps,
      (_newValue) => {
        const newValue = { ...toValue$1(_newValue) };
        const previousIndex = store.value.findIndex((el) => el._self === _self);
        const previous = previousIndex === -1 ? { _component: markRaw(_sfc_main$9) } : store.value[previousIndex];
        const v = {
          type: "modal",
          _self,
          position: "modal",
          ...previous,
          options,
          promise
        };
        for (const key in newValue) {
          if (key.startsWith("on")) {
            v[key] = newValue[key];
          } else if (key === "component" && newValue.component) {
            v._component = markRaw(newValue.component);
          } else if (key === "slots" && newValue.slots) {
            v.slots = markRaw(newValue.slots);
          } else {
            v[key] = toValue$1(newValue[key]);
          }
        }
        v.modelValue = v.modelValue ?? false;
        v["onUpdate:modelValue"] = (val) => {
          const onUpdateModelValue = newValue["onUpdate:modelValue"];
          onUpdateModelValue?.(val);
          const { modelValue } = toValue$1(obj);
          if (isRef(obj) && !isRef(modelValue)) obj.value.modelValue = val;
          if (isRef(modelValue) && !isReadonly(modelValue)) {
            modelValue.value = val;
          }
          const modal = store.value.find((el) => el._self === _self);
          if (modal) {
            modal.modelValue = val;
          }
        };
        if (previousIndex === -1) {
          store.value.push(v);
        } else {
          store.value.splice(previousIndex, 1, v);
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    onScopeDispose(() => {
      const modal = store.value.find((el) => el._self === _self);
      if (modal) {
        modal.promise.value.destroy?.();
      }
    }, true);
    return promise.value;
  };
  const { lastStack, stack, registry } = useSharedModalStack();
  const show = (id) => {
    if (id === void 0) {
      if (lastStack?.value) {
        lastStack?.value.exposed?.show();
      }
    } else {
      const stackModal = stack?.value.find((modal2) => modal2.exposed?.id === id);
      if (stackModal) {
        stackModal.exposed?.show();
        return;
      }
      const modal = store.value.find((el) => el._self === id);
      if (modal) {
        modal.modelValue = true;
        modal["onUpdate:modelValue"]?.(true);
      } else {
        stack?.value.forEach((modal2) => {
          if (modal2.exposed?.id === id) {
            modal2.exposed?.show();
          }
        });
      }
    }
  };
  const hide2 = (trigger, id) => {
    if (id === void 0) {
      if (lastStack?.value) {
        lastStack?.value.exposed?.hide(trigger);
      }
    } else {
      const stackModal = stack?.value.find((modal2) => modal2.exposed?.id === id);
      if (stackModal) {
        stackModal.exposed?.hide(trigger);
        return;
      }
      const modal = store.value.find((el) => el._self === id);
      if (modal) {
        modal.modelValue = false;
        modal["onUpdate:modelValue"]?.(false);
      } else {
        stack?.value.forEach((modal2) => {
          if (modal2.exposed?.id === id) {
            modal2.exposed?.hide(trigger, true);
          }
        });
      }
    }
  };
  const hideAll = (trigger) => {
    stack?.value.forEach((modal) => {
      modal.exposed?.hide(trigger, true);
    });
  };
  const get = (id) => {
    const modal = store.value.find((el) => el._self === id);
    if (modal) {
      return {
        modal,
        show() {
          modal?.promise.value.show();
        },
        hide(trigger) {
          modal?.promise.value.hide(trigger);
        }
      };
    }
    if (registry?.value) {
      for (const [, modal2] of registry?.value.entries() ?? []) {
        if (toValue$1(modal2.exposed?.id) === id) {
          return {
            modal: modal2,
            show() {
              modal2.exposed?.show();
            },
            hide(trigger) {
              modal2.exposed?.hide(trigger, true);
            }
          };
        }
      }
    }
    return null;
  };
  const instance = getCurrentInstance$1();
  const current = () => {
    const findBModal = (component) => {
      if (!component.parent) {
        return null;
      }
      if (component.parent.type === _sfc_main$9) {
        return component.parent;
      }
      return findBModal(component.parent);
    };
    if (!instance) {
      return null;
    }
    const modalComponent = computed(() => findBModal(instance));
    const modal = computed(() => modalComponent.value?.proxy);
    return {
      show() {
        modalComponent.value?.exposed?.show();
      },
      hide(trigger) {
        modalComponent.value?.exposed?.hide(trigger, true);
      },
      modal
    };
  };
  return {
    show,
    hide: hide2,
    hideAll,
    get,
    current,
    create,
    _isOrchestratorInstalled,
    store
    // Todo: Supports listening events globally in the future
  };
};
const sides = ["top", "right", "bottom", "left"];
const alignments = ["start", "end"];
const placements = /* @__PURE__ */ sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
const yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$2 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter((placement) => getAlignment(placement) === alignment), ...allowedPlacements.filter((placement) => getAlignment(placement) !== alignment)] : allowedPlacements.filter((placement) => getSide(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
    }
    return true;
  });
}
const autoPlacement$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "autoPlacement",
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform: platform2,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      const placements$1 = alignment !== void 0 || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)));
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [], {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map((d) => {
        const alignment2 = getAlignment(d.placement);
        return [d.placement, alignment2 && crossAxis ? (
          // Check along the mainAxis and main crossAxis side.
          d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0)
        ) : (
          // Check only the mainAxis.
          d.overflows[0]
        ), d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter((d) => d[2].slice(
        0,
        // Aligned placements should not check their opposite crossAxis
        // side.
        getAlignment(d[0]) ? 2 : 3
      ).every((v) => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
function getBoundingRect(rects) {
  const minX = min(...rects.map((rect) => rect.left));
  const minY = min(...rects.map((rect) => rect.top));
  const maxX = max(...rects.map((rect) => rect.right));
  const maxY = max(...rects.map((rect) => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
}
const inline$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "inline",
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform: platform2,
        strategy
      } = state;
      const {
        padding = 2,
        x,
        y
      } = evaluate(options, state);
      const nativeClientRects = Array.from(await (platform2.getClientRects == null ? void 0 : platform2.getClientRects(elements.reference)) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
      const paddingObject = getPaddingObject(padding);
      function getBoundingClientRect2() {
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          return clientRects.find((rect) => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }
        if (clientRects.length >= 2) {
          if (getSideAxis(placement) === "y") {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = getSide(placement) === "top";
            const top2 = firstRect.top;
            const bottom2 = lastRect.bottom;
            const left2 = isTop ? firstRect.left : lastRect.left;
            const right2 = isTop ? firstRect.right : lastRect.right;
            const width2 = right2 - left2;
            const height2 = bottom2 - top2;
            return {
              top: top2,
              bottom: bottom2,
              left: left2,
              right: right2,
              width: width2,
              height: height2,
              x: left2,
              y: top2
            };
          }
          const isLeftSide = getSide(placement) === "left";
          const maxRight = max(...clientRects.map((rect) => rect.right));
          const minLeft = min(...clientRects.map((rect) => rect.left));
          const measureRects = clientRects.filter((rect) => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform2.getElementRects({
        reference: {
          getBoundingClientRect: getBoundingClientRect2
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};
const originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
const size$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /* @__PURE__ */ new Set(["inline", "contents"]);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /* @__PURE__ */ new Set(["table", "td", "th"]);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [":popover-open", ":modal"];
function isTopLayer(element) {
  return topLayerSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ["transform", "translate", "scale", "rotate", "perspective"];
const willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"];
const containValues = ["paint", "layout", "strict", "content"];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return transformProperties.some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some((value) => (css.willChange || "").includes(value)) || containValues.some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
const lastTraversableNodeNames = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement$1(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement$1(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement$1(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
const absoluteOrFixed = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement$1(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const autoPlacement = autoPlacement$1;
const shift = shift$1;
const flip = flip$1;
const size = size$1;
const hide = hide$1;
const arrow$1 = arrow$2;
const inline = inline$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
function isComponentPublicInstance(target) {
  return target != null && typeof target === "object" && "$el" in target;
}
function unwrapElement(target) {
  if (isComponentPublicInstance(target)) {
    const element = target.$el;
    return isNode(element) && getNodeName(element) === "#comment" ? null : element;
  }
  return target;
}
function toValue(source) {
  return typeof source === "function" ? source() : unref(source);
}
function arrow(options) {
  return {
    name: "arrow",
    options,
    fn(args) {
      const element = unwrapElement(toValue(options.element));
      if (element == null) {
        return {};
      }
      return arrow$1({
        element,
        padding: options.padding
      }).fn(args);
    }
  };
}
function getDPR(element) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useFloating(reference, floating, options) {
  if (options === void 0) {
    options = {};
  }
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => {
    var _toValue;
    return (_toValue = toValue(options.open)) != null ? _toValue : true;
  });
  const middlewareOption = computed(() => toValue(options.middleware));
  const placementOption = computed(() => {
    var _toValue2;
    return (_toValue2 = toValue(options.placement)) != null ? _toValue2 : "bottom";
  });
  const strategyOption = computed(() => {
    var _toValue3;
    return (_toValue3 = toValue(options.strategy)) != null ? _toValue3 : "absolute";
  });
  const transformOption = computed(() => {
    var _toValue4;
    return (_toValue4 = toValue(options.transform)) != null ? _toValue4 : true;
  });
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref(0);
  const y = ref(0);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef({});
  const isPositioned = ref(false);
  const floatingStyles = computed(() => {
    const initialStyles = {
      position: strategy.value,
      left: "0",
      top: "0"
    };
    if (!floatingElement.value) {
      return initialStyles;
    }
    const xVal = roundByDPR(floatingElement.value, x.value);
    const yVal = roundByDPR(floatingElement.value, y.value);
    if (transformOption.value) {
      return {
        ...initialStyles,
        transform: "translate(" + xVal + "px, " + yVal + "px)",
        ...getDPR(floatingElement.value) >= 1.5 && {
          willChange: "transform"
        }
      };
    }
    return {
      position: strategy.value,
      left: xVal + "px",
      top: yVal + "px"
    };
  });
  let whileElementsMountedCleanup;
  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }
    const open = openOption.value;
    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value
    }).then((position) => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
      isPositioned.value = open !== false;
    });
  }
  function cleanup() {
    if (typeof whileElementsMountedCleanup === "function") {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = void 0;
    }
  }
  function attach() {
    cleanup();
    if (whileElementsMountedOption === void 0) {
      update();
      return;
    }
    if (referenceElement.value != null && floatingElement.value != null) {
      whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
      return;
    }
  }
  function reset() {
    if (!openOption.value) {
      isPositioned.value = false;
    }
  }
  watch([middlewareOption, placementOption, strategyOption, openOption], update, {
    flush: "sync"
  });
  watch([referenceElement, floatingElement], attach, {
    flush: "sync"
  });
  watch(openOption, reset, {
    flush: "sync"
  });
  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }
  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    isPositioned: shallowReadonly(isPositioned),
    floatingStyles,
    update
  };
}
const useMouse = /* @__PURE__ */ createSharedComposable(useMouse$1);
const _hoisted_1$6 = ["id"];
const _hoisted_2$4 = ["id"];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BPopover",
  props: /* @__PURE__ */ mergeModels({
    body: { default: void 0 },
    bodyClass: { default: void 0 },
    boundary: { default: "clippingAncestors" },
    boundaryPadding: { default: void 0 },
    click: { type: Boolean, default: void 0 },
    closeOnHide: { type: Boolean, default: false },
    focus: { type: Boolean, default: void 0 },
    hover: { type: Boolean, default: void 0 },
    delay: { default: () => ({ show: 100, hide: 300 }) },
    floatingMiddleware: { default: void 0 },
    hideMargin: { default: 2 },
    id: { default: void 0 },
    inline: { type: Boolean, default: false },
    manual: { type: Boolean, default: false },
    noAutoClose: { type: Boolean, default: false },
    noFlip: { type: Boolean, default: false },
    noHide: { type: Boolean, default: false },
    noShift: { type: Boolean, default: false },
    noSize: { type: Boolean, default: false },
    noninteractive: { type: Boolean, default: false },
    offset: { default: null },
    placement: { default: "top" },
    realtime: { type: Boolean, default: false },
    reference: { default: null },
    strategy: { default: "absolute" },
    target: { default: null },
    title: { default: void 0 },
    titleClass: { default: void 0 },
    tooltip: { type: Boolean, default: false },
    teleportDisabled: { type: Boolean, default: false },
    teleportTo: { default: void 0 },
    initialAnimation: { type: Boolean, default: false },
    noAnimation: { type: Boolean },
    noFade: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
    unmountLazy: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    transProps: {},
    visible: { type: Boolean, default: false }
  }, {
    "modelValue": { type: Boolean, ...{
      default: false
    } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["pointerleave", "blur", "click-outside", "close-on-hide", "hide", "hide-prevented", "hidden", "show", "show-prevented", "shown", "toggle", "toggle-prevented", "cancel", "ok"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BPopover");
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    const modelValue = useModel(__props, "modelValue");
    const computedId = useId(() => props.id, "popover");
    const hidden = ref(false);
    const floatingElement = useTemplateRef("_element");
    const content = useTemplateRef("_content");
    const arrow$12 = useTemplateRef("_arrow");
    const placeholder = useTemplateRef("_placeholder");
    const referenceElement = ref(null);
    const triggerElement = ref(null);
    const isAutoPlacement = computed(() => props.placement.startsWith("auto"));
    const offsetNumber = /* @__PURE__ */ useToNumber(() => props.offset ?? Number.NaN);
    const boundary = computed(
      () => isBoundary(props.boundary) ? props.boundary : void 0
    );
    const rootBoundary = computed(
      () => isRootBoundary(props.boundary) ? props.boundary : void 0
    );
    const sizeStyles = ref({});
    const floatingMiddleware = computed(() => {
      if (props.floatingMiddleware !== void 0) {
        return props.floatingMiddleware;
      }
      const off = props.offset !== null ? offsetNumber.value : props.tooltip ? 6 : 8;
      const arr = [offset(off)];
      if (props.noFlip === false && !isAutoPlacement.value) {
        arr.push(
          flip({
            boundary: boundary.value,
            rootBoundary: rootBoundary.value,
            padding: props.boundaryPadding
          })
        );
      }
      if (isAutoPlacement.value) {
        arr.push(
          autoPlacement({
            alignment: props.placement.split("-")[1] || void 0,
            boundary: boundary.value,
            rootBoundary: rootBoundary.value,
            padding: props.boundaryPadding
          })
        );
      }
      if (props.noShift === false) {
        arr.push(
          shift({
            boundary: boundary.value,
            rootBoundary: rootBoundary.value,
            padding: props.boundaryPadding
          })
        );
      }
      if (props.noHide === false) {
        arr.push(
          hide({
            boundary: boundary.value,
            rootBoundary: rootBoundary.value,
            padding: props.boundaryPadding
          })
        );
      }
      if (props.inline === true) {
        arr.push(inline());
      }
      arr.push(arrow({ element: arrow$12, padding: 10 }));
      if (props.noSize === false) {
        arr.push(
          size({
            boundary: boundary.value,
            rootBoundary: rootBoundary.value,
            padding: props.boundaryPadding,
            apply({ availableWidth, availableHeight }) {
              sizeStyles.value = {
                maxHeight: availableHeight >= (content.value?.scrollHeight ?? 0) ? void 0 : availableHeight ? `${Math.max(0, availableHeight)}px` : void 0,
                maxWidth: availableWidth >= (content.value?.scrollWidth ?? 0) ? void 0 : availableWidth ? `${Math.max(0, availableWidth)}px` : void 0
              };
            }
          })
        );
      }
      return arr;
    });
    const placementRef = computed(
      () => isAutoPlacement.value ? void 0 : props.placement
    );
    const { floatingStyles, middlewareData, placement, update } = useFloating(
      referenceElement,
      floatingElement,
      {
        placement: placementRef,
        middleware: floatingMiddleware,
        strategy: toRef$1(() => props.strategy)
      }
    );
    const arrowStyle = ref({ position: "absolute" });
    watch(middlewareData, (newValue) => {
      if (props.noHide === false) {
        if (newValue.hide?.referenceHidden && !hidden.value && showRef.value) {
          if (props.closeOnHide && !props.noAutoClose && !props.manual) {
            throttleHide("close-on-hide");
          } else {
            localTemporaryHide.value = true;
            hidden.value = true;
          }
        } else if (localTemporaryHide.value && !newValue.hide?.referenceHidden) {
          localTemporaryHide.value = false;
          hidden.value = false;
        }
      }
      if (newValue.arrow) {
        const { x: x2, y: y2 } = newValue.arrow;
        arrowStyle.value = {
          position: "absolute",
          top: y2 ? `${y2}px` : "",
          left: x2 ? `${x2}px` : ""
        };
      }
    });
    let cleanup;
    const {
      showRef,
      hide: hide$12,
      show,
      toggle,
      throttleHide,
      computedNoAnimation,
      transitionProps,
      contentShowing,
      isVisible: isVisible2,
      isActive,
      renderRef,
      localTemporaryHide
    } = useShowHide(modelValue, props, emit, floatingElement, computedId, {
      showFn: () => {
        update();
        nextTick(() => {
          cleanup = autoUpdate(
            referenceElement.value,
            floatingElement.value,
            update,
            { animationFrame: props.realtime }
          );
        });
      },
      hideFn: () => {
        if (cleanup) {
          cleanup();
          cleanup = void 0;
        }
      }
    });
    const computedClasses = computed(() => {
      const type = props.tooltip ? "tooltip" : "popover";
      return [
        type,
        `b-${type}`,
        {
          show: isVisible2.value && !hidden.value,
          fade: !computedNoAnimation.value,
          [`bs-${type}-${resolveBootstrapPlacement(placement.value)}`]: placement.value !== void 0
        }
      ];
    });
    const { x, y } = useMouse();
    const isElementAndTriggerOutside = () => {
      const triggerRect = triggerElement.value?.getBoundingClientRect();
      const elementRect = floatingElement.value?.getBoundingClientRect();
      const margin = parseInt(props.hideMargin, 10) || 0;
      const offsetX = window?.scrollX || 0;
      const offsetY = window?.scrollY || 0;
      const triggerIsOutside = !triggerRect || x.value < triggerRect.left + offsetX - margin || x.value > triggerRect.right + offsetX + margin || y.value < triggerRect.top + offsetY - margin || y.value > triggerRect.bottom + offsetY + margin;
      const isOutside = !elementRect || x.value < elementRect.left + offsetX - margin || x.value > elementRect.right + offsetX + margin || y.value < elementRect.top + offsetY - margin || y.value > elementRect.bottom + offsetY + margin;
      return { triggerIsOutside, isOutside };
    };
    let looptimeout;
    const tryHide = (e) => {
      const { triggerIsOutside, isOutside } = isElementAndTriggerOutside();
      if (!props.noninteractive && isOutside && triggerIsOutside && !floatingElement.value?.contains(document?.activeElement) && !triggerElement.value?.contains(document?.activeElement) || props.noninteractive && triggerIsOutside) {
        hide$12(e?.type);
      } else {
        if (looptimeout) clearTimeout(looptimeout);
        looptimeout = setTimeout(() => {
          tryHide(e);
        }, 50);
      }
    };
    watch(isVisible2, () => {
      update();
    });
    __expose({
      hide: hide$12,
      show,
      toggle
    });
    const localToggle = (e) => {
      if (showRef.value) {
        hide$12(e.type === "click" ? "click" : "toggle");
      } else {
        show();
      }
    };
    const localShow = () => {
      show();
    };
    const computedTriggers = computed(() => {
      if (props.manual) {
        return { hover: false, focus: false, click: false };
      }
      if (props.hover !== void 0 || props.focus !== void 0 || props.click !== void 0) {
        return {
          hover: props.hover ?? false,
          focus: props.focus ?? false,
          click: props.click ?? false
        };
      }
      return { hover: true, focus: true, click: false };
    });
    const bind2 = () => {
      if (props.target) {
        const elem = getElement(toValue$1(props.target));
        if (elem) {
          triggerElement.value = elem;
        } else {
          console.warn("Target element not found", props.target);
        }
      } else {
        triggerElement.value = placeholder.value?.nextElementSibling;
      }
      if (props.reference) {
        const elem = getElement(toValue$1(props.reference));
        if (elem) {
          referenceElement.value = elem;
        } else {
          console.warn("Reference element not found", props.reference);
        }
      } else {
        referenceElement.value = triggerElement.value;
      }
      if (!triggerElement.value || props.manual) {
        return;
      }
      const triggers = computedTriggers.value;
      if (triggers.click) {
        triggerElement.value.addEventListener("click", localToggle);
      }
      if (triggers.hover) {
        triggerElement.value.addEventListener("pointerenter", localShow);
        triggerElement.value.addEventListener("pointerleave", tryHide);
      }
      if (triggers.focus) {
        triggerElement.value.addEventListener("focus", localShow);
        triggerElement.value.addEventListener("blur", tryHide);
      }
    };
    const unbind2 = () => {
      if (triggerElement.value) {
        triggerElement.value.removeEventListener("click", localToggle);
        triggerElement.value.removeEventListener("pointerenter", localShow);
        triggerElement.value.removeEventListener("pointerleave", tryHide);
        triggerElement.value.removeEventListener("focus", localShow);
        triggerElement.value.removeEventListener("blur", tryHide);
      }
    };
    onClickOutside(
      floatingElement,
      () => {
        if (showRef.value && computedTriggers.value.click && !props.noAutoClose && !props.manual)
          hide$12("click-outside");
      },
      { ignore: [triggerElement] }
    );
    watch(
      [
        () => props.click,
        () => props.hover,
        () => props.focus,
        () => props.manual,
        () => props.target,
        () => props.reference
      ],
      () => {
        unbind2();
        bind2();
      }
    );
    const sharedSlots = computed(() => ({
      toggle,
      show,
      hide: hide$12,
      id: computedId.value,
      visible: isVisible2.value,
      active: isActive.value
    }));
    onMounted(() => {
      bind2();
      nextTick(() => {
        update();
      });
    });
    onBeforeUnmount(unbind2);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("span", {
          id: unref(computedId) + "_placeholder",
          ref: "_placeholder",
          style: { "display": "none" }
        }, null, 8, _hoisted_1$6),
        renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps(sharedSlots.value))),
        createVNode(_sfc_main$f, {
          to: unref(props).teleportTo,
          disabled: !unref(props).teleportTo || unref(props).teleportDisabled
        }, {
          default: withCtx(() => [
            unref(renderRef) || unref(contentShowing) ? (openBlock(), createBlock(Transition, mergeProps({ key: 0 }, unref(transitionProps), {
              appear: modelValue.value || unref(props).visible
            }), {
              default: withCtx(() => [
                withDirectives(createElementVNode("div", mergeProps({ id: unref(computedId) }, unref(attrs), {
                  ref: "_element",
                  class: computedClasses.value,
                  role: "tooltip",
                  tabindex: "-1",
                  style: unref(floatingStyles)
                }), [
                  createElementVNode("div", {
                    ref: "_arrow",
                    class: normalizeClass(`${unref(props).tooltip ? "tooltip" : "popover"}-arrow`),
                    style: normalizeStyle(arrowStyle.value),
                    "data-popper-arrow": ""
                  }, null, 6),
                  createElementVNode("div", {
                    ref: "_content",
                    class: "overflow-auto",
                    style: normalizeStyle(sizeStyles.value)
                  }, [
                    unref(props).title || slots.title ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: normalizeClass(["position-sticky top-0", [unref(props).tooltip ? "tooltip-inner" : "popover-header", unref(props).titleClass]])
                    }, [
                      renderSlot(_ctx.$slots, "title", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        createTextVNode(toDisplayString(unref(props).title), 1)
                      ])
                    ], 2)) : createCommentVNode("", true),
                    unref(props).tooltip && !slots.title && !unref(props).title || !unref(props).tooltip ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: normalizeClass([unref(props).tooltip ? "tooltip-inner" : "popover-body", unref(props).bodyClass])
                    }, [
                      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        createTextVNode(toDisplayString(unref(props).body) + toDisplayString(unref(attrs).content), 1)
                      ])
                    ], 2)) : createCommentVNode("", true)
                  ], 4)
                ], 16, _hoisted_2$4), [
                  [vShow, unref(showRef) && !hidden.value]
                ])
              ]),
              _: 3
            }, 16, ["appear"])) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["to", "disabled"])
      ], 64);
    };
  }
});
const resolveBootstrapPlacement = (placement) => {
  const [_placement] = placement.split("-");
  switch (_placement) {
    case "left":
      return "start";
    case "right":
      return "end";
    default:
      return _placement;
  }
};
const resolveActiveStatus = (values) => typeof values !== "object" || values.active !== false;
const resolveContent = (values, el) => {
  const isActive = resolveActiveStatus(values);
  if (!isActive) return {};
  const missingBindingValue = typeof values === "undefined" || typeof values === "object" && !values.title && !values.content && !values.body;
  if (typeof document !== "undefined") {
    const title = el.getAttribute("title") || el.getAttribute("data-original-title");
    if (missingBindingValue) {
      if (title) {
        el.removeAttribute("title");
        el.setAttribute("data-original-title", title);
        return {
          body: title
        };
      }
      return {};
    }
  } else {
    if (missingBindingValue) return {};
  }
  if (typeof values === "string") {
    return {
      body: values
    };
  }
  if (values?.content)
    console.warn("v-b-popover/v-b-tooltip: `content` is deprecated, use `body` instead");
  return {
    title: values?.title ? values?.title : void 0,
    body: values?.body ? values?.body : values?.content ? values?.content : void 0
  };
};
const resolveDirectiveProps = (binding, el) => ({
  target: el,
  modelValue: binding.modifiers.show,
  inline: binding.modifiers.inline,
  click: binding.modifiers.click,
  realtime: binding.modifiers.realtime,
  lazy: binding.modifiers.lazy,
  placement: binding.modifiers.left ? "left" : binding.modifiers.right ? "right" : binding.modifiers.bottom ? "bottom" : binding.modifiers.top ? "top" : void 0,
  ...typeof binding.value === "object" ? binding.value : void 0,
  ...binding.modifiers.interactive ? { noninteractive: false } : void 0,
  title: null,
  body: null
});
const bind = (el, binding, props) => {
  if (typeof document === "undefined") return;
  const div = document.createElement("span");
  if (binding.modifiers.body) document.body.appendChild(div);
  else if (binding.modifiers.child) el.appendChild(div);
  else el.parentNode?.insertBefore(div, el.nextSibling);
  render(h(_sfc_main$8, props), div);
  el.$__element = div;
};
const unbind = (el) => {
  const div = el.$__element;
  if (!div) return;
  render(null, div);
  if (typeof document === "undefined") {
    delete el.$__element;
    return;
  }
  queueMicrotask(() => {
    div.remove();
    if (el.$__element === div) {
      delete el.$__element;
    }
  });
};
const isBoundary = (input) => input === "clippingAncestors" || input instanceof Element || Array.isArray(input);
const isRootBoundary = (input) => !isBoundary(input);
const createGetActive = (instances) => () => instances.length > 0 ? instances[instances.length - 1] : void 0;
const _newShowHideRegistry = () => {
  const values = ref(/* @__PURE__ */ new Map());
  const register = ({
    id,
    component,
    value,
    toggle,
    show,
    hide: hide2,
    registerTrigger,
    unregisterTrigger
  }) => {
    let currentId = id;
    const instanceValue = {
      id,
      component,
      value: readonly(value),
      toggle,
      show,
      hide: hide2,
      registerTrigger,
      unregisterTrigger
    };
    let instancesHolder = values.value.get(currentId);
    if (!instancesHolder) {
      const instances = [];
      instancesHolder = {
        instances,
        // Returns the last mounted instance (most recent)
        getActive: createGetActive(instances)
      };
      values.value.set(currentId, instancesHolder);
    }
    instancesHolder.instances.push(instanceValue);
    const componentUid = component.uid;
    return {
      unregister() {
        const holder = values.value.get(currentId);
        if (!holder) return;
        const index = holder.instances.findIndex(
          (inst) => inst.component.uid === componentUid
        );
        if (index !== -1) {
          holder.instances.splice(index, 1);
        }
        if (holder.instances.length === 0) {
          values.value.delete(currentId);
        }
      },
      updateId(newId, oldId) {
        const holder = values.value.get(oldId);
        if (!holder) return;
        const instance = holder.instances.find(
          (inst) => inst.component.uid === componentUid
        );
        if (!instance) return;
        instance.id = newId;
        let newHolder = values.value.get(newId);
        if (!newHolder) {
          const instances = [];
          newHolder = {
            instances,
            getActive: createGetActive(instances)
          };
          values.value.set(newId, newHolder);
        }
        const index = holder.instances.findIndex(
          (inst) => inst.component.uid === componentUid
        );
        if (index !== -1) {
          holder.instances.splice(index, 1);
          newHolder.instances.push(instance);
        }
        if (holder.instances.length === 0) {
          values.value.delete(oldId);
        }
        currentId = newId;
      }
    };
  };
  return {
    register,
    values
  };
};
function getDirectiveUid(binding) {
  if (!binding.instance) {
    throw new Error("[Bootstrap-Vue-Next] Directive binding.instance is not available");
  }
  return binding.instance.$.uid;
}
function initDirectiveInstance(el, propertyName, uid, binding) {
  const elWithProps = el;
  elWithProps[propertyName] = elWithProps[propertyName] ?? /* @__PURE__ */ Object.create(null);
  const state = {
    binding: JSON.stringify([binding.modifiers, binding.value]),
    destroying: false
  };
  elWithProps[propertyName][uid] = state;
  return state;
}
function getDirectiveInstance(el, propertyName, uid) {
  const elWithProps = el;
  return elWithProps[propertyName]?.[uid];
}
function hasBindingChanged(instance, binding) {
  const newBinding = JSON.stringify([binding.modifiers, binding.value]);
  return instance.binding !== newBinding;
}
function updateBindingCache(instance, binding) {
  instance.binding = JSON.stringify([binding.modifiers, binding.value]);
}
function cleanupDirectiveInstance(el, propertyName, uid) {
  const elWithProps = el;
  const instance = elWithProps[propertyName]?.[uid];
  if (instance) {
    instance.destroying = true;
    delete elWithProps[propertyName][uid];
  }
}
function findProvides(binding, vnode) {
  const provides = (vnode.ctx === binding.instance.$ ? findComponentParent(vnode, binding.instance.$)?.provides : vnode.ctx?.provides) ?? binding.instance.$.provides;
  return provides;
}
function findComponentParent(vnode, root) {
  const stack = /* @__PURE__ */ new Set();
  const walk = (children) => {
    for (const child of children) {
      if (!child) continue;
      if (child === vnode || child.el && vnode.el && child.el === vnode.el) {
        return true;
      }
      stack.add(child);
      let result2;
      if (child.suspense) {
        result2 = walk([child.ssContent]);
      } else if (Array.isArray(child.children)) {
        result2 = walk(child.children);
      } else if (child.component?.vnode) {
        result2 = walk([child.component?.subTree]);
      }
      if (result2) {
        return result2;
      }
      stack.delete(child);
    }
    return false;
  };
  if (!walk([root.subTree])) {
    console.error("Could not find original vnode,  will not inherit provides");
    return root;
  }
  const result = Array.from(stack).reverse();
  for (const child of result) {
    if (child.component) {
      return child.component;
    }
  }
  return root;
}
function createFloatingDirective(propertyName, componentDefaultsKey, buildProps) {
  return {
    mounted(el, binding, vnode) {
      const uid = getDirectiveUid(binding);
      const defaultsMap = findProvides(binding, vnode)[defaultsKey]?.value;
      const isActive = resolveActiveStatus(binding.value);
      if (!isActive) return;
      const text = resolveContent(binding.value, el);
      if (!text.body && !text.title) return;
      initDirectiveInstance(el, propertyName, uid, binding);
      const props = buildProps ? buildProps(text, defaultsMap?.[componentDefaultsKey], binding, el) : {
        ...defaultsMap?.[componentDefaultsKey] || void 0,
        ...resolveDirectiveProps(binding, el),
        ...text
      };
      bind(el, binding, props);
    },
    updated(el, binding, vnode) {
      const uid = getDirectiveUid(binding);
      let instance = getDirectiveInstance(el, propertyName, uid);
      const defaultsMap = findProvides(binding, vnode)[defaultsKey]?.value;
      const isActive = resolveActiveStatus(binding.value);
      if (!isActive) {
        if (instance && el.$__element) {
          unbind(el);
          cleanupDirectiveInstance(el, propertyName, uid);
        }
        return;
      }
      const text = resolveContent(binding.value, el);
      if (!text.body && !text.title) {
        if (instance && el.$__element) {
          unbind(el);
          cleanupDirectiveInstance(el, propertyName, uid);
        }
        return;
      }
      if (!instance) {
        instance = initDirectiveInstance(el, propertyName, uid, binding);
        const props2 = buildProps ? buildProps(text, defaultsMap?.[componentDefaultsKey], binding, el) : {
          ...defaultsMap?.[componentDefaultsKey] || void 0,
          ...resolveDirectiveProps(binding, el),
          ...text
        };
        bind(el, binding, props2);
        return;
      }
      if (!hasBindingChanged(instance, binding)) return;
      if (instance.destroying) return;
      unbind(el);
      const props = buildProps ? buildProps(text, defaultsMap?.[componentDefaultsKey], binding, el) : {
        ...defaultsMap?.[componentDefaultsKey] || void 0,
        ...resolveDirectiveProps(binding, el),
        ...text
      };
      bind(el, binding, props);
      updateBindingCache(instance, binding);
    },
    beforeUnmount(el, binding) {
      const uid = getDirectiveUid(binding);
      const instance = getDirectiveInstance(el, propertyName, uid);
      if (!instance) return;
      unbind(el);
      cleanupDirectiveInstance(el, propertyName, uid);
    }
  };
}
const vBTooltip = createFloatingDirective(
  "$__tooltip",
  "BTooltip",
  (text, defaults, binding, el) => ({
    noninteractive: true,
    ...defaults || void 0,
    ...resolveDirectiveProps(binding, el),
    title: text.title ?? text.body ?? "",
    tooltip: true
  })
);
const getClasses = (props, els, propPrefix, classPrefix = propPrefix) => els.reduce((arr, prop) => {
  if (!props[prop]) return arr;
  arr.push(
    [classPrefix, prop.replace(propPrefix, ""), props[prop]].filter((e) => e && typeof e !== "boolean").join("-").toLowerCase()
  );
  return arr;
}, []);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BCol",
  props: {
    alignSelf: { default: void 0 },
    tag: { default: "div" },
    order: { default: void 0 },
    offset: { default: void 0 },
    cols: { default: void 0 },
    col: { type: Boolean, default: false },
    offsetSm: { default: void 0 },
    offsetMd: { default: void 0 },
    offsetLg: { default: void 0 },
    offsetXl: { default: void 0 },
    offsetXxl: { default: void 0 },
    orderSm: { default: void 0 },
    orderMd: { default: void 0 },
    orderLg: { default: void 0 },
    orderXl: { default: void 0 },
    orderXxl: { default: void 0 },
    sm: { type: [Boolean, Number, String], default: false },
    md: { type: [Boolean, Number, String], default: false },
    lg: { type: [Boolean, Number, String], default: false },
    xl: { type: [Boolean, Number, String], default: false },
    xxl: { type: [Boolean, Number, String], default: false }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BCol");
    const classList = computed(() => [
      ...getClasses(
        {
          sm: props.sm,
          md: props.md,
          lg: props.lg,
          xl: props.xl,
          xxl: props.xxl
        },
        ["sm", "md", "lg", "xl", "xxl"],
        "col"
      ),
      ...getClasses(
        {
          order: props.order,
          orderLg: props.orderLg,
          orderMd: props.orderMd,
          orderSm: props.orderSm,
          orderXl: props.orderXl,
          orderXxl: props.orderXxl
        },
        ["order", "orderLg", "orderMd", "orderSm", "orderXl", "orderXxl"],
        "order"
      ),
      ...getClasses(
        {
          offset: props.offset,
          offsetLg: props.offsetLg,
          offsetMd: props.offsetMd,
          offsetSm: props.offsetSm,
          offsetXl: props.offsetXl,
          offsetXxl: props.offsetXxl
        },
        ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXxl"],
        "offset"
      )
    ]);
    const computedClasses = computed(() => [
      classList.value,
      {
        col: props.col || !classList.value.some((v) => v.startsWith("col-")) && !props.cols,
        [`col-${props.cols}`]: props.cols !== void 0,
        [`offset-${props.offset}`]: props.offset !== void 0,
        [`order-${props.order}`]: props.order !== void 0,
        [`align-self-${props.alignSelf}`]: props.alignSelf !== void 0
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), {
        class: normalizeClass(computedClasses.value)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
const _sfc_main$3$1 = /* @__PURE__ */ defineComponent({
  __name: "BFormInvalidFeedback",
  props: {
    ariaLive: { default: void 0 },
    forceShow: { type: Boolean, default: false },
    id: { default: void 0 },
    role: { default: void 0 },
    state: { type: [Boolean, null], default: null },
    tag: { default: "div" },
    text: { default: void 0 },
    tooltip: { type: Boolean, default: false }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BFormInvalidFeedback");
    const computedShow = computed(() => props.forceShow === true || props.state === false);
    const computedClasses = computed(() => ({
      "d-block": computedShow.value,
      "invalid-feedback": !props.tooltip,
      "invalid-tooltip": props.tooltip
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), {
        id: unref(props).id,
        role: unref(props).role,
        "aria-live": unref(props).ariaLive,
        "aria-atomic": unref(props).ariaLive ? true : void 0,
        class: normalizeClass(computedClasses.value)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(unref(props).text), 1)
          ])
        ]),
        _: 3
      }, 8, ["id", "role", "aria-live", "aria-atomic", "class"]);
    };
  }
});
const _sfc_main$2$1 = /* @__PURE__ */ defineComponent({
  __name: "BFormRow",
  props: {
    tag: { default: "div" }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BFormRow");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), { class: "row d-flex flex-wrap" }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      });
    };
  }
});
const _sfc_main$1$1 = /* @__PURE__ */ defineComponent({
  __name: "BFormText",
  props: {
    id: { default: void 0 },
    inline: { type: Boolean, default: false },
    tag: { default: "small" },
    text: { default: void 0 },
    textVariant: { default: "body-secondary" }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BFormText");
    const colorClasses = useColorVariantClasses(props);
    const computedClasses = computed(() => [
      colorClasses.value,
      {
        "form-text": !props.inline
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), {
        id: unref(props).id,
        class: normalizeClass(computedClasses.value)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(unref(props).text), 1)
          ])
        ]),
        _: 3
      }, 8, ["id", "class"]);
    };
  }
});
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "BFormValidFeedback",
  props: {
    ariaLive: { default: void 0 },
    forceShow: { type: Boolean, default: false },
    id: { default: void 0 },
    role: { default: void 0 },
    state: { type: [Boolean, null], default: null },
    tag: { default: "div" },
    text: { default: void 0 },
    tooltip: { type: Boolean, default: false }
  },
  setup(__props) {
    const _props = __props;
    const props = useDefaults(_props, "BFormInvalidFeedback");
    const computedShow = computed(() => props.forceShow === true || props.state === true);
    const computedClasses = computed(() => ({
      "d-block": computedShow.value,
      "valid-feedback": !props.tooltip,
      "valid-tooltip": props.tooltip
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(props).tag), {
        id: unref(props).id,
        role: unref(props).role,
        "aria-live": unref(props).ariaLive,
        "aria-atomic": unref(props).ariaLive ? true : void 0,
        class: normalizeClass(computedClasses.value)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(unref(props).text), 1)
          ])
        ]),
        _: 3
      }, 8, ["id", "role", "aria-live", "aria-atomic", "class"]);
    };
  }
});
const useAriaInvalid = (ariaInvalid, state) => computed(() => {
  const resolvedAriaInvalid = toValue$1(ariaInvalid);
  const resolvedState = toValue$1(state);
  const resolvedAriaInvalidValue = resolvedAriaInvalid === true ? "true" : typeof resolvedAriaInvalid === "string" ? resolvedAriaInvalid : resolvedState === false ? "true" : resolvedAriaInvalid === false ? "false" : void 0;
  return resolvedAriaInvalidValue;
});
const useStateClass = (value) => computed(() => {
  const resolvedValue = toValue$1(value);
  return resolvedValue === true ? "is-valid" : resolvedValue === false ? "is-invalid" : null;
});
const suffixPropName = (suffix, value) => value + (suffix ? upperFirst(suffix) : "");
const _hoisted_1$5 = {
  key: 0,
  ref: "_content",
  class: "form-floating"
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BFormGroup",
  props: {
    contentCols: { type: [Boolean, String, Number], default: void 0 },
    labelCols: { type: [Boolean, String, Number], default: void 0 },
    labelAlign: { default: void 0 },
    ariaInvalid: { type: [Boolean, String], default: void 0 },
    contentWrapperAttrs: { default: void 0 },
    description: { default: void 0 },
    disabled: { type: Boolean, default: false },
    feedbackAriaLive: { default: "assertive" },
    floating: { type: Boolean, default: false },
    id: { default: void 0 },
    invalidFeedback: { default: void 0 },
    label: { default: void 0 },
    labelClass: { default: void 0 },
    labelFor: { default: void 0 },
    labelSize: { default: void 0 },
    labelVisuallyHidden: { type: Boolean, default: false },
    labelWrapperAttrs: { default: void 0 },
    state: { type: [Boolean, null], default: null },
    tooltip: { type: Boolean, default: false },
    validFeedback: { default: void 0 },
    validated: { type: Boolean, default: false },
    contentColsSm: { type: [Boolean, String, Number], default: void 0 },
    contentColsMd: { type: [Boolean, String, Number], default: void 0 },
    contentColsLg: { type: [Boolean, String, Number], default: void 0 },
    contentColsXl: { type: [Boolean, String, Number], default: void 0 },
    labelColsSm: { type: [Boolean, String, Number], default: void 0 },
    labelColsMd: { type: [Boolean, String, Number], default: void 0 },
    labelColsLg: { type: [Boolean, String, Number], default: void 0 },
    labelColsXl: { type: [Boolean, String, Number], default: void 0 },
    labelAlignSm: { default: void 0 },
    labelAlignMd: { default: void 0 },
    labelAlignLg: { default: void 0 },
    labelAlignXl: { default: void 0 }
  },
  setup(__props) {
    const INPUTS = ["input", "select", "textarea"];
    const _props = __props;
    const props = useDefaults(_props, "BFormGroup");
    const slots = useSlots();
    const attrs = useAttrs();
    const LabelContentTemplate = /* @__PURE__ */ createReusableTemplate();
    const ContentTemplate = /* @__PURE__ */ createReusableTemplate();
    const computedState = toRef$1(() => props.state);
    const childId = ref([]);
    provide(formGroupKey, (id) => {
      childId.value = [id];
      return {
        state: computedState
      };
    });
    const computedLabelFor = computed(() => {
      if (props.labelFor !== void 0) return props.labelFor;
      if (childId.value[0] && childId.value[0].value) return childId.value[0].value;
      return null;
    });
    const breakPoints = ["xs", "sm", "md", "lg", "xl"];
    const getColProps = (props2, prefix) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      breakPoints.reduce((result, breakpoint) => {
        const suffix = suffixPropName(breakpoint === "xs" ? "" : breakpoint, `${prefix}Cols`);
        let propValue = props2[suffix];
        propValue = propValue === "" ? true : propValue || false;
        if (!(typeof propValue === "boolean") && propValue !== "auto") {
          const val = Number.parseInt(propValue);
          propValue = Number.isNaN(val) ? 0 : val;
          propValue = propValue > 0 ? propValue : false;
        }
        if (propValue) {
          if (breakpoint === "xs") {
            result[typeof propValue === "boolean" ? "col" : "cols"] = propValue;
          } else {
            result[breakpoint || (typeof propValue === "boolean" ? "col" : "cols")] = propValue;
          }
        }
        return result;
      }, {})
    );
    const content = useTemplateRef("_content");
    const contentColProps = computed(() => getColProps(props, "content"));
    const labelAlignClasses = computed(
      () => ((props2, prefix) => breakPoints.reduce((result, breakpoint) => {
        const suffix = suffixPropName(
          breakpoint === "xs" ? "" : breakpoint,
          `${prefix}Align`
        );
        const propValue = props2[suffix] || null;
        if (propValue) {
          if (breakpoint === "xs") {
            result.push(`text-${propValue}`);
          } else {
            result.push(`text-${breakpoint}-${propValue}`);
          }
        }
        return result;
      }, []))(props, "label")
    );
    const labelColProps = computed(() => getColProps(props, "label"));
    const isHorizontal = computed(
      () => Object.keys(contentColProps.value).length > 0 || Object.keys(labelColProps.value).length > 0
    );
    const stateClass = useStateClass(computedState);
    const computedAriaInvalid = useAriaInvalid(() => props.ariaInvalid, computedState);
    const onLegendClick = (event) => {
      if (computedLabelFor.value || content.value === null) return;
      const { target } = event;
      const tagName = target ? target.tagName : "";
      if ([...INPUTS, "a", "button", "label"].indexOf(tagName) !== -1) return;
      const inputs = [
        ...content.value.querySelectorAll(INPUTS.map((v) => `${v}:not([disabled])`).join())
      ].filter(isVisible);
      const [inp] = inputs;
      if (inputs.length === 1 && inp instanceof HTMLElement) {
        attemptFocus(inp);
      }
    };
    const computedId = useId(() => props.id);
    const labelId = useId(void 0, "_BV_label_");
    const labelTag = computed(() => !computedLabelFor.value ? "legend" : "label");
    const labelClasses = computed(() => [
      isHorizontal.value ? "col-form-label" : "form-label",
      {
        "bv-no-focus-ring": !computedLabelFor.value,
        "col-form-label": isHorizontal.value || !computedLabelFor.value,
        "pt-0": !isHorizontal.value && !computedLabelFor.value,
        "d-block": !isHorizontal.value && computedLabelFor.value,
        [`col-form-label-${props.labelSize}`]: !!props.labelSize,
        "visually-hidden": props.labelVisuallyHidden
      },
      isHorizontal.value ? null : labelAlignClasses.value,
      props.labelClass
    ]);
    const invalidFeedbackId = useId(void 0, "_BV_feedback_invalid_");
    const validFeedbackId = useId(void 0, "_BV_feedback_valid_");
    const descriptionId = useId(void 0, "_BV_description_");
    const isFieldset = computed(() => !computedLabelFor.value);
    const rootAttrs = computed(() => ({
      class: isHorizontal.value ? null : attrs.class,
      style: isHorizontal.value ? null : attrs.style
    }));
    const rowAttrs = computed(
      () => isHorizontal.value ? {
        class: attrs.class,
        style: attrs.style
      } : {}
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(isFieldset.value ? "fieldset" : "div"), {
        id: unref(computedId),
        disabled: isFieldset.value ? unref(props).disabled : null,
        role: isFieldset.value ? null : "group",
        "aria-invalid": unref(computedAriaInvalid),
        "aria-labelledby": isFieldset.value && isHorizontal.value ? unref(labelId) : null,
        class: normalizeClass([[unref(stateClass), { "was-validated": unref(props).validated }, rootAttrs.value.class], "b-form-group"]),
        style: normalizeStyle(rootAttrs.value.style)
      }, {
        default: withCtx(() => [
          createVNode(unref(ContentTemplate).define, null, {
            default: withCtx(() => [
              slots["invalid-feedback"] || unref(props).invalidFeedback ? (openBlock(), createBlock(_sfc_main$3$1, {
                key: 0,
                id: unref(invalidFeedbackId),
                "aria-live": unref(props).feedbackAriaLive,
                state: computedState.value,
                tooltip: unref(props).tooltip
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "invalid-feedback", {}, () => [
                    createTextVNode(toDisplayString(unref(props).invalidFeedback), 1)
                  ])
                ]),
                _: 3
              }, 8, ["id", "aria-live", "state", "tooltip"])) : createCommentVNode("", true),
              slots["valid-feedback"] || unref(props).validFeedback ? (openBlock(), createBlock(_sfc_main$6, {
                key: 1,
                id: unref(validFeedbackId),
                "aria-live": unref(props).feedbackAriaLive,
                state: computedState.value,
                tooltip: unref(props).tooltip
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "valid-feedback", {}, () => [
                    createTextVNode(toDisplayString(unref(props).validFeedback), 1)
                  ])
                ]),
                _: 3
              }, 8, ["id", "aria-live", "state", "tooltip"])) : createCommentVNode("", true),
              slots.description || unref(props).description ? (openBlock(), createBlock(_sfc_main$1$1, {
                key: 2,
                id: unref(descriptionId)
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "description", {}, () => [
                    createTextVNode(toDisplayString(unref(props).description), 1)
                  ])
                ]),
                _: 3
              }, 8, ["id"])) : createCommentVNode("", true)
            ]),
            _: 3
          }),
          createVNode(unref(LabelContentTemplate).define, null, {
            default: withCtx(() => [
              slots.label || unref(props).label || isHorizontal.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                isHorizontal.value ? (openBlock(), createBlock(_sfc_main$7, mergeProps({ key: 0 }, { ...labelColProps.value, ...unref(props).labelWrapperAttrs }, { class: labelAlignClasses.value }), {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(labelTag.value), {
                      id: unref(labelId),
                      for: computedLabelFor.value || null,
                      tabindex: isFieldset.value ? "-1" : null,
                      class: normalizeClass(labelClasses.value),
                      onClick: _cache[0] || (_cache[0] = ($event) => isFieldset.value ? onLegendClick : null)
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "label", {}, () => [
                          createTextVNode(toDisplayString(unref(props).label), 1)
                        ])
                      ]),
                      _: 3
                    }, 8, ["id", "for", "tabindex", "class"]))
                  ]),
                  _: 3
                }, 16, ["class"])) : (openBlock(), createBlock(resolveDynamicComponent(labelTag.value), {
                  key: 1,
                  id: unref(labelId),
                  for: computedLabelFor.value || null,
                  tabindex: isFieldset.value ? "-1" : null,
                  class: normalizeClass(labelClasses.value),
                  onClick: _cache[1] || (_cache[1] = ($event) => isFieldset.value ? onLegendClick : null)
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "label", {}, () => [
                      createTextVNode(toDisplayString(unref(props).label), 1)
                    ])
                  ]),
                  _: 3
                }, 8, ["id", "for", "tabindex", "class"]))
              ], 64)) : createCommentVNode("", true)
            ]),
            _: 3
          }),
          isHorizontal.value ? (openBlock(), createBlock(_sfc_main$2$1, {
            key: 0,
            class: normalizeClass(rowAttrs.value.class),
            style: normalizeStyle(rowAttrs.value.style)
          }, {
            default: withCtx(() => [
              createVNode(unref(LabelContentTemplate).reuse),
              createVNode(_sfc_main$7, mergeProps({ ...contentColProps.value, ...unref(props).contentWrapperAttrs }, { ref: "_content" }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    id: unref(computedId),
                    ariaDescribedby: null,
                    descriptionId: unref(descriptionId),
                    labelId: unref(labelId)
                  }),
                  createVNode(unref(ContentTemplate).reuse)
                ]),
                _: 3
              }, 16)
            ]),
            _: 3
          }, 8, ["class", "style"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            unref(props).floating && !isHorizontal.value ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
              renderSlot(_ctx.$slots, "default", {
                id: unref(computedId),
                ariaDescribedby: null,
                descriptionId: unref(descriptionId),
                labelId: unref(labelId)
              }),
              createVNode(unref(LabelContentTemplate).reuse),
              createVNode(unref(ContentTemplate).reuse)
            ], 512)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createVNode(unref(LabelContentTemplate).reuse),
              renderSlot(_ctx.$slots, "default", {
                id: unref(computedId),
                ariaDescribedby: null,
                descriptionId: unref(descriptionId),
                labelId: unref(labelId)
              }),
              createVNode(unref(ContentTemplate).reuse)
            ], 64))
          ], 64))
        ]),
        _: 3
      }, 8, ["id", "disabled", "role", "aria-invalid", "aria-labelledby", "class", "style"]);
    };
  }
});
const noop$1 = () => {
};
function createFilterWrapper$1(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  wrapper.cancel = filter.cancel;
  return wrapper;
}
function debounceFilter$1(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop$1;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop$1;
  };
  let lastInvoker;
  const filter = (invoke) => {
    const duration = toValue$1(ms);
    const maxDuration = toValue$1(options.maxWait);
    if (timer) _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = null;
      }
      return Promise.resolve(invoke());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastInvoker = invoke;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer) _clearTimeout(timer);
          maxTimer = null;
          resolve(lastInvoker());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer) _clearTimeout(maxTimer);
        maxTimer = null;
        resolve(invoke());
      }, duration);
    });
  };
  filter.cancel = () => {
    if (timer) _clearTimeout(timer);
    if (maxTimer) _clearTimeout(maxTimer);
    maxTimer = null;
  };
  return filter;
}
function useDebounceFn$1(fn, ms = 200, options = {}) {
  return createFilterWrapper$1(debounceFilter$1(ms, options), fn);
}
const normalizeInput = (v, modelModifiers) => {
  if (v === null) return;
  let update = v;
  if (modelModifiers.number && typeof update === "string" && update !== "") {
    const parsed = Number.parseFloat(update);
    update = Number.isNaN(parsed) ? update : parsed;
  }
  return update;
};
const useFormInput = (props, input, modelValue, modelModifiers) => {
  const forceUpdateKey = ref(0);
  const computedId = useId(() => props.id, "input");
  const debounceNumber = /* @__PURE__ */ useToNumber(() => props.debounce ?? 0, { nanToZero: true });
  const debounceMaxWaitNumber = /* @__PURE__ */ useToNumber(() => props.debounceMaxWait ?? Number.NaN);
  const formGroupData = inject(formGroupKey, null)?.(computedId);
  const computedState = computed(
    () => props.state !== void 0 ? props.state : formGroupData?.state.value ?? null
  );
  const computedAriaInvalid = useAriaInvalid(() => props.ariaInvalid, computedState);
  const stateClass = useStateClass(computedState);
  const internalUpdateModelValue = useDebounceFn$1(
    (value) => {
      modelValue.value = value;
    },
    () => modelModifiers.lazy === true ? 0 : debounceNumber.value,
    { maxWait: () => modelModifiers.lazy === true ? Number.NaN : debounceMaxWaitNumber.value }
  );
  const updateModelValue = (value, force = false, immediate = false) => {
    if (modelModifiers.lazy === true && force === false) return;
    if (immediate) {
      modelValue.value = value;
    } else {
      internalUpdateModelValue(value);
    }
  };
  const { focused } = useFocus(input, {
    initialValue: props.autofocus
  });
  const _formatValue = (value, evt, force = false) => {
    if (props.formatter !== void 0 && (!props.lazyFormatter || force)) {
      return props.formatter(value, evt);
    }
    return value;
  };
  onMounted(() => {
    if (input.value) {
      input.value.value = modelValue.value?.toString() ?? "";
    }
  });
  onActivated(() => {
    nextTick(() => {
      if (props.autofocus) {
        focused.value = true;
      }
    });
  });
  const onInput = (evt) => {
    const { value } = evt.target;
    const formattedValue = _formatValue(value, evt);
    if (evt.defaultPrevented) {
      evt.preventDefault();
      return;
    }
    const nextModel = formattedValue;
    updateModelValue(nextModel);
  };
  const onChange = (evt) => {
    const { value } = evt.target;
    const formattedValue = _formatValue(value, evt);
    if (evt.defaultPrevented) {
      evt.preventDefault();
      return;
    }
    const nextModel = formattedValue;
    if (modelValue.value !== nextModel) {
      updateModelValue(formattedValue, true);
    }
  };
  const onBlur = (evt) => {
    if (!modelModifiers.lazy && !props.lazyFormatter && !modelModifiers.trim && debounceNumber.value <= 0)
      return;
    const { value } = evt.target;
    const formattedValue = _formatValue(value, evt, true);
    const nextModel = modelModifiers.trim ? formattedValue.trim() : formattedValue;
    const needsForceUpdate = nextModel.length !== formattedValue.length;
    internalUpdateModelValue.cancel();
    if (modelValue.value !== nextModel) {
      updateModelValue(formattedValue, true, true);
    }
    if (modelModifiers.trim && needsForceUpdate) {
      forceUpdateKey.value = forceUpdateKey.value + 1;
    }
  };
  const focus = () => {
    if (!props.disabled) {
      focused.value = true;
    }
  };
  const blur = () => {
    if (!props.disabled) {
      focused.value = false;
    }
  };
  return {
    input,
    computedId,
    computedAriaInvalid,
    onInput,
    onChange,
    onBlur,
    focus,
    blur,
    forceUpdateKey,
    stateClass
  };
};
const _hoisted_1$4 = ["id", "value", "name", "form", "type", "disabled", "placeholder", "required", "autocomplete", "readonly", "min", "max", "step", "list", "aria-required", "aria-invalid"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "BFormInput",
  props: /* @__PURE__ */ mergeModels({
    max: { default: void 0 },
    min: { default: void 0 },
    step: { default: void 0 },
    type: { default: "text" },
    ariaInvalid: { type: [Boolean, String], default: void 0 },
    autocomplete: { default: void 0 },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    form: { default: void 0 },
    formatter: { type: Function, default: void 0 },
    id: { default: void 0 },
    lazyFormatter: { type: Boolean, default: false },
    list: { default: void 0 },
    name: { default: void 0 },
    placeholder: { default: void 0 },
    plaintext: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    size: { default: void 0 },
    state: { type: [Boolean, null], default: void 0 },
    debounce: { default: 0 },
    debounceMaxWait: { default: Number.NaN }
  }, {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const _props = __props;
    const props = useDefaults(_props, "BFormInput");
    const [modelValue, modelModifiers] = useModel(__props, "modelValue", {
      set: (v) => normalizeInput(v, modelModifiers)
    });
    const input = useTemplateRef("_input");
    const {
      computedId,
      computedAriaInvalid,
      onInput,
      onChange,
      onBlur,
      stateClass,
      focus,
      blur,
      forceUpdateKey
    } = useFormInput(props, input, modelValue, modelModifiers);
    const computedClasses = computed(() => {
      const isRange = props.type === "range";
      const isColor = props.type === "color";
      return [
        stateClass.value,
        {
          "form-range": isRange,
          "form-control": isColor || !props.plaintext && !isRange,
          "form-control-color": isColor,
          "form-control-plaintext": props.plaintext && !isRange && !isColor,
          [`form-control-${props.size}`]: !!props.size
        }
      ];
    });
    __expose({
      blur,
      element: input,
      focus
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("input", {
        id: unref(computedId),
        ref: "_input",
        key: unref(forceUpdateKey),
        value: unref(modelValue),
        class: normalizeClass(computedClasses.value),
        name: unref(props).name || void 0,
        form: unref(props).form || void 0,
        type: unref(props).type,
        disabled: unref(props).disabled,
        placeholder: unref(props).placeholder,
        required: unref(props).required || void 0,
        autocomplete: unref(props).autocomplete || void 0,
        readonly: unref(props).readonly || unref(props).plaintext,
        min: unref(props).min,
        max: unref(props).max,
        step: unref(props).step,
        list: unref(props).type !== "password" ? unref(props).list : void 0,
        "aria-required": unref(props).required || void 0,
        "aria-invalid": unref(computedAriaInvalid),
        onInput: _cache[0] || (_cache[0] = //@ts-ignore
        (...args) => unref(onInput) && unref(onInput)(...args)),
        onChange: _cache[1] || (_cache[1] = //@ts-ignore
        (...args) => unref(onChange) && unref(onChange)(...args)),
        onBlur: _cache[2] || (_cache[2] = //@ts-ignore
        (...args) => unref(onBlur) && unref(onBlur)(...args))
      }, null, 42, _hoisted_1$4);
    };
  }
});
const bvKey = "bootstrap-vue-next";
const parseActiveImports = (options, values) => {
  const { all, ...others } = options;
  const valuesCopy = {};
  if (all) {
    values.forEach((el) => {
      valuesCopy[el] = all;
    });
  }
  const merge = { ...valuesCopy, ...others };
  return Object.entries(merge).filter(([name, value]) => !!value && values.includes(name)).map(([name]) => name);
};
const usedComponents = /* @__PURE__ */ new Set();
const usedDirectives = /* @__PURE__ */ new Set();
Object.assign(
  ({
    aliases = {},
    directives = true,
    components = true
  } = {}) => {
    const selectedComponents = typeof components === "boolean" ? { all: components } : components;
    const compImports = parseActiveImports(selectedComponents, componentNames).reduce(
      (map, name) => {
        map.set(name, `${bvKey}${componentsWithExternalPath[name]}`);
        return map;
      },
      /* @__PURE__ */ new Map()
    );
    const selectedDirectives = typeof directives === "boolean" ? { all: directives } : directives;
    const dirImports = parseActiveImports(selectedDirectives, directiveNames).reduce(
      (map, directive) => {
        const key = directive.toLowerCase().startsWith("v") ? directive : `v${directive}`;
        map.set(key, `${bvKey}${directivesWithExternalPath[key]}`);
        return map;
      },
      /* @__PURE__ */ new Map()
    );
    const resolvers = [
      {
        type: "component",
        resolve(name) {
          const destination = compImports.get(name);
          const aliasDestination = compImports.get(aliases[name]);
          if (aliasDestination) {
            const val = aliases[name];
            usedComponents.add(val);
            return {
              name: val,
              from: aliasDestination
            };
          }
          if (destination) {
            usedComponents.add(name);
            return {
              name,
              from: destination
            };
          }
        }
      },
      {
        type: "directive",
        resolve(name) {
          const prefixedName = `v${name}`;
          const destination = dirImports.get(prefixedName);
          if (destination) {
            usedDirectives.add(prefixedName);
            return {
              name: prefixedName,
              from: destination
            };
          }
        }
      }
    ];
    return resolvers;
  },
  {
    __usedComponents: usedComponents,
    __usedDirectives: usedDirectives
  }
);
const rtlPlugin = {
  install(app, options) {
    const rtlDefault = false;
    const localeDefault = void 0;
    const rtlInitial = typeof options?.rtl === "boolean" ? rtlDefault : options?.rtl?.rtlInitial ?? rtlDefault;
    const localeInitial = typeof options?.rtl === "boolean" ? localeDefault : options?.rtl?.localeInitial ?? localeDefault;
    const isRtl = ref(rtlInitial);
    const locale = ref(localeInitial);
    app.provide(rtlRegistryKey, { isRtl, locale });
  }
};
const registryPlugin = {
  install(app) {
    const { register, values } = _newShowHideRegistry();
    app.provide(showHideRegistryKey, { register, values });
    const items = ref({
      [breadcrumbGlobalIndexKey]: []
    });
    const reset = (key = breadcrumbGlobalIndexKey) => {
      items.value[key] = [];
    };
    app.provide(breadcrumbRegistryKey, { items, reset });
    const stack = ref(/* @__PURE__ */ new Map());
    const countStack = computed(() => stack.value.size);
    const valuesStack = computed(() => [...stack.value.values()]);
    const lastStack = computed(() => valuesStack.value[valuesStack.value.length - 1]);
    const pushStack = (modal) => {
      stack.value.set(modal.uid, modal);
    };
    const removeStack = (modal) => {
      stack.value.delete(modal.uid);
    };
    const registry = ref(/* @__PURE__ */ new Map());
    const pushRegistry = (modal) => {
      registry.value.set(modal.uid, modal);
    };
    const removeRegistry = (modal) => {
      registry.value.delete(modal.uid);
    };
    app.provide(modalManagerKey, {
      countStack,
      lastStack,
      registry: computed(() => registry.value),
      stack: valuesStack,
      pushStack,
      removeStack,
      pushRegistry,
      removeRegistry
    });
  }
};
const orchestratorPlugin = {
  install(app) {
    const orchestratorRegistry = _newOrchestratorRegistry();
    app.provide(orchestratorRegistryKey, orchestratorRegistry);
  }
};
const createBootstrap = (pluginData = {}) => ({
  install(app) {
    if ((pluginData.registries ?? true) === true) {
      app.use(registryPlugin, pluginData);
    }
    if ((pluginData.rtl ?? true) === true || typeof pluginData.rtl === "object") {
      app.use(rtlPlugin, pluginData);
    }
    if ((pluginData.orchestrator ?? true) === true) {
      app.use(orchestratorPlugin);
    }
    const val = pluginData?.components ?? {};
    app.provide(defaultsKey, ref(val));
  }
});
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var sweetalert_min$1 = { exports: {} };
var sweetalert_min = sweetalert_min$1.exports;
var hasRequiredSweetalert_min;
function requireSweetalert_min() {
  if (hasRequiredSweetalert_min) return sweetalert_min$1.exports;
  hasRequiredSweetalert_min = 1;
  (function(module, exports$1) {
    !(function(t, e) {
      module.exports = e();
    })(sweetalert_min, function() {
      return (function(t) {
        function e(o) {
          if (n[o]) return n[o].exports;
          var r = n[o] = { i: o, l: false, exports: {} };
          return t[o].call(r.exports, r, r.exports, e), r.l = true, r.exports;
        }
        var n = {};
        return e.m = t, e.c = n, e.d = function(t2, n2, o) {
          e.o(t2, n2) || Object.defineProperty(t2, n2, { configurable: false, enumerable: true, get: o });
        }, e.n = function(t2) {
          var n2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return e.d(n2, "a", n2), n2;
        }, e.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, e.p = "", e(e.s = 8);
      })([function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = "swal-button";
        e.CLASS_NAMES = { MODAL: "swal-modal", OVERLAY: "swal-overlay", SHOW_MODAL: "swal-overlay--show-modal", MODAL_TITLE: "swal-title", MODAL_TEXT: "swal-text", ICON: "swal-icon", ICON_CUSTOM: "swal-icon--custom", CONTENT: "swal-content", FOOTER: "swal-footer", BUTTON_CONTAINER: "swal-button-container", BUTTON: o, CONFIRM_BUTTON: o + "--confirm", CANCEL_BUTTON: o + "--cancel", DANGER_BUTTON: o + "--danger", BUTTON_LOADING: o + "--loading", BUTTON_LOADER: o + "__loader" }, e.default = e.CLASS_NAMES;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true }), e.getNode = function(t2) {
          var e2 = "." + t2;
          return document.querySelector(e2);
        }, e.stringToNode = function(t2) {
          var e2 = document.createElement("div");
          return e2.innerHTML = t2.trim(), e2.firstChild;
        }, e.insertAfter = function(t2, e2) {
          var n2 = e2.nextSibling;
          e2.parentNode.insertBefore(t2, n2);
        }, e.removeNode = function(t2) {
          t2.parentElement.removeChild(t2);
        }, e.throwErr = function(t2) {
          throw t2 = t2.replace(/ +(?= )/g, ""), "SweetAlert: " + (t2 = t2.trim());
        }, e.isPlainObject = function(t2) {
          if ("[object Object]" !== Object.prototype.toString.call(t2)) return false;
          var e2 = Object.getPrototypeOf(t2);
          return null === e2 || e2 === Object.prototype;
        }, e.ordinalSuffixOf = function(t2) {
          var e2 = t2 % 10, n2 = t2 % 100;
          return 1 === e2 && 11 !== n2 ? t2 + "st" : 2 === e2 && 12 !== n2 ? t2 + "nd" : 3 === e2 && 13 !== n2 ? t2 + "rd" : t2 + "th";
        };
      }, function(t, e, n) {
        function o(t2) {
          for (var n2 in t2) e.hasOwnProperty(n2) || (e[n2] = t2[n2]);
        }
        Object.defineProperty(e, "__esModule", { value: true }), o(n(25));
        var r = n(26);
        e.overlayMarkup = r.default, o(n(27)), o(n(28)), o(n(29));
        var i = n(0), a = i.default.MODAL_TITLE, s = i.default.MODAL_TEXT, c = i.default.ICON, l = i.default.FOOTER;
        e.iconMarkup = '\n  <div class="' + c + '"></div>', e.titleMarkup = '\n  <div class="' + a + '"></div>\n', e.textMarkup = '\n  <div class="' + s + '"></div>', e.footerMarkup = '\n  <div class="' + l + '"></div>\n';
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1);
        e.CONFIRM_KEY = "confirm", e.CANCEL_KEY = "cancel";
        var r = { visible: true, text: null, value: null, className: "", closeModal: true }, i = Object.assign({}, r, { visible: false, text: "Cancel", value: null }), a = Object.assign({}, r, { text: "OK", value: true });
        e.defaultButtonList = { cancel: i, confirm: a };
        var s = function(t2) {
          switch (t2) {
            case e.CONFIRM_KEY:
              return a;
            case e.CANCEL_KEY:
              return i;
            default:
              var n2 = t2.charAt(0).toUpperCase() + t2.slice(1);
              return Object.assign({}, r, { text: n2, value: t2 });
          }
        }, c = function(t2, e2) {
          var n2 = s(t2);
          return true === e2 ? Object.assign({}, n2, { visible: true }) : "string" == typeof e2 ? Object.assign({}, n2, { visible: true, text: e2 }) : o.isPlainObject(e2) ? Object.assign({ visible: true }, n2, e2) : Object.assign({}, n2, { visible: false });
        }, l = function(t2) {
          for (var e2 = {}, n2 = 0, o2 = Object.keys(t2); n2 < o2.length; n2++) {
            var r2 = o2[n2], a2 = t2[r2], s2 = c(r2, a2);
            e2[r2] = s2;
          }
          return e2.cancel || (e2.cancel = i), e2;
        }, u = function(t2) {
          var n2 = {};
          switch (t2.length) {
            case 1:
              n2[e.CANCEL_KEY] = Object.assign({}, i, { visible: false });
              break;
            case 2:
              n2[e.CANCEL_KEY] = c(e.CANCEL_KEY, t2[0]), n2[e.CONFIRM_KEY] = c(e.CONFIRM_KEY, t2[1]);
              break;
            default:
              o.throwErr("Invalid number of 'buttons' in array (" + t2.length + ").\n      If you want more than 2 buttons, you need to use an object!");
          }
          return n2;
        };
        e.getButtonListOpts = function(t2) {
          var n2 = e.defaultButtonList;
          return "string" == typeof t2 ? n2[e.CONFIRM_KEY] = c(e.CONFIRM_KEY, t2) : Array.isArray(t2) ? n2 = u(t2) : o.isPlainObject(t2) ? n2 = l(t2) : true === t2 ? n2 = u([true, true]) : false === t2 ? n2 = u([false, false]) : void 0 === t2 && (n2 = e.defaultButtonList), n2;
        };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(2), i = n(0), a = i.default.MODAL, s = i.default.OVERLAY, c = n(30), l = n(31), u = n(32), f = n(33);
        e.injectElIntoModal = function(t2) {
          var e2 = o.getNode(a), n2 = o.stringToNode(t2);
          return e2.appendChild(n2), n2;
        };
        var d = function(t2) {
          t2.className = a, t2.textContent = "";
        }, p = function(t2, e2) {
          d(t2);
          var n2 = e2.className;
          n2 && t2.classList.add(n2);
        };
        e.initModalContent = function(t2) {
          var e2 = o.getNode(a);
          p(e2, t2), c.default(t2.icon), l.initTitle(t2.title), l.initText(t2.text), f.default(t2.content), u.default(t2.buttons, t2.dangerMode);
        };
        var m = function() {
          var t2 = o.getNode(s), e2 = o.stringToNode(r.modalMarkup);
          t2.appendChild(e2);
        };
        e.default = m;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(3), r = { isOpen: false, promise: null, actions: {}, timer: null }, i = Object.assign({}, r);
        e.resetState = function() {
          i = Object.assign({}, r);
        }, e.setActionValue = function(t2) {
          if ("string" == typeof t2) return a(o.CONFIRM_KEY, t2);
          for (var e2 in t2) a(e2, t2[e2]);
        };
        var a = function(t2, e2) {
          i.actions[t2] || (i.actions[t2] = {}), Object.assign(i.actions[t2], { value: e2 });
        };
        e.setActionOptionsFor = function(t2, e2) {
          var n2 = (void 0 === e2 ? {} : e2).closeModal, o2 = void 0 === n2 || n2;
          Object.assign(i.actions[t2], { closeModal: o2 });
        }, e.default = i;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(3), i = n(0), a = i.default.OVERLAY, s = i.default.SHOW_MODAL, c = i.default.BUTTON, l = i.default.BUTTON_LOADING, u = n(5);
        e.openModal = function() {
          o.getNode(a).classList.add(s), u.default.isOpen = true;
        };
        var f = function() {
          o.getNode(a).classList.remove(s), u.default.isOpen = false;
        };
        e.onAction = function(t2) {
          void 0 === t2 && (t2 = r.CANCEL_KEY);
          var e2 = u.default.actions[t2], n2 = e2.value;
          if (false === e2.closeModal) {
            var i2 = c + "--" + t2;
            o.getNode(i2).classList.add(l);
          } else f();
          u.default.promise.resolve(n2);
        }, e.getState = function() {
          var t2 = Object.assign({}, u.default);
          return delete t2.promise, delete t2.timer, t2;
        }, e.stopLoading = function() {
          for (var t2 = document.querySelectorAll("." + c), e2 = 0; e2 < t2.length; e2++) {
            t2[e2].classList.remove(l);
          }
        };
      }, function(t, e) {
        var n;
        n = /* @__PURE__ */ (function() {
          return this;
        })();
        try {
          n = n || Function("return this")() || (0, eval)("this");
        } catch (t2) {
          "object" == typeof window && (n = window);
        }
        t.exports = n;
      }, function(t, e, n) {
        (function(e2) {
          t.exports = e2.sweetAlert = n(9);
        }).call(e, n(7));
      }, function(t, e, n) {
        (function(e2) {
          t.exports = e2.swal = n(10);
        }).call(e, n(7));
      }, function(t, e, n) {
        "undefined" != typeof window && n(11), n(16);
        var o = n(23).default;
        t.exports = o;
      }, function(t, e, n) {
        var o = n(12);
        "string" == typeof o && (o = [[t.i, o, ""]]);
        var r = { insertAt: "top" };
        r.transform = void 0;
        n(14)(o, r);
        o.locals && (t.exports = o.locals);
      }, function(t, e, n) {
        e = t.exports = n(13)(void 0), e.push([t.i, '.swal-icon--error{border-color:#f27474;-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}.swal-icon--error__x-mark{position:relative;display:block;-webkit-animation:animateXMark .5s;animation:animateXMark .5s}.swal-icon--error__line{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal-icon--error__line--left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal-icon--error__line--right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}@-webkit-keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@-webkit-keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal-icon--warning{border-color:#f8bb86;-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}.swal-icon--warning__body{width:5px;height:47px;top:10px;border-radius:2px;margin-left:-2px}.swal-icon--warning__body,.swal-icon--warning__dot{position:absolute;left:50%;background-color:#f8bb86}.swal-icon--warning__dot{width:7px;height:7px;border-radius:50%;margin-left:-4px;bottom:-11px}@-webkit-keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}@keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}.swal-icon--success{border-color:#a5dc86}.swal-icon--success:after,.swal-icon--success:before{content:"";border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal-icon--success:before{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal-icon--success:after{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px;-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}.swal-icon--success__ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal-icon--success__hide-corners{width:5px;height:90px;background-color:#fff;padding:1px;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal-icon--success__line{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal-icon--success__line--tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.swal-icon--success__line--long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}.swal-icon--info{border-color:#c9dae1}.swal-icon--info:before{width:5px;height:29px;bottom:17px;border-radius:2px;margin-left:-2px}.swal-icon--info:after,.swal-icon--info:before{content:"";position:absolute;left:50%;background-color:#c9dae1}.swal-icon--info:after{width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px}.swal-icon{width:80px;height:80px;border-width:4px;border-style:solid;border-radius:50%;padding:0;position:relative;box-sizing:content-box;margin:20px auto}.swal-icon:first-child{margin-top:32px}.swal-icon--custom{width:auto;height:auto;max-width:100%;border:none;border-radius:0}.swal-icon img{max-width:100%;max-height:100%}.swal-title{color:rgba(0,0,0,.65);font-weight:600;text-transform:none;position:relative;display:block;padding:13px 16px;font-size:27px;line-height:normal;text-align:center;margin-bottom:0}.swal-title:first-child{margin-top:26px}.swal-title:not(:first-child){padding-bottom:0}.swal-title:not(:last-child){margin-bottom:13px}.swal-text{font-size:16px;position:relative;float:none;line-height:normal;vertical-align:top;text-align:left;display:inline-block;margin:0;padding:0 10px;font-weight:400;color:rgba(0,0,0,.64);max-width:calc(100% - 20px);overflow-wrap:break-word;box-sizing:border-box}.swal-text:first-child{margin-top:45px}.swal-text:last-child{margin-bottom:45px}.swal-footer{text-align:right;padding-top:13px;margin-top:13px;padding:13px 16px;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}.swal-button-container{margin:5px;display:inline-block;position:relative}.swal-button{background-color:#7cd1f9;color:#fff;border:none;box-shadow:none;border-radius:5px;font-weight:600;font-size:14px;padding:10px 24px;margin:0;cursor:pointer}.swal-button:not([disabled]):hover{background-color:#78cbf2}.swal-button:active{background-color:#70bce0}.swal-button:focus{outline:none;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(43,114,165,.29)}.swal-button[disabled]{opacity:.5;cursor:default}.swal-button::-moz-focus-inner{border:0}.swal-button--cancel{color:#555;background-color:#efefef}.swal-button--cancel:not([disabled]):hover{background-color:#e8e8e8}.swal-button--cancel:active{background-color:#d7d7d7}.swal-button--cancel:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(116,136,150,.29)}.swal-button--danger{background-color:#e64942}.swal-button--danger:not([disabled]):hover{background-color:#df4740}.swal-button--danger:active{background-color:#cf423b}.swal-button--danger:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(165,43,43,.29)}.swal-content{padding:0 20px;margin-top:20px;font-size:medium}.swal-content:last-child{margin-bottom:20px}.swal-content__input,.swal-content__textarea{-webkit-appearance:none;background-color:#fff;border:none;font-size:14px;display:block;box-sizing:border-box;width:100%;border:1px solid rgba(0,0,0,.14);padding:10px 13px;border-radius:2px;transition:border-color .2s}.swal-content__input:focus,.swal-content__textarea:focus{outline:none;border-color:#6db8ff}.swal-content__textarea{resize:vertical}.swal-button--loading{color:transparent}.swal-button--loading~.swal-button__loader{opacity:1}.swal-button__loader{position:absolute;height:auto;width:43px;z-index:2;left:50%;top:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);text-align:center;pointer-events:none;opacity:0}.swal-button__loader div{display:inline-block;float:none;vertical-align:baseline;width:9px;height:9px;padding:0;border:none;margin:2px;opacity:.4;border-radius:7px;background-color:hsla(0,0%,100%,.9);transition:background .2s;-webkit-animation:swal-loading-anim 1s infinite;animation:swal-loading-anim 1s infinite}.swal-button__loader div:nth-child(3n+2){-webkit-animation-delay:.15s;animation-delay:.15s}.swal-button__loader div:nth-child(3n+3){-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}@keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}.swal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;text-align:center;font-size:0;overflow-y:auto;background-color:rgba(0,0,0,.4);z-index:10000;pointer-events:none;opacity:0;transition:opacity .3s}.swal-overlay:before{content:" ";display:inline-block;vertical-align:middle;height:100%}.swal-overlay--show-modal{opacity:1;pointer-events:auto}.swal-overlay--show-modal .swal-modal{opacity:1;pointer-events:auto;box-sizing:border-box;-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s;will-change:transform}.swal-modal{width:478px;opacity:0;pointer-events:none;background-color:#fff;text-align:center;border-radius:5px;position:static;margin:20px auto;display:inline-block;vertical-align:middle;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;z-index:10001;transition:opacity .2s,-webkit-transform .3s;transition:transform .3s,opacity .2s;transition:transform .3s,opacity .2s,-webkit-transform .3s}@media (max-width:500px){.swal-modal{width:calc(100% - 20px)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}', ""]);
      }, function(t, e) {
        function n(t2, e2) {
          var n2 = t2[1] || "", r = t2[3];
          if (!r) return n2;
          if (e2 && "function" == typeof btoa) {
            var i = o(r);
            return [n2].concat(r.sources.map(function(t3) {
              return "/*# sourceURL=" + r.sourceRoot + t3 + " */";
            })).concat([i]).join("\n");
          }
          return [n2].join("\n");
        }
        function o(t2) {
          return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(t2)))) + " */";
        }
        t.exports = function(t2) {
          var e2 = [];
          return e2.toString = function() {
            return this.map(function(e3) {
              var o2 = n(e3, t2);
              return e3[2] ? "@media " + e3[2] + "{" + o2 + "}" : o2;
            }).join("");
          }, e2.i = function(t3, n2) {
            "string" == typeof t3 && (t3 = [[null, t3, ""]]);
            for (var o2 = {}, r = 0; r < this.length; r++) {
              var i = this[r][0];
              "number" == typeof i && (o2[i] = true);
            }
            for (r = 0; r < t3.length; r++) {
              var a = t3[r];
              "number" == typeof a[0] && o2[a[0]] || (n2 && !a[2] ? a[2] = n2 : n2 && (a[2] = "(" + a[2] + ") and (" + n2 + ")"), e2.push(a));
            }
          }, e2;
        };
      }, function(t, e, n) {
        function o(t2, e2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var o2 = t2[n2], r2 = m[o2.id];
            if (r2) {
              r2.refs++;
              for (var i2 = 0; i2 < r2.parts.length; i2++) r2.parts[i2](o2.parts[i2]);
              for (; i2 < o2.parts.length; i2++) r2.parts.push(u(o2.parts[i2], e2));
            } else {
              for (var a2 = [], i2 = 0; i2 < o2.parts.length; i2++) a2.push(u(o2.parts[i2], e2));
              m[o2.id] = { id: o2.id, refs: 1, parts: a2 };
            }
          }
        }
        function r(t2, e2) {
          for (var n2 = [], o2 = {}, r2 = 0; r2 < t2.length; r2++) {
            var i2 = t2[r2], a2 = e2.base ? i2[0] + e2.base : i2[0], s2 = i2[1], c2 = i2[2], l2 = i2[3], u2 = { css: s2, media: c2, sourceMap: l2 };
            o2[a2] ? o2[a2].parts.push(u2) : n2.push(o2[a2] = { id: a2, parts: [u2] });
          }
          return n2;
        }
        function i(t2, e2) {
          var n2 = v(t2.insertInto);
          if (!n2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
          var o2 = w[w.length - 1];
          if ("top" === t2.insertAt) o2 ? o2.nextSibling ? n2.insertBefore(e2, o2.nextSibling) : n2.appendChild(e2) : n2.insertBefore(e2, n2.firstChild), w.push(e2);
          else {
            if ("bottom" !== t2.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
            n2.appendChild(e2);
          }
        }
        function a(t2) {
          if (null === t2.parentNode) return false;
          t2.parentNode.removeChild(t2);
          var e2 = w.indexOf(t2);
          e2 >= 0 && w.splice(e2, 1);
        }
        function s(t2) {
          var e2 = document.createElement("style");
          return t2.attrs.type = "text/css", l(e2, t2.attrs), i(t2, e2), e2;
        }
        function c(t2) {
          var e2 = document.createElement("link");
          return t2.attrs.type = "text/css", t2.attrs.rel = "stylesheet", l(e2, t2.attrs), i(t2, e2), e2;
        }
        function l(t2, e2) {
          Object.keys(e2).forEach(function(n2) {
            t2.setAttribute(n2, e2[n2]);
          });
        }
        function u(t2, e2) {
          var n2, o2, r2, i2;
          if (e2.transform && t2.css) {
            if (!(i2 = e2.transform(t2.css))) return function() {
            };
            t2.css = i2;
          }
          if (e2.singleton) {
            var l2 = h2++;
            n2 = g || (g = s(e2)), o2 = f.bind(null, n2, l2, false), r2 = f.bind(null, n2, l2, true);
          } else t2.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n2 = c(e2), o2 = p.bind(null, n2, e2), r2 = function() {
            a(n2), n2.href && URL.revokeObjectURL(n2.href);
          }) : (n2 = s(e2), o2 = d.bind(null, n2), r2 = function() {
            a(n2);
          });
          return o2(t2), function(e3) {
            if (e3) {
              if (e3.css === t2.css && e3.media === t2.media && e3.sourceMap === t2.sourceMap) return;
              o2(t2 = e3);
            } else r2();
          };
        }
        function f(t2, e2, n2, o2) {
          var r2 = n2 ? "" : o2.css;
          if (t2.styleSheet) t2.styleSheet.cssText = x(e2, r2);
          else {
            var i2 = document.createTextNode(r2), a2 = t2.childNodes;
            a2[e2] && t2.removeChild(a2[e2]), a2.length ? t2.insertBefore(i2, a2[e2]) : t2.appendChild(i2);
          }
        }
        function d(t2, e2) {
          var n2 = e2.css, o2 = e2.media;
          if (o2 && t2.setAttribute("media", o2), t2.styleSheet) t2.styleSheet.cssText = n2;
          else {
            for (; t2.firstChild; ) t2.removeChild(t2.firstChild);
            t2.appendChild(document.createTextNode(n2));
          }
        }
        function p(t2, e2, n2) {
          var o2 = n2.css, r2 = n2.sourceMap, i2 = void 0 === e2.convertToAbsoluteUrls && r2;
          (e2.convertToAbsoluteUrls || i2) && (o2 = y(o2)), r2 && (o2 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r2)))) + " */");
          var a2 = new Blob([o2], { type: "text/css" }), s2 = t2.href;
          t2.href = URL.createObjectURL(a2), s2 && URL.revokeObjectURL(s2);
        }
        var m = {}, b = /* @__PURE__ */ (function(t2) {
          var e2;
          return function() {
            return void 0 === e2 && (e2 = t2.apply(this, arguments)), e2;
          };
        })(function() {
          return window && document && document.all && !window.atob;
        }), v = /* @__PURE__ */ (function(t2) {
          var e2 = {};
          return function(n2) {
            return void 0 === e2[n2] && (e2[n2] = t2.call(this, n2)), e2[n2];
          };
        })(function(t2) {
          return document.querySelector(t2);
        }), g = null, h2 = 0, w = [], y = n(15);
        t.exports = function(t2, e2) {
          if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
          e2 = e2 || {}, e2.attrs = "object" == typeof e2.attrs ? e2.attrs : {}, e2.singleton || (e2.singleton = b()), e2.insertInto || (e2.insertInto = "head"), e2.insertAt || (e2.insertAt = "bottom");
          var n2 = r(t2, e2);
          return o(n2, e2), function(t3) {
            for (var i2 = [], a2 = 0; a2 < n2.length; a2++) {
              var s2 = n2[a2], c2 = m[s2.id];
              c2.refs--, i2.push(c2);
            }
            if (t3) {
              o(r(t3, e2), e2);
            }
            for (var a2 = 0; a2 < i2.length; a2++) {
              var c2 = i2[a2];
              if (0 === c2.refs) {
                for (var l2 = 0; l2 < c2.parts.length; l2++) c2.parts[l2]();
                delete m[c2.id];
              }
            }
          };
        };
        var x = /* @__PURE__ */ (function() {
          var t2 = [];
          return function(e2, n2) {
            return t2[e2] = n2, t2.filter(Boolean).join("\n");
          };
        })();
      }, function(t, e) {
        t.exports = function(t2) {
          var e2 = "undefined" != typeof window && window.location;
          if (!e2) throw new Error("fixUrls requires window.location");
          if (!t2 || "string" != typeof t2) return t2;
          var n = e2.protocol + "//" + e2.host, o = n + e2.pathname.replace(/\/[^\/]*$/, "/");
          return t2.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(t3, e3) {
            var r = e3.trim().replace(/^"(.*)"$/, function(t4, e4) {
              return e4;
            }).replace(/^'(.*)'$/, function(t4, e4) {
              return e4;
            });
            if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r)) return t3;
            var i;
            return i = 0 === r.indexOf("//") ? r : 0 === r.indexOf("/") ? n + r : o + r.replace(/^\.\//, ""), "url(" + JSON.stringify(i) + ")";
          });
        };
      }, function(t, e, n) {
        var o = n(17);
        "undefined" == typeof window || window.Promise || (window.Promise = o), n(21), String.prototype.includes || (String.prototype.includes = function(t2, e2) {
          return "number" != typeof e2 && (e2 = 0), !(e2 + t2.length > this.length) && -1 !== this.indexOf(t2, e2);
        }), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", { value: function(t2, e2) {
          if (null == this) throw new TypeError('"this" is null or not defined');
          var n2 = Object(this), o2 = n2.length >>> 0;
          if (0 === o2) return false;
          for (var r = 0 | e2, i = Math.max(r >= 0 ? r : o2 - Math.abs(r), 0); i < o2; ) {
            if ((function(t3, e3) {
              return t3 === e3 || "number" == typeof t3 && "number" == typeof e3 && isNaN(t3) && isNaN(e3);
            })(n2[i], t2)) return true;
            i++;
          }
          return false;
        } }), "undefined" != typeof window && (function(t2) {
          t2.forEach(function(t3) {
            t3.hasOwnProperty("remove") || Object.defineProperty(t3, "remove", { configurable: true, enumerable: true, writable: true, value: function() {
              this.parentNode.removeChild(this);
            } });
          });
        })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
      }, function(t, e, n) {
        (function(e2) {
          !(function(n2) {
            function o() {
            }
            function r(t2, e3) {
              return function() {
                t2.apply(e3, arguments);
              };
            }
            function i(t2) {
              if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
              if ("function" != typeof t2) throw new TypeError("not a function");
              this._state = 0, this._handled = false, this._value = void 0, this._deferreds = [], f(t2, this);
            }
            function a(t2, e3) {
              for (; 3 === t2._state; ) t2 = t2._value;
              if (0 === t2._state) return void t2._deferreds.push(e3);
              t2._handled = true, i._immediateFn(function() {
                var n3 = 1 === t2._state ? e3.onFulfilled : e3.onRejected;
                if (null === n3) return void (1 === t2._state ? s : c)(e3.promise, t2._value);
                var o2;
                try {
                  o2 = n3(t2._value);
                } catch (t3) {
                  return void c(e3.promise, t3);
                }
                s(e3.promise, o2);
              });
            }
            function s(t2, e3) {
              try {
                if (e3 === t2) throw new TypeError("A promise cannot be resolved with itself.");
                if (e3 && ("object" == typeof e3 || "function" == typeof e3)) {
                  var n3 = e3.then;
                  if (e3 instanceof i) return t2._state = 3, t2._value = e3, void l(t2);
                  if ("function" == typeof n3) return void f(r(n3, e3), t2);
                }
                t2._state = 1, t2._value = e3, l(t2);
              } catch (e4) {
                c(t2, e4);
              }
            }
            function c(t2, e3) {
              t2._state = 2, t2._value = e3, l(t2);
            }
            function l(t2) {
              2 === t2._state && 0 === t2._deferreds.length && i._immediateFn(function() {
                t2._handled || i._unhandledRejectionFn(t2._value);
              });
              for (var e3 = 0, n3 = t2._deferreds.length; e3 < n3; e3++) a(t2, t2._deferreds[e3]);
              t2._deferreds = null;
            }
            function u(t2, e3, n3) {
              this.onFulfilled = "function" == typeof t2 ? t2 : null, this.onRejected = "function" == typeof e3 ? e3 : null, this.promise = n3;
            }
            function f(t2, e3) {
              var n3 = false;
              try {
                t2(function(t3) {
                  n3 || (n3 = true, s(e3, t3));
                }, function(t3) {
                  n3 || (n3 = true, c(e3, t3));
                });
              } catch (t3) {
                if (n3) return;
                n3 = true, c(e3, t3);
              }
            }
            var d = setTimeout;
            i.prototype.catch = function(t2) {
              return this.then(null, t2);
            }, i.prototype.then = function(t2, e3) {
              var n3 = new this.constructor(o);
              return a(this, new u(t2, e3, n3)), n3;
            }, i.all = function(t2) {
              var e3 = Array.prototype.slice.call(t2);
              return new i(function(t3, n3) {
                function o2(i3, a2) {
                  try {
                    if (a2 && ("object" == typeof a2 || "function" == typeof a2)) {
                      var s2 = a2.then;
                      if ("function" == typeof s2) return void s2.call(a2, function(t4) {
                        o2(i3, t4);
                      }, n3);
                    }
                    e3[i3] = a2, 0 == --r2 && t3(e3);
                  } catch (t4) {
                    n3(t4);
                  }
                }
                if (0 === e3.length) return t3([]);
                for (var r2 = e3.length, i2 = 0; i2 < e3.length; i2++) o2(i2, e3[i2]);
              });
            }, i.resolve = function(t2) {
              return t2 && "object" == typeof t2 && t2.constructor === i ? t2 : new i(function(e3) {
                e3(t2);
              });
            }, i.reject = function(t2) {
              return new i(function(e3, n3) {
                n3(t2);
              });
            }, i.race = function(t2) {
              return new i(function(e3, n3) {
                for (var o2 = 0, r2 = t2.length; o2 < r2; o2++) t2[o2].then(e3, n3);
              });
            }, i._immediateFn = "function" == typeof e2 && function(t2) {
              e2(t2);
            } || function(t2) {
              d(t2, 0);
            }, i._unhandledRejectionFn = function(t2) {
              "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t2);
            }, i._setImmediateFn = function(t2) {
              i._immediateFn = t2;
            }, i._setUnhandledRejectionFn = function(t2) {
              i._unhandledRejectionFn = t2;
            }, void 0 !== t && t.exports ? t.exports = i : n2.Promise || (n2.Promise = i);
          })(this);
        }).call(e, n(18).setImmediate);
      }, function(t, e, n) {
        function o(t2, e2) {
          this._id = t2, this._clearFn = e2;
        }
        var r = Function.prototype.apply;
        e.setTimeout = function() {
          return new o(r.call(setTimeout, window, arguments), clearTimeout);
        }, e.setInterval = function() {
          return new o(r.call(setInterval, window, arguments), clearInterval);
        }, e.clearTimeout = e.clearInterval = function(t2) {
          t2 && t2.close();
        }, o.prototype.unref = o.prototype.ref = function() {
        }, o.prototype.close = function() {
          this._clearFn.call(window, this._id);
        }, e.enroll = function(t2, e2) {
          clearTimeout(t2._idleTimeoutId), t2._idleTimeout = e2;
        }, e.unenroll = function(t2) {
          clearTimeout(t2._idleTimeoutId), t2._idleTimeout = -1;
        }, e._unrefActive = e.active = function(t2) {
          clearTimeout(t2._idleTimeoutId);
          var e2 = t2._idleTimeout;
          e2 >= 0 && (t2._idleTimeoutId = setTimeout(function() {
            t2._onTimeout && t2._onTimeout();
          }, e2));
        }, n(19), e.setImmediate = setImmediate, e.clearImmediate = clearImmediate;
      }, function(t, e, n) {
        (function(t2, e2) {
          !(function(t3, n2) {
            function o(t4) {
              "function" != typeof t4 && (t4 = new Function("" + t4));
              for (var e3 = new Array(arguments.length - 1), n3 = 0; n3 < e3.length; n3++) e3[n3] = arguments[n3 + 1];
              var o2 = { callback: t4, args: e3 };
              return l[c] = o2, s(c), c++;
            }
            function r(t4) {
              delete l[t4];
            }
            function i(t4) {
              var e3 = t4.callback, o2 = t4.args;
              switch (o2.length) {
                case 0:
                  e3();
                  break;
                case 1:
                  e3(o2[0]);
                  break;
                case 2:
                  e3(o2[0], o2[1]);
                  break;
                case 3:
                  e3(o2[0], o2[1], o2[2]);
                  break;
                default:
                  e3.apply(n2, o2);
              }
            }
            function a(t4) {
              if (u) setTimeout(a, 0, t4);
              else {
                var e3 = l[t4];
                if (e3) {
                  u = true;
                  try {
                    i(e3);
                  } finally {
                    r(t4), u = false;
                  }
                }
              }
            }
            if (!t3.setImmediate) {
              var s, c = 1, l = {}, u = false, f = t3.document, d = Object.getPrototypeOf && Object.getPrototypeOf(t3);
              d = d && d.setTimeout ? d : t3, "[object process]" === {}.toString.call(t3.process) ? (function() {
                s = function(t4) {
                  e2.nextTick(function() {
                    a(t4);
                  });
                };
              })() : (function() {
                if (t3.postMessage && !t3.importScripts) {
                  var e3 = true, n3 = t3.onmessage;
                  return t3.onmessage = function() {
                    e3 = false;
                  }, t3.postMessage("", "*"), t3.onmessage = n3, e3;
                }
              })() ? (function() {
                var e3 = "setImmediate$" + Math.random() + "$", n3 = function(n4) {
                  n4.source === t3 && "string" == typeof n4.data && 0 === n4.data.indexOf(e3) && a(+n4.data.slice(e3.length));
                };
                t3.addEventListener ? t3.addEventListener("message", n3, false) : t3.attachEvent("onmessage", n3), s = function(n4) {
                  t3.postMessage(e3 + n4, "*");
                };
              })() : t3.MessageChannel ? (function() {
                var t4 = new MessageChannel();
                t4.port1.onmessage = function(t5) {
                  a(t5.data);
                }, s = function(e3) {
                  t4.port2.postMessage(e3);
                };
              })() : f && "onreadystatechange" in f.createElement("script") ? (function() {
                var t4 = f.documentElement;
                s = function(e3) {
                  var n3 = f.createElement("script");
                  n3.onreadystatechange = function() {
                    a(e3), n3.onreadystatechange = null, t4.removeChild(n3), n3 = null;
                  }, t4.appendChild(n3);
                };
              })() : (function() {
                s = function(t4) {
                  setTimeout(a, 0, t4);
                };
              })(), d.setImmediate = o, d.clearImmediate = r;
            }
          })("undefined" == typeof self ? void 0 === t2 ? this : t2 : self);
        }).call(e, n(7), n(20));
      }, function(t, e) {
        function n() {
          throw new Error("setTimeout has not been defined");
        }
        function o() {
          throw new Error("clearTimeout has not been defined");
        }
        function r(t2) {
          if (u === setTimeout) return setTimeout(t2, 0);
          if ((u === n || !u) && setTimeout) return u = setTimeout, setTimeout(t2, 0);
          try {
            return u(t2, 0);
          } catch (e2) {
            try {
              return u.call(null, t2, 0);
            } catch (e3) {
              return u.call(this, t2, 0);
            }
          }
        }
        function i(t2) {
          if (f === clearTimeout) return clearTimeout(t2);
          if ((f === o || !f) && clearTimeout) return f = clearTimeout, clearTimeout(t2);
          try {
            return f(t2);
          } catch (e2) {
            try {
              return f.call(null, t2);
            } catch (e3) {
              return f.call(this, t2);
            }
          }
        }
        function a() {
          b && p && (b = false, p.length ? m = p.concat(m) : v = -1, m.length && s());
        }
        function s() {
          if (!b) {
            var t2 = r(a);
            b = true;
            for (var e2 = m.length; e2; ) {
              for (p = m, m = []; ++v < e2; ) p && p[v].run();
              v = -1, e2 = m.length;
            }
            p = null, b = false, i(t2);
          }
        }
        function c(t2, e2) {
          this.fun = t2, this.array = e2;
        }
        function l() {
        }
        var u, f, d = t.exports = {};
        !(function() {
          try {
            u = "function" == typeof setTimeout ? setTimeout : n;
          } catch (t2) {
            u = n;
          }
          try {
            f = "function" == typeof clearTimeout ? clearTimeout : o;
          } catch (t2) {
            f = o;
          }
        })();
        var p, m = [], b = false, v = -1;
        d.nextTick = function(t2) {
          var e2 = new Array(arguments.length - 1);
          if (arguments.length > 1) for (var n2 = 1; n2 < arguments.length; n2++) e2[n2 - 1] = arguments[n2];
          m.push(new c(t2, e2)), 1 !== m.length || b || r(s);
        }, c.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, d.title = "browser", d.browser = true, d.env = {}, d.argv = [], d.version = "", d.versions = {}, d.on = l, d.addListener = l, d.once = l, d.off = l, d.removeListener = l, d.removeAllListeners = l, d.emit = l, d.prependListener = l, d.prependOnceListener = l, d.listeners = function(t2) {
          return [];
        }, d.binding = function(t2) {
          throw new Error("process.binding is not supported");
        }, d.cwd = function() {
          return "/";
        }, d.chdir = function(t2) {
          throw new Error("process.chdir is not supported");
        }, d.umask = function() {
          return 0;
        };
      }, function(t, e, n) {
        n(22).polyfill();
      }, function(t, e, n) {
        function o(t2, e2) {
          if (void 0 === t2 || null === t2) throw new TypeError("Cannot convert first argument to object");
          for (var n2 = Object(t2), o2 = 1; o2 < arguments.length; o2++) {
            var r2 = arguments[o2];
            if (void 0 !== r2 && null !== r2) for (var i = Object.keys(Object(r2)), a = 0, s = i.length; a < s; a++) {
              var c = i[a], l = Object.getOwnPropertyDescriptor(r2, c);
              void 0 !== l && l.enumerable && (n2[c] = r2[c]);
            }
          }
          return n2;
        }
        function r() {
          Object.assign || Object.defineProperty(Object, "assign", { enumerable: false, configurable: true, writable: true, value: o });
        }
        t.exports = { assign: o, polyfill: r };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(24), r = n(6), i = n(5), a = n(36), s = function() {
          for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
          if ("undefined" != typeof window) {
            var n2 = a.getOpts.apply(void 0, t2);
            return new Promise(function(t3, e3) {
              i.default.promise = { resolve: t3, reject: e3 }, o.default(n2), setTimeout(function() {
                r.openModal();
              });
            });
          }
        };
        s.close = r.onAction, s.getState = r.getState, s.setActionValue = i.setActionValue, s.stopLoading = r.stopLoading, s.setDefaults = a.setDefaults, e.default = s;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(0), i = r.default.MODAL, a = n(4), s = n(34), c = n(35), l = n(1);
        e.init = function(t2) {
          o.getNode(i) || (document.body || l.throwErr("You can only use SweetAlert AFTER the DOM has loaded!"), s.default(), a.default()), a.initModalContent(t2), c.default(t2);
        }, e.default = e.init;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(0), r = o.default.MODAL;
        e.modalMarkup = '\n  <div class="' + r + '" role="dialog" aria-modal="true"></div>', e.default = e.modalMarkup;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(0), r = o.default.OVERLAY, i = '<div \n    class="' + r + '"\n    tabIndex="-1">\n  </div>';
        e.default = i;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(0), r = o.default.ICON;
        e.errorIconMarkup = function() {
          var t2 = r + "--error", e2 = t2 + "__line";
          return '\n    <div class="' + t2 + '__x-mark">\n      <span class="' + e2 + " " + e2 + '--left"></span>\n      <span class="' + e2 + " " + e2 + '--right"></span>\n    </div>\n  ';
        }, e.warningIconMarkup = function() {
          var t2 = r + "--warning";
          return '\n    <span class="' + t2 + '__body">\n      <span class="' + t2 + '__dot"></span>\n    </span>\n  ';
        }, e.successIconMarkup = function() {
          var t2 = r + "--success";
          return '\n    <span class="' + t2 + "__line " + t2 + '__line--long"></span>\n    <span class="' + t2 + "__line " + t2 + '__line--tip"></span>\n\n    <div class="' + t2 + '__ring"></div>\n    <div class="' + t2 + '__hide-corners"></div>\n  ';
        };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(0), r = o.default.CONTENT;
        e.contentMarkup = '\n  <div class="' + r + '">\n\n  </div>\n';
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(0), r = o.default.BUTTON_CONTAINER, i = o.default.BUTTON, a = o.default.BUTTON_LOADER;
        e.buttonMarkup = '\n  <div class="' + r + '">\n\n    <button\n      class="' + i + '"\n    ></button>\n\n    <div class="' + a + '">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n\n  </div>\n';
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(4), r = n(2), i = n(0), a = i.default.ICON, s = i.default.ICON_CUSTOM, c = ["error", "warning", "success", "info"], l = { error: r.errorIconMarkup(), warning: r.warningIconMarkup(), success: r.successIconMarkup() }, u = function(t2, e2) {
          var n2 = a + "--" + t2;
          e2.classList.add(n2);
          var o2 = l[t2];
          o2 && (e2.innerHTML = o2);
        }, f = function(t2, e2) {
          e2.classList.add(s);
          var n2 = document.createElement("img");
          n2.src = t2, e2.appendChild(n2);
        }, d = function(t2) {
          if (t2) {
            var e2 = o.injectElIntoModal(r.iconMarkup);
            c.includes(t2) ? u(t2, e2) : f(t2, e2);
          }
        };
        e.default = d;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(2), r = n(4), i = function(t2) {
          navigator.userAgent.includes("AppleWebKit") && (t2.style.display = "none", t2.offsetHeight, t2.style.display = "");
        };
        e.initTitle = function(t2) {
          if (t2) {
            var e2 = r.injectElIntoModal(o.titleMarkup);
            e2.textContent = t2, i(e2);
          }
        }, e.initText = function(t2) {
          if (t2) {
            var e2 = document.createDocumentFragment();
            t2.split("\n").forEach(function(t3, n3, o2) {
              e2.appendChild(document.createTextNode(t3)), n3 < o2.length - 1 && e2.appendChild(document.createElement("br"));
            });
            var n2 = r.injectElIntoModal(o.textMarkup);
            n2.appendChild(e2), i(n2);
          }
        };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(4), i = n(0), a = i.default.BUTTON, s = i.default.DANGER_BUTTON, c = n(3), l = n(2), u = n(6), f = n(5), d = function(t2, e2, n2) {
          var r2 = e2.text, i2 = e2.value, d2 = e2.className, p2 = e2.closeModal, m = o.stringToNode(l.buttonMarkup), b = m.querySelector("." + a), v = a + "--" + t2;
          if (b.classList.add(v), d2) {
            (Array.isArray(d2) ? d2 : d2.split(" ")).filter(function(t3) {
              return t3.length > 0;
            }).forEach(function(t3) {
              b.classList.add(t3);
            });
          }
          n2 && t2 === c.CONFIRM_KEY && b.classList.add(s), b.textContent = r2;
          var g = {};
          return g[t2] = i2, f.setActionValue(g), f.setActionOptionsFor(t2, { closeModal: p2 }), b.addEventListener("click", function() {
            return u.onAction(t2);
          }), m;
        }, p = function(t2, e2) {
          var n2 = r.injectElIntoModal(l.footerMarkup);
          for (var o2 in t2) {
            var i2 = t2[o2], a2 = d(o2, i2, e2);
            i2.visible && n2.appendChild(a2);
          }
          0 === n2.children.length && n2.remove();
        };
        e.default = p;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(3), r = n(4), i = n(2), a = n(5), s = n(6), c = n(0), l = c.default.CONTENT, u = function(t2) {
          t2.addEventListener("input", function(t3) {
            var e2 = t3.target, n2 = e2.value;
            a.setActionValue(n2);
          }), t2.addEventListener("keyup", function(t3) {
            if ("Enter" === t3.key) return s.onAction(o.CONFIRM_KEY);
          }), setTimeout(function() {
            t2.focus(), a.setActionValue("");
          }, 0);
        }, f = function(t2, e2, n2) {
          var o2 = document.createElement(e2), r2 = l + "__" + e2;
          o2.classList.add(r2);
          for (var i2 in n2) {
            var a2 = n2[i2];
            o2[i2] = a2;
          }
          "input" === e2 && u(o2), t2.appendChild(o2);
        }, d = function(t2) {
          if (t2) {
            var e2 = r.injectElIntoModal(i.contentMarkup), n2 = t2.element, o2 = t2.attributes;
            "string" == typeof n2 ? f(e2, n2, o2) : e2.appendChild(n2);
          }
        };
        e.default = d;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(2), i = function() {
          var t2 = o.stringToNode(r.overlayMarkup);
          document.body.appendChild(t2);
        };
        e.default = i;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(5), r = n(6), i = n(1), a = n(3), s = n(0), c = s.default.MODAL, l = s.default.BUTTON, u = s.default.OVERLAY, f = function(t2) {
          t2.preventDefault(), v();
        }, d = function(t2) {
          t2.preventDefault(), g();
        }, p = function(t2) {
          if (o.default.isOpen) switch (t2.key) {
            case "Escape":
              return r.onAction(a.CANCEL_KEY);
          }
        }, m = function(t2) {
          if (o.default.isOpen) switch (t2.key) {
            case "Tab":
              return f(t2);
          }
        }, b = function(t2) {
          if (o.default.isOpen) return "Tab" === t2.key && t2.shiftKey ? d(t2) : void 0;
        }, v = function() {
          var t2 = i.getNode(l);
          t2 && (t2.tabIndex = 0, t2.focus());
        }, g = function() {
          var t2 = i.getNode(c), e2 = t2.querySelectorAll("." + l), n2 = e2.length - 1, o2 = e2[n2];
          o2 && o2.focus();
        }, h2 = function(t2) {
          t2[t2.length - 1].addEventListener("keydown", m);
        }, w = function(t2) {
          t2[0].addEventListener("keydown", b);
        }, y = function() {
          var t2 = i.getNode(c), e2 = t2.querySelectorAll("." + l);
          e2.length && (h2(e2), w(e2));
        }, x = function(t2) {
          if (i.getNode(u) === t2.target) return r.onAction(a.CANCEL_KEY);
        }, _ = function(t2) {
          var e2 = i.getNode(u);
          e2.removeEventListener("click", x), t2 && e2.addEventListener("click", x);
        }, k = function(t2) {
          o.default.timer && clearTimeout(o.default.timer), t2 && (o.default.timer = window.setTimeout(function() {
            return r.onAction(a.CANCEL_KEY);
          }, t2));
        }, O = function(t2) {
          t2.closeOnEsc ? document.addEventListener("keyup", p) : document.removeEventListener("keyup", p), t2.dangerMode ? v() : g(), y(), _(t2.closeOnClickOutside), k(t2.timer);
        };
        e.default = O;
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = n(3), i = n(37), a = n(38), s = { title: null, text: null, icon: null, buttons: r.defaultButtonList, content: null, className: null, closeOnClickOutside: true, closeOnEsc: true, dangerMode: false, timer: null }, c = Object.assign({}, s);
        e.setDefaults = function(t2) {
          c = Object.assign({}, s, t2);
        };
        var l = function(t2) {
          var e2 = t2 && t2.button, n2 = t2 && t2.buttons;
          return void 0 !== e2 && void 0 !== n2 && o.throwErr("Cannot set both 'button' and 'buttons' options!"), void 0 !== e2 ? { confirm: e2 } : n2;
        }, u = function(t2) {
          return o.ordinalSuffixOf(t2 + 1);
        }, f = function(t2, e2) {
          o.throwErr(u(e2) + " argument ('" + t2 + "') is invalid");
        }, d = function(t2, e2) {
          var n2 = t2 + 1, r2 = e2[n2];
          o.isPlainObject(r2) || void 0 === r2 || o.throwErr("Expected " + u(n2) + " argument ('" + r2 + "') to be a plain object");
        }, p = function(t2, e2) {
          var n2 = t2 + 1, r2 = e2[n2];
          void 0 !== r2 && o.throwErr("Unexpected " + u(n2) + " argument (" + r2 + ")");
        }, m = function(t2, e2, n2, r2) {
          var i2 = typeof e2, a2 = "string" === i2, s2 = e2 instanceof Element;
          if (a2) {
            if (0 === n2) return { text: e2 };
            if (1 === n2) return { text: e2, title: r2[0] };
            if (2 === n2) return d(n2, r2), { icon: e2 };
            f(e2, n2);
          } else {
            if (s2 && 0 === n2) return d(n2, r2), { content: e2 };
            if (o.isPlainObject(e2)) return p(n2, r2), e2;
            f(e2, n2);
          }
        };
        e.getOpts = function() {
          for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
          var n2 = {};
          t2.forEach(function(e3, o3) {
            var r2 = m(0, e3, o3, t2);
            Object.assign(n2, r2);
          });
          var o2 = l(n2);
          n2.buttons = r.getButtonListOpts(o2), delete n2.button, n2.content = i.getContentOpts(n2.content);
          var u2 = Object.assign({}, s, c, n2);
          return Object.keys(u2).forEach(function(t3) {
            a.DEPRECATED_OPTS[t3] && a.logDeprecation(t3);
          }), u2;
        };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true });
        var o = n(1), r = { element: "input", attributes: { placeholder: "" } };
        e.getContentOpts = function(t2) {
          var e2 = {};
          return o.isPlainObject(t2) ? Object.assign(e2, t2) : t2 instanceof Element ? { element: t2 } : "input" === t2 ? r : null;
        };
      }, function(t, e, n) {
        Object.defineProperty(e, "__esModule", { value: true }), e.logDeprecation = function(t2) {
          var n2 = e.DEPRECATED_OPTS[t2], o = n2.onlyRename, r = n2.replacement, i = n2.subOption, a = n2.link, s = o ? "renamed" : "deprecated", c = 'SweetAlert warning: "' + t2 + '" option has been ' + s + ".";
          if (r) {
            c += " Please use" + (i ? ' "' + i + '" in ' : " ") + '"' + r + '" instead.';
          }
          var l = "https://sweetalert.js.org";
          c += a ? " More details: " + l + a : " More details: " + l + "/guides/#upgrading-from-1x", console.warn(c);
        }, e.DEPRECATED_OPTS = { type: { replacement: "icon", link: "/docs/#icon" }, imageUrl: { replacement: "icon", link: "/docs/#icon" }, customClass: { replacement: "className", onlyRename: true, link: "/docs/#classname" }, imageSize: {}, showCancelButton: { replacement: "buttons", link: "/docs/#buttons" }, showConfirmButton: { replacement: "button", link: "/docs/#button" }, confirmButtonText: { replacement: "button", link: "/docs/#button" }, confirmButtonColor: {}, cancelButtonText: { replacement: "buttons", link: "/docs/#buttons" }, closeOnConfirm: { replacement: "button", subOption: "closeModal", link: "/docs/#button" }, closeOnCancel: { replacement: "buttons", subOption: "closeModal", link: "/docs/#buttons" }, showLoaderOnConfirm: { replacement: "buttons" }, animation: {}, inputType: { replacement: "content", link: "/docs/#content" }, inputValue: { replacement: "content", link: "/docs/#content" }, inputPlaceholder: { replacement: "content", link: "/docs/#content" }, html: { replacement: "content", link: "/docs/#content" }, allowEscapeKey: { replacement: "closeOnEsc", onlyRename: true, link: "/docs/#closeonesc" }, allowClickOutside: { replacement: "closeOnClickOutside", onlyRename: true, link: "/docs/#closeonclickoutside" } };
      }]);
    });
  })(sweetalert_min$1);
  return sweetalert_min$1.exports;
}
var sweetalert_minExports = requireSweetalert_min();
const swal = /* @__PURE__ */ getDefaultExportFromCjs(sweetalert_minExports);
// @__NO_SIDE_EFFECTS__
function createGlobalState(stateFactory) {
  let initialized = false;
  let state;
  const scope = effectScope(true);
  return ((...args) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args));
      initialized = true;
    }
    return state;
  });
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), {
        fn,
        thisArg: this,
        args
      })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer$1) => {
    clearTimeout(timer$1);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const filter = (invoke$1) => {
    const duration = toValue$1(ms);
    const maxDuration = toValue$1(options.maxWait);
    if (timer) _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = void 0;
      }
      return Promise.resolve(invoke$1());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastInvoker = invoke$1;
      if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
        if (timer) _clearTimeout(timer);
        maxTimer = void 0;
        resolve(lastInvoker());
      }, maxDuration);
      timer = setTimeout(() => {
        if (maxTimer) _clearTimeout(maxTimer);
        maxTimer = void 0;
        resolve(invoke$1());
      }, duration);
    });
  };
  return filter;
}
// @__NO_SIDE_EFFECTS__
function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(debounceFilter(ms, options), fn);
}
const useSegmentEditor = /* @__PURE__ */ createGlobalState(() => {
  const editing = ref(false);
  const segment = ref();
  const isEditing = computed(() => editing.value && segment.value);
  const type = computed(() => segment.value?.type ?? null);
  const isChapter = computed(() => !Boolean(segment.value?.parentId));
  const currentEditingId = computed(() => segment.value?.id ?? null);
  const { loading: saving, wrap } = useLoading();
  async function edit(item) {
    close();
    await disableAutoSave(() => {
      segment.value = item;
      editing.value = true;
    });
  }
  function close() {
    segment.value = void 0;
    autoSave.value = false;
    editing.value = false;
  }
  const autoSave = ref(true);
  const save = wrap(async () => {
    if (!segment.value) {
      return;
    }
    if (editing.value === false) {
      return;
    }
    const start = Date.now();
    const { post } = await useHttpClient();
    await post(
      route("save_segment"),
      {
        item: segment.value,
        isNew: !segment.value.id
      }
    );
    const elapsed = Date.now() - start;
    if (elapsed < 500) {
      await sleep(500 - elapsed);
    }
  });
  const saveDebounced = /* @__PURE__ */ useDebounceFn(save, 500);
  async function disableAutoSave(handler) {
    autoSave.value = false;
    const r = await handler();
    autoSave.value = true;
    return r;
  }
  watch(segment, () => {
    if (autoSave.value) {
      saveDebounced();
    }
  }, { deep: true });
  function isActive(segment2) {
    return editing.value && segment2.id === currentEditingId.value;
  }
  return {
    segment,
    isChapter,
    type,
    saving,
    isEditing,
    currentEditingId,
    autoSave,
    edit,
    close,
    save,
    isActive,
    disableAutoSave
  };
});
var SegmentType = /* @__PURE__ */ ((SegmentType2) => {
  SegmentType2["VIDEO"] = "video";
  SegmentType2["HOMEWORK"] = "homework";
  SegmentType2["QUIZ"] = "quiz";
  return SegmentType2;
})(SegmentType || {});
var SegmentTypeColor = /* @__PURE__ */ ((SegmentTypeColor2) => {
  SegmentTypeColor2["video"] = "text-success";
  SegmentTypeColor2["homework"] = "text-warning";
  SegmentTypeColor2["quiz"] = "text-danger";
  return SegmentTypeColor2;
})(SegmentTypeColor || {});
var SegmentTypeIcon = /* @__PURE__ */ ((SegmentTypeIcon2) => {
  SegmentTypeIcon2["video"] = "fas fa-video";
  SegmentTypeIcon2["homework"] = "fas fa-home";
  SegmentTypeIcon2["quiz"] = "fa fa-pen-square";
  return SegmentTypeIcon2;
})(SegmentTypeIcon || {});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SectionItem",
  props: {
    section: {},
    chapterIndex: {},
    sectionIndex: {}
  },
  emits: ["edit", "delete", "save"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const {
      edit,
      isEditing,
      isActive
    } = useSegmentEditor();
    const { section } = toRefs(props);
    function deleteSection() {
      emit("delete", section.value.id);
    }
    function setPreview() {
      section.value.preview = !section.value.preview;
      emit("save", section.value);
    }
    function segmentTypeTitle(type) {
      switch (type) {
        case SegmentType.VIDEO:
          return "影片";
        case SegmentType.QUIZ:
          return "測驗";
        case SegmentType.HOMEWORK:
          return "作業";
        default:
          return "未知類型";
      }
    }
    const __returned__ = { props, emit, edit, isEditing, isActive, section, deleteSection, setPreview, segmentTypeTitle, get SegmentTypeColor() {
      return SegmentTypeColor;
    }, get SegmentTypeIcon() {
      return SegmentTypeIcon;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$3 = { class: "card border bg-white" };
const _hoisted_2$3 = {
  class: "c-section-item__content d-flex align-items-center gap-2 w-100",
  style: { "min-width": "1px" }
};
const _hoisted_3$3 = { class: "me-1" };
const _hoisted_4$3 = {
  class: "c-section-item__actions ms-auto d-flex align-items-center gap-2",
  style: { "z-index": "3" }
};
const _hoisted_5$3 = { class: "c-section-item__preview" };
const _hoisted_6$3 = ["innerHTML"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createElementVNode("div", {
      class: normalizeClass(["c-section-item card-body p-2", { "bg-primary-subtle": $setup.isActive($setup.section) }])
    }, [
      createElementVNode("div", _hoisted_2$3, [
        _cache[3] || (_cache[3] = createElementVNode("div", {
          class: "c-section-item__handle handle",
          style: { "cursor": "move", "z-index": "3" }
        }, [
          createElementVNode("span", { class: "fal fa-bars" })
        ], -1)),
        _cache[4] || (_cache[4] = createTextVNode()),
        createElementVNode("div", {
          class: normalizeClass(["fa-fw", $setup.SegmentTypeIcon[$setup.section.type]])
        }, null, 2),
        _cache[5] || (_cache[5] = createTextVNode()),
        createElementVNode("div", _hoisted_3$3, toDisplayString($setup.props.chapterIndex + 1) + "." + toDisplayString($setup.props.sectionIndex + 1), 1),
        _cache[6] || (_cache[6] = createTextVNode()),
        createElementVNode("a", {
          href: "#",
          class: "c-section-item__title text-truncate stretched-link text-decoration-none",
          onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.edit($setup.section), ["prevent"]))
        }, toDisplayString($setup.section.title || "無標題小節"), 1),
        _cache[7] || (_cache[7] = createTextVNode()),
        createElementVNode("div", {
          class: normalizeClass(["fs-14 text-nowrap me-2", $setup.SegmentTypeColor[$setup.section.type]])
        }, toDisplayString($setup.segmentTypeTitle($setup.section.type)), 3),
        _cache[8] || (_cache[8] = createTextVNode()),
        createElementVNode("div", _hoisted_4$3, [
          createElementVNode("div", _hoisted_5$3, [
            createElementVNode("a", {
              href: "javascript://",
              onClick: $setup.setPreview,
              class: normalizeClass(["btn btn-sm text-nowrap", $setup.section.preview ? "btn-warning" : "btn-outline-secondary"]),
              innerHTML: $setup.section.preview ? "可試閱" : "不可試閱"
            }, null, 10, _hoisted_6$3)
          ]),
          _cache[2] || (_cache[2] = createTextVNode()),
          createElementVNode("div", { class: "c-section-item__delete" }, [
            createElementVNode("a", {
              href: "javascript://",
              onClick: $setup.deleteSection
            }, [..._cache[1] || (_cache[1] = [
              createElementVNode("i", { class: "fal fa-trash text-danger" }, null, -1)
            ])])
          ])
        ])
      ])
    ], 2)
  ]);
}
const SectionItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-43dfd821"], ["__file", "SectionItem.vue"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ChapterItem",
  props: /* @__PURE__ */ mergeModels({
    chapter: {},
    index: {}
  }, {
    "open": { type: Boolean, ...{
      default: false
    } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props, { expose: __expose }) {
    const props = __props;
    const chapter = ref(props.chapter);
    const sections = ref([]);
    const editComponent = shallowRef();
    const currentSection = ref();
    const isOpen = useModel(__props, "open");
    const slideDisplay = ref(isOpen.value ? "display: flex;" : "display: none;");
    const sectionsContainer = useTemplateRef("sectionsContainer");
    watch(isOpen, () => {
      if (!sectionsContainer.value) {
        return;
      }
      slideDisplay.value = "";
      if (isOpen.value) {
        slideDown(sectionsContainer.value);
      } else {
        slideUp(sectionsContainer.value);
      }
    });
    function open() {
      isOpen.value = true;
    }
    function close() {
      isOpen.value = false;
    }
    function toggleOpen() {
      isOpen.value = !isOpen.value;
    }
    __expose({
      open,
      close,
      toggleOpen
    });
    const {
      isActive,
      edit
    } = useSegmentEditor();
    const sectionEditModalOpen = ref(false);
    const typeSelectModalOpen = ref(false);
    onMounted(async () => {
      await prepareSegments();
    });
    function showTypeModal() {
      typeSelectModalOpen.value = true;
    }
    async function prepareSegments() {
      const { get } = await useHttpClient();
      const res = await get(
        route("prepare_segments"),
        {
          params: {
            lessonId: chapter.value.lessonId,
            parentId: chapter.value.id
          }
        }
      );
      sections.value = uniqueItemList(res.data.data);
    }
    async function createSection(type, options = {}) {
      const item = uniqueItem({
        lessonId: chapter.value.lessonId,
        parentId: chapter.value.id,
        type,
        title: "",
        content: "",
        src: "",
        filename: "",
        ext: "",
        captionSrc: "",
        duration: 0,
        can_skip: 0,
        state: 1,
        ordering: sections.value.length + 1
      });
      await saveSegment(item, 1);
      await prepareSegments();
    }
    async function saveSegment(data, isNew = 0) {
      const { post } = await useHttpClient();
      await post(
        route("save_segment"),
        {
          data,
          isNew
        }
      );
      currentSection.value = {};
    }
    async function saveAndCloseModal(data, isNew = 0) {
      await saveSegment(data, isNew);
      sectionEditModalOpen.value = false;
    }
    async function sectionSave(item) {
      await saveSegment(item, 0);
    }
    async function reorder() {
      const orders = {};
      sections.value.forEach((item, i) => {
        orders[item.id] = i + 1;
      });
      const { post } = await useHttpClient();
      await post(
        route("reorder_segment"),
        {
          orders
        }
      );
    }
    async function deleteSection(id) {
      const v = await swal(
        {
          title: "確定要刪除這個小節嗎？",
          text: "如果刪除小節，關於小節所有資料都會遺失",
          icon: "warning",
          buttons: {
            cancel: {
              visible: true,
              text: "取消"
            },
            confirm: {
              visible: true,
              text: "確認"
            }
          }
        }
      );
      if (v) {
        const { post } = await useHttpClient();
        await post(
          route("delete_segment"),
          {
            id
          }
        );
        await prepareSegments();
      }
    }
    const __returned__ = { props, chapter, sections, editComponent, currentSection, isOpen, slideDisplay, sectionsContainer, open, close, toggleOpen, isActive, edit, sectionEditModalOpen, typeSelectModalOpen, showTypeModal, prepareSegments, createSection, saveSegment, saveAndCloseModal, sectionSave, reorder, deleteSection, get BButton() {
      return _sfc_main$b;
    }, get BModal() {
      return _sfc_main$9;
    }, get vBTooltip() {
      return vBTooltip;
    }, get VueDraggable() {
      return VueDraggable;
    }, SectionItem };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "card border" };
const _hoisted_2$2 = { class: "w-100" };
const _hoisted_3$2 = {
  class: "c-chapter-item__content d-flex align-items-center gap-2 w-100",
  style: { "min-width": "1px" }
};
const _hoisted_4$2 = { class: "" };
const _hoisted_5$2 = {
  class: "c-chapter-item__actions ms-auto d-flex align-items-center gap-2",
  style: { "z-index": "3" }
};
const _hoisted_6$2 = { class: "badge bg-secondary rounded-pill" };
const _hoisted_7$2 = { class: "c-section-list" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("div", {
      class: normalizeClass(["c-chapter-item card-body", { "bg-primary-subtle": $setup.isActive($setup.chapter) }])
    }, [
      createElementVNode("div", _hoisted_2$2, [
        createElementVNode("div", _hoisted_3$2, [
          _cache[8] || (_cache[8] = createElementVNode("div", {
            class: "c-chapter-item__handle handle position-relative",
            style: { "cursor": "move", "z-index": "3" }
          }, [
            createElementVNode("span", { class: "fal fa-fw fa-bars" })
          ], -1)),
          _cache[9] || (_cache[9] = createTextVNode()),
          _cache[10] || (_cache[10] = createElementVNode("div", { style: { "z-index": "3" } }, [
            createElementVNode("i", { class: "far fa-folder" })
          ], -1)),
          _cache[11] || (_cache[11] = createTextVNode()),
          createElementVNode("div", _hoisted_4$2, toDisplayString($setup.props.index + 1) + ".\n          ", 1),
          _cache[12] || (_cache[12] = createTextVNode()),
          createElementVNode("a", {
            href: "#",
            class: "c-chapter-item__title text-truncate stretched-link text-decoration-none",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.edit($setup.chapter), ["prevent"]))
          }, toDisplayString($setup.chapter?.title || "(無章節名稱)"), 1),
          _cache[13] || (_cache[13] = createTextVNode()),
          createElementVNode("div", _hoisted_5$2, [
            createElementVNode("span", _hoisted_6$2, toDisplayString($setup.sections.length), 1),
            _cache[6] || (_cache[6] = createTextVNode()),
            withDirectives((openBlock(), createElementBlock("a", {
              href: "javascript://",
              class: "c-chapter-item__delete",
              onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("delete", $setup.chapter.id))
            }, [..._cache[5] || (_cache[5] = [
              createElementVNode("i", { class: "fal fa-trash text-danger" }, null, -1)
            ])])), [
              [$setup["vBTooltip"], "刪除章節"]
            ]),
            _cache[7] || (_cache[7] = createTextVNode()),
            withDirectives((openBlock(), createElementBlock("a", {
              href: "javascript://",
              class: "c-chapter-item__toggle",
              onClick: $setup.toggleOpen
            }, [
              createElementVNode("i", {
                class: normalizeClass(["far", [$setup.isOpen ? "fa-chevron-down" : "fa-chevron-up"]])
              }, null, 2)
            ])), [
              [$setup["vBTooltip"], "顯示/隱藏小節"]
            ])
          ])
        ])
      ])
    ], 2),
    _cache[18] || (_cache[18] = createTextVNode()),
    createElementVNode("div", {
      ref: "sectionsContainer",
      class: "card-body bg-light flex-column gap-3",
      style: normalizeStyle($setup.slideDisplay)
    }, [
      createElementVNode("div", _hoisted_7$2, [
        createVNode($setup["VueDraggable"], {
          modelValue: $setup.sections,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.sections = $event),
          "item-key": "uid",
          handle: ".handle",
          class: "d-flex flex-column gap-2",
          onChange: $setup.reorder
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.sections, (element, index) => {
              return openBlock(), createBlock($setup["SectionItem"], {
                key: element.id,
                section: element,
                chapterIndex: $setup.props.index,
                sectionIndex: index,
                onDelete: $setup.deleteSection,
                onSave: $setup.saveSegment
              }, null, 8, ["section", "chapterIndex", "sectionIndex"]);
            }), 128))
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _cache[15] || (_cache[15] = createTextVNode()),
      createElementVNode("div", { class: "text-center" }, [
        createElementVNode("button", {
          type: "button",
          class: "btn btn-outline-secondary btn-sm",
          onClick: $setup.showTypeModal
        }, [..._cache[14] || (_cache[14] = [
          createElementVNode("i", { class: "far fa-plus" }, null, -1),
          createTextVNode("\n          新增小節\n        ", -1)
        ])])
      ])
    ], 4),
    _cache[19] || (_cache[19] = createTextVNode()),
    createVNode($setup["BModal"], {
      id: "section-edit-modal-" + $setup.props.chapter.id,
      "ok-only": "",
      bodyBgVariant: "light",
      contentClass: "bg-white",
      hideFooter: true,
      lazy: true,
      "dialog-class": "mb-6",
      scrollable: true,
      onHidden: _cache[4] || (_cache[4] = ($event) => $setup.sectionSave($setup.currentSection))
    }, {
      title: withCtx(() => [
        createVNode($setup["BButton"], {
          variant: "primary",
          size: "sm",
          onClick: _cache[3] || (_cache[3] = ($event) => $setup.saveAndCloseModal($setup.currentSection, 0))
        }, {
          default: withCtx(() => [..._cache[16] || (_cache[16] = [
            createTextVNode("\n          儲存\n        ", -1)
          ])]),
          _: 1
        })
      ]),
      default: withCtx(() => [
        _cache[17] || (_cache[17] = createTextVNode()),
        (openBlock(), createBlock(resolveDynamicComponent($setup.editComponent), {
          item: $setup.currentSection,
          onSave: $setup.sectionSave,
          key: $setup.currentSection?.id
        }, null, 40, ["item"]))
      ]),
      _: 1
    }, 8, ["id"])
  ]);
}
const ChapterItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-043eb601"], ["__file", "ChapterItem.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SegmentEditBox",
  setup(__props, { expose: __expose }) {
    __expose();
    const {
      isEditing,
      segment,
      type,
      isChapter,
      saving,
      currentEditingId
    } = useSegmentEditor();
    const saved = ref(false);
    watch(saving, (saving2) => {
      if (!saving2) {
        saved.value = true;
      }
    });
    watch(currentEditingId, () => {
      saved.value = false;
    });
    const editComponent = computed(() => {
      if (!isEditing.value) {
        return null;
      }
      if (isChapter.value) {
        return defineAsyncComponent(() => import("./ChapterEdit.js"));
      } else {
        switch (type.value) {
          case SegmentType.VIDEO:
            return defineAsyncComponent(() => import("./SectionVideoEdit.js"));
          case SegmentType.QUIZ:
            return defineAsyncComponent(() => import("./SectionQuizEdit.js"));
          case SegmentType.HOMEWORK:
            return defineAsyncComponent(() => import("./SectionHomeworkEdit.js"));
          default:
            return null;
        }
      }
    });
    const __returned__ = { isEditing, segment, type, isChapter, saving, currentEditingId, saved, editComponent, get BSpinner() {
      return _sfc_main$d;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  class: "card position-sticky",
  style: { "top": "var(--melo-segment-edit-sticky-top, 100px)" }
};
const _hoisted_2$1 = { class: "card-header d-flex align-items-center justify-content-between" };
const _hoisted_3$1 = { class: "d-flex align-items-center gap-2" };
const _hoisted_4$1 = { class: "m-0" };
const _hoisted_5$1 = {
  key: 0,
  class: ""
};
const _hoisted_6$1 = {
  key: 1,
  class: "text-success"
};
const _hoisted_7$1 = { key: 0 };
const _hoisted_8$1 = {
  key: 0,
  class: "card-body"
};
const _hoisted_9$1 = {
  key: 1,
  class: "p-5 text-center"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createElementVNode("div", _hoisted_2$1, [
      createElementVNode("div", _hoisted_3$1, [
        createElementVNode("h3", _hoisted_4$1, [
          $setup.isChapter ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode("\n            編輯章節\n          ")
          ], 64)) : $setup.isEditing ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode("\n            編輯小節\n          ")
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createTextVNode("\n            編輯\n          ")
          ], 64))
        ]),
        _cache[3] || (_cache[3] = createTextVNode()),
        $setup.saving ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
          createVNode($setup["BSpinner"], { small: "" }),
          _cache[1] || (_cache[1] = createTextVNode("\n          儲存中...\n        ", -1))
        ])) : $setup.saved ? (openBlock(), createElementBlock("div", _hoisted_6$1, [..._cache[2] || (_cache[2] = [
          createElementVNode("i", { class: "far fa-check" }, null, -1),
          createTextVNode("\n          已儲存\n        ", -1)
        ])])) : createCommentVNode("", true)
      ]),
      _cache[5] || (_cache[5] = createTextVNode()),
      $setup.isEditing ? (openBlock(), createElementBlock("div", _hoisted_7$1, [..._cache[4] || (_cache[4] = [
        createElementVNode("span", { class: "badge bg-warning" }, "\n          修改後會即時儲存\n        ", -1)
      ])])) : createCommentVNode("", true)
    ]),
    _cache[7] || (_cache[7] = createTextVNode()),
    $setup.segment && $setup.editComponent ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
      (openBlock(), createBlock(resolveDynamicComponent($setup.editComponent), {
        modelValue: $setup.segment,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.segment = $event)
      }, null, 8, ["modelValue"]))
    ])) : (openBlock(), createElementBlock("div", _hoisted_9$1, [..._cache[6] || (_cache[6] = [
      createElementVNode("div", {
        class: "text-muted",
        style: { "margin": "100px auto" }
      }, "\n        請選擇或新增章節以進行編輯\n      ", -1)
    ])]))
  ]);
}
const SegmentEditBox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "SegmentEditBox.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SegmentEditorApp",
  props: {
    lessonId: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const modal = ref(false);
    const loading = ref(false);
    const { saving } = useSegmentEditor();
    const items = ref([]);
    const current = ref({
      originTitle: "",
      item: {}
    });
    const selected = ref([]);
    const editingTitle = ref("");
    const editingIndex = ref();
    async function prepareSegments() {
      const { get } = await useHttpClient();
      const res = await get(
        route("prepare_segments"),
        {
          params: {
            lessonId: props.lessonId,
            parentId: 0
          }
        }
      );
      items.value = uniqueItemList(res.data.data);
      for (const item of items.value) {
        item.__open = false;
      }
      if (items.value[0]) {
        items.value[0].__open = true;
      }
    }
    onMounted(async () => {
      loading.value = true;
      await prepareSegments();
      loading.value = false;
    });
    function showEditModal(i) {
      editingTitle.value = items.value[i].title;
      editingIndex.value = i;
      modal.value = true;
    }
    async function changeChapter() {
      if (editingIndex.value === void 0) {
        return;
      }
      items.value[editingIndex.value].title = editingTitle.value;
      await saveSegment(
        {
          id: items.value[editingIndex.value].id,
          title: items.value[editingIndex.value].title
        }
      );
      modal.value = false;
    }
    async function createChapter() {
      const ordering = items.value.length;
      let newChapter = {
        lesson_id: props.lessonId,
        parent_id: 0,
        duration: 0,
        can_skip: false,
        state: 1,
        ordering: ordering + 1
      };
      await saveSegment(newChapter, 1);
      await prepareSegments();
    }
    async function deleteChapter(id) {
      const v = await swal(
        {
          title: "確定要刪除這個章節嗎？",
          text: "如果刪除章節，關於章節所有資料都會遺失",
          icon: "warning",
          buttons: {
            cancel: {
              visible: true,
              text: "取消"
            },
            confirm: {
              visible: true,
              text: "確認"
            }
          }
        }
      );
      if (v) {
        const { post } = await useHttpClient();
        await post(
          route("delete_segment"),
          {
            id
          }
        );
        await prepareSegments();
      }
    }
    async function saveSegment(data, isNew = 0) {
      const { post } = await useHttpClient();
      await post(
        route("save_segment"),
        {
          data,
          isNew
        }
      );
    }
    async function reorder() {
      const orders = {};
      items.value.forEach((item, i) => {
        orders[item.id] = i + 1;
      });
      const { post } = await useHttpClient();
      await post(
        route("reorder_segment"),
        {
          orders
        }
      );
    }
    function toggleAllOpens() {
      const allOpen = items.value.every((item) => item.__open);
      for (const item of items.value) {
        item.__open = !allOpen;
      }
    }
    const __returned__ = { props, modal, loading, saving, items, current, selected, editingTitle, editingIndex, prepareSegments, showEditModal, changeChapter, createChapter, deleteChapter, saveSegment, reorder, toggleAllOpens, get VueDraggable() {
      return VueDraggable;
    }, ChapterItem, SegmentEditBox, get BFormGroup() {
      return _sfc_main$5;
    }, get BModal() {
      return _sfc_main$9;
    }, get BFormInput() {
      return _sfc_main$4;
    }, get BButton() {
      return _sfc_main$b;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "container" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-lg-5" };
const _hoisted_4 = { class: "card mb-4" };
const _hoisted_5 = { class: "card-body d-flex align-items-center justify-content-between" };
const _hoisted_6 = { class: "bold my-1" };
const _hoisted_7 = { class: "c-chapter-list" };
const _hoisted_8 = { class: "text-center my-4" };
const _hoisted_9 = { class: "col-lg-7" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      createElementVNode("div", _hoisted_3, [
        createElementVNode("div", _hoisted_4, [
          createElementVNode("div", _hoisted_5, [
            createElementVNode("h4", _hoisted_6, "\n              課程章節 (" + toDisplayString($setup.items.length) + ")\n            ", 1),
            _cache[4] || (_cache[4] = createTextVNode()),
            createElementVNode("div", null, [
              createElementVNode("button", {
                type: "button",
                class: "btn btn-outline-secondary btn-sm",
                onClick: $setup.toggleAllOpens
              }, "\n                全體收合/展開\n              ")
            ])
          ])
        ]),
        _cache[6] || (_cache[6] = createTextVNode()),
        createElementVNode("div", _hoisted_7, [
          createVNode($setup["VueDraggable"], {
            modelValue: $setup.items,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.items = $event),
            "item-key": "uid",
            handle: ".handle",
            class: "d-flex flex-column gap-2",
            onChange: $setup.reorder
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.items, (element, index) => {
                return openBlock(), createBlock($setup["ChapterItem"], {
                  key: element.uid,
                  chapter: element,
                  index,
                  open: element.__open,
                  "onUpdate:open": ($event) => element.__open = $event,
                  onEdit: $setup.showEditModal,
                  onDelete: $setup.deleteChapter
                }, null, 8, ["chapter", "index", "open", "onUpdate:open"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _cache[7] || (_cache[7] = createTextVNode()),
        createElementVNode("div", _hoisted_8, [
          createVNode($setup["BButton"], {
            variant: "success",
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.createChapter())
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createElementVNode("span", { class: "fal fa-plus" }, null, -1),
              createTextVNode("\n            新增章節\n          ", -1)
            ])]),
            _: 1
          })
        ])
      ]),
      _cache[8] || (_cache[8] = createTextVNode()),
      createElementVNode("div", _hoisted_9, [
        createVNode($setup["SegmentEditBox"])
      ])
    ]),
    _cache[9] || (_cache[9] = createTextVNode()),
    createVNode($setup["BModal"], {
      modelValue: $setup.modal,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.modal = $event),
      okTitle: "儲存",
      cancelTitle: "取消",
      onOk: $setup.changeChapter,
      onHidden: $setup.changeChapter
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormGroup"], {
          id: "fieldset-chapter",
          label: "章節名稱編輯",
          "label-for": "input-chapter-title",
          "label-class": "mb-1"
        }, {
          default: withCtx(() => [
            createVNode($setup["BFormInput"], {
              id: "input-chapter-title",
              modelValue: $setup.editingTitle,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.editingTitle = $event),
              trim: ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]);
}
const SegmentEditorApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SegmentEditorApp.vue"]]);
function createSegmentEditorApp(props) {
  const app = createApp(
    SegmentEditorApp,
    props
  );
  app.use(createBootstrap());
  return app;
}
const segmentEditor = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createSegmentEditorApp
}, Symbol.toStringTag, { value: "Module" }));
export {
  _sfc_main$4 as _,
  _sfc_main$5 as a,
  _export_sfc as b,
  _sfc_main$d as c,
  _sfc_main$b as d,
  useStateClass as e,
  useDefaults as f,
  getDefaultExportFromCjs as g,
  useId as h,
  useFocus as i,
  isEmptySlot as j,
  _sfc_main$e as k,
  useDebounceFn as l,
  useModal as m,
  _sfc_main$9 as n,
  segmentEditor as o,
  radioGroupKey as r,
  swal as s,
  useAriaInvalid as u
};
//# sourceMappingURL=segment-editor.js.map
