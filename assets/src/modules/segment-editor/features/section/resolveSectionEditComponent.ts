import { App, defineAsyncComponent } from 'vue';
import { useSectionEditComponents } from '~melo/modules/segment-editor/features/section/useSectionEditComponents';
import { SectionDefine } from '~melo/types';

export function resolveSectionEditComponent(define: SectionDefine) {
  if (define.vueComponentUrl) {
    return defineAsyncComponent(() => import(/* @vite-ignore */ define.vueComponentUrl!));
  }

  if (define.vueComponentName) {
    return define.vueComponentName;
  }

  const components = useSectionEditComponents();

  return defineAsyncComponent(components[define.id]);
}

