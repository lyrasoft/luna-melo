import '@main';

await u.domready();

const { createApp, ref, toRefs, reactive, computed, watch, provide, nextTick, onMounted } = Vue;

const CartApp = {
  name: 'CartApp',
  props: {
    user: Object,
  },
  setup(props: any) {
    const cartStore = reactive({
      items: {},
      totals: {
        grand_total: {},
        product_total: {},
      },
      count: ref(0),
      coupon: ref('')
    });

    getData();

    const checkoutLink = u.route('checkoutLink');
    const lessonLink = u.route('search');

    async function getData() {
      await u.$http.get(
        u.route('@cart_ajax/getData')
      )
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
      let hash = cartStore.items[e].hash;
      cartStore.items.splice(e, 1);

      await u.$http.get(
        u.route('@cart_ajax/deleteItem', { hash: hash })
      )
        .then(() => {
          getData();
        }).catch((e) => {
          swal(e.statusText || '', e.message || '', 'warning');
        });
    }

    function checkTerm(e: Event) {
      e.preventDefault();

      const target = e.currentTarget as HTMLAnchorElement;

      location.href = target.href;
    }

    function formatPrice(price: string) {
      const prefix = 'NT $';
      const scale = 0;

      return prefix + u.numberFormat(price, scale);
    }

    return {
      deleteItem,
      checkTerm,
      formatPrice,

      checkoutLink,
      lessonLink,
      cartStore,
    };
  }
};

const app = createApp(CartApp, u.data('cart.props'));

app.mount('cart-app');

u.$ui.bootstrap.tooltip();

const form = '#checkout-form';

u.$ui.keepAlive(location.href);

u.$ui.tomSelect('.has-tom-select');

u.import('@vendor/lyrasoft/melo/dist/tw-city-selector.min.js').then(() => {
  // @ts-ignore
  new TwCitySelector({
    el: '#input-checkout-address_row',
    elCounty: '#input-checkout-city',
    elDistrict: '#input-checkout-dist',
    elZipcode: '#input-checkout-zip',
    countyFieldName: 'checkout[city]',
    districtFieldName: 'checkout[dist]',
    zipcodeFieldName: 'checkout[zip]',
  });

  u.formValidation()
    .then(() => u.$ui.disableOnSubmit(form));

  u.form(form).initComponent();
});
