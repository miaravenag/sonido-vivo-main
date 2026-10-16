import { useState } from "react";
import { Alerta } from "../components/Alerta";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { InsigniaRol } from "../components/InsigniaRol";
import { TituloPagina } from "../components/TituloPagina";
import { useAuth } from "../context/AuthContext";
import type { AlertaInfo } from "../types/Resultado";
import type { Usuario } from "../types/Usuario";
import { alertaDesde } from "../utils/alertas";

export const GestionUsuarios = () => {
  const { usuarios, usuarioActual, crearUsuario, actualizarUsuario, eliminarUsuario } = useAuth();

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  const esAdministrador = usuarioActual?.rol === "administrador";

  const abrirNuevo = () => {
    setEditando(null);
    setAlerta(null);
    setFormularioAbierto(true);
  };

  const abrirEdicion = (usuario: Usuario) => {
    setEditando(usuario);
    setAlerta(null);
    setFormularioAbierto(true);
  };

  const cerrarFormulario = () => {
    setEditando(null);
    setFormularioAbierto(false);
  };

  const manejarEliminar = (usuario: Usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;
    setAlerta(alertaDesde(eliminarUsuario(usuario.id)));
  };

  // Filtros combinados: texto (nombre o correo) y rol
  const texto = busqueda.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (filtroRol === "todos" || u.rol === filtroRol) &&
      (`${u.nombre} ${u.apellido}`.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto)),
  );

  return (
    <main className="container my-5">
      <TituloPagina texto={esAdministrador ? "Gestión de usuarios" : "Crear clientes"}>
        {!formularioAbierto && (
          <button type="button" className="btn btn-warning fw-bold" onClick={abrirNuevo}>
            <i className="bi bi-person-plus me-1"></i>
            {esAdministrador ? "Nuevo usuario" : "Nuevo cliente"}
          </button>
        )}
      </TituloPagina>

      {/* Mensaje de las acciones de la tabla (eliminar) */}
      {!formularioAbierto && <Alerta alerta={alerta} className="mb-3" />}

      {formularioAbierto && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h2 className="h5 fw-bold mb-3">
            {editando ? `Editar a ${editando.nombre} ${editando.apellido}` : "Nuevo usuario"}
          </h2>
          {/* key: al cambiar de usuario a editar, el formulario se reinicia con sus datos */}
          <FormularioUsuario
            key={editando?.id ?? "nuevo"}
            modo={esAdministrador ? "admin" : "vendedor"}
            usuario={editando ?? undefined}
            deshabilitarRol={editando?.id === usuarioActual?.id}
            textoBoton={editando ? "Guardar cambios" : "Crear usuario"}
            onGuardar={(datos) =>
              editando ? actualizarUsuario(editando.id, datos) : crearUsuario(datos)
            }
            onCancelar={cerrarFormulario}
          />
        </div>
      )}

      {/* Solo el administrador consulta, edita y elimina usuarios */}
      {esAdministrador ? (
        <>
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por nombre o correo..."
                aria-label="Buscar usuarios"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                aria-label="Filtrar por rol"
                value={filtroRol}
                onChange={(evento) => setFiltroRol(evento.target.value)}
              >
                <option value="todos">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="vendedor">Vendedor</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
          </div>

          <div className="table-responsive card border-0 shadow-sm">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      {usuario.nombre} {usuario.apellido}
                    </td>
                    <td>{usuario.email}</td>
                    <td>
                      <InsigniaRol rol={usuario.rol} />
                    </td>
                    <td>
                      {usuario.bloqueado ? (
                        <span className="badge bg-dark">Bloqueado</span>
                      ) : (
                        <span className="badge bg-success">Activo</span>
                      )}
                    </td>
                    <td className="text-nowrap">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        aria-label={`Editar a ${usuario.nombre}`}
                        onClick={() => abrirEdicion(usuario)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      {/* No se muestra eliminar sobre la propia cuenta */}
                      {usuario.id !== usuarioActual?.id && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          aria-label={`Eliminar a ${usuario.nombre}`}
                          onClick={() => manejarEliminar(usuario)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No hay usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        !formularioAbierto && (
          <div className="alert alert-info" role="alert">
            Como vendedor puedes registrar nuevos clientes. Presiona <strong>Nuevo cliente</strong>{" "}
            para comenzar.
          </div>
        )
      )}
    </main>
  );
};
