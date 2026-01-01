export interface UserLessonMap {
  id: number;
  userId: number;
  lessonId: number;
  status: string;
  created: string | null;
  [prop: string]: any;
}
