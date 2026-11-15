# Grammar Quest — Content Gaps, Conflicts & Source Limitations Report

This report documents every verified limitation, missing detail, typographical quirk, cross-textbook conceptual conflict, and Class 9 vs Class 10 coverage gap observed across the four uploaded source textbooks. Nothing has been guessed or silently reconciled.

---

## 1. Document Quality, Readability & Metadata Limitations

### 1.1 PDF Page Verification Status
- **Original PDFs:** All pages across all four original uploaded PDFs were verified readable (`Assam IX–X`: 354 pp.; `PSEB IX`: 168 pp.; `Odisha IX`: 152 pp.; `Odisha X`: 128 pp.). **Zero pages were permanently unreadable in the original files.** *(Technical note: intermediate Ghostscript chunking corrupted some content streams in Odisha IX/X, which was resolved by inspecting both original PDFs directly.)*

### 1.2 Filename & Publication Metadata Gaps
| Book | Verified Observation / Gap | Impact on Curriculum Mapping |
| :--- | :--- | :--- |
| **Odisha Class IX & Class X** (`79 - OD_...TERM1.pdf`, `94 - OD_...TERM1.pdf`) | Both filenames contain `TERM1`, yet internal Tables of Contents and Prefaces confirm they are the **complete full-year textbooks** (12 chapters in Class IX; 10 chapters in Class X). | Do not treat these books as Term-1-only syllabi; full-year grammar coverage is present. |
| **Odisha Class IX & Class X** (Copyright p. 2) | Both books leave `Printed at :` and `Price : Rs.` blank on their copyright pages. | Unverifiable printing press / price; retained as `[unverified/blank in source]` rather than invented. |
| **Odisha Class X** (Copyright p. 2) | Edition years appear in **Odia script numerals** (`୨୦୧୩` = 2013, `୨୦୧୯` = 2019), which standard ASCII text/OCR extractors drop silently. | Verified visually as `2013, 2019`; automated text pipelines should not rely solely on OCR for metadata. |
| **Punjab PSEB** | Only **Class IX** (*Grammar in Use for Class IX*, 2021–22) was provided. **No Class X PSEB textbook** was supplied. | Class 10 PSEB curriculum cannot be verified from sources and is flagged as absent. |
| **Assam SEBA** (*A New Method English Grammar*, 11th Ed. 2023) | Combined **Class IX & X** single volume (approved 1974; latest 2023 edition). Gives **no chapter-level Class 9 vs Class 10 split**. | Grammar Quest cannot cite Assam SEBA for grade-specific boundary placement without imposing a pedagogical split. |

### 1.3 Verified Printing Typos in Source PDFs (Do Not Reproduce Verbatim)
- **Assam SEBA IX–X:** p. 124 prints `"I had giving books"` in a Past Perfect example; p. 136 prints `"He/She + shall be"` inside the Future Continuous table; p. 152 has minor spacing/typo (`"25 Anomalous"`).
- **Punjab PSEB Class IX:** Composition section contains minor spelling typos (`p. 106` `":He"`, `p. 113` `"destory"`, `p. 115` `"houe"`, `p. 126` `"boardly"`, `p. 158` `"sequene"`, `p. 160` `"exprience"`).
- **Odisha Class IX:** p. 30 `"a/an"` section prints `"to –ing"`; p. 134 prints `"Raraly"` (for *Rarely*); p. 140 prints `"doesn't"` / `"what does saying like"`.
- **Odisha Class X:** p. 46 prints `"He is ran / He is threw"`; p. 66 prints `"asking after"`; p. 93 prints `"an opposition"` (for *an apposition*); p. 100 prints `"be blamed"` / `(1)` numbering glitch.

---

## 2. Cross-Textbook Conceptual & Terminological Conflicts

Grammar Quest must **never silently merge** these disagreements. Where a conflict affects an MVP module, it is surfaced transparently or scoped clearly:

