<script setup lang="ts">
import { useLoading } from '@lyrasoft/ts-toolkit/vue';
import { deleteConfirm, route, simpleConfirm } from '@windwalker-io/unicorn-next';
import { BButton, BFormGroup, BFormInput, BTab, BTabs } from 'bootstrap-vue-next';
import type { VideoInfo } from 'js-video-url-parser/lib/urlParser';
import { round } from 'lodash-es';
import { computed, inject, ref } from 'vue';
import urlParser from 'js-video-url-parser';
import FileUploader from '~melo/modules/segment-editor/components/uploader/FileUploader.vue';
import { useSegmentController } from '~melo/modules/segment-editor/features/segment/useSegmentController';
import { Segment, SegmentEditorConfig } from '~melo/types';

type VideoDimension = {
  duration: number;
  size: number;
  bitrate: number;
};

const { deleteFile } = useSegmentController();
const { loading, run } = useLoading();

const props = defineProps<{
}>();

const emit = defineEmits();

const item = defineModel<Segment>({
  required: true
});
const videoName = computed<string>(() => isFile.value ? item.value.filename : item.value.src);
const isFile = computed<boolean>(() => item.value.src !== '' && videoInfo.value === null);
const isCloudVideo = computed<boolean>(() => item.value.src !== '' && videoInfo.value != null);
const cloudVideoUrl = ref<string>('');
const videoUploading = ref(false);
let videoDimension: Promise<VideoDimension> = Promise.resolve({
  duration: 0,
  size: 0,
  bitrate: 0
});
const config = inject<SegmentEditorConfig>('config');

const maxBitrate = computed(() => {
  return config?.maxBitrate || (2 * 1024 * 1024);
});
const maxBitrateMbps = computed(() => {
  return round(maxBitrate.value / (1024 * 1024), 2);
});

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

const previewSrc = computed<string>(() => {
  if (isCloudVideo.value) {
    return item.value.src;
  }

  if (!item.value.src) {
    return '';
  }

  return route('@lesson_file/previewFile', { url: item.value.src });
});

const previewCaptionSrc = computed<string>(() => {
  if (!item.value.captionSrc) {
    return '';
  }

  return route('@lesson_file/previewFile', { url: item.value.captionSrc });
});

async function clear(field: string) {
  const v = await deleteConfirm(
    '確定要刪除嗎？',
    '此動作無法重置'
  );

  if (v) {
    await run(async () => {
      if (!isCloudVideo.value) {
        await deleteFile(item.value[field], item.value.id!, field);
      }

      item.value[field] = '';

      if (field === 'src') {
        item.value.duration = 0;
      }
    });
  }
}

function applyCloudVideo() {
  item.value.src = cloudVideoUrl.value;
}

async function onVideoBeforeUpload(file: File) {
  videoDimension = calcVideoDimension(file);

  const { bitrate } = await videoDimension;

  if (bitrate > maxBitrate.value) {
    const v = await simpleConfirm(
      `您的影片超過建議的 Bitrate: ${maxBitrateMbps.value} Mbps`,
      `這隻影片的 Bitrate 為 ${round(bitrate / (1024 * 1024), 2)} Mbps，建議您壓縮影片以確保順暢的播放體驗。`,
      'warning',
      {
        buttons: [
          '放棄上傳',
          '繼續上傳'
        ]
      }
    );

    if (!v) {
      return false;
    }
  }
}

async function videoUploaded(src: string, file: File) {
  videoUploading.value = false;

  const { duration } = await videoDimension;
  item.value.duration = duration;
  item.value.src = src;
}

async function captionUploaded(src: string) {
  item.value.captionSrc = src;
}

// Duration
function calcVideoDimension(file: File): Promise<VideoDimension> {
  return new Promise((resolve) => {
    const video = document.createElement('video');

    const url = URL.createObjectURL(file);
    
    video.preload = 'metadata';
    video.src = url;

    video.addEventListener('loadedmetadata', () => {
      window.URL.revokeObjectURL(video.src);

      const duration = Math.floor(video.duration);
      const fileSize = file.size;

      const bitrate = (fileSize * 8) / duration;

      resolve({
        duration: duration,
        size: fileSize,
        bitrate
      });
    });
  });
}
</script>

