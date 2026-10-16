import { Contacto } from "../components/Contacto";
import { Hero } from "../components/Hero";
import { ProductosDestacados } from "../components/ProductosDestacados";
import { QuienesSomos } from "../components/QuienesSomos";

export const Inicio = () => {
  return (
    <main className="container my-4">
      <Hero />
      <ProductosDestacados />
      <QuienesSomos />
      <Contacto />
    </main>
  );
};
