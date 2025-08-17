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
let personaEditandoId = null; // Cambiado de índice a persona_id

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
  personaEditandoId = null;
}

// Ahora recibe persona_id
export function editarPersona(persona_id) {
  const p = personaService.obtenerPersonas().find(p => p.persona_id == persona_id);
  console.log('Editando persona:', p);
  if (!p) return console.error('Persona no encontrada:', persona_id);

  document.getElementById('modalNombrePersona').value = p.nombre;
  document.getElementById('modalAlias').value = p.alias;
  document.getElementById('modalCelular').value = p.celular;
  document.getElementById('modalMail').value = p.mail;
  document.getElementById('modalInstagram').value = p.instagram;
  document.getElementById('modalLocalidad').value = p.localidad;
  document.getElementById('modalTieneAuto').checked = p.tieneAuto;

  modoEdicionPersona = true;
  personaEditandoId = persona_id;

  tituloModalPersona.textContent = 'Editar Persona';
  personaFormModal.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  abrirModalPersona();
}

// Ahora recibe persona_id
export function eliminarPersona(persona_id) {
  if (confirm('¿Eliminar esta persona?')) {
    personaService.eliminarPersona(persona_id);
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

  let nuevaPersona;
  if (modoEdicionPersona) {
    const pExistente = personaService.obtenerPersonas().find(p => p.persona_id === personaEditandoId);
    if (!pExistente) return;

    // Creamos la persona usando el mismo ID
    nuevaPersona = new Persona(nombre, alias, celular, mail, instagram, localidad, tieneAuto, pExistente.persona_id);
    personaService.editarPersona(personaEditandoId, nuevaPersona);

    // Reiniciamos modo edición
    modoEdicionPersona = false;
    personaEditandoId = null;
  } else {
    nuevaPersona = new Persona(nombre, alias, celular, mail, instagram, localidad, tieneAuto, generarIdUnico());
    personaService.agregarPersona(nuevaPersona);
  }

  personaUI.renderPersonas();
  cerrarModalPersona();
});


const buscadorPersonas = document.getElementById('buscadorPersonas');

buscadorPersonas.addEventListener('input', () => {
  const filtro = buscadorPersonas.value.toLowerCase();
  const todas = personaService.obtenerPersonas();

  const filtradas = todas.filter(p => p.nombre.toLowerCase().includes(filtro));
  personaUI.renderPersonas(filtradas);
});
