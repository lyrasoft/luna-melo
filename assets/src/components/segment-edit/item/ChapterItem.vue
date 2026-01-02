<script setup lang="ts">
import { uniqueItemList, uniqueItem } from '@lyrasoft/ts-toolkit/vue';
import { route, useHttpClient, useUnicorn } from '@windwalker-io/unicorn-next';
import { BButton, BModal, BTooltip, vBTooltip } from 'bootstrap-vue-next';
import swal from 'sweetalert';
import { computed, defineAsyncComponent, inject, onMounted, Ref, ref, shallowRef, toRefs } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';
import SectionItem from './SectionItem.vue';
import TypeSelector from '../TypeSelector.vue';
import type { Component } from 'vue';
import { Segment } from '~melo/types';

const props = defineProps<{
  chapter: Segment;
  index: number;
}>();

const chapter = ref(props.chapter);
const sections = ref<Segment[]>([]);
const sectionTypeSelector = ref<InstanceType<typeof TypeSelector>>();
const editComponent = shallowRef<Component>();
const currentSection = ref<Segment>();
const currentIndex = ref<number>();
const VideoEdit = defineAsyncComponent(() => import('../section/SectionVideoEdit.vue'));
const HomeworkEdit = defineAsyncComponent(() => import('../section/SectionHomeworkEdit.vue'));
const QuizEdit = defineAsyncComponent(() => import('../section/SectionQuizEdit.vue'));

// Edit
const {
  isEditing,
  hasChanged,
  segment,
  isActive,
  edit
} = useSegmentEditor();

const sectionEditModalOpen = ref(false);
const typeSelectModalOpen = ref(false);

onMounted(async () => {
  await prepareSegments();
});

function showTypeModal() {
  typeSelectModalOpen.value = true;
}

async function prepareSegments() {
  const { get } = await useHttpClient();

  const res = await get(
    route('prepare_segments'),
    {
      params: {
        lessonId: chapter.value.lessonId,
        parentId: chapter.value.id
      }
    }
  );

  sections.value = uniqueItemList(res.data.data);
}

async function createSection(type: string, options: Record<string, any> = {}) {
  const item = uniqueItem<Segment>({
    lessonId: chapter.value.lessonId,
    parentId: chapter.value.id!,
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
    ordering: sections.value.length + 1,
  });

  await saveSegment(item, 1);
  await prepareSegments();
}

// function editSection(item: Segment, index: number) {
//   currentIndex.value = index;
//
//   currentSection.value = item;
//
//   switch (item.type) {
//     case 'VIDEO':
//       editComponent.value = VideoEdit;
//       break;
//     case 'QUIZ':
//       editComponent.value = QuizEdit;
//       break;
//     case 'HOMEWORK':
//       editComponent.value = HomeworkEdit;
//       break;
//   }
//
//   sectionEditModalOpen.value = true;
// }

async function saveSegment(data: object, isNew: number = 0) {
  const { post } = await useHttpClient();

  await post(
    route('save_segment'),
    {
      data: data,
      isNew: isNew
    }
  );

  currentSection.value = {} as Segment;
}

async function saveAndCloseModal(
  data: object,
  isNew: number = 0
) {
  await saveSegment(data, isNew);

  sectionEditModalOpen.value = false;
}

async function sectionSave(item: Segment) {
  await saveSegment(item, 0);
}

async function reorder() {
  const orders: Record<number, number> = {};

  sections.value.forEach((item, i) => {
    orders[item.id as number] = i + 1;
  });

  const { post } = await useHttpClient();

  await post(
    route('reorder_segment'),
    {
      orders: orders,
    }
  );
}

async function deleteSection(id: number) {
  const v = await swal(
    {
      title: "確定要刪除這個小節嗎？",
      text: "如果刪除小節，關於小節所有資料都會遺失",
      icon: "warning",
      buttons: {
        cancel: {
          visible: true,
          text: '取消',
        },
        confirm: {
          visible: true,
          text: '確認',
        },
      }
    }
  );

  if (v) {
    const { post } = await useHttpClient();

    await post(
      route('delete_segment'),
      {
        id: id
      }
    );

    await prepareSegments();
  }
}

</script>

<template>
  <div class="card border"
    >
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
            <i class="far fa-folder"></i>
          </div>

          <div class="">
            {{ props.index + 1 }}.
          </div>

          <a href="#"
            class="c-chapter-item__title text-truncate stretched-link text-decoration-none" @click.prevent="edit(chapter)">
            {{ chapter?.title || '(無章節名稱)' }}
          </a>

          <div class="c-chapter-item__actions ms-auto"
            style="z-index: 3;">
            <a href="javascript://"
              class="c-chapter-item__delete"
              v-b-tooltip="'刪除章節'"
              @click="$emit('delete', chapter.id)">
              <i class="fal fa-trash text-danger"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body bg-light d-flex flex-column gap-3">
      <h5 class="mb-0">小節 ({{ sections.length }})</h5>

      <!-- Sections -->
      <div class="c-section-list">
        <VueDraggable
          v-model="sections"
          item-key="uid"
          handle=".handle"
          class="d-flex flex-column gap-2"
          @change="reorder"
        >
          <SectionItem
            v-for="(element, index) in sections"
            :key="element.id"
            :section="element"
            :chapterIndex="props.index"
            :sectionIndex="index"
            @delete="deleteSection"
            @save="saveSegment"
          ></SectionItem>
        </VueDraggable>
      </div>

      <!--<type-selector-->
      <!--  :chapterId="props.chapter.id"-->
      <!--  :open="typeSelectModalOpen"-->
      <!--  @create="createSection"-->
      <!--&gt;</type-selector>-->

      <div class="text-center">
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="showTypeModal">
          <i class="far fa-plus"></i>
          新增小節
        </button>
      </div>
    </div>

    <!-- Section Edit -->
    <BModal
      :id="'section-edit-modal-' + props.chapter.id"
      ok-only
      bodyBgVariant="light"
      contentClass="bg-white"
      :hideFooter="true"
      :lazy="true"
      dialog-class="mb-6"
      :scrollable="true"
      @hidden="sectionSave(currentSection!)"
    >
      <template #title>
        <BButton variant="primary" size="sm" @click="saveAndCloseModal(currentSection!, 0)">
          儲存
        </BButton>
      </template>

      <component :is="editComponent" :item="currentSection" @save="sectionSave" :key="currentSection?.id"></component>
    </BModal>
  </div>
</template>

<style scoped lang="scss">
  //.c-chapter-item {
  //  border-radius: var(--bs-border-radius);
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
  //    cursor: pointer;
  //  }
  //
  //  &__delete {
  //    margin-left: auto;
  //  }
  //}
  //
  //.c-section-list {
  //  padding-left: 1.5rem;
  //}
</style>
