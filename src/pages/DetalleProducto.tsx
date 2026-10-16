import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import { useCarrito } from "../context/CarritoContext";
import { useProductos } from "../context/ProductosContext";
import type { AlertaInfo } from "../types/Resultado";
import { formatearPrecio } from "../utils/formato";

export const DetalleProducto = () => {
  // El id viene de la URL: /producto/:id (reemplaza al localStorage "productoSeleccionado")
  const { id } = useParams<{ id: string }>();
  const { buscarProductoPorId } = useProductos();
  const { agregarAlCarrito } = useCarrito();

  const [cantidad, setCantidad] = useState("1");
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const producto = buscarProductoPorId(id ?? "");

  const agregar = () => {
    if (!producto) return;

    const unidades = Number(cantidad);
    if (Number.isNaN(unidades) || unidades <= 0) {
      setAlerta({ tipo: "danger", mensaje: "Ingresa una cantidad válida." });
      return;
    }

    const resultado = agregarAlCarrito(producto, unidades);
    setAlerta({
      tipo: resultado.exito ? "success" : "danger",
      mensaje: resultado.mensaje,
    });
  };

  return (
    <main className="container my-5">
      <Link to="/catalogo" className="btn btn-outline-secondary mb-4">
        <i className="bi bi-arrow-left"></i> Volver al Catálogo
      </Link>

      {!producto ? (
        <div className="alert alert-danger text-center" role="alert">
          El producto solicitado no existe o fue removido.
        </div>
      ) : (
        <>
          <Alerta alerta={alerta} className="mb-4" />

          <article className="card border-0 shadow p-4">
            <div className="row g-4 align-items-center">
              <div className="col-md-6 text-center">
                <img
                  src={producto.imagen}
                  className="img-fluid rounded p-3"
                  style={{ maxHeight: 350, objectFit: "contain" }}
                  alt={producto.nombre}
                />
              </div>

              <div className="col-md-6">
                <span className="badge bg-secondary mb-2">{producto.categoria}</span>
                <h1 className="h2 fw-bold text-dark mb-3">{producto.nombre}</h1>
                <p className="text-secondary mb-4">{producto.descripcion}</p>

                <div className="mb-3">
                  <span className="h3 fw-bold text-danger me-3">
                    {formatearPrecio(producto.precioOferta ?? producto.precio)}
                  </span>
                  {producto.precioOferta && (
                    <span className="h5 text-muted text-decoration-line-through">
                      {formatearPrecio(producto.precio)}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  {producto.stock > 0 ? (
                    <span className="text-success fw-bold">
                      Disponible ({producto.stock} unidades en stock)
                    </span>
                  ) : (
                    <span className="text-danger fw-bold">Sin Stock disponible</span>
                  )}
                </div>

                <div className="row g-3 align-items-center mb-4">
                  <div className="col-auto">
                    <label htmlFor="inputCantidad" className="col-form-label fw-bold">
                      Cantidad:
                    </label>
                  </div>
                  <div className="col-auto">
                    <input
                      type="number"
                      id="inputCantidad"
                      className="form-control"
                      style={{ width: 90 }}
                      min={1}
                      max={producto.stock}
                      value={cantidad}
                      disabled={producto.stock <= 0}
                      onChange={(evento) => setCantidad(evento.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-warning btn-lg fw-bold w-100"
                  disabled={producto.stock <= 0}
                  onClick={agregar}
                >
                  <i className="bi bi-cart-plus me-2"></i>Agregar al Carrito
                </button>
              </div>
            </div>
          </article>
        </>
      )}
    </main>
  );
};
