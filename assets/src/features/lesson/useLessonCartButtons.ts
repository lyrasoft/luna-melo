import { delegate, route, simpleAlert, useHttpClient } from '@windwalker-io/unicorn-next';

export function useLessonCartButtons(selector = '[data-task=buy]') {
  listen(selector);

  return {
    off,
    buy,
    toCartPage,
    sendAddAction,
  };
}

let isListening = false;

function buttonClicked(e: Event)  {
  buy(e.currentTarget as HTMLElement);
}

function listen(selector = '[data-task=buy]') {
  if (isListening) {
    return;
  }

  isListening = true;

  delegate(document.body, selector, 'click', buttonClicked);
}

function off() {
  document.body.removeEventListener('click', buttonClicked);

  isListening = false;
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
