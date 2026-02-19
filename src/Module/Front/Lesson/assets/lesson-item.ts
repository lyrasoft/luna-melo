import { createLessonHomeworksApp, useLessonCartButtons } from '@lyrasoft/melo';
import { data, domready } from '@windwalker-io/unicorn-next';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

useLessonCartButtons();

dayjs.extend(utc);
dayjs.extend(tz);

const lessonId: number = data('lessonId');
const totalAssignment: number = data('totalAssignment');
const lessonSectionOrder: number[] = data('lessonSectionOrder');

await domready(async () => {
  createLessonHomeworksApp({
    lessonId,
    totalAssignment,
    lessonSectionOrder,
  }).then((app) => {
    app.mount('lesson-homeworks-app');
  });
});
