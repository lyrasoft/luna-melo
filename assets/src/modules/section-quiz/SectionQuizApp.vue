<script setup lang="ts">

import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { animateTo, ApiReturn, simpleAlert, sleep, useHttpClient } from '@windwalker-io/unicorn-next';
import { Modal } from 'bootstrap';
import { computed, defineAsyncComponent, onMounted, ref, useTemplateRef } from 'vue';
import { useQuestionFrontComponents } from '~melo/modules/section-quiz/useQuestionFrontComponents';
import { useQuestionPresenter } from '~melo/modules/segment-editor/features/question/useQuestionPresenter';
import { Question, QuestionDefine, Segment } from '~melo/types';

const props = defineProps<{
  questionDefines: Record<string, QuestionDefine>;
}>();

const { provideDefines } = useQuestionPresenter();

provideDefines(props.questionDefines);

const modalEl = useTemplateRef<HTMLDivElement>('modalEl');
let modal: Modal;
const chapterIndex = ref(0);
const sectionIndex = ref(0);
const typeIndex = ref(0);
const segmentId = ref(0);
const segmentTitle = ref('');
const currentSegment = ref<Segment>();
const loaded = ref(false);

onMounted(() => {
  modal = Modal.getOrCreateInstance(modalEl.value!);

  const buttons = document.querySelectorAll<HTMLAnchorElement>('[data-task="start-quiz"]');

  for (const button of buttons) {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      loaded.value = false;

      await startQuiz(button);

      loaded.value = true;

      modal.show();
    });
  }
});

const form = useTemplateRef<HTMLFormElement>('form');
const questions = ref<Question[]>([]);

async function startQuiz(button: HTMLAnchorElement) {
  segmentId.value = Number(button.dataset.segmentId);
  segmentTitle.value = button.dataset.segmentTitle || '';
  chapterIndex.value = Number(button.dataset.chapterIndex) || 0;
  sectionIndex.value = Number(button.dataset.sectionIndex) || 0;
  typeIndex.value = Number(button.dataset.typeIndex) || 0;

  const { get } = await useHttpClient();

  const res = await get<ApiReturn<{ questions: Question[]; }>>(
    `@ajax_lesson/prepareQuestionList?id=${segmentId.value}`
  );

  questions.value = res.data.data.questions;

  for (const question of questions.value) {
    answers.value[question.id as number] = null;
  }
}

// Answers
const answers = ref<Record<number, any>>({});

// Questions
const questionComponents = computed(() => {
  const components: Record<number, any> = {};

  for (const i in questions.value) {
    const qn = questions.value[i];
    const loader = getQuestionComponent(qn);

    if (!loader) {
      continue;
    }

    components[qn.id as number] = loader;
  }

  return components;
});

function getQuestionComponent(question: Question) {
  const components = useQuestionFrontComponents();

  const component = components[question.type];

  if (!component) {
    return null;
  }

  return defineAsyncComponent(component);
}

// Submit
const { loading, wrap } = useLoading();

async function alertUnAnswerQuestion(id: string) {
  const index = questions.value.findIndex((qn) => Number(qn.id) === Number(id));

  await simpleAlert(`第 ${index + 1} 題尚未作答！`, '', 'warning');

  const qnContainer = modalEl.value!.querySelector('.c-question-list');

  const qnBox = qnContainer?.children[index] as HTMLDivElement;

  if (qnBox) {
    qnBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    qnBox.style.transition = 'all .75s ease-in-out';

    await sleep(500);
    qnBox.style.borderColor = 'var(--bs-danger)';
    await sleep(1250);
    qnBox.style.borderColor = '';
  }
}

const submit = wrap(async () => {
  const { post } = await useHttpClient();

  for (const id in answers.value) {
    const ans = answers.value[id];

    if (ans === '' || ans == null || (Array.isArray(ans) && ans.length === 0)) {
      alertUnAnswerQuestion(id);
      return;
    }
  }

  const formData = new FormData(form.value!);

  try {
    await post(
      '@ajax_lesson/submitQuiz',
      formData,
    );

    await simpleAlert('測驗提交成功！', '', 'success');

    location.reload();
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      simpleAlert('測驗提交失敗！', e.message, 'warning');
    }
  }
});
</script>

<template>
  <div>
    <div ref="modalEl" class="modal fade c-quiz-modal" id="quiz-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              測驗
            </h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body px-5 mx-5">
            <form ref="form" id="quiz-form" enctype="multipart/form-data" method="post">
              <div class="my-4 text-muted text-center j-quiz-title">
              </div>

              <div class="text-danger mb-5 text-center">
                ＊提醒您未完成此測驗無法前往下個章節唷！
              </div>

              <div v-if="loaded" class="c-question-list mb-4 d-flex flex-column gap-4">
                <div class="card c-question-item-wrapper" v-for="(question, index) in questions" :key="question.id">
                  <Component
                    class="card-body"
                    :is="questionComponents[question.id as number]"
                    :index="index + 1"
                    :question="question"
                    v-model="answers[question.id as number]"
                  />
                </div>
              </div>

              <div class="text-danger text-center mb-5">
                ＊提交後無法變更答案唷！
              </div>

              <input type="hidden" class="j-quiz-section-id" name="segment_id" :value="segmentId">

              <div class="text-center mb-5">
                <button type="button" class="btn btn-primary btn-lg j-quiz-submit w-100"
                  :disabled="loading"
                  @click="submit"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