<template>
  <div class="l-section-video-edit d-flex flex-column gap-4">
    <BFormGroup
      label="小節名稱編輯"
      label-for="input-section-title"
      label-class="mb-2"
      class="mb-5"
    >
      <BFormInput id="input-section-title" v-model="item.title" trim />
    </BFormGroup>

    <Transition name="fade" mode="out-in">
      <div v-if="item.src === ''" class="d-flex flex-column gap-4">
        <BTabs pills justified content-class="py-3">
          <BTab title="上傳影片"
            active
            :disabled="videoUploading">
            <BFormGroup label="上傳影片">
              <div class="text-muted mb-2">
                <small>
                  請上傳1280x720(720p)或1920x1080(1080p)尺寸，格式為.mp4的文件。
                  並且 Bitrate 在 {{ maxBitrateMbps }}Mbps 以下，以確保順暢的播放體驗。
                </small>
              </div>

              <FileUploader accept="video/mp4" s3-multipart @uploaded="videoUploaded"
                :dest="() => `segments/${item.id}/video.{ext}`"
                :on-before-upload="onVideoBeforeUpload"
                @start="videoUploading = true"
                @completed="videoUploading = false"
              />
            </BFormGroup>
          </BTab>

          <BTab
            title="雲端影片"
            :disabled="videoUploading"
          >
            <BFormGroup
              v-if="item.src === ''"
              label="影片連結"
              label-for="input-section-video"
              label-class="mb-2"
              description="支援以下平台: Youtube, Vimeo, Dailymotion"
              class="mb-5"
            >
              <div class="input-group">
                <BFormInput
                  id="input-section-video"
                  v-model="cloudVideoUrl"
                  placeholder="請輸入影片網址"
                  trim
                />
                <BButton variant="primary" class="text-nowrap c-video-submit px-3" @click="applyCloudVideo">
                  <i class="far fa-check"></i>
                  送出
                </BButton>
              </div>
            </BFormGroup>
          </BTab>
        </BTabs>
      </div>
      <div v-else class="d-flex flex-column gap-4">
        <BFormGroup label="影片">
          <div class="input-group">
            <div class="input-group-text">
              <span class="fal fa-fw fa-video me-2"></span>
            </div>

            <input type="text" class="form-control" disabled :value="videoName" />

            <BButton variant="danger" @click="clear('src')"
              :disabled="loading">
              <span class="fal fa-trash"></span>
              移除
            </BButton>
          </div>
        </BFormGroup>

        <BFormGroup v-if="item.src !== ''" class="" label="預覽">
          <div class="rwd-video" v-if="videoEmbedUrl">
            <iframe :src="videoEmbedUrl" frameborder="0" style="width: 100%;"></iframe>
          </div>
          <div v-else>
            <video v-if="previewSrc" controls class="w-100" style="aspect-ratio: 16 / 9; background-color: black"
              crossorigin="anonymous">
              <source :src="previewSrc" type="video/mp4">
              <track v-if="previewCaptionSrc" default kind="captions" :src="previewCaptionSrc"
                srclang="zh"
                label="中文"
              >
            </video>
          </div>
        </BFormGroup>

        <BFormGroup
          v-if="isCloudVideo"
          label="影片時數 (秒)"
          label-for="input-section-duration"
          label-class="mb-2"
          description="雲端影片需要手動輸入時數"
        >
          <BFormInput id="input-section-duration" v-model="item.duration" trim />
        </BFormGroup>
      </div>
    </Transition>

    <template v-if="item.captionSrc === ''">
      <BFormGroup label="上傳字幕">
        <div class="text-muted mb-2">
          <small>
            僅支援格式為 .vtt .srt 的文件
          </small>
        </div>

        <FileUploader accept=".vtt,.srt" @uploaded="captionUploaded"
          :upload-url="route('@file_upload')"
          :dest="() => `segments/${item.id}/caption.{ext}`"
        />
      </BFormGroup>
    </template>
    <template v-else>
      <BFormGroup label="字幕">
        <div class="input-group">
          <div class="input-group-text">
            <span class="fal fa-fw fa-closed-captioning me-2"></span>
          </div>

          <input type="text" class="form-control" disabled :value="item.captionSrc" />

          <BButton variant="danger" @click="clear('captionSrc')"
            :disabled="loading">
            <span class="fal fa-trash"></span>
            移除
          </BButton>
        </div>
      </BFormGroup>
    </template>

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
}
</style>
