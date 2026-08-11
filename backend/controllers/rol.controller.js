const rolModel = require('../models/rol.model');

async function listarRoles(req, res) {
  try {
    res.json(await rolModel.listar());
  } catch (error) {
    console.error('Error al listar roles:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { listarRoles };