const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function cambiarAdmin() {
  try {
    const nuevaContrasena = 'admin123';
    const hash = await bcrypt.hash(nuevaContrasena, 10);

    const [resultado] = await pool.query(
      `UPDATE usuario
       SET contraseña = ?
       WHERE usuario = ? AND id_rol = ?`,
      [hash, 'admin', 1]
    );

    console.log('Filas actualizadas:', resultado.affectedRows);

    if (resultado.affectedRows === 1) {
      console.log('Contraseña del administrador actualizada correctamente.');
      console.log('Usuario: admin');
      console.log('Nueva contraseña: admin123');
    } else {
      console.log('No se encontró el usuario administrador.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

cambiarAdmin();