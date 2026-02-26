'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Users,
  BarChart3,
  Vote,
  Flame,
  UserCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Newspaper,
  Info,
  Search,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import GoogleAdSense from '@/components/GoogleAdSense';
import Header from '@/components/Header';

/* ─── DATA ─── */
const statsCards = [
  { label: 'उम्मेदवार संख्या', value: '८,९३४', icon: UserCheck, color: 'bg-primary/10 text-primary' },
  { label: 'राजनीतिक दलहरू', value: '१२४', icon: Building2, color: 'bg-secondary/10 text-secondary' },
  { label: 'तातो सिटहरू', value: '४५', icon: Flame, color: 'bg-destructive/10 text-destructive' },
  { label: 'निर्वाचन क्षेत्रहरू', value: '१६५', icon: MapPin, color: 'bg-accent/20 text-accent-foreground' },
  {
    label: 'कुल मतदाता',
    value: '१,७५,००,०००',
    sublabel: 'पुरुष: ८५,५०,००० | महिला: ८९,५०,०००',
    icon: Users,
    color: 'bg-primary/10 text-primary',
  },
  { label: 'अपेक्षित मतदान दर', value: '७८%', icon: BarChart3, color: 'bg-secondary/10 text-secondary' },
];

const hotSeats = [
  {
    constituency: 'काठमाडौं-१',
    candidates: ['राम कुमार शर्मा (दल क)', 'प्रिया सिंह (दल ख)'],
    status: 'अति प्रतिस्पर्धात्मक',
  },
  { constituency: 'ललितपुर-२', candidates: ['बिक्रम थापा (दल ग)', 'दीपिका पौडेल (दल घ)'], status: 'कडा प्रतिस्पर्धा' },
  { constituency: 'मोरङ-३', candidates: ['सुरेश यादव (दल ख)', 'कमला राई (दल क)'], status: 'अति प्रतिस्पर्धात्मक' },
  { constituency: 'चितवन-२', candidates: ['हरि बहादुर (दल क)', 'सीता गुरुङ (दल घ)'], status: 'कडा प्रतिस्पर्धा' },
  { constituency: 'कास्की-१', candidates: ['विष्णु पौडेल (दल ग)', 'गीता शर्मा (दल ख)'], status: 'रोचक' },
];

const popularFaces = [
  { name: 'राम कुमार शर्मा', party: 'दल क', constituency: 'काठमाडौं-१', image: 'र.कु.' },
  { name: 'प्रिया सिंह', party: 'दल ख', constituency: 'काठमाडौं-१', image: 'प्रि.' },
  { name: 'बिक्रम थापा', party: 'दल ग', constituency: 'ललितपुर-२', image: 'बि.' },
  { name: 'दीपिका पौडेल', party: 'दल घ', constituency: 'ललितपुर-२', image: 'दी.' },
  { name: 'सुरेश यादव', party: 'दल ख', constituency: 'मोरङ-३', image: 'सु.' },
  { name: 'कमला राई', party: 'दल क', constituency: 'मोरङ-३', image: 'क.' },
];

const lastElectionData = [
  { party: 'दल क', seats: 78 },
  { party: 'दल ख', seats: 65 },
  { party: 'दल ग', seats: 32 },
  { party: 'दल घ', seats: 18 },
  { party: 'दल ङ', seats: 12 },
  { party: 'अन्य', seats: 20 },
];

const lastElectionStats = [
  { label: 'कुल सिटहरू', value: '२७५' },
  { label: 'मतदान दर', value: '६५.९%' },
  { label: 'दर्ता मतदाता', value: '१,५९,००,०००' },
  { label: 'महिला विजेता', value: '३३' },
];

const politicalParties = [
  { name: 'नेपाली काँग्रेस', shortName: 'ने.का.', seats: 78, color: 'bg-primary' },
  { name: 'नेकपा एमाले', shortName: 'एमाले', seats: 65, color: 'bg-secondary' },
  { name: 'नेकपा माओवादी केन्द्र', shortName: 'माओ.', seats: 32, color: 'bg-destructive' },
  { name: 'राष्ट्रिय स्वतन्त्र पार्टी', shortName: 'रास्वपा', seats: 18, color: 'bg-accent' },
  { name: 'जनता समाजवादी पार्टी', shortName: 'जसपा', seats: 12, color: 'bg-chart-4' },
  { name: 'राष्ट्रिय प्रजातन्त्र पार्टी', shortName: 'राप्रपा', seats: 8, color: 'bg-chart-5' },
];

