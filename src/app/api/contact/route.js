import { NextResponse } from "next/server";
import { addMessage } from "@/lib/data";

const hits = new Map();
const WINDOW = 60_000;
const LIMIT = 5;

function limited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a minute." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot field — bots fill it, humans never see it.
  if (typeof body?.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const name = str(body?.name);
  const email = str(body?.email);
  const subject = str(body?.subject);
  const message = str(body?.message);

  const errors = {};
  if (name.length < 2 || name.length > 120) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200)
    errors.email = "Please enter a valid email address.";
  if (subject.length < 2 || subject.length > 160) errors.subject = "Please choose a subject.";
  if (message.length < 10) errors.message = "Please write at least 10 characters.";
  if (message.length > 5000) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  try {
    // Save to our persistent messages store
    await addMessage({ name, email, subject, message });

    // Also attempt PostgreSQL save if configured
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/db");
        const { contactMessages } = await import("@/db/schema");
        await db.insert(contactMessages).values({ name, email, subject, message });
      } catch (dbErr) {
        console.warn("Postgres DB save skipped or failed:", dbErr.message);
      }
    }
  } catch (err) {
    return NextResponse.json({ error: "Could not save your message. Please email directly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Thanks! Your message has been received." }, { status: 201 });
}
