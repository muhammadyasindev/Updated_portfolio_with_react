import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 12MB limit" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Sanitize and create unique filename
      const originalName = file.name || "image.png";
      const ext = path.extname(originalName) || ".png";
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueName = `${baseName}_${crypto.randomBytes(4).toString("hex")}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${uniqueName}`, filename: uniqueName });
    } catch {
      // Vercel serverless fallback: return data URL
      const mimeType = file.type || "image/png";
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ success: true, url: dataUrl, filename: file.name || "uploaded-image" });
    }
  } catch (err) {
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}
