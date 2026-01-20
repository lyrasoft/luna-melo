
type ModuleImportCallback = () => Promise<any>;

const sectionEditComponents: Record<string, ModuleImportCallback> = {
  video: () => import('~melo/modules/segment-editor/components/segment-edit/section/SectionVideoEdit.vue'),
  homework: () => import('~melo/modules/segment-editor/components/segment-edit/section/SectionHomeworkEdit.vue'),
  quiz: () => import('~melo/modules/segment-editor/components/segment-edit/section/SectionQuizEdit.vue'),
}

export function useSectionEditComponents(): Record<string, ModuleImportCallback>;
export function useSectionEditComponents(id: string, component: ModuleImportCallback): Record<string, ModuleImportCallback>;
export function useSectionEditComponents(id: Record<string, ModuleImportCallback>): Record<string, ModuleImportCallback>;
export function useSectionEditComponents(id?: string | Record<string, ModuleImportCallback>, component?: ModuleImportCallback) {
  if (typeof id === 'object') {
    Object.assign(sectionEditComponents, id);
  } else if (component && typeof id === 'string') {
    sectionEditComponents[id] = component;
  }

  return sectionEditComponents;
}

