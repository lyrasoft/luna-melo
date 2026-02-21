import { defineComponent, useModel, computed, mergeModels, openBlock, createElementBlock, createElementVNode, createTextVNode, toDisplayString, Fragment, renderList, withDirectives, vModelRadio, createCommentVNode } from "vue";
import { useLoading } from "@lyrasoft/ts-toolkit/vue";
import { useHttpClient, simpleAlert } from "@windwalker-io/unicorn-next";
import { u as useQuestionPresenter } from "./useQuestionPresenter.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BasicQuestionProcessing",
  props: /* @__PURE__ */ mergeModels({
    index: {},
    question: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const answer = useModel(__props, "modelValue");
    const type = computed(() => props.question.type);
    if (answer.value == null) {
      if (type.value === "select") {
        answer.value = "";
      } else if (type.value === "multiple") {
        answer.value = [];
      } else if (type.value === "boolean") {
        answer.value = null;
      }
    }
    const { typeToTitle } = useQuestionPresenter();
    const options = computed(() => {
      if (type.value === "select") {
        return props.question.params.options || [];
      } else if (type.value === "multiple") {
        return props.question.params.options || [];
      }
      return [];
    });
    function getQuestionInputName(question, suffix = "") {
      return `quiz[${question.id}]${suffix}`;
    }
    function toggleMultiple(e, option) {
      const target = e.target;
      if (target.checked) {
        answer.value = [...answer.value, option.text];
      } else {
        answer.value = answer.value.filter((ans) => ans !== option.text);
      }
    }
    const { loading, wrap } = useLoading();
    const submit = wrap(async () => {
      const { post } = await useHttpClient();
      const formData = new FormData();
      for (const k in answer.value) {
        const ans = answer.value[k];
        formData.append(`quiz[${k}]`, ans);
      }
      try {
        await post(
          "@lesson_ajax/submitQuiz",
          formData
        );
        await simpleAlert("測驗提交成功！", "", "success");
        location.reload();
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          simpleAlert("測驗提交失敗！", e.message, "warning");
        }
      }
    });
    const __returned__ = { props, answer, type, typeToTitle, options, getQuestionInputName, toggleMultiple, loading, wrap, submit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "c-question-item" };
const _hoisted_2 = { class: "h6 mb-1" };
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = {
  key: 0,
  class: "d-flex flex-column gap-2"
};
const _hoisted_5 = ["id", "value", "name"];
const _hoisted_6 = ["for"];
const _hoisted_7 = {
  key: 1,
  class: "d-flex flex-column gap-2"
};
const _hoisted_8 = ["id", "name", "value", "checked", "onChange"];
const _hoisted_9 = ["for"];
const _hoisted_10 = {
  key: 2,
  class: "d-flex flex-column gap-2"
};
const _hoisted_11 = { class: "form-check" };
const _hoisted_12 = ["id", "name"];
const _hoisted_13 = ["for"];
const _hoisted_14 = { class: "form-check" };
const _hoisted_15 = ["id", "name"];
const _hoisted_16 = ["for"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      createTextVNode("\n      第 " + toDisplayString($props.index) + " 題（" + toDisplayString($setup.typeToTitle($props.question.type)) + "）:", 1),
      _cache[3] || (_cache[3] = createElementVNode("br", null, null, -1)),
      createTextVNode(" " + toDisplayString($props.question.title), 1)
    ]),
    _cache[9] || (_cache[9] = createTextVNode()),
    createElementVNode("div", {
      class: "mb-3",
      innerHTML: $props.question.content
    }, null, 8, _hoisted_3),
    _cache[10] || (_cache[10] = createTextVNode()),
    createElementVNode("div", null, [
      $setup.type === "select" ? (openBlock(), createElementBlock("div", _hoisted_4, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.options, (option, idx) => {
          return openBlock(), createElementBlock("div", {
            class: "form-check",
            key: idx
          }, [
            withDirectives(createElementVNode("input", {
              class: "form-check-input",
              type: "radio",
              id: "question-" + $props.question.id + "-option-" + idx,
              value: option.text,
              name: $setup.getQuestionInputName($props.question),
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.answer = $event)
            }, null, 8, _hoisted_5), [
              [vModelRadio, $setup.answer]
            ]),
            _cache[4] || (_cache[4] = createTextVNode()),
            createElementVNode("label", {
              class: "form-check-label",
              for: "question-" + $props.question.id + "-option-" + idx
            }, toDisplayString(option.text), 9, _hoisted_6)
          ]);
        }), 128))
      ])) : $setup.type === "multiple" ? (openBlock(), createElementBlock("div", _hoisted_7, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.options, (option, idx) => {
          return openBlock(), createElementBlock("div", {
            class: "form-check",
            key: idx
          }, [
            createElementVNode("input", {
              class: "form-check-input",
              type: "checkbox",
              id: `question-${$props.question.id}-option-${idx}`,
              name: $setup.getQuestionInputName($props.question, "[]"),
              value: option.text,
              checked: Array.isArray($setup.answer) && $setup.answer.includes(option.text),
              onChange: ($event) => $setup.toggleMultiple($event, option)
            }, null, 40, _hoisted_8),
            _cache[5] || (_cache[5] = createTextVNode()),
            createElementVNode("label", {
              class: "form-check-label",
              for: "question-" + $props.question.id + "-option-" + idx
            }, toDisplayString(option.text), 9, _hoisted_9)
          ]);
        }), 128))
      ])) : $setup.type === "boolean" ? (openBlock(), createElementBlock("div", _hoisted_10, [
        createElementVNode("div", _hoisted_11, [
          withDirectives(createElementVNode("input", {
            class: "form-check-input",
            type: "radio",
            id: "question-" + $props.question.id + "-option-yes",
            name: $setup.getQuestionInputName($props.question),
            value: "1",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.answer = $event)
          }, null, 8, _hoisted_12), [
            [vModelRadio, $setup.answer]
          ]),
          _cache[6] || (_cache[6] = createTextVNode()),
          createElementVNode("label", {
            class: "form-check-label",
            for: "question-" + $props.question.id + "-option-yes"
          }, "\n              是\n            ", 8, _hoisted_13)
        ]),
        _cache[8] || (_cache[8] = createTextVNode()),
        createElementVNode("div", _hoisted_14, [
          withDirectives(createElementVNode("input", {
            class: "form-check-input",
            type: "radio",
            id: "question-" + $props.question.id + "-option-no",
            name: $setup.getQuestionInputName($props.question),
            value: "0",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.answer = $event)
          }, null, 8, _hoisted_15), [
            [vModelRadio, $setup.answer]
          ]),
          _cache[7] || (_cache[7] = createTextVNode()),
          createElementVNode("label", {
            class: "form-check-label",
            for: "question-" + $props.question.id + "-option-no"
          }, "\n              否\n            ", 8, _hoisted_16)
        ])
      ])) : createCommentVNode("", true)
    ])
  ]);
}
const BasicQuestionProcessing = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "BasicQuestionProcessing.vue"]]);
export {
  BasicQuestionProcessing as default
};
//# sourceMappingURL=BasicQuestionProcessing.js.map
