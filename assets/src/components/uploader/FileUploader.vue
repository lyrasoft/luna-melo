<script setup lang="ts">
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { useFileDialog } from '@vueuse/core';
import { simpleAlert } from '@windwalker-io/unicorn-next';
import { BButton, BProgress, BSpinner } from 'bootstrap-vue-next';
import { round } from 'lodash-es';
import { computed, ref } from 'vue';
import { useFileUploader } from '~melo/features/file/useFileUploader';

const props = defineProps<{
  s3Multipart?: boolean;
  uploadUrl?: string;
  dest?: (() => string) | string;
  accept: string|string[];
}>();

const emit = defineEmits<{
  uploaded: [url: string, file: File];
  clear: [];
  start: [file: File];
  completed: [];
  error: [error: unknown];
}>();

const { classicUpload, s3MultiPartUpload } = useFileUploader();

const acceptString = computed(() => {
  if (Array.isArray(props.accept)) {
    return props.accept.join(',');
  }

  return props.accept;
});

const acceptList = computed(() => {
  if (Array.isArray(props.accept)) {
    return props.accept;
  }

  return props.accept.split(',').map(item => item.trim());
});

// Handle Button
const { files, open, reset, onChange, onCancel } = useFileDialog({
  accept: acceptString,
});

onChange(() => {
  const file = files.value?.[0];

  if (file) {
    upload(file );
  }

  reset();
});

onCancel(reset);

function getDest() {
  if (typeof props.dest === 'function') {
    return props.dest();
  }

  return props.dest;
}

// Upload
const progress = ref(0);
const { loading: uploading, run, wrap } = useLoading();

async function upload(file: File) {
  // Check accept
  const fileTypeValid = checkFileType(file);

  if (!fileTypeValid) {
    console.warn('不支援的檔案類型');
    return;
  }

  const dest = getDest();

  try {
    return await run(async () => {
      emit('start', file);

      const url = await uploadWithAdapter(file, dest);

      emit('uploaded', url, file);

      return url;
    })
  } catch (e) {
    emit('error', e);

    if (e instanceof Error) {
      simpleAlert(e.message);
    } else {
      simpleAlert('上傳失敗');
    }
  } finally {
    progress.value = 0;

    emit('completed');
  }
}

async function uploadWithAdapter(file: File, dest?: string): Promise<string> {
  if (props.s3Multipart) {
    if (!dest) {
      throw new Error('S3 MultiPart Must have destination path.');
    }

    return s3MultiPartUpload(file, dest, {
      onProgress: (percentage: number) => {
        progress.value = percentage;
      }
    });
  }

  if (!props.uploadUrl) {
    throw new Error('Upload URL is required for classic upload.');
  }

  return classicUpload(props.uploadUrl, file, dest, {
    onProgress: (percentage: number) => {
      progress.value = percentage;
    }
  });
}

function checkFileType(file: File) {
  return acceptList.value.some((accept) => {
    if (accept.startsWith('.')) {
      return file.name.endsWith(accept);
    } else {
      const regex = new RegExp('^' + accept.replace('*', '.*') + '$');
      return regex.test(file.type);
    }
  });
}

// Drag
const dragging = ref<boolean>(false);

async function drop(event: DragEvent) {
  const files = (event.target as HTMLInputElement).files || event.dataTransfer?.files || [];

  if (!files[0]) {
    return;
  }

  await upload(files[0]);

  dragging.value = false;
}
</script>

<template>
  <div class="c-file-uploader pb-3"
    style="cursor: pointer;"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="drop"
    @click.prevent="open()"
  >
    <div class="c-file-uploader__card card border overflow-hidden position-relative"
      :class="{ 'bg-light': dragging }">
      <div class="c-file-uploader__card-body card-body">
        <div class="c-file-uploader__inner w-100">
          <!-- Upload Progress -->
          <div v-if="uploading" class="text-center d-flex flex-column gap-3 w-75 mx-auto">
            <div>
              <BSpinner />
              <div>上傳中 {{ round(progress, 2) }}%</div>
            </div>
            <BProgress style="width: 100%" :value="progress" :max="100" />
          </div>

          <!-- Upload Box -->
          <div v-else>
            <div class="text-center mb-3">
              <i class="far fa-upload fa-fw fa-2x"></i>
            </div>

            <div class="text-center mb-3">
              上傳: 拖拉檔案或按此瀏覽
            </div>

            <div class="text-center">
              <BButton variant="primary" size="sm" @click.stop="open()" style="min-width: 100px;">
                <i class="far fa-plus-circle"></i>
                瀏覽檔案
              </BButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="d-none">-->
    <!--  <input ref="fileInput" type="file" @change="upload" :accept="props.accept" />-->
    <!--</div>-->
  </div>
</template>

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
