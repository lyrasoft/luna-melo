
export * from '~melo/features/lesson/useLessonCartButtons';
export * from '~melo/features/section/useSectionEditComponents';

export async function createSegmentEditorApp(props: Record<string, any>) {
  const { createSegmentEditorApp } = await import('~melo/segment-editor');

  return createSegmentEditorApp(props);
}
