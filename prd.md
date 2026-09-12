# 📋 Product Requirements Document

## Life RPG — Gamified Productivity Web Application

| Field | Detail |
|---|---|
| **Document Status** | Draft v0.1 — For cross-functional review |
| **Author** | Senior Product Manager |
| **Audience** | Engineering, Design, QA, Compliance, Hackathon Team Leads |
| **Source Material** | "Life RPG" Problem Statement (hackathon brief) |
| **Related Docs** | None (source of truth is the PS document) |

> ⚠️ **Document note:** This PRD is written strictly from the provided Problem Statement. Where the PS is silent, ambiguous, or leaves a decision open, this document **does not decide it** — it is escalated to the **Open Questions** section. One section of the source PS (§6, Disqualification Rules) is **incomplete in the source material** and is flagged as the highest-priority clarification item.

---

## 1. Overview 🎯

The Life RPG is a **full-stack web application** that converts real-world task completion into an engaging virtual role-playing-game progression system. Users complete everyday tasks ("quests"), earn Experience Points (XP), level up a persistent character, build activity streaks, and spend earned currency on virtual rewards.

The product is differentiated from a standard to-do app by three non-negotiable characteristics defined in the source PS:

1. **It is a real full-stack system** — authenticated, server-persisted, cross-device, with backend safeguards against stat manipulation. It is explicitly *not* a frontend-only prototype.
2. **It has a deliberate product "soul"** — a cohesive visual/interactive theme with celebratory feedback, not a generic dashboard.
3. **It feels instant** — despite server-side storage, interactions must not feel network-bound.

The thematic execution (fantasy, retro, cyberpunk, minimalist, etc.) is **an open creative decision** pending stakeholder selection (see Open Questions).

---

## 2. Problem Statement 🔎

**The user problem:**
Traditional productivity tools, habit trackers, and to-do lists fail a large segment of users because completing a task produces **no immediate reward**. The real-world payoff of studying, exercising, or reading materializes over months, while the tool itself offers only a checkmark. Games solve this with instant feedback loops, visible progression, and tangible rewards — productivity tools do not.

**The consequence:** Users perceive productivity tools as *chores* and disengage before real-world benefits accrue.

**The product objective:** Bridge this "delayed gratification" gap by layering an immediate, virtual progression system (XP, levels, attributes, streaks, economy) on top of real-world task completion — making the *act of using the tool* intrinsically rewarding.

**The engineering constraint that shapes the product:** Because the progression system is only meaningful if it cannot be trivially manipulated, and because progression must survive across sessions and devices, the product requires a secure backend, a persistent database, and user authentication. A client-only implementation would not satisfy the product's core value proposition.

---

## 3. Why This Matters 🌍

| Stakeholder | Why it matters |
|---|---|
| **End users** | Habit adherence is the bottleneck for self-improvement outcomes. A tool that sustains engagement directly improves the likelihood users persist long enough to realize real-world results. |
| **The product team** | The evaluation framework in the PS explicitly weights Design & UX as a *crucial* differentiator and penalizes generic output. Product polish is therefore core business value, not decoration. |
| **The market** | Gamified productivity is a validated category (see Background). Existing products have known gaps — most notably around progression-system integrity and modern UX — leaving room for a differentiated entrant. |
| **Delivery** | The PS mandates three hard deliverables (public repo, live URL, 90–180s demo video). Shipping completeness is inseparable from product quality here; an unshipped or non-compliant submission scores zero regardless of internal quality. |

---

## 4. Background 📚

### 4.1 Competitive Landscape (context only — no feature commitments implied)

| Product | Core mechanic | Known strength | Known gap (relevant context) |
|---|---|---|---|
| **Habitica** | Retro-RPG task gamification (avatar, guilds, dailies) | Long-tenured, free, deep feature set | Self-reported completion is documented as exploitable (repeated check/uncheck farming); retro aesthetic is polarizing |
| **Finch** | Virtual-pet self-care companion | Gentle tone, strong retention, mainstream appeal | Not RPG-structured; lacks stats/progression depth for game-oriented users |
| **SuperBetter** | Research-backed "gameful" resilience methodology | Clinical credibility, 1M+ users | Feels like a workbook rather than a game; weak visual progression |
| **RPG In Real Life** | Skill-tree visualization | Attractive progression UI | Paid, mobile-only, no web/cross-device play |
| **Duolingo** | Streak + XP + leagues (language domain) | Industry reference for retention engineering | Domain-locked; not a general life-RPG |

