import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Download, Wrench } from 'lucide-react';
import jsPDF from 'jspdf';
import Topbar from '../components/Topbar';
import { obtenerVentaPorId } from '../services/venta.service';

const EMPRESA = {
  nombre: 'Ferretería Abad',
  ruc: '20456789012',
  direccion: 'Av. Industrial 1234, Lima, Perú',
};

export default function ComprobantePDF() {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerVentaPorId(id)
      .then(setVenta)
      .catch((error) => console.error('Error al cargar el comprobante:', error))
      .finally(() => setCargando(false));
  }, [id]);

  function imprimir() {
    window.print();
  }

  function descargarPDF() {
    if (!venta) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margenX = 20;
    let y = 20;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(EMPRESA.nombre, margenX, y);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.text(`RUC: ${EMPRESA.ruc}`, margenX, y);
    y += 5;
    doc.text(EMPRESA.direccion, margenX, y);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(venta.tipo_comprobante === 'Factura' ? 'FACTURA DE VENTA' : 'BOLETA DE VENTA', 140, 20);
    doc.text(`N° ${venta.numero_comprobante}`, 140, 26);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(new Date(venta.fecha).toLocaleDateString('es-PE'), 140, 31);

    y += 12;
    doc.setDrawColor(200);
    doc.line(margenX, y, 190, y);
    y += 8;

    doc.setFont(undefined, 'bold');
    doc.text('CLIENTE', margenX, y);
    doc.text('VENDEDOR', 110, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    doc.text(venta.cliente_nombre, margenX, y);
    doc.text(venta.vendedor_nombre, 110, y);
    y += 5;
    doc.text(`DNI: ${venta.dni}`, margenX, y);

    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('PRODUCTO', margenX, y);
    doc.text('CANT.', 112, y);
    doc.text('P. UNIT.', 135, y);
    doc.text('SUBTOTAL', 165, y);
    y += 2;
    doc.line(margenX, y, 190, y);
    y += 6;

    doc.setFont(undefined, 'normal');
    venta.items.forEach((item) => {
      doc.text(item.nombre, margenX, y);
      doc.text(String(item.cantidad), 114, y);
      doc.text(`S/ ${Number(item.precio).toFixed(2)}`, 135, y);
      doc.text(`S/ ${Number(item.subtotal).toFixed(2)}`, 165, y);
      y += 6;
    });

    y += 4;
    doc.line(120, y, 190, y);
    y += 6;
    doc.text('Subtotal (sin IGV)', 120, y);
    doc.text(`S/ ${Number(venta.subtotal).toFixed(2)}`, 165, y);
    y += 6;
    doc.text('IGV (18%)', 120, y);
    doc.text(`S/ ${Number(venta.igv).toFixed(2)}`, 165, y);
    y += 6;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('Total', 120, y);
    doc.text(`S/ ${Number(venta.total).toFixed(2)}`, 165, y);

    y += 16;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('Gracias por su compra en Ferretería Abad', 105, y, { align: 'center' });
    y += 5;
    doc.text('Conserve su comprobante para cualquier reclamo', 105, y, { align: 'center' });

    doc.save(`comprobante_${venta.numero_comprobante}.pdf`);
  }

  if (cargando) {
    return (<><Topbar titulo="Comprobante de Venta" /><div className="p-4">Cargando comprobante...</div></>);
  }
  if (!venta) {
    return (<><Topbar titulo="Comprobante de Venta" /><div className="p-4">No se encontró el comprobante.</div></>);
  }

  return (
    <>
      <Topbar titulo="Comprobante de Venta" />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 no-imprimir">
          <h2 className="h4 mb-0">Comprobante de Venta</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-azul d-flex align-items-center gap-2" onClick={imprimir}>
              <Printer size={18} /> Imprimir
            </button>
            <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={descargarPDF}>
              <Download size={18} /> Descargar PDF
            </button>
          </div>
        </div>

        <div className="comprobante-imprimible panel-blanco mx-auto" style={{ maxWidth: 700 }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div className="login-icono" style={{ width: 48, height: 48 }}>
                <Wrench size={22} color="#fff" />
              </div>
              <div>
                <div className="fw-bold">{EMPRESA.nombre}</div>
                <div className="text-muted small">RUC: {EMPRESA.ruc}</div>
                <div className="text-muted small">{EMPRESA.direccion}</div>
              </div>
            </div>
            <div className="text-end">
              <span className="badge-comprobante-tipo">
                {venta.tipo_comprobante === 'Factura' ? 'FACTURA DE VENTA' : 'BOLETA DE VENTA'}
              </span>
              <div className="fw-bold mt-1">N° {venta.numero_comprobante}</div>
              <div className="text-muted small">{new Date(venta.fecha).toLocaleDateString('es-PE')}</div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-6">
              <div className="text-muted small text-uppercase">Cliente</div>
              <div className="fw-semibold">{venta.cliente_nombre}</div>
              <div className="text-muted small">DNI: {venta.dni}</div>
            </div>
            <div className="col-6">
              <div className="text-muted small text-uppercase">Vendedor</div>
              <div className="fw-semibold">{venta.vendedor_nombre}</div>
            </div>
          </div>

          <table className="table align-middle mb-3">
            <thead>
              <tr className="text-muted small">
                <th>PRODUCTO</th><th>CANT.</th><th>PRECIO UNIT.</th><th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {venta.items.map((item) => (
                <tr key={item.codigo}>
                  <td className="text-primary">{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>S/ {Number(item.precio).toFixed(2)}</td>
                  <td className="fw-semibold">S/ {Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-end">
            <div style={{ minWidth: 220 }}>
              <div className="d-flex justify-content-between py-1">
                <span className="text-muted">Subtotal (sin IGV)</span>
                <span>S/ {Number(venta.subtotal).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">IGV (18%)</span>
                <span>S/ {Number(venta.igv).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5 text-primary">S/ {Number(venta.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-muted small mt-4">
            Gracias por su compra en Ferretería Abad<br />
            Conserve su comprobante para cualquier reclamo
          </div>
        </div>
      </div>
    </>
  );
}