<script setup lang="ts">
import { SectionDefine } from '~melo/types';

const props = defineProps<{
  sectionDefines: Record<string, SectionDefine>;
}>();

const emit = defineEmits<{
  selected: [type: string];
}>();

function select(type: string) {
  emit('selected', type);
}

</script>

<template>
  <div class="row row-cols-2 gy-3">
    <div v-for="(define, key) in sectionDefines" :key="define.id" class="col">
      <div class="c-section-button card border h-100">
        <div class="card-body d-flex flex-column gap-3">
          <div class="d-flex align-items-center gap-2">
            <i :class="define.icon" style="font-size: 2rem;"></i>
            <a href="#" class="link-dark text-decoration-none stretched-link"
              @click.prevent="select(key)">
              <h3 class="m-0">
                {{ define.title }}
              </h3>
            </a>
          </div>
          <div class="text-muted small">{{ define.description }}</div>
          <div class="mt-auto">
            <button type="button" class="btn btn-outline-primary btn-sm">
              按此選擇
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.c-section-button {
  transition: all .3s;

  &:hover {
    background-color: var(--bs-primary-bg-subtle);
  }
}
</style>
