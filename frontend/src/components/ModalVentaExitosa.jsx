import { CheckCircle2, FileText, Plus } from 'lucide-react';

export default function ModalVentaExitosa({ numeroComprobante, onVerComprobante, onNuevaVenta }) {
  return (
    <div className="modal-fondo">
      <div className="modal-caja modal-caja-angosta text-center py-4">
        <div className="icono-exito mx-auto mb-3">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h2 className="h5 fw-bold mb-3">¡Venta registrada!</h2>
        <p className="text-muted mb-4">
          La venta N° <span className="fw-semibold text-primary">{numeroComprobante}</span> fue registrada correctamente.
          Se generará automáticamente un comprobante (Boleta o Factura) en formato PDF.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-naranja d-flex align-items-center gap-2" onClick={onVerComprobante}>
            <FileText size={18} /> Ver comprobante
          </button>
          <button className="btn btn-outline-secondary" onClick={onNuevaVenta}>
            Nueva venta
          </button>
        </div>
      </div>
    </div>
  );
}