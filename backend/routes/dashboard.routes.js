const express = require('express');
const { obtenerDashboard } = require('../controllers/dashboard.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/', verificarToken, permitirRoles('Administrador'), obtenerDashboard);
module.exports = router;