<script setup lang="ts">
import { ApiReturn, route, useHttpClient } from '@windwalker-io/unicorn-next';
import { uniqueItemList } from '@lyrasoft/ts-toolkit/vue';
import { ref, reactive, onMounted } from 'vue';
import ChapterItem from '~melo/components/segment-edit/item/ChapterItem.vue';
import swal from 'sweetalert';
import { Segment } from '~melo/types';

const props = defineProps<{
  lessonId: number
}>();

const modal = ref<boolean>(false);
const loading = ref<boolean>(false);
const state = reactive<{
  items: Segment[];
  current: {
    originTitle: string;
    item: Segment | Object;
  };
  selected: any[];
  editingTitle: string;
  editingIndex?: number;
}>({
  items: [],
  current: {
    originTitle: '',
    item: {}
  },
  selected: [],
  editingTitle: '',
  editingIndex: undefined,
});

async function prepareSegments() {
  const { get } = await useHttpClient();

  const res = await get<ApiReturn<Segment[]>>(
    route('prepare_segments'),
    {
      params: {
        lesson_id: props.lessonId,
        parent_id: 0
      }
    }
  );

  state.items = uniqueItemList(res.data.data);
}

onMounted(async () => {
  loading.value = true;

  await prepareSegments();

  loading.value = false;
});

function showEditModal(i) {
  state.editingTitle = state.items[i].title;
  state.editingIndex = i;

  modal.value = true;
}

async function changeChapter() {
  if (state.editingIndex === undefined) {
    return;
  }

  state.items[state.editingIndex].title = state.editingTitle;

  await saveSegment(
    {
      id: state.items[state.editingIndex].id,
      title: state.items[state.editingIndex].title
    }
  );

  modal.value = false;
}

async function createChapter() {
  const ordering = state.items.length;

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
  const orders = {};

  state.items.forEach((item, i) => {
    orders[item.id] = i + 1;
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
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="bold">
          課程章節
        </h4>
        <p class="m-b-20">
          請點選新增章節，完成後再點選新增小節
        </p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 my-5">
      <BSpinner />
    </div>

    <div v-else class="c-chapter-list mt-5">
      <draggable
          v-model="state.items"
          item-key="uid"
          handle=".handle"
          @change="reorder"
      >
        <template #item="{element, index}">
          <chapter-item
            :chapter="element"
            :key="element.id"
            :index="index"
            @edit="showEditModal"
            @delete="deleteChapter"
          ></chapter-item>
        </template>
      </draggable>
    </div>

    <div class="text-center my-4">
      <BButton variant="success" @click="createChapter()">
        <span class="fal fa-plus"></span>
        新增章節
      </BButton>
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
        <BFormInput id="input-chapter-title" v-model="state.editingTitle" trim />
      </BFormGroup>
    </BModal>
  </div>
</template>

<style scoped>

</style>
