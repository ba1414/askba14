export interface CourseSection {
  title: string;
  content: string; // Markdown content
}

export interface CourseModule {
  id: string;
  title: string;
  sections: CourseSection[];
}

export const IELTS_COURSE: CourseModule[] = [
  {
    id: "intro",
    title: "Course Architecture 課程架構",
    sections: [
      {
        title: "Course Architecture Overview",
        content: `
### FOUNDATION TIER (必修基礎層)
Core concepts applicable to both Task 1 and Task 2
*   Formal logic & fallacies
*   Discourse architecture (Theme-Rheme, cohesion)
*   Syntactic sophistication
*   Lexical precision

### TASK 1 TIER (任務一專層)
Complete system for visual data description
*   Each Band 9 criterion taught systematically
*   Multiple chart types with worked examples
*   5 complete model answers analyzed

### TASK 2 TIER (任務二專層)
Complete system for argumentative essays
*   Each Band 9 criterion taught systematically
*   All question types with frameworks
*   5 complete model answers analyzed

### MASTERY TIER (精通層)
Advanced techniques and self-editing
*   Common pitfalls and corrections
*   Self-assessment rubrics
*   Practice protocols
`
      }
    ]
  },
  {
    id: "part-a",
    title: "PART A: FOUNDATION TIER (必修基礎層)",
    sections: [
      {
        title: "CHAPTER 1: Formal Logic & Critical Thinking 形式邏輯與批判思維",
        content: `
### Why Logic Matters for IELTS Band 9
Band 9 descriptor: "Ideas are relevant, fully extended and well supported"
"Well supported" = logically valid reasoning. Examiners at Band 9 can detect:
*   Hidden premises (unstated assumptions)
*   Logical fallacies (invalid reasoning)
*   Insufficient evidence
*   Overgeneralization

**廣東話:** Band 9 要求你嘅論證「有力支撐」，即係邏輯必須有效。考官識分辨你有冇邏輯漏洞。

### 1.1 Deductive Validity 演繹有效性
**Definition 定義:** An argument is deductively valid if and only if: When all premises are true, the conclusion must be true.

**Structure 結構:**
\`\`\`
Premise 1: All humans are mortal.
Premise 2: Socrates is human.
───────────────────────────────
Conclusion: Therefore, Socrates is mortal. ✅ VALID
\`\`\`

**Testing Validity: The Counterexample Method 測試有效性：反例法**
1. Assume all premises are true
2. Try to imagine a scenario where the conclusion is false
3. If you can, the argument is INVALID

**Example (Invalid Argument):**
\`\`\`
Premise 1: Most wealthy people are happy.
Premise 2: John is wealthy.
───────────────────────────────
Conclusion: Therefore, John is happy. ❌ INVALID
Counterexample: John could be in the minority of wealthy people who are unhappy.
\`\`\`

**廣東話:** 有效論證 = 如果前提真，結論必定真。測試方法：諗吓有冇可能前提真但結論假？如果有，就係 invalid。

### 1.2 Hidden Premises (Enthymemes) 隱藏前提
**What Are They? 什麼是隱藏前提？**
Most everyday arguments omit premises that are assumed to be obvious. In IELTS Band 9, you must:
1. Identify hidden premises
2. Evaluate whether they're reasonable
3. State them explicitly if they're controversial

**Example Analysis 範例分析**
**Band 7 Argument (Weak):**
"Governments should fund the arts because culture is important."

**Logical Structure:**
*   Premise 1 (explicit): Culture is important.
*   Premise 2 (hidden): Governments should fund all important things.
*   Conclusion: Governments should fund the arts.

**Problem with Premise 2:**
Individual liberty is important, but governments shouldn't "fund" it directly. Health is important, but governments don't fund ALL healthcare universally. So Premise 2 is too broad and thus questionable.

**Band 9 Reconstruction:**
"While cultural vitality is indisputably important for social cohesion, the inference that governments should fund the arts requires an additional premise: that the arts constitute a public good exhibiting positive externalities and market failures justifying state intervention. Empirical evidence supports this—arts programs in underserved communities correlate with reduced crime (0.3 SD effect size) and enhanced educational outcomes. However, this justification is contingent upon demonstrating that private patronage alone is insufficient, a condition that varies by context."

**What Changed:**
✅ Hidden premise made explicit: "arts = public good"
✅ Provided evidence: "0.3 SD effect size"
✅ Qualified the claim: "contingent upon"
✅ Acknowledged contextual variation

**廣東話:** 大部分論證都有隱藏前提。Band 9 要求你：(1) 搵出隱藏前提，(2) 評估佢合唔合理，(3) 如果有爭議，就明講出嚟。

### 1.3 Common Logical Fallacies 常見邏輯謬誤
**1.3.1 Affirming the Consequent 肯定後件**
**Logical Form:**
\`If P, then Q. Q is true. ∴ P is true. ❌ INVALID\`
Why Invalid: Q could be true for other reasons.

**IELTS Example:**
"Countries with high literacy rates tend to be prosperous. Finland is prosperous. Therefore, Finland's prosperity is due to high literacy."
*Problem:* Finland's prosperity could stem from natural resources, stability, or trade.

**Band 9 Correction:**
"While high literacy correlates with economic prosperity—and Finland exhibits both—the causal arrow remains ambiguous. Prosperity could enable investment in education rather than result from it, or both could be joint effects of a third variable (e.g., strong institutions). Cross-national regression analyses suggest literacy explains approximately 30% of variance in GDP per capita, indicating it is one contributory factor among several."

**Key Language:**
*   "Correlates with" (not "causes")
*   "Causal arrow remains ambiguous"
*   "Could enable... rather than result from"
*   "One contributory factor among several"

**廣東話:** 肯定後件 = 見到結果就推論原因，但結果可能有其他原因。Band 9 要用 "correlates with" 而唔係 "causes"，仲要講清楚因果方向可能相反。

**1.3.2 False Dilemma (False Binary) 虛假二分**
**Definition:** Presenting only two options when more exist.
**IELTS Example:** "Either we ban junk food completely, or we accept rising obesity rates."
**Problem:** Ignores taxation, regulation, education, zoning.

**Band 9 Correction:**
"The debate need not be framed as a binary choice between prohibition and laissez-faire. Rather, a spectrum of graduated interventions exists: 'nudge' policies (e.g., default healthy options), Pigouvian taxes (sugar levies that internalize health externalities), informational mandates (calorie labeling), and zoning restrictions. Evidence suggests that multi-pronged approaches combining modest taxation with education yield greater behavioral change (15% reduction in consumption) than either measure alone."

**Key Language:** "Need not be framed as binary", "Spectrum of graduated interventions", "Multi-pronged approaches".

**廣東話:** 虛假二分 = 將問題講到得兩個選擇，但其實有好多中間方案。Band 9 要用 "spectrum of interventions" 或 "graduated approaches"。

**1.3.3 Composition Fallacy 合成謬誤**
**Definition:** What's true of parts is true of the whole.
**IELTS Example:** "Each musician in the orchestra is excellent. Therefore, the orchestra is excellent."
**Problem:** Ignores coordination and chemistry.

**Band 9 Correction:**
"While individual virtuosity is necessary for ensemble excellence, it is not sufficient. Orchestral quality is an emergent property arising from coordination dynamics—synchronization of rhythmic patterns, blend of timbres, and interpretive coherence—that transcend individual skill. This explains why ad hoc assemblies of soloists often underperform established ensembles despite superior average talent: the latter possess accumulated tacit knowledge about how to play together."

**Key Language:** "Necessary but not sufficient", "Emergent property", "Transcend individual skill".

**廣東話:** 合成謬誤 = 部分嘅特質唔等於整體嘅特質。Band 9 要用 "necessary but not sufficient" 同埋 "emergent property"（湧現特性）。

**1.3.4 Base Rate Neglect 基率忽略**
**Definition:** Ignoring prior probabilities when assessing conditional probabilities.
**IELTS Example:** "Drug tests are 95% accurate. An athlete tests positive. Therefore, there's a 95% chance they used drugs."
**Problem:** Assuming 1% prevalence, posterior probability is only ~16% due to false positives in low-prevalence populations.

**Band 9 Correction:**
"While the test's sensitivity (true positive rate) is 95%, the posterior probability of drug use given a positive result depends critically on the base rate. Assuming 1% prevalence, Bayes' Theorem yields a posterior probability of approximately 16%—far below the test's sensitivity. This counter-intuitive result stems from the fact that in low-prevalence populations, even highly accurate tests generate substantial false positive rates. Consequently, positive results require confirmatory testing before sanctions are imposed."

**廣東話:** 基率忽略 = 唔理「呢件事幾常見」就推論機率。用 Bayes' Theorem 計出嚟先啱。

**1.3.5 Hasty Generalization 草率概括**
**Definition:** Drawing broad conclusions from insufficient evidence.
**IELTS Example:** "My friend studied abroad and got a great job. Therefore, studying abroad leads to career success."

**Band 9 Correction:**
"While anecdotal evidence suggests studying abroad can enhance career prospects, individual cases are insufficient to establish a causal relationship. Systematic evidence paints a more nuanced picture: longitudinal studies show that study abroad participants exhibit modestly higher employment rates (5–8 percentage points) and starting salaries (7% premium), but these effects diminish after controlling for self-selection—students who study abroad often possess higher pre-existing motivation and socioeconomic resources. Thus, the net causal effect is likely smaller than raw correlations suggest."

**廣東話:** 草率概括 = 用少量例子就推論全部。Band 9 要用 "systematic evidence" 而唔係 "my friend"，仲要講 "controlling for confounders"。

### 1.4 Necessary vs Sufficient Conditions 必要與充分條件
**Definitions 定義**
*   **Necessary Condition (必要條件):** X is necessary for Y means: Without X, no Y. (¬X → ¬Y)
*   **Sufficient Condition (充分條件):** X is sufficient for Y means: X guarantees Y. (X → Y)

**Examples 範例**
*   **Oxygen and Fire:** Oxygen is necessary (no oxygen → no fire), but not sufficient (oxygen alone doesn't guarantee fire; need fuel).
*   **University Degree and Success:** Degree is not necessary (Steve Jobs), nor sufficient (unemployed graduates).

**Band 9 Application:**
"University education is neither necessary nor sufficient for career success. It is not necessary, as evidenced by high-achieving entrepreneurs who succeeded without degrees. Nor is it sufficient—many graduates face underemployment, particularly in over-saturated fields. Rather, higher education is facilitative: it increases the probability of favorable outcomes (e.g., 60% higher lifetime earnings) without guaranteeing them. Thus, educational attainment is best conceptualized as one probabilistic factor among multiple determinants—including social capital, cognitive ability, and labor market conditions."

**Key Language:** "Neither necessary nor sufficient", "Facilitative", "Increases the probability", "One probabilistic factor among multiple determinants".
`
      },
      {
        title: "CHAPTER 2: Discourse Architecture & Cohesion 語篇結構與銜接",
        content: `
### Why Discourse Matters for Band 9
Band 9 descriptor: "The message can be followed effortlessly. Cohesion is used in such a way that it very rarely attracts attention."

### 2.1 Information Structure: Theme-Rheme Theory 信息結構：主位述位理論
**Theoretical Foundation 理論基礎**
*   **Theme (主位):** The starting point of a clause—what the sentence is "about" (given info).
*   **Rheme (述位):** What is said about the Theme—the new information.
**Principle:** Place given/known information in Theme position, new information in Rheme position.

**2.1.1 Theme-Rheme Progression Patterns 主位述位推進模式**
**Pattern 1: Linear Progression (線性推進)**
Each Rheme becomes the next Theme:
S1: Climate change [poses a threat].
                       ↓
S2: [This threat] demands action.
                       ↓
S3: [Such action] requires investment.

**Band 9 (Linear progression):**
"Climate change poses an existential threat to coastal populations. This threat manifests primarily through sea-level rise, which is projected to displace 200 million people by 2100. Such displacement would trigger mass migration, straining host nations' infrastructure and potentially precipitating geopolitical instability. Preventing this scenario requires immediate and substantial reductions in greenhouse gas emissions."

**廣東話:** 線性推進 = 上一句嘅 Rheme 變下一句嘅 Theme。呢種模式令讀者「effortlessly」跟到你嘅思路。

**Pattern 2: Constant Theme Progression (恒定主位推進)**
Same Theme across multiple sentences (for detailed description):
S1: [Country A] increased by 50%.
S2: [Country A] had the highest GDP.
S3: [Country A] maintained steady growth.

**2.1.2 Cohesion Gaps & How to Fix Them 銜接斷裂及修復方法**
**Band 7 Example (Multiple gaps):**
"Remote work increased during COVID-19. Many companies adopted Zoom. Productivity metrics varied. Mental health concerns emerged."

**Band 9 Correction (No gaps):**
"Remote work surged during COVID-19, with **this shift** compelling employers to adopt videoconferencing platforms such as Zoom. **These new modalities** generated mixed productivity outcomes: while some workers reported efficiency gains, others experienced coordination difficulties. Moreover, **the isolation inherent in remote work** precipitated mental health concerns, particularly among employees lacking dedicated home office spaces. **Such heterogeneous effects** suggest that remote work's viability is contingent on individual and organizational contexts."

**廣東話:** Cohesion gap = 句子之間冇明確連接。修復方法：用 "this shift", "these modalities", "such effects" 指返前面嘅內容。

### 2.2 Cohesion Devices 銜接手段
**2.2.1 Reference (Pronouns & Demonstratives) 指稱**
**Band 9 Correction:** "When governments and corporations collaborate on infrastructure, both parties typically benefit, though **the latter** often capture disproportionate returns through preferential contracts."

**2.2.2 Lexical Cohesion (Synonym Chains) 詞彙銜接**
**Principle:** Avoid repetition by using near-synonyms and superordinate terms.
**Band 7:** "Education is important. Education helps people. Education improves society..."
**Band 9:** "Education is indispensable for societal flourishing. **Such learning** equips individuals with cognitive capacities... while **these competencies** enhance both employability and civic engagement. Consequently, **educational investment** constitutes a high-return public expenditure."

**2.2.3 Logical Connectors (但也唔好濫用) 邏輯連接詞**
**Band 9 (Sparse, natural):**
"Education serves multiple societal functions. **Beyond** its intrinsic value, it enhances employability, fosters civic participation, and—**perhaps most surprisingly**—correlates with reduced criminality. **Given** these multifaceted benefits, educational investment constitutes sound public policy."

**Natural Connectors:**
*   Contrast: Nevertheless, Conversely, By contrast, In contrast
*   Addition: Moreover, Furthermore, Additionally (avoid "Also")
*   Causation: Consequently, Thus, Hence, Therefore
*   Illustration: For instance, Specifically, In particular

### 2.3 Semantic Drift & Conceptual Precision 語義漂移與概念精確性
**Definition:** When a term's meaning shifts imperceptibly, creating inconsistencies.
**Band 9 Correction (Conceptually precise):**
"**Enterprise technology**—automation systems, data analytics platforms—demonstrably enhances organizational productivity by streamlining workflows. In contrast, **consumer technology in educational settings**—particularly social media and entertainment apps—often fragments attention and displaces cognitively demanding tasks. **These divergent outcomes** reflect differences in deployment context: enterprise systems are task-aligned and access-controlled, whereas classroom devices frequently permit unrestricted browsing. Thus, the appropriate policy is context-sensitive implementation rather than wholesale adoption or rejection."

**廣東話:** Semantic drift = 同一個詞喺唔同句子指唔同嘢。修復方法：specify 每次用呢個詞嘅時候係指咩（enterprise tech vs consumer tech）。

### 2.4 Presupposition & Pragmatic Implicature 預設與語用含義
**2.4.1 Presupposition 預設**
**Strategic Use in IELTS:**
"Critics **rightly acknowledge** that universal basic income poses implementation challenges, **yet deny** that these challenges are insurmountable."
*Effect:* "Rightly acknowledge" presupposes the challenges are real (sounds fair-minded), then you counter their conclusion.

**2.4.2 Scalar Implicature 級差含義**
**Example:** "Many developing nations have achieved substantial literacy gains, though progress remains uneven across regions."
*Effect:* "**Many**" (not "most" or "all") signals some haven't. "**Uneven**" acknowledges heterogeneity.
`
      },
      {
        title: "CHAPTER 3: Grammatical Range & Accuracy 語法範圍與準確度",
        content: `
### 3.1 Sentence Variety: The Complexity Paradox 句子變化：複雜度悖論
**The Paradox 悖論:** Band 9 = strategic mix of simple and complex sentences. Not every sentence must be complex.
**Band 9 (Varied rhythm):**
"Governments face severe fiscal constraints, stemming from competing budgetary priorities. Nevertheless, education remains paramount. Evidence suggests that strategic investment—targeting teacher quality, curriculum reform, and infrastructure—can yield substantial returns. Such investment need not be prohibitive. Cross-national analyses indicate that efficiency gains from administrative streamlining often exceed the marginal costs of enhanced provision."
*Pattern:* Complex → Simple → Complex → Simple → Complex

**廣東話:** Band 9 唔係每句都複雜。應該 alternate：complex → simple → complex。呢種 rhythm 令讀者唔會 overload。

### 3.2 Non-Finite Clauses (Information Compression) 非限定分句
**3.2.1 Participle Clauses (壓縮因果/時間)**
**Band 7:** "She submitted the report. She hoped it would be approved."
**Band 9:** "She submitted the report, **hoping** it would be approved."

**More Advanced Example:**
**Band 9:** "**Following the policy's cross-sectoral implementation**, unemployment rates declined, **surprising analysts** who had predicted job losses."
*   "Following..." compresses two finite clauses.
*   "Surprising analysts..." compresses "This surprised analysts".

**3.2.2 Infinitive of Purpose (表示目的)**
**Band 9:** "**To reduce emissions**, governments should implement carbon taxes."

### 3.3 Cleft Sentences (強調與對比) 分裂句
**3.3.1 It-Cleft (強調某一成分)**
**Structure:** It + be + focused element + that/who + remainder
**Band 9:** "It is **systemic inequality**, not **individual deficits**, that explains persistent poverty."
*Effect:* Moves "systemic inequality" to focus position and explicitly contrasts it.

**3.3.2 Wh-Cleft (Pseudo-Cleft) (強調謂語)**
**Structure:** What/Where/When + clause + be + focused element
**Band 9:** "**What governments must prioritize is renewable energy investment**, not incremental fossil fuel efficiency improvements."

### 3.4 Conditional Sentences (假設推理) 條件句
**3.4.1 Standard Conditionals**
Type 1 (Real), Type 2 (Unreal present), Type 3 (Unreal past).

**3.4.2 Inverted Conditionals (更正式) 倒裝條件句**
**Standard:** "If governments were to eliminate subsidies..."
**Band 9 (Inverted):** "**Were governments to eliminate subsidies**, renewables would become competitive."
**Examples:** "Should this policy fail...", "Had policymakers acted earlier..."

**廣東話:** Inverted conditionals 比普通 conditionals 更 formal。Band 9 會用 "Were X to...", "Should X...", "Had X..."。

### 3.5 Mandative Subjunctive (正式建議) 命令式虛擬語氣
**Structure:** Verb (recommend, suggest, propose, insist, demand, require) + that + subject + **BASE FORM**
**Band 9 Application:**
"To mitigate climate change, I propose that governments **implement** carbon pricing, **phase out** fossil fuel subsidies, and **mandate** renewable energy targets—measures that collectively constitute a coherent policy framework."
*Note:* Use "implement", NOT "implements".

### 3.6 Relative Clauses (整合信息) 關係從句
**Defining vs Non-Defining:**
*   Defining: "Countries that exhibited double-digit growth..."
*   Non-Defining: "Country C, which started from a base of $50 billion, ..."
**Reduced Relative Clauses:**
*   "The trend **observed** in high-income nations contrasts with that **seen** in developing countries."
`
      },
      {
        title: "CHAPTER 4: Lexical Resource 詞彙資源",
        content: `
### 4.1 Academic Verb Precision 學術動詞精確性
**Principle:** Avoid vague general verbs. Use precise academic alternatives.

| Vague (Band 7) | Academic Precision (Band 9) | Example Sentence |
| :--- | :--- | :--- |
| **make** | precipitate, engender, foster, catalyze | "Poverty precipitates social instability." |
| **reduce** | mitigate, attenuate, diminish, erode, curtail | "Education mitigates inequality." |
| **increase** | augment, amplify, enhance, bolster, intensify | "Technology augments productivity." |
| **show** | demonstrate, establish, evince, corroborate | "Data demonstrate a correlation." |
| **affect** | influence, shape, modulate, condition | "Policy shapes outcomes." |
| **help** | facilitate, enable, expedite, promote | "Infrastructure facilitates trade." |
| **stop** | impede, constrain, inhibit, preclude, forestall | "Regulation precludes exploitation." |
| **keep** | sustain, preserve, perpetuate, uphold | "Institutions sustain norms." |
| **cause** | precipitate, engender, induce, trigger | "Unemployment precipitates social unrest." |
| **get** | obtain, acquire, secure, procure, attain | "Citizens secure access to healthcare." |

**Band 9 Sentence:**
"Educational disparities **engender** intergenerational poverty, which in turn **perpetuates** inequality—a vicious cycle that can only be disrupted through targeted interventions designed to **enhance** access while ensuring quality."

### 4.2 Nominalization (名詞化提升語域)
**Principle:** Convert verbs/adjectives → nouns for formal register.
*   reduce → reduction, grow → growth, fail → failure, feasible → feasibility.
**Balanced Example:** "When the government implemented the policy, outcomes improved." (Agency clear).

### 4.3 Collocations (自然搭配詞)
**Definition:** Words that naturally go together.
| Topic | Band 7 (Unnatural) | Band 9 (Natural Collocation) |
| :--- | :--- | :--- |
| **Economy** | "make economic growth" | "foster / spur / stimulate economic growth" |
| **Policy** | "do a policy" | "implement / enact / formulate a policy" |
| **Problem** | "solve the problem" | "address / tackle / resolve the issue" |
| **Evidence** | "give evidence" | "provide / present / marshal evidence" |
| **Effect** | "have an effect" | "exert / yield / produce an effect" |

**Band 9 Sentence:**
"To **tackle this pressing issue**, governments must **implement comprehensive policies** that **address root causes** rather than merely treating symptoms. Mounting evidence suggests that such holistic approaches **exert lasting effects**."

### 4.4 Hedging (Academic Caution) 學術謹慎語
**Principle:** Strong claims require strong evidence.
**Hedging Devices:**
*   Modal verbs: may, might, could
*   Adverbs: possibly, probably, arguably
*   Verbs: suggest, indicate, appear, seem
**Band 9 Example:**
"AI is **likely** to automate routine cognitive tasks, though the net employment effect **remains contested**, with some models predicting displacement and others highlighting complementarity effects."

### 4.5 Avoiding Repetition (Lexical Variation) 避免重複
**Techniques:** Synonyms, Superordinates (cars → vehicles), Pronouns, Paraphrase.
**Lexical Chain Example:**
Education → such learning → these attributes → educational investment.
`
      }
    ]
  },
  {
    id: "part-b",
    title: "PART B: TASK 1 TIER (任務一專層)",
    sections: [
      {
        title: "CHAPTER 5: Task 1 Foundations 任務一基礎",
        content: `
### 5.1 Understanding the Task 理解任務
*   **Time:** 20 minutes
*   **Word count:** 150+ words (aim for 170–190)
*   **Task type:** Describe visual data (charts, graphs, tables, diagrams, maps)
*   **Your Job:** Identify and describe key features, make relevant comparisons, provide an analytical overview. Do NOT give opinions or explain causes.

### 5.2 Band 9 Task Achievement Criteria (Task 1)
**Official Descriptor:** "All the requirements of the task are fully and appropriately satisfied. There may be extremely rare lapses in content."
*   ✅ All categories/entities covered (no omissions)
*   ✅ Key features selected (highest, lowest, major trends, outliers)
*   ✅ Overview present (2–3 sentence summary of main patterns)
*   ✅ Relevant comparisons made
*   ✅ Appropriate level of detail

### 5.3 Task 1 Structure (Standard 4-Paragraph Format)
1.  **Paragraph 1: Overview (40–50 words):** Paraphrase question, 2–3 sentences identifying main patterns. NO specific data.
2.  **Paragraph 2: First Major Feature (50–60 words):** Describe first key pattern with data support. Make comparisons.
3.  **Paragraph 3: Second Major Feature (50–60 words):** Describe second key pattern with data support. Make comparisons.
4.  **Paragraph 4 (Optional):** Third major feature or outliers.
`
      },
      {
        title: "CHAPTER 6: Task 1 Overview (The Most Important Paragraph)",
        content: `
### 6.1 What Is an Analytical Overview?
**NOT a summary** (listing all data points). **IS an analysis** (identifying 2–3 dominant patterns).

**Band 9 Overview (Analytical):**
"The data reveal **divergent trajectories** across five economies, with advanced nations exhibiting **decelerating growth** consistent with diminishing marginal returns, while emerging economies demonstrate **accelerated expansion** characteristic of convergence dynamics. Notably, absolute gaps widened despite proportional convergence, suggesting scale effects in economic development."

**Key Principles:**
1.  Identify 2–3 dominant patterns (divergence, dominance, convergence)
2.  Group entities conceptually (high vs low performance)
3.  Avoid specific numbers in overview
4.  Use theoretical language where appropriate

### 6.2 How to Write an Analytical Overview (Step-by-Step)
**Step 1:** Look at the chart (Biggest difference? Overall trend? Distinct groups? Outliers?)
**Step 2:** Group entities conceptually (By performance, trend, region, volatility).
**Step 3:** Write 2–3 sentences.

### 6.3 Overview Templates
**Divergence:** "The data reveal divergent patterns across [categories], with [Group A] exhibiting [Pattern X] while [Group B] demonstrates [Pattern Y]."
**Dominance:** "[Category X] exhibited overwhelming dominance, accounting for [proportion], whereas [other categories] represented marginal shares."
**Convergence:** "Despite initial disparities, [categories] exhibited progressive convergence over the period, with gaps narrowing from [initial difference] to [final difference]."
**Volatility:** "[Category X] demonstrated remarkable stability throughout, contrasting sharply with [Category Y]'s pronounced volatility characterized by [description]."
`
      },
      {
        title: "CHAPTER 7: Task 1 Data Description Techniques",
        content: `
### 7.1 Precise Trend Verbs (30+ Options)
**Principle:** "Increase" and "decrease" are vague. Use intensity-specific verbs.

**UPWARD MOVEMENT**
*   **Dramatic:** surge, soar, skyrocket, rocket, leap, jump sharply
*   **Strong:** climb, rise sharply, accelerate
*   **Moderate:** increase, grow, advance, expand
*   **Minimal:** inch up, creep up, nudge higher

**DOWNWARD MOVEMENT**
*   **Dramatic:** plummet, plunge, collapse, nosedive
*   **Strong:** decline sharply, fall steeply, drop significantly, contract
*   **Moderate:** decrease, decline, drop, dip
*   **Minimal:** edge down, slip, ease slightly

**STABILITY & FLUCTUATION**
*   **Stable:** remain steady, plateau, level off, stabilize, flatline
*   **Volatile:** fluctuate, oscillate, vary, swing
*   **Peak/Trough:** peak, bottom out

**Band 9 Application:**
"Export volumes **surged** 40% between 2015 and 2018, then **plateaued** for two years before **edging down modestly** in 2020—a trajectory suggesting initial expansion, subsequent market saturation, and mild pandemic-induced contraction."

### 7.2 Comparative Structures
**Band 9 Structures:**
*   "Country A **exceeds** Country B by 50%."
*   "Country A **outpaces** Country B in both absolute and proportional terms."
*   "Country A's GDP is **three times that of** Country B."
*   "Country G registered the **steepest decline**, contracting by more than 20%—**far exceeding** the average contraction of 8%."

### 7.3 Proportional vs Absolute Reasoning (Critical for Band 9)
**Band 9 (Dual Analysis):**
"In **absolute terms**, Country A's GDP expansion ($1 trillion) dwarfed Country B's ($100 billion) tenfold. However, **proportionally**, Country B exhibited a 100% growth rate—double that of Country A's 50%—indicating more dynamic expansion relative to baseline. This **proportional-absolute divergence** likely reflects conditional convergence..."

### 7.4 Hedged Causal Speculation
**Principle:** Task 1 = descriptive, NOT explanatory. But hedged speculation is acceptable.
**Band 9:** "Country X's GDP growth **may be partially attributable to** fiscal stimulus... The temporal coincidence is **suggestive but not conclusive**."

### 7.5 Strategic Data Selection
**Strategy:** Select meaningful data points (start/end, extremes). Don't list everything.
**Band 9:** "Country A maintained consistently elevated levels (80→95 over the decade), while Countries C and D—starting from lower baselines (50 and 45 respectively)—experienced steeper proportional gains... Country E, by contrast, inched up marginally..."
`
      },
      {
        title: "CHAPTER 8: Task 1 Chart Types & Strategies",
        content: `
### 8.1 Line Graph (趨勢圖)
**Focus:** Trends over time.
**Key Features:** Overall trend, Highest/lowest, Steepest change, Crossover points, Outliers.

### 8.2 Bar Chart (柱狀圖)
**Focus:** Comparisons between categories.
**Key Features:** Highest/lowest values, Clusters, Outliers, Patterns (developed vs developing).

### 8.3 Pie Chart (餅圖)
**Focus:** Proportions of a whole.
**Proportion Language:**
*   Over half = majority
*   Nearly half = plurality (40–50%)
*   One-third = ~33%
*   One-quarter = ~25%
*   Marginal share = 5–10%
*   Negligible share = <5%

### 8.4 Table (表格)
**Focus:** Multiple dimensions.
**Strategy:** Identify rows/columns with most variation. Make cross-category comparisons.

### 8.5 Process Diagram / Map (流程圖/地圖)
**Process:** Stages, Sequence, Inputs/Outputs.
**Map:** What disappeared, appeared, changed.
`
      },
      {
        title: "CHAPTER 9: Complete Task 1 Model Answer with Full Analysis",
        content: `
### Data: Mixed Chart (Pie Chart + Table)
**Pie Chart:** Anthropology graduates' destinations (Full-time 52%, Part-time 15%, Unemployed 12%, etc.)
**Table:** Salaries after 5 years (Freelance/Gov/Private)

### Band 9 Model Answer (193 words)
**[OVERVIEW]**
The data illustrate the occupational trajectories and earnings profiles of anthropology graduates from one institution. Overall, the majority transitioned directly into full-time employment (52%), while postgraduate study—whether full-time or combined with work—remained relatively uncommon (16% combined). Salary outcomes after five years reveal substantial sectoral variation, with freelance consultants and government employees disproportionately represented in higher income brackets, whereas private-sector anthropologists exhibited more dispersed earnings.

**[BODY 1: PIE CHART]**
Regarding initial destinations, over half secured full-time employment (52%), suggesting relatively robust labour-market demand for anthropological skills. In contrast, part-time work accounted for 15%, with an additional 8% combining part-time roles with postgraduate study—a pattern potentially reflecting portfolio career strategies. Notably, full-time postgraduate study attracted only 8%, indicating that advanced training was not the default pathway. Unemployment stood at 12%, while 5% had unknown destinations, likely due to non-response in tracking surveys.

**[BODY 2: TABLE]**
Salary data reveal pronounced earnings hierarchies contingent upon sector. Freelance consultants and government-sector anthropologists clustered heavily in upper brackets: 80% of freelancers and 80% of government workers earned above $75,000, with half of government employees surpassing $100,000. By contrast, private-company anthropologists exhibited a more graduated distribution, with only 55% earning above $75,000. This sectoral divergence likely reflects differential valuation of anthropological expertise, with government and consulting roles commanding premiums due to specialized applications.

### Why This Is Band 9
*   **Task Achievement:** Analyzed patterns (80% in top brackets), not just listed data.
*   **Coherence:** Natural Theme-Rheme progression ("occupational trajectories" → "majority transitioned").
*   **Lexis:** "Disproportionately represented", "Dispersed earnings", "Pronounced hierarchies".
*   **Grammar:** Wide range of structures (Participial phrases, Relative clauses, Comparatives).
`
      }
    ]
  },
  {
    id: "part-c",
    title: "PART C: TASK 2 TIER (任務二專層)",
    sections: [
      {
        title: "MODULE C1: Task Response for Task 2 任務回應",
        content: `
### C1.1 "Appropriately Addressed and Explored in Depth"
**Band 9 (In-depth):**
"While educational attainment correlates robustly with employment outcomes... the inference that governments should universally expand access requires unpacking three assumptions: (1) that labor markets reward credentials..."
**Key:** Unpacking assumptions, addressing counterarguments (steel man), theoretical grounding.

### C1.2 "Clear and Fully Developed Position"
**Band 7 (Vague):** "I partly agree..."
**Band 9 (Precise):** "This essay contends that effort-based messaging yields conditional benefits—contingent upon whether it is paired with structural awareness..."
**Key:** Precise thesis, qualification ("contingent upon"), logical distinction.

### C1.3 "Ideas are Relevant, Fully Extended and Well Supported"
**Structure:**
1.  **Claim** (Topic sentence)
2.  **Explanation** (Mechanism)
3.  **Evidence** (Data/Research)
4.  **Analysis** (Interpretation)
5.  **Link** (Back to thesis)
`
      },
      {
        title: "MODULE C2: Coherence & Cohesion (Task 2) 連貫與銜接",
        content: `
### C2.1 Effortless Message Flow (Theme-Rheme)
**Band 9:** "Remote work offers substantial benefits... This elimination enhances work-life balance... However, such gains must be weighed against..."
(Note: See Foundation Tier Chapter 2 for full Theme-Rheme theory).

### C2.2 Natural Cohesion (Not Mechanical)
**Avoid:** "Firstly, Secondly, Thirdly".
**Use:** "Beyond its intrinsic value...", "Consequently...", "Given these multifaceted benefits...".

### C2.3 Skilful Paragraphing
**Band 9 Structure (Discussion Essay):**
*   **Intro:** Thesis
*   **Body 1:** Steel man Opposing View (Valid points)
*   **Body 2:** Counter with Your View (+ critique of Body 1)
*   **Body 3 (Optional):** Synthesis/Conditions
*   **Conclusion:** Final implication
`
      },
      {
        title: "MODULE C3: Advanced Argumentation 圖爾敏六元素論證",
        content: `
### C3.1 Toulmin Model (Six-Element Argument)
1.  **Claim:** Main point
2.  **Data:** Evidence
3.  **Warrant:** Logic linking Data to Claim
4.  **Backing:** Theory support
5.  **Qualifier:** Scope/conditions
6.  **Rebuttal:** Counterargument

### C3.2 Inference to the Best Explanation (IBE)
**Structure:** Present multiple explanations → Compare → Select best.
**Example:** Digital Divide. Is it cognitive deficits? No. Device access? Partial. Structural barriers? Yes (Best).

### C3.3 Steel Man (Not Straw Man)
**Steel Man:** Strengthen the opposing view ("Critics advance a sophisticated concern...").
**Counter:** Then refute the strongest version ("Nevertheless, this critique overlooks...").

### C3.4 (moved to Foundation Tier Ch 1.4) Necessary vs Sufficient Conditions 
(See Foundation Tier Ch 1.4)

### C3.5 Causal Reasoning: Avoiding Oversimplification
**Correlation ≠ Causation.**
**Band 9:** "While exercise **correlates robustly** with longevity (r = 0.4), establishing causation requires ruling out **confounding variables**... **selection effects** may account for part of the correlation."
`
      },
      {
         title: "MODULE C4: Complete Task 2 Model Answer 完整範例",
         content: `
### Prompt: "In some cultures, children are often told that they can achieve anything if they try hard enough..."

### Band 9 Model Answer Highlights
**[Introduction]**
"The adage that 'hard work guarantees success' pervades many cultural contexts... This essay contends that the advantages... are conditional—contingent upon whether it is accompanied by realistic assessments..."

**[Body 1: Advantages]**
"...foster intrinsic motivation... 'growth mindset' correlates with improved academic performance... However, this benefit presupposes that effort genuinely translates into outcomes..."

**[Body 2: Disadvantages]**
"Conversely, this messaging harbours significant risks... For children from disadvantaged backgrounds... such messaging can engender corrosive self-blame... 'effort equals success' narrative can foster intolerance of failure..."

**[Conclusion]**
"...advantages... are not intrinsic but contingent upon contextual factors... A sophisticated approach pairs the psychological empowerment... with critical literacy about societal constraints..."
`
      },
      {
         title: "MODULE C5: Task 2 Question Strategies Specifics",
         content: `
### C5.1 Opinion Essays (Agree/Disagree)
*   Strongly agree/disagree with qualifications.
*   Avoid "partly agree".

### C5.2 Discussion + Opinion
*   Present both views fairly (Steel man) before giving opinion.

### C5.3 Advantages & Disadvantages
*   Evaluation: Which side *outweighs* the other?

### C5.4 Problem-Solution
*   Root causes (structural) → Solutions (feasible).
`
      }
    ]
  },
  {
    id: "part-d",
    title: "PART D: MASTERY TIER (精通層)",
    sections: [
      {
        title: "MODULE D1: Self-Editing Checklist (Band 9) 自我編輯清單",
        content: `
### Task 1 Checklist:
*   [ ] Analytical overview (patterns identified, no specific data)
*   [ ] All categories covered
*   [ ] Proportional + absolute reasoning
*   [ ] Trend verbs meant for intensity (surge vs inch up)
*   [ ] Hedged causal speculation used
*   [ ] Theme-Rheme linkage

### Task 2 Checklist:
*   [ ] Position clear and nuanced (not binary)
*   [ ] Toulmin elements in body paragraphs
*   [ ] Steel man for counterarguments
*   [ ] Necessary vs sufficient distinction
*   [ ] Mandative subjunctive used
*   [ ] Cleft sentences used
*   [ ] Academic verbs (precipitate, mitigate)
`
      }
    ]
  }
];
