# Grammar Quest — Phase 1 Curriculum & Learning Design Blueprint
## Chapter: Sentence Types & Clause Patterns

**Catalogue Topic ID:** `topic-sentence-types`  
**Syllabus Category:** Sentence Structure & Clauses (`cat-sentence-clauses`)  
**Target Learners:** Classes 9 & 10 (Indian Secondary English Grammar)  
**Phase Status:** Phase 1 — Curriculum Design & Content Architecture *(Implementation deferred pending approval)*

---

## 1. Curriculum Sources Reviewed & Verification Notes

This blueprint was designed by inspecting the existing Grammar Quest curriculum mapping files (`curriculum-source-map.json`, `curriculum-overview.md`, `mvp-learning-sequence.md`, `content-gaps.md`, and `src/content/curriculumCatalog.ts`) along with the current teaching-engine schemas (`src/schemas/grammarEngine.schema.ts`, `src/schemas/lesson.schema.ts`).

> **Source Inspection Transparency Note:** The raw `.pdf` textbook files are not mounted inside the current runtime workspace container; all textbook citations, chapter titles, book page numbers, PDF page offsets, and rule summaries below are verified strictly from the project's pre-extracted `curriculum-source-map.json`, `curriculum-overview.md`, and `content-gaps.md`. No unverified page numbers, sub-headings, or textbook claims have been invented.

### 1.1 Primary & Secondary Textbook Alignment

| Source Textbook | Verified Board / Edition | Relevant Chapters & Exact Verified Pages | Verified Scope & Terminology |
| :--- | :--- | :--- | :--- |
| **Odisha Class IX**<br>*LEARN AND PRACTISE GRAMMAR CLASS - IX* (`odisha-learn-practise-9`) | Board of Secondary Education, Odisha<br>New Ed. 2012, 2019 | • **Ch. 1: Parts of a Sentence** — Sec. A–D (Book pp. 1–26 / PDF pp. 7–32); specifically **Sec. D: Types of Sentences** (Book pp. 23–26 / PDF pp. 29–32)<br>• **Ch. 12: The Predicate Phrase** (Book pp. 141–146 / PDF pp. 147–152)<br>• *(Cross-ref)* Ch. 11: Negatives and Interrogatives (Book pp. 135–140 / PDF pp. 141–146) | • Ch. 1 Sec. B teaches Subject/Predicate, head-words, split predicates in questions, understood *you* in imperatives, and omitted *it/is* in exclamations.<br>• Ch. 1 Sec. D teaches **4 functional types** of simple sentences: **Declarative, Interrogative, Imperative, Exclamatory**.<br>• Ch. 12 teaches Transitive/Intransitive patterns: **`S+V`, `S+V+C`, `S+V+O`, `S+V+O+O`, `S+V+O+C`, `S+V+A`** (`VG+O+C+(Adjunct)` notation on pp. 141, 144), Direct/Indirect objects, and Adjuncts vs Complements. |
| **Odisha Class X**<br>*Learn and Practise Grammar Class - X* (`odisha-learn-practise-10`) | Board of Secondary Education, Odisha<br>New Ed. 2013, 2019 | • **Ch. 2: Types of Sentences** (Book pp. 13–22 / PDF pp. 19–28), especially **Simple sentence types & patterns** (Book pp. 14–15 / PDF pp. 20–21)<br>• *(Cross-ref)* **Ch. 4: Non-Finite Verb Forms** (Book p. 31 / PDF p. 37 — finite verb agreement test)<br>• *(Cross-ref)* **Ch. 8: Adverb Clauses** (Book pp. 86–89 / PDF pp. 92–95 — Sentence Types review) | • Assumes Subject/Predicate from Class IX.<br>• Defines **finite verb** and **clause** (Ch. 2 p. 13+).<br>• Classifies Simple sentences by function (**Declarative, Interrogative, Imperative, Exclamatory**) and **5 structural clause patterns** (**`SV`, `SVO`, `SVOO`, `SVC`, `SVOC`**), e.g., *"The night is dark." (SVC)* and *"They elected him president." (SVOC)*.<br>• Introduces **Compound** and **Complex** sentences (Ch. 2 pp. 13–22). |
| **Assam SEBA IX–X**<br>*A NEW METHOD English Grammar For Class IX & X* (`assam-new-method-9-10`) | Board of Secondary Education, Assam (SEBA)<br>11th Ed. 2023 (Combined IX–X) | • **Ch. 1: Sentence (वाक्य)** — L1–L9 (Book pp. 1–17 / PDF pp. 10–26); specifically L5–L6 Predicate/Objects/Complements (pp. 6–9 / PDF pp. 15–18) and L9 Functional types (pp. 12–17 / PDF pp. 21–26)<br>• **Ch. 2: Phrases and Clauses** (Book pp. 18–24 / PDF pp. 27–33)<br>• *(Cross-ref)* Ch. 7 Clauses (pp. 102–112), Ch. 8 Clause Analysis (pp. 113–119), Ch. 10 Finite vs Non-finite (pp. 148–159) | • Ch. 1 L5–L6 teaches Transitive/Intransitive verbs, 6/7 Object sub-labels (Direct, Indirect/Dative of Interest, Cognate, Reflexive, Adverbial, Retained, Factive), Complements, and Adjuncts (L3 pp. 4–5).<br>• Ch. 1 L9 teaches **5 functional types**: **Declarative, Interrogative, Imperative, Optative, Exclamatory**.<br>• Ch. 2 explicitly contrasts and classifies **Phrases vs Clauses**.<br>• Ch. 8 covers Principal vs Subordinate clause parsing. |
| **Punjab PSEB IX**<br>*GRAMMAR IN USE for Class IX* (`pseb-grammar-in-use-9`) | Punjab School Education Board (PSEB)<br>Ed. 2021–22 (Class IX only) | • **Ch. 5: Simple and Complex Sentences** (Book p. 53 / PDF p. 59 brief mention only)<br>• *(Cross-ref)* Ch. 4 Conjunctions (Book pp. 41–52 / PDF pp. 47–58) | • Only states in one sentence that *"A simple sentence has one subject and one predicate"* (p. 53) before moving straight to Noun, Adjective, and Adverb clause joining/transformation.<br>• **Coverage gap:** Does not teach functional sentence types, `SV–SVOC` clause patterns, or standalone Phrases vs Clauses. |

