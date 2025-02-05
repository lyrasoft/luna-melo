/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  enabled: boolean;
  verified: boolean;
  activation: string;
  receiveMail: boolean;
  lastReset: string;
  lastLogin: string;
  registered: string;
  modified: string;
  params: any;
}
