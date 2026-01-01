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
      <editor
        v-model="item.content"
        api-key="23aw7u2wc0a3ufumrfftdrrv3s8mox12kdnzr6juw1togrip"
        style="min-height: 216px"
        :init="editorOptions"
      ></editor>
    </BFormGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { Segment } from '../../../types/segment.type';
import Editor from '@tinymce/tinymce-vue';
import { defaultOptions } from '~melo/shared/form/tinymce-option';

const props = defineProps<{
  item: Segment;
}>();

const { item } = toRefs(props);
const editorOptions = ref(defaultOptions());
</script>

<style scoped lang="scss">

</style>
