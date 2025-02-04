/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

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
  state: number;
  ordering: number;
  created: string;
  createdBy: number;
  modified: string|null;
  modifiedBy: number;
  params: any[];
}
