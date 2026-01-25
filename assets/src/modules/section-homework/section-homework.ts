import { createApp } from 'vue';
import SectionHomeworkApp from '~melo/modules/section-homework/SectionHomeworkApp.vue';

export async function createSectionHomeworkApp(props: Record<string, any> = {}) {
  const app = createApp(SectionHomeworkApp, props);

  return app;
}

