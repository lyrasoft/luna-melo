<script setup lang="ts">
import { dateToFormat } from '@lyrasoft/ts-toolkit/datetime';
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { ApiReturn, useHttpClient } from '@windwalker-io/unicorn-next';
import { onMounted, ref } from 'vue';
import { UserSegmentMap } from '~melo/types';
import simularLogo from '~melo/images/simular-logo.png';

const props = defineProps<{
  lessonId: number;
  totalAssignment: number;
  lessonSectionOrder: number[][];
}>();

const { loading, wrap } = useLoading();
const assignments = ref<UserSegmentMap[]>([]);
const offset = ref(0);
const limit = 5;
const end = ref(false);

onMounted(() => {
  loadAssignments();
});

const loadAssignments = wrap(async () => {
  const { get, post } = await useHttpClient();

  const res = await get<ApiReturn<UserSegmentMap[]>>(
    '@lesson_ajax/prepareStudentAssignments',
    {
      params: {
        lesson_id: props.lessonId,
        limit,
        offset: offset.value,
      }
    }
  );

  assignments.value.push(...res.data.data);

  offset.value += limit;

  if (res.data.data.length < limit) {
    end.value = true;
  }
});

function getSectionName(value: number) {
  for (let i = 0; i < props.lessonSectionOrder.length; i++) {
    for (let j = 0; j < props.lessonSectionOrder[i].length; j++) {
      if (props.lessonSectionOrder[i][j] === value) {
        return `第 ${i + 1} 章 第 ${j + 1} 節`;
      }
    }
  }

  return '';
}
</script>

<template>
  <div id="homework-list-app" class="card-body c-lesson-detail-card__body">
    <template v-if="totalAssignment > 0">
      <h4 class="card-title c-lesson-detail-card__title">
        作業
      </h4>

      <div class="c-homework-list">

        <div class="c-homework-item d-flex gap-3 p-3" v-for="(assignment, index) in assignments">
          <div class="c-homework-item__avatar">
            <img width="40" height="40" class="img-fluid rounded-circle"
              style="min-width: 40px;"
              :src="assignment.user.avatar" alt="${assignment.user.name}">
          </div>

          <div class="d-flex flex-grow-1 flex-column gap-3">
            <div class="d-flex align-items-center">
              {{  assignment.user.name }}｜<span class="c-homework-item__date">{{ dateToFormat(assignment.created) }}</span>
            </div>

            <div class="text-muted">
              {{ getSectionName(assignment.segmentId) }}
            </div>

            <div class="d-flex">
              <div class="me-3 pe-1">
                <img width="100" :src="simularLogo" alt="作業縮圖">
              </div>
              <div class="text-muted">
                {{ assignment.description }}
              </div>
            </div>
          </div>
        </div>

      </div>

      <a href="#"
        @click.prevent="loadAssignments"
        class="d-block link-secondary border-top py-4 text-center j-get-student-assignments"
        :class="{ disabled: loading }"
        v-if="!end"
      >
        查看更多 <i class="fa-solid fa-chevron-down"></i>
      </a>
    </template>

    <template v-else>
      <div class="text-muted py-4">
        本課程無作業要上傳唷！
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