### 4.2 Delivery Context

This PRD scopes the **v1 hackathon submission**. The PS grants creative freedom on math, items, and theme, and explicitly lists an allowed technology pool (frontend frameworks, backend runtimes, SQL/NoSQL databases, BaaS/auth providers). Technology selection within that pool is an **engineering decision**, not a product requirement, and is out of scope for this document.

---

## 5. User Goals 👤

**Primary persona — "The Lapsed Tracker":** A student or young professional who has abandoned two or more productivity tools within weeks of adoption, who enjoys games, and who is motivated by visible progression.

**User goals (derived from the PS):**

- **G1:** Complete real-world tasks and receive *immediate, celebratory* acknowledgment and reward.
- **G2:** See cumulative, never-lost progression across sessions and devices (level, attributes, streak).
- **G3:** Categorize efforts so different types of real work advance different character stats.
- **G4:** Sustain momentum across consecutive days via a visible streak.
- **G5:** Convert effort into earned currency and spend it on meaningful virtual rewards (items, themes, or badges).
- **G6:** Trust that the progression system is fair — that their own and others' stats cannot be trivially faked from the client.

**Explicit non-goals for v1 (by omission from the PS — confirm with stakeholders):**
- Social / multiplayer / party features
- Real-world verification of task completion (photos, location, integrations)
- Native mobile applications (responsive web only)
- Offline-first operation
- Monetization

> ⚠️ *If any of the above are believed to be in scope, this is a scope conflict to resolve before development — see Open Questions.*

---

## 6. Success Metrics 📏

The source PS does not define quantitative business metrics; it defines **deliverable compliance** and **judging pillars**. Metrics below map to those. Numeric targets marked **[TBD]** require stakeholder setting.

### Tier 1 — Submission Compliance (binary, zero-tolerance)

| # | Metric | Target |
|---|---|---|
| C1 | Public GitHub repo with full source, README + setup instructions, `.env.example` | ✅ Pass |
| C2 | Commit history review — "clean" *(definition pending — see Open Questions)* | ✅ Pass |
| C3 | Live, publicly accessible, fully functioning deployed URL | ✅ Pass |
| C4 | Demo video length | 90–180 seconds |
| C5 | Demo video file size | < 100 MB |
| C6 | Demo video covers: signup/login → add task → complete task → level-up → page refresh proving persistence | ✅ All steps shown |
| C7 | Disqualification triggers avoided | ✅ *(rules content missing in PS — see Open Questions)* |

### Tier 2 — Judging-Pillar Alignment

| Pillar (from PS) | Measurable proxy |
|---|---|
| Design & UX | Design review finds a cohesive theme; zero "default/unstyled component" findings; strong visual hierarchy confirmed |
| Performance & SEO | Load time within target **[TBD]**; optimized assets; semantic HTML; SEO metadata present |
| Creativity & Gamification | Progression system evaluated as "rewarding and well-thought-out," not an afterthought |
| Robustness & Edge Cases | QA suite passes on named PS edge cases (empty task submission; connection drop) plus agreed additional cases |
| Accessibility & Responsiveness | 100% of flows keyboard-navigable (Tab, Enter, Space); screen-reader structure validated; functional across mobile→desktop breakpoints |

### Tier 3 — "Feel" Metrics (proxy, targets [TBD])

- **Perceived interaction latency:** task-completion feedback renders without visibly waiting on the network round-trip (PS: "never feel bogged down by network latency").
- **Celebration quality:** level-up, XP gain, and purchase moments validated as "satisfying/celebratory" in team user-testing.

---

## 7. Epics 🧱

