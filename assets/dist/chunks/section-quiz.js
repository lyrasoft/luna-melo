import { defineComponent, useTemplateRef, ref, onMounted, computed, defineAsyncComponent, openBlock, createElementBlock, createElementVNode, createTextVNode, Fragment, renderList, createBlock, resolveDynamicComponent, createCommentVNode, createApp } from "vue";
import { useLoading } from "@lyrasoft/ts-toolkit/vue";
import { useHttpClient, simpleAlert, sleep } from "@windwalker-io/unicorn-next";
import { Modal } from "bootstrap";
import { u as useQuestionPresenter } from "./useQuestionPresenter.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const questionFrontComponents = {
  boolean: () => import("./BasicQuestionProcessing.js"),
  select: () => import("./BasicQuestionProcessing.js"),
  multiple: () => import("./BasicQuestionProcessing.js")
};
function useQuestionFrontComponents(id, component) {
  return questionFrontComponents;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionQuizApp",
  props: {
    questionDefines: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const { provideDefines } = useQuestionPresenter();
    provideDefines(props.questionDefines);
    const modalEl = useTemplateRef("modalEl");
    let modal;
    const chapterIndex = ref(0);
    const sectionIndex = ref(0);
    const typeIndex = ref(0);
    const segmentId = ref(0);
    const segmentTitle = ref("");
    const currentSegment = ref();
    const loaded = ref(false);
    onMounted(() => {
      modal = Modal.getOrCreateInstance(modalEl.value);
      const buttons = document.querySelectorAll('[data-task="start-quiz"]');
      for (const button of buttons) {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          loaded.value = false;
          await startQuiz(button);
          loaded.value = true;
          modal.show();
        });
      }
    });
    const form = useTemplateRef("form");
    const questions = ref([]);
    async function startQuiz(button) {
      segmentId.value = Number(button.dataset.segmentId);
      segmentTitle.value = button.dataset.segmentTitle || "";
      chapterIndex.value = Number(button.dataset.chapterIndex) || 0;
      sectionIndex.value = Number(button.dataset.sectionIndex) || 0;
      typeIndex.value = Number(button.dataset.typeIndex) || 0;
      const { get } = await useHttpClient();
      const res = await get(
        `@ajax_lesson/prepareQuestionList?id=${segmentId.value}`
      );
      questions.value = res.data.data.questions;
      for (const question of questions.value) {
        answers.value[question.id] = null;
      }
    }
    const answers = ref({});
    const questionComponents = computed(() => {
      const components = {};
      for (const i in questions.value) {
        const qn = questions.value[i];
        const loader = getQuestionComponent(qn);
        if (!loader) {
          continue;
        }
        components[qn.id] = loader;
      }
      return components;
    });
    function getQuestionComponent(question) {
      const components = useQuestionFrontComponents();
      const component = components[question.type];
      if (!component) {
        return null;
      }
      return defineAsyncComponent(component);
    }
    const { loading, wrap } = useLoading();
    async function alertUnAnswerQuestion(id) {
      const index = questions.value.findIndex((qn) => Number(qn.id) === Number(id));
      await simpleAlert(`第 ${index + 1} 題尚未作答！`, "", "warning");
      const qnContainer = modalEl.value.querySelector(".c-question-list");
      const qnBox = qnContainer?.children[index];
      if (qnBox) {
        qnBox.scrollIntoView({ behavior: "smooth", block: "center" });
        qnBox.style.transition = "all .75s ease-in-out";
        await sleep(500);
        qnBox.style.borderColor = "var(--bs-danger)";
        await sleep(1250);
        qnBox.style.borderColor = "";
      }
    }
    const submit = wrap(async () => {
      const { post } = await useHttpClient();
      for (const id in answers.value) {
        const ans = answers.value[id];
        if (ans === "" || ans == null || Array.isArray(ans) && ans.length === 0) {
          alertUnAnswerQuestion(id);
          return;
        }
      }
      const formData = new FormData(form.value);
      try {
        await post(
          "@ajax_lesson/submitQuiz",
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
    const __returned__ = { props, provideDefines, modalEl, get modal() {
      return modal;
    }, set modal(v) {
      modal = v;
    }, chapterIndex, sectionIndex, typeIndex, segmentId, segmentTitle, currentSegment, loaded, form, questions, startQuiz, answers, questionComponents, getQuestionComponent, loading, wrap, alertUnAnswerQuestion, submit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = {
  ref: "modalEl",
  class: "modal fade c-quiz-modal",
  id: "quiz-modal",
  tabindex: "-1",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "modal-dialog modal-lg" };
const _hoisted_3 = { class: "modal-content" };
const _hoisted_4 = { class: "modal-body px-5 mx-5" };
const _hoisted_5 = {
  ref: "form",
  id: "quiz-form",
  enctype: "multipart/form-data",
  method: "post"
};
const _hoisted_6 = {
  key: 0,
  class: "c-question-list mb-4 d-flex flex-column gap-4"
};
const _hoisted_7 = ["value"];
const _hoisted_8 = { class: "text-center mb-5" };
const _hoisted_9 = ["disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", _hoisted_1, [
      createElementVNode("div", _hoisted_2, [
        createElementVNode("div", _hoisted_3, [
          _cache[9] || (_cache[9] = createElementVNode("div", { class: "modal-header" }, [
            createElementVNode("h4", { class: "modal-title" }, "\n              測驗\n            "),
            createTextVNode(),
            createElementVNode("button", {
              type: "button",
              class: "btn-close",
              "data-bs-dismiss": "modal",
              "aria-label": "Close"
            })
          ], -1)),
          _cache[10] || (_cache[10] = createTextVNode()),
          createElementVNode("div", _hoisted_4, [
            createElementVNode("form", _hoisted_5, [
              _cache[1] || (_cache[1] = createElementVNode("div", { class: "my-4 text-muted text-center j-quiz-title" }, null, -1)),
              _cache[2] || (_cache[2] = createTextVNode()),
              _cache[3] || (_cache[3] = createElementVNode("div", { class: "text-danger mb-5 text-center" }, "\n                ＊提醒您未完成此測驗無法前往下個章節唷！\n              ", -1)),
              _cache[4] || (_cache[4] = createTextVNode()),
              $setup.loaded ? (openBlock(), createElementBlock("div", _hoisted_6, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($setup.questions, (question, index) => {
                  return openBlock(), createElementBlock("div", {
                    class: "card c-question-item-wrapper",
                    key: question.id
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent($setup.questionComponents[question.id]), {
                      class: "card-body",
                      index: index + 1,
                      question,
                      modelValue: $setup.answers[question.id],
                      "onUpdate:modelValue": ($event) => $setup.answers[question.id] = $event
                    }, null, 8, ["index", "question", "modelValue", "onUpdate:modelValue"]))
                  ]);
                }), 128))
              ])) : createCommentVNode("", true),
              _cache[5] || (_cache[5] = createTextVNode()),
              _cache[6] || (_cache[6] = createElementVNode("div", { class: "text-danger text-center mb-5" }, "\n                ＊提交後無法變更答案唷！\n              ", -1)),
              _cache[7] || (_cache[7] = createTextVNode()),
              createElementVNode("input", {
                type: "hidden",
                class: "j-quiz-section-id",
                name: "segment_id",
                value: $setup.segmentId
              }, null, 8, _hoisted_7),
              _cache[8] || (_cache[8] = createTextVNode()),
              createElementVNode("div", _hoisted_8, [
                createElementVNode("button", {
                  type: "button",
                  class: "btn btn-primary btn-lg j-quiz-submit w-100",
                  disabled: $setup.loading,
                  onClick: _cache[0] || (_cache[0] = (...args) => $setup.submit && $setup.submit(...args))
                }, "\n                  提交\n                ", 8, _hoisted_9)
              ])
            ], 512)
          ])
        ])
      ])
    ], 512)
  ]);
}
const SectionQuizApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SectionQuizApp.vue"]]);
async function createSectionQuizApp(props = {}) {
  const app = createApp(SectionQuizApp, props);
  return app;
}
export {
  createSectionQuizApp
};
//# sourceMappingURL=section-quiz.js.map
