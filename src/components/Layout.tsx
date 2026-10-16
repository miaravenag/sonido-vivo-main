import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

// Estructura común de las páginas: Navbar arriba, contenido en medio, Footer abajo.
// <Outlet /> es el lugar donde React Router dibuja la página activa.
export const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
