// main.js

import { TorneoUI } from './ui/torneoUI.js';
import { PersonaUI } from './ui/personaUI.js';
import { PartidoUI } from './ui/partidoUI.js';

import { abrirModalTorneo, editarTorneo, eliminarTorneo } from './modals/torneoModal.js';
import { abrirModalPersona, editarPersona, eliminarPersona } from './modals/personaModal.js';
import { abrirModalPartido, editarPartidoPorNombre, eliminarPartidoPorNombre, llenarSelectTorneosModal } from './modals/partidoModal.js';
import { abrirModalAsignacion } from './modals/asignacionModal.js';

// Instancias UI y servicios
const torneoUI = new TorneoUI();
const personaUI = new PersonaUI();
const partidoUI = new PartidoUI(torneoUI.servicio, personaUI.servicio);

window.renderPartidosCallback = () => partidoUI.renderPartidos(); // funcion global para renderizar partidos desde modales

// Render inicial
torneoUI.renderTorneos();
personaUI.renderPersonas();
partidoUI.renderPartidos();

// --- TORNEOS ---

// Botón abrir modal torneo
document.querySelector('#seccion-torneos > section.form-section > button').addEventListener('click', abrirModalTorneo);

// Delegación de eventos en la lista de torneos (editar y eliminar)
document.getElementById('listaTorneos').addEventListener('click', e => {
    if (e.target.classList.contains('editar-torneo')) {
        const index = parseInt(e.target.dataset.index);
        editarTorneo(index);
        torneoUI.renderTorneos();

    }
    if (e.target.classList.contains('eliminar-torneo')) {
        const index = parseInt(e.target.dataset.index);
        eliminarTorneo(index);
        partidoUI.renderPartidos(); // Actualiza partidos porque puede afectar
        torneoUI.renderTorneos();
    }
});

// --- PERSONAS ---

// Botón abrir modal persona
document.querySelector('#seccion-personas > section.form-section > button').addEventListener('click', abrirModalPersona);

// Delegación de eventos en la lista de personas (editar y eliminar)
document.getElementById('listaPersonas').addEventListener('click', e => {
    if (e.target.classList.contains('editar-persona')) {
        const index = parseInt(e.target.dataset.index);
        editarPersona(index);
        personaUI.renderPersonas();

    }
    if (e.target.classList.contains('eliminar-persona')) {
        const index = parseInt(e.target.dataset.index);
        eliminarPersona(index);
    }
});

// --- PARTIDOS ---

// Botón abrir modal partido
document.querySelector('#seccion-partidos > section.form-section > button').addEventListener('click', abrirModalPartido);

// Delegación de eventos en la lista de partidos (editar y eliminar)
document.getElementById('listaPartidos').addEventListener('click', e => {
    if (e.target.classList.contains('editar-partido')) {
        const torneoNombre = e.target.dataset.torneo;
        const indiceEnTorneo = parseInt(e.target.dataset.index);
        editarPartidoPorNombre(torneoNombre, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI));
    }
    if (e.target.classList.contains('eliminar-partido')) {
        const torneoNombre = e.target.dataset.torneo;
        const indiceEnTorneo = parseInt(e.target.dataset.index);
        eliminarPartidoPorNombre(torneoNombre, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI), partidoUI.renderPartidos.bind(partidoUI));
    }
    if (e.target.classList.contains('asignar-arbitros')) {
        const torneoNombre = e.target.dataset.torneo;
        const indiceEnTorneo = parseInt(e.target.dataset.index);
        abrirModalAsignacion(torneoNombre, indiceEnTorneo, partidoUI.encontrarIndiceGlobalPartido.bind(partidoUI));
    }
});

// Actualizar listado partidos después de cerrar modal partido (para reflejar cambios)
const modalPartido = document.getElementById('modalPartido');
modalPartido.addEventListener('transitionend', () => {
    if (modalPartido.classList.contains('hidden')) {
        partidoUI.renderPartidos();
    }
});

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.classList.add('hidden'));

    // Mostrar la sección seleccionada
    const secMostrar = document.getElementById(`seccion-${seccion}`);
    if (secMostrar) {
        secMostrar.classList.remove('hidden');
    }

    // Actualizar botones activos
    const botones = document.querySelectorAll('.nav-tabs button');
    botones.forEach(btn => {
        if (btn.dataset.seccion === seccion) {
            btn.classList.add('activo');
        } else {
            btn.classList.remove('activo');
        }
    });
}

// Mostrar la sección "torneos" al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarSeccion('torneos');
});
window.mostrarSeccion = mostrarSeccion;  // Hacer la funcion accesible globalmente


document.querySelectorAll('.close-button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Según el modal padre, lo ocultás
        const modal = btn.closest('.modal');
        if (modal) modal.classList.add('hidden');
    });
});

function exportarPartido(partido) {
    // Función para formatear fecha a "Miércoles 13 de Agosto"
    function formatearFecha(fechaISO) {
        // Crear objeto Date tomando solo año, mes, día para evitar desfase horario
        const [year, month, day] = fechaISO.split('-');
        const fecha = new Date(year, month - 1, day); // mes empieza en 0

        const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

        // Eliminar la coma y poner la primera letra en mayúscula
        return fechaFormateada.replace(',', '').replace(/^./, str => str.toUpperCase());
    }


    const fechaFormateada = formatearFecha(partido.fecha);

    // Observaciones solo si existen
    const observaciones = partido.observaciones && partido.observaciones.trim() !== ''
        ? `\n\n❗ ${partido.observaciones.trim()}`
        : '';

    // Texto del partido
    let contenido = `
Torneo ${partido.torneo}.

${fechaFormateada}

⌚ Inicia ${partido.hora}.

📍 ${partido.cancha}
⚽ ${partido.equipoLocal} vs ${partido.equipoVisitante}${observaciones}
`;

    // Solo mostrar árbitros asignados
    if (partido.arbitroPrincipal || partido.asistente1 || partido.asistente2) {
        contenido += `\n_____________________________________________\n\n`;
        if (partido.arbitroPrincipal) contenido += `Árbitro: ${partido.arbitroPrincipal}\n`;
        if (partido.asistente1) contenido += `Asist 1: ${partido.asistente1}\n`;
        if (partido.asistente2) contenido += `Asist 2: ${partido.asistente2}\n`;
    }

    // Crear blob y generar link de descarga
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Partido_${partido.torneo}_${partido.fecha}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Delegación de evento para exportar
document.getElementById('listaPartidos').addEventListener('click', e => {
    if (e.target.classList.contains('exportar-partido')) {
        const torneoNombre = e.target.dataset.torneo;
        const indiceEnTorneo = parseInt(e.target.dataset.index);
        const i = partidoUI.encontrarIndiceGlobalPartido(torneoNombre, indiceEnTorneo);
        const partido = partidoUI.servicio.obtenerPartidos()[i];
        exportarPartido(partido);
    }
});


