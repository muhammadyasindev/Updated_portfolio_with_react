export const dynamic = "force-dynamic";

import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { getProjects } from "@/lib/data";

export const metadata = {
  title: "Projects",
  description: "Selected full-stack projects: shop management, e-commerce and web applications.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:pt-32">
      <SectionHeading eyebrow="My Work" title="All projects">
        Each project below solves a concrete problem. Open a case study to see the stack, features and my role.
      </SectionHeading>

      {projects.length === 0 ? (
        <p className="muted mt-10">No projects published yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 2} />
          ))}
        </div>
      )}
    </section>
  );
}
