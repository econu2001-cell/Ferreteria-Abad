import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import LayoutAdmin from './components/LayoutAdmin';
import PanelAdmin from './pages/PanelAdmin';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import PanelVendedor from './pages/PanelVendedor';

import Reportes from './pages/Reportes';

import LayoutVendedor from './components/LayoutVendedor';

import ConsultarStock from './pages/ConsultarStock';
// ...
import BuscarProductos from './pages/BuscarProductos';
// ...
import ComprobantePDF from './pages/ComprobantePDF';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={
            <RutaProtegida rolesPermitidos={['Administrador']}><LayoutAdmin /></RutaProtegida>
          }>
            <Route index element={<PanelAdmin />} />
            <Route path="productos" element={<Productos />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="ventas/:id/comprobante" element={<ComprobantePDF />} />
          </Route>

          <Route path="/vendedor" element={
            <RutaProtegida rolesPermitidos={['Vendedor']}><LayoutVendedor /></RutaProtegida>
          }>
            <Route index element={<PanelVendedor />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="stock" element={<ConsultarStock />} />
            <Route path="productos" element={<BuscarProductos />} />
            <Route path="ventas/:id/comprobante" element={<ComprobantePDF />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}