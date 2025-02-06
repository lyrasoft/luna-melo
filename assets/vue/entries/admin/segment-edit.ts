/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { createApp } from 'vue';
import SegmentEditApp from '@/app/admin/SegmentEditApp.vue';
import { createBootstrap } from 'bootstrap-vue-next';
import { BModal,
  BButton,
  BSpinner,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormTextarea,
  BFormCheckbox
} from 'bootstrap-vue-next';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import vuedraggable from 'vuedraggable';

await S.import('@main');
await u.domready();

const app = createApp(
  SegmentEditApp,
  u.data('segment.edit.props')
);

app.use(createBootstrap());
app.component('draggable', vuedraggable);
app.component('BModal', BModal);
app.component('BButton', BButton);
app.component('BSpinner', BSpinner);
app.component('BFormGroup', BFormGroup);
app.component('BFormInput', BFormInput);
app.component('BFormRadioGroup', BFormRadioGroup);
app.component('BFormTextarea', BFormTextarea);
app.component('BFormCheckbox', BFormCheckbox);
app.mount('#segment-edit-app');
