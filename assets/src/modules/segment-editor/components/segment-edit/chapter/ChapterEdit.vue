<script setup lang="ts">

import { BFormGroup, BFormInput } from 'bootstrap-vue-next';
import { Segment } from '~melo/types';

// const props = defineProps();

const item = defineModel<Segment>({
  required: true
});

</script>

<template>
<div class="d-flex flex-column gap-4">

  <BFormGroup
    id="fieldset-chapter"
    label="章節名稱編輯"
    label-for="input-chapter-title"
    label-class="mb-1"
  >
    <BFormInput id="input-chapter-title" v-model="item.title" trim />
  </BFormGroup>

</div>
</template>

<style scoped>

</style>
