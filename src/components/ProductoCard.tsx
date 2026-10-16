import { useNavigate } from "react-router-dom";
import type { Producto } from "../types/Producto";
import { formatearPrecio, precioEfectivo } from "../utils/formato";

interface ProductoCardProps {
  producto: Producto;
  // "destacado": versión compacta del inicio. "catalogo": con stock, ofertas y botón de carrito
  variante?: "destacado" | "catalogo";
  onAgregar?: (producto: Producto) => void;
}

export const ProductoCard = ({
  producto,
  variante = "catalogo",
  onAgregar,
}: ProductoCardProps) => {
  const navigate = useNavigate();
  const esCatalogo = variante === "catalogo";
  const agotado = producto.stock <= 0;

  const irAlDetalle = () => navigate(`/producto/${producto.id}`);

  return (
    <article className="card product-card h-100 border-0 shadow-sm" onClick={irAlDetalle}>
      <img className="card-img-top product-img" src={producto.imagen} alt={producto.nombre} />

      <div className={`card-body d-flex flex-column ${esCatalogo ? "p-3" : "p-4"}`}>
        <span className="badge bg-secondary mb-2 align-self-start">{producto.categoria}</span>
        <h3 className="h6 card-title fw-bold mb-2 text-dark">{producto.nombre}</h3>

        {esCatalogo ? (
          <>
            <p className={agotado ? "small text-danger mb-2 fw-bold" : "small text-success mb-2"}>
              {agotado ? "Agotado" : `Stock: ${producto.stock} unidades`}
            </p>

            <div className="mb-3 mt-auto">
              {producto.precioOferta ? (
                <>
                  <span className="text-danger fw-bold fs-5 me-2">
                    {formatearPrecio(producto.precioOferta)}
                  </span>
                  <span className="text-muted text-decoration-line-through small">
                    {formatearPrecio(producto.precio)}
                  </span>
                </>
              ) : (
                <span className="text-primary fw-bold fs-5">
                  {formatearPrecio(producto.precio)}
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn btn-warning btn-sm w-100 fw-bold mb-2"
              disabled={agotado}
              onClick={(evento) => {
                evento.stopPropagation(); // evita que se abra el detalle
                onAgregar?.(producto);
              }}
            >
              <i className="bi bi-cart-plus me-1"></i> Agregar al Carrito
            </button>
          </>
        ) : (
          <>
            <p className="text-primary fw-bold fs-5 mt-auto mb-3">
              {formatearPrecio(precioEfectivo(producto))}
            </p>
            <button type="button" className="btn btn-outline-primary w-100 fw-semibold">
              Ver Detalle
            </button>
          </>
        )}
      </div>
    </article>
  );
};
