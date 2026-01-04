import { ApiReturn, data, useHttpClient, useS3MultipartUploader } from '@windwalker-io/unicorn-next';

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
}

export function useFileUploader() {

  async function classicUpload(
    uploadUrl: string,
    file: File,
    dest?: string,
    options?: FileUploadOptions
  ) {
    const { post } = await useHttpClient();

    const formData = new FormData();
    formData.append('file', file);

    if (dest) {
      formData.append('path', dest);
    }

    const res = await post<ApiReturn<{ url: string }>>(uploadUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options?.onProgress?.(percentage);
        }
      }
    });

    return res.data.data.url;
  }

  async function s3MultiPartUpload(file: File, dest: string, options?: FileUploadOptions) {
    const profile = data('video.upload.profile');
    const s3 = await useS3MultipartUploader({
      profile,
      routes: (action) => {
        return `@ajax_segment/${action}`;
      },
      onProgress: (e) => {
        options?.onProgress?.(e.percentage);
      }
    });

    const { url } = await s3.upload(file, dest);

    // Fix Unicorn bug
    return url.replace(/%2F/g, '/');
  }

  return {
    classicUpload,
    s3MultiPartUpload,
  }
}

