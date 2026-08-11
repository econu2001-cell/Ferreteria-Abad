import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Topbar from '../components/Topbar';
import ModalCategoria from '../components/ModalCategoria';
import {
  listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
} from '../services/categoria.service';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  async function cargarCategorias() {
    const datos = await listarCategorias();
    setCategorias(datos);
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  function abrirNueva() {
    setCategoriaEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(categoria) {
    setCategoriaEditando(categoria);
    setModalAbierto(true);
  }

  async function manejarGuardar(form) {
    try {
      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.id_categoria, form);
        Swal.fire({ icon: 'success', title: 'Categoría actualizada', timer: 1200, showConfirmButton: false });
      } else {
        await crearCategoria(form);
        Swal.fire({ icon: 'success', title: 'Categoría registrada', timer: 1200, showConfirmButton: false });
      }
      setModalAbierto(false);
      cargarCategorias();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo guardar la categoría.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  async function manejarEliminar(categoria) {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: `¿Eliminar "${categoria.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await eliminarCategoria(categoria.id_categoria);
      cargarCategorias();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo eliminar la categoría.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  return (
    <>
      <Topbar titulo="Categorías" />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 mb-0">Gestión de Categorías</h2>
            <p className="text-muted mb-0">{categorias.length} categorías registradas</p>
          </div>
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={abrirNueva}>
            <Plus size={18} /> Agregar Categoría
          </button>
        </div>

        <div className="panel-blanco">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>#</th>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c, indice) => (
                <tr key={c.id_categoria}>
                  <td className="text-muted">{String(indice + 1).padStart(2, '0')}</td>
                  <td className="fw-semibold">{c.nombre}</td>
                  <td className="text-muted">{c.descripcion}</td>
                  <td>
                    <button className="btn btn-link btn-sm text-primary" onClick={() => abrirEditar(c)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-link btn-sm text-danger" onClick={() => manejarEliminar(c)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted py-4">No hay categorías registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <ModalCategoria
          categoria={categoriaEditando}
          onGuardar={manejarGuardar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}