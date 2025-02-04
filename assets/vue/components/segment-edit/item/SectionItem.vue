<template>
  <div>
    <!-- Bar -->
    <div class="c-section-item">
      <div class="d-flex border rounded-1 my-2">
        <div class="c-section-item__handle handle">
          <span class="fal fa-bars"></span>
          <span class="sr-only">Drag</span>
        </div>
        <div class="c-section-item__content d-flex align-items-center" style="min-width: 1px">
          <div class="fa-fw pe-1 me-2" :class="SegmentTypeIcon[section.type]"></div>
          <div class="me-1">
            {{ props.chapterIndex + 1 }}.{{ props.sectionIndex + 1 }}
          </div>

          <a class="c-section-item__title text-truncate pe-1 me-2" @click="edit">
            {{ section.title || '無標題小節' }}
          </a>

          <div class="fs-14 text-nowrap me-2" :class="SegmentTypeColor[section.type]">
            {{ SegmentType[section.type] }}
          </div>

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
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { SegmentType, SegmentTypeIcon, SegmentTypeColor } from '../../../services/segment-service';
import type { Segment } from '../../../types/segment.type';

const props = defineProps<{
  section: Segment;
  chapterIndex: number;
  sectionIndex: number;
}>();

const emit = defineEmits(['edit', 'delete', 'save']);

const { section } = toRefs(props);

function edit() {
  emit('edit', section.value, props.sectionIndex);
}

function deleteSection() {
  emit('delete', section.value.id);
}

function setPreview() {
  section.value.preview = !section.value.preview;

  emit('save', section.value);
}
</script>

<style scoped lang="scss">
.c-section-item {

  &__handle {
    padding: 10px 15px;
    border-right: 1px solid var(--bs-border-color);

    > .fa-bars {
      line-height: 24px;
    }
  }

  &__content {
    padding: 10px 15px;
    flex-grow: 1;
  }

  &__title {
    font-weight: 700;
  }

  &__preview {
    margin-left: auto;
  }

  &__delete {
    margin-left: 20px;
  }
}
</style>
