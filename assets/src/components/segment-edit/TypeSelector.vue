<template>
  <BModal
    :id="'section-type-modal-' + props.chapterId"
    title="選擇想要新增的小節類型"
    dialog-class="mb-6"
    hideFooter="true"
  >
    <div class="px-0 px-md-4">
      <div class="row my-4 pb-5">
        <div class="col-md-4 text-center">
          <i class="fal fa-video" style="font-size: 5rem;"></i>
        </div>
        <div class="col-md">
          <h6 class="bold">
            影片小節
          </h6>
          <p class="section-description text-color">
            以影片呈現你的課程
          </p>
          <div>
            <BButton variant="primary" size="sm" @click="select('video')">
              選擇
            </BButton>
          </div>
        </div>
      </div>

      <div class="row mb-4 pb-5">
        <div class="col-md-4 text-center">
          <i class="fal fa-home" style="font-size: 5rem;"></i>
        </div>
        <div class="col-md">
          <h6 class="bold">
            作業小節
          </h6>
          <p class="section-description text-color">
            以圖文編輯器做編輯，可插入文字、圖片、超連結。
          </p>
          <div>
            <BButton variant="primary" size="sm" @click="select('homework')">
              選擇
            </BButton>
          </div>
        </div>
      </div>

      <div class="row mb-4 pb-4">
        <div class="col-md-4 text-center">
          <i class="fa-fw fal fa-pen-square" style="font-size: 5rem;"></i>
        </div>
        <div class="col-md">
          <h6 class="bold">
            測驗小節
          </h6>
          <p class="section-description text-color">
            單選、複選、是非題出題方式
          </p>
          <div>
            <BButton variant="primary" size="sm" @click="select('quiz')">
              選擇
            </BButton>
          </div>
        </div>
      </div>
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { useModal } from 'bootstrap-vue-next';

const props = defineProps<{
  chapterId: number;
}>();

const emit = defineEmits(['create']);
const { show, hide } = useModal('section-type-modal-' + props.chapterId);

defineExpose({ show });

function select(type: string, options: Object = {}) {
  emit('create', type, options);

  hide();
}

</script>

<style scoped lang="scss">

</style>
