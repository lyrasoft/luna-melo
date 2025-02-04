<template>
  <div>
    <!-- Bar -->
    <div class="c-question-item">
      <div class="c-question-item__wrapper d-flex border rounded-1 my-2">
        <div class="c-question-item__handle handle">
          <span class="fal fa-bars"></span>
          <span class="sr-only">Drag</span>
        </div>

        <div class="c-question-item__content d-flex align-items-center ms-2" style="min-width: 1px">
          <div class="me-1 text-nowrap text-muted">
            {{ props.index + 1 }}.
          </div>

          <div class="text-nowrap me-1">
            {{ QuestionType[item.type.replace('-', '_')] }}
          </div>

          <a class="c-question-item__title text-truncate pe-1 me-2" @click="editQuestion">
            {{ item.content || '題目內容未填寫' }}
          </a>

          <div class="d-flex align-items-center text-nowrap ms-auto">
            <div class="text-nowrap me-1 d-flex align-items-center">
              <div class="me-1">
                分數
              </div>
              <div>
                <input v-model="item.score" type="number" id="input-score" @input="changeScore" />
              </div>
            </div>

            <div class="c-question-item__delete">
              <a href="javascript://" class="btn c-delete-btn" @click="deleteQuestion">
                <i class="fal fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { Question } from '../../../types/question.type';
import { QuestionType, scoreLimit } from '../../../services/question-service';

const props = defineProps<{
  item: Question;
  index: number;
}>();

const emit = defineEmits(['edit', 'delete', 'save']);

const { item } = toRefs(props);

function editQuestion() {
  emit('edit', item.value);
}

function deleteQuestion() {
  emit('delete', item.value.id);
}

const changeScore = u.debounce(() => {
  item.value.score = scoreLimit(item.value.score);
  emit('save', item.value);
}, 300);
</script>

<style scoped lang="scss">
.c-question-item {

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
    flex-grow: 1;
  }

  &__title {
    font-weight: 700;
  }

  &__delete {
    margin-left: auto;
  }

  #input-score {
    border-width: 0 0 1px 0;
    border-color: #dee2e6;
    border-style: solid;
    text-align: center;
    width: 60px;
    background: transparent;
  }
}
</style>
