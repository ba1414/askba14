import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Play, Upload, Download, X as CloseIcon } from "lucide-react";
import jsPDF from 'jspdf';
import { saveData, loadData } from "./db";

/**
 * Minimal Flashcards - ChatGPT style
 * No decorations, flat design
 */

const TRANSLATIONS = {
  EN: {
    title: "Flashcards",
    createDeck: "Create New Deck",
    deckName: "Deck name...",
    create: "Create",
    cards: "cards",
    study: "Study",
    front: "Front (Question)...",
    back: "Back (Answer)...",
    addCard: "Add Card",
    bulkImport: "Bulk Import",
    bulkImportPlaceholder: "Paste cards here (one per line, format: Question | Answer)",
    import: "Import",
    cancel: "Cancel",
    importCSV: "Import CSV",
    csvFormat: "CSV format: front,back (one card per line)",
    exportPDF: "Export PDF",
    studyMode: "Study Mode",
    showAnswer: "Show Answer",
    nextCard: "Next Card",
    finishStudy: "Finish Study",
    cardProgress: "Card {current} of {total}",
    noCards: "No cards yet. Add cards to start studying!",
    rateCard: "How well did you know this?",
    again: "Not Familiar",
    hard: "Somewhat Familiar",
    good: "Familiar",
    easy: "Very Familiar",
    reviewIn: "Review again in {time}",
  },
  粵: {
    title: "字卡",
    createDeck: "建立新卡組",
    deckName: "卡組名稱...",
    create: "建立",
    cards: "張卡",
    study: "開始溫習",
    front: "正面（問題）...",
    back: "背面（答案）...",
    addCard: "新增卡片",
    bulkImport: "批量匯入",
    bulkImportPlaceholder: "貼上卡片內容（每行一張，格式：問題 | 答案）",
    import: "匯入",
    cancel: "取消",
    importCSV: "匯入 CSV",
    csvFormat: "CSV 格式：正面,背面（每行一張卡）",
    exportPDF: "匯出PDF",
    studyMode: "溫習模式",
    showAnswer: "顯示答案",
    nextCard: "下一張",
    finishStudy: "完成溫習",
    cardProgress: "第 {current} / {total} 張",
    noCards: "未有卡片。新增卡片嚟開始溫習！",
    rateCard: "你對呢個概念有幾熟悉？",
    again: "唔熟",
    hard: "少少熟",
    good: "熟",
    easy: "好熟",
    reviewIn: "{time}後再溫",
  },
};

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
  lastReviewed?: number; // timestamp
  nextReview?: number; // timestamp
  easeFactor?: number; // SM-2 algorithm ease factor (default 2.5)
  interval?: number; // days until next review
  repetitions?: number; // number of successful repetitions
}

interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
}

