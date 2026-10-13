import fs from "fs/promises";
import path from "path";
import crypto from "crypto";


const DEFAULT_SETTINGS = {
  name: "Yasin Baloch",
  copyrightName: "yasin sasoli",
  initials: "YB",
  title: "Full-Stack Developer",
  available: true,
  email: "devlonictechnologies186@gmil.com",
  whatsapp: "03324042186",
  location: "Pakistan",
  logoType: "initials", // "initials" | "image"
  logoImage: "",
  heroImage: "/images/hero-dev.jpg",
  aboutImage: "/images/about-desk.jpg",
  gallery: [
    { src: "/images/project-dukaanos.png", alt: "DukaanOS dashboard interface", caption: "Dashboards that simplify daily operations" },
    { src: "/images/gallery-1.jpg", alt: "Hands typing code on a keyboard", caption: "Clean, maintainable code" },
    { src: "/images/gallery-2.jpg", alt: "Wireframes and user flows on a whiteboard", caption: "Planning the user experience" },
    { src: "/images/about-desk.jpg", alt: "Laptop with code on a desk", caption: "Focused development" },
    { src: "/images/project-store.png", alt: "E-commerce storefront", caption: "Storefronts that sell" },
  ],
  heroBadges: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind", "Git"],
  skillGroups: [
    {
      title: "Frontend",
      icon: "fa-brands fa-react",
      accent: "from-sky-500/20 to-sky-500/0",
      items: ["React", "Next.js", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
    },
    {
      title: "Backend",
      icon: "fa-solid fa-server",
      accent: "from-emerald-500/20 to-emerald-500/0",
      items: ["Node.js", "Express.js", "REST APIs", "JWT Auth"],
    },
    {
      title: "Databases",
      icon: "fa-solid fa-database",
      accent: "from-violet-500/20 to-violet-500/0",
      items: ["MongoDB", "PostgreSQL", "SQLite", "Drizzle ORM"],
    },
    {
      title: "Tools & Deployment",
      icon: "fa-solid fa-screwdriver-wrench",
      accent: "from-amber-500/20 to-amber-500/0",
      items: ["Git", "GitHub", "Vercel", "VS Code", "Docker"],
    },
  ],
  intro:
    "I build modern, fast and scalable web applications that help businesses grow. I turn ideas into real products with clean code and great user experiences.",
  about: [
    "I'm a full-stack developer who loves building useful and scalable web applications. I enjoy solving problems, writing clean code and learning new technologies.",
    "I focus on creating solutions that are not only functional but also simple, fast and easy to use.",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "WhatsApp", href: "https://wa.me/923324042186", icon: "whatsapp" },
  ],
  adminPin: "Yasin123#",
};

const DEFAULT_PROJECTS = [
  {
    slug: "dukaanos",
    name: "DukaanOS",
    category: "Offline Shop Management System",
    image: "/images/project-dukaanos.png",
    summary:
      "A complete offline shop management system for local shopkeepers. Manage sales, stock, customers and more — without internet.",
    problem:
      "Small shops lose track of stock and daily sales on paper registers, and most POS tools stop working without a stable internet connection.",
    stack: ["React", "Electron", "SQLite", "Tailwind CSS"],
    features: [
      "Offline-first sales and billing flow",
      "Stock and low-inventory alerts",
      "Customer ledger and due tracking",
      "Daily / monthly sales reports",
    ],
    contribution:
      "Designed the data model, built the full desktop UI and implemented the local SQLite persistence layer.",
    demo: "",
    repo: "https://github.com",
  },
  {
    slug: "bin-saleh-store",
    name: "BIN SALEH Store",
    category: "E-commerce Website",
    image: "/images/project-store.png",
    summary:
      "A modern e-commerce platform with product categories, cart and a secure checkout experience.",
    problem:
      "A local clothing retailer needed an online storefront to sell beyond walk-in customers and manage products without a developer.",
    stack: ["React", "Node.js", "MongoDB", "Cloudinary"],
    features: [
      "Product catalogue with categories and search",
      "Cart and checkout flow",
      "Admin product & order management",
      "Cloud image uploads and optimisation",
    ],
    contribution:
      "Built the storefront UI, the REST API for products and orders, and the admin dashboard.",
    demo: "https://example.com",
    repo: "https://github.com",
  },
  {
    slug: "portfolio",
    name: "Portfolio Website",
    category: "Personal Portfolio",
    image: "/images/project-portfolio.png",
    summary:
      "A responsive and modern portfolio website to showcase my skills, projects and services.",
    problem:
      "Clients and recruiters needed one clear place to understand what I build and how to reach me.",
    stack: ["Next.js", "React", "Tailwind CSS", "PostgreSQL"],
    features: [
      "Server-rendered, SEO-friendly pages",
      "Accessible dark / light theme",
      "Contact form stored in PostgreSQL",
      "Fully responsive layout",
    ],
    contribution: "Designed and developed the entire site, front to back.",
    demo: "",
    repo: "https://github.com",
  },
];

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? path.join("/tmp", "data") : path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

