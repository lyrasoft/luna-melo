import { createApp } from 'vue';
import SegmentEditorApp from '~melo/app/admin/SegmentEditorApp.vue';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

export function createSegmentEditorApp(props: Record<string, any> = {}) {
  const app = createApp(
    SegmentEditorApp,
    props
  );

  app.use(createBootstrap());

  return app;
}
