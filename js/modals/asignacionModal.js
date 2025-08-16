// modalAsignacion.js
import { PartidoService } from '../services/partidoService.js';
import { PersonaService } from '../services/personaService.js';

const modalAsignacion = document.getElementById('modalAsignacion');
const formAsignacion = document.getElementById('modalAsignacionForm');
const selectPrincipal = document.getElementById('modalArbitroPrincipal');
const selectAsistente1 = document.getElementById('modalAsistente1');
const selectAsistente2 = document.getElementById('modalAsistente2');

const partidoService = new PartidoService();
const personaService = new PersonaService();

let partidoEditandoAsignacionIndex = null;

// --- Helpers UI de filtros por rol ---
function crearFiltrosParaRol(nombreRol, selectDestino) {
  // Contenedor
  const wrap = document.createElement('div');
  wrap.className = 'filtros-rol';
  wrap.style.margin = '6px 0 10px';

  // Localidad
  const labelLoc = document.createElement('label');
  labelLoc.textContent = `Filtro por Localidad (${nombreRol}): `;
  labelLoc.style.display = 'block';
  const selLoc = document.createElement('select');
  selLoc.innerHTML = `<option value="">Todas</option>`;
  labelLoc.appendChild(selLoc);

  // Auto
  const labelAuto = document.createElement('label');
  labelAuto.textContent = `Filtro por Auto (${nombreRol}): `;
  labelAuto.style.display = 'block';
  const selAuto = document.createElement('select');
  selAuto.innerHTML = `
    <option value="">Cualquiera</option>
    <option value="true">Con auto</option>
    <option value="false">Sin auto</option>
  `;
  labelAuto.appendChild(selAuto);

  wrap.appendChild(labelLoc);
  wrap.appendChild(labelAuto);

  // Insertar justo antes del select de ese rol
  selectDestino.parentNode.insertBefore(wrap, selectDestino);

  return { wrap, selLoc, selAuto };
}

function setOpcionesLocalidad(selectLocalidad, localidades) {
  const valorPrevio = selectLocalidad.value;
  selectLocalidad.innerHTML =
    `<option value="">Todas</option>` +
    localidades.map(l => `<option value="${l}">${l}</option>`).join('');
  // Restaurar si existía
  if ([...selectLocalidad.options].some(o => o.value === valorPrevio)) {
    selectLocalidad.value = valorPrevio;
  }
}

function obtenerLocalidadesUnicas() {
  return [
    ...new Set(
      personaService
        .obtenerPersonas()
        .map(p => p.localidad)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'));
}

function filtrarPersonas(localidad, auto) {
  return personaService.obtenerPersonas().filter(p => {
    const okLoc = localidad ? p.localidad === localidad : true;
    const okAuto = auto ? p.tieneAuto === (auto === 'true') : true;
    return okLoc && okAuto;
  });
}

function llenarSelectPersonas(select, personas, seleccionado = '') {
  select.innerHTML = '<option value="">-- Seleccionar --</option>';

  personas.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    opt.textContent = p.nombre;
    if (p.nombre === seleccionado) opt.selected = true;
    select.appendChild(opt);
  });
}

// --- Crear filtros por rol (una sola vez) ---
let filtrosPrincipal = null;
let filtrosAsis1 = null;
let filtrosAsis2 = null;

function asegurarFiltrosCreados() {
  if (!filtrosPrincipal) {
    filtrosPrincipal = crearFiltrosParaRol('Árbitro', selectPrincipal);
  }
  if (!filtrosAsis1) {
    filtrosAsis1 = crearFiltrosParaRol('Asist. 1', selectAsistente1);
  }
  if (!filtrosAsis2) {
    filtrosAsis2 = crearFiltrosParaRol('Asist. 2', selectAsistente2);
  }
}

// --- Vincular filtros con sus selects ---
function vincularFiltrosConSelect(filtros, selectDestino) {
  const refrescar = () => {
    const seleccionado = selectDestino.value;
    const personas = filtrarPersonas(filtros.selLoc.value, filtros.selAuto.value);
    llenarSelectPersonas(selectDestino, personas, seleccionado);
  };
  filtros.selLoc.onchange = refrescar;
  filtros.selAuto.onchange = refrescar;
  return () => refrescar();
}

// --- API del modal ---
export function abrirModalAsignacion(torneoNombre, indiceEnTorneo, encontrarIndiceGlobalPartido) {
  const i = encontrarIndiceGlobalPartido(torneoNombre, indiceEnTorneo);
  if (i === -1) return alert('Partido no encontrado');

  partidoEditandoAsignacionIndex = i;
  const partido = partidoService.obtenerPartidos()[i];

  // Asegurar filtros creados
  asegurarFiltrosCreados();

  // Rellenar opciones de localidades en cada filtro de rol
  const localidades = obtenerLocalidadesUnicas();
  setOpcionesLocalidad(filtrosPrincipal.selLoc, localidades);
  setOpcionesLocalidad(filtrosAsis1.selLoc, localidades);
  setOpcionesLocalidad(filtrosAsis2.selLoc, localidades);

  // Reset filtros (o dejá el último estado si preferís)
  filtrosPrincipal.selLoc.value = '';
  filtrosPrincipal.selAuto.value = '';
  filtrosAsis1.selLoc.value = '';
  filtrosAsis1.selAuto.value = '';
  filtrosAsis2.selLoc.value = '';
  filtrosAsis2.selAuto.value = '';

  // Cargar listas iniciales (todas las personas + preservando seleccionados previos)
  const todas = personaService.obtenerPersonas();
  llenarSelectPersonas(selectPrincipal, todas, partido.arbitroPrincipal);
  llenarSelectPersonas(selectAsistente1, todas, partido.asistente1);
  llenarSelectPersonas(selectAsistente2, todas, partido.asistente2);

  // Vincular cambios de filtros con sus selects (y hacer primer refresh controlado)
  const refreshPrincipal = vincularFiltrosConSelect(filtrosPrincipal, selectPrincipal);
  const refreshAsis1 = vincularFiltrosConSelect(filtrosAsis1, selectAsistente1);
  const refreshAsis2 = vincularFiltrosConSelect(filtrosAsis2, selectAsistente2);

  // Primer refresco acorde a filtros actuales (vacíos => muestra todas)
  refreshPrincipal();
  refreshAsis1();
  refreshAsis2();

  modalAsignacion.classList.remove('hidden');
}

export function cerrarModalAsignacion() {
  modalAsignacion.classList.add('hidden');
}

// Guardar asignación
formAsignacion.addEventListener('submit', e => {
  e.preventDefault();

  const partidos = partidoService.obtenerPartidos();
  const partido = partidos[partidoEditandoAsignacionIndex];

  partido.arbitroPrincipal = selectPrincipal.value;
  partido.asistente1 = selectAsistente1.value;
  partido.asistente2 = selectAsistente2.value;

  partidoService._guardar();
  cerrarModalAsignacion();
  window.renderPartidosCallback();
});
