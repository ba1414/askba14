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
    id: "stage-0",
    stage: "Stage 0",
    timeframe: "7–8 月",
    title: "DSE 放榜 & Pre-Asso",
    subtitle: "DSE 放榜後的抉擇期",
    chipLabel: "Pre-Asso",
    color: "text-orange-500",
    icon: "🗺️",
    goals: [
      "決定升學方向（Retake / Asso / HD 等）",
      "完成副學士 / 高級文憑入學註冊",
      "調整心態迎接新階段"
    ],
    actions: [
      "評估 DSE 成績同目標學科，決定讀 Asso / HD 定重考",
      "按院校指示交學費、上載證件相片、完成網上註冊程序",
      "如果參加 OCamp / O-day，認識校園資源、導師、同系同學",
      "初步留意將來 Non-JUPAS 升學大概時間線（知道有呢件事就已經足夠）"
    ],
    risks: [
      "錯過註冊或交費 Deadline",
      "過度依賴坊間 / 非官方群組流言",
      "一直停留喺「放榜失落」情緒，未整理好心情就開學"
    ]
  },
  {
    id: "stage-1",
    stage: "Stage 1",
    timeframe: "9–12 月",
    title: "Year 1 Sem 1",
    subtitle: "適應大專節奏的第一學期",
    chipLabel: "Year 1 Sem 1",
    color: "text-amber-500",
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
    color: "text-yellow-500",
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
    stage: "Stage 3",
    timeframe: "1 月底～6 月初",
    title: "Year 1 Sem 2",
    subtitle: "建立穩定 GPA 的關鍵學期",
    chipLabel: "Year 1 Sem 2",
    color: "text-lime-500",
    icon: "📊",
    goals: [
      "修正 Sem 1 的不足，穩定或提升 GPA",
      "學懂自己編排時間表與選科",
      "建立一至兩位長期學習夥伴"
    ],
    actions: [
      "Sem 開始時自行 Reg 科，編排適合自己的 timetable（留意 campus / 時段分佈）",
      "盡量同可靠同學夾時間表，方便做 group project",
      "Midterm 前：整理溫習範圍、估算不同 assessment 比重",
      "5 月中開始進入考試季，平均分配溫習時間，避免某科完全冇溫",
      "Sem 結束後檢視正式 GPA，認真了解每科 grade 分佈"
    ],
    risks: [
      "timetable 排得過於緊密，導致沒有完整溫習時間",
      "重複犯 Sem 1 同樣錯誤（例如經常遲交、拖延 group work）",
      "只跟從朋友選科，而冇考慮自己能力與興趣"
    ]
  },
  {
    id: "stage-4",
    stage: "Stage 4",
    timeframe: "6–8 月",
    title: "Year 1 暑假",
    subtitle: "銜接 Year 2 前的暑假",
    chipLabel: "Summer",
    color: "text-green-500",
    icon: "☀️",
    goals: [
      "讓 Year 1 畫上一個句號",
      "規劃語文考試／補底（如需要）",
      "累積實務經驗與履歷"
    ],
    actions: [
      "可以先休息一至兩星期，調整狀態",
      "考慮返暑期工或實習，累積工作／職場經驗",
      "參與義工活動，為日後 Personal Statement 增加素材",
      "就 DSE 語文不足的同學，考慮報名 IELTS / IGCSE 等（視乎日後心儀課程要求）",
      "部分院校提供 Summer Sem：可用作重讀追分，或預先修讀下一學年科目",
      "如果就讀課程包含實習要求（例如社工／教育），需預先了解實習時間及要求"
    ],
    risks: [
      "暑假完全空過，沒有任何與未來升學／工作相關的累積",
      "過遲處理語文資格問題，導致將來 Non-JUPAS 報名時時間非常緊迫",
      "同時嘗試太多事情（實習、補習、考試），導致身心透支"
    ]
  },
  {
    id: "stage-5",
    stage: "Stage 5",
    timeframe: "9–12 月",
    title: "Year 2 Sem 1",
    subtitle: "Year 2 的申請部署與學業平衡",
    chipLabel: "Year 2 Sem 1",
    color: "text-teal-500",
    icon: "✍️",
    goals: [
      "在維持 GPA 的同時，開始部署 Non-JUPAS 升學",
      "明確自己目標學科與大學",
      "收集及整理所有需要上載的文件"
    ],
    actions: [
      "9 月開始：再次熟讀各科 course outline，保持穩定表現；檢視目前 Cumulative GPA，設定目標",
      "10–11 月：確認心儀課程及 backup 科目；了解各大學入學要求；整理及撰寫 Personal Statement；準備獎項證書；決定邀請哪位 Lecturer 寫推薦信",
      "11 月尾～翌年 1 月：留意 Non-JUPAS 報名系統開放時間；採取「大包圍」策略；一有機會就先提交現有成績；主動跟進 Transcript 發放"
    ],
    risks: [
      "只專注於申請，忽略當下學科，導致 Year 2 Sem 1 成績下跌",
      "太遲開始撰寫 Personal Statement，臨近截止日才倉促完成",
      "完全沒有 backup 科目，只報一個「夢想科」，增加整體風險",
      "不清楚各大學的 Deadline，以為「之後再填都仲有位」"
    ]
  },
  {
    id: "stage-6",
    stage: "Stage 6",
    timeframe: "1 月",
    title: "Year 2 Sem Break",
    subtitle: "面試前的準備與調整",
    chipLabel: "Interview Prep",
    color: "text-cyan-500",
    icon: "📧",
    goals: [
      "回顧 Year 2 Sem 1 成績與申請進度",
      "準備可能出現的 Interview",
      "在休息與準備之間取得平衡"
    ],
    actions: [
      "檢視 Year 2 Sem 1 的正式 GPA，估算整體 Cumulative GPA",
      "確認自己已完成或即將完成的 Non-JUPAS 申請步驟，補齊任何漏交文件",
      "如果收到面試邀請：整理常見面試問題與自己要點；回顧過往實習／活動經驗",
      "如有需要，可繼續返短期實習或兼職，但要預留時間應付面試及下學期課程"
    ],
    risks: [
      "Sem Break 完全不理申請進度，Email 不常檢查，錯過面試通知",
      "過度工作或兼職，令身心狀態不利於之後應付最後一個學期",
      "沒有整理任何面試要點，臨場只作即興發揮"
    ]
  },
  {
    id: "stage-7",
    stage: "Stage 7",
    timeframe: "2–8 月",
    title: "Year 2 Sem 2 ＋ 畢業前後",
    subtitle: "最後衝刺、面試與 Offer",
    chipLabel: "Offer & Grad",
    color: "text-blue-500",
    icon: "🎓",
    goals: [
      "在最後一個學期維持或提升 GPA，滿足 Conditional Offer 要求",
      "認真準備各大學面試",
      "完成畢業及入讀大學前的所有手續"
    ],
    actions: [
      "2–4 月：正常應付學科、assignment、midterm；若收到面試邀請，預先準備及模擬練習",
      "4–6 月：陸續收到 Offer；評估能否達到 Conditional 要求；按指示繳交留位費；繼續穩定完成最後一個學期的 assessment",
      "6 月左右：完成最後考試，處理畢業相關手續；準備大學註冊文件",
      "6–8 月：留意電郵及院校系統任何更新；準備大學開學前事宜"
    ],
    risks: [
      "收到 Conditional Offer 後鬆懈，最後 Sem 成績未達要求",
      "忘記於期限內繳交留位費或完成文件驗證程序",
      "因一時失利而過早放棄，未等候候補機會",
      "畢業及入學文件處理不當，導致註冊程序延誤"
    ]
  }
];

