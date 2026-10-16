import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Rol } from "../types/Usuario";

interface RutaProtegidaProps {
  roles: Rol[]; // roles que pueden entrar a las rutas hijas
}

// Sin sesión -> login. Con sesión pero sin el rol -> aviso de acceso denegado.
export const RutaProtegida = ({ roles }: RutaProtegidaProps) => {
  const { usuarioActual } = useAuth();
  const location = useLocation();

  if (!usuarioActual) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(usuarioActual.rol)) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger text-center p-5" role="alert">
          <i className="bi bi-shield-lock fs-1 d-block mb-3"></i>
          <h4>Acceso denegado</h4>
          <p className="mb-0">Tu rol no tiene permisos para ver esta sección.</p>
        </div>
      </main>
    );
  }

  return <Outlet />;
};
