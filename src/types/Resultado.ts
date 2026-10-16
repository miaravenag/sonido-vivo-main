// Resultado de una operación (agregar al carrito, login, registro...)
export interface Resultado {
  exito: boolean;
  mensaje: string;
}

export interface ResultadoCantidad extends Resultado {
  cantidad: number; // cantidad final aplicada
}

// Mensaje que se muestra en pantalla con el componente <Alerta />
export interface AlertaInfo {
  tipo: "success" | "danger" | "info";
  mensaje: string;
}