---

## 2. Learning Scope & Reorganisation Decisions

### 2.1 How the Six Broad Investigation Areas Map into This Chapter

| Proposed Investigation Area | Decision | Rationale & Scope Boundary |
| :--- | :--- | :--- |
| **1. Types of sentences according to purpose** | **Included (Topic 1)** | Explicitly taught in Odisha IX (Ch. 1 Sec. D), Odisha X (Ch. 2), and Assam IX–X (Ch. 1 L9). Core focus on the 4 shared types (**Declarative, Interrogative, Imperative, Exclamatory**), with **Optative** (Assam Ch. 1 L9) included as a lightweight supplementary awareness note. Deep question/negative formation (*do*-support, question tags) stays deferred to `Negatives, Interrogatives & Transformations`. |
| **2. Phrases and clauses** | **Included (Topic 2)** | Essential conceptual bridge between Mission 1 (*Subject & Predicate*) and Clause Patterns / Multi-clause sentences. Grounded in Assam Ch. 2 (*Phrases and Clauses*) and Odisha X Ch. 2 & Ch. 4 (defining a clause around a **finite verb**). Compensates for Odisha IX and PSEB IX lacking a dedicated Phrase-vs-Clause bridge. |
| **3. Sentence structure and elements** | **Included & Scoped (Topic 3)** | Teaches the 5 practical clause elements (`S`, `V`, `O` [DO/IO], `C`, `A`) grounded in Odisha IX Ch. 12, Odisha X Ch. 2, and Assam Ch. 1 L3–L6. **Excludes** Assam's taxonomy of 6 Subject kinds, 9 Subject Adjuncts, and rare Object sub-types (Cognate, Retained, Factive) to keep Classes 9–10 cognitive load clean and exam-relevant. |
| **4. Basic clause patterns** | **Included (Topic 4)** | Core Class 9–10 structural payoff grounded directly in Odisha X Ch. 2 pp. 14–15 (**`SV`, `SVO`, `SVOO`, `SVC`, `SVOC`**) and Odisha IX Ch. 12 (**`SVA`**). Directly builds on Mission 1's Subject–Predicate split and prepares students for Passive Voice (`SVO` / `SVOO` / `SVOC` transformations) in later chapters. |
| **5. Independent and dependent clauses** | **Included (Topic 5)** | Grounded in Odisha X Ch. 2 (pp. 13–22) and Assam Ch. 2 & Ch. 8 (*Principal vs Subordinate clause*). Teaches learners how to test whether a clause can stand alone or relies on a subordinator/main clause. |
| **6. Relationships between clauses** | **Included at Boundary Only (Topic 6)** | Scoped strictly to recognising **Coordination** (equal independent clauses joined by *and, but, or, so*) vs **Subordination** (an independent clause paired with a dependent clause via *because, when, if, that, who, although*). **Does NOT teach** Simple/Compound/Complex sentence synthesis/transformation drills or detailed Noun/Relative/Adverb clause sub-types, preserving clean boundaries with separate dashboard chapters. |

