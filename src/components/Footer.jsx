import Link from "next/link";
import { navLinks, profile as defaultProfile, services } from "@/content/site";

function getSocialFaIcon(label, customIcon) {
  const l = (label || "").toLowerCase();
  if (l.includes("github")) return "fa-brands fa-github";
  if (l.includes("linkedin")) return "fa-brands fa-linkedin-in";
  if (l.includes("whatsapp")) return "fa-brands fa-whatsapp";
  if (customIcon && (customIcon.includes("fa-") || customIcon.includes("fa "))) return customIcon;
  return "fa-solid fa-link";
}

export default function Footer({ profile: propProfile }) {
  const profile = propProfile || defaultProfile;

  return (
    <footer className="relative border-t border-[color:var(--border)] bg-[color:var(--bg-soft)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e11d48] to-transparent" />

      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Have a project in mind?</h2>
            <p className="muted mt-1 text-sm">Let&apos;s turn it into a fast, reliable product.</p>
          </div>
          <Link href="/#contact" className="btn-primary px-6 py-3 text-sm font-medium">Start a conversation →</Link>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/#home" className="inline-flex items-center gap-2.5">
              {profile.logoType === "image" && profile.logoImage ? (
                <img
                  src={profile.logoImage}
                  alt={profile.name}
                  className="h-9 w-9 rounded-xl object-contain border border-[color:var(--border)]"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#e11d48] to-[#f97316] text-sm font-bold text-white">
                  {profile.initials || "YB"}
                </span>
              )}
              <span className="font-semibold">{profile.name}</span>
            </Link>
            <p className="muted mt-4 text-sm leading-relaxed">
              {profile.title} building modern web applications for businesses and startups.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="muted transition-colors hover:text-[#fb7185]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {services.slice(0, 5).map((s) => (
                <li key={s.title} className="muted">{s.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <a href={`mailto:${profile.email}`} className="muted break-all hover:text-[#fb7185]">
                  {profile.email}
                </a>
              </li>
              {profile.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "92")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="muted hover:text-[#25D366] flex items-center gap-1.5"
                  >
                    <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                    <span>{profile.whatsapp}</span>
                  </a>
                </li>
              )}
              <li className="muted">{profile.location}</li>
            </ul>

            {/* Social Icons - Red badges with FontAwesome icons */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {profile.socials?.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  title={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-white text-base shadow-lg shadow-[#e11d48]/30 border border-rose-400/30 hover:scale-110 hover:from-[#be123c] hover:to-[#e11d48] transition-all"
                >
                  <i className={getSocialFaIcon(s.label, s.icon)}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Secret link on yasin sasoli */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--border)] pt-6 text-xs sm:flex-row">
          <p className="muted">
            © {new Date().getFullYear()}{" "}
            <Link
              href="/admin"
              className="font-medium text-[color:var(--fg)] hover:text-[#fb7185] transition-colors"
            >
              {profile.copyrightName || "yasin sasoli"}
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
