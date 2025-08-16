// funciones generales

export function guardarEnLocalStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

export function obtenerDeLocalStorage(clave) {
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : [];
}

export function confirmar(mensaje) {
  return window.confirm(mensaje);
}

// funcion para generar un ID único
export function generarIdUnico() {
  return crypto.randomUUID();;
}