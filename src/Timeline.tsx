import React, { useState } from "react";
import { Clock } from "lucide-react";

/**
 * Interactive Timeline — Apple Style
 * - Minimalist vertical timeline
 * - Clickable events with expandable details
 * - Smooth animations and transitions
 * - Dark mode support
 * - EN/粵 bilingual support
 */

const TRANSLATIONS = {
  EN: {
    title: "Timeline",
    subtitle: "My journey and milestones",
    readMore: "Read more",
    readLess: "Read less",
  },
  粵: {
    title: "時間線",
    subtitle: "我嘅旅程同里程碑",
    readMore: "睇更多",
    readLess: "收起",
  },
};

type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  titleZH: string;
  description: string;
  descriptionZH: string;
  color: string;
};

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: "1",
    year: "2024",
    title: "Event Title 2024",
    titleZH: "2024年事件標題",
    description: "Write a brief description of what happened during this period. You can describe achievements, experiences, or important moments that shaped your journey.",
    descriptionZH: "寫低呢段時間發生咩事嘅簡短描述。你可以描述成就、經歷或者影響你旅程嘅重要時刻。",
    color: "#0A84FF",
  },
  {
    id: "2",
    year: "2023",
    title: "Event Title 2023",
    titleZH: "2023年事件標題",
    description: "Another milestone in your journey. Share the story, the challenges you faced, and the lessons you learned along the way.",
    descriptionZH: "你旅程嘅另一個里程碑。分享故事、你面對嘅挑戰同埋沿途學到嘅嘢。",
    color: "#30D158",
  },
  {
    id: "3",
    year: "2022",
    title: "Event Title 2022",
    titleZH: "2022年事件標題",
    description: "A significant moment that defined this period. Explain what made this time special and how it contributed to your growth.",
    descriptionZH: "定義咗呢段時期嘅重要時刻。解釋係咩令呢段時間特別同埋點樣促進你嘅成長。",
    color: "#FF9F0A",
  },
  {
    id: "4",
    year: "2021",
    title: "Event Title 2021",
    titleZH: "2021年事件標題",
    description: "Looking back at where it all began. Reflect on the foundation that was laid and the first steps taken on this journey.",
    descriptionZH: "回顧一切嘅開始。反思當時建立嘅基礎同埋喺呢段旅程踏出嘅第一步。",
    color: "#FF375F",
  },
];

function TimelineItem({
  event,
  isExpanded,
  onToggle,
  lang,
}: {
  event: TimelineEvent;
  isExpanded: boolean;
  onToggle: () => void;
  lang: "EN" | "粵";
}) {
  const t = TRANSLATIONS[lang];
  const title = lang === "EN" ? event.title : event.titleZH;
  const description = lang === "EN" ? event.description : event.descriptionZH;

  return (
    <div className="relative flex gap-6 group">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div
          className="w-4 h-4 rounded-full border-4 border-white dark:border-[#1d1d1f] shadow-lg transition-transform duration-300 group-hover:scale-125 flex-shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <div className="w-0.5 flex-1 bg-gradient-to-b from-[#d2d2d7] to-transparent dark:from-[#424245] dark:to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <button
          onClick={onToggle}
          className="w-full text-left group/card"
        >
          <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#d2d2d7]/30 dark:border-[#424245] group-hover/card:border-[#d2d2d7] dark:group-hover/card:border-[#424245]/60">
            {/* Year badge */}
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4"
              style={{ backgroundColor: event.color }}
            >
              {event.year}
            </div>

            {/* Title */}
            <h3
              className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 transition-colors duration-200"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
            >
              {title}
            </h3>

            {/* Description */}
            <div
              className={`text-[#6e6e73] dark:text-[#a1a1a6] text-base leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? "max-h-96 opacity-100" : "max-h-20 opacity-75"
              }`}
            >
              <p>{description}</p>
            </div>

            {/* Read more/less button */}
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold transition-colors duration-200" style={{ color: event.color }}>
              <span>{isExpanded ? t.readLess : t.readMore}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Timeline({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#00c3ff] mb-6 shadow-lg">
          <Clock size={32} className="text-white" />
        </div>
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 tracking-tight"
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
        >
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-[#6e6e73] dark:text-[#a1a1a6]">
          {t.subtitle}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {TIMELINE_DATA.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isExpanded={expandedId === event.id}
            onToggle={() => toggleExpand(event.id)}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
