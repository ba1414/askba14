import React from 'react';
import { AppleEmoji } from './components/AppleEmoji';

interface IeltsPrepProps {
  lang: string;
}

const IeltsPrep: React.FC<IeltsPrepProps> = ({ lang }) => {
  const isEn = lang === "EN";

  const resources = [
    {
      title: isEn ? "Free Notes" : "免費筆記",
      description: isEn ? "Comprehensive study materials for all sections." : "涵蓋所有部分的綜合學習材料。",
      emoji: "📄",
      items: []
    },
    {
      title: isEn ? "English Channels" : "英語頻道",
      description: isEn ? "YouTube channels to improve your listening and speaking." : "提高聽力和口語的 YouTube 頻道。",
      emoji: "📺",
      items: [
        { name: "English with Lucy", url: "https://www.youtube.com/c/EnglishwithLucy" },
        { name: "BBC Learning English", url: "https://www.youtube.com/user/bbclearningenglish" },
        { name: "IELTS Ryan", url: "https://www.youtube.com/user/EnglishRyan" }
      ]
    },
    {
      title: isEn ? "Free Trial" : "免費試用",
      description: isEn ? "Try out premium courses for free." : "免費試用高級課程。",
      emoji: "🎓",
      items: [
        { name: "E2Language", url: "https://www.e2language.com/" },
        { name: "Magoosh", url: "https://ielts.magoosh.com/" }
      ]
    }
  ];

  return (
    <div className="col-span-full w-full max-w-7xl mx-auto animate-fade-in p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {isEn ? "IELTS Preparation" : "IELTS 準備"}
        </h1>
        <p className="text-[var(--text-muted)] text-lg">
          {isEn ? "Curated resources to help you achieve your target score." : "精選資源助你達到目標分數。"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((section, index) => (
          <div key={index} className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[var(--bg)] text-[var(--primary-strong)]">
                <AppleEmoji emoji={section.emoji} className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {section.title}
              </h2>
            </div>

            <p className="text-[var(--text-muted)] text-sm mb-6 min-h-[40px]">
              {section.description}
            </p>

            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-colors group"
                >
                  <span className="font-medium text-[var(--text)] group-hover:text-[var(--primary-strong)] transition-colors">
                    {item.name}
                  </span>
                  <AppleEmoji emoji="↗️" className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IeltsPrep;
