import { toRef, computed, defineComponent, useModel, ref, mergeModels, openBlock, createElementBlock, withModifiers, normalizeStyle, createElementVNode, createVNode, createCommentVNode, createTextVNode, withDirectives } from "vue";
import { a as useFileDialog } from "./index2.js";
import { data, useS3MultipartUploader, useHttpClient, route, simpleAlert } from "@windwalker-io/unicorn-next";
import "./index-BSgsF2PB.js";
import { v as vBTooltip, _ as _sfc_main$1 } from "./index.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
let abortController = null;
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
    abortController = new AbortController();
    const res = await post(uploadUrl, formData, {
      signal: abortController.signal,
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
    abortController = new AbortController();
    const promise = s3.upload(file, dest, { abortController });
    const { url } = await promise;
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
    cancel
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageUploader",
  props: /* @__PURE__ */ mergeModels({
    uploadUrl: {},
    dest: {},
    accept: { default: "image/*" },
    maxWidth: { default: "500px" },
    aspectRatio: { default: "16/9" }
  }, {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["uploaded", "clear"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const image = useModel(__props, "modelValue");
    const { wrapClassicUpload, acceptString, checkFileType } = useFileUploader({
      accept: () => props.accept
    });
    const uploadImage = wrapClassicUpload(props.uploadUrl || route("@image_upload"));
    const defaultImage = ref(data("defaultImage"));
    const loading = ref(false);
    const { open, reset, onChange, onCancel, files } = useFileDialog({
      accept: acceptString.value
    });
    onChange(async () => {
      if (!files.value?.length) {
        return;
      }
      upload(files.value[0]);
      reset();
    });
    onCancel(reset);
    async function upload(file) {
      loading.value = true;
      try {
        const url = await uploadImage(file, props.dest);
        image.value = url;
        emit("uploaded", url);
      } catch (e) {
        if (e instanceof Error) {
          simpleAlert(`上傳失敗`, e.message, "warning");
        }
        throw e;
      } finally {
        loading.value = false;
      }
    }
    function clear() {
      image.value = "";
      reset();
      emit("clear");
    }
    function paste(e) {
      console.log(e);
    }
    const dragging = ref(false);
    function onDragStart() {
      dragging.value = true;
    }
    function onDragEnd() {
      dragging.value = false;
    }
    function onDrop(e) {
      dragging.value = false;
      const file = e.dataTransfer?.files?.[0];
      if (!file) {
        return;
      }
      upload(file);
    }
    const __returned__ = { props, emit, image, wrapClassicUpload, acceptString, checkFileType, uploadImage, defaultImage, loading, open, reset, onChange, onCancel, files, upload, clear, paste, dragging, onDragStart, onDragEnd, onDrop, get BSpinner() {
      return _sfc_main$1;
    }, get vBTooltip() {
      return vBTooltip;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "c-image-uploader card border overflow-hidden position-relative" };
const _hoisted_2 = {
  key: 0,
  class: "position-absolute d-flex justify-content-center align-items-center",
  style: { "left": "0", "top": "0", "right": "0", "bottom": "0", "background-color": "rgba(255, 255, 255, 0.7)", "z-index": "10" }
};
const _hoisted_3 = ["href"];
const _hoisted_4 = ["src"];
const _hoisted_5 = {
  key: 0,
  class: "c-image-uploader-actions d-flex align-items-center justify-content-between gap-2"
};
const _hoisted_6 = { class: "d-flex align-items-center gap-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "c-image-uploader-wrapper d-flex flex-column gap-2 mx-auto",
    style: normalizeStyle([{ "width": "100%" }, { maxWidth: $props.maxWidth, "--melo-img-uploader-aspect": $props.aspectRatio }]),
    onDragover: withModifiers($setup.onDragStart, ["prevent"]),
    onDragleave: withModifiers($setup.onDragEnd, ["prevent"]),
    onDrop: withModifiers($setup.onDrop, ["prevent"])
  }, [
    createElementVNode("div", _hoisted_1, [
      $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_2, [
        createVNode($setup["BSpinner"])
      ])) : createCommentVNode("", true),
      _cache[9] || (_cache[9] = createTextVNode()),
      $setup.image ? (openBlock(), createElementBlock("a", {
        key: 1,
        href: $setup.image,
        target: "_blank"
      }, [
        createElementVNode("div", {
          class: "c-image-uploader__preview position-relative",
          style: normalizeStyle([[$setup.dragging ? "opacity: .7" : ""], { "aspect-ratio": "var(--melo-img-uploader-aspect)", "background-color": "black", "transition": "all .3s" }])
        }, [
          createElementVNode("img", {
            class: "position-absolute rounded",
            src: $setup.image || $setup.defaultImage,
            alt: "Preview",
            style: { "aspect-ratio": "var(--melo-img-uploader-aspect)", "top": "0", "left": "0", "width": "100%", "height": "100%", "object-fit": "contain" }
          }, null, 8, _hoisted_4)
        ], 4)
      ], 8, _hoisted_3)) : (openBlock(), createElementBlock("div", {
        key: 2,
        class: "c-image-uploader__placeholder d-flex flex-column gap-3 justify-content-center align-items-center",
        style: normalizeStyle([{ "aspect-ratio": "var(--melo-img-uploader-aspect)", "background-color": "white", "transition": "all .3s" }, [$setup.dragging ? "background-color: var(--bs-light)" : ""]])
      }, [
        _cache[5] || (_cache[5] = createElementVNode("div", null, [
          createElementVNode("i", { class: "fas fa-upload fa-2x" })
        ], -1)),
        _cache[6] || (_cache[6] = createTextVNode()),
        _cache[7] || (_cache[7] = createElementVNode("div", { class: "text-muted" }, "\r\n          拖拉至此上傳圖片\r\n        ", -1)),
        _cache[8] || (_cache[8] = createTextVNode()),
        createElementVNode("div", null, [
          createElementVNode("button", {
            type: "button",
            class: "btn btn-primary btn-sm",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.open())
          }, [..._cache[2] || (_cache[2] = [
            createElementVNode("i", { class: "fas fa-image" }, null, -1),
            createTextVNode("\r\n            點擊此處選擇檔案\r\n          ", -1)
          ])]),
          _cache[4] || (_cache[4] = createTextVNode()),
          withDirectives((openBlock(), createElementBlock("button", {
            type: "button",
            class: "btn btn-outline-primary btn-sm",
            onClick: $setup.paste
          }, [..._cache[3] || (_cache[3] = [
            createElementVNode("i", { class: "fas fa-paste" }, null, -1)
          ])])), [
            [$setup["vBTooltip"], "從剪貼簿貼上圖片檔案"]
          ])
        ])
      ], 4))
    ]),
    _cache[17] || (_cache[17] = createTextVNode()),
    $setup.image ? (openBlock(), createElementBlock("div", _hoisted_5, [
      createElementVNode("div", _hoisted_6, [
        createElementVNode("button", {
          type: "button",
          class: "btn btn-primary btn-sm",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.open())
        }, [..._cache[10] || (_cache[10] = [
          createElementVNode("i", { class: "fas fa-image" }, null, -1),
          createTextVNode("\r\n          更換檔案\r\n        ", -1)
        ])]),
        _cache[12] || (_cache[12] = createTextVNode()),
        createElementVNode("div", null, [
          withDirectives((openBlock(), createElementBlock("button", {
            type: "button",
            class: "btn btn-outline-primary btn-sm",
            onClick: $setup.paste
          }, [..._cache[11] || (_cache[11] = [
            createElementVNode("i", { class: "fas fa-paste" }, null, -1)
          ])])), [
            [$setup["vBTooltip"], "從剪貼簿貼上圖片檔案"]
          ])
        ]),
        _cache[13] || (_cache[13] = createTextVNode()),
        _cache[14] || (_cache[14] = createElementVNode("span", { class: "small text-muted" }, "或拖拉檔案至上方", -1))
      ]),
      _cache[16] || (_cache[16] = createTextVNode()),
      createElementVNode("button", {
        type: "button",
        class: "btn btn-outline-danger btn-sm",
        onClick: $setup.clear
      }, [..._cache[15] || (_cache[15] = [
        createElementVNode("i", { class: "fal fa-trash" }, null, -1),
        createTextVNode("\r\n        移除圖片\r\n      ", -1)
      ])])
    ])) : createCommentVNode("", true)
  ], 36);
}
const ImageUploader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "ImageUploader.vue"]]);
export {
  ImageUploader as I,
  useFileUploader as u
};
//# sourceMappingURL=ImageUploader.js.map
