const express = require('express');
const { listarClientes, crearCliente, actualizarCliente, eliminarCliente } = require('../controllers/cliente.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verificarToken, listarClientes);
router.post('/', verificarToken, crearCliente);
router.put('/:id', verificarToken, actualizarCliente);
router.delete('/:id', verificarToken, eliminarCliente);

module.exports = router;