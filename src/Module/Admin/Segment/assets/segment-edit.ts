import { data } from '@windwalker-io/unicorn-next';
import { createSegmentEditorApp } from '../../../../../assets/dist';

const app = await createSegmentEditorApp(data('segment.edit.props'));
app.mount('#segment-edit-app');
