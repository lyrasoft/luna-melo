<script setup lang="ts">
import { toRefs } from 'vue';
import { MeloOption } from '~melo/types';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps<{
  item: MeloOption;
  index: number;
}>();

const emit = defineEmits<{
  'delete': [optionId: number];
  'edit': [option: MeloOption];
  'setAnswer': [index: number, isAnswer: boolean];
}>();
const { item } = toRefs(props);

function deleteOption() {
  emit('delete', item.value.id);
}

const edit = useDebounceFn(() => {
  emit('edit', item.value);
}, 300);

function setIsAnswer() {
  emit('setAnswer', props.index, item.value.isAnswer);
}
</script>

<template>
  <div>
    <!-- Bar -->
    <div class="c-option-item">
      <div class="c-option-item__wrapper d-flex border rounded-1 my-2">
        <div class="c-option-item__handle handle">
          <span class="fal fa-bars"></span>
          <span class="sr-only">Drag</span>
        </div>

        <div class="c-option-item__content d-flex justify-content-between align-items-center ms-2" style="min-width: 1px">
          <div class="text-nowrap me-1">
            <BFormInput
              v-model="item.title"
              placeholder="輸入選項內容"
              @input="edit"
            />
          </div>

          <div class="d-flex align-items-center text-nowrap ms-auto">
            <div class="text-nowrap me-1 d-flex align-items-center">
              <BFormCheckbox v-model="item.isAnswer" @change="setIsAnswer" switch>
              </BFormCheckbox>
            </div>

            <div class="c-option-item__delete">
              <a href="javascript://" class="btn c-delete-btn" @click="deleteOption">
                <i class="fal fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-option-item {

  &__wrapper {
    background: white;
    padding: 0 10px 0 15px;
  }

  &__handle {
    padding: 10px 15px 10px 0;
    border-right: 1px solid var(--bs-border-color);

    > .fa-bars {
      line-height: 24px;
    }
  }

  &__content {
    width: 100%;

    input {
      width: 300px;
    }
  }

  &__delete {
    margin-left: auto;
  }
}
</style>
