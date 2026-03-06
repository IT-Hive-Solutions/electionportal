'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function FloatingPredictionButton({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <button
        className="fixed bottom-50 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
        aria-label="प्रक्षेपण प्रयोग गर्नुहोस्"
        onClick={onClick}
      >
        <Sparkles size={22} />
        <span className="font-bold text-sm hidden sm:inline">प्रक्षेपण प्रयोग गर्नुहोस्</span>
      </button>
    </>
  );
}
