import { ApiReturn, delegate, route, simpleAlert, useHttpClient, useUnicorn } from '@windwalker-io/unicorn-next';
import { CartItem } from '~melo/types';

export function useLessonCartButtons(selector = '[data-melo-task=buy]', quantitySelector = '') {
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

function listen(selector = '[data-melo-task=buy]') {
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
    const res = await post<ApiReturn<CartItem[]>>(
      '@melo_cart_ajax/addToCart',
      {
        id: lessonId,
      }
    );

    updateCartButton(res.data.data);

    return res.data.data;
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

function updateCartButton(items: CartItem[]) {
  const count = items.length;

  const u = useUnicorn();

  u.trigger('melo.cart.update', items, count);

  document.dispatchEvent(
    new CustomEvent('melo.cart.update', {
      detail: {
        items,
        count
      }
    })
  );

  const $cartButtons = document.querySelectorAll<HTMLButtonElement>('[data-melo-role=cart-button]');

  for (const $cartButton of $cartButtons) {
    const $cartQuantity = $cartButton.querySelector<HTMLDivElement>('[data-melo-role=cart-quantity]');

    $cartButton.classList.toggle('h-has-items', count > 0);

    if ($cartQuantity) {
      $cartQuantity.textContent = String(count);
    }

    $cartButton.dispatchEvent(
      new CustomEvent('melo.cart.update', {
        detail: {
          items,
          count
        }
      })
    );
  }
}
