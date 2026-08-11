# LUCE — Pinturería

## Qué es
Sitio institucional/informativo para LUCE, una pinturería. **No es e-commerce** — no se vende desde la web, es a modo informativo (mostrar marca, productos y datos de contacto). Cliente de Aurex Studio.

## Referencia de estilo
https://iberiapinturas.com/ — tomar como referencia de estructura y sobriedad, **no copiar contenido ni código**.

Reglas de estilo no negociables:
- **Fondo blanco siempre.** Nada de bloques de color a pantalla completa ni fondo crema. El blanco es la base de todas las secciones.
- El color (`--rojo`, `--azul`, `--amarillo`, `--verde`, `--terracota`) se usa **solo como acento**: pastillas de categoría, bordes, íconos, texto destacado, botones puntuales.
- Muy simple. Sin animaciones grandes, sin carruseles complejos. Tipografía + espaciado + color puntual.

## Estructura de archivos
```
index.html      → Home: hero, institucional, vidriera de productos
catalogo.html   → Categorías con pestañas de color + banners
contacto.html   → 2 columnas: titular + formulario
css/base.css    → variables de color/tipografía, reset, botones
css/layout.css  → header, nav, pill-bar, footer, whatsapp flotante
css/pages.css   → secciones propias de cada página
js/main.js      → menú mobile, dropdown, pill activa, validación de form
assets/logo/       → logo real (todavía no cargado)
assets/productos/  → fotos reales de productos (se van a ir cargando acá)
```

## Categorías del catálogo (reales, confirmadas)
1. **Enduido** — terracota (`--terracota`)
2. **Fijador Sellador** — azul (`--azul`)
3. **Látex Interior** — verde (`--verde`)
4. **Látex Exterior** — rojo (`--rojo`)
5. **Membrana Líquida** — cian (`--cian`)
6. **Esmalte Sintético** — violeta (`--violeta`)
7. **Masilla Placa Yeso** — rosa (`--rosa`), distinto de Enduido (es masilla para juntas de placas de yeso/durlock, no enduido de pared)

Slugs usados en anchors/ids: `enduido`, `fijador-sellador`, `latex-interior`, `latex-exterior`, `membrana-liquida`, `esmalte-sintetico`, `masilla-placa-yeso`. Ya están reflejados en el dropdown, la pill-bar y los banners de `catalogo.html`.

## Fotos de producto
Hay backups locales organizados por carpeta: `enduido/`, `fijador/`, `latex/`, `ventana liquida/` (= Membrana Líquida), `sintetico/`. Al pasarlas, copiarlas a `assets/productos/<categoría>/` respetando esa organización y reemplazar los comentarios `<!-- <img class="product-shot" ...> -->` en `catalogo.html` por las imágenes reales.

## Pendiente / a confirmar con el cliente
- Logo real (hoy el header muestra texto "LUCE")
- WhatsApp real (hoy placeholder `+34 000 000 000`)
- Redes sociales reales (hoy los íconos IG/FB no linkean a nada)
- Dirección y email reales
- Confirmar si hay tienda online o el sitio queda 100% informativo

## Formulario de contacto
`js/main.js` valida en el cliente (campos requeridos + formato de email) pero el envío real todavía no está conectado a nada. Falta decidir: Netlify Forms, Formspree, o un endpoint propio.

## Deploy
Mismo esquema que GOMATECH (github.com/Mermai95/gomatech): push a `main` en GitHub → Netlify con Continuous Deployment conectado al repo → build automático en cada push, sin build command (sitio estático, sin bundler).

## Cómo trabajar en este repo
- Franco va a pedir cambios sección por sección — cada CSS está separado por responsabilidad (base / layout / pages) para poder tocar una parte sin romper el resto.
- Después de cada cambio: commitear y pushear a `main` para que quede reflejado en Netlify, sin esperar confirmación salvo que el cambio sea grande/estructural.
