import { useEffect, useState } from 'react';

const FORMULARIO_VACIO = {
  codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stock_minimo: '', id_categoria: '',
};

export default function ModalProducto({ producto, categorias, onGuardar, onCerrar }) {
  const [form, setForm] = useState(FORMULARIO_VACIO);

  useEffect(() => {
    if (producto) {
      setForm({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        stock_minimo: producto.stock_minimo,
        id_categoria: producto.id_categoria,
      });
    } else {
      setForm(FORMULARIO_VACIO);
    }
  }, [producto]);

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
      <div className="modal-caja">
        <h2 className="h5 mb-3">{producto ? 'Editar producto' : 'Nuevo producto'}</h2>

        <form onSubmit={manejarEnvio}>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">Código</label>
              <input name="codigo" className="form-control" value={form.codigo} onChange={manejarCambio} required />
            </div>
            <div className="col-6">
              <label className="form-label">Categoría</label>
              <select name="id_categoria" className="form-select" value={form.id_categoria} onChange={manejarCambio} required>
                <option value="">Seleccione...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Nombre</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={manejarCambio} required />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <input name="descripcion" className="form-control" value={form.descripcion} onChange={manejarCambio} />
            </div>
            <div className="col-4">
              <label className="form-label">Precio (S/)</label>
              <input type="number" step="0.01" name="precio" className="form-control" value={form.precio} onChange={manejarCambio} required />
            </div>
            <div className="col-4">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" className="form-control" value={form.stock} onChange={manejarCambio} required />
            </div>
            <div className="col-4">
              <label className="form-label">Stock mínimo</label>
              <input type="number" name="stock_minimo" className="form-control" value={form.stock_minimo} onChange={manejarCambio} required />
            </div>
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