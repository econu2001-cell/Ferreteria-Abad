import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ children, rolesPermitidos }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/" replace />;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
}