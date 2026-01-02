export interface Question {
  id: number;
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
