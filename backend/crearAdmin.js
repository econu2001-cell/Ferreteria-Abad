const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function crearAdmin() {
    try {
        const nombre = 'Administrador';
        const apellido = 'Ferreteria Abad';
        const usuario = 'admin';
        const contrasena = 'Admin123*';
        const id_rol = 1;

        const hash = await bcrypt.hash(contrasena, 10);

        const [resultado] = await pool.query(
            `INSERT INTO usuario
            (nombres, apellidos, usuario, contraseña, estado, id_rol)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                usuario,
                hash,
                'Activo',
                id_rol
            ]
        );

        console.log('=================================');
        console.log('USUARIO ADMINISTRADOR CREADO');
        console.log('=================================');
        console.log('ID:', resultado.insertId);
        console.log('Usuario:', usuario);
        console.log('Rol: Administrador');
        console.log('Estado: Activo');
        console.log('=================================');

    } catch (error) {
        console.error('Error al crear administrador:', error.message);
    } finally {
        await pool.end();
    }
}

crearAdmin();