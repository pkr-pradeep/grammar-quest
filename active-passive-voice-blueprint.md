# Grammar Quest — Phase 1 Curriculum & Learning Design Blueprint
## Lesson: Active and Passive Voice

**Catalogue Topic ID:** `topic-voice`  
**Lesson Group:** Voice, Speech & Mechanics (`cat-voice-speech`)  
**Curriculum Policy:** Independent English grammar curriculum (no student-facing class, board, or mission labels)  
**Phase Status:** Phase 1 — Curriculum Design & Content Architecture *(Implementation deferred pending approval)*

---

## 1. Curriculum Sources Reviewed & Verification Notes *(Internal Metadata Only)*

This blueprint was designed by inspecting the existing Grammar Quest codebase and curriculum documentation (`src/content/curriculumCatalog.ts`, `src/content/lessons/lessonRegistry.ts`, `src/content/assessments/assessmentRegistry.ts`, `src/schemas/grammarEngine.schema.ts`, `src/schemas/lesson.schema.ts`, `src/schemas/assessment.schema.ts`, `src/features/grammar-engine/components/WordLaboratory.tsx`, `src/features/grammar-engine/components/IndependentPracticeStage.tsx`, `src/features/missions/TopicExplorer.tsx`, `curriculum-source-map.json`, `curriculum-overview.md`, `content-gaps.md`, `mvp-learning-sequence.md`, and `sentence-types-clause-patterns-blueprint.md`).

> **Source Inspection Transparency Note:** The raw `.pdf` textbook files are not mounted inside the current runtime workspace container. All textbook titles, chapter titles, book page ranges, PDF page offsets, and verified notes below come strictly from `curriculum-source-map.json`, `curriculum-overview.md`, and `content-gaps.md`. No unverified sub-section headings, page-by-page splits, or textbook examples have been invented.
>
> **Independent Curriculum Policy:** In accordance with Grammar Quest's product direction, textbook citations, grade tags, and board names remain strictly in internal metadata (`sourceReferences` / Section 1). Student-facing screens, lesson titles, topic names, explanations, and exercises never display academic class numbers, education board names, or `"Mission"` labels.

### 1.1 Verified Source Textbook Coverage

| Source Textbook *(Internal Only)* | Authority / Edition | Verified Chapters & Exact Pages | Verified Coverage & Terminology Notes |
| :--- | :--- | :--- | :--- |
| **Odisha BSE — *Learn and Practise Grammar Class - X*** (`odisha-learn-practise-10`) | Board of Secondary Education, Odisha<br>New Ed. 2013, 2019 | • **Chapter 9: The Passive** (Book pp. **90–105** / PDF pp. **96–111**)<br>• *(Cross-refs)* **Ch. 1: Tense Revisited** (pp. 1–12 / PDF pp. 7–18), **Ch. 2: Types of Sentences** (`SV/SVO/SVOO/SVC/SVOC`, pp. 13–22 / PDF pp. 19–28), **Ch. 4: Non-Finite Verb Forms** (`-en` participle, pp. 31–38 / PDF pp. 37–44) | • Dedicated 16-page chapter on Passive Voice using **`be + en`** verb notation (`be` + past participle `-en`).<br>• Connects directly to `SVO`, `SVOO`, and `SVOC` transitive patterns taught in Ch. 2.<br>• Recorded print glitches in `content-gaps.md`: Ch. 9 p. 93 prints *"an opposition"* (for *an apposition*); Ch. 9 p. 100 prints *"be blamed"* / `(1)` numbering irregularity. |
| **Punjab PSEB — *A Practice Book of ENGLISH GRAMMAR & COMPOSITION (GRAMMAR IN USE) for Class IX*** (`pseb-grammar-in-use-9`) | Punjab School Education Board (PSEB)<br>Ed. 2021–22 *(No Class X book supplied)* | • **Chapter 6: Voice** (Book pp. **61–73** / PDF pp. **67–79**)<br>• *(Cross-refs)* **Ch. 2: Modals** (pp. 12–26 / PDF pp. 18–32), **Ch. 9: Tenses (Concord and Sequence)** (pp. 94–104 / PDF pp. 100–110) | • Summarised in `curriculum-overview.md` as covering **Active/Passive rules across tenses and modals**.<br>• Uses **`V1 / V2 / V3`** verb-form notation and the **12-tense** (*Present/Past/Future × Indefinite/Continuous/Perfect/Perfect Continuous*) model. |
| **Assam SEBA — *A NEW METHOD English Grammar For Class IX & X*** (`assam-new-method-9-10`) | Board of Secondary Education, Assam (SEBA)<br>11th Ed. 2023 *(Combined IX–X)* | • **Chapter 11: Voice** (Book pp. **186–193** / PDF pp. **195–202**)<br>• *(Cross-refs)* **Ch. 1 L5–L6: Transitive/Intransitive & Objects** (pp. 6–9 / PDF pp. 15–18), **Ch. 5: Pronouns** (pp. 64–73 / PDF pp. 73–82), **Ch. 9: Tense** (Strong/Weak/Mixed verbs & conjugation tables, pp. 120–147 / PDF pp. 129–156), **Ch. 10: Special Verbs** (pp. 148–185 / PDF pp. 157–194) | • Dedicated **Voice** chapter alongside foundational Transitive vs Intransitive object rules (Ch. 1 L5), Strong/Weak/Mixed past participles (Ch. 9 L4–L5), and pronoun case forms (Ch. 5).<br>• Uses dual aspect labels (*Indefinite/Simple*, *Continuous/Progressive*). |
| **Odisha BSE — *LEARN AND PRACTISE GRAMMAR CLASS - IX*** (`odisha-learn-practise-9`) | Board of Secondary Education, Odisha<br>New Ed. 2012, 2019 | • **No standalone Voice chapter**<br>• *(Prerequisites only)* **Ch. 2: Verbs** (pp. 27–32 / PDF pp. 33–38), **Ch. 3: Time and Tense** (`v, v-ed, -ed/-en`, pp. 33–61 / PDF pp. 39–67), **Ch. 4: Auxiliaries** (pp. 62–73 / PDF pp. 68–79), **Ch. 12: The Predicate Phrase** (`S+V`, `S+V+C`, `S+V+O`, `S+V+O+O`, `S+V+O+C`, `S+V+A`, pp. 141–146 / PDF pp. 147–152) | • Establishes the prerequisites needed for Passive Voice (finite auxiliaries, `-ed/-en` participle forms, and transitive `O` vs intransitive/complement `C/A` patterns), leaving formal Passive transformation for Ch. 9 of the next volume. |

