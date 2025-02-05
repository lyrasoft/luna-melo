/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import { Option } from './option';

export interface Question {
  id: number;
  lessonId: number;
  segmentId: number;
  type: string;
  isMultiple: boolean;
  title: string;
  content: string;
  answer: any;
  image: string;
  score: number;
  state: number;
  ordering: number;
  created: string;
  modified: string;
  createdBy: number;
  modifiedBy: number;
  params: any;
}
