export interface UserSegmentMap {
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
