# 02. Modelo de datos

Una sola tabla: `objetos`.

| Campo | Tipo | Regla |
|---|---|---|
| id | INTEGER | Clave primaria autoincremental |
| descripcion | TEXT | Obligatorio, 5 a 200 caracteres |
| ubicacion | TEXT | Obligatorio, 3 a 100 caracteres |
| foto | TEXT | Obligatorio, nombre del archivo guardado |
| contacto | TEXT | Obligatorio, WhatsApp (10 dígitos) o correo |
| tipo_contacto | TEXT | `whatsapp` o `correo`. Lo detecta el servidor, no el cliente |
| token | TEXT | Clave secreta aleatoria. **Nunca** se envía en el feed |
| devuelto | INTEGER | 0 por defecto; 1 si ya fue devuelto |
| creado_en | DATETIME | Fecha y hora automática al crear |

## SQL de referencia

```sql
CREATE TABLE IF NOT EXISTS objetos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descripcion TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  foto TEXT NOT NULL,
  contacto TEXT NOT NULL,
  tipo_contacto TEXT NOT NULL,
  token TEXT NOT NULL,
  devuelto INTEGER NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Notas importantes

- `CURRENT_TIMESTAMP` de SQLite guarda la fecha en **UTC** con formato `YYYY-MM-DD HH:MM:SS` (sin zona). El frontend debe convertirla así antes de mostrarla: `new Date(valor.replace(' ', 'T') + 'Z')`.
- Usar siempre consultas parametrizadas (`?`). Nunca concatenar texto del usuario dentro del SQL.
