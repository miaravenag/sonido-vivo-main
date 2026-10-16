import { createContext, useContext, useState, type ReactNode } from "react";
import type { ItemCarrito, LineaCarrito } from "../types/Carrito";
import type { Producto } from "../types/Producto";
import type { Resultado, ResultadoCantidad } from "../types/Resultado";
import { guardarAlmacenamiento, leerAlmacenamiento } from "../utils/almacenamiento";
import { precioEfectivo } from "../utils/formato";
import { useProductos } from "./ProductosContext";

const CLAVE = "sonidovivo_carrito";

interface CarritoContextType {
  carrito: ItemCarrito[];
  totalItems: number;
  total: number;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Resultado;
  actualizarCantidad: (id: string, cantidad: number) => ResultadoCantidad;
  eliminarDelCarrito: (id: string) => void;
  vaciarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const { buscarProductoPorId } = useProductos();

  // Solo se guarda qué producto y cuántas unidades; lo demás se toma del producto actual
  const [lineas, setLineas] = useState<LineaCarrito[]>(() =>
    leerAlmacenamiento<LineaCarrito[]>(CLAVE, []),
  );

  const actualizarLineas = (nuevas: LineaCarrito[]) => {
    setLineas(nuevas);
    guardarAlmacenamiento(CLAVE, nuevas);
  };

  // Valor derivado: así el carrito refleja cambios de precio, stock o productos eliminados
  const carrito: ItemCarrito[] = lineas.flatMap((linea) => {
    const producto = buscarProductoPorId(linea.id);
    if (!producto) return [];
    return [
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: precioEfectivo(producto),
        imagen: producto.imagen,
        categoria: producto.categoria,
        cantidad: linea.cantidad,
        stockMaximo: producto.stock,
      },
    ];
  });

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const agregarAlCarrito = (producto: Producto, cantidad = 1): Resultado => {
    const existente = lineas.find((linea) => linea.id === producto.id);

    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidad;

      if (nuevaCantidad > producto.stock) {
        return {
          exito: false,
          mensaje: `No puedes agregar más de ${producto.stock} unidades en total (Stock insuficiente).`,
        };
      }

      actualizarLineas(
        lineas.map((linea) =>
          linea.id === producto.id ? { ...linea, cantidad: nuevaCantidad } : linea,
        ),
      );
    } else {
      if (cantidad > producto.stock) {
        return {
          exito: false,
          mensaje: `No hay suficiente stock. Disponible: ${producto.stock}`,
        };
      }

      actualizarLineas([...lineas, { id: producto.id, cantidad }]);
    }

    return { exito: true, mensaje: "Producto agregado al carrito con éxito." };
  };

  const actualizarCantidad = (id: string, cantidad: number): ResultadoCantidad => {
    const item = carrito.find((i) => i.id === id);
    if (!item) return { exito: false, mensaje: "Producto no encontrado.", cantidad: 0 };

    let nuevaCantidad = Number.isNaN(cantidad) ? 1 : Math.floor(cantidad);
    let resultado: ResultadoCantidad = {
      exito: true,
      mensaje: "Cantidad actualizada.",
      cantidad: nuevaCantidad,
    };

    if (nuevaCantidad > item.stockMaximo) {
      nuevaCantidad = item.stockMaximo;
      resultado = {
        exito: false,
        mensaje: `Solo hay ${item.stockMaximo} unidades disponibles.`,
        cantidad: nuevaCantidad,
      };
    }
    if (nuevaCantidad < 1) {
      nuevaCantidad = 1;
      resultado = { ...resultado, cantidad: 1 };
    }

    actualizarLineas(
      lineas.map((l) => (l.id === id ? { ...l, cantidad: nuevaCantidad } : l)),
    );
    return resultado;
  };

  const eliminarDelCarrito = (id: string) => {
    actualizarLineas(lineas.filter((linea) => linea.id !== id));
  };

  const vaciarCarrito = () => actualizarLineas([]);

  return (
    <CarritoContext
      value={{
        carrito,
        totalItems,
        total,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext>
  );
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);

  if (contexto === null) {
    throw new Error("useCarrito requiere CarritoProvider");
  }

  return contexto;
};
