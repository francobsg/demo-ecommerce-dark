/**
 * FILTROS: búsqueda, categorías, precio y tallas.
 * PERSONALIZAR: si cambias categorías o rangos en productos.html, revisa este archivo.
 */

// Estado actual de filtros
let filtrosActivos = {
  categorias: [],
  precioMax: 100,
  tallas: []
};

function normalizarTexto(texto) {
  return texto
    ? texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : '';
}

/**
 * Inicializar sistema de filtros
 */
function inicializarFiltros() {
  // Listeners para checkboxes de categoría
  const checkboxesCategorias = document.querySelectorAll('.filtro-categoria');
  checkboxesCategorias.forEach(checkbox => {
    checkbox.addEventListener('change', aplicarFiltros);
  });

  // Listener para slider de precio
  const rangeSlider = document.getElementById('precioRange');
  if (rangeSlider) {
    rangeSlider.addEventListener('input', function() {
      filtrosActivos.precioMax = parseFloat(this.value);
      document.getElementById('precioValue').textContent = Number(this.value).toFixed(2);
      aplicarFiltros();
    });
  }

  // Listeners para checkboxes de talla
  const checkboxesTallas = document.querySelectorAll('.filtro-talla');
  checkboxesTallas.forEach(checkbox => {
    checkbox.addEventListener('change', aplicarFiltros);
  });

  // Listeners para checkboxes de género
  // Listener para botón limpiar filtros
  const btnReset = document.getElementById('resetFiltros');
  if (btnReset) {
    btnReset.addEventListener('click', limpiarFiltros);
  }
}

/**
 * Aplicar todos los filtros activos
 */
function aplicarFiltros() {
  // Obtener categorías seleccionadas
  const checkboxesCategorias = document.querySelectorAll('.filtro-categoria:checked');
  filtrosActivos.categorias = Array.from(checkboxesCategorias).map(cb => cb.value);

  // Obtener géneros seleccionados
  // Obtener tallas seleccionadas
  const checkboxesTallas = document.querySelectorAll('.filtro-talla:checked');
  filtrosActivos.tallas = Array.from(checkboxesTallas).map(cb => cb.value);

  // Mostrar productos que cumplen todos los filtros
  mostrarProductosFiltrados();
}

/**
 * Mostrar productos que cumplen con los filtros
 */
function mostrarProductosFiltrados() {
  const cards = document.querySelectorAll('.producto-card');
  let productosVisibles = 0;

  cards.forEach(card => {
    const categoria = card.getAttribute('data-categoria');
    const precio = parseFloat(card.getAttribute('data-precio'));
    const tallas = card.getAttribute('data-tallas') ? card.getAttribute('data-tallas').split(',') : [card.getAttribute('data-talla')];

    // Verificar que cumpla con TODOS los filtros activos
    let cumpleFiltros = true;

    // Filtro de categoría
    if (filtrosActivos.categorias.length > 0) {
      cumpleFiltros = cumpleFiltros && filtrosActivos.categorias.includes(categoria);
    }

    // Filtro de género
    // Filtro de precio
    cumpleFiltros = cumpleFiltros && precio <= filtrosActivos.precioMax;

    // Filtro de talla
    if (filtrosActivos.tallas.length > 0) {
      cumpleFiltros = cumpleFiltros && filtrosActivos.tallas.some(t => tallas.includes(t));
    }

    // Mostrar u ocultar card
    if (cumpleFiltros) {
      card.style.display = 'block';
      productosVisibles++;
    } else {
      card.style.display = 'none';
    }
  });

  // Mostrar mensaje si no hay resultados
  mostrarMensajeResultados(productosVisibles);
}

/**
 * Mostrar mensaje cuando no hay resultados
 * @param {Number} cantidad - Cantidad de productos encontrados
 */
function mostrarMensajeResultados(cantidad) {
  const grid = document.getElementById('productosGrid');
  
  if (!grid) return;

  // Eliminar mensaje anterior si existe
  const mensajeAnterior = grid.querySelector('.sin-resultados');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }

  // Si no hay resultados, mostrar mensaje
  if (cantidad === 0) {
    const mensaje = document.createElement('div');
    mensaje.className = 'sin-resultados';
    mensaje.style.cssText = `
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      color: #999;
      font-size: 1.1rem;
    `;
    mensaje.textContent = '❌ No se encontraron productos con los filtros seleccionados';
    grid.appendChild(mensaje);
  }
}

/**
 * Limpiar todos los filtros
 */
function limpiarFiltros() {
  // Limpiar estado
  filtrosActivos = {
    categorias: [],
    precioMax: 100,
    tallas: []
  };

  // Desmarcar todos los checkboxes
  document.querySelectorAll('.filtro-categoria, .filtro-talla').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Resetear slider de precio
  const rangeSlider = document.getElementById('precioRange');
  if (rangeSlider) {
    rangeSlider.value = 100;
    document.getElementById('precioValue').textContent = '100.00';
  }

  // Limpiar búsqueda
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  // Mostrar todos los productos
  const cards = document.querySelectorAll('.producto-card');
  cards.forEach(card => {
    card.style.display = 'block';
  });

  // Eliminar mensaje de sin resultados
  const mensaje = document.querySelector('.sin-resultados');
  if (mensaje) {
    mensaje.remove();
  }

  console.log('✓ Filtros limpiados');
}

/**
 * Combinar búsqueda con filtros
 * (Esta función se integra con la búsqueda de productos.js)
 */
function buscarConFiltros(termino) {
  const cards = document.querySelectorAll('.producto-card');
  const terminoNormalizado = normalizarTexto(termino);
  let productosVisibles = 0;

  cards.forEach(card => {
    const nombre = normalizarTexto(card.querySelector('.producto-nombre').textContent);
    const categoria = card.getAttribute('data-categoria');
    const precio = parseFloat(card.getAttribute('data-precio'));
    const tallas = card.getAttribute('data-tallas') ? card.getAttribute('data-tallas').split(',') : [card.getAttribute('data-talla')];

    // Validar búsqueda
    const coincideNombre = nombre.includes(terminoNormalizado) || termino.trim() === '';

    // Validar filtros
    let cumpleFiltros = coincideNombre;

    if (filtrosActivos.categorias.length > 0) {
      cumpleFiltros = cumpleFiltros && filtrosActivos.categorias.includes(categoria);
    }

    cumpleFiltros = cumpleFiltros && precio <= filtrosActivos.precioMax;

    if (filtrosActivos.tallas.length > 0) {
      cumpleFiltros = cumpleFiltros && filtrosActivos.tallas.some(t => tallas.includes(t));
    }

    if (cumpleFiltros) {
      card.style.display = 'block';
      productosVisibles++;
    } else {
      card.style.display = 'none';
    }
  });

  mostrarMensajeResultados(productosVisibles);
}

// Event listener para búsqueda integrada con filtros
document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  // Sobrescribir el listener de búsqueda para usar la función con filtros
  if (searchBtn && searchInput) {
    searchBtn.removeEventListener('click', function() {});
    
    searchBtn.addEventListener('click', function() {
      const termino = searchInput.value;
      buscarConFiltros(termino);
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        buscarConFiltros(this.value);
      }
    });
  }
});
