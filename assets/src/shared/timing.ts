import { sleep } from '@windwalker-io/unicorn-next';

export async function sleepMax(start: number, max: number) {
  const elapsed = Date.now() - start;

  if (elapsed < max) {
    await sleep(max - elapsed);
  }
}

