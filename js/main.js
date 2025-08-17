// main.js

import { TorneoUI } from './ui/torneoUI.js';
import { PersonaUI } from './ui/personaUI.js';
import { PartidoUI } from './ui/partidoUI.js';

import { abrirModalTorneo, editarTorneo, eliminarTorneo, cerrarModalTorneo } from './modals/torneoModal.js';
import { abrirModalPersona, editarPersona, eliminarPersona, cerrarModalPersona } from './modals/personaModal.js';
import { abrirModalPartido, editarPartidoPorId, eliminarPartidoPorId, cerrarModalPartido, llenarSelectTorneosModal } from './modals/partidoModal.js';
import { abrirModalAsignacion } from './modals/asignacionModal.js';

// Instancias UI y servicios
const torneoUI = new TorneoUI();
const personaUI = new PersonaUI();
const partidoUI = new PartidoUI(torneoUI.servicio, personaUI.servicio);

window.renderPartidosCallback = () => partidoUI.renderPartidos(); // función global para renderizar partidos desde modales

// Render inicial
torneoUI.renderTorneos();
personaUI.renderPersonas();
partidoUI.renderPartidos();

// --- TORNEOS ---

document.querySelector('#seccion-torneos > section.form-section > button')
  .addEventListener('click', abrirModalTorneo);

document.getElementById('listaTorneos').addEventListener('click', e => {
    if (e.target.classList.contains('editar-torneo')) {
        const torneo_id = e.target.dataset.id;  
        editarTorneo(torneo_id);
        torneoUI.renderTorneos();
    }
    if (e.target.classList.contains('eliminar-torneo')) {
        const torneo_id = e.target.dataset.id;  
        eliminarTorneo(torneo_id);
        partidoUI.renderPartidos();
        torneoUI.renderTorneos();
    }
});

// --- PERSONAS ---

document.querySelector('#seccion-personas > section.form-section > button')
  .addEventListener('click', abrirModalPersona);

document.getElementById('listaPersonas').addEventListener('click', e => {
    if (e.target.classList.contains('editar-persona')) {
        const persona_id =  e.target.dataset.id; 
        editarPersona(persona_id);  // Edita por ID
        personaUI.renderPersonas();
    }
    if (e.target.classList.contains('eliminar-persona')) {
        const persona_id =  e.target.dataset.id; 
        eliminarPersona(persona_id); // Elimina por ID
    }
});

// --- PARTIDOS ---
document.querySelector('#seccion-partidos > section.form-section > button')
  .addEventListener('click', abrirModalPartido);

document.getElementById('listaPartidos').addEventListener('click', e => {
    const torneo_id = e.target.dataset.torneo;
    const indiceEnTorneo = parseInt(e.target.dataset.index);

    if (e.target.classList.contains('editar-partido')) {
        editarPartidoPorId(torneo_id, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI));
    }
    if (e.target.classList.contains('eliminar-partido')) {
        eliminarPartidoPorId(torneo_id, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI), partidoUI.renderPartidos.bind(partidoUI));
    }
    if (e.target.classList.contains('asignar-arbitros')) {
        abrirModalAsignacion(torneo_id, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI));
    }
});

// Actualizar listado partidos después de cerrar modal partido
const modalPartido = document.getElementById('modalPartido');
modalPartido.addEventListener('transitionend', () => {
    if (modalPartido.classList.contains('hidden')) {
        partidoUI.renderPartidos();
    }
});

// Función para mostrar secciones
function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.classList.add('hidden'));

    const secMostrar = document.getElementById(`seccion-${seccion}`);
    if (secMostrar) secMostrar.classList.remove('hidden');

    const botones = document.querySelectorAll('.nav-tabs button');
    botones.forEach(btn => {
        btn.classList.toggle('activo', btn.dataset.seccion === seccion);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarSeccion('torneos');
});
window.mostrarSeccion = mostrarSeccion;

// Cerrar modales
document.querySelectorAll('.close-button').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) modal.classList.add('hidden');
    });
});

document.querySelectorAll('.close-button').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (!modalId) return;

        if (modalId === 'modalPersona') {
            cerrarModalPersona();
        } else if (modalId === 'modalTorneo') {
            cerrarModalTorneo();
        } else if (modalId === 'modalPartido') {
            cerrarModalPartido();
        }
    });
});


// Exportar partido
function exportarPartido(partido) {
    function formatearFecha(fechaISO) {
        const [year, month, day] = fechaISO.split('-');
        const fecha = new Date(year, month - 1, day);
        const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
        return fecha.toLocaleDateString('es-ES', opciones).replace(',', '').replace(/^./, str => str.toUpperCase());
    }

    const fechaFormateada = formatearFecha(partido.fecha);
    const observaciones = partido.observaciones && partido.observaciones.trim() !== '' ? `\n\n❗ ${partido.observaciones.trim()}` : '';

    let contenido = `
Torneo ${partido.torneo}.

${fechaFormateada}

⌚ Inicia ${partido.hora}.

📍 ${partido.cancha}
⚽ ${partido.equipoLocal} vs ${partido.equipoVisitante}${observaciones}
`;

    if (partido.arbitroPrincipal || partido.asistente1 || partido.asistente2) {
        contenido += `\n_______________________________\n\n`;
        if (partido.arbitroPrincipal) contenido += `Árbitro: ${partido.arbitroPrincipal}\n`;
        if (partido.asistente1) contenido += `Asist 1: ${partido.asistente1}\n`;
        if (partido.asistente2) contenido += `Asist 2: ${partido.asistente2}\n`;
    }

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Partido_${partido.torneo}_${partido.fecha}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Delegación de evento para exportar partidos
document.getElementById('listaPartidos').addEventListener('click', e => {
    if (e.target.classList.contains('exportar-partido')) {
        const torneo_id = e.target.dataset.torneo;
        const indiceEnTorneo = parseInt(e.target.dataset.index);
        const i = partidoUI.encontrarIndiceGlobalPartido(torneo_id, indiceEnTorneo);
        const partido = partidoUI.servicio.obtenerPartidos()[i];
        exportarPartido(partido);
    }
});
