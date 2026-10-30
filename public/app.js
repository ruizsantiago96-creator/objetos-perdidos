// app.js - Sprint 1: Ver muro y búsqueda

const muro = document.getElementById('muro');
const mensajeVacio = document.getElementById('mensaje-vacio');
const campoBusqueda = document.getElementById('campo-busqueda');

// Formatear fecha relativa usando hora UTC de SQLite
function formatoFechaRelativa(valor) {
  if (!valor) return '';
  const fecha = new Date(valor.replace(' ', 'T') + 'Z');
  const ahora = new Date();
  const diffSeg = Math.floor((ahora - fecha) / 1000);

  if (diffSeg < 60) return 'Hace un momento';
  const diffMin = Math.floor(diffSeg / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `Hace ${diffHoras} h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `Hace ${diffDias} días`;
  return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// Renderizar tarjetas del muro
function renderizarMuro(objetos) {
  muro.innerHTML = '';

  if (!objetos || objetos.length === 0) {
    mensajeVacio.style.display = 'block';
    return;
  }

  mensajeVacio.style.display = 'none';

  objetos.forEach((obj) => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-objeto';
    tarjeta.id = `tarjeta-${obj.id}`;

    // 1. Foto arriba
    const img = document.createElement('img');
    img.src = '/uploads/' + obj.foto;
    img.alt = 'Foto del objeto';
    img.className = 'tarjeta-foto';
    tarjeta.appendChild(img);

    const contenido = document.createElement('div');
    contenido.className = 'tarjeta-contenido';

    // 2. Descripción
    const desc = document.createElement('p');
    desc.className = 'tarjeta-descripcion';
    desc.textContent = obj.descripcion;
    contenido.appendChild(desc);

    // 3. Ubicación con prefijo
    const ubicacion = document.createElement('p');
    ubicacion.className = 'tarjeta-ubicacion';
    ubicacion.textContent = 'Encontrado en: ' + obj.ubicacion;
    contenido.appendChild(ubicacion);

    // 4. Fecha relativa
    const fecha = document.createElement('p');
    fecha.className = 'tarjeta-fecha';
    fecha.textContent = formatoFechaRelativa(obj.creado_en);
    contenido.appendChild(fecha);

    tarjeta.appendChild(contenido);
    muro.appendChild(tarjeta);
  });
}

// Cargar objetos desde la API
async function cargarMuro(textoBusqueda = '') {
  try {
    const url = textoBusqueda.trim()
      ? `/api/objetos?q=${encodeURIComponent(textoBusqueda.trim())}`
      : '/api/objetos';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar objetos');
    const data = await res.json();
    renderizarMuro(data);
  } catch (err) {
    console.error('Error al cargar el muro:', err);
  }
}

// Iniciar al cargar página
document.addEventListener('DOMContentLoaded', () => {
  cargarMuro();
});
