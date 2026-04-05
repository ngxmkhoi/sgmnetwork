import { NextRequest, NextResponse } from "next/server";
import { enforceAdminApiAuth, enforceRateLimit } from "@/lib/server/api-guard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-ratings", limit: 60, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth({ minimumRole: "admin" });
  if (denied) return denied;

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ ratings: [] });

  const { data } = await supabase
    .from("news_ratings" as never)
    .select("*")
    .order("created_at", { ascending: false }) as { data: unknown[] | null };

  return NextResponse.json({ ratings: data ?? [] });
}

export async function DELETE(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-ratings", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth({ minimumRole: "admin" });
  if (denied) return denied;

  const { id } = await request.json().catch(() => ({})) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Server error." }, { status: 500 });

  await (supabase.from("news_ratings" as never) as ReturnType<typeof supabase.from>).delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
