# TRAJECTORY
_Last synced: 2026-10-13 @ a405fc6 · built from: my requests (chat) + GitHub issues #1, #4 (no closed issues) + CONTEXT.md §7_

## 🎯 Final Goal
Prompt Genius keeps my prompts **one shortcut away on any AI chat**. It comes as three userscripts (general, medical, vibe coding) that are **simple, powerful, stable and consistent**. Anyone can load their own prompts from **their own GitHub fork**. The vibe coding script is a **simple** project memory: CONTEXT.md (present), CHANGELOG.md (past), TRAJECTORY.md (final goal + to-do). It works the same in Claude Code, Codex, Cursor and Antigravity, even with several agents at once.

**Done when:**
- [ ] The three userscripts are on `main`, installable from the README, and run side by side on every supported chat site.
- [ ] A user can fork the repo, add prompts to `all_prompts/` and see them in the General palette.
- [ ] The vibe coding script holds the simple 101 docs plus helpers, and every prompt is also a `.md` file in `vibe-coding-tools-101/`.
- [x] The landing page (`index.html`) shows the same prompts as the userscripts, from one source.

## ✅ To Do

### Now
- [ ] **T014** — Install the three scripts from the README links and try them on real chat sites — medical users must reinstall once from the new URL · `(chat)`
- [ ] **T024** — Release: after this PR is merged and I say "release", push the historic tags and create GitHub Releases for Original v1.5.0, Medical v3.1.0, Vibe Coding v1.2.0, then mark the CHANGELOG headings ✅ — tags are the rescue anchors · `(chat)`
  - [ ] Confirm the backfill table (PR description / `RELEASE.md` §Release history)
  - [ ] Find out whether Greasy Fork syncs the original script from GitHub (webhook or sync URL) · `(chat, RELEASE.md)`

### Next
- [ ] **T015** — Port the medical script's fixes to General and Vibe Coding: keep the user's draft when inserting, `Ctrl+C` selection check, `e.code` for Alt keys, safer JSON/CSV import · `(CONTEXT §7)`
- [ ] **T017** — Check the real input selectors on Google Labs Flow and the current ChatGPT / Claude composers · `(CONTEXT §7)`

### Later
_(empty: nothing parked yet)_

## ✔️ Done (latest 10)
- [x] **T016** — `index.html` loads its prompts from the userscripts, like the medical section — one source: 32 prompts, with RELEASE and the helpers; General v1.1.0 takes the page's fuller texts · `(chat, a405fc6)`
- [x] **T025** — CHANGELOG inspired by [Keep a Changelog](https://keepachangelog.com/en/): the prompt links it and follows it, and `CHANGELOG.md` is rebuilt with one section per version · `(chat, 8fd07fc)`
- [x] **T023** — 🧱 Stabilize a Prototype helper: prototype baseline → docs → ✅ known good → first release · `(chat, c261733)`
- [x] **T022** — RELEASE prompt (`generate-release.md`) + `RELEASE.md` draft for three tracks, with the planned historic tags · `(chat, c261733)`
- [x] **T021** — CHANGELOG becomes the rescue tool: known-good markers + Rescue mode (`git bisect`), linked from Debug · `(chat, c261733)`
- [x] **T013** — Merge the work: PR #11 (the split) and PR #12 (everything after it) · `(chat, 6550c38)`
- [x] **T019** — CHANGELOG keeps the complete history, for AI troubleshooting and human readers · `(chat)`
- [x] **T018** — CONTEXT.md is the one real context file; existing CLAUDE.md / AGENTS.md / GEMINI.md get a pointer to it · `(chat)`
- [x] **T012** — TRAJECTORY.md as a to-do list plus a final goal, built from my requests and the repo's issues · `(#4, chat)`
- [x] **T011** — Handoff helper that summarizes a chat into HANDOFF.md, on demand only · `(chat, 2ee8de9)`

## ❌ Won't Do
- **T020** — A separate repo `HANDOFF.md` kept up to date — why not: not always needed; the Handoff helper makes one on demand · `(chat)`
- **T002** — A 31-prompt system with AGENTS.md, MEMORY.md, PRD, ARCHITECTURE.md, a shared footer and stages — why not: too complicated, I prefer the old simple system · `(chat, 6550c38 → 2ee8de9)`
- **T001** — A separate `dynamique-prompt.js` userscript — why not: built into General instead, to keep three scripts · `(#1, 88a9ee3)`

## ❓ Questions for me
- Should the original `Prompt generator.user.js` also get the improved CONTEXT / CHANGELOG / README / TRAJECTORY prompts and the new RELEASE prompt, or stay frozen for Greasy Fork users? (`index.html` got them with T016.)
- When does **General** (`userscripts/general.user.js` v1.0.0) join the releases, with its own `general-v` tags? Out of scope until you say so.
- `vibe-v1.0.0`: tag the first commit with that version (`6550c38`, the 30-prompt draft that was on `main` first) or the last one (`d61dfc0`, the 13-prompt version installed today)? The plan uses the first, per the version-change rule.
- Issue #4 also says "improve the prompt genius". Is anything specific still missing after PR #11?
