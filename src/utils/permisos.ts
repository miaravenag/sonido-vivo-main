import type { Rol } from "../types/Usuario";

export const ROLES: Rol[] = ["administrador", "vendedor", "cliente"];

export const etiquetaRol: Record<Rol, string> = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};

// Roles que un usuario puede asignar al crear cuentas:
// el administrador cualquiera, el vendedor solo clientes, el cliente ninguno.
export const rolesQueSePuedenCrear = (rol: Rol | undefined): Rol[] => {
  if (rol === "administrador") return ROLES;
  if (rol === "vendedor") return ["cliente"];
  return [];
};
