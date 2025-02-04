/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class Utilities {
  static utf8SafeFilename(file) {
    return file.replace(/([^\w\s\-_~,;\[\]().])/g, '').replace(/(\.{2,})/g, '');
  }

  static prepareListItem(item: any, callback = null) {
    if (callback) {
      item = callback(item) || item;
    }

    item.uid = item.uid || u.tid();

    return item;
  }

  static prepareList(items: any[], callback = null) {
    return items.map((item) => this.prepareListItem(item, callback));
  }
}
