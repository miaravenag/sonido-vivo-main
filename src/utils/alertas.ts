import type { AlertaInfo, Resultado } from "../types/Resultado";

// Convierte el resultado de una operación en el mensaje que se muestra en pantalla
export const alertaDesde = (resultado: Resultado): AlertaInfo => ({
  tipo: resultado.exito ? "success" : "danger",
  mensaje: resultado.mensaje,
});
