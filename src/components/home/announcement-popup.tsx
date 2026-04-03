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
    setTimeout(() => setMounted(false), 480);
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at top, rgba(0,82,255,0.18), rgba(0,0,0,0.78) 42%)",
        backdropFilter: "blur(10px)",
        opacity: visible && !closing ? 1 : 0,
        transition: "opacity 0.42s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        style={{
          transform: visible && !closing ? "scale(1) translateY(0)" : "scale(0.94) translateY(20px)",
          opacity: visible && !closing ? 1 : 0,
          filter: visible && !closing ? "blur(0px)" : "blur(10px)",
          transition: "transform 0.48s cubic-bezier(0.22,1,0.36,1), opacity 0.38s ease-out, filter 0.38s ease-out",
        }}
        className="glass-card relative w-full max-w-lg overflow-hidden rounded-[28px] border border-border shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
      >
        {/* Header */}
        <div className="relative border-b border-border bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.08] px-5 py-4 dark:from-amber-400/[0.03] dark:to-amber-400/[0.08]">
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
        <div className="flex justify-end border-t border-border bg-background/30 px-[10px] pb-[10px] pt-[10px] backdrop-blur-sm">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl bg-primary px-6 py-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground shadow-[0_10px_26px_rgba(0,82,255,0.22)] transition hover:brightness-110 dark:shadow-[0_12px_28px_rgba(247,147,26,0.22)]"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
}
