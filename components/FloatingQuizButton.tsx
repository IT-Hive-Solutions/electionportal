'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function FloatingQuizButton() {
  return (
    <Link
      href="/quiz"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
      aria-label="क्विज खेल्नुहोस्"
    >
      <Brain size={22} />
      <span className="font-bold text-sm hidden sm:inline">क्विज खेल्नुहोस्</span>
    </Link>
  );
}
