import api from './api';
export async function listarClientes(buscar = '') { return (await api.get('/clientes', { params: { buscar } })).data; }
export async function crearCliente(d) { return (await api.post('/clientes', d)).data; }
export async function actualizarCliente(id, d) { return (await api.put(`/clientes/${id}`, d)).data; }
export async function eliminarCliente(id) { return (await api.delete(`/clientes/${id}`)).data; }