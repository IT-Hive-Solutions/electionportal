"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Clock,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Timer,
  ChevronRight,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { endpoints } from "@/core/constants/endpoints";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CountingStatus = "not_started" | "counting" | "completed";

type CandidateResult = {
  id: number;
  full_name: string;
  slug: string;
  photo: string | null;
  independent_candidate: boolean;
  is_winner: boolean;
  party: {
    id: number;
    name: string;
    short_name: string;
    color_code: string;
    symbol: string | null;
  } | null;
  constituencyId: number;
  votes: number;
  round: number | null;
};

type ConstituencyResult = {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  counting_status: CountingStatus;
  district: {
    id: number;
    name: string;
    province: { id: number; name: string };
  } | null;
  candidates: CandidateResult[];
  totalVotes: number;
  lastUpdated: string | null;
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
function toNep(n: number | string) {
  return String(n).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d] ?? d);
}
function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join(".");
}

const REFRESH_MS = 30_000;

const STATUS_CFG: Record<
  CountingStatus,
  { label: string; cls: string; icon: React.ReactNode; pulse: boolean }
> = {
  not_started: {
    label: "मतगणना सुरु भएको छैन",
    cls: "bg-muted text-muted-foreground border border-border",
    icon: <Timer size={13} />,
    pulse: false,
  },
  counting: {
    label: "मतगणना जारी छ",
    cls: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
    icon: <RefreshCw size={13} className="animate-spin" />,
    pulse: true,
  },
  completed: {
    label: "मतगणना सम्पन्न",
    cls: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300",
    icon: <CheckCircle2 size={13} />,
    pulse: false,
  },
};

// ─── Proxy fetcher ─────────────────────────────────────────────────────────────

async function proxyFetch<T>(
  collection: string,
  params: Record<string, unknown>,
): Promise<T> {
  const url = new URL(`/api/proxy/${collection}`, window.location.origin);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null)
      url.searchParams.set(
        k,
        typeof v === "object" ? JSON.stringify(v) : String(v),
      );
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data as T;
}

// ─── Data loader ───────────────────────────────────────────────────────────────

type RawConstituency = {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  counting_status: CountingStatus;
  district: {
    id: number;
    name: string;
    province: { id: number; name: string };
  } | null;
};
type RawCandidate = {
  id: number;
  full_name: string;
  slug: string;
  photo: string | null;
  independent_candidate: boolean;
  is_winner: boolean;
  party: {
    id: number;
    name: string;
    short_name: string;
    color_code: string;
    symbol: string | null;
  } | null;
  constituency: { id: number } | null;
};
type RawResult = {
  id: number;
  candidate: number;
  votes: number;
  round: number | null;
};

async function loadResultData(): Promise<ConstituencyResult[]> {
  // 1. Active constituencies
  const constituencies = await proxyFetch<RawConstituency[]>("constituencies", {
    fields:
      "id,name,slug,code,counting_status,district.id,district.name,district.province.id,district.province.name",
    filter: JSON.stringify({ is_result_active: { _eq: true } }),
    sort: "name",
    limit: -1,
  });
  if (!constituencies.length) return [];

  const ids = constituencies.map((c) => c.id);

  // 2. Fetch candidates + results in parallel
  const [candidates, results] = await Promise.all([
    proxyFetch<RawCandidate[]>("candidates", {
      fields:
        "id,full_name,slug,photo,independent_candidate,is_winner,constituency.id,party.id,party.name,party.short_name,party.color_code,party.symbol",
      filter: JSON.stringify({ constituency: { id: { _in: ids } } }),
      limit: -1,
    }),
    proxyFetch<RawResult[]>("result", {
      fields: "id,candidate,votes,round",
      limit: -1,
    }),
  ]);

  // 3. Build vote map: candidateId → latest round entry
  const voteMap = new Map<number, { votes: number; round: number | null }>();
  for (const r of results) {
    const ex = voteMap.get(r.candidate);
    if (!ex || (r.round ?? 0) > (ex.round ?? 0))
      voteMap.set(r.candidate, { votes: r.votes, round: r.round });
  }

  // 4. Merge candidates + votes
  const merged: CandidateResult[] = candidates.map((c) => {
    const v = voteMap.get(c.id);
    return {
      id: c.id,
      full_name: c.full_name,
      slug: c.slug,
      photo: c.photo,
      independent_candidate: c.independent_candidate,
      is_winner: c.is_winner,
      party: c.party,
      constituencyId: c.constituency?.id ?? 0,
      votes: v?.votes ?? 0,
      round: v?.round ?? null,
    };
  });

  // 5. Group by constituency
  const grouped = new Map<number, CandidateResult[]>();
  for (const c of merged) {
    if (!grouped.has(c.constituencyId)) grouped.set(c.constituencyId, []);
    grouped.get(c.constituencyId)!.push(c);
  }

  return constituencies.map((c) => {
    const list = (grouped.get(c.id) ?? []).sort((a, b) => b.votes - a.votes);
    return {
      ...c,
      candidates: list,
      totalVotes: list.reduce((s, x) => s + x.votes, 0),
      lastUpdated: new Date().toISOString(),
    };
  });
}

