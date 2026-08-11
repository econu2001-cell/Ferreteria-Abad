const express = require('express');
const { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoria.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verificarToken, listarCategorias);
router.post('/', verificarToken, permitirRoles('Administrador'), crearCategoria);
router.put('/:id', verificarToken, permitirRoles('Administrador'), actualizarCategoria);
router.delete('/:id', verificarToken, permitirRoles('Administrador'), eliminarCategoria);

module.exports = router;