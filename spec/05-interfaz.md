# 05. Interfaz (frontend)

Archivos: `public/index.html`, `public/style.css`, `public/app.js`. Todo en español.

## Header

Barra superior fija (`position: sticky; top: 0`) con tres elementos:

1. Título: "Objetos Perdidos – Tec Campus Poniente".
2. Campo de búsqueda (placeholder: "Buscar objeto...").
3. Botón "Subir reporte".

## Muro

- Cuadrícula de tarjetas centrada con ancho máximo (ej. 1100 px).
- Columnas: **3** en escritorio, **2** en tableta (≤ 900 px), **1** en móvil (≤ 600 px). Usar CSS grid con media queries.
- Cada tarjeta, en este orden:
  1. Foto arriba (altura fija, ej. 200 px, `width: 100%; object-fit: cover`).
  2. Descripción.
  3. Ubicación (con prefijo "Encontrado en: ").
  4. Fecha en formato relativo o corto ("Hace 5 min", "Hace 2 h", "Ayer", o "28 oct").
  5. Botón "Contactar".
  6. Botón "Marcar como devuelto" (solo si aplica, ver abajo).
- Si no hay resultados: mostrar el texto "No hay objetos que coincidan".
- El muro se carga al abrir la página con `GET /api/objetos`.

## Búsqueda

- Se ejecuta al escribir, con **debounce de 300 ms**.
- Sin recargar la página.
- Llama a `GET /api/objetos?q=<texto>` con el texto codificado (`encodeURIComponent`).
- Campo vacío = muro completo.

## Formulario de reporte

- Se abre en una **ventana modal** de una sola pantalla al pulsar "Subir reporte".
- Cuatro campos: descripción, ubicación, foto (`<input type="file" accept="image/jpeg,image/png,image/webp">`), contacto (WhatsApp o correo).
- Botón "Publicar" y dos formas de cerrar el modal: botón "Cancelar" **y** clic en el fondo. Al cerrar sin publicar se limpian los errores mostrados.
- Errores **debajo de cada campo**, tomados de `campos` en la respuesta 400. También validar lo básico en el navegador antes de enviar.
- Mientras se envía: botón deshabilitado y texto "Publicando...". Se reactiva si hay error.
- Se envía con `FormData` y `fetch` a `POST /api/objetos`.
- Al publicar con éxito: guardar `{id, token}` en `localStorage`, cerrar el modal, limpiar el formulario y recargar el muro.
- Texto bajo el campo de contacto: "Este dato será visible públicamente".

## Botón "Contactar"

Se construye en el navegador según `tipo_contacto`. Ambos se abren en pestaña nueva (`target="_blank"`, `rel="noopener noreferrer"`).

- **WhatsApp:** `https://wa.me/52` + los 10 dígitos + `?text=` + `encodeURIComponent('Hola, creo que el objeto "' + descripcion + '" que publicaste es mío')`
- **Correo:** `mailto:` + correo + `?subject=` + `encodeURIComponent('Objeto perdido')` + `&body=` + `encodeURIComponent('Hola, creo que el objeto "' + descripcion + '" que publicaste es mío')`

## Botón "Marcar como devuelto"

- Solo aparece en tarjetas cuyo `id` esté guardado en el `localStorage` de ese navegador junto con su `token`.
- Clave de almacenamiento: `misReportes`, valor: arreglo JSON de `{ id, token }`. Leer y escribir siempre dentro de `try/catch` por si el JSON está dañado.
- Al pulsarlo: `confirm('¿Marcar como devuelto?')`. Si acepta: `PATCH /api/objetos/:id/devuelto` con `{ token }`. Si responde 200, quitar la tarjeta del muro (o recargar) y borrar ese registro del `localStorage`. Si hay error, mostrar un `alert` con el mensaje.

## Estilos

- Fondo de la página: `#f5f5f5`.
- Tarjetas: fondo blanco, esquinas redondeadas, sombra suave.
- Fuente: `Roboto, Arial, sans-serif` (Arial como respaldo; no hace falta cargar Roboto desde internet).
- Variable CSS en `:root`: `--color-principal: #1a4fa0;`
- Ese color se usa **solo** en los botones "Subir reporte", "Publicar" y "Contactar". El resto en neutros (grises, blanco, negro). "Marcar como devuelto" y "Cancelar" usan estilo neutro (borde gris).
- Debe verse bien a **375 px** de ancho: sin scroll horizontal, header que se acomoda (puede apilarse), modal que cabe en pantalla.

## Construcción incremental (orden de los sprints)

El frontend se construye en dos entregas; el resultado final es el descrito arriba.

- **Sprint 1:** `index.html`, `app.js` y un `style.css` mínimo que contiene solo el header sticky. El muro muestra tarjetas con foto, descripción, ubicación y fecha. El botón "Subir reporte" existe pero aún no hace nada. Las tarjetas aún no tienen "Contactar" ni "Marcar como devuelto".
- **Sprint 2:** modal y formulario, botones "Contactar" y "Marcar como devuelto", y el resto de los estilos (variable de color, tarjetas, cuadrícula responsiva y ajuste a 375 px).
