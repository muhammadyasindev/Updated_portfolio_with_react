import { projects } from "@/content/site";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/projects`, priority: 0.8 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, priority: 0.6 })),
  ];
}
