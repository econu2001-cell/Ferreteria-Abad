const { pool } = require('../config/db');

async function buscarPorUsuario(usuario) {
  const [filas] = await pool.query(
    `SELECT u.id_usuario, u.nombres, u.apellidos, u.usuario,
            u.\`contraseña\` AS contrasena, u.estado, u.id_rol,
            r.nombre_rol
     FROM usuario u
     JOIN rol r ON r.id_rol = u.id_rol
     WHERE u.usuario = ?`,
    [usuario]
  );
  return filas[0] || null;
}

module.exports = { buscarPorUsuario };