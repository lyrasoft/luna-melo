<script setup lang="ts">
import { BSpinner } from 'bootstrap-vue-next';
import { computed, defineAsyncComponent } from 'vue';
import { SegmentType } from '~melo/enum/SegmentType';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';

const {
  isEditing,
  hasChanged,
  segment,
  type,
  isChapter,
  saving,
} = useSegmentEditor();

const editComponent = computed(() => {
  if (!isEditing.value) {
    return null;
  }

  if (isChapter.value) {
    return defineAsyncComponent(() => import('~melo/components/segment-edit/chapter/ChapterEdit.vue'));
  } else {
    switch (type.value) {
      case SegmentType.VIDEO:
        return defineAsyncComponent(() => import('~melo/components/segment-edit/section/SectionVideoEdit.vue'));
      case SegmentType.QUIZ:
        return defineAsyncComponent(() => import('~melo/components/segment-edit/section/SectionVideoEdit.vue'));
      case SegmentType.HOMEWORK:
        return defineAsyncComponent(() => import('~melo/components/segment-edit/section/SectionVideoEdit.vue'));
      default:
        return null;
    }
  }
});

</script>

<template>
  <div class="card position-sticky" style="top: var(--melo-segment-edit-sticky-top, 100px);">
    <div class="card-header d-flex align-items-center justify-content-between">
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
    <div class="card-body" v-if="segment && editComponent">
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
