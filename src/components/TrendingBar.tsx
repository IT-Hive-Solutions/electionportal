"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

type Constituency = {
  id: number;
  name: string;
};

export default function TrendingBar() {
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  useEffect(() => {
    const url = new URL("/api/proxy/constituencies", window.location.origin);
    url.searchParams.set("fields", "id,name");
    url.searchParams.set(
      "filter",
      JSON.stringify({ is_trending: { _eq: true } }),
    );
    url.searchParams.set("limit", "20");
    url.searchParams.set("sort", "name");

    fetch(url.toString())
      .then((r) => r.json())
      .then((json) => setConstituencies(json.data ?? []))
      .catch(console.error);
  }, []);

  // While loading or empty, fall back to a placeholder shimmer
  const items = constituencies.length > 0 ? constituencies : [];

  // Duplicate for seamless infinite scroll
  const scrollItems = items.length > 5 ? [...items, ...items] : items;

  return (
    <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TrendingUp size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">
            ट्रेन्डिङ
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden relative flex-1">
          {items.length === 0 ? (
            // Loading shimmer pills
            <div className="flex items-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-24 rounded-full bg-secondary-foreground/20 animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          ) : (
            <div className="w-max flex items-center gap-3 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
              {scrollItems.map((c, i) => (
                <Link
                  key={`${c.id}-${i}`}
                  href={`/candidates?constituencyId=${c.id}`}
                  className="bg-secondary-foreground/15 hover:bg-secondary-foreground/25 text-secondary-foreground px-3 py-0.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
