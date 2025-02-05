/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import type { User } from './user';

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
  assignmentUploadTime: string;
  frontShow: boolean;
  created: string;
  user: User;
}
