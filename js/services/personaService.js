import { guardarEnLocalStorage, obtenerDeLocalStorage } from '../utils.js';

const CLAVE = 'personas';

export class PersonaService {
  constructor() {
    this.personas = obtenerDeLocalStorage(CLAVE);
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
