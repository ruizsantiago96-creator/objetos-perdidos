const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const Database = require('better-sqlite3');
const multer = require('multer');

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

// Configurar multer para subida de fotos
const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    cb(null, `${Date.now()}-${randomNum}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedMimes.includes(file.mimetype) || !allowedExts.includes(ext)) {
    const err = new Error('Solo se permiten imágenes JPG, PNG o WEBP');
    err.code = 'INVALID_FILE_TYPE';
    return cb(err);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend y uploads
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// GET /api/objetos?q=texto
app.get('/api/objetos', (req, res, next) => {
  try {
    const rawQ = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (rawQ) {
      // Escapar caracteres especiales para LIKE: \, %, _
      const escapedQ = rawQ.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
      const pattern = `%${escapedQ}%`;

      const stmt = db.prepare(`
        SELECT id, descripcion, ubicacion, foto, contacto, tipo_contacto, creado_en
        FROM objetos
        WHERE devuelto = 0 AND descripcion LIKE ? ESCAPE '\\'
        ORDER BY creado_en DESC, id DESC
      `);
      const filas = stmt.all(pattern);
      return res.json(filas);
    } else {
      const stmt = db.prepare(`
        SELECT id, descripcion, ubicacion, foto, contacto, tipo_contacto, creado_en
        FROM objetos
        WHERE devuelto = 0
        ORDER BY creado_en DESC, id DESC
      `);
      const filas = stmt.all();
      return res.json(filas);
    }
  } catch (err) {
    next(err);
  }
});

// PATCH /api/objetos/:id/devuelto
app.patch('/api/objetos/:id/devuelto', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: 'Objeto no encontrado' });
    }

    const token = req.body && typeof req.body.token === 'string' ? req.body.token.trim() : '';

    const stmtSelect = db.prepare('SELECT id, token, devuelto FROM objetos WHERE id = ?');
    const objeto = stmtSelect.get(id);

    if (!objeto) {
      return res.status(404).json({ error: 'Objeto no encontrado' });
    }

    if (objeto.token !== token) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }

    const stmtUpdate = db.prepare('UPDATE objetos SET devuelto = 1 WHERE id = ?');
    stmtUpdate.run(id);

    return res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/objetos
app.post('/api/objetos', (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'Datos inválidos',
          campos: { foto: 'El archivo excede el tamaño máximo de 5 MB' }
        });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          error: 'Datos inválidos',
          campos: { foto: 'Solo se permiten imágenes JPG, PNG o WEBP' }
        });
      }
      return res.status(400).json({
        error: 'Datos inválidos',
        campos: { foto: err.message || 'Error al procesar el archivo' }
      });
    }

    const campos = {};

    // Validar descripción
    const rawDescripcion = typeof req.body.descripcion === 'string' ? req.body.descripcion.trim() : '';
    if (!rawDescripcion || rawDescripcion.length < 5 || rawDescripcion.length > 200) {
      campos.descripcion = 'La descripción debe tener entre 5 y 200 caracteres';
    }

    // Validar ubicación
    const rawUbicacion = typeof req.body.ubicacion === 'string' ? req.body.ubicacion.trim() : '';
    if (!rawUbicacion || rawUbicacion.length < 3 || rawUbicacion.length > 100) {
      campos.ubicacion = 'La ubicación debe tener entre 3 y 100 caracteres';
    }

    // Validar contacto
    const rawContacto = typeof req.body.contacto === 'string' ? req.body.contacto.trim() : '';
    let tipoContacto = '';
    let contactoFinal = '';

    if (rawContacto.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(rawContacto)) {
        tipoContacto = 'correo';
        contactoFinal = rawContacto.toLowerCase();
      }
    } else {
      const cleanedPhone = rawContacto.replace(/[\s\-\(\)]/g, '');
      if (/^\d{10}$/.test(cleanedPhone)) {
        tipoContacto = 'whatsapp';
        contactoFinal = cleanedPhone;
      }
    }

    if (!tipoContacto) {
      campos.contacto = 'Escribe un correo válido o un WhatsApp de 10 dígitos';
    }

    // Validar foto obligatoria
    if (!req.file) {
      campos.foto = 'La foto es obligatoria';
    }

    // Si hay errores de validación
    if (Object.keys(campos).length > 0) {
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error('Error al borrar archivo tras validación fallida:', unlinkErr);
        }
      }
      return res.status(400).json({
        error: 'Datos inválidos',
        campos
      });
    }

    // Inserción en base de datos
    try {
      const token = crypto.randomUUID();
      const stmt = db.prepare(`
        INSERT INTO objetos (descripcion, ubicacion, foto, contacto, tipo_contacto, token, devuelto)
        VALUES (?, ?, ?, ?, ?, ?, 0)
      `);
      const info = stmt.run(
        rawDescripcion,
        rawUbicacion,
        req.file.filename,
        contactoFinal,
        tipoContacto,
        token
      );

      return res.status(201).json({
        id: Number(info.lastInsertRowid),
        token
      });
    } catch (insertErr) {
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error('Error al borrar archivo tras error en inserción:', unlinkErr);
        }
      }
      return next(insertErr);
    }
  });
});

// Middleware final para errores 500
app.use((err, req, res, next) => {
  if (req.file && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkErr) {
      console.error('Error al borrar archivo huérfano en middleware de error:', unlinkErr);
    }
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = { app, db };
