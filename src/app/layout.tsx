import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500"], style: ["italic", "normal"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosmet.vercel.app"),
  title: { default: "Cosmet — Belleza de lujo en Bolivia desde 1975", template: "%s · Cosmet" },
  description:
    "Fragancias, maquillaje y tratamiento de Chanel, Dior, Guerlain, Sisley, Creed y más de 60 casas de lujo. Envío gratis desde $50 · Santa Cruz, La Paz y Cochabamba.",
  openGraph: { type: "website", locale: "es_BO", siteName: "Cosmet", images: ["/media/banners/chanel-wide.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen">
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <ChatWidget />
      </body>
    </html>
  );
}
