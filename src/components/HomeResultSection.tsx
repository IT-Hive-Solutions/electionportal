'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, CheckCircle2, RefreshCw, ChevronDown, X } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CountingStatus = 'not_started' | 'counting' | 'completed';

type FilterOption = { id: number; name: string };

type HomeCandidate = {
  id: number;
  full_name: string;
  photo: string | null;
  independent_candidate: boolean;
  is_winner: boolean;
  party: { name: string; short_name: string; color_code: string; symbol: string | null } | null;
  votes: number;
  rank: number | null;
};

type HomeConstituencyResult = {
  id: number;
  name: string;
  slug: string;
  counting_status: CountingStatus;
  district: { id: number; name: string; province: { id: number; name: string } } | null;
  candidates: HomeCandidate[];
  totalVotes: number;
};

type RawConstituency = {
  id: number;
  name: string;
  slug: string;
  counting_status: CountingStatus;
  district: { id: number; name: string; province: { id: number; name: string } } | null;
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
    party: { name: string; short_name: string; color_code: string; symbol: string | null } | null;
  } | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const NEPALI_DIGITS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};
function toNep(n: number | string) {
  return String(n).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d] ?? d);
}
function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('.');
}

// ─── Proxy fetcher ─────────────────────────────────────────────────────────────

async function proxyFetch<T>(collection: string, params: Record<string, unknown>): Promise<T> {
  const url = new URL(`/api/proxy/${collection}`, window.location.origin);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data as T;
}

// ─── Data loaders ──────────────────────────────────────────────────────────────

async function loadProvinces(): Promise<FilterOption[]> {
  return proxyFetch<FilterOption[]>('province', {
    fields: 'id,name',
    sort: 'name',
    limit: -1,
  });
}

async function loadDistricts(provinceId: number | null): Promise<FilterOption[]> {
  const params: Record<string, unknown> = { fields: 'id,name', sort: 'name', limit: -1 };
  if (provinceId) params.filter = JSON.stringify({ province: { id: { _eq: provinceId } } });
  return proxyFetch<FilterOption[]>('district', params);
}

async function loadConstituenciesForFilter(districtId: number | null): Promise<FilterOption[]> {
  const params: Record<string, unknown> = {
    fields: 'id,name',
    filter: JSON.stringify({
      //   is_result_active: { _eq: true },
      ...(districtId ? { district: { id: { _eq: districtId } } } : {}),
    }),
    sort: 'name',
    limit: -1,
  };
  return proxyFetch<FilterOption[]>('constituencies', params);
}

async function loadResults(opts: {
  provinceId: number | null;
  districtId: number | null;
  constituencyId: number | null;
  hotSeatOnly: boolean;
}): Promise<HomeConstituencyResult[]> {
  const { provinceId, districtId, constituencyId, hotSeatOnly } = opts;

  // Build constituency filter
  const filter: Record<string, unknown> = {
    // is_result_active: { _eq: true },
    // counting_status: { _in: ['counting', 'completed'] },
  };

  if (constituencyId) {
    filter['id'] = { _eq: constituencyId };
  } else if (districtId) {
    filter['district'] = { id: { _eq: districtId } };
  } else if (provinceId) {
    filter['district'] = { province: { id: { _eq: provinceId } } };
  } else if (hotSeatOnly) {
    filter['is_hot_seat'] = { _eq: true };
  }

  const constituencies = await proxyFetch<RawConstituency[]>('constituencies', {
    fields: 'id,name,slug,counting_status,district.id,district.name,district.province.id,district.province.name',
    filter: JSON.stringify(filter),
    sort: '-counting_status,name',
    limit: constituencyId ? 1 : 5,
  });

  if (!constituencies.length) return [];

  const ids = constituencies.map((c) => c.id);

  const electionResults = await proxyFetch<RawElectionResult[]>('election_result', {
    fields: [
      'id',
      'votes',
      'is_winner',
      'rank',
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
    filter: JSON.stringify({ constituency: { id: { _in: ids } } }),
    limit: -1,
  });

  // Group by constituency, sort by votes desc, take top 4
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

  return constituencies.map((c) => {
    const candidates = (grouped.get(c.id) ?? []).sort((a, b) => b.votes - a.votes).slice(0, 4);
    return {
      ...c,
      candidates,
      totalVotes: candidates.reduce((s, x) => s + x.votes, 0),
    };
  });
}

// ─── Dropdown component ────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: number | null;
  options: FilterOption[];
  onChange: (id: number | null) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 min-w-[130px]">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          disabled={disabled}
          className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border rounded-lg appearance-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );
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

// ─── Constituency result card ──────────────────────────────────────────────────

