import React, { useState, useEffect, useRef } from "react";
import jsPDF from 'jspdf';
import { saveData, loadData } from "./db";
import { AppleEmoji } from "./components/AppleEmoji";
import { Plus, Play, Trash2, Download, Upload, Eye, X, Brain, BookOpen, Check, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";

/**
 * Apple-Style Flashcards
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
    case 'mastered': return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' };
    case 'reviewing': return { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' };
    case 'learning': return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' };
    default: return { bg: 'bg-gray-200', text: 'text-gray-500', border: 'border-gray-200' };
  }
};

const calculateRetention = (card: Flashcard) => {
  if (!card.lastReviewed || !card.interval) return 0;
  const daysElapsed = (Date.now() - card.lastReviewed) / (1000 * 60 * 60 * 24);
  return Math.pow(0.9, daysElapsed / card.interval) * 100;
};

const SurfaceCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
  >
    {children}
  </div>
);

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
      if (aDue < now && bDue < now) return aDue - bDue;
      if (aDue < now) return -1;
      if (bDue < now) return 1;
      return aDue - bDue;
    });

    setStudyQueue(sortedCards);
    setStudyingDeck(deck);
    setCurrentCardIndex(0);
    setShowAnswer(false);
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
    
    const updatedDeck = {
      ...studyingDeck,
      cards: studyingDeck.cards.map(c => c.id === currentCard.id ? updatedCard : c)
    };
    setDecks(decks.map(d => d.id === studyingDeck.id ? updatedDeck : d));
    setStudyingDeck(updatedDeck);

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
    let y = margin + 30;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(29, 29, 31);
    pdf.text(deck.name, margin, margin + 10);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(134, 134, 139);
    pdf.text(`${deck.cards.length} cards • Generated by BA14`, margin, margin + 18);

    deck.cards.forEach((card, i) => {
      if (y + cardHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.setDrawColor(229, 229, 234);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'FD');
      const contentMargin = 5;
      const textWidth = cardWidth - (2 * contentMargin);
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Q", x + contentMargin, y + contentMargin + 3);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(29, 29, 31);
      const qLines = pdf.splitTextToSize(card.front, textWidth);
      pdf.text(qLines, x + contentMargin, y + contentMargin + 10);

      pdf.setDrawColor(242, 242, 247);
      pdf.line(x + contentMargin, y + (cardHeight/2), x + cardWidth - contentMargin, y + (cardHeight/2));

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.text("A", x + contentMargin, y + (cardHeight/2) + contentMargin + 3);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(29, 29, 31);
      const aLines = pdf.splitTextToSize(card.back, textWidth);
      pdf.text(aLines, x + contentMargin, y + (cardHeight/2) + contentMargin + 10);

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
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {t.title}
            </h1>
            <p className="text-[17px] text-gray-600 mt-2">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Create Deck */}
        <SurfaceCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t.createDeck}</h3>
              <p className="text-sm text-gray-500">{lang === "EN" ? "Start a new subject" : "開始新主題"}</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createDeck()}
              placeholder={t.deckName}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 placeholder-gray-400 border border-gray-200"
            />
            <button
              onClick={createDeck}
              disabled={!newDeckName.trim()}
              className="absolute right-2 top-2 bottom-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-0 transition-all hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </SurfaceCard>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{lang === "EN" ? "Scientific Learning" : "科學學習"}</span>
              </div>
              <h3 className="text-2xl font-bold mb-6">{t.studyMode}</h3>
              
              <div className="flex items-end gap-4 mb-6">
                <div>
                  <div className="text-5xl font-bold leading-none">
                    {Math.round(decks.reduce((acc, d) => acc + d.cards.reduce((sum, c) => sum + calculateRetention(c), 0), 0) / Math.max(1, decks.reduce((acc, d) => acc + d.cards.length, 0)))}%
                  </div>
                  <div className="text-sm opacity-80 mt-1">Average Retention</div>
                </div>
                <div className="text-sm opacity-80 pb-1">
                  {decks.reduce((acc, d) => acc + d.cards.filter(c => (c.nextReview || 0) < Date.now()).length, 0)} cards due
                </div>
              </div>

              {decks.length > 0 && (
                <button 
                  onClick={() => startStudy(decks[0])}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold transition-all hover:bg-blue-50 flex items-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  {lang === "EN" ? "Start Review" : "開始溫習"}
                </button>
              )}
            </div>
        </div>

        {/* Decks List */}
        <div className="space-y-6">
          {decks.map((deck) => (
            <SurfaceCard key={deck.id} className="group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{deck.name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{deck.cards.length} {t.cards}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                  className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Mini-Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{deck.cards.filter(c => (c.nextReview || 0) < Date.now()).length}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.due}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{deck.cards.filter(c => !c.lastReviewed).length}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.new}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{deck.cards.filter(c => c.mastered).length}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.mastered}</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={(e) => { e.stopPropagation(); startStudy(deck); }}
                  disabled={deck.cards.length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {t.study}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedDeck(selectedDeck?.id === deck.id ? null : deck); }}
                    className="py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm border border-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addCard}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); exportToPDF(deck); }}
                    disabled={deck.cards.length === 0}
                    className="py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm border border-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Add Card / Import Area */}
              {selectedDeck?.id === deck.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                  <div className="space-y-3">
                    <input
                      value={newCardFront}
                      onChange={(e) => setNewCardFront(e.target.value)}
                      placeholder={t.front}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900 border border-gray-200"
                    />
                    <input
                      value={newCardBack}
                      onChange={(e) => setNewCardBack(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCard(deck.id)}
                      placeholder={t.back}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900 border border-gray-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addCard(deck.id)}
                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                      >
                        {t.addCard}
                      </button>
                      <label className="flex-1 cursor-pointer">
                        <input type="file" accept=".csv" onChange={(e) => handleCSVImport(deck.id, e)} className="hidden" />
                        <div className="w-full py-2.5 bg-white text-gray-700 rounded-xl text-xs font-bold text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 border border-gray-200">
                          <Upload className="w-3 h-3" /> CSV
                        </div>
                      </label>
                      <button
                         onClick={() => setViewingCardsDeck(viewingCardsDeck === deck.id ? null : deck.id)}
                         className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors border border-gray-200 ${viewingCardsDeck === deck.id ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {t.viewCards}
                      </button>
                    </div>

                    {/* Card List View */}
                    {viewingCardsDeck === deck.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
                        {deck.cards.length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-xs">
                            {t.noCards}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {(['learning', 'reviewing', 'mastered', 'new'] as const).map(status => {
                              const statusCards = deck.cards.filter(c => getCardStatus(c) === status);
                              if (statusCards.length === 0) return null;
                              
                              const colors = getStatusColor(status);
                              const label = status === 'learning' ? t.statusLearning : 
                                            status === 'reviewing' ? t.statusReviewing :
                                            status === 'mastered' ? t.statusMastered : t.statusNew;

                              return (
                                <div key={status}>
                                  <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${colors.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}></span>
                                    {label} ({statusCards.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {statusCards.map(card => (
                                      <div key={card.id} className={`p-3 rounded-xl bg-gray-50 border-l-4 ${colors.border} group relative border-t border-r border-b border-gray-100`}>
                                         <div className="flex justify-between items-start gap-2">
                                           <div className="flex-1 min-w-0">
                                             <div className="font-medium text-gray-900 text-sm truncate">{card.front}</div>
                                             <div className="text-xs text-gray-500 mt-0.5 truncate">{card.back}</div>
                                           </div>
                                           <button 
                                             onClick={() => deleteCard(deck.id, card.id)}
                                             className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                           >
                                             <Trash2 className="w-3.5 h-3.5" />
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
            </SurfaceCard>
          ))}
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noCards}</h3>
            <p className="text-gray-500">{lang === "EN" ? "Create a deck to start your learning journey" : "建立卡組開始你嘅學習旅程"}</p>
          </div>
        )}
      </div>

      {/* Study Mode Overlay */}
      {studyingDeck && studyQueue.length > 0 && (
        <div className="fixed inset-0 bg-[#F5F5F7] z-50 flex flex-col animate-in fade-in duration-300">
          {/* Study Header */}
          <div className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={finishStudy} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{studyingDeck.name}</h2>
                <p className="text-xs text-gray-500">{t.cardProgress.replace('{current}', (currentCardIndex + 1).toString()).replace('{total}', studyQueue.length.toString())}</p>
              </div>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentCardIndex + 1) / studyQueue.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Study Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* Retention Indicator */}
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-full flex items-center gap-3 shadow-sm">
                <Brain className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Memory Retention</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000"
                        style={{ width: `${calculateRetention(studyQueue[currentCardIndex]) || 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {Math.round(calculateRetention(studyQueue[currentCardIndex]) || 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl perspective-1000">
              <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/9] cursor-pointer group"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                <div className={`w-full h-full transition-all duration-500 transform-style-3d relative ${showAnswer ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl border border-gray-200 flex flex-col items-center justify-center p-8 md:p-12 text-center hover:scale-[1.02] transition-transform duration-300 ${showAnswer ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-xs md:text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 md:mb-6">{t.front}</span>
                    <div className="flex-1 flex items-center justify-center w-full overflow-y-auto no-scrollbar">
                      <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-snug tracking-tight break-words max-w-full px-4">
                        {studyQueue[currentCardIndex].front}
                      </h3>
                    </div>
                    <p className="mt-4 md:mt-8 text-gray-400 text-xs md:text-sm font-medium animate-pulse">{lang === "EN" ? "Tap to flip" : "點擊翻轉"}</p>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[2rem] shadow-xl border border-blue-100 flex flex-col items-center justify-center p-8 md:p-12 text-center ${showAnswer ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-xs md:text-sm font-bold text-green-500 uppercase tracking-widest mb-4 md:mb-6">{t.back}</span>
                    <div className="flex-1 flex items-center justify-center w-full overflow-y-auto no-scrollbar">
                      <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-snug tracking-tight break-words max-w-full px-4">
                        {studyQueue[currentCardIndex].back}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Controls */}
          <div className="p-6 pb-10 bg-white border-t border-gray-200">
            <div className="max-w-2xl mx-auto">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t.showAnswer}
                </button>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: t.again, color: "bg-red-50 text-red-600 border border-red-100", hover: "hover:bg-red-100", val: 0, time: 1 },
                    { label: t.hard, color: "bg-orange-50 text-orange-600 border border-orange-100", hover: "hover:bg-orange-100", val: 1, time: 3 },
                    { label: t.good, color: "bg-blue-50 text-blue-600 border border-blue-100", hover: "hover:bg-blue-100", val: 2, time: 6 },
                    { label: t.easy, color: "bg-green-50 text-green-600 border border-green-100", hover: "hover:bg-green-100", val: 3, time: 14 }
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => rateCard(btn.val)}
                      className={`flex flex-col items-center justify-center py-3 ${btn.color} ${btn.hover} rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-sm`}
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
    </div>
  );
}
