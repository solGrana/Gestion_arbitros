/* import { TorneoService } from '../services/TorneoService.js';
import { TorneoUI } from '../ui/torneoUI.js';
import { llenarSelectTorneosModal } from './partidoModal.js'; */

import { TorneoService } from '../services/torneoService.js';
import { TorneoUI } from '../ui/torneoUI.js';
import { llenarSelectTorneosModal } from './partidoModal.js';
import { generarIdUnico } from '../utils.js';

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
  }
}

torneoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreTorneo').value;
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  let nuevoTorneo;

  if (modoEdicionTorneo) {
    const tExistente = torneoService.obtenerTorneos()[torneoEditandoIndex];
    nuevoTorneo = {
      nombre,
      fechaInicio,
      fechaFin,
      torneo_id: tExistente.torneo_id // mantener id existente
    };
    torneoService.editarTorneo(torneoEditandoIndex, nuevoTorneo);
    modoEdicionTorneo = false;
    torneoEditandoIndex = null;
  } else {
    nuevoTorneo = {
      nombre,
      fechaInicio,
      fechaFin,
      torneo_id: generarIdUnico() // solo al crear
    };
    torneoService.agregarTorneo(nuevoTorneo);
  }

  torneoForm.reset();
  torneoUI.renderTorneos();
  llenarSelectTorneosModal();
  cerrarModalTorneo();
});

