import { uniqueItem, useLoading } from '@lyrasoft/ts-toolkit/vue';
import { createGlobalState, useDebounceFn } from '@vueuse/core';
import { ApiReturn, route, useHttpClient } from '@windwalker-io/unicorn-next';
import { ref } from 'vue';
import { Segment } from '~melo/types';

export const useSegmentController = createGlobalState(() => {
  const { loading: saving, wrap, run } = useLoading();

  async function save(item: Segment, isNew: boolean = false) {
    const { post } = await useHttpClient();

    const res = await post<ApiReturn<Segment>>(
      route('@ajax_segment/save'),
      {
        item,
        isNew,
      }
    );

    return res.data.data;
  }

  const reorder = useDebounceFn(async (segments: Segment[]) => {
    return run(async () => {
      const orders: Record<number, number> = {};

      await disableAutoSave(() => {
        for (const [i, item] of segments.entries()) {
          item.ordering = orders[item.id as number] = i + 1;
        }
      });

      const { post } = await useHttpClient();

      const res = await post(
        route('@ajax_segment/reorder'),
        {
          orders: orders,
        }
      );

      return res.data.data;
    });
  }, 500);

  async function remove(id: number) {
    const { post } = await useHttpClient();

    await post(
      route('@ajax_segment/delete'),
      {
        id
      }
    );
  }

  function createEmptySectionItem(chapter: Segment, type: string) {
    return uniqueItem<Segment>({
      lessonId: chapter.lessonId,
      parentId: chapter.id!,
      type: type,
      title: '',
      content: '',
      src: '',
      filename: '',
      ext: '',
      captionSrc: '',
      duration: 0,
      can_skip: 0,
      state: 1,
      ordering: 0,
      canSkip: false,
      created: null,
      createdBy: 0,
      modified: null,
      modifiedBy: 0,
      params: undefined,
      preview: false
    });
  }

  function createEmptyChapterItem(lessonId: number) {
    return uniqueItem<Segment>({
      lessonId: lessonId,
      parentId: 0,
      type: '',
      title: '',
      content: '',
      src: '',
      filename: '',
      ext: '',
      captionSrc: '',
      duration: 0,
      can_skip: 0,
      state: 1,
      ordering: 0,
      canSkip: false,
      created: null,
      createdBy: 0,
      modified: null,
      modifiedBy: 0,
      params: undefined,
      preview: false
    });
  }

  // Save
  const autoSave = ref(true);

  async function disableAutoSave(handler: () => any) {
    autoSave.value = false;

    const r = await handler();

    autoSave.value = true;

    return r;
  }

  // Delete Files
  async function deleteFile(url: string, id: number, field: string) {
    const { delete: del } = await useHttpClient();

    await del(
      route('@ajax_segment/deleteFile'),
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
    deleteFile,
  };
});

