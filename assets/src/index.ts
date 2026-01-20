import { useMacro } from '@windwalker-io/unicorn-next';
import { useLessonCartButtons } from '~melo/modules/segment-editor/features/lesson/useLessonCartButtons';

export * from '~melo/modules/segment-editor/features/lesson/useLessonCartButtons';
export * from '~melo/modules/segment-editor/features/section/useSectionEditComponents';
export * from '~melo/modules/segment-editor/features/question/useQuestionEditComponents';
export * from '~melo/types';

export function useMeloFrontLessons() {
  return useMacro('$melo', {
    useLessonCartButtons,
  });
}

export async function createSegmentEditorApp(props: Record<string, any>) {
  const { createSegmentEditorApp } = await import('~melo/modules/segment-editor/segment-editor');

  return createSegmentEditorApp(props);
}

export async function createMeloCartApp(props: Record<string, any>) {
  const { createMeloCartApp } = await import('~melo/modules/cart/melo-cart');

  return createMeloCartApp(props);
}
