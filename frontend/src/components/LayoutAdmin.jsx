import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function LayoutAdmin() {
  return (
    <div className="layout-admin">
      <Sidebar />
      <div className="layout-admin-contenido"><Outlet /></div>
    </div>
  );
}