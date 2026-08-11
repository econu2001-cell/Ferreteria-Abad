const express = require('express');
const {
  listarProductos, obtenerProductoPorCodigo, crearProducto, actualizarProducto, eliminarProducto,
} = require('../controllers/producto.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verificarToken, listarProductos);
router.get('/codigo/:codigo', verificarToken, obtenerProductoPorCodigo);
router.post('/', verificarToken, permitirRoles('Administrador'), crearProducto);
router.put('/:id', verificarToken, permitirRoles('Administrador'), actualizarProducto);
router.delete('/:id', verificarToken, permitirRoles('Administrador'), eliminarProducto);

module.exports = router;