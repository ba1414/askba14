import React from 'react';
import { 
  Map, Flag, Swords, BarChart3, Calendar, Sun, FileSignature, Mail,
  Target, ListChecks, AlertTriangle, BookOpen, Brain, GraduationCap,
  Clock, CheckCircle2, AlertCircle, Heart, Users, Zap, Layout,
  MousePointer2, HelpCircle, Trophy, Shield
} from 'lucide-react';

// --- Types ---

export type TimelineItem = {
  id: string;
  stage: string;
  timeframe: string;
  title: string; // e.g. DSE 放榜 & Pre-Asso
  subtitle: string; // e.g. DSE 放榜後的抉擇期
  chipLabel: string; // For navigation chips
  color: string;
  icon: any;
  goals: string[];
  actions: string[]; // Can be nested or simple strings. User provided bullet points.
  risks: string[];
};

export type MindsetItem = {
  title: string;
  summary: string;
  details: React.ReactNode;
  icon: any;
  color: string;
};

// --- Big Picture Data ---

export const BIG_PICTURE = {
  hero: {
    title: "Asso 升大學",
    subtitle: "由 DSE 放榜 → Asso → Non-JUPAS → 入 U 路線圖。",
    welcome: "歡迎你嚟到呢個網站。呢度整合咗過來人嘅經驗，幫你行少啲冤枉路。"
  },
  // Keeping the timeline overview simple as requested by previous context, 
  // but the main focus is the detailed timeline below.
  timeline: [
    {
      label: "兩年時間軸 Overview",
      desc: "由 DSE 放榜到 Year 2 畢業，兩年 4 個 Sem，每一步都係關鍵。"
    }
  ],
  cards: [] // Cleared as per previous request
};

