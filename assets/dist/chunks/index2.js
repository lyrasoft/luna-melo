import { a as computedWithControl, i as isClient, b as createEventHook, h as hasOwn } from "./index3.js";
import { getCurrentInstance, onUpdated, onMounted, ref, computed, watchEffect, readonly, toValue } from "vue";
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
  const { document = defaultDocument } = options;
  const files = ref(prepareInitialFiles(options.initialFiles));
  const { on: onChange, trigger: changeTrigger } = createEventHook();
  const { on: onCancel, trigger: cancelTrigger } = createEventHook();
  const inputRef = computed(() => {
    var _unrefElement;
    const input = (_unrefElement = unrefElement(options.input)) !== null && _unrefElement !== void 0 ? _unrefElement : document ? document.createElement("input") : void 0;
    if (input) {
      input.type = "file";
      input.onchange = (event) => {
        const result = event.target;
        files.value = result.files;
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
  const applyOptions = (options2) => {
    const el = inputRef.value;
    if (!el) return;
    el.multiple = toValue(options2.multiple);
    el.accept = toValue(options2.accept);
    el.webkitdirectory = toValue(options2.directory);
    if (hasOwn(options2, "capture")) el.capture = toValue(options2.capture);
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
export {
  useFileDialog as a,
  useCurrentElement as u
};
//# sourceMappingURL=index2.js.map
