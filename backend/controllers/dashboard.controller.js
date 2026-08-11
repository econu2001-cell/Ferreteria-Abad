const dashboardModel = require('../models/dashboard.model');

async function obtenerDashboard(req, res) {
  try {
    const resumen = await dashboardModel.obtenerResumen();
    const ventasRecientes = await dashboardModel.obtenerVentasRecientes();
    const alertasStock = await dashboardModel.obtenerAlertasStock();

    res.json({
      resumen,
      ventasRecientes: ventasRecientes.map((v) => ({
        numero: `V-${String(v.id_venta).padStart(6, '0')}`,
        cliente: v.cliente, total: v.total, fecha: v.fecha,
      })),
      alertasStock,
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { obtenerDashboard };