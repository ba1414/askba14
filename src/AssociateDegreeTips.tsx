import React from "react";
import { BookOpen, GraduationCap, Brain, Target, ArrowRight } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "Associate Degree Tips",
    subtitle: "Guide to surviving and thriving in Community College / Associate Degree.",
    readMore: "Read More",
    articles: [
      {
        id: 1,
        title: "How to get a high GPA?",
        desc: "Strategies for studying, assignment management, and exam preparation.",
        icon: GraduationCap,
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "University Interview Tips",
        desc: "Common questions, how to prepare, and what interviewers are looking for.",
        icon: Target,
        color: "bg-green-500"
      },
      {
        id: 3,
        title: "Mental Health & Stress",
        desc: "Balancing academic pressure with personal life and mental well-being.",
        icon: Brain,
        color: "bg-purple-500"
      },
      {
        id: 4,
        title: "Choosing the Right Major",
        desc: "How to select courses that align with your university admission goals.",
        icon: BookOpen,
        color: "bg-orange-500"
      }
    ]
  },
  粵: {
    title: "副學士心得",
    subtitle: "副學士/高級文憑生存指南，助你升讀心儀大學。",
    readMore: "閱讀更多",
    articles: [
      {
        id: 1,
        title: "如何考取高 GPA？",
        desc: "學習策略、作業管理及考試準備心得。",
        icon: GraduationCap,
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "大學面試技巧",
        desc: "常見問題、準備方法以及面試官看重的特質。",
        icon: Target,
        color: "bg-green-500"
      },
      {
        id: 3,
        title: "心態調整與壓力管理",
        desc: "如何在學業壓力與個人生活之間取得平衡。",
        icon: Brain,
        color: "bg-purple-500"
      },
      {
        id: 4,
        title: "選科與升學策略",
        desc: "如何選擇適合自己的科目以配合升學目標。",
        icon: BookOpen,
        color: "bg-orange-500"
      }
    ]
  },
};

export default function AssociateDegreeTips({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-2">
          {t.title}
        </h2>
        <p className="text-[#86868B] text-lg">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.articles.map((article) => {
          const Icon = article.icon;
          return (
            <div 
              key={article.id}
              className="group bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 ${article.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-sm`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-2 group-hover:text-[#007AFF] transition-colors">
                {article.title}
              </h3>
              
              <p className="text-[#86868B] leading-relaxed mb-6">
                {article.desc}
              </p>
              
              <div className="flex items-center text-[#007AFF] font-medium text-sm">
                {t.readMore}
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
