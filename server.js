const fs = require('fs');
const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Inicializar base de datos SQLite
const db = new Database(path.join(__dirname, 'database.db'));
db.pragma('journal_mode = WAL');

// Crear tabla objetos si no existe
db.exec(`
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
`);

// Middleware para JSON y URL-encoded si se necesitan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend y uploads
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

module.exports = { app, db };
