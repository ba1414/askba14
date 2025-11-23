import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Play, Upload, Download, X as CloseIcon, BookOpen, Brain, Clock, MoreHorizontal, CheckCircle, RotateCw, Layers, Zap } from "lucide-react";
import jsPDF from 'jspdf';
import { saveData, loadData } from "./db";

/**
 * Apple-Style Flashcards (True Bento Grid)
 * - Immersive study mode
 * - Spaced repetition logic
 * - Beautiful PDF export
 */

const TRANSLATIONS = {
  EN: {
    title: "Flashcards",
    subtitle: "Master your knowledge",
    createDeck: "New Deck",
    deckName: "Deck Name",
    create: "Create",
    cards: "Cards",
    study: "Study",
    front: "Front (Question)",
    back: "Back (Answer)",
    addCard: "Add Card",
    bulkImport: "Bulk Import",
    bulkImportPlaceholder: "Paste cards here (Question | Answer)",
    import: "Import",
    cancel: "Cancel",
    importCSV: "Import CSV",
    exportPDF: "Export PDF",
    studyMode: "Study Session",
    showAnswer: "Show Answer",
    nextCard: "Next Card",
    finishStudy: "Finish",
    cardProgress: "{current} / {total}",
    noCards: "No cards yet",
    rateCard: "How well did you know this?",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    reviewIn: "Review in {time}",
    due: "Due",
    new: "New",
    mastered: "Mastered",
    learning: "Learning",
    recent: "Recent",
    allDecks: "All Decks",
    quickActions: "Quick Actions",
    statusNew: "New",
    statusLearning: "Learning (Hard)",
    statusReviewing: "Reviewing (Medium)",
    statusMastered: "Mastered (Easy)",
    viewCards: "View Cards",
  },
  粵: {
    title: "字卡",
    subtitle: "掌握你嘅知識",
    createDeck: "新卡組",
    deckName: "卡組名稱",
    create: "建立",
    cards: "張卡",
    study: "溫習",
    front: "正面 (問題)",
    back: "背面 (答案)",
    addCard: "新增卡片",
    bulkImport: "批量匯入",
    bulkImportPlaceholder: "貼上卡片 (問題 | 答案)",
    import: "匯入",
    cancel: "取消",
    importCSV: "匯入 CSV",
    exportPDF: "匯出 PDF",
    studyMode: "溫習模式",
    showAnswer: "顯示答案",
    nextCard: "下一張",
    finishStudy: "完成",
    cardProgress: "{current} / {total}",
    noCards: "未有卡片",
    rateCard: "你覺得呢張卡點？",
    again: "唔識",
    hard: "難",
    good: "識",
    easy: "好易",
    reviewIn: "{time}後",
    due: "到期",
    new: "新卡",
    mastered: "已掌握",
    learning: "學習中",
    recent: "最近",
    allDecks: "所有卡組",
    quickActions: "快速操作",
    statusNew: "新卡",
    statusLearning: "學習中 (難)",
    statusReviewing: "溫習中 (中)",
    statusMastered: "已掌握 (易)",
    viewCards: "查看卡片",
  },
};

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
  lastReviewed?: number;
  nextReview?: number;
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
}

interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
  lastStudied?: number;
}

const getCardStatus = (card: Flashcard) => {
  if (!card.lastReviewed) return 'new';
  if (card.interval && card.interval > 21) return 'mastered'; // Easy
  if (card.interval && card.interval > 3) return 'reviewing'; // Medium
  return 'learning'; // Hard
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'mastered': return 'bg-[#34C759] text-[#34C759] border-[#34C759]'; // Green
    case 'reviewing': return 'bg-[#FF9500] text-[#FF9500] border-[#FF9500]'; // Orange
    case 'learning': return 'bg-[#FF3B30] text-[#FF3B30] border-[#FF3B30]'; // Red
    default: return 'bg-[#007AFF] text-[#007AFF] border-[#007AFF]'; // Blue (New)
  }
};

