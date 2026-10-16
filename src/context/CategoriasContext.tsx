import { createContext, useContext, useState, type ReactNode } from "react";
import { categoriasIniciales } from "../data/categorias";
import type { Categoria } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { guardarAlmacenamiento, leerAlmacenamiento } from "../utils/almacenamiento";
import { validarNombreCategoria } from "../utils/validaciones";
import { useAuth } from "./AuthContext";
import { useProductos } from "./ProductosContext";

const CLAVE = "sonidovivo_categorias";

const SIN_PERMISO: Resultado = {
  exito: false,
  mensaje: "Solo el administrador puede administrar categorías.",
};

interface CategoriasContextType {
  categorias: Categoria[];
  crearCategoria: (nombre: string) => Resultado;
  renombrarCategoria: (anterior: string, nuevo: string) => Resultado;
  eliminarCategoria: (nombre: string) => Resultado;
}

const CategoriasContext = createContext<CategoriasContextType | null>(null);

export const CategoriasProvider = ({ children }: { children: ReactNode }) => {
  const { usuarioActual } = useAuth();
  const { contarPorCategoria, reasignarCategoria } = useProductos();
  const esAdministrador = usuarioActual?.rol === "administrador";

  const [categorias, setCategorias] = useState<Categoria[]>(() =>
    leerAlmacenamiento(CLAVE, categoriasIniciales),
  );

  const actualizarCategorias = (nuevas: Categoria[]) => {
    setCategorias(nuevas);
    guardarAlmacenamiento(CLAVE, nuevas);
  };

  const crearCategoria = (nombre: string): Resultado => {
    if (!esAdministrador) return SIN_PERMISO;
    const error = validarNombreCategoria(nombre, categorias);
    if (error) return { exito: false, mensaje: error };

    actualizarCategorias([...categorias, nombre.trim()]);
    return { exito: true, mensaje: "Categoría creada correctamente." };
  };

  const renombrarCategoria = (anterior: string, nuevo: string): Resultado => {
    if (!esAdministrador) return SIN_PERMISO;
    const error = validarNombreCategoria(nuevo, categorias, anterior);
    if (error) return { exito: false, mensaje: error };

    const nombre = nuevo.trim();
    actualizarCategorias(categorias.map((c) => (c === anterior ? nombre : c)));
    reasignarCategoria(anterior, nombre);
    return { exito: true, mensaje: "Categoría actualizada correctamente." };
  };

  const eliminarCategoria = (nombre: string): Resultado => {
    if (!esAdministrador) return SIN_PERMISO;

    const cantidad = contarPorCategoria(nombre);
    if (cantidad > 0) {
      return {
        exito: false,
        mensaje: `No se puede eliminar "${nombre}": tiene ${cantidad} producto(s) asociados.`,
      };
    }

    actualizarCategorias(categorias.filter((c) => c !== nombre));
    return { exito: true, mensaje: "Categoría eliminada correctamente." };
  };

  return (
    <CategoriasContext
      value={{ categorias, crearCategoria, renombrarCategoria, eliminarCategoria }}
    >
      {children}
    </CategoriasContext>
  );
};

export const useCategorias = () => {
  const contexto = useContext(CategoriasContext);

  if (contexto === null) {
    throw new Error("useCategorias requiere CategoriasProvider");
  }

  return contexto;
};
