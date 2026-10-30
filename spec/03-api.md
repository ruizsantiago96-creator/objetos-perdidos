# 03. API (endpoints exactos)

Todas las respuestas son JSON. Todos los mensajes de error van en español con el formato `{ "error": "mensaje" }`.

## POST /api/objetos

Crea un reporte. Recibe `multipart/form-data`.

**Campos:** `descripcion`, `ubicacion`, `contacto`, `foto` (archivo).

**Proceso:**
1. `multer` guarda la foto (ver reglas en `04-validaciones.md`).
2. Validar `descripcion`, `ubicacion`, `contacto` y que exista la foto.
3. Si algo falla: **borrar el archivo ya subido** (si existe) y responder 400.
4. Detectar `tipo_contacto`, limpiar el contacto y generar `token` con `crypto.randomUUID()`.
5. Insertar el registro.

**Respuesta exitosa (201):** `{ "id": 12, "token": "uuid..." }`

**Errores (400):** un solo objeto con el primer error encontrado o, mejor, con errores por campo:
`{ "error": "Datos inválidos", "campos": { "descripcion": "La descripción debe tener entre 5 y 200 caracteres" } }`

Claves posibles en `campos`: `descripcion`, `ubicacion`, `contacto`, `foto`. El frontend usa este objeto para mostrar cada error debajo de su campo.

## GET /api/objetos?q=texto

Devuelve el muro.

- Solo registros con `devuelto = 0`.
- Orden: `creado_en DESC, id DESC` (el `id` desempata).
- Si viene `q` (no vacío tras quitar espacios): `descripcion LIKE '%q%'`.
- Escapar los caracteres `%` y `_` del texto buscado para que se tomen literalmente (`LIKE ... ESCAPE '\'`).
- **Nunca** incluir `token` en la respuesta. Seleccionar columnas explícitamente: `id, descripcion, ubicacion, foto, contacto, tipo_contacto, creado_en`.

**Respuesta (200):** arreglo de objetos. Si no hay resultados: `[]`.

## PATCH /api/objetos/:id/devuelto

Marca un objeto como devuelto.

- Body JSON: `{ "token": "..." }`
- Si el id no existe → 404 `{ "error": "Objeto no encontrado" }`
- Si el token no coincide → 403 `{ "error": "No tienes permiso para esta acción" }`
- Si coincide → `devuelto = 1` y responde 200 `{ "ok": true }`

## Resumen de códigos

| Situación | Código |
|---|---|
| Reporte creado | 201 |
| Datos inválidos / archivo rechazado | 400 |
| Token incorrecto | 403 |
| Id inexistente | 404 |
| Error inesperado del servidor | 500 con `{ "error": "Error interno" }` |

## Manejo de errores de multer

Si `multer` rechaza el archivo (tipo no permitido o tamaño mayor a 5 MB) se debe responder 400 con `campos.foto` y un mensaje en español. No debe responder con el error por defecto de Express.

## Manejo de errores inesperados (500)

Cualquier error no previsto (por ejemplo, un fallo de la base de datos) debe responder 500 con `{ "error": "Error interno" }`.

- Se implementa con un middleware de errores de Express (función de cuatro parámetros `(err, req, res, next)`) registrado **después** de todas las rutas.
- Nunca se envía el detalle del error ni el stack al cliente. Se puede registrar en consola con `console.error`.
- Si el error ocurrió con una foto ya subida, se borra el archivo para no dejar huérfanos.
