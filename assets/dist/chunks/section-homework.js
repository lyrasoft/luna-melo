import { defineComponent, useTemplateRef, ref, onMounted, createElementBlock, openBlock, createElementVNode, createTextVNode, createCommentVNode, toDisplayString, withDirectives, vModelText, vModelRadio, createApp } from "vue";
import { useLoading } from "@lyrasoft/ts-toolkit/vue";
import { useHttpClient, simpleAlert } from "@windwalker-io/unicorn-next";
import { Modal } from "bootstrap";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionHomeworkApp",
  setup(__props, { expose: __expose }) {
    __expose();
    const form = useTemplateRef("form");
    const modalEl = useTemplateRef("modalEl");
    let modal;
    const chapterIndex = ref(0);
    const sectionIndex = ref(0);
    const typeIndex = ref(0);
    const segmentId = ref(0);
    const segmentTitle = ref("");
    const currentSegment = ref();
    onMounted(() => {
      modal = Modal.getOrCreateInstance(modalEl.value);
      const buttons = document.querySelectorAll('[data-task="start-homework"]');
      for (const button of buttons) {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          await startHomework(button);
          modal.show();
        });
      }
    });
    async function startHomework(button) {
      segmentId.value = Number(button.dataset.segmentId);
      segmentTitle.value = button.dataset.segmentTitle || "";
      chapterIndex.value = Number(button.dataset.chapterIndex) || 0;
      sectionIndex.value = Number(button.dataset.sectionIndex) || 0;
      typeIndex.value = Number(button.dataset.typeIndex) || 0;
      description.value = "";
      file.value = void 0;
      frontShow.value = true;
      const { get } = await useHttpClient();
      const res = await get(`@ajax_lesson/getSegment?id=${segmentId.value}`);
      currentSegment.value = res.data.data;
    }
    const { wrap, loading } = useLoading();
    const description = ref("");
    const file = ref();
    const frontShow = ref(true);
    const submit = wrap(async () => {
      const { post } = await useHttpClient();
      try {
        const formData = new FormData();
        formData.append("item[segment_id]", segmentId.value.toString());
        formData.append("item[description]", description.value);
        if (file.value) {
          formData.append("item[homework_file]", file.value);
        }
        formData.append("item[front_show]", frontShow.value ? "1" : "0");
        const res = await post("@ajax_lesson/updateHomework", formData);
        await simpleAlert("作業上傳成功！");
        location.reload();
      } catch (e) {
        console.error(e);
        await simpleAlert("作業上傳失敗");
      }
    });
    const __returned__ = { form, modalEl, get modal() {
      return modal;
    }, set modal(v) {
      modal = v;
    }, chapterIndex, sectionIndex, typeIndex, segmentId, segmentTitle, currentSegment, startHomework, wrap, loading, description, file, frontShow, submit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = {
  ref: "modalEl",
  class: "modal fade c-homework-modal",
  id: "homework-modal",
  tabindex: "-1",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "modal-dialog" };
const _hoisted_3 = { class: "modal-content" };
const _hoisted_4 = { class: "modal-body" };
const _hoisted_5 = {
  key: 0,
  id: "homework-form",
  enctype: "multipart/form-data",
  method: "post",
  ref: "form"
};
const _hoisted_6 = { class: "mb-4 text-muted j-homework-title" };
const _hoisted_7 = { class: "mb-4 text-muted j-homework-index" };
const _hoisted_8 = ["innerHTML"];
const _hoisted_9 = { class: "mb-4" };
const _hoisted_10 = { class: "mb-4" };
const _hoisted_11 = { class: "form-group" };
const _hoisted_12 = { class: "mb-4 pb-3" };
const _hoisted_13 = { class: "form-check" };
const _hoisted_14 = { class: "form-check" };
const _hoisted_15 = ["value"];
const _hoisted_16 = { class: "d-grid gap-2 mx-4 mb-5" };
const _hoisted_17 = ["disabled"];
const _hoisted_18 = ["disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", _hoisted_1, [
      createElementVNode("div", _hoisted_2, [
        createElementVNode("div", _hoisted_3, [
          _cache[28] || (_cache[28] = createElementVNode("div", { class: "modal-header" }, [
            createElementVNode("h4", { class: "modal-title" }, "\n            作業上傳\n          "),
            createTextVNode(),
            createElementVNode("button", {
              type: "button",
              class: "btn-close",
              "data-bs-dismiss": "modal",
              "aria-label": "Close"
            })
          ], -1)),
          _cache[29] || (_cache[29] = createTextVNode()),
          createElementVNode("div", _hoisted_4, [
            $setup.currentSegment ? (openBlock(), createElementBlock("form", _hoisted_5, [
              _cache[13] || (_cache[13] = createElementVNode("h6", null, "\n              作業標題\n            ", -1)),
              _cache[14] || (_cache[14] = createTextVNode()),
              createElementVNode("div", _hoisted_6, toDisplayString($setup.segmentTitle), 1),
              _cache[15] || (_cache[15] = createTextVNode()),
              _cache[16] || (_cache[16] = createElementVNode("h6", null, "\n              章節\n            ", -1)),
              _cache[17] || (_cache[17] = createTextVNode()),
              createElementVNode("div", _hoisted_7, "\n              第 " + toDisplayString($setup.chapterIndex) + " 章 作業 " + toDisplayString($setup.typeIndex), 1),
              _cache[18] || (_cache[18] = createTextVNode()),
              _cache[19] || (_cache[19] = createElementVNode("h6", null, "\n              敘述\n            ", -1)),
              _cache[20] || (_cache[20] = createTextVNode()),
              createElementVNode("div", {
                class: "mb-4 text-muted j-homework-content",
                innerHTML: $setup.currentSegment.content
              }, null, 8, _hoisted_8),
              _cache[21] || (_cache[21] = createTextVNode()),
              _cache[22] || (_cache[22] = createElementVNode("h6", null, "\n              作業敘述\n            ", -1)),
              _cache[23] || (_cache[23] = createTextVNode()),
              createElementVNode("div", _hoisted_9, [
                withDirectives(createElementVNode("textarea", {
                  class: "form-control",
                  name: "item[description]",
                  placeholder: "寫下作業敘述...",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.description = $event),
                  rows: "5"
                }, null, 512), [
                  [vModelText, $setup.description]
                ])
              ]),
              _cache[24] || (_cache[24] = createTextVNode()),
              createElementVNode("div", _hoisted_10, [
                createElementVNode("div", _hoisted_11, [
                  _cache[5] || (_cache[5] = createElementVNode("label", {
                    for: "input-homework-file",
                    class: "form-label"
                  }, "上傳檔案", -1)),
                  _cache[6] || (_cache[6] = createTextVNode()),
                  createElementVNode("input", {
                    class: "form-control",
                    type: "file",
                    id: "input-homework-file",
                    name: "item[homework_file]",
                    accept: ".pdf,.jpg,.png,.doc,.docx",
                    onChange: _cache[1] || (_cache[1] = (e) => $setup.file = e.target?.files[0])
                  }, null, 32)
                ])
              ]),
              _cache[25] || (_cache[25] = createTextVNode()),
              createElementVNode("div", _hoisted_12, [
                createElementVNode("div", _hoisted_13, [
                  withDirectives(createElementVNode("input", {
                    class: "form-check-input",
                    type: "radio",
                    name: "item[front_show]",
                    id: "front-show-true",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.frontShow = $event),
                    value: true
                  }, null, 512), [
                    [vModelRadio, $setup.frontShow]
                  ]),
                  _cache[7] || (_cache[7] = createTextVNode()),
                  _cache[8] || (_cache[8] = createElementVNode("label", {
                    class: "form-check-label",
                    for: "front-show-true"
                  }, "\n                  公開在前台\n                ", -1))
                ]),
                _cache[11] || (_cache[11] = createTextVNode()),
                createElementVNode("div", _hoisted_14, [
                  withDirectives(createElementVNode("input", {
                    class: "form-check-input",
                    type: "radio",
                    name: "item[front_show]",
                    id: "front-show-false",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.frontShow = $event),
                    value: false
                  }, null, 512), [
                    [vModelRadio, $setup.frontShow]
                  ]),
                  _cache[9] || (_cache[9] = createTextVNode()),
                  _cache[10] || (_cache[10] = createElementVNode("label", {
                    class: "form-check-label",
                    for: "front-show-false"
                  }, "\n                  不公開在前台\n                ", -1))
                ])
              ]),
              _cache[26] || (_cache[26] = createTextVNode()),
              createElementVNode("input", {
                type: "hidden",
                class: "j-homework-section-id",
                name: "item[segment_id]",
                value: $setup.segmentId
              }, null, 8, _hoisted_15),
              _cache[27] || (_cache[27] = createTextVNode()),
              createElementVNode("div", _hoisted_16, [
                createElementVNode("button", {
                  type: "button",
                  class: "btn btn-primary j-homework-submit",
                  disabled: $setup.loading,
                  onClick: _cache[4] || (_cache[4] = (...args) => $setup.submit && $setup.submit(...args))
                }, "\n                確認送出\n              ", 8, _hoisted_17),
                _cache[12] || (_cache[12] = createTextVNode()),
                createElementVNode("button", {
                  type: "button",
                  class: "btn btn-outline-primary",
                  "data-bs-dismiss": "modal",
                  disabled: $setup.loading
                }, "\n                先跳過此節\n              ", 8, _hoisted_18)
              ])
            ], 512)) : createCommentVNode("", true)
          ])
        ])
      ])
    ], 512)
  ]);
}
const SectionHomeworkApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SectionHomeworkApp.vue"]]);
async function createSectionHomeworkApp(props = {}) {
  const app = createApp(SectionHomeworkApp, props);
  return app;
}
export {
  createSectionHomeworkApp
};
//# sourceMappingURL=section-homework.js.map
