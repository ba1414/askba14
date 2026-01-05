export interface AnalysisPoint {
  title: string;
  content: string;
}

export interface EssaySection {
  id: string;
  title: string;
  original: string;
  critique: {
    cantonese: string[];
    logical: string[];
  };
  improvement: {
    rewrite: string;
    patterns?: string;
    flow?: string;
  };
}

export interface IeltsEssay {
  id: string;
  title: string;
  date: string;
  type: 'task1' | 'task2';
  intro: string;
  sections: EssaySection[];
}

export const IELTS_DATA: IeltsEssay[] = [
  {
    id: "task1-essay1",
    title: "Electrical Appliances & Housework (1920-2019)",
    date: "1.5.2026",
    type: "task1",
    intro: "The first line graph delineates the changes of percentage distribution of three types of electrical appliances owned in a nation spanning from the year 1920 to 2019 and the second line graph records the amount of time each household does the chores.",
    sections: [
      {
        id: "s1",
        title: "Introduction - Sentence 1",
        original: "The first line graph delineates the changes of percentage distribution of three types of electrical appliances owned in a nation spanning from the year 1920 to 2019 and the second line graph records the amount of time each household does the chores.",
        critique: {
          cantonese: [
            "「delineates the changes of percentage distribution」過度抽象，又似 Dowden 所講 “saying little with lots of words / being pseudoprecise”——用 technical 字，但 reader 要自行 decode。",
            "一句塞晒兩幅圖，結構太長，違反「寫作要精確同面向讀者」原則。",
            "“does the chores” 冇寫出係 “hours per week spent on housework”。"
          ],
          logical: [
            "Not a classic fallacy, but: Being too vague / pseudoprecise in description.",
            "Giving too many details in one sentence, hurting clarity and “tailoring to your audience”."
          ]
        },
        improvement: {
          rewrite: "The first line graph shows how the proportion of households in a particular country owning washing machines, refrigerators and vacuum cleaners changed between 1920 and 2019, while the second graph shows the number of hours per week each household spent on housework over the same period.",
          patterns: "“The first graph shows how + noun phrase + changed between YEAR and YEAR, while the second graph shows + noun phrase + over the same period.”",
          flow: "Task 1 的 opening 只做 描述圖表範圍，唔分析、唔解釋因果，符合 Dowden 所講「description ≠ explanation ≠ argument」。"
        }
      },
      {
        id: "s2",
        title: "Introduction - Sentence 2",
        original: "Overall, the ownership of the 3 types of electrical appliances was shown increasing in this century, whereby refrigerators and vacuum cleaners have been completely publicised; also, the allocated time for doing housework first plummeted and eventually stabilised over time.",
        critique: {
          cantonese: [
            "“in this century” 同 1920–2019 不完全吻合，時間界線唔精確。",
            "“completely publicised” 不自然，用字錯；應該係 “became almost/universally owned”。",
            "一句同時講 ownership 上升 + 時間下降，兩個 main idea 擠在一起，讀者難一眼抓到 overall trend。",
            "“first plummeted and eventually stabilised” OK，但應先講大方向，再補充形狀。"
          ],
          logical: [
            "Being too vague / too general about time (“this century”).",
            "Minor non sequitur risk：你 implicitly 暗示因果（appliances ↑ → hours ↓），但用 “overall” 段應只 summarise pattern，而唔應偷塞因果。Dowden 會提醒要分開 correlation 同 causation。"
          ]
        },
        improvement: {
          rewrite: "Overall, ownership of all three appliances rose substantially, with refrigerators and vacuum cleaners becoming almost universal, whereas the time spent on housework fell sharply at first and then levelled off.",
          patterns: "“Overall, + noun phrase + rose/fell…, with X and Y …, whereas Z …” 用 “whereas” 做 clear 對比，幫 examiner 即時見到 inverse relationship（升 vs 跌）。",
          flow: "Overview 段只做兩件事：概括 appliances：全部上升，兩樣近乎 100%。概括 hours：先急跌，再趨平。無加 “thanks to” / “because”，避免在冇證據時作因果推論，符合 Dowden 關於「correlation ≠ causation」同「don’t draw stronger conclusions than your evidence supports」。"
        }
      },
      {
        id: "b1",
        title: "Body Paragraph - Sentence 1",
        original: "Examining the percentage distribution of appliance ownership in detail, Refrigerator was the first to achieve full publicised among its counterparts, with a drastic 50%-increase from 1920-1940 and 40% increase in the later two decades until reaching 100% in the 80s, though it was the least popular electrical appliance with less than 10% ownership.",
        critique: {
          cantonese: [
            "“Refrigerator was the first…” 缺冠詞；“full publicised” 用錯字，應該 “fully adopted / reach 100%”.",
            "“drastic 50%-increase” 需要 “a” 同 “increase in the proportion of households owning refrigerators”。",
            "“later two decades” 模糊；唔講清 1940–1960。",
            "“though it was the least popular…” 同前面 “first to reach 100%” 夾硬放一齊，邏輯上跳來跳去。"
          ],
          logical: [
            "Giving too many details in one sentence → 句子太長、太多 clause，違反 Dowden 講的 precision。",
            "小心時間線：開始最唔 popular，但最早 100%；要按時間順序交代清楚。"
          ]
        },
        improvement: {
          rewrite: "Looking first at refrigerators, their ownership climbed from under 10% in 1920 to around 60% by 1940, and then rose more steadily to reach 100% by about 1980, making them the first appliance to become almost universal.",
          patterns: "“Looking first at X, its ownership climbed from A in YEAR to B by YEAR, and then rose more steadily to reach C by YEAR, making it the first …” 先交代起點 → 中段 → 終點，再加 “making it…” 作小總結。",
          flow: "一句只處理一種電器，按時間順序。將 “最少人用” 留番在對比句處理，唔塞死一個句子。"
        }
      },
      {
        id: "b2",
        title: "Body Paragraph - Sentence 2",
        original: "Vacuum cleaners, likewise, started from 30% ownership and experienced a stable increase of 20% for each interval, and eventually reached 100% ownership in the millenium.",
        critique: {
          cantonese: [
            "“likewise” OK，但之前冇寫清 refrigerator pattern 時會有少少含糊。",
            "“a stable increase of 20% for each interval” 太 over-general，如果圖表有某段唔係正 20%，會顯得唔準。",
            "“in the millenium” 應該寫 “by 2000” 或 “by the end of the period”。"
          ],
          logical: [
            "Being too general / pseudoprecise：聲稱 “each interval 20%” 好似數學公式，實際可能唔係。"
          ]
        },
        improvement: {
          rewrite: "Similarly, the proportion of households with vacuum cleaners rose from about 30% at the start of the period to 100% by around 2000, with fairly consistent growth between each recorded year.",
          patterns: "“Similarly, the proportion of households with X rose from about A at the start of the period to B by YEAR, with fairly consistent growth between each recorded year.” “about / around / fairly consistent” 係 IELTS 常用 hedging，避免假精確。",
          flow: "用 “Similarly” 將 vacuum cleaner 連到 refrigerator，保持 parallel 結構。數據 + 形狀（consistent growth），唔落原因。"
        }
      },
      {
        id: "b3",
        title: "Body Paragraph - Sentence 3",
        original: "Washing machine, started with being the most popular item in the 20s with 40% ownership, could not raise its popularity and still hovered around 70% ownership in the year 2019 after a plummet and outperformed, and the disparity was widened by 30% by vacuum cleaner in the 60s and 80s correspondingly.",
        critique: {
          cantonese: [
            "主語要 “The washing machine”.",
            "句子結構散：“could not raise its popularity and still hovered…”",
            "“after a plummet and outperformed” 文法錯。",
            "「差距擴大 30%」應拆開講清楚時間點同方向。"
          ],
          logical: [
            "Being too vague / too compressed：太多 information 壓在一個句，讀者難跟。"
          ]
        },
        improvement: {
          rewrite: "In contrast, washing machines were the most common appliance in 1920, at around 40%, but their ownership grew much more slowly, fluctuating before rising to only about 70% by 2019, so that they lagged well behind vacuum cleaners in the middle and later decades.",
          patterns: "“In contrast, X were the most common … at around A, but their ownership grew much more slowly, fluctuating before rising to only about B by YEAR, so that they lagged well behind Y …” 用 “In contrast” + “lagged well behind” 做對比語。",
          flow: "先給 baseline（最 popular）→ 描述 slow / fluctuating growth → 指出 2019 結果落後其他。你想講 “差距 30%” 可以另外一句具體寫，但唔一定要，Task 1 唔必須報晒每個 gap。"
        }
      },
      {
        id: "c1",
        title: "Conclusion / Last Paragraph",
        original: "Thanks to the raising popularity of electrical appliance automation, the amount of time dedicated to housework has reflected a disproportionate relationship, of which the number of hours spending per household dropped by 30 hours to only 20 hours in 1960s from 1920s, and a relatively slight decrease was witnessed from then on, hovering in between 10 hours to 20 hours per week.",
        critique: {
          cantonese: [
            "“Thanks to…” = 明確因果 claim：家務時間減少係因為電器流行。Task 1 圖只顯示 correlation，呢度屬於 non sequitur / unwarranted causal inference：證據只係共同變化，唔足以支持因果。",
            "“reflected a disproportionate relationship” 非母語式 collocation，又似 Dowden 所講 “saying little with lots of words”。",
            "“dropped by 30 hours to only 20 hours in 1960s from 1920s” 有語法問題，應 “from about 50 to 20 hours per week between 1920 and 1960”。",
            "“hovering in between 10 hours to 20 hours” 介詞應該 “between 10 and 20 hours”。"
          ],
          logical: [
            "Non sequitur / correlation-causation：單靠兩條線反方向走就話 “thanks to …” → 典型 “reasoning error” 類型。"
          ]
        },
        improvement: {
          rewrite: "Turning to the second graph, the average amount of time each household spent on housework fell dramatically from about 50 hours per week in 1920 to around 20 hours by 1960, and then declined more gradually, fluctuating between roughly 10 and 20 hours per week thereafter.",
          patterns: "“Turning to the second graph, the average amount of time each household spent on X fell from about A in YEAR to around B by YEAR, and then declined more gradually, fluctuating between roughly C and D thereafter.” 開頭 “Turning to…” 好常見，幫你清楚轉向第二圖。",
          flow: "句子只描述形狀（dramatically fell → then gradually declined / fluctuated），完全避免因果語 “thanks to / because”。先時間早期大變化 → 之後小變化。"
        }
      }
    ]
  }
];