// --- Unified Timeline Data ---

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "stage-1",
    stage: "9月",
    timeframe: "Year 1 Sem 1 開始",
    title: "開學與適應期",
    subtitle: "進入大專學習模式的第一個月",
    chipLabel: "9月開學",
    color: "text-gray-900",
    icon: "🚀",
    goals: [
      "掌握每科評核比重與提交格式",
      "建立人際網絡與小組",
      "適應大專上課節奏"
    ],
    actions: [
      "仔細閱讀每科 Course Outline，了解評核比重與 Deadline",
      "及早識一至兩位「讀書拍檔」，對小組作業同時間安排會有幫助",
      "參加 Orientation 活動，認識同學與校園資源",
      "初步了解圖書館、自修室、打印服務等校園設施"
    ],
    risks: [
      "以為課程簡單而輕視開學準備",
      "錯過組隊關鍵期，後期難以找到合適 Groupmates",
      "未記錄 Deadline，後期手忙腳亂"
    ]
  },
  {
    id: "stage-2",
    stage: "9月—12月",
    timeframe: "Year 1 Sem 1",
    title: "學期運作期",
    subtitle: "功課、小測、報告、簡報逐步出現",
    chipLabel: "Sem 1 運作",
    color: "text-gray-900",
    icon: "📚",
    goals: [
      "建立穩定的學習節奏",
      "優先處理比重高的評核",
      "預留修訂時間避免趕工"
    ],
    actions: [
      "將時間投放喺「比重高」嘅評核項目",
      "低比重項目亦不可完全放棄，但要分清主次",
      "提早預留「修訂時間」，避免臨近截止日期先趕工影響質素",
      "建立每週溫習時間表，平衡各科進度"
    ],
    risks: [
      "平均分配時間，忽略高比重項目",
      "臨急抱佛腳，質素受影響",
      "缺席太多，影響 Participation 分數"
    ]
  },
  {
    id: "stage-3",
    stage: "Stage 1",
    timeframe: "9–12 月",
    title: "Year 1 Sem 1",
    subtitle: "適應大專節奏的第一學期",
    chipLabel: "Year 1 Sem 1",
    color: "text-primary",
    icon: "🚩",
    goals: [
      "適應大專上課模式、assessment 節奏",
      "建立穩定的溫習與交功課習慣",
      "找到合適的 groupmates 與學習夥伴"
    ],
    actions: [
      "九月開學第一兩星期：熟讀每科 course outline / assessment 比重 / deadline",
      "組好 group project，盡早開第一次 meeting 分工",
      "把所有 deadline、考試日期記錄在日曆（電子或紙本）",
      "試驗一套可維持的 weekly routine：上課、預習、溫習、交通時間"
    ],
    risks: [
      "以為 Asso / HD 容易，輕視平時 5–10% 的小作業",
      "一直做「獨行俠」，冇主動認識可靠同學",
      "缺席太多堂，影響 participation / attendance 分"
    ]
  },
  {
    id: "stage-2",
    stage: "Stage 2",
    timeframe: "12 月～1 月",
    title: "Sem 1 考試 ＋ Sem Break",
    subtitle: "第一次考試與第一個 Sem Break",
    chipLabel: "Sem 1 Exam",
    color: "text-primary",
    icon: "⚔️",
    goals: [
      "完成 Sem 1 所有考核並穩住 GPA",
      "好好利用第一個 Sem Break",
      "反思自己學習方法"
    ],
    actions: [
      "考試前：整理一份精簡版筆記，做限時練習",
      "準備 final presentation，確保檔案備份好（避免遺失）",
      "Sem 結束後：檢視各科預期成績，估算大概 GPA 範圍",
      "Sem Break 期間：休息與紓壓、返兼職、或學新技能（例如打字、basic Excel、簡單寫作技巧）"
    ],
    risks: [
      "考試前臨急抱佛腳，完全沒有平時累積",
      "Sem Break 完全放空，沒有反思 Sem 1 哪裏做得不足",
      "過度自責 / 過度樂觀，對自己實際成績冇清晰認知"
    ]
  },
  {
    id: "stage-3",
    stage: "12月中—1月",
    timeframe: "Sem Break",
    title: "第一個學期空檔",
    subtitle: "休息、調整與反思的關鍵時期",
    chipLabel: "Sem Break",
    color: "text-primary",
    icon: "🌟",
    goals: [
      "回顧 Sem 1 失分位",
      "休息調整狀態",
      "為下學期作準備"
    ],
    actions: [
      "先回顧上學期失分位：係時間安排問題、方法問題、定係理解不足？",
      "休息調整、回復狀態",
      "兼職／短期工作（如有需要）",
      "補底與預習、整理筆記，為下學期作準備",
      "若目標係爭取升讀，Sem Break 係你重整策略最有效的一段時間"
    ],
    risks: [
      "完全放空，沒有反思 Sem 1 不足",
      "過度自責或過度樂觀",
      "錯過調整學習方法的黃金時機"
    ]
  },
  {
    id: "stage-4",
    stage: "1月—6月",
    timeframe: "Year 1 Sem 2",
    title: "第二學期",
    subtitle: "選科、編排時間表、小組合作更頻繁",
    chipLabel: "Sem 2",
    color: "text-primary",
    icon: "📊",
    goals: [
      "學懂自行選科與編排時間表",
      "與可信賴同學協調合作",
      "穩定或提升 GPA"
    ],
    actions: [
      "自行選科與編排時間表（通常學期初一至兩星期較忙）",
      "選科與時間表不只看「易唔易」，亦要考慮自己能否應付評核模式",
      "盡量與可信賴同學協調時間表，方便同組作業，提高效率",
      "小組合作更頻繁，亦更依賴固定拍檔協調"
    ],
    risks: [
      "timetable 排得過於緊密",
      "只跟朋友選科，忽略自己能力",
      "重複 Sem 1 同樣錯誤"
    ]
  },
  {
    id: "stage-5",
    stage: "5月—6月",
    timeframe: "Year 1 Sem 2 期末",
    title: "考核高峰",
    subtitle: "報告、簡報、考試集中出現",
    chipLabel: "期末考核",
    color: "text-primary",
    icon: "⚡",
    goals: [
      "完成所有考核",
      "避免多線同時爆煲",
      "穩住 Year 1 整體 GPA"
    ],
    actions: [
      "多科同時收尾：報告、簡報、考試集中出現",
      "以「先交先鬆」為原則，優先處理比重高、提交時間早嘅科目",
      "避免多線同時爆煲：能提前完成嘅部分，越早完成越好",
      "確保所有檔案已備份，避免遺失"
    ],
    risks: [
      "臨急抱佛腳，完全沒有平時累積",
      "多科同時 Deadline，時間分配失衡",
      "忽略備份，檔案遺失"
    ]
  },
  {
    id: "stage-6",
    stage: "6月—8月",
    timeframe: "暑假",
    title: "Year 1 與 Year 2 之間",
    subtitle: "調整、補充經歷與準備的窗口",
    chipLabel: "暑假",
    color: "text-primary",
    icon: "☀️",
    goals: [
      "休息與調整狀態",
      "累積實務經驗",
      "處理語文資格（如需要）"
    ],
    actions: [
      "對大部分同學：休息、短期工作、實習、提升技能等",
      "對部分同學（暑期修讀／重修）：利用暑期修讀補回失分科目，或提早修讀以減輕下學期負擔",
      "若你需要實習或希望增強履歷，暑假宜早規劃，避免撞期",
      "若 Year 1 成績未理想，暑假亦可用作「補底＋重整方法」的過渡期",
      "處理語文考試（IELTS / IGCSE），如有需要"
    ],
    risks: [
      "暑假完全空過，沒有任何累積",
      "過遲處理語文資格問題",
      "同時做太多事情導致透支"
    ]
  },
  {
    id: "stage-7",
    stage: "9月—11月",
    timeframe: "Year 2 Sem 1 前段",
    title: "開始進入升讀節奏",
    subtitle: "申請文件準備與學業並行",
    chipLabel: "Year 2 開始",
    color: "text-primary",
    icon: "📝",
    goals: [
      "準備申請所需文件",
      "整理個人材料與經歷",
      "維持 GPA"
    ],
    actions: [
      "申請所需文件（例如：成績紀錄、個人陳述、推薦信、獎項證明等）",
      "整理個人材料與經歷，建立一套一致嘅申請敘事（動機、能力、方向）",
      "先準備「可即時上載」嘅版本；新成績出咗再補交更新",
      "文件出得慢就要主動跟進，越早完成基本申請流程，越有機會遇到面試或較早審批"
    ],
    risks: [
      "過遲準備文件",
      "申請敘事不一致",
      "遞交後不再跟進"
    ]
  },
  {
    id: "stage-8",
    stage: "11月—1月",
    timeframe: "申請期高峰",
    title: "遞交、補件、更新",
    subtitle: "Non-JUPAS 申請的關鍵時期",
    chipLabel: "申請高峰",
    color: "text-primary",
    icon: "📮",
    goals: [
      "完成遞交申請",
      "補齊所需文件",
      "更新最新成績"
    ],
    actions: [
      "不同院校／課程開放申請時間不一，審批節奏亦不一",
      "成績單／學期成績更新往往有時間差，需要後續補交",
      "先遞交再完善：有咩就先上載，之後再補交最新成績或文件",
      "申請策略上，可同時申請主選方向及一至兩個後備選項，以分散風險"
    ],
    risks: [
      "錯過申請 Deadline",
      "文件不齊全影響審批",
      "只申請一個課程，風險過高"
    ]
  },
  {
    id: "stage-9",
    stage: "12月—2月",
    timeframe: "面試期",
    title: "Sem Break 前後最常見",
    subtitle: "面試直接影響取錄結果",
    chipLabel: "面試期",
    color: "text-primary",
    icon: "🎤",
    goals: [
      "認真準備面試",
      "展示課程理解與學術能力",
      "說明銜接計劃"
    ],
    actions: [
      "面試準備應以「課程理解＋學術能力證據＋銜接計劃」為核心",
      "你理解課程訓練方式？",
      "你有無作品／作業／專題證明你跟得上？",
      "你不足之處如何補？",
      "若同時要兼顧實習／學業，需預留時間，避免臨急抱佛腳"
    ],
    risks: [
      "完全無準備，臨場發揮",
      "無法展示學術能力證據",
      "時間安排不當，與學業／實習衝突"
    ]
  },
  {
    id: "stage-10",
    stage: "1月—5月",
    timeframe: "Year 2 Sem 2",
    title: "條件取錄與最後衝刺",
    subtitle: "保持 GPA、滿足條件",
    chipLabel: "Sem 2 衝刺",
    color: "text-primary",
    icon: "🎯",
    goals: [
      "滿足 Conditional Offer 要求",
      "保持 GPA 不失速",
      "完成最後學期所有評核"
    ],
    actions: [
      "你可能陸續收到有條件取錄（Conditional Offer），條件多與最終成績／語文要求等相關",
      "同期亦係你最需要保持 GPA、避免失速嘅階段",
      "接受取錄前，先評估：達標可能性、財務安排、以及你對該方向是否仍然認同",
      "若仍未有 offer：保持節奏，因為有些名額會隨後釋出；輪候名單亦可能後補上"
    ],
    risks: [
      "收到 Offer 後鬆懈",
      "最後成績未達要求",
      "過早放棄輪候機會"
    ]
  },
  {
    id: "stage-11",
    stage: "6月",
    timeframe: "畢業",
    title: "畢業與收尾",
    subtitle: "兩年課程正式結束",
    chipLabel: "畢業",
    color: "text-primary",
    icon: "🎓",
    goals: [
      "完成所有畢業手續",
      "準備大學註冊文件",
      "等待最終確認"
    ],
    actions: [
      "兩年課程正式結束，進入畢業與過渡期",
      "即使到暑假仍可能有人陸續收到取錄通知；未到最後階段之前，不宜過早放棄",
      "處理畢業相關手續",
      "準備大學註冊所需文件"
    ],
    risks: [
      "過早放棄輪候",
      "畢業手續處理不當",
      "文件準備不足"
    ]
  },
  {
    id: "stage-12",
    stage: "7月—8月",
    timeframe: "入學前準備",
    title: "最終確認與入學前準備",
    subtitle: "準備進入大學",
    chipLabel: "入學準備",
    color: "text-primary",
    icon: "✨",
    goals: [
      "完成註冊安排",
      "準備開學事宜",
      "整理時間表與文件"
    ],
    actions: [
      "文件核實、註冊安排、迎新資訊、學期前準備等",
      "一邊等正式確認，一邊整理時間表、預備入學所需文件與生活安排，避免臨近開學手忙腳亂",
      "參加大學迎新活動（如有）",
      "了解新校園設施與資源"
    ],
    risks: [
      "臨近開學手忙腳亂",
      "文件不齊全影響註冊",
      "錯過迎新活動"
    ]
  }
];

