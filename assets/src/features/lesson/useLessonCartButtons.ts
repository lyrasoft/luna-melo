import { delegate, route, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';

export function useLessonCartButtons() {
  delegate(document.body, '[data-task=buy]', 'click', (e) => {
    buy(e.currentTarget as HTMLElement);
  });

  async function sendAddAction(el: HTMLElement) {
    const lessonId = el.dataset.id;

    if (!lessonId) {
      throw new Error('No lesson ID');
    }

    const { post } = await useHttpClient();

    try {
      const res = await post(
        '@cart_ajax/addToCart',
        {
          id: lessonId,
        }
      );

      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function buy(el: HTMLElement) {
    const { isAxiosError } = await useHttpClient();

    try {
      await sendAddAction(el);
    } catch (e) {
      if (isAxiosError(e)) {
        simpleAlert(e.message, '', 'warning');
      }
      return;
    }

    toCartPage();
  }

  function toCartPage() {
    location.href = route('cart');
  }

  return {
    buy,
    toCartPage,
    sendAddAction,
  };
}
