const { pool } = require('../config/db');

async function listar() {
  const [filas] = await pool.query('SELECT id_categoria, nombre, descripcion FROM categoria ORDER BY nombre');
  return filas;
}

async function crear(nombre, descripcion) {
  const [r] = await pool.query('INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
  return r.insertId;
}

async function actualizar(id, nombre, descripcion) {
  const [r] = await pool.query('UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?', [nombre, descripcion || null, id]);
  return r.affectedRows;
}

async function eliminar(id) {
  const [r] = await pool.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);
  return r.affectedRows;
}

module.exports = { listar, crear, actualizar, eliminar };