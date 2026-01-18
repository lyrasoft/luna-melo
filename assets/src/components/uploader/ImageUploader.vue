<script setup lang="ts">
import { useFileDialog } from '@vueuse/core';
import { data, route, simpleAlert } from '@windwalker-io/unicorn-next';
import { BButton, BSpinner, vBTooltip } from 'bootstrap-vue-next';
import { ref } from 'vue';
import { useFileUploader } from '~melo/features/file/useFileUploader';

const props = withDefaults(
  defineProps<{
    uploadUrl?: string;
    dest?: string;
    accept?: string | string[];
  }>(),
  {
    accept: 'image/*',
  }
);

const emit = defineEmits<{
  uploaded: [url: string];
  clear: [];
}>();

const image = defineModel<string>({
  default: '',
});

const { wrapClassicUpload, acceptString, checkFileType } = useFileUploader({
  accept: () => props.accept
});
const uploadImage = wrapClassicUpload(props.uploadUrl || route('@image_upload'));

const defaultImage = ref<string>(data('defaultImage'));
const loading = ref<boolean>(false);

// file Select
const { open, reset, onChange, onCancel, files } = useFileDialog({
  accept: acceptString.value,
});
onChange(async () => {
  if (!files.value?.length) {
    return;
  }

  upload(files.value[0]);
  reset();
});
onCancel(reset);

async function upload(file: File) {
  loading.value = true;

  try {
    const url = await uploadImage(file, props.dest);

    image.value = url;

    emit('uploaded', url);
  } catch (e) {
    if (e instanceof Error) {
      simpleAlert(`上傳失敗`, e.message, 'warning');
    }

    throw e;
  } finally {
    loading.value = false;
  }
}

function clear() {
  image.value = '';
  reset();

  emit('clear');
}

function paste(e: PointerEvent) {
  console.log(e);
}

// Drag Drop
const dragging = ref(false);

function onDragStart() {
  dragging.value = true;
}

function onDragEnd() {
  dragging.value = false;
}

function onDrop(e: DragEvent) {
  dragging.value = false;

  const file = e.dataTransfer?.files?.[0];

  if (!file) {
    return;
  }

  upload(file);
}
</script>

<template>
  <div class="c-image-uploader-wrapper d-flex flex-column gap-2 mx-auto"
    style="max-width: 500px; width: 100%;"
    @dragover.prevent="onDragStart"
    @dragleave.prevent="onDragEnd"
    @drop.prevent="onDrop"
  >
    <div class="c-image-uploader card border overflow-hidden position-relative ">
      <div v-if="loading" class="position-absolute d-flex justify-content-center align-items-center"
        style="left: 0; top: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.7); z-index: 10;">
        <BSpinner />
      </div>

      <template v-if="image">
        <a :href="image" target="_blank">
          <div class="c-image-uploader__preview position-relative"
            :style="[ dragging ? 'opacity: .7' : '' ]"
            style="aspect-ratio: 16/9; background-color: black; transition: all .3s"
          >
            <img class="position-absolute rounded" :src="image || defaultImage" alt="Preview"
              style="aspect-ratio: 16/9; top: 0;left: 0; width: 100%; height: 100%; object-fit: contain;">
          </div>
        </a>
      </template>

      <div v-else
        class="c-image-uploader__placeholder d-flex flex-column gap-3 justify-content-center align-items-center"
        style="aspect-ratio: 16/9; background-color: white; transition: all .3s"
        :style="[ dragging ? 'background-color: var(--bs-light)' : '' ]"
      >
        <div>
          <i class="fas fa-upload fa-2x"></i>
        </div>
        <div class="text-muted">
          拖拉至此上傳圖片
        </div>
        <div>
          <button type="button" class="btn btn-primary btn-sm"
            @click="open()">
            <i class="fas fa-image"></i>
            點擊此處選擇檔案
          </button>
          <button type="button" class="btn btn-outline-primary btn-sm"
            v-b-tooltip="'從剪貼簿貼上圖片檔案'"
            @click="paste">
            <i class="fas fa-paste"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="image" class="c-image-uploader-actions d-flex align-items-center justify-content-between gap-2">
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-primary btn-sm"
          @click="open()">
          <i class="fas fa-image"></i>
          更換檔案
        </button>
        <!-- Add div to avoid tooltip container break layout -->
        <div>
          <button type="button" class="btn btn-outline-primary btn-sm"
            v-b-tooltip="'從剪貼簿貼上圖片檔案'"
            @click="paste">
            <i class="fas fa-paste"></i>
          </button>
        </div>
        <span class="small text-muted">或拖拉檔案至上方</span>
      </div>

      <button type="button" class="btn btn-outline-danger btn-sm" @click="clear">
        <i class="fal fa-trash"></i>
        移除圖片
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
