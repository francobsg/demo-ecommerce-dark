function formatearCheckoutPrecio(valor) {
  return typeof formatearPrecio === 'function'
    ? formatearPrecio(valor)
    : `USD ${Number(valor).toFixed(2)}`;
}

function renderCheckout() {
  const carrito = obtenerCarrito();
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');

  if (!checkoutItems || !checkoutTotal) return;

  if (carrito.length === 0) {
    checkoutItems.innerHTML = '<p class="checkout-empty">Tu carrito est&aacute; vac&iacute;o. Agrega productos primero.</p>';
    checkoutTotal.textContent = 'USD 0.00';
    return;
  }

  let total = 0;
  checkoutItems.innerHTML = '';

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemRow = document.createElement('div');
    itemRow.className = 'checkout-item';
    itemRow.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small>${item.cantidad} x ${formatearCheckoutPrecio(item.precio)}</small>
      </div>
      <div>${formatearCheckoutPrecio(subtotal)}</div>
    `;
    checkoutItems.appendChild(itemRow);
  });

  document.querySelectorAll('[data-extra-price]:checked').forEach(extra => {
    total += Number(extra.dataset.extraPrice) || 0;
  });

  checkoutTotal.textContent = formatearCheckoutPrecio(total);
}

document.addEventListener('DOMContentLoaded', function() {
  renderCheckout();

  const form = document.getElementById('shippingForm');
  const deliveryFields = document.getElementById('deliveryFields');
  const pickupNote = document.getElementById('pickupNote');
  const commentsGroup = document.getElementById('checkoutCommentsGroup');
  const giftNote = document.getElementById('giftNote');
  const giftNoteField = document.getElementById('giftNoteField');
  const giftNoteText = document.getElementById('giftNoteText');
  const deliveryInputs = deliveryFields ? deliveryFields.querySelectorAll('input') : [];

  function actualizarModoEntrega() {
    const modo = document.querySelector('input[name="deliveryMode"]:checked')?.value || 'envio';
    const esEnvio = modo === 'envio';

    if (deliveryFields) deliveryFields.hidden = !esEnvio;
    if (pickupNote) pickupNote.hidden = esEnvio;
    if (commentsGroup) commentsGroup.hidden = !esEnvio;

    deliveryInputs.forEach(input => {
      input.required = esEnvio;
    });
  }

  function actualizarNotaRegalo() {
    const notaActiva = Boolean(giftNote?.checked);

    if (giftNoteField) giftNoteField.hidden = !notaActiva;
    if (giftNoteText) {
      giftNoteText.disabled = !notaActiva;
      giftNoteText.required = notaActiva;
      if (!notaActiva) giftNoteText.value = '';
    }
  }

  document.querySelectorAll('input[name="deliveryMode"]').forEach(input => {
    input.addEventListener('change', actualizarModoEntrega);
  });

  document.querySelectorAll('[data-extra-price]').forEach(input => {
    input.addEventListener('change', renderCheckout);
  });

  giftNote?.addEventListener('change', actualizarNotaRegalo);
  actualizarModoEntrega();
  actualizarNotaRegalo();

  form?.addEventListener('submit', function(event) {
    event.preventDefault();

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      alert('Tu carrito esta vacio');
      return;
    }

    if (!form.reportValidity()) return;
    finalizarCompraConVideo();
    renderCheckout();
  });
});
