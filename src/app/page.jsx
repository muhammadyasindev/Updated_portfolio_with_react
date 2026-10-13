export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { getProjects, getSettings } from "@/lib/data";
import {
  heroBadges as defaultHeroBadges,
  highlights,
  processSteps,
  services,
  skillGroups as defaultSkillGroups,
} from "@/content/site";

const marqueeItems = ["React", "Next.js", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "Tailwind CSS", "JavaScript", "REST APIs", "Drizzle ORM", "Git", "Vercel", "Docker"];

const defaultGallery = [
  { src: "/images/project-dukaanos.png", alt: "DukaanOS dashboard interface", caption: "Dashboards that simplify daily operations" },
  { src: "/images/gallery-1.jpg", alt: "Hands typing code on a keyboard", caption: "Clean, maintainable code" },
  { src: "/images/gallery-2.jpg", alt: "Wireframes and user flows on a whiteboard", caption: "Planning the user experience" },
  { src: "/images/about-desk.jpg", alt: "Laptop with code on a desk", caption: "Focused development" },
  { src: "/images/project-store.png", alt: "E-commerce storefront", caption: "Storefronts that sell" },
];

function getSocialFaIcon(label, customIcon) {
  const l = (label || "").toLowerCase();
  if (l.includes("github")) return "fa-brands fa-github";
  if (l.includes("linkedin")) return "fa-brands fa-linkedin-in";
  if (l.includes("whatsapp")) return "fa-brands fa-whatsapp";
  if (customIcon && (customIcon.includes("fa-") || customIcon.includes("fa "))) return customIcon;
  return "fa-solid fa-link";
}

function normalizeFaIcon(icon) {
  if (!icon) return "fa-solid fa-code";
  const trimmed = String(icon).trim();
  if (
    trimmed.startsWith("fa-solid ") ||
    trimmed.startsWith("fa-brands ") ||
    trimmed.startsWith("fa-regular ") ||
    trimmed.startsWith("fa-light ") ||
    trimmed.startsWith("fas ") ||
    trimmed.startsWith("fab ") ||
    trimmed.startsWith("far ") ||
    trimmed.startsWith("fa ")
  ) {
    return trimmed;
  }
  const brandKeywords = [
    "react", "node", "js", "javascript", "html", "html5", "css", "css3", "sass",
    "github", "linkedin", "whatsapp", "git", "vue", "angular", "python", "docker",
    "figma", "aws", "bootstrap", "npm", "yarn", "linux", "apple", "google", "twitter", "x-twitter"
  ];
  const clean = trimmed.toLowerCase().replace(/^fa-/, "");
  const isBrand = brandKeywords.some((b) => clean.includes(b));
  if (trimmed.startsWith("fa-")) {
    return isBrand ? `fa-brands ${trimmed}` : `fa-solid ${trimmed}`;
  }
  if (clean.length > 0 && !["◈", "⬢", "⛁", "◆"].includes(trimmed)) {
    return isBrand ? `fa-brands fa-${clean}` : `fa-solid fa-${clean}`;
  }
  return "fa-solid fa-code";
}

function renderSkillIcon(icon) {
  if (!icon) return <i className="fa-solid fa-code"></i>;
  const fa = normalizeFaIcon(icon);
  return <i className={fa}></i>;
}

function getSkillItemDetails(item) {
  if (!item) return { icon: null, label: "" };
  const str = String(item).trim();
  const match = str.match(/^(fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*)\s+(.+)$/i);
  if (match) {
    return { icon: normalizeFaIcon(match[1]), label: match[2] };
  }
  const lower = str.toLowerCase();
  let faClass = null;
  if (lower.includes("react")) faClass = "fa-brands fa-react text-[#38bdf8]";
  else if (lower.includes("node")) faClass = "fa-brands fa-node-js text-[#4ade80]";
  else if (lower.includes("javascript") || lower === "js") faClass = "fa-brands fa-js text-[#facc15]";
  else if (lower.includes("html")) faClass = "fa-brands fa-html5 text-[#fb923c]";
  else if (lower.includes("css")) faClass = "fa-brands fa-css3-alt text-[#60a5fa]";
  else if (lower.includes("sass")) faClass = "fa-brands fa-sass text-[#f472b6]";
  else if (lower.includes("python")) faClass = "fa-brands fa-python text-[#fde047]";
  else if (lower.includes("docker")) faClass = "fa-brands fa-docker text-[#22d3ee]";
  else if (lower.includes("git") && !lower.includes("digital")) faClass = "fa-brands fa-git-alt text-[#fb923c]";
  else if (lower.includes("github")) faClass = "fa-brands fa-github text-white";
  else if (lower.includes("figma")) faClass = "fa-brands fa-figma text-[#c084fc]";
  else if (lower.includes("aws")) faClass = "fa-brands fa-aws text-[#f59e0b]";
  else if (lower.includes("database") || lower.includes("sql") || lower.includes("mongo")) faClass = "fa-solid fa-database text-[#fb7185]";
  else if (lower.includes("api") || lower.includes("server")) faClass = "fa-solid fa-server text-[#818cf8]";
  else if (lower.includes("terminal") || lower.includes("bash") || lower.includes("linux")) faClass = "fa-solid fa-terminal text-[#34d399]";
  else if (lower.includes("jwt") || lower.includes("auth")) faClass = "fa-solid fa-shield-halved text-[#10b981]";
  return { icon: faClass, label: str };
}

