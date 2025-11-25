import React from 'react';
import { Github, Mail, Instagram, MessageCircle, ArrowRight } from 'lucide-react';

const Footer = ({ lang }: { lang: string }) => {
  const isEn = lang === "EN";

  const links = [
    { label: isEn ? "GPA Calculator" : "GPA 計算器", href: "#" },
    { label: isEn ? "Calendar" : "日曆", href: "#" },
    { label: isEn ? "Flashcards" : "字卡", href: "#" },
    { label: isEn ? "Tips" : "心得", href: "#" },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Branding Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">BA</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider">ASKBA14</span>
                <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Powered by React</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold leading-relaxed text-gray-200">
              {isEn ? "The Ultimate Survival Guide for Associate Degree Students" : "副學士學生的終極生存指南"}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {isEn 
                ? "AskBA is designed to help students navigate their academic journey with ease. From GPA calculation to study tips, we've got you covered."
                : "AskBA 旨在幫助學生輕鬆應對學業旅程。從 GPA 計算到學習心得，我們為你提供全方位支援。"}
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">{isEn ? "Contact Us" : "聯絡我們"}</h4>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Mail size={20} />
              </a>
            </div>

            <button className="group flex items-center gap-2 px-6 py-3 bg-[#B8860B] hover:bg-[#DAA520] text-white rounded-full font-bold transition-all duration-300">
              <span>{isEn ? "BECOME A MEMBER" : "成為會員"}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Links Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">{isEn ? "Explore" : "探索"}</h4>
            <ul className="space-y-3">
              {links.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-white transition-colors"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>Copyright © 2025 ASKBA14. {isEn ? "All rights reserved." : "保留一切權利。"}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{isEn ? "Privacy Policy" : "私隱政策"}</a>
            <a href="#" className="hover:text-white transition-colors">{isEn ? "Terms of Service" : "服務條款"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
