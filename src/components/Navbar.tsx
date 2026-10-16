import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { enlacesPorRol } from "../data/navegacion";
import type { Rol } from "../types/Usuario";
import { InsigniaRol } from "./InsigniaRol";

// Aplica colores dinámicos según si es menú de administrador o vendedor
const obtenerClaseLink = (isActive: boolean, rol?: Rol, esExclusivaAdmin?: boolean) => {
  let clases = `nav-link${isActive ? " active" : ""}`;

  if (rol === "administrador") {
    // Amarillo/Dorado para la opción exclusiva (Categorías) y Azul/Cian para el resto de gestión admin
    clases += esExclusivaAdmin ? " text-warning fw-semibold" : " text-info fw-semibold";
  } else if (rol === "vendedor") {
    // Verde destacado para las opciones del vendedor (Stock, Crear clientes)
    clases += " text-success fw-semibold";
  }

  return clases;
};

export const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioAbierto, setUsuarioAbierto] = useState(false);
  const { usuarioActual, cerrarSesion } = useAuth();
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  const cerrarMenu = () => setMenuAbierto(false);

  const irASeccion = (id: string) => {
    cerrarMenu();
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    setUsuarioAbierto(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/" onClick={cerrarMenu}>
          <i className="bi bi-music-note-beamed me-2"></i>Sonido Vivo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Mostrar menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse${menuAbierto ? " show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                to="/"
                end
                onClick={cerrarMenu}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                to="/catalogo"
                onClick={cerrarMenu}
              >
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link" onClick={() => irASeccion("quienes-somos")}>
                Quiénes Somos
              </button>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link" onClick={() => irASeccion("contacto")}>
                Contacto
              </button>
            </li>

            {/* Opciones de gestión según el rol */}
            {usuarioActual &&
              enlacesPorRol[usuarioActual.rol].map((enlace) => {
                const esExclusivaAdmin = enlace.ruta === "/gestion/categorias";

                return (
                  <li className="nav-item" key={enlace.ruta}>
                    <NavLink
                      className={({ isActive }) =>
                        obtenerClaseLink(isActive, usuarioActual.rol, esExclusivaAdmin)
                      }
                      to={enlace.ruta}
                      onClick={cerrarMenu}
                    >
                      <i className={`bi ${enlace.icono} me-1`}></i>
                      {enlace.texto}
                    </NavLink>
                  </li>
                );
              })}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {usuarioActual ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle"
                  type="button"
                  aria-expanded={usuarioAbierto}
                  onClick={() => setUsuarioAbierto((abierto) => !abierto)}
                >
                  <i className="bi bi-person-circle me-1"></i> Hola, {usuarioActual.nombre}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end shadow${usuarioAbierto ? " show" : ""}`}
                  data-bs-popper="static"
                >
                  <li>
                    <span className="dropdown-item-text text-muted small">
                      {usuarioActual.email}
                      <br />
                      <InsigniaRol rol={usuarioActual.rol} />
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/perfil"
                      onClick={() => {
                        setUsuarioAbierto(false);
                        cerrarMenu();
                      }}
                    >
                      <i className="bi bi-person-gear me-2"></i>Mi perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger fw-semibold"
                      onClick={manejarCerrarSesion}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  <i className="bi bi-person"></i> Ingresar
                </Link>
                <Link to="/registro" className="btn btn-warning btn-sm fw-bold">
                  Registrarse
                </Link>
              </div>
            )}

            <Link to="/carrito" className="btn btn-primary btn-sm position-relative">
              <i className="bi bi-cart3"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};