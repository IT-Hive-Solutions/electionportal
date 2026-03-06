'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { endpoints } from '@/core/constants/endpoints';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CountingStatus = 'not_started' | 'counting' | 'completed';

type HomeCandidate = {
  id: number;
  full_name: string;
  photo: string | null;
  independent_candidate: boolean;
  is_winner: boolean;
  party: {
    name: string;
    short_name: string;
    color_code: string;
    symbol: string | null;
  } | null;
  votes: number;
  rank: number | null;
};

type HomeConstituencyResult = {
  id: number;
  name: string;
  slug: string;
  counting_status: CountingStatus;
  district: { name: string } | null;
  candidates: HomeCandidate[];
  totalVotes: number;
};

// ─── Raw types from Directus ───────────────────────────────────────────────────

type RawConstituency = {
  id: number;
  name: string;
  slug: string;
  counting_status: CountingStatus;
  district: { name: string } | null;
};

type RawElectionResult = {
  id: number;
  votes: number;
  is_winner: boolean;
  rank: number | null;
  constituency: { id: number } | null;
  candidate: {
    id: number;
    full_name: string;
    photo: string | null;
    independent_candidate: boolean;
    party: {
      name: string;
      short_name: string;
      color_code: string;
      symbol: string | null;
    } | null;
  } | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const NEPALI_DIGITS: Record<string, string> = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
};

function toNep(n: number | string) {
  return String(n).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d] ?? d);
}

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('.');
}

// ─── Fetcher ───────────────────────────────────────────────────────────────────

async function proxyFetch<T>(collection: string, params: Record<string, unknown>): Promise<T> {
  const url = new URL(`/api/proxy/${collection}`, window.location.origin);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null)
      url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data as T;
}

// ─── Data loader ───────────────────────────────────────────────────────────────

async function loadHomeResults(): Promise<HomeConstituencyResult[]> {
  // 1. Fetch top 5 active constituencies (counting or completed first)
  const constituencies = await proxyFetch<RawConstituency[]>('constituencies', {
    fields: 'id,name,slug,counting_status,district.name',
    filter: JSON.stringify({
      counting_status: { _in: ['counting', 'completed'] },
    }),
    sort: '-counting_status', 
    limit: 5,
  });

  if (!constituencies.length) return [];

  const ids = constituencies.map((c) => c.id);

  // 2. Fetch election_result records for these constituencies
  // — directly filtered by election_result.constituency (confirmed M2O field)
  const electionResults = await proxyFetch<RawElectionResult[]>('election_result', {
    fields: [
      'id', 'votes', 'is_winner', 'rank',
      'constituency.id',
      'candidate.id',
      'candidate.full_name',
      'candidate.photo',
      'candidate.independent_candidate',
      'candidate.party.name',
      'candidate.party.short_name',
      'candidate.party.color_code',
      'candidate.party.symbol',
    ].join(','),
    filter: JSON.stringify({
      constituency: { id: { _in: ids } },
    }),
    limit: -1,
  });

  // 3. Group results by constituency, sort by votes desc, take top 4
  const grouped = new Map<number, HomeCandidate[]>();

  for (const r of electionResults) {
    if (!r.candidate || !r.constituency) continue;
    const cid = r.constituency.id;
    if (!grouped.has(cid)) grouped.set(cid, []);
    grouped.get(cid)!.push({
      id: r.candidate.id,
      full_name: r.candidate.full_name,
      photo: r.candidate.photo,
      independent_candidate: r.candidate.independent_candidate,
      is_winner: r.is_winner,
      party: r.candidate.party,
      votes: r.votes ?? 0,
      rank: r.rank,
    });
  }

  // 4. Build final list — sort candidates by votes desc, slice top 4
  return constituencies.map((c) => {
    const candidates = (grouped.get(c.id) ?? [])
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 4);
    return {
      ...c,
      candidates,
      totalVotes: candidates.reduce((s, x) => s + x.votes, 0),
    };
  });
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-muted" />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-muted rounded" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
          <div className="h-4 w-12 bg-muted rounded-full" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
            <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <div className="h-2.5 w-20 bg-muted rounded" />
                <div className="h-2.5 w-10 bg-muted rounded" />
              </div>
              <div className="h-1 w-full bg-muted rounded-full" />
            </div>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-border flex justify-between">
          <div className="h-2.5 w-14 bg-muted rounded" />
          <div className="h-2.5 w-16 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Single constituency result card ──────────────────────────────────────────

function ConstituencyResultCard({ c }: { c: HomeConstituencyResult }) {
  const isActive = c.counting_status === 'counting';
  const maxVotes = c.candidates[0]?.votes ?? 0;

  return (
    <Link
      href={`/result/${c.slug}`}
      className={`bg-background border rounded-xl overflow-hidden hover:shadow-md transition-all group flex flex-col ${
        isActive
          ? 'border-amber-300 dark:border-amber-700'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isActive ? 'bg-amber-400' : 'bg-primary'}`} />

      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {c.name}
            </h3>
            {c.district && (
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {c.district.name}
              </p>
            )}
          </div>
          {isActive ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shrink-0 font-semibold">
              <RefreshCw size={9} className="animate-spin" />
              जारी
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 shrink-0 font-semibold">
              <CheckCircle2 size={9} />
              सम्पन्न
            </span>
          )}
        </div>

        {/* Candidate rows */}
        {c.candidates.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 flex-1 flex items-center justify-center">
            मतगणना डेटा छैन
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 flex-1">
            {c.candidates.map((cand, idx) => {
              const color = cand.party?.color_code ?? '#888';
              const pct = maxVotes > 0 ? Math.round((cand.votes / maxVotes) * 100) : 0;

              return (
                <div key={cand.id} className="flex items-center gap-2">
                  {/* Rank badge */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      cand.is_winner
                        ? 'bg-amber-100 dark:bg-amber-900/40'
                        : 'bg-muted'
                    }`}
                  >
                    {cand.is_winner
                      ? <Trophy size={10} className="text-amber-500" />
                      : <span className="text-[9px] font-bold text-muted-foreground">{toNep(idx + 1)}</span>
                    }
                  </div>

                  {/* Avatar — initials only for compactness */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 border"
                    style={{
                      backgroundColor: `${color}18`,
                      color,
                      borderColor: `${color}50`,
                    }}
                  >
                    {getInitials(cand.full_name)}
                  </div>

                  {/* Name + vote bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[11px] font-semibold text-foreground truncate leading-none">
                        {cand.full_name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 font-medium">
                        {toNep(cand.votes.toLocaleString())}
                      </span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer: total votes */}
        {c.totalVotes > 0 && (
          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">कुल मत</span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {toNep(c.totalVotes.toLocaleString())}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Main exported component ───────────────────────────────────────────────────

export default function HomeResultsSection() {
  const [results, setResults] = useState<HomeConstituencyResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeResults()
      .then(setResults)
      .catch((e) => console.error('[HomeResultsSection]', e))
      .finally(() => setIsLoading(false));
  }, []);

  // Don't render the section at all if no data and not loading
  if (!isLoading && results.length === 0) return null;

  return (
    <section className="py-10 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">निर्वाचन परिणाम</h2>
              <p className="text-xs text-muted-foreground">मतगणना अद्यावधिक</p>
            </div>
          </div>
          <Link
            href="/results"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            सबै हेर्नुहोस्
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading
            ? [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
            : results.map((c) => <ConstituencyResultCard key={c.id} c={c} />)
          }
        </div>

      </div>
    </section>
  );
}