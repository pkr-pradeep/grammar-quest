# Grammar Quest — Phase 1 Curriculum & Learning Design Blueprint
## Lesson: Prepositions

**Catalogue Topic ID:** `topic-prepositions`  
**Lesson Group:** Connectors & Prepositions (`cat-connectors`)  
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
| **Odisha BSE — *Learn and Practise Grammar Class - X*** (`odisha-learn-practise-10`) | Board of Secondary Education, Odisha<br>New Ed. 2013, 2019 | • **Chapter 5: Prepositions** (Book pp. **39–57** / PDF pp. **45–63**)<br>• *(Distinct boundary)* **Chapter 6: Phrasal Verbs** (Book pp. **58–70** / PDF pp. **64–76**)<br>• *(Cross-ref)* **Ch. 9: The Passive** (pp. 90–105 / PDF pp. 96–111) | • Dedicated 19-page chapter on Prepositions, cleanly separated from **Phrasal Verbs** in the immediately following chapter (Ch. 6).<br>• Recorded print typo in `content-gaps.md`: Ch. 5 p. 46 prints *"He is ran / He is threw"*. |
| **Punjab PSEB — *A Practice Book of ENGLISH GRAMMAR & COMPOSITION (GRAMMAR IN USE) for Class IX*** (`pseb-grammar-in-use-9`) | Punjab School Education Board (PSEB)<br>Ed. 2021–22 *(No Class X book supplied)* | • **Chapter 3: Prepositions** (Book pp. **27–40** / PDF pp. **33–46**)<br>• *(Cross-refs)* **Ch. 4: Conjunctions** (pp. 41–52 / PDF pp. 47–58) | • Summarised in `curriculum-overview.md` as teaching **Time, place, direction, and fixed prepositional uses** (14 book pages). |
| **Assam SEBA — *A NEW METHOD English Grammar For Class IX & X*** (`assam-new-method-9-10`) | Board of Secondary Education, Assam (SEBA)<br>11th Ed. 2023 *(Combined IX–X)* | • **Chapter 14: Position of Prepositions** (Book pp. **214–241** / PDF pp. **223–250**)<br>• *(Boundary / Cross-refs)* **Ch. 10: Special Verbs — Group/Phrasal Verbs** (pp. 166–185 / PDF pp. 175–194), **Ch. 13: Adverbials** (pp. 205–213 / PDF pp. 214–222) | • 28-page chapter titled **Position of Prepositions** covering preposition usage and placement, sitting alongside Ch. 13 (*Adverbials*) and Ch. 10 (*Group/Phrasal Verbs*). |
| **Odisha BSE — *LEARN AND PRACTISE GRAMMAR CLASS - IX*** (`odisha-learn-practise-9`) | Board of Secondary Education, Odisha<br>New Ed. 2012, 2019 | • **No dedicated Prepositions chapter**<br>• *(Introductory mention)* **Ch. 1 Sec. C: Word Classes** (Book pp. **8–22** / PDF pp. **14–28**)<br>• *(Cross-refs)* **Ch. 5–6: Noun Phrase & Modifiers** (pp. 74–81), **Ch. 10: Adverbs and Adverbials** (pp. 117–134 / PDF pp. 123–140), **Ch. 12: Predicate Phrase** (`S+V+A`, pp. 141–146) | • Introduces Preposition only at word-class recognition level in Ch. 1 Sec. C and uses prepositional phrases inside Noun Phrases (Ch. 6) and Adverbials (Ch. 10, 12), deferring full prepositional system mastery to Ch. 5 of the next volume. |

---

## 2. Learning Scope & Boundary Decisions

### 2.1 Existing Architecture & Ready-Lesson Context
In `src/content/curriculumCatalog.ts`, **Prepositions** already exists as `topic-prepositions` inside the **`Connectors & Prepositions`** group (`cat-connectors`), paired with `Conjunctions` (`topic-conjunctions`).

### 2.2 Explicit Scope Boundaries with Other Lessons

