import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ titulo }) {
  const { usuario } = useAuth();
  const fechaHoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const inicial = usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="topbar d-flex align-items-center justify-content-between">
      <div>
        <h1 className="topbar-titulo h5 mb-0">{titulo}</h1>
        <span className="topbar-fecha">{fechaHoy}</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="topbar-campana"><Bell size={20} /><span className="topbar-punto-rojo" /></div>
        <div className="d-flex align-items-center gap-2">
          <div className="topbar-avatar">{inicial}</div>
          <div>
            <div className="topbar-nombre">{usuario?.nombre}</div>
            <div className="topbar-subrol">{usuario?.rol}</div>
          </div>
        </div>
      </div>
    </header>
  );
}