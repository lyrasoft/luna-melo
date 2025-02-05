import '@main';
import type { UserSegmentMap } from "@/src/types/entity";
import { DateTime } from "@vendor/ts-luxon/dist/ts-luxon.umd.js";
import type { Question } from "@/src/types/entity";
import type { Option } from "@/src/types/entity";

const lessonId: number = u.data('lessonId');
const totalAssignment: number = u.data('totalAssignment');
const lessonSectionOrder: number[] = u.data('lessonSectionOrder');

// prepare init assignments
const res = await u.$http.get(
  '@ajax_lesson/prepareStudentAssignments',
  {
    params: {
      lesson_id: lessonId,
      limit: 5,
      offset: 0,
    }
  }
);

let assignments: UserSegmentMap[] = res.data.data;

let nextOffset: number = assignments.length;

await u.domready(() => {
  const homeworkList = document.querySelector<HTMLDivElement>('.c-homework-list');

  appendStudentAssignmentList(assignments);

  // get more assignments
  const getMoreAssignments = document.querySelector<HTMLAnchorElement>('.j-get-student-assignments');

  toggleMoreButton();

  getMoreAssignments!.addEventListener('click', async () => {
    const res = await u.$http.get(
      '@ajax_lesson/prepareStudentAssignments',
      {
        params: {
          lesson_id: lessonId,
          limit: 5,
          offset: nextOffset,
        }
      }
    );

    assignments = res.data.data;

    nextOffset = nextOffset + assignments.length;

    appendStudentAssignmentList(res.data.data);

    toggleMoreButton();
  })

  function appendStudentAssignmentList(assignments: UserSegmentMap[]) {
    if (totalAssignment <= 0) {
      let homeworkItem = document.createElement('div');
      homeworkItem.className = 'c-homework-item justify-content-center';

      homeworkItem.innerHTML += `
        <div class="text-muted py-4">
            本課程無作業要上傳唷！
        </div>
      `;

      homeworkList!.appendChild(homeworkItem);

      return;
    }

    assignments.forEach((assignment: UserSegmentMap) => {
      let homeworkItem = document.createElement('div');
      homeworkItem.className = 'c-homework-item';

      const sectionName: string = getSectionName(lessonSectionOrder, assignment.segmentId);

      const date = DateTime.fromISO(assignment.assignmentUploadTime, { zone: 'UTC' })
        .setZone('Asia/Taipei')
        .toFormat('yyyy-MM-dd');

      // Append the avatar section
      homeworkItem.innerHTML += `
        <div class="c-homework-item__avatar">
            <img width="40" height="40" class="img-fluid rounded-circle"
                src="${assignment.user.avatar}" alt="${assignment.user.name}">
        </div>
      `;

      // Append the details section
      homeworkItem.innerHTML += `
        <div>
            <div class="pb-1 mb-3">
                ${assignment.user.name}｜<span class="c-homework-item__date">${date}</span>
            </div>
  
            <div class="pb-1 mb-3 text-muted">
                ${sectionName}
            </div>
  
            <div class="d-flex">
                <div class="me-3 pe-1">
                    <img width="100" src="./assets/images/lesson/homework.png" alt="作業縮圖">
                </div>
                <div class="text-muted">
                    ${assignment.description}
                </div>
            </div>
        </div>
      `;

      homeworkList!.appendChild(homeworkItem);
    });
  }

  function toggleMoreButton() {
    if (totalAssignment <= 0) {
      getMoreAssignments!.classList.add('d-none');
      return;
    }

    if (nextOffset + 1 >= totalAssignment) {
      getMoreAssignments!.classList.add('d-none');
    } else {
      getMoreAssignments!.classList.remove('d-none');
    }
  }

  // modal
  const homeworkModal = new bootstrap.Modal('#homework-modal', {});
  const quizModal = new bootstrap.Modal('#quiz-modal', {});

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

        const res = await u.$http.get(
          '@ajax_lesson/prepareQuestionList',
          {
            params: {
              segment_id: sectionId,
            }
          }
        );

        const questions: Question[] = res.data.data.questions;
        const optionsForQuestion: [Option[]] = res.data.data.optionsForQuestion;
        const questionList = document.querySelector<HTMLDivElement>('.c-question-list');

        questions.forEach((question: Question, index: number) => {
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

          let quizItemHtml = `
            <div class="card c-question-item__card">
                <div class="card-body c-question-item__card-body">
                    <div class="h6 mb-1">
                        第 ${index + 1} 題（${questionTypeName}）:<br>
                        ${question.title}
                    </div>
                    <div class="mb-3">
                        ${question.content}
                    </div>
                    <div>
          `;

          if (['select', 'multiple'].indexOf(question.type) !== -1) {
            optionsForQuestion[question.id]?.forEach((option: Option) => {
              quizItemHtml += `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="${question.isMultiple ? 'checkbox' : 'radio' }"
                        name="item[quiz][${question.id}][]" value="${option.id}">
                    <label class="form-check-label">
                        ${option.title}
                    </label>
                </div>
              `
            })
          } else if (question.type === 'boolean') {
            quizItemHtml += `
              <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" name="item[quiz][${question.id}]" value="1">
                  <label class="form-check-label">
                      是
                  </label>
              </div>
              <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" name="item[quiz][${question.id}]" value="0">
                  <label class="form-check-label">
                      否
                  </label>
              </div>
            `
          }

          quizItemHtml += `</div></div></div>`;

          quizItem.innerHTML += quizItemHtml;

          questionList!.appendChild(quizItem);
        });

        quizModal.show();
      }
    })
  })

  // homework submit
  const homeworkSubmitButton = document.querySelector<HTMLButtonElement>('.j-homework-submit');

  homeworkSubmitButton?.addEventListener('click', async (e) => {
    e.preventDefault();

    const formElement = document.getElementById('homework-form') as HTMLFormElement;

    let formData = new FormData(formElement);

    try {
      await u.$http.post(
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
  })

  // quiz submit
  const quizSubmitButton = document.querySelector<HTMLButtonElement>('.j-quiz-submit');

  quizSubmitButton?.addEventListener('click', async (e) => {
    e.preventDefault();

    const formElement = document.getElementById('quiz-form') as HTMLFormElement;

    let formData = new FormData(formElement);

    try {
      await u.$http.post(
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
  })
})

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
