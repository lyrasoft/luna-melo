import { createMeloCartApp } from '@lyrasoft/melo';
import { data } from '@windwalker-io/unicorn-next';

const app = await createMeloCartApp(data('cart.props'));
app.mount('cart-app');

// u.$ui.bootstrap.tooltip();
//
// const form = '#checkout-form';
//
// u.$ui.keepAlive(location.href);
//
// u.$ui.tomSelect('.has-tom-select');
//
// u.import('@vendor/lyrasoft/melo/dist/tw-city-selector.min.js').then(() => {
//   // @ts-ignore
//   new TwCitySelector({
//     el: '#input-checkout-address_row',
//     elCounty: '#input-checkout-city',
//     elDistrict: '#input-checkout-dist',
//     elZipcode: '#input-checkout-zip',
//     countyFieldName: 'checkout[city]',
//     districtFieldName: 'checkout[dist]',
//     zipcodeFieldName: 'checkout[zip]',
//   });
//
//   u.formValidation()
//     .then(() => u.$ui.disableOnSubmit(form));
//
//   u.form(form).initComponent();
// });


