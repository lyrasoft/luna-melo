/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import Stack from '../../stack';
import { merge } from 'lodash-es';

export interface CustomOptions {
  customOption1?: string;
  customOption2?: boolean;
}

export function defaultOptions(override: (options: Record<string, any>) => void | CustomOptions = () => {}): Record<string, any> {
  const lang = u.data('locale.short') || 'zh_TW';

  const options: Record<string, any> = {
    document_base_url: u.uri('root'),
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'preview', 'anchor', 'pagebreak', 'searchreplace', 'wordcount',
      'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'nonbreaking', 'save', 'table', 'directionality',
      'emoticons',
    ],
    toolbar:
      'undo redo ' +
      'bold italic strikethrough forecolor backcolor blockquote removeformat | ' +
      'alignleft aligncenter alignright alignjustify bullist numlist outdent indent | ' +
      'blocks fontsize styles styleselect formatselect fontsizeselect | ' +
      'link image media table code | fullscreen',
    language: lang === 'en_GB' ? null : lang,
    language_url: u.uri('asset').root + 'vendor/tinymce-i18n/langs5/zh_TW.js',
    font_size_formats: "13px 14px 15px 16px 18px 20px 22px 28px 36px 48px",
    menubar: false,
    remove_script_host: true,
    relative_urls: true,
    convert_urls: true,
    forced_root_block : 'div',
    toolbar_mode: 'sliding',
    entity_encoding: 'raw',
    table_header_type: 'sectionCells',
    paste_data_images: true,
    images_upload_url: u.route('file_upload'),
    images_upload_handler: tinyMceImageUploader(),
    height: 450,
    content_css: u.uri('asset').root + 'css/front/editor.css',
  };

  if (typeof override === 'object') {
    const custom = override as CustomOptions;
    override = (options) => merge(options, custom);
  }

  override(options);

  return options;
}

export function tinyMceImageUploader() {
  return function (blobInfo, progress) {
    return new Promise((resolve, reject) => {
      u.data('no.save', true);
      Stack.get('uploading').push();

      const xhr = new XMLHttpRequest;
      xhr.withCredentials = false;
      xhr.open('POST', u.route('file_upload'));

      xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
      };

      xhr.onload = function() {
        Stack.get('uploading').pop();

        if (xhr.status !== 200) {
          reject('HTTP Error: ' + decodeURIComponent(xhr.statusText));
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json || typeof json.data.url !== 'string') {
          reject('Invalid JSON: ' + xhr.responseText);
          console.error('Invalid JSON: ' + xhr.responseText);
          u.data('no.save', false);
          return;
        }

        // Let's preload it first
        const img = new Image();
        img.src = json.data.url;

        resolve(json.data.url);

        u.data('no.save', false);
      };

      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      formData.append(u.data('csrf-token'), '1');

      xhr.send(formData);
    })
  }
}
