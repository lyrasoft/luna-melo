import {
  useBs5Tooltip,
  useDisableIfStackNotEmpty,
  useDisableOnSubmit,
  useFormComponent,
  useFormValidation,
  useKeepAlive,
} from '@windwalker-io/unicorn-next';
import TwCitySelector from 'tw-city-selector';

const formSelector = '#admin-form';

useBs5Tooltip();

useFormComponent(formSelector);

useFormValidation().then(() => useDisableOnSubmit(formSelector));

useDisableIfStackNotEmpty();

useKeepAlive(location.href);

// City Selector
new TwCitySelector({
  el: formSelector,
  elCounty: '#input-item-invoice_data-address-city',
  elDistrict: '#input-item-invoice_data-address-dist',
  elZipcode: '#input-item-invoice_data-address-zip',
  countyFieldName: 'item[invoice_data][address][city]',
  districtFieldName: 'item[invoice_data][address][dist]',
  zipcodeFieldName: 'item[invoice_data][address][zip]',
});