| Adjacent Grammar Lesson | Status in App | Boundary Decision for *Prepositions* |
| :--- | :--- | :--- |
| **Subject and Predicate** (`topic-subject-predicate`) & **Sentence Types & Clause Patterns** (`topic-sentence-types`) | `Already available` | Reuses **Prepositional Phrase** recognition (*no finite verb!*) and **Adverbial (`A`) / Post-modifier** roles without re-teaching clause patterns or Subject/Predicate from scratch. |
| **Tenses: Time and Verb Forms** (`topic-tenses`) | `Already available` | Connects directly to **`for` (duration)** vs **`since` (starting point)** already introduced alongside Present Perfect timelines. |
| **Subject–Verb Agreement** (`topic-sva`) | `Already available` | Briefly recalls why a **prepositional phrase inside the Subject** (*"The basket **of ripe mangoes**..."*) never steals verb agreement—helping learners recognise the boundaries of prepositional phrases. |
| **Phrasal Verbs** (`topic-phrasal-verbs`) | `Not yet available` | Keeps idiomatic multi-word verb particles (*give up, look after, put off, call on*) out of core Prepositions mastery. Topic 6 teaches only the clear structural distinction between **literal preposition + noun object** vs **idiomatic verb + particle**. |
| **Conjunctions** (`topic-conjunctions`) | `Not yet available` | Clarifies a key structural boundary in Topic 1–2: words like **`before, after, until, since, for`** act as **Prepositions** before a **noun/noun phrase** (*"before lunch"*), and as **Conjunctions** before a **clause with a finite verb** (*"before the bell rang"*). |
| **Noun Phrases & Modifiers** (`topic-noun-phrases`) & **Pronouns & Case** (`topic-pronouns`) | `Not yet available` | Includes a lightweight 2-line reminder inside Topic 1 that the object of a preposition can be a noun, a noun group (*"the old banyan tree"*), an `-ing` verbal noun (*"by reading carefully"*), or an object-case pronoun (*"for him / between us"*). |
| **Active and Passive Voice** (`topic-voice`) | Co-developed independent lesson (`topic-voice`) | Cross-references **`by` (doer/agent)** vs **`with` (tool/instrument)** in Topic 5 while remaining 100% standalone so learners can complete Prepositions before or after Voice. |

---

## 3. Prerequisite Concepts & Readiness Status

| Prerequisite Concept | Source Lesson in Grammar Quest | Availability Status | How This Lesson Handles It |
| :--- | :--- | :--- | :--- |
| **1. Phrases vs Clauses (Prepositional Phrases have no finite verb) & Adverbials (`A`)** | *Sentence Types & Clause Patterns* (`topic-sentence-types`) | **Already available** | Activated directly in Topic 1 to group `Preposition + Object` into one clean phrase unit. |
| **2. Intervening Prepositional Phrases Inside Subjects** | *Subject and Predicate* (`topic-subject-predicate`) & *Subject–Verb Agreement* (`topic-sva`) | **Already available** | Reinforced lightly in Topic 1 so students see `of/in/on + Noun` phrases clearly as modifier blocks. |
| **3. `for` (Duration) vs `since` (Starting Point) Time Markers** | *Tenses: Time and Verb Forms* (`topic-tenses`) | **Requires a short revision** | Quickly recalled and contrasted with `from...to`, `during`, `by`, and `until` in Topic 2. |
| **4. Noun Groups as Prepositional Objects** | *Noun Phrases & Pre/Post-Modifiers* (`topic-noun-phrases`) | **Not yet available** | Topic 1 includes a compact reminder that the object after a preposition includes its determiners and adjectives (*"under **the cool neem tree**"*). |
| **5. Object-Case Pronouns After Prepositions (`me, us, him, her, them`)** | *Pronouns & Case* (`topic-pronouns`) | **Not yet available** | Topic 1 includes an inline reminder (*"between you and **me**"*, never *"between you and I"*). |
| **6. Prepositions vs Verb Particles (Phrasal Verbs) & Clause Conjunctions** | *Phrasal Verbs* (`topic-phrasal-verbs`) & *Conjunctions* (`topic-conjunctions`) | **Not yet available** | Topics 2 and 6 provide clean boundary tests (*followed by a noun phrase vs followed by a clause / idiomatic verb meaning*). |

---

## 4. Proposed Topic Structure & Teaching Sequence (6 Scaffolded Topics)

Instead of presenting a flat alphabetical memorisation list of prepositions, the lesson builds **visual spatial/time intuition first**, then shows **how context shifts meaning**, and finishes with **error-proofing and placement**.

