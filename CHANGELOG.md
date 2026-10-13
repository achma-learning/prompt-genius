# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and each userscript follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) on its own.

**How to read this:**
- Newest first. Dates are commit dates, in ISO 8601. The whole history is here; search it (`Ctrl+F`) for an error message, a file name or a feature.
- Three tracks, each with its own version and tag prefix: **original** (`Prompt generator.user.js`, `original-v`), **medical** (`userscripts/medical.user.js`, `medical-v`), **vibe** (`userscripts/vibe-coding.user.js`, `vibe-v`). **general** (`userscripts/general.user.js`) is versioned but not tagged yet. Current versions and install links: [`RELEASE.md`](./RELEASE.md).
- `## [track vX.Y.Z]` is a version; the bracket links to its diff (links work once the tags exist). `## YYYY-MM-DD — …` without brackets is work outside every version: docs, the landing page, or a change shipped without a bump.
- `(a3f291)` is a short SHA — `git show a3f291` to see the diff.
- Entries explain symptom + cause, not just "fixed." `**Breaking:**` marks anything that breaks saved data, a shortcut or an install URL.
- Last known-good commit: search for `✅`. The first hit from the top is the newest version or change that was checked and worked. _(None yet: the first tags come with the first release.)_
- _Rebuilt on 2026-10-13 in Keep a Changelog shape: entries that sat under `[Unreleased]` were moved to the version that shipped them, Medical v2.0.0 / v3.0.0 got their missing sections, and `### Architectural` became `Architectural:` lines under Changed. Entry text is unchanged unless noted._

---

## [Unreleased]
_Nothing yet._

---

## [general v1.1.0] — 2026-10-13

### Added
- « ChatGPT Photoshop Guide » (`photoshop-chatgpt`, category Creative), until now only on the landing page. `(a405fc6)`
- `window.__PGG_EXPORT__` hook: loaded as a plain script (no userscript manager), the script hands its prompt list to `index.html` and stops before any `GM_*` call. No change inside Tampermonkey / Violentmonkey. `(a405fc6)`

### Changed
- Eight prompts take the landing page's fuller text, which follows the `all_prompts/` sources more closely: Chris Voss negotiation (tone and output constraints), Feynman (the full `<System>` / `<Context>` loop), learning cards, multidisciplinary expert, critical thinking coach, honest responses, focus (the seven prompts written out), prompt codes. Ids unchanged. `(a405fc6)`

---

## 2026-10-13 — landing page loads the userscripts

### Changed
- Architectural: `index.html` has no prompt list of its own anymore (T016). It loads `userscripts/general.user.js` and `userscripts/vibe-coding.user.js` through their export hooks, like the medical section, so the page always shows what the scripts ship: 32 prompts instead of 21, now with the RELEASE prompt and the eight helpers. Short card blurbs and the "when to run it" lines stay in the page as `DESCRIPTIONS` / `VIBE_STEPS` (page copy, not prompt text). `(a405fc6)`
- Vibe Coding 101 section: seven numbered doc prompts, then the helpers under their own heading, plus an "Install the userscript" button. The doc prompts are the current versions from `vibe-coding-tools-101/*.md`, not the March copies. `(a405fc6)`
- The page ids `average-search`, `focus-recovery` and `chatgpt-codes` became the scripts' `honest-search`, `focus` and `prompt-codes`. `(a405fc6)`

### Fixed
- Card icons on the landing page had no tinted background: the colour was `var(--red)` and the code appended `22` for transparency, which is invalid CSS. Colours now come from the scripts as `#rrggbb`. `(a405fc6)`
- If a userscript file can't be loaded (page opened without its `userscripts/` folder), the grid says which file is missing and offers "Try again", instead of staying empty. `(a405fc6)`

### Security
- Titles, categories, icons and ids from the scripts are escaped before they reach `innerHTML` in the grid, the Vibe Coding cards and the `⌘K` palette; card colours must match `#rrggbb`. `(a405fc6)`

---

## [vibe v1.3.0] — 2026-10-13

