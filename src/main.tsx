import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/styles.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CarritoProvider } from "./context/CarritoContext.tsx";
import { CategoriasProvider } from "./context/CategoriasContext.tsx";
import { ProductosProvider } from "./context/ProductosContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductosProvider>
          <CategoriasProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </CategoriasProvider>
        </ProductosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
