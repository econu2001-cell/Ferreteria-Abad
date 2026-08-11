const productoModel = require('../models/producto.model');

async function listarProductos(req, res) {
  try { res.json(await productoModel.listar(req.query.buscar)); }
  catch (error) { console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
}

async function obtenerProductoPorCodigo(req, res) {
  try {
    const producto = await productoModel.obtenerPorCodigo(req.params.codigo);
    if (!producto) return res.status(404).json({ mensaje: 'No se encontró un producto con ese código.' });
    res.json(producto);
  } catch (error) { console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
}

async function crearProducto(req, res) {
  const { codigo, nombre, precio, stock, stock_minimo, id_categoria } = req.body;
  if (!codigo || !nombre || !precio || stock === undefined || !stock_minimo || !id_categoria) {
    return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios.' });
  }
  try {
    const id_producto = await productoModel.crear(req.body);
    res.status(201).json({ mensaje: 'Producto registrado correctamente.', id_producto });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un producto con ese código.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function actualizarProducto(req, res) {
  try {
    const filas = await productoModel.actualizar(req.params.id, req.body);
    if (filas === 0) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    res.json({ mensaje: 'Producto actualizado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un producto con ese código.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function eliminarProducto(req, res) {
  try {
    const filas = await productoModel.eliminar(req.params.id);
    if (filas === 0) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    res.json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'No se puede eliminar: el producto tiene ventas registradas.' });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { listarProductos, obtenerProductoPorCodigo, crearProducto, actualizarProducto, eliminarProducto };