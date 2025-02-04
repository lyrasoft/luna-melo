import '@main';

u.delegate(document, '[data-task=buy]', 'click', (e) => {
  buy(e.currentTarget);
});

async function sendAddAction(el) {
  const lessonId = el.dataset.id;

  if (!lessonId) {
    throw new Error('No lesson ID');
  }

  try {
    const res = await u.$http.post(
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

async function buy(el) {
  try {
    await sendAddAction(el);
  } catch (e) {
    u.alert(e.message, '', 'warning');
    return;
  }

  toCartPage();
}

function toCartPage() {
  location.href = u.route('cart');
}