### 2.2 Explicit Boundaries with Existing & Planned Dashboard Chapters
- **Already Completed (`Mission 1: Repair the Broken Message`):** Word order, Subject vs Predicate split, Subject head-noun, finite verb as Predicate anchor, understood `(You)`. *Not re-taught in full; activated as Topic 1–3 prerequisites.*
- **Separate Chapter — `Simple, Compound & Complex Sentences` (`topic-simple-compound-complex`):** Owns full classification drills, combining sentences into Simple/Compound/Complex, and inter-conversion transformations. Our chapter only establishes the **Independent vs Dependent** and **Coordination vs Subordination** foundations.
- **Separate Chapter — `Noun, Relative & Adverb Clauses` (`topic-clauses`):** Owns deep function-based clause identification, defining vs non-defining relative clauses, and adverbial subtypes.
- **Separate Chapter — `Negatives, Interrogatives & Transformations` (`topic-negatives-interrogatives`):** Owns `do`-support rules, negative inversion, question tags, and assertive–exclamatory conversions.

---

## 3. Prerequisites & Cross-Module Dependency

Before starting **Sentence Types & Clause Patterns**, learners benefit from having completed (or will lightly reactivate in Topic 1–2):
1. **Mission 1 (`Sentence Basics`):** Identifying the full **Subject** and **Predicate** and locating the **finite verb** (`play/plays`) and **Subject head-word**.
2. **Mission 2 (`Tenses`):** Recognising finite verb forms (`is`, `was`, `has written`, `plays`) versus non-finite `-ing` / `to + verb` forms that do not carry tense/person on their own.
3. **Mission 3 (`Subject–Verb Agreement`):** Understanding that a finite verb agrees with its Subject in Number and Person (Odisha X Ch. 4 p. 31 test for clausehood).

---

## 4. Topic-by-Topic Learning Objectives

### Topic 1: Functional Sentence Types (Sentence Purpose)
- **Difficulty Level:** Beginner
- **Prerequisite Knowledge:** Basic recognition of a complete sentence (Subject + finite verb, Mission 1) and end punctuation marks (`.`, `?`, `!`).
- **What Students Should Understand:** Sentences serve distinct communicative purposes—stating facts, asking questions, giving instructions/requests, or expressing strong emotion (plus expressing wishes/prayers in *Optative* sentences per Assam SEBA)—and word order/verb placement shifts accordingly.
- **What Students Should Be Able to Identify:** Classify any simple sentence as **Declarative**, **Interrogative** (Yes/No or Wh-), **Imperative**, or **Exclamatory** (and recognise **Optative** *May...!* wishes as a supplementary pattern).
- **What Students Should Be Able to Construct:** Convert or assemble words into each of the 4 core sentence types with accurate opening structure and end punctuation.
- **Common Misconceptions:**
  1. Assuming punctuation alone decides sentence type (e.g., polite imperative *"Please pass the water?"* or exclamatory *"How bright the stars look!"* confused with a question because it starts with *How* or *What*).
  2. Thinking imperatives (*"Open the window."*) are fragments because *"you"* is not written.

### Topic 2: Phrases vs Clauses (The Finite Verb Test)
- **Difficulty Level:** Beginner to Intermediate
- **Prerequisite Knowledge:** Subject vs Predicate split (Mission 1); finite verb carrying tense & subject agreement (Missions 2–3).
- **What Students Should Understand:** Both a **phrase** and a **clause** are meaningful groups of words, but a **clause** always contains a Subject + **finite verb**, whereas a **phrase** lacks a finite verb (even if it contains a non-finite word like *running* or *to read*).
- **What Students Should Be Able to Identify:** Distinguish a Phrase (e.g., *"in the school courtyard"*, *"to win the race"*) from a Clause (e.g., *"the bells ring"*, *"because the bells rang"*) by checking for a finite verb.
- **What Students Should Be Able to Construct:** Expand a phrase into a clause by supplying a Subject and finite verb.
- **Common Misconceptions:**
  1. Mistaking any multi-word group containing an `-ing` or `to + verb` word (*"playing cricket after school"*, *"to plant saplings"*) for a clause.
  2. Thinking a dependent clause (*"when the bell rang"*) is a phrase simply because it cannot stand alone as a full sentence.

