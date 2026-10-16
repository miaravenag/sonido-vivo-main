export type Rol = "administrador" | "vendedor" | "cliente";
export type Genero = "Masculino" | "Femenino" | "Otro";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  password: string;
  direccion: string;
  region: string;
  genero: Genero;
  rol: Rol;
  bloqueado: boolean;
}

// Datos necesarios para crear o actualizar un usuario (el id lo asigna el sistema)
export type DatosUsuario = Omit<Usuario, "id">;

// La sesión solo guarda el id; los datos del usuario se buscan en la lista de usuarios
export interface SesionActiva {
  id: string;
}

// Estado del formulario de usuario (todo texto hasta que se valida)
export interface FormularioUsuario {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  password: string;
  confirmPassword: string;
  direccion: string;
  region: string;
  genero: Genero | "";
  rol: Rol;
  bloqueado: boolean;
  terminos: boolean;
}

// email -> cantidad de intentos fallidos
export type IntentosFallidos = Record<string, number>;
