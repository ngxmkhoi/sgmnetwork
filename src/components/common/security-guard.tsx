"use client";

import { useEffect, useState } from "react";

export function SecurityGuard() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // Chặn copy
    const blockCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("copy", blockCopy);

    // Chặn chuột phải
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);

    // Chặn phím tắt
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // F12
      if (e.key === "F12") { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+U / Ctrl+S
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) { e.preventDefault(); return; }
      if (e.ctrlKey && ["u", "s"].includes(key)) { e.preventDefault(); return; }
    };
    document.addEventListener("keydown", blockKeys);

    // Detect DevTools bằng window size delta
    let threshold = 160;
    const detect = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      setDevToolsOpen(widthDiff > threshold || heightDiff > threshold);
    };

    // Detect bằng console timing trick
    const devToolsChecker = setInterval(() => {
      detect();
      // Trick: debugger statement làm chậm nếu DevTools mở
      const start = performance.now();
      // eslint-disable-next-line no-console
      const dummy = /./;
      dummy.toString = () => {
        setDevToolsOpen(true);
        return "";
      };
      // eslint-disable-next-line no-console
      console.log("%c", dummy);
      if (performance.now() - start > 100) {
        setDevToolsOpen(true);
      }
    }, 1000);

    window.addEventListener("resize", detect);

    return () => {
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      window.removeEventListener("resize", detect);
      clearInterval(devToolsChecker);
    };
  }, []);

  if (!devToolsOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "#ff2222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
      }}>
        ⚠️
      </div>
      <p style={{
        color: "#fff",
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        margin: 0,
        padding: "0 24px",
      }}>
        CHÚNG TÔI PHÁT HIỆN BẤT THƯỜNG
      </p>
      <p style={{
        color: "#ff4444",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textAlign: "center",
        margin: 0,
      }}>
        VUI LÒNG TẮT F12 / DEVTOOLS ĐỂ TIẾP TỤC
      </p>
      <p style={{
        color: "#555",
        fontSize: 12,
        textAlign: "center",
        margin: 0,
        letterSpacing: "0.06em",
      }}>
        © SGM NETWORK · BẢO MẬT HỆ THỐNG
      </p>
    </div>
  );
}
