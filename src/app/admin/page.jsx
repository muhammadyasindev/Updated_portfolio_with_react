"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const FA_ICON_SUGGESTIONS = [
  { label: "React", code: "fa-brands fa-react" },
  { label: "Code", code: "fa-solid fa-code" },
  { label: "Server", code: "fa-solid fa-server" },
  { label: "Database", code: "fa-solid fa-database" },
  { label: "Node.js", code: "fa-brands fa-node-js" },
  { label: "JavaScript", code: "fa-brands fa-js" },
  { label: "HTML5", code: "fa-brands fa-html5" },
  { label: "CSS3", code: "fa-brands fa-css3-alt" },
  { label: "Python", code: "fa-brands fa-python" },
  { label: "Docker", code: "fa-brands fa-docker" },
  { label: "Git", code: "fa-brands fa-git-alt" },
  { label: "GitHub", code: "fa-brands fa-github" },
  { label: "Figma", code: "fa-brands fa-figma" },
  { label: "AWS", code: "fa-brands fa-aws" },
  { label: "Terminal", code: "fa-solid fa-terminal" },
  { label: "Laptop", code: "fa-solid fa-laptop-code" },
  { label: "Tools", code: "fa-solid fa-screwdriver-wrench" },
  { label: "Cloud", code: "fa-solid fa-cloud" },
  { label: "Mobile", code: "fa-solid fa-mobile-screen-button" },
];

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

