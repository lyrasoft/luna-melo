import { defineComponent, inject, createElementBlock, openBlock, Fragment, renderList, createElementVNode, createTextVNode, normalizeClass, withModifiers, toDisplayString, toRefs, withDirectives, vModelText, useModel, ref, onMounted, createVNode, withCtx, TransitionGroup, createBlock, createCommentVNode } from "vue";
import { uniqueItemList } from "@lyrasoft/ts-toolkit/vue";
import "./index-BSgsF2PB.js";
import { u as useSegmentEditor, _ as _sfc_main$4 } from "./useSegmentEditor.js";
import { _ as _sfc_main$3 } from "./classes-BW_GpXTu.js";
import { _ as _sfc_main$6, a as _sfc_main$7 } from "./BFormInput.vue_vue_type_script_setup_true_lang-DRDhfD8d.js";
import { u as useQuestionPresenter, a as useQuestionController, Q as QuestionEdit, _ as _sfc_main$5, b as _sfc_main$1$1 } from "./QuestionEdit.js";
import { VueDraggable } from "vue-draggable-plus";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
import { deleteConfirm } from "@windwalker-io/unicorn-next";
import { u as useDebounceFn } from "./index2.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuestionTypeSelector",
  emits: ["selected"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const questionDefines = inject("question.defines");
    const emit = __emit;
    function select(type) {
      emit("selected", type);
    }
    const __returned__ = { questionDefines, emit, select };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$6 = { class: "row row-cols-2 gy-3" };
const _hoisted_2$5 = { class: "c-question-button card border h-100" };
const _hoisted_3$4 = { class: "card-body d-flex flex-column gap-3" };
const _hoisted_4$4 = { class: "d-flex align-items-center gap-2" };
const _hoisted_5$4 = ["onClick"];
const _hoisted_6$4 = { class: "m-0" };
const _hoisted_7$2 = { class: "text-muted small" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($setup.questionDefines, (define, key) => {
      return openBlock(), createElementBlock("div", {
        key: define.id,
        class: "col"
      }, [
        createElementVNode("div", _hoisted_2$5, [
          createElementVNode("div", _hoisted_3$4, [
            createElementVNode("div", _hoisted_4$4, [
              createElementVNode("i", {
                class: normalizeClass(define.icon),
                style: { "font-size": "2rem" }
              }, null, 2),
              _cache[0] || (_cache[0] = createTextVNode()),
              createElementVNode("a", {
                href: "#",
                class: "link-dark text-decoration-none stretched-link",
                onClick: withModifiers(($event) => $setup.select(key), ["prevent"])
              }, [
                createElementVNode("h3", _hoisted_6$4, toDisplayString(define.title), 1)
              ], 8, _hoisted_5$4)
            ]),
            _cache[1] || (_cache[1] = createTextVNode()),
            createElementVNode("div", _hoisted_7$2, toDisplayString(define.description), 1),
            _cache[2] || (_cache[2] = createTextVNode()),
            _cache[3] || (_cache[3] = createElementVNode("div", { class: "mt-auto" }, [
              createElementVNode("button", {
                type: "button",
                class: "btn btn-outline-primary btn-sm"
              }, "\r\n              按此選擇\r\n            ")
            ], -1))
          ])
        ])
      ]);
    }), 128))
  ]);
}
const QuestionTypeSelector = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$6], ["__scopeId", "data-v-3a690932"], ["__file", "QuestionTypeSelector.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuestionItem",
  props: {
    item: {},
    index: {}
  },
  emits: ["edit", "delete", "save", "saving", "saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { save, remove } = useQuestionController();
    const { typeToTitle, scoreLimit } = useQuestionPresenter();
    const { item } = toRefs(props);
    function editQuestion() {
      emit("edit", item.value);
    }
    async function deleteQuestion() {
      const v = await deleteConfirm(
        "確定要刪除這個問題嗎？",
        ""
      );
      if (v) {
        await remove(item.value.id);
        emit("delete", item.value.id);
      }
    }
    const changeScore = useDebounceFn(async () => {
      item.value.score = scoreLimit(item.value.score);
      emit("saving");
      await save(item.value, 0);
      emit("saved");
    }, 300);
    const __returned__ = { props, emit, save, remove, typeToTitle, scoreLimit, item, editQuestion, deleteQuestion, changeScore };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$5 = ["data-qn-id"];
const _hoisted_2$4 = { class: "c-question-item card border" };
const _hoisted_3$3 = {
  class: "c-question-item__content card-body p-1 d-flex align-items-center gap-2",
  style: { "min-width": "1px" }
};
const _hoisted_4$3 = {
  class: "text-nowrap text-muted",
  style: { "min-width": "2em" }
};
const _hoisted_5$3 = { class: "text-nowrap me-3" };
const _hoisted_6$3 = { class: "d-flex align-items-center gap-3 text-nowrap ms-auto" };
const _hoisted_7$1 = { class: "text-nowrap me-1 d-flex align-items-center" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-question-item-outside",
    "data-qn-id": $setup.item.id
  }, [
    createElementVNode("div", _hoisted_2$4, [
      createElementVNode("div", _hoisted_3$3, [
        _cache[6] || (_cache[6] = createElementVNode("div", {
          class: "c-question-item__handle handle px-2",
          style: { "cursor": "move", "z-index": "3" }
        }, [
          createElementVNode("span", { class: "fal fa-bars" })
        ], -1)),
        _cache[7] || (_cache[7] = createTextVNode()),
        createElementVNode("div", _hoisted_4$3, toDisplayString($setup.props.index + 1) + ".\r\n        ", 1),
        _cache[8] || (_cache[8] = createTextVNode()),
        createElementVNode("div", _hoisted_5$3, toDisplayString($setup.typeToTitle($setup.item.type)), 1),
        _cache[9] || (_cache[9] = createTextVNode()),
        createElementVNode("a", {
          href: "#",
          class: "c-question-item__title text-truncate text-decoration-none",
          onClick: withModifiers($setup.editQuestion, ["prevent"])
        }, toDisplayString($setup.item.content || "題目內容未填寫"), 1),
        _cache[10] || (_cache[10] = createTextVNode()),
        createElementVNode("div", _hoisted_6$3, [
          createElementVNode("div", _hoisted_7$1, [
            _cache[2] || (_cache[2] = createElementVNode("div", { class: "me-1" }, "\r\n              分數\r\n            ", -1)),
            _cache[3] || (_cache[3] = createTextVNode()),
            createElementVNode("div", null, [
              withDirectives(createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.score = $event),
                type: "number",
                id: "input-score",
                class: "form-control form-control-sm",
                style: { "width": "5em" },
                onInput: _cache[1] || (_cache[1] = (...args) => $setup.changeScore && $setup.changeScore(...args))
              }, null, 544), [
                [vModelText, $setup.item.score]
              ])
            ])
          ]),
          _cache[5] || (_cache[5] = createTextVNode()),
          createElementVNode("div", { class: "c-question-item__delete" }, [
            createElementVNode("a", {
              href: "javascript://",
              class: "link-danger",
              onClick: $setup.deleteQuestion
            }, [..._cache[4] || (_cache[4] = [
              createElementVNode("i", { class: "fal fa-trash" }, null, -1)
            ])])
          ])
        ])
      ])
    ])
  ], 8, _hoisted_1$5);
}
const QuestionItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$5], ["__file", "QuestionItem.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionQuizEdit",
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
    const questions = ref([]);
    const loading = ref(false);
    onMounted(async () => {
      await prepareQuestions();
    });
    const { saving } = useSegmentEditor();
    const { getQuestions, createEmptyQuestion, save, reorder: reorderQuestions, remove } = useQuestionController();
    async function prepareQuestions() {
      loading.value = true;
      const items = await getQuestions(item.value.id);
      questions.value = uniqueItemList(items);
      loading.value = false;
    }
    async function reorder() {
      const orders = {};
      questions.value.forEach((item2, i) => {
        orders[item2.id] = i + 1;
      });
      await reorderQuestions(orders);
    }
    async function deleteQuestion(id) {
      questions.value = questions.value.filter((item2) => item2.id !== id);
    }
    const questionTypeSelectorModalOpen = ref(false);
    function newQuestion() {
      questionTypeSelectorModalOpen.value = true;
    }
    async function newQuestionSelected(type) {
      const question = createEmptyQuestion(item.value.lessonId, item.value.id);
      question.type = type;
      question.ordering = questions.value.length + 1;
      const newItem = await save(question, 1);
      questions.value.push(newItem);
      editQuestion(newItem);
    }
    const questionEditModalOpen = ref(false);
    const currentEditQuestion = ref();
    const questionsSaving = ref(false);
    const questionSaved = ref(false);
    function editQuestion(question) {
      currentEditQuestion.value = question;
      questionEditModalOpen.value = true;
      questionsSaving.value = false;
      questionSaved.value = false;
    }
    const __returned__ = { item, questions, loading, saving, getQuestions, createEmptyQuestion, save, reorderQuestions, remove, prepareQuestions, reorder, deleteQuestion, questionTypeSelectorModalOpen, newQuestion, newQuestionSelected, questionEditModalOpen, currentEditQuestion, questionsSaving, questionSaved, editQuestion, get BFormGroup() {
      return _sfc_main$7;
    }, get BFormInput() {
      return _sfc_main$6;
    }, get BFormRadio() {
      return _sfc_main$1$1;
    }, get BFormRadioGroup() {
      return _sfc_main$5;
    }, get BModal() {
      return _sfc_main$4;
    }, get BSpinner() {
      return _sfc_main$3;
    }, get VueDraggable() {
      return VueDraggable;
    }, QuestionTypeSelector, QuestionItem, QuestionEdit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "c-quiz-edit d-flex flex-column gap-4" };
const _hoisted_2 = {
  key: 0,
  class: "text-center"
};
const _hoisted_3 = {
  key: 1,
  class: "c-quiz-list"
};
const _hoisted_4 = { class: "d-flex align-items-center gap-3" };
const _hoisted_5 = {
  key: 0,
  class: "text-muted small"
};
const _hoisted_6 = {
  key: 1,
  class: "small text-muted"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createVNode($setup["BFormGroup"], {
      label: "小節名稱",
      "label-for": "input-section-title",
      "label-class": "mb-2",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormInput"], {
          id: "input-section-title",
          modelValue: $setup.item.title,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
          trim: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[22] || (_cache[22] = createTextVNode()),
    createVNode($setup["BFormGroup"], {
      label: "是否可跳過此測驗閱讀下一章節？",
      "label-for": "input-section-skip",
      "label-class": "mb-2",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createVNode($setup["BFormRadioGroup"], {
          modelValue: $setup.item.canSkip,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.item.canSkip = $event),
          "button-variant": "outline-primary",
          name: "input-section-skip",
          buttons: ""
        }, {
          default: withCtx(() => [
            createVNode($setup["BFormRadio"], { value: true }, {
              default: withCtx(() => [..._cache[10] || (_cache[10] = [
                createTextVNode("可以", -1)
              ])]),
              _: 1
            }),
            _cache[12] || (_cache[12] = createTextVNode()),
            createVNode($setup["BFormRadio"], { value: false }, {
              default: withCtx(() => [..._cache[11] || (_cache[11] = [
                createTextVNode("不可以", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[23] || (_cache[23] = createTextVNode()),
    createElementVNode("div", _hoisted_1, [
      _cache[14] || (_cache[14] = createElementVNode("div", { class: "h6 c-quiz-edit__title" }, "\r\n        測驗內容\r\n      ", -1)),
      _cache[15] || (_cache[15] = createTextVNode()),
      $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_2, [
        createVNode($setup["BSpinner"])
      ])) : (openBlock(), createElementBlock("div", _hoisted_3, [
        createVNode($setup["VueDraggable"], {
          modelValue: $setup.questions,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.questions = $event),
          class: "d-flex flex-column gap-2",
          "item-key": "uid",
          handle: ".handle",
          animation: 300,
          "on-update": $setup.reorder
        }, {
          default: withCtx(() => [
            createVNode(TransitionGroup, { name: "fade" }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList($setup.questions, (element, index) => {
                  return openBlock(), createBlock($setup["QuestionItem"], {
                    item: element,
                    key: element.id,
                    index,
                    onEdit: $setup.editQuestion,
                    onDelete: $setup.deleteQuestion,
                    onSaving: _cache[2] || (_cache[2] = ($event) => $setup.saving = true),
                    onSaved: _cache[3] || (_cache[3] = ($event) => {
                      $setup.saving = false;
                    }),
                    style: { "animation-duration": "300ms" }
                  }, null, 8, ["item", "index"]);
                }), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ])),
      _cache[16] || (_cache[16] = createTextVNode()),
      createElementVNode("div", { class: "text-center" }, [
        createElementVNode("button", {
          type: "button",
          class: "btn btn-primary btn-sm text-nowrap",
          style: { "width": "150px" },
          onClick: $setup.newQuestion
        }, [..._cache[13] || (_cache[13] = [
          createElementVNode("i", { class: "fas fa-plus" }, null, -1),
          createTextVNode("\r\n          新增題目\r\n        ", -1)
        ])])
      ])
    ]),
    _cache[24] || (_cache[24] = createTextVNode()),
    createVNode($setup["BModal"], {
      id: "question-edit-modal",
      title: "題目編輯",
      modelValue: $setup.questionEditModalOpen,
      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.questionEditModalOpen = $event),
      "no-footer": "",
      lazy: "",
      "unmount-lazy": "",
      size: "lg",
      bodyBgVariant: "light",
      contentClass: "bg-white"
    }, {
      title: withCtx(() => [
        createElementVNode("div", _hoisted_4, [
          _cache[19] || (_cache[19] = createElementVNode("div", null, "\r\n            題目編輯\r\n          ", -1)),
          _cache[20] || (_cache[20] = createTextVNode()),
          $setup.questionsSaving ? (openBlock(), createElementBlock("div", _hoisted_5, [
            createVNode($setup["BSpinner"], {
              small: "",
              type: "border",
              class: "me-1"
            }),
            _cache[17] || (_cache[17] = createTextVNode("\r\n            儲存中...\r\n          ", -1))
          ])) : $setup.questionSaved ? (openBlock(), createElementBlock("div", _hoisted_6, [..._cache[18] || (_cache[18] = [
            createElementVNode("i", { class: "fas fa-check text-success" }, null, -1),
            createTextVNode("\r\n            已儲存\r\n          ", -1)
          ])])) : createCommentVNode("", true)
        ])
      ]),
      default: withCtx(() => [
        _cache[21] || (_cache[21] = createTextVNode()),
        $setup.currentEditQuestion ? (openBlock(), createBlock($setup["QuestionEdit"], {
          key: 0,
          modelValue: $setup.currentEditQuestion,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.currentEditQuestion = $event),
          onSaving: _cache[6] || (_cache[6] = ($event) => $setup.questionsSaving = true),
          onSaved: _cache[7] || (_cache[7] = ($event) => {
            $setup.questionSaved = true;
            $setup.questionsSaving = false;
          })
        }, null, 8, ["modelValue"])) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["modelValue"]),
    _cache[25] || (_cache[25] = createTextVNode()),
    createVNode($setup["BModal"], {
      id: "question-type-selector-modal",
      title: "選擇題目類型",
      modelValue: $setup.questionTypeSelectorModalOpen,
      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.questionTypeSelectorModalOpen = $event),
      "no-footer": "",
      lazy: "",
      "unmount-lazy": ""
    }, {
      default: withCtx(() => [
        createVNode($setup["QuestionTypeSelector"], { onSelected: $setup.newQuestionSelected })
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]);
}
const SectionQuizEdit = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SectionQuizEdit.vue"]]);
export {
  SectionQuizEdit as default
};
//# sourceMappingURL=SectionQuizEdit.js.map