export default function FlashcardsMinimal({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [viewingCardsDeck, setViewingCardsDeck] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Study mode states
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    (async () => {
      const savedDecks = await loadData('flashcards', 'decks', []);
      setDecks(savedDecks);
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData('flashcards', 'decks', decks);
    }
  }, [decks, isLoaded]);

  const createDeck = () => {
    if (!newDeckName.trim()) return;
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: newDeckName,
      cards: [],
      lastStudied: Date.now(),
    };
    setDecks([newDeck, ...decks]); // Add to top
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
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: 0,
    };
    setDecks(decks.map((d) => (d.id === deckId ? { ...d, cards: [...d.cards, newCard] } : d)));
    setNewCardFront("");
    setNewCardBack("");
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
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReview: 0,
        });
      }
    });
    if (newCards.length > 0) {
      setDecks(decks.map((d) => d.id === deckId ? { ...d, cards: [...d.cards, ...newCards] } : d));
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
        const parts = line.includes(';') ? line.split(';').map(p => p.trim()) : line.split(',').map(p => p.trim());
        if (parts.length >= 2 && parts[0] && parts[1]) {
          newCards.push({
            id: `${Date.now()}-${index}`,
            front: parts[0].replace(/^["']|["']$/g, ''),
            back: parts[1].replace(/^["']|["']$/g, ''),
            mastered: false,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: 0,
          });
        }
      });
      if (newCards.length > 0) {
        setDecks(decks.map((d) => d.id === deckId ? { ...d, cards: [...d.cards, ...newCards] } : d));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startStudy = (deck: Deck) => {
    if (deck.cards.length === 0) return;
    
    // Sort cards: Due > New > Others
    const now = Date.now();
    const sortedCards = [...deck.cards].sort((a, b) => {
      const aDue = a.nextReview || 0;
      const bDue = b.nextReview || 0;
      
      // If both are due (or new), sort by due date
      if (aDue < now && bDue < now) return aDue - bDue;
      
      // If one is due and other isn't
      if (aDue < now) return -1;
      if (bDue < now) return 1;
      
      // If neither is due, sort by due date (earliest first)
      return aDue - bDue;
    });

    setStudyQueue(sortedCards);
    setStudyingDeck(deck);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    
    // Update last studied time
    setDecks(decks.map(d => d.id === deck.id ? { ...d, lastStudied: now } : d));
  };

  const calculateNextReview = (card: Flashcard, quality: number): Flashcard => {
    const now = Date.now();
    let easeFactor = card.easeFactor || 2.5;
    let interval = card.interval || 0;
    let repetitions = card.repetitions || 0;

    if (quality < 2) {
      repetitions = 0;
      interval = 1;
    } else {
      easeFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;
      repetitions += 1;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * easeFactor);
    }

    return {
      ...card,
      lastReviewed: now,
      nextReview: now + (interval * 24 * 60 * 60 * 1000),
      easeFactor,
      interval,
      repetitions,
      mastered: repetitions > 4
    };
  };

  const rateCard = (quality: number) => {
    if (!studyingDeck || !studyQueue[currentCardIndex]) return;
    
    const currentCard = studyQueue[currentCardIndex];
    const updatedCard = calculateNextReview(currentCard, quality);
    
    // Update deck in main state
    const updatedDeck = {
      ...studyingDeck,
      cards: studyingDeck.cards.map(c => c.id === currentCard.id ? updatedCard : c)
    };
    setDecks(decks.map(d => d.id === studyingDeck.id ? updatedDeck : d));
    setStudyingDeck(updatedDeck); // Keep local deck state in sync

    // Move to next
    if (currentCardIndex < studyQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      finishStudy();
    }
  };

  const finishStudy = () => {
    setStudyingDeck(null);
    setStudyQueue([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const formatReviewTime = (days: number): string => {
    if (days < 1) return lang === "EN" ? "1d" : "1日";
    if (days < 7) return lang === "EN" ? `${days}d` : `${days}日`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return lang === "EN" ? `${weeks}w` : `${weeks}週`;
    const months = Math.floor(days / 30);
    return lang === "EN" ? `${months}m` : `${months}月`;
  };

  const exportToPDF = (deck: Deck) => {
    if (deck.cards.length === 0) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const cardGap = 10;
    const cardWidth = (pageWidth - (2 * margin) - cardGap) / 2;
    const cardHeight = 50;
    
    let x = margin;
    let y = margin + 30; // Start after title

    // Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(29, 29, 31); // Apple dark gray
    pdf.text(deck.name, margin, margin + 10);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(134, 134, 139); // Apple gray
    pdf.text(`${deck.cards.length} cards • Generated by BA14`, margin, margin + 18);

    // Draw Cards
    deck.cards.forEach((card, i) => {
      if (y + cardHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Card Box
      pdf.setDrawColor(229, 229, 234); // Apple light gray border
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'FD');

      // Content
      const contentMargin = 5;
      const textWidth = cardWidth - (2 * contentMargin);
      
      // Q Label
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(0, 122, 255); // Apple Blue
      pdf.text("Q", x + contentMargin, y + contentMargin + 3);

      // Question Text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(29, 29, 31);
      const qLines = pdf.splitTextToSize(card.front, textWidth);
      pdf.text(qLines, x + contentMargin, y + contentMargin + 10);

      // Divider
      pdf.setDrawColor(242, 242, 247);
      pdf.line(x + contentMargin, y + (cardHeight/2), x + cardWidth - contentMargin, y + (cardHeight/2));

      // A Label
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(52, 199, 89); // Apple Green
      pdf.text("A", x + contentMargin, y + (cardHeight/2) + contentMargin + 3);

      // Answer Text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(29, 29, 31);
      const aLines = pdf.splitTextToSize(card.back, textWidth);
      pdf.text(aLines, x + contentMargin, y + (cardHeight/2) + contentMargin + 10);

      // Move to next position
      if (x === margin) {
        x += cardWidth + cardGap;
      } else {
        x = margin;
        y += cardHeight + cardGap;
      }
    });

    pdf.save(`${deck.name}_flashcards.pdf`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Study Mode Overlay */}
      {studyingDeck && studyQueue.length > 0 && (
        <div className="fixed inset-0 bg-[#F2F2F7] dark:bg-[#000000] z-50 flex flex-col animate-in fade-in duration-300">
          {/* Study Header */}
          <div className="px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-[#E5E5EA] dark:border-[#2C2C2E] sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={finishStudy} className="p-2 hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-full transition-colors">
                <CloseIcon size={24} className="text-[#86868B]" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{studyingDeck.name}</h2>
                <p className="text-xs text-[#86868B]">{t.cardProgress.replace('{current}', (currentCardIndex + 1).toString()).replace('{total}', studyQueue.length.toString())}</p>
              </div>
            </div>
            <div className="w-32 h-2 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#007AFF] transition-all duration-500 ease-out"
                style={{ width: `${((currentCardIndex + 1) / studyQueue.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Study Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-2xl perspective-1000">
              <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/9] cursor-pointer group"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                <div className={`w-full h-full transition-all duration-500 transform-style-3d relative ${showAnswer ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 backface-hidden bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-2xl border border-[#E5E5EA] dark:border-[#2C2C2E] flex flex-col items-center justify-center p-12 text-center hover:scale-[1.02] transition-transform duration-300 ${showAnswer ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-sm font-bold text-[#007AFF] uppercase tracking-widest mb-6">{t.front}</span>
                    <h3 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight tracking-tight">
                      {studyQueue[currentCardIndex].front}
                    </h3>
                    <p className="mt-8 text-[#86868B] text-sm font-medium animate-pulse">{lang === "EN" ? "Tap to flip" : "點擊翻轉"}</p>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#1C1C1E] dark:bg-white rounded-[2rem] shadow-2xl border border-[#E5E5EA] dark:border-[#2C2C2E] flex flex-col items-center justify-center p-12 text-center ${showAnswer ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-sm font-bold text-[#34C759] uppercase tracking-widest mb-6">{t.back}</span>
                    <h3 className="text-3xl md:text-5xl font-bold text-white dark:text-[#1D1D1F] leading-tight tracking-tight">
                      {studyQueue[currentCardIndex].back}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Controls */}
          <div className="p-6 pb-10 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-t border-[#E5E5EA] dark:border-[#2C2C2E]">
            <div className="max-w-2xl mx-auto">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t.showAnswer}
                </button>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: t.again, color: "bg-[#FF3B30]", hover: "hover:bg-[#D70015]", val: 0, time: 1 },
                    { label: t.hard, color: "bg-[#FF9500]", hover: "hover:bg-[#C93400]", val: 1, time: 3 },
                    { label: t.good, color: "bg-[#34C759]", hover: "hover:bg-[#248A3D]", val: 2, time: 6 },
                    { label: t.easy, color: "bg-[#007AFF]", hover: "hover:bg-[#0040DD]", val: 3, time: 14 }
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => rateCard(btn.val)}
                      className={`flex flex-col items-center justify-center py-3 ${btn.color} ${btn.hover} text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg`}
                    >
                      <span className="text-sm font-bold">{btn.label}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{formatReviewTime(btn.time)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            {t.title}
          </h1>
          <p className="text-[#86868B] dark:text-[#86868B] mt-1 text-lg">
            {t.subtitle}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Search or Filter could go here */}
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Create New Deck Card (Large) */}
        <div className="lg:col-span-4 md:col-span-6 bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Plus size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">{t.createDeck}</h3>
            <p className="text-[#86868B] text-sm">{lang === "EN" ? "Start a new subject" : "開始新主題"}</p>
          </div>
          <div className="mt-6 relative">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createDeck()}
              placeholder={t.deckName}
              className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all pr-12"
            />
            <button
              onClick={createDeck}
              disabled={!newDeckName.trim()}
              className="absolute right-2 top-2 bottom-2 px-3 bg-[#007AFF] text-white rounded-lg text-sm font-medium disabled:opacity-0 transition-all hover:bg-[#0071E3] flex items-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Stats / Quick Actions (Medium) */}
        <div className="lg:col-span-8 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-[2rem] p-6 shadow-lg shadow-blue-500/20 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div>
              <div className="flex items-center gap-2 mb-1 opacity-80">
                <Zap size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.quickActions}</span>
              </div>
              <h3 className="text-2xl font-bold">{t.studyMode}</h3>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-90 mb-4">
                {decks.reduce((acc, d) => acc + d.cards.filter(c => (c.nextReview || 0) < Date.now()).length, 0)} cards due for review
              </p>
              {decks.length > 0 && (
                <button 
                  onClick={() => startStudy(decks[0])}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <Play size={14} fill="currentColor" />
                  {lang === "EN" ? "Start Review" : "開始溫習"}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E] hover:shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#34C759] flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {decks.reduce((acc, d) => acc + d.cards.filter(c => c.mastered).length, 0)}
              </span>
            </div>
            <p className="text-[#86868B] text-sm font-medium">{t.mastered} Cards</p>
          </div>
        </div>

        {/* Decks List */}
        {decks.map((deck, index) => (
          <div 
            key={deck.id} 
            className={`bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-6 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E] hover:shadow-lg transition-all duration-300 flex flex-col group animate-in fade-in slide-in-from-bottom-4 ${index === 0 ? 'lg:col-span-8 md:col-span-12' : 'lg:col-span-4 md:col-span-6'}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl transition-colors duration-300 ${index === 0 ? 'bg-[#FF9500] text-white shadow-lg shadow-orange-500/30' : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF] group-hover:text-white'}`}>
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">{deck.name}</h3>
                  <p className="text-[#86868B] text-xs font-medium">{deck.cards.length} {t.cards}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteDeck(deck.id)}
                className="p-2 text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF3B30]/10 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Stats Mini-Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl p-2 text-center">
                <div className="text-[10px] text-[#86868B] font-bold uppercase tracking-wider">{t.due}</div>
                <div className="text-lg font-bold text-[#FF3B30]">{deck.cards.filter(c => (c.nextReview || 0) < Date.now()).length}</div>
              </div>
              <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl p-2 text-center">
                <div className="text-[10px] text-[#86868B] font-bold uppercase tracking-wider">{t.new}</div>
                <div className="text-lg font-bold text-[#007AFF]">{deck.cards.filter(c => !c.lastReviewed).length}</div>
              </div>
              <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl p-2 text-center">
                <div className="text-[10px] text-[#86868B] font-bold uppercase tracking-wider">{t.mastered}</div>
                <div className="text-lg font-bold text-[#34C759]">{deck.cards.filter(c => c.mastered).length}</div>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <button
                onClick={() => startStudy(deck)}
                disabled={deck.cards.length === 0}
                className="w-full py-3 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                {t.study}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedDeck(selectedDeck?.id === deck.id ? null : deck)}
                  className="py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-xl font-medium hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  {t.addCard}
                </button>
                <button
                  onClick={() => exportToPDF(deck)}
                  disabled={deck.cards.length === 0}
                  className="py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-xl font-medium hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>

            {/* Add Card / Import Area */}
            {selectedDeck?.id === deck.id && (
              <div className="mt-4 pt-4 border-t border-[#E5E5EA] dark:border-[#2C2C2E] animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <input
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    placeholder={t.front}
                    className="w-full px-3 py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                  <input
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCard(deck.id)}
                    placeholder={t.back}
                    className="w-full px-3 py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addCard(deck.id)}
                      className="flex-1 py-2.5 bg-[#007AFF] text-white rounded-xl text-xs font-bold"
                    >
                      {t.addCard}
                    </button>
                    <label className="flex-1 cursor-pointer">
                      <input type="file" accept=".csv" onChange={(e) => handleCSVImport(deck.id, e)} className="hidden" />
                      <div className="w-full py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-xl text-xs font-bold text-center hover:bg-[#E5E5EA] transition-colors flex items-center justify-center gap-1">
                        <Upload size={12} /> CSV
                      </div>
                    </label>
                    <button
                       onClick={() => setViewingCardsDeck(viewingCardsDeck === deck.id ? null : deck.id)}
                       className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${viewingCardsDeck === deck.id ? 'bg-[#007AFF] text-white' : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#E5E5EA]'}`}
                    >
                      {t.viewCards}
                    </button>
                  </div>

                  {/* Card List View */}
                  {viewingCardsDeck === deck.id && (
                    <div className="mt-4 pt-4 border-t border-[#E5E5EA] dark:border-[#2C2C2E] animate-in slide-in-from-top-2">
                      {deck.cards.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-xs">
                          {t.noCards}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(['learning', 'reviewing', 'mastered', 'new'] as const).map(status => {
                            const statusCards = deck.cards.filter(c => getCardStatus(c) === status);
                            if (statusCards.length === 0) return null;
                            
                            const colorClass = getStatusColor(status);
                            const label = status === 'learning' ? t.statusLearning : 
                                          status === 'reviewing' ? t.statusReviewing :
                                          status === 'mastered' ? t.statusMastered : t.statusNew;

                            return (
                              <div key={status}>
                                <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${colorClass.split(' ')[1]}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[0]}`}></span>
                                  {label} ({statusCards.length})
                                </h4>
                                <div className="space-y-2">
                                  {statusCards.map(card => (
                                    <div key={card.id} className={`p-3 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border-l-4 ${colorClass.split(' ')[2]} group relative`}>
                                       <div className="flex justify-between items-start gap-2">
                                         <div className="flex-1 min-w-0">
                                           <div className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] text-sm truncate">{card.front}</div>
                                           <div className="text-xs text-[#86868B] mt-0.5 truncate">{card.back}</div>
                                         </div>
                                         <button 
                                           onClick={() => deleteCard(deck.id, card.id)}
                                           className="text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity"
                                         >
                                           <Trash2 size={14} />
                                         </button>
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <BookOpen size={40} className="text-[#86868B]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">{t.noCards}</h3>
            <p className="text-[#86868B]">{lang === "EN" ? "Create a deck to start your learning journey" : "建立卡組開始你嘅學習旅程"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