### Changed
- RELEASE prompt works on **any repo**, not only userscripts. A new Phase 1 lists release candidates (`apk`, `zip`, `js`, `pdf`, `exe`…) and **asks** which files ship, where each comes from (in the repo, built, or from my computer), the version scheme (SemVer or date) and how users update. Answers go into `RELEASE.md` → Tracks, so later runs don't ask again. Phases renumbered: Read, Ask, Decide, Prepare, STOP, Ship. `(4c69e7c)`
- RELEASE prompt works in **any AI**: it first says its mode. 🤖 **Agent** (Claude Code, Codex, Cursor…) does the work itself. 🧭 **Manual** (ChatGPT, Claude.ai, Gemini…) reads the repo through the public GitHub API or asks me to paste it, asks which files ship, then guides me with numbered **file cards** (path + full content, or exact find → replace, + the buttons to click) and click-by-click release steps on the GitHub website, waiting for my "done" after each. **Mixed**: an agent that can't create releases hands those steps to me. `RELEASE.md` gains a "How to release" section. `(3de1bbd)`
- RELEASE prompt: more version sources (`build.gradle` `versionName`/`versionCode`, `pubspec.yaml`, `*.csproj`, `manifest.json`, `VERSION`); install and rollback notes per file type; SHA-256 for binaries; a verify step after the release; pinned links for release assets (`releases/download/<tag>/<file>`). `(4c69e7c)`

### Added
- RELEASE prompt, "How to ship": `gh` → `gh api` (REST) → a GitHub tool that can create releases → otherwise a ready-to-run script for me, with the release marked `_pending_` — never a pretend release. Found in a cloud session whose GitHub MCP tools can only read releases. `(4c69e7c)`

### Security
- RELEASE prompt: never commit built files to release them, and never attach keystores, `.env` or a zip that contains them; list a zip's contents before attaching it. `(4c69e7c)`

---

## [vibe v1.2.0] — 2026-10-13

