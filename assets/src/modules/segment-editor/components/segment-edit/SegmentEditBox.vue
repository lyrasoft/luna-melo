<script setup lang="ts">
import { BSpinner } from 'bootstrap-vue-next';
import { computed, defineAsyncComponent, nextTick, ref, watch } from 'vue';
import { resolveSectionEditComponent } from '~melo/modules/segment-editor/features/section/resolveSectionEditComponent';
import { useSegmentEditor } from '~melo/modules/segment-editor/features/segment/useSegmentEditor';
import { SectionDefine } from '~melo/types';

const props = defineProps<{
  sectionDefines: Record<string, SectionDefine>;
}>();

const {
  isEditing,
  segment,
  type,
  isChapter,
  saving,
  currentEditingId,
} = useSegmentEditor();

const saved = ref(false);

watch(saving, (saving) => {
  if (!saving) {
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
    return defineAsyncComponent(() => import('~melo/modules/segment-editor/components/segment-edit/chapter/ChapterEdit.vue'));
  } else if (type.value) {
    const define = props.sectionDefines[type.value];

    return resolveSectionEditComponent(define);
  }
});

// Focus
const editContainer = ref<HTMLDivElement>();

watch(editComponent, () => {
  setTimeout(() => {
    if (editComponent.value && editContainer.value) {
      editContainer.value.querySelector<HTMLInputElement>('input[type=text]')?.focus();
    }
  }, 300);
});

</script>

<template>
  <div class="card position-sticky" style="top: var(--melo-segment-edit-sticky-top, 100px);">
    <div class="card-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2">
        <h3 class="m-0">
          <template v-if="isChapter">
            編輯章節
          </template>
          <template v-else-if="isEditing">
            編輯小節
          </template>
          <template v-else>
            編輯
          </template>
        </h3>
        <div v-if="saving" class="">
          <BSpinner small />
          儲存中...
        </div>
        <div v-else-if="saved" class="text-success">
          <i class="far fa-check"></i>
          已儲存
        </div>
      </div>

      <!-- Toolbar -->
      <div v-if="isEditing">
        <span class="badge bg-warning">
          修改後會即時儲存
        </span>
        <!--<button type="button" class="btn btn-primary btn-sm" style="min-width: 120px;">-->
        <!--  <i class="fal fa-save"></i>-->
        <!--  儲存變更-->
        <!--</button>-->
        <!--<button type="button" class="btn btn-outline-secondary btn-sm">-->
        <!--  <i class="fal fa-xmark"></i>-->
        <!--  取消-->
        <!--</button>-->
      </div>
    </div>
    <div ref="editContainer" class="card-body" v-if="segment && editComponent">
      <Component :is="editComponent" v-model="segment" />
    </div>
    <div v-else class="p-5 text-center">
      <div class="text-muted" style="margin: 100px auto;">
        請選擇或新增章節以進行編輯
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
