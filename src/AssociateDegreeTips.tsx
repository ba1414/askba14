import React, { useState, useRef } from 'react';
import { 
  ChevronDown, Share2, Copy, Calendar, Brain, GraduationCap
} from 'lucide-react';
import { BIG_PICTURE, TIMELINE_DATA, MINDSET, TimelineItem } from './content/assoRoadmap';
import { PERSONAL_STATEMENT_GUIDE } from './content/personalStatement';
import { AppleEmoji } from './components/AppleEmoji';

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

const UnifiedTimelineView = () => {
  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      {/* Timeline Content (no top navigation chips) */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {TIMELINE_DATA.map((stage, index) => {
          const isLast = index === TIMELINE_DATA.length - 1;
          const StageIcon = stage.icon as any;

          return (
            <div key={stage.id} id={`stage-${stage.id}`} className="relative">
              {!isLast && (
                <div className="absolute left-8 top-16 bottom-[-64px] w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 flex flex-col items-center md:w-16">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10
                    bg-white dark:bg-gray-800 border-4 border-${stage.color}-50 text-${stage.color}-600
                    hover:scale-110 transition-transform duration-300
                  `}>
                    <AppleEmoji emoji={stage.icon} className="w-8 h-8" />
                  </div>
                </div>

                <div className="flex-1">
                  <FadeIn delay={index * 100}>
                    <div className="bg-[var(--surface)] rounded-3xl shadow-sm border border-[var(--border-subtle)] overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className={`bg-${stage.color}-50/50 dark:bg-${stage.color}-900/20 p-6 border-b border-${stage.color}-100 dark:border-${stage.color}-800`}>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            bg-${stage.color}-100 dark:bg-${stage.color}-800 text-${stage.color}-700 dark:text-${stage.color}-300
                          `}>
                            {stage.timeframe}
                          </span>
                          <span className="text-[var(--text-muted)] text-sm font-medium">Stage {index}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text)] mb-1">
                          {stage.title}
                        </h3>
                        <p className="text-[var(--text-muted)] font-medium">
                          {stage.subtitle}
                        </p>
                      </div>

                      <div className="p-6 space-y-8">
                        <div>
                          <div className="flex items-center gap-2 mb-4 text-[var(--text)] font-bold text-lg">
                            <AppleEmoji emoji="🎯" className="w-6 h-6" />
                            <h3>階段目標</h3>
                          </div>
                          <div className="grid gap-3">
                            {stage.goals.map((goal, i) => (
                              <div key={i} className="flex items-start gap-3 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-xl hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
                                <AppleEmoji emoji="✅" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-[var(--text)] font-medium">{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-4 text-[var(--text)] font-bold text-lg">
                              <AppleEmoji emoji="📝" className="w-6 h-6" />
                              <h3>要做咩 (To-Do)</h3>
                            </div>
                            <ul className="space-y-3">
                              {stage.actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-3 text-[var(--text-muted)] text-sm leading-relaxed group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-4 text-[var(--text)] font-bold text-lg">
                              <AppleEmoji emoji="⚠️" className="w-6 h-6" />
                              <h3>雷區 (Risks)</h3>
                            </div>
                            <ul className="space-y-3">
                              {stage.risks.map((risk, i) => (
                                <li key={i} className="flex items-start gap-3 text-[var(--text-muted)] text-sm leading-relaxed group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
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
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) => setExpanded((p) => (p === i ? null : i));

  const copyCard = async (id: string) => {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      await navigator.clipboard.writeText(el.innerText);
      // lightweight feedback
      // eslint-disable-next-line no-alert
      alert('內容已複製到剪貼簿');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // eslint-disable-next-line no-alert
      alert('複製失敗');
    }
  };

  const shareCard = async (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: '心法', text });
      } catch (e) {
        // ignore share cancel
      }
    } else {
      await copyCard(id);
      // eslint-disable-next-line no-alert
      alert('已複製內容，可貼上分享');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-2xl md:text-3xl text-[var(--text-muted)] font-medium leading-relaxed">GPA 唔係靠死讀書，係靠策略同心態。</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <FadeIn delay={0}>
          <div id="mindset-card-1" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">1</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="🎮" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">先要「識 game」先打得好</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(1)} aria-expanded={expanded === 1} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 1 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 1 ? (
                  <ul className="space-y-4 text-[var(--text-muted)] text-left">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="📊" className="w-5 h-5" />
                          <strong className="text-[var(--text)]">搞清楚你嗰間 Asso 嘅 GPA 計法</strong>：
                        </div>
                        <p className="mt-1 text-sm">例：A＝4.0、A-＝3.7、B+＝3.3、B＝3.0……</p>
                        <p className="mt-2 text-sm bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl">你就會明白：「一科 B- / C 可以拉低成個 GPA 好多」→ 唔好任由任何一科爆煲。</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="📄" className="w-5 h-5" />
                          <p>逐科睇 syllabus：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-blue-100 dark:border-blue-900">
                          <li>assignment、quiz、exam 各佔幾多 %？</li>
                          <li>有冇 participation 分？ → 比重高嘅 assessment，要特別投放時間。</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="📊" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">搞清楚你嗰間 Asso 嘅 GPA 計法。例：A＝4.0、A-＝3.7、B+＝3.3、B＝3.0……</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-1')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-1')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 2 */}
        <FadeIn delay={100}>
          <div id="mindset-card-2" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-purple-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">2</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="⏳" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">deadline 唔係用嚟賭，係用嚟「倒數」</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(2)} aria-expanded={expanded === 2} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 2 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 2 ? (
                  <ul className="space-y-4 text-[var(--text-muted)] text-left">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 flex-shrink-0" />
                      <div className="flex items-start gap-2">
                        <AppleEmoji emoji="📅" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>每份 assignment / report，喺正式 deadline 前 <strong className="text-[var(--text)]">自設早 3–5 日嘅「個人 deadline」</strong>。</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="🎯" className="w-5 h-5" />
                          <p>目標：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-purple-100 dark:border-purple-900">
                          <li>嗰日之前要起好 draft 8 成；</li>
                          <li>正式 deadline 前幾日淨係用嚟執字粒、改 structure、check reference。</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="✨" className="w-5 h-5" />
                          <p>咁樣：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-purple-100 dark:border-purple-900">
                          <li>撞期時唔會全部堆同一日；</li>
                          <li>作品質素穩陣啲，唔會成日 last minute 交垃圾。</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="📅" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">每份 assignment / report，喺正式 deadline 前自設早 3–5 日嘅「個人 deadline」。</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-2')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-2')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 3 */}
        <FadeIn delay={200}>
          <div id="mindset-card-3" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-green-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">3</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="✅" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">每日只要「守住一件事」，就唔會一路拖</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(3)} aria-expanded={expanded === 3} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 3 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 3 ? (
                  <ul className="space-y-4 text-[var(--text-muted)] text-left">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="🧠" className="w-5 h-5" />
                          <p>Practice Smart：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-amber-100 dark:border-amber-900">
                          <li>Past paper + marking schemes → 做到熟手</li>
                          <li>用 active recall + spaced repetition 去記細節</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <ul className="mt-2 space-y-1 pl-4">
                          <li className="flex items-start gap-2">
                            <AppleEmoji emoji="📝" className="w-4 h-4 mt-1" />
                            <span>睇完一個 chapter ＋ 做晒後面練習</span>
                          </li>
                          <li>整好一半 PowerPoint</li>
                          <li>起好 essay 大綱</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="🚀" className="w-5 h-5" />
                          <p>目的係：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-green-100 dark:border-green-900">
                          <li>減少「成日諗住等聽日」</li>
                          <li>長期累積 output → GPA 就係咁疊上去</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="🧠" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">Practice smart：Past paper、active recall、spaced repetition；每日守住一件要做嘅事。</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-3')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-3')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 4 */}
        <FadeIn delay={300}>
          <div id="mindset-card-4" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-amber-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">4</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="🧩" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">學識用碎片時間，而唔係等「完美一大段時間」</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(4)} aria-expanded={expanded === 4} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 4 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 4 ? (
                  <ul className="space-y-4 text-[var(--text-muted)] text-left">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="🚌" className="w-5 h-5" />
                          <p>搭車、等車、返學途中：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-amber-100 dark:border-amber-900">
                          <li>構思下 assignment 點寫</li>
                          <li>喺手機記低 essay idea</li>
                          <li>翻幾頁 notes、做幾題 MC</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <p className="bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-xl flex items-start gap-2">
                          <AppleEmoji emoji="💡" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>唔好等「成個下晝淨係用嚟溫書」先肯開始，Asso workload 多，<strong className="text-[var(--text)]">碎片時間用得好，先追得切 deadline</strong>。</span>
                        </p>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="🚌" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">搭車、等車亦可以做小量 productive 事：記 idea、做幾題 MC、溫習重點。</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-4')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-4')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 5 */}
        <FadeIn delay={400}>
          <div id="mindset-card-5" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-red-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">5</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="💪" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">面對失手：拉分，而唔係自暴自棄</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(5)} aria-expanded={expanded === 5} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 5 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 5 ? (
                  <div className="space-y-4 text-[var(--text-muted)] text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <AppleEmoji emoji="🧠" className="w-5 h-5" />
                        <p>心態上要好清楚：</p>
                      </div>
                      <p className="mt-2 bg-red-50/50 dark:bg-red-900/20 p-3 rounded-xl">一科入面通常有好多次評核，你真正可以控制嘅係「之後嗰幾次」。專注喺接下來嘅 assessments 去拉返分數。</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <AppleEmoji emoji="👣" className="w-5 h-5" />
                        <p className="font-medium">實用步驟：</p>
                      </div>
                      <ul className="mt-2 space-y-1 pl-4 border-l-2 border-red-100 dark:border-red-900">
                        <li>分析成績同 feedback，揀出最有效果嘅改進項目</li>
                        <li>將提升目標拆細到每次 assignment 可實行嘅步驟</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="🧠" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">心態上要好清楚：一科入面通常有好多次評核，專注喺接下來嘅 assessments 去拉返分數。</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-5')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-5')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 6 */}
        <FadeIn delay={500}>
          <div id="mindset-card-6" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-indigo-500/10" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shadow-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">6</span>
                <div className="flex items-center gap-2">
                  <AppleEmoji emoji="🤝" className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[var(--text)]">Group project 唔好俾自己變成「黑洞」或者「免費勞工」</h3>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => toggle(6)} aria-expanded={expanded === 6} className="p-2 rounded-full hover:bg-[var(--surface-highlight)]">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expanded === 6 ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300">
                {expanded === 6 ? (
                  <ul className="space-y-4 text-[var(--text-muted)] text-left">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="😶" className="w-5 h-5" />
                          <p>唔好做完全唔出聲、靠人 carry 嗰個：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900">
                          <li>你咩都冇做過，下次再遇到 similar 題目，你會完全唔識</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <AppleEmoji emoji="🏋️" className="w-5 h-5" />
                          <p>亦唔好次次自己一個揹晒所有嘢累死自己：</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900">
                          <li>分工清楚，攞穩一兩 part 做到 A-level 水平</li>
                          <li>確保 final version 至少去到 <strong className="text-[var(--text)]">B+ 或以上</strong></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-[var(--text-muted)] flex items-start gap-2">
                    <AppleEmoji emoji="🤝" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="truncate">Group project 要溝通分工，既唔好做咩都唔出聲，亦唔好一個人背晒所有工作。</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-6')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-6')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Card 7 - Spans 2 cols on large screens if needed, or just sits nicely */}
        <div className="md:col-span-2 lg:col-span-3">
          <FadeIn delay={600}>
            <div id="mindset-card-7" className="h-full group relative bg-white/60 dark:bg-[var(--surface)] backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden text-[var(--text)] text-base md:text-lg leading-relaxed">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all group-hover:bg-teal-500/10" />
              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-bold shadow-sm bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">7</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <AppleEmoji emoji="🏗️" className="w-8 h-8" />
                    <h3 className="text-2xl font-bold text-[var(--text)]">長線心態：Sem 1 當「起樓地基」</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="bg-teal-50/50 dark:bg-teal-900/20 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AppleEmoji emoji="📈" className="w-6 h-6" />
                        <p className="text-lg font-medium text-[var(--text)]">Sem 1 策略</p>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        好多學霸都係 <strong className="text-teal-600 dark:text-teal-400">Sem 1 chur 高 GPA</strong>，Sem 2 先有空間畀一啲突發事情「食少少分」。
                      </p>
                    </div>
                    <div className="bg-red-50/50 dark:bg-red-900/20 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AppleEmoji emoji="⚠️" className="w-6 h-6" />
                        <p className="text-lg font-medium text-[var(--text)]">警惕</p>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        所以唔好諗住「第一個 sem 試下 feel 先」：
                        <br/>
                        <strong className="text-red-600 dark:text-red-400">第一個 sem 玩燶咗，要救返上 3.3 / 3.7 會好辛苦。</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button onClick={() => shareCard('mindset-card-7')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => copyCard('mindset-card-7')} className="p-2 rounded-md hover:bg-[var(--surface-highlight)]">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

const PersonalStatementView = () => {
  const { title, intro, faq, writingDirection } = PERSONAL_STATEMENT_GUIDE;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)]">{title}</h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {intro}
        </p>
      </div>

      {/* FAQ */}
      <FadeIn>
        <div className="bg-[var(--surface)] rounded-3xl p-8 shadow-sm border border-[var(--border-subtle)]">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
              <AppleEmoji emoji="❓" className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--text)]">{faq.question}</h3>
              <div className="space-y-2 text-[var(--text-muted)] leading-relaxed">
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
          <h2 className="text-2xl font-bold text-[var(--text)]">{writingDirection.title}</h2>
        </div>

        <FadeIn delay={100}>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200 font-medium">
              <AppleEmoji emoji="📏" className="w-5 h-5" />
              {writingDirection.wordCount}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reorder for Bento Layout: Intro -> Conclusion -> Body */}
          {[
            writingDirection.structure[0], // Intro
            writingDirection.structure[2], // Conclusion
            writingDirection.structure[1]  // Body
          ].map((section, index) => {
            const isBody = section.title.includes("Body");
            const isIntro = section.title.includes("Introduction");
            const isConclusion = section.title.includes("Conclusion");

            return (
              <FadeIn key={index} delay={200 + index * 100}>
                <div 
                  className={`
                    h-full rounded-[2rem] p-8 shadow-sm border border-[var(--border-subtle)] 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                    ${isBody ? 'md:col-span-2 bg-gradient-to-br from-[var(--surface)] to-orange-50/50 dark:to-orange-900/10' : ''}
                    ${isIntro ? 'bg-gradient-to-br from-[var(--surface)] to-blue-50/50 dark:to-blue-900/10' : ''}
                    ${isConclusion ? 'bg-gradient-to-br from-[var(--surface)] to-green-50/50 dark:to-green-900/10' : ''}
                    ${!isBody && !isIntro && !isConclusion ? 'bg-[var(--surface)]' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm
                      ${isIntro ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${isBody ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      ${isConclusion ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                    `}>
                      {isIntro && <AppleEmoji emoji="🚀" className="w-6 h-6" />}
                      {isBody && <AppleEmoji emoji="💪" className="w-6 h-6" />}
                      {isConclusion && <AppleEmoji emoji="🏁" className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">
                      {section.title.replace(/^\d+\.\s*/, '')}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                    {section.content.map((line, i) => {
                      // Highlight key terms like (a), (b) etc in Body
                      const isSubHeader = /^\([a-z]\)/.test(line);
                      if (isSubHeader) {
                        return (
                          <p key={i} className="font-bold text-[var(--text)] mt-4 bg-[var(--surface-highlight)] inline-block px-2 py-1 rounded-lg">
                            {line}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className={line.startsWith('•') ? 'pl-4 flex gap-2' : ''}>
                          {line.startsWith('•') && <span className="text-orange-500">•</span>}
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

// --- Main Component ---

const AssociateDegreeTips = ({ lang }: { lang?: string }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'mindset' | 'ps'>('timeline');

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border-subtle)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg flex items-center justify-center w-10 h-10">
                <AppleEmoji emoji="🎓" className="w-6 h-6" />
              </div>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1">
              {[
                  { id: 'timeline', label: '兩年路線圖', emoji: "📅" },
                  { id: 'mindset', label: '心法', emoji: "🧠" },
                  { id: 'ps', label: 'Personal Statement', emoji: "📝" },
                ].map((tab) => {
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                        ${activeTab === tab.id 
                          ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-lg' 
                          : 'text-[var(--text-muted)] hover:bg-[var(--surface-highlight)]'}
                      `}
                    >
                      <AppleEmoji emoji={tab.emoji} className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden border-t border-[var(--border-subtle)] overflow-x-auto">
          <div className="flex p-2 gap-2 min-w-max">
            {[
              { id: 'timeline', label: '兩年路線圖', emoji: "📅" },
              { id: 'mindset', label: '心法', emoji: "🧠" },
              { id: 'ps', label: 'Personal Statement', emoji: "📝" },
            ].map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-md' 
                      : 'bg-[var(--surface-highlight)] text-[var(--text-muted)] border border-[var(--border-subtle)]'}
                  `}
                >
                  <AppleEmoji emoji={tab.emoji} className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {activeTab === 'timeline' && <UnifiedTimelineView />}
        {activeTab === 'mindset' && <MindsetView />}
        {activeTab === 'ps' && <PersonalStatementView />}
      </main>
    </div>
  );
};

export default AssociateDegreeTips;
