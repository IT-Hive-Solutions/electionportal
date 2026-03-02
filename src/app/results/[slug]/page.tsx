"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Timer,
  BarChart2,
  AlertCircle,
  Clock,
  Users,
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
  votes: number;
  round: number | null;
};

type ConstituencyDetail = {
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
};
type RawResult = {
  id: number;
  candidate: number;
  votes: number;
  round: number | null;
};

async function loadConstituencyResult(
  slug: string,
): Promise<ConstituencyDetail | null> {
  // 1. Fetch constituency by slug
  const constituencies = await proxyFetch<RawConstituency[]>("constituencies", {
    fields:
      "id,name,slug,code,counting_status,district.id,district.name,district.province.id,district.province.name",
    filter: JSON.stringify({ slug: { _eq: slug } }),
    limit: 1,
  });
  const c = constituencies[0];
  if (!c) return null;

  // 2. Fetch candidates for this constituency + all results in parallel
  const [candidates, results] = await Promise.all([
    proxyFetch<RawCandidate[]>("candidates", {
      fields:
        "id,full_name,slug,photo,independent_candidate,is_winner,party.id,party.name,party.short_name,party.color_code,party.symbol",
      filter: JSON.stringify({ constituency: { id: { _eq: c.id } } }),
      limit: -1,
    }),
    proxyFetch<RawResult[]>("result", {
      fields: "id,candidate,votes,round",
      // Filter results where the candidate belongs to this constituency
      // using a deep relational filter
      filter: JSON.stringify({
        candidate: { constituency: { id: { _eq: c.id } } },
      }),
      limit: -1,
    }),
  ]);

  // 3. Build vote map — keep latest round per candidate
  const voteMap = new Map<number, { votes: number; round: number | null }>();
  for (const r of results) {
    const ex = voteMap.get(r.candidate);
    if (!ex || (r.round ?? 0) > (ex.round ?? 0))
      voteMap.set(r.candidate, { votes: r.votes, round: r.round });
  }

  // 4. Merge candidates + votes, sort by votes desc
  const merged: CandidateResult[] = candidates
    .map((x) => {
      const v = voteMap.get(x.id);
      return {
        ...x,
        votes: parseInt(v?.votes?.toString() ?? "0") ?? 0,
        round: parseInt(v?.round?.toString() ?? "0") ?? null,
      };
    })
    .sort((a, b) => b.votes - a.votes);

  const totalVotes = merged.reduce((s, x) => s + x.votes, 0);

  return {
    ...c,
    candidates: merged,
    totalVotes,
    lastUpdated: new Date().toISOString(),
  };
}

// ─── VoteBar ───────────────────────────────────────────────────────────────────

