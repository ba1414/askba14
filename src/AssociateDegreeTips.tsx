import React, { useState, useRef } from 'react';
import { 
  ChevronDown, Share2, Copy, Calendar, Brain, GraduationCap, ArrowRight, Target, Zap, HelpCircle, PenTool, Ruler
} from 'lucide-react';
import { BIG_PICTURE, TIMELINE_DATA, MINDSET, TimelineItem } from './content/assoRoadmap';
import { PERSONAL_STATEMENT_GUIDE } from './content/personalStatement';
import { REFERENCING_GUIDE } from './content/referencingGuide';
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
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      {/* Continuous Vertical Line */}
      <div className="absolute left-[43px] top-12 bottom-12 w-[2px] bg-[var(--color-border-primary)]" />

      <div className="space-y-12">
        {TIMELINE_DATA.map((stage, index) => {
          return (
            <FadeIn key={stage.id} delay={index * 100}>
              <div className="relative pl-24">
                
                {/* Timeline Node */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] shadow-md flex items-center justify-center z-10">
                  <AppleEmoji emoji={stage.icon} className="w-6 h-6" />
                </div>

                {/* Content Card */}
                <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-md border border-[var(--color-border-primary)] hover:shadow-lg transition-shadow duration-300">
                  
                  {/* Header */}
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                        {stage.title}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-surface-tertiary)] text-[var(--color-text-primary)] text-xs font-bold uppercase tracking-wider">
                        {stage.timeframe}
                        </span>
                    </div>
                    <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
                        {stage.subtitle}
                    </p>
                  </div>

                  {/* Goals & Actions */}
                  <div className="space-y-6">
                    
                    {/* Goals */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        <Target className="w-4 h-4" />
                        <span>Key Goals</span>
                      </div>
                      <div className="bg-[var(--color-surface-secondary)] rounded-xl overflow-hidden border border-[var(--color-border-primary)]">
                        {stage.goals.map((goal, i) => (
                          <div key={i} className={`px-4 py-3 text-[15px] text-[var(--color-text-secondary)] ${i !== stage.goals.length - 1 ? 'border-b border-[var(--color-border-primary)]' : ''}`}>
                            {goal}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions List */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        <Zap className="w-4 h-4" />
                        <span>Action Items</span>
                      </div>
                      <div className="bg-[var(--color-surface-secondary)] rounded-xl overflow-hidden border border-[var(--color-border-primary)]">
                        {stage.actions.map((action, i) => (
                          <div key={i} className={`px-4 py-3 text-[15px] text-[var(--color-text-secondary)] flex items-start gap-3 ${i !== stage.actions.length - 1 ? 'border-b border-[var(--color-border-primary)]' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-primary)] mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{action}</span>
                          </div>
                        ))}
                      </div>
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
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Mindset</h1>
            <p className="text-[17px] text-[var(--color-text-secondary)]">The psychological foundation for success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MINDSET.map((item, idx) => {
          return (
            <FadeIn key={idx} delay={idx * 80} className="h-full">
              <div className="bg-[var(--color-bg-elevated)] rounded-3xl p-8 shadow-md border border-[var(--color-border-primary)] hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start gap-6 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] flex items-center justify-center flex-shrink-0">
                      <AppleEmoji emoji={item.icon} className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                            {item.title}
                        </h2>
                        <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                            {item.summary}
                        </p>
                        <div className="bg-[var(--color-surface-secondary)] rounded-2xl p-6 text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                            {item.details}
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

const PersonalStatementView = () => {
  const { title, intro, faq, writingDirection } = PERSONAL_STATEMENT_GUIDE;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">{title}</h1>
        <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
          {intro}
        </p>
      </div>

      {/* FAQ */}
      <FadeIn>
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-primary)]">
          <div className="flex items-start gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{faq.question}</h3>
              <div className="space-y-2 text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
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
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="w-6 h-6 text-[var(--color-text-primary)]" />
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{writingDirection.title}</h2>
        </div>

        <FadeIn delay={100}>
          <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)] rounded-xl p-4 flex items-center gap-3 text-[var(--color-text-secondary)] font-medium">
            <Ruler className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            {writingDirection.wordCount}
          </div>
        </FadeIn>

        <div className="space-y-6">
          {[
            writingDirection.structure[0], // Intro
            writingDirection.structure[2], // Conclusion
            writingDirection.structure[1]  // Body
          ].map((section, index) => {
            return (
              <FadeIn key={index} delay={200 + index * 100}>
                <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-primary)]">
                  
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--color-border-primary)]">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-secondary)] flex items-center justify-center text-xl">
                        <span className="font-bold text-[var(--color-text-tertiary)]">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {section.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
                      {section.content.map((line, i) => {
                        const isSubHeader = /^\([a-z]\)/.test(line);
                        if (isSubHeader) {
                          return (
                            <p key={i} className="font-bold text-[var(--color-text-primary)] mt-4">
                              {line}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className={line.startsWith('•') ? 'pl-4 flex gap-2' : ''}>
                            {line.startsWith('•') && <span className="text-[var(--color-text-primary)]">•</span>}
                            {line.startsWith('•') ? line.substring(1) : line}
                          </p>
                        );
                      })}
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

const ReferencingView = () => {
  const { title, intro, modules, tasks } = REFERENCING_GUIDE;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">{title}</h1>
        <p className="text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
          {intro}
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-12">
        {modules.map((module, idx) => (
          <FadeIn key={idx} delay={idx * 100}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-primary)] pb-2">
                {module.title}
              </h2>
              <div className="space-y-6">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-primary)]">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                      {lesson.title}
                    </h3>
                    <div className="mb-4 p-3 bg-[var(--color-surface-secondary)] rounded-xl text-sm text-[var(--color-text-secondary)]">
                      <strong>目標：</strong>{lesson.goals}
                    </div>
                    <div className="space-y-2 text-[17px] text-[var(--color-text-secondary)] leading-relaxed">
                      {lesson.content.map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? 'pl-4' : ''}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Tasks */}
      <FadeIn delay={500}>
        <div className="bg-[var(--color-surface-secondary)] rounded-2xl p-8 border border-[var(--color-border-primary)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">你的開學前任務</h2>
          <div className="space-y-4">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-page)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-[17px] text-[var(--color-text-secondary)]">{task}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

// --- Main Component ---

const AssociateDegreeTips = ({ lang }: { lang?: string }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'mindset' | 'ps' | 'referencing'>('timeline');

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)]/80 backdrop-blur-md border-b border-[var(--color-border-primary)] sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Tabs */}
            <div className="flex bg-[var(--color-surface-secondary)] p-1 rounded-full border border-[var(--color-border-primary)] mx-auto">
              {[
                  { id: 'timeline', label: 'Roadmap', emoji: "📅" },
                  { id: 'mindset', label: 'Mindset', emoji: "🧠" },
                  { id: 'ps', label: 'Statement', emoji: "📝" },
                  { id: 'referencing', label: 'Citation', emoji: "📚" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'}`}
                    >
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.emoji}</span>
                    </button>
                  );
                })}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="animate-fade-in pb-24">
        {activeTab === 'timeline' && <UnifiedTimelineView />}
        {activeTab === 'mindset' && <MindsetView />}
        {activeTab === 'ps' && <PersonalStatementView />}
        {activeTab === 'referencing' && <ReferencingView />}
      </main>
    </div>
  );
};

export default AssociateDegreeTips;