const provinces = [
  { name: 'कोशी प्रदेश', value: 'koshi' },
  { name: 'मधेश प्रदेश', value: 'madhesh' },
  { name: 'बागमती प्रदेश', value: 'bagmati' },
  { name: 'गण्डकी प्रदेश', value: 'gandaki' },
  { name: 'लुम्बिनी प्रदेश', value: 'lumbini' },
  { name: 'कर्णाली प्रदेश', value: 'karnali' },
  { name: 'सुदूरपश्चिम प्रदेश', value: 'sudurpashchim' },
];

const districtsByProvince: Record<string, string[]> = {
  koshi: ['इलाम', 'झापा', 'मोरङ', 'सुनसरी', 'तेह्रथुम', 'उदयपुर'],
  madhesh: ['धनुषा', 'महोत्तरी', 'पर्सा', 'रौतहट', 'सप्तरी', 'सिरहा'],
  bagmati: [
    'भक्तपुर',
    'चितवन',
    'धादिङ',
    'काठमाडौं',
    'काभ्रेपलाञ्चोक',
    'ललितपुर',
    'नुवाकोट',
    'रामेछाप',
    'रसुवा',
    'सिन्धुली',
  ],
  gandaki: ['बाग्लुङ', 'गोरखा', 'गुल्मी', 'कास्की', 'लमजुङ', 'म्याग्दी', 'नवलपरासी', 'पर्बत', 'स्याङ्जा', 'तनहुँ'],
  lumbini: ['अर्घाखाँची', 'बाँके', 'बर्दिया', 'दाङ', 'कपिलवस्तु', 'पाल्पा', 'रुपन्देही'],
  karnali: ['दैलेख', 'डोल्पा', 'हुम्ला', 'जाजरकोट', 'जुम्ला', 'कालीकोट', 'मुगु', 'रुकुम पश्चिम', 'सल्यान', 'सुर्खेत'],
  sudurpashchim: ['अछाम', 'बैतडी', 'बझाङ', 'बाजुरा', 'दार्चुला', 'डडेलधुरा', 'डोटी', 'कैलाली', 'कञ्चनपुर'],
};

const faqItems = [
  {
    q: 'नेपाल निर्वाचन पोर्टल के हो?',
    a: 'नेपाल निर्वाचन पोर्टल एक स्वतन्त्र, निष्पक्ष र पारदर्शी प्ल्याटफर्म हो जसले नेपालको निर्वाचन सम्बन्धी सम्पूर्ण जानकारी एकै ठाउँमा प्रदान गर्दछ।',
  },
  {
    q: 'यहाँको तथ्याङ्क कहाँबाट आउँछ?',
    a: 'हामी निर्वाचन आयोग, सरकारी स्रोत र विश्वसनीय सञ्चार माध्यमबाट तथ्याङ्क सङ्कलन गर्छौं।',
  },
  {
    q: 'के यो पोर्टल कुनै राजनीतिक दलसँग सम्बन्धित छ?',
    a: 'होइन, यो पोर्टल पूर्ण रूपमा स्वतन्त्र र निष्पक्ष छ। हामी कुनै पनि राजनीतिक दल वा उम्मेदवारसँग सम्बन्धित छैनौं।',
  },
  {
    q: 'म कसरी मेरो निर्वाचन क्षेत्र पत्ता लगाउन सक्छु?',
    a: 'माथिको खोजी उपकरण प्रयोग गर्नुहोस् - प्रदेश, जिल्ला र निर्वाचन क्षेत्र छान्नुहोस् वा उम्मेदवार पृष्ठमा जानुहोस्।',
  },
  {
    q: 'क्विजले निर्वाचनमा कुनै प्रभाव पार्छ?',
    a: 'होइन, क्विज केवल शैक्षिक उद्देश्यका लागि हो। यसले निर्वाचनमा कुनै पनि प्रभाव पार्दैन।',
  },
  {
    q: 'म कसरी यो पोर्टललाई सहयोग गर्न सक्छु?',
    a: 'तपाईं दान गरेर वा विज्ञापन दिएर हामीलाई सहयोग गर्न सक्नुहुन्छ। थप जानकारीको लागि "सहयोग गर्नुहोस्" पृष्ठमा जानुहोस्।',
  },
];