// --- Mindset Data ---

export const MINDSET: MindsetItem[] = [
  {
    title: "先了解「遊戲規則」",
    icon: "🎮",
    color: "text-primary",
    summary: "掌握制度與規則，優先照顧比重較高的評核。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 清楚 <strong>GPA 計算方式</strong> (A=4.0, A-=3.7)，一科 C 會嚴重拉低整體成績。</li>
        <li>• 細閱 <strong>Syllabus</strong>，了解評核比重，將時間優先分配給高比重項目。</li>
      </ul>
    )
  },
  {
    title: "Deadline 向前推",
    icon: "⏳",
    color: "text-primary",
    summary: "自行提早 3–5 日設定「內部截止日期」。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 預留時間作最後檢查、修改內容及潤飾格式。</li>
        <li>• 提升最終遞交作品的整體質素，避免臨急抱佛腳。</li>
      </ul>
    )
  },
  {
    title: "每日一件事",
    icon: "✅",
    color: "text-primary",
    summary: "追求有效率的練習與輸出，而非單純堆砌時間。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 每天至少完成一項具體任務 (e.g. 練習題、修訂報告、整理筆記)。</li>
        <li>• 持續累積能減少拖延，避免臨近考核時出現嚴重壓力。</li>
      </ul>
    )
  },
  {
    title: "善用零碎時間",
    icon: "🧩",
    color: "text-primary",
    summary: "將學習內容拆細，穿插於每天的空檔之中。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 搭車、等車時快速重溫概念、公式或檢視待辦事項。</li>
        <li>• 不應只等待「一大段完整時間」才開始學習。</li>
      </ul>
    )
  },
  {
    title: "失手要懂得「拉分」",
    icon: "💪",
    color: "text-primary",
    summary: "一次失手不代表整科完結，專注後續評核。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 冷靜分析問題，在之後的評核 (期中、期末) 加倍準備。</li>
        <li>• 透過後續評核拉高整體分數，減低早前失手的影響。</li>
      </ul>
    )
  },
  {
    title: "Group Project 角色",
    icon: "🤝",
    color: "text-primary",
    summary: "合適分工、互相配合，避免成為隱形組員。",
    details: (
      <ul className="space-y-2 text-sm text-muted">
        <li>• 及早商討分工與時間表，說明負責範圍。</li>
        <li>• 不做 Free-rider，亦不單方面攬上身，以免難以兼顧其他科目。</li>
      </ul>
    )
  },
  {
    title: "長遠視角：打好地基",
    icon: "🏗️",
    color: "text-primary",
    summary: "第一學期盡量爭取高 GPA，建立緩衝空間。",
    details: (
      <div className="space-y-4 text-sm text-muted">
        <div>
          <strong className="text-foreground block mb-1">第一學期策略：</strong>
          <p>盡量爭取理想 GPA，為日後實習或突發狀況建立「緩衝空間」。</p>
        </div>
        <div>
          <strong className="text-foreground block mb-1">特別注意：</strong>
          <p>若首個學期成績太低，日後要拉升至 3.3+ 會非常困難。越早建立穩定學習模式，壓力越小。</p>
        </div>
      </div>
    )
  }
];
