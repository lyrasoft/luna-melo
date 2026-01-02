<script setup lang="ts">
import { ApiReturn, route, useHttpClient, useUnicorn } from '@windwalker-io/unicorn-next';
import { uniqueItemList } from '@lyrasoft/ts-toolkit/vue';
import { ref, onMounted, computed, defineAsyncComponent, inject, provide } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import ChapterItem from '~melo/components/segment-edit/item/ChapterItem.vue';
import swal from 'sweetalert';
import SegmentEditBox from '~melo/components/segment-edit/SegmentEditBox.vue';
import { SegmentType } from '~melo/enum/SegmentType';
import { useSegmentEditor } from '~melo/features/segment/useSegmentEditor';
import { Segment } from '~melo/types';
import { BFormGroup, BModal, BSpinner, BFormInput, BButton } from 'bootstrap-vue-next';

const props = defineProps<{
  lessonId: number;
}>();

const modal = ref<boolean>(false);
const loading = ref<boolean>(false);
const { saving } = useSegmentEditor();

// Replace single reactive state with separate refs
const items = ref<Segment[]>([]);

const current = ref<{ originTitle: string; item: Segment | Object }>({
  originTitle: '',
  item: {}
});
const selected = ref<any[]>([]);
const editingTitle = ref<string>('');
const editingIndex = ref<number>();

async function prepareSegments() {
  const { get } = await useHttpClient();

  const res = await get<ApiReturn<Segment[]>>(
    route('prepare_segments'),
    {
      params: {
        lessonId: props.lessonId,
        parentId: 0
      }
    }
  );

  items.value = uniqueItemList(res.data.data);
}

onMounted(async () => {
  loading.value = true;

  await prepareSegments();

  loading.value = false;
});

function showEditModal(i) {
  editingTitle.value = items.value[i].title;
  editingIndex.value = i;

  modal.value = true;
}

async function changeChapter() {
  if (editingIndex.value === undefined) {
    return;
  }

  // set the title from editingTitle
  items.value[editingIndex.value].title = editingTitle.value;

  await saveSegment(
    {
      id: items.value[editingIndex.value].id,
      title: items.value[editingIndex.value].title
    }
  );

  modal.value = false;
}

async function createChapter() {
  const ordering = items.value.length;

  let newChapter = {
    lesson_id: props.lessonId,
    parent_id: 0,
    duration: 0,
    can_skip: false,
    state: 1,
    ordering: ordering + 1,
  };

  await saveSegment(newChapter, 1);
  await prepareSegments();
}

async function deleteChapter(id: number) {
  const v = await swal(
    {
      title: "確定要刪除這個章節嗎？",
      text: "如果刪除章節，關於章節所有資料都會遺失",
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

async function saveSegment(data: object, isNew: number = 0) {
  const { post } = await useHttpClient();

  await post(
    route('save_segment'),
    {
      data: data,
      isNew: isNew
    }
  );
}

async function reorder() {
  const orders: Record<number, number> = {};

  items.value.forEach((item, i) => {
    orders[item.id!] = i + 1;
  });

  const { post } = await useHttpClient();

  await post(
    route('reorder_segment'),
    {
      orders: orders,
    }
  );
}

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-5">
        <div class="card mb-4">
          <div class="card-body d-flex align-items-center justify-content-between">
            <h4 class="bold my-1">
              課程章節 ({{ items.length }} )
            </h4>

            <div>
              <div v-if="saving" class="">
                <BSpinner small />
                儲存中...
              </div>
            </div>
          </div>
        </div>

        <div class="c-chapter-list">
          <VueDraggable
            v-model="items"
            item-key="uid"
            handle=".handle"
            class="d-flex flex-column gap-2"
            @change="reorder"
          >
            <ChapterItem v-for="(element, index) in items"
              :key="element.uid"
              :chapter="element"
              :index="index"
              @edit="showEditModal"
              @delete="deleteChapter"
            ></ChapterItem>
          </VueDraggable>
        </div>

        <div class="text-center my-4">
          <BButton variant="success" @click="createChapter()">
            <span class="fal fa-plus"></span>
            新增章節
          </BButton>
        </div>
      </div>

      <div class="col-lg-7">
        <SegmentEditBox />
      </div>
    </div>

    <BModal
      v-model="modal"
      okTitle="儲存"
      cancelTitle="取消"
      @ok="changeChapter"
      @hidden="changeChapter"
    >
      <BFormGroup
        id="fieldset-chapter"
        label="章節名稱編輯"
        label-for="input-chapter-title"
        label-class="mb-1"
      >
        <BFormInput id="input-chapter-title" v-model="editingTitle" trim />
      </BFormGroup>
    </BModal>
  </div>
</template>

<style scoped>

</style>
