import { defineComponent, useSlots, computed, createBlock, openBlock, resolveDynamicComponent, unref, normalizeClass, withCtx, createElementBlock, createCommentVNode, renderSlot, createTextVNode, toDisplayString, readonly, toRef, toValue, useAttrs, inject, mergeProps, getCurrentInstance, mergeModels, useTemplateRef, useModel, Fragment, createVNode, effectScope, getCurrentScope, onScopeDispose } from "vue";
import { u as useDefaults, j as useColorVariantClasses, n as isEmptySlot, G as collapseInjectionKey, H as navbarInjectionKey, I as toPascalCase, D as onKeyStroke } from "./_plugin-vue_export-helper.js";
const _hoisted_1 = {
  key: 0,
  class: "visually-hidden"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
          unref(props).label || hasLabelSlot.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
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
const isLink = (props) => !!(props.href || props.to);
const useBLinkHelper = (props, pickProps) => {
  const pickPropsResolved = readonly(toRef(pickProps));
  const resolvedProps = readonly(toRef(props));
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
  const instance = getCurrentInstance();
  const router = instance?.appContext?.app?.config?.globalProperties?.$router;
  const route = instance?.appContext?.app?.config?.globalProperties?.$route;
  const RouterLinkComponent = resolveDynamicComponent("RouterLink");
  const useLink = !!RouterLinkComponent && typeof RouterLinkComponent !== "string" && "useLink" in RouterLinkComponent ? RouterLinkComponent.useLink : null;
  const resolvedTo = computed(() => toValue(to) || "");
  const resolvedReplace = readonly(toRef(replace));
  const routerName = computed(() => toPascalCase(toValue(routerComponentName)));
  const tag = computed(() => {
    const hasRouter = instance?.appContext?.app?.component(routerName.value) !== void 0;
    if (!hasRouter || toValue(disabled) || !resolvedTo.value) {
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
    const resolvedHref = toValue(href);
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
    route,
    link,
    linkProps
  };
};
const useLinkClasses = (linkProps) => computed(() => {
  const props = toValue(linkProps);
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const computedTag = computed(() => isBLink.value ? _sfc_main$1 : props.href ? "a" : props.tag);
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
              createVNode(_sfc_main$2, {
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
  _sfc_main$2 as _,
  _sfc_main as a,
  createEventHook as b,
  createGlobalState as c,
  hasOwn as h,
  isClient as i,
  useDebounceFn as u
};
//# sourceMappingURL=index.js.map
