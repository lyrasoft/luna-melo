import { computed, readonly, toRef, toValue, defineComponent, mergeModels, useSlots, useAttrs, useModel, inject, useTemplateRef, createBlock, openBlock, mergeProps, unref, withCtx, withDirectives, createElementBlock, createCommentVNode, createElementVNode, vModelCheckbox, normalizeClass, renderSlot, provide, Fragment, renderList, createTextVNode, toDisplayString, vModelRadio, normalizeStyle, ref, onMounted, nextTick, toRefs, watch, createVNode, TransitionGroup, withModifiers } from "vue";
import { a as useFileDialog, u as useCurrentElement } from "./index.js";
import { useHttpClient, route, deleteConfirm, data, sleep } from "@windwalker-io/unicorn-next";
import { u as useDefaults, h as useId, A as checkboxGroupKey, B as useFocus, x as isEmptySlot, C as _sfc_main$4, D as radioGroupKey, e as useToNumber, E as isVisible } from "./index-BSgsF2PB.js";
import { u as useAriaInvalid, b as useStateClass, n as normalizeInput, c as useFormInput, _ as _sfc_main$9, a as _sfc_main$a } from "./BFormInput.vue_vue_type_script_setup_true_lang-DRDhfD8d.js";
import { a as _sfc_main$5, _ as _sfc_main$6 } from "./classes-BW_GpXTu.js";
import { VueDraggable } from "vue-draggable-plus";
import { v as vBTooltip, s as sleepMax } from "./timing.js";
import { u as useDebounceFn } from "./index2.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
import { u as useFileUploader } from "./useFileUploader.js";
const getClasses = (items) => computed(() => {
  const resolvedItems = toValue(items);
  return {
    "form-check": resolvedItems.plain === false && resolvedItems.button === false && resolvedItems.hasDefaultSlot,
    "form-check-reverse": resolvedItems.reverse === true,
    "form-check-inline": resolvedItems.inline === true,
    "form-switch": resolvedItems.switch === true,
    [`form-control-${resolvedItems.size}`]: resolvedItems.size !== void 0 && resolvedItems.size !== "md" && resolvedItems.button === false
  };
});
const getInputClasses = (items) => {
  const resolvedItems = readonly(toRef(items));
  const stateClass = useStateClass(() => resolvedItems.value.state ?? null);
  return computed(() => [
    stateClass.value,
    {
      "form-check-input": resolvedItems.value.plain === false && resolvedItems.value.button === false,
      "btn-check": resolvedItems.value.button === true
    }
  ]);
};
const getLabelClasses = (items) => computed(() => {
  const resolvedItems = toValue(items);
  return {
    "form-check-label": resolvedItems.plain === false && resolvedItems.button === false,
    "btn": resolvedItems.button === true,
    [`btn-${resolvedItems.buttonVariant}`]: resolvedItems.button === true && resolvedItems.buttonVariant !== void 0 && resolvedItems.buttonVariant !== null,
    [`btn-${resolvedItems.size}`]: resolvedItems.button && resolvedItems.size && resolvedItems.size !== "md"
  };
});
const getGroupAttr = (items) => {
  const resolvedItems = readonly(toRef(items));
  const computedAriaInvalid = useAriaInvalid(
    () => resolvedItems.value.ariaInvalid,
    () => resolvedItems.value.state
  );
  return computed(() => ({
    "aria-invalid": computedAriaInvalid.value,
    "aria-required": resolvedItems.value.required === true ? true : void 0
  }));
};
const getGroupClasses = (items) => computed(() => {
  const resolvedItems = toValue(items);
  return {
    "was-validated": resolvedItems.validated === true,
    "btn-group": resolvedItems.buttons === true && resolvedItems.stacked === false,
    "btn-group-vertical": resolvedItems.stacked === true && resolvedItems.buttons === true,
    [`btn-group-${resolvedItems.size}`]: resolvedItems.size !== void 0
  };
});
const _hoisted_1$1$2 = ["id", "disabled", "required", "name", "form", "aria-label", "aria-labelledby", "aria-required", "value", "true-value", "false-value", "indeterminate"];
const _hoisted_2$7 = ["for"];
const _sfc_main$1$2 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BFormCheckbox",
  props: /* @__PURE__ */ mergeModels({
    ariaLabel: { default: void 0 },
    ariaLabelledby: { default: void 0 },
    autofocus: { type: Boolean, default: false },
    button: { type: Boolean, default: false },
    buttonGroup: { type: Boolean, default: false },
    buttonVariant: { default: null },
    disabled: { type: Boolean, default: false },
    form: { default: void 0 },
    id: { default: void 0 },
    inline: { type: Boolean, default: false },
    name: { default: void 0 },
    plain: { type: Boolean, default: false },
    required: { type: Boolean, default: void 0 },
    reverse: { type: Boolean, default: false },
    size: { default: void 0 },
    state: { type: [Boolean, null], default: null },
    switch: { type: Boolean, default: false },
    uncheckedValue: { type: [Array, Set, String, Boolean, Object, Number, null], default: false },
    wrapperAttrs: { default: void 0 },
    inputClass: { default: void 0 },
    value: { type: [String, Boolean, Array, Set, Object, Number, null], default: true }
  }, {
    "modelValue": { type: [Array, Set, String, Boolean, Object, Number, null], ...{
      default: void 0
    } },
    "modelModifiers": {},
    "indeterminate": { type: Boolean, ...{
      default: false
    } },
    "indeterminateModifiers": {}
  }),
  emits: ["update:modelValue", "update:indeterminate"],
  setup(__props, { expose: __expose }) {
    const _props = __props;
    const props = useDefaults(_props, "BFormCheckbox");
    const slots = useSlots();
    const attrs = useAttrs();
    const modelValue = useModel(__props, "modelValue");
    const indeterminate = useModel(
      __props,
      "indeterminate"
    );
    const processedAttrs = computed(() => {
      const { class: wrapperClass, ...inputAttrs } = attrs;
      return { wrapperClass, inputAttrs };
    });
    const computedId = useId(() => props.id, "form-check");
    const parentData = inject(checkboxGroupKey, null);
    const input = useTemplateRef("_input");
    const { focused } = useFocus(input, {
      initialValue: props.autofocus
    });
    const hasDefaultSlot = computed(() => !isEmptySlot(slots.default));
    const localValue = computed({
      get: () => parentData ? parentData.modelValue.value : modelValue.value,
      set: (newVal) => {
        if (newVal === void 0) return;
        indeterminate.value = false;
        if (parentData !== null && Array.isArray(newVal)) {
          parentData.modelValue.value = newVal;
          return;
        }
        modelValue.value = newVal;
      }
    });
    const computedRequired = computed(
      () => !!(props.name ?? parentData?.name.value) && (props.required || parentData?.required.value)
    );
    const isButtonGroup = computed(() => props.buttonGroup || (parentData?.buttons.value ?? false));
    const classesObject = computed(() => ({
      plain: props.plain || (parentData?.plain.value ?? false),
      button: props.button || (parentData?.buttons.value ?? false),
      inline: props.inline || (parentData?.inline.value ?? false),
      reverse: props.reverse || (parentData?.reverse.value ?? false),
      switch: props.switch || (parentData?.switch.value ?? false),
      state: props.state === true || props.state === false ? props.state : parentData?.state.value ?? null,
      size: props.size ?? parentData?.size.value ?? "md",
      // This is where the true default is made
      buttonVariant: props.buttonVariant ?? parentData?.buttonVariant.value ?? "secondary",
      // This is where the true default is made
      hasDefaultSlot: hasDefaultSlot.value
    }));
    const wrapperClasses = getClasses(classesObject);
    const computedWrapperClasses = computed(() => [
      wrapperClasses.value,
      processedAttrs.value.wrapperClass
    ]);
    const inputClasses = getInputClasses(classesObject);
    const computedInputClasses = computed(() => [inputClasses.value, props.inputClass]);
    const labelClasses = getLabelClasses(classesObject);
    __expose({
      blur: () => {
        focused.value = false;
      },
      element: input,
      focus: () => {
        focused.value = true;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$4, mergeProps({ skip: isButtonGroup.value }, unref(props).wrapperAttrs, { class: computedWrapperClasses.value }), {
        default: withCtx(() => [
          withDirectives(createElementVNode("input", mergeProps({
            id: unref(computedId),
            ref: "_input",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localValue.value = $event),
            class: computedInputClasses.value,
            type: "checkbox",
            disabled: unref(props).disabled || unref(parentData)?.disabled.value,
            required: computedRequired.value || void 0,
            name: unref(props).name || unref(parentData)?.name.value,
            form: unref(props).form || unref(parentData)?.form.value,
            "aria-label": unref(props).ariaLabel,
            "aria-labelledby": unref(props).ariaLabelledby,
            "aria-required": computedRequired.value || void 0,
            value: unref(props).value,
            "true-value": unref(props).value,
            "false-value": unref(props).uncheckedValue,
            indeterminate: indeterminate.value || void 0
          }, processedAttrs.value.inputAttrs), null, 16, _hoisted_1$1$2), [
            [vModelCheckbox, localValue.value]
          ]),
          hasDefaultSlot.value || unref(props).plain === false ? (openBlock(), createElementBlock("label", {
            key: 0,
            for: unref(computedId),
            class: normalizeClass(unref(labelClasses))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 10, _hoisted_2$7)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["skip", "class"]);
    };
  }
});
const _hoisted_1$1$1 = ["id", "disabled", "required", "name", "form", "aria-label", "aria-labelledby", "value", "aria-required"];
const _hoisted_2$6 = ["for"];
const _sfc_main$1$1 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BFormRadio",
  props: /* @__PURE__ */ mergeModels({
    ariaLabel: { default: void 0 },
    ariaLabelledby: { default: void 0 },
    autofocus: { type: Boolean, default: false },
    button: { type: Boolean, default: false },
    buttonGroup: { type: Boolean, default: false },
    buttonVariant: { default: null },
    disabled: { type: Boolean, default: false },
    form: { default: void 0 },
    id: { default: void 0 },
    inline: { type: Boolean, default: false },
    name: { default: void 0 },
    plain: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
    size: { default: void 0 },
    state: { type: [Boolean, null], default: null },
    value: { type: [Boolean, String, Array, Object, Number, null], default: true }
  }, {
    "modelValue": { type: [Boolean, String, Array, Object, Number, null], ...{
      default: void 0
    } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const _props = __props;
    const props = useDefaults(_props, "BFormRadio");
    const slots = useSlots();
    const modelValue = useModel(__props, "modelValue");
    const computedId = useId(() => props.id, "form-check");
    const parentData = inject(radioGroupKey, null);
    const input = useTemplateRef("_input");
    const { focused } = useFocus(input, {
      initialValue: props.autofocus
    });
    const hasDefaultSlot = computed(() => !isEmptySlot(slots.default));
    const localValue = computed({
      get: () => parentData ? parentData.modelValue.value : modelValue.value,
      set: (newValue) => {
        if (newValue === void 0) return;
        if (parentData !== null) {
          parentData.modelValue.value = newValue;
          return;
        }
        modelValue.value = newValue;
      }
    });
    const computedRequired = computed(
      () => !!(props.name ?? parentData?.name.value) && (props.required || parentData?.required.value)
    );
    const isButtonGroup = computed(() => props.buttonGroup || (parentData?.buttons.value ?? false));
    const classesObject = computed(() => ({
      plain: props.plain || (parentData?.plain.value ?? false),
      button: props.button || (parentData?.buttons.value ?? false),
      inline: props.inline || (parentData?.inline.value ?? false),
      state: props.state || parentData?.state.value,
      reverse: props.reverse || (parentData?.reverse.value ?? false),
      size: props.size ?? parentData?.size.value ?? "md",
      // This is where the true default is made
      buttonVariant: props.buttonVariant ?? parentData?.buttonVariant.value ?? "secondary",
      // This is where the true default is made
      hasDefaultSlot: hasDefaultSlot.value
    }));
    const computedClasses = getClasses(classesObject);
    const inputClasses = getInputClasses(classesObject);
    const labelClasses = getLabelClasses(classesObject);
    __expose({
      blur: () => {
        focused.value = false;
      },
      element: input,
      focus: () => {
        focused.value = true;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$4, {
        skip: isButtonGroup.value,
        class: normalizeClass(unref(computedClasses))
      }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("input", mergeProps({ id: unref(computedId) }, _ctx.$attrs, {
            ref: "_input",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localValue.value = $event),
            class: unref(inputClasses),
            type: "radio",
            disabled: unref(props).disabled || unref(parentData)?.disabled.value,
            required: computedRequired.value || void 0,
            name: unref(props).name || unref(parentData)?.name.value,
            form: unref(props).form || unref(parentData)?.form.value,
            "aria-label": unref(props).ariaLabel,
            "aria-labelledby": unref(props).ariaLabelledby,
            value: unref(props).value,
            "aria-required": computedRequired.value || void 0
          }), null, 16, _hoisted_1$1$1), [
            [vModelRadio, localValue.value]
          ]),
          hasDefaultSlot.value || unref(props).plain === false ? (openBlock(), createElementBlock("label", {
            key: 0,
            for: unref(computedId),
            class: normalizeClass(unref(labelClasses))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 10, _hoisted_2$6)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["skip", "class"]);
    };
  }
});
const _hoisted_1$8 = ["id"];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BFormRadioGroup",
  props: /* @__PURE__ */ mergeModels({
    ariaInvalid: { type: [Boolean, String], default: void 0 },
    autofocus: { type: Boolean, default: false },
    buttonVariant: { default: "secondary" },
    buttons: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledField: { default: "disabled" },
    form: { default: void 0 },
    id: { default: void 0 },
    name: { default: void 0 },
    options: { default: () => [] },
    plain: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
    size: { default: "md" },
    stacked: { type: Boolean, default: false },
    state: { type: [Boolean, null], default: null },
    textField: { default: "text" },
    validated: { type: Boolean, default: false },
    valueField: { default: "value" }
  }, {
    "modelValue": {
      default: null
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const _props = __props;
    const props = useDefaults(_props, "BFormRadioGroup");
    const modelValue = useModel(__props, "modelValue");
    const computedId = useId(() => props.id, "radio");
    const computedName = useId(() => props.name, "checkbox");
    const element = useTemplateRef("_element");
    const { focused } = useFocus(element, {
      initialValue: props.autofocus
    });
    provide(radioGroupKey, {
      modelValue,
      buttonVariant: toRef(() => props.buttonVariant),
      form: toRef(() => props.form),
      name: computedName,
      buttons: toRef(() => props.buttons),
      state: toRef(() => props.state),
      plain: toRef(() => props.plain),
      size: toRef(() => props.size),
      inline: toRef(() => !props.stacked),
      reverse: toRef(() => props.reverse),
      required: toRef(() => props.required),
      disabled: toRef(() => props.disabled)
    });
    const normalizeOptions = computed(
      () => props.options.map(
        (el) => typeof el === "string" || typeof el === "number" ? {
          value: el,
          disabled: props.disabled,
          text: el.toString()
        } : {
          ...el,
          value: el[props.valueField],
          disabled: el[props.disabledField],
          text: el[props.textField]
        }
      )
    );
    const classesObject = computed(() => ({
      required: props.required,
      ariaInvalid: props.ariaInvalid,
      state: props.state,
      validated: props.validated,
      buttons: props.buttons,
      stacked: props.stacked,
      size: props.size
    }));
    const computedAttrs = getGroupAttr(classesObject);
    const computedClasses = getGroupClasses(classesObject);
    __expose({
      blur: () => {
        focused.value = false;
      },
      focus: () => {
        focused.value = true;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", mergeProps(unref(computedAttrs), {
        id: unref(computedId),
        ref: "_element",
        role: "radiogroup",
        class: [unref(computedClasses), "bv-no-focus-ring"],
        tabindex: "-1"
      }), [
        renderSlot(_ctx.$slots, "first"),
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizeOptions.value, (item, index) => {
          return openBlock(), createBlock(_sfc_main$1$1, mergeProps({ key: index }, { ref_for: true }, item), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "option", mergeProps({ ref_for: true }, item), () => [
                createTextVNode(toDisplayString(item.text), 1)
              ])
            ]),
            _: 2
          }, 1040);
        }), 128)),
        renderSlot(_ctx.$slots, "default")
      ], 16, _hoisted_1$8);
    };
  }
});
const useTextareaResize = (input, {
  maxRows,
  noAutoShrink,
  rows
}) => {
  const height = ref(0);
  const maxRowsNumber = useToNumber(
    computed(() => toValue(maxRows) || Number.NaN),
    {
      method: "parseInt",
      nanToZero: true
    }
  );
  const rowsNumber = useToNumber(rows, {
    method: "parseInt",
    nanToZero: true
  });
  const computedMinRows = computed(() => Math.max(rowsNumber.value || 2, 2));
  const computedMaxRows = computed(() => Math.max(computedMinRows.value, maxRowsNumber.value || 0));
  const computedRows = computed(
    () => computedMinRows.value === computedMaxRows.value ? computedMinRows.value : null
  );
  const handleHeightChange = async () => {
    if (!input.value || !isVisible(input.value)) {
      height.value = null;
      return;
    }
    const computedStyle = getComputedStyle(input.value);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 1;
    const border = (Number.parseFloat(computedStyle.borderTopWidth) || 0) + (Number.parseFloat(computedStyle.borderBottomWidth) || 0);
    const padding = (Number.parseFloat(computedStyle.paddingTop) || 0) + (Number.parseFloat(computedStyle.paddingBottom) || 0);
    const offset = border + padding;
    const minHeight = lineHeight * computedMinRows.value + offset;
    const oldHeight = input.value.style.height || computedStyle.height;
    height.value = "auto";
    await nextTick();
    const { scrollHeight } = input.value;
    height.value = oldHeight;
    await nextTick();
    const contentRows = Math.max((scrollHeight - padding) / lineHeight, 2);
    const rows2 = Math.min(Math.max(contentRows, computedMinRows.value), computedMaxRows.value);
    const newHeight = Math.max(Math.ceil(rows2 * lineHeight + offset), minHeight);
    if (toValue(noAutoShrink) && (Number.parseFloat(oldHeight.toString()) || 0) > newHeight) {
      height.value = oldHeight;
      return;
    }
    height.value = `${newHeight}px`;
  };
  onMounted(handleHeightChange);
  const computedStyles = computed(() => ({
    resize: "none",
    height: typeof height.value === "string" ? height.value : height.value ? `${height.value}px` : void 0
  }));
  return {
    onInput: handleHeightChange,
    computedStyles,
    computedRows
  };
};
const _hoisted_1$7 = ["id", "name", "form", "value", "disabled", "placeholder", "required", "autocomplete", "readonly", "aria-required", "aria-invalid", "rows", "wrap"];
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BFormTextarea",
  props: /* @__PURE__ */ mergeModels({
    noResize: { type: Boolean, default: false },
    rows: { default: 2 },
    wrap: { default: "soft" },
    noAutoShrink: { type: Boolean, default: false },
    maxRows: { default: void 0 },
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
    const props = useDefaults(_props, "BFormTextarea");
    const [modelValue, modelModifiers] = useModel(__props, "modelValue", {
      set: (v) => normalizeInput(v, modelModifiers)
    });
    const input = useTemplateRef("_input");
    const {
      computedId,
      forceUpdateKey,
      computedAriaInvalid,
      onInput,
      stateClass,
      onChange,
      onBlur,
      focus,
      blur
    } = useFormInput(props, input, modelValue, modelModifiers);
    const computedClasses = computed(() => [
      stateClass.value,
      props.plaintext ? "form-control-plaintext" : "form-control",
      {
        [`form-control-${props.size}`]: !!props.size
      }
    ]);
    const {
      computedStyles: resizeStyles,
      onInput: handleHeightChange,
      computedRows
    } = useTextareaResize(input, {
      maxRows: () => props.maxRows,
      rows: () => props.rows,
      noAutoShrink: () => props.noAutoShrink
    });
    const computedStyles = computed(() => ({
      resize: props.noResize ? "none" : void 0,
      ...props.maxRows || props.noAutoShrink ? resizeStyles.value : void 0
    }));
    __expose({
      blur,
      element: input,
      focus
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("textarea", {
        id: unref(computedId),
        ref: "_input",
        key: unref(forceUpdateKey),
        class: normalizeClass(computedClasses.value),
        name: unref(props).name || void 0,
        form: unref(props).form || void 0,
        value: unref(modelValue) ?? void 0,
        disabled: unref(props).disabled,
        placeholder: unref(props).placeholder,
        required: unref(props).required || void 0,
        autocomplete: unref(props).autocomplete || void 0,
        readonly: unref(props).readonly || unref(props).plaintext,
        "aria-required": unref(props).required || void 0,
        "aria-invalid": unref(computedAriaInvalid),
        rows: unref(computedRows) || 2,
        style: normalizeStyle(computedStyles.value),
        wrap: unref(props).wrap || void 0,
        onInput: _cache[0] || (_cache[0] = (e) => {
          unref(onInput)(e);
          unref(handleHeightChange)();
        }),
        onChange: _cache[1] || (_cache[1] = //@ts-ignore
        (...args) => unref(onChange) && unref(onChange)(...args)),
        onBlur: _cache[2] || (_cache[2] = //@ts-ignore
        (...args) => unref(onBlur) && unref(onBlur)(...args))
      }, null, 46, _hoisted_1$7);
    };
  }
});
function useQuestionController() {
  async function getQuestions(quizId) {
    const { get } = await useHttpClient();
    const res = await get(
      route("@ajax_question/prepare"),
      {
        params: {
          segmentId: quizId
        }
      }
    );
    return res.data.data;
  }
  async function save(data2, isNew = 0) {
    const { post } = await useHttpClient();
    const res = await post(
      route("@ajax_question/save"),
      {
        data: data2,
        isNew
      }
    );
    return res.data.data;
  }
  async function reorder(orders) {
    const { post } = await useHttpClient();
    return await post(
      route("@ajax_question/reorder"),
      {
        orders
      }
    );
  }
  async function remove(id) {
    const { post } = await useHttpClient();
    await post(
      route("@ajax_question/delete"),
      {
        id
      }
    );
  }
  function createEmptyQuestion(lessonId, segmentId) {
    return {
      lessonId,
      segmentId,
      type: "select",
      is_multiple: "0",
      title: "",
      content: "",
      image: "",
      score: 0,
      state: 1,
      ordering: 0
    };
  }
  return {
    getQuestions,
    save,
    reorder,
    remove,
    createEmptyQuestion
  };
}
function useQuestionPresenter() {
  const defines = inject("question.defines");
  function getDefines() {
    return defines || {};
  }
  function typeToTitle(type) {
    return defines?.[type]?.title || type;
  }
  function typeToDescription(type) {
    return defines?.[type]?.description || "";
  }
  function typeToIcon(type) {
    return defines?.[type]?.icon || "fas fa-question-circle";
  }
  function scoreLimit(score) {
    if (score > 100) {
      return 100;
    }
    if (score < 1) {
      return 1;
    }
    return score;
  }
  return {
    getDefines,
    typeToTitle,
    typeToDescription,
    typeToIcon,
    scoreLimit
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "OptionEdit",
  props: {
    item: {},
    index: {}
  },
  emits: ["delete", "save", "setAnswer"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { item } = toRefs(props);
    function deleteOption() {
      emit("delete", item.value.id);
    }
    const save = useDebounceFn(() => {
      emit("save", item.value);
    }, 300);
    watch(item, () => {
      save();
    }, { deep: true });
    function setIsAnswer() {
      emit("setAnswer", props.index, item.value.isAnswer);
    }
    const __returned__ = { props, emit, item, deleteOption, save, setIsAnswer, get BFormCheckbox() {
      return _sfc_main$1$2;
    }, get BFormTextarea() {
      return _sfc_main$7;
    }, get vBTooltip() {
      return vBTooltip;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$4 = ["data-option-id"];
const _hoisted_2$3 = {
  class: "c-option-item card border",
  style: { "min-width": "1px" }
};
const _hoisted_3$2 = { class: "card-body d-flex align-items-center gap-3" };
const _hoisted_4$2 = { class: "text-nowrap flex-grow-1" };
const _hoisted_5$2 = { class: "d-flex align-items-center gap-3" };
const _hoisted_6$2 = { class: "text-nowrap me-1 d-flex align-items-center" };
const _hoisted_7 = { class: "c-option-item__delete" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-option-outside",
    "data-option-id": $setup.item.id
  }, [
    createElementVNode("div", _hoisted_2$3, [
      createElementVNode("div", _hoisted_3$2, [
        _cache[5] || (_cache[5] = createElementVNode("div", {
          class: "c-option-item__handle handle",
          style: { "cursor": "move", "z-index": "3" }
        }, [
          createElementVNode("span", { class: "fal fa-bars" })
        ], -1)),
        _cache[6] || (_cache[6] = createTextVNode()),
        createElementVNode("div", _hoisted_4$2, [
          createVNode($setup["BFormTextarea"], {
            modelValue: $setup.item.title,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
            placeholder: "輸入選項內容",
            rows: "2"
          }, null, 8, ["modelValue"])
        ]),
        _cache[7] || (_cache[7] = createTextVNode()),
        createElementVNode("div", _hoisted_5$2, [
          createElementVNode("div", _hoisted_6$2, [
            createVNode($setup["BFormCheckbox"], {
              modelValue: $setup.item.isAnswer,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.item.isAnswer = $event),
              onChange: $setup.setIsAnswer,
              switch: "",
              class: "m-0"
            }, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createTextVNode("\r\n              正確答案\r\n            ", -1)
              ])]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          _cache[4] || (_cache[4] = createTextVNode()),
          createElementVNode("div", _hoisted_7, [
            withDirectives((openBlock(), createElementBlock("a", {
              href: "javascript://",
              class: "link-danger",
              onClick: $setup.deleteOption
            }, [..._cache[3] || (_cache[3] = [
              createElementVNode("i", { class: "fal fa-trash" }, null, -1)
            ])])), [
              [$setup["vBTooltip"], "刪除此選項"]
            ])
          ])
        ])
      ])
    ])
  ], 8, _hoisted_1$4);
}
const OptionEdit = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$4], ["__file", "OptionEdit.vue"]]);
function useOptionController() {
  async function getOptions(questionId) {
    const { get } = await useHttpClient();
    const res = await get(
      route("@ajax_option/prepare"),
      {
        params: {
          questionId
        }
      }
    );
    return res.data.data;
  }
  async function reorder(orders = {}) {
    const { post } = await useHttpClient();
    await post(
      route("@ajax_option/reorder"),
      {
        orders
      }
    );
  }
  function createEmptyOption(questionId) {
    return {
      questionId,
      title: "",
      isAnswer: false,
      state: 1,
      ordering: 0
    };
  }
  async function save(data2, isNew = 0) {
    const { post } = await useHttpClient();
    const res = await post(
      route("@ajax_option/save"),
      {
        data: data2,
        isNew
      }
    );
    return res.data.data;
  }
  async function saveMultiple(options) {
    const { post } = await useHttpClient();
    const res = await post(
      route("@ajax_option/saveMultiple"),
      {
        options
      }
    );
    return res.data.data;
  }
  async function deleteOption(id) {
    const { post } = await useHttpClient();
    await post(
      route("delete_option"),
      {
        id
      }
    );
  }
  return {
    getOptions,
    reorder,
    createEmptyOption,
    save,
    saveMultiple,
    deleteOption
  };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "OptionList",
  props: /* @__PURE__ */ mergeModels({
    question: {}
  }, {
    "modelValue": {
      default: () => []
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["saving", "saved"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const options = useModel(__props, "modelValue");
    const {
      save: saveOption,
      reorder: reorderOptions,
      deleteOption: remove,
      getOptions,
      createEmptyOption,
      saveMultiple
    } = useOptionController();
    onMounted(() => {
      prepareOptions();
    });
    async function prepareOptions() {
      options.value = await getOptions(props.question.id);
    }
    async function reorder() {
      autoSave = false;
      const orders = {};
      options.value.forEach((item, i) => {
        orders[item.id] = i + 1;
      });
      await reorderOptions(orders);
      autoSave = true;
    }
    async function createOption() {
      const option = createEmptyOption(props.question.id);
      option.ordering = options.value.length + 1;
      const newItem = await saveOption(option, 1);
      options.value.push(newItem);
    }
    let autoSave = true;
    async function autoSaveOption(option) {
      if (!autoSave) {
        return;
      }
      const start = Date.now();
      emit("saving");
      try {
        await saveOption(option, 0);
      } finally {
        await sleepMax(start, 500);
        emit("saved");
      }
    }
    async function deleteOption(id) {
      const v = await deleteConfirm("確定要刪除這個選項嗎？");
      if (v) {
        options.value = options.value.filter((item) => item.id !== id);
        await remove(id);
      }
    }
    async function setAnswer(index, currentAnswer) {
      autoSave = false;
      if (props.question.type === "select") {
        options.value.forEach((item) => {
          item.isAnswer = false;
        });
        options.value[index].isAnswer = true;
      }
      if (props.question.type === "multiple") {
        options.value[index].isAnswer = currentAnswer;
      }
      const answers = {};
      for (const option of options.value) {
        answers[option.id] = option.isAnswer;
      }
      const start = Date.now();
      emit("saving");
      try {
        await saveMultiple(options.value);
      } finally {
        autoSave = true;
      }
      await sleepMax(start, 500);
      emit("saved");
    }
    const __returned__ = { props, emit, options, saveOption, reorderOptions, remove, getOptions, createEmptyOption, saveMultiple, prepareOptions, reorder, createOption, get autoSave() {
      return autoSave;
    }, set autoSave(v) {
      autoSave = v;
    }, autoSaveOption, deleteOption, setAnswer, get BButton() {
      return _sfc_main$5;
    }, get VueDraggable() {
      return VueDraggable;
    }, OptionEdit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = { class: "text-center mb-2 mt-3" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode($setup["VueDraggable"], {
      modelValue: $setup.options,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.options = $event),
      "item-key": "uid",
      handle: ".handle",
      class: "d-flex flex-column gap-2",
      "on-update": $setup.reorder
    }, {
      default: withCtx(() => [
        createVNode(TransitionGroup, { name: "fade" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.options, (element, index) => {
              return openBlock(), createBlock($setup["OptionEdit"], {
                style: { "animation-duration": "300ms" },
                item: element,
                key: element.id,
                index,
                onSave: $setup.autoSaveOption,
                onDelete: $setup.deleteOption,
                onSetAnswer: $setup.setAnswer
              }, null, 8, ["item", "index"]);
            }), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _cache[2] || (_cache[2] = createTextVNode()),
    createElementVNode("div", _hoisted_1$3, [
      createVNode($setup["BButton"], {
        onClick: $setup.createOption,
        variant: "primary",
        size: "sm"
      }, {
        default: withCtx(() => [..._cache[1] || (_cache[1] = [
          createElementVNode("i", { class: "fas fa-plus" }, null, -1),
          createTextVNode("\r\n      新增選項\r\n    ", -1)
        ])]),
        _: 1
      })
    ])
  ], 64);
}
const OptionList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$3], ["__file", "OptionList.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ImageUploader",
  props: /* @__PURE__ */ mergeModels({
    uploadUrl: {},
    dest: {},
    accept: { default: "image/*" }
  }, {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["uploaded", "clear"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const image = useModel(__props, "modelValue");
    const { wrapClassicUpload, acceptString, checkFileType } = useFileUploader({
      accept: () => props.accept
    });
    const uploadImage = wrapClassicUpload(props.uploadUrl || route("@image_upload"));
    const defaultImage = ref(data("defaultImage"));
    const loading = ref(false);
    const { open, reset, onChange, onCancel, files } = useFileDialog({
      accept: acceptString.value
    });
    onChange(async () => {
      if (!files.value?.length) {
        return;
      }
      upload(files.value[0]);
      reset();
    });
    onCancel(reset);
    async function upload(file) {
      loading.value = true;
      try {
        const url = await uploadImage(file, props.dest);
        image.value = url;
        emit("uploaded", url);
      } finally {
        loading.value = false;
      }
    }
    function clear() {
      image.value = "";
      reset();
      emit("clear");
    }
    function paste(e) {
      console.log(e);
    }
    const dragging = ref(false);
    function onDragStart() {
      dragging.value = true;
    }
    function onDragEnd() {
      dragging.value = false;
    }
    function onDrop(e) {
      console.log(e);
      dragging.value = false;
      const file = e.dataTransfer?.files?.[0];
      if (!file) {
        return;
      }
      upload(file);
    }
    const __returned__ = { props, emit, image, wrapClassicUpload, acceptString, checkFileType, uploadImage, defaultImage, loading, open, reset, onChange, onCancel, files, upload, clear, paste, dragging, onDragStart, onDragEnd, onDrop, get BSpinner() {
      return _sfc_main$6;
    }, get vBTooltip() {
      return vBTooltip;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "c-image-uploader card border overflow-hidden position-relative" };
const _hoisted_2$2 = {
  key: 0,
  class: "position-absolute d-flex justify-content-center align-items-center",
  style: { "left": "0", "top": "0", "right": "0", "bottom": "0", "background-color": "rgba(255, 255, 255, 0.7)", "z-index": "10" }
};
const _hoisted_3$1 = ["href"];
const _hoisted_4$1 = ["src"];
const _hoisted_5$1 = {
  key: 0,
  class: "c-image-uploader-actions d-flex align-items-center justify-content-between gap-2"
};
const _hoisted_6$1 = { class: "d-flex align-items-center gap-2" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-image-uploader-wrapper d-flex flex-column gap-2 mx-auto",
    style: { "max-width": "500px", "width": "100%" },
    onDragover: withModifiers($setup.onDragStart, ["prevent"]),
    onDragleave: withModifiers($setup.onDragEnd, ["prevent"]),
    onDrop: withModifiers($setup.onDrop, ["prevent"])
  }, [
    createElementVNode("div", _hoisted_1$2, [
      $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
        createVNode($setup["BSpinner"])
      ])) : createCommentVNode("", true),
      _cache[9] || (_cache[9] = createTextVNode()),
      $setup.image ? (openBlock(), createElementBlock("a", {
        key: 1,
        href: $setup.image,
        target: "_blank"
      }, [
        createElementVNode("div", {
          class: "c-image-uploader__preview position-relative",
          style: normalizeStyle([[$setup.dragging ? "opacity: .7" : ""], { "aspect-ratio": "16/9", "background-color": "black", "transition": "all .3s" }])
        }, [
          createElementVNode("img", {
            class: "position-absolute rounded",
            src: $setup.image || $setup.defaultImage,
            alt: "Preview",
            style: { "aspect-ratio": "16/9", "top": "0", "left": "0", "width": "100%", "height": "100%", "object-fit": "contain" }
          }, null, 8, _hoisted_4$1)
        ], 4)
      ], 8, _hoisted_3$1)) : (openBlock(), createElementBlock("div", {
        key: 2,
        class: "c-image-uploader__placeholder d-flex flex-column gap-3 justify-content-center align-items-center",
        style: normalizeStyle([{ "aspect-ratio": "16/9", "background-color": "white", "transition": "all .3s" }, [$setup.dragging ? "background-color: var(--bs-light)" : ""]])
      }, [
        _cache[5] || (_cache[5] = createElementVNode("div", null, [
          createElementVNode("i", { class: "fas fa-upload fa-2x" })
        ], -1)),
        _cache[6] || (_cache[6] = createTextVNode()),
        _cache[7] || (_cache[7] = createElementVNode("div", { class: "text-muted" }, "\r\n          拖拉至此上傳圖片\r\n        ", -1)),
        _cache[8] || (_cache[8] = createTextVNode()),
        createElementVNode("div", null, [
          createElementVNode("button", {
            type: "button",
            class: "btn btn-primary btn-sm",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.open())
          }, [..._cache[2] || (_cache[2] = [
            createElementVNode("i", { class: "fas fa-image" }, null, -1),
            createTextVNode("\r\n            點擊此處選擇檔案\r\n          ", -1)
          ])]),
          _cache[4] || (_cache[4] = createTextVNode()),
          withDirectives((openBlock(), createElementBlock("button", {
            type: "button",
            class: "btn btn-outline-primary btn-sm",
            onClick: $setup.paste
          }, [..._cache[3] || (_cache[3] = [
            createElementVNode("i", { class: "fas fa-paste" }, null, -1)
          ])])), [
            [$setup["vBTooltip"], "從剪貼簿貼上圖片檔案"]
          ])
        ])
      ], 4))
    ]),
    _cache[17] || (_cache[17] = createTextVNode()),
    $setup.image ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
      createElementVNode("div", _hoisted_6$1, [
        createElementVNode("button", {
          type: "button",
          class: "btn btn-primary btn-sm",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.open())
        }, [..._cache[10] || (_cache[10] = [
          createElementVNode("i", { class: "fas fa-image" }, null, -1),
          createTextVNode("\r\n          更換檔案\r\n        ", -1)
        ])]),
        _cache[12] || (_cache[12] = createTextVNode()),
        createElementVNode("div", null, [
          createElementVNode("button", {
            type: "button",
            class: "btn btn-outline-primary btn-sm",
            onClick: $setup.paste
          }, [..._cache[11] || (_cache[11] = [
            createElementVNode("i", { class: "fas fa-paste" }, null, -1)
          ])])
        ]),
        _cache[13] || (_cache[13] = createTextVNode()),
        _cache[14] || (_cache[14] = createElementVNode("span", { class: "small text-muted" }, "或拖拉檔案至上方", -1))
      ]),
      _cache[16] || (_cache[16] = createTextVNode()),
      createElementVNode("button", {
        type: "button",
        class: "btn btn-outline-danger btn-sm",
        onClick: $setup.clear
      }, [..._cache[15] || (_cache[15] = [
        createElementVNode("i", { class: "fal fa-trash" }, null, -1),
        createTextVNode("\r\n        移除圖片\r\n      ", -1)
      ])])
    ])) : createCommentVNode("", true)
  ], 32);
}
const ImageUploader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$2], ["__file", "ImageUploader.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuestionEdit",
  props: {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  },
  emits: /* @__PURE__ */ mergeModels(["saving", "saved"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const question = useModel(__props, "modelValue");
    const emit = __emit;
    const { scoreLimit } = useQuestionPresenter();
    const options = ref([]);
    const hasOptions = computed(() => question.value.type === "select" || question.value.type === "multiple");
    const el = useCurrentElement();
    onMounted(async () => {
      await sleep(300);
      const input = el.value.querySelector("input, textarea");
      input?.focus();
      input?.dispatchEvent(new CustomEvent("input"));
    });
    const changeScore = useDebounceFn(async () => {
      question.value.score = scoreLimit(question.value.score);
    }, 300);
    function clearImage() {
      question.value.image = "";
    }
    const { save } = useQuestionController();
    const saving = ref(false);
    let autoSave = true;
    watch(question, () => {
      if (autoSave) {
        saveDebounced();
      }
    }, { deep: true });
    const saveDebounced = useDebounceFn(async () => {
      saving.value = true;
      const now = Date.now();
      emit("saving");
      try {
        const saved = await save(question.value, 0);
        question.value.id = saved.id;
      } finally {
        await sleepMax(now, 500);
        emit("saved");
        saving.value = false;
      }
    }, 500);
    watch(() => question.value.type, (type) => {
      if (type === "select") {
        let hasAnswer = false;
        for (const option of options.value) {
          if (hasAnswer) {
            option.isAnswer = false;
            continue;
          }
          if (option.isAnswer) {
            hasAnswer = true;
          }
        }
      }
    }, { deep: true });
    const answersCount = computed(() => {
      return options.value.filter((item) => item.isAnswer).length;
    });
    watch(() => options, () => {
      if (answersCount.value === 0) {
        if (question.value.type === "select" && options.value.length > 0) {
          options.value[0].isAnswer = true;
        }
      }
    }, { deep: true });
    const __returned__ = { props, question, emit, scoreLimit, options, hasOptions, el, changeScore, clearImage, save, saving, get autoSave() {
      return autoSave;
    }, set autoSave(v) {
      autoSave = v;
    }, saveDebounced, answersCount, get BFormGroup() {
      return _sfc_main$a;
    }, get BFormInput() {
      return _sfc_main$9;
    }, get BFormRadio() {
      return _sfc_main$1$1;
    }, get BFormRadioGroup() {
      return _sfc_main$8;
    }, get BFormTextarea() {
      return _sfc_main$7;
    }, OptionList, ImageUploader };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "pb-5" };
const _hoisted_2$1 = {
  key: 1,
  class: "c-option-list my-5 py-4"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createVNode($setup["BFormGroup"], {
      label: "題目內容",
      "label-for": "input-question-content",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormTextarea"], {
          id: "input-question-content",
          modelValue: $setup.question.content,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.question.content = $event),
          placeholder: "請輸入題目內容",
          rows: "7",
          "max-rows": "15"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[11] || (_cache[11] = createTextVNode()),
    createVNode($setup["BFormGroup"], {
      label: "圖片(選填)",
      "label-for": "input-question-type",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode($setup["ImageUploader"], {
          modelValue: $setup.question.image,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.question.image = $event),
          onClear: $setup.clearImage
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[12] || (_cache[12] = createTextVNode()),
    $setup.question.type === "boolean" ? (openBlock(), createBlock($setup["BFormGroup"], {
      key: 0,
      label: "答案",
      "label-for": "input-question-answer",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormRadioGroup"], {
          modelValue: $setup.question.answer,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.question.answer = $event),
          "button-variant": "outline-primary",
          name: "input-question-answer",
          buttons: "",
          class: "w-100"
        }, {
          default: withCtx(() => [
            createVNode($setup["BFormRadio"], { value: "1" }, {
              default: withCtx(() => [..._cache[7] || (_cache[7] = [
                createElementVNode("i", { class: "fas fa-check" }, null, -1),
                createTextVNode("\r\n          是\r\n        ", -1)
              ])]),
              _: 1
            }),
            _cache[9] || (_cache[9] = createTextVNode()),
            createVNode($setup["BFormRadio"], { value: "0" }, {
              default: withCtx(() => [..._cache[8] || (_cache[8] = [
                createElementVNode("i", { class: "fas fa-xmark" }, null, -1),
                createTextVNode("\r\n          否\r\n        ", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    })) : createCommentVNode("", true),
    _cache[13] || (_cache[13] = createTextVNode()),
    $setup.hasOptions ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
      createElementVNode("h4", null, "選項 (" + toDisplayString($setup.options.length) + ")", 1),
      _cache[10] || (_cache[10] = createTextVNode()),
      createVNode($setup["OptionList"], {
        question: $setup.question,
        modelValue: $setup.options,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.options = $event),
        onSaving: _cache[4] || (_cache[4] = ($event) => $setup.emit("saving")),
        onSaved: _cache[5] || (_cache[5] = ($event) => $setup.emit("saved"))
      }, null, 8, ["question", "modelValue"])
    ])) : createCommentVNode("", true),
    _cache[14] || (_cache[14] = createTextVNode()),
    createVNode($setup["BFormGroup"], {
      label: "配分",
      "label-for": "input-question-score",
      description: "限填 1~100，測驗滿分為 100"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormInput"], {
          id: "input-question-score",
          modelValue: $setup.question.score,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.question.score = $event),
          type: "number",
          max: "100",
          min: "1",
          onInput: $setup.changeScore
        }, null, 8, ["modelValue", "onInput"])
      ]),
      _: 1
    })
  ]);
}
const QuestionEdit = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render$1], ["__file", "QuestionEdit.vue"]]);
const QuestionEdit$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: QuestionEdit
}, Symbol.toStringTag, { value: "Module" }));
export {
  QuestionEdit as Q,
  _sfc_main$8 as _,
  useQuestionController as a,
  _sfc_main$1$1 as b,
  QuestionEdit$1 as c,
  useQuestionPresenter as u
};
//# sourceMappingURL=QuestionEdit.js.map
