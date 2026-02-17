import { defineComponent, useModel, openBlock, createElementBlock, createVNode, withCtx } from "vue";
import "./index-BSgsF2PB.js";
import { _ as _sfc_main$1, a as _sfc_main$2 } from "./BFormInput.vue_vue_type_script_setup_true_lang-DRDhfD8d.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ChapterEdit",
  props: {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const item = useModel(__props, "modelValue");
    const __returned__ = { item, get BFormGroup() {
      return _sfc_main$2;
    }, get BFormInput() {
      return _sfc_main$1;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "d-flex flex-column gap-4" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode($setup["BFormGroup"], {
      id: "fieldset-chapter",
      label: "章節名稱編輯",
      "label-for": "input-chapter-title",
      "label-class": "mb-1"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormInput"], {
          id: "input-chapter-title",
          modelValue: $setup.item.title,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
          trim: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    })
  ]);
}
const ChapterEdit = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "ChapterEdit.vue"]]);
export {
  ChapterEdit as default
};
//# sourceMappingURL=ChapterEdit.js.map
