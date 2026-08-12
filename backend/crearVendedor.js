const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function crearVendedor() {
  try {
    const contrasena = 'vendedor123';
    const hash = await bcrypt.hash(contrasena, 10);

    const [resultado] = await pool.query(
      `INSERT INTO usuario
      (nombres, apellidos, usuario, contraseña, estado, id_rol)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Vendedor',
        'Ferreteria Abad',
        'vendedor',
        hash,
        'Activo',
        2
      ]
    );

    console.log('Vendedor creado correctamente.');
    console.log('ID:', resultado.insertId);
    console.log('Usuario: vendedor');
    console.log('Contraseña: vendedor123');
    console.log('Rol: Vendedor');
  } catch (error) {
    console.error('Error al crear vendedor:', error.message);
  } finally {
    await pool.end();
  }
}

crearVendedor();