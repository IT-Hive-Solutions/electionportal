'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import GoogleAdSense from '@/components/GoogleAdSense';

export default function Manifestos() {
  const manifestos = [
    {
      party: 'नेपाली काँग्रेस',
      shortName: 'ने.का.',
      color: 'bg-primary',
      focus: 'आर्थिक विकास र पूर्वाधार',
      policies: ['पूर्वाधार विकास', 'व्यापार लगानी प्रोत्साहन', 'रोजगार सृजना', 'प्रविधि अपनाउने'],
      highlights: 'जीडीपी वृद्धि र आधुनिक पूर्वाधार परियोजनाहरूमा केन्द्रित',
    },
    {
      party: 'नेकपा एमाले',
      shortName: 'एमाले',
      color: 'bg-secondary',
      focus: 'सामाजिक कल्याण र समुदाय',
      policies: ['स्वास्थ्य सेवा विस्तार', 'शिक्षा सुधार', 'सामाजिक सुरक्षा जाल', 'समुदाय विकास'],
      highlights: 'सार्वजनिक कल्याण र समावेशी वृद्धिमा जोड',
    },
    {
      party: 'नेकपा माओवादी केन्द्र',
      shortName: 'माओ.',
      color: 'bg-destructive',
      focus: 'सन्तुलित विकास',
      policies: ['समान क्षेत्रीय विकास', 'समावेशी वृद्धि', 'सार्वजनिक-निजी साझेदारी', 'शिक्षा र स्वास्थ्य'],
      highlights: 'सबै क्षेत्रमा विकासका लागि व्यापक दृष्टिकोण',
    },
    {
      party: 'राष्ट्रिय स्वतन्त्र पार्टी',
      shortName: 'रास्वपा',
      color: 'bg-chart-4',
      focus: 'वातावरणीय दिगोपन',
      policies: ['जलवायु कार्य', 'हरित ऊर्जा', 'संरक्षण', 'दिगो कृषि'],
      highlights: 'जलवायु कार्य र वातावरण संरक्षणमा अग्रणी',
    },
    {
      party: 'जनता समाजवादी पार्टी',
      shortName: 'जसपा',
      color: 'bg-chart-5',
      focus: 'स्वतन्त्र बजार र नवाचार',
      policies: ['बजार उदारीकरण', 'व्यापार प्रोत्साहन', 'नवाचार समर्थन', 'डिजिटल अर्थतन्त्र'],
      highlights: 'नवाचार र उद्यमशीलतामा जोड दिने व्यापार अनुकूल नीतिहरू',
    },
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
            <FileText size={28} className="text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">दलीय घोषणापत्र</h1>
          </div>
          <p className="text-muted-foreground">सबै दलको विस्तृत कार्यक्रम र नीतिगत स्थिति पढ्नुहोस्</p>
        </div>
      </section>

      <AdBanner type="banner" position="top" />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {manifestos.map((manifesto, idx) => (
              <div key={idx} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                <div className={`${manifesto.color} h-16 flex items-center justify-center text-primary-foreground`}>
                  <h2 className="text-xl font-bold">{manifesto.party}</h2>
                </div>
                <div className="p-5">
                  <div className="mb-3 pb-3 border-b border-border">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">मुख्य फोकस</p>
                    <h3 className="text-base font-bold text-foreground">{manifesto.focus}</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">मुख्य नीतिहरू</p>
                    <ul className="flex flex-col gap-1.5">
                      {manifesto.policies.map((policy, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          {policy}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">मुख्य अंश: </span>
                      {manifesto.highlights}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      <FileText size={16} />
                      पूर्ण पढ्नुहोस्
                    </button>
                    <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      <Download size={16} />
                      डाउनलोड
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoogleAdSense />

      <section className="py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">दलीय नीतिहरू तुलना गर्नुहोस्</h2>
          <p className="text-muted-foreground text-sm mb-5">हाम्रो अन्तरक्रियात्मक तुलना उपकरण प्रयोग गरेर दलहरू बीचको भिन्नता हेर्नुहोस्</p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-6 rounded-lg transition-colors text-sm">
            तुलना उपकरण खोल्नुहोस्
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
