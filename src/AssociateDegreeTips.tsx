import React, { useState, useRef } from 'react';
import { 
  ChevronDown, Share2, Copy, Calendar, Brain, GraduationCap, ArrowRight
} from 'lucide-react';
import { BIG_PICTURE, TIMELINE_DATA, MINDSET, TimelineItem } from './content/assoRoadmap';
import { PERSONAL_STATEMENT_GUIDE } from './content/personalStatement';
import { AppleEmoji } from './components/AppleEmoji';

// --- Helper Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Sub-Views ---

const UnifiedTimelineView = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative">
      {/* Continuous Vertical Line */}
      <div className="absolute left-[27px] md:left-[31px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

      <div className="space-y-8">
        {TIMELINE_DATA.map((stage, index) => {
          return (
            <FadeIn key={stage.id} delay={index * 100}>
              <div className="relative pl-16 md:pl-20">
                
                {/* Timeline Node */}
                <div className="absolute left-0 top-0 w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-2xl bg-[var(--bg-app-page)] border border-border shadow-sm flex items-center justify-center z-10 transition-transform duration-300 hover:scale-110 hover:shadow-md">
                  <AppleEmoji emoji={stage.icon} className="w-7 h-7 md:w-8 md:h-8" />
                </div>

                {/* Content Card */}
                <div className="group relative bg-[var(--bg-app-card)] border border-border rounded-[24px] p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                      {stage.title}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {stage.timeframe}
                    </span>
                  </div>

                  <p className="text-muted text-[15px] leading-relaxed mb-6">
                    {stage.subtitle}
                  </p>

                  {/* Goals & Actions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Goals */}
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-primary uppercase tracking-wider">
                        <AppleEmoji emoji="🎯" className="w-3 h-3" />
                        <span>Key Goals</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stage.goals.map((goal, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-white dark:bg-black/20 text-foreground text-xs font-medium border border-gray-100 dark:border-white/10 shadow-sm">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions List */}
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-muted uppercase tracking-wider">
                        <AppleEmoji emoji="⚡" className="w-3 h-3" />
                        <span>Action Items</span>
                      </div>
                      <ul className="space-y-2">
                        {stage.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted group-hover:text-foreground transition-colors">
                            <span className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                            <span className="leading-relaxed">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

const MindsetView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MINDSET.map((item, idx) => {
          const isLast = idx === MINDSET.length - 1;
          
          return (
            <FadeIn 
              key={idx} 
              delay={idx * 80}
              className={isLast ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <div className="h-full bg-[var(--bg-app-card)] border border-border rounded-[24px] p-8 hover:bg-[var(--bg-app-card-hover)] transition-all duration-300 group relative overflow-hidden flex flex-col">
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity opacity-0 group-hover:opacity-20 bg-primary" />
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-primary font-bold text-2xl">
                      <AppleEmoji emoji={item.icon} className="w-8 h-8" />
                    </div>
                    <span className="text-6xl font-bold text-gray-500/20 select-none absolute top-4 right-4">
                      {idx + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  
                  <p className="text-muted mb-6 font-medium leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-6 border-t border-black/5 dark:border-white/10">
                    {item.details}
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

const PersonalStatementView = () => {
  const { title, intro, faq, writingDirection } = PERSONAL_STATEMENT_GUIDE;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          {intro}
        </p>
      </div>

      {/* FAQ */}
      <FadeIn>
        <div className="bg-[var(--bg-app-card)] rounded-[24px] p-8 border border-border">
          <div className="flex items-start gap-6">
            <div className="bg-red-500/20 p-4 rounded-2xl text-primary">
              <AppleEmoji emoji="❓" className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">{faq.question}</h3>
              <div className="space-y-2 text-muted leading-relaxed">
                {faq.answer.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Writing Direction */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <AppleEmoji emoji="✍️" className="w-8 h-8" />
          <h2 className="text-2xl font-bold text-foreground">{writingDirection.title}</h2>
        </div>

        <FadeIn delay={100}>
          <div className="bg-red-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8 flex items-center gap-3 text-primary font-medium">
            <AppleEmoji emoji="📏" className="w-5 h-5" />
            {writingDirection.wordCount}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            writingDirection.structure[0], // Intro
            writingDirection.structure[2], // Conclusion
            writingDirection.structure[1]  // Body
          ].map((section, index) => {
            const isBody = section.title.includes("Body");
            const isIntro = section.title.includes("Introduction");
            const isConclusion = section.title.includes("Conclusion");

            return (
              <FadeIn key={index} delay={200 + index * 100} className={isBody ? "md:col-span-2" : ""}>
                <div className="h-full bg-[var(--bg-app-card)] border border-border rounded-[24px] p-8 hover:bg-[var(--bg-app-card-hover)] transition-all duration-300 group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity opacity-0 group-hover:opacity-20 ${isIntro ? 'bg-primary' : ''} ${isBody ? 'bg-primary' : ''} ${isConclusion ? 'bg-primary' : ''}`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isIntro ? 'bg-red-500/20 text-primary' : ''} ${isBody ? 'bg-red-500/20 text-primary' : ''} ${isConclusion ? 'bg-red-500/20 text-primary' : ''}`}>
                        {isIntro && <AppleEmoji emoji="🚀" className="w-6 h-6" />}
                        {isBody && <AppleEmoji emoji="💪" className="w-6 h-6" />}
                        {isConclusion && <AppleEmoji emoji="🏁" className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {section.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-muted leading-relaxed">
                      {section.content.map((line, i) => {
                        const isSubHeader = /^\([a-z]\)/.test(line);
                        if (isSubHeader) {
                          return (
                            <p key={i} className="font-bold text-foreground mt-4 bg-[var(--bg-app-card-hover)] inline-block px-2 py-1 rounded-lg">
                              {line}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className={line.startsWith('•') ? 'pl-4 flex gap-2' : ''}>
                            {line.startsWith('•') && <span className="text-primary">•</span>}
                            {line.startsWith('•') ? line.substring(1) : line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const AssociateDegreeTips = ({ lang }: { lang?: string }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'mindset' | 'ps'>('timeline');

  return (
    <div className="min-h-screen bg-[var(--bg-app-page)] font-sans text-foreground">
      {/* Header */
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3" />
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex bg-[var(--bg-app-page)] p-1 rounded-full border border-border">
              {[
                  { id: 'timeline', label: '兩年路線圖', emoji: "📅" },
                  { id: 'mindset', label: '心態', emoji: "🧠" },
                  { id: 'ps', label: 'Personal Statement', emoji: "📝" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-foreground hover:bg-[var(--bg-app-card-hover)]'}`}
                    >
                      <AppleEmoji emoji={tab.emoji} className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
            </div>

            {/* Mobile Tabs (Simplified) */}
            <div className="md:hidden flex gap-2">
               {/* Just show current tab name or a simple dropdown if needed, but for now let's keep it simple */}
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs Scrollable */}
        <div className="md:hidden border-t border-border overflow-x-auto no-scrollbar">
          <div className="flex p-2 gap-2 min-w-max px-4">
            {[
              { id: 'timeline', label: '兩年路線圖', emoji: "📅" },
              { id: 'mindset', label: '心態', emoji: "🧠" },
              { id: 'ps', label: 'Personal Statement', emoji: "📝" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${isActive ? 'bg-primary text-white border-primary shadow-lg' : 'bg-transparent text-muted border-border hover:border-primary/30'}`}
                >
                  <AppleEmoji emoji={tab.emoji} className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      }
      {/* Main Content */}
      <main className="animate-fade-in">
        {activeTab === 'timeline' && <UnifiedTimelineView />}
        {activeTab === 'mindset' && <MindsetView />}
        {activeTab === 'ps' && <PersonalStatementView />}
      </main>
    </div>
  );
};

export default AssociateDegreeTips;
