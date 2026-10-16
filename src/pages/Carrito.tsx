import { useState } from "react";
import { Link, useNavigate, type NavigateOptions } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import { CarritoFila } from "../components/CarritoFila";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useProductos } from "../context/ProductosContext";
import type { AlertaInfo, ResultadoCantidad } from "../types/Resultado";
import { formatearPrecio } from "../utils/formato";

export const Carrito = () => {
  const { carrito, total, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } =
    useCarrito();
  const { descontarStock } = useProductos();
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  // Espera unos milisegundos (para que se lea el mensaje) y luego cambia de página
  const navegarConRetraso = (ruta: string, milisegundos: number, opciones?: NavigateOptions) => {
    setTimeout(() => navigate(ruta, opciones), milisegundos);
  };

  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const cambiarCantidad = (id: string, cantidad: number): ResultadoCantidad => {
    const resultado = actualizarCantidad(id, cantidad);
    setAlerta(resultado.exito ? null : { tipo: "danger", mensaje: resultado.mensaje });
    return resultado;
  };

  const finalizarCompra = () => {
    if (carrito.length === 0) return;

    // 1. Validar que el usuario haya iniciado sesión
    if (!usuarioActual) {
      setAlerta({
        tipo: "danger",
        mensaje:
          "Debes iniciar sesión o registrarte para finalizar tu compra. Redirigiendo al login...",
      });
      // "from" le dice al login a dónde volver después de ingresar
      navegarConRetraso("/login", 2000, { state: { from: "/carrito" } });
      return;
    }

    // 2. Revisar que el stock actual alcance (un vendedor pudo modificarlo)
    const sinStock = carrito.find((item) => item.cantidad > item.stockMaximo);
    if (sinStock) {
      setAlerta({
        tipo: "danger",
        mensaje: `No hay stock suficiente de "${sinStock.nombre}" (disponible: ${sinStock.stockMaximo}). Ajusta la cantidad.`,
      });
      return;
    }

    // 3. Con sesión y stock: descontar existencias y procesar la compra
    descontarStock(carrito);
    vaciarCarrito();
    setAlerta({
      tipo: "success",
      mensaje: "¡Compra realizada exitosamente! Gracias por preferir Sonido Vivo. Redirigiendo...",
    });
    navegarConRetraso("/", 2500);
  };

  return (
    <main className="container my-5">
      <h1 className="h2 fw-bold mb-4 border-bottom border-warning border-3 pb-2">
        Tu Carrito de Compras
      </h1>

      <Alerta alerta={alerta} className="mb-4" />

      {carrito.length === 0 ? (
        <div className="alert alert-info text-center p-5" role="alert">
          <i className="bi bi-cart-x fs-1 d-block mb-3"></i>
          <h4>Tu carrito está vacío</h4>
          <p className="text-secondary mb-4">
            Explora nuestro catálogo para encontrar tus instrumentos favoritos.
          </p>
          <Link to="/catalogo" className="btn btn-primary fw-bold">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-3">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <CarritoFila
                        key={item.id}
                        item={item}
                        onCambiarCantidad={cambiarCantidad}
                        onEliminar={eliminarDelCarrito}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-3">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={vaciarCarrito}
                >
                  <i className="bi bi-trash me-1"></i> Vaciar Carrito
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-3 border-bottom pb-2">Resumen</h4>
              <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">{formatearPrecio(total)}</span>
              </div>
              <button
                type="button"
                className="btn btn-warning btn-lg w-100 fw-bold"
                onClick={finalizarCompra}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
