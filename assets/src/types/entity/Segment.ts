export interface Segment {
  id: number;
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
  [prop: string]: any;
}