| Epic | Name | Summary | PS Source |
|---|---|---|---|
| **E1** | Authentication & Data Isolation | Secure signup, login, session management; users see/modify only their own tasks and character data | §5.1 |
| **E2** | Task Management (CRUD) | Smooth Create / Read / Update / Delete of tasks; schema supports Users, Tasks, character attributes, historical logs, inventory | §5.2 |
| **E3** | RPG Progression Engine | XP accrual and a leveling system where each subsequent level requires more XP than the last | §5.3 |
| **E4** | Gamification Systems | Streaks (consecutive active days); task-to-attribute mapping; currency economy with purchasable rewards | §5.4 |
| **E5** | Experience Design: Theme, Motion & Cohesion | Cohesive thematic execution; celebratory micro-interactions; uncluttered hierarchy; explicitly *not* a generic SaaS/CRUD aesthetic | §2 |
| **E6** | Performance, Responsiveness & SEO | Fast loads, optimized assets, semantic HTML, SEO-friendly metadata, mobile→desktop responsiveness | §7 |
| **E7** | Accessibility | Full keyboard navigation; structurally sound for screen readers | §5.5, §7 |
| **E8** | Robustness & Edge Cases | Graceful error handling for named and agreed edge cases (empty task, connection loss) | §7 |
| **E9** | Submission & Deployment | Public repo, README, `.env.example`, clean commits, live URL, compliant demo video | §4 |

**Representative user stories (traced to PS):**

- *E1:* As a user, I want to sign up and log in securely, so that my character data is private and syncs across my devices.
- *E2:* As a user, I want to add, edit, view, and delete my tasks, so that my quest log always reflects reality.
- *E3:* As a user, I want each level to take more XP than the last, so that progression feels meaningful over time.
- *E4:* As a user, I want my gym task to raise my "Strength" and my coding task to raise my "Intellect," so different efforts build different stats *(taxonomy per PS examples — final set is an open decision)*.
- *E4:* As a user, I want to earn currency and spend it on rewards, so effort converts into something I value.
- *E5:* As a user, I want completing a task to feel instantly celebratory, so the app is motivating rather than a chore.
- *E7:* As a keyboard-only or screen-reader user, I want full access to every feature, so the product works for me.
- *E9:* As an evaluator, I want a live URL, repo, and demo video, so I can verify the submission end-to-end.

---

## 8. Key Requirements ✅

> Prioritization language: **MUST** = mandated by the PS. Items the PS leaves open are **not stated here as requirements** — they appear in Open Questions.

### 8.1 Authentication & Security (E1)

- **MUST** provide secure signup, login, and session management.
- **MUST** enforce data isolation: a user can only see and modify **their own** tasks and character data.
- **MUST** implement backend safeguards such that users cannot **easily** "cheat" their stats (the definition of "easily" is an open question — see §12).
- Account recovery (password reset, email verification) is **not specified** in the PS → Open Question.

### 8.2 Data Model & CRUD (E2)

- **MUST** maintain a thoughtfully designed database structure covering **Users, Tasks, and character attributes**.
- **MUST** maintain **complex historical logs** of completed tasks **and inventory** (per PS §1).
- **MUST** support smooth Create, Read, Update, Delete of tasks.
- **MUST** support user authentication enabling **seamless cross-device synchronization** (minimum bar for "seamless" is an open question — see §12).

### 8.3 RPG Progression Engine (E3)

- **MUST** implement a leveling system in which **each subsequent level requires more XP than the previous level**.
- Specific XP curve/formula is **deliberately unspecified by the PS** → stakeholder decision.
> ⚠️ *Ambiguity flag:* The PS calls this a "non-linear leveling system" but defines it only as "each subsequent level requires more XP than the last." A strictly *linearly increasing* sequence (100 → 200 → 300…) satisfies the parenthetical but not the word "non-linear." Clarification needed — see §12.

### 8.4 Gamification Systems (E4)

- **Streaks — MUST** track consecutive days of activity.
  - ⚠️ *Ambiguity flag:* "Activity" is undefined (login? task completion? XP earned?). Streak-break behavior (forgiveness, freeze, reset) is unspecified → Open Questions.
