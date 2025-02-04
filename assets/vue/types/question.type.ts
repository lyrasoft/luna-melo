/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

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
  state: number;
  ordering: number;
  created: string;
  createdBy: number;
  modified: string|null;
  modifiedBy: number;
  params: any[];
}

export interface Option {
  id: string;
  questionId: number;
  title: string;
  isAnswer: boolean;
  state: number;
  ordering: number;
  params: any[];
}
