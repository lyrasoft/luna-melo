<script setup lang="ts">
import { deleteConfirm } from '@windwalker-io/unicorn-next';
import { vBTooltip } from 'bootstrap-vue-next';
import { inject, toRefs } from 'vue';
import { useSegmentController } from '~melo/features/segment/useSegmentController';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';
import { SectionDefine, Segment } from '~melo/types';

const props = defineProps<{
  section: Segment;
  chapterIndex: number;
  sectionIndex: number;
}>();

const emit = defineEmits<{
  'edit': [section: Segment, sectionIndex: number];
  'delete': [sectionId: number];
  'save': [section: Segment];
}>();

const { remove } = useSegmentController();
const { closeIfEditing } = useSegmentEditor();

const defines = inject<Record<string, SectionDefine>>('section.defines');

const {
  edit,
  isActive,
} = useSegmentEditor();

const { section } = toRefs(props);

async function deleteSection() {
  const v = await deleteConfirm(
    '確定要刪除這個小節嗎？',
    '如果刪除小節，關於小節所有資料都會遺失',
    'warning',
  );

  if (v) {
    await remove(section.value.id!);

    closeIfEditing(section.value);

    emit('delete', section.value.id!);
  }
}

const { save } = useSegmentController();

function togglePreview() {
  section.value.preview = !section.value.preview;

  save(section.value);
}

function segmentTypeTitle(type: string) {
  return defines?.[type]?.title || '未知類型';
}

function segmentTypeIcon(type: string) {
  return defines?.[type]?.icon || 'fas fa-question-circle';
}

</script>

<template>
  <div class="c-chapter-item-outside">
    <!-- Keep outside div to make animation work, since tabler card will break animation -->
    <div class="card border bg-white" :data-id="section.id">
      <!-- Bar -->
      <div class="c-section-item card-body p-2"
        :class="{ 'bg-primary-subtle': isActive(section) }">
        <div class="c-section-item__content d-flex align-items-center gap-2 w-100" style="min-width: 1px">
          <!-- Drag Handle -->
          <div class="c-section-item__handle handle" style="cursor: move; z-index: 3;">
            <span class="fal fa-bars"></span>
          </div>

          <!-- Icon -->
          <div v-b-tooltip="segmentTypeTitle(section.type)" style="z-index: 3;">
            <i class="fa-fw" :class="segmentTypeIcon(section.type)"></i>
          </div>

          <!-- Serial -->
          <div class="me-1">
            {{ props.chapterIndex + 1 }}.{{ props.sectionIndex + 1 }}
          </div>

          <!-- Title -->
          <a href="#" class="c-section-item__title text-truncate stretched-link text-decoration-none"
            @click.prevent="edit(section)"
          >
            {{ section.title || '無標題小節' }}
          </a>

          <!-- Actions -->
          <div class="c-section-item__actions ms-auto d-flex align-items-center gap-2"
            style="z-index: 3;">
            <div class="c-section-item__preview">
              <a href="javascript://"
                @click="togglePreview"
                class="btn btn-sm text-nowrap"
                :class="section.preview ? 'btn-warning' : 'btn-outline-secondary'"
                v-html="section.preview ? '可試閱' : '不可試閱'"
              >
              </a>
            </div>

            <div class="c-section-item__delete">
              <a href="javascript://" @click="deleteSection">
                <i class="fal fa-trash text-danger"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
