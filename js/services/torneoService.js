import { guardarEnLocalStorage, obtenerDeLocalStorage } from '../utils.js';
import { Torneo } from '../models/Torneo.js';

const CLAVE = 'torneos';

// Función para generar IDs únicos
function generarIdUnico() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export class TorneoService {
  constructor() {
    this.torneos = obtenerDeLocalStorage(CLAVE)?.map(t => new Torneo(
      t.nombre, t.fechaInicio, t.fechaFin, t.torneo_id 
    )) || []; 
  }

  obtenerTorneos() {
    this.torneos = obtenerDeLocalStorage(CLAVE) || [];
    return this.torneos;
  }

  agregarTorneo(torneo) {
    if (!torneo.torneo_id) {
      torneo.torneo_id = generarIdUnico();
    }
    this.torneos.push(torneo);
    this._guardar();
  }

  editarTorneo(torneo_id, torneo) {
    const index = this.torneos.findIndex(t => t.torneo_id === torneo_id);
    if (index !== -1) {
      torneo.torneo_id = torneo_id; // mantener el mismo id
      this.torneos[index] = torneo;
      this._guardar();
    }
  }

  eliminarTorneo(torneo_id) {
    this.torneos = this.torneos.filter(t => t.torneo_id !== torneo_id);
    this._guardar();
  }

  _guardar() {
    guardarEnLocalStorage(CLAVE, this.torneos);
  }
}

export const torneoService = new TorneoService();