---

## 2. Learning Scope & Boundary Decisions

### 2.1 Existing Architecture & Ready-Lesson Context
In `src/content/curriculumCatalog.ts`, **Active and Passive Voice** already exists as `topic-voice` inside the **`Voice, Speech & Mechanics`** group (`cat-voice-speech`), alongside `Direct and Indirect Speech` (`topic-speech`) and `Punctuation` (`topic-punctuation`).

Four lessons are currently implemented and ready in `src/content/lessons/lessonRegistry.ts`:
1. **Subject and Predicate** (`topic-subject-predicate` — group: *Sentence Structure & Clauses*)
2. **Sentence Types & Clause Patterns** (`topic-sentence-types` — group: *Sentence Structure & Clauses*)
3. **Tenses: Time and Verb Forms** (`topic-tenses` — group: *Verbs & Agreement*)
4. **Subject–Verb Agreement** (`topic-sva` — group: *Verbs & Agreement*)

### 2.2 Explicit Scope Boundaries with Other Lessons

| Adjacent Grammar Lesson | Status in App | Boundary Decision for *Active and Passive Voice* |
| :--- | :--- | :--- |
| **Sentence Types & Clause Patterns** (`topic-sentence-types`) | `Already available` | Does **not** re-teach `SV`, `SVA`, `SVC`, `SVO`, `SVOO`, `SVOC` from scratch; uses a quick prerequisite revision to show why **only Transitive patterns (`SVO`, `SVOO`, `SVOC`)** have an Object that can become a Passive Subject. |
| **Tenses: Time and Verb Forms** (`topic-tenses`) | `Already available` | Does **not** re-teach basic tense timelines; bridges directly from tense auxiliaries (`is/was/has/will`) and introduces a focused Past Participle (`V-en / V3`) refresher for passive verb chains. |
| **Subject–Verb Agreement** (`topic-sva`) | `Already available` | Activates concord directly when the **new Subject** (former Object) forces `be` to switch number (`is↔are`, `was↔were`, `has↔have`). |
| **Pronouns & Case** (`topic-pronouns`) | `Not yet available` | Because standalone pronoun case lessons are not yet ready, Topic 4 includes a compact, self-contained **Subject ↔ Object Pronoun Case Bridge** (`I↔me, we↔us, he↔him, she↔her, they↔them, who↔whom`). |
| **Auxiliaries, Modals & Special Verbs** (`topic-auxiliaries-modals`) | `Not yet available` | Because standalone modal lessons are not yet ready, Topic 3 includes a compact **Modal + `be` + Past Participle** bridge (`can be, must be, should be, may be`). |
| **Direct and Indirect Speech** (`topic-speech`) | `Not yet available` | Kept strictly separate. Voice shifts focus inside a clause (*doer vs receiver*); Speech reports someone's words across clauses. |
| **Phrasal Verbs** (`topic-phrasal-verbs`) | `Not yet available` | Avoids testing complex phrasal-verb passives (*"was looked after by"*) in core mastery; keeps examples to clean transitive verbs plus a light awareness note on keeping fixed prepositions attached only if needed in natural usage. |

