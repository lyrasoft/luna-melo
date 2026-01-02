import { App } from 'vue';

export declare function createSegmentEditorApp(props: Record<string, any>): Promise<App<Element>>;

export declare function useLessonPage(): {
    buy: (el: HTMLElement) => Promise<void>;
    toCartPage: () => void;
    sendAddAction: (el: HTMLElement) => Promise<any>;
};

export { }
