# Informe breve — Migración de Sonido Vivo a React

**Asignatura:** DSY1104 · Evaluación Parcial N.° 2  
**Integrantes:** _(completar)_  
**Repositorio:** _(pegar enlace de GitHub)_

## 1. Migración

La tienda de la Evaluación 1 (HTML, CSS y JavaScript) se migró a **React + TypeScript + Vite + Bootstrap 5**.
Se conservaron todas las secciones y reglas de negocio: catálogo con filtros por categoría y precio máximo,
detalle de producto, carrito con validación de stock, registro con validaciones (correo `@duocuc.cl`,
edad mínima, contraseña), login con bloqueo tras 3 intentos fallidos y descuento de stock al comprar.
El DOM ya no se manipula directamente: la interfaz se actualiza a partir del estado (`useState`).

## 2. Organización del proyecto

| Carpeta | Responsabilidad |
|---|---|
| `pages/` | Una pantalla por ruta (Inicio, Catálogo, Carrito, Perfil, Gestión de usuarios/productos/categorías...) |
| `components/` | Piezas reutilizables: `Campos` (input y select), `FormularioUsuario`, `FormularioProducto`, `FilaProducto`, `CategoriaFila`, `InsigniaRol`, `TituloPagina`, `RutaProtegida`, `Navbar`... |
| `context/` | Estado compartido: `AuthContext` (usuarios, sesión, roles), `ProductosContext`, `CategoriasContext`, `CarritoContext` |
| `types/` | Interfaces y tipos (`Usuario`, `Rol`, `Producto`, `ItemCarrito`, `Resultado`...) |
| `utils/` | Validaciones, permisos por rol, formato de precios y lectura/escritura en `localStorage` |
| `data/` | Datos iniciales (productos, categorías, usuarios de demostración) y enlaces del menú por rol |

## 3. Decisiones principales

- **Un formulario para varias situaciones.** `FormularioUsuario` se usa en el registro, la administración, la
  creación de clientes por el vendedor y el perfil. Una prop `modo` decide qué campos y reglas aplica.
  Lo mismo con `CampoTexto` y `CampoSelect`, que evitan repetir etiquetas e inputs.
- **Roles.** `Rol` es un tipo (`administrador | vendedor | cliente`). El menú se arma con `enlacesPorRol`,
  las rutas se protegen con `RutaProtegida` y cada contexto verifica el rol antes de modificar datos.
- **Solo `useState`.** El estado se guarda en `localStorage` dentro de cada operación (`utils/almacenamiento.ts`),
  sin hooks personalizados ni `useEffect`.
- **Carrito coherente.** Solo se guarda `{id, cantidad}`; nombre, precio y stock se toman del producto actual.
  Así, si el administrador cambia un precio o el vendedor el stock, el carrito lo refleja. Si un producto se
  elimina, desaparece del carrito, y al comprar se revisa de nuevo el stock.
- **Categorías dinámicas.** Al renombrar una categoría sus productos la siguen; no se puede eliminar una
  categoría que tenga productos.
- **Datos derivados.** El usuario de la sesión se busca por id en la lista de usuarios, y la edad se calcula
  desde la fecha de nacimiento (no se guarda).

## 4. Alcance y limitaciones

Es una simulación académica solo frontend: los roles y las contraseñas guardadas en `localStorage` no
constituyen un sistema de seguridad real.
