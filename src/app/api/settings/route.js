import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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
    const updated = await saveSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save settings: " + err.message }, { status: 500 });
  }
}

