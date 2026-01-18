import { ApiReturn, route, useHttpClient } from '@windwalker-io/unicorn-next';
import { Question } from '~melo/types';

export function useQuestionController() {
  async function getQuestions(quizId: number) {
    const { get } = await useHttpClient();

    const res = await get<ApiReturn<Question[]>>(
      route('@ajax_question/prepare'),
      {
        params: {
          segmentId: quizId
        }
      }
    );

    return res.data.data;
  }

  async function save(data: any, isNew: number = 0) {
    const { post } = await useHttpClient();

    const res = await post<ApiReturn<Question>>(
      route('@ajax_question/save'),
      {
        data: data,
        isNew: isNew
      }
    );

    return res.data.data;
  }

  async function reorder(orders: Record<number, number>) {
    const { post } = await useHttpClient();

    return await post(
      route('@ajax_question/reorder'),
      {
        orders: orders,
      }
    );
  }

  async function remove(id: number) {
    const { post } = await useHttpClient();

    await post(
      route('@ajax_question/delete'),
      {
        id
      }
    );
  }

  function createEmptyQuestion(lessonId: number, segmentId: number): Partial<Question> {
    return {
      lessonId,
      segmentId,
      type: 'select',
      is_multiple: '0',
      title: '',
      content: '',
      image: '',
      score: 0,
      state: 1,
      ordering: 0,
    };
  }

  return {
    getQuestions,
    save,
    reorder,
    remove,
    createEmptyQuestion,
  };
}

