# Sonido Vivo — Tienda de Instrumentos Musicales (React)

Migración del sitio HTML + JavaScript "PaginaSonidoVivo" a **React + TypeScript + Vite + Bootstrap**,
con administración de usuarios, productos y categorías, tres roles y perfil personal (Evaluación Parcial N.° 2).

## Cómo ejecutarlo

```bash
npm install
npm run dev       # desarrollo -> http://localhost:5173
npm run build     # compila TypeScript y genera /dist
npm run lint      # revisa el código con ESLint
```

## Estructura

```
src/
├── main.tsx            Punto de entrada: Router + Providers (contextos)
├── App.tsx             Definición de rutas
├── components/         Piezas reutilizables de la interfaz
├── pages/              Una por cada página del sitio original
├── context/            Estado global (sesión y usuarios, productos, categorías, carrito)
├── data/               Productos, categorías y usuarios iniciales, enlaces por rol
├── types/              Interfaces TypeScript
├── utils/              formatearPrecio, validaciones, permisos por rol, leer/guardar en localStorage
└── styles/styles.css   Estilos propios (los mismos de css/style.css)
```

## De dónde viene cada cosa (HTML/JS original → React)

| Sitio original | Ahora en React |
|---|---|
| `index.html` + `index.js` | `pages/Inicio.tsx` + `Hero`, `ProductosDestacados`, `QuienesSomos`, `Contacto` |
| `catalogo.html` + `catalogo.js` | `pages/Catalogo.tsx` + `FiltrosCatalogo`, `ProductoCard` |
| `detalle.html` + `detalle.js` | `pages/DetalleProducto.tsx` (ruta `/producto/:id`) |
| `carrito.html` + `carrito.js` | `pages/Carrito.tsx` + `CarritoFila` |
| `login.html` + `login.js` | `pages/Login.tsx` |
| `registro.html` + `registro.js` | `pages/Registro.tsx` + `utils/validaciones.ts` |
| Navbar y footer copiados en cada HTML | `components/Navbar.tsx`, `Footer.tsx`, `Layout.tsx` (una sola vez) |
| `storage.js` (productos, carrito, usuarios, sesión) | `context/ProductosContext`, `CarritoContext`, `AuthContext` (useState + `utils/almacenamiento.ts`) |
| `main.js` (`mostrarError`, `mostrarExito`, `formatearPrecio`) | `components/Alerta.tsx`, `utils/formato.ts` |
| `document.createElement(...)` / `innerHTML` | JSX con `.map()` y render condicional |
| `getElementById(...).value` | Inputs controlados con `useState` |
| `localStorage "productoSeleccionado"` + `detalle.html` | Parámetro de URL con `useParams` |
| `window.location.href = ...` / `setTimeout(...)` | `<Link>`, `useNavigate` (+ `setTimeout` para la espera) |
| `data-bs-toggle` (JS de Bootstrap) | Estado de React (`menuAbierto`, `usuarioAbierto`) |

Los datos se guardan en `localStorage` con las mismas claves del sitio original (`sonidovivo_productos`,
`sonidovivo_carrito`, `sonidovivo_usuarios`, `sonidovivo_sesion_activa`, `sonidovivo_intentos_fallidos`).

## Roles (Evaluación Parcial N.° 2)

Cuentas de demostración (se crean la primera vez que se abre la tienda):

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duocuc.cl` | `Admin123` |
| Vendedor | `vendedor@duocuc.cl` | `Vendedor123` |
| Cliente | `cliente@duocuc.cl` | `Cliente123` |

| Operación | Administrador | Vendedor | Cliente |
|---|:-:|:-:|:-:|
| Navegar y comprar | ✔ | ✔ | ✔ |
| Ver y editar su propio perfil (sin cambiar su rol) | ✔ | ✔ | ✔ |
| CRUD de usuarios y asignar cualquier rol | ✔ | — | — |
| Crear usuarios | ✔ (cualquier rol) | ✔ (solo clientes) | — |
| CRUD de productos | ✔ | — | — |
| Consultar productos y modificar stock | ✔ | ✔ | — |
| CRUD de categorías | ✔ | — | — |

El registro público (`/registro`) siempre crea clientes. Las rutas `/perfil` y `/gestion/*` están protegidas con
`components/RutaProtegida.tsx`, y además cada contexto vuelve a comprobar el rol antes de modificar datos.
Todo es una simulación frontend con `localStorage`: no constituye seguridad real.

Para volver a los datos de demostración, borra el almacenamiento local del sitio (F12 → Application → Local Storage).
