<script setup lang="ts">
import { deleteConfirm } from '@windwalker-io/unicorn-next';
import { BButton } from 'bootstrap-vue-next';
import { onMounted } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import OptionEdit from '~melo/components/segment-edit/question/OptionEdit.vue';
import { useOptionController } from '~melo/features/question/useOptionController';
import { sleepMax } from '~melo/shared/timing';
import { MeloOption, Question } from '~melo/types';

const props = defineProps<{
  question: Question;
}>();

const emit = defineEmits<{
  saving: [];
  saved: [];
}>();

const options = defineModel<MeloOption[]>({
  default: () => []
});

const {
  save: saveOption,
  reorder: reorderOptions,
  deleteOption: remove,
  getOptions, createEmptyOption,
  saveMultiple,
} = useOptionController();

onMounted(() => {
  prepareOptions();
});

async function prepareOptions() {
  options.value = await getOptions(props.question.id!);
}

async function reorder() {
  autoSave = false;

  const orders: Record<number, number> = {};

  options.value.forEach((item, i) => {
    orders[item.id!] = i + 1;
  });

  await reorderOptions(orders);

  autoSave = true;
}

async function createOption() {
  const option = createEmptyOption(props.question.id!);
  option.ordering = options.value.length + 1;

  const newItem = await saveOption(option, 1);

  options.value.push(newItem);
}

// Save
let autoSave = true;

async function autoSaveOption(option: MeloOption) {
  if (!autoSave) {
    return;
  }

  const start = Date.now();
  emit('saving');

  try {
    await saveOption(option, 0);
  } finally {
    await sleepMax(start, 500);

    emit('saved');
  }
}

async function deleteOption(id: number) {
  const v = await deleteConfirm("確定要刪除這個選項嗎？");

  if (v) {
    options.value = options.value.filter(item => item.id !== id);

    await remove(id);
  }
}

async function setAnswer(index: number, currentAnswer: boolean) {
  autoSave = false;

  if (props.question.type === 'select') {
    options.value.forEach((item: MeloOption) => {
      item.isAnswer = false;
    });

    options.value[index].isAnswer = true;
  }

  if (props.question.type === 'multiple') {
    options.value[index].isAnswer = currentAnswer;
  }

  const answers: Record<number, boolean> = {};

  for (const option of options.value) {
    answers[option.id!] = option.isAnswer;
  }

  const start = Date.now();

  emit('saving');

  try {
    await saveMultiple(options.value);
  } finally {
    autoSave = true;
  }

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
        :item="element"
        :key="element.id"
        :index="index"
        @save="autoSaveOption"
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
