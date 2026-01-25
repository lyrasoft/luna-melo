<script setup lang="ts">

import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { ApiReturn, data, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';
import { Modal } from 'bootstrap';
import { onMounted, ref, useTemplateRef } from 'vue';
import { Segment } from '~melo/types';

const form = useTemplateRef<HTMLFormElement>('form');
const modalEl = useTemplateRef<HTMLDivElement>('modalEl');
let modal: Modal;
const chapterIndex = ref(0);
const sectionIndex = ref(0);
const typeIndex = ref(0);
const segmentId = ref(0);
const segmentTitle = ref('');
const currentSegment = ref<Segment>();

onMounted(() => {
  modal = Modal.getOrCreateInstance(modalEl.value!);
  
  const buttons = document.querySelectorAll<HTMLAnchorElement>('[data-task="start-homework"]');

  for (const button of buttons) {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      await startHomework(button);

      modal.show();
    });
  }
});

async function startHomework(button: HTMLAnchorElement) {
  segmentId.value = Number(button.dataset.segmentId);
  segmentTitle.value = button.dataset.segmentTitle || '';
  chapterIndex.value = Number(button.dataset.chapterIndex) || 0;
  sectionIndex.value = Number(button.dataset.sectionIndex) || 0;
  typeIndex.value = Number(button.dataset.typeIndex) || 0;

  description.value = '';
  file.value = undefined;
  frontShow.value = true;

  const { get } = await useHttpClient();

  const res = await get<ApiReturn<Segment>>(`@ajax_lesson/getSegment?id=${segmentId.value}`);

  currentSegment.value = res.data.data;
}

// Form
const { wrap, loading } = useLoading();

const description = ref('');
const file = ref<File>();
const frontShow = ref(true);


const submit = wrap(async () => {
  const { post } = await useHttpClient();

  try {
    const formData = new FormData();
    formData.append('item[segment_id]', segmentId.value.toString());
    formData.append('item[description]', description.value);
    if (file.value) {
      formData.append('item[homework_file]', file.value);
    }
    formData.append('item[front_show]', frontShow.value ? '1' : '0');

    const res = await post('@ajax_lesson/updateHomework', formData);

    await simpleAlert('作業上傳成功！');

    location.reload();

  } catch (e) {
    console.error(e);
    await simpleAlert('作業上傳失敗');
  }
});
</script>

<template>
<div>
  <div ref="modalEl" class="modal fade c-homework-modal" id="homework-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            作業上傳
          </h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form v-if="currentSegment" id="homework-form" enctype="multipart/form-data" method="post"
            ref="form"
            >
            <h6>
              作業標題
            </h6>

            <div class="mb-4 text-muted j-homework-title">
              {{ segmentTitle }}
            </div>

            <h6>
              章節
            </h6>

            <div class="mb-4 text-muted j-homework-index">
              第 {{ chapterIndex }} 章 作業 {{ typeIndex }}
            </div>

            <h6>
              敘述
            </h6>

            <div class="mb-4 text-muted j-homework-content" v-html="currentSegment.content"></div>

            <h6>
              作業敘述
            </h6>

            <div class="mb-4">
              <textarea class="form-control" name="item[description]" placeholder="寫下作業敘述..."
                v-model="description"
                rows="5"></textarea>
            </div>

            <div class="mb-4">
              <div class="form-group">
                <label for="input-homework-file" class="form-label">上傳檔案</label>
                <input class="form-control" type="file" id="input-homework-file" name="item[homework_file]"
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  @change="(e) => file = e.target?.files[0]"
                >
              </div>
            </div>

            <div class="mb-4 pb-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="item[front_show]" id="front-show-true"
                  v-model="frontShow"
                  :value="true">
                <label class="form-check-label" for="front-show-true">
                  公開在前台
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="item[front_show]" id="front-show-false"
                  v-model="frontShow"
                  :value="false">
                <label class="form-check-label" for="front-show-false">
                  不公開在前台
                </label>
              </div>
            </div>

            <input type="hidden" class="j-homework-section-id" name="item[segment_id]" :value="segmentId">
            <!--<input type="hidden" name="anticsrf" :value="csrf">-->

            <div class="d-grid gap-2 mx-4 mb-5">
              <button type="button" class="btn btn-primary j-homework-submit"
                :disabled="loading"
                @click="submit">
                確認送出
              </button>
              <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal"
                :disabled="loading">
                先跳過此節
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>

</style>
