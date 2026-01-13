<script setup lang="ts">
import { route, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';
import { onErrorCaptured, onMounted, reactive } from 'vue';
import FormGroup from '~melo/components/form/FormGroup.vue';
import { CartItem } from '~melo/types';
import { numberFormat } from '@lyrasoft/ts-toolkit/generic';
import TwCitySelector from 'tw-city-selector';

onErrorCaptured((e) => {
  useHttpClient().then(({ isAxiosError }) => {
    if (isAxiosError(e)) {
      simpleAlert(e.response?.statusText ?? '錯誤發生', e.response?.data.message || e.message, '', 'error');
    } else {
      simpleAlert(e.message, '', 'error');
    }
  });
});


const cartStore = reactive<{
  items: CartItem[];
  totals: {
    grand_total: object,
    product_total: object,
  };
  count: number;
}>({
  items: [],
  totals: {
    grand_total: {},
    product_total: {},
  },
  count: 0,
});

getData();

const checkoutLink = route('checkoutLink');
const lessonLink = route('search');

async function getData() {
  const { get } = await useHttpClient();
  
  await get('@cart_ajax/getData')
    .then((res) => {
      let data = res.data.data;

      cartStore.items = data.items;
      cartStore.count = cartStore.items.length;
      cartStore.totals = data.totals;
    }).catch((e) => {
      swal(e.statusText || '', e.message || '', 'warning');
    });
}

async function deleteItem(e: number) {
  const { delete: del } = await useHttpClient();
  
  let hash = cartStore.items[e].hash;
  cartStore.items.splice(e, 1);

  await del(
    '@cart_ajax/deleteItem',
    { hash: hash }
  );

  getData();
}

function checkTerm(e: Event) {
  e.preventDefault();

  const target = e.currentTarget as HTMLAnchorElement;

  location.href = target.href;
}

function formatPrice(price: string) {
  const prefix = 'NT $';
  const scale = 0;

  return prefix + numberFormat(price, scale);
}

// City Selector
const formSelector = '#checkout-form';

onMounted(() => {
  new TwCitySelector({
    el: formSelector,
    elCounty: '[data-city]',
    elDistrict: '[data-dist]',
    elZipcode: '[data-zip]',
    countyFieldName: 'item[address][city]',
    districtFieldName: 'item[address][dist]',
    zipcodeFieldName: 'item[address][zip]',
  });
});
</script>

<template>
  <form id="checkout-form" method="POST" enctype="multipart/form-data">
    <div class="row">
      <div class="col-md-8 d-flex flex-column gap-5">
        <div class="card">
          <div class="card-body">
            <h4 class="text-secondary mb-0">
              購物車
            </h4>
            <div v-if="!cartStore?.count" class="position-relative c-cart-card__invalid">
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

          <div v-if="cartStore?.count" class="table-responsive bg-light">
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
              <tr v-for="(item, i) of cartStore?.items" :key="item.uid" :i="i">
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
                  {{ formatPrice(item?.prices?.final?.price) }}
                </td>
                <td class="text-center text-nowrap border-0 align-middle">
                  <a href="javascript://" @click.prevent="deleteItem(i)">
                    <i class="fas fa-trash fa-fw"></i>
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-body border-bottom">
            <h4 class="text-secondary m-0">
              電子發票開立資訊
            </h4>
          </div>

          <div class="card-body">
            <div class="mb-3">
              以下資訊只用於開立發票，並不會在其他頁面顯示。發票一經開立後不可更改，請確認資訊是否都填寫正確喔！
            </div>

            <div class="row gy-4">
              <div class="col-lg-6">
                <FormGroup label="統一編號">
                  <input type="text" class="form-control" name="item[invoice_vat]" placeholder="請填寫統一編號" />
                </FormGroup>
              </div>

              <div class="col-lg-6">
                <FormGroup label="發票抬頭">
                  <input type="text" class="form-control" name="item[invoice_title]" placeholder="請填寫發票抬頭" />
                </FormGroup>
              </div>

              <div class="col-lg-6">
                <FormGroup label="收件人">
                  <input type="text" class="form-control" name="item[invoice_name]" placeholder="請填寫真實姓名" />
                </FormGroup>
              </div>

              <div class="col-lg-6">
                <FormGroup label="電子發票載具">
                  <input type="text" class="form-control" name="item[invoice_carrier]" placeholder="請填寫電子發票載具" />
                </FormGroup>
              </div>

              <div class="col-lg-12">
                <FormGroup label="地址">
                  <div class="row gy-3">
                    <div class="col-lg-4">
                      <FormGroup label="">
                        <select class="form-select" data-city>

                        </select>
                      </FormGroup>
                    </div>
                    <div class="col-lg-4">
                      <FormGroup label="">
                        <select class="form-select" data-dist>

                        </select>
                      </FormGroup>
                    </div>
                    <div class="col-lg-4">
                      <FormGroup label="">
                        <input type="text" class="form-control" placeholder="郵遞區號" readonly data-zip />
                      </FormGroup>
                    </div>
                    <div class="col-lg-12">
                      <FormGroup>
                        <input type="text" class="form-control" name="item[address][address]" placeholder="請填寫地址" />
                      </FormGroup>
                    </div>
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>
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
                <select class="form-select">

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
            <div v-if="cartStore?.count" class="d-flex justify-content-between mb-2">
              <div class="text-base">
                總計
              </div>
              <h5 class="text-base m-0">
                {{ cartStore?.count }} 堂課
              </h5>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-base">
                小計
              </div>
              <h5 class="text-base m-0">
                {{ formatPrice(cartStore?.totals?.lesson_total?.price) }}
              </h5>
            </div>
            <div class="text-end mb-3">
              <h3 class="text-primary">
                {{ formatPrice(cartStore?.totals?.grand_total?.price) }}
              </h3>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn disable-on-submit"
                :class="cartStore?.count ? 'btn-primary' : 'btn-outline-base disabled'"
              >
                確定結賬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>
