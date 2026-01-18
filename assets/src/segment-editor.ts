import { useAlertAdapter } from '@windwalker-io/unicorn-next';
import { createApp } from 'vue';
import SegmentEditorApp from '~melo/app/admin/SegmentEditorApp.vue';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import swal from 'sweetalert';

export function createSegmentEditorApp(props: Record<string, any> = {}) {
  const app = createApp(
    SegmentEditorApp,
    props
  );

  app.use(createBootstrap());

  useAlertAdapter({
    alert: (title: string, text?: string, icon?: string, extra?: any)=> swal({
      title,
      text,
      icon,
      ...extra
    }),
    confirm: (title: string, text?: string, icon?: string, extra?: any)=> swal({
      title,
      text,
      icon,
      buttons: [
        '取消',
        '確定'
      ],
      ...extra
    }),
    deleteConfirm: (title: string, text?: string, icon?: string, extra?: any)=> swal({
      title,
      text,
      icon,
      buttons: {
        cancel: '取消',
        danger: '刪除',
      },
      ...extra
    }),
  })

  return app;
}
