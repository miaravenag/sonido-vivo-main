import type { EnlaceNavegacion } from "../types/Navegacion";
import type { Rol } from "../types/Usuario";

// Opciones extra del menú según el rol del usuario
export const enlacesPorRol: Record<Rol, EnlaceNavegacion[]> = {
  administrador: [
    { ruta: "/gestion/usuarios", texto: "Usuarios", icono: "bi-people" },
    { ruta: "/gestion/productos", texto: "Productos", icono: "bi-box-seam" },
    { ruta: "/gestion/categorias", texto: "Categorías", icono: "bi-tags" },
  ],
  vendedor: [
    { ruta: "/gestion/productos", texto: "Stock", icono: "bi-box-seam" },
    { ruta: "/gestion/usuarios", texto: "Crear clientes", icono: "bi-person-plus" },
  ],
  cliente: [],
};
