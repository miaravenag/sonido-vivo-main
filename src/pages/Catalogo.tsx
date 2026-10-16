import { useState } from "react";
import { Alerta } from "../components/Alerta";
import { FiltrosCatalogo, PRECIO_MAXIMO } from "../components/FiltrosCatalogo";
import { ProductoCard } from "../components/ProductoCard";
import { useCarrito } from "../context/CarritoContext";
import { useCategorias } from "../context/CategoriasContext";
import { useProductos } from "../context/ProductosContext";
import type { Producto } from "../types/Producto";
import type { AlertaInfo } from "../types/Resultado";
import { precioEfectivo } from "../utils/formato";

export const Catalogo = () => {
  const { productos } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  const { categorias } = useCategorias();

  const [categoria, setCategoria] = useState("todas");
  const [precioMax, setPrecioMax] = useState(PRECIO_MAXIMO);
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  // Filtrado combinado: se recalcula en cada render a partir del estado
  const productosFiltrados = productos.filter(
    (producto) =>
      (categoria === "todas" || producto.categoria === categoria) &&
      precioEfectivo(producto) <= precioMax,
  );

  const limpiarFiltros = () => {
    setCategoria("todas");
    setPrecioMax(PRECIO_MAXIMO);
  };

  const agregar = (producto: Producto) => {
    const resultado = agregarAlCarrito(producto, 1);
    setAlerta({
      tipo: resultado.exito ? "success" : "danger",
      mensaje: resultado.mensaje,
    });
  };

  return (
    <main className="container my-4">
      <h1 className="h2 fw-bold mb-4 border-bottom border-warning border-3 pb-2">
        Catálogo de Productos
      </h1>

      <div className="row g-4">
        <aside className="col-lg-3">
          <FiltrosCatalogo
            categorias={categorias}
            categoria={categoria}
            precioMax={precioMax}
            onCategoriaChange={setCategoria}
            onPrecioMaxChange={setPrecioMax}
            onLimpiar={limpiarFiltros}
          />
        </aside>

        <section className="col-lg-9">
          <Alerta alerta={alerta} className="mb-3" />

          {productosFiltrados.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-search me-2"></i>No se encontraron productos que coincidan
              con los filtros seleccionados.
            </div>
          )}

          <div className="row g-4">
            {productosFiltrados.map((producto) => (
              <div className="col-md-6 col-lg-4" key={producto.id}>
                <ProductoCard producto={producto} variante="catalogo" onAgregar={agregar} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
