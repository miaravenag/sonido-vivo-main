import { useState, type FormEvent } from "react";
import { Alerta } from "../components/Alerta";
import { CategoriaFila } from "../components/CategoriaFila";
import { TituloPagina } from "../components/TituloPagina";
import { useCategorias } from "../context/CategoriasContext";
import { useProductos } from "../context/ProductosContext";
import type { AlertaInfo, Resultado } from "../types/Resultado";
import { alertaDesde } from "../utils/alertas";

export const GestionCategorias = () => {
  const { categorias, crearCategoria, renombrarCategoria, eliminarCategoria } = useCategorias();
  const { contarPorCategoria } = useProductos();

  const [nombreNuevo, setNombreNuevo] = useState("");
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const manejarCrear = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const resultado = crearCategoria(nombreNuevo);
    setAlerta(alertaDesde(resultado));
    if (resultado.exito) setNombreNuevo("");
  };

  // Se devuelve el resultado para que la fila sepa si debe salir del modo edición
  const manejarRenombrar = (anterior: string, nuevo: string): Resultado => {
    const resultado = renombrarCategoria(anterior, nuevo);
    setAlerta(alertaDesde(resultado));
    return resultado;
  };

  const manejarEliminar = (nombre: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    setAlerta(alertaDesde(eliminarCategoria(nombre)));
  };

  return (
    <main className="container my-5">
      <TituloPagina texto="Gestión de categorías" />

      <Alerta alerta={alerta} className="mb-3" />

      <form className="row g-2 mb-4" onSubmit={manejarCrear} noValidate>
        <div className="col-sm-8 col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la nueva categoría"
            aria-label="Nombre de la nueva categoría"
            value={nombreNuevo}
            onChange={(evento) => setNombreNuevo(evento.target.value)}
          />
        </div>
        <div className="col-sm-4 col-md-3">
          <button type="submit" className="btn btn-warning fw-bold w-100">
            <i className="bi bi-plus-lg me-1"></i>Agregar
          </button>
        </div>
      </form>

      <div className="table-responsive card border-0 shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Categoría</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((nombre) => (
              <CategoriaFila
                key={nombre}
                nombre={nombre}
                cantidadProductos={contarPorCategoria(nombre)}
                onRenombrar={manejarRenombrar}
                onEliminar={manejarEliminar}
              />
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  No hay categorías. Agrega la primera.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
