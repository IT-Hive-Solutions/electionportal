'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import GoogleAdSense from '@/components/GoogleAdSense';

export default function VoterGuide() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'मतदान गरेपछि म के गर्न सक्छु?',
      a: 'मसीले रङ लगाइएको औँलाको तस्वीर लिन सक्नुहुन्छ र #IVoted ह्यासट्यागसहित साझा गर्न सक्नुहुन्छ।',
    },
    {
      q: 'यदि मेरो नाम नामावलीमा छैन भने?',
      a: 'तुरुन्तै मतदान अधिकारीसँग सम्पर्क गर्नुहोस्। उहाँहरूले तपाईंलाई सहयोग गर्नुहुनेछ।',
    },
    {
      q: 'विदेशबाट मतदान गर्न सकिन्छ?',
      a: 'हाल नेपालमा विदेशबाट मतदानको व्यवस्था छैन। तपाईंले नेपालमै उपस्थित भई मतदान गर्नुपर्छ।',
    },
    {
      q: 'मतपत्र कसरी भर्ने?',
      a: 'आफूले रोजेको दल वा उम्मेदवारको बाकसमा छाप लगाउनुहोस्।',
    },
  ];

  const votingProcess = [
    { step: '१', title: 'मतदान केन्द्र खोज्नुहोस्', description: 'आफूलाई तोकिएको मतदान केन्द्र पहिचान गर्नुहोस्' },
    { step: '२', title: 'परिचय पत्र ल्याउनुहोस्', description: 'वैध परिचय पत्र र मतदाता परिचय पत्र ल्याउनुहोस्' },
    { step: '३', title: 'नामावली जाँच गर्नुहोस्', description: 'अधिकारीले नामावलीमा तपाईंको नाम खोज्नुहुनेछ' },
    { step: '४', title: 'मतपत्र लिनुहोस्', description: 'मतपत्र र छाप प्राप्त गर्नुहोस्' },
    { step: '५', title: 'बुथ भित्र मतदान गर्नुहोस्', description: 'गोप्यतामा आफूले रोजेको दलमा मत दिनुहोस्' },
    { step: '६', title: 'मतपत्र जम्मा गर्नुहोस्', description: 'भरिएको मतपत्र मतपेटिकामा जम्मा गर्नुहोस्' },
  ];

  const requirements = [
    { text: 'नेपाली नागरिकता' },
    { text: '१८ वर्ष वा सोभन्दा माथिको उमेर' },
    { text: 'मतदाता नामावलीमा दर्ता' },
    { text: 'मानसिक रूपमा सक्षम' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={28} className="text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">मतदाता गाइड</h1>
          </div>
          <p className="text-muted-foreground">सबै मतदाताका लागि आवश्यक जानकारी</p>
        </div>
      </section>

      <AdBanner type="banner" position="top" />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Requirements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">मतदाता हुनका लागि आवश्यकताहरू</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <CheckCircle size={22} className="text-primary flex-shrink-0" />
                  <p className="text-foreground font-semibold text-sm">{req.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Voting Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">मतदान प्रक्रिया</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {votingProcess.map((process, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground font-bold text-lg rounded-full flex items-center justify-center flex-shrink-0">
                      {process.step}
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{process.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          <GoogleAdSense />

          {/* Important Dates */}
          <div className="mb-12 bg-primary/5 border-l-4 border-primary rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">महत्त्वपूर्ण मितिहरू</h2>
            </div>
            <ul className="flex flex-col gap-2 text-foreground text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>मतदान दिन: २०८३ साल (निर्वाचन आयोगको घोषणा अनुसार)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>मतदाता नामावली अन्तिम: मतदान अघि २ हप्ता</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>मतदान केन्द्र खोज्नुहोस्: निर्वाचन आयोगको वेबसाइटमा</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">बारम्बार सोधिने प्रश्नहरू</h2>
            <div className="flex flex-col gap-3 max-w-3xl">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                  >
                    <p className="font-semibold text-foreground text-sm pr-4">{item.q}</p>
                    {openAccordion === index
                      ? <ChevronUp size={18} className="text-muted-foreground flex-shrink-0" />
                      : <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
                    }
                  </button>
                  {openAccordion === index && (
                    <div className="px-5 pb-4 border-t border-border">
                      <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdBanner type="sidebar" position="middle" />

      <Footer />
    </div>
  );
}
