import { NextResponse } from "next/server";
import { getProjects, saveProject, deleteProject } from "@/lib/data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json(
        { error: "Payload too large or invalid JSON: " + parseErr.message },
        { status: 400 }
      );
    }
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }
    const saved = await saveProject(body);
    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save project: " + err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Project slug is required" }, { status: 400 });
    }
    const res = await deleteProject(slug);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
