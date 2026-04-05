"use client";

import { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RatingItem = { id: string; anonymous_id: string; stars: number; review: string | null; created_at: string };
type Stats = Record<number, number>;
type Props = { slug: string; title: string };

const STAR_LABELS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"];

function getOrCreateAnonId(): string {
  try {
    const key = "sgm_anon_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const id = "User #" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    localStorage.setItem(key, id);
    return id;
  } catch { return "User #ANON"; }
}

export function NewsRating({ slug, title }: Props) {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [stats, setStats] = useState<Stats>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [anonId, setAnonId] = useState("");

  useEffect(() => { setAnonId(getOrCreateAnonId()); }, []);

  const fetchRatings = useCallback(async () => {
    const res = await fetch(`/api/news/ratings?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return;
    const data = await res.json() as { ratings: RatingItem[]; stats: Stats };
    setRatings(data.ratings);
    setStats(data.stats);
    setLoading(false);
  }, [slug]);

  useEffect(() => { void fetchRatings(); }, [fetchRatings]);

  const totalRatings = Object.values(stats).reduce((a, b) => a + b, 0);
  const avgStars = totalRatings > 0
    ? Object.entries(stats).reduce((sum, [star, count]) => sum + Number(star) * count, 0) / totalRatings
    : 0;

  const onSubmit = async () => {
    if (!selected) { toast.error("Vui lòng chọn số sao."); return; }
    setSubmitting(true);
    const res = await fetch("/api/news/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, anonymous_id: anonId, stars: selected, review }),
    });
    setSubmitting(false);
    if (res.status === 409) { toast.error("Bạn đã đánh giá bài viết này rồi."); return; }
    if (!res.ok) { toast.error("Gửi đánh giá thất bại."); return; }
    setDone(true);
    toast.success("Cảm ơn bạn đã đánh giá!");
    void fetchRatings();
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-5">
      {/* Header thống kê */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-heading text-base font-bold uppercase text-foreground">Đánh giá bài viết</p>
          {totalRatings > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-foreground">{avgStars.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({totalRatings} đánh giá)</span>
            </div>
          )}
        </div>

        {/* Thanh thống kê từng sao */}
        {totalRatings > 0 && (
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats[star] ?? 0;
              const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 w-14 shrink-0">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form đánh giá */}
      {done ? (
        <div className="text-center space-y-1 py-2">
          <p className="text-2xl">⭐</p>
          <p className="font-bold text-foreground text-sm uppercase">Cảm ơn bạn đã đánh giá!</p>
        </div>
      ) : !open ? (
        <Button onClick={() => setOpen(true)} variant="outline" className="rounded-xl w-full">
          ⭐ Viết đánh giá
        </Button>
      ) : (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button"
                onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(star)} className="transition-transform hover:scale-110">
                <Star size={32} className={`transition-colors ${star <= (hovered || selected) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          {selected > 0 && <p className="text-center text-sm font-medium text-foreground">{STAR_LABELS[selected]}</p>}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Viết đánh giá</label>
            <Textarea value={review} onChange={(e) => setReview(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về bài viết này..." maxLength={500}
              className="border-border bg-background text-foreground min-h-[80px] resize-none" />
          </div>
          <p className="text-xs text-muted-foreground">Đánh giá với tên: <span className="font-semibold text-foreground">{anonId}</span></p>
          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={submitting || !selected} className="flex-1 rounded-xl">
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Hủy</Button>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      {!loading && ratings.length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Đánh giá gần đây</p>
          {ratings.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-background/60 px-4 py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{r.anonymous_id}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < r.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} />
                  ))}
                </div>
              </div>
              {r.review && <p className="text-sm text-muted-foreground">{r.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