### Topic 3: Clause Elements Inside the Predicate (`S`, `V`, `O`, `C`, `A`)
- **Difficulty Level:** Intermediate
- **Prerequisite Knowledge:** Topic 2 (finite verb inside a clause); distinguishing Nouns, Adjectives, Verbs, and Adverbs/Prepositional phrases.
- **What Students Should Understand:** Inside a single clause, every part plays a distinct grammatical job: **Subject (`S`)**, **Verb (`V`)**, **Object (`O` — Indirect `IO` and Direct `DO`)**, **Complement (`C` — Subject or Object Complement)**, and **Adverbial (`A`)**.
- **What Students Should Be Able to Identify:** Label `S`, `V`, `O` (Direct vs Indirect), `C`, and `A` in short school-life sentences, and distinguish an **Object** (a different entity acted upon) from a **Complement** (describes or renames the Subject or Object).
- **What Students Should Be Able to Construct:** Choose the right element (`Object` vs `Complement` vs `Adverbial`) to complete a transitive, linking, or intransitive verb slot.
- **Common Misconceptions:**
  1. Confusing a **Subject Complement** (*"Mira became **captain**"*) with a **Direct Object** (*"Mira met **the captain**"*).
  2. Labelling every post-verb phrase as an Object, including time/place **Adverbials** (*"in the library"*, *"every morning"*).
  3. Board-notation confusion: Odisha IX Ch. 12 labels required place phrases (*"in the garage"* after *kept*) as `C` (`VG+O+C`), whereas traditional/Assam notes call place phrases `Adjuncts (A)`. Grammar Quest resolves this cleanly by distinguishing **required slot-fillers** from **optional adverbials** and noting the terminology variant.

### Topic 4: Basic Clause Patterns (`SV`, `SVA`, `SVC`, `SVO`, `SVOO`, `SVOC`)
- **Difficulty Level:** Intermediate
- **Prerequisite Knowledge:** Topic 3 (`S, V, O, C, A` element identification) and transitive vs intransitive vs linking verbs.
- **What Students Should Understand:** The main verb controls how many and which elements are required after it, producing 5 core textbook clause patterns (**`SV`, `SVO`, `SVOO`, `SVC`, `SVOC`** — Odisha X Ch. 2 pp. 14–15) plus the **`SVA`** pattern (Odisha IX Ch. 12).
- **What Students Should Be Able to Identify:** Match a simple sentence to its exact clause pattern (`SV`, `SVA`, `SVC`, `SVO`, `SVOO`, or `SVOC`).
- **What Students Should Be Able to Construct:** Build grammatically complete sentences following each target pattern from scrambled element tiles.
- **Common Misconceptions:**
  1. Confusing **`SVOO`** (*"The teacher gave **the class** **a riddle**"* — two separate participants: recipient + thing) with **`SVOC`** (*"The class elected **Arjun** **monitor**"* — one person renamed/described by the second noun/adjective).
  2. Treating optional time/place adverbials (e.g., *"yesterday"*) as turning an `SV` sentence into `SVO`.

### Topic 5: Independent (Main) vs Dependent (Subordinate) Clauses
- **Difficulty Level:** Intermediate to Advanced
- **Prerequisite Knowledge:** Topic 2 (Clause vs Phrase); Topic 4 (complete single-clause pattern).
- **What Students Should Understand:** An **Independent (Main) Clause** expresses a complete thought and can stand alone as a sentence. A **Dependent (Subordinate) Clause** has its own Subject and finite verb, but is introduced by a subordinating word (*because, when, if, although, that, who, which*) and depends on an Independent Clause to form a complete sentence.
- **What Students Should Be Able to Identify:** Separate a two-clause sentence into its Independent Clause and Dependent Clause, and spot standalone-fragment traps (subordinate clauses written with a full stop as if complete).
- **What Students Should Be Able to Construct:** Pair a given Dependent Clause with a fitting Independent Clause (or vice versa) to make a complete sentence.
- **Common Misconceptions:**
  1. Labelling a Dependent Clause (*"Because the monsoon arrived early."*) as a complete sentence because it has a Subject (*monsoon*) and finite verb (*arrived*).
  2. Stripping off the subordinator (*because/when/if*) mentally before testing independence—forgetting that the linking word is part of what marks the clause as dependent.

### Topic 6: Relationships Between Clauses (Coordination vs Subordination Boundary)
- **Difficulty Level:** Advanced
- **Prerequisite Knowledge:** Topic 5 (Independent vs Dependent Clauses) and basic awareness of common linkers (*and, but, or, so* vs *because, when, if, although, that*).
- **What Students Should Understand:** When two clauses meet in one sentence, they relate in one of two structural ways: **Coordination** links two equal Independent Clauses (`IC + Coordinator + IC`), whereas **Subordination** embeds or attaches a Dependent Clause to an Independent Clause (`IC + Subordinator + DC`, where the dependent clause functions inside or modifies the main clause).
- **What Students Should Be Able to Identify:** Identify whether two clauses in a sentence are joined by **Coordination (equal weight)** or **Subordination (main + dependent)**, without needing full Simple/Compound/Complex transformation rules yet.
- **What Students Should Be Able to Construct:** Choose the right linker (*but/and* vs *because/when*) to match an intended equal-contrast or cause/time relationship between two clauses.
- **Common Misconceptions:**
  1. Assuming *every* sentence with *and* joins two clauses (e.g., *"Mira and Arjun read books"* has only **one** clause with a compound Subject, not two clauses!).
  2. Treating coordinators (*and, but, or*) and subordinators (*because, although*) as interchangeable punctuation-wise or structurally equal.

