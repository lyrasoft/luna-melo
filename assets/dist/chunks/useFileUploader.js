import { data, useS3MultipartUploader, useHttpClient } from "@windwalker-io/unicorn-next";
import { toRef, computed } from "vue";
function useFileUploader(uploaderOptions = {}) {
  const accept = toRef(uploaderOptions.accept);
  function wrapClassicUpload(uploadUrl, options) {
    return async (file, dest) => {
      return classicUpload(uploadUrl, file, dest, options);
    };
  }
  async function classicUpload(uploadUrl, file, dest, options) {
    const { post } = await useHttpClient();
    const formData = new FormData();
    formData.append("file", file);
    if (dest) {
      formData.append("path", dest);
    }
    const onProgress = options?.onProgress ?? uploaderOptions.onProgress;
    const res = await post(uploadUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          onProgress?.(percentage);
        }
      }
    });
    return res.data.data.url;
  }
  async function s3MultiPartUpload(file, dest, options) {
    const onProgress = options?.onProgress ?? uploaderOptions.onProgress;
    const profile = data("video.upload.profile");
    const s3 = await useS3MultipartUploader({
      profile,
      routes: (action) => {
        return `@ajax_segment/${action}`;
      },
      onProgress: (e) => {
        onProgress?.(e.percentage);
      }
    });
    const { url } = await s3.upload(file, dest);
    return url.replace(/%2F/g, "/");
  }
  const acceptString = computed(() => {
    if (Array.isArray(accept.value)) {
      return accept.value.join(",");
    }
    return accept.value;
  });
  const acceptList = computed(() => {
    if (Array.isArray(accept.value)) {
      return accept.value;
    }
    return accept.value?.split(",").map((item) => item.trim()) || [];
  });
  function checkFileType(file) {
    if (acceptList.value.length === 0) {
      return true;
    }
    return acceptList.value.some((accept2) => {
      if (accept2.startsWith(".")) {
        return file.name.endsWith(accept2);
      } else {
        const regex = new RegExp("^" + accept2.replace("*", ".*") + "$");
        return regex.test(file.type);
      }
    });
  }
  return {
    classicUpload,
    wrapClassicUpload,
    s3MultiPartUpload,
    acceptString,
    acceptList,
    checkFileType
  };
}
export {
  useFileUploader as u
};
//# sourceMappingURL=useFileUploader.js.map
