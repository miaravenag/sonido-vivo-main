import type { ReactNode } from "react";

interface TituloPaginaProps {
  texto: string;
  children?: ReactNode; // acciones a la derecha (por ejemplo, un botón "Nuevo")
}

export const TituloPagina = ({ texto, children }: TituloPaginaProps) => {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 border-bottom border-warning border-3 pb-2">
      <h1 className="h2 fw-bold mb-0">{texto}</h1>
      {children}
    </div>
  );
};
