import { PersonaService } from '../services/personaService.js';
import { PersonaUI } from '../ui/personaUI.js';
import { Persona } from '../models/Persona.js'; 
import { generarIdUnico } from '../utils.js';  

const personaFormModal = document.getElementById('personaFormModal');
const modalPersona = document.getElementById('modalPersona');
const tituloModalPersona = document.getElementById('tituloModalPersona');

const personaUI = new PersonaUI();
const personaService = new PersonaService();

let modoEdicionPersona = false;
let personaEditandoIndex = null;

export function abrirModalPersona() {
  modalPersona.classList.remove('hidden');
  if (!modoEdicionPersona) {
    personaFormModal.reset();
    tituloModalPersona.textContent = 'Agregar Persona';
    personaFormModal.querySelector('button[type="submit"]').textContent = 'Guardar Persona';
  }
}

export function cerrarModalPersona() {
  modalPersona.classList.add('hidden');
  modoEdicionPersona = false;
  personaEditandoIndex = null;
}

export function editarPersona(index) {
  const p = personaService.obtenerPersonas()[index];
  document.getElementById('modalNombrePersona').value = p.nombre;
  document.getElementById('modalAlias').value = p.alias;
  document.getElementById('modalCelular').value = p.celular;
  document.getElementById('modalMail').value = p.mail;
  document.getElementById('modalInstagram').value = p.instagram;
  document.getElementById('modalLocalidad').value = p.localidad;
  document.getElementById('modalTieneAuto').checked = p.tieneAuto;

  modoEdicionPersona = true;
  personaEditandoIndex = index;
  tituloModalPersona.textContent = 'Editar Persona';
  personaFormModal.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

  abrirModalPersona();
}

export function eliminarPersona(index) {
  if (confirm('¿Eliminar esta persona?')) {
    personaService.eliminarPersona(index);
    personaUI.renderPersonas();
  }
}

personaFormModal.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('modalNombrePersona').value.trim();
  const alias = document.getElementById('modalAlias').value.trim();
  const celular = document.getElementById('modalCelular').value.trim();
  const mail = document.getElementById('modalMail').value.trim();
  const instagram = document.getElementById('modalInstagram').value.trim();
  const localidad = document.getElementById('modalLocalidad').value.trim();
  const tieneAuto = document.getElementById('modalTieneAuto').checked;

  if (!nombre) {
    alert('El nombre es obligatorio');
    return;
  }

  const personaId = modoEdicionPersona
    ? personaService.obtenerPersonas()[personaEditandoIndex].persona_id
    : generarIdUnico();

  const nuevaPersona = new Persona(nombre, alias, celular, mail, instagram, localidad, tieneAuto, personaId);

  if (modoEdicionPersona) {
    personaService.editarPersona(personaEditandoIndex, nuevaPersona);
  } else {
    personaService.agregarPersona(nuevaPersona);
  }

  personaUI.renderPersonas();
  cerrarModalPersona();
});

window.addEventListener('click', function (e) {
  if (e.target === modalPersona) {
    cerrarModalPersona();
  }
});

const buscadorPersonas = document.getElementById('buscadorPersonas');

buscadorPersonas.addEventListener('input', () => {
  const filtro = buscadorPersonas.value.toLowerCase();
  const todas = personaService.obtenerPersonas();

  const filtradas = todas.filter(p => p.nombre.toLowerCase().includes(filtro));
  personaUI.renderPersonas(filtradas);
});