// ─── VoteBar ───────────────────────────────────────────────────────────────────

function VoteBar({
  votes,
  maxVotes,
  color,
}: {
  votes: number;
  maxVotes: number;
  color: string;
}) {
  const pct = maxVotes > 0 ? Math.round((votes / maxVotes) * 100) : 0;
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground w-8 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}

// ─── CandidateRow ──────────────────────────────────────────────────────────────

function CandidateRow({
  candidate,
  rank,
  maxVotes,
}: {
  candidate: CandidateResult;
  rank: number;
  maxVotes: number;
}) {
  const color = candidate.party?.color_code ?? "#888";
  const partyName = candidate.independent_candidate
    ? "स्वतन्त्र"
    : (candidate.party?.name ?? "—");
  const photoUrl = candidate.photo
    ? `${endpoints.image.getRawImageById(candidate.photo)}?width=48&height=48&fit=cover&format=webp`
    : null;
  const symbolUrl =
    !candidate.independent_candidate && candidate.party?.symbol
      ? endpoints.image.getRawImageById(candidate.party.symbol)
      : null;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${candidate.is_winner ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" : rank === 1 ? "bg-card border border-primary/20" : "bg-background border border-border"}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rank === 1 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}
      >
        {candidate.is_winner ? (
          <Trophy size={13} className="text-amber-600" />
        ) : (
          toNep(rank)
        )}
      </div>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={candidate.full_name}
          className="w-10 h-10 rounded-full object-cover shrink-0 border-2"
          style={{ borderColor: color }}
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2"
          style={{ backgroundColor: `${color}20`, color, borderColor: color }}
        >
          {getInitials(candidate.full_name)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-foreground leading-tight truncate">
            {candidate.full_name}
          </span>
          {candidate.is_winner && (
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold dark:bg-green-900/40 dark:text-green-300">
              विजयी
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {symbolUrl && (
            <img src={symbolUrl} alt="" className="w-4 h-4 object-contain" />
          )}
          <span className="text-[11px] font-medium" style={{ color }}>
            {partyName}
          </span>
        </div>
        {candidate.votes > 0 && (
          <VoteBar votes={candidate.votes} maxVotes={maxVotes} color={color} />
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="text-base font-bold text-foreground tabular-nums">
          {toNep(candidate.votes.toLocaleString())}
        </div>
        <div className="text-[10px] text-muted-foreground">मत</div>
      </div>
    </div>
  );
}

// ─── ConstituencyCard ──────────────────────────────────────────────────────────

function ConstituencyCard({ c }: { c: ConstituencyResult }) {
  const status = c.counting_status ?? "not_started";
  const cfg = STATUS_CFG[status];
  const maxVotes = c.candidates[0]?.votes ?? 0;
  const winner = c.candidates.find((x) => x.is_winner);
  console.log({ c });

  return (
    <div
      className={`bg-card border rounded-2xl overflow-hidden ${cfg.pulse ? "border-amber-300 dark:border-amber-700" : "border-border"}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-foreground text-base leading-tight">
              {c.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin size={11} />
              <span>
                {c.district?.name ?? "—"} · {c.district?.province?.name ?? "—"}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
        {c.totalVotes > 0 && (
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart2 size={12} />
              <span>
                कुल मत:{" "}
                <span className="font-semibold text-foreground">
                  {toNep(c.totalVotes.toLocaleString())}
                </span>
              </span>
            </div>
            {winner && (
              <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                <Trophy size={11} />
                <span className="font-semibold">{winner.full_name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {status === "not_started" ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Timer size={22} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              मतगणना सुरु भएको छैन
            </p>
            <p className="text-xs text-muted-foreground text-center">
              यस निर्वाचन क्षेत्रको मतगणना चाँडै सुरु हुनेछ
            </p>
          </div>
        ) : c.candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 size={22} className="text-muted-foreground animate-spin" />
            <p className="text-xs text-muted-foreground">डेटा लोड हुँदैछ...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {c.candidates.map((x, i) => (
              <CandidateRow
                key={x.id}
                candidate={x}
                rank={i + 1}
                maxVotes={maxVotes}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <Link
          href={`/results/${c.slug}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <Trophy size={13} /> विस्तृत परिणाम हेर्नुहोस्
        </Link>
        <Link
          href={`/candidates?constituencyId=${c.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          सबै उम्मेदवार हेर्नुहोस् <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border border-border rounded-xl"
          >
            <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 bg-muted rounded" />
              <div className="h-2.5 w-20 bg-muted rounded" />
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </div>
            <div className="h-5 w-14 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const [constituencies, setConstituencies] = useState<ConstituencyResult[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasActive = constituencies.some(
    (c) => c.counting_status === "counting",
  );

  const load = useCallback(async (refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const data = await loadResultData();
      setConstituencies(data);
      setLastRefresh(new Date());
      setCountdown(REFRESH_MS / 1000);
    } catch (e) {
      console.error(e);
      setError("परिणाम लोड गर्न सकिएन।");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cdRef.current) clearInterval(cdRef.current);
    if (!hasActive) return;
    timerRef.current = setInterval(() => load(true), REFRESH_MS);
    cdRef.current = setInterval(
      () => setCountdown((p) => (p <= 1 ? REFRESH_MS / 1000 : p - 1)),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cdRef.current) clearInterval(cdRef.current);
    };
  }, [hasActive, load]);

  const completedCount = constituencies.filter(
    (c) => c.counting_status === "completed",
  ).length;
  const countingCount = constituencies.filter(
    (c) => c.counting_status === "counting",
  ).length;
  const notStartedCount = constituencies.filter(
    (c) => c.counting_status === "not_started",
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} /> गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      {/* Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Trophy size={28} className="text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  निर्वाचन परिणाम
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                निर्वाचन क्षेत्र अनुसार मतगणना र परिणाम
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasActive && !isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {toNep(countdown)}s मा अपडेट हुनेछ
                </div>
              )}
              <button
                onClick={() => load(true)}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-full hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={isRefreshing ? "animate-spin" : ""}
                />{" "}
                रिफ्रेश
              </button>
            </div>
          </div>

          {!isLoading && constituencies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800 font-semibold">
                <CheckCircle2 size={12} />
                {toNep(completedCount)} सम्पन्न
              </div>
              {countingCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800 font-semibold">
                  <RefreshCw size={12} className="animate-spin" />
                  {toNep(countingCount)} जारी
                </div>
              )}
              {notStartedCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-muted text-muted-foreground rounded-full border border-border font-semibold">
                  <Clock size={12} />
                  {toNep(notStartedCount)} प्रतीक्षारत
                </div>
              )}
              {lastRefresh && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Clock size={11} /> अन्तिम अपडेट:{" "}
                  {lastRefresh.toLocaleTimeString("ne-NP")}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertCircle size={40} className="text-red-400" />
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={() => load()}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-sm"
              >
                पुनः प्रयास
              </button>
            </div>
          )}

          {!isLoading && !error && constituencies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Trophy size={48} className="text-muted-foreground opacity-30" />
              <p className="text-foreground font-semibold">
                कुनै सक्रिय निर्वाचन क्षेत्र छैन
              </p>
              {/* <p className="text-sm text-muted-foreground">
                Directus admin मा{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  is_result_active
                </code>{" "}
                सक्षम गर्नुहोस्
              </p> */}
            </div>
          )}

          {!isLoading && !error && constituencies.length > 0 && (
            <>
              {(
                ["counting", "completed", "not_started"] as CountingStatus[]
              ).map((status) => {
                const group = constituencies.filter(
                  (c) => c.counting_status === status,
                );
                if (!group.length) return null;
                const label =
                  status === "counting"
                    ? "मतगणना जारी"
                    : status === "completed"
                      ? "मतगणना सम्पन्न"
                      : "मतगणना सुरु भएको छैन";
                return (
                  <div key={status} className="mb-10">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${status === "counting" ? "bg-amber-500 animate-pulse" : status === "completed" ? "bg-green-500" : "bg-muted-foreground"}`}
                      />
                      {label}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {group.map((c) => (
                        <ConstituencyCard key={c.id} c={c} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {isRefreshing && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-card border border-border shadow-lg rounded-full px-4 py-2 text-xs font-semibold z-50">
              <Loader2 size={14} className="animate-spin text-primary" /> अपडेट
              हुँदैछ...
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
