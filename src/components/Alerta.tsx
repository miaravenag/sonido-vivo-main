import type { AlertaInfo } from "../types/Resultado";

interface AlertaProps {
  alerta: AlertaInfo | null;
  className?: string;
}

// Reemplaza a mostrarError / mostrarExito / ocultarAlerta de main.js:
// si no hay alerta no se dibuja nada.
export const Alerta = ({ alerta, className = "" }: AlertaProps) => {
  if (alerta === null) return null;

  return (
    <div className={`alert alert-${alerta.tipo} ${className}`} role="alert">
      {alerta.mensaje}
    </div>
  );
};
