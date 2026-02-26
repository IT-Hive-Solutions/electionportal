"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import GoogleAdSense from "@/components/GoogleAdSense";
import { useManifestos } from "@/core/hooks/manifesto/use-manifesto";
import { DIRECTUS_BASE_URL, getDownloadUrl } from "@/core/lib/directus";

export default function Manifestos() {
  const { manifestos, isLoading, error } = useManifestos();

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
            <FileText size={28} className="text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              दलीय घोषणापत्र
            </h1>
          </div>
          <p className="text-muted-foreground">
            सबै दलको विस्तृत कार्यक्रम र नीतिगत स्थिति पढ्नुहोस्
          </p>
        </div>
      </section>

      <AdBanner type="banner" position="top" />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Loading skeletons ── */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl overflow-hidden border border-border animate-pulse"
                >
                  <div className="h-16 bg-muted" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-3 bg-muted rounded w-4/5" />
                    <div className="h-14 bg-muted rounded-lg mt-1" />
                    <div className="flex gap-3 mt-1">
                      <div className="flex-1 h-9 bg-muted rounded-lg" />
                      <div className="flex-1 h-9 bg-muted rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="text-center py-16">
              <FileText
                size={48}
                className="mx-auto mb-3 text-muted-foreground opacity-30"
              />
              <p className="text-red-500 font-semibold">{error}</p>
            </div>
          )}

          {/* ── Manifesto cards ── */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {manifestos.map((m) => (
                <div
                  key={m.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
                >
                  {/* Party color header */}
                  <div
                    className="h-16 flex items-center justify-center"
                    style={{ backgroundColor: m.partyColor }}
                  >
                    <h2 className="text-xl font-bold text-white">
                      {m.partyName}
                    </h2>
                  </div>

                  <div className="p-5">
                    {/* Main Focus */}
                    {m.mainFocus && (
                      <div className="mb-3 pb-3 border-b border-border">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          मुख्य फोकस
                        </p>
                        <h3 className="text-base font-bold text-foreground">
                          {m.mainFocus}
                        </h3>
                      </div>
                    )}

                    {/* Main Point */}
                    {m.mainPoint && (
                      <div className="mb-4">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          मुख्य बुँदा
                        </p>
                        <p className="text-sm text-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                          {m.mainPoint}
                        </p>
                      </div>
                    )}

                    {/* Summary — rich text HTML from Directus */}
                    {m.summary && (
                      <div className="mb-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          सारांश
                        </p>
                        <ul className="text-sm text-foreground ml-3 list-disc ">
                          {m.summary.map((data, i) => (
                            <li key={i}>{data}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* No content fallback */}
                    {!m.mainFocus && !m.mainPoint && !m.summary && (
                      <p className="text-sm text-muted-foreground mb-4 italic">
                        विस्तृत जानकारी उपलब्ध छैन।
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {/* Read full — links to file preview if available */}
                      {m.fileId ? (
                        <a
                          href={`${DIRECTUS_BASE_URL}/assets/${m.fileId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <FileText size={16} />
                          पूर्ण पढ्नुहोस्
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 bg-primary/30 text-primary-foreground/60 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 text-sm cursor-not-allowed"
                        >
                          <FileText size={16} />
                          उपलब्ध छैन
                        </button>
                      )}

                      {/* Download */}
                      {m.fileId ? (
                        <a
                          href={getDownloadUrl(m.fileId)}
                          className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Download size={16} />
                          डाउनलोड
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 bg-muted/50 text-muted-foreground font-semibold py-2 rounded-lg flex items-center justify-center gap-2 text-sm cursor-not-allowed"
                        >
                          <Download size={16} />
                          डाउनलोड
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {manifestos.length === 0 && (
                <div className="col-span-2 text-center py-16 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-3 opacity-30" />
                  <p>कुनै घोषणापत्र उपलब्ध छैन।</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <GoogleAdSense />

      <section className="py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">
            दलीय नीतिहरू तुलना गर्नुहोस्
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            हाम्रो अन्तरक्रियात्मक तुलना उपकरण प्रयोग गरेर दलहरू बीचको भिन्नता
            हेर्नुहोस्
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-6 rounded-lg transition-colors text-sm">
            तुलना उपकरण खोल्नुहोस्
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
