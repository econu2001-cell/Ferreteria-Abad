const fs = require('fs');
const { pool } = require('./config/db');

async function crearTablas() {
    try {
        const ruta = './database/database.sql';
        const sql = fs.readFileSync(ruta, 'utf8');

        const consultas = sql
            .split(';')
            .map(consulta => consulta.trim())
            .filter(consulta => consulta.length > 0);

        console.log('=================================');
        console.log('CREANDO TABLAS EN AIVEN');
        console.log('=================================');

        for (const consulta of consultas) {
            await pool.query(consulta);
        }

        console.log('Tablas creadas correctamente en Aiven.');

    } catch (error) {
        console.error('Error al crear las tablas:', error.message);
    } finally {
        await pool.end();
    }
}

crearTablas();