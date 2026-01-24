import { createApp } from 'vue';
import LessonHoemworksApp from '~melo/modules/lesson-homeworks/LessonHoemworksApp.vue';

export async function createLessonHomeworksApp(props: Record<string, any>) {
  const app = createApp(LessonHoemworksApp, props);

  return app;
}

