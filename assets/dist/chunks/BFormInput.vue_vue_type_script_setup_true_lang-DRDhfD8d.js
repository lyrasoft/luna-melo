import { defineComponent, computed, createBlock, openBlock, resolveDynamicComponent, unref, normalizeClass, withCtx, renderSlot, createTextVNode, toDisplayString, toValue, useSlots, useAttrs, toRef, ref, provide, useTemplateRef, normalizeStyle, createVNode, createElementBlock, createCommentVNode, Fragment, mergeProps, inject, onMounted, onActivated, nextTick, mergeModels, useModel } from "vue";
import { u as useDefaults, j as useColorVariantClasses, M as formGroupKey, a as useId, l as createReusableTemplate, N as upperFirst, x as isVisible, O as attemptFocus, n as useFocus, b as useToNumber } from "./_plugin-vue_export-helper.js";
const getClasses = (props, els, propPrefix, classPrefix = propPrefix) => els.reduce((arr, prop) => {
  if (!props[prop]) return arr;
  arr.push(
    [classPrefix, prop.replace(propPrefix, ""), props[prop]].filter((e) => e && typeof e !== "boolean").join("-").toLowerCase()
  );
  return arr;
}, []);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
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
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
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
  const resolvedAriaInvalid = toValue(ariaInvalid);
  const resolvedState = toValue(state);
  const resolvedAriaInvalidValue = resolvedAriaInvalid === true ? "true" : typeof resolvedAriaInvalid === "string" ? resolvedAriaInvalid : resolvedState === false ? "true" : resolvedAriaInvalid === false ? "false" : void 0;
  return resolvedAriaInvalidValue;
});
const useStateClass = (value) => computed(() => {
  const resolvedValue = toValue(value);
  return resolvedValue === true ? "is-valid" : resolvedValue === false ? "is-invalid" : null;
});
const suffixPropName = (suffix, value) => value + (suffix ? upperFirst(suffix) : "");
const _hoisted_1$1 = {
  key: 0,
  ref: "_content",
  class: "form-floating"
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
    const LabelContentTemplate = createReusableTemplate();
    const ContentTemplate = createReusableTemplate();
    const computedState = toRef(() => props.state);
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
              slots["invalid-feedback"] || unref(props).invalidFeedback ? (openBlock(), createBlock(_sfc_main$3, {
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
              slots["valid-feedback"] || unref(props).validFeedback ? (openBlock(), createBlock(_sfc_main$4, {
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
                isHorizontal.value ? (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 0 }, { ...labelColProps.value, ...unref(props).labelWrapperAttrs }, { class: labelAlignClasses.value }), {
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
          isHorizontal.value ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            class: normalizeClass(rowAttrs.value.class),
            style: normalizeStyle(rowAttrs.value.style)
          }, {
            default: withCtx(() => [
              createVNode(unref(LabelContentTemplate).reuse),
              createVNode(_sfc_main$5, mergeProps({ ...contentColProps.value, ...unref(props).contentWrapperAttrs }, { ref: "_content" }), {
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
            unref(props).floating && !isHorizontal.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
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
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  wrapper.cancel = filter.cancel;
  return wrapper;
}
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const filter = (invoke) => {
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
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
function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(debounceFilter(ms, options), fn);
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
  const debounceNumber = useToNumber(() => props.debounce ?? 0, { nanToZero: true });
  const debounceMaxWaitNumber = useToNumber(() => props.debounceMaxWait ?? Number.NaN);
  const formGroupData = inject(formGroupKey, null)?.(computedId);
  const computedState = computed(
    () => props.state !== void 0 ? props.state : formGroupData?.state.value ?? null
  );
  const computedAriaInvalid = useAriaInvalid(() => props.ariaInvalid, computedState);
  const stateClass = useStateClass(computedState);
  const internalUpdateModelValue = useDebounceFn(
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
const _hoisted_1 = ["id", "value", "name", "form", "type", "disabled", "placeholder", "required", "autocomplete", "readonly", "min", "max", "step", "list", "aria-required", "aria-invalid"];
const _sfc_main = /* @__PURE__ */ defineComponent({
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
      }, null, 42, _hoisted_1);
    };
  }
});
export {
  _sfc_main as _,
  _sfc_main$1 as a,
  useStateClass as b,
  useFormInput as c,
  normalizeInput as n,
  useAriaInvalid as u
};
//# sourceMappingURL=BFormInput.vue_vue_type_script_setup_true_lang-DRDhfD8d.js.map
