const { pool } = require('../config/db');

async function listar() {
  const [filas] = await pool.query('SELECT id_rol, nombre_rol FROM rol ORDER BY id_rol');
  return filas;
}

module.exports = { listar };