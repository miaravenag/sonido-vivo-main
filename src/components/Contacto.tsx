import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AlertaInfo } from "../types/Resultado";
import { Alerta } from "./Alerta";

const formularioVacio = { nombre: "", email: "", mensaje: "" };

export const Contacto = () => {
  const [formulario, setFormulario] = useState(formularioVacio);
  const [alerta, setAlerta] = useState<AlertaInfo | null>(null);

  const manejarCambio = (
    evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setAlerta({
      tipo: "success",
      mensaje: "¡Gracias por contactarnos! Te responderemos a la brevedad.",
    });
    setFormulario(formularioVacio);
  };

  return (
    <section id="contacto" className="mb-5">
      <h2 className="h3 fw-bold border-bottom border-warning border-3 pb-2 mb-4">
        Contáctanos
      </h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h4 className="fw-bold mb-3">Envíanos un mensaje</h4>
            <Alerta alerta={alerta} />

            <form onSubmit={manejarEnvio}>
              <div className="mb-3">
                <label htmlFor="nombreContacto" className="form-label fw-semibold">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreContacto"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                  placeholder="Tu nombre"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailContacto" className="form-label fw-semibold">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailContacto"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  required
                  placeholder="tuemail@ejemplo.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mensajeContacto" className="form-label fw-semibold">
                  Mensaje o Consulta
                </label>
                <textarea
                  className="form-control"
                  id="mensajeContacto"
                  name="mensaje"
                  rows={3}
                  value={formulario.mensaje}
                  onChange={manejarCambio}
                  required
                  placeholder="¿En qué te podemos ayudar?"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold">
                Enviar Consulta
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0 d-flex">
              <iframe
                title="Ubicación Sonido Vivo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.2620247636687!2d-70.58137272342695!3d-33.59850527333122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d7037854df81%3A0x893f58a1479b8f82!2sDuoc%20UC%3A%20Sede%20Puente%20Alto!5e0!3m2!1ses-419!2scl!4v1788978417534!5m2!1ses-419!2scl"
                width="100%"
                height="100%"
                style={{ minHeight: 350, border: 0, borderRadius: "0.5rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
