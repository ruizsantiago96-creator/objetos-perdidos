# 04. Validaciones y seguridad

## Textos (servidor)

- `descripcion`: quitar espacios al inicio y al final; entre 5 y 200 caracteres.
- `ubicacion`: quitar espacios al inicio y al final; entre 3 y 100 caracteres.

## Contacto

El servidor decide el tipo:

1. Si contiene `@`, se trata como **correo**. Formato válido: `algo@algo.algo` (regex sugerida: `^[^\s@]+@[^\s@]+\.[^\s@]+$`). Se guarda en minúsculas.
2. Si no, se trata como **WhatsApp**. Se quitan espacios, guiones y paréntesis; debe quedar **exactamente 10 dígitos numéricos**.
3. Si no cumple ninguna, error en `campos.contacto`: "Escribe un correo válido o un WhatsApp de 10 dígitos".

## Foto

- Obligatoria.
- Solo `image/jpeg`, `image/png`, `image/webp` (y extensiones `.jpg`, `.jpeg`, `.png`, `.webp`).
- Máximo **5 MB** (`limits.fileSize`).
- El nombre original **se descarta**. Nombre guardado: `Date.now() + '-' + números aleatorios + extensión` validada (ej. `1730000000000-48213.jpg`).
- Cualquier otro tipo se rechaza con error 400.

## Seguridad (obligatorio)

- Consultas SQL siempre parametrizadas.
- En el frontend, mostrar texto del usuario **solo con `textContent`**. Prohibido `innerHTML` con datos del usuario.
- El `token` nunca aparece en `GET /api/objetos`.
- Los enlaces de contacto se construyen con `encodeURIComponent` para el texto del mensaje.
- Mostrar la foto con `img.src = '/uploads/' + nombreArchivo`.

## Privacidad (aviso mínimo)

El contacto del publicador es visible para cualquiera que abra el muro. El formulario debe mostrar bajo el campo de contacto el texto: "Este dato será visible públicamente".
