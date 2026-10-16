import type { Producto } from "../types/Producto";

export const productosIniciales: Producto[] = [
  {
    id: "prod-1",
    nombre: "Guitarra Eléctrica Fender Player Stratocaster",
    categoria: "Guitarras",
    precio: 799900,
    precioOferta: 749900,
    stock: 5,
    imagen: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=500",
    descripcion:
      "Guitarra eléctrica legendaria con cuerpo de aliso, mástil de arce y 3 cápsulas single-coil.",
  },
  {
    id: "prod-2",
    nombre: "Bajo Eléctrico Ibanez SR300E",
    categoria: "Bajos",
    precio: 420000,
    precioOferta: null,
    stock: 3,
    imagen: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500",
    descripcion:
      "Bajo eléctrico de 4 cuerdas, cuerpo ligero, mástil cómodo de 5 piezas de arce/nogal.",
  },
  {
    id: "prod-3",
    nombre: "Batería Acústica Pearl Export EXX",
    categoria: "Baterías",
    precio: 890000,
    precioOferta: 820000,
    stock: 2,
    imagen: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500",
    descripcion:
      "Batería completa de 5 piezas construida en álamo y caoba asiática con herrajes de alta durabilidad.",
  },
  {
    id: "prod-4",
    nombre: "Teclado Sintetizador Yamaha PSR-E373",
    categoria: "Teclados",
    precio: 260000,
    precioOferta: null,
    stock: 8,
    imagen: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500",
    descripcion:
      "Teclado portátil de 61 teclas sensibles a la pulsación, con 622 voces de alta calidad.",
  },
  {
    id: "prod-5",
    nombre: "Amplificador de Guitarra Boss Katana 50 MkII",
    categoria: "Amplificadores",
    precio: 310000,
    precioOferta: 289900,
    stock: 4,
    imagen: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=500",
    descripcion:
      "Amplificador combo de 50W con parlante de 12 pulgadas y múltiples efectos integrados BOSS.",
  },
  {
    id: "prod-6",
    nombre: "Micrófono Dinámico Shure SM58",
    categoria: "Micrófonos",
    precio: 125000,
    precioOferta: null,
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500",
    descripcion:
      "El micrófono dinámico para voz más popular del mundo. Respuesta de frecuencia optimizada.",
  },
  {
    id: "prod-7",
    nombre: "Pedal de Efecto Distortion Boss DS-1",
    categoria: "Pedales",
    precio: 65000,
    precioOferta: 58000,
    stock: 10,
    imagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
    descripcion:
      "Pedal clásico de distorsión utilizado por guitarristas icónicos en todo el mundo.",
  },
  {
    id: "prod-8",
    nombre: "Guitarra Acústica Taylor GS Mini",
    categoria: "Guitarras",
    precio: 690000,
    precioOferta: null,
    stock: 2,
    imagen: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
    descripcion:
      "Guitarra acústica de tamaño compacto pero sonido potente y cálido, tapa de abeto macizo.",
  },
  {
    id: "prod-9",
    nombre: "Audífonos de Estudio Audio-Technica ATH-M50x",
    categoria: "Accesorios",
    precio: 169000,
    precioOferta: 149900,
    stock: 6,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    descripcion:
      "Audífonos profesionales de monitoreo con respuesta precisa y aislamiento pasivo de sonido.",
  },
  {
    id: "prod-10",
    nombre: "Interfaz de Audio Focusrite Scarlett 2i2 4th Gen",
    categoria: "Accesorios",
    precio: 210000,
    precioOferta: null,
    stock: 0, // sin stock para probar el estado AGOTADO
    imagen: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500",
    descripcion:
      "Interfaz de audio USB de 2 entradas / 2 salidas con preamplificadores de ultra bajo ruido.",
  },
];
