<script setup lang="ts">
import { useCurrentElement, useDebounceFn } from '@vueuse/core';
import { sleep } from '@windwalker-io/unicorn-next';
import { BFormGroup, BFormInput, BFormRadio, BFormRadioGroup, BFormTextarea } from 'bootstrap-vue-next';
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import OptionList from '~melo/components/segment-edit/question/OptionList.vue';
import { useQuestionController } from '~melo/features/question/useQuestionController';
import { useQuestionPresenter } from '~melo/features/question/useQuestionPresenter';
import { sleepMax } from '~melo/shared/timing';
import { MeloOption, Question } from '~melo/types';
import ImageUploader from '../../uploader/ImageUploader.vue';

const props = defineProps<{
}>();

const question = defineModel<Question>({
  required: true
});

const emit = defineEmits<{
  saving: [];
  saved: [];
}>();

const { scoreLimit } = useQuestionPresenter();

const options = ref<MeloOption[]>([]);
const hasOptions = computed(() => question.value.type === 'select' || question.value.type === 'multiple');

const el = useCurrentElement<HTMLDivElement>();

// Prepare
onMounted(async () => {
  await sleep(300);

  const input = el.value.querySelector<HTMLTextAreaElement | HTMLInputElement>('input, textarea');
  input?.focus();

  input?.dispatchEvent(new CustomEvent('input'))
});

const changeScore = useDebounceFn(async () => {
  question.value.score = scoreLimit(question.value.score);
}, 300);

function clearImage() {
  question.value.image = '';
}

// Save
const { save } = useQuestionController();
const saving = ref(false);
let autoSave = true;

watch(question, () => {
  if (autoSave) {
    saveDebounced();
  }
}, { deep: true });

const saveDebounced = useDebounceFn(async () => {
  saving.value = true;
  const now = Date.now();

  emit('saving');

  try {
    const saved = await save(question.value, 0);
    question.value.id = saved.id;
  } finally {
    await sleepMax(now, 500);

    emit('saved');
    saving.value = false;
  }
}, 500);

watch(() => question.value.type, (type) => {
  if (type === 'select') {
    let hasAnswer = false;

    for (const option of options.value) {
      if (hasAnswer) {
        option.isAnswer = false;
        continue;
      }

      if (option.isAnswer) {
        hasAnswer = true;
      }
    }
  }
}, { deep: true });

// Set first answer for select question
const answersCount = computed(() => {
  return options.value.filter(item => item.isAnswer).length;
});

watch(() => options, () => {
  if (answersCount.value === 0) {
    if (
      question.value.type === 'select'
      && options.value.length > 0
    ) {
      options.value[0].isAnswer = true;
    }
  }
}, { deep: true });
</script>

<template>
  <div class="pb-5">
    <BFormGroup
      label="題目內容"
      label-for="input-question-content"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormTextarea id="input-question-content" v-model="question.content"
        placeholder="請輸入題目內容"
        rows="7"
        max-rows="15"
      />
    </BFormGroup>

    <!--<BFormGroup-->
    <!--  label="題型"-->
    <!--  label-for="input-question-type"-->
    <!--  label-class="mb-2"-->
    <!--  class="mb-3"-->
    <!--&gt;-->
    <!--  <BFormRadioGroup-->
    <!--    v-model="question.type"-->
    <!--    button-variant="outline-primary"-->
    <!--    name="input-question-type"-->
    <!--    buttons-->
    <!--    class="w-100"-->
    <!--  >-->
    <!--    <BFormRadio value="boolean">-->
    <!--      <i :class="typeToIcon('boolean')"></i>-->
    <!--      {{ typeToTitle('boolean') }}-->
    <!--    </BFormRadio>-->

    <!--    <BFormRadio value="select">-->
    <!--      <i :class="typeToIcon('select')"></i>-->
    <!--      {{ typeToTitle('select') }}-->
    <!--    </BFormRadio>-->

    <!--    <BFormRadio value="multiple">-->
    <!--      <i :class="typeToIcon('multiple')"></i>-->
    <!--      {{ typeToTitle('multiple') }}-->
    <!--    </BFormRadio>-->
    <!--  </BFormRadioGroup>-->
    <!--</BFormGroup>-->

    <BFormGroup
      label="圖片(選填)"
      label-for="input-question-type"
      label-class="mb-2"
      class="mb-3"
    >
      <ImageUploader
        v-model="question.image"
        @clear="clearImage"
      ></ImageUploader>
    </BFormGroup>

    <BFormGroup v-if="question.type === 'boolean'"
      label="答案"
      label-for="input-question-answer"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormRadioGroup
        v-model="question.answer"
        button-variant="outline-primary"
        name="input-question-answer"
        buttons
        class="w-100"
      >
        <BFormRadio value="1">
          <i class="fas fa-check"></i>
          是
        </BFormRadio>
        <BFormRadio value="0">
          <i class="fas fa-xmark"></i>
          否
        </BFormRadio>
      </BFormRadioGroup>
    </BFormGroup>

    <!--<BFormGroup v-if="question.type === 'cloze'"-->
    <!--  label="答案"-->
    <!--  label-for="input-question-answer"-->
    <!--  label-class="mb-2"-->
    <!--  class="mb-3"-->
    <!--&gt;-->
    <!--  <BFormInput-->
    <!--    id="input-question-answer"-->
    <!--    v-model="question.answer"-->
    <!--    type="text"-->
    <!--    trim-->
    <!--  />-->
    <!--</BFormGroup>-->

    <div class="c-option-list my-5 py-4"
      v-if="hasOptions"
    >
      <h4>選項 ({{ options.length }})</h4>

      <OptionList :question v-model="options"
        @saving="emit('saving')"
        @saved="emit('saved')"
      />
    </div>

    <BFormGroup
      label="配分"
      label-for="input-question-score"
      description="限填 1~100，測驗滿分為 100"
    >
      <BFormInput
        id="input-question-score"
        v-model="question.score"
        type="number"
        max="100"
        min="1"
        @input="changeScore"
      />
    </BFormGroup>
  </div>
</template>

<style scoped lang="scss">

</style>
