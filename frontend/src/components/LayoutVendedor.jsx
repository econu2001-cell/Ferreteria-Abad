import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function LayoutVendedor() {
  return (
    <div className="layout-admin">
      <Sidebar />
      <div className="layout-admin-contenido"><Outlet /></div>
    </div>
  );
}