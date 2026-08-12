const { pool } = require('./config/db');

async function verificarTablas() {
    const tablas = [
        'rol',
        'usuario',
        'categoria',
        'producto',
        'cliente',
        'venta',
        'detalle_venta',
        'comprobante'
    ];

    try {
        console.log('=================================');
        console.log('VERIFICANDO TABLAS DE AIVEN');
        console.log('=================================');

        const [resultado] = await pool.query('SHOW TABLES');

        console.log('\nTablas encontradas:\n');

        resultado.forEach(tabla => {
            console.log(Object.values(tabla)[0]);
        });

        console.log('\n=================================');
        console.log('VERIFICANDO ESTRUCTURA');
        console.log('=================================\n');

        for (const tabla of tablas) {
            const [columnas] = await pool.query(`DESCRIBE ${tabla}`);

            console.log(`\n--- ${tabla} ---`);

            columnas.forEach(columna => {
                console.log(
                    `${columna.Field} | ${columna.Type} | ${columna.Null} | ${columna.Key}`
                );
            });
        }

    } catch (error) {
        console.error('Error al verificar las tablas:', error.message);
    } finally {
        await pool.end();
    }
}

verificarTablas();