const ventaModel = require('../models/venta.model');

async function registrarVenta(req, res) {
  const { id_cliente, tipo_comprobante, items } = req.body;
  if (!id_cliente || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: 'Debe seleccionar un cliente y agregar al menos un producto.' });
  }
  if (!['Boleta', 'Factura'].includes(tipo_comprobante)) {
    return res.status(400).json({ mensaje: 'Tipo de comprobante inválido.' });
  }
  try {
    const r = await ventaModel.registrar({ id_cliente, tipo_comprobante, items, id_usuario: req.usuario.id_usuario });
    res.status(201).json({ mensaje: 'Venta registrada correctamente.', id_venta: r.id_venta, numero_comprobante: r.numeroComprobante, total: r.total });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.mensaje });
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function obtenerVentasHoy(req, res) {
  try {
    const ventas = await ventaModel.obtenerVentasHoyPorUsuario(req.usuario.id_usuario);
    const totalDia = ventas.reduce((suma, v) => suma + Number(v.total), 0);
    const cantidadVentas = ventas.length;
    const promedioPorVenta = cantidadVentas > 0 ? totalDia / cantidadVentas : 0;

    res.json({
      ventasHoy: cantidadVentas,
      totalDia,
      promedioPorVenta,
      ventas: ventas.map((v) => ({
        numero: `V-${String(v.id_venta).padStart(6, '0')}`,
        cliente: v.cliente, items: v.items, total: v.total, hora: v.fecha,
      })),
    });
  } catch (error) {
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

async function obtenerVenta(req, res) {
  try {
    const venta = await ventaModel.obtenerDetallePorId(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada.' });
    res.json(venta);
  } catch (error) {
    console.error(error); res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { registrarVenta, obtenerVentasHoy, obtenerVenta };