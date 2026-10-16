import { FormularioUsuario } from "../components/FormularioUsuario";
import { InsigniaRol } from "../components/InsigniaRol";
import { TituloPagina } from "../components/TituloPagina";
import { useAuth } from "../context/AuthContext";
import { calcularEdad } from "../utils/validaciones";

export const Perfil = () => {
  const { usuarioActual, actualizarPerfil } = useAuth();

  // RutaProtegida ya garantiza la sesión; esto solo satisface a TypeScript
  if (!usuarioActual) return null;

  return (
    <main className="container my-5">
      <TituloPagina texto="Mi perfil" />

      <div className="row g-4">
        <aside className="col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm text-center p-4">
            {/* Avatar genérico */}
            <i className="bi bi-person-circle display-1 text-secondary"></i>
            <h2 className="h5 fw-bold mt-2 mb-1">
              {usuarioActual.nombre} {usuarioActual.apellido}
            </h2>
            <div className="mb-2">
              <InsigniaRol rol={usuarioActual.rol} />
            </div>
            <p className="small text-muted mb-1">{usuarioActual.email}</p>
            <p className="small text-muted mb-0">
              {calcularEdad(usuarioActual.fechaNacimiento)} años · {usuarioActual.region}
            </p>
          </div>
        </aside>

        <section className="col-md-8 col-lg-9">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 fw-bold mb-3">Editar datos personales</h2>
            <p className="small text-secondary">
              Tu rol ({usuarioActual.rol}) no se puede modificar desde el perfil.
            </p>
            {/* key: si cambia el usuario de la sesión, el formulario se reinicia */}
            <FormularioUsuario
              key={usuarioActual.id}
              modo="perfil"
              usuario={usuarioActual}
              textoBoton="Guardar cambios"
              onGuardar={actualizarPerfil}
            />
          </div>
        </section>
      </div>
    </main>
  );
};
