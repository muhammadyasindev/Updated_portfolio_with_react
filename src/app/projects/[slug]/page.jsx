export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: project.name, description: project.summary, images: [project.image] },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-5 pb-20 pt-28 sm:pt-32">
      <Link href="/projects" className="muted text-sm hover:text-[color:var(--fg)]">← Back to projects</Link>

      <p className="mt-6 text-sm font-medium text-[#fb7185]">{project.category}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{project.name}</h1>
      <p className="muted mt-4 max-w-2xl leading-relaxed">{project.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack?.map((t) => (
          <li key={t} className="chip">{t}</li>
        ))}
      </ul>

      <div className="relative mt-9 aspect-[16/10] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/40">
        <Image
          src={project.image || "/images/project-placeholder.png"}
          alt={`${project.name} interface preview`}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-semibold">The problem</h2>
          <p className="muted mt-2 text-sm leading-relaxed">{project.problem || "Information not specified."}</p>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold">My contribution</h2>
          <p className="muted mt-2 text-sm leading-relaxed">{project.contribution || "Information not specified."}</p>
        </section>
      </div>

      {project.features && project.features.length > 0 && (
        <section className="card mt-6 p-5">
          <h2 className="text-lg font-semibold">Key features</h2>
          <ul className="muted mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden className="text-[#f97316]">▸</span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noreferrer noopener" className="btn-primary px-5 py-2.5 text-sm font-medium">
            Live demo ↗
          </a>
        ) : (
          <p className="muted text-sm">A public live demo isn&apos;t available for this project.</p>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer noopener" className="btn-ghost px-5 py-2.5 text-sm">
            View source ↗
          </a>
        )}
        <Link href="/#contact" className="btn-ghost px-5 py-2.5 text-sm">Discuss a similar project</Link>
      </div>
    </article>
  );
}
