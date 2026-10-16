import type { DatosProducto, FormularioProducto } from "../types/Producto";
import type { FormularioUsuario } from "../types/Usuario";

export const calcularEdad = (fechaNacimiento: string, hoy = new Date()): number => {
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

interface OpcionesUsuario {
  exigirPassword: boolean; // al crear: obligatoria. Al editar: solo si se escribe una nueva
  exigirTerminos: boolean; // solo en el registro público
}

// Devuelve el primer error encontrado, o null si el formulario es válido.
// (El chequeo de correo duplicado vive en AuthContext porque necesita los usuarios.)
export const validarUsuario = (f: FormularioUsuario, opciones: OpcionesUsuario): string | null => {
  if (
    !f.nombre.trim() ||
    !f.apellido.trim() ||
    !f.fechaNacimiento ||
    !f.email.trim() ||
    !f.direccion.trim() ||
    !f.region ||
    !f.genero ||
    (opciones.exigirPassword && !f.password)
  ) {
    return "Todos los campos son obligatorios.";
  }

  if (!f.email.trim().toLowerCase().endsWith("@duocuc.cl")) {
    return "Solo se permiten correos institucionales duocuc.cl (Ejemplo: usuario@duocuc.cl).";
  }

  const edad = calcularEdad(f.fechaNacimiento);
  if (Number.isNaN(edad) || edad > 120 || new Date(f.fechaNacimiento) > new Date()) {
    return "La fecha de nacimiento no es válida.";
  }

  if (edad < 14) {
    return "Debe tener al menos 14 años de edad.";
  }

  if (opciones.exigirPassword || f.password) {
    if (f.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!/[A-Z]/.test(f.password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }

    if (f.password !== f.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
  }

  if (opciones.exigirTerminos && !f.terminos) {
    return "Debes aceptar los términos y condiciones.";
  }

  return null;
};

// Devuelve el error, o los datos ya convertidos a número si el formulario es válido
export const validarProducto = (
  f: FormularioProducto,
  categorias: string[],
): { error: string } | { datos: DatosProducto } => {
  if (!f.nombre.trim() || !f.categoria || !f.precio || f.stock === "" || !f.imagen.trim() || !f.descripcion.trim()) {
    return { error: "Nombre, categoría, precio, stock, imagen y descripción son obligatorios." };
  }

  if (!categorias.includes(f.categoria)) {
    return { error: "Selecciona una categoría existente." };
  }

  const precio = Number(f.precio);
  if (!Number.isInteger(precio) || precio <= 0 || precio > 1000000) {
    return { error: "El precio debe ser un entero entre $1 y $1.000.000 (límite del catálogo)." };
  }

  let precioOferta: number | null = null;
  if (f.precioOferta !== "") {
    precioOferta = Number(f.precioOferta);
    if (!Number.isInteger(precioOferta) || precioOferta <= 0 || precioOferta >= precio) {
      return { error: "El precio de oferta debe ser un entero mayor a 0 y menor al precio normal." };
    }
  }

  const stock = Number(f.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "El stock debe ser un número entero igual o mayor a 0." };
  }

  return {
    datos: {
      nombre: f.nombre.trim(),
      categoria: f.categoria,
      precio,
      precioOferta,
      stock,
      imagen: f.imagen.trim(),
      descripcion: f.descripcion.trim(),
    },
  };
};

// Nombre de categoría: obligatorio y sin repetirse (sin distinguir mayúsculas)
export const validarNombreCategoria = (
  nombre: string,
  existentes: string[],
  anterior?: string,
): string | null => {
  const limpio = nombre.trim();
  if (!limpio) return "El nombre de la categoría es obligatorio.";
  if (limpio.length < 3) return "El nombre debe tener al menos 3 caracteres.";

  const repetida = existentes.some(
    (c) => c !== anterior && c.toLowerCase() === limpio.toLowerCase(),
  );
  return repetida ? "Ya existe una categoría con ese nombre." : null;
};