const memoryCache = new Map();

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJson(file, defaultData, seedFilename) {
  if (memoryCache.has(file)) {
    return memoryCache.get(file);
  }
  await ensureDataDir();
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(raw);
    memoryCache.set(file, parsed);
    return parsed;
  } catch {
    if (seedFilename) {
      try {
        const repoPath = path.join(process.cwd(), "data", seedFilename);
        const seedRaw = await fs.readFile(repoPath, "utf-8");
        const parsed = JSON.parse(seedRaw);
        memoryCache.set(file, parsed);
        await fs.writeFile(file, JSON.stringify(parsed, null, 2), "utf-8").catch(() => {});
        return parsed;
      } catch {}
    }
    memoryCache.set(file, defaultData);
    await fs.writeFile(file, JSON.stringify(defaultData, null, 2), "utf-8").catch(() => {});
    return defaultData;
  }
}

async function writeJson(file, data) {
  memoryCache.set(file, data);
  await ensureDataDir();
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function getProjects() {
  return await readJson(PROJECTS_FILE, DEFAULT_PROJECTS, "projects.json");
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function saveProject(project) {
  const projects = await getProjects();
  const slug = project.slug
    ? project.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : project.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const normalized = {
    ...project,
    slug,
    stack: Array.isArray(project.stack)
      ? project.stack
      : typeof project.stack === "string"
      ? project.stack.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    features: Array.isArray(project.features)
      ? project.features
      : typeof project.features === "string"
      ? project.features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [],
    image: project.image || "/images/project-placeholder.png",
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = projects.findIndex((p) => p.slug === slug || (project.originalSlug && p.slug === project.originalSlug));

  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...normalized };
  } else {
    normalized.createdAt = new Date().toISOString();
    projects.unshift(normalized);
  }

  await writeJson(PROJECTS_FILE, projects);
  return normalized;
}

export async function deleteProject(slug) {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.slug !== slug);
  await writeJson(PROJECTS_FILE, filtered);
  return { success: true, count: filtered.length };
}

export async function getSettings() {
  const settings = await readJson(SETTINGS_FILE, DEFAULT_SETTINGS, "settings.json");
  return { ...DEFAULT_SETTINGS, ...settings };
}

export async function saveSettings(updates) {
  const current = await getSettings();
  const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };
  await writeJson(SETTINGS_FILE, merged);
  return merged;
}

export async function getMessages() {
  return await readJson(MESSAGES_FILE, [], "messages.json");
}

export async function addMessage({ name, email, subject, message }) {
  const messages = await getMessages();
  const newMessage = {
    id: crypto.randomUUID(),
    name: name || "Anonymous",
    email: email || "unknown@example.com",
    subject: subject || "Inquiry",
    message: message || "",
    read: false,
    createdAt: new Date().toISOString(),
  };
  messages.unshift(newMessage);
  await writeJson(MESSAGES_FILE, messages);
  return newMessage;
}

export async function deleteMessage(id) {
  const messages = await getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  await writeJson(MESSAGES_FILE, filtered);
  return { success: true };
}

export async function markMessageRead(id, read = true) {
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index >= 0) {
    messages[index].read = read;
    await writeJson(MESSAGES_FILE, messages);
    return messages[index];
  }
  return null;
}
