import { NextRequest, NextResponse } from "next/server";
import { enforceAdminApiAuth, enforceRateLimit } from "@/lib/server/api-guard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function db(supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>) {
  return supabase as unknown as { from: (t: string) => ReturnType<typeof supabase.from> };
}

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-ratings", limit: 60, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth({ minimumRole: "admin" });
  if (denied) return denied;

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ ratings: [] });

  const { data } = await db(supabase).from("news_ratings")
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

  await db(supabase).from("news_ratings").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}

// PATCH - admin toggle like nổi bật
export async function PATCH(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-ratings", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth({ minimumRole: "admin" });
  if (denied) return denied;

  const { id, admin_liked } = await request.json().catch(() => ({})) as { id?: string; admin_liked?: boolean };
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Server error." }, { status: 500 });

  await db(supabase).from("news_ratings").update({ admin_liked: Boolean(admin_liked) } as never).eq("id", id);
  return NextResponse.json({ ok: true });
}
