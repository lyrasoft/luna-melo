import { ref, readonly, computed, defineComponent, inject, toRefs, createElementBlock, openBlock, createElementVNode, normalizeClass, createTextVNode, withDirectives, toDisplayString, withModifiers, mergeModels, useModel, useTemplateRef, watch, nextTick, normalizeStyle, createVNode, withCtx, TransitionGroup, Fragment, renderList, createBlock, defineAsyncComponent, createCommentVNode, resolveDynamicComponent, onErrorCaptured, provide, onMounted, createApp } from "vue";
import { uniqueItemList, uniqueItem } from "@lyrasoft/ts-toolkit/vue";
import { deleteConfirm, slideDown, slideUp, useUnicorn, injectCssToDocument, simpleAlert } from "@windwalker-io/unicorn-next";
import { r as rtlRegistryKey, s as showHideRegistryKey, b as breadcrumbGlobalIndexKey, a as breadcrumbRegistryKey, m as modalManagerKey, o as orchestratorRegistryKey, d as defaultsKey, _ as _export_sfc } from "./_plugin-vue_export-helper.js";
import { u as useSegmentEditor, v as vBTooltip, _ as _sfc_main$6 } from "./useSegmentEditor.js";
import { u as useSegmentController, _ as _sfc_main$5, a as _sfc_main$7 } from "./useSegmentController.js";
import { VueDraggable } from "vue-draggable-plus";
import { useSectionEditComponents } from "../index.js";
const _newOrchestratorRegistry = () => ({
  store: ref([]),
  _isOrchestratorInstalled: ref(false),
  _isToastAppend: ref(false)
});
const createGetActive = (instances) => () => instances.length > 0 ? instances[instances.length - 1] : void 0;
const _newShowHideRegistry = () => {
  const values = ref(/* @__PURE__ */ new Map());
  const register = ({
    id,
    component,
    value,
    toggle,
    show,
    hide,
    registerTrigger,
    unregisterTrigger
  }) => {
    let currentId = id;
    const instanceValue = {
      id,
      component,
      value: readonly(value),
      toggle,
      show,
      hide,
      registerTrigger,
      unregisterTrigger
    };
    let instancesHolder = values.value.get(currentId);
    if (!instancesHolder) {
      const instances = [];
      instancesHolder = {
        instances,
        // Returns the last mounted instance (most recent)
        getActive: createGetActive(instances)
      };
      values.value.set(currentId, instancesHolder);
    }
    instancesHolder.instances.push(instanceValue);
    const componentUid = component.uid;
    return {
      unregister() {
        const holder = values.value.get(currentId);
        if (!holder) return;
        const index = holder.instances.findIndex(
          (inst) => inst.component.uid === componentUid
        );
        if (index !== -1) {
          holder.instances.splice(index, 1);
        }
        if (holder.instances.length === 0) {
          values.value.delete(currentId);
        }
      },
      updateId(newId, oldId) {
        const holder = values.value.get(oldId);
        if (!holder) return;
        const instance = holder.instances.find(
          (inst) => inst.component.uid === componentUid
        );
        if (!instance) return;
        instance.id = newId;
        let newHolder = values.value.get(newId);
        if (!newHolder) {
          const instances = [];
          newHolder = {
            instances,
            getActive: createGetActive(instances)
          };
          values.value.set(newId, newHolder);
        }
        const index = holder.instances.findIndex(
          (inst) => inst.component.uid === componentUid
        );
        if (index !== -1) {
          holder.instances.splice(index, 1);
          newHolder.instances.push(instance);
        }
        if (holder.instances.length === 0) {
          values.value.delete(oldId);
        }
        currentId = newId;
      }
    };
  };
  return {
    register,
    values
  };
};
const rtlPlugin = {
  install(app, options) {
    const rtlDefault = false;
    const localeDefault = void 0;
    const rtlInitial = typeof options?.rtl === "boolean" ? rtlDefault : options?.rtl?.rtlInitial ?? rtlDefault;
    const localeInitial = typeof options?.rtl === "boolean" ? localeDefault : options?.rtl?.localeInitial ?? localeDefault;
    const isRtl = ref(rtlInitial);
    const locale = ref(localeInitial);
    app.provide(rtlRegistryKey, { isRtl, locale });
  }
};
const registryPlugin = {
  install(app) {
    const { register, values } = _newShowHideRegistry();
    app.provide(showHideRegistryKey, { register, values });
    const items = ref({
      [breadcrumbGlobalIndexKey]: []
    });
    const reset = (key = breadcrumbGlobalIndexKey) => {
      items.value[key] = [];
    };
    app.provide(breadcrumbRegistryKey, { items, reset });
    const stack = ref(/* @__PURE__ */ new Map());
    const countStack = computed(() => stack.value.size);
    const valuesStack = computed(() => [...stack.value.values()]);
    const lastStack = computed(() => valuesStack.value[valuesStack.value.length - 1]);
    const pushStack = (modal) => {
      stack.value.set(modal.uid, modal);
    };
    const removeStack = (modal) => {
      stack.value.delete(modal.uid);
    };
    const registry = ref(/* @__PURE__ */ new Map());
    const pushRegistry = (modal) => {
      registry.value.set(modal.uid, modal);
    };
    const removeRegistry = (modal) => {
      registry.value.delete(modal.uid);
    };
    app.provide(modalManagerKey, {
      countStack,
      lastStack,
      registry: computed(() => registry.value),
      stack: valuesStack,
      pushStack,
      removeStack,
      pushRegistry,
      removeRegistry
    });
  }
};
const orchestratorPlugin = {
  install(app) {
    const orchestratorRegistry = _newOrchestratorRegistry();
    app.provide(orchestratorRegistryKey, orchestratorRegistry);
  }
};
const createBootstrap = (pluginData = {}) => ({
  install(app) {
    if ((pluginData.registries ?? true) === true) {
      app.use(registryPlugin, pluginData);
    }
    if ((pluginData.rtl ?? true) === true || typeof pluginData.rtl === "object") {
      app.use(rtlPlugin, pluginData);
    }
    if ((pluginData.orchestrator ?? true) === true) {
      app.use(orchestratorPlugin);
    }
    const val = pluginData?.components ?? {};
    app.provide(defaultsKey, ref(val));
  }
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SectionItem",
  props: {
    section: {},
    chapterIndex: {},
    sectionIndex: {}
  },
  emits: ["edit", "delete", "save"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { remove } = useSegmentController();
    const { closeIfEditing } = useSegmentEditor();
    const defines = inject("section.defines");
    const {
      edit,
      isActive
    } = useSegmentEditor();
    const { section } = toRefs(props);
    async function deleteSection() {
      const v = await deleteConfirm(
        "確定要刪除這個小節嗎？",
        "如果刪除小節，關於小節所有資料都會遺失",
        "warning"
      );
      if (v) {
        await remove(section.value.id);
        closeIfEditing(section.value);
        emit("delete", section.value.id);
      }
    }
    const { save } = useSegmentController();
    function togglePreview() {
      section.value.preview = !section.value.preview;
      save(section.value);
    }
    function segmentTypeTitle(type) {
      return defines?.[type]?.title || "未知類型";
    }
    function segmentTypeIcon(type) {
      return defines?.[type]?.icon || "fas fa-question-circle";
    }
    const __returned__ = { props, emit, remove, closeIfEditing, defines, edit, isActive, section, deleteSection, save, togglePreview, segmentTypeTitle, segmentTypeIcon, get vBTooltip() {
      return vBTooltip;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$4 = ["data-id"];
const _hoisted_2$4 = { class: "card border bg-white" };
const _hoisted_3$4 = {
  class: "c-section-item__content d-flex align-items-center gap-2 w-100",
  style: { "min-width": "1px" }
};
const _hoisted_4$4 = { style: { "z-index": "3" } };
const _hoisted_5$4 = { class: "me-1" };
const _hoisted_6$4 = {
  class: "c-section-item__actions ms-auto d-flex align-items-center gap-2",
  style: { "z-index": "3" }
};
const _hoisted_7$4 = { class: "c-section-item__preview" };
const _hoisted_8$3 = ["innerHTML"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-section-item-outside",
    "data-id": $setup.section.id
  }, [
    createElementVNode("div", _hoisted_2$4, [
      createElementVNode("div", {
        class: normalizeClass(["c-section-item card-body p-2", { "bg-primary-subtle": $setup.isActive($setup.section) }])
      }, [
        createElementVNode("div", _hoisted_3$4, [
          _cache[3] || (_cache[3] = createElementVNode("div", {
            class: "c-section-item__handle handle",
            style: { "cursor": "move", "z-index": "3" }
          }, [
            createElementVNode("span", { class: "fal fa-bars" })
          ], -1)),
          _cache[4] || (_cache[4] = createTextVNode()),
          withDirectives((openBlock(), createElementBlock("div", _hoisted_4$4, [
            createElementVNode("i", {
              class: normalizeClass(["fa-fw", $setup.segmentTypeIcon($setup.section.type)])
            }, null, 2)
          ])), [
            [$setup["vBTooltip"], $setup.segmentTypeTitle($setup.section.type)]
          ]),
          _cache[5] || (_cache[5] = createTextVNode()),
          createElementVNode("div", _hoisted_5$4, toDisplayString($setup.props.chapterIndex + 1) + "." + toDisplayString($setup.props.sectionIndex + 1), 1),
          _cache[6] || (_cache[6] = createTextVNode()),
          createElementVNode("a", {
            href: "#",
            class: "c-section-item__title text-truncate stretched-link text-decoration-none",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.edit($setup.section), ["prevent"]))
          }, toDisplayString($setup.section.title || "無標題小節"), 1),
          _cache[7] || (_cache[7] = createTextVNode()),
          createElementVNode("div", _hoisted_6$4, [
            createElementVNode("div", _hoisted_7$4, [
              createElementVNode("a", {
                href: "javascript://",
                onClick: $setup.togglePreview,
                class: normalizeClass(["btn btn-sm text-nowrap", $setup.section.preview ? "btn-warning" : "btn-outline-secondary"]),
                innerHTML: $setup.section.preview ? "可試閱" : "不可試閱"
              }, null, 10, _hoisted_8$3)
            ]),
            _cache[2] || (_cache[2] = createTextVNode()),
            createElementVNode("div", { class: "c-section-item__delete" }, [
              createElementVNode("a", {
                href: "javascript://",
                onClick: $setup.deleteSection
              }, [..._cache[1] || (_cache[1] = [
                createElementVNode("i", { class: "fal fa-trash text-danger" }, null, -1)
              ])])
            ])
          ])
        ])
      ], 2)
    ])
  ], 8, _hoisted_1$4);
}
const SectionItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "SectionItem.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ChapterItem",
  props: /* @__PURE__ */ mergeModels({
    chapter: {},
    index: {}
  }, {
    "open": { type: Boolean, ...{
      default: false
    } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["delete"], ["update:open"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { save, reorder, remove } = useSegmentController();
    const { closeIfEditing } = useSegmentEditor();
    const chapter = ref(props.chapter);
    const sections = ref(uniqueItemList(chapter.value?.children || []));
    const isOpen = useModel(__props, "open");
    const slideDisplay = ref(isOpen.value ? "display: flex;" : "display: none;");
    const sectionsContainer = useTemplateRef("sectionsContainer");
    watch(isOpen, () => {
      if (!sectionsContainer.value) {
        return;
      }
      slideDisplay.value = "";
      if (isOpen.value) {
        slideDown(sectionsContainer.value, 300, "flex");
      } else {
        slideUp(sectionsContainer.value);
      }
    });
    function open() {
      isOpen.value = true;
    }
    function close() {
      isOpen.value = false;
    }
    function toggleOpen() {
      isOpen.value = !isOpen.value;
    }
    __expose({
      open,
      close,
      toggleOpen
    });
    const {
      isActive,
      edit
    } = useSegmentEditor();
    const u = useUnicorn();
    function newSection() {
      u.trigger("section.new", chapter.value, newSectionSelected);
    }
    async function newSectionSelected(section) {
      const newSection2 = uniqueItem(section);
      sections.value.push(newSection2);
      await nextTick();
      edit(newSection2);
    }
    async function reorderSections() {
      await reorder(sections.value);
    }
    async function deleteSection(id) {
      sections.value = sections.value.filter((s) => s.id !== id);
    }
    async function deleteChapter() {
      const v = await deleteConfirm(
        "確定要刪除這個章節嗎？",
        "如果刪除章節，關於章節所有資料都會遺失",
        "warning"
      );
      if (v) {
        await remove(chapter.value.id);
        closeIfEditing(chapter.value);
        emit("delete", chapter.value.id);
      }
    }
    async function sectionMovedToHere(e) {
      const section = e.data;
      section.parentId = chapter.value.id;
      await save(section);
      await reorder(sections.value);
    }
    const __returned__ = { props, emit, save, reorder, remove, closeIfEditing, chapter, sections, isOpen, slideDisplay, sectionsContainer, open, close, toggleOpen, isActive, edit, u, newSection, newSectionSelected, reorderSections, deleteSection, deleteChapter, sectionMovedToHere, get vBTooltip() {
      return vBTooltip;
    }, get VueDraggable() {
      return VueDraggable;
    }, SectionItem };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = { class: "c-chapter-item-outside" };
const _hoisted_2$3 = { class: "card border" };
const _hoisted_3$3 = { class: "w-100" };
const _hoisted_4$3 = {
  class: "c-chapter-item__content d-flex align-items-center gap-2 w-100",
  style: { "min-width": "1px" }
};
const _hoisted_5$3 = { class: "" };
const _hoisted_6$3 = {
  class: "c-chapter-item__actions ms-auto d-flex align-items-center gap-2",
  style: { "z-index": "3" }
};
const _hoisted_7$3 = { class: "badge bg-secondary rounded-pill" };
const _hoisted_8$2 = { class: "c-section-list" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createElementVNode("div", _hoisted_2$3, [
      createElementVNode("div", {
        class: normalizeClass(["c-chapter-item card-body", { "bg-primary-subtle": $setup.isActive($setup.chapter) }])
      }, [
        createElementVNode("div", _hoisted_3$3, [
          createElementVNode("div", _hoisted_4$3, [
            _cache[5] || (_cache[5] = createElementVNode("div", {
              class: "c-chapter-item__handle handle position-relative",
              style: { "cursor": "move", "z-index": "3" }
            }, [
              createElementVNode("span", { class: "fal fa-fw fa-bars" })
            ], -1)),
            _cache[6] || (_cache[6] = createTextVNode()),
            _cache[7] || (_cache[7] = createElementVNode("div", { style: { "z-index": "3" } }, [
              createElementVNode("i", { class: "fas fa-folder" })
            ], -1)),
            _cache[8] || (_cache[8] = createTextVNode()),
            createElementVNode("div", _hoisted_5$3, toDisplayString($setup.props.index + 1) + ".\n            ", 1),
            _cache[9] || (_cache[9] = createTextVNode()),
            createElementVNode("a", {
              href: "#",
              class: "c-chapter-item__title text-truncate stretched-link text-decoration-none",
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.edit($setup.chapter), ["prevent"]))
            }, toDisplayString($setup.chapter?.title || "(無章節名稱)"), 1),
            _cache[10] || (_cache[10] = createTextVNode()),
            createElementVNode("div", _hoisted_6$3, [
              createElementVNode("span", _hoisted_7$3, toDisplayString($setup.sections.length), 1),
              _cache[3] || (_cache[3] = createTextVNode()),
              withDirectives((openBlock(), createElementBlock("a", {
                href: "javascript://",
                class: "c-chapter-item__delete",
                onClick: $setup.deleteChapter
              }, [..._cache[2] || (_cache[2] = [
                createElementVNode("i", { class: "fal fa-trash text-danger" }, null, -1)
              ])])), [
                [$setup["vBTooltip"], "刪除章節"]
              ]),
              _cache[4] || (_cache[4] = createTextVNode()),
              withDirectives((openBlock(), createElementBlock("a", {
                href: "javascript://",
                class: "c-chapter-item__toggle",
                onClick: $setup.toggleOpen
              }, [
                createElementVNode("i", {
                  class: normalizeClass(["far", [$setup.isOpen ? "fa-chevron-down" : "fa-chevron-up"]])
                }, null, 2)
              ])), [
                [$setup["vBTooltip"], "顯示/隱藏小節"]
              ])
            ])
          ])
        ])
      ], 2),
      _cache[13] || (_cache[13] = createTextVNode()),
      createElementVNode("div", {
        ref: "sectionsContainer",
        class: "card-body bg-light flex-column gap-3",
        style: normalizeStyle($setup.slideDisplay)
      }, [
        createElementVNode("div", _hoisted_8$2, [
          createVNode($setup["VueDraggable"], {
            modelValue: $setup.sections,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.sections = $event),
            "item-key": "uid",
            handle: ".handle",
            class: "d-flex flex-column gap-2",
            group: "sections",
            animation: 300,
            "on-add": $setup.sectionMovedToHere,
            "on-update": $setup.reorderSections
          }, {
            default: withCtx(() => [
              createVNode(TransitionGroup, { name: "fade" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($setup.sections, (element, index) => {
                    return openBlock(), createBlock($setup["SectionItem"], {
                      key: element.uid,
                      section: element,
                      chapterIndex: $setup.props.index,
                      sectionIndex: index,
                      style: { "animation-duration": "300ms" },
                      onDelete: $setup.deleteSection
                    }, null, 8, ["section", "chapterIndex", "sectionIndex"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _cache[12] || (_cache[12] = createTextVNode()),
        createElementVNode("div", { class: "text-center" }, [
          createElementVNode("button", {
            type: "button",
            class: "btn btn-outline-secondary btn-sm",
            onClick: $setup.newSection
          }, [..._cache[11] || (_cache[11] = [
            createElementVNode("i", { class: "far fa-plus" }, null, -1),
            createTextVNode("\n            新增小節\n          ", -1)
          ])])
        ])
      ], 4)
    ])
  ]);
}
const ChapterItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "ChapterItem.vue"]]);
function resolveSectionEditComponent(define) {
  if (define.vueComponentUrl) {
    return defineAsyncComponent(() => import(
      /* @vite-ignore */
      define.vueComponentUrl
    ));
  }
  if (define.vueComponentName) {
    return define.vueComponentName;
  }
  const components = useSectionEditComponents();
  return defineAsyncComponent(components[define.id]);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SegmentEditBox",
  props: {
    sectionDefines: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const {
      isEditing,
      segment,
      type,
      isChapter,
      saving,
      currentEditingId
    } = useSegmentEditor();
    const saved = ref(false);
    watch(saving, (saving2) => {
      if (!saving2) {
        saved.value = true;
      }
    });
    watch(currentEditingId, () => {
      saved.value = false;
    });
    const editComponent = computed(() => {
      if (!isEditing.value) {
        return null;
      }
      if (isChapter.value) {
        return defineAsyncComponent(() => import("./ChapterEdit.js"));
      } else if (type.value) {
        const define = props.sectionDefines[type.value];
        return resolveSectionEditComponent(define);
      }
    });
    const editContainer = ref();
    watch(editComponent, () => {
      setTimeout(() => {
        if (editComponent.value && editContainer.value) {
          editContainer.value.querySelector("input[type=text]")?.focus();
        }
      }, 300);
    });
    const __returned__ = { props, isEditing, segment, type, isChapter, saving, currentEditingId, saved, editComponent, editContainer, get BSpinner() {
      return _sfc_main$5;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = {
  class: "card position-sticky",
  style: { "top": "var(--melo-segment-edit-sticky-top, 100px)" }
};
const _hoisted_2$2 = { class: "card-header d-flex align-items-center justify-content-between" };
const _hoisted_3$2 = { class: "d-flex align-items-center gap-2" };
const _hoisted_4$2 = { class: "m-0" };
const _hoisted_5$2 = {
  key: 0,
  class: ""
};
const _hoisted_6$2 = {
  key: 1,
  class: "text-success"
};
const _hoisted_7$2 = { key: 0 };
const _hoisted_8$1 = {
  key: 0,
  ref: "editContainer",
  class: "card-body"
};
const _hoisted_9$1 = {
  key: 1,
  class: "p-5 text-center"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("div", _hoisted_2$2, [
      createElementVNode("div", _hoisted_3$2, [
        createElementVNode("h3", _hoisted_4$2, [
          $setup.isChapter ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode("\n            編輯章節\n          ")
          ], 64)) : $setup.isEditing ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode("\n            編輯小節\n          ")
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createTextVNode("\n            編輯\n          ")
          ], 64))
        ]),
        _cache[3] || (_cache[3] = createTextVNode()),
        $setup.saving ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
          createVNode($setup["BSpinner"], { small: "" }),
          _cache[1] || (_cache[1] = createTextVNode("\n          儲存中...\n        ", -1))
        ])) : $setup.saved ? (openBlock(), createElementBlock("div", _hoisted_6$2, [..._cache[2] || (_cache[2] = [
          createElementVNode("i", { class: "far fa-check" }, null, -1),
          createTextVNode("\n          已儲存\n        ", -1)
        ])])) : createCommentVNode("", true)
      ]),
      _cache[5] || (_cache[5] = createTextVNode()),
      $setup.isEditing ? (openBlock(), createElementBlock("div", _hoisted_7$2, [..._cache[4] || (_cache[4] = [
        createElementVNode("span", { class: "badge bg-warning" }, "\n          修改後會即時儲存\n        ", -1)
      ])])) : createCommentVNode("", true)
    ]),
    _cache[7] || (_cache[7] = createTextVNode()),
    $setup.segment && $setup.editComponent ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
      (openBlock(), createBlock(resolveDynamicComponent($setup.editComponent), {
        modelValue: $setup.segment,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.segment = $event)
      }, null, 8, ["modelValue"]))
    ], 512)) : (openBlock(), createElementBlock("div", _hoisted_9$1, [..._cache[6] || (_cache[6] = [
      createElementVNode("div", {
        class: "text-muted",
        style: { "margin": "100px auto" }
      }, "\n        請選擇或新增章節以進行編輯\n      ", -1)
    ])]))
  ]);
}
const SegmentEditBox = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "SegmentEditBox.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SectionTypeSelector",
  props: {
    sectionDefines: {}
  },
  emits: ["selected"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    function select(type) {
      emit("selected", type);
    }
    const __returned__ = { props, emit, select };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "row row-cols-2 gy-3" };
