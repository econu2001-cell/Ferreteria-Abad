import { useEffect, useState } from 'react';
import { Search, Plus, X, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import ModalVentaExitosa from '../components/ModalVentaExitosa';
import { listarClientes } from '../services/cliente.service';
import { buscarProductoPorCodigo } from '../services/producto.service';
import { registrarVenta } from '../services/venta.service';

export default function Ventas() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/vendedor';

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState('Boleta');

  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [items, setItems] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [ventaRegistrada, setVentaRegistrada] = useState(null);

  const fechaHoy = new Date().toLocaleDateString('es-PE');

  useEffect(() => {
    if (clienteSeleccionado || busquedaCliente.trim().length < 2) {
      setSugerenciasCliente([]);
      return;
    }
    const temporizador = setTimeout(() => {
      listarClientes(busquedaCliente).then(setSugerenciasCliente);
    }, 300);
    return () => clearTimeout(temporizador);
  }, [busquedaCliente, clienteSeleccionado]);

  function seleccionarCliente(cliente) {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(`${cliente.nombres} ${cliente.apellidos}`.trim());
    setSugerenciasCliente([]);
  }

  function manejarCambioBusquedaCliente(valor) {
    setBusquedaCliente(valor);
    setClienteSeleccionado(null);
  }

  async function agregarProducto() {
    const codigo = codigoProducto.trim();
    const cantidad = Number(cantidadProducto);

    if (!codigo) { Swal.fire({ icon: 'warning', title: 'Ingrese el código del producto.' }); return; }
    if (!cantidad || cantidad <= 0) { Swal.fire({ icon: 'warning', title: 'Ingrese una cantidad válida.' }); return; }

    try {
      const producto = await buscarProductoPorCodigo(codigo);
      const yaEnCarrito = items.find((i) => i.id_producto === producto.id_producto);
      const cantidadTotal = (yaEnCarrito?.cantidad || 0) + cantidad;

      if (cantidadTotal > producto.stock) {
        Swal.fire({ icon: 'error', title: 'Stock insuficiente', text: `Solo hay ${producto.stock} unidades disponibles de "${producto.nombre}".` });
        return;
      }

      if (yaEnCarrito) {
        setItems(items.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: cantidadTotal, subtotal: producto.precio * cantidadTotal }
            : i
        ));
      } else {
        setItems([...items, {
          id_producto: producto.id_producto, codigo: producto.codigo, nombre: producto.nombre,
          precio: Number(producto.precio), cantidad, subtotal: Number(producto.precio) * cantidad,
        }]);
      }

      setCodigoProducto('');
      setCantidadProducto(1);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo agregar el producto.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    }
  }

  function quitarItem(idProducto) {
    setItems(items.filter((i) => i.id_producto !== idProducto));
  }

  const total = items.reduce((suma, i) => suma + i.subtotal, 0);

  function limpiarFormulario() {
    setBusquedaCliente('');
    setClienteSeleccionado(null);
    setTipoComprobante('Boleta');
    setItems([]);
  }

  async function manejarRegistrarVenta() {
    if (!clienteSeleccionado) { Swal.fire({ icon: 'warning', title: 'Seleccione un cliente de la lista.' }); return; }
    if (items.length === 0) { Swal.fire({ icon: 'warning', title: 'Agregue al menos un producto a la venta.' }); return; }

    setEnviando(true);
    try {
      const datos = await registrarVenta({
        id_cliente: clienteSeleccionado.id_cliente,
        tipo_comprobante: tipoComprobante,
        items: items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
      });

      setVentaRegistrada({ id_venta: datos.id_venta, numeroComprobante: datos.numero_comprobante });
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo registrar la venta.';
      Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
    } finally {
      setEnviando(false);
    }
  }

  function manejarVerComprobante() {
    navigate(`${basePath}/ventas/${ventaRegistrada.id_venta}/comprobante`);
  }

  function manejarNuevaVentaDesdeModal() {
    limpiarFormulario();
    setVentaRegistrada(null);
  }

  return (
    <>
      <Topbar titulo="Registrar Venta" />

      <div className="p-4">
        <h2 className="h4 mb-3">Registrar Venta</h2>

        <div className="row g-3 mb-3">
          <div className="col-lg-6">
            <div className="panel-blanco">
              <h3 className="h6 text-muted mb-3">DATOS DE LA VENTA</h3>
              <div className="mb-3 posicion-relativa">
                <label className="form-label">Cliente (DNI o nombre)</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                  <input className="form-control border-start-0" placeholder="Buscar cliente..." value={busquedaCliente} onChange={(e) => manejarCambioBusquedaCliente(e.target.value)} />
                </div>
                {sugerenciasCliente.length > 0 && (
                  <div className="lista-sugerencias">
                    {sugerenciasCliente.map((c) => (
                      <button type="button" key={c.id_cliente} className="sugerencia-item" onClick={() => seleccionarCliente(c)}>
                        {c.dni} — {c.nombres} {c.apellidos}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de venta</label>
                <input className="form-control" value={fechaHoy} readOnly disabled />
              </div>
              <div>
                <label className="form-label">Tipo de comprobante</label>
                <select className="form-select" value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}>
                  <option value="Boleta">Boleta</option>
                  <option value="Factura">Factura</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="panel-blanco">
              <h3 className="h6 text-muted mb-3">AGREGAR PRODUCTO</h3>
              <div className="row g-2 mb-3">
                <div className="col-8">
                  <label className="form-label">Código</label>
                  <input className="form-control" placeholder="P001" value={codigoProducto} onChange={(e) => setCodigoProducto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && agregarProducto()} />
                </div>
                <div className="col-4">
                  <label className="form-label">Cantidad</label>
                  <input type="number" min={1} className="form-control" value={cantidadProducto} onChange={(e) => setCantidadProducto(e.target.value)} />
                </div>
              </div>
              <button className="btn btn-azul w-100 d-flex align-items-center justify-content-center gap-2" onClick={agregarProducto}>
                <Plus size={18} /> Agregar a la venta
              </button>
            </div>
          </div>
        </div>

        <div className="panel-blanco">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="h6 mb-0">Detalle de productos</h3>
            <span className="text-muted small">{items.length} items</span>
          </div>

          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>CÓDIGO</th><th>PRODUCTO</th><th>PRECIO UNIT.</th><th>CANTIDAD</th><th>SUBTOTAL</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id_producto}>
                  <td className="text-primary">{i.codigo}</td>
                  <td>{i.nombre}</td>
                  <td>S/ {i.precio.toFixed(2)}</td>
                  <td className="fw-semibold">{i.cantidad}</td>
                  <td className="fw-semibold">S/ {i.subtotal.toFixed(2)}</td>
                  <td><button className="btn btn-link btn-sm text-danger" onClick={() => quitarItem(i.id_producto)}><X size={16} /></button></td>
                </tr>
              ))}
              {items.length === 0 && (<tr><td colSpan={6} className="text-center text-muted py-4">Aún no ha agregado productos.</td></tr>)}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
            <span className="fw-semibold">Total de la venta:</span>
            <span className="fs-4 fw-bold text-primary">S/ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={manejarRegistrarVenta} disabled={enviando}>
            <CheckCircle size={18} /> {enviando ? 'Registrando...' : 'Registrar Venta'}
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={limpiarFormulario}>
            <X size={18} /> Cancelar
          </button>
        </div>
      </div>

      {ventaRegistrada && (
        <ModalVentaExitosa
          numeroComprobante={ventaRegistrada.numeroComprobante}
          onVerComprobante={manejarVerComprobante}
          onNuevaVenta={manejarNuevaVentaDesdeModal}
        />
      )}
    </>
  );
}