- **Attributes — MUST** allow tasks to be categorized such that completing them levels up specific character stats (PS examples: Coding → "Intellect," Gym → "Strength"). The final attribute taxonomy is **not mandated** → stakeholder decision.
- **Rewards/Economy — MUST** provide a system where users earn currency or points to "buy" virtual items, themes, or profile badges.
  - ⚠️ *Ambiguity flag:* The PS lists three reward categories joined by "or." It is unclear whether **at least one** category is sufficient or **all three** are required → Open Question.
  - Currency earning rates, item catalog, and pricing are **deliberately unspecified by the PS** → stakeholder decisions.

### 8.5 Experience & Interaction Design (E5)

- **MUST NOT** look or feel like a standard enterprise SaaS dashboard or a generic Bootstrap CRUD app (PS §2 — explicit warning; judging criterion states generic designs score significantly lower).
- **MUST** be "Alive and Tactile": the UI reacts instantly; earning XP, leveling up, and buying items **must feel celebratory**. The PS cites micro-interactions, spring animations, and subtle particle effects as acceptable means (technique selection is an engineering/design decision).
- **MUST** be "Thematically Cohesive": typography, color palette, and in-product language (e.g., "Quests" vs. "Tasks," "Gold" vs. "Points") must match the chosen theme, with a strong visual hierarchy that avoids stat clutter.
- **MUST** be "Seamlessly Integrated": the user must never feel bogged down by network latency. The PS prescribes loading skeletons, optimistic UI updates, and smooth transitions as the means to achieve native-app-like perceived speed.
- The **theme itself** (cozy lo-fi / 16-bit retro / cyberpunk / minimalist modern / other) is granted as creative freedom → **open stakeholder decision**.

### 8.6 Responsiveness & Accessibility (E7)

- **MUST** be fully responsive across mobile to desktop screens.
- **MUST** be entirely navigable via keyboard, specifically **Tab, Enter, and Space** (as named in the PS).
- **MUST** be structurally sound for screen readers.
- ⚠️ *Ambiguity flag:* No accessibility standard (e.g., a WCAG conformance level) or target assistive technology is named → Open Question.

### 8.7 Performance & SEO (E6)

- **MUST** deliver fast load times with optimized assets.
- **MUST** exhibit responsive performance across devices.
- **MUST** use semantic HTML and an accessible structure.
- **MUST** include SEO-friendly metadata and content.
> ⚠️ *Ambiguity flag:* The core product experience sits behind authentication, where SEO has limited reach. It is unclear whether "SEO-friendly content" applies only to public surfaces (landing/login) or implies public content pages → Open Question.

### 8.8 Robustness & Edge Cases (E8)

- **MUST** handle errors gracefully.
- **MUST** (named in PS, at minimum) handle: (a) submission of an **empty task**; (b) **loss of internet connection** during use.
- Additional edge cases are to be agreed with QA (candidate list in §13).

### 8.9 Submission Deliverables (E9)

- **MUST** deliver a **public GitHub repository** containing all source code (frontend and backend), a **clean commit history**, and a **detailed README** with setup instructions and an **environment variable template (`.env.example`)**.
- **MUST** deliver a **live, publicly accessible, fully functioning deployed URL**.
- **MUST** deliver an **illustration video**: a screen recording, **under 100 MB, strictly 90–180 seconds**, demonstrating (1) user signup/login, (2) adding/completing a task, (3) the leveling-up process, and (4) **a page refresh proving database persistence**. Hosted in the repo or via an accessible public link.
- ⚠️ *Ambiguity flag:* The PS's §6 "Disqualification Rules" states submissions receive an immediate zero for violating listed rules, but **the list itself is blank in the provided document** → highest-priority clarification.

---

## 9. User Flows 🔄

*(Business-level flows; UI specifics and states are design decisions.)*

**Flow 1 — First-Time User (Onboarding)**
1. User arrives at public landing/login surface → initiates signup.
2. Account created → session established.
3. User creates their first task (a "quest").
4. User completes the task → XP is awarded → feedback is immediate and celebratory.
5. User observes their character/stats state → understands the core loop.

**Flow 2 — Returning User (Cross-Device)**
1. User logs in (same or different device).
2. System presents the same tasks, character state, streak, and inventory as previously left.
3. User completes a task → progression continues from persisted state.

