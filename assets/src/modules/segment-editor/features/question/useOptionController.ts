import { uid } from '@windwalker-io/unicorn-next';
import { QnOption } from '~melo/types';

export function useOptionController() {
  function createEmptyOption(): QnOption {
    return {
      id: uid(),
      text: '',
      value: '',
      isAnswer: false,
    };
  }

  return {
    createEmptyOption,
  };
}

