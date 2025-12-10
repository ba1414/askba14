import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  BookOpen, 
  Star, 
  MessageCircle, 
  Target, 
  Clock, 
  Users, 
  Video, 
  HelpCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { INTERVIEW_GUIDE } from './content/interviewGuide';

const InterviewGuideView: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(index);
    }
  };

  // Map icons to sections based on index or content keywords
  const getIconForSection = (index: number) => {
    const icons = [
      Target,       // 1. Personal Mainline
      Clock,        // 2. Time Strategy
      Users,        // 3. Self Intro
      MessageCircle,// 4. 7 Core Questions
      BookOpen,     // 5. Personal Statement
      Star,         // 6. STAR Examples
      BookOpen,     // 7. Academic Questions
      HelpCircle,   // 8. Don't Know Answer
      Users,        // 9. Group Interview
      MessageCircle,// 10. Questions to Ask
      Video,        // 11. Online/Written Test
      Target        // 12. Future Plan
    ];
    return icons[index] || Star;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-400 opacity-10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-xl">
              <MessageCircle className="w-8 h-8 text-rose-200 mr-3" />
              <span className="text-rose-100 font-medium tracking-wide">Non-JUPAS 面試攻略</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {INTERVIEW_GUIDE.title}
            </h1>
            <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto leading-relaxed font-light">
              {INTERVIEW_GUIDE.intro}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Table of Contents - Desktop Sticky */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden">
            <div className="p-5 bg-rose-50 border-b border-rose-100">
              <h3 className="font-bold text-rose-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                目錄導航
              </h3>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-2 custom-scrollbar">
              {INTERVIEW_GUIDE.sections.map((section, index) => {
                const Icon = getIconForSection(index);
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center mb-1 ${
                      activeSection === index 
                        ? 'bg-rose-100 text-rose-800 shadow-sm translate-x-1' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-rose-600'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${activeSection === index ? 'bg-white text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="line-clamp-1">{section.title.split('：')[0].split('(')[0]}</span>
                    {activeSection === index && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {INTERVIEW_GUIDE.sections.map((section, index) => {
            const Icon = getIconForSection(index);
            return (
              <motion.div
                id={`section-${index}`}
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                onViewportEnter={() => setActiveSection(index)}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start mb-6">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl mr-4 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 pt-2">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4 pl-0 md:pl-16">
                    {section.content.map((paragraph, pIndex) => {
                      // Check if paragraph is a header or special block
                      const isHeader = paragraph.startsWith('【') && paragraph.endsWith('】');
                      const isBullet = paragraph.startsWith('•') || paragraph.match(/^\d+\./);
                      const isQuote = paragraph.startsWith('「') || paragraph.startsWith('“') || paragraph.startsWith('>');
                      
                      if (isHeader) {
                        return (
                          <h3 key={pIndex} className="text-lg font-bold text-rose-700 mt-6 mb-2 flex items-center">
                            <span className="w-1.5 h-6 bg-rose-500 rounded-full mr-3"></span>
                            {paragraph.replace(/[【】]/g, '')}
                          </h3>
                        );
                      }
                      
                      if (isQuote) {
                        return (
                          <div key={pIndex} className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl my-3 text-slate-700 italic relative">
                            <div className="absolute top-2 left-2 opacity-20">
                              <MessageCircle className="w-4 h-4 text-rose-600" />
                            </div>
                            <p className="pl-2">{paragraph}</p>
                          </div>
                        );
                      }

                      if (isBullet) {
                        return (
                          <div key={pIndex} className="flex items-start py-1">
                            <div className="mt-1.5 mr-3 min-w-[6px] h-1.5 rounded-full bg-rose-400"></div>
                            <p className="text-slate-700 leading-relaxed">{paragraph.replace(/^[•\d+\.]\s*/, '')}</p>
                          </div>
                        );
                      }

                      return (
                        <p key={pIndex} className="text-slate-700 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Summary Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-rose-200 mr-4" />
                <h2 className="text-2xl font-bold">總結</h2>
              </div>
              <p className="text-xl leading-relaxed text-rose-50 font-medium">
                {INTERVIEW_GUIDE.summary}
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-rose-100 text-sm mb-2 opacity-80">額外資源</p>
                <p className="text-lg font-light italic">
                  {INTERVIEW_GUIDE.footer}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors z-50"
          >
            <ArrowRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewGuideView;
