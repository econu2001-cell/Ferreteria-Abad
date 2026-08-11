require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function verificarConexion() {
    try {
        const conexion = await pool.getConnection();

        console.log('Conexión a Aiven MySQL establecida correctamente.');

        conexion.release();
    } catch (error) {
        console.error('Error al conectar con Aiven MySQL:', error.message);
    }
}

module.exports = {
    pool,
    verificarConexion
};