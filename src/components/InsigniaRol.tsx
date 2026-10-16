import type { Rol } from "../types/Usuario";
import { etiquetaRol } from "../utils/permisos";

const colorPorRol: Record<Rol, string> = {
  administrador: "bg-danger",
  vendedor: "bg-info text-dark",
  cliente: "bg-secondary",
};

export const InsigniaRol = ({ rol }: { rol: Rol }) => {
  return <span className={`badge ${colorPorRol[rol]}`}>{etiquetaRol[rol]}</span>;
};
