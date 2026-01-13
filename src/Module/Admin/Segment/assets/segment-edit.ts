import { data } from '@windwalker-io/unicorn-next';
import { createSegmentEditorApp } from '@lyrasoft/melo';

const app = await createSegmentEditorApp(data('segment.edit.props'));
app.mount('#segment-edit-app');
