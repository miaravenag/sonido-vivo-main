import type { Usuario } from "../types/Usuario";

// Cuentas de demostración (se crean la primera vez que se abre la tienda)
export const usuariosIniciales: Usuario[] = [
  {
    id: "usr-admin",
    nombre: "ProfeChristian",
    apellido: "Administrador",
    fechaNacimiento: "1990-05-10",
    email: "admin@duocuc.cl",
    password: "Admin123",
    direccion: "Av. Concha y Toro 1234",
    region: "Metropolitana",
    genero: "Masculino",
    rol: "administrador",
    bloqueado: false,
  },
  {
    id: "usr-vendedor",
    nombre: "Víctor",
    apellido: "Vendedor",
    fechaNacimiento: "1995-08-21",
    email: "vendedor@duocuc.cl",
    password: "Vendedor123",
    direccion: "Calle Los Olivos 456",
    region: "Valparaíso",
    genero: "Masculino",
    rol: "vendedor",
    bloqueado: false,
  },
  {
    id: "usr-cliente",
    nombre: "Camila",
    apellido: "Cliente",
    fechaNacimiento: "2000-01-15",
    email: "cliente@duocuc.cl",
    password: "Cliente123",
    direccion: "Pasaje Las Rosas 789",
    region: "Biobío",
    genero: "Otro",
    rol: "cliente",
    bloqueado: false,
  },
];
