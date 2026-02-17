import { ApiReturn, data, useHttpClient, useS3MultipartUploader } from '@windwalker-io/unicorn-next';
import { computed, MaybeRefOrGetter, toRef } from 'vue';

export interface FileUploaderOptions {
  onProgress?: (progress: number) => void;
  accept?: MaybeRefOrGetter<string | string[] | undefined>;
}

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
}

let abortController: AbortController | null = null;

export function useFileUploader(uploaderOptions: FileUploaderOptions = {}) {
  const accept = toRef(uploaderOptions.accept);

  function wrapClassicUpload(
    uploadUrl: string,
    options?: FileUploadOptions
  ) {
    return async (file: File, dest?: string) => {
      return classicUpload(uploadUrl, file, dest, options);
    };
  }

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

    const onProgress = options?.onProgress ?? uploaderOptions.onProgress;
    abortController = new AbortController();

    const res = await post<ApiReturn<{ url: string }>>(uploadUrl, formData, {
      signal: abortController.signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percentage);
        }
      }
    });

    return res.data.data.url;
  }

  async function s3MultiPartUpload(file: File, dest: string, options?: FileUploadOptions) {
    const onProgress = options?.onProgress ?? uploaderOptions.onProgress;

    const profile = data('video.upload.profile');
    const s3 = await useS3MultipartUploader({
      profile,
      routes: (action) => {
        return `@ajax_segment/${action}`;
      },
      onProgress: (e) => {
        onProgress?.(e.percentage);
      }
    });

    abortController = new AbortController();

    const promise = s3.upload(file, dest, { abortController });

    const { url } = await promise;

    // Fix Unicorn bug
    return url.replace(/%2F/g, '/');
  }

  const acceptString = computed(() => {
    if (Array.isArray(accept.value)) {
      return accept.value.join(',');
    }

    return accept.value;
  });

  const acceptList = computed(() => {
    if (Array.isArray(accept.value)) {
      return accept.value;
    }

    return accept.value?.split(',').map(item => item.trim()) || [];
  });

  function checkFileType(file: File) {
    if (acceptList.value.length === 0) {
      return true;
    }

    return acceptList.value.some((accept) => {
      if (accept.startsWith('.')) {
        return file.name.endsWith(accept);
      } else {
        const regex = new RegExp('^' + accept.replace('*', '.*') + '$');
        return regex.test(file.type);
      }
    });
  }

  function cancel() {
    abortController?.abort();
  }

  return {
    classicUpload,
    wrapClassicUpload,
    s3MultiPartUpload,
    acceptString,
    acceptList,
    checkFileType,
    cancel,
  };
}

