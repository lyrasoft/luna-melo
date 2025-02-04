/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import fusion, { wait, webpackVueBundle } from '@windwalker-io/fusion';
import path from 'path';

export function vueSegment() {
  return webpackVueBundle(
    './vue/entries/admin/segment-edit.ts',
    './dist/admin/segment-edit/index.js',
    (config) => {
      config.resolve.alias = {
        '@': path.resolve(path.resolve(), './vue/')
      };

      // Exclude Vue
      config.externals = { vue: 'Vue' };

      // Use tsconfig.vue.json if exists, default is tsconfig.json
      config.module.rules[4].options.configFile = 'tsconfig.vue.json';
    }
  );
}
