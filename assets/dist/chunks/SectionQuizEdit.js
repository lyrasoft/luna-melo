import { defineComponent, toRefs, createElementBlock, openBlock, createElementVNode, createTextVNode, toDisplayString, withDirectives, vModelText, resolveComponent, createVNode, ref, onMounted, withCtx, watch, createBlock, createCommentVNode } from "vue";
import { _ as _export_sfc, u as useDebounceFn, s as swal, a as useModal } from "./segment-editor.js";
var QuestionType = /* @__PURE__ */ ((QuestionType2) => {
  QuestionType2["boolean"] = "是非題";
  QuestionType2["multiple"] = "多選題";
  QuestionType2["select"] = "單選題";
  return QuestionType2;
})(QuestionType || {});
function scoreLimit(score) {
  if (score > 100) {
    return 100;
  }
  if (score < 1) {
    return 1;
  }
  return score;
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "QuestionItem",
  props: {
    item: {},
    index: {}
  },
  emits: ["edit", "delete", "save"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { item } = toRefs(props);
    function editQuestion() {
      emit("edit", item.value);
    }
    function deleteQuestion() {
      emit("delete", item.value.id);
    }
    const changeScore = u.debounce(() => {
      item.value.score = scoreLimit(item.value.score);
      emit("save", item.value);
    }, 300);
    const __returned__ = { props, emit, item, editQuestion, deleteQuestion, changeScore, get QuestionType() {
      return QuestionType;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$4 = { class: "c-question-item" };
const _hoisted_2$4 = { class: "c-question-item__wrapper d-flex border rounded-1 my-2" };
const _hoisted_3$3 = {
  class: "c-question-item__content d-flex align-items-center ms-2",
  style: { "min-width": "1px" }
};
const _hoisted_4$2 = { class: "me-1 text-nowrap text-muted" };
const _hoisted_5$2 = { class: "text-nowrap me-1" };
const _hoisted_6$2 = { class: "d-flex align-items-center text-nowrap ms-auto" };
const _hoisted_7$1 = { class: "text-nowrap me-1 d-flex align-items-center" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", _hoisted_1$4, [
      createElementVNode("div", _hoisted_2$4, [
        _cache[9] || (_cache[9] = createElementVNode("div", { class: "c-question-item__handle handle" }, [
          createElementVNode("span", { class: "fal fa-bars" }),
          createTextVNode(),
          createElementVNode("span", { class: "sr-only" }, "Drag")
        ], -1)),
        _cache[10] || (_cache[10] = createTextVNode()),
        createElementVNode("div", _hoisted_3$3, [
          createElementVNode("div", _hoisted_4$2, toDisplayString($setup.props.index + 1) + ".\n          ", 1),
          _cache[6] || (_cache[6] = createTextVNode()),
          createElementVNode("div", _hoisted_5$2, toDisplayString($setup.QuestionType[$setup.item.type.replace("-", "_")]), 1),
          _cache[7] || (_cache[7] = createTextVNode()),
          createElementVNode("a", {
            class: "c-question-item__title text-truncate pe-1 me-2",
            onClick: $setup.editQuestion
          }, toDisplayString($setup.item.content || "題目內容未填寫"), 1),
          _cache[8] || (_cache[8] = createTextVNode()),
          createElementVNode("div", _hoisted_6$2, [
            createElementVNode("div", _hoisted_7$1, [
              _cache[2] || (_cache[2] = createElementVNode("div", { class: "me-1" }, "\n                分數\n              ", -1)),
              _cache[3] || (_cache[3] = createTextVNode()),
              createElementVNode("div", null, [
                withDirectives(createElementVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.score = $event),
                  type: "number",
                  id: "input-score",
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
                class: "btn c-delete-btn",
                onClick: $setup.deleteQuestion
              }, [..._cache[4] || (_cache[4] = [
                createElementVNode("i", { class: "fal fa-trash" }, null, -1)
              ])])
            ])
          ])
        ])
      ])
    ])
  ]);
}
const QuestionItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-5d39d63a"], ["__file", "QuestionItem.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "OptionEdit",
  props: {
    item: {},
    index: {}
  },
  emits: ["delete", "edit", "setAnswer"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { item } = toRefs(props);
    function deleteOption() {
      emit("delete", item.value.id);
    }
    const edit = useDebounceFn(() => {
      emit("edit", item.value);
    }, 300);
    function setIsAnswer() {
      emit("setAnswer", props.index, item.value.isAnswer);
    }
    const __returned__ = { props, emit, item, deleteOption, edit, setIsAnswer };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = { class: "c-option-item" };
const _hoisted_2$3 = { class: "c-option-item__wrapper d-flex border rounded-1 my-2" };
const _hoisted_3$2 = {
  class: "c-option-item__content d-flex justify-content-between align-items-center ms-2",
  style: { "min-width": "1px" }
};
const _hoisted_4$1 = { class: "text-nowrap me-1" };
const _hoisted_5$1 = { class: "d-flex align-items-center text-nowrap ms-auto" };
const _hoisted_6$1 = { class: "text-nowrap me-1 d-flex align-items-center" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BFormInput = resolveComponent("BFormInput");
  const _component_BFormCheckbox = resolveComponent("BFormCheckbox");
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", _hoisted_1$3, [
      createElementVNode("div", _hoisted_2$3, [
        _cache[5] || (_cache[5] = createElementVNode("div", { class: "c-option-item__handle handle" }, [
          createElementVNode("span", { class: "fal fa-bars" }),
          createTextVNode(),
          createElementVNode("span", { class: "sr-only" }, "Drag")
        ], -1)),
        _cache[6] || (_cache[6] = createTextVNode()),
        createElementVNode("div", _hoisted_3$2, [
          createElementVNode("div", _hoisted_4$1, [
            createVNode(_component_BFormInput, {
              modelValue: $setup.item.title,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
              placeholder: "輸入選項內容",
              onInput: $setup.edit
            }, null, 8, ["modelValue", "onInput"])
          ]),
          _cache[4] || (_cache[4] = createTextVNode()),
          createElementVNode("div", _hoisted_5$1, [
            createElementVNode("div", _hoisted_6$1, [
              createVNode(_component_BFormCheckbox, {
                modelValue: $setup.item.isAnswer,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.item.isAnswer = $event),
                onChange: $setup.setIsAnswer,
                switch: ""
              }, null, 8, ["modelValue"])
            ]),
            _cache[3] || (_cache[3] = createTextVNode()),
            createElementVNode("div", { class: "c-option-item__delete" }, [
              createElementVNode("a", {
                href: "javascript://",
                class: "btn c-delete-btn",
                onClick: $setup.deleteOption
              }, [..._cache[2] || (_cache[2] = [
                createElementVNode("i", { class: "fal fa-trash" }, null, -1)
              ])])
            ])
          ])
        ])
      ])
    ])
  ]);
}
const OptionEdit = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-c607d35d"], ["__file", "OptionEdit.vue"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ImageUploader",
  props: {
    label: {},
    image: {}
  },
  emits: ["uploaded", "clear"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const image = ref(props.image);
    const defaultImage = ref("");
    const file = ref(null);
    const loading = ref(false);
    const fileInput = ref();
    function openUpload() {
      fileInput.value.click();
    }
    onMounted(() => {
      defaultImage.value = u.data("defaultImage");
    });
    async function upload(e) {
      await uploadImg(e.target.files[0]);
    }
    async function uploadImg(file2) {
      if (file2 === null) {
        alert("沒有上傳檔案");
        return;
      }
      loading.value = true;
      let formData = new FormData();
      formData.append("file", file2, file2.name);
      formData.append(u.data("csrf-token"), "1");
      const res = await u.$http.post(
        u.route("image_upload"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      image.value = res.data.data.url;
      emit("uploaded", res.data.data.url);
      loading.value = false;
    }
    function clear() {
      image.value = "";
      emit("clear");
    }
    const __returned__ = { props, emit, image, defaultImage, file, loading, fileInput, openUpload, upload, uploadImg, clear };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "c-image-uploader pb-3" };
const _hoisted_2$2 = {
  class: "c-image-uploader__card card overflow-hidden position-relative",
  style: { "padding": "56.25% 0 0 0" }
};
const _hoisted_3$1 = {
  key: 0,
  class: "position-absolute",
  style: { "top": "50%", "left": "50%", "width": "100%", "height": "100%" }
};
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "d-flex" };
const _hoisted_6 = { class: "me-2" };
const _hoisted_7 = { class: "d-none" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BSpinner = resolveComponent("BSpinner");
  const _component_BButton = resolveComponent("BButton");
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("label", null, toDisplayString($setup.props.label), 1),
    _cache[3] || (_cache[3] = createTextVNode()),
    createElementVNode("div", _hoisted_2$2, [
      $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
        createVNode(_component_BSpinner)
      ])) : (openBlock(), createElementBlock("img", {
        key: 1,
        class: "position-absolute",
        src: $setup.image || $setup.defaultImage,
        alt: "Preview",
        style: { "top": "0", "left": "0", "width": "100%", "height": "100%", "object-fit": "cover" }
      }, null, 8, _hoisted_4))
    ]),
    _cache[4] || (_cache[4] = createTextVNode()),
    createElementVNode("div", _hoisted_5, [
      createElementVNode("div", _hoisted_6, [
        createVNode(_component_BButton, {
          variant: "outline-primary",
          onClick: $setup.openUpload
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createTextVNode("\n          上傳檔案\n        ", -1)
          ])]),
          _: 1
        })
      ]),
      _cache[2] || (_cache[2] = createTextVNode()),
      createElementVNode("div", null, [
        createElementVNode("button", {
          type: "button",
          class: "btn btn-outline-danger",
          onClick: $setup.clear
        }, [..._cache[1] || (_cache[1] = [
          createElementVNode("i", { class: "fal fa-trash" }, null, -1)
        ])])
      ])
    ]),
    _cache[5] || (_cache[5] = createTextVNode()),
    createElementVNode("div", _hoisted_7, [
      createElementVNode("input", {
        ref: "fileInput",
        type: "file",
        onChange: $setup.upload,
        accept: "image/*"
      }, null, 544)
    ])
  ]);
}
const ImageUploader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "ImageUploader.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuestionEdit",
  props: {
    question: {}
  },
  emits: ["save"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { question } = toRefs(props);
    const image = ref(null);
    const options = ref([]);
    const typeOptions = [
      { text: "是非題", value: "boolean" },
      { text: "單選題", value: "select" },
      { text: "多選題", value: "multiple" }
    ];
    const booleanOptions = [
      { text: "是", value: "1" },
      { text: "否", value: "0" }
    ];
    const hasOptionsType = ["select", "multiple"];
    onMounted(async () => {
      if (hasOptionsType.indexOf(question.value.type) !== -1) {
        await prepareOptions();
      }
    });
    const changeScore = u.debounce(async () => {
      question.value.score = scoreLimit(question.value.score);
      emit("save", question.value);
    }, 300);
    async function prepareOptions() {
      const res = u.$http.get(
        u.route("prepare_options"),
        {
          params: {
            question_id: question.value.id
          }
        }
      );
      options.value = Utilities.prepareList((await res).data.data);
    }
    async function reorder() {
      const orders = {};
      options.value.forEach((item, i) => {
        orders[item.id] = i + 1;
      });
      await u.$http.post(
        u.route("reorder_options"),
        {
          orders
        }
      );
    }
    async function createOption() {
      const option = {
        id: null,
        question_id: question.value.id,
        title: "",
        is_answer: 0,
        state: 1,
        ordering: options.value.length + 1
      };
      await save(option, 1);
      await prepareOptions();
    }
    async function save(data, isNew = 0) {
      await u.$http.post(
        u.route("save_option"),
        {
          data,
          is_new: isNew
        }
      );
    }
    async function deleteOption(id) {
      const v = await swal(
        {
          title: "確定要刪除這個選項嗎？",
          icon: "warning",
          buttons: {
            cancel: {
              visible: true,
              text: "取消"
            },
            confirm: {
              visible: true,
              text: "確認"
            }
          }
        }
      );
      if (v) {
        await u.$http.post(
          u.route("delete_option"),
          {
            id
          }
        );
        await prepareOptions();
      }
    }
    async function setAnswer(index, currentAnswer) {
      if (question.value.type === "select") {
        options.value.forEach((item) => {
          item.isAnswer = false;
        });
        options.value[index].isAnswer = true;
      }
      if (question.value.type === "multiple") {
        options.value[index].isAnswer = currentAnswer;
      }
      if (currentAnswer === options.value[index].isAnswer) {
        await u.$http.post(
          u.route("save_options"),
          {
            data: options.value
          }
        );
      }
    }
    function imageUploaded(src) {
      question.value.image = src;
      emit("save", question.value);
    }
    function clearImage() {
      question.value.image = "";
      emit("save", question.value);
    }
    watch(question.value, (newValue) => {
      question.value.isMultiple = newValue.type === "multiple";
    }, { deep: true });
    const __returned__ = { props, emit, question, image, options, typeOptions, booleanOptions, hasOptionsType, changeScore, prepareOptions, reorder, createOption, save, deleteOption, setAnswer, imageUploaded, clearImage, OptionEdit, ImageUploader };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  key: 2,
  class: "c-option-list mt-5"
};
const _hoisted_2$1 = { class: "text-center mb-2 mt-3" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BFormTextarea = resolveComponent("BFormTextarea");
  const _component_BFormGroup = resolveComponent("BFormGroup");
  const _component_BFormRadioGroup = resolveComponent("BFormRadioGroup");
  const _component_BFormInput = resolveComponent("BFormInput");
  const _component_draggable = resolveComponent("draggable");
  const _component_BButton = resolveComponent("BButton");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_BFormGroup, {
      label: "題目內容編輯",
      "label-for": "input-question-content",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormTextarea, {
          id: "input-question-content",
          modelValue: $setup.question.content,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.question.content = $event),
          rows: "5"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[10] || (_cache[10] = createTextVNode()),
    createVNode(_component_BFormGroup, {
      label: "題型",
      "label-for": "input-question-type",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormRadioGroup, {
          modelValue: $setup.question.type,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.question.type = $event),
          options: $setup.typeOptions,
          "button-variant": "outline-primary",
          name: "input-question-type",
          buttons: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[11] || (_cache[11] = createTextVNode()),
    createVNode($setup["ImageUploader"], {
      image: $setup.question.image,
      label: "上傳圖片(選填)",
      onUploaded: $setup.imageUploaded,
      onClear: $setup.clearImage
    }, null, 8, ["image"]),
    _cache[12] || (_cache[12] = createTextVNode()),
    $setup.question.type === "boolean" ? (openBlock(), createBlock(_component_BFormGroup, {
      key: 0,
      label: "答案",
      "label-for": "input-question-answer",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormRadioGroup, {
          modelValue: $setup.question.answer,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.question.answer = $event),
          options: $setup.booleanOptions,
          "button-variant": "outline-primary",
          name: "input-question-answer",
          buttons: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    })) : createCommentVNode("", true),
    _cache[13] || (_cache[13] = createTextVNode()),
    $setup.question.type === "cloze" ? (openBlock(), createBlock(_component_BFormGroup, {
      key: 1,
      label: "答案",
      "label-for": "input-question-answer",
      "label-class": "mb-2",
      class: "mb-3"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormInput, {
          id: "input-question-answer",
          modelValue: $setup.question.answer,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.question.answer = $event),
          type: "text",
          trim: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    })) : createCommentVNode("", true),
    _cache[14] || (_cache[14] = createTextVNode()),
    $setup.hasOptionsType.indexOf($setup.question.type) !== -1 ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
      _cache[7] || (_cache[7] = createElementVNode("div", { class: "d-flex" }, [
        createElementVNode("div", { style: { "width": "45px" } }),
        createTextVNode(),
        createElementVNode("div", {
          class: "text-center",
          style: { "width": "300px" }
        }, "\n          選項內容\n        "),
        createTextVNode(),
        createElementVNode("div", { class: "ms-3" }, "\n          正確答案\n        ")
      ], -1)),
      _cache[8] || (_cache[8] = createTextVNode()),
      createVNode(_component_draggable, {
        modelValue: $setup.options,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.options = $event),
        "item-key": "uid",
        handle: ".handle",
        onChange: $setup.reorder
      }, {
        item: withCtx(({ element, index }) => [
          (openBlock(), createBlock($setup["OptionEdit"], {
            item: element,
            key: element.id,
            index,
            onDelete: $setup.deleteOption,
            onEdit: $setup.save,
            onSetAnswer: $setup.setAnswer
          }, null, 8, ["item", "index"]))
        ]),
        _: 1
      }, 8, ["modelValue"]),
      _cache[9] || (_cache[9] = createTextVNode()),
      createElementVNode("div", _hoisted_2$1, [
        createVNode(_component_BButton, { onClick: $setup.createOption }, {
          default: withCtx(() => [..._cache[6] || (_cache[6] = [
            createTextVNode("\n          新增選項\n        ", -1)
          ])]),
          _: 1
        })
      ])
    ])) : createCommentVNode("", true),
    _cache[15] || (_cache[15] = createTextVNode()),
    createVNode(_component_BFormGroup, {
      label: "配分",
      "label-for": "input-question-score",
      "label-class": "mb-2",
      class: "mb-3",
      description: "限填 1~100，測驗滿分為 100"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormInput, {
          id: "input-question-score",
          modelValue: $setup.question.score,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.question.score = $event),
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
const QuestionEdit = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "QuestionEdit.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionQuizEdit",
  props: {
    item: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const item = ref(props.item);
    const skipOptions = [
      { text: "可以", value: true },
      { text: "不可以", value: false }
    ];
    const questions = ref([]);
    const currentQuestion = ref();
    const { show, hide } = useModal();
    const loading = ref(false);
    onMounted(async () => {
      await prepareQuestions();
    });
    async function prepareQuestions() {
      loading.value = true;
      const res = u.$http.get(
        u.route("prepare_questions"),
        {
          params: {
            segment_id: item.value.id
          }
        }
      );
      questions.value = Utilities.prepareList((await res).data.data);
      loading.value = false;
    }
    async function createQuestion() {
      const question = {
        id: null,
        lesson_id: item.value.lessonId,
        segment_id: item.value.id,
        type: "select",
        is_multiple: "0",
        title: "",
        content: "",
        image: "",
        score: 0,
        state: 1,
        ordering: questions.value.length + 1
      };
      await save(question, 1);
      await prepareQuestions();
    }
    async function reorder() {
      const orders = {};
      questions.value.forEach((item2, i) => {
        orders[item2.id] = i + 1;
      });
      await u.$http.post(
        u.route("reorder_questions"),
        {
          orders
        }
      );
    }
    function editQuestion(question) {
      currentQuestion.value = question;
      show();
    }
    async function deleteQuestion(id) {
      const v = await swal(
        {
          title: "確定要刪除這個問題嗎？",
          icon: "warning",
          buttons: {
            cancel: {
              visible: true,
              text: "取消"
            },
            confirm: {
              visible: true,
              text: "確認"
            }
          }
        }
      );
      if (v) {
        await u.$http.post(
          u.route("delete_question"),
          {
            id
          }
        );
        await prepareQuestions();
      }
    }
    async function saveAndCloseModal() {
      await save(currentQuestion.value, 0);
      hide();
    }
    async function save(data, isNew = 0) {
      await u.$http.post(
        u.route("save_question"),
        {
          data,
          isNew
        }
      );
    }
    async function saveQuestion(data) {
      await save(data, 0);
    }
    const __returned__ = { props, item, skipOptions, questions, currentQuestion, show, hide, loading, prepareQuestions, createQuestion, reorder, editQuestion, deleteQuestion, saveAndCloseModal, save, saveQuestion, QuestionItem, QuestionEdit };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "c-quiz-edit" };
const _hoisted_2 = {
  key: 0,
  class: "text-center"
};
const _hoisted_3 = {
  key: 1,
  class: "c-quiz-list"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BFormInput = resolveComponent("BFormInput");
  const _component_BFormGroup = resolveComponent("BFormGroup");
  const _component_BFormRadioGroup = resolveComponent("BFormRadioGroup");
  const _component_BSpinner = resolveComponent("BSpinner");
  const _component_draggable = resolveComponent("draggable");
  const _component_BButton = resolveComponent("BButton");
  const _component_BModal = resolveComponent("BModal");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_BFormGroup, {
      label: "小節名稱編輯",
      "label-for": "input-section-title",
      "label-class": "mb-2",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormInput, {
          id: "input-section-title",
          modelValue: $setup.item.title,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.item.title = $event),
          trim: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[9] || (_cache[9] = createTextVNode()),
    createVNode(_component_BFormGroup, {
      label: "是否可跳過此測驗閱讀下一章節？",
      "label-for": "input-section-skip",
      "label-class": "mb-2",
      class: "mb-5"
    }, {
      default: withCtx(() => [
        createVNode(_component_BFormRadioGroup, {
          modelValue: $setup.item.canSkip,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.item.canSkip = $event),
          options: $setup.skipOptions,
          "button-variant": "outline-primary",
          name: "input-section-skip",
          buttons: ""
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    _cache[10] || (_cache[10] = createTextVNode()),
    createElementVNode("div", _hoisted_1, [
      createElementVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
        _cache[4] || (_cache[4] = createElementVNode("div", { class: "h6 c-quiz-edit__title" }, "\n          測驗內容\n        ", -1)),
        _cache[5] || (_cache[5] = createTextVNode()),
        createElementVNode("div", null, [
          createElementVNode("button", {
            type: "button",
            class: "btn btn-info text-nowrap",
            onClick: $setup.createQuestion
          }, "\n            新增題目\n          ")
        ])
      ]),
      _cache[6] || (_cache[6] = createTextVNode()),
      $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_2, [
        createVNode(_component_BSpinner)
      ])) : (openBlock(), createElementBlock("div", _hoisted_3, [
        createVNode(_component_draggable, {
          modelValue: $setup.questions,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.questions = $event),
          "item-key": "uid",
          handle: ".handle",
          onChange: $setup.reorder
        }, {
          item: withCtx(({ element, index }) => [
            (openBlock(), createBlock($setup["QuestionItem"], {
              item: element,
              key: element.id,
              index,
              onEdit: $setup.editQuestion,
              onDelete: $setup.deleteQuestion,
              onSave: $setup.saveQuestion
            }, null, 8, ["item", "index"]))
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]))
    ]),
    _cache[11] || (_cache[11] = createTextVNode()),
    createVNode(_component_BModal, {
      id: "question-edit-modal",
      "ok-only": "",
      bodyBgVariant: "light",
      contentClass: "bg-white",
      hideFooter: "true",
      lazy: true,
      "dialog-class": "mb-6",
      scrollable: true,
      onHidden: _cache[3] || (_cache[3] = ($event) => $setup.saveQuestion($setup.currentQuestion))
    }, {
      title: withCtx(() => [
        createVNode(_component_BButton, {
          variant: "primary",
          size: "sm",
          onClick: $setup.saveAndCloseModal
        }, {
          default: withCtx(() => [..._cache[7] || (_cache[7] = [
            createTextVNode("\n          儲存\n        ", -1)
          ])]),
          _: 1
        })
      ]),
      default: withCtx(() => [
        _cache[8] || (_cache[8] = createTextVNode()),
        createVNode($setup["QuestionEdit"], {
          question: $setup.currentQuestion,
          onSave: $setup.saveQuestion
        }, null, 8, ["question"])
      ]),
      _: 1
    })
  ]);
}
const SectionQuizEdit = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SectionQuizEdit.vue"]]);
export {
  SectionQuizEdit as default
};
//# sourceMappingURL=SectionQuizEdit.js.map
