<script setup lang="ts">
import { formatPrice } from '~melo/shared/currency';
import { CartItem } from '~melo/types';

defineProps<{
  items: CartItem[];
}>();

const emits = defineEmits<{
  'delete-item': [item: CartItem, index: number];
}>()

function deleteItem(item: CartItem, i: number) {
  emits('delete-item', item, i);
}
</script>

<template>
  <table class="l-cart-items table table-bordered">
    <thead class="bg-light">
    <tr class="b">
      <th width="5%" class="text-center text-nowrap border-0">
        編號
      </th>
      <th class=" text-nowrap border-0">
        課程名稱
      </th>
      <th class="text-center text-nowrap border-0">
        售價
      </th>
      <th width="5%" class="text-center text-nowrap border-0">
        刪除
      </th>
    </tr>
    </thead>
    <tbody class="bg-white">
    <tr v-for="(item, i) of items" :key="item.uid" :i="i">
      <td class="text-center align-middle text-nowrap border-0">
        {{ i + 1 }}
      </td>
      <td class="border-0">
        <div class="d-flex align-items-center">
          <img :src="item.image" alt="Image" class="me-2" width="100px">
          <span style="min-width: 150px">
              {{ item.title }}
          </span>
        </div>
      </td>
      <td class="text-nowrap text-center border-0 align-middle">
        {{ formatPrice(item?.prices?.final?.price || '') }}
      </td>
      <td class="text-center text-nowrap border-0 align-middle">
        <a href="javascript://" @click.prevent="deleteItem(item, i)">
          <i class="fas fa-trash fa-fw"></i>
        </a>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>
