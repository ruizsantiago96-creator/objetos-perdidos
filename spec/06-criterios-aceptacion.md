# 06. Criterios de aceptación

El agente debe verificar **cada uno** y reportar PASA o FALLA con la evidencia (comando curl, captura o descripción).

| # | Criterio |
|---|---|
| 1 | Publicar con todos los campos válidos crea el registro y aparece de inmediato en primer lugar del muro. |
| 2 | Publicar con un campo faltante o inválido no crea nada, no deja archivos huérfanos en `/uploads` y muestra el error debajo del campo. |
| 3 | El muro siempre muestra primero el objeto más reciente. |
| 4 | Buscar "mochila" muestra solo objetos cuya descripción contenga "mochila", sin importar mayúsculas o minúsculas. |
| 5 | El botón "Contactar" abre el enlace correcto: `wa.me/52...` para WhatsApp, `mailto:` para correo. |
| 6 | Marcar un objeto como devuelto lo quita del muro y no reaparece al recargar. |
| 7 | Un navegador distinto al que publicó no ve el botón "Marcar como devuelto", y un `PATCH` con token incorrecto devuelve 403 (y con id inexistente, 404). |
| 8 | La respuesta de `GET /api/objetos` no contiene el campo `token` en ningún registro. |
| 9 | Subir un archivo que no es imagen (JPG/PNG/WEBP) o que pesa más de 5 MB es rechazado con 400. |
| 10 | La página se ve correctamente a 375 px de ancho (sin scroll horizontal). |

## Pruebas sugeridas con curl

```bash
# Crear (criterio 1)
curl -X POST http://localhost:3000/api/objetos \
  -F "descripcion=Mochila negra con llavero" \
  -F "ubicacion=Biblioteca" \
  -F "contacto=5512345678" \
  -F "foto=@foto.jpg"

# Listar (criterios 3, 4, 8)
curl "http://localhost:3000/api/objetos?q=MOCHILA"

# Token incorrecto (criterio 7) -> debe dar 403
curl -X PATCH http://localhost:3000/api/objetos/1/devuelto \
  -H "Content-Type: application/json" -d '{"token":"incorrecto"}'

# Id inexistente -> debe dar 404
curl -X PATCH http://localhost:3000/api/objetos/99999/devuelto \
  -H "Content-Type: application/json" -d '{"token":"x"}'

# Archivo no permitido (criterio 9) -> debe dar 400
curl -X POST http://localhost:3000/api/objetos \
  -F "descripcion=Prueba valida" -F "ubicacion=Patio" \
  -F "contacto=5512345678" -F "foto=@documento.pdf"
```
