import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project, priority = false }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[color:var(--border)]">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.category} interface preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
        <p className="muted text-sm">{project.category}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">{tech}</li>
          ))}
        </ul>

        <p className="muted mt-3 text-sm leading-relaxed">{project.summary}</p>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm">
          <Link href={`/projects/${project.slug}`} className="font-medium text-[#fb7185] hover:underline">
            Case study →
          </Link>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer noopener" className="muted hover:text-[color:var(--fg)]">
              Live demo ↗
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer noopener" className="muted hover:text-[color:var(--fg)]">
              Source ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
