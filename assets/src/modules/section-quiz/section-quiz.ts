import { createApp } from 'vue';
import SectionQuizApp from '~melo/modules/section-quiz/SectionQuizApp.vue';

export async function createSectionQuizApp(props: Record<string, any> = {}) {
  const app = createApp(SectionQuizApp, props);

  return app;
}

