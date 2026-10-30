# 01. Decisiones técnicas (fijas)

El agente **no** debe cambiar ninguna de estas decisiones.

| Tema | Decisión |
|---|---|
| Backend | Node.js + Express |
| Base de datos | SQLite, un solo archivo `database.db`, con la librería `better-sqlite3` |
| Subida de archivos | `multer` |
| Frontend | HTML, CSS y JavaScript puro. Sin frameworks ni librerías externas |
| Fotos | Se guardan en `/uploads`; en la BD solo se guarda el nombre del archivo |
| Autenticación | Ninguna (sin login ni cuentas) |
| Puerto | 3000 |

## Estructura de carpetas

```
/server.js
/package.json
/database.db        (se crea solo al iniciar)
/uploads/           (se crea solo si no existe)
/public/index.html
/public/style.css
/public/app.js
```

## Comportamiento del servidor

- `express.static('public')` sirve el frontend en `/`.
- La carpeta `uploads` se sirve en la ruta `/uploads`.
- Al iniciar: crear la carpeta `uploads` si no existe y crear la tabla `objetos` si no existe (`CREATE TABLE IF NOT EXISTS`).
- Al arrancar imprimir: `Servidor en http://localhost:3000`.

## Ejecución

```
npm install
node server.js
```

Debe quedar disponible en `http://localhost:3000`.

## Dependencias permitidas

Solo: `express`, `better-sqlite3`, `multer`. (`crypto` es módulo nativo de Node.)
