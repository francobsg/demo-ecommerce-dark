/**
 * CARRITO: gestión de productos, cantidades, descuentos y checkout demostrativo.
 * PERSONALIZAR: edita productos, cupones y textos según la tienda del comprador.
 */

// ==================== PRODUCTOS DE EJEMPLO ====================
// PERSONALIZAR PRODUCTOS:
// 1) Cambia nombre, categoría, precio, stock y tallas.
// 2) Reemplaza imgUrl por tus imágenes dentro de img/productos/.
// 3) Si agregas nuevas categorías, actualiza también los filtros en productos.html.
// 4) Mantén IDs únicos para que el carrito funcione correctamente.
const productos = [
  {
    id: 1,
    nombre: "Polera básica",
    categoria: "ropa",
    talla: "M",
    sizes: ["S", "M", "L", "XL"],
    precio: 29.99,
    stock: 20,
    imgUrl: "img/productos/producto-01.svg"
  },
  {
    id: 2,
    nombre: "Chaqueta urbana",
    categoria: "ropa",
    talla: "L",
    sizes: ["S", "M", "L", "XL"],
    precio: 49.99,
    stock: 12,
    imgUrl: "img/productos/producto-02.svg"
  },
  {
    id: 3,
    nombre: "Pantalón cargo",
    categoria: "ropa",
    talla: "M",
    sizes: ["S", "M", "L", "XL"],
    precio: 39.99,
    stock: 15,
    imgUrl: "img/productos/producto-03.svg"
  },
  {
    id: 4,
    nombre: "Zapatilla casual",
    categoria: "calzado",
    talla: "40",
    sizes: ["38", "39", "40", "41", "42"],
    precio: 59.99,
    stock: 10,
    imgUrl: "img/productos/producto-04.svg"
  },
  {
    id: 5,
    nombre: "Gorro premium",
    categoria: "accesorios",
    talla: "Única",
    sizes: ["Única"],
    precio: 19.99,
    stock: 25,
    imgUrl: "img/productos/producto-05.svg"
  },
  {
    id: 6,
    nombre: "Bolso compacto",
    categoria: "accesorios",
    talla: "Única",
    sizes: ["Única"],
    precio: 34.99,
    stock: 18,
    imgUrl: "img/productos/producto-06.svg"
  },
  {
    id: 7,
    nombre: "Hoodie oversize",
    categoria: "ropa",
    talla: "XL",
    sizes: ["S", "M", "L", "XL"],
    precio: 44.99,
    stock: 14,
    imgUrl: "img/productos/producto-07.svg"
  },
  {
    id: 8,
    nombre: "Lentes de sol",
    categoria: "accesorios",
    talla: "Única",
    sizes: ["Única"],
    precio: 24.99,
    stock: 22,
    imgUrl: "img/productos/producto-08.svg"
  }
];

// Códigos de descuento válidos
const codigoDescuentos = {
  'BIENVENIDA': 0.10,  // 10% descuento
  'VERANO2026': 0.15,  // 15% descuento
  'CLIENTE5': 0.05     // 5% descuento
};

/**
 * Obtener carrito del localStorage
 * @returns {Array} Array con items del carrito
 */
function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

/**
 * Guardar carrito en localStorage
 * @param {Array} carrito - Array de items a guardar
 */
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Formatear precios en moneda internacional.
 * PERSONALIZAR: cambia 'USD' por otra moneda si el comprador lo necesita.
 * Ejemplos: 'EUR', 'GBP', 'MXN', 'CLP'.
 * @param {Number} valor - Precio o monto a mostrar
 * @returns {String} Precio formateado con dos decimales
 */
function formatearPrecio(valor) {
  return `USD ${Number(valor).toFixed(2)}`;
}