---

## 3. Prerequisite Concepts & Readiness Status

| Prerequisite Concept | Source Lesson in Grammar Quest | Availability Status | How This Lesson Handles It |
| :--- | :--- | :--- | :--- |
| **1. Subject vs Predicate & Head-Word** | *Subject and Predicate* (`topic-subject-predicate`) | **Already available** | Assumed foundation; briefly reactivated when swapping the Subject slot in Topic 1–2. |
| **2. Tense, Aspect & Helping Verbs (`be`, `have`, `will`)** | *Tenses: Time and Verb Forms* (`topic-tenses`) | **Already available** | Activated in Topic 3 to keep sentence time unchanged while adding the passive `be` layer. |
| **3. Subject–Verb Agreement (Number & Person)** | *Subject–Verb Agreement* (`topic-sva`) | **Already available** | Activated in Topic 2 so `be` matches the **new Subject**, not the original doer. |
| **4. Sentence Purpose (Questions & Imperatives) & Clause Patterns (`SV`, `SVC`, `SVO`, `SVOO`)** | *Sentence Types & Clause Patterns* (`topic-sentence-types`) | **Requires a short revision** | A 1-step warm-up in Topic 1/6 recalls `S + V + O` (has an Object) vs `S + V` / `S + V + C` (no Object), and Topic 4 builds directly on Question/Imperative word order. |
| **5. Past Participle (`V-en` / `V3`) Verb Forms** | Partially used in *Tenses* (`has/have + V-en`), not isolated separately | **Requires a short revision** | Include a quick irregular Past Participle reminder (*write→written, grow→grown, eat→eaten, break→broken, teach→taught*) before Topic 2 transformations. |
| **6. Personal & Interrogative Pronoun Case (`I/me`, `they/them`, `who/whom`)** | *Pronouns & Case* (`topic-pronouns`) | **Not yet available** | Teach a compact self-contained case table inside Topic 4 before converting pronoun subjects/objects. |
| **7. Modal Auxiliaries (`can, may, must, should`)** | *Auxiliaries, Modals & Special Verbs* (`topic-auxiliaries-modals`) | **Not yet available** | Provide a short self-contained `Modal + be + Past Participle` pattern card inside Topic 3. |

---

## 4. Proposed Topic Structure & Teaching Sequence (7 Scaffolded Topics)

The lesson progresses from **meaning and focus** → **core structure** → **tense/modal mechanics** → **pronouns & varied sentence forms** → **authentic omission & purpose** → **limits of passivisation** → **error diagnosis**.

| Order | Topic Title | Difficulty Level | Core Focus |
| :---: | :--- | :--- | :--- |
| **1** | **Meaning of Voice: Doer Focus vs Receiver Focus** | `Beginner` | What Voice does; identifying Active (doer leads) vs Passive (receiver leads) without changing basic event meaning or time. |
| **2** | **The Core Transformation Pattern (`New Subject + be + Past Participle`)** | `Beginner` | Moving Object → Subject, keeping `be` matched to the new Subject and tense, and using the Past Participle (`V-en / V3`). |
| **3** | **Voice Across Verb Tenses, Aspects & Modals** | `Intermediate` | Shifting Simple, Progressive (`be + being + V-en`), Perfect (`have/has/had + been + V-en`), Future Time (`will/going to`), and Modals (`can/must + be + V-en`); knowing which forms do not normally take Passive. |
| **4** | **Pronoun Case Swaps, Two Objects (`SVOO`), Questions & Imperatives** | `Intermediate` | `I↔me / she↔her / they↔them / who↔whom`; two passives for `SVOO`; question inversion; `Let...be...` / polite request imperatives. |
| **5** | **Using or Omitting the `by`-Phrase & When Passive Is Natural** | `Intermediate` → `Advanced` | Dropping vague/obvious doers (*someone, people, they*); choosing Passive naturally in science, recipes, and public notices; `with/to/in` vs `by`. |
| **6** | **Sentences That Cannot Be Made Passive (Intransitive & Linking Verbs)** | `Advanced` | Testing why `SV`, `SVA`, and `SVC` (*arrive, sleep, happen, is dark, became captain*) have no Object to promote and cannot form Passive Voice. |
| **7** | **Spotting and Fixing Common Voice Errors** | `Advanced` | Applying a 5-point Passive Audit to repair `be` omissions, `V2` vs `V-en` slips, agreement mismatches, tense drift, and wrong pronoun cases. |

