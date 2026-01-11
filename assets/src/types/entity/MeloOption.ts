export interface MeloOption {
  id?: number;
  questionId: number;
  title: string;
  isAnswer: boolean;
  state: any;
  ordering: number;
  params: any;
  [prop: string]: any;
}
