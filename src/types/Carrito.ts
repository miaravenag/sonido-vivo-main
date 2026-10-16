import type { Categoria } from "./Producto";

// Lo único que se guarda del carrito: qué producto y cuántas unidades
export interface LineaCarrito {
  id: string;
  cantidad: number;
}

// Línea del carrito con los datos ACTUALES del producto (precio, stock, nombre...)
export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number; // precio efectivo (oferta si existe)
  imagen: string;
  categoria: Categoria;
  cantidad: number;
  stockMaximo: number;
}