---

## 5. Topic-by-Topic Learning Design

All examples adhere to Grammar Quest's Indian school, science, nature, heritage, and **Healthy Food & Lifestyle** guidelines.

---

### Topic 1: Meaning of Voice — Doer Focus vs Receiver Focus (`Beginner`)
- **Learning Objective:**
  - *Understand:* Voice is a grammatical choice that puts either the **doer (agent)** or the **receiver of the action** in the Subject spotlight while keeping the real-world event and time intact.
  - *Identify:* Tell whether a sentence is in **Active Voice** (Subject performs the action) or **Passive Voice** (Subject receives the action).
- **Prerequisite Knowledge:** Subject and Predicate (`Already available`), basic `S + V + O` recognition (`Requires a short revision`).
- **Explanation Required:**
  - Compare two views of the exact same scene:
    - **Active Voice:** *"Mira (`Doer / Subject`) waters (`Action`) the mango saplings (`Receiver / Object`)."* → Spotlight is on **Mira**.
    - **Passive Voice:** *"The mango saplings (`Receiver / Subject`) are watered (`Passive Verb`) by Mira (`Doer`)."* → Spotlight moves onto **the mango saplings**.
  - Explain clearly that Passive Voice does **not** mean past time—*"are watered"* is still a present habit!
- **Example Types:** Everyday school garden, library, kitchen nutrition, and Indian craft scenes (`SVO` simple sentences).
- **Common Student Mistakes:**
  1. Assuming Passive Voice automatically refers to the past because `-ed/-en` endings appear.
  2. Assuming the **Subject** of a sentence is always the **doer** of the action.
- **Proposed Teaching & Activity Alignment:**
  - *Visual Focus:* Highlight `Doer` badge vs `Receiver` badge swapping places across the clause (`compare-dual` + `split-blueprint`).
  - *WordLab Task:* `categorise` — Sort 6–8 clear Active vs Passive sentence strips by *"Who is in the Subject spotlight: Doer or Receiver?"*.

---

### Topic 2: The Core Transformation Pattern — `New Subject + be + Past Participle` (`Beginner`)
- **Learning Objective:**
  - *Understand:* Changing Active to Passive follows a 4-part shift: (1) move the Object to Subject position, (2) insert the matching form of **`be`** for the original tense and the **new Subject**, (3) lock the main verb into its **Past Participle (`V-en` / `V3`)**, and (4) optionally place `by + original Subject`.
  - *Construct:* Convert simple Present and simple Past `S + V + O` sentences from Active to Passive and back, maintaining correct Subject–Verb Agreement.
- **Prerequisite Knowledge:** `Subject–Verb Agreement` (`Already available`); Past Participle `V-en / V3` (`Requires a short revision`).
- **Explanation Required:**
  - Show the two-job split inside a Passive verb group: **`be` = tense + agreement carrier**; **`Past Participle (V-en / V3)` = core action meaning**.
  - Include a brief **Past Participle Refresher Box** contrasting Past Simple (`V2`) vs Past Participle (`V3 / V-en`) for high-frequency irregular verbs (*eat/ate/eaten, write/wrote/written, grow/grew/grown, give/gave/given, break/broke/broken*).
  - Highlight Subject–Verb Agreement swap: *"The chef washes **the fresh vegetables**."* → *"**The fresh vegetables are** washed by the chef."* (`washes` singular → `are` plural!).
- **Example Types:** Contrast pairs where singular and plural nouns swap sides so `be` changes number (`is↔are`, `was↔were`), plus irregular participles.
- **Common Student Mistakes:**
  1. Matching `be` to the old Subject instead of the new Subject (*"The fresh vegetables **is** washed"*).
  2. Omitting `be` entirely (*"The vegetables washed by the chef"* — turning a Passive into a broken Active past verb).
  3. Using Simple Past (`V2`) instead of Past Participle (*"The song was **sang**"* instead of *"**sung**"*).
