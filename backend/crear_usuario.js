// crear_usuario.js
// Script de un solo uso para crear tu primer usuario administrador.
// Ejecutar desde la carpeta backend con:  node crear_usuario.js
// Cuando termine, puedes borrar este archivo (no se conecta con la app).

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

// -----------------------------------------------------
// EDITA ESTOS DATOS ANTES DE EJECUTAR
// -----------------------------------------------------
const NUEVO_USUARIO = {
  nombres: 'Ana',
  apellidos: 'Torres',
  usuario: 'vendedor1',
  contrasena: 'vendedor123',  
  id_rol: 2,                   // 1 = Administrador, 2 = Vendedor (según tu tabla rol)
};
// -----------------------------------------------------

async function crearUsuario() {
  try {
    const hash = await bcrypt.hash(NUEVO_USUARIO.contrasena, 10);

    const [resultado] = await pool.query(
      `INSERT INTO usuario (nombres, apellidos, usuario, \`contraseña\`, estado, id_rol)
       VALUES (?, ?, ?, ?, 'Activo', ?)`,
      [
        NUEVO_USUARIO.nombres,
        NUEVO_USUARIO.apellidos,
        NUEVO_USUARIO.usuario,
        hash,
        NUEVO_USUARIO.id_rol,
      ]
    );

    console.log('✅ Usuario creado correctamente.');
    console.log('   id_usuario:', resultado.insertId);
    console.log('   usuario:', NUEVO_USUARIO.usuario);
    console.log('   contraseña (sin encriptar, para el login):', NUEVO_USUARIO.contrasena);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('❌ Ya existe un usuario con ese nombre de usuario.');
    } else {
      console.error('❌ Error al crear el usuario:', error.message);
    }
  } finally {
    await pool.end();
  }
}

crearUsuario();