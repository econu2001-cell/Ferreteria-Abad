const { pool } = require('../config/db');

async function listar(buscar) {
  let sql = `
    SELECT p.id_producto, p.codigo, p.nombre, p.descripcion, p.precio,
           p.stock, p.stock_minimo, c.id_categoria, c.nombre AS categoria
    FROM producto p JOIN categoria c ON c.id_categoria = p.id_categoria
  `;
  const parametros = [];
  if (buscar) {
    sql += ' WHERE p.codigo LIKE ? OR p.nombre LIKE ? OR c.nombre LIKE ? ';
    const termino = `%${buscar}%`;
    parametros.push(termino, termino, termino);
  }
  sql += ' ORDER BY p.id_producto DESC';
  const [filas] = await pool.query(sql, parametros);
  return filas;
}

async function obtenerPorCodigo(codigo) {
  const [[producto]] = await pool.query(
    'SELECT id_producto, codigo, nombre, precio, stock FROM producto WHERE codigo = ?', [codigo]
  );
  return producto || null;
}

async function crear(d) {
  const [r] = await pool.query(
    `INSERT INTO producto (codigo, nombre, descripcion, precio, stock, stock_minimo, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.codigo, d.nombre, d.descripcion || null, d.precio, d.stock, d.stock_minimo, d.id_categoria]
  );
  return r.insertId;
}

async function actualizar(id, d) {
  const [r] = await pool.query(
    `UPDATE producto SET codigo=?, nombre=?, descripcion=?, precio=?, stock=?, stock_minimo=?, id_categoria=? WHERE id_producto=?`,
    [d.codigo, d.nombre, d.descripcion || null, d.precio, d.stock, d.stock_minimo, d.id_categoria, id]
  );
  return r.affectedRows;
}

async function eliminar(id) {
  const [r] = await pool.query('DELETE FROM producto WHERE id_producto = ?', [id]);
  return r.affectedRows;
}

module.exports = { listar, obtenerPorCodigo, crear, actualizar, eliminar };