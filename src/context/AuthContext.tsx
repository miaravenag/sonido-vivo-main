import { createContext, useContext, useState, type ReactNode } from "react";
import { usuariosIniciales } from "../data/usuarios";
import type { Resultado } from "../types/Resultado";
import type {
  DatosUsuario,
  IntentosFallidos,
  Rol,
  SesionActiva,
  Usuario,
} from "../types/Usuario";
import { guardarAlmacenamiento, leerAlmacenamiento } from "../utils/almacenamiento";
import { rolesQueSePuedenCrear } from "../utils/permisos";

const MAX_INTENTOS = 3;
const CLAVE_USUARIOS = "sonidovivo_usuarios";
const CLAVE_SESION = "sonidovivo_sesion_activa";
const CLAVE_INTENTOS = "sonidovivo_intentos_fallidos";
const CLAVE_DEMO = "sonidovivo_demo_sembrado";

const SIN_PERMISO: Resultado = {
  exito: false,
  mensaje: "No tienes permisos para realizar esta operación.",
};

// Usuarios guardados por versiones anteriores pueden no tener rol
type UsuarioGuardado = Omit<Usuario, "rol"> & { rol?: Rol };

// Al iniciar: los usuarios antiguos pasan a ser clientes, se agregan las cuentas de
// demostración que falten (solo la primera vez) y siempre existe un administrador
const prepararUsuarios = (guardados: UsuarioGuardado[]): Usuario[] => {
  const lista: Usuario[] = guardados.map((u) => ({ ...u, rol: u.rol ?? "cliente" }));
  const yaSembrado = localStorage.getItem(CLAVE_DEMO) !== null;

  const faltantes = usuariosIniciales.filter(
    (inicial) =>
      !lista.some((u) => u.email === inicial.email) &&
      (!yaSembrado || (inicial.rol === "administrador" && !lista.some((u) => u.rol === "administrador"))),
  );

  localStorage.setItem(CLAVE_DEMO, "1");
  const resultado = [...lista, ...faltantes];
  if (faltantes.length > 0) guardarAlmacenamiento(CLAVE_USUARIOS, resultado);
  return resultado;
};

