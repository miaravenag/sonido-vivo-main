// Las categorías las administra el administrador, por eso son texto libre
export type Categoria = string;

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  precioOferta: number | null;
  stock: number;
  imagen: string;
  descripcion: string;
}

// Datos para crear o actualizar un producto (el id lo asigna el sistema)
export type DatosProducto = Omit<Producto, "id">;

// Estado del formulario de producto (todo texto hasta que se valida)
export interface FormularioProducto {
  nombre: string;
  categoria: string;
  precio: string;
  precioOferta: string;
  stock: string;
  imagen: string;
  descripcion: string;
}
