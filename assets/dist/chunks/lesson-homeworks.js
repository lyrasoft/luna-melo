import { defineComponent, ref, onMounted, createElementBlock, openBlock, Fragment, createElementVNode, createTextVNode, createCommentVNode, renderList, toDisplayString, normalizeClass, withModifiers, createApp } from "vue";
import { dateToFormat } from "@lyrasoft/ts-toolkit/datetime";
import { useLoading } from "@lyrasoft/ts-toolkit/vue";
import { useHttpClient } from "@windwalker-io/unicorn-next";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const simularLogo = "data:image/png;base64,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";
const limit = 5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LessonHoemworksApp",
  props: {
    lessonId: {},
    totalAssignment: {},
    lessonSectionOrder: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const { loading, wrap } = useLoading();
    const assignments = ref([]);
    const offset = ref(0);
    const end = ref(false);
    onMounted(() => {
      loadAssignments();
    });
    const loadAssignments = wrap(async () => {
      const { get, post } = await useHttpClient();
      const res = await get(
        "@ajax_lesson/prepareStudentAssignments",
        {
          params: {
            lesson_id: props.lessonId,
            limit,
            offset: offset.value
          }
        }
      );
      assignments.value.push(...res.data.data);
      offset.value += limit;
      if (res.data.data.length < limit) {
        end.value = true;
      }
    });
    function getSectionName(value) {
      for (let i = 0; i < props.lessonSectionOrder.length; i++) {
        for (let j = 0; j < props.lessonSectionOrder[i].length; j++) {
          if (props.lessonSectionOrder[i][j] === value) {
            return `第 ${i + 1} 章 第 ${j + 1} 節`;
          }
        }
      }
      return "";
    }
    const __returned__ = { props, loading, wrap, assignments, offset, limit, end, loadAssignments, getSectionName, get dateToFormat() {
      return dateToFormat;
    }, get simularLogo() {
      return simularLogo;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = {
  id: "homework-list-app",
  class: "card-body c-lesson-detail-card__body"
};
const _hoisted_2 = { class: "c-homework-list" };
const _hoisted_3 = { class: "c-homework-item d-flex gap-3 p-3" };
const _hoisted_4 = { class: "c-homework-item__avatar" };
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "d-flex flex-grow-1 flex-column gap-3" };
const _hoisted_7 = { class: "d-flex align-items-center" };
const _hoisted_8 = { class: "c-homework-item__date" };
const _hoisted_9 = { class: "text-muted" };
const _hoisted_10 = { class: "d-flex" };
const _hoisted_11 = { class: "me-3 pe-1" };
const _hoisted_12 = ["src"];
const _hoisted_13 = { class: "text-muted" };
const _hoisted_14 = {
  key: 1,
  class: "text-muted py-4"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.totalAssignment > 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      _cache[6] || (_cache[6] = createElementVNode("h4", { class: "card-title c-lesson-detail-card__title" }, "\n        作業\n      ", -1)),
      _cache[7] || (_cache[7] = createTextVNode()),
      createElementVNode("div", _hoisted_2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.assignments, (assignment, index) => {
          return openBlock(), createElementBlock("div", _hoisted_3, [
            createElementVNode("div", _hoisted_4, [
              createElementVNode("img", {
                width: "40",
                height: "40",
                class: "img-fluid rounded-circle",
                style: { "min-width": "40px" },
                src: assignment.user.avatar,
                alt: "${assignment.user.name}"
              }, null, 8, _hoisted_5)
            ]),
            _cache[4] || (_cache[4] = createTextVNode()),
            createElementVNode("div", _hoisted_6, [
              createElementVNode("div", _hoisted_7, [
                createTextVNode(toDisplayString(assignment.user.name) + "｜", 1),
                createElementVNode("span", _hoisted_8, toDisplayString($setup.dateToFormat(assignment.created)), 1)
              ]),
              _cache[2] || (_cache[2] = createTextVNode()),
              createElementVNode("div", _hoisted_9, toDisplayString($setup.getSectionName(assignment.segmentId)), 1),
              _cache[3] || (_cache[3] = createTextVNode()),
              createElementVNode("div", _hoisted_10, [
                createElementVNode("div", _hoisted_11, [
                  createElementVNode("img", {
                    width: "100",
                    src: $setup.simularLogo,
                    alt: "作業縮圖"
                  }, null, 8, _hoisted_12)
                ]),
                _cache[1] || (_cache[1] = createTextVNode()),
                createElementVNode("div", _hoisted_13, toDisplayString(assignment.description), 1)
              ])
            ])
          ]);
        }), 256))
      ]),
      _cache[8] || (_cache[8] = createTextVNode()),
      !$setup.end ? (openBlock(), createElementBlock("a", {
        key: 0,
        href: "#",
        onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $setup.loadAssignments && $setup.loadAssignments(...args), ["prevent"])),
        class: normalizeClass(["d-block link-secondary border-top py-4 text-center j-get-student-assignments", { disabled: $setup.loading }])
      }, [..._cache[5] || (_cache[5] = [
        createTextVNode("\n        查看更多 ", -1),
        createElementVNode("i", { class: "fa-solid fa-chevron-down" }, null, -1)
      ])], 2)) : createCommentVNode("", true)
    ], 64)) : (openBlock(), createElementBlock("div", _hoisted_14, "\n        本課程無作業要上傳唷！\n      "))
  ]);
}
const LessonHoemworksApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "LessonHoemworksApp.vue"]]);
async function createLessonHomeworksApp(props) {
  const app = createApp(LessonHoemworksApp, props);
  return app;
}
export {
  createLessonHomeworksApp
};
//# sourceMappingURL=lesson-homeworks.js.map
