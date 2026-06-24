# Plantilla E-commerce Responsive

Plantilla web para tienda online creada con **HTML, CSS y JavaScript vanilla**. Está pensada para venderse/adaptarse a tiendas de ropa, accesorios, calzado, productos físicos o catálogos simples.

## Qué incluye

- Página de inicio con hero/banner principal.
- Página de productos con búsqueda, filtros por categoría, precio y talla/opción.
- Carrito funcional usando `localStorage`.
- Página de checkout demostrativa.
- Formulario de contacto con validación.
- Diseño responsive.
- Variables CSS para personalizar colores y estilo general.
- Imágenes placeholder listas para reemplazar.

## Estructura de archivos

```txt
plantilla-ecommerce-generica/
├── index.html
├── productos.html
├── carrito.html
├── checkout.html
├── contacto.html
├── css/
│   └── estilos.css
├── js/
│   ├── carrito.js
│   ├── productos.js
│   ├── filtros.js
│   ├── checkout.js
│   └── formulario.js
└── img/
    ├── logo-placeholder.svg
    ├── hero-placeholder.svg
    ├── background-placeholder.svg
    ├── icon-search.svg
    └── productos/
        ├── producto-01.svg
        └── ...
```

## 1. Cambiar nombre de la tienda

Busca en los archivos `.html` este texto:

```txt
[NOMBRE DE TU TIENDA]
```

Reemplázalo por el nombre real de la marca.

También puedes cambiar los títulos dentro de la etiqueta `<title>` de cada página.

## 2. Cambiar logo

El logo actual está en:

```txt
img/logo-placeholder.svg
```

Puedes reemplazar ese archivo por tu logo real manteniendo el mismo nombre, o cambiar la ruta en los HTML:

```html
<img src="img/logo-placeholder.svg" alt="Logo de la tienda">
```

Recomendación: usa PNG transparente, SVG o WebP optimizado.

## 3. Cambiar banner principal

El hero de inicio usa esta imagen:

```txt
img/hero-placeholder.svg
```

La ruta está definida en `css/estilos.css`, clase `.home-hero`:

```css
background-image: url('../img/hero-placeholder.svg');
```

Reemplaza el archivo por un banner propio o cambia la ruta por otra imagen.

## 4. Personalizar colores

Abre:

```txt
css/estilos.css
```

Al inicio verás la sección `:root`. Cambia estos valores para adaptar toda la plantilla:

```css
:root {
  --color-bg: #07070a;
  --color-surface: rgba(18, 20, 28, 0.94);
  --color-text: #f1f5f8;
  --color-muted: #b8bac2;
  --color-primary: #ff72e5;
  --color-primary-dark: #8c5cff;
  --color-accent: #ffb002;
  --color-success: #72ffd6;
}
```

Ejemplo rápido para una tienda minimalista:

```css
--color-bg: #f7f7f2;
--color-surface: #ffffff;
--color-text: #111111;
--color-muted: #666666;
--color-primary: #111111;
--color-primary-dark: #333333;
--color-accent: #c59d5f;
```

## 5. Editar productos

Los productos están en:

```txt
js/carrito.js
```

Busca esta sección:

```js
const productos = [
  {
    id: 1,
    nombre: "Polera básica",
    categoria: "ropa",
    talla: "M",
    sizes: ["S", "M", "L", "XL"],
    precio: 19990,
    stock: 20,
    imgUrl: "img/productos/producto-01.svg"
  }
];
```

Para agregar un producto nuevo, duplica un bloque y cambia:

- `id`: debe ser único.
- `nombre`: nombre visible del producto.
- `categoria`: debe coincidir con los filtros de `productos.html`.
- `sizes`: opciones disponibles.
- `precio`: número sin puntos ni símbolo `$`.
- `stock`: cantidad disponible.
- `imgUrl`: ruta de la imagen.

## 6. Cambiar categorías y filtros

Las categorías de ejemplo son:

```txt
ropa, accesorios, calzado
```

Si cambias categorías en `js/carrito.js`, actualiza también los checkboxes en `productos.html`:

```html
<input type="checkbox" value="ropa" class="filtro-categoria">
```

El valor del `value` debe coincidir exactamente con la categoría del producto.

## 7. Cambiar datos de contacto

Edita `contacto.html` y los footers de las páginas. Busca comentarios como:

```html
<!-- PERSONALIZAR CONTACTO -->
```

Cambia email, teléfono, ubicación y horario.

## 8. Cupones de descuento

Los cupones están en `js/carrito.js`:

```js
const codigoDescuentos = {
  'BIENVENIDA': 0.10,
  'VERANO2026': 0.15,
  'CLIENTE5': 0.05
};
```

El valor `0.10` equivale a 10% de descuento.

## 9. Importante sobre pagos reales

El checkout incluido es demostrativo. No cobra dinero real ni se conecta a una pasarela de pago.

Para producción debes integrar servicios como:

- Mercado Pago
- Stripe
- Webpay
- PayPal
- Backend propio

## 10. Cómo probar la plantilla

Puedes abrir `index.html` directamente en el navegador.

Para una prueba más estable, usa Live Server en Visual Studio Code:

1. Abre la carpeta del proyecto.
2. Instala la extensión **Live Server**.
3. Click derecho en `index.html`.
4. Selecciona **Open with Live Server**.

## 11. Recomendaciones para vender esta plantilla

Antes de publicarla:

- Reemplaza todos los placeholders visuales por imágenes de ejemplo propias o libres.
- Agrega capturas reales de la plantilla.
- Incluye instrucciones claras para compradores principiantes.
- Indica que es una plantilla frontend sin backend.
- Entrega el archivo ZIP completo.

## Soporte sugerido

Puedes ofrecer soporte básico para:

- Cambiar colores.
- Cambiar logo.
- Agregar productos.
- Cambiar textos.

No prometas integración de pagos reales si no está incluida en el producto.

## Nota sobre el banner principal

Para evitar que la portada se vea duplicada, usa una imagen de banner sin texto ni botones. El título, subtítulo y botón principal se editan directamente en `index.html`, dentro de la sección `HERO PRINCIPAL`.

## Nota sobre colores del carrito

El carrito usa fondos oscuros con contraste alto. Si cambias la paleta desde `:root`, revisa especialmente `--color-text`, `--color-muted`, `--color-primary`, `--color-primary-dark` y `--color-border` para mantener buena lectura.


## Nota de esta versión

Esta es la versión con tema oscuro. Incluye el ajuste del carrito para que los botones del resumen de compra no se salgan del margen y se vean correctamente en escritorio y móvil.
