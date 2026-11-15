import type { Metadata } from "next";
import Checkout from "@/components/Checkout";
export const metadata: Metadata = { title: "Finalizar compra" };
export default function Page() {
  return <Checkout />;
}
