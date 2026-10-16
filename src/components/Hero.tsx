import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="hero-banner mb-5 text-center text-lg-start">
      <div className="row align-items-center">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold">Pasión por la Música y el Sonido</h1>
          <p className="lead text-light mb-4">
            Descubre los mejores instrumentos musicales, equipos de audio profesional y
            accesorios con despacho a todo Chile.
          </p>
          <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold">
            <i className="bi bi-bag"></i> Ver Catálogo Completo
          </Link>
        </div>
      </div>
    </section>
  );
};
