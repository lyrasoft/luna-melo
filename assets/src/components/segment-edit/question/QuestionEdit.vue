<script setup lang="ts">
import swal from 'sweetalert';
import { onMounted, ref, toRefs, watch } from 'vue';
import { scoreLimit } from '~melo/features/quiz/question-service';
import { MeloOption, Question } from '~melo/types';
import OptionEdit from './OptionEdit.vue';
import ImageUploader from '../../uploader/ImageUploader.vue';

const props = defineProps<{
  question: Question;
}>();

const emit = defineEmits(['save']);

const { question } = toRefs(props);
const image = ref<null|File>(null)
const options = ref<MeloOption[]>([]);

const typeOptions = [
  { text: '是非題', value: 'boolean' },
  { text: '單選題', value: 'select' },
  { text: '多選題', value: 'multiple' },
];

const booleanOptions = [
  { text: '是', value: '1' },
  { text: '否', value: '0' },
];

const hasOptionsType = ['select', 'multiple'];

onMounted(async () => {
  if (hasOptionsType.indexOf(question.value.type) !== -1) {
    await prepareOptions();
  }
})

const changeScore = u.debounce(async () => {
  question.value.score = scoreLimit(question.value.score);
  emit('save', question.value);
}, 300);

async function prepareOptions() {
  const res = u.$http.get(
    u.route('prepare_options'),
    {
      params: {
        question_id: question.value.id
      }
    }
  );

  options.value = Utilities.prepareList((await res).data.data);
}

async function reorder() {
  const orders = {};

  options.value.forEach((item, i) => {
    orders[item.id] = i + 1;
  });

  await u.$http.post(
    u.route('reorder_options'),
    {
      orders: orders,
    }
  );
}

async function createOption() {
  const option = {
    id: null,
    question_id: question.value.id,
    title: '',
    is_answer: 0,
    state: 1,
    ordering: options.value.length + 1,
  };

  await save(option, 1);
  await prepareOptions();
}

async function save(
  data: Object,
  isNew: number = 0
) {
  await u.$http.post(
    u.route('save_option'),
    {
      data: data,
      is_new: isNew,
    }
  );
}

async function deleteOption(id: number) {
  const v = await swal(
    {
      title: "確定要刪除這個選項嗎？",
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
      u.route('delete_option'),
      {
        id: id
      }
    );

    await prepareOptions();
  }
}

async function setAnswer(index: number, currentAnswer: boolean) {
  if (question.value.type === 'select') {
    options.value.forEach((item: Option) => {
      item.isAnswer = false;
    })

    options.value[index].isAnswer = true;
  }

  if (question.value.type === 'multiple') {
    options.value[index].isAnswer = currentAnswer;
  }

  if (currentAnswer === options.value[index].isAnswer) {
    await u.$http.post(
      u.route('save_options'),
      {
        data: options.value,
      }
    );
  }
}

function imageUploaded(src: string) {
  question.value.image = src;
  emit('save', question.value);
}

function clearImage() {
  question.value.image = '';
  emit('save', question.value);
}

watch(question.value, (newValue) => {
  question.value.isMultiple = newValue.type === 'multiple';
}, { deep: true });
</script>

<template>
  <div>
    <BFormGroup
      label="題目內容編輯"
      label-for="input-question-content"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormTextarea id="input-question-content" v-model="question.content" rows="5" />
    </BFormGroup>

    <BFormGroup
      label="題型"
      label-for="input-question-type"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormRadioGroup
        v-model="question.type"
        :options="typeOptions"
        button-variant="outline-primary"
        name="input-question-type"
        buttons
      />
    </BFormGroup>

    <image-uploader
      :image="question.image"
      label="上傳圖片(選填)"
      @uploaded="imageUploaded"
      @clear="clearImage"
    ></image-uploader>

    <BFormGroup v-if="question.type === 'boolean'"
      label="答案"
      label-for="input-question-answer"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormRadioGroup
        v-model="question.answer"
        :options="booleanOptions"
        button-variant="outline-primary"
        name="input-question-answer"
        buttons
      />
    </BFormGroup>

    <BFormGroup v-if="question.type === 'cloze'"
      label="答案"
      label-for="input-question-answer"
      label-class="mb-2"
      class="mb-3"
    >
      <BFormInput
        id="input-question-answer"
        v-model="question.answer"
        type="text"
        trim
      />
    </BFormGroup>

    <div class="c-option-list mt-5"
      v-if="hasOptionsType.indexOf(question.type) !== -1"
    >
      <div class="d-flex">
        <div style="width: 45px;"></div>
        <div class="text-center" style="width: 300px;">
          選項內容
        </div>

        <div class="ms-3">
          正確答案
        </div>
      </div>
      <draggable
        v-model="options"
        item-key="uid"
        handle=".handle"
        @change="reorder"
      >
        <template #item="{element, index}">
          <option-edit
            :item="element"
            :key="element.id"
            :index="index"
            @delete="deleteOption"
            @edit="save"
            @setAnswer="setAnswer"
          ></option-edit>
        </template>
      </draggable>

      <div class="text-center mb-2 mt-3">
        <BButton @click="createOption">
          新增選項
        </BButton>
      </div>
    </div>

    <BFormGroup
      label="配分"
      label-for="input-question-score"
      label-class="mb-2"
      class="mb-3"
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
