"use client";

import { useEffect, useRef, useState } from "react";

type StreamPlayerProps = {
  embedUrl: string;
  title: string;
};

export function StreamPlayer({ embedUrl, title }: StreamPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // Dùng YouTube IFrame API để force chất lượng cao nhất khi player sẵn sàng
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    // Lắng nghe message từ YouTube iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // Khi player ready, gửi lệnh set quality
        if (data?.event === "onReady" || data?.info === 1) {
          setReady(true);
          // Gửi lệnh setPlaybackQuality qua postMessage
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: "setPlaybackQuality", args: ["hd1080"] }),
            "*"
          );
        }
      } catch {
        // ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="relative aspect-video w-full bg-black">
      {/* Skeleton loader */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
        style={{ border: 0, opacity: ready ? 1 : 0, transition: "opacity 0.3s" }}
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