---

## 5. Proposed Learning Sequence (6 Scaffolded Topics)

All examples and activities below adhere to Grammar Quest's **Healthy Food & Lifestyle Rule**, **Explicit Content Exclusions**, and Indian school/science/heritage themes, while aligning with **Mira, Arjun, and ShukaJi** and the existing **Visual Grammar Teaching Engine**.

---

### Topic 1: Functional Sentence Types (Beginner)
- **Short Explanation (ShukaJi):** Every sentence has a job to do. **Declarative** sentences state a fact or idea (`.`), **Interrogative** sentences ask a question (`?`), **Imperative** sentences give an instruction or polite request (`.` with understood *You*), and **Exclamatory** sentences express sudden wonder or strong feeling (`!` — often starting with *What* or *How* without *is/are*). *(Note: Wishes like "May our garden bloom!" are called **Optative** in Assam SEBA Ch. 1 L9.)*
- **Examples:**
  1. *"Fresh guavas grow in our school orchard."* (**Declarative** — states a fact)
  2. *"Did you wash the fruit before lunch?"* (**Interrogative** — asks a question)
  3. *"Drink clean water during sports practice."* (**Imperative** — advises/instructs; understood *You*)
  4. *"What a bright rainbow appeared after the rain!"* (**Exclamatory** — expresses wonder)
- **Interactive Learning Activity:** **4-Bucket Sentence Sorting (`categorise`)** — Students tap 8 school noticeboard slips (including tricky *What/How* exclamations vs *What/How* questions) and sort them into *Declarative*, *Interrogative*, *Imperative*, and *Exclamatory* buckets.
- **Checkpoint Question:**  
  *Which type of sentence is `"How neatly Arjun arranged the science charts!"`?*  
  - A) Interrogative — because it starts with *How*  
  - B) **Exclamatory — it expresses admiration, not a question, with Subject `Arjun` before verb `arranged`** ✓  
  - C) Imperative — because it ends with an exclamation mark  
  - D) Declarative — because it mentions science charts
- **Common Mistake to Address:** Treating *"How sweet these mangoes taste!"* as a question because it begins with *How*. Show students the **Subject-before-Verb order** (*these mangoes taste*) vs question inversion (*How do these mangoes taste?*).

---

### Topic 2: Phrases vs Clauses — The Finite Verb Test (Beginner → Intermediate)
- **Short Explanation (Mira & ShukaJi):** Both phrases and clauses are teams of words, but there is one fast test: look for a **finite verb** (a verb locked to a Subject in tense and number). A **Phrase** has *no* finite verb (`in the morning assembly`, `fresh green spinach`, `to check the rain gauge`). A **Clause** has a **Subject + finite verb** (`the morning assembly begins`, `when the rain stopped`).
- **Examples:**
  1. *"under the old neem tree"* (**Phrase** — preposition + noun group, no verb)
  2. *"reading a book on ISRO"* (**Phrase** — `-ing` participle without a helping verb or tense-bearing finite verb)
  3. *"the students planted saplings"* (**Clause** — Subject `the students` + finite verb `planted`)
- **Interactive Learning Activity:** **Tap the Finite Verb / Phrase-vs-Clause Lab (`identify-group` + `categorise`)** — Students inspect word strips, tap any **finite verb** if one exists, and classify each strip as **Phrase (No finite verb)** or **Clause (Subject + finite verb)**.
- **Checkpoint Question:**  
  *Which group of words is a **Clause**, not a Phrase?*  
  - A) *Walking quickly along the river bank*  
  - B) *A basket of ripe bananas on the table*  
  - C) ***Because the bell rang early*** ✓ *(Subject `the bell` + finite past verb `rang`)*  
  - D) *To finish the science project before Friday*
- **Common Mistake to Address:** Confusing non-finite verbals (*walking*, *to finish*) with finite verbs. Highlight Odisha X Ch. 4's rule: *try changing the Subject from `I` to `she` or time to `yesterday`*—only a **finite verb** changes!

---

