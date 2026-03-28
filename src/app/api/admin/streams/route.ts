import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceAdminApiAuth, enforceRateLimit } from "@/lib/server/api-guard";
import { logAdminActivity } from "@/lib/server/admin-activity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import {
  getStreams,
  createStream,
  updateStream,
  deleteStream,
  buildThumbnailUrl,
} from "@/lib/server/stream-service";

const streamSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(200),
  youtube_url: z.string().min(1),
  thumbnail_url: z.string().optional().default(""),
  scheduled_at: z.string().min(1),
  status: z.enum(["live", "upcoming", "ended"]).default("upcoming"),
});

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-streams", limit: 60, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth();
  if (denied) return denied;
  const streams = await getStreams();
  return NextResponse.json({ streams });
}

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-streams", limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth();
  if (denied) return denied;

  const payload = await request.json().catch(() => null);
  const parsed = streamSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stream payload.", details: parsed.error.issues }, { status: 400 });
  }

  const stream = await createStream({
    title: sanitizePlainText(parsed.data.title),
    youtube_url: sanitizePlainText(parsed.data.youtube_url),
    thumbnail_url: parsed.data.thumbnail_url || buildThumbnailUrl(parsed.data.youtube_url),
    scheduled_at: parsed.data.scheduled_at,
    status: parsed.data.status,
  });

  await logAdminActivity({ action: "STREAM_CREATED", targetType: "STREAM", targetId: stream.id, summary: `Tạo stream ${stream.title}` });
  return NextResponse.json({ stream }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-streams", limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth();
  if (denied) return denied;

  const payload = await request.json().catch(() => null);
  const parsed = streamSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ error: "Invalid stream payload." }, { status: 400 });
  }

  const stream = await updateStream(parsed.data.id, {
    title: sanitizePlainText(parsed.data.title),
    youtube_url: sanitizePlainText(parsed.data.youtube_url),
    thumbnail_url: parsed.data.thumbnail_url || buildThumbnailUrl(parsed.data.youtube_url),
    scheduled_at: parsed.data.scheduled_at,
    status: parsed.data.status,
  });

  await logAdminActivity({ action: "STREAM_UPDATED", targetType: "STREAM", targetId: stream.id, summary: `Cập nhật stream ${stream.title}` });
  return NextResponse.json({ stream });
}

export async function DELETE(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "admin-streams", limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  const denied = await enforceAdminApiAuth();
  if (denied) return denied;

  const payload = await request.json().catch(() => null) as { id?: string } | null;
  if (!payload?.id || typeof payload.id !== "string") {
    return NextResponse.json({ error: "Missing stream id." }, { status: 400 });
  }

  await deleteStream(payload.id);
  await logAdminActivity({ action: "STREAM_DELETED", targetType: "STREAM", targetId: payload.id, summary: "Xóa stream" });
  return NextResponse.json({ ok: true });
}
