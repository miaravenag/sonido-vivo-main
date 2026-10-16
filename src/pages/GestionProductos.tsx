import { useState } from "react";
import { Alerta } from "../components/Alerta";
import { FilaProducto } from "../components/FilaProducto";
import { FormularioProducto } from "../components/FormularioProducto";
import { TituloPagina } from "../components/TituloPagina";
import { useAuth } from "../context/AuthContext";
import { useCategorias } from "../context/CategoriasContext";
import { useProductos } from "../context/ProductosContext";
import type { Producto } from "../types/Producto";
import type { AlertaInfo } from "../types/Resultado";
import { alertaDesde } from "../utils/alertas";

export const GestionProductos = () => {
  const { productos, crearProducto, actualizarProducto, eliminarProducto, actualizarStock } =
    useProductos();
  const { categorias } = useCategorias();
  const { usuarioActual } = useAuth();

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  // Administrador: CRUD completo. Vendedor: consulta y modifica solo el stock.
  const esAdministrador = usuarioActual?.rol === "administrador";

  const abrirNuevo = () => {
    setEditando(null);
    setAlerta(null);
    setFormularioAbierto(true);
  };

  const abrirEdicion = (producto: Producto) => {
    setEditando(producto);
    setAlerta(null);
    setFormularioAbierto(true);
  };

  const cerrarFormulario = () => {
    setEditando(null);
    setFormularioAbierto(false);
  };

  const manejarEliminar = (producto: Producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    setAlerta(alertaDesde(eliminarProducto(producto.id)));
  };

  const guardarStock = (id: string, stock: number) => {
    const resultado = actualizarStock(id, stock);
    setAlerta(alertaDesde(resultado));
    return resultado;
  };

  const texto = busqueda.trim().toLowerCase();
  const productosFiltrados = productos.filter(
    (p) =>
      (categoriaFiltro === "todas" || p.categoria === categoriaFiltro) &&
      p.nombre.toLowerCase().includes(texto),
  );

  return (
    <main className="container my-5">
      <TituloPagina texto={esAdministrador ? "Gestión de productos" : "Stock de productos"}>
        {esAdministrador && !formularioAbierto && (
          <button type="button" className="btn btn-warning fw-bold" onClick={abrirNuevo}>
            <i className="bi bi-plus-lg me-1"></i>Nuevo producto
          </button>
        )}
      </TituloPagina>

      <Alerta alerta={alerta} className="mb-3" />

      {esAdministrador && formularioAbierto && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h2 className="h5 fw-bold mb-3">
            {editando ? `Editar "${editando.nombre}"` : "Nuevo producto"}
          </h2>
          <FormularioProducto
            key={editando?.id ?? "nuevo"}
            categorias={categorias}
            producto={editando ?? undefined}
            onGuardar={(datos) =>
              editando ? actualizarProducto(editando.id, datos) : crearProducto(datos)
            }
            onCancelar={cerrarFormulario}
          />
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar producto..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            aria-label="Filtrar por categoría"
            value={categoriaFiltro}
            onChange={(evento) => setCategoriaFiltro(evento.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive card border-0 shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              // key con el stock: si cambia desde otro lugar, la fila reinicia su campo
              <FilaProducto
                key={`${producto.id}-${producto.stock}`}
                producto={producto}
                puedeEditar={esAdministrador}
                puedeEliminar={esAdministrador}
                onEditar={abrirEdicion}
                onEliminar={manejarEliminar}
                onGuardarStock={guardarStock}
              />
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