### Topic 3: Clause Elements Inside the Predicate (`S, V, O, C, A`) (Intermediate)
- **Short Explanation (Arjun & ShukaJi):** In Mission 1 you split every sentence into Subject and Predicate. Now zoom inside the Predicate to see each word group's job: the **Verb (`V`)** is the engine; an **Object (`O`)** receives the action (*direct* `DO` or *indirect* `IO` recipient); a **Complement (`C`)** describes or renames the Subject or Object after linking/naming verbs (`is`, `became`, `named`); and an **Adverbial (`A`)** tells *where, when, or how*.
- **Examples:**
  1. *"Mira (`S`) / handed (`V`) / Arjun (`IO`) / a warm glass of milk (`DO`)."* (Verb + two Objects)
  2. *"The night (`S`) / is (`V`) / dark (`C`)."* (Odisha X Ch. 2 p. 14 — `dark` describes the Subject `The night`, not a separate object)
  3. *"The students (`S`) / read (`V`) / quietly (`A`) / in the library (`A`)."* (Manner and place Adverbials)
- **Interactive Learning Activity:** **Word Replacement & Role Shift (`word-replacement`)** — Inside *"Mira ___ the team captain."*, swap between `met` (turns `the team captain` into an **Object `O`**—a different person), `became` (turns `the team captain` into a **Complement `C`**—renaming Mira), and `cheered for` (`Prepositional Object/Adverbial`), inspecting live role badges.
- **Checkpoint Question:**  
  *In `"Rani Lakshmibai was a brave leader."`, what role does `"a brave leader"` play?*  
  - A) Direct Object (`O`)  
  - B) **Subject Complement (`C`) — renames who `Rani Lakshmibai` was after linking verb `was`** ✓  
  - C) Adverbial of Manner (`A`)  
  - D) Indirect Object (`IO`)
- **Common Mistake to Address:** Calling every noun phrase after a verb a Direct Object. Teach the **"Equals Test"** (`Subject = Complement`): *Rani Lakshmibai = a brave leader* (`SVC`), whereas *Mira met the coach* (`Mira ≠ the coach` → `SVO`).

---

### Topic 4: Basic Clause Patterns (`SV`, `SVA`, `SVC`, `SVO`, `SVOO`, `SVOC`) (Intermediate)
- **Short Explanation (ShukaJi):** Verbs decide which pattern a simple clause follows. Odisha Class IX & X identify 6 everyday patterns:
  1. **`S + V`** (*Birds fly.*)
  2. **`S + V + A`** (*The cyclists rode along the canal.*)
  3. **`S + V + C`** (*The river water feels cool.*)
  4. **`S + V + O`** (*Farmers grow millet.*)
  5. **`S + V + O + O` (`SVOO`)** (*Grandmother told us a folk tale.*)
  6. **`S + V + O + C` (`SVOC`)** (*They elected him president.* — Odisha X Ch. 2 p. 15)
- **Examples:**
  1. *"Our eco-club planted fifty saplings."* (**`SVO`**)
  2. *"The science teacher gave Mira a magnifying glass."* (**`SVOO`** — recipient `Mira` + gift `a magnifying glass`)
  3. *"The villagers kept the pond clean."* (**`SVOC`** — `clean` describes the object `the pond`)
- **Interactive Learning Activity:** **Clause Pattern Builder (`sentence-construction` + `categorise`)** — First build a target `SVOO` or `SVOC` sentence from colour-coded element tiles, then sort 6 school sentences into their exact pattern (`SVC`, `SVO`, `SVOO`, `SVOC`).
- **Checkpoint Question:**  
  *Compare these two sentences carefully. Which one follows **`SVOC`** rather than **`SVOO`**?*  
  - A) *Arjun offered Mira fresh papaya slices.*  
  - B) *The librarian lent our class three atlases.*  
  - C) ***The judges declared the solar model the winner.*** ✓ *(`the winner` renames `the solar model`, so Object + Complement)*  
  - D) *Mother sent Ravi a parcel of books.*
- **Common Mistake to Address:** Mixing up **`SVOO`** and **`SVOC`** because both have two noun phrases after the verb. Show the test: in `SVOC`, you can insert *"to be"* or `"="`: *the solar model = the winner* (`SVOC`); in `SVOO`, *"Mira = fresh papaya slices"* is false (`SVOO`).

---

### Topic 5: Independent vs Dependent Clauses (Intermediate → Advanced)
- **Short Explanation (Mira & ShukaJi):** An **Independent (Main) Clause** makes complete sense on its own (`The monsoon clouds gathered over Kerala.`). A **Dependent (Subordinate) Clause** has a Subject and finite verb, *but* starts with a subordinating word (*because, when, if, although, that, who, which*) so it leans on a main clause (`...because the monsoon clouds gathered over Kerala`). Left alone, a dependent clause is a broken fragment!
- **Examples:**
  1. *"We watered the saplings early"* (**Independent Clause** — complete on its own) + *"before the afternoon heat arrived."* (**Dependent Clause** — starts with subordinator `before`)
  2. *"The scientist who designed the weather balloon visited our school."* (`who designed the weather balloon` is a **Dependent Clause** tucked inside the Subject!)
