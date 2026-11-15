import type { Metadata } from "next";
import CartPage from "@/components/CartPage";
export const metadata: Metadata = { title: "Tu bolsa" };
export default function Page() {
  return <CartPage />;
}
