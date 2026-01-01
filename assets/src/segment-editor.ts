import { data } from '@windwalker-io/unicorn-next';
import { createApp } from 'vue';
import SegmentEditApp from '~melo/app/admin/SegmentEditApp.vue';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

export function createSegmentEditorApp(props: Record<string, any>) {
  const app = createApp(
    SegmentEditApp,
    data('segment.edit.props')
  );

  app.use(createBootstrap());

  return app;
}
