<script setup lang="ts">
import { BFormCheckbox, BFormTextarea, vBTooltip } from 'bootstrap-vue-next';
import { QnOption } from '~melo/types';

const props = defineProps<{
  index: number;
}>();

const emit = defineEmits<{
  'delete': [optionId: string];
  'save': [option: QnOption];
  'setAnswer': [index: number, isAnswer: boolean];
}>();

const item = defineModel<QnOption>({
  required: true
});

function deleteOption() {
  emit('delete', item.value.id!);
}

// const save = useDebounceFn(() => {
//   emit('save', item.value);
// }, 300);

// watch(item, () => {
//   save();
// }, { deep: true });

function setIsAnswer() {
  emit('setAnswer', props.index, item.value.isAnswer);
}


</script>

<template>
  <div class="c-option-outside" :data-option-id="item.id">
    <!-- Bar -->
    <div class="c-option-item card border" style="min-width: 1px;">
      <div class="card-body d-flex align-items-center gap-3">
        <div class="c-option-item__handle handle" style="cursor: move; z-index: 3;">
          <span class="fal fa-bars"></span>
        </div>

        <div class="text-nowrap flex-grow-1">
          <BFormTextarea
            v-model="item.text"
            placeholder="輸入選項內容"
            rows="2"
          />
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="text-nowrap me-1 d-flex align-items-center">
            <BFormCheckbox v-model="item.isAnswer" @change="setIsAnswer" switch
              class="m-0">
              正確答案
            </BFormCheckbox>
          </div>

          <div class="c-option-item__delete">
            <a href="javascript://" class="link-danger" @click="deleteOption"
              v-b-tooltip="'刪除此選項'"
            >
              <i class="fal fa-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
