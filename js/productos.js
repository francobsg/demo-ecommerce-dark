/**
 * PRODUCTOS: carga y visualización del catálogo.
 * PERSONALIZAR: los productos se editan en js/carrito.js, array "productos".
 */

function precioProducto(valor) {
  return typeof formatearPrecio === 'function'
    ? formatearPrecio(valor)
    : `USD ${Number(valor).toFixed(2)}`;
}

function normalizarTexto(texto) {
  return texto
    ? texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : '';
}

function renderizarProductos(lista) {
  const productosGrid = document.getElementById('productosGrid');
  if (!productosGrid) return;
  productosGrid.innerHTML = '';
  lista.forEach(producto => {
    const card = crearCardProducto(producto);
    productosGrid.appendChild(card);
  });
}

function cargarProductos() {
  renderizarProductos(productos);
}

/**
 * Crear elemento HTML de card de producto
 * @param {Object} producto - Datos del producto
 * @returns {HTMLElement} Card del producto
 */
function crearCardProducto(producto) {
  // Crear contenedor principal
  const card = document.createElement('div');
  card.className = 'producto-card';
  card.setAttribute('data-id', producto.id);
  card.setAttribute('data-categoria', producto.categoria);
  card.setAttribute('data-precio', producto.precio);
  card.setAttribute('data-talla', producto.talla);

  // Definir emojis por categoría
  const emojisCategoria = {
    'ropa': '👕',
    'accesorios': '👜',
    'calzado': '👟'
  };

  const emoji = emojisCategoria[producto.categoria] || '👗';
  const tallas = producto.sizes && producto.sizes.length ? producto.sizes : [producto.talla || 'Única'];

  // Crear imagen o placeholder si no hay URL
  const imgDiv = document.createElement('div');
  imgDiv.className = 'producto-img';
  if (producto.imgUrl) {
    const img = document.createElement('img');
    img.src = producto.imgUrl;
    img.alt = producto.nombre;
    img.loading = 'lazy';
    img.className = 'producto-thumb';
    imgDiv.appendChild(img);
  } else {
    imgDiv.textContent = emoji;
  }

  // Crear info del producto
  const info = document.createElement('div');
  info.className = 'producto-info';

  // Nombre
  const nombre = document.createElement('div');
  nombre.className = 'producto-nombre';
  nombre.textContent = producto.nombre;

  // Categoría
  const categoria = document.createElement('div');
  categoria.className = 'producto-categoria';
  categoria.textContent = producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1);

  // Selector de talla
  const selectorTalla = document.createElement('select');
  selectorTalla.className = 'producto-size-selector';
  tallas.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = t;
    selectorTalla.appendChild(option);
  });

  // Precio
  const precio = document.createElement('div');
  precio.className = 'producto-precio';
  precio.textContent = precioProducto(producto.precio);

  // Tallas disponibles
  const tallasList = document.createElement('div');
  tallasList.className = 'producto-tallas-list';
  tallasList.textContent = `Tallas disponibles: ${tallas.join(', ')}`;

  // Stock
  const stock = document.createElement('div');
  stock.className = `producto-stock ${producto.stock > 0 ? 'en-stock' : 'sin-stock'}`;
  stock.textContent = producto.stock > 0 ? `📦 En stock (${producto.stock})` : '❌ Sin stock';

  // Botón agregar al carrito
  const btnAgregar = document.createElement('button');
  btnAgregar.className = 'btn-add-cart';
  btnAgregar.textContent = 'Agregar al Carrito';
  btnAgregar.disabled = producto.stock === 0;
  
  btnAgregar.addEventListener('click', function() {
    agregarAlCarrito(producto.id, 1, selectorTalla.value);
  });

  // Ensamblar elementos
  info.appendChild(nombre);
  info.appendChild(categoria);
  info.appendChild(selectorTalla);
  info.appendChild(tallasList);
  info.appendChild(precio);
  info.appendChild(stock);
  info.appendChild(btnAgregar);

  card.setAttribute('data-tallas', tallas.join(','));
  card.setAttribute('data-talla', tallas[0]);

  card.appendChild(imgDiv);
  card.appendChild(info);

  return card;
}

/**
 * Filtrar productos por categoría
 * @param {String} categoria - Categoría a filtrar
 */
