import { useEffect, useState } from 'react';
import { Search, TriangleAlert } from 'lucide-react';
import Topbar from '../components/Topbar';
import { listarProductos } from '../services/producto.service';

export default function ConsultarStock() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  async function cargarProductos(termino = '') {
    const datos = await listarProductos(termino);
    setProductos(datos);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(() => cargarProductos(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  const productosStockBajo = productos.filter((p) => p.stock <= p.stock_minimo);

  return (
    <>
      <Topbar titulo="Consulta de Stock" />

      <div className="p-4">
        <h2 className="h4 mb-3">Consulta de Stock</h2>

        <div className="panel-blanco mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="panel-blanco mb-3">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>CÓDIGO</th>
                <th>PRODUCTO</th>
                <th>STOCK DISPONIBLE</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const stockBajo = p.stock <= p.stock_minimo;
                return (
                  <tr key={p.id_producto}>
                    <td className="text-primary">{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>
                      <span className={stockBajo ? 'fw-bold text-danger' : 'fw-bold'}>
                        {p.stock}
                      </span>{' '}
                      <span className="text-muted small">unidades</span>
                    </td>
                    <td>
                      <span className={stockBajo ? 'badge-stock-bajo' : 'badge-normal'}>
                        {stockBajo ? 'Stock Bajo' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {productos.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted py-4">No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {productosStockBajo.length > 0 && (
          <div className="alerta-stock-banner d-flex align-items-center gap-2">
            <TriangleAlert size={18} className="text-danger flex-shrink-0" />
            <span>
              <strong>{productosStockBajo.length} producto(s)</strong> con stock igual o inferior al mínimo. Se recomienda realizar un abastecimiento.
            </span>
          </div>
        )}
      </div>
    </>
  );
}