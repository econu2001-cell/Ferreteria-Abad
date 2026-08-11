const { pool } = require('../config/db');

async function obtenerResumen() {
    const [[productos]] = await pool.query(
        'SELECT COUNT(*) AS total FROM producto'
    );

    const [[categorias]] = await pool.query(
        'SELECT COUNT(*) AS total FROM categoria'
    );

    const [[clientes]] = await pool.query(
        'SELECT COUNT(*) AS total FROM cliente'
    );

    const [[ventas]] = await pool.query(
        'SELECT COUNT(*) AS total FROM venta'
    );

    const [[stockCritico]] = await pool.query(
        'SELECT COUNT(*) AS total FROM producto WHERE stock <= stock_minimo'
    );

    return {
        productos: productos.total,
        categorias: categorias.total,
        clientes: clientes.total,
        ventas: ventas.total,
        stockCritico: stockCritico.total
    };
}

async function obtenerVentasRecientes() {
    const [filas] = await pool.query(
        `SELECT
            v.id_venta,
            v.total,
            v.fecha,
            CONCAT(c.nombres, ' ', c.apellidos) AS cliente
         FROM venta v
         JOIN cliente c ON c.id_cliente = v.id_cliente
         ORDER BY v.fecha DESC
         LIMIT 4`
    );

    return filas;
}

// RF11: consulta directamente los productos con stock crítico
async function obtenerAlertasStock() {
    const [filas] = await pool.query(
        `SELECT
            id_producto,
            nombre,
            stock,
            stock_minimo
         FROM producto
         WHERE stock <= stock_minimo
         ORDER BY stock ASC
         LIMIT 5`
    );

    return filas;
}

module.exports = {
    obtenerResumen,
    obtenerVentasRecientes,
    obtenerAlertasStock
};