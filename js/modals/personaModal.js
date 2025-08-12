import { PersonaService } from '../services/personaService.js';
import { PersonaUI } from '../ui/personaUI.js';

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

  const persona = {
    nombre: document.getElementById('modalNombrePersona').value.trim(),
    alias: document.getElementById('modalAlias').value.trim(),
    celular: document.getElementById('modalCelular').value.trim(),
    mail: document.getElementById('modalMail').value.trim(),
    instagram: document.getElementById('modalInstagram').value.trim(),
    localidad: document.getElementById('modalLocalidad').value.trim(),
    tieneAuto: document.getElementById('modalTieneAuto').checked
  };

  if (!persona.nombre) {
    alert('El nombre es obligatorio');
    return;
  }

  if (modoEdicionPersona) {
    personaService.editarPersona(personaEditandoIndex, persona);
  } else {
    personaService.agregarPersona(persona);
  }

  personaUI.renderPersonas();
  cerrarModalPersona();
});

window.addEventListener('click', function(e) {
  if (e.target === modalPersona) {
    cerrarModalPersona();
  }
});
