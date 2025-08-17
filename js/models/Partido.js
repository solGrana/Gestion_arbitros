export class Partido {
  constructor(torneo_id, fecha, hora, cancha, equipoLocal, equipoVisitante, observaciones = '', arbitroPrincipal = '', asistente1 = '', asistente2 = '') {
    this.torneo = torneo_id;
    this.fecha = fecha;
    this.hora = hora;
    this.cancha = cancha;
    this.equipoLocal = equipoLocal;
    this.equipoVisitante = equipoVisitante;
    this.observaciones = observaciones;
    this.arbitroPrincipal = arbitroPrincipal;
    this.asistente1 = asistente1;
    this.asistente2 = asistente2;
  }
}