- **Proposed Teaching & Activity Alignment:**
  - *Visual Focus:* `WordInspectorPopup` on `be` (`Tense & New-Subject Agreement`) + `V-en` (`Past Participle`), plus `SentenceBuilder` (`sentence-construction`) to arrange `New Subject + be + V-en + by-phrase` tiles.

---

### Topic 3: Voice Across Verb Tenses, Aspects & Modals (`Intermediate`)
- **Learning Objective:**
  - *Understand:* Across tenses, aspects, and modals, the **original time/aspect/modal markers stay intact**, while `be + Past Participle` slots in at the end of the verb chain.
  - *Identify & Construct:* Transform sentences accurately across Simple Present (`is/are + V-en`), Present Progressive (`is/are + being + V-en`), Present Perfect (`has/have + been + V-en`), Simple Past (`was/were + V-en`), Past Progressive (`was/were + being + V-en`), Past Perfect (`had + been + V-en`), Future Time (`will be + V-en` / `is going to be + V-en`), and Modals (`can/must/should/may + be + V-en`). Recognise that Perfect Continuous and Future Continuous forms are not normally passivised.
- **Prerequisite Knowledge:** `Tenses: Time and Verb Forms` (`Already available`); self-contained Modal bridge (`Not yet available` as standalone lesson).
- **Explanation Required:**
  - Present a clean **Passive Verb-Chain Builder** showing how `be` changes shape to preserve aspect:
    - **Simple:** `am/is/are` or `was/were` + `V-en` (*"Farmers grow millet"* → *"Millet **is grown**..."*)
    - **Progressive / Continuous:** `am/is/are/was/were + being` + `V-en` (*"Arjun is drawing a map"* → *"A map **is being drawn**..."*)
    - **Perfect:** `has/have/had + been` + `V-en` (*"Mira has watered the rose bush"* → *"The rose bush **has been watered**..."*)
    - **Future Time & Modals:** `will / going to / can / must / should + be` + `V-en` (*"Students must wear clean shoes"* → *"Clean shoes **must be worn**..."*)
  - Explain clearly in plain language why **Perfect Continuous** (*"has been planting"*) and **Future Continuous** (*"will be planting"*) lack standard passive equivalents (stacking `be been being` is unidiomatic).
  - *Note on terminology:* Use dual-friendly aspect tags (`Progressive / Continuous`) in student UI without naming boards or tense-count debates.
- **Example Types:** Science lab processes, timetable notices, school sports drills, environmental care rules (with modals).
- **Common Student Mistakes:**
  1. Dropping `being` in Continuous passives (*"The chart **is painted** right now"* instead of *"**is being painted**"*).
  2. Dropping `been` in Perfect passives (*"The homework **has completed**"* instead of *"**has been completed**"*).
  3. Changing tense when converting (e.g., converting Present Simple Active into Past Simple Passive).
  4. Confusing active Perfect (`has written`) with passive (`has been written`).
- **Proposed Teaching & Activity Alignment:**
  - *Visual Focus:* Verb-chain stack showing `Tense/Modal Slot` + `Aspect Marker (being / been)` + `Past Participle (V-en)`.
  - *WordLab Task:* `missing-words` — Complete partial passive sentences with the exact tense/aspect/modal `be + V-en` chain (`is being repaired` vs `is repaired` vs `has been repaired`).

---

### Topic 4: Pronoun Case Swaps, Two Objects (`SVOO`), Questions & Imperatives (`Intermediate`)
- **Learning Objective:**
  - *Understand:* Moving a pronoun between Subject and `by`-Object positions requires changing its grammatical **case** (`I↔me, we↔us, he↔him, she↔her, they↔them, who↔whom`); sentences with **two Objects (`SVOO`)** allow two valid passives; **Questions** keep inverted auxiliary-before-Subject order; and **Imperatives** use `Let + Object + be + V-en` or polite request frames.
  - *Construct:* Accurately transform sentences containing pronouns, `SVOO` verbs (`give, send, lend, teach, tell`), Yes/No & Wh- questions, and instructions/requests.
