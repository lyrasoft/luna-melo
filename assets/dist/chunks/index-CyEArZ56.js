import { ref, nextTick, toValue, readonly, toRef, onMounted, watch, useId, computed, onUnmounted, shallowRef, defineComponent, createElementBlock, openBlock, unref, inject, getCurrentInstance, onBeforeUnmount, mergeModels, useSlots, useModel, useTemplateRef, createBlock, withCtx, createCommentVNode, renderSlot, Transition, mergeProps, withDirectives, createElementVNode, withModifiers, normalizeClass, normalizeProps, guardReactiveProps, resolveDynamicComponent, createTextVNode, toDisplayString, Fragment, createVNode, vShow, normalizeStyle, isRef, markRaw, onScopeDispose, isReadonly } from "vue";
import { v as useMutationObserver, c as createSharedComposable, w as toArray, x as unrefElement, y as notNullish, z as tryOnScopeDispose, A as useScrollLock$1, u as useDefaults, B as useEventListener, s as showHideRegistryKey, C as useThrottleFn, h as orchestratorRegistryKey, a as useId$1, D as onKeyStroke, n as isEmptySlot, j as useColorVariantClasses, E as getModalZIndex, _ as _sfc_main$2, m as modalManagerKey, F as getSSRHandler } from "./_plugin-vue_export-helper.js";
import { a as _sfc_main$3 } from "./index.js";
function buildPromise(_id, store) {
  let resolveFunc = () => {
  };
  const promise = new Promise((resolve) => {
    resolveFunc = resolve;
  });
  Object.assign(promise, {
    id: _id,
    ref: null,
    show() {
      const refWithMethods = this.ref;
      if (refWithMethods?.show) {
        refWithMethods.show();
      } else return this.set({ modelValue: true });
      return promise;
    },
    hide(trigger) {
      const refWithMethods = this.ref;
      if (refWithMethods?.hide) {
        refWithMethods.hide(trigger, true);
      } else return this.set({ modelValue: false });
      return promise;
    },
    toggle() {
      const currentItem = this.get();
      const refWithMethods = this.ref;
      if (refWithMethods?.toggle) {
        refWithMethods.toggle();
      } else return this.set({ modelValue: !currentItem?.modelValue });
      return promise;
    },
    get() {
      return store.value.find((el) => el._self === _id);
    },
    set(val) {
      const itemIndex = store.value.findIndex((el) => el._self === _id);
      const item = store.value[itemIndex];
      if (item) {
        const v = { ...toValue(item), ...toValue(val) };
        if (item.modelValue !== v.modelValue) {
          item["onUpdate:modelValue"]?.(v.modelValue);
        }
        const updatedItem = {
          ...v,
          modelValue: toValue(v.modelValue)
        };
        const vRecord = v;
        if ("title" in vRecord && vRecord.title !== void 0) {
          updatedItem.title = toValue(vRecord.title);
        }
        if ("body" in vRecord && vRecord.body !== void 0) {
          updatedItem.body = toValue(vRecord.body);
        }
        store.value.splice(itemIndex, 1, updatedItem);
      }
      return promise;
    },
    async destroy() {
      const item = store.value.find((el) => el._self === _id);
      if (!item) return;
      item.promise.stop?.();
      if (item.modelValue) {
        await new Promise((resolve) => {
          const prev = item["onHidden"];
          item["onHidden"] = (e) => {
            prev?.(e);
            resolve(e);
          };
          nextTick(() => {
            this.hide("destroy");
          });
        });
      }
      store.value.splice(
        store.value.findIndex((el) => el._self === _id),
        1
      );
    },
    async [Symbol.asyncDispose]() {
      await this.destroy();
    }
  });
  return {
    value: promise,
    resolve: resolveFunc,
    stop: void 0
  };
}
const _newOrchestratorRegistry = () => ({
  store: ref([]),
  _isOrchestratorInstalled: ref(false),
  _isToastAppend: ref(false)
});
var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var isInert = function isInert2(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && isInert2(node.parentNode);
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var activeFocusTraps = {
  activateTrap: function activateTrap(trapStack, trap) {
    if (trapStack.length > 0) {
      var activeTrap = trapStack[trapStack.length - 1];
      if (activeTrap !== trap) {
        activeTrap._setPausedState(true);
      }
    }
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex === -1) {
      trapStack.push(trap);
    } else {
      trapStack.splice(trapIndex, 1);
      trapStack.push(trap);
    }
  },
  deactivateTrap: function deactivateTrap(trapStack, trap) {
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex !== -1) {
      trapStack.splice(trapIndex, 1);
    }
    if (trapStack.length > 0 && !trapStack[trapStack.length - 1]._isManuallyPaused()) {
      trapStack[trapStack.length - 1]._setPausedState(false);
    }
  }
};
var isSelectableInput = function isSelectableInput2(node) {
  return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
};
var isTabEvent = function isTabEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
};
var isKeyForward = function isKeyForward2(e) {
  return isTabEvent(e) && !e.shiftKey;
};
var isKeyBackward = function isKeyBackward2(e) {
  return isTabEvent(e) && e.shiftKey;
};
var delay = function delay2(fn) {
  return setTimeout(fn, 0);
};
var valueOrHandler = function valueOrHandler2(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event) {
  return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var internalTrapStack = [];
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true,
    isKeyForward,
    isKeyBackward
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   posTabIndexesFound: boolean,
    //   firstTabbableNode: HTMLElement|undefined,
    //   lastTabbableNode: HTMLElement|undefined,
    //   firstDomTabbableNode: HTMLElement|undefined,
    //   lastDomTabbableNode: HTMLElement|undefined,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    manuallyPaused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0,
    // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
    recentNavEvent: void 0
  };
  var trap;
  var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };
  var findContainerIndex = function findContainerIndex2(element, event) {
    var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
    return state.containerGroups.findIndex(function(_ref) {
      var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
        return node === element;
      });
    });
  };
  var getNodeForOption = function getNodeForOption2(optionName) {
    var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$hasFallback = _ref2.hasFallback, hasFallback = _ref2$hasFallback === void 0 ? false : _ref2$hasFallback, _ref2$params = _ref2.params, params = _ref2$params === void 0 ? [] : _ref2$params;
    var optionValue = config[optionName];
    if (typeof optionValue === "function") {
      optionValue = optionValue.apply(void 0, _toConsumableArray(params));
    }
    if (optionValue === true) {
      optionValue = void 0;
    }
    if (!optionValue) {
      if (optionValue === void 0 || optionValue === false) {
        return optionValue;
      }
      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue;
    if (typeof optionValue === "string") {
      try {
        node = doc.querySelector(optionValue);
      } catch (err) {
        throw new Error("`".concat(optionName, '` appears to be an invalid selector; error="').concat(err.message, '"'));
      }
      if (!node) {
        if (!hasFallback) {
          throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        }
      }
    }
    return node;
  };
  var getInitialFocusNode = function getInitialFocusNode2() {
    var node = getNodeForOption("initialFocus", {
      hasFallback: true
    });
    if (node === false) {
      return false;
    }
    if (node === void 0 || node && !isFocusable(node, config.tabbableOptions)) {
      if (findContainerIndex(doc.activeElement) >= 0) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
        node = firstTabbableNode || getNodeForOption("fallbackFocus");
      }
    } else if (node === null) {
      node = getNodeForOption("fallbackFocus");
    }
    if (!node) {
      throw new Error("Your focus-trap needs to have at least one focusable element");
    }
    return node;
  };
  var updateTabbableNodes = function updateTabbableNodes2() {
    state.containerGroups = state.containers.map(function(container) {
      var tabbableNodes = tabbable(container, config.tabbableOptions);
      var focusableNodes = focusable(container, config.tabbableOptions);
      var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
      var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
      var firstDomTabbableNode = focusableNodes.find(function(node) {
        return isTabbable(node);
      });
      var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
        return isTabbable(node);
      });
      var posTabIndexesFound = !!tabbableNodes.find(function(node) {
        return getTabIndex(node) > 0;
      });
      return {
        container,
        tabbableNodes,
        focusableNodes,
        /** True if at least one node with positive `tabindex` was found in this container. */
        posTabIndexesFound,
        /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
        firstTabbableNode,
        /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
        lastTabbableNode,
        // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
        //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        //  because that API doesn't work with Shadow DOM as well as it should (@see
        //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
        //  to address an edge case related to positive tabindex support, this seems like a much easier,
        //  "close enough most of the time" alternative for positive tabindexes which should generally
        //  be avoided anyway...
        /** First tabbable node in container, __DOM__ order; `undefined` if none. */
        firstDomTabbableNode,
        /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
        lastDomTabbableNode,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function nextTabbableNode(node) {
          var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var nodeIdx = tabbableNodes.indexOf(node);
          if (nodeIdx < 0) {
            if (forward) {
              return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
                return isTabbable(el);
              });
            }
            return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
              return isTabbable(el);
            });
          }
          return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function(group) {
      return group.tabbableNodes.length > 0;
    });
    if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
    if (state.containerGroups.find(function(g) {
      return g.posTabIndexesFound;
    }) && state.containerGroups.length > 1) {
      throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
    }
  };
  var _getActiveElement = function getActiveElement(el) {
    var activeElement = el.activeElement;
    if (!activeElement) {
      return;
    }
    if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
      return _getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  };
  var _tryFocus = function tryFocus(node) {
    if (node === false) {
      return;
    }
    if (node === _getActiveElement(document)) {
      return;
    }
    if (!node || !node.focus) {
      _tryFocus(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
    var node = getNodeForOption("setReturnFocus", {
      params: [previousActiveElement]
    });
    return node ? node : node === false ? false : previousActiveElement;
  };
  var findNextNavNode = function findNextNavNode2(_ref3) {
    var target = _ref3.target, event = _ref3.event, _ref3$isBackward = _ref3.isBackward, isBackward = _ref3$isBackward === void 0 ? false : _ref3$isBackward;
    target = target || getActualTarget(event);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      var containerIndex = findContainerIndex(target, event);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
      if (containerIndex < 0) {
        if (isBackward) {
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (isBackward) {
        var startOfGroupIndex = state.tabbableGroups.findIndex(function(_ref4) {
          var firstTabbableNode = _ref4.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target, false);
        }
      } else {
        var lastOfGroupIndex = state.tabbableGroups.findIndex(function(_ref5) {
          var lastTabbableNode = _ref5.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target);
        }
      }
    } else {
      destinationNode = getNodeForOption("fallbackFocus");
    }
    return destinationNode;
  };
  var checkPointerDown = function checkPointerDown2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      trap.deactivate({
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked (and if not focusable, to "nothing"); by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node), whether the
        //  outside click was on a focusable node or not
        returnFocus: config.returnFocusOnDeactivate
      });
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
  };
  var checkFocusIn = function checkFocusIn2(event) {
    var target = getActualTarget(event);
    var targetContained = findContainerIndex(target, event) >= 0;
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      event.stopImmediatePropagation();
      var nextNode;
      var navAcrossContainers = true;
      if (state.mostRecentlyFocusedNode) {
        if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
          var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
          var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
          if (tabbableNodes.length > 0) {
            var mruTabIdx = tabbableNodes.findIndex(function(node) {
              return node === state.mostRecentlyFocusedNode;
            });
            if (mruTabIdx >= 0) {
              if (config.isKeyForward(state.recentNavEvent)) {
                if (mruTabIdx + 1 < tabbableNodes.length) {
                  nextNode = tabbableNodes[mruTabIdx + 1];
                  navAcrossContainers = false;
                }
              } else {
                if (mruTabIdx - 1 >= 0) {
                  nextNode = tabbableNodes[mruTabIdx - 1];
                  navAcrossContainers = false;
                }
              }
            }
          }
        } else {
          if (!state.containerGroups.some(function(g) {
            return g.tabbableNodes.some(function(n) {
              return getTabIndex(n) > 0;
            });
          })) {
            navAcrossContainers = false;
          }
        }
      } else {
        navAcrossContainers = false;
      }
      if (navAcrossContainers) {
        nextNode = findNextNavNode({
          // move FROM the MRU node, not event-related node (which will be the node that is
          //  outside the trap causing the focus escape we're trying to fix)
          target: state.mostRecentlyFocusedNode,
          isBackward: config.isKeyBackward(state.recentNavEvent)
        });
      }
      if (nextNode) {
        _tryFocus(nextNode);
      } else {
        _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
      }
    }
    state.recentNavEvent = void 0;
  };
  var checkKeyNav = function checkKeyNav2(event) {
    var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    state.recentNavEvent = event;
    var destinationNode = findNextNavNode({
      event,
      isBackward
    });
    if (destinationNode) {
      if (isTabEvent(event)) {
        event.preventDefault();
      }
      _tryFocus(destinationNode);
    }
  };
  var checkTabKey = function checkTabKey2(event) {
    if (config.isKeyForward(event) || config.isKeyBackward(event)) {
      checkKeyNav(event, config.isKeyBackward(event));
    }
  };
  var checkEscapeKey = function checkEscapeKey2(event) {
    if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
      event.preventDefault();
      trap.deactivate();
    }
  };
  var checkClick = function checkClick2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  var addListeners = function addListeners2() {
    if (!state.active) {
      return;
    }
    activeFocusTraps.activateTrap(trapStack, trap);
    state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function() {
      _tryFocus(getInitialFocusNode());
    }) : _tryFocus(getInitialFocusNode());
    doc.addEventListener("focusin", checkFocusIn, true);
    doc.addEventListener("mousedown", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("touchstart", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("click", checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkTabKey, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkEscapeKey);
    return trap;
  };
  var removeListeners = function removeListeners2() {
    if (!state.active) {
      return;
    }
    doc.removeEventListener("focusin", checkFocusIn, true);
    doc.removeEventListener("mousedown", checkPointerDown, true);
    doc.removeEventListener("touchstart", checkPointerDown, true);
    doc.removeEventListener("click", checkClick, true);
    doc.removeEventListener("keydown", checkTabKey, true);
    doc.removeEventListener("keydown", checkEscapeKey);
    return trap;
  };
  var checkDomRemoval = function checkDomRemoval2(mutations) {
    var isFocusedNodeRemoved = mutations.some(function(mutation) {
      var removedNodes = Array.from(mutation.removedNodes);
      return removedNodes.some(function(node) {
        return node === state.mostRecentlyFocusedNode;
      });
    });
    if (isFocusedNodeRemoved) {
      _tryFocus(getInitialFocusNode());
    }
  };
  var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0;
  var updateObservedNodes = function updateObservedNodes2() {
    if (!mutationObserver) {
      return;
    }
    mutationObserver.disconnect();
    if (state.active && !state.paused) {
      state.containers.map(function(container) {
        mutationObserver.observe(container, {
          subtree: true,
          childList: true
        });
      });
    }
  };
  trap = {
    get active() {
      return state.active;
    },
    get paused() {
      return state.paused;
    },
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, "onActivate");
      var onPostActivate = getOption(activateOptions, "onPostActivate");
      var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = _getActiveElement(doc);
      onActivate === null || onActivate === void 0 || onActivate();
      var finishActivation = function finishActivation2() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }
        addListeners();
        updateObservedNodes();
        onPostActivate === null || onPostActivate === void 0 || onPostActivate();
      };
      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }
      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
      var options = _objectSpread2({
        onDeactivate: config.onDeactivate,
        onPostDeactivate: config.onPostDeactivate,
        checkCanReturnFocus: config.checkCanReturnFocus
      }, deactivateOptions);
      clearTimeout(state.delayInitialFocusTimer);
      state.delayInitialFocusTimer = void 0;
      removeListeners();
      state.active = false;
      state.paused = false;
      updateObservedNodes();
      activeFocusTraps.deactivateTrap(trapStack, trap);
      var onDeactivate = getOption(options, "onDeactivate");
      var onPostDeactivate = getOption(options, "onPostDeactivate");
      var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
      var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
      onDeactivate === null || onDeactivate === void 0 || onDeactivate();
      var finishDeactivation = function finishDeactivation2() {
        delay(function() {
          if (returnFocus) {
            _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }
          onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate();
        });
      };
      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }
      finishDeactivation();
      return this;
    },
    pause: function pause(pauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = true;
      return this._setPausedState(true, pauseOptions);
    },
    unpause: function unpause(unpauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = false;
      if (trapStack[trapStack.length - 1] !== this) {
        return this;
      }
      return this._setPausedState(false, unpauseOptions);
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function(element) {
        return typeof element === "string" ? doc.querySelector(element) : element;
      });
      if (state.active) {
        updateTabbableNodes();
      }
      updateObservedNodes();
      return this;
    }
  };
  Object.defineProperties(trap, {
    _isManuallyPaused: {
      value: function value() {
        return state.manuallyPaused;
      }
    },
    _setPausedState: {
      value: function value(paused, options) {
        if (state.paused === paused) {
          return this;
        }
        state.paused = paused;
        if (paused) {
          var onPause = getOption(options, "onPause");
          var onPostPause = getOption(options, "onPostPause");
          onPause === null || onPause === void 0 || onPause();
          removeListeners();
          updateObservedNodes();
          onPostPause === null || onPostPause === void 0 || onPostPause();
        } else {
          var onUnpause = getOption(options, "onUnpause");
          var onPostUnpause = getOption(options, "onPostUnpause");
          onUnpause === null || onUnpause === void 0 || onUnpause();
          updateTabbableNodes();
          addListeners();
          updateObservedNodes();
          onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause();
        }
        return this;
      }
    }
  });
  trap.updateContainerElements(elements);
  return trap;
};
function useFocusTrap(target, options = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = options;
  const hasFocus = shallowRef(false);
  const isPaused = shallowRef(false);
  const activate = (opts) => trap && trap.activate(opts);
  const deactivate = (opts) => trap && trap.deactivate(opts);
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.value = true;
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.value = false;
    }
  };
  const targets = computed(() => {
    const _targets = toValue(target);
    return toArray(_targets).map((el) => {
      const _el = toValue(el);
      return typeof _el === "string" ? _el : unrefElement(_el);
    }).filter(notNullish);
  });
  watch(
    targets,
    (els) => {
      if (!els.length)
        return;
      if (!trap) {
        trap = createFocusTrap(els, {
          ...focusTrapOptions,
          onActivate() {
            hasFocus.value = true;
            if (options.onActivate)
              options.onActivate();
          },
          onDeactivate() {
            hasFocus.value = false;
            if (options.onDeactivate)
              options.onDeactivate();
          }
        });
        if (immediate)
          activate();
      } else {
        const isActive = trap == null ? void 0 : trap.active;
        trap == null ? void 0 : trap.updateContainerElements(els);
        if (!isActive && immediate) {
          activate();
        }
      }
    },
    { flush: "post" }
  );
  tryOnScopeDispose(() => deactivate());
  return {
    hasFocus,
    isPaused,
    activate,
    deactivate,
    pause,
    unpause
  };
}
const useActivatedFocusTrap = ({
  element,
  isActive,
  noTrap,
  fallbackFocus,
  focus
}, focusTrapOpts = {
  allowOutsideClick: true,
  fallbackFocus: () => fallbackFocus.ref.value || (typeof document !== "undefined" ? document.body : "body"),
  escapeDeactivates: false,
  clickOutsideDeactivates: false,
  initialFocus: focus
}) => {
  const resolvedIsActive = readonly(toRef(isActive));
  const resolvedNoTrap = readonly(toRef(noTrap));
  const checkNeedsFallback = () => {
    const tabbableElements = element.value?.querySelectorAll(
      `a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]):not(.${fallbackFocus.classSelector})`
    );
    return !tabbableElements?.length;
  };
  const needsFallback = ref(false);
  onMounted(() => {
    needsFallback.value = checkNeedsFallback();
    useMutationObserver(
      element,
      () => {
        needsFallback.value = checkNeedsFallback();
      },
      { childList: true, subtree: true }
    );
  });
  const trap = useFocusTrap(element, focusTrapOpts);
  watch(resolvedIsActive, async (newValue) => {
    if (newValue && resolvedNoTrap.value === false) {
      trap.activate();
    } else {
      trap.deactivate();
    }
  });
  watch(resolvedNoTrap, (newValue) => {
    if (newValue === true) {
      trap.deactivate();
    }
  });
  return {
    needsFallback: readonly(needsFallback)
  };
};
const useScrollLock = createSharedComposable(useScrollLock$1);
let prevousRightPadding = "";
const lockRegistry = /* @__PURE__ */ new Map();
const useSafeScrollLock = (isOpen, bodyScroll) => {
  const resolvedIsOpen = readonly(toRef(isOpen));
  const id = useId();
  const inverseBodyScrollingValue = computed(() => !toValue(bodyScroll));
  const isLocked = useScrollLock(
    typeof document !== "undefined" ? document.body : null,
    resolvedIsOpen.value && inverseBodyScrollingValue.value
  );
  onMounted(() => {
    if (typeof document === "undefined") return;
    lockRegistry.set(id, false);
    watch(
      [resolvedIsOpen, inverseBodyScrollingValue],
      ([modelVal, bodyVal]) => {
        const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
        const hasLocked = Array.from(lockRegistry.values()).some((val) => val === true);
        const myLocked = modelVal && bodyVal;
        lockRegistry.set(id, myLocked);
        if (myLocked && !hasLocked && !isLocked.value) {
          isLocked.value = true;
          if (scrollBarGap > 0) {
            prevousRightPadding = document.body.style.paddingRight;
            document.body.style.paddingRight = `${scrollBarGap + prevousRightPadding}px`;
          }
        }
        const hasLockedAfter = Array.from(lockRegistry.values()).some((val) => val === true);
        if (hasLocked && !hasLockedAfter) {
          lockRegistry.set(id, false);
          isLocked.value = false;
          document.body.style.paddingRight = prevousRightPadding;
        }
      },
      { immediate: true }
    );
  });
  onUnmounted(() => {
    lockRegistry.delete(id);
    const hasLockedAfter = Array.from(lockRegistry.values()).some((val) => val === true);
    if (!hasLockedAfter) {
      document.body.style.paddingRight = prevousRightPadding;
      isLocked.value = false;
    }
  });
};
const _hoisted_1$1 = ["type", "disabled", "aria-label"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BCloseButton",
  props: {
    ariaLabel: { default: "Close" },
    disabled: { type: Boolean, default: false },
    type: { default: "button" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BCloseButton");
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        type: unref(props).type,
        class: "btn-close",
        disabled: unref(props).disabled,
        "aria-label": unref(props).ariaLabel,
        onClick: _cache[0] || (_cache[0] = ($event) => emit("click", $event))
      }, null, 8, _hoisted_1$1);
    };
  }
});
class BvEvent {
  cancelable = true;
  componentId = null;
  _defaultPrevented = false;
  eventType = "";
  nativeEvent = null;
  _preventDefault;
  relatedTarget = null;
  target = null;
  // Readable by everyone,
  // But only overwritten by inherrited constructors
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  set defaultPrevented(prop) {
    this._defaultPrevented = prop;
  }
  // I think this is right
  // We want to be able to have it callable to everyone,
  // But only overwritten by inherrited constructors
  get preventDefault() {
    return this._preventDefault;
  }
  // This may not be correct, because it doesn't get correct type inferences in children
  // Ex overwrite this.preventDefault = () => true is valid. Could be a TS issue
  set preventDefault(setter) {
    this._preventDefault = setter;
  }
  constructor(eventType, eventInit = {}) {
    if (!eventType) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}'. 1 argument required, ${arguments.length} given.`
      );
    }
    Object.assign(this, BvEvent.Defaults, eventInit, { eventType });
    this._preventDefault = function _preventDefault() {
      if (this.cancelable) {
        this.defaultPrevented = true;
      }
    };
  }
  static get Defaults() {
    return {
      cancelable: true,
      componentId: null,
      eventType: "",
      nativeEvent: null,
      relatedTarget: null,
      target: null
    };
  }
}
class BvTriggerableEvent extends BvEvent {
  trigger = null;
  ok = void 0;
  constructor(eventType, eventInit = {}) {
    super(eventType, eventInit);
    Object.assign(this, BvEvent.Defaults, eventInit, { eventType });
  }
  static get Defaults() {
    return {
      ...super.Defaults,
      trigger: null,
      ok: void 0
    };
  }
}
const fadeBaseTransitionProps = {
  name: "fade",
  enterActiveClass: "",
  enterFromClass: "showing",
  enterToClass: "",
  leaveActiveClass: "",
  leaveFromClass: "",
  leaveToClass: "showing",
  css: true
};
const useShowHide = (modelValue, props, emit, element, computedId, options = {
  transitionProps: {},
  showFn: () => {
  },
  hideFn: () => {
  }
}) => {
  let noAction = false;
  const initialShow = !!modelValue.value && !props.initialAnimation || props.visible || false;
  const showRef = ref(initialShow);
  const renderRef = ref(initialShow);
  const renderBackdropRef = ref(initialShow);
  let isCountdown = typeof modelValue.value !== "boolean";
  watch(modelValue, () => {
    isCountdown = typeof modelValue.value !== "boolean";
    if (noAction) {
      noAction = false;
      return;
    }
    if (modelValue.value) {
      show();
    } else {
      hide("modelValue", true);
    }
  });
  const localNoAnimation = ref(initialShow);
  const localTemporaryHide = ref(false);
  const computedNoAnimation = computed(
    () => props.noAnimation || props.noFade || localNoAnimation.value || false
  );
  let isMounted = false;
  onMounted(() => {
    isMounted = true;
    if (!props.show && initialShow) {
      const event = buildTriggerableEvent("show", { cancelable: true });
      emit("show", event);
      if (event.defaultPrevented) {
        emit("show-prevented", buildTriggerableEvent("show-prevented"));
        return;
      }
      localNoAnimation.value = true;
      if (!modelValue.value) {
        noAction = true;
        modelValue.value = true;
      }
      renderRef.value = true;
      renderBackdropRef.value = true;
      isVisible.value = true;
      backdropVisible.value = true;
      backdropReady.value = true;
      showRef.value = true;
      options.showFn?.();
    } else if (props.show || !!modelValue.value && props.initialAnimation) {
      show();
    }
  });
  watch(
    () => props.visible,
    (newval) => {
      localNoAnimation.value = true;
      nextTick(() => {
        if (newval) isVisible.value = true;
        if (newval) {
          show();
        } else {
          hide("visible-prop", true);
        }
      });
    }
  );
  watch(
    () => props.show,
    (newval) => {
      if (newval) {
        show();
      } else {
        hide("show-prop", true);
      }
    }
  );
  useEventListener(element, "bv-toggle", () => {
    modelValue.value = !modelValue.value;
  });
  const buildTriggerableEvent = (type, opts = {}) => new BvTriggerableEvent(type, {
    cancelable: false,
    target: element?.value || null,
    relatedTarget: null,
    trigger: null,
    ...opts,
    componentId: computedId?.value
  });
  let showTimeout;
  let hideTimeout;
  let _Resolve;
  let _Promise;
  let _resolveOnHide;
  const show = (resolveOnHide = false) => {
    if (showRef.value && !hideTimeout && !_Promise) return Promise.resolve(true);
    _resolveOnHide = resolveOnHide;
    if (showRef.value && !hideTimeout && _Promise) return _Promise;
    _Promise = new Promise((resolve) => {
      _Resolve = resolve;
    });
    const event = buildTriggerableEvent("show", { cancelable: true });
    emit("show", event);
    if (event.defaultPrevented) {
      emit("show-prevented", buildTriggerableEvent("show-prevented"));
      if (isVisible.value) {
        isVisible.value = false;
      }
      if (modelValue.value && !isCountdown) {
        noAction = true;
        nextTick(() => {
          modelValue.value = false;
        });
      }
      _Resolve?.("show-prevented");
      return _Promise;
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = void 0;
    }
    renderRef.value = true;
    renderBackdropRef.value = true;
    requestAnimationFrame(() => {
      if (localNoAnimation.value || props.delay === void 0) {
        if (!isMounted) return;
        showTimeout = void 0;
        showRef.value = true;
        options.showFn?.();
        if (!modelValue.value) {
          noAction = true;
          nextTick(() => {
            modelValue.value = true;
          });
        }
        return;
      }
      showTimeout = setTimeout(
        () => {
          if (!isMounted) return;
          showTimeout = void 0;
          showRef.value = true;
          options.showFn?.();
          if (!modelValue.value) {
            noAction = true;
            nextTick(() => {
              modelValue.value = true;
            });
          }
        },
        typeof props.delay === "number" ? props.delay : props.delay?.show || 0
      );
    });
    return _Promise;
  };
  let leaveTrigger;
  const hide = (trigger, noTriggerEmit) => {
    if (!showRef.value && !showTimeout) return Promise.resolve("");
    if (!_Promise)
      _Promise = new Promise((resolve) => {
        _Resolve = resolve;
      });
    if (typeof trigger !== "string") trigger = void 0;
    leaveTrigger = trigger;
    const event = buildTriggerableEvent("hide", { cancelable: true, trigger });
    const event2 = buildTriggerableEvent(trigger || "ignore", { cancelable: true, trigger });
    if (trigger === "backdrop" && props.noCloseOnBackdrop || trigger === "esc" && props.noCloseOnEsc) {
      emit("hide-prevented", buildTriggerableEvent("hide-prevented", { trigger }));
      _Resolve?.("hide-prevented");
      return _Promise;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = void 0;
    }
    if (trigger && !noTriggerEmit) {
      emit(trigger, event2);
    }
    emit("hide", event);
    if (event.defaultPrevented || event2.defaultPrevented) {
      emit("hide-prevented", buildTriggerableEvent("hide-prevented", { trigger }));
      if (!modelValue.value) {
        nextTick(() => {
          noAction = true;
          modelValue.value = true;
        });
      }
      _Resolve?.("hide-prevented");
      return _Promise;
    }
    trapActive.value = false;
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = void 0;
      if (!localTemporaryHide.value) renderRef.value = false;
      renderBackdropRef.value = false;
    }
    hideTimeout = setTimeout(
      () => {
        if (!isMounted) return;
        hideTimeout = void 0;
        isLeaving.value = true;
        showRef.value = false;
        options.hideFn?.();
        if (modelValue.value) {
          noAction = true;
          modelValue.value = isCountdown ? 0 : false;
        }
      },
      localNoAnimation.value ? 0 : typeof props.delay === "number" ? props.delay : props.delay?.hide || 0
    );
    return _Promise;
  };
  const throttleHide = useThrottleFn((a) => hide(a), 500);
  const throttleShow = useThrottleFn(() => show(), 500);
  const toggle = (resolveOnHide = false) => {
    const e = buildTriggerableEvent("toggle", { cancelable: true });
    emit("toggle", e);
    if (e.defaultPrevented) {
      emit("toggle-prevented", buildTriggerableEvent("toggle-prevented"));
      return Promise.resolve("toggle-prevented");
    }
    if (showRef.value) {
      return hide("toggle-function", true);
    }
    return show(resolveOnHide);
  };
  const triggerToggle = () => {
    const e = buildTriggerableEvent("toggle", { cancelable: true });
    emit("toggle", e);
    if (e.defaultPrevented) {
      emit("toggle-prevented", buildTriggerableEvent("toggle-prevented"));
      return;
    }
    if (showRef.value) {
      hide("toggle-trigger", true);
    } else {
      show();
    }
  };
  const triggerRegistry = [];
  const registerTrigger = (trigger, el) => {
    triggerRegistry.push({ trigger, el });
    el.addEventListener(trigger, triggerToggle);
    checkVisibility(el);
  };
  const unregisterTrigger = (trigger, el, clean = true) => {
    const idx = triggerRegistry.findIndex((t) => t?.trigger === trigger && t.el === el);
    if (idx > -1) {
      triggerRegistry.splice(idx, 1);
      el.removeEventListener(trigger, triggerToggle);
      if (clean) {
        el.removeAttribute("aria-expanded");
        el.classList.remove("collapsed");
        el.classList.remove("not-collapsed");
      }
    }
  };
  const appRegistry = inject(showHideRegistryKey, void 0)?.register({
    id: computedId.value,
    toggle,
    show,
    hide,
    value: readonly(showRef),
    registerTrigger,
    unregisterTrigger,
    component: getCurrentInstance()
  });
  const checkVisibility = (el) => {
    el.setAttribute("aria-expanded", modelValue.value ? "true" : "false");
    el.classList.toggle("collapsed", !modelValue.value);
    el.classList.toggle("not-collapsed", !!modelValue.value);
  };
  watch(modelValue, () => {
    triggerRegistry.forEach((t) => {
      checkVisibility(t.el);
    });
  });
  watch(computedId, (newId, oldId) => {
    appRegistry?.updateId(newId, oldId);
  });
  onBeforeUnmount(() => {
    appRegistry?.unregister();
    triggerRegistry.forEach((t) => {
      t.el.removeEventListener(t.trigger, triggerToggle);
    });
  });
  onUnmounted(() => {
    isMounted = false;
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    showTimeout = void 0;
    hideTimeout = void 0;
  });
  const lazyLoadCompleted = ref(false);
  const markLazyLoadCompleted = () => {
    if (props.lazy === true) lazyLoadCompleted.value = true;
  };
  const isLeaving = ref(false);
  const isActive = ref(initialShow);
  const isVisible = ref(initialShow);
  const onBeforeEnter = (el) => {
    options.transitionProps?.onBeforeEnter?.(el);
    props.transitionProps?.onBeforeEnter?.(el);
    isActive.value = true;
  };
  const onEnter = (el) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isVisible.value = true;
      });
    });
    options.transitionProps?.onEnter?.(el);
    props.transitionProps?.onEnter?.(el);
  };
  const onAfterEnter = (el) => {
    markLazyLoadCompleted();
    options.transitionProps?.onAfterEnter?.(el);
    props.transitionProps?.onAfterEnter?.(el);
    if (localNoAnimation.value) {
      requestAnimationFrame(() => {
        localNoAnimation.value = false;
      });
    }
    if (localTemporaryHide.value) {
      localTemporaryHide.value = false;
    }
    requestAnimationFrame(() => {
      trapActive.value = true;
      nextTick(() => {
        emit("shown", buildTriggerableEvent("shown", { cancelable: false }));
      });
    });
    if (!_resolveOnHide) {
      _Resolve?.(true);
      _Promise = void 0;
      _Resolve = void 0;
    }
  };
  const onBeforeLeave = (el) => {
    if (!isLeaving.value) isLeaving.value = true;
    options.transitionProps?.onBeforeLeave?.(el);
    props.transitionProps?.onBeforeLeave?.(el);
    trapActive.value = false;
  };
  const onLeave = (el) => {
    isVisible.value = false;
    options.transitionProps?.onLeave?.(el);
    props.transitionProps?.onLeave?.(el);
  };
  const onAfterLeave = (el) => {
    emit("hidden", buildTriggerableEvent("hidden", { trigger: leaveTrigger, cancelable: false }));
    options.transitionProps?.onAfterLeave?.(el);
    props.transitionProps?.onAfterLeave?.(el);
    isLeaving.value = false;
    isActive.value = false;
    if (localNoAnimation.value) {
      requestAnimationFrame(() => {
        localNoAnimation.value = false;
      });
    }
    requestAnimationFrame(() => {
      if (!localTemporaryHide.value) renderRef.value = false;
    });
    _Resolve?.(leaveTrigger || "");
    _Promise = void 0;
    _Resolve = void 0;
    leaveTrigger = void 0;
  };
  const contentShowing = computed(
    () => localTemporaryHide.value === true || isActive.value === true || props.lazy === false || props.lazy === true && lazyLoadCompleted.value === true && props.unmountLazy === false
  );
  const trapActive = ref(false);
  const backdropVisible = ref(false);
  const backdropReady = ref(false);
  const transitionFunctions = {
    ...options.transitionProps,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave
  };
  return {
    showRef,
    renderRef,
    renderBackdropRef,
    isVisible,
    isActive,
    trapActive,
    show,
    hide,
    toggle,
    throttleHide,
    throttleShow,
    buildTriggerableEvent,
    computedNoAnimation,
    localNoAnimation,
    localTemporaryHide,
    isLeaving,
    transitionProps: {
      ...fadeBaseTransitionProps,
      ...props.transitionProps,
      ...transitionFunctions
    },
    lazyLoadCompleted,
    markLazyLoadCompleted,
    contentShowing,
    backdropReady,
    backdropVisible,
    backdropTransitionProps: {
      ...fadeBaseTransitionProps,
      onBeforeEnter: () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            backdropVisible.value = true;
          });
        });
        backdropReady.value = false;
      },
      onAfterEnter: () => {
        backdropReady.value = true;
      },
      onBeforeLeave: () => {
        backdropVisible.value = false;
      },
      onAfterLeave: () => {
        backdropReady.value = false;
        requestAnimationFrame(() => {
          renderBackdropRef.value = false;
        });
      }
    }
  };
};
const getElement = (element, root = typeof document !== "undefined" ? document : void 0) => {
  if (!element) return void 0;
  if (typeof element === "string") {
    if (typeof root === "undefined" || typeof document === "undefined") return void 0;
    const idElement = document.getElementById(element);
    return idElement ?? root.querySelector(element) ?? void 0;
  }
  return element.$el ?? element;
};
const modalOpenClassName = "modal-open";
const useSharedModalStack = () => {
  const modalManagerPlugin = inject(modalManagerKey);
  const dispose = (modal) => {
    modalManagerPlugin?.removeStack(modal);
    modalManagerPlugin?.removeRegistry(modal);
  };
  const updateHTMLAttrs = getSSRHandler("updateHTMLAttrs", (selector, attribute, value) => {
    const el = typeof selector === "string" ? window?.document.querySelector(selector) : unrefElement(selector);
    if (!el) return;
    if (attribute === "class") {
      el.classList.toggle(modalOpenClassName, value === modalOpenClassName);
    } else {
      el.setAttribute(attribute, value);
    }
  });
  tryOnScopeDispose(() => {
    if (modalManagerPlugin?.countStack.value === 0) {
      updateHTMLAttrs("body", "class", "");
    }
  });
  watch(
    () => modalManagerPlugin?.countStack.value,
    (newValue) => {
      if (newValue === void 0) return;
      updateHTMLAttrs("body", "class", newValue > 0 ? modalOpenClassName : "");
    }
  );
  return {
    ...modalManagerPlugin,
    dispose
  };
};
const useModalManager = (modalOpen, initialValue) => {
  const { pushRegistry, pushStack, removeStack, stack, dispose, countStack } = useSharedModalStack();
  const currentModal = getCurrentInstance();
  if (!currentModal || currentModal.type.__name !== "BModal") {
    throw new Error("useModalManager must only use in BModal component");
  }
  pushRegistry?.(currentModal);
  tryOnScopeDispose(() => {
    dispose(currentModal);
  });
  const setInStack = (newValue, oldValue) => {
    if (newValue) {
      pushStack?.(currentModal);
    } else if (oldValue && !newValue) {
      removeStack?.(currentModal);
    }
  };
  setInStack(initialValue, initialValue);
  watch(modalOpen, setInStack);
  return {
    activePosition: computed(
      () => stack?.value.findIndex((el) => toValue(el.exposed?.id) === toValue(currentModal.exposed?.id))
    ),
    activeModalCount: countStack,
    stackWithoutSelf: computed(
      () => stack?.value.filter(
        (el) => toValue(el.exposed?.id) !== toValue(currentModal.exposed?.id)
      ) ?? []
    )
  };
};
const _hoisted_1 = ["id", "aria-labelledby", "aria-describedby"];
const _hoisted_2 = ["id"];
const fallbackClassSelector = "modal-fallback-focus";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BModal",
  props: /* @__PURE__ */ mergeModels({
    focus: { type: [String, Boolean, Object, null], default: void 0 },
    backdropFirst: { type: Boolean, default: false },
    body: { default: void 0 },
    bodyAttrs: { default: void 0 },
    bodyBgVariant: { default: null },
    bodyClass: { default: null },
    bodyScrolling: { type: Boolean, default: false },
    bodyTextVariant: { default: null },
    bodyVariant: { default: null },
    busy: { type: Boolean, default: false },
    buttonSize: { default: "md" },
    cancelClass: { default: void 0 },
    cancelDisabled: { type: Boolean, default: false },
    cancelTitle: { default: "Cancel" },
    cancelVariant: { default: "secondary" },
    centered: { type: Boolean, default: false },
    contentClass: { default: void 0 },
    dialogClass: { default: void 0 },
    footerBgVariant: { default: null },
    footerBorderVariant: { default: null },
    footerClass: { default: void 0 },
    footerTextVariant: { default: null },
    footerVariant: { default: null },
    fullscreen: { type: [Boolean, String], default: false },
    headerAttrs: { default: void 0 },
    headerBgVariant: { default: null },
    headerBorderVariant: { default: null },
    headerClass: { default: void 0 },
    headerCloseClass: { default: void 0 },
    headerCloseLabel: { default: "Close" },
    headerCloseVariant: { default: "secondary" },
    headerTextVariant: { default: null },
    headerVariant: { default: null },
    noBackdrop: { type: Boolean, default: false },
    noFooter: { type: Boolean, default: false },
    noHeader: { type: Boolean, default: false },
    noHeaderClose: { type: Boolean, default: false },
    id: { default: void 0 },
    modalClass: { default: void 0 },
    noCloseOnBackdrop: { type: Boolean, default: false },
    noCloseOnEsc: { type: Boolean, default: false },
    noTrap: { type: Boolean, default: false },
    noStacking: { type: Boolean },
    okClass: { default: void 0 },
    okDisabled: { type: Boolean, default: false },
    okOnly: { type: Boolean, default: false },
    okTitle: { default: "OK" },
    okVariant: { default: "primary" },
    scrollable: { type: Boolean, default: false },
    size: { default: "md" },
    title: { default: void 0 },
    titleClass: { default: void 0 },
    titleVisuallyHidden: { type: Boolean, default: false },
    titleTag: { default: "h5" },
    teleportDisabled: { type: Boolean, default: false },
    teleportTo: { default: "body" },
    initialAnimation: { type: Boolean, default: false },
    noAnimation: { type: Boolean },
    noFade: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
    unmountLazy: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    transProps: { default: void 0 },
    visible: { type: Boolean, default: false }
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["backdrop", "close", "esc", "hide", "hide-prevented", "hidden", "show", "show-prevented", "shown", "toggle", "toggle-prevented", "cancel", "ok"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const props = useDefaults(_props, "BModal");
    const emit = __emit;
    const slots = useSlots();
    const computedId = useId$1(() => props.id, "modal");
    const modelValue = useModel(__props, "modelValue");
    const element = useTemplateRef("_element");
    const fallbackFocusElement = useTemplateRef("_fallbackFocusElement");
    const okButton = useTemplateRef("_okButton");
    const cancelButton = useTemplateRef("_cancelButton");
    const closeButton = useTemplateRef("_closeButton");
    const pickFocusItem = () => {
      if (props.focus && typeof props.focus !== "boolean") {
        if (props.focus === "ok") {
          return okButton;
        } else if (props.focus === "close") {
          return closeButton;
        } else if (props.focus === "cancel") {
          return cancelButton;
        }
        return getElement(props.focus, element.value ?? void 0) ?? element.value;
      }
      return element;
    };
    let activeElement = null;
    const onAfterEnter = () => {
      if (props.noTrap && props.focus !== false) {
        activeElement = document.activeElement;
        if (activeElement === element.value) {
          activeElement = null;
        }
        const el = unrefElement(pickFocusItem());
        if (!el) return;
        el?.focus();
        if (el.tagName && el.tagName.toLowerCase() === "input" && typeof el.select === "function") {
          el.select();
        }
      }
    };
    const onAfterLeave = () => {
      if (props.noTrap && props.focus !== false && activeElement) {
        activeElement?.focus();
        activeElement = null;
      }
    };
    const {
      showRef,
      renderRef,
      renderBackdropRef,
      hide,
      show,
      toggle,
      computedNoAnimation,
      transitionProps,
      backdropTransitionProps,
      isLeaving,
      isVisible,
      trapActive,
      contentShowing,
      backdropReady,
      backdropVisible
    } = useShowHide(modelValue, props, emit, element, computedId, {
      // addShowClass: false,
      transitionProps: {
        onAfterEnter,
        onAfterLeave
      }
    });
    const { needsFallback } = useActivatedFocusTrap({
      element,
      isActive: trapActive,
      noTrap: () => props.noTrap,
      fallbackFocus: {
        ref: fallbackFocusElement,
        classSelector: fallbackClassSelector
      },
      focus: () => props.focus === false ? false : unrefElement(pickFocusItem()) ?? void 0
      // () => (typeof focus === 'boolean' ? focus : (unrefElement(focus) ?? undefined)),
    });
    onKeyStroke(
      "Escape",
      () => {
        hide("esc");
      },
      { target: element }
    );
    useSafeScrollLock(showRef, () => props.bodyScrolling);
    const hasHeaderCloseSlot = computed(() => !isEmptySlot(slots["header-close"]));
    const modalDialogClasses = computed(() => [
      props.dialogClass,
      {
        "modal-fullscreen": props.fullscreen === true,
        [`modal-fullscreen-${props.fullscreen}-down`]: typeof props.fullscreen === "string",
        [`modal-${props.size}`]: props.size !== "md",
        "modal-dialog-centered": props.centered,
        "modal-dialog-scrollable": props.scrollable
      }
    ]);
    const bodyColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.bodyBgVariant,
      textVariant: props.bodyTextVariant,
      variant: props.bodyVariant
    }));
    const bodyClasses = computed(() => [props.bodyClass, bodyColorClasses.value]);
    const headerColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.headerBgVariant,
      textVariant: props.headerTextVariant,
      variant: props.headerVariant,
      borderVariant: props.headerBorderVariant
    }));
    const headerClasses = computed(() => [props.headerClass, headerColorClasses.value]);
    const headerCloseAttrs = computed(() => ({
      variant: hasHeaderCloseSlot.value ? props.headerCloseVariant : void 0,
      class: props.headerCloseClass
    }));
    const footerColorClasses = useColorVariantClasses(() => ({
      bgVariant: props.footerBgVariant,
      textVariant: props.footerTextVariant,
      variant: props.footerVariant,
      borderVariant: props.footerBorderVariant
    }));
    const footerClasses = computed(() => [props.footerClass, footerColorClasses.value]);
    const titleClasses = computed(() => [
      props.titleClass,
      {
        ["visually-hidden"]: props.titleVisuallyHidden
      }
    ]);
    const disableCancel = computed(() => props.cancelDisabled || props.busy);
    const disableOk = computed(() => props.okDisabled || props.busy);
    const { activePosition, activeModalCount, stackWithoutSelf } = useModalManager(
      showRef,
      modelValue.value
    );
    const sharedClasses = computed(() => ({
      [`stack-position-${activePosition?.value ?? 0}`]: true,
      [`stack-inverse-position-${(activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0)}`]: true
    }));
    watch(stackWithoutSelf, (newValue, oldValue) => {
      if (newValue.length > oldValue.length && showRef.value === true && props.noStacking === true)
        hide();
    });
    const defaultModalDialogZIndex = ref(
      getModalZIndex(element.value ?? (typeof document !== "undefined" ? document.body : void 0))
    );
    onMounted(() => {
      watch(
        renderRef,
        (v) => {
          if (!v) return;
          nextTick(() => {
            if (!element.value) return;
            defaultModalDialogZIndex.value = getModalZIndex(element.value);
          });
        },
        { immediate: true }
      );
    });
    const computedZIndexNumber = computed(
      () => (
        // Make sure that newly opened modals have a higher z-index than currently active ones.
        // All active modals have a z-index of ('defaultZIndex' - 'stackSize' - 'positionInStack').
        //
        // This means inactive modals will already be higher than active ones when opened.
        showRef.value || isLeaving.value ? (
          // Just for reference there is a single frame in which the modal is not active but still has a higher z-index than the active ones due to _when_ it calculates its position. It's a small visual effect
          defaultModalDialogZIndex.value - ((activeModalCount?.value ?? 0) * 2 - (activePosition?.value ?? 0) * 2)
        ) : defaultModalDialogZIndex.value
      )
    );
    const computedZIndex = computed(() => ({
      "z-index": computedZIndexNumber.value,
      "--b-position": activePosition?.value ?? 0,
      "--b-inverse-position": (activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0),
      "--b-count": activeModalCount?.value ?? 0
    }));
    const computedZIndexBackdrop = computed(() => ({
      "z-index": computedZIndexNumber.value - 1,
      "--b-position": activePosition?.value ?? 0,
      "--b-inverse-position": (activeModalCount?.value ?? 1) - 1 - (activePosition?.value ?? 0),
      "--b-count": activeModalCount?.value ?? 0
    }));
    const sharedSlots = computed(() => ({
      id: computedId.value,
      cancel: () => {
        hide("cancel");
      },
      close: () => {
        hide("close");
      },
      hide,
      show,
      toggle,
      ok: () => {
        hide("ok");
      },
      active: showRef.value,
      visible: showRef.value
    }));
    __expose({
      hide,
      id: computedId,
      show,
      toggle,
      visible: showRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$2, {
        to: unref(props).teleportTo,
        disabled: unref(props).teleportDisabled
      }, {
        default: withCtx(() => [
          unref(renderRef) || unref(contentShowing) ? (openBlock(), createBlock(Transition, mergeProps({ key: 0 }, unref(transitionProps), {
            appear: modelValue.value || unref(props).visible
          }), {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", mergeProps({
                id: unref(computedId),
                ref: "_element",
                class: ["modal", [
                  unref(props).modalClass,
                  {
                    fade: !unref(computedNoAnimation),
                    show: unref(isVisible),
                    ...sharedClasses.value
                  }
                ]],
                role: "dialog",
                "aria-labelledby": !unref(props).noHeader ? `${unref(computedId)}-label` : void 0,
                "aria-describedby": `${unref(computedId)}-body`,
                tabindex: "-1"
              }, _ctx.$attrs, {
                style: [computedZIndex.value, { "display": "block" }],
                onMousedown: _cache[4] || (_cache[4] = withModifiers(($event) => unref(hide)("backdrop"), ["left", "self"]))
              }), [
                createElementVNode("div", {
                  class: normalizeClass(["modal-dialog", modalDialogClasses.value])
                }, [
                  unref(contentShowing) ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass(["modal-content", unref(props).contentClass])
                  }, [
                    !unref(props).noHeader ? (openBlock(), createElementBlock("div", mergeProps({
                      key: 0,
                      class: ["modal-header", headerClasses.value]
                    }, unref(props).headerAttrs), [
                      renderSlot(_ctx.$slots, "header", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        (openBlock(), createBlock(resolveDynamicComponent(unref(props).titleTag), {
                          id: `${unref(computedId)}-label`,
                          class: normalizeClass(["modal-title", titleClasses.value])
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "title", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                              createTextVNode(toDisplayString(unref(props).title), 1)
                            ])
                          ]),
                          _: 3
                        }, 8, ["id", "class"])),
                        !unref(props).noHeaderClose ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                          hasHeaderCloseSlot.value ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                            key: 0,
                            ref: "_closeButton"
                          }, headerCloseAttrs.value, {
                            onClick: _cache[0] || (_cache[0] = ($event) => unref(hide)("close"))
                          }), {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "header-close", normalizeProps(guardReactiveProps(sharedSlots.value)))
                            ]),
                            _: 3
                          }, 16)) : (openBlock(), createBlock(_sfc_main$1, mergeProps({
                            key: 1,
                            ref: "_closeButton",
                            "aria-label": unref(props).headerCloseLabel
                          }, headerCloseAttrs.value, {
                            onClick: _cache[1] || (_cache[1] = ($event) => unref(hide)("close"))
                          }), null, 16, ["aria-label"]))
                        ], 64)) : createCommentVNode("", true)
                      ])
                    ], 16)) : createCommentVNode("", true),
                    createElementVNode("div", mergeProps({
                      id: `${unref(computedId)}-body`,
                      class: ["modal-body", bodyClasses.value]
                    }, unref(props).bodyAttrs), [
                      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        createTextVNode(toDisplayString(unref(props).body), 1)
                      ])
                    ], 16, _hoisted_2),
                    !unref(props).noFooter ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: normalizeClass(["modal-footer", footerClasses.value])
                    }, [
                      renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                        renderSlot(_ctx.$slots, "cancel", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                          !unref(props).okOnly ? (openBlock(), createBlock(_sfc_main$3, {
                            key: 0,
                            ref: "_cancelButton",
                            disabled: disableCancel.value,
                            size: unref(props).buttonSize,
                            variant: unref(props).cancelVariant,
                            class: normalizeClass(unref(props).cancelClass),
                            onClick: _cache[2] || (_cache[2] = ($event) => unref(hide)("cancel"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(props).cancelTitle), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled", "size", "variant", "class"])) : createCommentVNode("", true)
                        ]),
                        renderSlot(_ctx.$slots, "ok", normalizeProps(guardReactiveProps(sharedSlots.value)), () => [
                          createVNode(_sfc_main$3, {
                            ref: "_okButton",
                            disabled: disableOk.value,
                            size: unref(props).buttonSize,
                            variant: unref(props).okVariant,
                            class: normalizeClass(unref(props).okClass),
                            onClick: _cache[3] || (_cache[3] = ($event) => unref(hide)("ok"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(props).okTitle), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled", "size", "variant", "class"])
                        ])
                      ])
                    ], 2)) : createCommentVNode("", true)
                  ], 2)) : createCommentVNode("", true)
                ], 2),
                unref(needsFallback) ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  ref: "_fallbackFocusElement",
                  class: normalizeClass(fallbackClassSelector),
                  tabindex: "0",
                  style: { "width": "0", "height": "0", "overflow": "hidden" }
                }, null, 512)) : createCommentVNode("", true)
              ], 16, _hoisted_1), [
                [vShow, unref(showRef) && (unref(backdropReady) && unref(props).backdropFirst || !unref(props).backdropFirst)]
              ])
            ]),
            _: 3
          }, 16, ["appear"])) : createCommentVNode("", true),
          !unref(props).noBackdrop ? renderSlot(_ctx.$slots, "backdrop", normalizeProps(mergeProps({ key: 1 }, sharedSlots.value)), () => [
            unref(renderBackdropRef) ? (openBlock(), createBlock(Transition, normalizeProps(mergeProps({ key: 0 }, unref(backdropTransitionProps))), {
              default: withCtx(() => [
                withDirectives(createElementVNode("div", {
                  class: normalizeClass(["modal-backdrop", {
                    fade: !unref(computedNoAnimation),
                    show: unref(backdropVisible) || unref(computedNoAnimation),
                    ...sharedClasses.value
                  }]),
                  style: normalizeStyle(computedZIndexBackdrop.value),
                  onClick: _cache[5] || (_cache[5] = ($event) => unref(hide)("backdrop"))
                }, null, 6), [
                  [vShow, unref(showRef) || unref(isLeaving) && unref(props).backdropFirst && !unref(computedNoAnimation)]
                ])
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true)
          ]) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["to", "disabled"]);
    };
  }
});
const useModal = () => {
  const orchestratorRegistry = inject(orchestratorRegistryKey);
  if (!orchestratorRegistry) {
    throw Error(
      "useModal() must be called within setup(), and BApp, useRegistry or plugin must be installed/provided."
    );
  }
  const { store, _isOrchestratorInstalled } = orchestratorRegistry;
  const create = (obj = {}, options = {}) => {
    if (!_isOrchestratorInstalled.value) {
      throw new Error("BApp or BOrchestrator component must be mounted to use the modal controller");
    }
    const resolvedProps = isRef(obj) ? obj : shallowRef(obj);
    const _self = resolvedProps.value?.id || /* @__PURE__ */ Symbol("Modals controller");
    const promise = buildPromise(_self, store);
    promise.stop = watch(
      resolvedProps,
      (_newValue) => {
        const newValue = { ...toValue(_newValue) };
        const previousIndex = store.value.findIndex((el) => el._self === _self);
        const previous = previousIndex === -1 ? { _component: markRaw(_sfc_main) } : store.value[previousIndex];
        const v = {
          type: "modal",
          _self,
          position: "modal",
          ...previous,
          options,
          promise
        };
        for (const key in newValue) {
          if (key.startsWith("on")) {
            v[key] = newValue[key];
          } else if (key === "component" && newValue.component) {
            v._component = markRaw(newValue.component);
          } else if (key === "slots" && newValue.slots) {
            v.slots = markRaw(newValue.slots);
          } else {
            v[key] = toValue(newValue[key]);
          }
        }
        v.modelValue = v.modelValue ?? false;
        v["onUpdate:modelValue"] = (val) => {
          const onUpdateModelValue = newValue["onUpdate:modelValue"];
          onUpdateModelValue?.(val);
          const { modelValue } = toValue(obj);
          if (isRef(obj) && !isRef(modelValue)) obj.value.modelValue = val;
          if (isRef(modelValue) && !isReadonly(modelValue)) {
            modelValue.value = val;
          }
          const modal = store.value.find((el) => el._self === _self);
          if (modal) {
            modal.modelValue = val;
          }
        };
        if (previousIndex === -1) {
          store.value.push(v);
        } else {
          store.value.splice(previousIndex, 1, v);
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    onScopeDispose(() => {
      const modal = store.value.find((el) => el._self === _self);
      if (modal) {
        modal.promise.value.destroy?.();
      }
    }, true);
    return promise.value;
  };
  const { lastStack, stack, registry } = useSharedModalStack();
  const show = (id) => {
    if (id === void 0) {
      if (lastStack?.value) {
        lastStack?.value.exposed?.show();
      }
    } else {
      const stackModal = stack?.value.find((modal2) => modal2.exposed?.id === id);
      if (stackModal) {
        stackModal.exposed?.show();
        return;
      }
      const modal = store.value.find((el) => el._self === id);
      if (modal) {
        modal.modelValue = true;
        modal["onUpdate:modelValue"]?.(true);
      } else {
        stack?.value.forEach((modal2) => {
          if (modal2.exposed?.id === id) {
            modal2.exposed?.show();
          }
        });
      }
    }
  };
  const hide = (trigger, id) => {
    if (id === void 0) {
      if (lastStack?.value) {
        lastStack?.value.exposed?.hide(trigger);
      }
    } else {
      const stackModal = stack?.value.find((modal2) => modal2.exposed?.id === id);
      if (stackModal) {
        stackModal.exposed?.hide(trigger);
        return;
      }
      const modal = store.value.find((el) => el._self === id);
      if (modal) {
        modal.modelValue = false;
        modal["onUpdate:modelValue"]?.(false);
      } else {
        stack?.value.forEach((modal2) => {
          if (modal2.exposed?.id === id) {
            modal2.exposed?.hide(trigger, true);
          }
        });
      }
    }
  };
  const hideAll = (trigger) => {
    stack?.value.forEach((modal) => {
      modal.exposed?.hide(trigger, true);
    });
  };
  const get = (id) => {
    const modal = store.value.find((el) => el._self === id);
    if (modal) {
      return {
        modal,
        show() {
          modal?.promise.value.show();
        },
        hide(trigger) {
          modal?.promise.value.hide(trigger);
        }
      };
    }
    if (registry?.value) {
      for (const [, modal2] of registry?.value.entries() ?? []) {
        if (toValue(modal2.exposed?.id) === id) {
          return {
            modal: modal2,
            show() {
              modal2.exposed?.show();
            },
            hide(trigger) {
              modal2.exposed?.hide(trigger, true);
            }
          };
        }
      }
    }
    return null;
  };
  const instance = getCurrentInstance();
  const current = () => {
    const findBModal = (component) => {
      if (!component.parent) {
        return null;
      }
      if (component.parent.type === _sfc_main) {
        return component.parent;
      }
      return findBModal(component.parent);
    };
    if (!instance) {
      return null;
    }
    const modalComponent = computed(() => findBModal(instance));
    const modal = computed(() => modalComponent.value?.proxy);
    return {
      show() {
        modalComponent.value?.exposed?.show();
      },
      hide(trigger) {
        modalComponent.value?.exposed?.hide(trigger, true);
      },
      modal
    };
  };
  return {
    show,
    hide,
    hideAll,
    get,
    current,
    create,
    _isOrchestratorInstalled,
    store
    // Todo: Supports listening events globally in the future
  };
};
export {
  _newOrchestratorRegistry as _,
  _sfc_main as a,
  useModal as b,
  getElement as g,
  useShowHide as u
};
//# sourceMappingURL=index-CyEArZ56.js.map
