const express = require('express');
const { listarRoles } = require('../controllers/rol.controller');
const router = express.Router();
router.get('/', listarRoles);
module.exports = router;