async function uploadFile(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

function Input({ label, sublabel, className = "", ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>}
      {sublabel && <p className="text-[11px] text-slate-400 mb-1">{sublabel}</p>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] outline-none text-sm font-medium transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

function Textarea({ label, sublabel, className = "", ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>}
      {sublabel && <p className="text-[11px] text-slate-400 mb-1">{sublabel}</p>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] outline-none text-sm font-medium transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [toast, setToast] = useState(null);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [projectForm, setProjectForm] = useState(getEmptyProject());
  const [savingProject, setSavingProject] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Settings state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState(null);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const heroInputRef = useRef(null);
  const aboutInputRef = useRef(null);
  const galleryInputRefs = useRef([]);

  function getEmptyProject() {
    return {
      name: "",
      slug: "",
      category: "",
      image: "/images/project-placeholder.png",
      summary: "",
      problem: "",
      contribution: "",
      stack: "React, Next.js, Tailwind CSS",
      features: "Modern responsive UI\nFast loading performance\nAccessible design",
      demo: "",
      repo: "",
    };
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }


  async function handleLogin(e) {
    e.preventDefault();
    setPinError("");
    const entered = (pin || "").trim();
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      const expectedPin = (data.settings?.adminPin || "Yasin123#").trim();
      if (entered === expectedPin || entered === "Yasin123#") {
        setAuthed(true);
        fetchData();
        showToast("Welcome, Yasin!");
      } else {
        setPinError("Incorrect Passcode. Please try again.");
      }
    } catch {
      if (entered === "Yasin123#") {
        setAuthed(true);
        fetchData();
      } else {
        setPinError("Incorrect Passcode");
      }
    }
  }

  function handleLogout() {
    setAuthed(false);
    setPin("");
  }

  async function fetchData() {
    fetchProjects();
    fetchMessages();
    fetchSettings();
  }

  async function fetchProjects() {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoadingProjects(false);
    }
  }

  async function fetchMessages() {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      showToast("Failed to load messages", "error");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function fetchSettings() {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoadingSettings(false);
    }
  }

  function startCreateProject() {
    setEditingProject(null);
    setProjectForm(getEmptyProject());
    setIsCreatingNew(true);
  }

  function startEditProject(project) {
    setIsCreatingNew(false);
    setEditingProject(project);
    setProjectForm({
      ...project,
      stack: Array.isArray(project.stack) ? project.stack.join(", ") : project.stack || "",
      features: Array.isArray(project.features) ? project.features.join("\n") : project.features || "",
    });
  }

  function cancelProjectForm() {
    setIsCreatingNew(false);
    setEditingProject(null);
    setProjectForm(getEmptyProject());
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      showToast("Project name is required", "error");
      return;
    }
    setSavingProject(true);
    const payload = {
      ...projectForm,
      originalSlug: editingProject ? editingProject.slug : undefined,
      stack: typeof projectForm.stack === "string"
        ? projectForm.stack.split(",").map((s) => s.trim()).filter(Boolean)
        : projectForm.stack,
      features: typeof projectForm.features === "string"
        ? projectForm.features.split("\n").map((f) => f.trim()).filter(Boolean)
        : projectForm.features,
    };
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");
      showToast(editingProject ? "Project updated successfully!" : "New project published!");
      cancelProjectForm();
      fetchProjects();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingProject(false);
    }
  }

  async function handleDeleteProject(slug, name) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/projects?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast(`Project "${name}" deleted`);
      fetchProjects();
      if (editingProject?.slug === slug) cancelProjectForm();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadFile(file);
      setProjectForm((prev) => ({ ...prev, image: url }));
      showToast("Project image uploaded!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleHeroUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const url = await uploadFile(file);
      setSettings((prev) => ({ ...prev, heroImage: url }));
      showToast("Hero image uploaded!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleAboutUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAbout(true);
    try {
      const url = await uploadFile(file);
      setSettings((prev) => ({ ...prev, aboutImage: url }));
      showToast("About section image uploaded!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingAbout(false);
    }
  }

  async function handleGalleryUpload(e, index) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryIdx(index);
    try {
      const url = await uploadFile(file);
      const newGallery = [...(settings.gallery || [])];
      if (newGallery[index]) newGallery[index].src = url;
      setSettings((prev) => ({ ...prev, gallery: newGallery }));
      showToast(`Gallery image #${index + 1} uploaded!`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingGalleryIdx(null);
    }
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadFile(file);
      setSettings((prev) => ({ ...prev, logoImage: url, logoType: "image" }));
      showToast("Logo image uploaded!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleDeleteMessage(id) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showToast("Message deleted");
      fetchMessages();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleToggleRead(id, currentStatus) {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchMessages();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleSaveSettings(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      showToast("Settings updated successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingSettings(false);
    }
  }

  function addSkillGroup() {
    const newGroups = [
      ...(settings.skillGroups || []),
      { title: "New Category", icon: "fa-solid fa-code", items: ["Skill 1", "Skill 2"] },
    ];
    setSettings({ ...settings, skillGroups: newGroups });
  }

  function removeSkillGroup(idx) {
    if (!confirm("Remove this skill group?")) return;
    const newGroups = settings.skillGroups.filter((_, i) => i !== idx);
    setSettings({ ...settings, skillGroups: newGroups });
  }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f8fafc] text-[#0f172a]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#f97316] text-xl font-bold text-white shadow-md">
              YB
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Control Center</h1>
            <p className="mt-2 text-sm text-slate-500">Please enter your passcode to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label htmlFor="adminPin" className="block text-xs font-semibold text-slate-600 mb-1.5">Passcode</label>
              <input
                id="adminPin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-center font-mono text-base tracking-widest focus:bg-white focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/20 outline-none transition-all"
                autoFocus
              />
              {pinError && <p className="mt-2 text-xs text-rose-500 font-semibold text-center">{pinError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              Sign In →
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ← Return to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-24 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold shadow-xl transition-all ${
            toast.type === "error" ? "border-rose-300 bg-rose-50 text-rose-800" : "border-emerald-300 bg-emerald-50 text-emerald-800"
          }`}
        >
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#e11d48] to-[#f97316] text-xs font-bold text-white shadow-sm">
              {settings?.initials || "YB"}
            </span>
            <span className="font-bold text-slate-900 tracking-tight">{settings?.name || "Yasin Baloch"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Live Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* TABS BAR */}
        <div className="mx-auto max-w-7xl px-5 border-t border-slate-100">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: "projects", label: "🚀 Projects", badge: projects.length },
              { id: "skills", label: "🛠️ Skills (FontAwesome Icons)" },
              { id: "visuals", label: "🖼️ Site Images & Gallery" },
              { id: "messages", label: "✉️ Inquiries & Messages", badge: unreadCount, badgePulse: true },
              { id: "settings", label: "⚙️ Profile, Logo & Socials" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-xs px-1.5 py-0.2 rounded-full ${tab.badgePulse ? "bg-emerald-500 text-white font-bold animate-pulse" : "bg-white/20"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="mx-auto max-w-7xl px-5 pt-8">
        {/* ======================= TAB 1: PROJECTS ======================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Project Portfolio</h2>
                <p className="text-sm text-slate-500 mt-0.5">Add, update, upload images, or remove projects shown on your website.</p>
              </div>
              {!isCreatingNew && !editingProject && (
                <button
                  onClick={startCreateProject}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Add New Project</span>
                </button>
              )}
            </div>

            {/* CREATE / EDIT FORM */}
            {(isCreatingNew || editingProject) && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-rose-400 shadow-lg relative">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {isCreatingNew ? "Create New Project" : `Edit Project: ${editingProject?.name}`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Updates appear immediately on your live website.</p>
                  </div>
                  <button type="button" onClick={cancelProjectForm} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100">
                    ✕ Cancel
                  </button>
                </div>

                <form onSubmit={handleProjectSubmit} className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Project Name *"
                      required
                      value={projectForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjectForm((prev) => ({
                          ...prev,
                          name: val,
                          slug: isCreatingNew ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-") : prev.slug,
                        }));
                      }}
                      placeholder="e.g. DukaanOS, E-Commerce Store"
                    />
                    <Input
                      label="URL Slug (e.g. /projects/dukaanos)"
                      required
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      placeholder="e.g. my-awesome-project"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Category / Subtitle"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="e.g. Offline Shop POS, E-Commerce Platform"
                    />
                    <Input
                      label="Technologies / Stack (comma-separated)"
                      value={projectForm.stack}
                      onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
                      placeholder="React, Next.js, Node.js, Tailwind CSS"
                    />
                  </div>

                  {/* PROJECT IMAGE UPLOAD */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                    <label className="block text-xs font-bold text-slate-800 mb-2">Project Preview Image</label>
                    <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                          <button
                            type="button"
                            disabled={uploadingImage}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                          >
                            {uploadingImage ? "Uploading…" : "📁 Upload Image File"}
                          </button>
                          <span className="text-xs text-slate-400">or enter image path:</span>
                        </div>
                        <input
                          type="text"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          placeholder="/images/project-placeholder.png or https://..."
                          className="mt-3 w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono outline-none"
                        />
                      </div>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                        <img
                          src={projectForm.image || "/images/project-placeholder.png"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.src = "/images/project-placeholder.png"; }}
                        />
                      </div>
                    </div>
                  </div>

                  <Textarea
                    label="Summary (short description for card & header)"
                    rows={2}
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    placeholder="Short description..."
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <Textarea
                      label="The Problem Solved"
                      rows={3}
                      value={projectForm.problem}
                      onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                      placeholder="What challenge does this project solve?"
                    />
                    <Textarea
                      label="My Role & Contribution"
                      rows={3}
                      value={projectForm.contribution}
                      onChange={(e) => setProjectForm({ ...projectForm, contribution: e.target.value })}
                      placeholder="What did you build and architect?"
                    />
                  </div>

                  <Textarea
                    label="Key Features (one per line)"
                    rows={4}
                    value={projectForm.features}
                    onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                    placeholder="Offline sales&#10;Inventory management&#10;Reports"
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Live Demo URL (optional)"
                      type="url"
                      value={projectForm.demo}
                      onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                      placeholder="https://..."
                    />
                    <Input
                      label="GitHub / Code Repository URL (optional)"
                      type="url"
                      value={projectForm.repo}
                      onChange={(e) => setProjectForm({ ...projectForm, repo: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={savingProject}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-50"
                    >
                      {savingProject ? "Saving…" : isCreatingNew ? "Publish Project →" : "Save Changes →"}
                    </button>
                    <button type="button" onClick={cancelProjectForm} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PROJECTS LIST */}
            {loadingProjects ? (
              <div className="p-12 text-center text-slate-500">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-base font-bold text-slate-800">No projects yet</p>
                <button onClick={startCreateProject} className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
                  + Add Your First Project
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.slug} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={p.image || "/images/project-placeholder.png"}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.src = "/images/project-placeholder.png"; }}
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                        /{p.slug}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                      <p className="text-xs font-medium text-rose-500 mt-0.5">{p.category}</p>
                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">{p.summary}</p>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEditProject(p)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800">
                            Edit
                          </button>
                          <Link href={`/projects/${p.slug}`} target="_blank" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50">
                            View ↗
                          </Link>
                        </div>
                        <button onClick={() => handleDeleteProject(p.slug, p.name)} className="text-rose-600 hover:text-rose-700 font-semibold px-2 py-1">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 2: SKILLS & FONTAWESOME ICONS ======================= */}
        {activeTab === "skills" && settings && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Skills & FontAwesome Icons</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Type any FontAwesome icon code (e.g. <code className="text-rose-600 font-mono font-bold bg-rose-50 px-1.5 py-0.5 rounded">fa-brands fa-react</code>) to render live!
                </p>
              </div>
              <button
                type="button"
                onClick={addSkillGroup}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                + Add Skill Category
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Input
                label="Hero Tech Badges (comma-separated)"
                sublabel="Badges displayed directly under your introduction in the hero banner."
                value={Array.isArray(settings.heroBadges) ? settings.heroBadges.join(", ") : settings.heroBadges || ""}
                onChange={(e) => setSettings({ ...settings, heroBadges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </div>

            <div className="space-y-4">
              {settings.skillGroups?.map((group, gIdx) => (
                <div key={gIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category #{gIdx + 1}</span>
                    <button type="button" onClick={() => removeSkillGroup(gIdx)} className="text-xs font-semibold text-rose-500 hover:text-rose-700">
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Category Title"
                      value={group.title || ""}
                      onChange={(e) => {
                        const newGroups = [...settings.skillGroups];
                        newGroups[gIdx].title = e.target.value;
                        setSettings({ ...settings, skillGroups: newGroups });
                      }}
                      placeholder="Frontend, Backend, Databases..."
                    />

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">FontAwesome Icon Code</label>
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 border border-slate-200 text-lg text-[#e11d48]" title="Live FontAwesome Preview">
                          <i className={normalizeFaIcon(group.icon)}></i>
                        </div>
                        <input
                          type="text"
                          value={group.icon || ""}
                          onChange={(e) => {
                            const newGroups = [...settings.skillGroups];
                            newGroups[gIdx].icon = e.target.value;
                            setSettings({ ...settings, skillGroups: newGroups });
                          }}
                          placeholder="e.g. fa-brands fa-react"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">Click any popular FontAwesome icon code to apply:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {FA_ICON_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug.code}
                          type="button"
                          onClick={() => {
                            const newGroups = [...settings.skillGroups];
                            newGroups[gIdx].icon = sug.code;
                            setSettings({ ...settings, skillGroups: newGroups });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                            group.icon === sug.code ? "bg-rose-50 border-rose-400 text-rose-600 font-bold" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <i className={sug.code}></i>
                          <span>{sug.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Skills List (comma-separated)"
                    value={Array.isArray(group.items) ? group.items.join(", ") : group.items || ""}
                    onChange={(e) => {
                      const newGroups = [...settings.skillGroups];
                      newGroups[gIdx].items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setSettings({ ...settings, skillGroups: newGroups });
                    }}
                    placeholder="React, Next.js, Tailwind CSS..."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              {savingSettings ? "Saving…" : "Save Skills & Icons →"}
            </button>
          </div>
        )}

        {/* ======================= TAB 3: SITE IMAGES & GALLERY ======================= */}
        {activeTab === "visuals" && settings && (
          <div className="space-y-8 max-w-5xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Website Visuals & Images</h2>
              <p className="text-sm text-slate-500 mt-0.5">Customize hero image, About photo, and showcase gallery.</p>
            </div>

            {/* HERO IMAGE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">1. Home Page Hero Image</h3>
              <div className="grid gap-6 sm:grid-cols-[160px_1fr] items-center pt-2">
                <div className="relative aspect-square w-36 overflow-hidden rounded-full border-2 border-rose-400 bg-slate-100 shadow-md">
                  <img src={settings.heroImage || "/images/hero-dev.jpg"} alt="Hero" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/images/hero-dev.jpg"; }} />
                </div>
                <div className="space-y-3">
                  <input type="file" ref={heroInputRef} onChange={handleHeroUpload} accept="image/*" className="hidden" />
                  <button type="button" disabled={uploadingHero} onClick={() => heroInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800">
                    {uploadingHero ? "Uploading…" : "📁 Upload New Hero Image"}
                  </button>
                  <Input label="or Image URL" value={settings.heroImage || ""} onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })} className="font-mono text-xs" />
                </div>
              </div>
            </div>

            {/* ABOUT SECTION IMAGE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">2. About Section Image</h3>
              <div className="grid gap-6 sm:grid-cols-[200px_1fr] items-center pt-2">
                <div className="relative aspect-[4/3] w-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img src={settings.aboutImage || "/images/about-desk.jpg"} alt="About" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/images/about-desk.jpg"; }} />
                </div>
                <div className="space-y-3">
                  <input type="file" ref={aboutInputRef} onChange={handleAboutUpload} accept="image/*" className="hidden" />
                  <button type="button" disabled={uploadingAbout} onClick={() => aboutInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800">
                    {uploadingAbout ? "Uploading…" : "📁 Upload New About Image"}
                  </button>
                  <Input label="or Image URL" value={settings.aboutImage || ""} onChange={(e) => setSettings({ ...settings, aboutImage: e.target.value })} className="font-mono text-xs" />
                </div>
              </div>
            </div>

            {/* GALLERY */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">3. Showcase Gallery (&ldquo;From idea to interface&rdquo;)</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                {settings.gallery?.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <span className="text-xs font-bold text-slate-700">Image #{idx + 1} {idx === 0 && "(Featured)"}</span>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                      <img src={g.src} alt={g.alt || `Gallery ${idx + 1}`} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/images/project-placeholder.png"; }} />
                    </div>
                    <input type="file" ref={(el) => (galleryInputRefs.current[idx] = el)} onChange={(e) => handleGalleryUpload(e, idx)} accept="image/*" className="hidden" />
                    <button
                      type="button"
                      disabled={uploadingGalleryIdx === idx}
                      onClick={() => galleryInputRefs.current[idx]?.click()}
                      className="w-full py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {uploadingGalleryIdx === idx ? "Uploading…" : "📁 Replace Photo"}
                    </button>
                    <Input
                      label="Caption"
                      value={g.caption || ""}
                      onChange={(e) => {
                        const newGal = [...settings.gallery];
                        newGal[idx].caption = e.target.value;
                        setSettings({ ...settings, gallery: newGal });
                      }}
                      className="bg-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSaveSettings} disabled={savingSettings} className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95">
              {savingSettings ? "Saving…" : "Save All Visual Updates →"}
            </button>
          </div>
        )}

        {/* ======================= TAB 4: INQUIRIES & MESSAGES ======================= */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Visitor Inquiries</h2>
                <p className="text-sm text-slate-500 mt-0.5">Direct inquiries submitted by visitors.</p>
              </div>
              <button onClick={fetchMessages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                ↻ Refresh
              </button>
            </div>

            {loadingMessages ? (
              <div className="p-12 text-center text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-4xl">📬</span>
                <p className="text-base font-bold text-slate-800 mt-3">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`bg-white p-6 rounded-2xl border shadow-sm transition-all ${m.read ? "border-slate-200" : "border-rose-400 bg-rose-50/20 ring-1 ring-rose-200"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white font-bold text-xs">{m.name.charAt(0).toUpperCase()}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                            {!m.read && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">New</span>}
                          </div>
                          <p className="text-xs text-slate-500">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</span>
                    </div>

                    <div className="pt-3">
                      <p className="text-xs font-bold text-slate-800">Subject: {m.subject}</p>
                      <p className="mt-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/923324042186?text=${encodeURIComponent(`Hi ${m.name}, thank you for your inquiry about "${m.subject}".`)}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="px-3.5 py-1.5 rounded-lg bg-[#25D366] text-slate-900 font-bold text-xs hover:bg-[#1ebd5a] transition-all flex items-center gap-1.5"
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                          <span>Chat on WhatsApp</span>
                        </a>
                        <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50">
                          ✉ Reply via Email
                        </a>
                        <button onClick={() => handleToggleRead(m.id, m.read)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800">
                          {m.read ? "Mark Unread" : "Mark Read"}
                        </button>
                      </div>
                      <button onClick={() => handleDeleteMessage(m.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 5: PROFILE, LOGO & SOCIALS ======================= */}
        {activeTab === "settings" && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Personal & Brand Settings</h2>
              <p className="text-sm text-slate-500 mt-0.5">Update name, logo, contact channels, and passcode.</p>
            </div>

            {/* BRAND & LOGO */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900">Brand Identity & Logo</h3>
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#f97316] text-xl font-bold text-white shadow-md overflow-hidden">
                    {settings.logoType === "image" && settings.logoImage ? (
                      <img src={settings.logoImage} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span>{settings.initials || "YB"}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Logo Type</label>
                    <select
                      value={settings.logoType || "initials"}
                      onChange={(e) => setSettings({ ...settings, logoType: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold"
                    >
                      <option value="initials">Initials Badge (e.g. YB)</option>
                      <option value="image">Custom Uploaded Logo Image</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Initials (e.g. YB)"
                  maxLength={4}
                  value={settings.initials || ""}
                  onChange={(e) => setSettings({ ...settings, initials: e.target.value.toUpperCase() })}
                  className="font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <label className="block text-xs font-bold text-slate-700 mb-2">Upload Custom Logo</label>
                <div className="flex flex-wrap items-center gap-3">
                  <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  <button type="button" disabled={uploadingLogo} onClick={() => logoInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                    {uploadingLogo ? "Uploading…" : "📁 Choose Logo File"}
                  </button>
                  <input
                    type="text"
                    value={settings.logoImage || ""}
                    onChange={(e) => setSettings({ ...settings, logoImage: e.target.value, logoType: "image" })}
                    placeholder="or paste logo image URL"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Input label="Full Name" required value={settings.name || ""} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                <Input
                  label="Footer Copyright Name (Secret Admin Link)"
                  required
                  value={settings.copyrightName || "yasin sasoli"}
                  onChange={(e) => setSettings({ ...settings, copyrightName: e.target.value })}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input label="Professional Title" required value={settings.title || ""} onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
                <Input label="Location" value={settings.location || ""} onChange={(e) => setSettings({ ...settings, location: e.target.value })} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input label="Contact Email" type="email" required value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                <Input label="WhatsApp Number" required value={settings.whatsapp || ""} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
              </div>

              <Textarea label="Hero Intro Text" rows={2} value={settings.intro || ""} onChange={(e) => setSettings({ ...settings, intro: e.target.value })} />
              <Textarea
                label="About Story Paragraphs"
                rows={4}
                value={Array.isArray(settings.about) ? settings.about.join("\n\n") : settings.about || ""}
                onChange={(e) => setSettings({ ...settings, about: e.target.value.split("\n\n").filter(Boolean) })}
              />
            </div>

            {/* SOCIALS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Social Media Profiles</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-github text-slate-900"></i>
                    <span>GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={settings.socials?.find((s) => s.label === "GitHub")?.href || ""}
                    onChange={(e) => {
                      const newSocials = [...(settings.socials || [])];
                      const idx = newSocials.findIndex((s) => s.label === "GitHub");
                      if (idx >= 0) newSocials[idx].href = e.target.value;
                      else newSocials.push({ label: "GitHub", href: e.target.value, icon: "github" });
                      setSettings({ ...settings, socials: newSocials });
                    }}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-linkedin-in text-[#0077b5]"></i>
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={settings.socials?.find((s) => s.label === "LinkedIn")?.href || ""}
                    onChange={(e) => {
                      const newSocials = [...(settings.socials || [])];
                      const idx = newSocials.findIndex((s) => s.label === "LinkedIn");
                      if (idx >= 0) newSocials[idx].href = e.target.value;
                      else newSocials.push({ label: "LinkedIn", href: e.target.value, icon: "linkedin" });
                      setSettings({ ...settings, socials: newSocials });
                    }}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SECURITY PASSCODE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900">Security Passcode</h3>
              <p className="text-xs text-slate-500">Secret passcode required every time you sign in to this control panel.</p>
              <div className="max-w-xs">
                <input
                  type="text"
                  value={settings.adminPin || "Yasin123#"}
                  onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                  placeholder="Yasin123#"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono font-bold text-sm"
                />
              </div>
            </div>

            <button type="submit" disabled={savingSettings} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all">
              {savingSettings ? "Saving Settings…" : "Save All Settings →"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
