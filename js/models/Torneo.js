export class Torneo {
  constructor(nombre, fechaInicio, fechaFin, torneo_id) {
    this.nombre = nombre;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.torneo_id = torneo_id; // id único
  }
}