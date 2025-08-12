import { torneoService } from '../services/torneoService.js';

export class TorneoUI {
  constructor() {
    this.servicio = torneoService;
    this.listaTorneos = document.getElementById('listaTorneos');
  }

  renderTorneos() {
    const torneos = this.servicio.obtenerTorneos();

    if (!this.listaTorneos) {
      console.error('listaTorneos es null. El elemento no existe en el DOM.');
      return;
    }

    this.listaTorneos.innerHTML = '';
    torneos.forEach((torneo, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${torneo.nombre} (${torneo.fechaInicio} a ${torneo.fechaFin})
        <div class="botones-torneo">
          <button data-index="${index}" class="editar-torneo">Editar</button>
          <button data-index="${index}" class="eliminar-torneo">Eliminar</button>
        </div>
      `;
      this.listaTorneos.appendChild(li);
    });
  }
}
