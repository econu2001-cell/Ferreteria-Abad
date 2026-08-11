import api from './api';
export async function listarCategorias() { return (await api.get('/categorias')).data; }
export async function crearCategoria(d) { return (await api.post('/categorias', d)).data; }
export async function actualizarCategoria(id, d) { return (await api.put(`/categorias/${id}`, d)).data; }
export async function eliminarCategoria(id) { return (await api.delete(`/categorias/${id}`)).data; }