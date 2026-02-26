'use client';

import { useState } from 'react';
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
  Legend,
} from 'recharts';
import { ArrowLeft, TrendingUp, ChevronRight, X, Users, Vote, BarChart3, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';

/* ─── National Level Data ─── */
const nationalDirect = [
  { party: 'ने.का.', seats: 57, votes: 3254000, color: '#c41e3a' },
  { party: 'एमाले', seats: 49, votes: 3105000, color: '#003da5' },
  { party: 'माओवादी', seats: 32, votes: 1845000, color: '#d4a574' },
  { party: 'रास्वपा', seats: 7, votes: 1102000, color: '#6b5b4a' },
  { party: 'जसपा', seats: 7, votes: 890000, color: '#8b6f47' },
  { party: 'स्वतन्त्र', seats: 7, votes: 650000, color: '#2d8659' },
  { party: 'अन्य', seats: 6, votes: 480000, color: '#999999' },
];

const nationalProportional = [
  { party: 'ने.का.', seats: 36, votes: 4120000, color: '#c41e3a' },
  { party: 'एमाले', seats: 31, votes: 3590000, color: '#003da5' },
  { party: 'माओवादी', seats: 18, votes: 2150000, color: '#d4a574' },
  { party: 'रास्वपा', seats: 8, votes: 1350000, color: '#6b5b4a' },
  { party: 'जसपा', seats: 7, votes: 1100000, color: '#8b6f47' },
  { party: 'लोतान्त्रिक', seats: 4, votes: 680000, color: '#2d8659' },
  { party: 'अन्य', seats: 6, votes: 510000, color: '#999999' },
];

const totalRegisteredVoters = 17988570;
const totalVotesCast = 10428000;
const totalDirectVotesCast = 11326000;
const totalProportionalVotesCast = 13500000;
const no_result = true; // Set to true to simulate no results scenario
/* ─── Province Data ─── */
const provinces = [
  { value: 'all', label: 'सबै प्रदेश' },
  { value: 'koshi', label: 'कोशी प्रदेश' },
  { value: 'madhesh', label: 'मधेश प्रदेश' },
  { value: 'bagmati', label: 'बागमती प्रदेश' },
  { value: 'gandaki', label: 'गण्डकी प्रदेश' },
  { value: 'lumbini', label: 'लुम्बिनी प्रदेश' },
  { value: 'karnali', label: 'कर्णाली प्रदेश' },
  { value: 'sudurpaschim', label: 'सुदूरपश्चिम प्रदेश' },
];

const districtsByProvince: Record<string, { value: string; label: string }[]> = {
  all: [{ value: 'all', label: 'सबै जिल्ला' }],
  koshi: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'morang', label: 'मोरङ' },
    { value: 'sunsari', label: 'सुनसरी' },
    { value: 'jhapa', label: 'झापा' },
  ],
  madhesh: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'dhanusha', label: 'धनुषा' },
    { value: 'siraha', label: 'सिराहा' },
    { value: 'saptari', label: 'सप्तरी' },
  ],
  bagmati: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'kathmandu', label: 'काठमाडौं' },
    { value: 'lalitpur', label: 'ललितपुर' },
    { value: 'bhaktapur', label: 'भक्तपुर' },
  ],
  gandaki: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'kaski', label: 'कास्की' },
    { value: 'tanahun', label: 'तनहुँ' },
  ],
  lumbini: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'rupandehi', label: 'रुपन्देही' },
    { value: 'kapilvastu', label: 'कपिलवस्तु' },
  ],
  karnali: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'surkhet', label: 'सुर्खेत' },
    { value: 'dailekh', label: 'दैलेख' },
  ],
  sudurpaschim: [
    { value: 'all', label: 'सबै जिल्ला' },
    { value: 'kailali', label: 'कैलाली' },
    { value: 'kanchanpur', label: 'कञ्चनपुर' },
  ],
};

type ConstituencyResult = {
  id: string;
  name: string;
  province: string;
  district: string;
  type: 'direct' | 'proportional';
  totalRegistered: number;
  totalCast: number;
  countedPercent: number;
  candidates: {
    name: string;
    party: string;
    votes: number;
    color: string;
  }[];
};