1. **Two-Tense vs Twelve-Tense Grammatical Model (Major Conflict — Module 2)**
   - **Odisha IX (Ch. 3 pp. 33–34) & Odisha X (Ch. 1 p. 1):** Explicitly state that English verbs have **only two tenses** (*Present* and *Past*) and *"there is no future tense in English"*; future time is expressed via modals (`will/shall`), `be going to + v`, Present Progressive, Present Simple, `be about to`, etc. (yielding 8 Tense × Aspect combinations).
   - **Punjab PSEB IX (Ch. 9 pp. 94–97) & Assam SEBA IX–X (Ch. 9 pp. 121–126):** Teach the traditional **three tenses** (*Present, Past, Future*) × four aspects = **12 tenses**. *(Assam Ch. 9 Lesson 1 briefly distinguishes Time vs Tense before immediately adopting the 3-tense / 12-sub-tense structure.)*
   - **Impact:** Lesson text and MCQs must avoid trap questions like *"How many tenses are there in English? (2 vs 3 vs 12)"* unless explicitly scoped to a single board's terminology, and must focus instead on **context-to-verb-form selection**.

2. **Aspect & Verb-Form Terminology Differences (Module 2)**
   - **Aspect names:** Odisha uses *Simple / Progressive / Perfect / Perfect Progressive*; PSEB uses *Indefinite / Continuous / Perfect / Perfect Continuous*; Assam prints dual labels (*Indefinite/Simple*, etc.).
   - **Verb-form notation:** Odisha uses `v`, `v-ed`, `-ed/-en`, and `φ + v` (bare infinitive) / `be + en` (passive); PSEB uses `V1`, `V2`, `V3`; Assam classifies *Strong / Weak / Invariant / Mixed* verbs plus *24 Anomalous Finites* and *Non-conclusive / Inchoative* verbs.

3. **Question Tag & Contraction Discrepancy (`amn't` vs `aren't` / `I'm not`)**
   - **Odisha Class IX (Ch. 11 p. 136)** explicitly instructs students to use **`I'm not`** and **NOT `I amn't`**.
   - **Assam SEBA (Ch. 3 p. 26)** lists **`amn't`**, and **Odisha Class X (Ch. 3 Activity 3(i) p. 30)** itself tests `"I am young and strong, (amn't / aren't)?"`.
   - **Handling:** Keep MVP assessments clear of disputed `amn't` items; follow standard `"aren't I?"` / `"I'm not"` if question tags appear later.

4. **Agreement with `neither of / none of / either of` (Module 3)**
   - **Odisha Class X (Ch. 3 Rule 7a p. 26)** teaches singular verb agreement formally while explicitly noting that **plural verbs occur in informal speech** (*"Neither of them is/are..."*).
   - **PSEB Class IX (Ch. 9 p. 99)** and **Assam SEBA (Ch. 5 pp. 66–67, 73)** mandate **strictly singular** verbs.
   - **Handling:** MVP practice & MCQs treat singular as the standard formal/exam answer while adding a concise note about Odisha X's informal usage remark.

5. **Predicate Element Classification (`Complement` vs `Adjunct` / `Object` Labels — Module 1)**
   - **Odisha Class IX (Ch. 12 pp. 141, 144)** labels required locative phrases like `"in the garage"` in `"He kept the car in the garage"` as **Complement (`C`)** inside `VG + O + C + (Adjunct)`.
   - **Assam SEBA (Ch. 1 pp. 6–8 & Ch. 13)** uses traditional **Adjunct/Adverbial** labels and sub-classifies objects into *Direct, Indirect (Dative of Interest), Cognate, Reflexive, Factive, Retained*.
   - **Handling:** Module 1 limits itself to the core **Subject vs Predicate boundary, head-word, and basic Verb + Object/Complement awareness** rather than competing syntactic sub-labels.

---

## 3. Class 9 vs Class 10 Coverage Gaps for the 3 MVP Modules

