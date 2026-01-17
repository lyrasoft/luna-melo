<script setup lang="ts">
import { sleep } from '@windwalker-io/unicorn-next';
import TwCitySelector from 'tw-city-selector';
import { nextTick, onMounted, watch } from 'vue';
import FormGroup from '~melo/components/form/FormGroup.vue';

const props = withDefaults(
  defineProps<{
    formSelector?: string,
  }>(),
  {
    formSelector: '#checkout-form',
  }
);

const invoice = defineModel<{
  vat: string,
  title: string,
  name: string,
  carrier: string,
  address: {
    city: string,
    dist: string,
    zip: string,
    address: string,
  },
}>({
  required: true,
});

onMounted(() => {
  new TwCitySelector({
    el: props.formSelector,
    elCounty: '[data-city]',
    elDistrict: '[data-dist]',
    elZipcode: '[data-zip]',
    countyFieldName: 'checkout[address][city]',
    districtFieldName: 'checkout[address][dist]',
    zipcodeFieldName: 'checkout[address][zip]',
  });
});

watch(() => [invoice.value.address.city, invoice.value.address.dist], async () => {
  await sleep(100);

  invoice.value.address.zip = document.querySelector<HTMLSelectElement>(`${props.formSelector} [data-zip]`)?.value || '';
});

</script>

<template>
  <div>
    <div class="mb-3">
      以下資訊只用於開立發票，並不會在其他頁面顯示。發票一經開立後不可更改，請確認資訊是否都填寫正確喔！

    </div>

    <div class="row gy-4">
      <div class="col-lg-6">
        <FormGroup label="統一編號">
          <input type="text" class="form-control" v-model="invoice.vat"
            name="checkout[invoice_vat]" placeholder="請填寫統一編號" />
        </FormGroup>
      </div>

      <div class="col-lg-6">
        <FormGroup label="發票抬頭">
          <input type="text" class="form-control"  v-model="invoice.title"
            name="checkout[invoice_title]" placeholder="請填寫發票抬頭" />
        </FormGroup>
      </div>

      <div class="col-lg-6">
        <FormGroup label="收件人">
          <input type="text" class="form-control"  v-model="invoice.name"
            required
            name="checkout[invoice_name]" placeholder="請填寫真實姓名" />
        </FormGroup>
      </div>

      <div class="col-lg-6">
        <FormGroup label="電子發票載具">
          <input type="text" class="form-control"  v-model="invoice.carrier"
            name="checkout[invoice_carrier]" placeholder="請填寫電子發票載具" />
        </FormGroup>
      </div>

      <div class="col-lg-12">
        <FormGroup label="地址">
          <div class="row gy-3">
            <div class="col-lg-4">
              <FormGroup label="">
                <select class="form-select" data-city name="checkout[address][city]" v-model="invoice.address.city"
                  :data-value="invoice.address.city"
                  required>

                </select>
              </FormGroup>
            </div>
            <div class="col-lg-4">
              <FormGroup label="">
                <select class="form-select" data-dist name="checkout[address][dist]" v-model="invoice.address.dist"
                  :data-value="invoice.address.dist"
                  required>

                </select>
              </FormGroup>
            </div>
            <div class="col-lg-4">
              <FormGroup label="">
                <input type="text" class="form-control" placeholder="郵遞區號" readonly data-zip
                  v-model.lazy="invoice.address.zip"  name="checkout[address][zip]"
                />
              </FormGroup>
            </div>
            <div class="col-lg-12">
              <FormGroup>
                <input type="text" class="form-control"  v-model="invoice.address.address"
                  required
                  name="checkout[address][address]" placeholder="請填寫地址" />
              </FormGroup>
            </div>
          </div>
        </FormGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
