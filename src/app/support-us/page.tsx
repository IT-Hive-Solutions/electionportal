'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SupportUs() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [adFormSent, setAdFormSent] = useState(false);

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  हाम्रो पोर्टलमा विज्ञापन दिन चाहनुहुन्छ? हामीसँग सम्पर्क गर्नुहोस्। हामी तपाईंको आवश्यकता अनुसार
                  विज्ञापन स्थान र मूल्य निर्धारण गर्न सक्छौं।
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      setAdFormSent(true);
                    }}
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
            <p className="text-sm text-muted-foreground mb-6 text-center">
              तपाईंको सन्देश वा प्रतिक्रिया हामीलाई पठाउनुहोस्। हामी छिट्टै जवाफ दिनेछौं।
            </p>
            <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
              {/* Name */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="name">
                  नाम
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="तपाईंको नाम"
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="email">
                  इमेल
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="तपाईंको इमेल"
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="phone">
                  फोन
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+977-XXXXXXXXX"
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="message">
                  सन्देश
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="तपाईंको सन्देश यहाँ लेख्नुहोस्"
                  rows={4}
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                पठाउनुहोस्
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
