<script setup lang="ts">
import { uniqueItemList } from '@lyrasoft/ts-toolkit/vue';
import { deleteConfirm, route, useHttpClient } from '@windwalker-io/unicorn-next';
import {
  BButton,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BFormRadioGroup,
  BModal,
  BSpinner,
  useModal
} from 'bootstrap-vue-next';
import { computed, inject, onMounted, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import QuestionTypeSelector from '~melo/modules/segment-editor/components/segment-edit/question/QuestionTypeSelector.vue';
import { useQuestionController } from '~melo/modules/segment-editor/features/question/useQuestionController';
import { useSegmentEditor } from '~melo/modules/segment-editor/features/segment/useSegmentEditor';
import { Question, Segment } from '~melo/types';
import QuestionItem from '../question/QuestionItem.vue';
import QuestionEdit from '../question/QuestionEdit.vue';

const item = defineModel<Segment>({
  required: true
});

const questions = ref<Question[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
  await prepareQuestions();
});

const { saving } = useSegmentEditor();
const { getQuestions, createEmptyQuestion, save, reorder: reorderQuestions, remove } = useQuestionController();

async function prepareQuestions() {
  loading.value = true;

  const items = await getQuestions(item.value.id!);

  questions.value = uniqueItemList(items);

  loading.value = false;
}

async function reorder() {
  const orders: Record<number, number> = {};

  questions.value.forEach((item, i) => {
    orders[item.id!] = i + 1;
  });

  await reorderQuestions(orders);
}

async function deleteQuestion(id: number) {
  questions.value = questions.value.filter(item => item.id !== id);
}

// New Question
const questionTypeSelectorModalOpen = ref(false);

function newQuestion() {
  questionTypeSelectorModalOpen.value = true;
}

async function newQuestionSelected(type: string) {
  const question = createEmptyQuestion(item.value.lessonId, item.value.id!);
  question.type = type;
  question.ordering = questions.value.length + 1;

  const newItem = await save(question, 1);

  questions.value.push(newItem);

  editQuestion(newItem);
}

// Edit Question
const questionEditModalOpen = ref(false);
const currentEditQuestion = ref<Question>();
const questionsSaving = ref(false);
const questionSaved = ref(false);

function editQuestion(question: Question) {
  currentEditQuestion.value = question;
  questionEditModalOpen.value = true;
  questionsSaving.value = false;
  questionSaved.value = false;
}
</script>

<template>
  <div>
    <BFormGroup
      label="小節名稱"
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
        button-variant="outline-primary"
        name="input-section-skip"
        buttons
      >
        <BFormRadio :value="true">可以</BFormRadio>
        <BFormRadio :value="false">不可以</BFormRadio>
      </BFormRadioGroup>
    </BFormGroup>

    <div class="c-quiz-edit d-flex flex-column gap-4">
      <div class="h6 c-quiz-edit__title">
        測驗內容
      </div>

      <div v-if="loading" class="text-center">
        <BSpinner />
      </div>

      <div v-else class="c-quiz-list">
        <VueDraggable
          v-model="questions"
          class="d-flex flex-column gap-2"
          item-key="uid"
          handle=".handle"
          :animation="300"
          :on-update="reorder"
        >
          <TransitionGroup name="fade">
            <QuestionItem
              v-for="(element, index) in questions"
              :item="element"
              :key="element.id"
              :index="index"
              @edit="editQuestion"
              @delete="deleteQuestion"
              @saving="saving = true"
              @saved="saving = false;"
              style="animation-duration: 300ms;"
            ></QuestionItem>
          </TransitionGroup>
        </VueDraggable>
      </div>

      <div class="text-center">
        <button type="button" class="btn btn-primary btn-sm text-nowrap"
          style="width: 150px;"
          @click="newQuestion">
          <i class="fas fa-plus"></i>
          新增題目
        </button>
      </div>
    </div>

    <!-- Section Edit -->
    <BModal
      id="question-edit-modal"
      title="題目編輯"
      v-model="questionEditModalOpen"
      no-footer
      lazy
      unmount-lazy
      size="lg"
      bodyBgVariant="light"
      contentClass="bg-white"
    >
      <template #title>
        <div class="d-flex align-items-center gap-3">
          <div>
            題目編輯
          </div>

          <div v-if="questionsSaving" class="text-muted small">
            <BSpinner small type="border" class="me-1" />
            儲存中...
          </div>
          <div v-else-if="questionSaved" class="small text-muted">
            <i class="fas fa-check text-success"></i>
            已儲存
          </div>
        </div>
      </template>

      <QuestionEdit v-if="currentEditQuestion" v-model="currentEditQuestion"
        @saving="questionsSaving = true"
        @saved="questionSaved = true; questionsSaving = false"
      ></QuestionEdit>
    </BModal>

    <BModal
      id="question-type-selector-modal"
      title="選擇題目類型"
      v-model="questionTypeSelectorModalOpen"
      no-footer
      lazy
      unmount-lazy
    >
      <QuestionTypeSelector @selected="newQuestionSelected" />
    </BModal>
  </div>
</template>

<style scoped lang="scss">

</style>
