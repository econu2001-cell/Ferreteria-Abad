const clienteModel = require('../models/cliente.model');

async function listarClientes(req, res) {
  try { res.json(await clienteModel.listar(req.query.buscar)); }
  catch (error) { console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
}

async function crearCliente(req, res) {
  const { dni, nombre_completo } = req.body;
  if (!dni || !nombre_completo) return res.status(400).json({ mensaje: 'El DNI y el nombre completo son obligatorios.' });
  if (dni.length !== 8) return res.status(400).json({ mensaje: 'El DNI debe tener 8 dígitos.' });
  try {
    const id_cliente = await clienteModel.crear(req.body);
    res.status(201).json({ mensaje: 'Cliente registrado correctamente.', id_cliente });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un cliente con ese DNI.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function actualizarCliente(req, res) {
  const { dni, nombre_completo } = req.body;
  if (!dni || !nombre_completo) return res.status(400).json({ mensaje: 'El DNI y el nombre completo son obligatorios.' });
  try {
    const filas = await clienteModel.actualizar(req.params.id, req.body);
    if (filas === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    res.json({ mensaje: 'Cliente actualizado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un cliente con ese DNI.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function eliminarCliente(req, res) {
  try {
    const filas = await clienteModel.eliminar(req.params.id);
    if (filas === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    res.json({ mensaje: 'Cliente eliminado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'No se puede eliminar: el cliente tiene ventas registradas.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { listarClientes, crearCliente, actualizarCliente, eliminarCliente };