<script setup lang="ts">
import { uniqueItemList } from '@lyrasoft/ts-toolkit/vue';
import { deleteConfirm, injectCssToDocument, simpleAlert, useUnicorn } from '@windwalker-io/unicorn-next';
import { BButton, BModal } from 'bootstrap-vue-next';
import { onErrorCaptured, onMounted, provide, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import ChapterItem from '~melo/modules/segment-editor/components/segment-edit/item/ChapterItem.vue';
import SegmentEditBox from '~melo/modules/segment-editor/components/segment-edit/SegmentEditBox.vue';
import TypeSelector from '~melo/modules/segment-editor/components/segment-edit/SectionTypeSelector.vue';
import { useSegmentController } from '~melo/modules/segment-editor/features/segment/useSegmentController';
import { useSegmentEditor } from '~melo/modules/segment-editor/features/segment/useSegmentEditor';
import { QuestionDefine, SectionDefine, Segment, SegmentEditorConfig } from '~melo/types';

import('@asika32764/vue-animate/dist/vue-animate.min.css?inline').then(({ default: css }) => {
  injectCssToDocument(css);
});

onErrorCaptured((e) => {
  simpleAlert('發生錯誤', e.message, 'warning');
});

const props = defineProps<{
  lessonId: number;
  sectionDefines: Record<string, SectionDefine>;
  questionDefines: Record<string, QuestionDefine>;
  segments: Segment[];
  config: SegmentEditorConfig;
}>();

provide('section.defines', props.sectionDefines);
provide('question.defines', props.questionDefines);
provide('config', props.config);

const { reorder: reorderSegments, save: saveChapter, remove, createEmptyChapterItem } = useSegmentController();
const { edit, editById } = useSegmentEditor();

// Replace single reactive state with separate refs
const items = ref<(Segment & { __open?: boolean; })[]>(prepareSegments(props.segments));

onMounted(() => {
  const url = new URL(window.location.href);
  const segmentId = url.searchParams.get('segmentId');

  if (segmentId) {
    editById(Number(segmentId), items.value);
  }
});

function prepareSegments(items: Segment[]) {
  items = uniqueItemList(items);

  for (const item of items) {
    item.__open = false;
  }

  if (items[0]) {
    items[0].__open = true;
  }

  return items;
}

// Create
async function newChapter() {
  const chapter = createEmptyChapterItem(props.lessonId);

  const newChapter = await saveChapter(chapter);

  items.value.push(newChapter);

  edit(newChapter);
}

async function deleteChapter(id: number) {
  items.value = items.value.filter(item => item.id !== id);
}

async function reorder() {
  reorderSegments(items.value);
}

// Open / Hide
function toggleAllOpens() {
  const allOpen = items.value.every(item => item.__open);

  for (const item of items.value) {
    item.__open = !allOpen;
  }
}

const u = useUnicorn();

// Section Creating
const { createEmptySectionItem, save: saveSection } = useSegmentController();
let sectionSelectedCallback: ((section: Segment) => void) | null = null;
let currentChapter: Segment | null = null;
const sectionTypeSelectorModalOpen = ref(false);

u.on('section.new', (chapter: Segment, callback: (section: Segment) => void) => {
  currentChapter = chapter;
  sectionSelectedCallback = callback;
  sectionTypeSelectorModalOpen.value = true;
});

async function sectionSelected(type: string) {
  if (!currentChapter) {
    return;
  }

  const section = createEmptySectionItem(currentChapter, type);
  const savedSection = await saveSection(section, true);

  sectionSelectedCallback?.(savedSection);

  sectionTypeSelectorModalOpen.value = false;
}

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-5">
        <div class="card mb-4">
          <div class="card-body d-flex align-items-center justify-content-between">
            <h4 class="bold my-1">
              課程章節 ({{ items.length }})
            </h4>

            <div>
              <button type="button" class="btn btn-outline-secondary btn-sm"
                @click="toggleAllOpens"
              >
                全體收合/展開
              </button>
            </div>
          </div>
        </div>

        <div class="c-chapter-list">
          <VueDraggable
            v-model="items"
            item-key="uid"
            handle=".handle"
            class="d-flex flex-column gap-2"
            :animation="300"
            :on-update="reorder"
          >
            <TransitionGroup name="fade">
              <ChapterItem v-for="(element, index) in items"
                :key="element.uid"
                :chapter="element"
                :index="index"
                v-model:open="element.__open"
                style="animation-duration: 300ms;"
                @delete="deleteChapter"
              ></ChapterItem>
            </TransitionGroup>
          </VueDraggable>
        </div>

        <div class="text-center my-4">
          <BButton variant="success" @click="newChapter">
            <span class="fal fa-plus"></span>
            新增章節
          </BButton>
        </div>
      </div>

      <div class="col-lg-7">
        <SegmentEditBox :sectionDefines />
      </div>
    </div>

    <BModal v-model="sectionTypeSelectorModalOpen"
      title="選擇想要新增的小節類型"
      no-footer
      lazy
      unmount-lazy
      size="lg"
    >
      <TypeSelector :sectionDefines @selected="sectionSelected" />
    </BModal>

  </div>
</template>

<style scoped lang="scss">
//@import "@asika32764/vue-animate/dist/vue-animate.min.css";
</style>
