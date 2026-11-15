import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
export const metadata: Metadata = { title: "Trabaja con nosotros" };
export default function Page() {
  return (
    <LegalPage
      doc="empleo"
      intro={
        <a href="mailto:rrhh@cosmet.com.bo?subject=Postulación" className="btn btn-dark mt-10">
          Enviar CV a rrhh@cosmet.com.bo
        </a>
      }
    />
  );
}