const newsItems = [
  { source: 'रातोपाटी', title: 'काठमाडौं-१ मा कडा प्रतिस्पर्धा हुने संकेत', time: '२ घण्टा अघि', url: '#' },
  { source: 'अनलाइनखबर', title: 'निर्वाचन आयोगले मतदाता शिक्षा अभियान सुरु गर्यो', time: '५ घण्टा अघि', url: '#' },
  { source: 'सेतोपाटी', title: 'युवा मतदाताको सहभागिता यसपटक बढ्ने', time: '८ घण्टा अघि', url: '#' },
  { source: 'नागरिक न्युज', title: 'प्रदेश ३ मा सबैभन्दा बढी मतदाता दर्ता', time: '१ दिन अघि', url: '#' },
  { source: 'काठमाडौं पोस्ट', title: 'महिला उम्मेदवारको संख्यामा उल्लेख्य वृद्धि', time: '१ दिन अघि', url: '#' },
  { source: 'हिमालय टाइम्स', title: 'दलहरूले घोषणापत्र सार्वजनिक गर्न थाले', time: '२ दिन अघि', url: '#' },
];

/* ─── Statistics Data (merged from Statistics page) ─── */
const voterTurnoutData = [
  { year: '२०६४', turnout: 65 },
  { year: '२०७०', turnout: 68 },
  { year: '२०७४', turnout: 72 },
  { year: '२०७९', turnout: 75 },
  { year: '२०८३', turnout: 78 },
];

const demographicsData = [
  { group: '१८-३०', voters: 2400 },
  { group: '३१-४५', voters: 3200 },
  { group: '४६-६०', voters: 2800 },
  { group: '६०+', voters: 1600 },
];

const provinceComparison = [
  { name: 'कोशी', '२०७९': 145000, '२०८३': 168000 },
  { name: 'मधेश', '२०७९': 189000, '२०८३': 215000 },
  { name: 'बागमती', '२०७९': 267000, '२०८३': 305000 },
  { name: 'गण्डकी', '२०७९': 156000, '२०८३': 178000 },
  { name: 'लुम्बिनी', '२०७९': 201000, '२०८३': 232000 },
  { name: 'कर्णाली', '२०७९': 98000, '२०८३': 112000 },
  { name: 'सुदूरपश्चिम', '२०७९': 87000, '२०८३': 101000 },
];

