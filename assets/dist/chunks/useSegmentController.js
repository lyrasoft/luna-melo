import { useLoading, uniqueItem } from "@lyrasoft/ts-toolkit/vue";
import { useHttpClient, route } from "@windwalker-io/unicorn-next";
import { ref } from "vue";
import { c as createGlobalState, u as useDebounceFn } from "./index2.js";
const useSegmentController = createGlobalState(() => {
  const { loading: saving, wrap, run } = useLoading();
  async function save(item, isNew = false) {
    const { post } = await useHttpClient();
    const res = await post(
      route("@ajax_segment/save"),
      {
        item,
        isNew
      }
    );
    return res.data.data;
  }
  const reorder = useDebounceFn(async (segments) => {
    return run(async () => {
      const orders = {};
      await disableAutoSave(() => {
        for (const [i, item] of segments.entries()) {
          item.ordering = orders[item.id] = i + 1;
        }
      });
      const { post } = await useHttpClient();
      const res = await post(
        route("@ajax_segment/reorder"),
        {
          orders
        }
      );
      return res.data.data;
    });
  }, 500);
  async function remove(id) {
    const { post } = await useHttpClient();
    await post(
      route("@ajax_segment/delete"),
      {
        id
      }
    );
  }
  function createEmptySectionItem(chapter, type) {
    return uniqueItem({
      lessonId: chapter.lessonId,
      parentId: chapter.id,
      type,
      title: "",
      content: "",
      src: "",
      filename: "",
      ext: "",
      captionSrc: "",
      duration: 0,
      can_skip: 0,
      state: 1,
      ordering: 0,
      canSkip: false,
      created: null,
      createdBy: 0,
      modified: null,
      modifiedBy: 0,
      params: void 0,
      preview: false
    });
  }
  function createEmptyChapterItem(lessonId) {
    return uniqueItem({
      lessonId,
      parentId: 0,
      type: "",
      title: "",
      content: "",
      src: "",
      filename: "",
      ext: "",
      captionSrc: "",
      duration: 0,
      can_skip: 0,
      state: 1,
      ordering: 0,
      canSkip: false,
      created: null,
      createdBy: 0,
      modified: null,
      modifiedBy: 0,
      params: void 0,
      preview: false
    });
  }
  const autoSave = ref(true);
  async function disableAutoSave(handler) {
    autoSave.value = false;
    const r = await handler();
    autoSave.value = true;
    return r;
  }
  async function deleteFile(url, id, field) {
    const { delete: del } = await useHttpClient();
    await del(
      route("@ajax_segment/deleteFile"),
      {
        url,
        id,
        field
      }
    );
  }
  return {
    autoSave,
    saving,
    save,
    reorder,
    remove,
    createEmptyChapterItem,
    createEmptySectionItem,
    wrapSaving: wrap,
    runSaving: run,
    disableAutoSave,
    deleteFile
  };
});
export {
  useSegmentController as u
};
//# sourceMappingURL=useSegmentController.js.map
