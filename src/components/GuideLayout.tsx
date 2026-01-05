import React from 'react';
import { AppleEmoji } from './AppleEmoji';

interface GuideSection {
  title: string;
  content: string[];
}

interface GuideData {
  title: string;
  intro?: string;
  sections: GuideSection[];
}

interface GuideLayoutProps {
  guide: GuideData;
  emoji?: string;
  titleImageBaseName?: string; // Deprecated but kept for interface compatibility if needed
}

export const GuideLayout: React.FC<GuideLayoutProps> = ({ guide, emoji }) => {
  
  // Helper to render content
  const renderContent = (content: string[]) => {
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    
    content.forEach((text, index) => {
      const trimmed = text.trim();
      const isListItem = trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed);
      
      // Helper to render bold text
      const renderText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      if (isListItem) {
        // Clean text
        const cleanText = trimmed.replace(/^[•-]\s*/, '').replace(/^\d+\.\s*/, '');
        currentList.push(
          <div key={`list-${index}`} className="py-4 border-b border-gray-100 last:border-0 flex items-start gap-3">
             <span className="text-[17px] leading-relaxed text-gray-600">{renderText(cleanText)}</span>
          </div>
        );
      } else {
        // Flush list if exists
        if (currentList.length > 0) {
          elements.push(
            <div key={`group-${index}`} className="my-2 pl-0">
              {currentList}
            </div>
          );
          currentList = [];
        }
        
        // Render paragraph
        elements.push(
          <p key={index} className="text-[17px] leading-relaxed text-gray-600 mb-4 last:mb-0">
            {renderText(text)}
          </p>
        );
      }
    });

    // Flush remaining list
    if (currentList.length > 0) {
      elements.push(
        <div key="group-last" className="my-2 pl-0">
          {currentList}
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Title */}
      <div className="mb-12 text-center">
          {emoji && (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-white shadow-md mb-8 border border-black/5">
              <AppleEmoji emoji={emoji} className="w-10 h-10" />
            </div>
          )}
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-6">
          {guide.title}
        </h1>
        {guide.intro && (
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {guide.intro}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {guide.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-black/5">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              {section.title}
            </h2>
            <div>
              {renderContent(section.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