| Order | Topic Title | Difficulty Level | Core Focus |
| :---: | :--- | :--- | :--- |
| **1** | **Meaning & Role of Prepositions and Prepositional Phrases** | `Beginner` | What prepositions link (`Preposition + Object`), spotting complete Prepositional Phrases, object-case pronouns after prepositions, and how swapping one preposition shifts meaning. |
| **2** | **Prepositions of Time (`at, on, in, since, for, by, until, during`)** | `Beginner` → `Intermediate` | Point/day/span (`at, on, in`), starting point vs duration (`since` vs `for` vs `during`), deadline vs continuous limit (`by` vs `until`), and zero-preposition time words (`yesterday, tomorrow, next week`). |
| **3** | **Prepositions of Place & Static Position (`at, in, on, between, among, beside, over, under`)** | `Intermediate` | Point/enclosure/surface (`at, in, on`), two vs group (`between` vs `among`), vertical position (`above/over` vs `below/under`), and `beside` vs `besides` / `in front of` vs `opposite`. |
| **4** | **Prepositions of Direction & Movement (`to, into, onto, towards, through, across, along, from`)** | `Intermediate` | Static location vs motion entry (`in` vs `into`, `on` vs `onto`), goal vs direction (`to` vs `towards`), and path shape (`across` a surface vs `through` a 3D space vs `along` a line). |
| **5** | **Relationships, Means, Origin & Context-Dependent Meaning Shifts** | `Intermediate` → `Advanced` | Agency vs tool (`by` vs `with`), transport patterns (`by train` vs `in a car` vs `on foot`), material (`made of` vs `made from`), and how context shifts one preposition across space, time, and abstract roles. |
| **6** | **Placement, Commonly Confused Pairs, Zero-Preposition Verbs & Phrasal Boundary** | `Advanced` | Avoiding extra prepositions after transitive verbs (`discuss, enter, reach, order, await`), natural placement (including *Wh*-questions), confused pairs (`in/within`, `beside/besides`), and Preposition vs Phrasal Verb boundary. |

---

## 5. Topic-by-Topic Learning Design

All examples adhere to Grammar Quest's Indian school, science, nature, heritage, and **Healthy Food & Lifestyle** guidelines.

---

### Topic 1: Meaning & Role of Prepositions and Prepositional Phrases (`Beginner`)
- **Learning Objective:**
  - *Understand:* A preposition is a relational bridge word that links a **noun, pronoun (in object case), or noun group** (called the **object of the preposition**) to the rest of the sentence, forming a **Prepositional Phrase**. Changing the preposition changes the relationship and meaning.
  - *Identify:* Highlight a preposition and its complete noun-group object inside a sentence without accidentally grabbing the verb.
- **Prerequisite Knowledge:** `Phrases vs Clauses` (`Already available`), basic nouns/pronouns (`Noun Phrases` / `Pronouns & Case` bridged inline).
- **Explanation Required:**
  - Show a Prepositional Phrase as a two-part team: **`[Preposition] + [Object (Noun / Noun Group / Object Pronoun)]`**.
  - Demonstrate meaning control: *"The water bottle sits **on** / **under** / **beside** / **inside** the wooden desk."* One word swap changes the entire picture!
  - Quick pronoun-case tip: after any preposition, pronouns use object form (*"for **me**"*, *"between Mira and **him**"*—never *"between Mira and he"*).
  - Preposition vs Conjunction check: if `before/after/since` is followed by a **noun phrase** (*"after morning assembly"*), it is a **Preposition**; if followed by a **Subject + finite verb** (*"after assembly ended"*), it acts as a clause linker.
- **Example Types:** Classroom desks, orchard baskets, library shelves, playground directions.
- **Common Student Mistakes:**
  1. Selecting only the single preposition word instead of the full `Preposition + Noun Group` phrase (or cutting off modifiers like *"the old"*).
  2. Using subject pronouns after prepositions (*"between you and I"*).
- **Proposed Teaching & Activity Alignment:**
  - *Visual Focus:* Highlight `Preposition` badge (`Red` per teaching-engine palette) linked by a relation arc (`preposition-relation`) to its `Object Noun Group`.
  - *WordLab Task:* `identify-group` + `word-replacement` — Tap the complete Prepositional Phrase inside a sentence, then swap `on / under / behind` to observe how spatial meaning shifts.

---

