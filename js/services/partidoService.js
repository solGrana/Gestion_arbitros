import { guardarEnLocalStorage, obtenerDeLocalStorage } from '../utils.js';

const CLAVE = 'partidos';

export class PartidoService {
  constructor() {
    this.partidos = obtenerDeLocalStorage(CLAVE);
  }

  obtenerPartidos() {
    this.partidos = obtenerDeLocalStorage(CLAVE);
    return this.partidos;
  }

  agregarPartido(partido) {
    this.partidos.push(partido);
    this._guardar();
  }

  editarPartido(index, partido) {
    this.partidos[index] = partido;
    this._guardar();
  }

  eliminarPartido(index) {
    this.partidos.splice(index, 1);
    this._guardar();
  }

  _guardar() {
    guardarEnLocalStorage(CLAVE, this.partidos);
  }
}
