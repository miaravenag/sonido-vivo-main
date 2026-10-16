import { useState, type FormEvent } from "react";
import { regiones } from "../data/categorias";
import type { AlertaInfo, Resultado } from "../types/Resultado";
import type { DatosUsuario, FormularioUsuario as DatosFormulario, Usuario } from "../types/Usuario";
import { alertaDesde } from "../utils/alertas";
import { ROLES, etiquetaRol } from "../utils/permisos";
import { calcularEdad, validarUsuario } from "../utils/validaciones";
import { Alerta } from "./Alerta";
import { CampoSelect, CampoTexto, type EventoCampo } from "./Campos";

// Un mismo formulario para 4 situaciones; el modo decide qué campos y reglas aplican
export type ModoFormularioUsuario = "registro" | "admin" | "vendedor" | "perfil";

interface FormularioUsuarioProps {
  modo: ModoFormularioUsuario;
  textoBoton: string;
  onGuardar: (datos: DatosUsuario) => Resultado;
  usuario?: Usuario; // si viene, el formulario edita ese usuario; si no, crea uno nuevo
  deshabilitarRol?: boolean; // el administrador no puede cambiar su propio rol
  onExito?: () => void;
  onCancelar?: () => void;
}

const formularioDesde = (usuario?: Usuario): DatosFormulario => ({
  nombre: usuario?.nombre ?? "",
  apellido: usuario?.apellido ?? "",
  fechaNacimiento: usuario?.fechaNacimiento ?? "",
  email: usuario?.email ?? "",
  password: "",
  confirmPassword: "",
  direccion: usuario?.direccion ?? "",
  region: usuario?.region ?? "",
  genero: usuario?.genero ?? "",
  rol: usuario?.rol ?? "cliente",
  bloqueado: usuario?.bloqueado ?? false,
  terminos: false,
});

