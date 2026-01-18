<script setup lang="ts">
import { deleteConfirm } from '@windwalker-io/unicorn-next';
import { BButton } from 'bootstrap-vue-next';
import { onMounted } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import OptionEdit from '~melo/components/segment-edit/question/OptionEdit.vue';
import { useOptionController } from '~melo/features/question/useOptionController';
import { sleepMax } from '~melo/shared/timing';
import { QnOption, Question } from '~melo/types';

const props = defineProps<{
  question: Question;
}>();

const emit = defineEmits<{
  saving: [];
  saved: [];
  reorder: [];
}>();

const options = defineModel<QnOption[]>({
  default: () => []
});

const {
  createEmptyOption,
} = useOptionController();

onMounted(() => {
});

async function reorder() {
  emit('reorder');
}

async function createOption() {
  const option = createEmptyOption();

  options.value.push(option);
}

// Save
// let autoSave = true;

// async function autoSaveOption(option: QnOption) {
//   if (!autoSave) {
//     return;
//   }
//
//   const start = Date.now();
//   emit('saving');
//
//   try {
//     await saveOption(option, 0);
//   } finally {
//     await sleepMax(start, 500);
//
//     emit('saved');
//   }
// }

async function deleteOption(id: string) {
  const v = await deleteConfirm("確定要刪除這個選項嗎？");

  if (v) {
    options.value = options.value.filter(item => item.id !== id);
  }
}

async function setAnswer(index: number, currentAnswer: boolean) {
  if (props.question.type === 'select') {
    options.value.forEach((item: QnOption) => {
      item.isAnswer = false;
    });

    options.value[index].isAnswer = true;
  }

  if (props.question.type === 'multiple') {
    options.value[index].isAnswer = currentAnswer;
  }

  const answers: Record<string, boolean> = {};

  for (const option of options.value) {
    answers[option.id] = option.isAnswer;
  }

  const start = Date.now();

  emit('saving');

  await sleepMax(start, 500);

  emit('saved');

  // if (currentAnswer === options.value[index].isAnswer) {
  //   const { post } = await useHttpClient();
  //
  //   await post(
  //     route('save_options'),
  //     {
  //       data: options.value,
  //     }
  //   );
  // }
}
</script>

<template>
  <VueDraggable
    v-model="options"
    item-key="uid"
    handle=".handle"
    class="d-flex flex-column gap-2"
    :on-update="reorder"
  >
    <TransitionGroup name="fade">
      <OptionEdit
        v-for="(element, index) in options"
        style="animation-duration: 300ms;"
        :model-value="element"
        @update:model-value="options[index] = $event"
        :key="element.id"
        :index="index"
        @delete="deleteOption"
        @setAnswer="setAnswer"
      ></OptionEdit>
    </TransitionGroup>
  </VueDraggable>

  <div class="text-center mb-2 mt-3">
    <BButton @click="createOption" variant="primary" size="sm">
      <i class="fas fa-plus"></i>
      新增選項
    </BButton>
  </div>
</template>

<style scoped>

</style>
