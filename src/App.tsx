import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RutaProtegida } from "./components/RutaProtegida";
import { Carrito } from "./pages/Carrito";
import { Catalogo } from "./pages/Catalogo";
import { DetalleProducto } from "./pages/DetalleProducto";
import { Inicio } from "./pages/Inicio";
import { GestionCategorias } from "./pages/GestionCategorias";
import { GestionProductos } from "./pages/GestionProductos";
import { GestionUsuarios } from "./pages/GestionUsuarios";
import { Login } from "./pages/Login";
import { Perfil } from "./pages/Perfil";
import { Registro } from "./pages/Registro";
import { ROLES } from "./utils/permisos";

function App() {
  return (
    <Routes>
      {/* Páginas con Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* Mover Login y Registro aquí adentro */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Perfil: cualquier usuario con sesión */}
        <Route element={<RutaProtegida roles={ROLES} />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Gestión: administrador y vendedor */}
        <Route element={<RutaProtegida roles={["administrador", "vendedor"]} />}>
          <Route path="/gestion/usuarios" element={<GestionUsuarios />} />
          <Route path="/gestion/productos" element={<GestionProductos />} />
        </Route>

        {/* Categorías: solo administrador */}
        <Route element={<RutaProtegida roles={["administrador"]} />}>
          <Route path="/gestion/categorias" element={<GestionCategorias />} />
        </Route>
      </Route>

      {/* Cualquier otra ruta vuelve al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
