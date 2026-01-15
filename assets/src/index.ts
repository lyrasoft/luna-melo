import { useMacro } from '@windwalker-io/unicorn-next';
import { useLessonCartButtons } from '~melo/features/lesson/useLessonCartButtons';

export * from '~melo/features/lesson/useLessonCartButtons';
export * from '~melo/features/section/useSectionEditComponents';
export * from '~melo/features/question/useQuestionEditComponents';
export * from '~melo/types';

export function useMeloFrontLessons() {
  return useMacro('$melo', {
    useLessonCartButtons,
  });
}

export async function createSegmentEditorApp(props: Record<string, any>) {
  const { createSegmentEditorApp } = await import('~melo/segment-editor');

  return createSegmentEditorApp(props);
}

export async function createMeloCartApp(props: Record<string, any>) {
  const { createMeloCartApp } = await import('~melo/melo-cart');

  return createMeloCartApp(props);
}
