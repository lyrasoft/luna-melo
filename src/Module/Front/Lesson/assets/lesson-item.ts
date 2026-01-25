import {
  createLessonHomeworksApp,
  MeloOption,
  QnOption,
  Question,
  useLessonCartButtons,
  UserSegmentMap
} from '@lyrasoft/melo';
import { data, domready, uid, useHttpClient } from '@windwalker-io/unicorn-next';
import { Modal } from 'bootstrap';
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

  return;

  // modal
  const homeworkModal = Modal.getOrCreateInstance('#homework-modal');
  const quizModal = Modal.getOrCreateInstance('#quiz-modal');

  const modalBtn = document.querySelectorAll<HTMLButtonElement>('.j-section-modal');

  modalBtn.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', async (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;

      const type = target.dataset.type ?? null;
      const sectionId = target.dataset!.sectionId ?? '0';
      const title = target.dataset!.sectionTitle ?? null;
      const index = target.dataset!.sectionIndex ?? null;
      const content = target.dataset!.sectionContent ?? null;

      if (type === 'homework') {
        document.querySelector<HTMLDivElement>('.j-homework-title')!.textContent = title;
        document.querySelector<HTMLDivElement>('.j-homework-index')!.textContent = index;
        document.querySelector<HTMLDivElement>('.j-homework-content')!.textContent = content;
        document.querySelector<HTMLInputElement>('.j-homework-section-id')!.value = sectionId;

        homeworkModal.show();
      }

      if (type === 'quiz') {
        document.querySelector<HTMLDivElement>('.j-quiz-title')!.textContent = title;
        document.querySelector<HTMLInputElement>('.j-quiz-section-id')!.value = sectionId;

        const res = await get(
          '@ajax_lesson/prepareQuestionList',
          {
            params: {
              segment_id: sectionId,
            }
          }
        );

        const questions: Question[] = res.data.data.questions;
        const optionsForQuestion: [MeloOption[]] = res.data.data.optionsForQuestion;
        const questionList = document.querySelector<HTMLDivElement>('.c-question-list');

        for (const question of questions) {
          const index1: number = questions.indexOf(question);
          let quizItem = document.createElement('div');
          quizItem.className = 'c-quiz-item';

          let questionTypeName = '';

          if (question.type === 'select') {
            questionTypeName = '單選題';
          } else if (question.type === 'multiple') {
            questionTypeName = '多選題';
          } else if (question.type === 'boolean') {
            questionTypeName = '是非題';
          }

          const questionUid = uid();

          let quizItemHtml = `
            <div class="card c-question-item__card">
                <div class="card-body c-question-item__card-body">
                    <div class="h6 mb-1">
                        第 ${index1 + 1} 題（${questionTypeName}）:<br>
                        ${question.title}
                    </div>
                    <div class="mb-3">
                        ${question.content}
                    </div>
                    <div>
          `;

          if (['select', 'multiple'].indexOf(question.type) !== -1) {
            const options = question.params.options as QnOption[] ?? [];

            for (const option of options) {
              const optionUid = uid();

              quizItemHtml += `
                <div class="form-check mb-2">
                    <input id="input-option-${optionUid}-${option.id}" class="form-check-input" type="${question.type === 'multiple' ? 'checkbox' : 'radio'}"
                        name="item[quiz][${question.id}][]" value="${option.id}">
                    <label class="form-check-label" for="input-option-${optionUid}-${option.id}">
                        ${option.text}
                    </label>
                </div>
              `;
            }
          } else if (question.type === 'boolean') {
            quizItemHtml += `
              <div class="form-check mb-2">
                  <input id="inout-option-${questionUid}-yes" class="form-check-input" type="radio" name="item[quiz][${question.id}]" value="1">
                  <label class="form-check-label" for="inout-option-${questionUid}-yes">
                      是
                  </label>
              </div>
              <div class="form-check mb-2">
                  <input id="inout-option-${questionUid}-no" class="form-check-input" type="radio" name="item[quiz][${question.id}]" value="0">
                  <label class="form-check-label" for="inout-option-${questionUid}-no">
                      否
                  </label>
              </div>
            `;
          }

          quizItemHtml += `</div></div></div>`;

          quizItem.innerHTML += quizItemHtml;

          questionList!.appendChild(quizItem);
        }

        quizModal.show();
      }
    });
  });

  // homework submit
  const homeworkSubmitButton = document.querySelector<HTMLButtonElement>('.j-homework-submit');

  homeworkSubmitButton?.addEventListener('click', async (e) => {
    e.preventDefault();

    const formElement = document.getElementById('homework-form') as HTMLFormElement;

    let formData = new FormData(formElement);

    try {
      await post(
        '@ajax_lesson/updateHomework',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const v = await swal({
        title: '作業繳交成功',
      });

      if (v) {
        location.reload();
      }
    } catch (e) {
      console.error(e);

      await swal({
        title: '作業繳交失敗',
        dangerMode: true,
      });
    }
  });

  // quiz submit
  const quizSubmitButton = document.querySelector<HTMLButtonElement>('.j-quiz-submit');

  quizSubmitButton?.addEventListener('click', async (e) => {
    e.preventDefault();

    const formElement = document.getElementById('quiz-form') as HTMLFormElement;

    let formData = new FormData(formElement);

    try {
      await post(
        '@ajax_lesson/submitQuiz',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const v = await swal({
        title: '測驗提交成功',
      });

      if (v) {
        location.reload();
      }
    } catch (e: any) {
      console.error(e);

      await swal({
        title: '測驗提交失敗',
        text: e.message,
        dangerMode: true,
      });
    }
  });
});

function getSectionName(array: any, value: number) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === value) {
        return `第 ${i + 1} 章 第 ${j + 1} 節`;
      }
    }
  }

  return '';
}
