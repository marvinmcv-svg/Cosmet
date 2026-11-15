import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6 pt-24 text-center" data-nav="light">
      <p className="eyebrow text-smoke">404</p>
      <h1 className="display mt-4 text-6xl md:text-8xl">
        No encontramos <span className="serif-italic font-normal">esta página.</span>
      </h1>
      <Link href="/tienda" className="btn btn-dark mt-10">Ir a la tienda</Link>
    </div>
  );
}
