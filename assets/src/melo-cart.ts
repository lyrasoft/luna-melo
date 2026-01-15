import { createApp } from 'vue';
// import { createBootstrap } from 'bootstrap-vue-next';
// import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import MeloCartApp from '~melo/app/front/MeloCartApp.vue';

export function createMeloCartApp(props: Record<string, any> = {}) {
  const app = createApp(
    MeloCartApp,
    props
  );

  app.component('CartItems')

  // app.use(createBootstrap());

  return app;
}
