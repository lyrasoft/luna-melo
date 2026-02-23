import { sleep } from "@windwalker-io/unicorn-next";
async function sleepMax(start, max) {
  const elapsed = Date.now() - start;
  if (elapsed < max) {
    await sleep(max - elapsed);
  }
}
export {
  sleepMax as s
};
//# sourceMappingURL=timing.js.map