- **Interactive Learning Activity:** **Broken Draft Repair & Clause Split (`error-identification` + `identify-both`)** — Diagnose a noticeboard fragment (*"Although the rain stopped at noon."*) to see why it is incomplete despite having a verb (`stopped`), then tap the Independent Clause vs Dependent Clause in a complete sentence.
- **Checkpoint Question:**  
  *Which noticeboard card is a **Dependent Clause fragment** that needs a Main Clause to finish the thought?*  
  - A) *The school garden produces fresh spinach every winter.*  
  - B) ***When ISRO launched the lunar orbiter in 2008.*** ✓ *(Has Subject `ISRO` + finite verb `launched`, but subordinator `When` leaves the thought incomplete)*  
  - C) *Inspect the rainwater tank before morning assembly.*  
  - D) *What a clear view of the mountains we enjoyed!*
- **Common Mistake to Address:** Thinking any group of words with a Subject and verb is automatically a complete sentence. Emphasise that a **subordinator turns a complete clause into a dependent puzzle piece**.

---

### Topic 6: Clause Relationships — Coordination vs Subordination (Advanced — Boundary Bridge)
- **Short Explanation (ShukaJi):** When two clauses work together, look at the bridge word between them:
  - **Coordination (Equal Partners):** Coordinators like **`and, but, or, so`** join two **Independent Clauses** of equal grammatical rank (`IC + Coordinator + IC`). Neither clause depends on the other.
  - **Subordination (Main + Helper):** Subordinators like **`because, when, if, although, that, which`** attach a **Dependent Clause** to a Main Clause (`IC + Subordinator + DC`), making one clause explain *why, when, under what condition, which one,* or *what* inside the main sentence.
  *(Full transformation practice between Simple, Compound, and Complex sentences continues in the dedicated **Simple, Compound & Complex Sentences** chapter!)*
- **Examples:**
  1. *"Arjun brought the telescope, **and** Mira brought the star map."* (**Coordination** — two equal Independent Clauses)
  2. *"Arjun brought the telescope **because** the night sky was crystal clear."* (**Subordination** — Main Clause + Dependent Clause giving the reason)
  3. *"Mira **and** Arjun cleaned the science lab."* (**Single Clause trap** — `and` joins two nouns inside one Subject, NOT two clauses!)
- **Interactive Learning Activity:** **Clause Linker Missing-Piece & Bridge Check (`missing-words`)** — Given two clause halves, students pick the accurate relationship linker (*but* vs *because* vs *when*) and verify whether the result pairs two equal clauses (**Coordination**) or embeds a helper clause (**Subordination**).
- **Checkpoint Question:**  
  *Look at: `"Fresh water flows through the canal, but farmers still conserve every drop."` How are the clauses related?*  
  - A) Phrase + Clause  
  - B) **Two equal Independent Clauses joined by Coordination (`but`)** ✓  
  - C) One Independent Clause + one Dependent Clause (`Subordination`)  
  - D) One single clause with a compound Subject
- **Common Mistake to Address:** Calling every sentence with the word **`and`** or **`but`** a two-clause coordinated sentence. Demonstrate how to count **finite verbs**: *"Dal **and** rice give energy"* has only **one** finite verb (`give`) → 1 clause!

---

## 6. Product & Architecture Integration Plan (Existing App Compatibility)

When approved for Phase 2 implementation, this chapter maps cleanly onto Grammar Quest's existing codebase with **zero new libraries** and **zero redesign of existing screens**:
- **Frontend Stack:** React, Vite, TypeScript, Tailwind CSS, Inter + Plus Jakarta Sans typography, and established cream/navy/sunshine/turquoise/violet palette tokens (`src/styles/tokens.css`).
- **Characters:** **Mira** (observations & worked structural notices), **Arjun** (hands-on sentence swaps & common-mistake checks), and **ShukaJi** (concise textbook notes & rules in `GuideNotePopup`).
- **Reusable Engine Mapping:**
  - `TeachingSequence` + `GuideNotePopup` + `SentenceVisualizer` handle Topics 1–6 step-by-step using `compare-dual`, `structure-split`, `guided-explore`, and `WordInspectorPopup`.
  - `WordLaboratory` (`A–F`) supports `identify-group`, `identify-both`, `categorise` (already supports custom category ids/labels for 2+ buckets), `sentence-construction` (`part1Label`/`part2Label` already customizable), `word-replacement` (`SVO` vs `SVC` live swap), `missing-words`, and `error-identification` (dependent-fragment trap).
  - `IndependentPracticeStage` handles `dual-identify`, `token-and-choice`, and `choice-diagnose`.
  - `AssessmentRunner` + IndexedDB (`progressRepository.ts`, `assessmentRepository.ts`) remain unchanged and automatically support a 10-MCQ formal assessment once authored in a later phase.