### Changed
- CHANGELOG prompt follows [Keep a Changelog](https://keepachangelog.com/en/) 1.1.0: `Deprecated` is its own bucket again, `**Breaking:**` prefix, `## [version] — YYYY-MM-DD` headings, `[YANKED]`, link references, SemVer statement, dated sections for unversioned work. `(8fd07fc)`
- Refactor helper writes its `Architectural:` line under `### Changed`; it used to ask for a `### Architectural` bucket the CHANGELOG prompt doesn't have. `(8fd07fc)`

---

## [vibe v1.1.0] — 2026-10-13

### Added
- CHANGELOG prompt, Rescue mode: "rescue", "everything is broken" or "it worked before" → stash uncommitted work, `git bisect` from the newest ✅ or release tag, report the first bad commit, then revert or fix forward on my OK. Never `reset --hard`, force-push or move tags. `(c261733)`
- CHANGELOG prompt, known-good markers: released headings carry `tag <tag> (<sha>) ✅ known good`; `[Unreleased]` entries get `✅ verified (sha)` only when confirmed. `(c261733)`
- RELEASE prompt (`vibe-coding-tools-101/generate-release.md`, `vc-release`): GitHub Release Manager for `RELEASE.md`, per-track tags, semver bumps, `gh release create` (REST fallback). Stops for my OK before anything ships. `(c261733)`
- Helper 🧱 Stabilize a Prototype (`vc-stabilize`): commit the AI-drafted prototype as a baseline, document it without refactoring, run CONTEXT → CHANGELOG (full) → TRAJECTORY, then mark it ✅ and propose `v0.1.0`. `(c261733)`

### Changed
- Seven doc prompts and eight helpers. The Debug helper now points to Rescue mode for "it worked a few commits ago". `(c261733)`
- `scripts/sync-vibe-prompts.js` copies `generate-release.md` too (`DOC_FILES`); `helpers/` gains `stabilize.md`. `(c261733)`

### Fixed
- Installs of v1.0.0 made before PR #12 kept the first, 30-prompt draft — the 13-prompt rewrite shipped under the same `@version`. v1.1.0 updates them. `(2ee8de9, c261733)`

---

## [vibe v1.0.0] — 2026-10-13

### Added
- `userscripts/vibe-coding.user.js` (`Alt/⌥+V`): the six Vibe Coding 101 doc prompts (CONTEXT.md, CHANGELOG.md, TRAJECTORY.md, README.md, TROUBLESHOOTING.md, PROMPTS.md), plus seven helpers. `(6550c38, 2ee8de9)`
  - Helpers: Plan Before Code, Debug, Review the Diff, Refactor Safely, Security Check, Manager, Handoff.
  - Each helper reads CONTEXT.md and ends by updating CONTEXT.md §7 and CHANGELOG.md, so no new files are needed. Manager adds `MANAGER.md` (one file per agent at a time), and Handoff writes `HANDOFF.md` (a summary of the chat).
- `Tab` picks several prompts; `Enter` inserts them as one numbered session. Search ranks title matches first. `(2ee8de9)`
- `vibe-coding-tools-101/helpers/`: the helper prompts as ready-to-copy `.md` files (#4). `node scripts/sync-vibe-prompts.js` writes them from the userscript through the `__PGV_EXPORT__` hook, the same trick the medical script uses for `index.html`. `(88a9ee3, c44fbda)`

### Changed
- The six doc prompts read their text from `vibe-coding-tools-101/*.md` (copied in by `sync-vibe-prompts.js`), so each prompt has a single source. The original script and `index.html` keep the old copies. `(c44fbda)`
- CONTEXT prompt: `CONTEXT.md` is the one real context file. It merges what's true from `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` and adds a "read and update CONTEXT.md" pointer to the ones that exist. §7 "Next up" points to TRAJECTORY.md. Target ≤ 200 lines. `(c44fbda)`
- CHANGELOG prompt: keeps the **complete history** (no 600-line cap, no 12-month archive). Six buckets (Added, Changed, Fixed, Removed, Security, Broken), `Deprecated:` as a prefix (its own bucket again in vibe v1.2.0). Quick mode by default; full rebuild on request. `(c44fbda)`
- README prompt: a 3-step **Quick start** line at the top, kept in sync with "Install & run". `(c44fbda)`
- TRAJECTORY prompt rewritten (#4): a **final goal plus a to-do list** (Now / Next / Later / Done / Won't Do / Questions), built from my requests and the repo's GitHub issues, one cited line per item. `(88a9ee3, c4646f5)`

### Removed
- The first draft: 30 prompts and new files (AGENTS.md, MEMORY.md, PRD, ARCHITECTURE…), live on `main` from PR #11 — too complicated; replaced by the 13 prompts above (TRAJECTORY T002). `(6550c38, 2ee8de9)` _(Corrected: earlier text said 31 prompts and "before release".)_

---

## [general v1.0.0] — 2026-10-13

### Added
- `userscripts/general.user.js` (`Ctrl/⌘+Shift+P`): the 16 non–vibe coding prompts of the original script. `(6550c38)`
- Loads prompts from a GitHub repo folder, such as your fork's `all_prompts/` (#1). `(88a9ee3)`
  - A window shown once after install asks for `owner/repo` or a folder URL; it's also under ⚙️ → GitHub prompts.
  - Files: one `.md` / `.txt` file per prompt (title = first `# heading`), or `.json` lists; sub-folders become categories.
  - One API call per sync, files from raw.githubusercontent.com, cached for 6 h (the unauthenticated limit is 60 calls/h); clear errors for rate limits and wrong repos.

### Security
- Read-only GETs, limited by `@connect` to api.github.com and raw.githubusercontent.com. Colors from remote files are restricted to hex values. `(88a9ee3)`

---

## 2026-10-13 — three userscripts, repo docs

### Added
- `CHANGELOG.md` rebuilt in [Keep a Changelog](https://keepachangelog.com/en/) shape: one section per version per track, link references, SemVer statement. `(e4e00c5)`
- `RELEASE.md` draft: the three tracks (`original-v`, `medical-v`, `vibe-v`), pinned install links, rollback steps, release checklist and the planned historic tags. No tag exists yet. `(c261733)`
- README: "Releases & older versions" section. `(c261733)`
- `TRAJECTORY.md` for this repo, made with the new prompt. `(c4646f5)`

### Changed
- **Breaking:** the medical script moved to `userscripts/medical.user.js`, and its `@downloadURL`/`@updateURL` follow it, without a version bump. Installs from the old root URL stop updating; reinstall once from the README link. `@name`/`@namespace` are unchanged, so saved prompts and settings stay. `index.html` loads it from the new path. `(6550c38)`
- Each split script has its own CSS/id prefix (`pgg-`, `pgv-`, `pgm-`), shortcut and button, so all of them run on the same page without clashing. `(6550c38)`
- Architectural: `vibe-coding-tools-101/101.txt` and `102.txt` renamed to `.md` (#4). `(88a9ee3)`
- `Prompt generator.user.js` is unchanged and stays available for existing Greasy Fork installs. Don't run it together with General: both use `Ctrl+Shift+P`. `(6550c38)`
- `Prompt generator.user.js` and `index.html` keep their older Vibe Coding prompt copies, by design (open question in TRAJECTORY). `(c261733)`

---

## [medical v3.1.0] — 2026-10-12
_File: `prompt-med.user.js` (was `prompt med.js` v3.0.0)._

### Added
- « Mes filtres »: a custom category made of one or more jobs plus hand-picked prompts from other jobs. Can be the default category on open, and prompts can be added from the preview pane. `(1c2efb7)`
- Settings tab « Prompts actifs »: switch whole jobs or single prompts off. They leave the palette and the search index (lighter list, faster filtering), and nothing is deleted. `(1c2efb7)`
- Desktop three-pane layout (categories | results | preview with highlighted `[placeholders]`), favourites (`Alt+F`), « Récents », `Alt+C` copy, PageUp/PageDown, hotkey choice, floating-button toggle, opt-in memory of form answers, and Tampermonkey menu commands. `(1c2efb7)`
- Accent-insensitive, multi-word, ranked search. A query with no hit in the current category falls back to all categories. `(1c2efb7)`

### Changed
- **Breaking:** default hotkey `⌘⇧P` → `Alt+M` (it clashed with the main script; see Fixed). `(1c2efb7)`
- Renamed `prompt med.js` → `prompt-med.user.js` so userscript managers offer one-click install; added `@downloadURL`/`@updateURL`. `@name`/`@namespace` deliberately unchanged so existing installs keep their saved prompts. `(1c2efb7)`

### Fixed
- Both palettes opened together when the main script was also installed. Cause: same `Ctrl+Shift+P`, same element ids (`pg-*`), same `:root` CSS variables and same button corner. Now everything is `pgm-*`, the default hotkey is `Alt+M` and the button sits higher. `(1c2efb7)`
- The last 26 of 226 prompts were unreachable under « Tous». Cause: the list was silently capped at 200. `(1c2efb7)`
- Filling one `[X]` filled every `[X]` of the prompt (9 prompts, e.g. as-9's five times). Cause: fields were keyed by placeholder text, not occurrence. Fields are now labelled from their line (« Contraintes — petit-déjeuner à ▢ h ») instead of « X ». `(1c2efb7)`
- Enter in the first form field inserted a half-filled prompt. It now moves to the next field; `Ctrl+Enter` inserts. `(1c2efb7)`
- `Alt+1–9` did nothing on macOS (Option+1 types "¡") and on AZERTY. Cause: matched `e.key`, not the physical `e.code`. `(1c2efb7)`
- `Ctrl+C` with text selected in the search box copied the whole prompt. Cause: `getSelection()` doesn't see input selections. `(1c2efb7)`
- Inserting into a textarea wiped the user's draft. Cause: the value was replaced, not appended. Also, the textarea setter was called on `<input>` (Illegal invocation). `(1c2efb7)`
- A malformed JSON import broke the palette until storage was cleared. CSV split on every comma and ignored Excel FR's `;`. `(1c2efb7)`
- Custom prompts only appeared under « Tous » (their `catKey: 'custom'` had no category). `(1c2efb7)`
- Every chat page fetched Google Fonts through a CSS `@import`, which CSP blocks on several hosts anyway. Now system fonts; the palette DOM is built on first open. `(1c2efb7)`

---

## 2026-10-12 — landing page and README

### Added
- Landing page: new « Prompts médicaux » section: 226 cards with job chips, accent-free search, copy and modal. The data is loaded on demand from `prompt-med.user.js` itself (via a `window.__PGM_EXPORT__` hook), so there is no second copy to drift. The `⌘K` palette searches them too. `(1c2efb7)`
- Landing page: a "Vibe Coding 101" section: the six `vc-*` prompts as numbered steps (CONTEXT → CHANGELOG → TRAJECTORY → README → TROUBLESHOOTING → PROMPTS), each with one-click copy and view. They also join the grid under a `Vibe Coding` filter, copied verbatim from `BUILTIN_PROMPTS`. `(b03f1f5)`
- `README.md` rewritten for non-technical readers: step-by-step userscript-manager install (incl. Chrome Developer mode + "Allow User Scripts"), Greasy Fork install link, usage, real palette screenshot at `docs/palette.png`. `(b03f1f5)`

### Changed
- Original script: `@downloadURL` / `@updateURL` now point at Greasy Fork (script 571159) instead of GitHub raw, so installed copies update from the Greasy Fork listing. Shipped without a version bump (still v1.5.0). `(b03f1f5)`

### Fixed
- Landing page scrolled sideways on phones (~400px) — long unbreakable card titles like `(TROUBLESHOOTING.md)` set the grid column's min width. Titles now wrap. `(b03f1f5)`
- "Copy" silently failed when `index.html` was opened from disk — `navigator.clipboard` is undefined outside secure contexts. Falls back to `execCommand('copy')`. `(b03f1f5)`

---

## [medical v3.0.0] — 2026-09-24
_File: `prompt med.js`._

### Added
- The full medical palette: 226 French prompts for 21 health jobs from the Lonasanté catalogue « 226 Prompts IA Santé », `⌘⇧P` to open, keyboard-only form for the context variables, direct injection into the chat. `(befa51d)`

### Fixed
- v2.0.0 didn't run — see its Broken entry. `(befa51d)`

---

## [medical v2.0.0] — 2026-09-24
_File: `prompt med.js`._

### Added
- First medical userscript header: « Prompt Genius — Médical (FMPM) », prompts for GPs, nurses and care assistants, based on Prompt Genius v1.5.0. `(4ebd082)`

### Broken
- The file stops after `(function () {`, so it never ran: `SyntaxError: Unexpected end of input`. Replaced by v3.0.0 one hour later. `(4ebd082)`

---

## [original v1.5.0] — 2026-08-24

### Added
- Four photo-restoration prompts in a new `Image Restoration` category, written for Google Labs Flow (and any image model that takes a reference image): `flow-restore-bw` (B&W → B&W archival repair), `flow-colorize` (B&W → color), `flow-revive-color` (faded 70s–90s prints), `flow-upscale-free` (max-resolution rebuild with no fidelity lock). `(57bd046)`
- `labs.google` support: new `@match https://labs.google/*` plus a `PROVIDERS` entry, so the palette opens on Flow / Whisk / ImageFX. `(57bd046)`
- `all_prompts/google-labs-flow-photo-restoration.md` — bilingual (EN + FR) long-form source for the four prompts, plus notes on what was changed from the originals and when *not* to use the no-fidelity one. `(57bd046)`
- Landing page: the four new prompts also landed in `index.html`'s `PROMPTS`, copied verbatim from `BUILTIN_PROMPTS` so the two lists don't drift on day one. `(57bd046)`

### Changed
- `findInput()` now walks `provider.sel` one selector at a time and prefers an input that is enabled, writable and actually rendered. Falls back to the first match found if nothing is visible, so existing sites behave as before. `(57bd046)`
- `@description` now mentions Google Labs / Flow. `(57bd046)`

### Fixed
- On Google Labs the prompt went nowhere — the old `document.querySelector(provider.sel)` resolved the comma list in *document* order and landed in a hidden offscreen textarea. `(57bd046)`

---

## 2026-04-27 — project docs and prompt archive

### Added
- `CONTEXT.md` at repo root — single-page brief so future AI assistants and future-me can pick up the project cold without re-reading 1840 lines of userscript. `(850f910)`
- `CHANGELOG.md` — this file. `(35ae0ec)`
- `reason-mode.md`, `improve-prompt.md` and a Prompt Engineering PDF at the repo root (prompt archive). `(9b1d48b, f0289d9, e8c9091)`

### Changed
- Architectural: documented the prompt-list drift: `BUILTIN_PROMPTS` (userscript, 18) and `PROMPTS` (`index.html`, 11) are independent copies; landing page is behind by 7 prompts and carries 3 the userscript doesn't have. No shared source yet. `(850f910)` — still true later; the counts became 22 and 15, then 22 and 21 once the six Vibe Coding prompts were copied over.

---

## [original v1.4.0] — 2026-04-27

### Added
- Three new "Vibe Coding" prompts wired into the palette: `vc-readme`, `vc-troubleshooting`, `vc-prompts-codex` — completes the 6-tool set (CONTEXT, CHANGELOG, TRAJECTORY, README, TROUBLESHOOTING, PROMPTS). `(1a66963)`
- `generate-readme.md`, `generate-troubleshooting.md`, `generate-prompts-codex.md` long-form sources under `vibe-coding-tools-101/` — palette ships compressed copies, these are canonical. `(1a66963)`
- New `Vibe Coding` category in the palette, surfacing all six meta-prompts for AI-assisted dev workflow. `(1a66963)`

### Changed
- `vibe-coding-tools-101/generate-trajectory.md` rewritten across two passes (107 then 221 lines diff) — sharpened the "trajectory cartographer" prompt into its current form. `(89ad2e0, 30de381, 4e07cf2)`
- Architectural: new `vibe-coding-tools-101/` directory consolidates all meta-prompt long-form sources; `changelogs builder.md` and `generate context.md` moved in from repo root. Establishes the "long-form source / inline compressed copy in `BUILTIN_PROMPTS`" pattern. `(2bd9ffc, 9560db6)`
- Architectural: `generate context.txt` → `generate context.md` with substantial rewrite (100 lines added, 69 removed) — markdown is now the working format for prompt sources. `(8a16caf, 25249d0)`
- Architectural: `DECISIONS prompt.md` renamed to `generate-trajectory.md` to align with the `generate-*` naming convention used by the other meta-prompts. `(6df22ef, 89ad2e0)`
- Architectural: added `vibe-coding-tools-101/101.txt` + `102.txt` — short companion notes (intent unclear from diff alone, kept as-is). `(9cf24e5, ec1868d)`

---

## [original v1.3.0] — 2026-04-13

### Added
- Custom Prompts Manager: "⚙️" button on the palette opens a modal to add, delete, import (JSON file), and export user-defined prompts alongside the built-ins. Persisted under one GM key (`pg_custom_prompts`). `(7a5fa11)`
- `getAllPrompts()` merges built-ins with custom prompts so search and palette navigation treat them uniformly (`Prompt generator.user.js:1324`). `(7a5fa11)`

---

## [original v1.2.0] — 2026-04-12

### Added
- "Universal Structured Agent" built-in prompt under the Meta category — distilled from four production AI agent system prompts (invoke, review, scheduled-triage, triage). `(34c361b)`
- `all_prompts/model prompt.md` — long-form template + usage guide for the Structured Agent pattern. `(34c361b)`

---

## [original v1.1.0] — 2026-04-12

### Added
- "Senior Userscript Engineer" built-in prompt covering metadata rules, selector hierarchy, MutationObserver patterns, GM_* storage, security checklist, and performance defaults. `(8c7063e)`
- `@downloadURL` / `@updateURL` headers pointing at GitHub raw on `main` — Tampermonkey now auto-updates installed users on `@version` bumps. `(8c7063e)`

### Security
- XSS hardening in palette rendering: search query and every custom-prompt field (`title`, `cat`, `icon`, `color`) now go through `escapeHtml()` before being interpolated into `innerHTML`. Closes a stored-XSS path where a custom prompt with HTML in its title would execute on every palette render. `(8c7063e)`
- Long-form `senior-userscript-engineer.md` uploaded to `all_prompts/` — encodes the security checklist this commit enforces, so the rule has a documented source. `(dec1eef)`

---

## [original v1.0.0] — 2026-03-26
_Initial public release._

### Added
- `Prompt generator.user.js` — first shipping userscript (606 lines). `⌘⇧P` / `Ctrl+Shift+P` palette, hostname-based provider routing for ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Mistral, Grok, Copilot, You.com, Poe; `injectText()` with three code paths (textarea native setter, contenteditable synthetic paste, fallback). `(34a7a31)`
- `index.html` — standalone landing page (941 lines, vanilla JS, fonts from Google CDN, no build step). Independent copy of the prompt library with its own `⌘K` palette and modal. `(d0bd676)`
- README updated to point users at Tampermonkey for installation. `(4d785d6, b91e779)`
- `all_prompts/senior-userscript-engineer.md` uploaded to repo root (later moved into `all_prompts/`) — the system prompt that governs userscript edits in this repo. `(85c811c)`

### Changed
- Architectural: single-file userscript, single-file landing page, zero npm dependencies, zero build tooling — established as the project's permanent shape, not a starting point. `(34a7a31, d0bd676)`

---

## 2026-01-22 → 2026-01-25 — prompt library bootstrap

_Pre-userscript era. Repo was a curated prompt archive only._

### Added
- Initial `all_prompts/` directory with seed prompts: `brutal honest` → `honest.txt` (replacement), `negotiation.txt` (Chris Voss style, refactored across 5 commits for clarity), `Learning.txt`, `expert.txt`, `coach.txt`, `focus.txt`, `social.txt`, `feynmann.txt`, `average search`, `ChatGPT photoshop instructions.txt` + `photoshop ai.jpeg`. `(b91e779, a00896a, 2913cc6, 31f9507, 7975cc6, dec1cb8, 6d30964, da5b7e6, c7a324c, f889250, 66845cd, ee002fb, 7a59770, 54654c7, 3b18d4f, 5f12d05, 1250c18, 340adf8, 2633483)`
- `chatGPT CODES.TXT` at repo root — the Quick Prompt Codes reference (ELI5, TLDR, SWOT, etc.) later compressed into the `prompt-codes` built-in. `(fafc95e)`
- LICENSE (MIT) and initial README. `(b91e779, f0b2162)`

### Changed
- Architectural: migrated `brutal honest` (no extension) → `brutal honest.txt`, then deleted in favor of `honest.txt` — early naming churn, later all prompt files standardized on `.txt` / `.md` extensions. `(2913cc6, 7975cc6, 31f9507)`
- Architectural: `all_prompts/` directory was created, deleted, and recreated within the same day; treat any pre-`a41519e` paths in old links as stale. `(a41519e, e100060)`

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CHANGELOG.md":
> 1. Quick mode (default): find the most recent SHA cited in the existing file. Full rebuild (only if I ask, or there's no file): start from the first commit.
> 2. Run `git log` and `git diff --stat` for everything since that SHA.
> 3. Apply the WIP Decoder — derive intent from diffs when commit messages are vague.
> 4. Group consecutive same-intent commits into single entries; split when intent changes.
> 5. Skip noise (lockfiles, formatter passes, typos, no-op commits).
> 6. Detect version bumps in manifests — if found, move the `[Unreleased]` entries into a `## [vX.Y.Z] — YYYY-MM-DD` section and add its link reference at the bottom.
> 7. Append new entries above existing ones. **Never rewrite past entries** except to fix factual errors or repair the Keep a Changelog shape (and note the correction inline).
> 8. Keep every past section, however old. Never trim, archive or delete history.
> 9. Keep every entry under 2 lines. The file itself has no length limit.
> 10. Add ✅ markers only for tagged versions and for changes I confirmed or a check passed. For "rescue", follow Rescue Mode.
> 11. Follow [Keep a Changelog](https://keepachangelog.com/en/): bucket order, ISO dates, link references, `[YANKED]`, deprecations and breaking changes always listed.

---

[Unreleased]: https://github.com/achma-learning/prompt-genius/compare/vibe-v1.2.0...HEAD
[vibe v1.2.0]: https://github.com/achma-learning/prompt-genius/compare/vibe-v1.1.0...vibe-v1.2.0
[vibe v1.1.0]: https://github.com/achma-learning/prompt-genius/compare/vibe-v1.0.0...vibe-v1.1.0
[vibe v1.0.0]: https://github.com/achma-learning/prompt-genius/releases/tag/vibe-v1.0.0
[medical v3.1.0]: https://github.com/achma-learning/prompt-genius/compare/medical-v3.0.0...medical-v3.1.0
[medical v3.0.0]: https://github.com/achma-learning/prompt-genius/compare/medical-v2.0.0...medical-v3.0.0
[medical v2.0.0]: https://github.com/achma-learning/prompt-genius/releases/tag/medical-v2.0.0
[original v1.5.0]: https://github.com/achma-learning/prompt-genius/compare/original-v1.4.0...original-v1.5.0
[original v1.4.0]: https://github.com/achma-learning/prompt-genius/compare/original-v1.3.0...original-v1.4.0
[original v1.3.0]: https://github.com/achma-learning/prompt-genius/compare/original-v1.2.0...original-v1.3.0
[original v1.2.0]: https://github.com/achma-learning/prompt-genius/compare/original-v1.1.0...original-v1.2.0
[original v1.1.0]: https://github.com/achma-learning/prompt-genius/compare/original-v1.0.0...original-v1.1.0
[original v1.0.0]: https://github.com/achma-learning/prompt-genius/releases/tag/original-v1.0.0
