import { PartidoService } from '../services/partidoService.js';

const listaPartidos = document.getElementById('listaPartidos');

export class PartidoUI {
  constructor(torneoService, personaService) {
    this.servicio = new PartidoService();
    this.torneoService = torneoService;
    this.personaService = personaService;
  }

  // Buscar índice global de un partido usando torneo_id
  encontrarIndiceGlobalPartido(torneo_id, indiceEnTorneo) {
    const partidos = this.servicio.obtenerPartidos();
    let contador = -1;
    for (let i = 0; i < partidos.length; i++) {
      if (partidos[i].torneo === torneo_id) {
        contador++;
        if (contador === indiceEnTorneo) return i;
      }
    }
    return -1;
  }

  renderPartidos() {
    const partidos = this.servicio.obtenerPartidos();
    const torneos = this.torneoService.obtenerTorneos();

    
    console.log("TORNEOS:", torneos);
    console.log("PARTIDOS:", partidos);


    listaPartidos.innerHTML = '';

    if (torneos.length === 0) {
      listaPartidos.innerHTML = '<li>No hay torneos cargados para asignar partidos.</li>';
      return;
    }

    torneos.forEach(torneo => {
      const contenedor = document.createElement('div');
      contenedor.innerHTML = `<h3>${torneo.nombre}</h3>`; // Mostramos nombre, pero usamos id internamente
      const ul = document.createElement('ul');

      // Filtrar partidos por torneo_id
      const partidosDelTorneo = partidos.filter(p => p.torneo === torneo.torneo_id);
       console.log(`Partidos filtrados para este torneo:`, partidosDelTorneo);

      if (partidosDelTorneo.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay partidos cargados para este torneo.';
        ul.appendChild(li);
      } else {
        partidosDelTorneo.forEach((p, indexTorneo) => {
          const li = document.createElement('li');

          // Verifica si ya tiene árbitros asignados
          const tieneArbitros = p.arbitroPrincipal || p.asistente1 || p.asistente2;
          const textoBoton = tieneArbitros ? "Editar Árbitros" : "Asignar Árbitros";
          const claseBoton = tieneArbitros ? "btn-verde" : "btn-rojo";

          li.innerHTML = `
            <strong>${p.fecha} ${p.hora}</strong> | ${p.equipoLocal} vs ${p.equipoVisitante} | Cancha: ${p.cancha} | Observaciones: ${p.observaciones || 'Ninguna'}<br>
            <button data-torneo="${torneo.torneo_id}" data-index="${indexTorneo}" class="editar-partido">Editar</button>
            <button data-torneo="${torneo.torneo_id}" data-index="${indexTorneo}" class="eliminar-partido">Eliminar</button>
            <button data-torneo="${torneo.torneo_id}" data-index="${indexTorneo}" class="asignar-arbitros ${claseBoton}">${textoBoton}</button>
            <button data-torneo="${torneo.torneo_id}" data-index="${indexTorneo}" class="exportar-partido">Exportar</button>
          `;

          if (tieneArbitros) {
            li.innerHTML += `<br><em>Árbitro: ${p.arbitroPrincipal || 'N/A'}, Asistentes: ${p.asistente1 || 'N/A'}, ${p.asistente2 || 'N/A'}</em>`;
          }

          ul.appendChild(li);
        });
      }

      contenedor.appendChild(ul);
      listaPartidos.appendChild(contenedor);
    });
  }
}
