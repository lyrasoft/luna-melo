import {
  useBs5Tooltip,
  useDisableIfStackNotEmpty,
  useDisableOnSubmit,
  useFormComponent,
  useFormValidation,
  useKeepAlive,
  useTomSelect,
} from '@windwalker-io/unicorn-next';

const formSelector = '#admin-form';

useBs5Tooltip();

useFormComponent(formSelector);

useFormValidation().then(() => useDisableOnSubmit(formSelector));

useDisableIfStackNotEmpty();

useKeepAlive(location.href);

// Select
useTomSelect('.js-tom-select');

// Tags
useTomSelect('#input-item-tags', {
  create: (input: string) => {
    return {
      value: `new#${input}`,
      text: input,
    };
  },
});

useTomSelect('#input-item-sub_category_id', {
  create: (input: string) => {
    return {
      value: `new#${input}`,
      text: input,
    };
  },
});
