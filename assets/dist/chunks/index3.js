import { watch, customRef, shallowRef, shallowReadonly, effectScope, toValue, getCurrentScope, onScopeDispose } from "vue";
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
  const get = typeof fn === "function" ? fn : fn.get;
  const set = typeof fn === "function" ? void 0 : fn.set;
  const result = customRef((_track, _trigger) => {
    track = _track;
    trigger = _trigger;
    return {
      get() {
        if (dirty) {
          v = get(v);
          dirty = false;
        }
        track();
        return v;
      },
      set(v2) {
        set === null || set === void 0 || set(v2);
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
const hasOwn = (val, key) => Object.hasOwn(val, key);
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
  if ("cancel" in filter) Object.assign(wrapper, {
    cancel: filter.cancel,
    flush: filter.flush,
    isPending: filter.isPending
  });
  return wrapper;
}
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  let lastResolve = noop;
  const _pending = shallowRef(false);
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const handler = (invoke) => {
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
    if (timer) _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = void 0;
      }
      _pending.value = false;
      return Promise.resolve(invoke());
    }
    _pending.value = true;
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastResolve = resolve;
      lastInvoker = invoke;
      if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
        if (timer) _clearTimeout(timer);
        maxTimer = void 0;
        _pending.value = false;
        resolve(lastInvoker());
      }, maxDuration);
      timer = setTimeout(() => {
        if (maxTimer) _clearTimeout(maxTimer);
        maxTimer = void 0;
        _pending.value = false;
        resolve(invoke());
      }, duration);
    });
  };
  return Object.assign(handler, {
    cancel: () => {
      if (timer) {
        _clearTimeout(timer);
        timer = void 0;
      }
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = void 0;
      }
      _pending.value = false;
      lastResolve = noop;
    },
    flush: () => {
      if (_pending.value) {
        if (timer) {
          clearTimeout(timer);
          timer = void 0;
        }
        if (maxTimer) {
          clearTimeout(maxTimer);
          maxTimer = void 0;
        }
        _pending.value = false;
        const resolve = lastResolve;
        lastRejector = noop;
        lastResolve = noop;
        resolve(lastInvoker());
      }
    },
    isPending: shallowReadonly(_pending)
  });
}
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
//# sourceMappingURL=index3.js.map
