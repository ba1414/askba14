import React from "react";

const TRANSLATIONS = {
  EN: {
    title: "About Me",
    subtitle: "Get to know more about me",
  },
  粵: {
    title: "關於我",
    subtitle: "了解更多關於我的事",
  },
};

export default function AboutMe({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header - Apple Style */}
      <div className="mb-12 text-center">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 tracking-tight"
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
        >
          {t.title}
        </h1>
      </div>

      {/* Content Cards - Apple Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="w-32 h-32 rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-xl bg-white dark:bg-[#1d1d1f]">
              <img 
                src="/askba14/profile.png" 
                alt="Profile" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 
              className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-2"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
            >
              {lang === "EN" ? "BA" : "BA"}
            </h2>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <h3 
              className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7]"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
            >
              {lang === "EN" ? "Bio" : "簡介"}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