- **Prerequisite Knowledge:** `Sentence Types & Clause Patterns` (`Already available` for `SVOO`, Questions, Imperatives); built-in `Pronouns & Case` bridge (`Not yet available` as standalone lesson).
- **Explanation Required:**
  - **1. Compact Pronoun Case Table (Self-Contained Bridge):** `I ↔ by me`, `we ↔ by us`, `you ↔ by you`, `he ↔ by him`, `she ↔ by her`, `it ↔ by it`, `they ↔ by them`, `who ↔ by whom`.
  - **2. Two-Object (`SVOO`) Sentences:** *"The librarian lent **our class** (`IO`) **three atlases** (`DO`)."*
    - *Option A (Recipient becomes Subject — most common):* *"**Our class** was lent three atlases by the librarian."*
    - *Option B (Thing becomes Subject — add `to` or `for`):* *"**Three atlases** were lent **to** our class by the librarian."*
  - **3. Questions (Interrogatives):** Convert mentally via statement order or keep the first auxiliary before the new Subject:
    - Yes/No: *"Did Arjun plant the saplings?"* → *"Were the saplings planted by Arjun?"* (Note: `do/does/did` disappears and is replaced by `is/are/was/were`!).
    - Wh-: *"Who wrote Gitanjali?"* → *"By whom was Gitanjali written?"* (and note natural conversational *"Who was Gitanjali written by?"*).
  - **4. Imperatives:**
    - Command/Instruction: *"Boil drinking water."* → *"Let drinking water be boiled."* (or *"Drinking water should be boiled."* for advice).
    - Polite Request: *"Please pass the attendance register."* → *"You are requested to pass the attendance register."*
- **Example Types:** Classroom borrowing (`SVOO`), school quiz questions (`Who invented / When did...`), hygiene & noticeboard rules.
- **Common Student Mistakes:**
  1. Leaving Subject-case pronouns after `by` (*"The kite was flown **by he**"*).
  2. Keeping `did/do/does` inside a Passive question (*"Did the window broken by the wind?"*).
  3. Failing to invert the auxiliary in a Passive question (*"The books were returned by Mira?"* without subject-auxiliary inversion).
  4. Dropping `to/for` when promoting the Direct Object of `SVOO` (*"A certificate was given Arjun"*).
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `word-replacement` / `sentence-construction` — Convert `Who / They / She` pronouns and assemble inverted passive questions and `SVOO` alternatives.

---

### Topic 5: Using or Omitting the `by`-Phrase & When Passive Is Natural (`Intermediate` → `Advanced`)
- **Learning Objective:**
  - *Understand:* The `by + doer` phrase is **not mandatory** in Passive Voice. Good English **omits** it when the doer is unknown, obvious from context, general (`people, someone, everybody, they`), or less important than the action/result. Also recognise why Passive Voice is the preferred natural choice in scientific processes, news/announcements, and heritage history—and know when verbs naturally take **`with`, `in`, or `to`** instead of `by`.
  - *Identify & Construct:* Decide whether a Passive sentence should **keep** or **omit** the `by`-phrase, and rewrite vague-doer sentences (`Someone`, `People`) cleanly in Passive Voice.
- **Prerequisite Knowledge:** Topics 1–4.
- **Explanation Required:**
  - **When to OMIT `by + doer`:**
    1. *Unknown doer:* *"Someone left an umbrella in the corridor."* → *"An umbrella was left in the corridor."* (NOT *"...by someone"*).
    2. *General/obvious doer:* *"People grow tea in Assam."* → *"Tea is grown in Assam."* / *"The police caught the thief"* → *"The thief was caught."*
    3. *Process/result focus:* *"First, the grains are washed and dried in the sun."*
  - **When to KEEP `by + doer`:** When the specific creator/discoverer/agent carries essential information (*"The telescope was built **by** Galileo"*; *"This mural was painted **by** our school art club"*).
  - **Doer (`by`) vs Instrument/State (`with / in / to`):** Briefly show *"The wood was carved **by** the artisan **with** a sharp chisel"* (`by` = person, `with` = tool) and *"The courtyard was filled **with** sunlight"*.
- **Example Types:** Indian heritage monuments (Konark, Ajanta, Nalanda), rainwater harvesting steps, food preparation hygiene, school lost-and-found notices.
- **Common Student Mistakes:**
  1. Mechanically appending *"...by someone"* or *"...by people"* or *"...by them"* to every passive transformation.
  2. Using `by` for a physical tool/ingredient (*"The apple was sliced **by** a knife"* instead of *"**with** a knife"*).
  3. Believing Passive Voice is "bad grammar" even in science or process writing where the receiver is the natural topic.
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `error-identification` / `choice-diagnose` — Compare a clunky passive draft (*"Fresh laddoos are made from gram flour by people in festive kitchens"*) against a natural concise passive (*"Fresh laddoos are made from gram flour in festive kitchens"*).

