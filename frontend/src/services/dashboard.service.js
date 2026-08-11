import api from './api';
export async function obtenerDashboard() {
  const respuesta = await api.get('/dashboard');
  return respuesta.data;
}