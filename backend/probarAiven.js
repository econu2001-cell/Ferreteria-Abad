const { pool } = require('./config/db');

async function probarAiven() {
    try {
        console.log('=================================');
        console.log('PRUEBA DE CONEXIÓN CON AIVEN');
        console.log('=================================');

        // Comprobar servidor y base de datos
        const [resultado] = await pool.query(`
            SELECT 
                DATABASE() AS base_datos,
                VERSION() AS version_mysql
        `);

        console.log('Base de datos:', resultado[0].base_datos);
        console.log('Versión MySQL:', resultado[0].version_mysql);

        // Mostrar tablas existentes
        const [tablas] = await pool.query('SHOW TABLES');

        console.log('\nTablas existentes:');

        if (tablas.length === 0) {
            console.log('No existen tablas todavía.');
        } else {
            tablas.forEach((tabla) => {
                console.log('-', Object.values(tabla)[0]);
            });
        }

        console.log('\n=================================');
        console.log('PRUEBA FINALIZADA CORRECTAMENTE');
        console.log('=================================');

    } catch (error) {
        console.error('Error durante la prueba:', error.message);
    } finally {
        await pool.end();
    }
}

probarAiven();