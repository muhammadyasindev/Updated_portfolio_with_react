import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="gradient-text text-6xl font-semibold">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
      <p className="muted mt-3 text-sm">The link may be broken or the page may have moved.</p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className="btn-primary px-5 py-2.5 text-sm font-medium">Back home</Link>
        <Link href="/projects" className="btn-ghost px-5 py-2.5 text-sm">See projects</Link>
      </div>
    </section>
  );
}
