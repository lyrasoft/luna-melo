import { inject, provide } from "vue";
function useQuestionPresenter() {
  const defines = inject("question.defines", {});
  function provideDefines(defines2) {
    provide("question.defines", defines2);
  }
  function getDefines() {
    return defines || {};
  }
  function typeToTitle(type) {
    return defines?.[type]?.title || type;
  }
  function typeToDescription(type) {
    return defines?.[type]?.description || "";
  }
  function typeToIcon(type) {
    return defines?.[type]?.icon || "fas fa-question-circle";
  }
  function scoreLimit(score) {
    if (score > 100) {
      return 100;
    }
    if (score < 1) {
      return 1;
    }
    return score;
  }
  return {
    provideDefines,
    getDefines,
    typeToTitle,
    typeToDescription,
    typeToIcon,
    scoreLimit
  };
}
export {
  useQuestionPresenter as u
};
//# sourceMappingURL=useQuestionPresenter.js.map
