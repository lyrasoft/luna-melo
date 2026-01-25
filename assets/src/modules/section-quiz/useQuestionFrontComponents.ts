
type ModuleImportCallback = () => Promise<any>;

const questionFrontComponents: Record<string, ModuleImportCallback> = {
  boolean: () => import('~melo/modules/section-quiz/BasicQuestionProcessing.vue'),
  select: () => import('~melo/modules/section-quiz/BasicQuestionProcessing.vue'),
  multiple: () => import('~melo/modules/section-quiz/BasicQuestionProcessing.vue'),
}

export function useQuestionFrontComponents(): Record<string, ModuleImportCallback>;
export function useQuestionFrontComponents(id: string, component: ModuleImportCallback): Record<string, ModuleImportCallback>;
export function useQuestionFrontComponents(id: Record<string, ModuleImportCallback>): Record<string, ModuleImportCallback>;
export function useQuestionFrontComponents(id?: string | Record<string, ModuleImportCallback>, component?: ModuleImportCallback) {
  if (typeof id === 'object') {
    Object.assign(questionFrontComponents, id);
  } else if (component && typeof id === 'string') {
    questionFrontComponents[id] = component;
  }

  return questionFrontComponents;
}

