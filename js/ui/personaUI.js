import { PersonaService } from '../services/personaService.js';

const listaPersonas = document.getElementById('listaPersonas');

export class PersonaUI {
  constructor() {
    this.servicio = new PersonaService();
  }

renderPersonas(lista = null) {
  const personas = lista || this.servicio.obtenerPersonas();
  listaPersonas.innerHTML = '';
  if (personas.length === 0) {
    listaPersonas.innerHTML = '<li>No hay personas registradas.</li>';
    return;
  }
  personas.forEach(persona => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${persona.nombre}</strong> | Alias: ${persona.alias || '-'} | Celular: ${persona.celular || '-'} | Mail: ${persona.mail || '-'} | Instagram: ${persona.instagram || '-'} | Localidad: ${persona.localidad || '-'} | Auto: ${persona.tieneAuto ? 'Sí' : 'No'}
      <br />
      <button data-id="${persona.persona_id}" class="editar-persona">Editar</button>
      <button data-id="${persona.persona_id}" class="eliminar-persona">Eliminar</button>
    `;
    listaPersonas.appendChild(li);
  });

  console.log('Personas renderizadas:', personas);
}
}
