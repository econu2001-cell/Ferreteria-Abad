import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Topbar from '../components/Topbar';
import { listarProductos } from '../services/producto.service';

export default function Reportes() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch((error) => console.error('Error al cargar el reporte:', error))
      .finally(() => setCargando(false));
  }, []);

  const totalInventario = productos.reduce((suma, p) => suma + Number(p.precio) * p.stock, 0);
  const totalUnidades = productos.reduce((suma, p) => suma + p.stock, 0);

  function exportarExcel() {
    if (productos.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No hay productos para exportar.' });
      return;
    }

    // RF10: exportar reporte de inventario en formato Excel
    const filas = productos.map((p) => ({
      Código: p.codigo,
      Nombre: p.nombre,
      Categoría: p.categoria,
      'Precio (S/)': Number(p.precio),
      Stock: p.stock,
      'Stock mínimo': p.stock_minimo,
      Estado: p.stock <= p.stock_minimo ? 'Stock Bajo' : 'Normal',
    }));

    filas.push({
      Código: '', Nombre: '', Categoría: '', 'Precio (S/)': '',
      Stock: totalUnidades, 'Stock mínimo': '', Estado: `Total: S/ ${totalInventario.toFixed(2)}`,
    });

    const hoja = XLSX.utils.json_to_sheet(filas);
    hoja['!cols'] = [
      { wch: 10 }, { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 14 },
    ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');

    const nombreArchivo = `reporte_inventario_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(libro, nombreArchivo);
  }

  return (
    <>
      <Topbar titulo="Reporte de Inventario" />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 mb-0">Reporte de Inventario</h2>
            <p className="text-muted mb-0">Generado el {fechaHoy}</p>
          </div>
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={exportarExcel}>
            <Download size={18} /> Exportar Inventario a Excel
          </button>
        </div>

        <div className="panel-blanco">
          {cargando && <p>Cargando información...</p>}

          {!cargando && (
            <table className="table align-middle">
              <thead>
                <tr className="tabla-reporte-encabezado">
                  <th>CÓDIGO</th>
                  <th>NOMBRE</th>
                  <th>CATEGORÍA</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
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
                      <td><span className="badge-categoria">{p.categoria}</span></td>
                      <td>S/ {Number(p.precio).toFixed(2)}</td>
                      <td className="fw-semibold">{p.stock}</td>
                      <td>
                        <span className={stockBajo ? 'badge-stock-bajo' : 'badge-normal'}>
                          {stockBajo ? 'Stock Bajo' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {productos.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No hay productos registrados.</td></tr>
                )}
              </tbody>
              {productos.length > 0 && (
                <tfoot>
                  <tr className="fw-bold border-top">
                    <td colSpan={3}>Total inventario</td>
                    <td>S/ {totalInventario.toFixed(2)}</td>
                    <td>{totalUnidades} uds.</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </div>
    </>
  );
}