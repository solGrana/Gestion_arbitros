import { TorneoService } from '../services/torneoService.js';
import { TorneoUI } from '../ui/torneoUI.js';
import { llenarSelectTorneosModal } from './partidoModal.js';
import { Torneo } from '../models/Torneo.js'; 
import { generarIdUnico } from '../utils.js';

const torneoUI = new TorneoUI();

const torneoForm = document.getElementById('torneoForm');
const modalTorneo = document.getElementById('modalTorneo');
const tituloModalTorneo = document.getElementById('tituloModalTorneo');

const torneoService = new TorneoService();

let modoEdicionTorneo = false;
let torneoEditandoId = null; // usamos id, no index

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
  torneoEditandoId = null;
}

export function editarTorneo(torneoId) {
  const t = torneoService.obtenerTorneos().find(t => t.torneo_id === torneoId);
  if (!t) return;

  document.getElementById('nombreTorneo').value = t.nombre;
  document.getElementById('fechaInicio').value = t.fechaInicio;
  document.getElementById('fechaFin').value = t.fechaFin;

  modoEdicionTorneo = true;
  torneoEditandoId = torneoId;

  tituloModalTorneo.textContent = 'Editar Torneo';
  torneoForm.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  abrirModalTorneo();
}

export function eliminarTorneo(torneoId) {
  if (confirm('¿Eliminar este torneo?')) {
    torneoService.eliminarTorneo(torneoId); 
    torneoUI.renderTorneos();
    llenarSelectTorneosModal();
  }
}

torneoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const nombre = document.getElementById('nombreTorneo').value.trim();
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;
  
  let nuevoTorneo;
  
  if (modoEdicionTorneo) {
    const tExistente = torneoService.obtenerTorneos().find(t => t.torneo_id === torneoEditandoId);
    if (!tExistente) return;

    nuevoTorneo = new Torneo(nombre, fechaInicio, fechaFin, tExistente.torneo_id);
    torneoService.editarTorneo(torneoEditandoId, nuevoTorneo); 
    modoEdicionTorneo = false;
    torneoEditandoId = null;
  } else {
    nuevoTorneo = new Torneo(nombre, fechaInicio, fechaFin, generarIdUnico());
    torneoService.agregarTorneo(nuevoTorneo);
  }
  
  torneoForm.reset();
  torneoUI.renderTorneos();
  llenarSelectTorneosModal();
  cerrarModalTorneo();
});

// buscador para filtrar torneos por nombre
const buscadorTorneos = document.getElementById('buscadorTorneos');

buscadorTorneos.addEventListener('input', function() {
  const texto = this.value.toLowerCase();
  const torneos = torneoService.obtenerTorneos();
  const torneosFiltrados = torneos.filter(t => t.nombre.toLowerCase().includes(texto));
  torneoUI.renderTorneos(torneosFiltrados);
});
