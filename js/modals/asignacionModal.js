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

function llenarSelectPersonas(select, seleccionado = '') {
  select.innerHTML = '<option value="">-- Seleccionar --</option>';
  personaService.obtenerPersonas().forEach(p => {
    const option = document.createElement('option');
    option.value = p.nombre;
    option.textContent = p.nombre;
    if (p.nombre === seleccionado) option.selected = true;
    select.appendChild(option);
  });
}

export function abrirModalAsignacion(torneoNombre, indiceEnTorneo, encontrarIndiceGlobalPartido) {
  const i = encontrarIndiceGlobalPartido(torneoNombre, indiceEnTorneo);
  if (i === -1) return alert('Partido no encontrado');
  
  partidoEditandoAsignacionIndex = i;
  const partido = partidoService.obtenerPartidos()[i];
  
  llenarSelectPersonas(selectPrincipal, partido.arbitroPrincipal);
  llenarSelectPersonas(selectAsistente1, partido.asistente1);
  llenarSelectPersonas(selectAsistente2, partido.asistente2);

  modalAsignacion.classList.remove('hidden');
}

export function cerrarModalAsignacion() {
  modalAsignacion.classList.add('hidden');
}

formAsignacion.addEventListener('submit', e => {
  e.preventDefault();
  
  const partidos = partidoService.obtenerPartidos();
  const partido = partidos[partidoEditandoAsignacionIndex];

  partido.arbitroPrincipal = selectPrincipal.value;
  partido.asistente1 = selectAsistente1.value;
  partido.asistente2 = selectAsistente2.value;

  partidoService._guardar(); // Método para persistir cambios
  cerrarModalAsignacion();
  window.renderPartidosCallback();
});
