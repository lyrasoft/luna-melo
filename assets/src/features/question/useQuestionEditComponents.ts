
type ModuleImportCallback = () => Promise<any>;

const questionEditComponents: Record<string, ModuleImportCallback> = {
  boolean: () => import('~melo/components/segment-edit/question/QuestionEdit.vue'),
  select: () => import('~melo/components/segment-edit/question/QuestionEdit.vue'),
  multiple: () => import('~melo/components/segment-edit/question/QuestionEdit.vue'),
}

export function useQuestionEditComponents(): Record<string, ModuleImportCallback>;
export function useQuestionEditComponents(id: string, component: ModuleImportCallback): Record<string, ModuleImportCallback>;
export function useQuestionEditComponents(id: Record<string, ModuleImportCallback>): Record<string, ModuleImportCallback>;
export function useQuestionEditComponents(id?: string | Record<string, ModuleImportCallback>, component?: ModuleImportCallback) {
  if (typeof id === 'object') {
    Object.assign(questionEditComponents, id);
  } else if (component && typeof id === 'string') {
    questionEditComponents[id] = component;
  }

  return questionEditComponents;
}

