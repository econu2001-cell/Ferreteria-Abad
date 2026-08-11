const express = require('express');
const { registrarVenta, obtenerVentasHoy, obtenerVenta } = require('../controllers/venta.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/hoy', verificarToken, obtenerVentasHoy);
router.get('/:id', verificarToken, obtenerVenta);
router.post('/', verificarToken, registrarVenta);

module.exports = router;