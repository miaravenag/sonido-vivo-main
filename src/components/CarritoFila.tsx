import { useState } from "react";
import type { ItemCarrito } from "../types/Carrito";
import type { ResultadoCantidad } from "../types/Resultado";
import { formatearPrecio } from "../utils/formato";

interface CarritoFilaProps {
  item: ItemCarrito;
  onCambiarCantidad: (id: string, cantidad: number) => ResultadoCantidad;
  onEliminar: (id: string) => void;
}

export const CarritoFila = ({ item, onCambiarCantidad, onEliminar }: CarritoFilaProps) => {
  // Texto que el usuario está escribiendo; se confirma al salir del campo
  const [texto, setTexto] = useState(String(item.cantidad));

  const confirmarCantidad = () => {
    const resultado = onCambiarCantidad(item.id, Number(texto));
    setTexto(String(resultado.cantidad));
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={item.imagen}
            alt={item.nombre}
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <span className="fw-semibold small">{item.nombre}</span>
        </div>
      </td>
      <td>{formatearPrecio(item.precio)}</td>
      <td>
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: 70 }}
          min={1}
          max={item.stockMaximo}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onBlur={confirmarCantidad}
          onKeyDown={(evento) => {
            if (evento.key === "Enter") evento.currentTarget.blur();
          }}
        />
      </td>
      <td className="fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          aria-label={`Quitar ${item.nombre}`}
          onClick={() => onEliminar(item.id)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </td>
    </tr>
  );
};
