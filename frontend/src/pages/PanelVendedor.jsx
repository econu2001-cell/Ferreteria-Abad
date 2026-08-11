import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, Boxes, Search } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { obtenerVentasHoy } from '../services/venta.service';

export default function PanelVendedor() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  useEffect(() => {
    obtenerVentasHoy()
      .then(setDatos)
      .catch((error) => console.error('Error al cargar ventas de hoy:', error))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <Topbar titulo="Mi Panel" />

      <div className="p-4">
        <h2 className="h4 mb-0">Bienvenido, {usuario?.nombre}</h2>
        <p className="text-muted">Resumen de ventas del día — {fechaHoy}</p>

        {cargando && <p>Cargando información...</p>}

        {!cargando && datos && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="tarjeta-stat-borde tarjeta-stat-borde-naranja">
                  <div className="tarjeta-stat-etiqueta text-uppercase">Ventas Hoy</div>
                  <div className="tarjeta-stat-valor">{datos.ventasHoy}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tarjeta-stat-borde tarjeta-stat-borde-azul">
                  <div className="tarjeta-stat-etiqueta text-uppercase">Total del Día</div>
                  <div className="tarjeta-stat-valor">S/ {datos.totalDia.toFixed(2)}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tarjeta-stat-borde tarjeta-stat-borde-verde">
                  <div className="tarjeta-stat-etiqueta text-uppercase">Promedio por Venta</div>
                  <div className="tarjeta-stat-valor">S/ {datos.promedioPorVenta.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="panel-blanco mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 mb-0 d-flex align-items-center gap-2">
                  <TrendingUp size={16} className="text-naranja" /> Mis ventas de hoy
                </h3>
                <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={() => navigate('/vendedor/ventas')}>
                  <Plus size={18} /> Nueva venta
                </button>
              </div>

              <table className="table align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>N° VENTA</th>
                    <th>CLIENTE</th>
                    <th>ÍTEMS</th>
                    <th>TOTAL</th>
                    <th>HORA</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.ventas.map((v) => (
                    <tr key={v.numero}>
                      <td className="text-primary">{v.numero}</td>
                      <td>{v.cliente}</td>
                      <td>{v.items}</td>
                      <td className="fw-semibold">S/ {Number(v.total).toFixed(2)}</td>
                      <td className="text-muted">
                        {new Date(v.hora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {datos.ventas.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-muted py-4">Aún no has registrado ventas hoy.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <button
                  className="btn btn-azul w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/vendedor/stock')}
                >
                  <Boxes size={18} /> Consultar Stock
                </button>
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-naranja w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/vendedor/productos')}
                >
                  <Search size={18} /> Buscar Productos
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}