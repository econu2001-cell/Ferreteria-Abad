import { useEffect, useState } from 'react';

const FORMULARIO_VACIO = { dni: '', nombre_completo: '', telefono: '', direccion: '' };

export default function ModalCliente({ cliente, onGuardar, onCerrar }) {
  const [form, setForm] = useState(FORMULARIO_VACIO);

  useEffect(() => {
    if (cliente) {
      setForm({
        dni: cliente.dni,
        nombre_completo: `${cliente.nombres} ${cliente.apellidos}`.trim(),
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
      });
    } else {
      setForm(FORMULARIO_VACIO);
    }
  }, [cliente]);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar(form);
  }

  return (
    <div className="modal-fondo">
      <div className="modal-caja modal-caja-angosta">
        <h2 className="h5 mb-3">{cliente ? 'Editar cliente' : 'Registrar cliente'}</h2>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              name="dni"
              className="form-control"
              value={form.dni}
              onChange={manejarCambio}
              maxLength={8}
              placeholder="Ej: 12345678"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              name="nombre_completo"
              className="form-control"
              value={form.nombre_completo}
              onChange={manejarCambio}
              placeholder="Ej: Carlos Ramírez Torres"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              name="telefono"
              className="form-control"
              value={form.telefono}
              onChange={manejarCambio}
              placeholder="Ej: 987 654 321"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              name="direccion"
              className="form-control"
              value={form.direccion}
              onChange={manejarCambio}
              placeholder="Ej: Av. Los Pinos 234, Lima"
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-naranja">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}