function ConstituencyResultCard({ c }: { c: HomeConstituencyResult }) {
  const isActive = c.counting_status === 'counting';
  const maxVotes = c.candidates[0]?.votes ?? 0;

  return (
    <Link
      href={`/results/${c.slug}`}
      className={`bg-background border rounded-xl overflow-hidden hover:shadow-md transition-all group flex flex-col ${
        isActive ? 'border-amber-300 dark:border-amber-700' : 'border-border hover:border-primary/30'
      }`}
    >
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
                {c.district.name} · {c.district.province?.name}
              </p>
            )}
          </div>
          {isActive ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shrink-0 font-semibold">
              <RefreshCw size={9} className="animate-spin" /> जारी
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 shrink-0 font-semibold">
              <CheckCircle2 size={9} /> सम्पन्न
            </span>
          )}
        </div>

        {/* Candidates */}
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
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${cand.is_winner ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-muted'}`}
                  >
                    {cand.is_winner ? (
                      <Trophy size={10} className="text-amber-500" />
                    ) : (
                      <span className="text-[9px] font-bold text-muted-foreground">{toNep(idx + 1)}</span>
                    )}
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 border"
                    style={{ backgroundColor: `${color}18`, color, borderColor: `${color}50` }}
                  >
                    {getInitials(cand.full_name)}
                  </div>
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function HomeResultsSection() {
  // Filter state
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<number | null>(null);

  // Filter options
  const [provinces, setProvinces] = useState<FilterOption[]>([]);
  const [districts, setDistricts] = useState<FilterOption[]>([]);
  const [constituencies, setConstituencies] = useState<FilterOption[]>([]);

  // Results
  const [results, setResults] = useState<HomeConstituencyResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const hasFilter = selectedProvince !== null || selectedDistrict !== null || selectedConstituency !== null;

  // Load provinces once
  useEffect(() => {
    loadProvinces().then(setProvinces).catch(console.error);
  }, []);

  // Load districts when province changes
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    if (selectedProvince) {
      loadDistricts(selectedProvince).then(setDistricts).catch(console.error);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // Load constituencies when district changes
  useEffect(() => {
    setSelectedConstituency(null);
    if (selectedDistrict) {
      loadConstituenciesForFilter(selectedDistrict).then(setConstituencies).catch(console.error);
    } else {
      setConstituencies([]);
    }
  }, [selectedDistrict]);

  // Fetch results whenever filters change
  const fetchResults = useCallback(
    async (showSpinner = false) => {
      showSpinner ? setIsFiltering(true) : setIsLoading(true);
      try {
        const data = await loadResults({
          provinceId: selectedProvince,
          districtId: selectedDistrict,
          constituencyId: selectedConstituency,
          hotSeatOnly: !hasFilter,
        });
        setResults(data);
      } catch (e) {
        console.error('[HomeResultsSection]', e);
      } finally {
        setIsLoading(false);
        setIsFiltering(false);
      }
    },
    [selectedProvince, selectedDistrict, selectedConstituency, hasFilter],
  );

  useEffect(() => {
    fetchResults(isLoading ? false : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict, selectedConstituency]);

  // Initial load
  useEffect(() => {
    fetchResults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedConstituency(null);
  };

  if (!isLoading && results.length === 0 && !hasFilter) return null;

  return (
    <section className="py-10 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">निर्वाचन परिणाम</h2>
              <p className="text-xs text-muted-foreground">
                {hasFilter ? 'फिल्टर अनुसार परिणाम' : 'हट सिट निर्वाचन क्षेत्रहरू'}
              </p>
            </div>
          </div>
          <Link
            href="/results"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            सबै हेर्नुहोस् <ChevronRight size={16} />
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3 mb-6 p-4 bg-background border border-border rounded-xl">
          <FilterSelect
            label="प्रदेश"
            value={selectedProvince}
            options={provinces}
            onChange={setSelectedProvince}
            placeholder="सबै प्रदेश"
          />
          <FilterSelect
            label="जिल्ला"
            value={selectedDistrict}
            options={districts}
            onChange={setSelectedDistrict}
            disabled={!selectedProvince}
            placeholder={selectedProvince ? 'सबै जिल्ला' : 'पहिले प्रदेश छान्नुस्'}
          />
          <FilterSelect
            label="निर्वाचन क्षेत्र"
            value={selectedConstituency}
            options={constituencies}
            onChange={setSelectedConstituency}
            disabled={!selectedDistrict}
            placeholder={selectedDistrict ? 'सबै क्षेत्र' : 'पहिले जिल्ला छान्नुस्'}
          />

          {hasFilter && (
            <button
              onClick={clearFilters}
              className="h-9 mt-auto flex items-center gap-1.5 px-3 text-xs font-semibold text-muted-foreground border border-border rounded-lg hover:text-red-500 hover:border-red-300 transition-colors"
            >
              <X size={13} /> फिल्टर हटाउनुस्
            </button>
          )}

          {isFiltering && (
            <div className="ml-auto mt-auto flex items-center gap-1.5 text-xs text-primary">
              <RefreshCw size={12} className="animate-spin" />
              <span>लोड हुँदैछ...</span>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
          ) : results.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2">
              <Trophy size={36} className="text-muted-foreground opacity-20" />
              <p className="text-sm text-muted-foreground font-medium">
                {hasFilter ? 'यस फिल्टरमा कुनै सक्रिय परिणाम छैन' : 'अहिले कुनै सक्रिय परिणाम उपलब्ध छैन'}
              </p>
              {hasFilter && (
                <button onClick={clearFilters} className="text-xs text-primary font-semibold mt-1 hover:underline">
                  फिल्टर हटाउनुस्
                </button>
              )}
            </div>
          ) : (
            results.map((c) => <ConstituencyResultCard key={c.id} c={c} />)
          )}
        </div>
      </div>
    </section>
  );
}
