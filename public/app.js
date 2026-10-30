// app.js - Muro, modal y reporte

const muro = document.getElementById('muro');
const mensajeVacio = document.getElementById('mensaje-vacio');
const campoBusqueda = document.getElementById('campo-busqueda');

// Elementos del modal
const btnSubirReporte = document.getElementById('btn-subir-reporte');
const modalReporte = document.getElementById('modal-reporte');
const btnCancelar = document.getElementById('btn-cancelar');
const formReporte = document.getElementById('form-reporte');
const btnPublicar = document.getElementById('btn-publicar');

const campoDescripcion = document.getElementById('campo-descripcion');
const campoUbicacion = document.getElementById('campo-ubicacion');
const campoFoto = document.getElementById('campo-foto');
const campoContacto = document.getElementById('campo-contacto');

const errorDescripcion = document.getElementById('error-descripcion');
const errorUbicacion = document.getElementById('error-ubicacion');
const errorFoto = document.getElementById('error-foto');
const errorContacto = document.getElementById('error-contacto');

// Manejo seguro de localStorage para misReportes
function obtenerMisReportes() {
  try {
    const raw = localStorage.getItem('misReportes');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error al leer misReportes de localStorage:', err);
    return [];
  }
}

function guardarReporteLocal(id, token) {
  try {
    const lista = obtenerMisReportes();
    lista.push({ id, token });
    localStorage.setItem('misReportes', JSON.stringify(lista));
  } catch (err) {
    console.error('Error al guardar en misReportes:', err);
  }
}

function limpiarErrores() {
  errorDescripcion.textContent = '';
  errorUbicacion.textContent = '';
  errorFoto.textContent = '';
  errorContacto.textContent = '';
}

function abrirModal() {
  limpiarErrores();
  modalReporte.style.display = 'flex';
  campoDescripcion.focus();
}

function cerrarModal() {
  modalReporte.style.display = 'none';
  formReporte.reset();
  limpiarErrores();
}

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

    // Contenedor de acciones
    const acciones = document.createElement('div');
    acciones.className = 'tarjeta-acciones';

    // 5. Botón Contactar
    const btnContactar = document.createElement('a');
    btnContactar.className = 'btn-principal btn-contactar';
    btnContactar.textContent = 'Contactar';
    btnContactar.target = '_blank';
    btnContactar.rel = 'noopener noreferrer';

    const mensajeTexto = `Hola, creo que el objeto "${obj.descripcion}" que publicaste es mío`;
    if (obj.tipo_contacto === 'whatsapp') {
      btnContactar.href = `https://wa.me/52${obj.contacto}?text=${encodeURIComponent(mensajeTexto)}`;
    } else {
      btnContactar.href = `mailto:${obj.contacto}?subject=${encodeURIComponent('Objeto perdido')}&body=${encodeURIComponent(mensajeTexto)}`;
    }
    acciones.appendChild(btnContactar);

    contenido.appendChild(acciones);
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

// Validación básica en el navegador
function validarFormularioNavegador() {
  limpiarErrores();
  let valido = true;

  const desc = campoDescripcion.value.trim();
  if (desc.length < 5 || desc.length > 200) {
    errorDescripcion.textContent = 'La descripción debe tener entre 5 y 200 caracteres';
    valido = false;
  }

  const ubic = campoUbicacion.value.trim();
  if (ubic.length < 3 || ubic.length > 100) {
    errorUbicacion.textContent = 'La ubicación debe tener entre 3 y 100 caracteres';
    valido = false;
  }

  if (!campoFoto.files || campoFoto.files.length === 0) {
    errorFoto.textContent = 'La foto es obligatoria';
    valido = false;
  } else {
    const archivo = campoFoto.files[0];
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      errorFoto.textContent = 'Solo se permiten imágenes JPG, PNG o WEBP';
      valido = false;
    } else if (archivo.size > 5 * 1024 * 1024) {
      errorFoto.textContent = 'El archivo excede el tamaño máximo de 5 MB';
      valido = false;
    }
  }

  const cont = campoContacto.value.trim();
  if (cont.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cont)) {
      errorContacto.textContent = 'Escribe un correo válido o un WhatsApp de 10 dígitos';
      valido = false;
    }
  } else {
    const phoneCleaned = cont.replace(/[\s\-\(\)]/g, '');
    if (!/^\d{10}$/.test(phoneCleaned)) {
      errorContacto.textContent = 'Escribe un correo válido o un WhatsApp de 10 dígitos';
      valido = false;
    }
  }

  return valido;
}

// Iniciar al cargar página
document.addEventListener('DOMContentLoaded', () => {
  cargarMuro();

  // Búsqueda con debounce de 300 ms
  let temporizadorBusqueda = null;
  campoBusqueda.addEventListener('input', (e) => {
    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
      cargarMuro(e.target.value);
    }, 300);
  });

  // Eventos del modal
  btnSubirReporte.addEventListener('click', abrirModal);
  btnCancelar.addEventListener('click', cerrarModal);

  // Cerrar modal al hacer clic en el fondo
  modalReporte.addEventListener('click', (e) => {
    if (e.target === modalReporte) {
      cerrarModal();
    }
  });

  // Enviar formulario
  formReporte.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormularioNavegador()) {
      return;
    }

    btnPublicar.disabled = true;
    btnPublicar.textContent = 'Publicando...';

    try {
      const formData = new FormData(formReporte);
      const res = await fetch('/api/objetos', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.status === 201) {
        guardarReporteLocal(data.id, data.token);
        cerrarModal();
        cargarMuro();
      } else if (res.status === 400 && data.campos) {
        if (data.campos.descripcion) errorDescripcion.textContent = data.campos.descripcion;
        if (data.campos.ubicacion) errorUbicacion.textContent = data.campos.ubicacion;
        if (data.campos.foto) errorFoto.textContent = data.campos.foto;
        if (data.campos.contacto) errorContacto.textContent = data.campos.contacto;
      } else {
        alert(data.error || 'Ocurrió un error al publicar');
      }
    } catch (err) {
      console.error('Error al enviar reporte:', err);
      alert('Error de conexión con el servidor');
    } finally {
      btnPublicar.disabled = false;
      btnPublicar.textContent = 'Publicar';
    }
  });
});