function filtrarPorCategoria(categoria) {
  const cards = document.querySelectorAll('.producto-card');
  
  cards.forEach(card => {
    if (categoria === '' || card.getAttribute('data-categoria') === categoria) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Buscar productos por nombre
 * @param {String} termino - Término de búsqueda
 */
function buscarProductos(termino) {
  const cards = document.querySelectorAll('.producto-card');
  const terminoNormalizado = normalizarTexto(termino);

  // Si el término está vacío, mostrar todos
  if (termino.trim() === '') {
    cards.forEach(card => card.style.display = 'block');
    return;
  }

  cards.forEach(card => {
    const nombre = normalizarTexto(card.querySelector('.producto-nombre').textContent);
    if (nombre.includes(terminoNormalizado)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function renderMasVendidos() {
  const grid = document.getElementById('topSellersGrid');
  if (!grid || typeof obtenerTopVendidos !== 'function') return;
  if (grid._topCarouselResize) {
    window.removeEventListener('resize', grid._topCarouselResize);
  }
  if (grid._topCarouselTimer) {
    clearInterval(grid._topCarouselTimer);
  }

  const topVendidos = obtenerTopVendidos();
  const contadores = obtenerContadoresVentas();

  if (topVendidos.length === 0) {
    grid.innerHTML = '<p class="top-empty">Aún no hay ventas registradas.</p>';
    return;
  }

  // Primero se muestran productos con ventas; si aun no hay registros, se usa la lista base.
  const productosConVentas = topVendidos.filter(p => contadores[String(p.id)] > 0);
  const productosCarrusel = productosConVentas.length > 0 ? productosConVentas : topVendidos;
  
  if (productosCarrusel.length === 0) {
    grid.innerHTML = '<p class="top-empty">Aún no hay ventas registradas.</p>';
    return;
  }

  grid.className = 'top-carousel';
  grid.innerHTML = `
    <button class="top-carousel-arrow top-carousel-prev" type="button" aria-label="Ver productos anteriores">‹</button>
    <div class="top-carousel-window">
      <div class="top-carousel-track"></div>
    </div>
    <button class="top-carousel-arrow top-carousel-next" type="button" aria-label="Ver más productos">›</button>
  `;

  const track = grid.querySelector('.top-carousel-track');
  const prevBtn = grid.querySelector('.top-carousel-prev');
  const nextBtn = grid.querySelector('.top-carousel-next');

  if (!track || !prevBtn || !nextBtn) return;

  const productosLoop = productosCarrusel.concat(productosCarrusel.slice(0, Math.min(4, productosCarrusel.length)));

  productosLoop.forEach((producto, index) => {
    const contador = contadores[String(producto.id)] || 0;
    const card = document.createElement('article');
    card.className = 'card-mas-vendido';
    
    const imgUrl = producto.imgUrl || '';
    const imgHtml = imgUrl ? `<div class="card-imagen"><img src="${imgUrl}" alt="${producto.nombre}" class="card-img"></div>` : '';
    
    card.innerHTML = `
      ${imgHtml}
      <div class="card-contenido">
        <h3>${producto.nombre}</h3>
        <p class="top-counter">#${(index % productosCarrusel.length) + 1} más popular • ${contador > 0 ? `${contador} venta(s)` : 'Nuevo'}</p>
        <p>${producto.categoria ? producto.categoria.toUpperCase() : 'Producto'} · ${producto.talla || 'Única'}</p>
        <p><strong>${precioProducto(producto.precio)}</strong></p>
        <button class="btn-add-cart" type="button">Agregar al Carrito</button>
      </div>
    `;

    card.querySelector('button')?.addEventListener('click', function() {
      agregarAlCarrito(producto.id, 1);
      renderMasVendidos();
    });

    track.appendChild(card);
  });

  let indiceActual = 0;
  let reinicioPendiente = false;

  function tarjetasPorVista() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  function actualizarCarrusel() {
    const porVista = tarjetasPorVista();
    const paso = 100 / porVista;
    track.style.transform = `translateX(-${indiceActual * paso}%)`;
    grid.classList.toggle('single-page', productosCarrusel.length <= porVista);
  }

  function avanzarCarrusel() {
    if (productosCarrusel.length <= tarjetasPorVista()) return;
    indiceActual += 1;
    actualizarCarrusel();

    if (indiceActual >= productosCarrusel.length) {
      reinicioPendiente = true;
    }
  }

  function retrocederCarrusel() {
    if (productosCarrusel.length <= tarjetasPorVista()) return;
    if (indiceActual === 0) {
      track.style.transition = 'none';
      indiceActual = productosCarrusel.length;
      actualizarCarrusel();
      track.offsetHeight;
      track.style.transition = '';
    }
    indiceActual -= 1;
    actualizarCarrusel();
  }

  track.addEventListener('transitionend', function() {
    if (!reinicioPendiente) return;
    reinicioPendiente = false;
    track.style.transition = 'none';
    indiceActual = 0;
    actualizarCarrusel();
    track.offsetHeight;
    track.style.transition = '';
  });

  prevBtn.addEventListener('click', function() {
    retrocederCarrusel();
  });

  nextBtn.addEventListener('click', function() {
    avanzarCarrusel();
  });

  grid._topCarouselResize = actualizarCarrusel;
  window.addEventListener('resize', grid._topCarouselResize);
  grid._topCarouselTimer = setInterval(avanzarCarrusel, 20000);
  actualizarCarrusel();
}

/**
 * Obtener parámetro de URL
 * @param {String} param - Nombre del parámetro
 * @returns {String|null} Valor del parámetro
 */
function obtenerParametroURL(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Buscar productos
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const termino = searchInput.value;
      buscarProductos(termino);
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        buscarProductos(this.value);
      }
    });
  }

  // Cargar categoría desde URL si existe
  const categoriaURL = obtenerParametroURL('categoria');
  if (categoriaURL) {
    filtrarPorCategoria(categoriaURL);
    // Marcar checkbox si existe
    const checkbox = document.querySelector(`.filtro-categoria[value="${categoriaURL}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  }

  const headerSearchInput = document.getElementById('headerSearchInput');
  const headerSearchToggle = document.getElementById('headerSearchToggle');

  if (headerSearchToggle && headerSearchInput) {
    headerSearchToggle.addEventListener('click', function() {
      headerSearchInput.focus();
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        if (typeof buscarConFiltros === 'function') {
          buscarConFiltros(this.value);
        } else {
          buscarProductos(this.value);
        }
      }
    });
  }
});
