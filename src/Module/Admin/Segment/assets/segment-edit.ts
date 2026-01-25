import { createSegmentEditorApp } from '@lyrasoft/melo';
import { data, useKeepAlive } from '@windwalker-io/unicorn-next';

const app = await createSegmentEditorApp(data('segment.edit.props'));
app.mount('#segment-edit-app');

useKeepAlive(location.href);