const _hoisted_2$1 = { class: "c-section-button card border h-100" };
const _hoisted_3$1 = { class: "card-body d-flex flex-column gap-3" };
const _hoisted_4$1 = { class: "d-flex align-items-center gap-2" };
const _hoisted_5$1 = ["onClick"];
const _hoisted_6$1 = { class: "m-0" };
const _hoisted_7$1 = { class: "text-muted small" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.sectionDefines, (define, key) => {
      return openBlock(), createElementBlock("div", {
        key: define.id,
        class: "col"
      }, [
        createElementVNode("div", _hoisted_2$1, [
          createElementVNode("div", _hoisted_3$1, [
            createElementVNode("div", _hoisted_4$1, [
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
                createElementVNode("h3", _hoisted_6$1, toDisplayString(define.title), 1)
              ], 8, _hoisted_5$1)
            ]),
            _cache[1] || (_cache[1] = createTextVNode()),
            createElementVNode("div", _hoisted_7$1, toDisplayString(define.description), 1),
            _cache[2] || (_cache[2] = createTextVNode()),
            _cache[3] || (_cache[3] = createElementVNode("div", { class: "mt-auto" }, [
              createElementVNode("button", {
                type: "button",
                class: "btn btn-outline-primary btn-sm"
              }, "\n              按此選擇\n            ")
            ], -1))
          ])
        ])
      ]);
    }), 128))
  ]);
}
const TypeSelector = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-865aad2e"], ["__file", "SectionTypeSelector.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SegmentEditorApp",
  props: {
    lessonId: {},
    sectionDefines: {},
    questionDefines: {},
    segments: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    import("./vue-animate.min.js").then(({ default: css }) => {
      injectCssToDocument(css);
    });
    onErrorCaptured((e) => {
      simpleAlert("發生錯誤", e.message, "warning");
    });
    const props = __props;
    provide("section.defines", props.sectionDefines);
    provide("question.defines", props.questionDefines);
    const { reorder: reorderSegments, save: saveChapter, remove, createEmptyChapterItem } = useSegmentController();
    const { edit, editById } = useSegmentEditor();
    const items = ref(prepareSegments(props.segments));
    onMounted(() => {
      editById(244, items.value);
    });
    function prepareSegments(items2) {
      items2 = uniqueItemList(items2);
      for (const item of items2) {
        item.__open = false;
      }
      if (items2[0]) {
        items2[0].__open = true;
      }
      return items2;
    }
    async function newChapter() {
      const chapter = createEmptyChapterItem(props.lessonId);
      const newChapter2 = await saveChapter(chapter);
      items.value.push(newChapter2);
      edit(newChapter2);
    }
    async function deleteChapter(id) {
      items.value = items.value.filter((item) => item.id !== id);
    }
    async function reorder() {
      reorderSegments(items.value);
    }
    function toggleAllOpens() {
      const allOpen = items.value.every((item) => item.__open);
      for (const item of items.value) {
        item.__open = !allOpen;
      }
    }
    const u = useUnicorn();
    const { createEmptySectionItem, save: saveSection } = useSegmentController();
    let sectionSelectedCallback = null;
    let currentChapter = null;
    const sectionTypeSelectorModalOpen = ref(false);
    u.on("section.new", (chapter, callback) => {
      currentChapter = chapter;
      sectionSelectedCallback = callback;
      sectionTypeSelectorModalOpen.value = true;
    });
    async function sectionSelected(type) {
      if (!currentChapter) {
        return;
      }
      const section = createEmptySectionItem(currentChapter, type);
      const savedSection = await saveSection(section, true);
      sectionSelectedCallback?.(savedSection);
      sectionTypeSelectorModalOpen.value = false;
    }
    const __returned__ = { props, reorderSegments, saveChapter, remove, createEmptyChapterItem, edit, editById, items, prepareSegments, newChapter, deleteChapter, reorder, toggleAllOpens, u, createEmptySectionItem, saveSection, get sectionSelectedCallback() {
      return sectionSelectedCallback;
    }, set sectionSelectedCallback(v) {
      sectionSelectedCallback = v;
    }, get currentChapter() {
      return currentChapter;
    }, set currentChapter(v) {
      currentChapter = v;
    }, sectionTypeSelectorModalOpen, sectionSelected, get BButton() {
      return _sfc_main$7;
    }, get BModal() {
      return _sfc_main$6;
    }, get VueDraggable() {
      return VueDraggable;
    }, ChapterItem, SegmentEditBox, TypeSelector };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "container" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-lg-5" };
const _hoisted_4 = { class: "card mb-4" };
const _hoisted_5 = { class: "card-body d-flex align-items-center justify-content-between" };
const _hoisted_6 = { class: "bold my-1" };
const _hoisted_7 = { class: "c-chapter-list" };
const _hoisted_8 = { class: "text-center my-4" };
const _hoisted_9 = { class: "col-lg-7" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      createElementVNode("div", _hoisted_3, [
        createElementVNode("div", _hoisted_4, [
          createElementVNode("div", _hoisted_5, [
            createElementVNode("h4", _hoisted_6, "\n              課程章節 (" + toDisplayString($setup.items.length) + ")\n            ", 1),
            _cache[2] || (_cache[2] = createTextVNode()),
            createElementVNode("div", null, [
              createElementVNode("button", {
                type: "button",
                class: "btn btn-outline-secondary btn-sm",
                onClick: $setup.toggleAllOpens
              }, "\n                全體收合/展開\n              ")
            ])
          ])
        ]),
        _cache[4] || (_cache[4] = createTextVNode()),
        createElementVNode("div", _hoisted_7, [
          createVNode($setup["VueDraggable"], {
            modelValue: $setup.items,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.items = $event),
            "item-key": "uid",
            handle: ".handle",
            class: "d-flex flex-column gap-2",
            animation: 300,
            "on-update": $setup.reorder
          }, {
            default: withCtx(() => [
              createVNode(TransitionGroup, { name: "fade" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($setup.items, (element, index) => {
                    return openBlock(), createBlock($setup["ChapterItem"], {
                      key: element.uid,
                      chapter: element,
                      index,
                      open: element.__open,
                      "onUpdate:open": ($event) => element.__open = $event,
                      style: { "animation-duration": "300ms" },
                      onDelete: $setup.deleteChapter
                    }, null, 8, ["chapter", "index", "open", "onUpdate:open"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _cache[5] || (_cache[5] = createTextVNode()),
        createElementVNode("div", _hoisted_8, [
          createVNode($setup["BButton"], {
            variant: "success",
            onClick: $setup.newChapter
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createElementVNode("span", { class: "fal fa-plus" }, null, -1),
              createTextVNode("\n            新增章節\n          ", -1)
            ])]),
            _: 1
          })
        ])
      ]),
      _cache[6] || (_cache[6] = createTextVNode()),
      createElementVNode("div", _hoisted_9, [
        createVNode($setup["SegmentEditBox"], { sectionDefines: $props.sectionDefines }, null, 8, ["sectionDefines"])
      ])
    ]),
    _cache[7] || (_cache[7] = createTextVNode()),
    createVNode($setup["BModal"], {
      modelValue: $setup.sectionTypeSelectorModalOpen,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.sectionTypeSelectorModalOpen = $event),
      title: "選擇想要新增的小節類型",
      "no-footer": "",
      lazy: "",
      "unmount-lazy": "",
      size: "lg"
    }, {
      default: withCtx(() => [
        createVNode($setup["TypeSelector"], {
          sectionDefines: $props.sectionDefines,
          onSelected: $setup.sectionSelected
        }, null, 8, ["sectionDefines"])
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]);
}
const SegmentEditorApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2dee490"], ["__file", "SegmentEditorApp.vue"]]);
function createSegmentEditorApp(props) {
  const app = createApp(
    SegmentEditorApp,
    props
  );
  app.use(createBootstrap());
  return app;
}
export {
  createSegmentEditorApp
};
//# sourceMappingURL=segment-editor.js.map
