"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "recharts";
import {
  ArrowLeft,
  Award,
  MapPin,
  ChevronRight,
  X,
  Users,
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Filter,
  Building2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import GoogleAdSense from "@/components/GoogleAdSense";
import { useReportData } from "@/core/hooks/use-candidates-report-data";
import {
  genderDistributionMockData,
  ageDistributionMockData,
  constituenciesByDistrictMockData,
  districtsByProvinceMockData,
  educationDistributionMockData,
  partiesMockData,
  partyWiseCandidatesMockData,
  provincesMockData,
} from "@/core/constants/candidates-mock-data";
import { toNepaliNumber } from "@/core/lib/nepali-number";
import { BAR_COLORS } from "@/core/constants/bra-graps-colors";

/* ─── Candidate Data ─── */
type Candidate = {
  id: string;
  name: string;
  party: string;
  partyKey: string;
  partyColor: string;
  constituency: string;
  constituencyKey: string;
  province: string;
  district: string;
  gender: "male" | "female" | "other";
  age: number;
  education: string;
  experience: string;
  bio: string;
  email: string;
  phone: string;
  policies: string[];
  initials: string;
  criminalRecord: string;
  assets: string;
  previousElections: {
    year: string;
    constituency: string;
    result: string;
    votes: number;
  }[];
};

const allCandidates: Candidate[] = [
  {
    id: "c1",
    name: "प्रकाश मान सिंह",
    party: "नेपाली काँग्रेस",
    partyKey: "congress",
    partyColor: "#c41e3a",
    constituency: "काठमाडौं-१",
    constituencyKey: "ktm-1",
    province: "bagmati",
    district: "kathmandu",
    gender: "male",
    age: 52,
    education: "लोक प्रशासनमा स्नातकोत्तर (TU)",
    experience: "काठमाडौं महानगरपालिकाको पूर्व मेयर, ३ पटक सांसद",
    bio: "सार्वजनिक सेवामा २५+ वर्षको अनुभवी नेता। शिक्षा र स्वास्थ्य क्षेत्रमा उल्लेखनीय योगदान।",
    email: "prakash@example.com",
    phone: "+977-1-4000001",
    policies: [
      "शिक्षा सुधार",
      "स्वास्थ्य सेवा",
      "पूर्वाधार विकास",
      "रोजगार सृजना",
    ],
    initials: "प्र.मा.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ३,२५,००,०००",
    previousElections: [
      {
        year: "२०७९",
        constituency: "काठमाडौं-१",
        result: "विजयी",
        votes: 22500,
      },
      {
        year: "२०७४",
        constituency: "काठमाडौं-१",
        result: "विजयी",
        votes: 19800,
      },
      {
        year: "२०७०",
        constituency: "काठमाडौं-१",
        result: "पराजित",
        votes: 15200,
      },
    ],
  },
  {
    id: "c2",
    name: "सुशीला कार्की",
    party: "नेकपा एमाले",
    partyKey: "uml",
    partyColor: "#003da5",
    constituency: "काठमाडौं-१",
    constituencyKey: "ktm-1",
    province: "bagmati",
    district: "kathmandu",
    gender: "female",
    age: 45,
    education: "कानूनमा स्नातकोत्तर (TU)",
    experience: "मानव अधिकार अधिवक्ता, प्रदेश सभा सदस्य",
    bio: "महिला अधिकार र सामाजिक न्यायमा केन्द्रित अनुभवी नेतृ।",
    email: "sushila@example.com",
    phone: "+977-1-4000002",
    policies: [
      "महिला सशक्तिकरण",
      "सामाजिक न्याय",
      "शिक्षामा पहुँच",
      "लैङ्गिक समानता",
    ],
    initials: "सु.का.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. १,८५,००,०००",
    previousElections: [
      {
        year: "२०७९",
        constituency: "काठमाडौं-१",
        result: "पराजित",
        votes: 18200,
      },
    ],
  },
  {
    id: "c3",
    name: "रमेश लेखक",
    party: "नेकपा माओवादी केन्द्र",
    partyKey: "maoist",
    partyColor: "#d4a574",
    constituency: "काठमाडौं-२",
    constituencyKey: "ktm-2",
    province: "bagmati",
    district: "kathmandu",
    gender: "male",
    age: 48,
    education: "अर्थशास्त्रमा स्नातकोत्तर",
    experience: "पूर्व राज्यमन्त्री, सामाजिक कार्यकर्ता",
    bio: "विकास र आर्थिक सुधारमा केन्द्रित प्रगतिशील नेता।",
    email: "ramesh@example.com",
    phone: "+977-1-4000003",
    policies: ["आर्थिक विकास", "कृषि आधुनिकीकरण", "युवा रोजगार"],
    initials: "र.ले.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. २,५०,००,०००",
    previousElections: [
      {
        year: "२०७९",
        constituency: "काठमाडौं-२",
        result: "विजयी",
        votes: 20500,
      },
      {
        year: "२०७४",
        constituency: "काठमाडौं-२",
        result: "पराजित",
        votes: 14800,
      },
    ],
  },
  {
    id: "c4",
    name: "गंगा लामा",
    party: "नेकपा एमाले",
    partyKey: "uml",
    partyColor: "#003da5",
    constituency: "ललितपुर-१",
    constituencyKey: "ltp-1",
    province: "bagmati",
    district: "lalitpur",
    gender: "female",
    age: 40,
    education: "सामाजिक कार्यमा स्नातकोत्तर",
    experience: "गैसस निर्देशक, सामुदायिक विकास कार्यकर्ता",
    bio: "स्थानीय विकास र महिला सशक्तिकरणमा समर्पित।",
    email: "ganga@example.com",
    phone: "+977-1-4000004",
    policies: ["स्थानीय विकास", "महिला अधिकार", "पर्यावरण संरक्षण"],
    initials: "ग.ला.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ९५,००,०००",
    previousElections: [],
  },
  {
    id: "c5",
    name: "सुरेश अधिकारी",
    party: "नेपाली काँग्रेस",
    partyKey: "congress",
    partyColor: "#c41e3a",
    constituency: "मोरङ-१",
    constituencyKey: "mor-1",
    province: "koshi",
    district: "morang",
    gender: "male",
    age: 55,
    education: "राजनीति शास्त्रमा स्नातकोत्तर",
    experience: "पूर्व गृहमन्त्री, ४ पटक सांसद",
    bio: "पूर्वाञ्चलको अनुभवी नेता। कृषि र औद्योगिक विकासमा विशेष ध्यान।",
    email: "suresh@example.com",
    phone: "+977-1-4000005",
    policies: ["कृषि विकास", "उद्योग प्रवर्धन", "पूर्वाधार निर्माण", "सिँचाइ"],
    initials: "सु.अ.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ५,५०,००,०००",
    previousElections: [
      { year: "२०७९", constituency: "मोरङ-१", result: "विजयी", votes: 25000 },
      { year: "२०७४", constituency: "मोरङ-१", result: "विजयी", votes: 21500 },
      { year: "२०७०", constituency: "मोरङ-१", result: "विजयी", votes: 18900 },
      { year: "२०६४", constituency: "मोरङ-१", result: "पराजित", votes: 12500 },
    ],
  },
  {
    id: "c6",
    name: "मीना राई",
    party: "स्वतन्त्र",
    partyKey: "independent",
    partyColor: "#2d8659",
    constituency: "मोरङ-१",
    constituencyKey: "mor-1",
    province: "koshi",
    district: "morang",
    gender: "female",
    age: 35,
    education: "व्यवसायिक प्रशासनमा MBA",
    experience: "सामाजिक उद्यमी, युवा नेतृ",
    bio: "नयाँ पुस्ताको आवाज। भ्रष्टाचार विरुद्ध र सुशासनका लागि स्वतन्त्र उम्मेदवार।",
    email: "meena@example.com",
    phone: "+977-1-4000006",
    policies: ["भ्रष्टाचार निवारण", "सुशासन", "युवा विकास", "प्रविधि"],
    initials: "मी.रा.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ७५,००,०००",
    previousElections: [],
  },
  {
    id: "c7",
    name: "शंकर पोखरेल",
    party: "नेपाली काँग्रेस",
    partyKey: "congress",
    partyColor: "#c41e3a",
    constituency: "रुपन्देही-१",
    constituencyKey: "rup-1",
    province: "lumbini",
    district: "rupandehi",
    gender: "male",
    age: 58,
    education: "इन्जिनियरिङमा स्नातक",
    experience: "पूर्व भौतिक पूर्वाधार मन्त्री",
    bio: "पूर्वाधार विकासमा विशेषज्ञता भएका अनुभवी नेता।",
    email: "shankar@example.com",
    phone: "+977-1-4000007",
    policies: ["सडक निर्माण", "विद्युत विकास", "सिँचाइ", "औद्योगिक विकास"],
    initials: "शं.पो.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ४,२०,००,०००",
    previousElections: [
      {
        year: "२०७९",
        constituency: "रुपन्देही-१",
        result: "विजयी",
        votes: 23000,
      },
      {
        year: "२०७४",
        constituency: "रुपन्देही-१",
        result: "पराजित",
        votes: 16800,
      },
    ],
  },
  {
    id: "c8",
    name: "राजन गुरुङ",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    partyKey: "raswapa",
    partyColor: "#6b5b4a",
    constituency: "कास्की-१",
    constituencyKey: "kas-1",
    province: "gandaki",
    district: "kaski",
    gender: "male",
    age: 42,
    education: "पर्यटन व्यवस्थापनमा स्नातकोत्तर",
    experience: "पर्यटन उद्यमी, गण्डकी प्रदेश सभा सदस्य",
    bio: "पर्यटन र स्थानीय विकासमा केन्द्रित गण्डकीका लोकप्रिय नेता।",
    email: "rajan@example.com",
    phone: "+977-1-4000008",
    policies: ["पर्यटन प्रवर्धन", "स्थानीय रोजगार", "संस्कृति संरक्षण"],
    initials: "रा.गु.",
    criminalRecord: "कुनै आपराधिक रेकर्ड छैन",
    assets: "रु. ३,८०,००,०००",
    previousElections: [
      { year: "२०७९", constituency: "कास्की-१", result: "विजयी", votes: 21500 },
    ],
  },
];

export default function Candidates() {
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedConstituency, setSelectedConstituency] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedParty, setSelectedParty] = useState("all");
  const [electionType, setElectionType] = useState<"direct" | "proportional">(
    "direct",
  );
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(
    null,
  );
  const [showTopOnly, setShowTopOnly] = useState(true);

  const { data, isLoading, error } = useReportData({
    province: selectedProvince,
    district: selectedDistrict,
    party: selectedParty,
  });
  const {
    summary,
    genderDistribution,
    partyWiseCandidates,
    ageDistribution,
    educationDistribution,
  } = data || {
    genderDistribution: genderDistributionMockData,
    partyWiseCandidates: partyWiseCandidatesMockData,
    ageDistribution: ageDistributionMockData,
    educationDistribution: educationDistributionMockData,
  };
  const {
    totalCandidates,
    totalConstituencies,
    totalIndependent,
    totalParties,
    totalProvinces,
    totalWinners,
  } = summary || {
    totalCandidates: allCandidates.length,
  };
  console.log({
    data,
  });
  const currentDistricts =
    districtsByProvinceMockData[selectedProvince] ||
    districtsByProvinceMockData.all;
  const currentConstituencies = constituenciesByDistrictMockData[
    selectedDistrict
  ] || [{ value: "all", label: "सबै निर्वाचन क्षेत्र" }];

  const filteredCandidates = allCandidates.filter((c) => {
    if (selectedProvince !== "all" && c.province !== selectedProvince)
      return false;
    if (selectedDistrict !== "all" && c.district !== selectedDistrict)
      return false;
    if (
      selectedConstituency !== "all" &&
      c.constituencyKey !== selectedConstituency
    )
      return false;
    if (selectedGender !== "all" && c.gender !== selectedGender) return false;
    if (selectedParty !== "all" && c.partyKey !== selectedParty) return false;
    return true;
  });

  const displayedCandidates = showTopOnly
    ? filteredCandidates.slice(0, 6)
    : filteredCandidates;
  // const totalCandidates = genderDistribution.reduce((s, g) => s + g.value, 0);

  /* ─── Candidate Detail View ─── */
  if (detailCandidate) {
    const c = detailCandidate;
    const totalPolicyCount = c.policies.length;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setDetailCandidate(null)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            उम्मेदवार सूचीमा फर्कनुहोस्
          </button>
        </div>

        {/* Candidate Hero */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${c.partyColor}20`,
                  color: c.partyColor,
                }}
              >
                {c.initials}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {c.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${c.partyColor}20`,
                      color: c.partyColor,
                    }}
                  >
                    {c.party}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {c.constituency}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    उमेर: {c.age}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {c.gender === "male"
                      ? "पुरुष"
                      : c.gender === "female"
                        ? "महिला"
                        : "अन्य"}
                  </span>
                </div>
                <p className="text-foreground text-sm italic">{c.bio}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    शिक्षा
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {c.education}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    अनुभव
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {c.experience}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    सम्पत्ति
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {c.assets}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    आपराधिक रेकर्ड
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {c.criminalRecord}
                </p>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">
                मुख्य नीतिहरू ({totalPolicyCount})
              </h3>
              <div className="flex flex-wrap gap-2">
                {c.policies.map((policy, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: `${c.partyColor}15`,
                      color: c.partyColor,
                    }}
                  >
                    {policy}
                  </span>
                ))}
              </div>
            </div>

            {/* Previous Election History */}
            {c.previousElections.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-5">
                    निर्वाचन इतिहास
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={c.previousElections} margin={{ left: 10 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "मत",
                        ]}
                      />
                      <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                        {c.previousElections.map((e, i) => (
                          <Cell
                            key={i}
                            fill={e.result === "विजयी" ? "#2d8659" : "#c41e3a"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-xl overflow-hidden border border-border">
                  <div className="p-5 bg-primary text-primary-foreground">
                    <h3 className="text-lg font-bold">
                      विस्तृत निर्वाचन इतिहास
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted">
                          <th className="px-4 py-3 text-left font-semibold text-foreground text-sm">
                            वर्ष
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground text-sm">
                            क्षेत्र
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground text-sm">
                            नतिजा
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground text-sm">
                            मत
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.previousElections.map((election, i) => (
                          <tr
                            key={i}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-foreground text-sm font-semibold">
                              {election.year}
                            </td>
                            <td className="px-4 py-3 text-foreground text-sm">
                              {election.constituency}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${election.result === "विजयी" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {election.result}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-foreground text-sm font-semibold">
                              {election.votes.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                सम्पर्क जानकारी
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Mail size={18} className="text-primary" /> {c.email}
                </a>
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Phone size={18} className="text-primary" /> {c.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ─── Main Candidates Page ─── */
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
            <Award size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              उम्मेदवार निर्देशिका
            </h1>
          </div>
          <p className="text-muted-foreground">
            नेपाल भरिका सबै उम्मेदवारहरूको विस्तृत जानकारी, तथ्याङ्क र खोजी
          </p>
        </div>
      </section>

      {/* National Summary Stats */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Users size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                कुल उम्मेदवार
              </p>
              <p className="text-xl font-bold text-foreground">
                {toNepaliNumber(totalCandidates.toLocaleString())}
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <UserCheck size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                पुरुष / महिला
              </p>
              <p className="text-xl font-bold text-foreground">
                {toNepaliNumber(
                  genderDistribution[0]?.value?.toLocaleString() ?? "0",
                )}{" "}
                /{" "}
                {toNepaliNumber(
                  genderDistribution[1]?.value?.toLocaleString() ?? "0",
                )}
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Building2 size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                दलगत उम्मेदवार
              </p>
              <p className="text-xl font-bold text-foreground">
                {toNepaliNumber(
                  (totalCandidates ?? 0) - (totalIndependent ?? 0),
                )}
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <Award size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">
                स्वतन्त्र उम्मेदवार
              </p>
              <p className="text-xl font-bold text-foreground">
                {toNepaliNumber(totalIndependent ?? "0")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infographics */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Filter size={22} className="text-primary" /> उम्मेदवार तथ्याङ्क
          </h2>

          {/* Election Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setElectionType("direct")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${electionType === "direct" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              प्रत्यक्ष (१६५ सिट)
            </button>
            {/* <button
              onClick={() => setElectionType("proportional")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${electionType === "proportional" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              समानुपातिक (११० सिट)
            </button> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Party-wise Bar Chart */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">
                दलगत उम्मेदवार संख्या
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={partyWiseCandidates}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="party"
                    width={80}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "उम्मेदवार",
                    ]}
                  />
                  <Bar dataKey="candidates" radius={[0, 6, 6, 0]}>
                    {partyWiseCandidates.map((p, i) => (
                      <Cell
                        key={i}
                        fill={BAR_COLORS[i % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Pie Chart */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">
                लिङ्ग अनुसार वितरण
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name} ${Math.round((value / totalCandidates) * 100)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                  >
                    {genderDistribution.map((g, i) => (
                      <Cell key={i} fill={g.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "उम्मेदवार",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">
                उमेर समूह अनुसार
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="group"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "उम्मेदवार",
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Education Pie Chart */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-5">
                शैक्षिक योग्यता
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={educationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name} ${Math.round((value / totalCandidates) * 100)}%`
                    }
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                  >
                    {educationDistribution.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "उम्मेदवार",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <AdBanner type="in-content" />

      {/* Filters */}
      <section className="py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Filter size={22} className="text-primary" /> उम्मेदवार खोज्नुहोस्
          </h2>

          <div className="bg-background rounded-xl border border-border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Province */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  प्रदेश
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict("all");
                    setSelectedConstituency("all");
                  }}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {provincesMockData.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  जिल्ला
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedConstituency("all");
                  }}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {currentDistricts.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Constituency */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  निर्वाचन क्षेत्र
                </label>
                <select
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {currentConstituencies.map((c) => (
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
                <label className="block text-sm font-semibold text-foreground mb-2">
                  लिङ्ग
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
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
                <label className="block text-sm font-semibold text-foreground mb-2">
                  राजनीतिक दल
                </label>
                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-card text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {partiesMockData.map((p) => (
                    <option key={p?.value} value={p?.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedProvince("all");
                    setSelectedDistrict("all");
                    setSelectedConstituency("all");
                    setSelectedGender("all");
                    setSelectedParty("all");
                  }}
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
              {filteredCandidates.length} उम्मेदवार भेटियो
              {showTopOnly &&
                filteredCandidates.length > 6 &&
                ` (पहिलो ६ देखाइएको)`}
            </p>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {displayedCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => {
                  setDetailCandidate(candidate);
                  window.scrollTo(0, 0);
                }}
                className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all text-left"
              >
                <div
                  className="h-1.5"
                  style={{ backgroundColor: candidate.partyColor }}
                />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        backgroundColor: `${candidate.partyColor}20`,
                        color: candidate.partyColor,
                      }}
                    >
                      {candidate.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base">
                        {candidate.name}
                      </h3>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: candidate.partyColor }}
                      >
                        {candidate.party}
                      </p>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                        <MapPin size={12} />
                        <span>{candidate.constituency}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                    {candidate.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.policies.slice(0, 3).map((policy, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${candidate.partyColor}10`,
                          color: candidate.partyColor,
                        }}
                      >
                        {policy}
                      </span>
                    ))}
                    {candidate.policies.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        +{candidate.policies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      {candidate.gender === "male"
                        ? "पुरुष"
                        : candidate.gender === "female"
                          ? "महिला"
                          : "अन्य"}{" "}
                      | उमेर {candidate.age}
                    </span>
                    <span className="text-xs text-primary font-semibold flex items-center gap-1">
                      विस्तृत हेर्नुहोस् <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Show All / Less */}
          {filteredCandidates.length > 6 && (
            <div className="text-center">
              <button
                onClick={() => setShowTopOnly(!showTopOnly)}
                className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                {showTopOnly
                  ? `सबै ${filteredCandidates.length} उम्मेदवार हेर्नुहोस्`
                  : "कम देखाउनुहोस्"}
              </button>
            </div>
          )}

          {filteredCandidates.length === 0 && (
            <div className="bg-background border border-border rounded-xl p-8 text-center">
              <UserCheck
                size={48}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-foreground font-semibold mb-1">
                कुनै उम्मेदवार भेटिएन
              </p>
              <p className="text-sm text-muted-foreground">
                कृपया फिल्टर परिवर्तन गर्नुहोस्
              </p>
            </div>
          )}
        </div>
      </section>

      <GoogleAdSense />

      <Footer />
    </div>
  );
}
