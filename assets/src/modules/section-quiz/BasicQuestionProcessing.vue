<script setup lang="ts">
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';
import { computed } from 'vue';
import { useQuestionPresenter } from '~melo/modules/segment-editor/features/question/useQuestionPresenter';
import { QnOption, Question } from '~melo/types';

const props = defineProps<{
  index: number;
  question: Question;
}>();

const answer = defineModel<any>({
  required: true,
});

const type = computed(() => props.question.type);

if (answer.value == null) {
  if (type.value === 'select') {
    answer.value = '';
  } else if (type.value === 'multiple') {
    answer.value = [];
  } else if (type.value === 'boolean') {
    answer.value = null;
  }
}

const { typeToTitle } = useQuestionPresenter();

const options = computed<QnOption[]>(() => {
  if (type.value === 'select') {
    return props.question.params.options || [];
  } else if (type.value === 'multiple') {
    return props.question.params.options || [];
  }

  return [];
});

function getQuestionInputName(question: Question, suffix = '') {
  return `quiz[${question.id}]${suffix}`;
}

function toggleMultiple(e: Event, option: QnOption) {
  const target = e.target as HTMLInputElement;

  if (target.checked) {
    answer.value = [...answer.value, option.text];
  } else {
    answer.value = (answer.value as any[]).filter((ans) => ans !== option.text);
  }
}

// Submit
const { loading, wrap } = useLoading();

const submit = wrap(async () => {
  const { post } = await useHttpClient();

  const formData = new FormData();

  for (const k in answer.value) {
    const ans = answer.value[k];

    formData.append(`quiz[${k}]`, ans);
  }

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
  <div class="c-question-item">
    <div class="h6 mb-1">
      第 {{ index }} 題（{{ typeToTitle(question.type) }}）:<br>
      {{ question.title }}
    </div>
    <div class="mb-3" v-html="question.content">

    </div>
    <div>

      <template v-if="type === 'select'">
        <div class="d-flex flex-column gap-2">
          <div class="form-check" v-for="(option, idx) in options" :key="idx">
            <input
              class="form-check-input"
              type="radio"
              :id="'question-' + question.id + '-option-' + idx"
              :value="option.text"
              :name="getQuestionInputName(question)"
              v-model="answer"
            >
            <label
              class="form-check-label"
              :for="'question-' + question.id + '-option-' + idx"
            >{{ option.text }}</label>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'multiple'">
        <div class="d-flex flex-column gap-2">
          <div class="form-check" v-for="(option, idx) in options" :key="idx">
            <input
              class="form-check-input"
              type="checkbox"
              :id="`question-${question.id}-option-${idx}`"
              :name="getQuestionInputName(question, '[]')"
              :value="option.text"
              :checked="Array.isArray(answer) && answer.includes(option.text)"
              @change="toggleMultiple($event, option)"
            >
            <label
              class="form-check-label"
              :for="'question-' + question.id + '-option-' + idx"
            >{{ option.text }}</label>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'boolean'">
        <div class="d-flex flex-column gap-2">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="'question-' + question.id + '-option-yes'"
              :name="getQuestionInputName(question)"
              value="1"
              v-model="answer"
            >
            <label
              class="form-check-label"
              :for="'question-' + question.id + '-option-yes'"
            >
              是
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="'question-' + question.id + '-option-no'"
              :name="getQuestionInputName(question)"
              value="0"
              v-model="answer"
            >
            <label
              class="form-check-label"
              :for="'question-' + question.id + '-option-no'"
            >
              否
            </label>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>

</style>
