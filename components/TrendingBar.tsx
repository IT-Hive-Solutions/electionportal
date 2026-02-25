'use client';

import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

const trendingConstituencies = [
  'काठमाडौं-१',
  'ललितपुर-२',
  'भक्तपुर-१',
  'मोरङ-३',
  'चितवन-२',
  'कास्की-१',
  'रुपन्देही-३',
  'झापा-४',
];

export default function TrendingBar() {
  return (
    <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TrendingUp size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">ट्रेन्डिङ</span>
        </div>
        <div className="overflow-hidden relative">
          <div className="flex items-center gap-3 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
            {[...trendingConstituencies, ...trendingConstituencies].map((name, i) => (
              <Link
                key={i}
                href={`/candidates?constituency=${encodeURIComponent(name)}`}
                className="bg-secondary-foreground/15 hover:bg-secondary-foreground/25 text-secondary-foreground px-3 py-0.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
