# 07. Plan de trabajo

Este archivo define el **orden de implementación** y es la única fuente del orden. Las tareas se ejecutan por prioridad (1 a 11), **no por número de tarea**: por ejemplo, T-24 y T-25 van antes que T-13 y T-14.

Reglas:
- Marcar cada tarea al terminarla.
- No pasar a la siguiente historia sin verificar la actual.
- Al terminar cada sprint, detenerse y reportar PASA/FALLA de los criterios indicados (ver `06-criterios-aceptacion.md`).

Tallas: S = 3 puntos, M = 5, L = 8.

---

## Sprint 1 · Release 1: Muro consultable (18 tareas)

Meta: el muro funciona. Se publican reportes (por API) y el visitante ve el muro en el navegador y busca en él.

### Prioridad 1 · HU-01 Preparar proyecto y servidor base (S)
- [ ] T-01 `npm init` e instalar `express`, `better-sqlite3` y `multer`.
- [ ] T-02 Crear `server.js`: carpeta `uploads` si no existe y tabla `objetos` (`CREATE TABLE IF NOT EXISTS`).
- [ ] T-03 Servir `public/` en `/` y `uploads/` en `/uploads`; puerto 3000 con mensaje de arranque.

### Prioridad 2 · HU-02 Publicar reporte (API) (L)
- [ ] T-04 Configurar `multer`: límite 5 MB, filtro JPG/PNG/WEBP y nombre `Date.now()`-aleatorio + extensión.
- [ ] T-05 Validar descripción (5-200) y ubicación (3-100) con `trim`.
- [ ] T-06 Detectar y validar contacto (correo en minúsculas / WhatsApp de 10 dígitos).
- [ ] T-07 Insertar registro con `INSERT` parametrizado, token con `crypto.randomUUID()` y responder 201.
- [ ] T-08 Manejar errores 400 por campo, errores de `multer` y borrar archivo huérfano. Incluye el middleware final de errores que responde 500 `{ "error": "Error interno" }` (ver `03-api.md`).
- [ ] T-09 Probar con curl los criterios 1, 2 y 9.

### Prioridad 3 · HU-03 Consultar muro con búsqueda (API) (M)
- [ ] T-10 Consulta GET con columnas explícitas (sin token), `devuelto = 0` y orden `creado_en DESC, id DESC`.
- [ ] T-11 Búsqueda `q` con `LIKE ... ESCAPE` y escape de `%` y `_`.
- [ ] T-12 Probar con curl los criterios 3, 4 y 8.

### Prioridad 4 · HU-05 Ver el muro de objetos (M)
- [ ] T-15 Crear `index.html` con header sticky (título, búsqueda, botón "Subir reporte") y contenedor del muro. Incluye un `style.css` mínimo con solo el header sticky (el resto va en T-32).
- [ ] T-16 `app.js`: cargar `GET /api/objetos` y pintar tarjetas usando `textContent`.
- [ ] T-17 Mostrar fecha relativa (conversión UTC con `replace(' ', 'T') + 'Z'`).
- [ ] T-18 Mostrar "No hay objetos que coincidan" cuando no hay resultados.

### Prioridad 5 · HU-07 Buscar objetos por texto (S)
- [ ] T-24 Búsqueda al escribir con debounce de 300 ms y `encodeURIComponent`.
- [ ] T-25 Verificar que campo vacío restaura el muro completo y que "mochila" filtra correctamente.

**Puerta del Sprint 1:** detenerse y reportar PASA/FALLA de los criterios 1, 2 (parte API), 3, 4, 8 y 9. No empezar el Sprint 2 hasta entonces.

---

## Sprint 2 · Release 2: Plataforma completa (20 tareas)

Meta: publicar desde el formulario, contactar y marcar como devuelto desde el navegador, con diseño responsivo y criterios verificados.

### Prioridad 6 · HU-04 Marcar como devuelto (API) (S)
- [ ] T-13 Implementar `PATCH /api/objetos/:id/devuelto` con respuestas 404, 403 y 200.
- [ ] T-14 Probar con curl el criterio 7 (403 y 404).

### Prioridad 7 · HU-06 Publicar un objeto desde el formulario (L)
- [ ] T-19 Construir modal con los cuatro campos y el aviso "Este dato será visible públicamente". Se cierra con "Cancelar" o clic en el fondo.
- [ ] T-20 Validación básica en el navegador antes de enviar.
- [ ] T-21 Enviar con `FormData` y `fetch`; botón deshabilitado con "Publicando...".
- [ ] T-22 Mostrar errores debajo de cada campo a partir de `campos` del 400.
- [ ] T-23 Al publicar: guardar `{ id, token }` en `localStorage` (`try/catch`), cerrar modal, limpiar y recargar muro.

### Prioridad 8 · HU-08 Contactar a quien encontró el objeto (S)
- [ ] T-26 Botón "Contactar" para WhatsApp (`wa.me/52...`).
- [ ] T-27 Botón "Contactar" para correo (`mailto` con subject y body).
- [ ] T-28 Abrir en pestaña nueva con `rel="noopener noreferrer"`.

### Prioridad 9 · HU-09 Marcar como devuelto desde el muro (M)
- [ ] T-29 Leer `misReportes` (`try/catch`) y mostrar el botón solo si el id y token existen.
- [ ] T-30 `confirm` + `PATCH` con token; con 200 quitar tarjeta y borrar registro de `localStorage`.
- [ ] T-31 Mostrar `alert` con el mensaje cuando el servidor responde error.

### Prioridad 10 · HU-10 Diseño visual y responsivo (M)
- [ ] T-32 `style.css`: variable `--color-principal`, fondo, tarjetas, fuente y botones.
- [ ] T-33 Cuadrícula responsiva 3 / 2 / 1 columnas con media queries.
- [ ] T-34 Ajustar header y modal para 375 px sin scroll horizontal.
- [ ] T-35 Revisar a 375 px, 768 px y escritorio (criterio 10).

### Prioridad 11 · HU-11 Verificación final de aceptación (S)
- [ ] T-36 Recorrer los 10 criterios y reportar PASA/FALLA con evidencia.
- [ ] T-37 Confirmar que no se implementó nada de `08-fuera-de-alcance.md`.
- [ ] T-38 Probar `npm install && node server.js` desde cero.

**Puerta del Sprint 2:** reportar PASA/FALLA de los 10 criterios con evidencia. Dentro de esta puerta se verifican de forma explícita el criterio 5 (enlaces de Contactar), el 6 (devuelto no reaparece al recargar), el 7 (en el navegador) y el 2 (error debajo del campo).
