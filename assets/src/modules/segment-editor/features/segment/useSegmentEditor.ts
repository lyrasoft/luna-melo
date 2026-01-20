import { createGlobalState, useDebounceFn } from '@vueuse/core';
import { route, sleep, useHttpClient } from '@windwalker-io/unicorn-next';
import { computed, ref, watch } from 'vue';
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { useSegmentController } from '~melo/modules/segment-editor/features/segment/useSegmentController';
import { sleepMax } from '~melo/shared/timing';
import { Segment } from '~melo/types';

export const useSegmentEditor = createGlobalState(() => {
  const { save: saveSegment, saving, wrapSaving, autoSave, disableAutoSave } = useSegmentController();

  const editing = ref<boolean>(false);
  const segment = ref<Segment>();
  const isEditing = computed(() => editing.value && segment.value);
  const type = computed(() => segment.value?.type ?? null);
  const isChapter = computed<boolean>(() => !Boolean(segment.value?.parentId));
  const currentEditingId = computed<number | null>(() => segment.value?.id ?? null);

  async function edit(item: Segment) {
    close();

    await disableAutoSave(() => {
      segment.value = item;
      editing.value = true;
    });
  }

  async function editById(id: number, segments: Segment[]) {
    for (const chapter of segments) {
      if (chapter.id === id) {
        await edit(chapter);
        return;
      }

      if (chapter.children) {
        for (const segment of chapter.children) {
          if (segment.id === id) {
            await edit(segment);
            return;
          }
        }
      }
    }
  }

  function close() {
    segment.value = undefined;
    autoSave.value = false;
    editing.value = false;
  }

  function closeIfEditing(item: Segment) {
    if (segment.value?.id === item.id) {
      close();
    }
  }

  // Save
  const save = wrapSaving(async () => {
    if (!segment.value) {
      return;
    }

    if (editing.value === false) {
      return;
    }

    const start = Date.now();
    const { post } = await useHttpClient();

    // Save
    await saveSegment(segment.value, !segment.value.id);

    await sleepMax(start, 500);
  });

  const saveDebounced = useDebounceFn(save, 500);

  // Auto save
  watch(segment, () => {
    if (autoSave.value) {
      saveDebounced();
    }
  }, { deep: true });

  // Active
  function isActive(segment: Segment) {
    return editing.value && segment.id === currentEditingId.value;
  }

  return {
    segment,
    isChapter,
    type,
    saving,
    isEditing,
    currentEditingId,
    autoSave,

    edit,
    editById,
    close,
    closeIfEditing,
    save,
    isActive,
    disableAutoSave,
  }
});