### Topic 2: Prepositions of Time (`Beginner` → `Intermediate`)
- **Learning Objective:**
  - *Understand:* Time prepositions match the **shape of the time expression**—clock points (`at`), days/dates (`on`), longer spans (`in`), past starting points (`since`), total durations (`for`), event spans (`during`), deadlines (`by`), and continuous endpoints (`until/till`)—while certain time words (`yesterday, today, tomorrow, last/next + day`) take **no preposition**.
  - *Identify & Construct:* Choose the accurate time preposition in timetables, routines, and historical/science notes.
- **Prerequisite Knowledge:** Topic 1; `for` vs `since` from `Tenses: Time and Verb Forms` (`Requires a short revision`).
- **Explanation Required:**
  - **The `at → on → in` Time Scale:**
    - **`at`** = exact clock time or point (`at 7:30 a.m.`, `at noon`, `at midnight`, plus fixed `at night`).
    - **`on`** = specific day or calendar date (`on Monday`, `on 15 August`, `on Republic Day morning`).
    - **`in`** = months, seasons, years, centuries, and parts of a day (`in July`, `in monsoon`, `in 2023`, `in the morning/evening`).
  - **Duration, Start Point & Limits:**
    - **`since`** (point when it started: *since 2019, since 8 a.m.*) vs **`for`** (how long it lasted: *for two hours, for five years*) vs **`during`** (inside a named event/period: *during the winter camp*).
    - **`by`** (not later than deadline: *"Submit the chart **by** Friday"*) vs **`until / till`** (continuing up to a stop point: *"The library stays open **until** 5 p.m."*).
  - **Zero-Preposition Time Trap:** Do **not** add `on/in/at` before `yesterday, today, tomorrow, this morning, last Sunday, next week, every day`.
- **Example Types:** School schedules, morning hygiene/meal routines, ISRO mission dates, monsoon seasons.
- **Common Student Mistakes:**
  1. Using `in` for days/dates (*"in Monday"*) or `on` for months/years (*"on July"*).
  2. Mixing up `since` and `for` (*"since three days"*).
  3. Adding `on` before `tomorrow / yesterday / next Friday`.
  4. Using `until` for a one-shot deadline (*"Return the book until Friday"* instead of *"**by** Friday"*).
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `categorise` — Sort time expressions (`7:15 a.m.`, `Wednesday`, `October`, `15 August`, `noon`, `monsoon`) into `at`, `on`, and `in` buckets, followed by `missing-words` for `since / for / by / until / during / (no preposition)`.

---

### Topic 3: Prepositions of Place & Static Position (`Intermediate`)
- **Learning Objective:**
  - *Understand:* Static place prepositions signal whether a location is viewed as a **point/event (`at`)**, an **enclosed/3D area (`in`)**, or a **surface/line (`on`)**, and accurately distinguish relative positions (`between` vs `among`, `above/over` vs `below/under`, `beside` vs `besides`, `in front of` vs `opposite`).
  - *Identify & Construct:* Describe where objects and places are located on a map, table, or scene without motion.
- **Prerequisite Knowledge:** Topic 1.
- **Explanation Required:**
  - **`at / in / on` for Place:**
    - **`at`** = point, meeting spot, or specific address/event (*at the school gate, at the railway station, at desk 4*).
    - **`in`** = inside a container, room, city, state, or country (*in the tiffin box, in the library, in Guwahati, in India*).
    - **`on`** = touching a surface or line (*on the chalkboard, on the shelf, on the river bank*).
  - **High-Confusion Static Contrasts:**
    - **`between`** (distinctly two items—or individually named items) vs **`among`** (surrounded by a group of three or more).
    - **`above / over`** (higher than; `over` often implies directly covering) vs **`below / under`** (lower than; `under` often implies directly beneath/covered).
    - **`beside`** (next to) vs **`besides`** (in addition to / apart from).
    - **`in front of`** (ahead in the same row/line) vs **`opposite`** (across and facing each other).
- **Example Types:** School courtyard layout, classroom benches, healthy meal table setting, Indian cities & rivers.
- **Common Student Mistakes:**
  1. Writing *"The chart is **in** the wall"* instead of *"**on** the wall"*, or *"Wait **in** the bus stop"* instead of *"**at** the bus stop"*.
  2. Using `between` for an unseparated crowd (*"between all the villagers"*) or `among` for two people (*"among Mira and Arjun"*).
  3. Confusing `beside` (place) with `besides` (addition).
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `word-replacement` — Swap static prepositions (`at / in / on` or `between / among / beside`) in a courtyard description and inspect how the spatial picture changes.

