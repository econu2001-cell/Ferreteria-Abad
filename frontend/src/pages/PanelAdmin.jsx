import { useEffect, useState } from 'react';
import { Package, Tag, Users, ShoppingCart, TriangleAlert, Eye } from 'lucide-react';
import Topbar from '../components/Topbar';
import { obtenerDashboard } from '../services/dashboard.service';

export default function PanelAdmin() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerDashboard()
      .then(setDatos)
      .catch((error) => console.error('Error al cargar el dashboard:', error))
      .finally(() => setCargando(false));
  }, []);

  const tarjetas = datos
    ? [
        { icono: Package, color: 'azul', valor: datos.resumen.productos, etiqueta: 'Productos registrados' },
        { icono: Tag, color: 'morado', valor: datos.resumen.categorias, etiqueta: 'Categorías' },
        { icono: Users, color: 'verde', valor: datos.resumen.clientes, etiqueta: 'Clientes' },
        { icono: ShoppingCart, color: 'naranja', valor: datos.resumen.ventas, etiqueta: 'Ventas realizadas' },
        { icono: TriangleAlert, color: 'rojo', valor: datos.resumen.stockCritico, etiqueta: 'Stock mínimo crítico' },
      ]
    : [];

  return (
    <>
      <Topbar titulo="Dashboard" />

      <div className="p-4">
        <h2 className="h4 mb-0">Panel de Administración</h2>
        <p className="text-muted">Resumen general del sistema</p>

        {cargando && <p>Cargando información...</p>}

        {!cargando && datos && (
          <>
            <div className="row g-3 mb-4">
              {tarjetas.map(({ icono: Icono, color, valor, etiqueta }) => (
                <div className="col-6 col-md-4 col-xl" key={etiqueta}>
                  <div className="tarjeta-stat">
                    <div className={`tarjeta-stat-icono tarjeta-stat-icono-${color}`}>
                      <Icono size={20} />
                    </div>
                    <div className="tarjeta-stat-valor">{valor}</div>
                    <div className="tarjeta-stat-etiqueta">{etiqueta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3">
              <div className="col-lg-7">
                <div className="panel-blanco">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h6 mb-0">Ventas recientes</h3>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                      <Eye size={16} /> Ver todas
                    </button>
                  </div>
                  <table className="table table-borderless align-middle">
                    <thead>
                      <tr className="text-muted small">
                        <th>N°</th>
                        <th>CLIENTE</th>
                        <th>TOTAL</th>
                        <th>FECHA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.ventasRecientes.map((venta) => (
                        <tr key={venta.numero}>
                          <td className="text-primary">{venta.numero}</td>
                          <td>{venta.cliente}</td>
                          <td className="fw-semibold">S/ {Number(venta.total).toFixed(2)}</td>
                          <td className="text-muted">
                            {new Date(venta.fecha).toLocaleDateString('es-PE')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="panel-blanco">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h6 mb-0 d-flex align-items-center gap-2">
                      <TriangleAlert size={16} className="text-danger" /> Alertas de stock
                    </h3>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                      <Eye size={16} /> Ver stock
                    </button>
                  </div>
                  {datos.alertasStock.map((producto) => (
                    <div className="alerta-stock-item" key={producto.id_producto}>
                      <div>
                        <div className="fw-semibold">{producto.nombre}</div>
                        <div className="text-muted small">Min: {producto.stock_minimo} unidades</div>
                      </div>
                      <div className="text-end">
                        <div className="text-danger fw-bold">{producto.stock}</div>
                        <span className="badge-stock-bajo">Stock Bajo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}