'use client';

import Link from 'next/link';
import { Menu, X, Vote, Brain, Sparkles } from 'lucide-react';
import { useState } from 'react';
import TrendingBar from './TrendingBar';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/results', label: 'नतिजा' },
    { href: '/candidates', label: 'उम्मेदवार' },
    { href: '/voter-guide', label: 'मतदाता गाइड' },
    { href: '/manifestos', label: 'घोषणापत्र' },
    { href: '/support-us', label: 'सहयोग गर्नुहोस्' },
  ];

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="bg-primary p-1.5 rounded-lg">
                <Vote size={26} className="text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-primary leading-tight">नेपाल निर्वाचन</div>
                <div className="text-[10px] text-muted-foreground leading-tight">Nepal Election Portal</div>
              </div>
            </Link>

            {/* Prediction Button */}
            <div className="flex-1 flex justify-center sm:justify-end">
              <Link href="/prediction" title="प्रक्षेपण प्रयोग गर्नुहोस्">
                <span className="fixed bottom-50 right-6  flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse">
                  <Sparkles size={18} />
                  प्रक्षेपण प्रयोग गर्नुहोस्
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {/* Quiz CTA Button - Highlighted */}
              <Link
                href="/quiz"
                className="ml-2 flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Brain size={16} />
                क्विज खेल्नुहोस्
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="मेनु खोल्नुहोस्"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="lg:hidden pb-4 border-t border-border">
              <div className="flex flex-col gap-1 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/quiz"
                  className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Brain size={16} />
                  क्विज खेल्नुहोस्
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      <TrendingBar />
    </>
  );
}
