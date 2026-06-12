import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-background">
      <section className="container-page flex min-h-screen flex-col items-start justify-center py-24">
        <p className="eyebrow">Página no encontrada</p>
        <h1 className="mt-5 max-w-2xl text-5xl font-semibold text-brand-primary sm:text-6xl">Este demo no existe o fue movido.</h1>
        <p className="mt-6 max-w-xl text-lg text-brand-muted">Regresa al índice de demos para revisar las landing pages disponibles por nicho.</p>
        <Link href="/demos" className="focus-ring mt-8 inline-flex rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Ver demos</Link>
      </section>
    </main>
  );
}
