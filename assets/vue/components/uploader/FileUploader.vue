<template>
  <div class="c-file-uploader pb-3"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="drop"
  >
    <div class="c-file-uploader__card card overflow-hidden position-relative">
      <div class="c-file-uploader__card-body card-body">
        <div class="c-file-uploader__inner">
          <div v-if="loading" class="text-center">
            <BSpinner />
          </div>

          <div v-else>
            <div class="text-center mb-3">
              <i class="far fa-upload fa-fw fa-2x"></i>
            </div>

            <div class="text-center mb-3">
              上傳: 拖拉檔案或按此瀏覽
            </div>

            <div class="text-center">
              <BButton variant="primary" @click="openUpload">
                上傳
              </BButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-none">
      <input ref="fileInput" type="file" @change="upload" :accept="props.accept" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  accept: string|string[];
}>();

const emit = defineEmits(['uploaded', 'clear']);

const fileInput = ref<HTMLInputElement>();
const dragging = ref<boolean>(false);
const loading = ref<boolean>(false);

function openUpload() {
  fileInput.value.click();
}

async function drop(event) {
  if (dragging.value) {
    const files = event.target.files || event.dataTransfer.files;

    await uploadSingleFile(files[0]);
  }
}

async function upload(e) {
  loading.value = true;

  await uploadSingleFile(e.target.files[0]);

  loading.value = false;
}

async function uploadSingleFile(file: File) {
  if (file === null) {
    alert('沒有上傳檔案');

    return;
  }

  loading.value = true;

  let formData = new FormData();
  formData.append('file', file, file.name);
  formData.append(u.data('csrf-token'), '1');

  const res = await u.$http.post(
    u.route('video_file_upload'),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  emit('uploaded', res.data.data.url, file.name);

  loading.value = false;
}
</script>

<style scoped lang="scss">
.c-file-uploader {

  &__card-body {
    height: 200px;
    position: relative;
  }

  &__inner {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
