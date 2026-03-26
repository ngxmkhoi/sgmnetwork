import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/server/api-guard";
import { subscriptions } from "@/lib/server/push-store";

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "push-subscribe", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const sub = await request.json().catch(() => null);
  if (!sub?.endpoint) return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });

  subscriptions.add(JSON.stringify(sub));
  return NextResponse.json({ ok: true });
}