export const FormularioUsuario = ({
  modo,
  textoBoton,
  onGuardar,
  usuario,
  deshabilitarRol = false,
  onExito,
  onCancelar,
}: FormularioUsuarioProps) => {
  const [formulario, setFormulario] = useState<DatosFormulario>(() => formularioDesde(usuario));
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const editando = usuario !== undefined;
  const mostrarPassword = modo !== "perfil";
  // Contraseña obligatoria solo al crear cuentas; al editar, vacía = no cambiarla
  const exigirPassword = mostrarPassword && !editando;

  // Un solo manejador para todos los campos: usa el atributo "name" de cada input
  const manejarCambio = (evento: EventoCampo) => {
    const { name, value } = evento.target;
    const nuevoValor =
      evento.target instanceof HTMLInputElement && evento.target.type === "checkbox"
        ? evento.target.checked
        : value;

    setFormulario((actual) => ({ ...actual, [name]: nuevoValor }));
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setAlerta(null);

    const error = validarUsuario(formulario, {
      exigirPassword,
      exigirTerminos: modo === "registro",
    });
    if (error !== null || formulario.genero === "") {
      setAlerta({ tipo: "danger", mensaje: error ?? "Todos los campos son obligatorios." });
      return;
    }

    const resultado = onGuardar({
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      fechaNacimiento: formulario.fechaNacimiento,
      email: formulario.email.trim().toLowerCase(),
      password: formulario.password || usuario?.password || "",
      direccion: formulario.direccion.trim(),
      region: formulario.region,
      genero: formulario.genero,
      // Registro público y vendedor solo pueden crear clientes
      rol: modo === "registro" || modo === "vendedor" ? "cliente" : formulario.rol,
      bloqueado: formulario.bloqueado,
    });
    setAlerta(alertaDesde(resultado));

    if (resultado.exito) {
      // Al crear se limpia el formulario; al editar solo se vacían las contraseñas
      setFormulario(
        editando
          ? { ...formulario, password: "", confirmPassword: "" }
          : formularioDesde(),
      );
      onExito?.();
    }
  };

  const edad = formulario.fechaNacimiento ? calcularEdad(formulario.fechaNacimiento) : null;

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <Alerta alerta={alerta} className="mb-3" />

      <div className="row g-3">
        <CampoTexto id="nombre" etiqueta="Nombre" columnas="col-md-6" valor={formulario.nombre} onCambio={manejarCambio} placeholder="Juan" />
        <CampoTexto id="apellido" etiqueta="Apellido" columnas="col-md-6" valor={formulario.apellido} onCambio={manejarCambio} placeholder="Pérez" />

        <CampoTexto
          id="fechaNacimiento"
          etiqueta="Fecha de Nacimiento"
          tipo="date"
          columnas="col-md-6"
          valor={formulario.fechaNacimiento}
          onCambio={manejarCambio}
          ayuda={edad !== null && !Number.isNaN(edad) && edad >= 0 ? `Edad: ${edad} años` : undefined}
        />
        <CampoTexto id="email" etiqueta="Correo" tipo="email" columnas="col-md-6" valor={formulario.email} onCambio={manejarCambio} placeholder="usuario@duocuc.cl" />

        {mostrarPassword && (
          <>
            <CampoTexto
              id="password"
              etiqueta={editando ? "Nueva contraseña (opcional)" : "Contraseña"}
              tipo="password"
              columnas="col-md-6"
              valor={formulario.password}
              onCambio={manejarCambio}
              placeholder="Mínimo 6 caracteres y una mayúscula"
            />
            <CampoTexto id="confirmPassword" etiqueta="Confirmar Contraseña" tipo="password" columnas="col-md-6" valor={formulario.confirmPassword} onCambio={manejarCambio} placeholder="Repite contraseña" />
          </>
        )}

        <CampoTexto id="direccion" etiqueta="Dirección" valor={formulario.direccion} onCambio={manejarCambio} placeholder="Av. Siempre Viva 123" />

        <CampoSelect
          id="region"
          etiqueta="Región"
          columnas="col-md-6"
          valor={formulario.region}
          onCambio={manejarCambio}
          textoVacio="Selecciona..."
          opciones={regiones.map((region) => ({ valor: region, texto: region }))}
        />
        <CampoSelect
          id="genero"
          etiqueta="Género"
          columnas="col-md-6"
          valor={formulario.genero}
          onCambio={manejarCambio}
          textoVacio="Selecciona..."
          opciones={[
            { valor: "Masculino", texto: "Masculino" },
            { valor: "Femenino", texto: "Femenino" },
            { valor: "Otro", texto: "Otro / Prefiero no decir" },
          ]}
        />

        {/* Solo el administrador elige el rol */}
        {modo === "admin" && (
          <CampoSelect
            id="rol"
            etiqueta="Rol"
            columnas="col-md-6"
            valor={formulario.rol}
            onCambio={manejarCambio}
            deshabilitado={deshabilitarRol}
            opciones={ROLES.map((rol) => ({ valor: rol, texto: etiquetaRol[rol] }))}
          />
        )}

        {modo === "admin" && editando && (
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="bloqueado"
                name="bloqueado"
                checked={formulario.bloqueado}
                onChange={manejarCambio}
                disabled={deshabilitarRol}
              />
              <label className="form-check-label" htmlFor="bloqueado">
                Cuenta bloqueada
              </label>
            </div>
          </div>
        )}

        {modo === "vendedor" && (
          <div className="col-12">
            <p className="small text-secondary mb-0">
              <i className="bi bi-info-circle me-1"></i>Los usuarios creados por un vendedor
              tienen siempre rol Cliente.
            </p>
          </div>
        )}

        {modo === "registro" && (
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={formulario.terminos}
                onChange={manejarCambio}
              />
              <label className="form-check-label small text-secondary" htmlFor="terminos">
                Acepto los términos y condiciones del servicio.
              </label>
            </div>
          </div>
        )}

        <div className="col-12 d-flex flex-column flex-sm-row gap-2">
          <button type="submit" className="btn btn-warning fw-bold py-2 flex-grow-1">
            {textoBoton}
          </button>
          {onCancelar && (
            <button type="button" className="btn btn-outline-secondary py-2" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
