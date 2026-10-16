import type { Producto } from "../types/Producto";

export const formatearPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio);

// Precio que realmente paga el cliente: la oferta si existe, si no el normal
export const precioEfectivo = (producto: Pick<Producto, "precio" | "precioOferta">): number =>
  producto.precioOferta ?? producto.precio;
