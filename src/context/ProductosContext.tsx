import { createContext, useContext, useState, type ReactNode } from "react";
import { productosIniciales } from "../data/productos";
import type { ItemCarrito } from "../types/Carrito";
import type { DatosProducto, Producto } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { guardarAlmacenamiento, leerAlmacenamiento } from "../utils/almacenamiento";
import { useAuth } from "./AuthContext";

const CLAVE = "sonidovivo_productos";

const SIN_PERMISO: Resultado = {
  exito: false,
  mensaje: "No tienes permisos para realizar esta operación.",
};

interface ProductosContextType {
  productos: Producto[];
  buscarProductoPorId: (id: string) => Producto | undefined;
  descontarStock: (items: ItemCarrito[]) => void;
  crearProducto: (datos: DatosProducto) => Resultado;
  actualizarProducto: (id: string, datos: DatosProducto) => Resultado;
  eliminarProducto: (id: string) => Resultado;
  actualizarStock: (id: string, stock: number) => Resultado;
  contarPorCategoria: (categoria: string) => number;
  reasignarCategoria: (anterior: string, nueva: string) => void;
}

const ProductosContext = createContext<ProductosContextType | null>(null);

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const { usuarioActual } = useAuth();
  const rol = usuarioActual?.rol;

  // useState con función inicial: lee localStorage solo la primera vez
  const [productos, setProductos] = useState<Producto[]>(() =>
    leerAlmacenamiento(CLAVE, productosIniciales),
  );

  // Actualiza el estado y guarda el mismo valor en localStorage
  const actualizarProductos = (nuevos: Producto[]) => {
    setProductos(nuevos);
    guardarAlmacenamiento(CLAVE, nuevos);
  };

  const buscarProductoPorId = (id: string) =>
    productos.find((producto) => producto.id === id);

  // Se usa al finalizar una compra (cualquier usuario con sesión)
  const descontarStock = (items: ItemCarrito[]) => {
    actualizarProductos(
      productos.map((producto) => {
        const item = items.find((i) => i.id === producto.id);
        if (!item) return producto;
        return { ...producto, stock: Math.max(0, producto.stock - item.cantidad) };
      }),
    );
  };

  // Solo el administrador crea, modifica y elimina productos
  const crearProducto = (datos: DatosProducto): Resultado => {
    if (rol !== "administrador") return SIN_PERMISO;
    actualizarProductos([...productos, { ...datos, id: crypto.randomUUID() }]);
    return { exito: true, mensaje: "Producto creado correctamente." };
  };

  const actualizarProducto = (id: string, datos: DatosProducto): Resultado => {
    if (rol !== "administrador") return SIN_PERMISO;
    actualizarProductos(productos.map((p) => (p.id === id ? { ...datos, id } : p)));
    return { exito: true, mensaje: "Producto actualizado correctamente." };
  };

  const eliminarProducto = (id: string): Resultado => {
    if (rol !== "administrador") return SIN_PERMISO;
    actualizarProductos(productos.filter((p) => p.id !== id));
    return { exito: true, mensaje: "Producto eliminado correctamente." };
  };

  // El administrador y el vendedor pueden modificar el stock
  const actualizarStock = (id: string, stock: number): Resultado => {
    if (rol !== "administrador" && rol !== "vendedor") return SIN_PERMISO;
    if (!Number.isInteger(stock) || stock < 0) {
      return { exito: false, mensaje: "El stock debe ser un número entero igual o mayor a 0." };
    }
    actualizarProductos(productos.map((p) => (p.id === id ? { ...p, stock } : p)));
    return { exito: true, mensaje: "Stock actualizado correctamente." };
  };

  const contarPorCategoria = (categoria: string) =>
    productos.filter((p) => p.categoria === categoria).length;

  // Cuando se renombra una categoría, sus productos la siguen
  const reasignarCategoria = (anterior: string, nueva: string) => {
    actualizarProductos(
      productos.map((p) => (p.categoria === anterior ? { ...p, categoria: nueva } : p)),
    );
  };

  return (
    <ProductosContext
      value={{
        productos,
        buscarProductoPorId,
        descontarStock,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
        actualizarStock,
        contarPorCategoria,
        reasignarCategoria,
      }}
    >
      {children}
    </ProductosContext>
  );
};

export const useProductos = () => {
  const contexto = useContext(ProductosContext);

  if (contexto === null) {
    throw new Error("useProductos requiere ProductosProvider");
  }

  return contexto;
};