interface AuthContextType {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  registrar: (datos: DatosUsuario) => Resultado;
  iniciarSesion: (email: string, password: string) => Resultado;
  cerrarSesion: () => void;
  crearUsuario: (datos: DatosUsuario) => Resultado;
  actualizarUsuario: (id: string, datos: DatosUsuario) => Resultado;
  actualizarPerfil: (datos: DatosUsuario) => Resultado;
  eliminarUsuario: (id: string) => Resultado;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    prepararUsuarios(leerAlmacenamiento<UsuarioGuardado[]>(CLAVE_USUARIOS, usuariosIniciales)),
  );
  const [sesion, setSesion] = useState<SesionActiva | null>(() =>
    leerAlmacenamiento<SesionActiva | null>(CLAVE_SESION, null),
  );
  const [intentos, setIntentos] = useState<IntentosFallidos>(() =>
    leerAlmacenamiento<IntentosFallidos>(CLAVE_INTENTOS, {}),
  );

  // Cada función actualiza el estado y guarda el mismo valor en localStorage
  const actualizarUsuarios = (nuevos: Usuario[]) => {
    setUsuarios(nuevos);
    guardarAlmacenamiento(CLAVE_USUARIOS, nuevos);
  };
  const actualizarSesion = (nueva: SesionActiva | null) => {
    setSesion(nueva);
    guardarAlmacenamiento(CLAVE_SESION, nueva);
  };
  const actualizarIntentos = (nuevos: IntentosFallidos) => {
    setIntentos(nuevos);
    guardarAlmacenamiento(CLAVE_INTENTOS, nuevos);
  };

  // Valor derivado: el usuario de la sesión se busca en la lista (no se duplica en estado)
  const usuarioActual = sesion ? (usuarios.find((u) => u.id === sesion.id) ?? null) : null;
  const esAdministrador = usuarioActual?.rol === "administrador";

  const buscarUsuarioPorEmail = (email: string) =>
    usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // El correo está repetido si pertenece a OTRO usuario
  const emailEnUso = (email: string, exceptoId?: string) =>
    usuarios.some((u) => u.id !== exceptoId && u.email.toLowerCase() === email.toLowerCase());

  const agregarUsuario = (datos: DatosUsuario): Resultado => {
    if (emailEnUso(datos.email)) {
      return { exito: false, mensaje: "El correo ingresado ya se encuentra registrado." };
    }
    actualizarUsuarios([...usuarios, { ...datos, id: crypto.randomUUID() }]);
    return { exito: true, mensaje: "Usuario creado correctamente." };
  };

  // Registro público: SIEMPRE crea clientes, sin importar lo que venga en los datos
  const registrar = (datos: DatosUsuario): Resultado => {
    const resultado = agregarUsuario({ ...datos, rol: "cliente", bloqueado: false });
    return resultado.exito
      ? { exito: true, mensaje: "¡Registro exitoso! Redirigiendo al inicio de sesión..." }
      : resultado;
  };

  const crearUsuario = (datos: DatosUsuario): Resultado => {
    if (!usuarioActual || !rolesQueSePuedenCrear(usuarioActual.rol).includes(datos.rol)) {
      return {
        exito: false,
        mensaje: `Tu rol no permite crear usuarios con rol ${datos.rol}.`,
      };
    }
    return agregarUsuario({ ...datos, bloqueado: esAdministrador ? datos.bloqueado : false });
  };

  const actualizarUsuario = (id: string, datos: DatosUsuario): Resultado => {
    if (!esAdministrador) return SIN_PERMISO;

    const anterior = usuarios.find((u) => u.id === id);
    if (!anterior) return { exito: false, mensaje: "El usuario no existe." };

    if (emailEnUso(datos.email, id)) {
      return { exito: false, mensaje: "El correo ingresado ya pertenece a otro usuario." };
    }
    if (id === usuarioActual?.id && (datos.rol !== anterior.rol || datos.bloqueado)) {
      return { exito: false, mensaje: "No puedes cambiar tu propio rol ni bloquear tu cuenta." };
    }

    actualizarUsuarios(usuarios.map((u) => (u.id === id ? { ...datos, id } : u)));

    // Si se desbloquea una cuenta, sus intentos fallidos vuelven a cero
    if (anterior.bloqueado && !datos.bloqueado) {
      const copia = { ...intentos };
      delete copia[anterior.email.toLowerCase()];
      actualizarIntentos(copia);
    }
    return { exito: true, mensaje: "Usuario actualizado correctamente." };
  };

  // Edición del propio perfil: el rol, el estado y la contraseña NO se modifican aquí
  const actualizarPerfil = (datos: DatosUsuario): Resultado => {
    if (!usuarioActual) return SIN_PERMISO;

    if (emailEnUso(datos.email, usuarioActual.id)) {
      return { exito: false, mensaje: "El correo ingresado ya pertenece a otro usuario." };
    }

    actualizarUsuarios(
      usuarios.map((u) =>
        u.id === usuarioActual.id
          ? {
              ...u,
              nombre: datos.nombre,
              apellido: datos.apellido,
              fechaNacimiento: datos.fechaNacimiento,
              email: datos.email,
              direccion: datos.direccion,
              region: datos.region,
              genero: datos.genero,
            }
          : u,
      ),
    );
    return { exito: true, mensaje: "Perfil actualizado correctamente." };
  };

  const eliminarUsuario = (id: string): Resultado => {
    if (!esAdministrador) return SIN_PERMISO;
    if (id === usuarioActual?.id) {
      return { exito: false, mensaje: "No puedes eliminar tu propia cuenta." };
    }
    actualizarUsuarios(usuarios.filter((u) => u.id !== id));
    return { exito: true, mensaje: "Usuario eliminado correctamente." };
  };

  const iniciarSesion = (emailIngresado: string, password: string): Resultado => {
    const email = emailIngresado.trim().toLowerCase();
    const usuario = buscarUsuarioPorEmail(email);

    if (!usuario) {
      return { exito: false, mensaje: "El correo electrónico no se encuentra registrado." };
    }

    if (usuario.bloqueado) {
      return {
        exito: false,
        mensaje: `Esta cuenta ha sido BLOQUEADA por superar el máximo de ${MAX_INTENTOS} intentos fallidos.`,
      };
    }

    if (usuario.password === password) {
      const copia = { ...intentos };
      delete copia[email];
      actualizarIntentos(copia);
      actualizarSesion({ id: usuario.id });
      return { exito: true, mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}! Redirigiendo...` };
    }

    // Contraseña incorrecta: contamos el intento y bloqueamos si corresponde
    const intentosActuales = (intentos[email] ?? 0) + 1;
    actualizarIntentos({ ...intentos, [email]: intentosActuales });

    if (intentosActuales >= MAX_INTENTOS) {
      actualizarUsuarios(
        usuarios.map((u) => (u.email.toLowerCase() === email ? { ...u, bloqueado: true } : u)),
      );
      return {
        exito: false,
        mensaje: `Ha alcanzado el límite de ${MAX_INTENTOS} intentos fallidos. Su cuenta ha sido BLOQUEADA.`,
      };
    }

    return {
      exito: false,
      mensaje: `Contraseña incorrecta. Intentos restantes antes del bloqueo: ${MAX_INTENTOS - intentosActuales}`,
    };
  };

  const cerrarSesion = () => actualizarSesion(null);

  return (
    <AuthContext
      value={{
        usuarios,
        usuarioActual,
        registrar,
        iniciarSesion,
        cerrarSesion,
        crearUsuario,
        actualizarUsuario,
        actualizarPerfil,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);

  if (contexto === null) {
    throw new Error("useAuth requiere AuthProvider");
  }

  return contexto;
};
