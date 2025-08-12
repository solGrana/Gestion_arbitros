import { PersonaService } from '../services/personaService.js';

const listaPersonas = document.getElementById('listaPersonas');

export class PersonaUI {
  constructor() {
    this.servicio = new PersonaService();
  }

  renderPersonas() {
    const personas = this.servicio.obtenerPersonas();
    listaPersonas.innerHTML = '';
    if (personas.length === 0) {
      listaPersonas.innerHTML = '<li>No hay personas registradas.</li>';
      return;
    }
    personas.forEach((persona, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${persona.nombre}</strong> | Alias: ${persona.alias || '-'} | Celular: ${persona.celular || '-'} | Mail: ${persona.mail || '-'} | Instagram: ${persona.instagram || '-'} | Localidad: ${persona.localidad || '-'} | Auto: ${persona.tieneAuto ? 'Sí' : 'No'}
        <br />
        <button data-index="${index}" class="editar-persona">Editar</button>
        <button data-index="${index}" class="eliminar-persona">Eliminar</button>
      `;
      listaPersonas.appendChild(li);
    });
  }
}
