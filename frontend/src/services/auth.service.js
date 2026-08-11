import api from './api';

export async function iniciarSesion({ usuario, contrasena, id_rol }) {
  const respuesta = await api.post('/auth/login', { usuario, contrasena, id_rol });
  return respuesta.data;
}

export async function obtenerRoles() {
  const respuesta = await api.get('/roles');
  return respuesta.data;
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}