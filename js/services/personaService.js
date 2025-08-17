import { guardarEnLocalStorage, obtenerDeLocalStorage } from '../utils.js';
import { Persona } from '../models/Persona.js';


const CLAVE = 'personas';

export class PersonaService {
  constructor() {
    this.personas = obtenerDeLocalStorage(CLAVE)?.map(p => new Persona(
      p.alias, p.celular, p.mail, p.instagram, p.localidad, p.tieneAuto, p.persona_id
    )) || []; 
  }

  obtenerPersonas() {
    this.personas = obtenerDeLocalStorage(CLAVE);
    return this.personas;
  }

  agregarPersona(persona) {
    this.personas.push(persona);
    this._guardar();
  }

  editarPersona(index, persona) {
    this.personas[index] = persona;
    this._guardar();
  }

  eliminarPersona(index) {
    this.personas.splice(index, 1);
    this._guardar();
  }

  _guardar() {
    guardarEnLocalStorage(CLAVE, this.personas);
  }
}
