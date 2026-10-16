import type { ChangeEvent } from "react";

// Evento de cualquier campo de formulario: permite usar un solo manejador de cambios
export type EventoCampo = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

interface CampoBaseProps {
  id: string; // se usa como id y como name (el manejador usa "name" para saber qué campo cambió)
  etiqueta: string;
  valor: string;
  onCambio: (evento: EventoCampo) => void;
  columnas?: string; // clase de columna Bootstrap, ej. "col-md-6"
  deshabilitado?: boolean;
}

interface CampoTextoProps extends CampoBaseProps {
  tipo?: string;
  placeholder?: string;
  ayuda?: string;
  min?: number;
}

export const CampoTexto = ({
  id,
  etiqueta,
  valor,
  onCambio,
  columnas = "col-12",
  deshabilitado = false,
  tipo = "text",
  placeholder,
  ayuda,
  min,
}: CampoTextoProps) => {
  return (
    <div className={columnas}>
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>
      <input
        type={tipo}
        className="form-control"
        id={id}
        name={id}
        value={valor}
        onChange={onCambio}
        disabled={deshabilitado}
        placeholder={placeholder}
        min={min}
      />
      {ayuda && <div className="form-text">{ayuda}</div>}
    </div>
  );
};

export interface OpcionSelect {
  valor: string;
  texto: string;
}

interface CampoSelectProps extends CampoBaseProps {
  opciones: OpcionSelect[];
  textoVacio?: string; // si viene, agrega una primera opción vacía ("Selecciona...")
}

export const CampoSelect = ({
  id,
  etiqueta,
  valor,
  onCambio,
  columnas = "col-12",
  deshabilitado = false,
  opciones,
  textoVacio,
}: CampoSelectProps) => {
  return (
    <div className={columnas}>
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>
      <select
        id={id}
        name={id}
        className="form-select"
        value={valor}
        onChange={onCambio}
        disabled={deshabilitado}
      >
        {textoVacio !== undefined && <option value="">{textoVacio}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    </div>
  );
};
