import { useState } from "react";
import type { Resultado } from "../types/Resultado";

interface CategoriaFilaProps {
  nombre: string;
  cantidadProductos: number;
  onRenombrar: (anterior: string, nuevo: string) => Resultado;
  onEliminar: (nombre: string) => void;
}

export const CategoriaFila = ({
  nombre,
  cantidadProductos,
  onRenombrar,
  onEliminar,
}: CategoriaFilaProps) => {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(nombre);

  const guardar = () => {
    const resultado = onRenombrar(nombre, texto);
    if (resultado.exito) setEditando(false);
  };

  const cancelar = () => {
    setTexto(nombre);
    setEditando(false);
  };

  return (
    <tr>
      <td>
        {editando ? (
          <input
            type="text"
            className="form-control form-control-sm"
            aria-label={`Nuevo nombre para ${nombre}`}
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
          />
        ) : (
          <span className="fw-semibold">{nombre}</span>
        )}
      </td>
      <td>{cantidadProductos}</td>
      <td className="text-nowrap">
        {editando ? (
          <>
            <button type="button" className="btn btn-success btn-sm me-2" onClick={guardar}>
              Guardar
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelar}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm me-2"
              aria-label={`Editar ${nombre}`}
              onClick={() => setEditando(true)}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              aria-label={`Eliminar ${nombre}`}
              onClick={() => onEliminar(nombre)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </td>
    </tr>
  );
};
