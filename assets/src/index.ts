
export * from '~melo/lesson';

export async function createSegmentEditorApp(props: Record<string, any>) {
  const { createSegmentEditorApp } = await import('~melo/segment-editor');

  return createSegmentEditorApp(props);
}
