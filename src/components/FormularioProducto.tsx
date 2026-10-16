import { useState, type FormEvent } from "react";
import type { DatosProducto, FormularioProducto as DatosFormulario, Producto } from "../types/Producto";
import type { AlertaInfo, Resultado } from "../types/Resultado";
import { alertaDesde } from "../utils/alertas";
import { validarProducto } from "../utils/validaciones";
import { Alerta } from "./Alerta";
import { CampoSelect, CampoTexto, type EventoCampo } from "./Campos";

interface FormularioProductoProps {
  categorias: string[];
  onGuardar: (datos: DatosProducto) => Resultado;
  producto?: Producto; // si viene, edita ese producto; si no, crea uno nuevo
  onExito?: () => void;
  onCancelar?: () => void;
}

const formularioDesde = (producto?: Producto): DatosFormulario => ({
  nombre: producto?.nombre ?? "",
  categoria: producto?.categoria ?? "",
  precio: producto ? String(producto.precio) : "",
  precioOferta: producto?.precioOferta ? String(producto.precioOferta) : "",
  stock: producto ? String(producto.stock) : "",
  imagen: producto?.imagen ?? "",
  descripcion: producto?.descripcion ?? "",
});

export const FormularioProducto = ({
  categorias,
  onGuardar,
  producto,
  onExito,
  onCancelar,
}: FormularioProductoProps) => {
  const [formulario, setFormulario] = useState<DatosFormulario>(() => formularioDesde(producto));
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const editando = producto !== undefined;

  const manejarCambio = (evento: EventoCampo) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const validacion = validarProducto(formulario, categorias);
    if ("error" in validacion) {
      setAlerta({ tipo: "danger", mensaje: validacion.error });
      return;
    }

    const resultado = onGuardar(validacion.datos);
    setAlerta(alertaDesde(resultado));

    if (resultado.exito) {
      if (!editando) setFormulario(formularioDesde());
      onExito?.();
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <Alerta alerta={alerta} className="mb-3" />

      <div className="row g-3">
        <CampoTexto id="nombre" etiqueta="Nombre del producto" columnas="col-md-8" valor={formulario.nombre} onCambio={manejarCambio} />
        <CampoSelect
          id="categoria"
          etiqueta="Categoría"
          columnas="col-md-4"
          valor={formulario.categoria}
          onCambio={manejarCambio}
          textoVacio="Selecciona..."
          opciones={categorias.map((categoria) => ({ valor: categoria, texto: categoria }))}
        />

        <CampoTexto id="precio" etiqueta="Precio (CLP)" tipo="number" min={1} columnas="col-sm-4" valor={formulario.precio} onCambio={manejarCambio} />
        <CampoTexto id="precioOferta" etiqueta="Precio oferta (opcional)" tipo="number" min={1} columnas="col-sm-4" valor={formulario.precioOferta} onCambio={manejarCambio} />
        <CampoTexto id="stock" etiqueta="Stock" tipo="number" min={0} columnas="col-sm-4" valor={formulario.stock} onCambio={manejarCambio} />

        <CampoTexto id="imagen" etiqueta="URL de la imagen" valor={formulario.imagen} onCambio={manejarCambio} placeholder="https://..." />

        <div className="col-12">
          <label htmlFor="descripcion" className="form-label fw-semibold">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-control"
            rows={3}
            value={formulario.descripcion}
            onChange={manejarCambio}
          ></textarea>
        </div>

        <div className="col-12 d-flex flex-column flex-sm-row gap-2">
          <button type="submit" className="btn btn-warning fw-bold py-2 flex-grow-1">
            {editando ? "Guardar cambios" : "Crear producto"}
          </button>
          {onCancelar && (
            <button type="button" className="btn btn-outline-secondary py-2" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
