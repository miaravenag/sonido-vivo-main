import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { useAuth } from "../context/AuthContext";

export const Registro = () => {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  // Tras registrarse se espera un momento (para leer el mensaje) y se va al login
  const irAlLogin = () => {
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold">Crear una Cuenta</h1>
              <p className="text-muted">Ingresa a la comunidad de Sonido Vivo</p>
            </div>

            {/* El registro público siempre crea cuentas de cliente */}
            <FormularioUsuario
              modo="registro"
              textoBoton="Registrarme"
              onGuardar={registrar}
              onExito={irAlLogin}
            />

            <div className="text-center mt-4">
              <p className="small mb-0">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="fw-bold">
                  Inicia Sesión
                </Link>
              </p>
              <p className="small mt-2 mb-0">
                <Link to="/" className="text-decoration-none">
                  <i className="bi bi-arrow-left"></i> Volver a la tienda
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
