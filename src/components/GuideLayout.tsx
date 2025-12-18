import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp, ChevronRight } from 'lucide-react';
import { AppleEmoji } from './AppleEmoji';

interface GuideSection {
  title: string;
  content: string[];
}

interface GuideData {
  title: string;
  intro?: string;
  sections: GuideSection[];
}

interface GuideLayoutProps {
  guide: GuideData;
  emoji?: string;
  titleImageBaseName?: string; // e.g. "yr1_title" -> tries .png then .jpg
}

export const GuideLayout: React.FC<GuideLayoutProps> = ({ guide, emoji, titleImageBaseName }) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [processedTitleImage, setProcessedTitleImage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = guide.sections.map((_, index) => document.getElementById(`section-${index}`));
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
  }, [guide.sections]);

  // Image Processing
  useEffect(() => {
    if (!titleImageBaseName) return;

    let cancelled = false;
    const base = import.meta.env.BASE_URL || '/';
    const candidates = [`${base}${titleImageBaseName}.png`, `${base}${titleImageBaseName}.jpg`];

    const tryLoad = (index: number) => {
      if (cancelled) return;
      if (index >= candidates.length) {
        setProcessedTitleImage(null);
        return;
      }
      const src = candidates[index];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (cancelled) return;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setProcessedTitleImage(src);
            return;
          }
          ctx.drawImage(img, 0, 0);
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i], g = d[i+1], b = d[i+2];
              // Remove white/near-white background
              if (r > 240 && g > 240 && b > 240) d[i+3] = 0;
            }
            ctx.putImageData(imgData, 0, 0);
            setProcessedTitleImage(canvas.toDataURL('image/png'));
          } catch (e) {
            console.warn('Canvas read failed', e);
            setProcessedTitleImage(src);
          }
        } catch (e) {
          console.warn('Image processing failed', e);
          setProcessedTitleImage(src);
        }
      };
      img.onerror = () => tryLoad(index + 1);
      img.src = src;
    };

    tryLoad(0);
    return () => { cancelled = true; };
  }, [titleImageBaseName]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans selection:bg-[#0066CC]/20 dark:selection:bg-[#2997ff]/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-16 z-30 bg-[#F5F5F7]/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Table of Contents</span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm pt-32" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white dark:bg-[#1c1c1e] mx-4 rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-2 space-y-0.5">
              {guide.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(`section-${index}`)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                    activeSection === `section-${index}`
                      ? 'bg-[#0066CC]/10 text-[#0066CC] dark:text-[#2997ff]'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {section.title.replace(/^\d+\)\s/, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex gap-12 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 sticky top-32 flex-shrink-0">
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">
              On this page
            </h3>
            {guide.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(`section-${index}`)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] leading-5 transition-colors ${
                  activeSection === `section-${index}`
                    ? 'text-[#0066CC] dark:text-[#2997ff] font-semibold bg-[#0066CC]/5 dark:bg-[#2997ff]/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {section.title.replace(/^\d+\)\s/, '')}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          
          {/* Hero Section */}
          <div className="mb-16 text-center lg:text-left">
            {emoji && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-[#1c1c1e] shadow-sm mb-6">
                <AppleEmoji emoji={emoji} className="w-8 h-8" />
              </div>
            )}
            
            {titleImageBaseName ? (
              <div className="mb-8">
                <img
                  src={processedTitleImage || `${import.meta.env.BASE_URL}${titleImageBaseName}.jpg`}
                  alt={guide.title}
                  className="w-full max-w-2xl h-auto object-contain filter dark:invert mx-auto lg:mx-0"
                  style={{ background: 'transparent' }}
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
                {imgError && (
                  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
                    {guide.title}
                  </h1>
                )}
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
                {guide.title}
              </h1>
            )}

            {guide.intro && (
              <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl">
                {guide.intro}
              </p>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-16">
            {guide.sections.map((section, index) => (
              <section 
                key={index}
                id={`section-${index}`}
                className="scroll-mt-32"
              >
                <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800">
                  <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <span className="text-[#0066CC] dark:text-[#2997ff] font-bold text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {section.title.replace(/^\d+\)\s/, '')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {section.content.map((paragraph, pIndex) => {
                      // Helper to render bold text
                      const renderText = (text: string) => {
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        });
                      };

                      const trimmed = paragraph.trim();
                      
                      // 1. Subsections (### or （一）etc)
                      if (trimmed.startsWith('###') || /^[（(][一二三四五六七八九十][）)]/.test(trimmed)) {
                        return (
                          <h3 key={pIndex} className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-6 mb-2">
                            {renderText(trimmed.replace(/^###\s*/, ''))}
                          </h3>
                        );
                      }

                      // 2. Highlight Boxes (💡, ✨, 建議：, 示例：)
                      if (trimmed.startsWith('💡') || trimmed.startsWith('✨') || trimmed.startsWith('建議：') || trimmed.startsWith('示例') || trimmed.startsWith('穩健答法')) {
                        return (
                          <div key={pIndex} className="my-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                            <p className="text-[17px] leading-relaxed font-medium text-gray-800 dark:text-gray-200">
                              {renderText(trimmed)}
                            </p>
                          </div>
                        );
                      }

                      // 3. Lists
                      const isList = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                      const isNumbered = /^\d+\./.test(trimmed);
                      
                      if (isList) {
                        return (
                          <div key={pIndex} className="flex gap-4 pl-2">
                            <div className={`mt-[0.6em] w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isNumbered 
                                ? 'bg-[#0066CC] dark:bg-[#2997ff]' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            <p className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
                              {renderText(trimmed.replace(/^[•\d\.]+\s*/, ''))}
                            </p>
                          </div>
                        );
                      }

                      // 4. Standard Paragraph
                      return (
                        <p key={pIndex} className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
                          {renderText(paragraph)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
