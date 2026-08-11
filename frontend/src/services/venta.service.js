import api from './api';
export async function registrarVenta(d) { return (await api.post('/ventas', d)).data; }
export async function obtenerVentasHoy() {
  const respuesta = await api.get('/ventas/hoy');
  return respuesta.data;
}
export async function obtenerVentaPorId(id) {
  const respuesta = await api.get(`/ventas/${id}`);
  return respuesta.data;
}