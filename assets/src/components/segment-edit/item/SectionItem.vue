<script setup lang="ts">
import { toRefs } from 'vue';
import { SegmentType } from '~melo/enum/SegmentType';
import { SegmentTypeColor } from '~melo/enum/SegmentTypeColor';
import { SegmentTypeIcon } from '~melo/enum/SegmentTypeIcon';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';
import { Segment } from '~melo/types';

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

const {
  edit,
  isEditing,
} = useSegmentEditor();

const { section } = toRefs(props);

function deleteSection() {
  emit('delete', section.value.id!);
}

function setPreview() {
  section.value.preview = !section.value.preview;

  emit('save', section.value);
}

function segmentTypeTitle(type: SegmentType) {
  switch (type) {
    case SegmentType.VIDEO:
      return '影片';
    case SegmentType.QUIZ:
      return '測驗';
    case SegmentType.HOMEWORK:
      return '作業';
    default:
      return '未知類型';
  }
}
</script>

<template>
  <div class="card border bg-white">
    <!-- Bar -->
    <div class="c-section-item card-body p-2">
      <div class="d-flex align-items-center gap-2">
        <div class="c-section-item__handle handle" style="cursor: move;">
          <span class="fal fa-bars"></span>
        </div>
        <div class="c-section-item__content d-flex align-items-center gap-2 w-100" style="min-width: 1px">
          <div class="fa-fw pe-1 me-2" :class="SegmentTypeIcon[section.type]"></div>
          <div class="me-1">
            {{ props.chapterIndex + 1 }}.{{ props.sectionIndex + 1 }}
          </div>

          <a class="c-section-item__title text-truncate pe-1 me-2" @click="edit(section)">
            {{ section.title || '無標題小節' }}
          </a>

          <div class="fs-14 text-nowrap me-2" :class="SegmentTypeColor[section.type]">
            {{ segmentTypeTitle(section.type) }}
          </div>

          <div class="c-section-item__actions ms-auto d-flex align-items-center gap-2">
            <div class="c-section-item__preview">
              <a href="javascript://"
                @click="setPreview"
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
//.c-section-item {
//
//  &__handle {
//    padding: 10px 15px;
//    border-right: 1px solid var(--bs-border-color);
//
//    > .fa-bars {
//      line-height: 24px;
//    }
//  }
//
//  &__content {
//    padding: 10px 15px;
//    flex-grow: 1;
//  }
//
//  &__title {
//    font-weight: 700;
//  }
//
//  &__preview {
//    margin-left: auto;
//  }
//
//  &__delete {
//    margin-left: 20px;
//  }
//}
</style>
