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
    id: "m1",
    title: "MODULE 1: Formal Logic & Argumentation Theory 形式邏輯與論證理論",
    sections: [
      {
        title: "1.1 Deductive Validity & Counterexample Construction 演繹有效性與反例構造",
        content: `
### Theoretical Foundation 理論基礎
An argument is deductively valid iff there exists no possible world (consistent with the meanings of terms) in which all premises are true and the conclusion false. For IELTS purposes, approximate validity by:
*   Explicating hidden premises (making enthymemes transparent)
*   Testing for counterexamples via thought experiments
*   Ensuring logical closure of premise sets

**Cantonese 廣東話**
一個論證係「演繹有效」，當且僅當冇任何可能世界（同字詞意義一致）令到所有前提都真但結論假。喺 IELTS 入面，你可以咁做嚟接近有效性：
*   明講隱藏前提（將 enthymeme 變透明）
*   用思想實驗測試有冇反例
*   確保前提集合有邏輯閉包

### Example Analysis 範例分析
**Weak Argument (Band 7):**
"Governments should fund the arts because culture is important."

**Logical Analysis:**
*   Premise 1 (explicit): Culture is important.
*   Premise 2 (hidden): Governments should fund all important things.
*   Conclusion: Governments should fund the arts.
*   **Counterexample (refutes Premise 2):** Individual autonomy is important, but governments should not "fund" it directly—that would entail paternalistic overreach.

**Band 9 Reconstruction:**
"While cultural vitality is indisputably important for social cohesion and individual flourishing, the inference that governments should fund the arts does not automatically follow. Such a conclusion requires an additional premise: that the arts constitute a public good exhibiting positive externalities and market failures that justify state intervention. Empirical evidence supports this premise—arts programming in underserved communities correlates with reduced crime (0.3 SD effect size in longitudinal studies) and enhanced educational outcomes. However, the strength of this justification is contingent upon demonstrating that private patronage alone is insufficient, a condition that varies by national context."

**廣東話分析:**
*   明確講出隱藏前提：「藝術係 public good」
*   提供 empirical evidence：犯罪率下降 0.3 SD
*   用 "contingent upon" 表示條件性
*   用 "private patronage alone is insufficient" address 反駁論點
`
      },
      {
        title: "1.2 Logical Fallacies: Advanced Taxonomy 邏輯謬誤：進階分類",
        content: `
Beyond basic fallacies (ad hominem, straw man), Band 9 writers avoid:

### 1.2.1 Affirming the Consequent 肯定後件謬誤
**Form:**
If P, then Q.
Q.
∴ P. (INVALID)

**IELTS Example:**
"Countries with high literacy rates tend to be economically prosperous. Finland is prosperous. Therefore, Finland must have high literacy."
*Problem:* Prosperity could stem from other factors (natural resources, trade networks).

**Band 9 Correction:**
"While high literacy is correlated with economic prosperity—and Finland indeed exhibits both—the causal arrow may run in the opposite direction (prosperity → investment in education) or involve confounding variables (Scandinavian governance quality). Cross-national regression analyses suggest literacy explains approximately 30% of variance in GDP per capita, indicating it is one contributory factor among several."

**廣東話:**
*   用 "correlated with" 而唔係 "causes"
*   明講 "causal arrow may run in opposite direction"（因果方向可能相反）
*   提供 quantified estimate："30% of variance"
*   結論用 "one contributory factor among several"（眾多因素之一）

### 1.2.2 Composition & Division Fallacies 合成與分解謬誤
**Composition:** What's true of parts is true of the whole.
**Division:** What's true of the whole is true of parts.

**IELTS Example (Composition):**
"Each musician in the orchestra is excellent. Therefore, the orchestra is excellent."
*Problem:* Collective performance depends on coordination, not just individual talent.

**Band 9 Correction:**
"While individual virtuosity is a necessary condition for ensemble excellence, it is not sufficient. Orchestral quality emerges from coordination dynamics—entrainment of rhythmic patterns, blend of timbres, and interpretive unity—that transcend individual skill. This explains why ad hoc assemblies of soloists often underperform established ensembles despite superior average talent."

**廣東話:**
*   用 "necessary but not sufficient" 做核心 distinction
*   引入 "coordination dynamics"（協調動力學）解釋 emergent properties
*   用 "ad hoc assemblies vs established ensembles" 做對比

### 1.2.3 Base Rate Neglect (Probabilistic Fallacy) 基率忽略謬誤
**Definition:** Ignoring prior probabilities when assessing conditional probabilities.

**IELTS Example:**
"Drug tests for athletes are 95% accurate. An athlete tests positive. Therefore, they are 95% likely to have used drugs."
*Problem:* If only 1% of athletes use drugs, Bayes' Theorem shows the posterior probability is much lower (~16%, not 95%).

**Band 9 Correction:**
"While the test's sensitivity (95% true positive rate) appears compelling, the posterior probability of drug use given a positive test depends crucially on the base rate. Assuming 1% prevalence and 95% specificity, Bayes' Theorem yields a posterior probability of approximately 16%—far below the test's sensitivity. This discrepancy underscores why mass testing in low-prevalence populations generates substantial false positive rates, potentially stigmatizing innocent athletes."

**廣東話:**
*   明確分 "sensitivity" (敏感度) 同 "posterior probability" (後驗概率)
*   引用 Bayes' Theorem（貝葉斯定理）
*   用數字 "16%" 而唔係 vague "much lower"
*   講出實際後果："stigmatizing innocent athletes"
`
      },
      {
        title: "1.3 Argument from Analogy: Structural Analysis 類比論證：結構分析",
        content: `
**Validity Criteria:**
*   Relevant similarities outweigh disanalogies.
*   No critical disanalogy undermines the inference.
*   Analogical domain is well-understood.

**Band 7 Analogy (Weak):**
"Banning junk food is like banning cars—both can be harmful, so we shouldn't ban either."

**Critical Disanalogies:**
*   Cars have irreplaceable utility (transport infrastructure); junk food has substitutes (nutritious alternatives).
*   Car harms are extrinsic (accidents, emissions), amenable to regulation; junk food harms are intrinsic (nutritional composition).

**Band 9 Refinement:**
"The car-junk food analogy is structurally flawed. While both pose health risks, cars serve infrastructurally essential functions lacking viable near-term substitutes, whereas nutritious food alternatives abound. Moreover, automotive harms (emissions, collisions) can be mitigated through engineering and policy (emissions standards, safety features), but junk food's inherent nutritional deficits resist analogous fixes short of reformulation—which effectively eliminates the original product. A more defensible analogy would compare junk food to tobacco: both deliver hedonic value without essential nutrition/function, both impose negative health externalities, and both are regulated via taxation and marketing restrictions rather than prohibition."

**廣東話:**
*   用 "structurally flawed" 而唔係 "wrong"
*   明講 critical disanalogies："irreplaceable utility" vs "substitutes"
*   Propose better analogy: junk food ↔ tobacco
*   用 "negative health externalities" 係經濟學術語
`
      },
      {
        title: "1.4 Modal Logic in Hedging: Epistemic & Deontic Modality 情態邏輯與語氣緩和",
        content: `
*   **Epistemic Modality (知識情態):** Speaker's degree of certainty
*   **Deontic Modality (道義情態):** Obligation, permission

**Epistemic Modal Hierarchy (Certainty Scale)**
Certain ← "must > will > should > would > may > might > could" → Uncertain

**IELTS Application Examples:**

| Modal | Context | Example |
| :--- | :--- | :--- |
| **must** | Logical necessity | "If fossil fuels are finite, alternatives must eventually replace them." |
| **will** | High empirical confidence | "Unchecked emissions will destabilize climate systems." |
| **should** | Reasonable expectation | "Evidence-based interventions should reduce recidivism." |
| **would** | Counterfactual/hypothetical | "Were subsidies eliminated, renewables would become competitive." |
| **may/might** | Possibility | "AI may displace routine labor, though effects might be offset by new sectors." |
| **could** | Potential/capability | "Policy reforms could address inequality if implemented comprehensively." |

**廣東話解釋:**
*   **must:** 邏輯必然（如果前提真，結論必真）
*   **will:** 高度經驗信心（接近確定）
*   **should:** 合理預期（有證據支撐）
*   **would:** 反事實/假設（"如果...就會..."）
*   **may/might:** 可能性（未確定）
*   **could:** 潛力/能力（「有能力做但未必會做」）

### Common Errors 常見錯誤
❌ **Overconfident:** "AI will eliminate all jobs."
✅ **Calibrated:** "AI is likely to automate routine cognitive tasks, though the net employment effect remains contested, with some models predicting job displacement and others highlighting complementarity effects."

**廣東話:**
*   用 "is likely to" 而唔係 "will"
*   明講 "remains contested"（仍有爭議）
*   提出兩種 models：displacement vs complementarity
`
      }
    ]
  },
  {
    id: "m2",
    title: "MODULE 2: Advanced Discourse Architecture 進階語篇結構",
    sections: [
      {
        title: "2.1 Information Structure: Theme-Rheme & Given-New 信息結構：主位-述位與已知-新知",
        content: `
### Theoretical Background
*   **Theme (主位):** The starting point of the clause (typically leftmost constituent)
*   **Rheme (述位):** What is said about the theme (new information)

**Principle:** Place given information in Theme position, new information in Rheme position to maintain cohesive flow.

**Band 7 (Poor Information Flow):**
"Climate change is a serious threat. Governments need to act urgently. Renewable energy is one solution. Fossil fuel subsidies should be eliminated."
*Problem:* Each sentence introduces a new Theme without linking to prior Rheme → cohesion gap.

**Band 9 (Optimal Theme-Rheme Progression):**
"Climate change poses an existential threat to human civilization. This threat demands urgent governmental action, particularly in energy policy. Such action should prioritize two measures: accelerating renewable energy deployment and phasing out fossil fuel subsidies. These subsidies, which annually exceed $500 billion globally, constitute a perverse incentive structure that perpetuates carbon dependence. Eliminating them would not only reduce emissions but also free fiscal resources for green infrastructure investment."

**廣東話分析:**
*   Sentence 2 Theme: "This threat"（指返 Sentence 1 嘅 Rheme）
*   Sentence 3 Theme: "Such action"（指返 Sentence 2 嘅 Rheme）
*   Sentence 4 Theme: "These subsidies"（指返 Sentence 3 嘅 Rheme）
*   Sentence 5 Theme: "Eliminating them"（指返 Sentence 4 嘅 Rheme）
*   呢種 progression 叫做 linear progression（線性推進）
`
      },
      {
        title: "2.2 Cohesion Devices: Beyond Mechanical Connectors 銜接手段：超越機械連接詞",
        content: `
**Cohesion Types (Halliday & Hasan, 1976):**
*   Reference (指稱): pronouns, demonstratives
*   Substitution (替代): one, do so
*   Ellipsis (省略): clause remnants
*   Conjunction (連接): logical connectors
*   Lexical cohesion (詞彙銜接): repetition, synonymy, collocation

### 2.2.1 Lexical Cohesion: Synonym Chains 詞彙銜接：同義詞鏈
**Band 7 (Repetitive):**
"Education is important. Education helps people get jobs. Education also improves critical thinking. Therefore, we should invest in education."

**Band 9 (Varied Lexical Chains):**
"Education is indispensable for individual and societal flourishing. Such learning equips individuals with both vocational skills and cognitive capacities—critical thinking, problem-solving, analytical reasoning. These competencies enhance employability while fostering informed citizenship. Consequently, educational investment constitutes a high-return public expenditure."

**廣東話分析:**
*   "Education" → "such learning" → "these competencies" → "educational investment"
*   用 near-synonyms 而唔係重複同一個字
*   每個 synonym 都有少少唔同 connotation："learning"（過程）、"competencies"（結果）、"investment"（經濟視角）

### 2.2.2 Avoiding Cohesion Gaps 避免銜接斷裂
**Definition:** A cohesion gap occurs when a sentence's Theme lacks clear anaphoric linkage to prior discourse, forcing readers to infer connections.

**Band 7 (Cohesion Gap):**
"Remote work increased during COVID-19. Many companies adopted Zoom. Productivity metrics varied. Mental health concerns emerged."
*Problem:* No explicit links between sentences—each introduces a new, unconnected Theme.

**Band 9 (Explicit Linkage):**
"Remote work surged during COVID-19, with this shift compelling many employers to adopt videoconferencing platforms such as Zoom. These new modalities generated mixed productivity outcomes: while some workers reported efficiency gains, others experienced coordination difficulties due to asynchronous communication. Moreover, the isolation inherent in remote work precipitated mental health concerns, particularly among employees lacking dedicated home office spaces. Such heterogeneous effects suggest that remote work's viability is contingent on individual and organizational contexts."

**廣東話分析:**
*   "this shift" 指返 "Remote work surged"
*   "These new modalities" 指返 "videoconferencing platforms"
*   "the isolation inherent in remote work" 指返 implicit consequence
*   "Such heterogeneous effects" summarize 前面提到嘅 mixed outcomes
*   每句都有 explicit Theme linkage，冇 cohesion gap
`
      },
      {
        title: "2.3 Semantic Drift & Conceptual Precision 語義漂移與概念精確性",
        content: `
**Definition:** Semantic drift occurs when a term's meaning shifts imperceptibly across a text, creating logical inconsistencies.

**Band 7 (Semantic Drift):**
"Technology enhances productivity, so businesses should embrace it. However, technology in schools often distracts students, so it should be limited."
*Problem:* "Technology" means different things (workplace automation vs classroom devices), creating an apparent contradiction.

**Band 9 (Conceptually Precise):**
"Enterprise technology—automation systems, data analytics platforms—demonstrably enhances organizational productivity by streamlining workflows and reducing human error. In contrast, consumer technology in educational settings—particularly social media and entertainment apps—often fragments attention and displaces cognitively demanding tasks. These divergent outcomes reflect differences in deployment context: enterprise systems are task-aligned and access-controlled, whereas classroom device usage frequently permits unrestricted browsing. Thus, the appropriate policy is not wholesale adoption or rejection but rather context-sensitive implementation that maximizes task alignment while minimizing distraction vectors."

**廣東話分析:**
*   明確 distinguish "enterprise technology" vs "consumer technology in educational settings"
*   解釋點解有 divergent outcomes："deployment context"
*   避免 binary thinking：唔係 "all good" or "all bad"，而係 "context-sensitive"
*   冇 semantic drift：每次用 "technology" 都 qualified 佢嘅具體意思
`
      },
      {
        title: "2.4 Presupposition & Pragmatic Implicature 預設與語用含義",
        content: `
### 2.4.1 Factive Presuppositions 事實預設
Factive verbs (regret, realize, acknowledge) presuppose their complements are true.

**Example:**
"Policymakers regret that fossil fuel subsidies persist."
*Presupposition:* Fossil fuel subsidies do persist (taken as established fact).

**Strategic Use in IELTS:**
"Critics rightly acknowledge that universal basic income poses implementation challenges, yet deny that these challenges are insurmountable."
*Effect:* Framing opposing concerns as "acknowledged facts" (via factive verb) while maintaining your counterargument.

**廣東話:**
*   "Rightly acknowledge" 係 factive verb，暗示對方嘅 concern 係真實存在
*   但用 "yet deny that... insurmountable" 反駁佢嘅 conclusion
*   呢種寫法令你 sound more fair-minded（更公正）

### 2.4.2 Scalar Implicature 級差含義
**Principle:** Using a weaker term implicates the stronger term doesn't apply.

**Example:**
"Some students passed the exam."
*Implicature:* Not all students passed (otherwise speaker would say "all").

**IELTS Application (Nuanced Claims):**
"Many developing nations have achieved substantial literacy gains, though progress remains uneven across regions and demographic groups."
*Effect:* "Many" (not "most" or "all") signals some didn't, while "uneven" acknowledges heterogeneity—both enhance precision.

**廣東話:**
*   "Many" 隱含「唔係 most 或 all」
*   "Uneven" 明講有 variation
*   呢種精確度令 examiner 覺得你好 careful
`
      }
    ]
  },
  {
    id: "m3",
    title: "MODULE 3: Syntactic Complexity & Readability Balance 句法複雜度與可讀性平衡",
    sections: [
      {
        title: "3.1 The Syntactic Complexity Paradox 句法複雜度悖論",
        content: `
**Key Insight:** Band 9 requires high syntactic range but not maximal complexity in every sentence. Optimal prose alternates complex and simple structures.
**Psycholinguistic Principle:** Working memory constraints favor periodic simple sentences to allow cognitive processing of prior complex material.

**Band 7 (Monotonous Complexity):**
"Although governments, which are constrained by fiscal limitations that stem from competing budgetary priorities, often struggle to allocate sufficient resources to education, which is widely regarded as a cornerstone of economic development and social mobility, evidence suggests that strategic investment in teacher quality, curriculum reform, and infrastructure improvement can yield substantial returns."
*Problem:* 78-word sentence with multiple embedded clauses → processing overload.

**Band 9 (Varied Complexity):**
"Governments face severe fiscal constraints, stemming from competing budgetary priorities. Nevertheless, education remains a cornerstone of economic development and social mobility. Evidence suggests that strategic investment—targeting teacher quality, curriculum reform, and infrastructure—can yield substantial returns. Such investment need not be fiscally prohibitive. Cross-national analyses indicate that efficiency gains from administrative streamlining and evidence-based resource allocation often exceed the marginal costs of enhanced educational provision."

**廣東話分析:**
*   Sentence 1: Complex (25 words, subordinate clause)
*   Sentence 2: Simple (12 words)
*   Sentence 3: Complex (19 words, appositive phrase)
*   Sentence 4: Simple (8 words)
*   Sentence 5: Complex (25 words, two subordinate clauses)
*   Pattern: Complex → Simple → Complex → Simple → Complex
*   呢種 rhythm 令讀者唔會 overload
`
      },
      {
        title: "3.2 Non-finite Clauses for Compression 非限定分句用於壓縮",
        content: `
Non-finite clauses (infinitives, gerunds, participles) allow information compression while maintaining sophistication.

**Band 7 (Finite Clauses Only):**
"She submitted the report and she hoped that it would be approved."

**Band 9 (Non-finite Compression):**
"She submitted the report, hoping it would be approved."
*Effect:* 5-word gerund clause replaces 7-word finite clause → 30% compression without information loss.

**Advanced Example: Multiple Non-finite Clauses**
**Band 7:**
"After the government introduced the policy, and after it was implemented across multiple sectors, unemployment rates began to decline. This decline surprised analysts who had predicted that job losses would occur."

**Band 9:**
"Following the policy's cross-sectoral implementation, unemployment rates declined, surprising analysts who had predicted job losses."

**廣東話分析:**
*   "Following the policy's cross-sectoral implementation" = 壓縮兩個 finite clauses
*   "Surprising analysts..." = participle clause 做 result
*   19 words vs 32 words (40% compression)
`
      },
      {
        title: "3.3 Cleft Constructions for Focus & Contrast 分裂句用於聚焦與對比",
        content: `
**It-Cleft:** Highlights one constituent by making it the focus.

**Band 7:**
"Systemic inequality, not individual effort, explains persistent poverty."

**Band 9 (It-Cleft):**
"It is systemic inequality, not individual effort, that explains persistent poverty."
*Effect:* "Systemic inequality" moves to focus position, explicitly contrasting with "individual effort."

**Wh-Cleft (Pseudo-Cleft) for Emphasis**
**Band 7:**
"Governments should prioritize renewable energy investment."

**Band 9 (Wh-Cleft):**
"What governments must prioritize is renewable energy investment, not incremental adjustments to fossil fuel efficiency."

**廣東話分析:**
*   Wh-cleft 將 "renewable energy investment" 放喺 focus position
*   同時 add contrast："not incremental adjustments..."
*   呢種結構好適合用嚟 counter 對方論點
`
      },
      {
        title: "3.4 Avoiding Center-Embedding Overload 避免中心嵌入過載",
        content: `
**Center-embedding:** Inserting a subordinate clause in the middle of the main clause.

**Problematic (Triple Center-Embedding):**
❌ "The claim that the study that the researchers who the university hired conducted validates is controversial."
*Problem:* Readers must hold three incomplete clauses in working memory → unprocessable.

**Solution:** Right-branching structures

**Band 9 (Right-Branching):**
"The claim is controversial—namely, that the study validates a hypothesis advanced by researchers whom the university hired for this project."

**廣東話:**
*   用 dash + "namely" introduce elaboration
*   所有 subordination 都係 right-branching（向右分支）
*   冇 center-embedding，易讀好多
`
      }
    ]
  },
  {
    id: "m4",
    title: "MODULE 4: Task 1 Advanced Analytics 任務一進階分析",
    sections: [
      {
        title: "4.1 From Description to Interpretation: The Analytical Overview 從描述到詮釋：分析性概覽",
        content: `
**Band 7 Overview (Descriptive):**
"The chart shows data for five countries from 2010 to 2020. Country A had the highest value. Country E had the lowest. All countries increased."

**Band 9 Overview (Analytical):**
"The data reveal divergent growth trajectories across five economies, with advanced nations exhibiting decelerating growth consistent with diminishing marginal returns, while emerging economies demonstrate accelerated expansion characteristic of convergence dynamics. Notably, absolute gaps widened despite proportional convergence, a pattern implicating scale effects in economic development."

**廣東話分析:**
*   唔係 list 數據，而係 identify patterns："divergent trajectories", "convergence dynamics"
*   用經濟學理論："diminishing marginal returns"
*   指出 paradox："absolute gaps widened" + "proportional convergence"
*   提供 theoretical explanation："scale effects"
`
      },
      {
        title: "4.2 Proportional vs Absolute Reasoning 比例與絕對值推理",
        content: `
**Scenario:**
Country A GDP: $2 trillion → $3 trillion (+50%)
Country B GDP: $100 billion → $200 billion (+100%)

**Band 7 (Absolute Only):**
"Country A grew more ($1 trillion vs $100 billion)."

**Band 9 (Dual Analysis):**
"In absolute terms, Country A's GDP expansion ($1 trillion) dwarfed Country B's ($100 billion) tenfold. However, proportionally, Country B exhibited a 100% growth rate—double Country A's 50%—indicating more dynamic economic expansion relative to baseline. This proportional-absolute divergence likely reflects convergence phenomena: lower-income economies (Country B) grow faster than affluent ones (Country A) due to technology transfer, institutional catch-up, and higher marginal productivity of capital. Consequently, while absolute gaps persist or widen, relative gaps narrow, a pattern consistent with conditional convergence theory in development economics."

**廣東話分析:**
*   同時講 absolute 同 proportional："dwarfed tenfold" (absolute) vs "double" (proportional)
*   解釋 divergence："convergence phenomena"
*   引用理論："conditional convergence theory"
*   指出 policy implication："absolute gaps persist" vs "relative gaps narrow"
`
      },
      {
        title: "4.3 Causal Speculation with Hedging 因果推測與語氣緩和",
        content: `
**Principle:** Task 1 should avoid strong causal claims but can offer hedged explanations.

**Band 7 (Over-Assertive):**
❌ "Country X's GDP grew because of government policy."
*Problem:* Causal claim without data to support it.

**Band 9 (Hedged Speculation):**
"Country X's GDP growth may be partially attributable to fiscal stimulus measures introduced in Year Y, though confounding factors—including favorable commodity prices and regional trade agreements—complicate causal attribution. The temporal coincidence of policy implementation and growth acceleration is suggestive but not conclusive."

**廣東話:**
*   用 "may be partially attributable to"（可能部分歸因於）
*   明講 "confounding factors"（混淆因素）
*   "Temporal coincidence... suggestive but not conclusive"（時間巧合...提示但唔係結論）
*   全部都係 appropriate hedging for Task 1
`
      },
      {
        title: "4.4 Lexical Precision in Describing Trends 趨勢描述的詞彙精確性",
        content: `
Avoid Vague Verbs ("increase", "decrease")—use specific, nuanced alternatives:

**Upward Movement**
*   **Dramatic:** surge, soar, skyrocket, rocket ("Cryptocurrency valuations surged 400% in Q4.")
*   **Strong:** climb, rise sharply, accelerate, jump ("Enrollment climbed steadily over the decade.")
*   **Moderate:** increase, grow, advance, edge up ("Real wages advanced modestly (+2% annually).")
*   **Minimal:** inch up, creep up, nudge higher ("Inflation inched up from 2.1% to 2.3%.")

**Downward Movement**
*   **Dramatic:** plummet, plunge, collapse, nosedive ("Stock prices plummeted in the wake of the scandal.")
*   **Strong:** decline sharply, fall steeply, contract ("Manufacturing output contracted by 15%.")
*   **Moderate:** decrease, decline, drop, dip ("Consumer confidence dipped post-election.")
*   **Minimal:** edge down, slip, ease ("Interest rates eased by 25 basis points.")

**Stability & Fluctuation**
*   **Stable:** remain steady, plateau, level off, stabilize ("Unemployment plateaued at 6% for three years.")
*   **Volatile:** fluctuate, oscillate, vary, swing ("Oil prices oscillated between $60 and $80/barrel.")

**Band 9 Sentence:**
"Export volumes surged 40% between 2015 and 2018, then plateaued for two years before edging down modestly in 2020—a trajectory suggesting initial expansion followed by market saturation."

**廣東話:**
*   "Surged" (dramatic increase)
*   "Plateaued" (stable)
*   "Edging down" (minimal decrease)
*   用三個唔同 intensity 嘅動詞 capture nuanced movement
`
      }
    ]
  },
  {
    id: "m5",
    title: "MODULE 5: Task 2 Advanced Argumentation 任務二進階論證",
    sections: [
      {
        title: "5.1 Necessary vs Sufficient Conditions: Precise Causal Claims 必要與充分條件：精確因果主張",
        content: `
**Definitions:**
*   X is necessary for Y: ¬X → ¬Y (without X, no Y)
*   X is sufficient for Y: X → Y (X guarantees Y)

**Common Error:** Confusing correlation with necessity/sufficiency.

**Band 7 (Confused):**
"University education is necessary for success because most successful people have degrees."
*Problem:* "Most successful people have degrees" shows sufficiency (or correlation), not necessity. Counterexamples (Bill Gates, Steve Jobs) prove it's not necessary.

**Band 9 (Precise):**
"University education is neither necessary nor sufficient for career success. It is not necessary, as demonstrated by numerous high-achieving entrepreneurs (Gates, Zuckerberg) who succeeded without degrees. Nor is it sufficient—many graduates face underemployment, particularly in over-saturated fields. Rather, higher education is facilitative: it increases the probability of favorable outcomes (e.g., 60% higher lifetime earnings on average) without guaranteeing them. Thus, educational attainment is best conceptualized as one probabilistic factor among multiple determinants—including social capital, cognitive ability, and labor market conditions."

**廣東話分析:**
*   明確講 "neither necessary nor sufficient"
*   提供 counterexamples (Gates, Zuckerberg) 證明 "not necessary"
*   指出 "many graduates face underemployment" 證明 "not sufficient"
*   用 "facilitative" 同 "increases the probability" 做精確表達
*   Conclusion: "one probabilistic factor among multiple determinants"
`
      },
      {
        title: "5.2 Toulmin Model: Six-Element Argument Construction 圖爾敏模型：六元素論證構建",
        content: `
Every Band 9 body paragraph should contain:
1.  **Claim (主張):** Your main point
2.  **Data (數據):** Evidence
3.  **Warrant (保證):** Why Data supports Claim
4.  **Backing (支撐):** Support for Warrant
5.  **Qualifier (限定):** Scope/strength of Claim
6.  **Rebuttal (反駁):** Acknowledge counterarguments

**Full Example: Education & Inequality**
*   **Claim:** Expanding access to higher education can mitigate income inequality, but only under specific institutional conditions.
*   **Data:** OECD longitudinal data indicate that tertiary-educated individuals earn, on average, 65% more than those with secondary education alone, with this premium remaining stable across two decades.
*   **Warrant:** If income differentials align with educational attainment, then broadening university access should enable upward mobility for individuals from low-income backgrounds, provided labor markets reward credentials and educational quality is maintained.
*   **Backing:** This logic reflects human capital theory, which conceptualizes education as productivity-enhancing investment. Empirical validation comes from difference-in-differences analyses of college expansion programs (e.g., UK's 1992 polytechnic-to-university conversions), which show statistically significant income gains for cohorts gaining access.
*   **Qualifier:** However, these effects are contingent on two conditions: (1) avoiding credential inflation (degrees retaining signaling value), and (2) aligning curricula with labor market demands.
*   **Rebuttal:** Critics argue that when degrees become ubiquitous, their signaling power erodes—a concern validated by credential inflation in saturated markets (e.g., South Korea's 70% tertiary attainment rate). Yet this does not invalidate the education-inequality link; rather, it suggests that quality assurance and labor market coordination are necessary complements to access expansion. Countries maintaining robust vocational tracks alongside academic degrees (e.g., Germany's dual system) avoid credential inflation while preserving educational returns.

**廣東話分析:**
*   每個 element 都 explicitly present
*   Data: 用具體數字 "65% more"
*   Warrant: 明講 "provided" conditions
*   Backing: 引用 theory (human capital) + empirical method (difference-in-differences)
*   Qualifier: "contingent on two conditions"
*   Rebuttal: Acknowledge "credential inflation" 但 counter 佢
`
      },
      {
        title: "5.3 Inference to the Best Explanation (IBE) 最佳解釋推論",
        content: `
**Structure:** Present multiple explanations → Compare by criteria → Select best.

**Criteria for "Best" Explanation:**
*   **Explanatory power:** Accounts for more phenomena
*   **Parsimony:** Simpler (Occam's Razor)
*   **Consistency:** Aligns with established knowledge
*   **Testability:** Generates falsifiable predictions

**Example: Digital Divide**
*Phenomenon:* Low-income communities exhibit lower digital literacy than affluent communities.
*   **Explanation 1 (Weak): Cognitive deficits**
    ❌ Fails consistency: Contradicts cognitive science (intelligence normally distributed across SES).
*   **Explanation 2 (Moderate): Device access gaps**
    ⚠️ Partial explanatory power: Explains access but not skill disparities among those with devices.
*   **Explanation 3 (Best): Structural barriers (access + education + time constraints)**
    ✅ High explanatory power: Accounts for both access and skill gaps
    ✅ Consistency: Aligns with sociological research on cumulative disadvantage
    ✅ Testability: Predicts that targeted interventions (device provision + digital literacy training + time subsidies) will narrow gaps more than device provision alone.

**Band 9 Argument:**
"The digital divide is best explained not by individual deficits but by structural barriers. While device access gaps are necessary conditions, they are insufficient: even when devices are provided, low-income students often lack digital literacy curricula in underfunded schools and face time constraints from economic pressures (part-time work, caregiving). This multi-causal model demonstrates superior explanatory power compared to monocausal accounts and is empirically testable—interventions addressing all three barriers (Community Technology Centers providing devices, training, and flexible scheduling) show significantly larger effect sizes (0.6 SD vs 0.2 SD for device provision alone) on digital skill acquisition."

**廣東話分析:**
*   明講 "best explained by"
*   拆解 necessary vs insufficient: device access 係 necessary 但唔 sufficient
*   用 "multi-causal model" 同 "monocausal accounts" 對比
*   提供 empirical evidence: effect sizes (0.6 vs 0.2 SD)
`
      },
      {
        title: "5.4 Steel Man vs Straw Man: Intellectual Honesty 鋼鐵人與稻草人：知識誠實",
        content: `
*   **Straw Man (Band 6-7):** Distort opposing view → easily refute it
*   **Steel Man (Band 9):** Strengthen opposing view → address its strongest form

**Example: Technology & Social Isolation**
**Straw Man (Bad):**
"Some people say technology is bad. This is ridiculous—technology has brought many benefits like medical advances."
*Problem:* No one argues "technology is bad" simpliciter. You're attacking a caricature.

**Steel Man (Good):**
"Critics of pervasive digital connectivity advance a sophisticated concern: that constant smartphone use fragments sustained attention, displaces face-to-face interaction, and cultivates algorithmic dependency via dopamine-driven feedback loops. These concerns are empirically grounded—longitudinal studies demonstrate correlations between heavy social media use and increased anxiety (r = 0.31) and reduced in-person social time (–2.5 hours/week). Moreover, neuroscientific evidence reveals that social media triggers reward circuitry akin to addictive substances."

**[Now Counter It]:**
"Nevertheless, this critique overlooks countervailing evidence. Digital platforms also facilitate distributed collaboration, global connectivity, and access to information previously unattainable. Crucially, the causal arrow remains contested: it may be that anxious individuals self-select into heavy social media use rather than use causing anxiety—a possibility consistent with cross-lagged panel analyses showing bidirectional associations. Thus, while the concerns merit serious consideration, they do not justify wholesale rejection but rather thoughtful regulation (e.g., design ethics, digital literacy education, and self-regulation tools)."

**廣東話分析:**
*   Steel man: "sophisticated concern", "empirically grounded", "neuroscientific evidence"
*   用 specific evidence: "r = 0.31", "–2.5 hours/week"
*   Counter: "overlooks countervailing evidence"
*   指出 causality problem: "self-select" vs "causing"
*   引用 method: "cross-lagged panel analyses"
*   Synthesis: "thoughtful regulation" 而唔係 "wholesale rejection"
`
      }
    ]
  },
  {
    id: "m6",
    title: "MODULE 6: Linguistic Pitfalls to Avoid 語言學陷阱需避免",
    sections: [
      {
        title: "6.2 Dangling Modifiers 懸空修飾語",
        content: `
**Definition:** A modifier that doesn't clearly modify any specific word.

**Error:**
❌ "Having finished the report, the computer was shut down."
*Problem:* "Having finished the report" should modify a person, but the subject is "the computer."

**Correction:**
✅ "Having finished the report, she shut down the computer."

**IELTS Example:**
❌ "After analyzing the data, significant trends were observed."
*Problem:* "After analyzing" needs a human agent, but subject is "trends."

**Band 9 Correction:**
✅ "After analyzing the data, researchers observed significant trends."
`
      },
      {
        title: "6.3 Illogical Comparisons 不合邏輯的比較",
        content: `
**Error:**
❌ "Country A's GDP is higher than Country B."
*Problem:* Comparing GDP (a quantity) to a country (an entity).

**Correction:**
✅ "Country A's GDP is higher than that of Country B."
✅ "Country A's GDP is higher than Country B's."

**IELTS Example:**
❌ "The results of this study are more conclusive than the previous one."
*Problem:* Comparing "results" to "one" (study).

**Band 9 Correction:**
✅ "The results of this study are more conclusive than those of the previous one."
`
      },
      {
        title: "6.4 False Parallelism 錯誤平行結構",
        content: `
**Principle:** Elements in a series must be grammatically parallel.

**Error:**
❌ "The policy aims to reduce poverty, increasing employment, and education improvement."
*Problem:* Mixed forms (infinitive, gerund, noun phrase).

**Correction:**
✅ "The policy aims to reduce poverty, increase employment, and improve education."
✅ "The policy aims at reducing poverty, increasing employment, and improving education."
`
      }
    ]
  },
  {
    id: "m7",
    title: "MODULE 7: Self-Editing Checklist (Band 9 Standard) 自我編輯清單",
    sections: [
      {
        title: "Checklist",
        content: `
**Logical Integrity 邏輯完整性**
*   [ ] No hidden premises left unstated
*   [ ] No affirming the consequent or denying the antecedent
*   [ ] All analogies checked for critical disanalogies
*   [ ] Necessary/sufficient conditions correctly distinguished
*   [ ] No base rate neglect in probabilistic claims

**Cohesion & Coherence 銜接與連貫**
*   [ ] Each sentence's Theme links to prior Rheme (no cohesion gaps)
*   [ ] Lexical chains vary (synonyms, not repetition)
*   [ ] No semantic drift (terms maintain consistent meaning)
*   [ ] Presuppositions and implicatures are intentional, not accidental

**Syntactic Sophistication 句法精密度**
*   [ ] Mix of simple and complex sentences (not all complex)
*   [ ] At least one mandative subjunctive (Task 2)
*   [ ] At least one cleft construction for emphasis
*   [ ] Non-finite clauses used for compression
*   [ ] No center-embedding overload (max 2 levels)

**Lexical Precision 詞彙精確度**
*   [ ] Epistemic modals calibrated to certainty level
*   [ ] Trend verbs specify intensity (surge vs edge up)
*   [ ] No vague quantifiers ("many" → "approximately 60%")
*   [ ] Academic register maintained (valorize, mitigate, precipitate)

**Task Achievement 任務完成度**
*   **Task 1:**
    *   [ ] Analytical overview (patterns, not data list)
    *   [ ] Data grouped by logic (not by year/category mechanically)
    *   [ ] Proportional + absolute reasoning where relevant
    *   [ ] Hedged causal speculation (may be attributable to)
*   **Task 2:**
    *   [ ] All parts of question addressed
    *   [ ] Toulmin elements present in body paragraphs
    *   [ ] Steel man (not straw man) for counterarguments
    *   [ ] Synthesis/nuanced position (not binary agree/disagree)

### CONCLUSION: From Band 7 to Band 9
Band 7 demonstrates competence: correct grammar, clear paragraphing, relevant examples.
Band 9 demonstrates mastery: logical precision, theoretical grounding, syntactic elegance, lexical exactitude, and meta-discursive awareness.

The journey from 7 to 9 is qualitative, not quantitative. It requires:
*   Internalizing formal logic (validity, fallacies, modality)
*   Mastering discourse architecture (Theme-Rheme, cohesion, presupposition)
*   Calibrating syntactic complexity (variety without overload)
*   Achieving lexical precision (hedging, trend verbs, academic register)
*   Integrating theoretical frameworks (human capital, convergence, Toulmin)

*This course provides the conceptual tools. Mastery requires deliberate practice.*
`
      }
    ]
  }
];
