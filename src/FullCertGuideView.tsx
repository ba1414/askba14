import React, { useState, useEffect } from 'react';
import { FULL_CERT_GUIDE } from './content/fullCertGuide';
import { ExternalLink, ChevronRight, Menu, X, ArrowUp } from 'lucide-react';
import { AppleEmoji } from './components/AppleEmoji';

const FullCertGuideView = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = FULL_CERT_GUIDE.sections.map((_, index) => document.getElementById(`section-${index}`));
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

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-900/10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-200/20 dark:bg-teal-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

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
              {FULL_CERT_GUIDE.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === `section-${index}`
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg)]'
                  }`}
                >
                  {section.title}
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
            <div className="space-y-1">
              {FULL_CERT_GUIDE.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                    activeSection === `section-${index}`
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className="truncate relative z-10">{section.title.replace(/^\d+\)\s/, '')}</span>
                  {activeSection === `section-${index}` && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-xl" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Header */}
          <div className="text-center space-y-8 mb-16 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-900/20 text-teal-600 dark:text-teal-400 shadow-lg shadow-teal-500/10 mb-4 ring-1 ring-teal-500/10 animate-fade-in-up">
              <AppleEmoji emoji="📜" className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-[var(--text)] tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--text)] to-[var(--text-muted)]">
                {FULL_CERT_GUIDE.title}
              </h1>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                {FULL_CERT_GUIDE.intro}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-20">
            {FULL_CERT_GUIDE.sections.map((section, index) => (
              <div 
                key={index}
                id={`section-${index}`}
                className="scroll-mt-32 group"
              >
                <div className="flex items-center gap-5 mb-8">
                  <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl font-bold font-mono shadow-sm ring-1 ring-teal-500/10 group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] tracking-tight">
                    {section.title.replace(/^\d+\)\s/, '')}
                  </h2>
                </div>
                
                <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-[2rem] p-6 md:p-10 shadow-sm border border-[var(--border-subtle)] space-y-6 hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                  {section.content.map((paragraph, pIndex) => {
                    // List item handling
                    if (paragraph.trim().startsWith('•') || /^\d+\./.test(paragraph.trim())) {
                      const isNumbered = /^\d+\./.test(paragraph.trim());
                      return (
                        <div key={pIndex} className="flex gap-4 pl-2 group/item hover:translate-x-1 transition-transform duration-200">
                          <div className={`mt-2.5 w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${isNumbered ? 'bg-teal-500 ring-2 ring-teal-200 dark:ring-teal-900' : 'bg-[var(--text-muted)]'}`} />
                          <p className="text-[var(--text)] leading-relaxed text-lg">
                            {paragraph.replace(/^[•\d\.]+\s*/, '')}
                          </p>
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <p key={pIndex} className="text-[var(--text-muted)] leading-relaxed text-lg md:text-xl font-normal">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-[var(--primary)] text-[#020617] rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FullCertGuideView;
