<script setup lang="ts">
import { useCurrentElement } from '@vueuse/core';
import { uid } from '@windwalker-io/unicorn-next';
import { computed, onMounted, ref } from 'vue';

type MaybeInputElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const props = defineProps<{
  id?: string;
  label?: string;
  description?: string;
  feedback?: string;
  invalid?: boolean;
}>();

const el = useCurrentElement<HTMLDivElement>();
const id = computed(() => props.id || 'input-' + uid());
const input = ref<MaybeInputElement>();

onMounted(() => {
  if (el.value) {
    updateInput();
  }
});

function updateInput() {
  const inputEl = el.value.querySelector<MaybeInputElement>('input, textarea, select');

  if (inputEl) {
    input.value = inputEl;
    inputEl.id = id.value;

    updateInvalid();
  }
}

function updateInvalid() {
  if (props.invalid) {
    input.value?.classList.add('is-invalid');
  } else {
    input.value?.classList.remove('is-invalid');
  }
}
</script>

<template>
<div class="form-group d-flex flex-column gap-1">
  <slot name="label">
    <label v-if="label" :for="id">
      {{ label }}
    </label>
  </slot>

  <slot></slot>

  <div v-if="feedback" class="invalid-tooltip">
    {{ feedback }}
  </div>

  <div v-if="description" class="form-text text-muted">
    {{ description }}
  </div>
</div>
</template>

<style scoped>

</style>
