"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Newspaper,
  ExternalLink,
  Search,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── Types ─────────────────────────────────────────────────────────────────────

type NewsItem = {
  id: number;
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
  timeLabel: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const NEPALI_DIGITS: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

function toNep(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d]);
}

function toRelativeNepali(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "भर्खरै";
  if (mins < 60) return `${toNep(mins)} मिनेट अघि`;
  if (hours < 24) return `${toNep(hours)} घण्टा अघि`;
  if (days < 30) return `${toNep(days)} दिन अघि`;
  return new Date(dateStr).toLocaleDateString("ne-NP");
}

// Unique sources from current list for the filter dropdown
function uniqueSources(items: NewsItem[]): string[] {
  return Array.from(new Set(items.map((n) => n.source).filter(Boolean))).sort();
}

const PAGE_SIZE = 12;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [displayed, setDisplayed] = useState<NewsItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filter state
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  // ── Fetch news ──────────────────────────────────────────────────────────────

  const fetchNews = useCallback(
    async (pageNum: number, append = false) => {
      append ? setIsLoadingMore(true) : setIsLoading(true);
      setError(null);

      try {
        const filter: Record<string, unknown> = {};
        if (search.trim()) filter["title"] = { _icontains: search.trim() };
        if (sourceFilter !== "all") filter["source"] = { _eq: sourceFilter };

        const url = new URL("/api/proxy/election_news", window.location.origin);
        url.searchParams.set("fields", "id,title,source,url,published_at");
        url.searchParams.set("sort", "-published_at");
        url.searchParams.set("limit", String(PAGE_SIZE));
        url.searchParams.set("offset", String((pageNum - 1) * PAGE_SIZE));
        if (Object.keys(filter).length > 0) {
          url.searchParams.set("filter", JSON.stringify(filter));
        }

        // Parallel: page data + total count
        const countUrl = new URL(
          "/api/proxy/election_news",
          window.location.origin,
        );
        countUrl.searchParams.set("fields", "id");
        countUrl.searchParams.set("limit", "-1");
        if (Object.keys(filter).length > 0) {
          countUrl.searchParams.set("filter", JSON.stringify(filter));
        }

        const [res, countRes] = await Promise.all([
          fetch(url.toString()),
          fetch(countUrl.toString()),
        ]);

        const [json, countJson] = await Promise.all([
          res.json(),
          countRes.json(),
        ]);

        type Raw = {
          id: number;
          title: string;
          source: string;
          url: string;
          published_at: string | null;
        };
        const items: NewsItem[] = (json.data as Raw[]).map((n) => ({
          id: n.id,
          title: n.title,
          source: n.source,
          url: n.url,
          publishedAt: n.published_at,
          timeLabel: toRelativeNepali(n.published_at),
        }));

        setTotalCount((countJson.data as { id: number }[]).length);

        if (append) {
          setAllNews((prev) => [...prev, ...items]);
          setDisplayed((prev) => [...prev, ...items]);
        } else {
          setAllNews(items);
          setDisplayed(items);
        }
      } catch (err) {
        console.error("[NewsPage]", err);
        setError("समाचार लोड गर्न सकिएन।");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [search, sourceFilter],
  );

  // Initial load + re-fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [search, sourceFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNews(nextPage, true);
  };

  const hasMore = displayed.length < totalCount;

  // Unique sources for dropdown — built from currently loaded items
  const sources = uniqueSources(allNews);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      {/* Page header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              निर्वाचन समाचार
            </h1>
          </div>
          <p className="text-muted-foreground">
            नेपालको निर्वाचनसँग सम्बन्धित ताजा समाचार र विश्लेषण
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-card border-b border-border py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="समाचार खोज्नुहोस्..."
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Source filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[160px]"
            >
              <option value="all">सबै स्रोत</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Result count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap self-center">
              {!isLoading && (
                <>
                  <span>{toNep(totalCount)} समाचार</span>
                  <button
                    onClick={() => fetchNews(1, false)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    title="रिफ्रेश गर्नुहोस्"
                  >
                    <RefreshCw size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News grid */}
      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-20 bg-muted rounded-full" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-4/5 mb-2" />
                  <div className="h-4 bg-muted rounded w-3/5" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <Newspaper
                size={48}
                className="mx-auto mb-3 text-muted-foreground opacity-30"
              />
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <button
                onClick={() => fetchNews(1, false)}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                फेरि प्रयास गर्नुहोस्
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && displayed.length === 0 && (
            <div className="text-center py-20">
              <Newspaper
                size={48}
                className="mx-auto mb-3 text-muted-foreground opacity-30"
              />
              <p className="text-foreground font-semibold mb-1">
                कुनै समाचार भेटिएन
              </p>
              <p className="text-sm text-muted-foreground">
                {search || sourceFilter !== "all"
                  ? "कृपया फिल्टर परिवर्तन गर्नुहोस्"
                  : "अहिले कुनै समाचार उपलब्ध छैन"}
              </p>
            </div>
          )}

          {/* News cards */}
          {!isLoading && !error && displayed.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {displayed.map((news) => (
                  <a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col"
                  >
                    {/* Source + time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
                        {news.source}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock size={11} />
                        {news.timeLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground text-sm leading-snug flex-1 group-hover:text-primary transition-colors line-clamp-3">
                      {news.title}
                    </h3>

                    {/* Read more */}
                    <div className="flex items-center gap-1 mt-3 text-xs text-primary font-semibold">
                      पूर्ण पढ्नुहोस्
                      <ExternalLink size={12} />
                    </div>
                  </a>
                ))}
              </div>

              {/* Ad between pages */}

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-10 py-3 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-60 flex items-center gap-2"
                  >
                    {isLoadingMore ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    थप समाचार हेर्नुहोस्
                    {!isLoadingMore && (
                      <span className="text-muted-foreground font-normal">
                        ({toNep(totalCount - displayed.length)} बाँकी)
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* All loaded */}
              {!hasMore && displayed.length > PAGE_SIZE && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  सबै {toNep(totalCount)} समाचार देखाइयो
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
