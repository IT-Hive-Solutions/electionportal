// hooks/use-election-news.ts

import { useState, useEffect } from "react";

export type ElectionNews = {
  id: number;
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
  timeLabel: string; 
};

function toRelativeNepali(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  const toNep = (n: number) =>
    String(n).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[+d]);

  if (mins < 60)  return `${toNep(mins)} मिनेट अघि`;
  if (hours < 24) return `${toNep(hours)} घण्टा अघि`;
  return `${toNep(days)} दिन अघि`;
}

export function useElectionNews(limit = 6) {
  const [news, setNews] = useState<ElectionNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = new URL("/api/proxy/election_news", window.location.origin);
    url.searchParams.set("fields", "id,title,source,url,published_at");
    url.searchParams.set("sort", "-published_at");
    url.searchParams.set("limit", String(limit));

    fetch(url.toString())
      .then((r) => r.json())
      .then((json) => {
        type Raw = { id: number; title: string; source: string; url: string; published_at: string | null };
        setNews(
          (json.data as Raw[]).map((n) => ({
            id: n.id,
            title: n.title,
            source: n.source,
            url: n.url,
            publishedAt: n.published_at,
            timeLabel: toRelativeNepali(n.published_at),
          }))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { news, isLoading };
}