import { formatearPrecio } from "../utils/formato";

export const PRECIO_MAXIMO = 1000000;

interface FiltrosCatalogoProps {
  categorias: string[];
  categoria: string;
  precioMax: number;
  onCategoriaChange: (categoria: string) => void;
  onPrecioMaxChange: (precio: number) => void;
  onLimpiar: () => void;
}

export const FiltrosCatalogo = ({
  categorias,
  categoria,
  precioMax,
  onCategoriaChange,
  onPrecioMaxChange,
  onLimpiar,
}: FiltrosCatalogoProps) => {
  return (
    <div className="card border-0 shadow-sm p-3 sticky-lg-top" style={{ top: 80 }}>
      <h5 className="fw-bold mb-3">
        <i className="bi bi-funnel me-2"></i>Filtros
      </h5>

      <div className="mb-3">
        <label htmlFor="filtroCategoria" className="form-label fw-semibold">
          Categoría
        </label>
        <select
          id="filtroCategoria"
          className="form-select"
          value={categoria}
          onChange={(evento) => onCategoriaChange(evento.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="filtroPrecio" className="form-label fw-semibold">
          Precio Máximo:{" "}
          <span className="text-primary fw-bold">{formatearPrecio(precioMax)}</span>
        </label>
        <input
          type="range"
          className="form-range"
          id="filtroPrecio"
          min={50000}
          max={PRECIO_MAXIMO}
          step={25000}
          value={precioMax}
          onChange={(evento) => onPrecioMaxChange(Number(evento.target.value))}
        />
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary w-100 btn-sm"
        onClick={onLimpiar}
      >
        Limpiar Filtros
      </button>
    </div>
  );
};
