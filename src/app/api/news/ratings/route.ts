import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/server/api-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const submitSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  anonymous_id: z.string().min(1).max(20),
  stars: z.number().int().min(1).max(5),
  review: z.string().max(500).optional().default(""),
});

// GET - lấy ratings theo slug
export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "ratings-get", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ ratings: [], stats: {} });

  const { data } = await supabase
    .from("news_ratings" as never)
    .select("id, anonymous_id, stars, review, created_at")
    .eq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(50) as { data: Array<{ id: string; anonymous_id: string; stars: number; review: string | null; created_at: string }> | null };

  const ratings = data ?? [];

  // Thống kê số lượng mỗi sao
  const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of ratings) stats[r.stars] = (stats[r.stars] ?? 0) + 1;

  return NextResponse.json({ ratings, stats });
}

// POST - gửi đánh giá
export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "ratings-post", limit: 3, windowMs: 60_000 });
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Server error." }, { status: 500 });

  // Kiểm tra anonymous_id đã đánh giá bài này chưa
  const { data: existing } = await supabase
    .from("news_ratings" as never)
    .select("id")
    .eq("slug", parsed.data.slug)
    .eq("anonymous_id", parsed.data.anonymous_id)
    .maybeSingle() as { data: { id: string } | null };

  if (existing) return NextResponse.json({ error: "Bạn đã đánh giá bài viết này rồi." }, { status: 409 });

  const { error } = await supabase.from("news_ratings" as never).insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    anonymous_id: parsed.data.anonymous_id,
    stars: parsed.data.stars,
    review: parsed.data.review || null,
  } as never);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Cũng gửi về Google Sheet nếu có
  const webAppUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (webAppUrl) {
    void fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify({
        time: new Date().toLocaleString("vi-VN"),
        slug: parsed.data.slug,
        title: parsed.data.title,
        name: parsed.data.anonymous_id,
        stars: parsed.data.stars,
        review: parsed.data.review,
      }),
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