---

### Topic 6: Sentences That Cannot Be Made Passive — Intransitive & Linking Verbs (`Advanced`)
- **Learning Objective:**
  - *Understand:* Only **Transitive verbs** (verbs that pass action onto an Object in `SVO`, `SVOO`, or `SVOC`) can form a standard Passive Voice. **Intransitive verbs (`SV`, `SVA`)** and **Linking verbs (`SVC`)** have **no Object** to become the Passive Subject—and not every `be + -ed` sentence is Passive Voice!
  - *Identify:* Separate passivisable (`SVO/SVOO`) sentences from non-passivisable (`SV`, `SVA`, `SVC`, and possession/state verbs like *have, belong, resemble, cost*) and distinguish true Passives from `be + Adjective` complements.
- **Prerequisite Knowledge:** `Sentence Types & Clause Patterns` (`Already available` — Transitive vs Intransitive vs Linking `SVC`).
- **Explanation Required:**
  - **The Object Test (`Verb + what / whom?`):**
    - *"The goalkeeper caught **the ball**."* (`caught what?` → `the ball` = Object → **Can be Passive**: *"The ball was caught..."*).
    - *"The school bus arrived **at 8 a.m.**"* (`at 8 a.m.` = Time Adverbial, NOT Object → **Cannot be Passive!**).
    - *"The river water feels **cool**."* (`cool` = Subject Complement describing `water`, NOT Object → **Cannot be Passive!**).
  - **Descriptive `be + -ed` Adjective Trap:** *"The students were **interested** in astronomy"* looks like `be + V-en`, but `interested` describes the students' feeling (like *happy*), not an action performed by an agent! Test with *"very"* (*"very interested"* works; *"very caught"* fails).
- **Example Types:** Mixed sets pairing an active transitive sentence with a deceptive `SVA` or `SVC` distractor (*"sat on the bench"*, *"slept peacefully"*, *"became captain"*, *"belongs to our school"*).
- **Common Student Mistakes:**
  1. Treating a prepositional place/time phrase after an intransitive verb as an Object (*"The park was walked in by Arjun"* from *"Arjun walked in the park"*).
  2. Forcing linking sentences into passive (*"A doctor was become by Priya"*).
  3. Misidentifying `is closed / was tired / looked worried` adjectives as Passive actions when they express states.
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `categorise` — Two-bucket diagnostic sort: **"Can Become Passive (Has an Object)"** vs **"Cannot Become Passive (No Object: Intransitive / Linking)"**.

---

### Topic 7: Spotting and Fixing Common Voice Errors (`Advanced`)
- **Learning Objective:**
  - *Identify & Construct:* Diagnose and repair multi-error Active ↔ Passive drafts using a structured **5-Point Voice Checklist**.
- **Prerequisite Knowledge:** Topics 1–6.
- **Explanation Required:**
  - Teach the **5-Point Voice Check**:
    1. **Object Check:** Does the active verb actually have an Object?
    2. **Subject & Pronoun Case:** Did the Object move cleanly into Subject case (and any retained agent into Object case after `by`)?
    3. **`be` Auxiliary Match:** Does `be` carry the **exact original tense/aspect/modal** AND **agree in number/person with the new Subject**?
    4. **Past Participle Check:** Is the main verb in `V-en / V3` form (never base `V1` or simple past `V2`)?
    5. **`by`-Phrase Check:** Is `by + doer` needed, or should a vague doer (`someone/people`) be dropped?
- **Example Types:** Authentic broken school bulletin notices, science notes, and student exam slips combining common slips.
- **Common Student Mistakes:** Missing hidden agreement shifts, forgetting `being`/`been`, using `V2` for `V3`, or keeping `did` inside passive questions.
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `error-identification` — Students diagnose the exact grammatical flaw in a broken passive draft and select/verify the repaired version.
  - *Independent Practice:* `IndependentPracticeStage` items moving from `gentle` → `minimal` → `none` cues.

---

## 6. Architecture & Engine Integration Plan (Phase 2 Readiness)

