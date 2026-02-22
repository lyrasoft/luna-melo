import {
  useBs5Tooltip,
  useCheckboxesMultiSelect,
  useDisableOnSubmit,
  useGrid,
  useGridComponent,
} from '@windwalker-io/unicorn-next';

const formSelector = '#admin-form';

useBs5Tooltip();

useGridComponent(formSelector);

useDisableOnSubmit(formSelector);

useCheckboxesMultiSelect(formSelector);

document.querySelector('#lesson-assign-modal')!.addEventListener('show.bs.modal', (event) => {
  const grid = useGrid(formSelector)!;

  grid.validateChecked(event, () => {
    const targetText = document.querySelector<HTMLSpanElement>('.c-lesson-assign-target')!;

    targetText.textContent = grid.countChecked().toString();
  });
});
