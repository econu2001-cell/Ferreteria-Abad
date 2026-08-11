import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Package, Tag, Users, ShoppingCart, BarChart3, LogOut, Wrench, Boxes, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cerrarSesion } from '../services/auth.service';

const menuAdmin = [
  { etiqueta: 'Inicio', ruta: '/admin', icono: LayoutGrid, fin: true },
  { etiqueta: 'Productos', ruta: '/admin/productos', icono: Package },
  { etiqueta: 'Categorías', ruta: '/admin/categorias', icono: Tag },
  { etiqueta: 'Clientes', ruta: '/admin/clientes', icono: Users },
  { etiqueta: 'Ventas', ruta: '/admin/ventas', icono: ShoppingCart },
  { etiqueta: 'Reportes', ruta: '/admin/reportes', icono: BarChart3 },
];

const menuVendedor = [
  { etiqueta: 'Inicio', ruta: '/vendedor', icono: LayoutGrid, fin: true },
  { etiqueta: 'Clientes', ruta: '/vendedor/clientes', icono: Users },
  { etiqueta: 'Ventas', ruta: '/vendedor/ventas', icono: ShoppingCart },
  { etiqueta: 'Consultar Stock', ruta: '/vendedor/stock', icono: Boxes },
  { etiqueta: 'Buscar Productos', ruta: '/vendedor/productos', icono: Search },
];

export default function Sidebar() {
  const { usuario, limpiarSesion } = useAuth();
  const menu = usuario?.rol === 'Administrador' ? menuAdmin : menuVendedor;

  function manejarCerrarSesion() {
    cerrarSesion();
    limpiarSesion();
  }

  return (
    <aside className="sidebar d-flex flex-column">
      <div className="sidebar-marca d-flex align-items-center gap-2">
        <div className="sidebar-marca-icono"><Wrench size={20} color="#fff" /></div>
        <div>
          <div className="sidebar-marca-texto">Ferretería</div>
          <div className="sidebar-marca-texto sidebar-marca-acento">Abad</div>
        </div>
      </div>

      <div className="sidebar-rol">{usuario?.rol?.toUpperCase()}</div>

      <nav className="flex-grow-1">
        {menu.map(({ etiqueta, ruta, icono: Icono, fin }) => (
          <NavLink key={ruta} to={ruta} end={fin} className={({ isActive }) => 'sidebar-item' + (isActive ? ' sidebar-item-activo' : '')}>
            <Icono size={18} /><span>{etiqueta}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-item sidebar-cerrar" onClick={manejarCerrarSesion}>
        <LogOut size={18} /><span>Cerrar sesión</span>
      </button>
    </aside>
  );
}