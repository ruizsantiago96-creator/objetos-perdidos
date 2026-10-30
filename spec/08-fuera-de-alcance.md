# 08. Fuera de alcance

El agente **NO** debe implementar:

- Login, registro o cuentas de usuario.
- Panel de administración.
- Notificaciones (correo, push, WhatsApp automático).
- Comentarios o chat interno.
- Edición de reportes.
- Categorías o filtros adicionales a la búsqueda de texto.
- Paginación o scroll infinito.
- Múltiples fotos por reporte.
- Eliminación de reportes (solo se marcan como devueltos).
- Frameworks de frontend, ORMs, TypeScript o pasos de compilación.
- Cualquier funcionalidad que no esté descrita en estos documentos.

## Decisiones de diseño a tener presentes

- **Identidad del publicador:** se resuelve con un token guardado en `localStorage`. Si el usuario borra los datos del navegador o cambia de dispositivo, pierde el botón "Devuelto". Es una limitación aceptada.
- **Contacto del publicador:** el botón "Contactar" abre el contacto de **quien encontró el objeto**, no el de quien lo perdió.
- **Búsqueda:** `LIKE` de SQLite no distingue mayúsculas solo en caracteres ASCII; con acentos o "ñ" puede distinguirlas. Es aceptable para esta versión.
