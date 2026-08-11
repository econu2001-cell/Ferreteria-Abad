import api from './api';
export async function listarProductos(buscar = '') { return (await api.get('/productos', { params: { buscar } })).data; }
export async function buscarProductoPorCodigo(codigo) { return (await api.get(`/productos/codigo/${codigo}`)).data; }
export async function crearProducto(d) { return (await api.post('/productos', d)).data; }
export async function actualizarProducto(id, d) { return (await api.put(`/productos/${id}`, d)).data; }
export async function eliminarProducto(id) { return (await api.delete(`/productos/${id}`)).data; }