export default async function HomePage() {
  const [projects, profile] = await Promise.all([getProjects(), getSettings()]);

  const heroBadges = profile.heroBadges || defaultHeroBadges;
  const skillGroups = profile.skillGroups || defaultSkillGroups;
  const gallery = profile.gallery || defaultGallery;

  const aboutParagraphs = Array.isArray(profile.about)
    ? profile.about
    : typeof profile.about === "string"
    ? profile.about.split("\n\n").filter(Boolean)
    : [];

  return (
    <>
      {/* HERO */}
      <section id="home" className="relative overflow-hidden px-5 pb-16 pt-28 sm:pt-32">
        <div className="glow left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[#e11d48]/35" />
        <div className="glow right-[-8%] top-[10%] h-[360px] w-[360px] bg-[#f97316]/20" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            {profile.available && (
              <span className="chip inline-flex items-center gap-2">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available for freelance work
              </span>
            )}
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Hi, I&apos;m {profile.name}
              <span className="mt-2 block gradient-text">{profile.title}</span>
            </h1>
            <p className="muted mt-5 max-w-xl text-base leading-relaxed">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#contact" className="btn-primary px-6 py-3 text-sm font-medium">Let&apos;s Work Together →</Link>
              <Link href="#projects" className="btn-ghost px-6 py-3 text-sm font-medium">Explore My Projects</Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-2">
              {heroBadges.map((b) => (<li key={b} className="chip px-3 py-1.5">{b}</li>))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <div aria-hidden className="spin-slow absolute inset-0 rounded-full border border-dashed border-[#e11d48]/40" />
              <div aria-hidden className="absolute inset-6 rounded-full bg-gradient-to-br from-[#e11d48]/30 to-[#f97316]/10 blur-2xl" />
              <div className="absolute inset-8 overflow-hidden rounded-full border border-[color:var(--border)] bg-black/40">
                <Image
                  src={profile.heroImage || "/images/hero-dev.jpg"}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="float glass absolute -left-2 top-10 rounded-xl border border-[color:var(--border)] px-4 py-3 font-mono text-xs">
                <span className="text-[#fb7185]">const</span> stack = [<span className="text-[#f97316]">&quot;Next.js&quot;</span>]
              </div>
              <div className="float-delay glass absolute -right-2 bottom-12 rounded-xl border border-[color:var(--border)] px-4 py-3 text-xs">
                <p className="font-semibold">Ideas → Products</p>
                <p className="muted">Clean, scalable code</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INFINITE TECH MARQUEE */}
      <section aria-label="Technologies" className="border-y border-[color:var(--border)] py-5">
        <div className="marquee-wrap">
          <ul className="marquee gap-3">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <li key={i} aria-hidden={i >= marqueeItems.length} className="chip flex items-center gap-2 px-4 py-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#f97316]" />{t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_2fr]">
          <Reveal>
            <SectionHeading eyebrow="My Tech Stack" title="Technologies I work with">
              The core tools and frameworks I use to build fast, secure and scalable applications.
            </SectionHeading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title || i} delay={i * 80} className="h-full">
                <div className={`card h-full bg-gradient-to-b ${group.accent || "from-sky-500/20 to-sky-500/0"} p-5`}>
                  <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--border)] text-lg text-[#fb7185]">
                    {renderSkillIcon(group.icon)}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{group.title}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.items?.map((item, itemIdx) => {
                      const { icon, label } = getSkillItemDetails(item);
                      return (
                        <li key={itemIdx} className="chip inline-flex items-center gap-1.5 text-xs">
                          {icon && <i className={icon} aria-hidden="true"></i>}
                          <span>{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="My Work" title="Featured projects">
                Real applications built to solve practical business problems.
              </SectionHeading>
              <Link href="/projects" className="btn-ghost px-4 py-2 text-sm">
                View all projects →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 6).map((project, i) => (
              <Reveal key={project.slug} delay={i * 90} className="h-full">
                <ProjectCard project={project} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_2fr]">
          <Reveal>
            <SectionHeading eyebrow="What I Offer" title="Services">
              Professional web development services to help you build, improve and scale your digital presence.
            </SectionHeading>
            <Link href="#contact" className="btn-primary mt-6 inline-block px-5 py-2.5 text-sm font-medium">
              Get in touch →
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 70} className="h-full">
                <div className="card h-full p-5">
                  <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--border)] text-base text-[#fb7185]">
                    {service.icon}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{service.title}</h3>
                  <p className="muted mt-2 text-sm leading-relaxed">{service.description}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#fb7185]/90">{service.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          <Reveal>
            <SectionHeading eyebrow="About Me" title="A developer focused on useful software" />
            {aboutParagraphs.map((p, idx) => (
              <p key={idx} className="muted mt-4 text-sm leading-relaxed">{p}</p>
            ))}
          </Reveal>

          <Reveal delay={90}>
            <ul className="grid gap-3">
              {highlights.map((h) => (
                <li key={h.title} className="card flex gap-3 p-4">
                  <span aria-hidden className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[color:var(--border)] text-xs text-[#f97316]">
                    ✦
                  </span>
                  <div>
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="muted text-sm">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/40">
              <Image
                src={profile.aboutImage || "/images/about-desk.jpg"}
                alt="A developer focused on useful software"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section aria-labelledby="gallery-title" className="border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-medium text-[#fb7185]">Behind the Code</p>
            <h2 id="gallery-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">From idea to interface</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-3">
            {gallery.map((g, i) => (
              <Reveal key={g.src || i} delay={i * 80} className={`h-full ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <figure className="group relative h-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/40">
                  <Image
                    src={g.src}
                    alt={g.alt || "Gallery image"}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm font-medium text-white">
                    {g.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-[color:var(--border)] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="My Process" title="How I work">
              A simple, transparent process that turns an idea into a working product.
            </SectionHeading>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal key={step.no} delay={i * 70} className="h-full">
                <li className="card h-full list-none p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#e11d48] to-[#f97316] text-xs font-semibold text-white">
                    {step.no}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="muted mt-1.5 text-sm leading-relaxed">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden border-t border-[color:var(--border)] px-5 py-20">
        <div className="glow bottom-[-20%] left-[20%] h-[360px] w-[360px] bg-[#e11d48]/30" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <SectionHeading eyebrow="Get In Touch" title="Let's build something great">
              Have a project in mind, or just want to say hello? Tell me what you&apos;re trying to build and I&apos;ll
              reply with honest next steps.
            </SectionHeading>

            <ul className="mt-7 grid gap-3">
              <li className="card flex items-center gap-3 p-4">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--border)]">✉</span>
                <div>
                  <p className="muted text-xs">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-sm hover:underline font-medium">{profile.email}</a>
                </div>
              </li>
              {profile.whatsapp && (
                <li className="card flex items-center gap-3 p-4 border-emerald-500/30">
                  <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-500/40 text-emerald-400 font-bold text-base">
                    <i className="fa-brands fa-whatsapp"></i>
                  </span>
                  <div>
                    <p className="muted text-xs">WhatsApp</p>
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "92")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm hover:underline font-medium text-emerald-400"
                    >
                      {profile.whatsapp} (Chat on WhatsApp ↗)
                    </a>
                  </div>
                </li>
              )}
              <li className="card flex items-center gap-3 p-4">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--border)]">◎</span>
                <div>
                  <p className="muted text-xs">Location</p>
                  <p className="text-sm">{profile.location}</p>
                </div>
              </li>
            </ul>

            {/* Red Social Badges with FontAwesome Icons */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {profile.socials?.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-white text-base shadow-lg shadow-[#e11d48]/30 border border-rose-400/30 hover:scale-110 transition-all"
                >
                  <i className={getSocialFaIcon(s.label, s.icon)}></i>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