// --- Mindset Data ---

export const MINDSET: MindsetItem[] = [
  {
    title: "選 Groupmates 原則",
    icon: "👥",
    color: "text-blue-500",
    summary: "技能互補但態度可靠比「技術強」更重要。",
    details: (
      <p>觀察出席率與交付紀律。一個肯學肯做嘅普通人，好過一個成日失蹤嘅天才。主動約出來傾計，試探下大家對 Grade 嘅期望係咪一致。</p>
    )
  },
  {
    title: "Ocamp / 社團 / 兼職",
    icon: "⚡",
    color: "text-yellow-500",
    summary: "量力而為，GPA 先係主菜。",
    details: (
      <p>上莊 / 參加活動係好，可以識人同減壓，但切記唔好本末倒置。Asso 只有兩年，GPA 跌咗好難追。兼職最好搵同你讀嗰科有關嘅，或者時間彈性嘅。</p>
    )
  },
  {
    title: "面對壓力",
    icon: "❤️",
    color: "text-pink-500",
    summary: "分解任務，接受「短期辛苦」。",
    details: (
      <p>分解任務、保持 Weekly Review。接受「短期辛苦是為了後續選擇」。當你覺得好攰嗰陣，諗下你入 U 嗰一刻嘅畫面。搵朋友傾訴，唔好鬱埋喺心。</p>
    )
  },
  {
    title: "DSE 失利之後",
    icon: "🏆",
    color: "text-purple-500",
    summary: "你唔係輸咗，只係換條路行。",
    details: (
      <p>DSE 只係一場考試，唔代表你嘅人生。Asso 係一個 Second Chance。好多人經 Asso 入返 U，甚至讀得比 DSE 直入嘅同學更好，因為佢哋更珍惜機會。</p>
    )
  }
];
