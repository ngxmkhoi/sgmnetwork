"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export function NewsToc({ html }: { html: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const toc: TocItem[] = headings.map((h, i) => ({
      id: `heading-${i}`,
      text: h.textContent ?? "",
      level: Number(h.tagName[1]),
    }));
    setItems(toc);
  }, [html]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="glass-card rounded-2xl p-4 space-y-1">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Mục lục</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block truncate rounded-lg px-3 py-1.5 text-sm transition-colors hover:text-primary ${
            active === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
          }`}
          style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
