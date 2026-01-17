<script setup lang="ts">
import { data, route, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';
import { computed, onErrorCaptured, ref } from 'vue';
import CartItems from '~melo/components/cart/CartItems.vue';
import InvoiceForm from '~melo/components/cart/InvoiceForm.vue';
import { formatPrice } from '~melo/shared/currency';
import { CartItem, CartTotals, PaymentGateway, PriceObject } from '~melo/types';

const props = defineProps<{
  user: any,
  rememberedData: Record<string, any>;
  payments: Record<string, PaymentGateway>;
}>()

onErrorCaptured((e) => {
  useHttpClient().then(({ isAxiosError }) => {
    if (isAxiosError(e)) {
      simpleAlert(e.response?.statusText ?? '錯誤發生', e.response?.data.message || e.message, '', 'error');
    } else {
      simpleAlert(e.message, '', 'error');
    }
  });
});

const items = ref<CartItem[]>([]);
const invoice = ref({
  vat: props.rememberedData.invoice_vat || '',
  title: props.rememberedData.invoice_title || '',
  name: props.rememberedData.invoice_name || '',
  carrier: props.rememberedData.invoice_carrier || '',
  address: {
    city: props.rememberedData.address?.city || '',
    dist: props.rememberedData.address?.dist || '',
    zip: props.rememberedData.address?.zip || '',
    address: props.rememberedData.address?.address || '',
  },
});
const payment = ref<string>(props.rememberedData.payment || '');

const totals = ref<{
  grand_total: PriceObject,
  product_total: PriceObject,
} & CartTotals>();
const count = computed(() => items.value.length);
const csrf = data('csrf-token');

loadItems();

const checkoutLink = route('checkoutLink');
const lessonLink = route('search');

async function loadItems() {
  const { get } = await useHttpClient();

  await get('@cart_ajax/getData')
    .then((res) => {
      let data = res.data.data;

      items.value = data.items;
      totals.value = data.totals;
    }).catch((e) => {
      swal(e.statusText || '', e.message || '', 'warning');
    });
}

async function deleteItem(item: CartItem, i: number) {
  const { delete: del } = await useHttpClient();

  let hash = items.value[i].hash;
  items.value.splice(i, 1);

  await del(
    '@cart_ajax/deleteItem',
    { hash: hash }
  );

  loadItems();
}

// function checkTerm(e: Event) {
//   e.preventDefault();
//
//   const target = e.currentTarget as HTMLAnchorElement;
//
//   location.href = target.href;
// }

// City Selector
const formSelector = '#checkout-form';

// Submit
function submit(e: PointerEvent) {
  if (!count.value) {
    return;
  }

  const btn = e.currentTarget as HTMLButtonElement;
  const form = btn.form!;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!payment.value) {
    simpleAlert('請選擇付款方式', '', '', 'warning');
    return;
  }

  btn.disabled = true;
  form.requestSubmit();
}
</script>

<template>
  <form id="checkout-form" :action="checkoutLink" method="POST" enctype="multipart/form-data">
    <div class="row">
      <div class="col-md-8 d-flex flex-column gap-5">
        <div class="card">
          <div class="card-body">
            <h4 class="text-secondary mb-0">
              購物車
            </h4>
            <div v-if="!count" class="position-relative c-cart-card__invalid">
              <div class="c-cart-card__invalid-text text-center">
                <div class="mb-4">
                  您的購物車是空的，來去逛逛！
                </div>

                <a :href="lessonLink" class="btn btn-lg btn-primary h-btn px-4">
                  探索課程
                </a>
              </div>
            </div>
          </div>

          <div v-if="count" class="table-responsive bg-light">
            <CartItems :items @delete-item="deleteItem" />
          </div>
        </div>

        <div class="card">
          <div class="card-body border-bottom">
            <h4 class="text-secondary m-0">
              電子發票開立資訊
            </h4>
          </div>
          <InvoiceForm class="card-body" v-model="invoice" :formSelector />
        </div>

        <div class="card">
          <div class="card-body border-bottom">
            <h4 class="text-secondary m-0">
              付款方式
            </h4>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-7">
                <select class="form-select" v-model="payment" name="checkout[payment]" required>
                  <option value="">- 請選擇付款方式 -</option>
                  <option v-for="(payment, key) in payments" :key="key" :value="key">
                    {{ payment.title }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card std-card c-cart-card position-sticky" style="top: var(--melo-cart-sticky-top, 75px);">
          <div class="card-body border-bottom">
            <h4 class="text-secondary m-0">
              訂單明細
            </h4>
          </div>
          <div class="card-body">
            <div v-if="count" class="d-flex justify-content-between mb-2">
              <div class="text-base">
                總計
              </div>
              <h5 class="text-base m-0">
                {{ count }} 堂課
              </h5>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-base">
                小計
              </div>
              <h5 class="text-base m-0">
                {{ formatPrice(totals?.lesson_total?.price) }}
              </h5>
            </div>
            <div class="text-end mb-3">
              <h3 class="text-primary">
                {{ formatPrice(totals?.grand_total?.price) }}
              </h3>
            </div>
            <div class="d-grid gap-2">
              <button type="button" class="btn disable-on-submit"
                @click="submit"
                :class="count ? 'btn-primary' : 'btn-outline-base disabled'"
              >
                確定結賬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-none">
      <input name="anticsrf" type="hidden" :value="csrf" />
    </div>
  </form>
</template>

<style scoped>

</style>
