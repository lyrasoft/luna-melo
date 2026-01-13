import { delegate, route, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';

export function useLessonCartButtons() {
  function listen(selector = '[data-task=buy]') {
    delegate(document.body, selector, 'click', (e) => {
      buy(e.currentTarget as HTMLElement);
    });
  }

  async function sendAddAction(el: HTMLElement) {
    const lessonId = el.dataset.id;

    if (!lessonId) {
      throw new Error('No lesson ID');
    }

    const { post } = await useHttpClient();

    try {
      const res = await post(
        '@melo_cart_ajax/addToCart',
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
    location.href = route('melo_cart');
  }

  return {
    listen,
    buy,
    toCartPage,
    sendAddAction,
  };
}