---

### Topic 4: Prepositions of Direction & Movement (`Intermediate`)
- **Learning Objective:**
  - *Understand:* English separates **resting in/on a place (`in`, `on`, `at`)** from **moving into/onto/towards a place (`into`, `onto`, `to`, `towards`)**, and distinguishes **path geometry** (`across` a flat surface, `through` a 3D volume/opening, `along` a line/path, `from...to` origin to destination).
  - *Identify & Construct:* Pair verbs of motion (*walk, jump, pour, cycle, flow, fly*) with accurate directional prepositions.
- **Prerequisite Knowledge:** Topic 3 (static `at / in / on`).
- **Explanation Required:**
  - **Static vs Motion Pairs:**
    - `in` (already inside: *"The milk is **in** the jug"*) vs `into` (entering from outside: *"Pour the warm milk **into** the glass"*).
    - `on` (resting on: *"The cat sits **on** the wall"*) vs `onto` (climbing/landing onto: *"The cat jumped **onto** the wall"*).
    - `to` (reaches the destination: *"We walked **to** the museum"*) vs `towards` (heading in that direction, may not arrive yet: *"Dark clouds drifted **towards** the hills"*).
  - **Path Shapes:**
    - **`across`** = from one side to the other over a surface/area (*across the wooden bridge, across the field*).
    - **`through`** = entering, moving inside, and exiting a 3D space or barrier (*through the forest, through the tunnel, through the open window*).
    - **`along`** = following the length of a path/river/road (*along the canal, along the corridor*).
- **Example Types:** Cycling to school, crossing bridges, pouring water/milk, birds flying through trees, river paths.
- **Common Student Mistakes:**
  1. Using `in` / `on` for entry motion (*"Mira walked **in** the classroom"* when entering from outside, or *"The frog jumped **in** the pond"*).
  2. Confusing `across` (surface crossing) with `through` (3D passage: *"walked **across** the tunnel"* ✗ → *"**through** the tunnel"* ✓).
  3. Confusing `to` (endpoint) with `towards` (direction only).
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `missing-words` / `categorise` — Contrast static vs motion frames (`in` vs `into`, `on` vs `onto`, `across` vs `through` vs `along`).

---

### Topic 5: Relationships, Means, Origin & Context-Dependent Meaning Shifts (`Intermediate` → `Advanced`)
- **Learning Objective:**
  - *Understand:* Prepositions express abstract relationships—**doer vs tool (`by` vs `with`)**, **transport & medium (`by train` vs `in a car` vs `on foot`, `in ink`)**, **purpose/benefit (`for`)**, **origin/material (`made of` vs `made from`)**, and **topic (`about`, `of`)**. Crucially, **prepositions do not have one fixed meaning**: context determines which meaning a preposition carries, and swapping a preposition alters the sentence's meaning.
  - *Identify & Construct:* Select accurate prepositions for agency, instrument, transport, material, and abstract context, and explain how context changes a single preposition's role.
- **Prerequisite Knowledge:** Topics 1–4.
- **Explanation Required:**
  - **Agency (`by`) vs Instrument (`with`):** *"The bamboo basket was woven **by** the artisan **with** thin strips."* (`by` = person/agent or mode without article; `with` = physical tool or accompaniment).
  - **Transport Rule Pattern:** `by + vehicle` (no `a/the`: *by bus, by train, by bicycle*), **but** `in a car / in a taxi`, `on a bus / on a bicycle`, and always **`on foot`** (never *by foot*).
  - **Material (`made of` vs `made from`):** `made of` when the original material remains recognisable (*"benches **made of** teak wood"*); `made from` when transformed into a new substance (*"curd **made from** milk"*).
  - **The Context-Shift Spotlight (No Single Rigid Rule!):**
    - Show **one preposition in four contexts**: **`in`** the box (*place*), **`in`** July (*time*), **`in`** blue ink (*medium*), **`in`** a hurry (*state/manner*). Show **`by`** the window (*place*), **`by`** 5 p.m. (*time*), **`by`** bus (*means*), **`by`** Rabindranath Tagore (*creator*).
    - Show **one verb + different prepositions**: *"care **for** saplings"* vs *"look **at** the map"* vs *"wait **for** the train"* vs *"listen **to** the teacher"*.
