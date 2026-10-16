import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, type NavigateOptions } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import { useAuth } from "../context/AuthContext";
import type { AlertaInfo } from "../types/Resultado";

export const Login = () => {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  // Espera unos milisegundos (para que se lea el mensaje) y luego cambia de página
  const navegarConRetraso = (ruta: string, milisegundos: number, opciones?: NavigateOptions) => {
    setTimeout(() => navigate(ruta, opciones), milisegundos);
  };
  const location = useLocation();

  // Si venimos del carrito, "from" vale "/carrito" y volvemos ahí al ingresar
  const destino = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setAlerta(null);

    const resultado = iniciarSesion(email, password);
    setAlerta({
      tipo: resultado.exito ? "success" : "danger",
      mensaje: resultado.mensaje,
    });

    if (resultado.exito) {
      navegarConRetraso(destino, 1500);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold">Iniciar Sesión</h1>
              <p className="text-muted">Accede a tu cuenta de Sonido Vivo</p>
            </div>

            <Alerta alerta={alerta} className="mb-4" />

            <form onSubmit={manejarEnvio}>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label fw-semibold">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  required
                  placeholder="usuario@duocuc.cl"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="loginPassword" className="form-label fw-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-bold py-2">
                Ingresar
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="small mb-0">
                ¿Aún no tienes cuenta?{" "}
                <Link to="/registro" className="fw-bold">
                  Regístrate aquí
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
