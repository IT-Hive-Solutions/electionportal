'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  type: 'banner' | 'sidebar' | 'in-content';
  position?: 'top' | 'middle' | 'bottom';
}

export default function AdBanner({ type, position = 'middle' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) return null;

  if (type === 'banner') {
    return (
      <div className="bg-foreground text-background py-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-75">प्रायोजित सामग्री / Sponsored</p>
            <p className="text-base font-bold mt-1">तपाईंको संस्था यहाँ - मतदातासम्म प्रभावकारी रूपमा पुग्नुहोस्</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-background/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="विज्ञापन बन्द गर्नुहोस्"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="bg-card rounded-xl border-2 border-border p-6 max-w-sm mx-auto my-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-2">प्रायोजक विज्ञापन</p>
          <div className="bg-muted rounded-lg py-8 px-4 mb-4">
            <p className="text-sm font-semibold text-muted-foreground">तपाईंको विज्ञापन यहाँ</p>
            <p className="text-xs text-muted-foreground mt-2">300x300 वा लचिलो आकार</p>
          </div>
          <a
            href="/support-us"
            className="inline-block text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            प्रायोजन बारेमा जान्नुहोस् &rarr;
          </a>
        </div>
      </div>
    );
  }

  // in-content
  return (
    <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 my-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-2">प्रायोजित सामग्री</p>
          <div className="bg-card rounded-lg p-4 mb-4 border border-border">
            <p className="font-semibold text-foreground mb-2">विशेष प्रायोजक</p>
            <p className="text-sm text-muted-foreground">संस्थाको सन्देश वा सामग्री यहाँ देखिन्छ</p>
          </div>
          <a href="/support-us" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            हाम्रो प्ल्याटफर्ममा विज्ञापन दिनुहोस् &rarr;
          </a>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
          aria-label="विज्ञापन बन्द गर्नुहोस्"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
