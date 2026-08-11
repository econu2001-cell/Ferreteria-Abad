import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Topbar from '../components/Topbar';
import { listarProductos } from '../services/producto.service';
import { listarCategorias } from '../services/categoria.service';

export default function BuscarProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  async function cargarProductos(termino = '') {
    const datos = await listarProductos(termino);
    setProductos(datos);
  }

  useEffect(() => {
    cargarProductos();
    listarCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(() => cargarProductos(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => String(p.id_categoria) === categoriaFiltro)
    : productos;

  return (
    <>
      <Topbar titulo="Buscar Productos" />

      <div className="p-4">
        <h2 className="h4 mb-3">Buscar Productos</h2>

        <div className="panel-blanco mb-3">
          <div className="row g-2">
            <div className="col-md-9">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="Buscar por código o nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="panel-blanco">
          <p className="fw-semibold mb-3">{productosFiltrados.length} resultados encontrados</p>

          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>CÓDIGO</th>
                <th>NOMBRE</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>STOCK</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => {
                const stockBajo = p.stock <= p.stock_minimo;
                return (
                  <tr key={p.id_producto}>
                    <td className="text-primary">{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td><span className="badge-categoria">{p.categoria}</span></td>
                    <td>S/ {Number(p.precio).toFixed(2)}</td>
                    <td>
                      <span className={stockBajo ? 'badge-stock-bajo' : 'badge-normal'}>
                        {stockBajo ? 'Stock Bajo' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {productosFiltrados.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-4">No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}