const constituencyResults: ConstituencyResult[] = [
  {
    id: 'ktm-1',
    name: 'काठमाडौं-१',
    province: 'bagmati',
    district: 'kathmandu',
    type: 'direct',
    totalRegistered: 85000,
    totalCast: 52000,
    countedPercent: 92,
    candidates: [
      { name: 'प्रकाश मान सिंह', party: 'ने.का.', votes: 18500, color: '#c41e3a' },
      { name: 'रमेश लेखक', party: 'एमाले', votes: 15200, color: '#003da5' },
      { name: 'सुशीला कार्की', party: 'माओवादी', votes: 8900, color: '#d4a574' },
      { name: 'बिनोद चौधरी', party: 'रास्वपा', votes: 5400, color: '#6b5b4a' },
      { name: 'सरिता श्रेष्ठ', party: 'स्वतन्त्र', votes: 4000, color: '#2d8659' },
    ],
  },
  {
    id: 'ktm-2',
    name: 'काठमाडौं-२',
    province: 'bagmati',
    district: 'kathmandu',
    type: 'direct',
    totalRegistered: 92000,
    totalCast: 58000,
    countedPercent: 88,
    candidates: [
      { name: 'गंगा लामा', party: 'एमाले', votes: 21000, color: '#003da5' },
      { name: 'कमला रोका', party: 'ने.का.', votes: 17800, color: '#c41e3a' },
      { name: 'दीपक गुरुङ', party: 'माओवादी', votes: 9500, color: '#d4a574' },
      { name: 'अनिता महर्जन', party: 'जसपा', votes: 5200, color: '#8b6f47' },
      { name: 'रामहरि पौडेल', party: 'स्वतन्त्र', votes: 4500, color: '#2d8659' },
    ],
  },
  {
    id: 'morang-1',
    name: 'मोरङ-१',
    province: 'koshi',
    district: 'morang',
    type: 'direct',
    totalRegistered: 78000,
    totalCast: 46000,
    countedPercent: 95,
    candidates: [
      { name: 'सुरेश अधिकारी', party: 'एमाले', votes: 17500, color: '#003da5' },
      { name: 'मीना राई', party: 'ने.का.', votes: 13200, color: '#c41e3a' },
      { name: 'कृष्ण भट्टराई', party: 'माओवादी', votes: 8100, color: '#d4a574' },
      { name: 'सीता देवी', party: 'रास्वपा', votes: 4200, color: '#6b5b4a' },
      { name: 'हरि बस्नेत', party: 'स्वतन्त्र', votes: 3000, color: '#2d8659' },
    ],
  },
  {
    id: 'jhapa-1',
    name: 'झापा-१',
    province: 'koshi',
    district: 'jhapa',
    type: 'direct',
    totalRegistered: 82000,
    totalCast: 50000,
    countedPercent: 100,
    candidates: [
      { name: 'प्रदीप ज्ञवाली', party: 'एमाले', votes: 19800, color: '#003da5' },
      { name: 'लक्ष्मी तामाङ', party: 'ने.का.', votes: 15000, color: '#c41e3a' },
      { name: 'भीम लिम्बू', party: 'माओवादी', votes: 7600, color: '#d4a574' },
      { name: 'दुर्गा ढकाल', party: 'रास्वपा', votes: 4800, color: '#6b5b4a' },
      { name: 'नरेश रिजाल', party: 'जसपा', votes: 2800, color: '#8b6f47' },
    ],
  },
  {
    id: 'rupandehi-1',
    name: 'रुपन्देही-१',
    province: 'lumbini',
    district: 'rupandehi',
    type: 'direct',
    totalRegistered: 88000,
    totalCast: 55000,
    countedPercent: 78,
    candidates: [
      { name: 'शंकर पोखरेल', party: 'ने.का.', votes: 16200, color: '#c41e3a' },
      { name: 'माया शर्मा', party: 'एमाले', votes: 14800, color: '#003da5' },
      { name: 'रामचन्द्र यादव', party: 'जसपा', votes: 11500, color: '#8b6f47' },
      { name: 'गीता पाण्डे', party: 'माओवादी', votes: 7200, color: '#d4a574' },
      { name: 'सूर्य मगर', party: 'रास्वपा', votes: 5300, color: '#6b5b4a' },
    ],
  },
  {
    id: 'kaski-1',
    name: 'कास्की-१',
    province: 'gandaki',
    district: 'kaski',
    type: 'direct',
    totalRegistered: 75000,
    totalCast: 48000,
    countedPercent: 100,
    candidates: [
      { name: 'राजन गुरुङ', party: 'ने.का.', votes: 20500, color: '#c41e3a' },
      { name: 'सुमन थापा', party: 'एमाले', votes: 14000, color: '#003da5' },
      { name: 'पदम बहादुर', party: 'माओवादी', votes: 7200, color: '#d4a574' },
      { name: 'तारा देवी', party: 'रास्वपा', votes: 3800, color: '#6b5b4a' },
      { name: 'बिष्णु अधिकारी', party: 'स्वतन्त्र', votes: 2500, color: '#2d8659' },
    ],
  },
];

