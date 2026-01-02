<script setup lang="ts">
import { BButton, BFormGroup, BFormInput } from 'bootstrap-vue-next';
import type { VideoInfo } from 'js-video-url-parser/lib/urlParser';
import { computed, ref } from 'vue';
import type { Segment } from '../../../types/segment.type';
import urlParser from 'js-video-url-parser';
import FileUploader from '../../uploader/FileUploader.vue';

const props = defineProps<{
  item: Segment;
}>();

const emit = defineEmits();

const item = defineModel<Segment>({
  required: true
});
const videoName = computed<string>(() => isFile.value ? item.value.filename : item.value.src);
const isFile = computed<boolean>(() => item.value.src !== '' && videoInfo.value === null);
const isCloudVideo = computed<boolean>(() => item.value.src !== '' && videoInfo.value !== null);
const itemSrcVal = ref<string>('');

const videoInfo = computed<VideoInfo|undefined>(() => {
  if (item.value.src !== '') {
    return urlParser.parse(item.value.src);
  }

  return undefined;
});

const videoEmbedUrl = computed<string|undefined>(() => {
  if (item.value.src !== '') {
    return urlParser.create(
      {
        videoInfo: videoInfo.value,
        format: 'embed'
      }
    );
  }

  return undefined;
});

async function clear(field: string) {
  const v = await swal({
    title: '確定要刪除嗎？此動作無法重置',
    buttons: [
      '取消',
      '確認'
    ],
  });

  if (v) {
    props.item[field] = '';

    emit('save', item.value);
  }
}

function setItemSrc() {
  item.value.src = itemSrcVal.value;

  emit('save', item.value);
}

async function uploadVideo(src: string) {
  item.value.src = src;

  emit('save', item.value);
}

async function uploadCaption(src: string) {
  item.value.captionSrc = src;

  emit('save', item.value);
}
</script>

<template>
  <div class="l-section-video-edit">
    <BFormGroup
      label="小節名稱編輯"
      label-for="input-section-title"
      label-class="mb-2"
      class="mb-5"
    >
      <BFormInput id="input-section-title" v-model="item.title" trim />
    </BFormGroup>

    <BFormGroup
      v-if="item.src === ''"
      label="影片連結"
      label-for="input-section-video"
      label-class="mb-2"
      description="支援以下平台: Youtube, Vimeo, Dailymotion"
      class="mb-5"
    >
      <div class="d-flex">
        <BFormInput
          id="input-section-video"
          v-model="itemSrcVal"
          placeholder="請輸入影片網址"
          trim
        />
        <BButton variant="primary" class="text-nowrap c-video-submit" @click="setItemSrc">
          送出
        </BButton>
      </div>
    </BFormGroup>

    <BFormGroup class="mb-3">
      <div v-if="item.src === ''">
        <label class="mb-2">
          上傳影片
        </label>

        <br />

        <div class="text-muted mb-2">
          <small>
            請上傳1280x720(720p)或1920x1080(1080p)尺寸，格式為.mp4的文件
          </small>
        </div>

        <file-uploader accept="video/mp4" @uploaded="uploadVideo"></file-uploader>
      </div>

      <div v-if="item.src" class="mb-3 d-flex justify-content-between align-items-center">
        <h6 class="m-0">
          <span class="fal fa-video me-2"></span>
          {{ videoName }}
        </h6>

        <div class="ml-auto">
          <b-button variant="danger" @click="clear('src')">
            <span class="fal fa-trash"></span>
          </b-button>
        </div>
      </div>
    </BFormGroup>

    <BFormGroup>
      <div v-if="item.captionSrc === ''">
        <label class="mb-2">
          上傳字幕
        </label>

        <br />

        <div class="text-muted mb-2">
          <small>
            僅支援格式為.vtt的文件
          </small>
        </div>

        <FileUploader accept=".vtt" @uploaded="uploadCaption"></FileUploader>
      </div>

      <div v-if="item.captionSrc" class="mb-3 d-flex">
        <h6 class="m-0">
          <span class="fal fa-closed-captioning"></span>
          {{ item.captionSrc }}
        </h6>

        <div class="ml-auto">
          <BButton variant="danger" @click="clear('captionSrc')">
            <span class="fal fa-trash"></span>
          </BButton>
        </div>
      </div>
    </BFormGroup>

    <BFormGroup
      v-if="isCloudVideo"
      label="影片時數 (秒)"
      label-for="input-section-duration"
      label-class="mb-2"
    >
      <BFormInput id="input-section-duration" v-model="item.duration" trim />
    </BFormGroup>

    <div v-if="item.src !== ''" class="mt-4">
      <div class="rwd-video" v-if="videoEmbedUrl">
        <iframe :src="videoEmbedUrl" frameborder="0" style="width: 100%;"></iframe>
      </div>
      <div v-else>
        <video controls class="w-100" :src="item.src"></video>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.l-section-video-edit {
  .rwd-video {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;

    > iframe,
    > embed,
    > object {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  #input-section-video {
    border-radius: 0.25rem 0 0 0.25rem;
  }

  .c-video-submit {
    border-radius: 0 0.25rem 0.25rem 0;
  }
}
</style>
