<script setup lang="ts">
import { uniqueItemList } from '@lyrasoft/ts-toolkit/vue';
import { route, useHttpClient } from '@windwalker-io/unicorn-next';
import { BButton, BFormGroup, BFormInput, BFormRadioGroup, BModal, BSpinner, useModal } from 'bootstrap-vue-next';
import swal from 'sweetalert';
import { onMounted, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { Question, Segment } from '~melo/types';
import QuestionItem from '../question/QuestionItem.vue';
import QuestionEdit from '../question/QuestionEdit.vue';

const item = defineModel<Segment>({
  required: true
});

const skipOptions = [
  { text: '可以', value: true },
  { text: '不可以', value: false },
];

const questions = ref<Question[]>([]);
const currentQuestion = ref<Question>();
const { show, hide } = useModal();
const loading = ref<boolean>(false);

onMounted(async () => {
  await prepareQuestions();
});

async function prepareQuestions() {
  loading.value = true;

  const { get } = await useHttpClient();

  const res = await get(
    route('@ajax_question/prepare'),
    {
      params: {
        segment_id: item.value.id
      }
    }
  );

  questions.value = uniqueItemList(res.data.data);

  loading.value = false;
}

async function createQuestion() {
  const question = {
    id: null,
    lesson_id: item.value.lessonId,
    segment_id: item.value.id,
    type: 'select',
    is_multiple: '0',
    title: '',
    content: '',
    image: '',
    score: 0,
    state: 1,
    ordering: questions.value.length + 1,
  };

  await save(question, 1);
  await prepareQuestions();
}

async function reorder() {
  const orders: Record<number, number> = {};

  questions.value.forEach((item, i) => {
    orders[item.id] = i + 1;
  });

  const { post } = await useHttpClient();

  await post(
    route('@ajax_question/reorder'),
    {
      orders: orders,
    }
  );
}

function editQuestion(question: Question) {
  currentQuestion.value = question;
  show();
}

async function deleteQuestion(id: number) {
  const v = await swal(
    {
      title: "確定要刪除這個問題嗎？",
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
      route('@ajax_question/delete'),
      {
        id: id
      }
    );

    await prepareQuestions();
  }
}

async function saveAndCloseModal() {
  await save(currentQuestion.value, 0);
  hide();
}

async function save(data: any, isNew: number = 0) {
  const { post } = await useHttpClient();

  await post(
    route('@ajax_question/save'),
    {
      data: data,
      isNew: isNew
    }
  );
}

async function saveQuestion(data: Question) {
  await save(data, 0);
}
</script>

<template>
  <div>
    <BFormGroup
      label="小節名稱編輯"
      label-for="input-section-title"
      label-class="mb-2"
      class="mb-5"
    >
      <BFormInput id="input-section-title" v-model="item.title" trim />
    </BFormGroup>

    <BFormGroup
      label="是否可跳過此測驗閱讀下一章節？"
      label-for="input-section-skip"
      label-class="mb-2"
      class="mb-5"
    >
      <BFormRadioGroup
        v-model="item.canSkip"
        :options="skipOptions"
        button-variant="outline-primary"
        name="input-section-skip"
        buttons
      />
    </BFormGroup>

    <div class="c-quiz-edit">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="h6 c-quiz-edit__title">
          測驗內容
        </div>

        <div>
          <button type="button" class="btn btn-info text-nowrap"
            @click="createQuestion">
            新增題目
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center">
        <BSpinner />
      </div>

      <div v-else class="c-quiz-list">
        <VueDraggable
          v-model="questions"
          item-key="uid"
          handle=".handle"
          @change="reorder"
        >
          <QuestionItem
            v-for="(element, index) in questions"
            :item="element"
            :key="element.id"
            :index="index"
            @edit="editQuestion"
            @delete="deleteQuestion"
            @save="saveQuestion"
          ></QuestionItem>
        </VueDraggable>
      </div>
    </div>

    <!-- Section Edit -->
    <BModal
      id="question-edit-modal"
      ok-only
      bodyBgVariant="light"
      contentClass="bg-white"
      hideFooter="true"
      :lazy="true"
      dialog-class="mb-6"
      :scrollable="true"
      @hidden="saveQuestion(currentQuestion)"
    >
      <template #title>
        <BButton variant="primary" size="sm" @click="saveAndCloseModal">
          儲存
        </BButton>
      </template>

      <QuestionEdit :question="currentQuestion" @save="saveQuestion"></QuestionEdit>
    </BModal>
  </div>
</template>

<style scoped lang="scss">

</style>
