import { App } from 'vue';

export declare function createSegmentEditorApp(props: Record<string, any>): Promise<App<Element>>;

declare type ModuleImportCallback = () => Promise<any>;

export declare function useLessonCartButtons(): {
    buy: (el: HTMLElement) => Promise<void>;
    toCartPage: () => void;
    sendAddAction: (el: HTMLElement) => Promise<any>;
};

export declare function useSectionEditComponents(): Record<string, ModuleImportCallback>;

export declare function useSectionEditComponents(id: string, component: ModuleImportCallback): Record<string, ModuleImportCallback>;

export declare function useSectionEditComponents(id: Record<string, ModuleImportCallback>): Record<string, ModuleImportCallback>;

export { }
