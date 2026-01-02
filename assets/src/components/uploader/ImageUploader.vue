<template>
  <div class="c-image-uploader pb-3">
    <label>
      {{ props.label }}
    </label>

    <div class="c-image-uploader__card card overflow-hidden position-relative"
        style="padding: 56.25% 0 0 0;">

      <div v-if="loading" class="position-absolute" style="top: 50%;left: 50%; width: 100%; height: 100%;">
        <BSpinner />
      </div>

      <img v-else class="position-absolute" :src="image || defaultImage" alt="Preview"
          style="top: 0;left: 0; width: 100%; height: 100%; object-fit: cover;">
    </div>

    <div class="d-flex">
      <div class="me-2">
        <BButton variant="outline-primary" @click="openUpload">
          上傳檔案
        </BButton>
      </div>

      <div>
        <button type="button" class="btn btn-outline-danger" @click="clear">
          <i class="fal fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="d-none">
      <input ref="fileInput" type="file" @change="upload" accept="image/*" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  label: string;
  image: string;
}>();

const emit = defineEmits(['uploaded', 'clear']);

const image = ref<string>(props.image);
const defaultImage = ref<string>('');
const file = ref<null|File>(null);
const loading = ref<boolean>(false);
const fileInput = ref<HTMLInputElement>();

function openUpload() {
  fileInput.value.click();
}

onMounted(() => {
  defaultImage.value = u.data('defaultImage');
})

async function upload(e) {
  await uploadImg(e.target.files[0]);
}

async function uploadImg(file: File) {
  if (file === null) {
    alert('沒有上傳檔案');
    return;
  }

  loading.value = true;

  let formData = new FormData();
  formData.append('file', file, file.name);
  formData.append(u.data('csrf-token'), '1');

  const res = await u.$http.post(
    u.route('image_upload'),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
  );

  image.value = res.data.data.url;

  emit('uploaded', res.data.data.url);

  loading.value = false;
}

function clear() {
  image.value = '';

  emit('clear');
}
</script>

<style scoped lang="scss">

</style>