**Flow 3 — Task Lifecycle**
1. Create task (title/category/attributes — field set is a design decision).
2. View/edit task as needed.
3. Complete task → system awards XP to level and relevant attributes; currency accrues; event is logged historically.
4. Delete task at any time *(interaction of deletion with already-awarded XP/history is an open question — see §12)*.

**Flow 4 — Level-Up**
1. Cumulative XP crosses the next level's threshold.
2. System delivers a celebratory level-up moment.
3. New level and any attribute changes persist; a page refresh shows identical state.

**Flow 5 — Reward Purchase**
1. User accumulates currency from task completion.
2. User browses available rewards.
3. User purchases a reward → currency decrements → item enters inventory and/or is applied (theme/badge).
4. State persists across refresh.

**Flow 6 — Streak**
1. User is active on a given day *(definition of "active" — open question)*.
2. Consecutive-day counter increments and is visibly surfaced.
3. Behavior on a missed day is **undefined by the PS** → open question.

**Flow 7 — Persistence Proof (demo-critical)**
1. User completes an action that changes state (task completion, level-up, purchase).
2. User refreshes the page.
3. All state is identical to pre-refresh — this flow is explicitly required in the demo video.

**Flow 8 — Connection Loss (robustness)**
1. User attempts an action while connectivity is lost.
2. System handles it gracefully — no corrupted state, no dead UI, no unrecoverable error.
3. Exact recovery behavior (retry, queue, rollback) is an open question for engineering design; the **requirement** is graceful handling.

---

## 10. Future Considerations 🔮

*Explicitly out of v1 scope (per PS omission). Listed for roadmap context only — none are commitments.*

- Social/multiplayer: parties, guilds, shared quests, leaderboards.
- Re-engagement: push/email reminders, streak-protection prompts.
- Integrations to auto-log real-world activity (calendars, fitness platforms).
- Native mobile applications.
- Offline-first mode.
- Optional real-world task verification (photo/location check-ins).
- Monetization (premium cosmetics, adventure packs).
- Data export and self-service account deletion tooling.
- Internationalization/localization.

---

## 11. Assumptions & Dependencies 🧩

### Assumptions *(to be validated — each is falsifiable)*

| # | Assumption | Validation owner |
|---|---|---|
| A1 | v1 is a single-player product; no social features are expected by evaluators | Product/Team lead |
| A2 | Task completion is self-reported; the system validates the *integrity of the digital progression*, not the truth of the real-world action | Product |
| A3 | Free-tier hosting from the allowed platforms is sufficient for evaluation traffic | Engineering |
| A4 | One cohesive theme will be selected and signed off **before build begins** | Design/Stakeholders |
| A5 | The four demo-video scenarios listed in the PS are the complete set of required demo moments | Team lead |
| A6 | Hackathon duration and team size per organizer rules *(not stated in the PS — dependency on external context)* | Team lead |
| A7 | "Clean commit history" means legible, incremental commits reflecting real development — no single mega-commit | Team lead *(unconfirmed — see OQ)* |

### Dependencies

- **D1 (Critical):** Organizer clarification of the **Disqualification Rules** (PS §6 content is missing). Unresolved, this is an unquantifiable zero-score risk.
- **D2:** Access to a public GitHub organization/repo and a deployment platform from the allowed list, provisioned before final submission.
- **D3:** Demo video recording/editing pipeline and hosting location (repo or public link).
- **D4:** QA environments: keyboard-only navigation testing, at least one screen reader, and representative mobile + desktop device classes.
- **D5:** Stakeholder decisions on theme, XP curve, attribute taxonomy, reward catalog, and streak semantics (see §12/§13) delivered before engineering begins the affected epics.

---

## 12. Open Questions ❓

> Per PRD policy: information gaps are listed here **instead of** being resolved by assumption. Grouped by type; ordered by priority within each group.

### 🔴 Priority 1 — Missing Source Content

| # | Question | Why it matters |
|---|---|---|
| OQ1 | **The PS's Disqualification Rules list is blank.** What are the zero-tolerance violations? | Unknown rules = unmitigable zero-score risk. Must be obtained from organizers. |

