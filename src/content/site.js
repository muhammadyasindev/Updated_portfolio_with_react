export const profile = {
  name: "Yasin Baloch",
  copyrightName: "yasin sasoli",
  initials: "YB",
  title: "Full-Stack Developer",
  available: true,
  email: "devlonictechnologies186@gmil.com",
  whatsapp: "03324042186",
  location: "Pakistan",
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
};

export const heroBadges = ["React", "Next.js", "Node.js", "MongoDB", "Tailwind", "Git"];

export const skillGroups = [
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
];

export const projects = [
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
  },
];

export const services = [
  {
    icon: "⌘",
    title: "Full-Stack Web Development",
    description: "End-to-end web applications built with modern, maintainable technologies.",
    value: "One developer owning both sides of your product — fewer handoffs, faster delivery.",
  },
  {
    icon: "▭",
    title: "Responsive Website Development",
    description: "Mobile-friendly, fast and SEO-ready marketing sites.",
    value: "Your site looks right and loads fast on every device your customers use.",
  },
  {
    icon: "◎",
    title: "E-commerce Development",
    description: "Online stores with product management and secure checkout.",
    value: "Sell online with a storefront you can actually update yourself.",
  },
  {
    icon: "▦",
    title: "Admin Dashboards",
    description: "Management systems and dashboards for day-to-day operations.",
    value: "Turn scattered spreadsheets into one reliable source of truth.",
  },
  {
    icon: "⇄",
    title: "API Development & Integration",
    description: "REST APIs, third-party integrations and automation.",
    value: "Connect the tools you already use so data flows without manual work.",
  },
  {
    icon: "⛃",
    title: "Database Design & Optimization",
    description: "Well-structured schemas and efficient queries.",
    value: "A clean data model keeps your app fast as it grows.",
  },
];

export const processSteps = [
  { no: "01", title: "Understand", text: "Discuss your requirements, users and goals." },
  { no: "02", title: "Plan", text: "Define the solution, scope and user experience." },
  { no: "03", title: "Develop", text: "Build the application with clean, reviewable code." },
  { no: "04", title: "Test", text: "Check functionality, performance and security." },
  { no: "05", title: "Deploy", text: "Launch and provide the agreed support." },
];

export const highlights = [
  { title: "Problem Solver", text: "Finds a practical solution for real-world problems." },
  { title: "Quick Learner", text: "Always exploring new technologies and patterns." },
  { title: "Detail Oriented", text: "Writes clean, readable and maintainable code." },
  { title: "Clear Communicator", text: "Shares progress early and often." },
];

export const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];
