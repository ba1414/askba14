import React, { useState, useEffect } from 'react';
import { OFFER_GUIDE } from './content/offerGuide';
import { ExternalLink, ChevronRight, Menu, X, ArrowUp, CheckCircle2, FileText, CreditCard, Scale, Mail, PartyPopper } from 'lucide-react';
import { AppleEmoji } from './components/AppleEmoji';

const OfferGuideView = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = OFFER_GUIDE.sections.map((_, index) => document.getElementById(`section-${index}`));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(`section-${i}`);
          break;
        }
      }

      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render content with special formatting
  const renderContent = (content: string[]) => {
    return content.map((paragraph, index) => {
      // Check for special markers
      const isHeader = paragraph.startsWith('【') && paragraph.endsWith('】');
      const isBullet = paragraph.startsWith('•') || paragraph.match(/^\d+\./);
      const isQuote = paragraph.startsWith('「') || paragraph.startsWith('“') || paragraph.startsWith('>');
      const isCheck = paragraph.startsWith('✅');

      if (isHeader) {
        return (
          <h4 key={index} className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-6 mb-3 flex items-center">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full mr-2"></span>
            {paragraph.replace(/[【】]/g, '')}
          </h4>
        );
      }

      if (isQuote) {
        return (
          <div key={index} className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 p-4 rounded-r-xl my-4 text-[var(--text)] italic">
            <p className="pl-1">{paragraph}</p>
          </div>
        );
      }

      if (isCheck) {
        return (
          <div key={index} className="flex items-start py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl my-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-[var(--text)] font-medium">{paragraph.replace('✅', '')}</p>
          </div>
        );
      }

      if (isBullet) {
        return (
          <div key={index} className="flex items-start py-1.5">
            <div className="mt-2 mr-3 min-w-[6px] h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
            <p className="text-[var(--text)] leading-relaxed">{paragraph.replace(/^[•\d+\.]\s*/, '')}</p>
          </div>
        );
      }

      return (
        <p key={index} className="text-[var(--text)] leading-relaxed mb-3 text-lg">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-200/20 dark:bg-teal-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-16 z-30 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm text-[var(--text-muted)]">目錄</span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-[var(--surface)] rounded-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile TOC Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm pt-32" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[var(--surface)] mx-4 rounded-2xl shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 space-y-1">
              {OFFER_GUIDE.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === `section-${index}`
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg)]'
                  }`}
                >
                  {section.title.split('：')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex gap-12 items-start">
        {/* Sidebar TOC (Desktop) */}
        <div className="hidden lg:block w-72 sticky top-24 flex-shrink-0">
          <div className="bg-[var(--surface)]/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-[var(--border-subtle)] transition-all duration-300 hover:shadow-md">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Menu size={14} />
              目錄
            </h3>
            <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
              {OFFER_GUIDE.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                    activeSection === `section-${index}`
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 translate-x-1'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className="truncate mr-2">{section.title.split('：')[0]}</span>
                  {activeSection === `section-${index}` && (
                    <ChevronRight size={14} className="flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Header */}
          <div className="bg-[var(--surface)] rounded-3xl p-8 md:p-10 shadow-sm border border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Offer Guide
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-[var(--text)] mb-6 tracking-tight leading-tight">
                {OFFER_GUIDE.title}
              </h1>
              
              <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed">
                {OFFER_GUIDE.intro}
              </p>
            </div>
          </div>

          {/* Sections */}
          {OFFER_GUIDE.sections.map((section, index) => (
            <div 
              id={`section-${index}`}
              key={index}
              className="bg-[var(--surface)] rounded-3xl p-8 md:p-10 shadow-sm border border-[var(--border-subtle)] scroll-mt-32 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  {index === 0 ? <FileText size={24} /> :
                   index === 1 ? <CreditCard size={24} /> :
                   index === 2 ? <Scale size={24} /> :
                   index === 3 ? <Mail size={24} /> :
                   <PartyPopper size={24} />}
                </div>
                <h2 className="text-2xl font-bold text-[var(--text)] pt-2">
                  {section.title}
                </h2>
              </div>
              
              <div className="pl-0 md:pl-16">
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-[var(--primary)] text-white rounded-full shadow-lg hover:bg-[var(--primary-strong)] transition-all duration-300 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default OfferGuideView;