### 🟠 Priority 2 — Ambiguous or Conflicting Requirements in the PS

| # | Question | Conflict/ambiguity |
|---|---|---|
| OQ2 | Does "non-linear leveling" mean any monotonically increasing XP threshold (including linearly increasing), or a specifically non-linear (accelerating) curve? | The PS's parenthetical definition conflicts with its label. |
| OQ3 | What is the minimum bar for "prevent users from **easily** cheating"? | "Easily" implies a tolerance threshold that is undefined; determines anti-cheat engineering depth. Related: what is the intended behavior for complete-then-uncomplete task toggling (a known exploitation pattern in this category)? |
| OQ4 | "Buy virtual items, themes, **or** profile badges" — is one reward category sufficient, or are all three expected? | The "or" is ambiguous; scope impact is significant. |
| OQ5 | What defines "activity" for streaks — login, any task interaction, or task completion? | Determines streak data model and reset logic. |
| OQ6 | What is "seamless cross-device synchronization" at minimum — is login on a second device showing current data sufficient, or is concurrent/live sync expected? | Determines sync complexity. |
| OQ7 | "SEO-friendly content" vs. an authenticated core experience — does SEO scope apply only to public surfaces (landing/login), or is public content expected? | SEO effort may be misallocated without this answer. |
| OQ8 | Which accessibility standard/level applies, and which screen readers must be supported? "Structurally sound for screen readers" has no named conformance target. | Determines QA acceptance criteria. |
| OQ9 | The PS lists "minimalist modern dashboard" as a permitted creative direction while simultaneously warning against generic dashboard aesthetics. What distinguishes an acceptable minimalist theme from a penalized generic one? | Theme selection carries evaluation risk despite being "free." |
| OQ10 | Does deleting a completed task reverse awarded XP/currency, or is history immutable? | Affects data model, anti-cheat posture, and UX. |
| OQ11 | How are timezone boundaries handled for "consecutive days" (streaks)? | Travel/timezone users will otherwise break streaks spuriously. |
| OQ12 | What constitutes a "clean commit history" and an acceptable commit cadence? | Unverifiable compliance requirement. |
| OQ13 | What video hosting platforms/links are acceptable ("in the repo or via an accessible public link")? | Affects submission logistics. |
| OQ14 | Are password reset / email verification / account deletion flows expected? | Not mentioned; compliance-sensitive. |

### 🟡 Priority 3 — Product Decisions Reserved for Stakeholders

| # | Decision | Owner |
|---|---|---|
| OQ15 | Theme selection (cozy lo-fi / 16-bit retro / cyberpunk / minimalist / other) and the associated design language (typography, palette, terminology mapping) | Design + stakeholders |
| OQ16 | XP curve parameters and level cap behavior | Product + stakeholders |
| OQ17 | Final attribute taxonomy and task-category mapping | Product |
| OQ18 | Reward catalog contents, currency earn rates, and pricing | Product |
| OQ19 | Streak-break policy (hard reset, forgiveness, freeze item, none) | Product |
| OQ20 | Onboarding depth (is a guided first-run experience in v1 scope?) | Product + Design |

---

## 13. Frequently Asked Questions 💬

**Q: Can this be built frontend-only with local storage?**
A: No. The PS explicitly requires a secure backend, a relational/document database with historical logs, authentication for cross-device sync, and a demo showing persistence across page refresh. A client-only implementation fails the product's core premise.

**Q: Can we use a Backend-as-a-Service (Firebase, Supabase, etc.)?**
A: Yes — BaaS options are explicitly listed in the PS's allowed technology pool. Specific selection is an engineering decision.

**Q: Does the PS mandate a specific XP formula or item set?**
A: No — it deliberately leaves the math and items open, stating "we are not dictating the exact math or specific items." The only hard constraint is that each subsequent level requires more XP than the last (see OQ2 for the non-linearity ambiguity).

**Q: Is offline support required?**
A: No. The Robustness criterion requires *graceful handling* of a dropped connection, not offline operation. Full offline mode is a future consideration.

**Q: Is social/multiplayer functionality required?**
A: Not per the PS. It is out of v1 scope by omission (assumption A1 — confirm if any stakeholder disagrees, as this would be a scope change).

