import { defineAsyncComponent } from 'vue';
import { useQuestionEditComponents } from '~melo/features/question/useQuestionEditComponents';
import { QuestionDefine } from '~melo/types';

export function resolveSectionEditComponent(define: QuestionDefine) {
  if (define.vueComponentUrl) {
    return defineAsyncComponent(() => import(/* @vite-ignore */ define.vueComponentUrl!));
  }

  if (define.vueComponentName) {
    return define.vueComponentName;
  }

  const components = useQuestionEditComponents();

  return defineAsyncComponent(components[define.id]);
}

