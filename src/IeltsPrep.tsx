import React, { useState } from 'react';
import { AppleEmoji } from './components/AppleEmoji';
import { IELTS_DATA, IeltsEssay } from './content/ieltsData';
import { ChevronLeft, AlertCircle, CheckCircle2, BookOpen, PenTool, BrainCircuit, ArrowRight } from 'lucide-react';

interface IeltsPrepProps {
  lang: string;
}

const IeltsPrep: React.FC<IeltsPrepProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>('task1');
  const [selectedEssay, setSelectedEssay] = useState<IeltsEssay | null>(null);

  const isEn = lang === "EN";

  // Filter essays by tab
  const essays = IELTS_DATA.filter(e => e.type === activeTab);

  // --- Detail View ---
  if (selectedEssay) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        {/* Back Button */}
        <button 
          onClick={() => setSelectedEssay(null)}
          className="flex items-center gap-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-8 font-medium"
        >
          <ChevronLeft size={20} />
          {isEn ? "Back to Essays" : "返回文章列表"}
        </button>

        {/* Essay Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[var(--color-surface-tertiary)] text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {selectedEssay.type === 'task1' ? 'Task 1' : 'Task 2'}
            </span>
            <span className="text-[var(--color-text-tertiary)] text-sm font-medium">{selectedEssay.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
            {selectedEssay.title}
          </h1>
          <div className="p-6 bg-[var(--color-surface-secondary)] rounded-2xl border border-[var(--color-border-primary)]">
            <h3 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
              {isEn ? "Topic / Prompt" : "題目 / 描述"}
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {selectedEssay.intro}
            </p>
          </div>
        </div>

        {/* Sections Analysis */}
        <div className="space-y-16">
          {selectedEssay.sections.map((section) => (
            <div key={section.id} className="relative">
              {/* Section Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-[var(--color-border-primary)]"></div>
                <h2 className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-[var(--color-border-primary)]"></div>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                {/* Original (Before) */}
                <div className="bg-red-50/50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-500/20">
                  <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
                    <AlertCircle size={16} />
                    Original
                  </div>
                  <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)] font-serif">
                    "{section.original}"
                  </p>
                </div>

                {/* Rewrite (After) */}
                <div className="bg-green-50/50 dark:bg-green-900/10 rounded-3xl p-6 border border-green-100 dark:border-green-500/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wide">
                    <CheckCircle2 size={16} />
                    Band 9 Rewrite
                  </div>
                  <p className="text-[17px] leading-relaxed text-[var(--color-text-primary)] font-medium font-serif">
                    "{section.improvement.rewrite}"
                  </p>
                </div>
              </div>

              {/* Analysis Panel */}
              <div className="bg-[var(--color-bg-elevated)] rounded-3xl border border-[var(--color-border-primary)] overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border-primary)]">
                  
                  {/* Critique Column */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6 text-[var(--color-text-primary)] font-bold">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                        <BrainCircuit size={18} />
                      </div>
                      Analysis & Logic
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Critique (Cantonese)</h4>
                        <ul className="space-y-2">
                          {section.critique.cantonese.map((point, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Logical Reasoning</h4>
                        <ul className="space-y-2">
                          {section.critique.logical.map((point, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Improvement Column */}
                  <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-bold">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <PenTool size={18} />
                      </div>
                      Key Takeaways
                    </div>

                    <div className="space-y-6">
                      {section.improvement.patterns && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sentence Patterns</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                            {section.improvement.patterns}
                          </p>
                        </div>
                      )}
                      
                      {section.improvement.flow && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Logical Flow</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {section.improvement.flow}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-white dark:bg-white/10 shadow-sm mb-6 border border-gray-100 dark:border-white/5">
          <AppleEmoji emoji="🌏" className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          IELTS Preparation
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {isEn ? "Master Task 1 and Task 2 with detailed breakdowns." : "深入分析 Task 1 及 Task 2，掌握高分技巧。"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl inline-flex">
          <button
            onClick={() => setActiveTab('task1')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'task1'
                ? 'bg-white dark:bg-[#1C1C1E] text-black dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Task 1 (Academic)
          </button>
          <button
            onClick={() => setActiveTab('task2')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'task2'
                ? 'bg-white dark:bg-[#1C1C1E] text-black dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Task 2 (Essay)
          </button>
        </div>
      </div>

      {/* Essay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {essays.map((essay) => (
          <div 
            key={essay.id}
            onClick={() => setSelectedEssay(essay)}
            className="group bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <BookOpen size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {essay.date}
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Analysis
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {essay.title}
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-8 leading-relaxed">
                {essay.intro}
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white group-hover:translate-x-2 transition-transform">
                Read Analysis <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {essays.length === 0 && (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mb-4">
              <PenTool className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No essays added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IeltsPrep;
