import { ApiReturn, delegate, route, simpleAlert, useHttpClient, useUnicorn } from '@windwalker-io/unicorn-next';
import { CartItem } from '~melo/types';

export function useLessonCartButtons(selector?: string) {
  listen(selector);

  return {
    off,
    buy,
    toCartPage,
    add,
    updateCartButtons,
  };
}

let isListening = false;

async function buttonClicked(e: Event)  {
  const { isAxiosError } = await useHttpClient();

  try {
    buy((e.target as HTMLElement).dataset.id);
  } catch (e) {
    if (isAxiosError(e)) {
      simpleAlert(e.message, '', 'warning');
    }
    return;
  }
}

function listen(selector?: string) {
  if (!selector) {
    return;
  }

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

async function add(id: any, data?: Record<string, any>) {
  return sendAddAction(id, data);
}

async function buy(id: any, data?: Record<string, any>) {
  await sendAddAction(id, data);

  toCartPage();
}

async function sendAddAction(id: any, data?: Record<string, any>): Promise<CartItem[]> {
  if (!id) {
    throw new Error('No lesson ID');
  }

  const { post } = await useHttpClient();

  try {
    const res = await post<ApiReturn<CartItem[]>>(
      '@melo_cart_ajax/addToCart',
      {
        id,
        data,
      }
    );

    updateCartButtons(res.data.data);

    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function toCartPage(open = false) {
  const url = route('melo_cart');

  if (open) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

export interface UpdateCartButtonsOptions {
  buttonSelector?: string;
  badgeSelector?: string;
}

function updateCartButtons(items: CartItem[], options: UpdateCartButtonsOptions = {}) {
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

  const $cartButtons = document.querySelectorAll<HTMLButtonElement>(
    options.buttonSelector || '[data-melo-role=cart-button]'
  );

  for (const $cartButton of $cartButtons) {
    const $cartQuantity = $cartButton.querySelector<HTMLDivElement>(
      options.badgeSelector || '[data-melo-role=cart-quantity]'
    );

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
