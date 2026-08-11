const { pool } = require('../config/db');

async function listar(buscar) {
  let sql = `SELECT id_cliente, dni, nombres, apellidos, telefono, direccion, correo FROM cliente`;
  const parametros = [];
  if (buscar) {
    sql += ' WHERE dni LIKE ? OR nombres LIKE ? ';
    const termino = `%${buscar}%`;
    parametros.push(termino, termino);
  }
  sql += ' ORDER BY id_cliente DESC';
  const [filas] = await pool.query(sql, parametros);
  return filas;
}

async function crear({ dni, nombre_completo, telefono, direccion }) {
  const [r] = await pool.query(
    `INSERT INTO cliente (dni, nombres, apellidos, telefono, direccion) VALUES (?, ?, '', ?, ?)`,
    [dni, nombre_completo, telefono || null, direccion || null]
  );
  return r.insertId;
}

async function actualizar(id, { dni, nombre_completo, telefono, direccion }) {
  const [r] = await pool.query(
    `UPDATE cliente SET dni=?, nombres=?, apellidos='', telefono=?, direccion=? WHERE id_cliente=?`,
    [dni, nombre_completo, telefono || null, direccion || null, id]
  );
  return r.affectedRows;
}

async function eliminar(id) {
  const [r] = await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
  return r.affectedRows;
}

module.exports = { listar, crear, actualizar, eliminar };