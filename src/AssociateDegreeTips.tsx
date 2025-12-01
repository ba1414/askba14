import React, { useState, useRef, useEffect } from 'react';
import { 
  Map, ChevronRight, CheckCircle2, AlertCircle, 
  ArrowRight, BookOpen, Users, Brain, Clock, 
  FileText, Trophy, Mail, Lock, Unlock, 
  Target, HelpCircle, XCircle, Play, Pause, 
  RotateCcw, Check, Sparkles, RefreshCw, Shield, 
  Swords, BarChart3, PieChart, Activity, Layers,
  GraduationCap, Heart, Frown, Meh, Smile,
  Calendar, Search, PenTool, Send, FileCheck,
  AlertTriangle, Compass, Briefcase, Sun, Moon,
  Layout, ListChecks, GraduationCap as GradIcon,
  HelpCircle as HelpIcon, MousePointerClick,
  MessageSquare, UserPlus, BookOpenCheck,
  ClipboardList, FileSignature, Stamp,
  CornerDownRight, Lightbulb, Flag,
  Ghost, Zap, Gauge, FileStack,
  MousePointer2, MoveRight, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { BIG_PICTURE, TIMELINE_DATA, MINDSET, TimelineItem } from './content/assoRoadmap';

// --- Helper Components ---

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
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
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Sub-Views ---

const BigPictureView = () => {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
          <Map className="w-4 h-4" />
          <span>{BIG_PICTURE.hero.subtitle}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {BIG_PICTURE.hero.title}
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          {BIG_PICTURE.hero.welcome}
        </p>
      </div>

      {/* Simple Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">目標為本</h3>
          <p className="text-gray-600 leading-relaxed">
            Asso 唔係求學問嘅地方，係求學位嘅地方。每一分每一秒都要計過度過，為咗入 U 呢個目標進發。
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">心態決定境界</h3>
          <p className="text-gray-600 leading-relaxed">
            唔好因為入咗 Asso 而自卑，亦唔好因為 GPA 高而自滿。保持謙卑，保持飢渴，直到攞到 Offer 為止。
          </p>
        </div>
      </div>
    </div>
  );
};

const UnifiedTimelineView = () => {
  const [activeStageId, setActiveStageId] = useState<string>(TIMELINE_DATA[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToStage = (id: string) => {
    const element = document.getElementById(`stage-${id}`);
    if (element) {
      const offset = 100; // Height of sticky header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveStageId(id);
    }
  };

  // Update active stage on scroll
  useEffect(() => {
    const handleScroll = () => {
      const stages = TIMELINE_DATA.map(stage => document.getElementById(`stage-${stage.id}`));
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = stages.length - 1; i >= 0; i--) {
        const stage = stages[i];
        if (stage && stage.offsetTop <= scrollPosition) {
          setActiveStageId(TIMELINE_DATA[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* Sticky Navigation Header */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-4 gap-2 no-scrollbar snap-x"
          >
            {TIMELINE_DATA.map((stage) => {
              const isActive = activeStageId === stage.id;
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all snap-start
                    ${isActive 
                      ? `bg-${stage.color}-100 text-${stage.color}-700 ring-2 ring-${stage.color}-500 ring-offset-2` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{stage.chipLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {TIMELINE_DATA.map((stage, index) => {
          const Icon = stage.icon;
          const isLast = index === TIMELINE_DATA.length - 1;

          return (
            <div key={stage.id} id={`stage-${stage.id}`} className="relative">
              {/* Vertical Line */}
              {!isLast && (
                <div className="absolute left-8 top-16 bottom-[-64px] w-0.5 bg-gray-200 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Icon & Time (Desktop) */}
                <div className="flex-shrink-0 flex flex-col items-center md:w-16">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10
                    bg-white border-4 border-${stage.color}-50 text-${stage.color}-600
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Right Column: Content Card */}
                <div className="flex-1">
                  <FadeIn delay={index * 100}>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Card Header */}
                      <div className={`bg-${stage.color}-50/50 p-6 border-b border-${stage.color}-100`}>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            bg-${stage.color}-100 text-${stage.color}-700
                          `}>
                            {stage.timeframe}
                          </span>
                          <span className="text-gray-400 text-sm font-medium">Stage {index}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {stage.title}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {stage.subtitle}
                        </p>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-8">
                        {/* Goals Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-lg">
                            <Target className="w-5 h-5 text-red-500" />
                            <h3>階段目標</h3>
                          </div>
                          <div className="grid gap-3">
                            {stage.goals.map((goal, i) => (
                              <div key={i} className="flex items-start gap-3 bg-red-50/50 p-3 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 font-medium">{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions & Risks Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Actions */}
                          <div>
                            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-lg">
                              <ListChecks className="w-5 h-5 text-blue-500" />
                              <h3>要做咩 (To-Do)</h3>
                            </div>
                            <ul className="space-y-3">
                              {stage.actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Risks */}
                          <div>
                            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-lg">
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                              <h3>雷區 (Risks)</h3>
                            </div>
                            <ul className="space-y-3">
                              {stage.risks.map((risk, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                  <span>{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MindsetView = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">爆四心法</h2>
        <p className="text-gray-600">
          GPA 唔係靠死讀書，係靠策略同心態。
        </p>
      </div>
      
      <div className="grid gap-6">
        {MINDSET.map((item, index) => {
          const Icon = item.icon;
          return (
            <FadeIn key={index} delay={index * 100}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 font-medium">{item.summary}</p>
                  <div className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl">
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

// --- Main Component ---

const AssociateDegreeTips = ({ lang }: { lang?: string }) => {
  const [activeTab, setActiveTab] = useState<'bigPicture' | 'timeline' | 'mindset'>('timeline');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <GradIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                Asso 爆四指南
              </span>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1">
              {[
                { id: 'bigPicture', label: 'Big Picture', icon: Map },
                { id: 'timeline', label: '兩年路線圖', icon: Calendar },
                { id: 'mindset', label: '爆四心法', icon: Brain },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${activeTab === tab.id 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden border-t border-gray-100 overflow-x-auto">
          <div className="flex p-2 gap-2 min-w-max">
            {[
              { id: 'bigPicture', label: 'Big Picture', icon: Map },
              { id: 'timeline', label: '兩年路線圖', icon: Calendar },
              { id: 'mindset', label: '爆四心法', icon: Brain },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {activeTab === 'bigPicture' && <BigPictureView />}
        {activeTab === 'timeline' && <UnifiedTimelineView />}
        {activeTab === 'mindset' && <MindsetView />}
      </main>
    </div>
  );
};

export default AssociateDegreeTips;
