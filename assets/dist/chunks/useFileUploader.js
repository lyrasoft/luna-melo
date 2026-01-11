import { e as computedWithControl, f as createEventHook, i as isClient, h as hasOwn } from "./useSegmentController.js";
import { getCurrentInstance, onUpdated, onMounted, ref, computed, watchEffect, readonly, toValue, toRef } from "vue";
import { data, useS3MultipartUploader, useHttpClient } from "@windwalker-io/unicorn-next";
const defaultDocument = isClient ? window.document : void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useCurrentElement(rootComponent) {
  const vm = getCurrentInstance();
  const currentElement = computedWithControl(() => null, () => vm.proxy.$el);
  onUpdated(currentElement.trigger);
  onMounted(currentElement.trigger);
  return currentElement;
}
const DEFAULT_OPTIONS = {
  multiple: true,
  accept: "*",
  reset: false,
  directory: false
};
function prepareInitialFiles(files) {
  if (!files) return null;
  if (files instanceof FileList) return files;
  const dt = new DataTransfer();
  for (const file of files) dt.items.add(file);
  return dt.files;
}
function useFileDialog(options = {}) {
  const { document: document$1 = defaultDocument } = options;
  const files = ref(prepareInitialFiles(options.initialFiles));
  const { on: onChange, trigger: changeTrigger } = createEventHook();
  const { on: onCancel, trigger: cancelTrigger } = createEventHook();
  const inputRef = computed(() => {
    var _unrefElement;
    const input = (_unrefElement = unrefElement(options.input)) !== null && _unrefElement !== void 0 ? _unrefElement : document$1 ? document$1.createElement("input") : void 0;
    if (input) {
      input.type = "file";
      input.onchange = (event) => {
        files.value = event.target.files;
        changeTrigger(files.value);
      };
      input.oncancel = () => {
        cancelTrigger();
      };
    }
    return input;
  });
  const reset = () => {
    files.value = null;
    if (inputRef.value && inputRef.value.value) {
      inputRef.value.value = "";
      changeTrigger(null);
    }
  };
  const applyOptions = (options$1) => {
    const el = inputRef.value;
    if (!el) return;
    el.multiple = toValue(options$1.multiple);
    el.accept = toValue(options$1.accept);
    el.webkitdirectory = toValue(options$1.directory);
    if (hasOwn(options$1, "capture")) el.capture = toValue(options$1.capture);
  };
  const open = (localOptions) => {
    const el = inputRef.value;
    if (!el) return;
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions
    };
    applyOptions(mergedOptions);
    if (toValue(mergedOptions.reset)) reset();
    el.click();
  };
  watchEffect(() => {
    applyOptions(options);
  });
  return {
    files: readonly(files),
    open,
    reset,
    onCancel,
    onChange
  };
}
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
  useFileDialog as a,
  useCurrentElement as b,
  useFileUploader as u
};
//# sourceMappingURL=useFileUploader.js.map
