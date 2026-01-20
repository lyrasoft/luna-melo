<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { deleteConfirm } from '@windwalker-io/unicorn-next';
import { toRefs } from 'vue';
import { useQuestionController } from '~melo/modules/segment-editor/features/question/useQuestionController';
import { useQuestionPresenter } from '~melo/modules/segment-editor/features/question/useQuestionPresenter';
import { Question } from '~melo/types';

const props = defineProps<{
  item: Question;
  index: number;
}>();

const emit = defineEmits<{
  'edit': [item: Question];
  'delete': [itemId: number];
  'save': [item: Question];
  'saving': [];
  'saved': [];
}>();

const { save, remove } = useQuestionController();
const { typeToTitle, scoreLimit } = useQuestionPresenter();

const { item } = toRefs(props);

function editQuestion() {
  emit('edit', item.value);
}

async function deleteQuestion() {
  const v = await deleteConfirm(
    "確定要刪除這個問題嗎？",
    '',
  );

  if (v) {
    await remove(item.value.id!);

    emit('delete', item.value.id!);
  }
}

const changeScore = useDebounceFn(async () => {
  item.value.score = scoreLimit(item.value.score);

  emit('saving');

  await save(item.value, 0);

  emit('saved');
}, 300);
</script>

<template>
  <div class="c-question-item-outside" :data-qn-id="item.id">
    <!-- Bar -->
    <div class="c-question-item card border">
      <div class="c-question-item__content card-body p-1 d-flex align-items-center gap-2" style="min-width: 1px">
        <div class="c-question-item__handle handle px-2"
          style="cursor: move; z-index: 3;">
          <span class="fal fa-bars"></span>
        </div>

        <div class="text-nowrap text-muted" style="min-width: 2em;">
          {{ props.index + 1 }}.
        </div>

        <div class="text-nowrap me-3">
          {{ typeToTitle(item.type) }}
        </div>

        <a href="#" class="c-question-item__title text-truncate text-decoration-none"
          @click.prevent="editQuestion">
          {{ item.content || '題目內容未填寫' }}
        </a>

        <div class="d-flex align-items-center gap-3 text-nowrap ms-auto">
          <div class="text-nowrap me-1 d-flex align-items-center">
            <div class="me-1">
              分數
            </div>
            <div>
              <input v-model="item.score" type="number" id="input-score"
                class="form-control form-control-sm"
                style="width: 5em;"
                @input="changeScore" />
            </div>
          </div>

          <div class="c-question-item__delete">
            <a href="javascript://" class="link-danger" @click="deleteQuestion">
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
