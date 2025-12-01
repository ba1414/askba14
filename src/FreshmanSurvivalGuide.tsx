import React from 'react';
import { 
  Flag, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  Coffee, 
  Target, 
  Award, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface GuideProps {
  lang: string;
}

const FreshmanSurvivalGuide: React.FC<GuideProps> = ({ lang }) => {
  const isEn = lang === "EN";

  const steps = [
    {
      id: 1,
      title: isEn ? "The Reality Check" : "認清現實",
      subtitle: isEn ? "Before Semester 1" : "開學前",
      icon: AlertTriangle,
      content: isEn ? (
        <>
          <p className="mb-4">
            So, DSE didn't go as planned. It's okay. You are here now. The goal is simple: <strong>Get back to University.</strong>
          </p>
          <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border-subtle)] mb-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--primary)]" />
              Full Cert Check (3322)
            </h4>
            <p className="text-sm text-[var(--text-muted)]">
              Do you have 3322 in DSE? If not, you MUST plan for a DSE Retake or IELTS/IGCSE immediately. 
              Year 1 is the only time you have to fix this without delaying your degree.
            </p>
          </div>
          <p className="text-sm italic text-[var(--text-muted)]">
            "You are your own biggest killer. Focus on yourself."
          </p>
        </>
      ) : (
        <>
          <p className="mb-4">
            DSE 成績未如理想？無問題。你依家喺度，目標好簡單：<strong>入返大學。</strong>
          </p>
          <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border-subtle)] mb-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--primary)]" />
              Full Cert 檢查 (3322)
            </h4>
            <p className="text-sm text-[var(--text-muted)]">
              你有無 3322？如果無，你必須立刻計劃 Retake DSE 或考 IELTS/IGCSE。
              Year 1 係你唯一可以補救而唔會延遲升學嘅時間。
            </p>
          </div>
          <p className="text-sm italic text-[var(--text-muted)]">
            「自己先係最大嘅 Killer。做好自己，邊個都 Kill 唔到你。」
          </p>
        </>
      )
    },
    {
      id: 2,
      title: isEn ? "The Grind Begins" : "戰鬥開始",
      subtitle: isEn ? "Semester 1" : "第一學期",
      icon: BookOpen,
      content: isEn ? (
        <>
          <p className="mb-4">
            Associate Degree is different. It's continuous assessment. Every assignment counts.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>GPA is King:</strong> Aim for 3.7+ for Year 1 entry, or 3.3+ for Year 2 entry.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Social Circle:</strong> Find study partners, not just playmates. "You are the average of the 5 people you spend time with."</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Freeriders:</strong> Report them early. Don't let them drag your GPA down. Email your lecturer if needed.</span>
            </li>
          </ul>
        </>
      ) : (
        <>
          <p className="mb-4">
            Asso 玩法唔同，係持續評估 (Continuous Assessment)。每一份功課都計分。
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>GPA 係王道：</strong> 想 Year 1 走 Aim 3.7+，Year 2 走 Aim 3.3+。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>社交圈子：</strong> 搵戰友，唔係酒肉朋友。「近朱者赤，近墨者黑」。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Freeriders：</strong> 早啲 Report。唔好俾佢哋拉低你 GPA。有需要就 Email Lecturer。</span>
            </li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      title: isEn ? "The First Break" : "稍作休息",
      subtitle: isEn ? "Semester Break (Dec - Jan)" : "Sem Break (12月 - 1月)",
      icon: Coffee,
      content: isEn ? (
        <>
          <p className="mb-4">
            Rest, but don't stop completely.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--surface)] p-3 rounded border border-[var(--border-subtle)]">
              <h5 className="font-bold text-[var(--primary)] mb-1">IELTS</h5>
              <p className="text-xs text-[var(--text-muted)]">If your English isn't Level 3+, take IELTS now. Aim for 6.5+.</p>
            </div>
            <div className="bg-[var(--surface)] p-3 rounded border border-[var(--border-subtle)]">
              <h5 className="font-bold text-[var(--primary)] mb-1">Research</h5>
              <p className="text-xs text-[var(--text-muted)]">Look at Non-JUPAS requirements. Know your enemy.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">
            休息，但唔好完全停落嚟。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--surface)] p-3 rounded border border-[var(--border-subtle)]">
              <h5 className="font-bold text-[var(--primary)] mb-1">IELTS</h5>
              <p className="text-xs text-[var(--text-muted)]">如果你英文無 Level 3+，依家考 IELTS。目標 6.5+。</p>
            </div>
            <div className="bg-[var(--surface)] p-3 rounded border border-[var(--border-subtle)]">
              <h5 className="font-bold text-[var(--primary)] mb-1">資料搜集</h5>
              <p className="text-xs text-[var(--text-muted)]">睇下 Non-JUPAS 收生要求。知己知彼。</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 4,
      title: isEn ? "The Sprint" : "衝刺期",
      subtitle: isEn ? "Semester 2" : "第二學期",
      icon: Target,
      content: isEn ? (
        <>
          <p className="mb-4">
            Maintain your momentum.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Reg Course:</strong> Plan your timetable wisely. Avoid 8:30am classes if you aren't a morning person.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Fast Track:</strong> If your Sem 1 GPA is excellent, try applying for Year 1 entry (though competitive).</span>
            </li>
          </ul>
        </>
      ) : (
        <>
          <p className="mb-4">
            保持衝勁。
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>Reg 科：</strong> 聰明地排時間表。如果你起唔到身，唔好 Reg 8:30 堂。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--primary)] font-bold">•</span>
              <span><strong>快車道：</strong> 如果你 Sem 1 GPA 爆分，可以試報 Year 1 Entry (雖然競爭好大)。</span>
            </li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      title: isEn ? "The Long Game" : "持久戰",
      subtitle: isEn ? "Year 2 (Sept - Dec)" : "Year 2 (9月 - 12月)",
      icon: Users,
      content: isEn ? (
        <>
          <p className="mb-4">
            This is it. The main round for Non-JUPAS.
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-[var(--primary)] pl-4">
              <h5 className="font-bold">Personal Statement</h5>
              <p className="text-sm text-[var(--text-muted)]">Update it. Don't just copy your JUPAS one. Highlight your growth in Asso.</p>
            </div>
            <div className="border-l-2 border-[var(--primary)] pl-4">
              <h5 className="font-bold">Interviews</h5>
              <p className="text-sm text-[var(--text-muted)]">Prepare for them. Dress properly. Know why you want that degree.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">
            嚟料啦。Non-JUPAS Main Round。
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-[var(--primary)] pl-4">
              <h5 className="font-bold">Personal Statement</h5>
              <p className="text-sm text-[var(--text-muted)]">Update 佢。唔好照抄 JUPAS 嗰份。強調你喺 Asso 嘅成長。</p>
            </div>
            <div className="border-l-2 border-[var(--primary)] pl-4">
              <h5 className="font-bold">面試</h5>
              <p className="text-sm text-[var(--text-muted)]">好好準備。著得整齊啲。清楚點解你想讀嗰科。</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 6,
      title: isEn ? "Victory Lap" : "勝利在望",
      subtitle: isEn ? "The Final Semester" : "最後學期",
      icon: Award,
      content: isEn ? (
        <>
          <p className="mb-4">
            You might receive <strong>Conditional Offers</strong>.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>Meet the GPA condition (usually maintain CGPA).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>Pay the deposit (usually ~$5000).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>Wait for the firm offer.</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-center font-bold">
            Good Luck! You got this.
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">
            你可能會收到 <strong>Conditional Offers (有條件取錄)</strong>。
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>達到 GPA 要求 (通常係 Keep 住 CGPA)。</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>交留位費 (通常 ~$5000)。</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
              <span>等 Firm Offer。</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-center font-bold">
            Good Luck! 你得嘅。
          </div>
        </>
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[var(--text)] mb-2">
          {isEn ? "Freshman Survival Guide" : "新生生存指南"}
        </h2>
        <p className="text-[var(--text-muted)]">
          {isEn ? "A linear path from Year 1 to University." : "由 Year 1 到大學嘅直線攻略。"}
        </p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[var(--border-subtle)] z-0"></div>

        <div className="space-y-12 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex gap-6 group">
                {/* Icon Bubble */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-[var(--bg)] border-2 border-[var(--primary)] flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.2)] group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-[var(--primary)]" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-[var(--surface)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1 block">
                        {isEn ? `Stage ${index + 1}` : `第 ${index + 1} 關`}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text)]">{step.title}</h3>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border-subtle)] self-start md:self-center">
                      {step.subtitle}
                    </span>
                  </div>
                  
                  <div className="text-[var(--text)] leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 text-center p-8 bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)]">
        <HelpCircle size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">
          {isEn ? "Still Confused?" : "仲係好迷？"}
        </h3>
        <p className="text-[var(--text-muted)] mb-6">
          {isEn 
            ? "Check out the Tips section for more detailed advice on specific topics." 
            : "去「心得」頁面睇下更多詳細建議啦。"}
        </p>
      </div>
    </div>
  );
};

export default FreshmanSurvivalGuide;
