<template>
  <div>
    <!-- Bar -->
    <div class="c-chapter-item">
      <div class="d-flex border rounded-1 my-2">
        <div class="c-chapter-item__handle handle">
          <span class="fal fa-fw fa-bars"></span>
          <span class="sr-only">Drag</span>
        </div>
        <div class="c-chapter-item__content d-flex align-items-center" style="min-width: 1px">
          <div class="me-2">
            {{ props.index + 1 }}.
          </div>

          <a class="c-chapter-item__title text-truncate" @click="$emit('edit', props.index)">
            {{ chapter.title || '無章節名稱' }}
          </a>

          <div class="c-chapter-item__delete">
            <a href="javascript://" @click="$emit('delete', chapter.id)">
              <i class="fal fa-trash text-danger"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Sections -->
      <div class="c-section-list">
        <draggable
            v-model="sections"
            item-key="uid"
            handle=".handle"
            @change="reorder"
        >
          <template #item="{element, index}">
            <section-item
              :key="element.id"
              :section="element"
              :chapterIndex="props.index"
              :sectionIndex="index"
              @edit="editSection"
              @delete="deleteSection"
              @save="saveSegment"
            ></section-item>
          </template>
        </draggable>
      </div>

      <type-selector
        :chapterId="props.chapter.id"
        ref="typeSelectModal"
        @create="createSection"
      ></type-selector>

      <div class="mb-3">
        <button type="button" class="btn btn-outline-secondary ms-4" @click="showTypeModal">
          新增小節
        </button>
      </div>

      <!-- Section Edit -->
      <BModal
        :id="'section-edit-modal-' + props.chapter.id"
        ok-only
        bodyBgVariant="light"
        contentClass="bg-white"
        hideFooter="true"
        lazy="true"
        dialog-class="mb-6"
        scrollable="true"
        @hidden="sectionSave(currentSection)"
      >
        <template #title>
          <BButton variant="primary" size="sm" @click="saveAndCloseModal(currentSection, 0)">
            儲存
          </BButton>
        </template>

        <component :is="editComponent" :item="currentSection" @save="sectionSave"></component>
      </BModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModal } from 'bootstrap-vue-next';
import swal from 'sweetalert';
import { defineAsyncComponent, onMounted, ref, shallowRef, toRefs } from 'vue';
import Utilities from '../../../services/utilities';
import SectionItem from './SectionItem.vue';
import type { Segment } from '../../../types/segment.type';
import TypeSelector from '../TypeSelector.vue';
import type { Component } from 'vue';

const props = defineProps<{
  chapter: Segment;
  index: number;
}>();

const { chapter } = toRefs(props);
const sections = ref<Segment[]>([]);
const sectionTypeSelector = ref<InstanceType<typeof TypeSelector>>();
const editComponent = shallowRef<Component>();
const currentSection = ref<Segment>();
const currentIndex = ref<number>();
const sectionEditModal = useModal('section-edit-modal-' + chapter.value.id);
const typeSelectModal = ref<Component>();
const VideoEdit = defineAsyncComponent(() => import('../section/SectionVideoEdit.vue'));
const HomeworkEdit = defineAsyncComponent(() => import('../section/SectionHomeworkEdit.vue'));
const QuizEdit = defineAsyncComponent(() => import('../section/SectionQuizEdit.vue'));

onMounted(async () => {
  await prepareSegments();
});

function showTypeModal() {
  typeSelectModal.value!.show();
}

async function prepareSegments() {
  const res = u.$http.get(
    u.route('prepare_segments'),
    {
      params: {
        lesson_id: chapter.value.lessonId,
        parent_id: chapter.value.id
      }
    }
  );

  sections.value = Utilities.prepareList((await res).data.data);
}

async function createSection(type, options = {}) {
  const item = Utilities.prepareListItem({
    id: null,
    lesson_id: chapter.value.lessonId,
    parent_id: chapter.value.id,
    type: type,
    title: '',
    content: '',
    src: '',
    filename: '',
    ext: '',
    caption_src: '',
    duration: 0,
    can_skip: 0,
    state: 1,
    ordering: sections.value.length + 1,
  });

  await saveSegment(item, 1);
  await prepareSegments();
}

function editSection(item: Segment, index: number) {
  currentIndex.value = index;

  currentSection.value = item;

  switch (item.type) {
    case 'video':
      editComponent.value = VideoEdit;
      break;
    case 'quiz':
      editComponent.value = QuizEdit;
      break;
    case 'homework':
      editComponent.value = HomeworkEdit;
      break;
  }

  sectionEditModal.show();
}

async function saveSegment(data: object, isNew: number = 0) {
  await u.$http.post(
    u.route('save_segment'),
    {
      data: data,
      isNew: isNew
    }
  );
}

async function saveAndCloseModal(
  data: object,
  isNew: number = 0
) {
  await saveSegment(data, isNew);

  sectionEditModal.hide();
}

async function sectionSave(item: Segment) {
  await saveSegment(item, 0);
}

async function reorder() {
  const orders = {};

  sections.value.forEach((item, i) => {
    orders[item.id] = i + 1;
  });

  await u.$http.post(
    u.route('reorder_segment'),
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
    await u.$http.post(
      u.route('delete_segment'),
      {
        id: id
      }
    );

    await prepareSegments();
  }
}
</script>

<style scoped lang="scss">
  .c-chapter-item {

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
      cursor: pointer;
    }

    &__delete {
      margin-left: auto;
    }
  }

  .c-section-list {
    padding-left: 1.5rem;
  }
</style>
