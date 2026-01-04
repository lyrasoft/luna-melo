<script setup lang="ts">
import { uniqueItemList, uniqueItem } from '@lyrasoft/ts-toolkit/vue';
import {
  deleteConfirm,
  route,
  sleep,
  slideDown,
  slideUp,
  useHttpClient,
  useUnicorn
} from '@windwalker-io/unicorn-next';
import { BButton, BModal, BTooltip, vBTooltip } from 'bootstrap-vue-next';
import { SortableEvent } from 'sortablejs';
import swal from 'sweetalert';
import {
  computed,
  defineAsyncComponent,
  inject, nextTick,
  onMounted,
  Ref,
  ref,
  shallowRef,
  toRefs,
  useTemplateRef,
  watch
} from 'vue';
import { DraggableEvent, VueDraggable } from 'vue-draggable-plus';
import { useSegmentController } from '~melo/features/segment/useSegmentController';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';
import SectionItem from './SectionItem.vue';
import TypeSelector from '../TypeSelector.vue';
import type { Component } from 'vue';
import { Segment } from '~melo/types';

const props = defineProps<{
  chapter: Segment;
  index: number;
}>();

const emit = defineEmits<{
  'delete': [chapterId: number];
}>()

const { save, reorder, remove } = useSegmentController();
const { closeIfEditing } = useSegmentEditor();

const chapter = ref(props.chapter);

// Items
const sections = ref<(Segment & { uid?: string; })[]>(uniqueItemList(chapter.value?.children || []));

// Open / Close
const isOpen = defineModel<boolean>('open', {
  default: false,
})
const slideDisplay = ref(isOpen.value ? 'display: flex;' : 'display: none;');
const sectionsContainer = useTemplateRef<HTMLDivElement>('sectionsContainer');

watch(isOpen, () => {
  if (!sectionsContainer.value) {
    return;
  }

  slideDisplay.value = '';

  if (isOpen.value) {
    slideDown(sectionsContainer.value, 300, 'flex')
  } else {
    slideUp(sectionsContainer.value);
  }
});

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

defineExpose({
  open,
  close,
  toggleOpen,
});

// Edit
const {
  isActive,
  edit
} = useSegmentEditor();

const u = useUnicorn();

function newSection() {
  u.trigger('section.new', chapter.value, newSectionSelected);
}

async function newSectionSelected(section: Segment) {
  const newSection = uniqueItem(section);
  sections.value.push(newSection);

  await nextTick();

  edit(newSection);
}

async function reorderSections() {
  await reorder(sections.value);
}

async function deleteSection(id: number) {
  sections.value = sections.value.filter(s => s.id !== id);
}

async function deleteChapter() {
  const v = await deleteConfirm(
    "確定要刪除這個章節嗎？",
    "如果刪除章節，關於章節所有資料都會遺失",
    "warning",
  );

  if (v) {
    await remove(chapter.value.id!);

    closeIfEditing(chapter.value);

    emit('delete', chapter.value.id!);
  }
}

async function sectionMovedToHere(e: DraggableEvent<Segment>) {
  const section = e.data;

  section.parentId = chapter.value.id!;

  await save(section);
  await reorder(sections.value);
}
</script>

<template>
  <div class="c-chapter-item-outside">
    <!-- Keep outside div to make animation work, since tabler card will break animation -->
    <div class="card border">
      <!-- Bar -->
      <div class="c-chapter-item card-body"
        :class="{ 'bg-primary-subtle': isActive(chapter) }"
      >
        <div class="w-100">
          <div class="c-chapter-item__content d-flex align-items-center gap-2 w-100" style="min-width: 1px">
            <div class="c-chapter-item__handle handle position-relative" style="cursor: move; z-index: 3;" >
              <span class="fal fa-fw fa-bars"></span>
            </div>

            <div style="z-index: 3;">
              <i class="fas fa-folder"></i>
            </div>

            <div class="">
              {{ props.index + 1 }}.
            </div>

            <a href="#"
              class="c-chapter-item__title text-truncate stretched-link text-decoration-none" @click.prevent="edit(chapter)">
              {{ chapter?.title || '(無章節名稱)' }}
            </a>

            <div class="c-chapter-item__actions ms-auto d-flex align-items-center gap-2"
              style="z-index: 3;">
            <span class="badge bg-secondary rounded-pill">
              {{ sections.length }}
            </span>

              <a href="javascript://"
                class="c-chapter-item__delete"
                v-b-tooltip="'刪除章節'"
                @click="deleteChapter">
                <i class="fal fa-trash text-danger"></i>
              </a>

              <a href="javascript://"
                class="c-chapter-item__toggle"
                v-b-tooltip="'顯示/隱藏小節'"
                @click="toggleOpen">
                <i class="far" :class="[isOpen ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref="sectionsContainer" class="card-body bg-light flex-column gap-3"
        :style="slideDisplay">
        <!-- Sections -->
        <div class="c-section-list">
          <VueDraggable
            v-model="sections"
            item-key="uid"
            handle=".handle"
            class="d-flex flex-column gap-2"
            group="sections"
            :animation="300"
            :on-add="sectionMovedToHere"
            :on-update="reorderSections"
          >
            <TransitionGroup name="fade">
              <SectionItem
                v-for="(element, index) in sections"
                :key="element.uid"
                :section="element"
                :chapterIndex="props.index"
                :sectionIndex="index"
                style="animation-duration: 300ms;"
                @delete="deleteSection"
              ></SectionItem>
            </TransitionGroup>
          </VueDraggable>
        </div>

        <div class="text-center">
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="newSection">
            <i class="far fa-plus"></i>
            新增小節
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
