/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export enum QuestionType {
  boolean = '是非題',
  multiple = '多選題',
  select = '單選題',
}

/**
 *
 * @deprecated
 */
export function scoreLimit(score: number) {
  if (score > 100) {
    return 100;
  }

  if (score < 1) {
    return 1;
  }

  return score;
}
