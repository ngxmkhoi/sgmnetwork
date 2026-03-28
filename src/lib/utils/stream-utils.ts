// Client-safe stream utilities (no server-only imports)

export function extractYouTubeId(url: string): string {
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const short = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const long = trimmed.match(/(?:v=|\/live\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (long) return long[1];
  return trimmed;
}

export function buildThumbnailUrl(youtubeUrl: string): string {
  return `https://i.ytimg.com/vi/${extractYouTubeId(youtubeUrl)}/maxresdefault.jpg`;
}

export function buildWatchUrl(youtubeUrl: string): string {
  return `https://www.youtube.com/watch?v=${extractYouTubeId(youtubeUrl)}`;
}

export function buildEmbedUrl(youtubeUrl: string): string {
  return `https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}?autoplay=1&rel=0`;
}
