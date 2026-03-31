"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = { title: string; content: string };

export function AnnouncementPopup({ title, content }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setMounted(false), 350);
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        opacity: visible && !closing ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        style={{
          transform: visible && !closing ? "scale(1) translateY(0)" : "scale(0.92) translateY(24px)",
          opacity: visible && !closing ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
        }}
        className="glass-card relative w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold uppercase tracking-[0.08em] text-foreground text-center">
            {title || "THÔNG BÁO"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            aria-label="Đóng thông báo"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          className="max-h-[60vh] overflow-y-auto px-5 py-4 popup-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer */}
        <div className="border-t border-border px-[10px] pb-[10px] pt-[10px] flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl bg-primary px-6 py-2 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground text-center transition hover:bg-primary/90"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
}