When approved for Phase 2, **Active and Passive Voice** will plug into Grammar Quest's existing JSON-driven engine with **zero new libraries** and **zero changes to existing lessons or Home/Lessons layout**:
- **Catalogue Link:** Activate existing `topic-voice` in `src/content/curriculumCatalog.ts` (`cat-voice-speech`: `"Voice, Speech & Mechanics"`).
- **Characters:** **Mira** (notices focus shifts & broken drafts), **Arjun** (hands-on swaps & pronoun/agreement traps), and **Gyan** (concise rules & checklists in `GuideNotePopup`).
- **Teaching Stage (`GrammarTeachingEngine` + `TeachingSequence`):** Uses `compare-dual` (Active vs Passive spotlight), `split-blueprint`, `WordInspectorPopup` (`be` auxiliary vs `V-en` participle), and `guided-explore`.
- **Guided Practice (`WordLaboratory` A–F):** Uses existing `categorise` (Doer vs Receiver; Can vs Cannot Become Passive), `sentence-construction` (assembling passive word order), `word-replacement` (pronoun case & `be` agreement swaps), `missing-words` (tense/aspect/modal `be + V-en` chains), and `error-identification` (5-point error repair & redundant `by someone` fixes).
- **Independent Practice (`IndependentPracticeStage`) & Formal Assessment (`AssessmentRunner`):** Uses existing `dual-identify`, `token-and-choice`, `choice-diagnose`, and a 10-MCQ post-submit assessment persisted in IndexedDB.

---

## 7. Cross-Textbook Conflicts & Coverage Gaps *(Internal Reference)*

| ID | Gap / Conflict Across Verified Textbooks | How This Blueprint Resolves It |
| :--- | :--- | :--- |
| **GAP-V1** | **Odisha Class IX Has No Voice Chapter (`odisha-learn-practise-9`)** | Voice is absent in Odisha Class IX and taught in Class X Ch. 9 (building on Class IX Ch. 2–4 & Ch. 12). Our Topic 1–2 sequence includes short built-in revisions for `V-en` participles and `S+V+O` vs `S+V+C` so all learners can start smoothly without needing a separate prerequisite module first. |
| **GAP-V2** | **PSEB Class X Textbook Absent (`pseb-grammar-in-use-9` only)** | PSEB covers Voice in Class IX Ch. 6 (pp. 61–73). No PSEB Class X book exists in the supplied set, so advanced edge cases (`SVOC` / `by`-omission / non-passivisable linking verbs) rely on Odisha X Ch. 9, Assam Ch. 11, and `supplementary-bridge` explanations. |
| **CONFLICT-V1** | **Verb Notation: `be + en` (Odisha) vs `be + V3` (PSEB) vs `Strong/Weak Past Participle` (Assam)** | Student-facing UI uses plain **Past Participle** with a lightweight `(V-en / V3)` helper tag where helpful, avoiding rigid single-board jargon. |
| **CONFLICT-V2** | **Tense Classification: 2-Tense + Future Time (Odisha) vs 12-Tense Model (PSEB & Assam)** | Topic 3 organises passive verb chains cleanly by **time + aspect (`Simple`, `Progressive/Continuous`, `Perfect`, `Future Time & Modals`)** so every verb pattern works identically under both models without trap MCQs about *"how many tenses exist."* |
| **GAP-V3** | **Missing Pronoun Case & Modal Lessons in Current App** | `topic-pronouns` and `topic-auxiliaries-modals` are currently `upcoming` in `curriculumCatalog.ts`. Compact self-contained mini-bridges are built into Topics 3 and 4 rather than assuming mastery from unfinished lessons. |
| **GAP-V4** | **Recorded Print Glitches in Odisha X Ch. 9 (`content-gaps.md`)** | `content-gaps.md` records p. 93 typo *"an opposition"* (for *an apposition*) and p. 100 typo *"be blamed"* / `(1)` numbering glitch. Phase 2 authoring will ensure clean edited grammar terminology and verified wording. |
| **GAP-V5** | **Raw PDF Files Absent in Workspace Container** | Sub-section headings and verbatim page exercises inside Odisha X Ch. 9 (pp. 90–105), PSEB IX Ch. 6 (pp. 61–73), and Assam Ch. 11 (pp. 186–193) are not stored in `curriculum-source-map.json`. All new examples and exercises in Phase 2 will be tagged `original-practice` or `supplementary-bridge`, and any verbatim textbook extracts must be verified against the original PDFs first. |

---

*Awaiting your review and approval before starting Phase 2 (Story, Interactive Visual Engine Steps, WordLab Activities & Assessment Authoring).*
