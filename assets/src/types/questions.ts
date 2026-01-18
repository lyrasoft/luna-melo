export interface QuestionDefine {
  id: string;
  title: string;
  icon: string;
  description: string;
  vueComponentUrl: string | null;
  vueComponentName: string;
}

export interface QnOption {
  id: string;
  text: string;
  value: string;
  isAnswer: boolean;
}

export type QnParams = Record<string, any>;

export interface BaseQnParams extends QnParams {
  //
}

export interface SelectQnParams extends BaseQnParams {
  options: QnOption[];
}
