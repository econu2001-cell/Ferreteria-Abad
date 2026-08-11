import { useEffect, useState } from 'react';

const FORMULARIO_VACIO = { nombre: '', descripcion: '' };

export default function ModalCategoria({ categoria, onGuardar, onCerrar }) {
  const [form, setForm] = useState(FORMULARIO_VACIO);

  useEffect(() => {
    if (categoria) {
      setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
    } else {
      setForm(FORMULARIO_VACIO);
    }
  }, [categoria]);

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
        <h2 className="h5 mb-3">{categoria ? 'Editar categoría' : 'Agregar categoría'}</h2>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Herramientas"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              rows={3}
              value={form.descripcion}
              onChange={manejarCambio}
              placeholder="Ej: Herramientas manuales y de medición"
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