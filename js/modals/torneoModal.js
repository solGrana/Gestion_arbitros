/* import { TorneoService } from '../services/TorneoService.js';
import { TorneoUI } from '../ui/torneoUI.js';
import { llenarSelectTorneosModal } from './partidoModal.js'; */

import { TorneoService } from '../services/TorneoService.js';
import { TorneoUI } from '../ui/torneoUI.js';
import { llenarSelectTorneosModal } from './partidoModal.js';

const torneoUI = new TorneoUI();


const torneoForm = document.getElementById('torneoForm');
const modalTorneo = document.getElementById('modalTorneo');
const tituloModalTorneo = document.getElementById('tituloModalTorneo');

/* const torneoUI = new TorneoUI(); */
const torneoService = new TorneoService();

let modoEdicionTorneo = false;
let torneoEditandoIndex = null;

export function abrirModalTorneo() {
  modalTorneo.classList.remove('hidden');
  if (!modoEdicionTorneo) {
    torneoForm.reset();
    tituloModalTorneo.textContent = 'Agregar Torneo';
    torneoForm.querySelector('button[type="submit"]').textContent = 'Guardar Torneo';
  }
}

export function cerrarModalTorneo() {
  modalTorneo.classList.add('hidden');
  modoEdicionTorneo = false;
  torneoEditandoIndex = null;
}

export function editarTorneo(index) {
  const t = torneoService.obtenerTorneos()[index];
  document.getElementById('nombreTorneo').value = t.nombre;
  document.getElementById('fechaInicio').value = t.fechaInicio;
  document.getElementById('fechaFin').value = t.fechaFin;
  modoEdicionTorneo = true;
  torneoEditandoIndex = index;
  tituloModalTorneo.textContent = 'Editar Torneo';
  torneoForm.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  abrirModalTorneo();
}

export function eliminarTorneo(index) {
  if (confirm('¿Eliminar este torneo?')) {
    torneoService.eliminarTorneo(index);
    torneoUI.renderTorneos();
    llenarSelectTorneosModal();
    // Aquí podrías disparar evento para actualizar partidos también
  }
}

torneoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const nuevoTorneo = {
    nombre: document.getElementById('nombreTorneo').value,
    fechaInicio: document.getElementById('fechaInicio').value,
    fechaFin: document.getElementById('fechaFin').value
  };

  if (modoEdicionTorneo) {
    torneoService.editarTorneo(torneoEditandoIndex, nuevoTorneo);
    modoEdicionTorneo = false;
    torneoEditandoIndex = null;
    torneoForm.querySelector('button[type="submit"]').textContent = 'Guardar Torneo';
  } else {
    torneoService.agregarTorneo(nuevoTorneo);
  }

  torneoForm.reset();
  torneoUI.renderTorneos();
  llenarSelectTorneosModal();
  cerrarModalTorneo();
});

window.addEventListener('click', function(e) {
  if (e.target === modalTorneo) {
    cerrarModalTorneo();
  }
});
