import { inject, provide } from 'vue';
import { QuestionDefine } from '~melo/types';

export function useQuestionPresenter() {
  const defines = inject<Record<string, QuestionDefine>>('question.defines', {});

  function provideDefines(defines: Record<string, QuestionDefine>) {
    provide('question.defines', defines);
  }

  function getDefines() {
    return defines || {};
  }

  function typeToTitle(type: string) {
    return defines?.[type]?.title || type;
  }

  function typeToDescription(type: string) {
    return defines?.[type]?.description || '';
  }

  function typeToIcon(type: string) {
    return defines?.[type]?.icon || 'fas fa-question-circle';
  }

  function scoreLimit(score: number) {
    if (score > 100) {
      return 100;
    }

    if (score < 1) {
      return 1;
    }

    return score;
  }

  return {
    provideDefines,
    getDefines,
    typeToTitle,
    typeToDescription,
    typeToIcon,
    scoreLimit,
  };
}

