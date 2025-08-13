import { guardarEnLocalStorage, obtenerDeLocalStorage } from '../utils.js';

const CLAVE = 'torneos';

export class TorneoService {
  constructor() {
    this.torneos = obtenerDeLocalStorage(CLAVE);
  }

  obtenerTorneos() {
    // Siempre devolver datos actualizados desde localStorage
    this.torneos = obtenerDeLocalStorage(CLAVE);
    return this.torneos;
  }

  agregarTorneo(torneo) {
    this.torneos.push(torneo);
    this._guardar();
  }

  editarTorneo(index, torneo) {
    this.torneos[index] = torneo;
    this._guardar();
  }

  eliminarTorneo(index) {
    this.torneos.splice(index, 1);
    this._guardar();
  }

  _guardar() {
    guardarEnLocalStorage(CLAVE, this.torneos);
  }
}

export const torneoService = new TorneoService();
