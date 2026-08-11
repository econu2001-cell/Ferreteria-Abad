const { pool } = require('../config/db');

const TASA_IGV = 0.18;

async function registrar({ id_cliente, tipo_comprobante, items, id_usuario }) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    let total = 0;
    const detalles = [];

    for (const item of items) {
      const [[producto]] = await conexion.query(
        'SELECT id_producto, nombre, precio, stock FROM producto WHERE id_producto = ? FOR UPDATE',
        [item.id_producto]
      );
      if (!producto) throw { status: 404, mensaje: `Producto no encontrado (id ${item.id_producto}).` };
      if (producto.stock < item.cantidad) {
        throw { status: 409, mensaje: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}.` };
      }
      const subtotalItem = Number(producto.precio) * item.cantidad;
      total += subtotalItem;
      detalles.push({ id_producto: producto.id_producto, cantidad: item.cantidad, precio: producto.precio, subtotal: subtotalItem });
    }

    // Los precios de tus productos ya incluyen IGV (práctica habitual en venta al público en Perú).
    // Se descompone el total solo para mostrarlo desglosado en el comprobante.
    const subtotalSinIgv = Number((total / (1 + TASA_IGV)).toFixed(2));
    const igv = Number((total - subtotalSinIgv).toFixed(2));

    const [rVenta] = await conexion.query(
      'INSERT INTO venta (fecha, subtotal, igv, total, id_cliente, id_usuario) VALUES (NOW(), ?, ?, ?, ?, ?)',
      [subtotalSinIgv, igv, total, id_cliente, id_usuario]
    );
    const id_venta = rVenta.insertId;

    for (const d of detalles) {
      await conexion.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)',
        [id_venta, d.id_producto, d.cantidad, d.precio, d.subtotal]
      );
      await conexion.query('UPDATE producto SET stock = stock - ? WHERE id_producto = ?', [d.cantidad, d.id_producto]);
    }

    const numeroComprobante = `${tipo_comprobante === 'Boleta' ? 'B' : 'F'}${String(id_venta).padStart(6, '0')}`;
    await conexion.query(
      'INSERT INTO comprobante (numero, fecha, tipo, ruta_pdf, id_venta) VALUES (?, NOW(), ?, NULL, ?)',
      [numeroComprobante, tipo_comprobante, id_venta]
    );

    await conexion.commit();
    return { id_venta, numeroComprobante, total };
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

async function obtenerVentasHoyPorUsuario(id_usuario) {
  const [filas] = await pool.query(
    `SELECT v.id_venta, v.total, v.fecha,
            CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
            (SELECT COUNT(*) FROM detalle_venta dv WHERE dv.id_venta = v.id_venta) AS items
     FROM venta v
     JOIN cliente c ON c.id_cliente = v.id_cliente
     WHERE v.id_usuario = ? AND DATE(v.fecha) = CURDATE()
     ORDER BY v.fecha DESC`,
    [id_usuario]
  );
  return filas;
}

// Detalle completo de una venta, para el Comprobante (RF08)
async function obtenerDetallePorId(id_venta) {
  const [[venta]] = await pool.query(
    `SELECT v.id_venta, v.fecha, v.subtotal, v.igv, v.total,
            c.dni, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre,
            CONCAT(u.nombres, ' ', u.apellidos) AS vendedor_nombre,
            cp.numero AS numero_comprobante, cp.tipo AS tipo_comprobante
     FROM venta v
     JOIN cliente c ON c.id_cliente = v.id_cliente
     JOIN usuario u ON u.id_usuario = v.id_usuario
     LEFT JOIN comprobante cp ON cp.id_venta = v.id_venta
     WHERE v.id_venta = ?`,
    [id_venta]
  );

  if (!venta) return null;

  const [items] = await pool.query(
    `SELECT dv.cantidad, dv.precio, dv.subtotal, p.codigo, p.nombre
     FROM detalle_venta dv
     JOIN producto p ON p.id_producto = dv.id_producto
     WHERE dv.id_venta = ?`,
    [id_venta]
  );

  return { ...venta, items };
}

module.exports = { registrar, obtenerVentasHoyPorUsuario, obtenerDetallePorId };