export default function FlashcardsMinimal({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [decks, setDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Study mode states
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load decks from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const savedDecks = await loadData('flashcards', 'decks', []);
      setDecks(savedDecks);
    })();
  }, []);

  // Save decks to IndexedDB
  useEffect(() => {
    saveData('flashcards', 'decks', decks);
  }, [decks]);

  const createDeck = () => {
    if (!newDeckName.trim()) return;
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: newDeckName,
      cards: [],
    };
    setDecks([...decks, newDeck]);
    setNewDeckName("");
  };

  const deleteDeck = (id: string) => {
    setDecks(decks.filter((d) => d.id !== id));
    if (selectedDeck?.id === id) setSelectedDeck(null);
  };

  const addCard = (deckId: string) => {
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newCardFront,
      back: newCardBack,
      mastered: false,
    };
    setDecks(decks.map((d) => (d.id === deckId ? { ...d, cards: [...d.cards, newCard] } : d)));
    setNewCardFront("");
    setNewCardBack("");
    // Keep the form open after adding a card
  };

  const deleteCard = (deckId: string, cardId: string) => {
    setDecks(decks.map((d) => 
      d.id === deckId ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d
    ));
  };

  const bulkImport = (deckId: string) => {
    if (!bulkImportText.trim()) return;
    
    const lines = bulkImportText.trim().split('\n');
    const newCards: Flashcard[] = [];
    
    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        newCards.push({
          id: `${Date.now()}-${index}`,
          front: parts[0],
          back: parts[1],
          mastered: false,
        });
      }
    });
    
    if (newCards.length > 0) {
      setDecks(decks.map((d) => 
        d.id === deckId ? { ...d, cards: [...d.cards, ...newCards] } : d
      ));
      setBulkImportText("");
      setShowBulkImport(null);
    }
  };

  const handleCSVImport = (deckId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const newCards: Flashcard[] = [];

      lines.forEach((line, index) => {
        // Support both comma and semicolon as separators
        const parts = line.includes(';') 
          ? line.split(';').map(p => p.trim())
          : line.split(',').map(p => p.trim());
        
        if (parts.length >= 2 && parts[0] && parts[1]) {
          // Remove quotes if present
          const front = parts[0].replace(/^["']|["']$/g, '');
          const back = parts[1].replace(/^["']|["']$/g, '');
          
          newCards.push({
            id: `${Date.now()}-${index}`,
            front,
            back,
            mastered: false,
          });
        }
      });

      if (newCards.length > 0) {
        setDecks(decks.map((d) => 
          d.id === deckId ? { ...d, cards: [...d.cards, ...newCards] } : d
        ));
      }
    };

    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Study mode functions
  const startStudy = (deck: Deck) => {
    if (deck.cards.length === 0) return;
    setStudyingDeck(deck);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  // SM-2 Spaced Repetition Algorithm
  const calculateNextReview = (card: Flashcard, quality: number): Flashcard => {
    // quality: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
    const now = Date.now();
    let easeFactor = card.easeFactor || 2.5;
    let interval = card.interval || 0;
    let repetitions = card.repetitions || 0;

    if (quality < 2) {
      // Not familiar or somewhat familiar - restart
      repetitions = 0;
      interval = 1;
    } else {
      // Familiar or very familiar
      easeFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
      
      if (easeFactor < 1.3) easeFactor = 1.3;
      
      repetitions += 1;
      
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    const nextReview = now + (interval * 24 * 60 * 60 * 1000); // convert days to milliseconds

    return {
      ...card,
      lastReviewed: now,
      nextReview: nextReview,
      easeFactor: easeFactor,
      interval: interval,
      repetitions: repetitions,
    };
  };

  const rateCard = (quality: number) => {
    if (!studyingDeck) return;
    
    const currentCard = studyingDeck.cards[currentCardIndex];
    const updatedCard = calculateNextReview(currentCard, quality);
    
    // Update the card in the deck
    const updatedDeck = {
      ...studyingDeck,
      cards: studyingDeck.cards.map(c => c.id === currentCard.id ? updatedCard : c)
    };
    
    // Update decks state
    setDecks(decks.map(d => d.id === studyingDeck.id ? updatedDeck : d));
    
    // Move to next card or finish
    if (currentCardIndex < studyingDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
      setStudyingDeck(updatedDeck);
    } else {
      setStudyingDeck(null);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const finishStudy = () => {
    setStudyingDeck(null);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const formatReviewTime = (days: number): string => {
    if (days < 1) return lang === "EN" ? "today" : "今日";
    if (days === 1) return lang === "EN" ? "1 day" : "1日";
    if (days < 7) return lang === "EN" ? `${days} days` : `${days}日`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return lang === "EN" ? "1 week" : "1星期";
    if (weeks < 4) return lang === "EN" ? `${weeks} weeks` : `${weeks}星期`;
    const months = Math.floor(days / 30);
    return lang === "EN" ? `${months} month${months > 1 ? 's' : ''}` : `${months}個月`;
  };

  // Export to PDF function
  const exportToPDF = (deck: Deck) => {
    if (deck.cards.length === 0) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 25;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Add watermark to each page
    const addWatermark = () => {
      pdf.setFontSize(60);
      pdf.setTextColor(240, 240, 240);
      pdf.setFont('helvetica', 'bold');
      const watermarkText = 'BA14';
      const textWidth = pdf.getTextWidth(watermarkText);
      pdf.text(watermarkText, (pageWidth - textWidth) / 2, pageHeight / 2, {
        angle: 45,
        align: 'center'
      });
      pdf.setTextColor(0, 0, 0); // Reset to black
    };

    // Add footer with copyright
    const addFooter = () => {
      pdf.setFontSize(10);
      pdf.setTextColor(180, 180, 180);
      pdf.text('© BA14', pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.setTextColor(0, 0, 0); // Reset to black
    };

    addWatermark();

    // Title with minimal underline
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'normal');
    pdf.text(deck.name, margin, yPosition);
    yPosition += 5;
    
    // Minimal line under title
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(margin, yPosition, margin + 40, yPosition);
    yPosition += 15;

    // Cards
    deck.cards.forEach((card, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        addFooter();
        pdf.addPage();
        addWatermark();
        yPosition = margin;
      }

      // Card container with minimal border
      const cardStartY = yPosition;
      
      // Card number badge
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin, yPosition, 20, 8, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${index + 1}`, margin + 10, yPosition + 6, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      yPosition += 14;

      // Question
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      pdf.text('Q', margin + 2, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      const questionLines = pdf.splitTextToSize(card.front, maxWidth - 12);
      pdf.text(questionLines, margin + 12, yPosition);
      yPosition += questionLines.length * 6 + 8;

      // Answer
      pdf.setTextColor(120, 120, 120);
      pdf.text('A', margin + 2, yPosition);
      pdf.setTextColor(0, 0, 0);
      const answerLines = pdf.splitTextToSize(card.back, maxWidth - 12);
      pdf.text(answerLines, margin + 12, yPosition);
      yPosition += answerLines.length * 6 + 4;

      // Minimal card border
      const cardHeight = yPosition - cardStartY;
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(margin - 2, cardStartY - 2, maxWidth + 4, cardHeight + 2, 3, 3);
      
      yPosition += 10;
    });

    // Add footer to last page
    addFooter();

    // Save the PDF
    pdf.save(`${deck.name.replace(/[^a-z0-9]/gi, '_')}_flashcards.pdf`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4 lg:p-8">
      {/* Study Mode Modal */}
      {studyingDeck && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-[#E5E7EB] dark:border-[#323232]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0]">
                  {studyingDeck.name}
                </h2>
                <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B] mt-1">
                  {t.cardProgress
                    .replace('{current}', (currentCardIndex + 1).toString())
                    .replace('{total}', studyingDeck.cards.length.toString())}
                </p>
              </div>
              <button
                onClick={finishStudy}
                className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <CloseIcon size={24} className="text-[#6B6B6B] dark:text-[#9B9B9B]" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-[#E5E7EB] dark:bg-[#323232] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#007AFF] to-[#0051D5] dark:from-[#0A84FF] dark:to-[#007AFF] transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / studyingDeck.cards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Card Display */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#252525] dark:to-[#1E1E1E] border-2 border-[#E5E7EB] dark:border-[#323232] rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
                {/* Question */}
                <div className="mb-6">
                  <span className="text-xs font-semibold text-[#007AFF] dark:text-[#0A84FF] uppercase tracking-wider mb-2 block">
                    {lang === "EN" ? "Question" : "問題"}
                  </span>
                  <p className="text-xl font-medium text-[#0F0F0F] dark:text-[#F0F0F0]">
                    {studyingDeck.cards[currentCardIndex].front}
                  </p>
                </div>

                {/* Answer */}
                {showAnswer && (
                  <div className="pt-6 border-t-2 border-dashed border-[#E5E7EB] dark:border-[#323232] w-full animate-in fade-in duration-300">
                    <span className="text-xs font-semibold text-[#10B981] dark:text-[#34D399] uppercase tracking-wider mb-2 block">
                      {lang === "EN" ? "Answer" : "答案"}
                    </span>
                    <p className="text-lg text-[#0F0F0F] dark:text-[#F0F0F0]">
                      {studyingDeck.cards[currentCardIndex].back}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 px-6 py-4 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-xl text-base font-semibold hover:bg-[#0051D5] dark:hover:bg-[#409CFF] transition-all duration-200 shadow-sm"
                >
                  {t.showAnswer}
                </button>
              ) : (
                <div className="w-full space-y-3">
                  <p className="text-sm font-medium text-[#6B6B6B] dark:text-[#9B9B9B] text-center mb-3">
                    {t.rateCard}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => rateCard(0)}
                      className="px-4 py-3 bg-[#EF4444] dark:bg-[#DC2626] text-white rounded-xl text-sm font-semibold hover:bg-[#DC2626] dark:hover:bg-[#B91C1C] transition-all duration-200 shadow-sm"
                    >
                      {t.again}
                      <div className="text-xs opacity-80 mt-1">{formatReviewTime(1)}</div>
                    </button>
                    <button
                      onClick={() => rateCard(1)}
                      className="px-4 py-3 bg-[#F59E0B] dark:bg-[#D97706] text-white rounded-xl text-sm font-semibold hover:bg-[#D97706] dark:hover:bg-[#B45309] transition-all duration-200 shadow-sm"
                    >
                      {t.hard}
                      <div className="text-xs opacity-80 mt-1">{formatReviewTime(3)}</div>
                    </button>
                    <button
                      onClick={() => rateCard(2)}
                      className="px-4 py-3 bg-[#10B981] dark:bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#059669] dark:hover:bg-[#047857] transition-all duration-200 shadow-sm"
                    >
                      {t.good}
                      <div className="text-xs opacity-80 mt-1">{formatReviewTime(6)}</div>
                    </button>
                    <button
                      onClick={() => rateCard(3)}
                      className="px-4 py-3 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-xl text-sm font-semibold hover:bg-[#0051D5] dark:hover:bg-[#409CFF] transition-all duration-200 shadow-sm"
                    >
                      {t.easy}
                      <div className="text-xs opacity-80 mt-1">{formatReviewTime(14)}</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">
          {lang === "EN" ? "Create flashcard decks to study and memorize" : "建立字卡組合嚟學習同記憶"}
        </p>
      </div>

      {/* Create Deck - Apple-style card */}
      <div className="mb-8 bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#252525] dark:to-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-4 uppercase tracking-wider">
          {t.createDeck}
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                createDeck();
              }
            }}
            placeholder={t.deckName}
            className="flex-1 px-4 py-3 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
          />
          <button
            onClick={() => createDeck()}
            disabled={!newDeckName.trim()}
            className="px-6 py-3 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-xl text-sm font-semibold hover:bg-[#0051D5] dark:hover:bg-[#409CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={2.5} />
            {t.create}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout for Decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {decks.map((deck) => (
          <div 
            key={deck.id} 
            className="bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Deck Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-1">
                  {deck.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#6B6B6B] dark:text-[#9B9B9B] bg-[#F3F4F6] dark:bg-[#2A2A2A] px-2 py-1 rounded-md">
                    {deck.cards.length} {t.cards}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteDeck(deck.id)}
                className="p-2 text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#3F1F1F] rounded-lg transition-all duration-200"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Add Card Form */}
            {selectedDeck?.id === deck.id ? (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder={t.front}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
                />
                <input
                  type="text"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCard(deck.id);
                    }
                  }}
                  placeholder={t.back}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addCard(deck.id)}
                    disabled={!newCardFront.trim() || !newCardBack.trim()}
                    className="flex-1 px-4 py-2.5 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-lg text-sm font-medium hover:bg-[#0051D5] dark:hover:bg-[#409CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    {t.addCard}
                  </button>
                  <button
                    onClick={() => setSelectedDeck(null)}
                    className="px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#6B6B6B] dark:text-[#9B9B9B] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#323232] transition-all duration-200"
                  >
                    {lang === "EN" ? "Cancel" : "取消"}
                  </button>
                </div>
              </div>
            ) : showBulkImport === deck.id ? (
              <div className="space-y-3 mb-4">
                <textarea
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  placeholder={t.bulkImportPlaceholder}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkImport(deck.id)}
                    disabled={!bulkImportText.trim()}
                    className="flex-1 px-4 py-2.5 bg-[#10B981] dark:bg-[#059669] text-white rounded-lg text-sm font-medium hover:bg-[#059669] dark:hover:bg-[#047857] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {t.import}
                  </button>
                  <button
                    onClick={() => setShowBulkImport(null)}
                    className="px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#6B6B6B] dark:text-[#9B9B9B] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#323232] transition-all duration-200"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Study & Export Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => startStudy(deck)}
                    disabled={deck.cards.length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#007AFF] to-[#0051D5] dark:from-[#0A84FF] dark:to-[#007AFF] text-white rounded-xl text-sm font-semibold hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Play size={16} strokeWidth={2.5} />
                    {t.study}
                  </button>
                  <button
                    onClick={() => exportToPDF(deck)}
                    disabled={deck.cards.length === 0}
                    className="px-4 py-3 bg-[#10B981] dark:bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#059669] dark:hover:bg-[#047857] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download size={16} strokeWidth={2} />
                    PDF
                  </button>
                </div>

                {/* Import Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedDeck(deck)}
                    className="flex-1 px-4 py-3 border-2 border-dashed border-[#E5E7EB] dark:border-[#323232] rounded-xl text-sm font-medium text-[#6B6B6B] dark:text-[#9B9B9B] hover:border-[#007AFF] dark:hover:border-[#0A84FF] hover:text-[#007AFF] dark:hover:text-[#0A84FF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} strokeWidth={2} />
                    {t.addCard}
                  </button>
                  <label className="cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleCSVImport(deck.id, e)}
                      className="hidden"
                    />
                    <div className="px-4 py-3 border-2 border-dashed border-[#E5E7EB] dark:border-[#323232] rounded-xl text-sm font-medium text-[#8B5CF6] dark:text-[#A78BFA] hover:border-[#8B5CF6] dark:hover:border-[#A78BFA] hover:bg-[#F5F3FF] dark:hover:bg-[#2E1F3F] transition-all duration-200 flex items-center gap-2">
                      <Upload size={16} strokeWidth={2} />
                      CSV
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Cards List */}
            {deck.cards.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {deck.cards.map((card) => (
                  <div 
                    key={card.id}
                    className="group flex items-center justify-between p-3 bg-[#F9FAFB] dark:bg-[#1A1A1A] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#252525] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F0F0F] dark:text-[#F0F0F0] truncate">
                        {card.front}
                      </p>
                      <p className="text-xs text-[#9B9B9B] dark:text-[#6B6B6B] truncate">
                        {card.back}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCard(deck.id, card.id)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#3F1F1F] rounded transition-all"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#252525] dark:to-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-2xl">
          <div className="text-sm font-medium text-[#9B9B9B] dark:text-[#6B6B6B] mb-2">
            {lang === "EN" ? "No decks yet" : "未有卡組"}
          </div>
          <p className="text-xs text-[#BFBFBF] dark:text-[#5B5B5B]">
            {lang === "EN" ? "Create your first deck to get started" : "建立第一個卡組開始"}
          </p>
        </div>
      )}
    </div>
  );
}
