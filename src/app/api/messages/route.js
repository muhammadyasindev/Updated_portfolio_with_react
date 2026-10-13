import { NextResponse } from "next/server";
import { getMessages, deleteMessage, markMessageRead } from "@/lib/data";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    }
    const res = await deleteMessage(id);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, read } = body;
    if (!id) {
      return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    }
    const updated = await markMessageRead(id, read ?? true);
    return NextResponse.json({ success: true, message: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
