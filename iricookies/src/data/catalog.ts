// Source of truth: "IriCookies — El menú (Octubre)" (Google Drive) + @iri_cookies bio.
// Update prices/flavours here and the whole site follows.

export const BRAND = {
  name: "IriCookies",
  tagline: "good fillings",
  whatsapp: "59169078820",
  whatsappDisplay: "+591 690 78820",
  instagram: "iri_cookies",
  founder: "irina.quintanilla",
  city: "Santa Cruz, Bolivia",
  service: "Delivery o pickup",
} as const;

export type Category = "clasica" | "premium" | "fit" | "especial";

export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number | null; // null = consultar
  category: Category;
  img: string;
  tone: string; // accent behind the cookie
  badge?: string;
  soon?: boolean;
  boxable?: boolean; // can go inside a 6/12 box
};

export const PRICES = {
  single: 15,
  box6: 87,
  box12: 168,
  premiumSurcharge: 5,
} as const;

export const products: Product[] = [
  {
    slug: "chocolate-chip",
    name: "Chocolate Chip",
    description: "La clásica con chispas de chocolate.",
    price: 15,
    category: "clasica",
    img: "/img/chocolate-chip.webp",
    tone: "#F6D9C4",
    badge: "La clásica",
    boxable: true,
  },
  {
    slug: "red-velvet",
    name: "Red Velvet",
    description: "Masa roja y un centro suave y cremoso.",
    price: 15,
    category: "clasica",
    img: "/img/red-velvet.webp",
    tone: "#F3C1C8",
    boxable: true,
  },
  {
    slug: "cookies-and-cream",
    name: "Cookies & Cream",
    description: "Con trocitos de galletas de cacao y crema.",
    price: 15,
    category: "clasica",
    img: "/img/cookies-and-cream.webp",
    tone: "#EADFD8",
    boxable: true,
  },
  {
    slug: "smores",
    name: "S’mores",
    description: "Chocolate y mini marshmallows tostados.",
    price: 15,
    category: "clasica",
    img: "/img/smores.webp",
    tone: "#F7E3CF",
    boxable: true,
  },
  {
    slug: "double-chocolate",
    name: "Double Chocolate",
    description: "Un favorito para amantes del chocolate.",
    price: 15,
    category: "clasica",
    img: "/img/double-chocolate.webp",
    tone: "#E7CFC6",
    boxable: true,
  },
  {
    slug: "nido",
    name: "Nido",
    description: "Con el sabor de leche Nido y su cobertura en polvo.",
    price: 15,
    category: "clasica",
    img: "/img/nido.webp",
    tone: "#FBEAD9",
    boxable: true,
  },
  {
    slug: "salted-caramel",
    name: "Salted Caramel",
    description: "El encuentro del caramelo y un toque salado.",
    price: 15,
    category: "clasica",
    img: "/img/salted-caramel.webp",
    tone: "#F5D6BC",
    boxable: true,
  },
  {
    slug: "cinnabon",
    name: "Cinnabon",
    description: "Nuestro nuevo sabor inspirado en la canela.",
    price: null,
    category: "clasica",
    img: "",
    tone: "#F9E4E8",
    soon: true,
  },
  {
    slug: "lotus-biscoff",
    name: "Lotus Biscoff",
    description: "El toque caramelizado de Biscoff, con trozos de galleta y chips de chocolate blanco.",
    price: 20,
    category: "premium",
    img: "/img/lotus-biscoff.webp",
    tone: "#F2C9A8",
    badge: "Premium",
    boxable: true,
  },
  {
    slug: "nutella",
    name: "Nutella",
    description: "Una favorita para quienes aman el sabor de Nutella y el chocolate.",
    price: 20,
    category: "premium",
    img: "/img/nutella.webp",
    tone: "#E9C3B3",
    badge: "Premium",
    boxable: true,
  },
  {
    slug: "fit-double-chocolate",
    name: "Double Chocolate Fit",
    description: "Todo el antojo, a tu manera. Consulta los ingredientes al hacer tu pedido.",
    price: 22,
    category: "fit",
    img: "/img/fit-double-chocolate.webp",
    tone: "#E2CFC9",
    badge: "Fit",
  },
  {
    slug: "fit-chocolate-chip",
    name: "Chocolate Chip Fit",
    description: "La clásica, en versión fit. Consulta los ingredientes al hacer tu pedido.",
    price: 20,
    category: "fit",
    img: "/img/fit-chocolate-chip.webp",
    tone: "#F1DCCB",
    badge: "Fit",
  },
  {
    slug: "bake-your-own",
    name: "Bake your own · Choco-chips",
    description:
      "Lleva Bake-your-own a tu cocina y disfruta la experiencia de hornear tus propias choco-chips. También es un detalle para regalar a alguien que ama las cookies.",
    price: 95,
    category: "especial",
    img: "/img/bake-your-own.webp",
    tone: "#F4C6D1",
    badge: "Para hornear en casa",
  },
  {
    slug: "cookie-pie",
    name: "Cookie Pie · S’mores & Nutella",
    description:
      "Lo mejor está adentro: cookie, Nutella y mini marshmallows tostados. Para compartir, regalar o disfrutar a cucharadas. Calienta 25 seg en el microondas.",
    price: 65,
    category: "especial",
    img: "/img/cookie-pie.webp",
    tone: "#F9E4E8",
    badge: "Para compartir",
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const boxable = products.filter((p) => p.boxable);
export const classics = products.filter((p) => p.category === "clasica");
export const premiums = products.filter((p) => p.category === "premium");
export const fits = products.filter((p) => p.category === "fit");
export const specials = products.filter((p) => p.category === "especial");

export const pinkEdition = {
  title: "Pink IriCookies",
  note: "Por cada pack de 3 Pink IriCookies, donamos el 10% al área oncológica.",
  items: [
    { name: "Corazón valiente", description: "Birthday cake cookie con cobertura rosa." },
    { name: "Sueños de rosa", description: "Cookie de s’mores con base rosa y mini marshmallows tostados." },
    { name: "Dulce esperanza", description: "Cookie de Nido de la campaña de octubre." },
  ],
  img: "/img/pink-trio.webp",
};

export const faqs = [
  {
    q: "¿Cómo hago mi pedido?",
    a: "Arma tu bolsa en la web y envíala por WhatsApp con un clic. Te confirmamos disponibilidad, horario y forma de pago por el mismo chat.",
  },
  {
    q: "¿Hacen delivery?",
    a: "Sí. Entregamos por delivery o puedes recoger tu pedido (pickup) en Santa Cruz de la Sierra. Coordinamos la entrega contigo por WhatsApp.",
  },
  {
    q: "¿Cuánto cuestan las cajas?",
    a: "Cada cookie clásica cuesta 15 Bs. La caja de 6 cuesta 87 Bs y la de 12, 168 Bs. Biscoff y Nutella suman +5 Bs por cada cookie premium dentro de tu caja.",
  },
  {
    q: "¿Puedo mezclar sabores en una caja?",
    a: "¡Claro! Esa es la idea de Build your box: eliges el tamaño y los sabores que quieras, en la combinación que quieras.",
  },
  {
    q: "¿Qué tienen las cookies Fit?",
    a: "Son nuestra versión fit de Double Chocolate y Chocolate Chip. Consulta los ingredientes al hacer tu pedido y te contamos todo.",
  },
  {
    q: "¿Cómo alquilo el carrito de IriCookies?",
    a: "Cuéntanos la fecha, el lugar y el tipo de evento desde la sección Eventos. Te escribimos para confirmar disponibilidad y cotizar el alquiler.",
  },
];
