// Funciones simples para leer y guardar en localStorage (no son hooks).
// Los contextos leen una vez al iniciar (useState) y guardan en cada operación.

export const leerAlmacenamiento = <T>(clave: string, valorInicial: T): T => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado !== null ? (JSON.parse(guardado) as T) : valorInicial;
  } catch {
    return valorInicial;
  }
};

export const guardarAlmacenamiento = <T>(clave: string, valor: T): void => {
  localStorage.setItem(clave, JSON.stringify(valor));
};
