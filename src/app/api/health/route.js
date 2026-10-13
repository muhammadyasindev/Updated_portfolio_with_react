import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: true, status: "healthy", database: "unconfigured" });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, status: "healthy", database: "connected" });
  } catch (err) {
    return Response.json({ ok: false, status: "unhealthy", error: err.message }, { status: 500 });
  }
}
