import { effectScope, watch, customRef, getCurrentScope, onScopeDispose, toValue } from "vue";
function computedWithControl(source, fn, options = {}) {
  let v = void 0;
  let track;
  let trigger;
  let dirty = true;
  const update = () => {
    dirty = true;
    trigger();
  };
  watch(source, update, {
    flush: "sync",
    ...options
  });
  const get$1 = typeof fn === "function" ? fn : fn.get;
  const set$1 = typeof fn === "function" ? void 0 : fn.set;
  const result = customRef((_track, _trigger) => {
    track = _track;
    trigger = _trigger;
    return {
      get() {
        if (dirty) {
          v = get$1(v);
          dirty = false;
        }
        track();
        return v;
      },
      set(v$1) {
        set$1 === null || set$1 === void 0 || set$1(v$1);
      }
    };
  });
  result.trigger = update;
  return result;
}
function tryOnScopeDispose(fn, failSilently) {
  if (getCurrentScope()) {
    onScopeDispose(fn, failSilently);
    return true;
  }
  return false;
}
// @__NO_SIDE_EFFECTS__
function createEventHook() {
  const fns = /* @__PURE__ */ new Set();
  const off = (fn) => {
    fns.delete(fn);
  };
  const clear = () => {
    fns.clear();
  };
  const on = (fn) => {
    fns.add(fn);
    const offFn = () => off(fn);
    tryOnScopeDispose(offFn);
    return { off: offFn };
  };
  const trigger = (...args) => {
    return Promise.all(Array.from(fns).map((fn) => fn(...args)));
  };
  return {
    on,
    off,
    trigger,
    clear
  };
}
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
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const noop = () => {
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
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
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
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
export {
  computedWithControl as a,
  createEventHook as b,
  createGlobalState as c,
  hasOwn as h,
  isClient as i,
  useDebounceFn as u
};
//# sourceMappingURL=index2.js.map
