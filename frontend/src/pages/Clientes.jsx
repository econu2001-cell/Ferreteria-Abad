import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Topbar from '../components/Topbar';
import ModalCliente from '../components/ModalCliente';
import {
  listarClientes, crearCliente, actualizarCliente, eliminarCliente,
} from '../services/cliente.service';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  async function cargarClientes(termino = '') {
    const datos = await listarClientes(termino);
    setClientes(datos);
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(() => cargarClientes(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  function abrirNuevo() {
    setClienteEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(cliente) {
    setClienteEditando(cliente);
    setModalAbierto(true);
  }

  async function manejarGuardar(form) {
    try {
      if (clienteEditando) {
        await actualizarCliente(clienteEditando.id_cliente, form);
        Swal.fire({ icon: 'success', title: 'Cliente actualizado', timer: 1200, showConfirmButton: false });
      } else {
        await crearCliente(form);
        Swal.fire({ icon: 'success', title: 'Cliente registrado', timer: 1200, showConfirmButton: false });
      }
      setModalAbierto(false);
      cargarClientes(busqueda);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo guardar el cliente.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  async function manejarEliminar(cliente) {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: `¿Eliminar a "${cliente.nombres}"?`,
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await eliminarCliente(cliente.id_cliente);
      cargarClientes(busqueda);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo eliminar el cliente.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  return (
    <>
      <Topbar titulo="Clientes" />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 mb-0">Gestión de Clientes</h2>
            <p className="text-muted mb-0">{clientes.length} clientes registrados</p>
          </div>
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={abrirNuevo}>
            <Plus size={18} /> Registrar Cliente
          </button>
        </div>

        <div className="panel-blanco mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Buscar por DNI o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="panel-blanco">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>DNI</th>
                <th>NOMBRE</th>
                <th>TELÉFONO</th>
                <th>DIRECCIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id_cliente}>
                  <td className="text-primary">{c.dni}</td>
                  <td className="fw-semibold">{`${c.nombres} ${c.apellidos}`.trim()}</td>
                  <td className="text-muted">{c.telefono || '-'}</td>
                  <td className="text-muted">{c.direccion || '-'}</td>
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
              {clientes.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-4">No se encontraron clientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <ModalCliente
          cliente={clienteEditando}
          onGuardar={manejarGuardar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}