"use client";

import { useEffect } from "react";

export function SecurityGuard() {
  useEffect(() => {
    // Chặn copy
    const blockCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("copy", blockCopy);

    // Chặn chuột phải
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);

    // Chặn phím tắt DevTools
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === "F12") { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) { e.preventDefault(); return; }
      if (e.ctrlKey && ["u", "s"].includes(key)) { e.preventDefault(); return; }
    };
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
