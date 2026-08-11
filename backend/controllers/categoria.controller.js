const categoriaModel = require('../models/categoria.model');

async function listarCategorias(req, res) {
  try { res.json(await categoriaModel.listar()); }
  catch (error) { console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
}

async function crearCategoria(req, res) {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio.' });
  try {
    const id_categoria = await categoriaModel.crear(nombre, descripcion);
    res.status(201).json({ mensaje: 'Categoría registrada correctamente.', id_categoria });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function actualizarCategoria(req, res) {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio.' });
  try {
    const filas = await categoriaModel.actualizar(req.params.id, nombre, descripcion);
    if (filas === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
    res.json({ mensaje: 'Categoría actualizada correctamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function eliminarCategoria(req, res) {
  try {
    const filas = await categoriaModel.eliminar(req.params.id);
    if (filas === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
    res.json({ mensaje: 'Categoría eliminada correctamente.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'No se puede eliminar: hay productos en esta categoría.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria };