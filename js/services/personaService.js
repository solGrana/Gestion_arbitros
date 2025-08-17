import { guardarEnLocalStorage, obtenerDeLocalStorage, generarIdUnico } from '../utils.js';
import { Persona } from '../models/Persona.js';

const CLAVE = 'personas';

export class PersonaService {
  constructor() {
    this.personas = obtenerDeLocalStorage(CLAVE)?.map(p => new Persona(
      p.alias, p.celular, p.mail, p.instagram, p.localidad, p.tieneAuto, p.persona_id || generarIdUnico()
    )) || [];
  }

  obtenerPersonas() {
    // Siempre devolver datos actualizados desde localStorage
    this.personas = obtenerDeLocalStorage(CLAVE);
    return this.personas;
  }

  agregarPersona(persona) {
    if (!persona.persona_id) {
      persona.persona_id = generarIdUnico();
    }
    this.personas.push(persona);
    this._guardar();
  }

  editarPersona(persona_id, nuevaPersona) {
    const index = this.personas.findIndex(p => p.persona_id === persona_id);
    if (index !== -1) {
      nuevaPersona.persona_id = persona_id;
      this.personas[index] = nuevaPersona;
      this._guardar();
    }
  }

  eliminarPersona(persona_id) {
    this.personas = this.personas.filter(p => p.persona_id !== persona_id);
    this._guardar();
  }

  _guardar() {
    guardarEnLocalStorage(CLAVE, this.personas);
  }
}

export const personaService = new PersonaService();
