'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  Award,
  MapPin,
  ChevronRight,
  Users,
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Filter,
  Building2,
  Loader2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import GoogleAdSense from '@/components/GoogleAdSense';
import { useReportData } from '@/core/hooks/candidates/use-candidates-report-data';
import {
  genderDistributionMockData,
  ageDistributionMockData,
  educationDistributionMockData,
  partyWiseCandidatesMockData,
} from '@/core/constants/candidates-mock-data';
import { toNepaliNumber } from '@/core/lib/nepali-number';
import { BAR_COLORS } from '@/core/constants/bra-graps-colors';
import {
  useFilterOptions,
  useCandidatesSearch,
  useCandidateDetail,
  type DirectusCandidate,
  type CandidateFilters,
} from '@/core/hooks/candidates/use-candidates-search';
import { endpoints } from '@/core/constants/endpoints';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('.');
}

function genderLabel(g: string) {
  return g === 'male' ? 'पुरुष' : g === 'female' ? 'महिला' : 'अन्य';
}

// ─── Candidate Card ───────────────────────────────────────────────────────────

function CandidateCard({ candidate, onClick }: { candidate: DirectusCandidate; onClick: () => void }) {
  const partyColor = candidate.party?.color_code ?? `hsl(${Math.random() * 360}, 70%, 50%)`;
  const initials = getInitials(candidate.full_name);
  const partyName = candidate.independent_candidate ? 'स्वतन्त्र' : (candidate.party?.name ?? '—');
  const partySymbol = candidate.independent_candidate
    ? '/swastik.png'
    : candidate.party?.symbol
      ? endpoints.image.getRawImageById(candidate.party?.symbol)
      : null;
  return (
    <button
      onClick={onClick}
      className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all text-left w-full"
    >
      <div className="h-1.5" style={{ backgroundColor: partyColor }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          {partySymbol ? (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 overflow-hidden"
              style={{
                color: partyColor,
                borderColor: partyColor,
                backgroundColor: `${partyColor}15`,
              }}
            >
              <img src={partySymbol} alt={`${partyName} symbol`} className="w-8 h-8 object-contain" />
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 border-2"
              style={{
                color: partyColor,
                borderColor: partyColor,
                backgroundColor: `${partyColor}15`,
              }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base">{candidate.full_name}</h3>
            <p className="text-xs font-semibold" style={{ color: partyColor }}>
              {partyName}
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
              <MapPin size={12} />
              <span>{candidate.constituency?.name ?? '—'}</span>
            </div>
          </div>
        </div>

        {candidate.profession && (
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{candidate.profession}</p>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {genderLabel(candidate.gender)} | उमेर {toNepaliNumber(candidate.age)}
          </span>
          {candidate.is_winner && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">विजयी</span>
          )}
          <span className="text-xs text-primary font-semibold flex items-center gap-1">
            विस्तृत हेर्नुहोस् <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Candidate Detail View ────────────────────────────────────────────────────

function CandidateDetailView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const { candidate: c, isLoading, error } = useCandidateDetail(slug);
  const partyColor = c?.party?.color_code ?? '#666';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          उम्मेदवार सूचीमा फर्कनुहोस्
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={36} />
        </div>
      )}

      {error && <div className="max-w-7xl mx-auto px-4 py-10 text-center text-red-500">{error}</div>}

      {c && !isLoading && (
        <>
          {/* Hero */}
          <section className="bg-card border-b border-border py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${partyColor}20`,
                    color: partyColor,
                  }}
                >
                  {getInitials(c.full_name)}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-1">{c.full_name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${partyColor}20`,
                        color: partyColor,
                      }}
                    >
                      {c.independent_candidate ? 'स्वतन्त्र' : (c.party?.name ?? '—')}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {c.constituency?.name ?? '—'}
                    </span>
                    <span className="text-sm text-muted-foreground">उमेर: {toNepaliNumber(c.age)}</span>
                    <span className="text-sm text-muted-foreground">{genderLabel(c.gender)}</span>
                    {c.is_winner && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        विजयी
                      </span>
                    )}
                  </div>
                  {c.profession && <p className="text-foreground text-sm italic">{c.profession}</p>}
                </div>
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Education */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">शिक्षा</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{c.education ?? 'उपलब्ध छैन'}</p>
                </div>
                {/* Previous Position */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">पूर्व पद</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{c.previous_position ?? 'उपलब्ध छैन'}</p>
                </div>
                {/* Constituency */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">जिल्ला / प्रदेश</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.constituency?.district?.name ?? '—'} / {c.constituency?.district?.province?.name ?? '—'}
                  </p>
                </div>
                {/* Independent */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">उम्मेदवारी</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.independent_candidate ? 'स्वतन्त्र' : 'दलीय'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      <Footer />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Candidates() {
  // Chart filter state (shared with report data hook)
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedParty, setSelectedParty] = useState('all');

  // Search section filter state (independent, more granular)
  const [searchFilters, setSearchFilters] = useState<CandidateFilters>({
    province: 'all',
    district: 'all',
    constituency: 'all',
    gender: 'all',
    party: 'all',
  });

  const [selectedCandidateSlug, setSelectedCandidateSlug] = useState<string | null>(null);
  const [electionType, setElectionType] = useState<'direct' | 'proportional'>('direct');

  // ── Report data (charts) ──
  const { data: reportData } = useReportData({
    province: selectedProvince,
    district: selectedDistrict,
    party: selectedParty,
  });

  const {
    summary,
    genderDistribution = genderDistributionMockData,
    partyWiseCandidates = partyWiseCandidatesMockData,
    ageDistribution = ageDistributionMockData,
    educationDistribution = educationDistributionMockData,
  } = reportData ?? {};

  const totalCandidates = summary?.totalCandidates ?? 0;
  const totalIndependent = summary?.totalIndependent ?? 0;

  // ── Filter options from Directus ──
  const { provinces, districts, constituencies, parties } = useFilterOptions(
    searchFilters.province,
    searchFilters.district,
  );

  // ── Candidates search ──
  const {
    candidates,
    totalCount,
    isLoading: candidatesLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    loadAll,
  } = useCandidatesSearch(searchFilters);

  // ── Handlers ──
  const handleProvinceChange = useCallback((value: string) => {
    setSearchFilters({
      province: value,
      district: 'all',
      constituency: 'all',
      gender: 'all',
      party: 'all',
    });
  }, []);

  const handleDistrictChange = useCallback((value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      district: value,
      constituency: 'all',
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchFilters({
      province: 'all',
      district: 'all',
      constituency: 'all',
      gender: 'all',
      party: 'all',
    });
  }, []);

  const processedEducationDistribution = useMemo(() => {
    if (!educationDistribution) return [];

    if (educationDistribution.length <= 5) {
      return educationDistribution;
    }

    const sorted = [...educationDistribution].sort((a, b) => b.value - a.value);

    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const otherTotal = others.reduce((sum, item) => sum + item.value, 0);

    return [
      ...top4,
      {
        name: 'अन्य',
        value: otherTotal,
        color: '#D1D5DB',
      },
    ];
  }, [educationDistribution]);

  // ── Detail view ──
  if (selectedCandidateSlug) {
    return (
      <CandidateDetailView
        slug={selectedCandidateSlug}
        onBack={() => {
          setSelectedCandidateSlug(null);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const processedPartyWiseCandidates = useMemo(() => {
    if (!partyWiseCandidates) return [];

    if (partyWiseCandidates.length <= 5) {
      return partyWiseCandidates;
    }

    const sorted = [...partyWiseCandidates].sort((a, b) => b.candidates - a.candidates);

    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const otherTotal = others.reduce((sum, item) => sum + item.candidates, 0);

    return [
      ...top4,
      {
        party: 'अन्य',
        candidates: otherTotal,
      },
    ];
  }, [partyWiseCandidates]);
  /* ─── Main Page ─── */
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      {/* Page Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Award size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">उम्मेदवार निर्देशिका</h1>
          </div>
          <p className="text-muted-foreground">नेपाल भरिका सबै उम्मेदवारहरूको विस्तृत जानकारी, तथ्याङ्क र खोजी</p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Users size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">कुल उम्मेदवार</p>
              <p className="text-xl font-bold text-foreground">{toNepaliNumber(totalCandidates.toLocaleString())}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <UserCheck size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">पुरुष / महिला</p>
              <p className="text-xl font-bold text-foreground">
                {toNepaliNumber(genderDistribution.find((d) => d.name === 'पुरुष')?.value?.toLocaleString() ?? '0')}
                {' / '}
                {toNepaliNumber(genderDistribution.find((d) => d.name === 'महिला')?.value?.toLocaleString() ?? '0')}
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Building2 size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">दलगत उम्मेदवार</p>
              <p className="text-xl font-bold text-foreground">{toNepaliNumber(totalCandidates - totalIndependent)}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Award size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">स्वतन्त्र उम्मेदवार</p>
              <p className="text-xl font-bold text-foreground">{toNepaliNumber(totalIndependent)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Filter size={22} className="text-primary" /> उम्मेदवार तथ्याङ्क
          </h2>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setElectionType('direct')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${electionType === 'direct' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
            >
              प्रत्यक्ष (१६५ सिट)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">दलगत उम्मेदवार संख्या</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedPartyWiseCandidates} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                  <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />

                  <YAxis
                    type="category"
                    dataKey="party"
                    width={80}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'उम्मेदवार']}
                  />

                  <Bar dataKey="candidates" radius={[0, 6, 6, 0]}>
                    {processedPartyWiseCandidates.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">लिङ्ग अनुसार वितरण</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      totalCandidates > 0 ? `${name} ${Math.round((value / totalCandidates) * 100)}%` : name
                    }
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                  >
                    {genderDistribution.map((g, i) => (
                      <Cell key={i} fill={g.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'उम्मेदवार']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">उमेर समूह अनुसार</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="group" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'उम्मेदवार']}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">शैक्षिक योग्यता</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={processedEducationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      totalCandidates > 0 ? `${name} ${Math.round((value / totalCandidates) * 100)}%` : name
                    }
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                  >
                    {processedEducationDistribution.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'उम्मेदवार']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <AdBanner type="in-content" />

      {/* ── Search Section ── */}
      <section className="py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Filter size={22} className="text-primary" /> उम्मेदवार खोज्नुहोस्
          </h2>

          {/* Filter Panel */}
          <div className="bg-background rounded-xl border border-border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Province */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">प्रदेश</label>
                <select
                  value={searchFilters.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {provinces.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">जिल्ला</label>
                <select
                  value={searchFilters.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={searchFilters.province === 'all'}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                >
                  {districts.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Constituency */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">निर्वाचन क्षेत्र</label>
                <select
                  value={searchFilters.constituency}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      constituency: e.target.value,
                    }))
                  }
                  disabled={searchFilters.district === 'all'}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                >
                  {constituencies.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">लिङ्ग</label>
                <select
                  value={searchFilters.gender}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="all">सबै</option>
                  <option value="male">पुरुष</option>
                  <option value="female">महिला</option>
                  <option value="other">अन्य</option>
                </select>
              </div>

              {/* Party */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">राजनीतिक दल</label>
                <select
                  value={searchFilters.party}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      party: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {parties.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2.5 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  फिल्टर रिसेट गर्नुहोस्
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {candidatesLoading ? (
                'खोजिँदैछ...'
              ) : (
                <>
                  {toNepaliNumber(totalCount)} उम्मेदवार भेटियो
                  {candidates.length < totalCount && ` (${toNepaliNumber(candidates.length)} देखाइएको)`}
                </>
              )}
            </p>
          </div>

          {/* Candidates Grid */}
          {candidatesLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => {
                      setSelectedCandidateSlug(candidate.slug);
                      window.scrollTo(0, 0);
                    }}
                  />
                ))}
              </div>

              {/* Load More / Load All */}
              {hasMore && (
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-3 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoadingMore ? <Loader2 className="animate-spin" size={16} /> : null}
                    अर्को {toNepaliNumber(Math.min(6, totalCount - candidates.length))} उम्मेदवार
                  </button>
                  <button
                    onClick={loadAll}
                    disabled={isLoadingMore}
                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoadingMore ? <Loader2 className="animate-spin" size={16} /> : null}
                    सबै {toNepaliNumber(totalCount)} उम्मेदवार हेर्नुहोस्
                  </button>
                </div>
              )}

              {/* Empty State */}
              {candidates.length === 0 && (
                <div className="bg-background border border-border rounded-xl p-8 text-center">
                  <UserCheck size={48} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-semibold mb-1">कुनै उम्मेदवार भेटिएन</p>
                  <p className="text-sm text-muted-foreground">कृपया फिल्टर परिवर्तन गर्नुहोस्</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <GoogleAdSense />
      <Footer />
    </div>
  );
}
