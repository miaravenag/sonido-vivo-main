import { useState } from "react";
import type { Producto } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { formatearPrecio, precioEfectivo } from "../utils/formato";

interface FilaProductoProps {
  producto: Producto;
  puedeEditar: boolean; // solo administrador
  puedeEliminar: boolean; // solo administrador
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onGuardarStock: (id: string, stock: number) => Resultado; // administrador y vendedor
}

export const FilaProducto = ({
  producto,
  puedeEditar,
  puedeEliminar,
  onEditar,
  onEliminar,
  onGuardarStock,
}: FilaProductoProps) => {
  // Texto que se está escribiendo en el campo de stock
  const [stock, setStock] = useState(String(producto.stock));

  const sinCambios = stock === String(producto.stock);

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ width: 45, height: 45, objectFit: "contain" }}
          />
          <span className="fw-semibold small">{producto.nombre}</span>
        </div>
      </td>
      <td>
        <span className="badge bg-secondary">{producto.categoria}</span>
      </td>
      <td>{formatearPrecio(precioEfectivo(producto))}</td>
      <td>
        <div className="input-group input-group-sm" style={{ minWidth: 150, maxWidth: 170 }}>
          <input
            type="number"
            className="form-control"
            min={0}
            aria-label={`Stock de ${producto.nombre}`}
            value={stock}
            onChange={(evento) => setStock(evento.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-success"
            disabled={sinCambios}
            onClick={() => onGuardarStock(producto.id, Number(stock))}
          >
            Guardar
          </button>
        </div>
      </td>
      <td className="text-nowrap">
        {puedeEditar && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            aria-label={`Editar ${producto.nombre}`}
            onClick={() => onEditar(producto)}
          >
            <i className="bi bi-pencil"></i>
          </button>
        )}
        {puedeEliminar && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            aria-label={`Eliminar ${producto.nombre}`}
            onClick={() => onEliminar(producto)}
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
        {!puedeEditar && !puedeEliminar && <span className="text-muted small">Solo stock</span>}
      </td>
    </tr>
  );
};
