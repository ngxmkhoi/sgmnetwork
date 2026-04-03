"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { slug: string; title: string };

export function NewsRating({ slug, title }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập họ tên."); return; }
    if (!selected) { toast.error("Vui lòng chọn số sao."); return; }

    setSubmitting(true);
    const res = await fetch("/api/news/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, name: name.trim(), stars: selected }),
    });
    setSubmitting(false);

    if (!res.ok) {
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
      return;
    }

    setDone(true);
    toast.success("Cảm ơn bạn đã đánh giá!");
  };

  if (done) {
    return (
      <div className="glass-card rounded-2xl p-5 text-center space-y-2">
        <p className="text-2xl">⭐</p>
        <p className="font-heading font-bold uppercase text-foreground">Cảm ơn bạn đã đánh giá!</p>
        <p className="text-sm text-muted-foreground">Đánh giá của bạn đã được ghi nhận.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div>
        <p className="font-heading text-base font-bold uppercase text-foreground">Đánh giá bài viết</p>
        <p className="text-sm text-muted-foreground mt-0.5">Chia sẻ cảm nhận của bạn về bài viết này.</p>
      </div>

      {!open ? (
        <Button onClick={() => setOpen(true)} variant="outline" className="rounded-xl w-full">
          ⭐ Đánh giá ngay
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Chọn sao */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(star)}
                className="transition-transform hover:scale-110"
                aria-label={`${star} sao`}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hovered || selected)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {selected > 0 && (
            <p className="text-center text-sm font-medium text-foreground">
              {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][selected]}
            </p>
          )}

          {/* Họ tên */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Họ tên của bạn</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên..."
              className="border-border bg-background text-foreground"
              maxLength={80}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={submitting || !selected} className="flex-1 rounded-xl">
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
