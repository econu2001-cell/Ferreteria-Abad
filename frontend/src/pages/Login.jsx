import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { iniciarSesion, obtenerRoles } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

function IconoLlave() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { guardarSesion } = useAuth();

  const [roles, setRoles] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idRol, setIdRol] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerRoles()
      .then((datos) => { setRoles(datos); if (datos.length > 0) setIdRol(String(datos[0].id_rol)); })
      .catch(() => setRoles([]));
  }, []);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    if (!usuario || !contrasena || !idRol) {
      Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Ingrese usuario, contraseña y seleccione un rol.' });
      return;
    }
    setCargando(true);
    try {
      const datos = await iniciarSesion({ usuario, contrasena, id_rol: idRol });
      guardarSesion(datos);
      await Swal.fire({ icon: 'success', title: `Bienvenido, ${datos.usuario.nombre}`, timer: 1200, showConfirmButton: false });
      navigate(datos.usuario.rol === 'Administrador' ? '/admin' : '/vendedor');
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'No se pudo iniciar sesión. Intente nuevamente.';
      Swal.fire({ icon: 'error', title: 'Error al iniciar sesión', text: mensaje });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="pantalla-login">
      <div className="login-icono"><IconoLlave /></div>
      <h1 className="login-titulo h3">Ferretería Abad</h1>
      <p className="login-subtitulo">Sistema Informático Integrado de<br />Ventas y Control de Stock</p>

      <div className="login-tarjeta">
        <h2 className="h5 text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input id="usuario" type="text" className="form-control" placeholder="Ingrese su usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" />
          </div>
          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input id="contrasena" type="password" className="form-control" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="mb-4">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select id="rol" className="form-select" value={idRol} onChange={(e) => setIdRol(e.target.value)}>
              {roles.length === 0 && <option value="">Cargando roles...</option>}
              {roles.map((rol) => <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-naranja w-100" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}