- **Note on Unified Learner Experience:** In alignment with recent product updates removing the Class 9/10 selector pill from the UI, the chapter will unify foundational Class 9 topics (Topics 1–3) and Class 10 progression (Topics 4–6) into one clean spiral path while preserving exact Class 9 / Class 10 board provenance in `sourceReferences`.

---

## 7. Textbook Coverage Gaps & Cross-Board Conflicts Identified

| Gap / Conflict ID | Description Across Verified Sources | Pedagogical Resolution for This Chapter |
| :--- | :--- | :--- |
| **GAP-1: Zero Coverage in PSEB Class IX & Missing PSEB Class X** | Punjab PSEB Class IX (`pseb-grammar-in-use-9`) does **not** teach functional sentence types, `SV–SVOC` clause patterns, or standalone Phrases vs Clauses (only a 1-line simple-sentence mention on Ch. 5 p. 53). No PSEB Class X textbook is present in the uploaded set. | Topics 1–4 are explicitly tagged with `supplementary-bridge` provenance notes alongside Odisha IX/X and Assam sources so learners from any board receive full step-by-step instruction. |
| **GAP-2: Odisha Class IX Omits Standalone Phrase vs Clause Unit** | Odisha IX jumps from Ch. 1 (*Parts of a Sentence*) to word/phrase chapters, deferring explicit *finite verb & clause* definitions until Odisha X Ch. 2 (p. 13+) and Ch. 4 (p. 31). Only Assam Ch. 2 (*Phrases and Clauses*, pp. 18–24) explicitly pairs them early. | Topic 2 explicitly builds the Phrase-vs-Clause Finite Verb test using Odisha X Ch. 2/4 and Assam Ch. 2 so Class 9 learners are ready before Topics 4–6. |
| **GAP-3: 4 vs 5 Functional Sentence Types (`Optative`)** | Odisha IX (Ch. 1 Sec. D) and Odisha X (Ch. 2) teach **4** functional types (*Declarative, Interrogative, Imperative, Exclamatory*). Assam SEBA (Ch. 1 L9 pp. 12–17) adds a **5th type: Optative** (*"May..."* wishes). | Core interactive practice tests the **4 universal types**, while ShukaJi's note includes **Optative** as a clearly labelled *Assam SEBA / Supplementary* note—never creating contradictory MCQ traps. |
| **GAP-4: Predicate `Complement` vs `Adjunct / Adverbial` Labelling** | Odisha IX Ch. 12 (pp. 141, 144) labels required locative phrases (*"in the garage"* in *"He kept the car in the garage"*) as **Complement (`C`)** inside `VG+O+C+(Adjunct)`, whereas Assam Ch. 1 L3 & Ch. 13 classify place/time phrases as **Adjuncts / Adverbials (`A`)**, and Odisha X Ch. 2 (pp. 14–15) lists `SV, SVO, SVOO, SVC, SVOC` without `SVA`. | Topic 3–4 avoid ambiguous edge sentences (*kept in the garage*) in graded checks; we use unambiguous `SVC` (*is dark*, *became captain*), `SVOC` (*elected him president*), and `SVA` (*sat in the courtyard*) examples and document the notation difference transparently. |
| **GAP-5: Assam Over-Granular Taxonomy (`6 Subjects`, `9 Adjuncts`, `7 Objects`)** | Assam Ch. 1 L4–L5 classifies 6 Subject types, 9 Subject Adjuncts, and 6/7 Object subtypes (*Cognate, Retained, Dative of Interest, Reflexive, Factive*). Odisha and PSEB do not require these labels. | Excluded from core Class 9–10 mastery to prevent cognitive overload; retained only in `sourceReferences` provenance notes. |
| **GAP-6: Raw PDF Granularity Boundary** | Direct raw `.pdf` binaries are absent from the current container; sub-page line numbers and verbatim textbook exercise sentences inside Odisha IX Ch. 1 Sec. D (pp. 23–26), Odisha X Ch. 2 (pp. 16–22), and Assam Ch. 2 (pp. 18–24) are only summarised in `curriculum-source-map.json`. | Only rules, patterns, and sample sentences explicitly recorded in `curriculum-source-map.json` / `curriculum-overview.md` are cited as textbook-derived; all new teaching sentences in Grammar Quest will be tagged `original-practice` or `supplementary-bridge` and verified against the raw PDFs before any verbatim textbook quotation is claimed. |

---

*Awaiting your review and approval before starting Phase 2 (Story, Interactive Visual Engine Lessons & Guided/Practice Content Authoring).*
