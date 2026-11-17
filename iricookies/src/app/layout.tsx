import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Pinyon_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Motion from "@/components/Motion";
import WhatsAppFab from "@/components/WhatsAppFab";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});
const script = Pinyon_Script({ variable: "--font-script", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iricookies.vercel.app"),
  title: { default: "IriCookies — Good fillings · Cookies caseras en Santa Cruz", template: "%s · IriCookies" },
  description:
    "Cookies caseras, gorditas y rellenas, horneadas en Santa Cruz, Bolivia. Chocolate Chip, Red Velvet, Biscoff, Nutella y más. Arma tu caja de 6 o 12 y pide por WhatsApp. Delivery o pickup.",
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: "IriCookies",
    images: ["/img/hero-trio.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#0b090a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${script.variable}`}>
      <head>
        {/* Marks JS as available before paint so reveal animations never flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">
        <SmoothScroll />
        <Motion />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