function mostrarNotificacionCarrito(nombreProducto) {
  let contenedor = document.getElementById('cartToastContainer');

  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'cartToastContainer';
    contenedor.className = 'cart-toast-container';
    document.body.appendChild(contenedor);
  }

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <div class="cart-toast-content">
      <strong>Producto añadido al carrito</strong>
      <span>${nombreProducto}</span>
    </div>
    <button type="button" class="cart-toast-close" aria-label="Cerrar notificación">x</button>
  `;

  let timeoutId;

  function cerrarToast(cierreManual = false) {
    clearTimeout(timeoutId);
    toast.classList.add(cierreManual ? 'closing-fade' : 'closing-up');
    setTimeout(() => {
      toast.remove();
      if (contenedor && contenedor.children.length === 0) {
        contenedor.remove();
      }
    }, 420);
  }

  toast.querySelector('.cart-toast-close')?.addEventListener('click', function() {
    cerrarToast(true);
  });

  contenedor.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  timeoutId = setTimeout(() => cerrarToast(false), 10000);
}

function mostrarModalCompraFinalizada() {
  if (document.getElementById('purchaseVideoModal')) return;

  const modal = document.createElement('div');
  modal.id = 'purchaseVideoModal';
  modal.className = 'purchase-video-modal';
  modal.innerHTML = `
    <div class="purchase-video-backdrop"></div>
    <section class="purchase-video-card" role="dialog" aria-modal="true" aria-labelledby="purchaseVideoTitle">
      <button type="button" class="purchase-video-close" aria-label="Cerrar">x</button>
      <div class="purchase-video-copy">
        <span>Compra finalizada</span>
        <h2 id="purchaseVideoTitle">Gracias por comprar en [NOMBRE DE TU TIENDA]</h2>
      </div>
      <p class="purchase-video">Pedido confirmado correctamente. Puedes conectar este flujo con una pasarela de pago real.</p>
      <button type="button" class="btn-primary purchase-video-finish">Volver al inicio</button>
    </section>
  `;

  function cerrarModal() {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.remove();
      window.location.href = 'index.html';
    }, 360);
  }

  modal.querySelector('.purchase-video-close')?.addEventListener('click', cerrarModal);
  modal.querySelector('.purchase-video-backdrop')?.addEventListener('click', cerrarModal);
  modal.querySelector('.purchase-video-finish')?.addEventListener('click', cerrarModal);

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('visible'));
}

function finalizarCompraConVideo() {
  guardarCarrito([]);
  localStorage.removeItem('descuentoAplicado');
  actualizarBadgeCarrito();
  actualizarBurbujaCarrito();
  mostrarModalCompraFinalizada();
}

/**
 * Agregar producto al carrito
 * @param {Number} productoId - ID del producto a agregar
 * @param {Number} cantidad - Cantidad a agregar
 */
function agregarAlCarrito(productoId, cantidad = 1, talla = 'Única') {
  // Validar que el producto existe
  const producto = productos.find(p => String(p.id) === String(productoId));
  if (!producto) {
    console.error('Producto no encontrado');
    return false;
  }

  // Validar cantidad disponible
  if (cantidad > producto.stock) {
    alert(`Solo hay ${producto.stock} unidades disponibles`);
    return false;
  }

  // Obtener carrito actual
  let carrito = obtenerCarrito();

  // Buscar si el producto ya está en el carrito con la misma talla
  const itemExistente = carrito.find(item => String(item.id) === String(productoId) && item.talla === talla);

  if (itemExistente) {
    // Si existe, aumentar cantidad
    itemExistente.cantidad += cantidad;
    if (itemExistente.cantidad > producto.stock) {
      itemExistente.cantidad = producto.stock;
      alert(`Stock limitado a ${producto.stock} unidades`);
    }
  } else {
    // Si no existe, crear nuevo item
    carrito.push({
      id: String(producto.id),
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      talla: talla,
      cantidad: cantidad
    });
  }

  // Guardar carrito y mostrar confirmación
  guardarCarrito(carrito);
  registrarVenta(productoId);
  mostrarNotificacionCarrito(producto.nombre);
  actualizarBadgeCarrito();
  actualizarBurbujaCarrito();
  if (typeof renderMasVendidos === 'function') {
    renderMasVendidos();
  }
  return true;
}

function obtenerContadoresVentas() {
  const datos = localStorage.getItem('ventasContador');
  return datos ? JSON.parse(datos) : {};
}

function guardarContadoresVentas(contadores) {
  localStorage.setItem('ventasContador', JSON.stringify(contadores));
}

function registrarVenta(productoId) {
  const contadores = obtenerContadoresVentas();
  const key = String(productoId);
  contadores[key] = (contadores[key] || 0) + 1;
  guardarContadoresVentas(contadores);
}

function obtenerTopVendidos(cantidad = null) {
  const contadores = obtenerContadoresVentas();
  const ordenados = [...productos]
    .sort((a, b) => (contadores[String(b.id)] || 0) - (contadores[String(a.id)] || 0));

  return cantidad ? ordenados.slice(0, cantidad) : ordenados;
}

/**
 * Eliminar producto del carrito
 * @param {Number} productoId - ID del producto a eliminar
 */
function eliminarDelCarrito(productoId, talla = null) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => {
    if (talla === null) {
      return String(item.id) !== String(productoId);
    }
    return !(String(item.id) === String(productoId) && item.talla === talla);
  });
  guardarCarrito(carrito);
  actualizarBadgeCarrito();
  mostrarCarrito(); // Actualizar vista si estamos en la página del carrito
  if (typeof renderMasVendidos === 'function') {
    renderMasVendidos();
  }
  actualizarBurbujaCarrito();
  return true;
}

/**
 * Actualizar cantidad de un producto en el carrito
 * @param {Number} productoId - ID del producto
 * @param {Number} cantidad - Nueva cantidad
 */
function actualizarCantidadCarrito(productoId, cantidad, talla = null) {
  cantidad = parseInt(cantidad, 10);
  if (isNaN(cantidad)) return;

  let carrito = obtenerCarrito();
  const item = carrito.find(item => String(item.id) === String(productoId) && (talla === null || item.talla === talla));
  
  if (item) {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId, talla);
    } else {
      item.cantidad = cantidad;
      guardarCarrito(carrito);
      actualizarBadgeCarrito();
      actualizarResumenCompra();
    }
  }
}

/**
 * Actualizar el badge del carrito en la navegación
 */
function actualizarBadgeCarrito() {
  const carrito = obtenerCarrito();
  const badge = document.getElementById('cartBadge');
  
  if (badge) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;
  }
}

/**
 * Mostrar items del carrito en la tabla
 */
function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const carritoBody = document.getElementById('carritoBody');
  const carritoVacio = document.getElementById('carritoVacio');
  const carritoTable = document.getElementById('carritoTable');

  if (!carritoBody) return; // No estamos en la página del carrito

  if (carrito.length === 0) {
    carritoTable.style.display = 'none';
    carritoVacio.style.display = 'block';
    return;
  }

  carritoTable.style.display = 'table';
  carritoVacio.style.display = 'none';
  carritoBody.innerHTML = '';

  // Iterar sobre items del carrito
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    const fila = document.createElement('tr');
    
    fila.innerHTML = `
      <td>
        <div>
          <strong>${item.nombre}</strong><br>
          <small>Talla: ${item.talla}</small>
        </div>
      </td>
      <td>${formatearPrecio(item.precio)}</td>
      <td>
        <input type="number" min="1" value="${item.cantidad}" 
               onchange="actualizarCantidadCarrito(${JSON.stringify(item.id)}, this.value, ${JSON.stringify(item.talla)})"
               style="width: 60px; padding: 0.4rem;">
      </td>
      <td>${formatearPrecio(subtotal)}</td>
      <td>
        <button class="btn-remove" onclick="eliminarDelCarrito(${JSON.stringify(item.id)}, ${JSON.stringify(item.talla)})">
          Eliminar
        </button>
      </td>
    `;
    
    carritoBody.appendChild(fila);
  });

  actualizarResumenCompra();
}

/**
 * Calcular y mostrar resumen de compra
 */
function actualizarResumenCompra() {
  const carrito = obtenerCarrito();
  const descuentoAplicado = parseFloat(localStorage.getItem('descuentoAplicado') || '0');

  // Calcular subtotal
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Calcular envío demostrativo: gratis si la compra supera USD 50.00
  const envio = subtotal === 0 ? 0 : (subtotal > 50 ? 0 : 5.00);

  // Aplicar descuento
  const montoDescuento = subtotal * descuentoAplicado;

  // Calcular total
  const total = subtotal + envio - montoDescuento;

  // Actualizar elementos en el DOM
  const elementosResumen = {
    'subtotal': subtotal,
    'envio': envio,
    'descuento': montoDescuento,
    'total': total
  };

  for (const [elemento, valor] of Object.entries(elementosResumen)) {
    const el = document.getElementById(elemento);
    if (el) {
      el.textContent = formatearPrecio(valor);
    }
  }
}

/**
 * Aplicar código de descuento
 */
function aplicarDescuento() {
  const codigo = document.getElementById('codigoDescuento')?.value.toUpperCase();
  
  if (!codigo) {
    alert('Por favor ingresa un código');
    return;
  }

  if (codigoDescuentos[codigo]) {
    const porcentaje = codigoDescuentos[codigo] * 100;
    localStorage.setItem('descuentoAplicado', codigoDescuentos[codigo]);
    alert(`¡Código válido! Descuento de ${porcentaje}% aplicado`);
    actualizarResumenCompra();
    document.getElementById('codigoDescuento').value = '';
    actualizarBurbujaCarrito();
  } else {
    alert('Código de descuento inválido');
  }
}

function obtenerPosicionBurbuja() {
  const datos = localStorage.getItem('floatingCartPosition');
  return datos ? JSON.parse(datos) : null;
}

function guardarPosicionBurbuja(posicion) {
  localStorage.setItem('floatingCartPosition', JSON.stringify(posicion));
}


function limitarPosicion(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

function ajustarPosicionBurbujaAlViewport(bubble) {
  if (!bubble) return;

  const margen = window.innerWidth <= 600 ? 12 : 10;
  const ancho = bubble.offsetWidth || 72;
  const alto = bubble.offsetHeight || 72;
  const maxX = Math.max(margen, window.innerWidth - ancho - margen);
  const maxY = Math.max(margen, window.innerHeight - alto - margen);

  let x = bubble.offsetLeft;
  let y = bubble.offsetTop;

  x = limitarPosicion(Number.isFinite(x) ? x : maxX, margen, maxX);
  y = limitarPosicion(Number.isFinite(y) ? y : maxY, margen, maxY);

  bubble.style.left = x + 'px';
  bubble.style.top = y + 'px';
  bubble.style.right = 'auto';
  bubble.style.bottom = 'auto';
  guardarPosicionBurbuja({ left: Math.round(x), top: Math.round(y) });
}

function actualizarBurbujaCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('floatingCartCount');
  if (badge) {
    badge.textContent = totalItems > 0 ? totalItems : '0';
  }
}

function cerrarPanelCarrito() {
  const panel = document.getElementById('floatingCartPanel');
  if (panel) {
    panel.classList.remove('open');
  }
}

function renderizarPanelCarrito() {
  const carrito = obtenerCarrito();
  const itemsContenedor = document.getElementById('floatingCartItems');
  const totalElemento = document.getElementById('floatingCartTotal');

  if (!itemsContenedor || !totalElemento) return;

  if (carrito.length === 0) {
    itemsContenedor.innerHTML = '<div class="floating-cart-empty">Tu carrito está vacío</div>';
    totalElemento.textContent = formatearPrecio(0);
    return;
  }

  let total = 0;
  itemsContenedor.innerHTML = '';

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'floating-cart-item';
    itemDiv.innerHTML = `
      <div>
        <strong>${item.nombre}</strong>
        <small>${item.cantidad} x ${formatearPrecio(item.precio)} • Talla: ${item.talla}</small>
      </div>
      <div>
        <div>${formatearPrecio(subtotal)}</div>
        <button class="btn-remove floating-remove-btn" data-id="${item.id}" data-talla="${item.talla}">Eliminar</button>
      </div>
    `;

    itemsContenedor.appendChild(itemDiv);
  });

  totalElemento.textContent = formatearPrecio(total);

  itemsContenedor.querySelectorAll('.floating-remove-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.dataset.id;
      const talla = this.dataset.talla;
      eliminarDelCarrito(id, talla);
      renderizarPanelCarrito();
    });
  });
}

function togglePanelCarrito() {
  const panel = document.getElementById('floatingCartPanel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    renderizarPanelCarrito();
  }
}

function inicializarCarritoFlotante() {
  if (document.getElementById('floatingCartBubble')) return;

  const bubble = document.createElement('div');
  bubble.id = 'floatingCartBubble';
  bubble.innerHTML = `
    <div class="floating-cart-icon">🛒</div>
    <div class="floating-cart-count" id="floatingCartCount">0</div>
  `;

  const panel = document.createElement('div');
  panel.id = 'floatingCartPanel';
  panel.innerHTML = `
    <div class="floating-cart-header">
      <h3>Tu carrito</h3>
      <button type="button" class="floating-cart-close" id="floatingCartClose">×</button>
    </div>
    <div class="floating-cart-items" id="floatingCartItems"></div>
    <div class="floating-cart-summary">
      <div class="total-line"><span>Total</span><span id="floatingCartTotal">USD 0.00</span></div>
    </div>
    <div class="floating-cart-actions">
      <button type="button" class="btn-secondary" id="floatingCartContinue">Continuar Comprando</button>
      <button type="button" class="btn-primary" id="floatingCartPay">Pagar</button>
    </div>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(bubble);

  const posicionGuardada = obtenerPosicionBurbuja();
  if (posicionGuardada) {
    bubble.style.left = posicionGuardada.left + 'px';
    bubble.style.top = posicionGuardada.top + 'px';
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
  }

  // Evita que una posición guardada en escritorio deje la burbuja fuera del teléfono.
  ajustarPosicionBurbujaAlViewport(bubble);

  let isDragging = false;
  let wasDragged = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let targetX = bubble.offsetLeft;
  let targetY = bubble.offsetTop;
  let currentX = targetX;
  let currentY = targetY;
  let dragAnimationId = null;

  function animarArrastre() {
    currentX += (targetX - currentX) * 0.24;
    currentY += (targetY - currentY) * 0.24;

    bubble.style.left = currentX + 'px';
    bubble.style.top = currentY + 'px';
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';

    const distancia = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
    if (isDragging || distancia > 0.6) {
      dragAnimationId = requestAnimationFrame(animarArrastre);
    } else {
      currentX = targetX;
      currentY = targetY;
      bubble.style.left = currentX + 'px';
      bubble.style.top = currentY + 'px';
      dragAnimationId = null;
      guardarPosicionBurbuja({ left: Math.round(currentX), top: Math.round(currentY) });
    }
  }

  bubble.addEventListener('pointerdown', function(e) {
    isDragging = true;
    wasDragged = false;
    dragOffsetX = e.clientX - bubble.offsetLeft;
    dragOffsetY = e.clientY - bubble.offsetTop;
    targetX = bubble.offsetLeft;
    targetY = bubble.offsetTop;
    currentX = targetX;
    currentY = targetY;
    bubble.classList.add('dragging');
    if (!dragAnimationId) {
      dragAnimationId = requestAnimationFrame(animarArrastre);
    }
    bubble.setPointerCapture(e.pointerId);
  });

  bubble.addEventListener('pointermove', function(e) {
    if (!isDragging) return;
    const x = Math.min(Math.max(10, e.clientX - dragOffsetX), window.innerWidth - bubble.offsetWidth - 10);
    const y = Math.min(Math.max(10, e.clientY - dragOffsetY), window.innerHeight - bubble.offsetHeight - 10);
    if (Math.abs(x - targetX) + Math.abs(y - targetY) > 3) {
      wasDragged = true;
    }
    targetX = x;
    targetY = y;
  });

  bubble.addEventListener('pointerup', function() {
    if (!isDragging) return;
    isDragging = false;
    bubble.classList.remove('dragging');
  });

  bubble.addEventListener('click', function() {
    if (wasDragged) {
      wasDragged = false;
      return;
    }
    togglePanelCarrito();
  });

  document.getElementById('floatingCartClose')?.addEventListener('click', cerrarPanelCarrito);
  document.getElementById('floatingCartContinue')?.addEventListener('click', cerrarPanelCarrito);
  document.getElementById('floatingCartPay')?.addEventListener('click', function() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    window.location.href = 'checkout.html';
  });

  window.addEventListener('resize', function() {
    ajustarPosicionBurbujaAlViewport(bubble);
  });

  actualizarBurbujaCarrito();
}

// Event listener para botón de descuento
document.addEventListener('DOMContentLoaded', function() {
  const botonDescuento = document.getElementById('aplicarCupon');
  if (botonDescuento) {
    botonDescuento.addEventListener('click', aplicarDescuento);
  }

  // Botón de checkout
  const botonCheckout = document.querySelector('.btn-checkout');
  if (botonCheckout) {
    botonCheckout.addEventListener('click', function() {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  // Header fijo con ocultación al hacer scroll
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.navbar');
  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.scrollY;
      if (window.innerWidth <= 820) {
        header.style.top = '0';
        lastScrollY = currentScroll;
        return;
      }
      if (currentScroll > lastScrollY && currentScroll > 80) {
        header.style.top = '-120px';
      } else {
        header.style.top = '0';
      }
      lastScrollY = currentScroll;
    });
  }

  inicializarCarritoFlotante();
});
