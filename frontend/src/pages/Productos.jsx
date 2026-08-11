import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Topbar from '../components/Topbar';
import ModalProducto from '../components/ModalProducto';
import {
  listarProductos, crearProducto, actualizarProducto, eliminarProducto,
} from '../services/producto.service';
import { listarCategorias } from '../services/categoria.service';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

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

  function abrirNuevo() {
    setProductoEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(producto) {
    setProductoEditando(producto);
    setModalAbierto(true);
  }

  async function manejarGuardar(form) {
    try {
      if (productoEditando) {
        await actualizarProducto(productoEditando.id_producto, form);
        Swal.fire({ icon: 'success', title: 'Producto actualizado', timer: 1200, showConfirmButton: false });
      } else {
        await crearProducto(form);
        Swal.fire({ icon: 'success', title: 'Producto registrado', timer: 1200, showConfirmButton: false });
      }
      setModalAbierto(false);
      cargarProductos(busqueda);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo guardar el producto.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  async function manejarEliminar(producto) {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: `¿Eliminar "${producto.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await eliminarProducto(producto.id_producto);
      cargarProductos(busqueda);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo eliminar el producto.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  return (
    <>
      <Topbar titulo="Productos" />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 mb-0">Gestión de Productos</h2>
            <p className="text-muted mb-0">Total: {productos.length} productos registrados</p>
          </div>
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={abrirNuevo}>
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>

        <div className="panel-blanco mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Buscar por código, nombre o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="panel-blanco">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>CÓDIGO</th>
                <th>NOMBRE</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>STK. MÍN</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const stockBajo = p.stock <= p.stock_minimo;
                return (
                  <tr key={p.id_producto}>
                    <td className="text-primary">{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td><span className="badge-categoria">{p.categoria}</span></td>
                    <td>S/ {Number(p.precio).toFixed(2)}</td>
                    <td className="fw-semibold">{p.stock}</td>
                    <td className="text-muted">{p.stock_minimo}</td>
                    <td>
                      <span className={stockBajo ? 'badge-stock-bajo' : 'badge-normal'}>
                        {stockBajo ? 'Stock Bajo' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-link btn-sm text-primary" onClick={() => abrirEditar(p)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-link btn-sm text-danger" onClick={() => manejarEliminar(p)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {productos.length === 0 && (
                <tr><td colSpan={8} className="text-center text-muted py-4">No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <ModalProducto
          producto={productoEditando}
          categorias={categorias}
          onGuardar={manejarGuardar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}