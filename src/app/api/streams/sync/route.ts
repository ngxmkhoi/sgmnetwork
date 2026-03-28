import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/server/api-guard";
import { getStreams, updateStream } from "@/lib/server/stream-service";
import { extractYouTubeId } from "@/lib/utils/stream-utils";
import type { StreamStatus } from "@/lib/types/content";

// Dùng YouTube oEmbed để check video còn tồn tại
// Dùng noscript thumbnail trick để detect live status
async function detectYouTubeStatus(youtubeUrl: string): Promise<StreamStatus | null> {
  try {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId || videoId.length !== 11) return null;

    // Check oEmbed — nếu video không tồn tại sẽ trả 404
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 0 } }
    );

    if (!oembedRes.ok) return "ended";

    // Check live status qua thumbnail — live streams có thumbnail đặc biệt
    // hqdefault.jpg tồn tại cho cả video thường và live
    // maxresdefault.jpg chỉ tồn tại khi video đang live hoặc đã có HD
    const liveThumbRes = await fetch(
      `https://i.ytimg.com/vi/${videoId}/hqdefault_live.jpg`,
      { method: "HEAD", next: { revalidate: 0 } }
    );

    if (liveThumbRes.ok) return "live";

    return null; // Không thay đổi — giữ nguyên trạng thái admin đặt
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "streams-sync", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const streams = await getStreams();
  const updates: string[] = [];

  await Promise.all(
    streams.map(async (stream) => {
      if (stream.status === "ended") return; // Đã kết thúc, bỏ qua
      const detected = await detectYouTubeStatus(stream.youtube_url);
      if (!detected) return;
      if (detected !== stream.status) {
        await updateStream(stream.id, { status: detected });
        updates.push(stream.id);
      }
    })
  );

  return NextResponse.json({ synced: updates.length, updated: updates });
}
