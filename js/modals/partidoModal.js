import { PartidoService } from '../services/partidoService.js';
import { TorneoService } from '../services/torneoService.js';

const modalPartido = document.getElementById('modalPartido');
const partidoFormModal = document.getElementById('partidoFormModal');
const modalTorneoSelect = document.getElementById('modalTorneoSelect');
const tituloModalPartido = document.getElementById('tituloModalPartido');

const partidoService = new PartidoService();
const torneoService = new TorneoService();

let modoEdicionPartidoModal = false;
let partidoEditandoIndexModal = null;

export function llenarSelectTorneosModal() {
  modalTorneoSelect.innerHTML = '<option value="" disabled selected>-- Selecciona un torneo --</option>';
  torneoService.obtenerTorneos().forEach(torneo => {
    const option = document.createElement('option');
    option.value = torneo.nombre;
    option.textContent = torneo.nombre;
    modalTorneoSelect.appendChild(option);
  });
}

export function abrirModalPartido() {
  llenarSelectTorneosModal();
  partidoFormModal.reset();
  modoEdicionPartidoModal = false;
  partidoEditandoIndexModal = null;
  tituloModalPartido.textContent = 'Agregar Partido';
  partidoFormModal.querySelector('button[type="submit"]').textContent = 'Guardar Partido';
  modalPartido.classList.remove('hidden');
}

export function cerrarModalPartido() {
  modalPartido.classList.add('hidden');
}

export function editarPartidoPorNombre(torneoNombre, indiceEnTorneo, encontrarIndiceGlobalPartido) {
  const i = encontrarIndiceGlobalPartido(torneoNombre, indiceEnTorneo);
  if (i === -1) return alert('Partido no encontrado');
  const p = partidoService.obtenerPartidos()[i];
  llenarSelectTorneosModal();
  modalTorneoSelect.value = p.torneo;
  document.getElementById('modalFechaPartido').value = p.fecha;
  document.getElementById('modalHoraPartido').value = p.hora;
  document.getElementById('modalCancha').value = p.cancha;
  document.getElementById('modalEquipoLocal').value = p.equipoLocal;
  document.getElementById('modalEquipoVisitante').value = p.equipoVisitante;
  document.getElementById('modalObservaciones').value = p.observaciones || '';
  modoEdicionPartidoModal = true;
  partidoEditandoIndexModal = i;
  tituloModalPartido.textContent = 'Editar Partido';
  partidoFormModal.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  modalPartido.classList.remove('hidden');
  window.renderPartidosCallback();

}

export function eliminarPartidoPorNombre(torneoNombre, indiceEnTorneo, encontrarIndiceGlobalPartido, renderPartidos) {
  const i = encontrarIndiceGlobalPartido(torneoNombre, indiceEnTorneo);
  if (i === -1) return alert('Partido no encontrado');
  if (!confirm('¿Eliminar este partido?')) return;
  partidoService.eliminarPartido(i); //callback
  renderPartidos();
}

partidoFormModal.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!modalTorneoSelect.value) {
    alert('Por favor, seleccioná un torneo antes de agregar un partido.');
    return;
  }

  const nuevoPartido = {
    torneo: modalTorneoSelect.value,
    fecha: document.getElementById('modalFechaPartido').value,
    hora: document.getElementById('modalHoraPartido').value,
    cancha: document.getElementById('modalCancha').value.trim(),
    equipoLocal: document.getElementById('modalEquipoLocal').value.trim(),
    equipoVisitante: document.getElementById('modalEquipoVisitante').value.trim(),
    observaciones: document.getElementById('modalObservaciones').value.trim() || ''
  };

  if (modoEdicionPartidoModal) {
    partidoService.editarPartido(partidoEditandoIndexModal, nuevoPartido);
    modoEdicionPartidoModal = false;
    partidoEditandoIndexModal = null;
  } else {
    partidoService.agregarPartido(nuevoPartido);
  }

 if (typeof window.renderPartidosCallback === 'function') {
    window.renderPartidosCallback();
  }

  partidoFormModal.reset();
  cerrarModalPartido();
});
