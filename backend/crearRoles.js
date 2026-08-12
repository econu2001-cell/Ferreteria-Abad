const { pool } = require('./config/db');

async function crearRoles() {
    try {
        const roles = [
            'Administrador',
            'Vendedor'
        ];

        console.log('=================================');
        console.log('CREANDO ROLES');
        console.log('=================================');

        for (const nombre of roles) {
            await pool.query(
                'INSERT INTO rol (nombre_rol) VALUES (?)',
                [nombre]
            );

            console.log(`Rol creado: ${nombre}`);
        }

        console.log('\nRoles creados correctamente.');

    } catch (error) {
        console.error('Error al crear roles:', error.message);
    } finally {
        await pool.end();
    }
}

crearRoles();