- **Example Types:** Handicrafts, healthy food preparation (`curd from milk`, `cut with a knife`), school commuting, Indian literature/science attributions.
- **Common Student Mistakes:**
  1. Using `by` for tools (*"cut the mango **by** a knife"* instead of *"**with** a knife"*).
  2. Writing *"**by** foot"* or *"**in** train"* (without article) instead of *"**on** foot"* / *"**by** train"*.
  3. Assuming `for`, `by`, or `in` has only one textbook meaning (e.g., thinking `by` only marks Passive Voice).
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `word-replacement` & `categorise` — Inspect how one preposition (`by` or `in`) shifts role across 4 sentences (Place vs Time vs Means/Medium vs Agent), plus tool/transport selection (`with` vs `by`, `on foot`).

---

### Topic 6: Placement, Commonly Confused Pairs, Zero-Preposition Verbs & Phrasal Boundary (`Advanced`)
- **Learning Objective:**
  - *Understand:* Certain transitive verbs take a Direct Object **without** a preposition (`discuss, enter, reach, order, await, resemble, answer`); prepositions normally precede their objects (`Preposition + Object`) but naturally sit at the end in *Wh*-questions and everyday relative clauses (*"Which book are you looking **for**?"*); and **Prepositions + Noun Objects** differ from **Phrasal Verbs** (`verb + particle`).
  - *Identify & Repair:* Fix unnecessary-preposition errors, distinguish confused pairs (`in` vs `within`, `beside` vs `besides`, `agree with` a person vs `agree to` a proposal), and identify natural placement.
- **Prerequisite Knowledge:** Topics 1–5; `Sentence Types & Clause Patterns` (`Already available` — Transitive verbs).
- **Explanation Required:**
  - **Zero-Preposition Transitive Verbs (Top Exam & Everyday Traps):**
    - *"We discussed ~~about~~ the science project."* → *"We discussed the science project."*
    - *"The students entered ~~into~~ the hall quietly."* → *"The students entered the hall quietly."* *(Note: `enter into` is only idiomatic for abstract agreements like `enter into a contract`, not physical rooms!)*
    - *"The train reached ~~at/to~~ Bhubaneswar at noon."* → *"The train reached Bhubaneswar at noon."* (Contrast: `arrived at / in`, `replied to`, `listened to` DO need prepositions!).
  - **Commonly Confused Time/Place/Usage Pairs:**
    - `in` (at the end of a period: *"in ten minutes"*) vs `within` (before the period finishes: *"within ten minutes"*).
    - `agree with` (a person/opinion) vs `agree to` (a plan/proposal).
    - `wait for` (await someone/something) vs `wait on` (serve someone, e.g. at table).
  - **Placement Awareness:** Prepositions sit before their objects (*"She sits **near the window**"*), but move naturally to the end when the object is a *Wh*-word or omitted relative pronoun (*"What are you writing **with**?"*, *"The topic we talked **about**"*), while noting formal fronting (*"With what..."* / *"About which..."*).
  - **Phrasal Verb Boundary (`topic-phrasal-verbs`):** *"Look **up** the chimney"* (`up` = directional preposition + object `the chimney`) vs *"Look **up** the word in a dictionary"* (`look up` = single idiomatic phrasal verb meaning *search*).
- **Example Types:** Proofreading school newsletters, library Q&A dialogues, travel arrival notices.
- **Common Student Mistakes:**
  1. Adding `about/into/to/for` after `discuss, enter, reach, order, await`.
  2. Believing a preposition can *never* appear at the end of a question (*"Who are you looking for?"* is natural English).
  3. Confusing `in` vs `within` or `agree with` vs `agree to`.
- **Proposed Teaching & Activity Alignment:**
  - *WordLab Task:* `error-identification` + `sentence-construction` — Spot and remove redundant prepositions (`discuss about`, `entered into the room`, `reached to school`) and build natural prepositional questions.
  - *Independent Practice:* Mixed transfer items from `gentle` → `minimal` → `none` cues.

---

## 6. Architecture & Engine Integration Plan (Phase 2 Readiness)