function VoteBar({
  votes,
  totalVotes,
  color,
}: {
  votes: number;
  totalVotes: number;
  color: string;
}) {
  const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  return (
    <div className="mt-2">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-muted-foreground mt-0.5 block">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── CandidateRow ──────────────────────────────────────────────────────────────

function CandidateRow({
  candidate,
  rank,
  totalVotes,
}: {
  candidate: CandidateResult;
  rank: number;
  totalVotes: number;
}) {
  const color = candidate.party?.color_code ?? "#888";
  const partyName = candidate.independent_candidate
    ? "स्वतन्त्र"
    : (candidate.party?.name ?? "—");
  const photoUrl = candidate.photo
    ? `${endpoints.image.getRawImageById(candidate.photo)}?width=64&height=64&fit=cover&format=webp`
    : null;
  const symbolUrl =
    !candidate.independent_candidate && candidate.party?.symbol
      ? endpoints.image.getRawImageById(candidate.party.symbol)
      : null;

  return (
    <div
      className={`p-4 rounded-2xl transition-all ${candidate.is_winner ? "bg-green-50 border-2 border-green-300 dark:bg-green-900/20 dark:border-green-700" : rank === 1 ? "bg-card border-2 border-primary/30" : "bg-card border border-border"}`}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${rank === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
        >
          {candidate.is_winner ? (
            <Trophy size={16} className="text-amber-500" />
          ) : (
            toNep(rank)
          )}
        </div>

        {/* Photo */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={candidate.full_name}
            className="w-14 h-14 rounded-full object-cover border-2 shrink-0"
            style={{ borderColor: color }}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0"
            style={{ backgroundColor: `${color}20`, color, borderColor: color }}
          >
            {getInitials(candidate.full_name)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-bold text-foreground">
              {candidate.full_name}
            </span>
            {candidate.is_winner && (
              <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold dark:bg-green-900/40 dark:text-green-300">
                विजयी
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {symbolUrl && (
              <img src={symbolUrl} alt="" className="w-5 h-5 object-contain" />
            )}
            <span className="text-sm font-semibold" style={{ color }}>
              {partyName}
            </span>
          </div>
          <VoteBar
            votes={candidate.votes}
            totalVotes={totalVotes}
            color={color}
          />
        </div>

        {/* Vote count */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-foreground tabular-nums leading-none">
            {toNep(candidate.votes.toLocaleString())}
          </div>
          <div className="text-xs text-muted-foreground mt-1">मत</div>
          {candidate.round != null && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              राउन्ड {toNep(candidate.round)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConstituencyResultPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<ConstituencyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  console.log({ data });

  const load = useCallback(
    async (refresh = false) => {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);
      try {
        const result = await loadConstituencyResult(slug);
        setData(result);
        setCountdown(REFRESH_MS / 1000);
      } catch (e) {
        console.error(e);
        setError("परिणाम लोड गर्न सकिएन।");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh only while counting
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cdRef.current) clearInterval(cdRef.current);
    if (data?.counting_status !== "counting") return;

    timerRef.current = setInterval(() => load(true), REFRESH_MS);
    cdRef.current = setInterval(
      () => setCountdown((p) => (p <= 1 ? REFRESH_MS / 1000 : p - 1)),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cdRef.current) clearInterval(cdRef.current);
    };
  }, [data?.counting_status, load]);

  const status = data?.counting_status ?? "not_started";
  const winner = data?.candidates.find((c) => c.is_winner);
  const leader = data?.candidates[0];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <Link
          href="/result"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} /> सबै परिणाममा फर्कनुहोस्
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <Loader2 size={36} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">लोड हुँदैछ...</p>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
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

      {/* Not found */}
      {!isLoading && !error && !data && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <Trophy size={48} className="text-muted-foreground opacity-30" />
          <p className="text-foreground font-semibold">
            निर्वाचन क्षेत्र फेला परेन
          </p>
          <Link href="/result" className="text-sm text-primary font-semibold">
            ← परिणाम पृष्ठमा जानुहोस्
          </Link>
        </div>
      )}

      {/* Main content */}
      {data && !isLoading && (
        <>
          {/* Hero */}
          <section className="bg-card border-b border-border py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {data.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin size={14} />
                    <span>
                      {data.district?.name ?? "—"} ·{" "}
                      {data.district?.province?.name ?? "—"}
                    </span>
                    {data.code && (
                      <span className="ml-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                        क्षेत्र नं. {toNep(data.code)}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {status === "not_started" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border">
                        <Timer size={13} /> मतगणना सुरु भएको छैन
                      </span>
                    )}
                    {status === "counting" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
                        <RefreshCw size={13} className="animate-spin" /> मतगणना
                        जारी छ
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle2 size={13} /> मतगणना सम्पन्न
                      </span>
                    )}
                    {status === "counting" && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {toNep(countdown)}s मा अपडेट
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => load(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-full hover:bg-muted transition-colors disabled:opacity-50 self-start"
                >
                  <RefreshCw
                    size={13}
                    className={isRefreshing ? "animate-spin" : ""}
                  />{" "}
                  रिफ्रेश
                </button>
              </div>

              {/* Stats */}
              {data.candidates.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                  <div className="bg-background border border-border rounded-xl p-3 text-center">
                    <Users size={18} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">उम्मेदवार</p>
                    <p className="text-lg font-bold text-foreground">
                      {toNep(data.candidates.length)}
                    </p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3 text-center">
                    <BarChart2
                      size={18}
                      className="text-primary mx-auto mb-1"
                    />
                    <p className="text-xs text-muted-foreground">कुल मत</p>
                    <p className="text-lg font-bold text-foreground">
                      {toNep(data.totalVotes.toLocaleString())}
                    </p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                    <Trophy size={18} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {status === "completed" ? "विजेता" : "अग्रणी"}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {winner?.full_name ?? leader?.full_name ?? "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Candidates */}
          <section className="py-8 flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {status === "not_started" ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <Timer size={36} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground mb-2">
                      मतगणना सुरु भएको छैन
                    </p>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      यस निर्वाचन क्षेत्रको मतगणना सुरु हुनासाथ यहाँ परिणाम
                      देखिनेछ।
                    </p>
                  </div>
                  <Link
                    href={`/candidates?constituencyId=${data.id}`}
                    className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    उम्मेदवारहरू हेर्नुहोस्
                  </Link>
                </div>
              ) : data.candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2
                    size={28}
                    className="text-muted-foreground animate-spin"
                  />
                  <p className="text-sm text-muted-foreground">
                    मतगणना डेटा उपलब्ध छैन
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    मत विवरण
                  </h2>
                  <div className="flex flex-col gap-3">
                    {data.candidates.map((c, i) => (
                      <CandidateRow
                        key={c.id}
                        candidate={c}
                        rank={i + 1}
                        totalVotes={data.totalVotes}
                      />
                    ))}
                  </div>
                  {data.lastUpdated && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-6 justify-end">
                      <Clock size={11} /> अन्तिम अपडेट:{" "}
                      {new Date(data.lastUpdated).toLocaleTimeString("ne-NP")}
                    </p>
                  )}
                </>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <Link
                  href={`/candidates?constituencyId=${data.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <Users size={16} /> यस क्षेत्रका सबै उम्मेदवार हेर्नुहोस्
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {isRefreshing && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-card border border-border shadow-lg rounded-full px-4 py-2 text-xs font-semibold z-50">
          <Loader2 size={14} className="animate-spin text-primary" /> अपडेट
          हुँदैछ...
        </div>
      )}

      <Footer />
    </div>
  );
}
