import { torneoService } from '../services/torneoService.js';

export class TorneoUI {
  constructor() {
    this.servicio = torneoService;
    this.listaTorneos = document.getElementById('listaTorneos');
  }

  // Agregamos un parámetro opcional para torneos filtrados
  renderTorneos(torneosFiltrados = null) {
    const torneos = torneosFiltrados || this.servicio.obtenerTorneos();

    if (!this.listaTorneos) {
      console.error('listaTorneos es null. El elemento no existe en el DOM.');
      return;
    }

    this.listaTorneos.innerHTML = '';

    torneos.forEach((torneo) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${torneo.nombre}</strong> (${torneo.fechaInicio} a ${torneo.fechaFin})</span>
        <div class="botones-torneo">
          <button data-id="${torneo.torneo_id}" class="editar-torneo">Editar</button>
          <button data-id="${torneo.torneo_id}" class="eliminar-torneo">Eliminar</button>
        </div>
      `;
      this.listaTorneos.appendChild(li);
    });
  }
}