When approved for Phase 2, **Prepositions** will integrate cleanly into Grammar Quest's existing JSON-driven architecture with **zero new libraries** and **zero redesign of existing screens**:
- **Catalogue Link:** Activate existing `topic-prepositions` in `src/content/curriculumCatalog.ts` (`cat-connectors`: `"Connectors & Prepositions"`).
- **Characters:** **Mira** (visual scenes & courtyard/map observations), **Arjun** (hands-on preposition swaps & everyday errors), and **Śukaji** (concise patterns & boundary notes in `GuideNotePopup`).
- **Teaching Stage (`GrammarTeachingEngine` + `TeachingSequence`):** Uses `preposition-relation` arcs (`WordRelationship`), `WordInspectorPopup` (showing `Preposition` + `Object of Preposition`), `compare-dual` (static vs motion; context shifts), and `guided-explore`.
- **Guided Practice (`WordLaboratory` A–F):** Uses `identify-group` (spot the full Prepositional Phrase), `categorise` (`at/on/in` time sorting; static vs motion), `word-replacement` (live spatial/context swap), `missing-words` (`since/for/by/until`, `across/through/along`, `by/with`), `sentence-construction` (assembling prepositional questions & clauses), and `error-identification` (`discuss about`, `by a knife`, `on tomorrow` traps).
- **Independent Practice (`IndependentPracticeStage`) & Formal Assessment (`AssessmentRunner`):** Uses existing `dual-identify`, `token-and-choice`, `choice-diagnose`, and a 10-MCQ post-submit assessment stored in IndexedDB.

---

## 7. Cross-Textbook Conflicts & Coverage Gaps *(Internal Reference)*

| ID | Gap / Conflict Across Verified Textbooks | How This Blueprint Resolves It |
| :--- | :--- | :--- |
| **GAP-P1** | **Odisha Class IX Has No Dedicated Prepositions Chapter (`odisha-learn-practise-9`)** | Odisha IX introduces prepositions only inside Ch. 1 Sec. C (*Word Classes*) and uses them inside Ch. 6/10/12, deferring systematic study to Class X Ch. 5. Topic 1 starts with a visual ground-up Prepositional Phrase foundation so prior knowledge is never assumed blindly. |
| **GAP-P2** | **PSEB Class X Textbook Absent (`pseb-grammar-in-use-9` only)** | PSEB covers Prepositions in Class IX Ch. 3 (pp. 27–40) with no Class X companion supplied. Advanced placement, zero-preposition verbs, and context-shift nuance are supported across Odisha X Ch. 5, Assam Ch. 14, and `supplementary-bridge` notes. |
| **CONFLICT-P1** | **Chapter Framing & Scope Across Books** | PSEB IX Ch. 3 organises by *time, place, direction, fixed uses*; Assam Ch. 14 frames its 28-page unit as *Position of Prepositions*; Odisha X separates Ch. 5 (*Prepositions*) from Ch. 6 (*Phrasal Verbs*), whereas Assam places Group/Phrasal Verbs in Ch. 10. Our 6-topic structure unifies meaning/phrase structure, time, place, direction, abstract/context shifts, and placement/errors while keeping Phrasal Verbs cleanly separated (`topic-phrasal-verbs`). |
| **GAP-P3** | **Upcoming Companion Lessons (`topic-phrasal-verbs`, `topic-conjunctions`, `topic-noun-phrases`, `topic-pronouns`)** | All four companion topics are currently `upcoming` in `curriculumCatalog.ts`. Inline mini-bridges handle noun-group objects, object-case pronouns, `before/after/since` before nouns vs clauses, and literal preposition vs phrasal verb boundaries cleanly. |
| **GAP-P4** | **Recorded Print Typo in Odisha X Ch. 5 (`content-gaps.md`)** | `content-gaps.md` notes a print typo on Odisha X Ch. 5 p. 46 (*"He is ran / He is threw"*). Flagged internally so Phase 2 authoring uses clean, verified grammar examples only. |
| **GAP-P5** | **Raw PDF Files Absent in Workspace Container** | Sub-section lists and fixed-preposition exercise tables inside Odisha X Ch. 5 (pp. 39–57), PSEB IX Ch. 3 (pp. 27–40), and Assam Ch. 14 (pp. 214–241) are not expanded beyond chapter titles and page ranges in `curriculum-source-map.json`. Phase 2 items will be tagged `supplementary-bridge` / `original-practice` unless verified directly against the raw PDFs. |

---

*Awaiting your review and approval before starting Phase 2 (Story, Interactive Visual Engine Steps, WordLab Activities & Assessment Authoring).*
