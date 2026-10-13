"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, profile as defaultProfile } from "@/content/site";

function Logo({ profile }) {
  return (
    <Link href="/#home" className="flex items-center gap-2.5" aria-label={`${profile.name} — home`}>
      {profile.logoType === "image" && profile.logoImage ? (
        <img
          src={profile.logoImage}
          alt={profile.name}
          className="h-9 w-9 rounded-xl object-contain border border-[color:var(--border)]"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#e11d48] to-[#f97316] text-sm font-bold text-white shadow-sm">
          {profile.initials || "YB"}
        </span>
      )}
      <span className="text-[15px] font-semibold tracking-tight">{profile.name}</span>
    </Link>
  );
}

export default function Nav({ profile: propProfile }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState(propProfile || defaultProfile);

  // Sync latest profile if client fetched
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setProfile(data.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme") ?? "dark";
    document.documentElement.classList.toggle("light", stored === "light");
    if (stored !== "dark") {
      requestAnimationFrame(() => setTheme(stored));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.split("#")[1]);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-[0_10px_30px_-20px_rgba(0,0,0,.8)]" : ""}`}>
      <div aria-hidden className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-[#e11d48] to-[#f97316]" style={{ width: `${progress}%` }} />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo profile={profile} />

        <ul className="hidden items-center gap-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] p-1 lg:flex">
          {navLinks.map((link) => {
            const id = link.href.split("#")[1];
            const isActive = active === id;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative block rounded-full px-4 py-1.5 text-sm transition-colors ${
                    isActive ? "bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white shadow-[0_6px_20px_-8px_rgba(225,29,72,.9)]" : "muted hover:text-[color:var(--fg)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="btn-ghost grid h-9 w-9 place-items-center text-sm"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <Link href="/#contact" className="btn-primary hidden px-4 py-2 text-sm font-medium sm:inline-block">
            Let&apos;s Talk
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="btn-ghost grid h-9 w-9 place-items-center lg:hidden"
          >
            <span className="text-base leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="glass lg:hidden">
          <ul className="mx-auto max-w-6xl px-5 pb-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[color:var(--border)] py-3 text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="btn-primary block px-4 py-2.5 text-center text-sm font-medium"
              >
                Let&apos;s Talk
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
