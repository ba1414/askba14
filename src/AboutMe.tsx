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
        <p className="text-xl md:text-2xl text-[#6e6e73] dark:text-[#a1a1a6]">
          {t.subtitle}
        </p>
      </div>

      {/* Content Cards - Apple Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="w-32 h-32 rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-xl bg-white">
              <img 
                src="/profile.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 
              className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-2"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
            >
              {lang === "EN" ? "Your Name" : "你的名字"}
            </h2>
            <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-center">
              {lang === "EN" ? "Add your title or role" : "加入你的職稱或角色"}
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <h3 
            className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-6"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
          >
            {lang === "EN" ? "Bio" : "簡介"}
          </h3>
          <div className="space-y-4 text-[#6e6e73] dark:text-[#a1a1a6]">
            <p className="text-base leading-relaxed">
              {lang === "EN" 
                ? "Write something interesting about yourself..."
                : "寫下關於你自己的有趣事情..."}
            </p>
          </div>
        </div>
      </div>

      {/* Full Width Cards */}
      <div className="space-y-6">
        {/* Interests */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <h3 
            className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-6"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
          >
            {lang === "EN" ? "Interests" : "興趣"}
          </h3>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="px-6 py-3 bg-[#f5f5f7] dark:bg-[#2d2d2d] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] text-sm"
                style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 600 }}
              >
                {lang === "EN" ? `Interest ${i}` : `興趣 ${i}`}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#d2d2d7]/30 dark:border-[#424245]">
          <h3 
            className="text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-6"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
          >
            {lang === "EN" ? "Skills" : "技能"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="text-center p-4 bg-[#f5f5f7] dark:bg-[#2d2d2d] rounded-2xl"
              >
                <div className="text-3xl mb-2">💡</div>
                <p 
                  className="text-[#1d1d1f] dark:text-[#f5f5f7] text-sm"
                  style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 600 }}
                >
                  {lang === "EN" ? `Skill ${i}` : `技能 ${i}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-[#0071e3] to-[#00c3ff] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 
            className="text-2xl text-white mb-4"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700 }}
          >
            {lang === "EN" ? "Get in Touch" : "聯絡我"}
          </h3>
          <p className="text-white/90 mb-6">
            {lang === "EN" 
              ? "Feel free to reach out for collaborations or just a friendly hello"
              : "歡迎聯絡我進行合作或打個招呼"}
          </p>
          <button 
            className="px-8 py-3 bg-white text-[#0071e3] rounded-full font-semibold hover:bg-white/90 transition-colors"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 600 }}
          >
            {lang === "EN" ? "Say Hello" : "打招呼"}
          </button>
        </div>
      </div>
    </div>
  );
}