/* ─── COMPONENT ─── */
export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getCurrentDistricts = () => (selectedProvince ? districtsByProvince[selectedProvince] || [] : []);

  /* helper to decide ad type between sections */
  const adSlots: ('paid' | 'adsense')[] = ['adsense', 'adsense', 'paid', 'adsense', 'paid'];
  let adIdx = 0;
  const nextAd = () => {
    const type = adSlots[adIdx % adSlots.length];
    adIdx++;
    return type;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ── Section 1: Hero + Stats ── */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-14 md:py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Vote size={44} className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-balance">नेपाल निर्वाचन पोर्टल</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-balance mb-2">
            नागरिकहरूलाई सशक्त निर्णय लिन सबै निर्वाचन जानकारी एकै ठाउँमा
          </p>
          <p className="text-sm opacity-70">Nepal Election Portal - Your trusted source for election information</p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="-mt-8 relative z-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statsCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-card rounded-xl border border-border p-4 shadow-md text-center">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-xl md:text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                  {s.sublabel && <p className="text-[10px] text-muted-foreground mt-0.5">{s.sublabel}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad 1 */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 2: Hot Seats ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame size={28} className="text-destructive" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">तातो सिटहरू</h2>
            </div>
            <Link
              href="/candidates"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              सबै हेर्नुहोस् <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotSeats.map((seat, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 hover:border-destructive/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-lg">{seat.constituency}</h3>
                  <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-2 py-0.5 rounded-full">
                    {seat.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {seat.candidates.map((c, j) => (
                    <p key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {c}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Popular Faces ── */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <UserCheck size={28} className="text-secondary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">चर्चित अनुहारहरू</h2>
            </div>
            <Link
              href="/candidates"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              सबै हेर्नुहोस् <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularFaces.map((face, i) => (
              <div
                key={i}
                className="bg-background rounded-xl border border-border p-4 text-center hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-lg">
                  {face.image}
                </div>
                <h3 className="font-bold text-foreground text-sm leading-tight">{face.name}</h3>
                <p className="text-xs text-primary font-semibold mt-1">{face.party}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{face.constituency}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad 2 */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 4: Last Election Summary ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <BarChart3 size={28} className="text-primary" />
            गत निर्वाचन सारांश (२०७९)
          </h2>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {lastElectionStats.map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">दलगत सिट वितरण</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={lastElectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="party" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="seats" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Ad 3 */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 4b: Election Statistics (merged from Statistics page) ── */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <TrendingUp size={28} className="text-primary" />
            निर्वाचन तथ्याङ्क र प्रवृत्ति
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Voter Turnout Trend */}
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">मतदान दर प्रवृत्ति</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={voterTurnoutData}>
                  <defs>
                    <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="turnout"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorTurnout)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Age Demographics */}
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">उमेर समूह अनुसार मतदाता</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={demographicsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="group" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="voters" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Province Comparison */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-5">प्रदेश अनुसार तुलना (२०७९ vs २०८३)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={provinceComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="२०७९" fill="var(--muted-foreground)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="२०८३" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Ad 3b */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 5: Political Parties ── */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 size={28} className="text-secondary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">राजनीतिक दलहरू</h2>
            </div>
            <Link
              href="/manifestos"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              सबै हेर्नुहोस् <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {politicalParties.map((party, i) => (
              <div
                key={i}
                className="bg-background rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${party.color} rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0`}
                >
                  {party.shortName}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">{party.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">गत निर्वाचनमा {party.seats} सिट</p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Candidate Directory ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Search size={28} className="text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">उम्मेदवार खोज्नुहोस्</h2>
            </div>
            <Link
              href="/candidates"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              सबै हेर्नुहोस् <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Province */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">प्रदेश</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                    setSelectedConstituency('');
                  }}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">प्रदेश छान्नुहोस्</option>
                  {provinces.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">जिल्ला</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedConstituency('');
                  }}
                  disabled={!selectedProvince}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">जिल्ला छान्नुहोस्</option>
                  {getCurrentDistricts().map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {/* Constituency */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">निर्वाचन क्षेत्र</label>
                <select
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">निर्वाचन क्षेत्र छान्नुहोस्</option>
                  <option value="1">{selectedDistrict}-१</option>
                  <option value="2">{selectedDistrict}-२</option>
                  <option value="3">{selectedDistrict}-३</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">लिङ्ग</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">सबै</option>
                  <option value="male">पुरुष</option>
                  <option value="female">महिला</option>
                  <option value="other">अन्य</option>
                </select>
              </div>
              {/* Political Party */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">राजनीतिक दल</label>
                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">सबै दल</option>
                  {politicalParties.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Search Button */}
              <div className="flex items-end">
                <Link
                  href="/candidates"
                  className="w-full px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  खोज्नुहोस्
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad 4 */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 7: FAQ ── */}
      <section id="faq" className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">बारम्बार सोधिने प्रश्नहरू</h2>
          <div className="flex flex-col gap-3 max-w-3xl">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-background border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground text-sm pr-4">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-border">
                    <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad 5 */}
      {nextAd() === 'paid' ? <AdBanner type="in-content" /> : <GoogleAdSense />}

      {/* ── Section 8: Related News ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Newspaper size={28} className="text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">सम्बन्धित समाचार</h2>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              सबै हेर्नुहोस् <ChevronRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((news, i) => (
              <a
                key={i}
                href={news.url}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                    {news.source}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{news.time}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-snug">{news.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: About ── */}
      <section id="about" className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Info size={28} className="text-secondary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">नेपाल निर्वाचन बारेमा</h2>
          </div>
          <div className="bg-background border border-border rounded-xl p-6 md:p-8 max-w-3xl">
            <p className="text-foreground leading-relaxed mb-4">
              नेपाल निर्वाचन पोर्टल एक स्वतन्त्र र निष्पक्ष प्ल्याटफर्म हो जसले नेपालका नागरिकहरूलाई निर्वाचन सम्बन्धी
              सम्पूर्ण जानकारी प्रदान गर्दछ। हाम्रो उद्देश्य पारदर्शी र न्यायपूर्ण निर्वाचनमा सहयोग पुर्‍याउनु हो।
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              हामी उम्मेदवारहरूको प्रोफाइल, राजनीतिक दलहरूको घोषणापत्र, निर्वाचन तथ्याङ्क, मतदाता गाइड र निर्वाचन नतिजा
              एकै ठाउँमा उपलब्ध गराउँछौं। हाम्रो क्विजले तपाईंको मूल्य र प्राथमिक���ासँग मिल्ने दल पत्ता लगाउन मद्दत
              गर्छ।
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
