import { createGlobalState, useDebounceFn } from '@vueuse/core';
import { route, sleep, useHttpClient } from '@windwalker-io/unicorn-next';
import { computed, ref, watch } from 'vue';
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { Segment } from '~melo/types';

export const useSegmentEditor = createGlobalState(() => {
  const editing = ref<boolean>(false);
  const segment = ref<Segment>();
  const isEditing = computed(() => editing.value && segment.value);
  const type = computed(() => segment.value?.type ?? null);
  const isChapter = computed<boolean>(() => !Boolean(segment.value?.parentId));
  const currentEditingId = computed<number | null>(() => segment.value?.id ?? null);
  const { loading: saving, wrap } = useLoading();

  async function edit(item: Segment) {
    close();

    await disableAutoSave(() => {
      segment.value = item;
      editing.value = true;
    });
  }

  function close() {
    segment.value = undefined;
    autoSave.value = false;
    editing.value = false;
  }

  // Save
  const autoSave = ref(true);

  const save = wrap(async () => {
    if (!segment.value) {
      return;
    }

    if (editing.value === false) {
      return;
    }

    const start = Date.now();
    const { post } = await useHttpClient();

    // Save
    await post(
      route('save_segment'),
      {
        item: segment.value,
        isNew: !segment.value.id,
      }
    );

    // At least run 500ms
    const elapsed = Date.now() - start;

    if (elapsed < 500) {
      await sleep(500 - elapsed);
    }
  });

  const saveDebounced = useDebounceFn(save, 500);

  async function disableAutoSave(handler: () => any) {
    autoSave.value = false;

    const r = await handler();

    autoSave.value = true;

    return r;
  }

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
    close,
    save,
    isActive,
    disableAutoSave,
  }
});


