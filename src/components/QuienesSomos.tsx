const equipo = [
  "Vicente Aranda - Desarrollador Frontend",
  "Miguel Aravena - Arquitectura & Lógica JS",
];

export const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="bg-light p-4 p-md-5 rounded shadow-sm mb-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="fw-bold mb-3 text-dark">
            <i className="bi bi-info-circle text-primary me-2"></i>Quiénes Somos
          </h2>
          <p className="text-secondary">
            <strong>Sonido Vivo</strong> nace en Santiago como un proyecto desarrollado para la
            carrera de Ingeniería en Informática, con el propósito de conectar a los músicos y
            apasionados del sonido con instrumentos y equipamiento de máxima calidad. Contamos
            con 2 años de trayectoria optimizando nuestra plataforma y brindando asesoría
            especializada. Nuestro objetivo es sacarnos una buena nota para poder pasar el ramo.
          </p>
          <p className="text-primary fw-semibold">
            Nuestro objetivo es sacarnos una buena nota para poder pasar el ramo.
          </p>

          <h5 className="fw-bold mt-4">Equipo de Desarrollo:</h5>
          <ul className="list-group list-group-flush">
            {equipo.map((integrante) => (
              <li className="list-group-item bg-transparent" key={integrante}>
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                {integrante}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600"
            className="img-fluid rounded shadow"
            alt="Tienda Sonido Vivo"
          />
        </div>
      </div>
    </section>
  );
};