| MVP Module | Odisha Class IX | Odisha Class X | Punjab PSEB Class IX | Assam SEBA IX–X | Gap / Risk Identified |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Module 1: Subject & Predicate** | **Full explicit coverage** (Ch. 1 pp. 5–7) | **Assumed** (Ch. 2 jumps to clauses & `SV–SVOC`) | **1-line mention only** (Ch. 5 p. 53) | **Full explicit coverage** (Ch. 1 pp. 2–9) | **High gap for PSEB IX & Odisha X students** if not explicitly taught/reviewed in Module 1. |
| **Module 2: Tenses** | **Comprehensive** (2-tense model, Ch. 3 pp. 33–61) | **Consolidation** (*Tense Revisited*, Ch. 1 pp. 1–12) | **Compact 12-tense summary** (assumes verb conjugation, Ch. 9 pp. 94–97) | **Exhaustive** (12 tenses + conjugation + errors, Ch. 9 pp. 120–147) | **Terminology gap** (`2-tense` vs `12-tense`) & missing basic verb conjugation drills inside PSEB IX. |
| **Module 3: Subject–Verb Agreement** | **Fragmented intro** (Ch. 2 p. 32 table; Ch. 7–8 noun/quantifier rules; defers full SVA) | **Full 16-rule chapter** (Ch. 3 pp. 23–30) | **Full 13-rule section** (Ch. 9 Sec. 2 pp. 97–100) | **No standalone chapter** (scattered across Ch. 1, 4, 5, 6, 12) | **Critical mismatch:** PSEB expects full SVA in Class 9; Odisha defers formal 16-rule SVA to Class 10; Assam hides SVA rules inside unrelated chapters. |

---

## 4. Content & Policy Compliance Audit of Source Books

- **Exclusions & Food Rule Conflicts in Raw Source Material:**
  - *PSEB Class IX Composition Ch. 4* (Book p. 159 Ex. A) includes paragraph prompts referencing *Mahatma Gandhi*, *Jawaharlal Nehru*, and INC-related historical narratives.
  - Several raw textbook grammar examples across books use *sweets*, *cakes*, *candies*, or *tea/coffee* tropes.
  - **Action:** All raw textbook items violating Grammar Quest's **Explicit Content Exclusions** or **Healthy Food & Lifestyle Rule** are **excluded** from `mvp-learning-sequence.md` and future lesson JSONs; only the underlying verified grammatical rules and page citations are retained, paired with original compliant Indian examples.

---

## 5. Supplementary Teaching Content Required for Grammar Quest

To deliver a seamless 3-module MVP experience across both Class 9 and Class 10 learners from any board, Grammar Quest requires the following **original added content** (clearly tagged as supplementary in lesson metadata):

1. **Interactive Subject–Predicate Diagnostic Bridge (Module 1):** Step-by-step visual tile separation for inverted interrogatives (`Have you...`), understood imperative `(You)`, and enlarged noun-phrase Subjects—compensating for PSEB IX's one-line treatment and Odisha X's omission.
2. **Transparent Board-Model Bridge Card (Module 2):** A concise explainer showing students why *Present/Past + Future Time Expressions* (Odisha) and *Present/Past/Future × 4 Aspects* (PSEB/Assam) describe the **same real English sentences** using two grammatical naming systems.
3. **Verb-Conjugation Micro-Refresher (Module 2):** Essential irregular/strong verb forms (`eat/ate/eaten`, `write/wrote/written`, `begin/began/begun`) needed by PSEB IX students whose textbook assumes conjugation mastery.
4. **Tiered Class 9 vs Class 10 SVA Progression (Module 3):** Consolidating Assam's scattered rules and Odisha IX's deferred preview into a structured Class 9 Core SVA set (prepositional traps, `and`, `either...or`, `with`, `-s` singulars, `each of`) and Class 10 Mastery set (`the number of` vs `a number of`, fractions, collectives, relative antecedents).
5. **100% Original Compliant Contexts & 30 Assessment MCQs (10 × 3 Modules):** Freshly authored sentences grounded in Indian science (ISRO), everyday school life, healthy Indian nutrition (fruits, dal, rice, curd, water, vegetables), and approved historical figures (Subhas Chandra Bose, Bhagat Singh, Chandrashekhar Azad, Rani Lakshmibai), each mapped to a verified source rule.
