import { SegmentType } from '~melo/enum/SegmentType';

export interface Segment {
  id?: number | null;
  lessonId: number;
  parentId: number;
  type: SegmentType;
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
