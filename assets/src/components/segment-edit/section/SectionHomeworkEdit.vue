<script setup lang="ts">
import { BFormGroup, BFormInput } from 'bootstrap-vue-next';
import { ref, toRefs } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import { defaultOptions } from '~melo/shared/form/tinymce-option';
import { Segment } from '~melo/types';
import vTinymce from '~melo/shared/form/v-tinymce';

const item = defineModel<Segment>({
  required: true
});

</script>

<template>
  <div>
    <BFormGroup
      label="小節名稱編輯"
      label-for="input-section-title"
      label-class="mb-2"
      class="mb-5"
    >
      <BFormInput id="input-section-title" v-model="item.title" trim />
    </BFormGroup>

    <BFormGroup
      label="小節內容"
      label-for="input-section-content"
      label-class="mb-2"
    >
      <textarea
        id="input-section-content"
        v-tinymce
        v-model="item.content"
        style="visibility: hidden"
      ></textarea>
    </BFormGroup>
  </div>
</template>

<style scoped lang="scss">

</style>