export default function Results() {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [electionType, setElectionType] = useState<'direct' | 'proportional'>('direct');
  const [detailConstituency, setDetailConstituency] = useState<ConstituencyResult | null>(null);
  const [showTopOnly, setShowTopOnly] = useState(true);

  const currentDistricts = districtsByProvince[selectedProvince] || districtsByProvince.all;
  const currentNational = electionType === 'direct' ? nationalDirect : nationalProportional;
  const totalNationalVotes = electionType === 'direct' ? totalDirectVotesCast : totalProportionalVotesCast;

  const filteredResults = constituencyResults.filter((c) => {
    if (selectedProvince !== 'all' && c.province !== selectedProvince) return false;
    if (selectedDistrict !== 'all' && c.district !== selectedDistrict) return false;
    return true;
  });

  const displayedResults = showTopOnly ? filteredResults.slice(0, 4) : filteredResults;

  const turnoutPercent = Math.round((totalVotesCast / totalRegisteredVoters) * 100);

  /* ─── Constituency Detail View ─── */
  if (detailConstituency) {
    const c = detailConstituency;
    const counted = Math.round(c.totalCast * (c.countedPercent / 100));
    const remaining = c.totalCast - counted;
    const winner = c.candidates[0];
    const totalCandVotes = c.candidates.reduce((s, cd) => s + cd.votes, 0);

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setDetailConstituency(null)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            नतिजा सूचीमा फर्कनुहोस्
          </button>
        </div>

        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={28} className="text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{c.name}</h1>
            </div>
            <p className="text-muted-foreground">विस्तृत निर्वाचन नतिजा</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">दर्ता मतदाता</p>
                <p className="text-2xl font-bold text-foreground">{c.totalRegistered.toLocaleString()}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">खसेको मत</p>
                <p className="text-2xl font-bold text-foreground">{c.totalCast.toLocaleString()}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">मतदान प्रतिशत</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round((c.totalCast / c.totalRegistered) * 100)}%
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">गणना प्रगति</p>
                <p className={`text-2xl font-bold ${c.countedPercent === 100 ? 'text-green-600' : 'text-primary'}`}>
                  {c.countedPercent}%
                </p>
              </div>
            </div>

            {/* Vote counting progress */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">मत गणना प्रगति</h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">गणना भएको: {counted.toLocaleString()}</span>
                    <span className="text-sm font-bold text-foreground">{c.countedPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-primary h-4 rounded-full transition-all relative"
                      style={{ width: `${c.countedPercent}%` }}
                    >
                      {c.countedPercent < 100 && (
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary-foreground/30 rounded-r-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">बाँकी: {remaining.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">कुल: {c.totalCast.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {c.countedPercent < 100 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-3">
                  <p className="text-xs text-muted-foreground">
                    मत गणना जारी छ। अझै {remaining.toLocaleString()} मत गणना बाँकी छ।
                  </p>
                </div>
              )}
            </div>

            {/* Charts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-5">उम्मेदवार अनुसार मत</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={c.candidates} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'मत']}
                    />
                    <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                      {c.candidates.map((cand, i) => (
                        <Cell key={i} fill={cand.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-5">मत प्रतिशत वितरण</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={c.candidates}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, votes }) =>
                        `${name.split(' ')[0]} ${Math.round((votes / totalCandVotes) * 100)}%`
                      }
                      outerRadius={100}
                      dataKey="votes"
                      nameKey="name"
                    >
                      {c.candidates.map((cand, i) => (
                        <Cell key={i} fill={cand.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), 'मत']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* All Candidates Table */}
            <div className="bg-card rounded-xl overflow-hidden border border-border">
              <div className="p-5 bg-primary text-primary-foreground">
                <h3 className="text-lg font-bold">सबै उम्मेदवारको नतिजा</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">क्रम</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">उम्मेदवार</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">दल</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">मत</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">प्रतिशत</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.candidates.map((cand, i) => {
                      const pct = Math.round((cand.votes / totalCandVotes) * 100);
                      return (
                        <tr
                          key={i}
                          className={`border-b border-border hover:bg-muted/50 transition-colors ${i === 0 ? 'bg-primary/5' : ''}`}
                        >
                          <td className="px-5 py-3 text-foreground text-sm font-bold">
                            {i === 0 ? 'विजेता' : `#${i + 1}`}
                          </td>
                          <td className="px-5 py-3 font-semibold text-foreground text-sm">{cand.name}</td>
                          <td className="px-5 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cand.color}20`, color: cand.color }}
                            >
                              {cand.party}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-foreground text-sm font-semibold">
                            {cand.votes.toLocaleString()}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-border rounded-full h-2 max-w-[120px]">
                                <div
                                  className="h-2 rounded-full"
                                  style={{ width: `${pct}%`, backgroundColor: cand.color }}
                                />
                              </div>
                              <span className="font-bold text-sm min-w-fit" style={{ color: cand.color }}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ─── Main Results Page ─── */
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

      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">निर्वाचन नतिजा</h1>
          </div>
          <p className="text-muted-foreground">नेपाल भरिको प्रत्यक्ष र समानुपातिक निर्वाचन नतिजा</p>
        </div>
      </section>
      {no_result ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-2">नतिजा उपलब्ध छैन</h2>
            <p className="text-muted-foreground">कृपया निर्वाचनको नतिजा प्राप्त हुने समय पछि फेरि प्रयास गर्नुहोस्।</p>
          </div>
        </div>
      ) : (
        <>
          {/* National Stats */}
          <section className="py-8 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <Users size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">कुल दर्ता मतदाता</p>
                  <p className="text-xl font-bold text-foreground">{(totalRegisteredVoters / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <Vote size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">खसेको मत</p>
                  <p className="text-xl font-bold text-foreground">{(totalVotesCast / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <BarChart3 size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">मतदान दर</p>
                  <p className="text-xl font-bold text-primary">{turnoutPercent}%</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <MapPin size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">कुल निर्वाचन क्षेत्र</p>
                  <p className="text-xl font-bold text-foreground">१६५</p>
                </div>
              </div>
            </div>
          </section>

          <AdBanner type="banner" position="top" />

          {/* Election Type Toggle */}
          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">राष्ट्रिय स्तरको नतिजा</h2>
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setElectionType('direct')}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    electionType === 'direct'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary'
                  }`}
                >
                  प्रत्यक्ष निर्वाचन
                </button>
                <button
                  onClick={() => setElectionType('proportional')}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    electionType === 'proportional'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary'
                  }`}
                >
                  समानुपातिक निर्वाचन
                </button>
              </div>

              {/* National Infographic Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {electionType === 'direct' ? 'प्रत्यक्ष' : 'समानुपातिक'} - दल अनुसार सिट
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    कुल {electionType === 'direct' ? '१६५' : '११०'} सिट
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={currentNational} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="party"
                        angle={-30}
                        textAnchor="end"
                        height={60}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
                        {currentNational.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {electionType === 'direct' ? 'प्रत्यक्ष' : 'समानुपातिक'} - मत प्रतिशत
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    कुल खसेको मत: {(totalNationalVotes / 1000000).toFixed(1)}M
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={currentNational}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ party, votes }) => `${party} ${Math.round((votes / totalNationalVotes) * 100)}%`}
                        outerRadius={110}
                        dataKey="votes"
                        nameKey="party"
                      >
                        {currentNational.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [(value / 1000000).toFixed(2) + 'M', 'मत']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vote count vs total comparison */}
              <div className="bg-card rounded-xl p-6 border border-border mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">मतदान दर - दर्ता बनाम खसेको मत</h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">
                      खसेको मत: {(totalVotesCast / 1000000).toFixed(1)}M /{' '}
                      {(totalRegisteredVoters / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-sm font-bold text-primary">{turnoutPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-5 relative">
                    <div
                      className="bg-primary h-5 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${turnoutPercent}%` }}
                    >
                      <span className="text-xs font-bold text-primary-foreground">{turnoutPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      मतदान नगर्ने: {((totalRegisteredVoters - totalVotesCast) / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-xs text-muted-foreground">{100 - turnoutPercent}% मतदान भएन</span>
                  </div>
                </div>
              </div>

              {/* National seats table */}
              <div className="bg-card rounded-xl overflow-hidden border border-border">
                <div className="p-5 bg-primary text-primary-foreground">
                  <h3 className="text-lg font-bold">
                    {electionType === 'direct' ? 'प्रत्यक्ष' : 'समानुपातिक'} - दल अनुसार विस्तृत नतिजा
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">दल</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">सिट</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">मत संख्या</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground text-sm">मत प्रतिशत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentNational.map((row, index) => {
                        const pct = Math.round((row.votes / totalNationalVotes) * 100);
                        return (
                          <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                                <span className="font-semibold text-foreground text-sm">{row.party}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 font-bold text-foreground text-sm">{row.seats}</td>
                            <td className="px-5 py-3 text-foreground text-sm">{(row.votes / 1000000).toFixed(2)}M</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-border rounded-full h-2 max-w-[160px]">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{ width: `${pct}%`, backgroundColor: row.color }}
                                  />
                                </div>
                                <span className="font-bold text-sm min-w-fit" style={{ color: row.color }}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Constituency-Level Results */}
          <section className="py-10 bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">निर्वाचन क्षेत्र अनुसार नतिजा</h2>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">प्रदेश छान्नुहोस्</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict('all');
                    }}
                    className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  >
                    {provinces.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">जिल्ला छान्नुहोस्</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Constituency Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {displayedResults.map((c) => {
                  const winner = c.candidates[0];
                  const totalCandVotes = c.candidates.reduce((s, cd) => s + cd.votes, 0);
                  const winPct = Math.round((winner.votes / totalCandVotes) * 100);
                  const turnout = Math.round((c.totalCast / c.totalRegistered) * 100);

                  return (
                    <button
                      key={c.id}
                      onClick={() => setDetailConstituency(c)}
                      className="bg-background border border-border rounded-xl p-5 text-left hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {c.countedPercent < 100 && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                              गणना जारी {c.countedPercent}%
                            </span>
                          )}
                          {c.countedPercent === 100 && (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              गणना सकियो
                            </span>
                          )}
                          <ChevronRight
                            size={18}
                            className="text-muted-foreground group-hover:text-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Winner */}
                      <div
                        className="flex items-center gap-3 mb-3 p-3 rounded-lg"
                        style={{ backgroundColor: `${winner.color}10` }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: winner.color, color: '#fff' }}
                        >
                          #१
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-sm">{winner.name}</p>
                          <p className="text-xs" style={{ color: winner.color }}>
                            {winner.party} - {winner.votes.toLocaleString()} मत ({winPct}%)
                          </p>
                        </div>
                      </div>

                      {/* Top 3 progress bars */}
                      <div className="flex flex-col gap-1.5 mb-3">
                        {c.candidates.slice(0, 3).map((cand, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16 truncate">{cand.party}</span>
                            <div className="flex-1 bg-muted rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${Math.round((cand.votes / totalCandVotes) * 100)}%`,
                                  backgroundColor: cand.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>मतदान दर: {turnout}%</span>
                        <span>{c.candidates.length} उम्मेदवार</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>चयन गरिएको फिल्टरमा कुनै नतिजा भेटिएन।</p>
                </div>
              )}

              {filteredResults.length > 4 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowTopOnly(!showTopOnly)}
                    className="bg-primary text-primary-foreground font-bold py-2.5 px-8 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    {showTopOnly ? `सबै ${filteredResults.length} नतिजा हेर्नुहोस्` : 'कम देखाउनुहोस्'}
                  </button>
                </div>
              )}
            </div>
          </section>

          <AdBanner type="sidebar" position="middle" />
        </>
      )}
      <Footer />
    </div>
  );
}
