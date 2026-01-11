import { ApiReturn, route, useHttpClient } from '@windwalker-io/unicorn-next';
import { MeloOption } from '~melo/types';

export function useOptionController() {
  async function getOptions(questionId: number) {
    const { get } = await useHttpClient();

    const res = await get(
      route('@ajax_option/prepare'),
      {
        params: {
          questionId
        }
      }
    );

    return res.data.data
  }

  async function reorder(orders: Record<number, number> = {}) {
    const { post } = await useHttpClient();

    await post(
      route('@ajax_option/reorder'),
      {
        orders,
      }
    );
  }

  function createEmptyOption(questionId: number): Partial<MeloOption> {
    return {
      questionId,
      title: '',
      isAnswer: false,
      state: 1,
      ordering: 0,
    };
  }

  async function save(
    data: Partial<MeloOption>,
    isNew: number = 0
  ) {
    const { post } = await useHttpClient();

    const res = await post<ApiReturn<MeloOption>>(
      route('@ajax_option/save'),
      {
        data,
        isNew,
      }
    );

    return res.data.data;
  }

  async function saveMultiple(
    options: Partial<MeloOption>,
  ) {
    const { post } = await useHttpClient();

    const res = await post<ApiReturn<MeloOption[]>>(
      route('@ajax_option/saveMultiple'),
      {
        options,
      }
    );

    return res.data.data;
  }

  async function deleteOption(id: number) {
    const { post } = await useHttpClient();

    await post(
      route('delete_option'),
      {
        id: id
      }
    );
  }

  return {
    getOptions,
    reorder,
    createEmptyOption,
    save,
    saveMultiple,
    deleteOption,
  };
}

