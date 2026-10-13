# TRAJECTORY
_Last synced: 2026-10-13 @ dff0c1d · built from: my requests (chat) + GitHub issues #1, #4 (no closed issues) + CONTEXT.md §7_

## 🎯 Final Goal
Prompt Genius keeps my prompts **one shortcut away on any AI chat**. It comes as three userscripts (general, medical, vibe coding) that are **simple, powerful, stable and consistent**. Anyone can load their own prompts from **their own GitHub fork**. The vibe coding script is a **simple** project memory: CONTEXT.md (present), CHANGELOG.md (past), TRAJECTORY.md (final goal + to-do). It works the same in Claude Code, Codex, Cursor and Antigravity, even with several agents at once.

**Done when:**
- [ ] The three userscripts are on `main`, installable from the README, and run side by side on every supported chat site.
- [ ] A user can fork the repo, add prompts to `all_prompts/` and see them in the General palette.
- [ ] The vibe coding script holds the simple 101 docs plus helpers, and every prompt is also a `.md` file in `vibe-coding-tools-101/`.
- [ ] The landing page (`index.html`) shows the same prompts as the userscripts, from one source.

## ✅ To Do

### Now
- [ ] **T013** — Review and merge PR #11 — everything below under Done ships with it · `(chat)`
- [ ] **T014** — Install the three scripts from the README links and try them on real chat sites — medical users must reinstall once from the new URL · `(chat, HANDOFF.md)`

### Next
- [ ] **T015** — Port the medical script's fixes to General and Vibe Coding: keep the user's draft when inserting, `Ctrl+C` selection check, `e.code` for Alt keys, safer JSON/CSV import · `(CONTEXT §7)`
- [ ] **T016** — Make `index.html` load its prompts from the userscripts, like the medical section already does — one source, so the website also gets the new TRAJECTORY prompt and the helpers · `(CONTEXT §7)`
- [ ] **T017** — Check the real input selectors on Google Labs Flow and the current ChatGPT / Claude composers · `(CONTEXT §7)`

### Later
_(empty: nothing parked yet)_

## ✔️ Done (latest 10)
- [x] **T012** — TRAJECTORY.md as a to-do list plus a final goal, built from my requests and the repo's issues · `(#4, chat)`
- [x] **T011** — HANDOFF.md, plus a Handoff helper that summarizes a chat · `(chat, dff0c1d)`
- [x] **T010** — Bring back the simple CONTEXT.md / CHANGELOG.md system; keep the original 6 prompts word for word · `(chat, dff0c1d)`
- [x] **T009** — Prompts as `.md` files in `vibe-coding-tools-101/` (helpers/), and `101`/`102` renamed to `.md` · `(#4, eeccabb, dff0c1d)`
- [x] **T008** — General loads prompts from the user's GitHub fork (`all_prompts/`) · `(#1, eeccabb)`
- [x] **T007** — Insert several prompts at once (`Tab` to pick, `Enter` to insert) · `(chat, dff0c1d)`
- [x] **T006** — Manager for several AI agents: one file is edited by one agent at a time · `(chat, dff0c1d)`
- [x] **T005** — Helpers that work the same in Claude Code, Codex, Cursor and Antigravity: plan, debug, review, refactor, security · `(chat, #4, dff0c1d)`
- [x] **T004** — Three distinct userscripts: general, medical, vibe-coding, in `userscripts/` · `(chat, 6550c38)`
- [x] **T003** — Split the original script into general + vibe coding, and keep the original · `(chat, 6550c38)`

## ❌ Won't Do
- **T002** — A 31-prompt system with AGENTS.md, MEMORY.md, PRD, ARCHITECTURE.md, a shared footer and stages — why not: too complicated, I prefer the old simple system · `(chat, 6550c38 → dff0c1d)`
- **T001** — A separate `dynamique-prompt.js` userscript — why not: built into General instead, to keep three scripts · `(#1, eeccabb)`

## ❓ Questions for me
- Should the original `Prompt generator.user.js` also get the new TRAJECTORY prompt, or stay frozen for Greasy Fork users? (The landing page is covered by T016.)
- Issue #4 also says "improve the prompt genius". Is anything specific still missing after PR #11?
