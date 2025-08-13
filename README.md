# ⚽ Sistema de Gestión de Torneos de Fútbol

Una aplicación web **desktop** para gestionar torneos, partidos y asignación de árbitros.  

Permite agregar, editar y eliminar torneos, personas y partidos, y asignar árbitros principales y asistentes a cada partido.  

Actualmente los datos se guardan en **LocalStorage**, pero está preparado para conectarse a una base de datos en el futuro.

---

## 🎯 Funcionalidades

### Torneos
- Crear, editar y eliminar torneos.
- Listado dinámico que se actualiza sin recargar la página.

### Personas
- Crear, editar y eliminar personas (árbitros y asistentes).
- Campos: alias de transferencia, celular, mail, Instagram, localidad, posee auto.

### Partidos
- Crear, editar y eliminar partidos por torneo.
- Asignar árbitros a cada partido.
- Botón **Asignar Árbitros** y **Editar Árbitros** segun el estado de asignaciones.
- Visualización de árbitros asignados en la lista de partidos.

---

## 🖥 Interfaz

### Lista de Partidos

```text
Fecha Hora | Equipo Local vs Equipo Visitante | Cancha | Observaciones
[Editar] [Eliminar] [Asignar Árbitros / Editar Árbitros]
Árbitro: Juan Pérez, Asistentes: Ana Gómez, Pedro Ruiz
```

### Modal de Asignación de Árbitros

- Árbitro Principal
- Asistente 1
- Asistente 2
- Botón para guardar asignación

---

## ⚙️ Tecnologías

- **Frontend:** HTML, CSS, JavaScript (ES6+)
- **Almacenamiento:** LocalStorage
- **Arquitectura:** Modular, servicios separados de UI, delegación de eventos

---

## 📂 Estructura del Proyecto

```
/project-root
│
├─ /services
│ ├─ torneoService.js
│ └─ partidoService.js
│
├─ /ui
│ ├─ torneoUI.js
│ └─ partidoUI.js
│
├─ /modals
│ ├─ torneoModal.js
│ ├─ personaModal.js
│ └─ partidoModal.js
│
├─ utils.js
├─ main.js
└─ index.html
```


---

## 🚀 Instalación y uso

1. Clonar el repositorio:
2. Abrir `index.html` en un navegador desktop.
3. Navegar entre Torneos, Personas y Partidos.
4. Agregar, editar y asignar árbitros según necesites.
> 🔹 Para borrar todos los datos: limpiar el LocalStorage del navegador.

### 🔮 Futuras mejoras

- Conexión a base de datos para almacenamiento persistente.
- Autenticación de usuarios.
- Exportación de planillas de torneos y partidos.
- Notificaciones y recordatorios automáticos.
- Diseño responsive para móviles y tablets.