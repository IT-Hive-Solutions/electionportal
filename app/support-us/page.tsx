'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SupportUs() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [adFormSent, setAdFormSent] = useState(false);

  const donationAmounts = [
    { amount: 'रु. १००', engAmount: '100', label: 'सुरुवात गर्नुहोस्' },
    { amount: 'रु. ५००', engAmount: '500', label: 'नियमित समर्थक' },
    { amount: 'रु. १,०००', engAmount: '1000', label: 'प्रमुख समर्थक' },
    { amount: 'रु. ५,०००', engAmount: '5000', label: 'संरक्षक' },
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
            <Heart size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">हामीलाई सहयोग गर्नुहोस्</h1>
          </div>
          <p className="text-muted-foreground">पारदर्शी निर्वाचन जानकारीका लागि हामीलाई सहयोग गर्नुहोस्</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mb-12 bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">हाम्रो लक्ष्य</h2>
            <p className="text-foreground leading-relaxed text-sm">
              नेपाल निर्वाचन पोर्टल सबै नागरिकलाई पारदर्शी, निष्पक्ष र सहज निर्वाचन जानकारी प्रदान गर्न प्रतिबद्ध छ।
              तपाईंको सहयोगले हामीलाई यो सेवा निरन्तर सञ्चालन गर्न मद्दत गर्छ।
            </p>
          </div>

          {/* Donation Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">दान गर्नुहोस्</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {donationAmounts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAmount(item.engAmount)}
                  className={`p-4 border rounded-xl transition-all text-center ${
                    selectedAmount === item.engAmount
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border hover:border-primary hover:bg-primary/5 text-foreground'
                  }`}
                >
                  <div className="text-xl font-bold mb-1">{item.amount}</div>
                  <div className="text-xs opacity-80">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-foreground mb-3">eSewa मार्फत दान गर्नुहोस्</h3>
                <p className="text-sm text-muted-foreground mb-4">eSewa को माध्यमबाट सुरक्षित र तुरुन्त दान गर्नुहोस्</p>
                <button className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  {selectedAmount ? `eSewa मार्फत रु. ${selectedAmount} दान गर्नुहोस्` : 'eSewa मार्फत दान गर्नुहोस्'}
                </button>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-foreground mb-3">QR कोड मार्फत दान गर्नुहोस्</h3>
                <p className="text-sm text-muted-foreground mb-4">मोबाइलबाट QR कोड स्क्यान गर्नुहोस्</p>
                <div className="bg-muted rounded-lg p-6 mb-4 flex items-center justify-center">
                  <div className="w-28 h-28 bg-card border-2 border-primary rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">QR कोड</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us for Advertisement */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">विज्ञापनका लागि सम्पर्क गर्नुहोस्</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <p className="text-foreground text-sm leading-relaxed mb-6">
                  हाम्रो पोर्टलमा विज्ञापन दिन चाहनुहुन्छ? हामीसँग सम्पर्क गर्नुहोस्।
                  हामी तपाईंको आवश्यकता अनुसार विज्ञापन स्थान र मूल्य निर्धारण गर्न सक्छौं।
                </p>

                {adFormSent ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={28} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">सन्देश पठाइयो!</h3>
                    <p className="text-sm text-muted-foreground">हामी चाँडै तपाईंसँग सम्पर्क गर्नेछौं।</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setAdFormSent(true); }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">नाम</label>
                      <input
                        type="text"
                        required
                        placeholder="तपाईंको नाम"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">इमेल</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">फोन नम्बर</label>
                      <input
                        type="tel"
                        placeholder="+977-XXXXXXXXXX"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">संस्था/कम्पनी</label>
                      <input
                        type="text"
                        placeholder="तपाईंको संस्था"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-foreground mb-2">सन्देश</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="विज्ञापनको बारेमा विवरण लेख्नुहोस्..."
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-foreground bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
                      >
                        <Send size={16} />
                        सन्देश पठाउनुहोस्
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">हामीसँग सम्पर्क गर्नुहोस्</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">इमेल</p>
                  <p className="text-sm font-semibold text-foreground">support@nepalelection.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">फोन</p>
                  <p className="text-sm font-semibold text-foreground">+977-1-XXXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ठेगाना</p>
                  <p className="text-sm font-semibold text-foreground">काठमाडौं, नेपाल</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
