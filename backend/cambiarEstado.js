const { pool } = require('./config/db');

async function cambiarEstado() {
    try {
        await pool.query(`
            ALTER TABLE usuario
            MODIFY COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'Activo'
        `);

        console.log('Columna estado actualizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar estado:', error.message);
    } finally {
        await pool.end();
    }
}

cambiarEstado();