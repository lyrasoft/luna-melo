import { App } from 'vue';

declare function buy(el: HTMLElement): Promise<void>;

export declare interface CartItem {
    uid: string;
    acquired: string;
    alias: string;
    categoryId: number;
    created: string;
    createdBy: number;
    description: number;
    endDate: string;
    hasCertificate: boolean;
    hash: string;
    id: number;
    image: string;
    isFree: boolean;
    isSpecial: boolean;
    isStepByStep: boolean;
    modified: string;
    modifiedBy: number;
    ordering: number;
    params: any;
    passAverageScore: number;
    passMinScore: number;
    price: number;
    prices: {
        final: PriceObject;
        origin: PriceObject;
    } & CartTotals;
    specialPrice: number;
    startDate: string;
    state: {
        name: string;
        value: number;
    };
    teacherId: number;
    title: string;
    totals: {
        final_total: PriceObject;
        total: PriceObject;
    } & CartTotals;
}

export declare type CartTotals = Record<string, PriceObject>;

export declare function createMeloCartApp(props: Record<string, any>): Promise<App<Element>>;

export declare function createSegmentEditorApp(props: Record<string, any>): Promise<App<Element>>;

export declare interface Lesson {
    id: number;
    categoryId: number;
    title: string;
    alias: string;
    teacherId: number;
    description: string;
    acquired: string;
    image: string;
    state: any;
    startDate: string | null;
    endDate: string | null;
    isStepByStep: boolean;
    hasCertificate: boolean;
    price: number;
    specialPrice: number;
    isSpecial: boolean;
    isFree: boolean;
    passAverageScore: number;
    passMinScore: number;
    ordering: number;
    created: string | null;
    modified: string | null;
    createdBy: number;
    modifiedBy: number;
    params: any;
    [prop: string]: any;
}

export declare interface MeloOption {
    id?: number;
    questionId: number;
    title: string;
    isAnswer: boolean;
    state: any;
    ordering: number;
    params: any;
    [prop: string]: any;
}

declare type ModuleImportCallback = () => Promise<any>;

declare type ModuleImportCallback_2 = () => Promise<any>;

declare function off(): void;

export declare interface PaymentGateway {
    id: string;
    typeTitle: string;
    title: string;
    description?: string;
}

export declare interface PriceObject {
    label: string;
    name: string;
    params: any;
    price: number;
}

export declare interface Question {
    id?: number;
    lessonId: number;
    segmentId: number;
    type: string;
    isMultiple: boolean;
    title: string;
    content: string;
    answer: string;
    image: string;
    score: number;
    state: any;
    ordering: number;
    created: string | null;
    modified: string | null;
    createdBy: number;
    modifiedBy: number;
    params: any;
    [prop: string]: any;
}

export declare interface QuestionDefine {
    id: string;
    title: string;
    icon: string;
    description: string;
    vueComponentUrl: string | null;
    vueComponentName: string;
}

export declare interface SectionDefine {
    id: string;
    title: string;
    icon: string;
    description: string;
    vueComponentUrl: string | null;
    vueComponentName: string;
}

export declare interface Segment {
    id?: number | null;
    lessonId: number;
    parentId: number;
    type: string;
    title: string;
    content: string;
    src: string;
    filename: string;
    ext: string;
    captionSrc: string;
    duration: number;
    canSkip: boolean;
    preview: boolean;
    state: any;
    ordering: number;
    created: string | null;
    createdBy: number;
    modified: string | null;
    modifiedBy: number;
    params: any;
    children?: Segment[];
    [prop: string]: any;
}

declare function sendAddAction(el: HTMLElement): Promise<any>;

declare function toCartPage(): void;

export declare function useLessonCartButtons(selector?: string): {
    off: typeof off;
    buy: typeof buy;
    toCartPage: typeof toCartPage;
    sendAddAction: typeof sendAddAction;
};

export declare function useMeloFrontLessons(): {
    $melo: {
        useLessonCartButtons: typeof useLessonCartButtons;
    };
};

export declare function useQuestionEditComponents(): Record<string, ModuleImportCallback_2>;

export declare function useQuestionEditComponents(id: string, component: ModuleImportCallback_2): Record<string, ModuleImportCallback_2>;

export declare function useQuestionEditComponents(id: Record<string, ModuleImportCallback_2>): Record<string, ModuleImportCallback_2>;

export declare interface UserLessonMap {
    id: number;
    userId: number;
    lessonId: number;
    status: string;
    created: string | null;
    [prop: string]: any;
}

export declare interface UserSegmentMap {
    id: number;
    userId: number;
    lessonId: number;
    segmentId: number;
    segmentType: string;
    status: string;
    description: string;
    score: number;
    assignment: string;
    assignmentUploadTime: string | null;
    frontShow: boolean;
    created: string | null;
    [prop: string]: any;
}

export declare function useSectionEditComponents(): Record<string, ModuleImportCallback>;

export declare function useSectionEditComponents(id: string, component: ModuleImportCallback): Record<string, ModuleImportCallback>;

export declare function useSectionEditComponents(id: Record<string, ModuleImportCallback>): Record<string, ModuleImportCallback>;

export { }