**Q: Must we support password recovery or account deletion?**
A: Unspecified. Escalated as OQ14 for compliance review.

**Q: Which assistive technologies must pass QA?**
A: Unspecified. Escalated as OQ8. A pragmatic proposal (pending stakeholder confirmation): keyboard-only navigation across 100% of flows plus validation with at least one major screen reader.

**Q: Can the video exceed 180 seconds or 100 MB "just a little"?**
A: The PS states these limits strictly. Treat as hard constraints; no tolerance is stated.

**Q: Is a minimalist theme allowed given the warnings about generic designs?**
A: The PS lists minimalist as an allowed direction, but judging penalizes generic/unstyled output. A minimalist theme must still be deliberately designed and cohesive (see OQ9).

---

## 14. Questions Before Development 🚦

*To be resolved before engineering begins implementation. Items marked 🔴 are blocking.*

### Remaining Risks

- 🔴 **R1 — Unknown disqualification rules (OQ1):** The PS promises a zero-tolerance list that is absent from the source document. Until clarified, the team cannot fully de-risk submission.
- **R2 — Design-execution risk:** The heaviest-weighted evaluation pillar explicitly penalizes generic output. Under-investing in E5 (Experience Design) is the single most likely cause of a low score despite functional completeness.
- **R3 — Demo-video constraint risk:** The 90–180s window is tight for four mandated scenarios (signup → task → level-up → refresh). Requires a scripted, rehearsed walkthrough; overruns are non-compliant.
- **R4 — Scope-creep risk on gamification systems:** The PS leaves math, items, and streak policy open. Unbounded design here can consume the timeline at the expense of polish and robustness.
- **R5 — Anti-cheat over/under-engineering:** Without a defined "easily cheating" threshold (OQ3), the team may build either too little (evaluation risk) or too much (timeline risk).

### Open Assumptions to Confirm

- A1 single-player scope · A2 self-report integrity boundary · A3 free-tier hosting sufficiency · A5 completeness of demo scenarios · A7 "clean commit history" interpretation.

### Dependencies to Resolve

- 🔴 **D1:** Organizer clarification of Disqualification Rules.
- **D2–D5:** Repo/hosting provisioning; video pipeline; QA device + screen-reader environments; stakeholder sign-offs on OQ15–OQ20 **before** their corresponding epics begin.

### Edge Cases to Define (with QA) Pre-Build

1. Empty task submission *(named in PS — behavior must be defined)*.
2. Connection drop mid-action *(named in PS — behavior must be defined)*.
3. Rapid complete → un-complete → complete toggling *(cheating vector; ties to OQ3)*.
4. Timezone change or travel across a date boundary during a streak *(OQ11)*.
5. Page refresh during a level-up animation.
6. Two concurrent sessions on the same account.
7. Session expiry mid-task-composition (draft input must not be silently lost).
8. Very large task lists (rendering and responsiveness).
9. Deletion of an already-completed, XP-awarded task *(OQ10)*.
10. Purchase attempt with insufficient currency.

### Stakeholder Decisions Required Before Engineering

| Decision | Blocking epic | Owner |
|---|---|---|
| Theme + design language sign-off (OQ15) | E5, E6, E7 | Design + stakeholders |
| XP curve parameters (OQ16, OQ2) | E3, E4 | Product |
| Attribute taxonomy (OQ17) | E2, E4 | Product |
| Reward catalog scope (OQ18, OQ4) | E4 | Product |
| Streak semantics + break policy (OQ19, OQ5, OQ11) | E4 | Product |
| Anti-cheat tolerance definition (OQ3, OQ10) | E1, E8 | Product + Engineering |
| Accessibility acceptance criteria (OQ8) | E7, QA | Product + QA |
| Account-lifecycle scope (OQ14) | E1, Compliance | Compliance |

---

### 📌 Recommended Next Step

Resolve **OQ1 (missing Disqualification Rules)** with the hackathon organizers first — it is the only item that can zero the submission regardless of everything else the team builds. In parallel, convene the theme and progression-curve decisions (OQ15–OQ16), as they gate the majority of design and engineering work.