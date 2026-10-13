# Changelog

Working journal of notable changes. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**How to read this:**
- Dates are commit dates.
- `(a3f291)` is a short SHA — `git show a3f291` to see the diff.
- Entries explain symptom + cause, not just "fixed."
- Each userscript has its own version (`@version` header) and tag prefix: `original-v`, `medical-v`, `vibe-v`. There is no `package.json`. Current versions and install links: [`RELEASE.md`](./RELEASE.md). _(Corrected 2026-10-13: this line used to name only `Prompt generator.user.js`.)_
- Last known-good commit: search for `✅`. The first hit from the top is the newest version or change that was checked and worked. _(None yet: the first tags come with the first release.)_

---

## [Unreleased]
_Changes since v1.4.0 (1a66963)._

### Rescue mode, releases and the Stabilize helper

#### Added
- CHANGELOG prompt, Rescue mode: "rescue", "everything is broken" or "it worked before" → stash uncommitted work, `git bisect` from the newest ✅ or release tag, report the first bad commit, then revert or fix forward on my OK. Never `reset --hard`, force-push or move tags. `(c261733)`
- CHANGELOG prompt, known-good markers: released headings carry `tag <tag> (<sha>) ✅ known good`; `[Unreleased]` entries get `✅ verified (sha)` only when confirmed. `(c261733)`
- RELEASE prompt (`vibe-coding-tools-101/generate-release.md`, `vc-release`): GitHub Release Manager for `RELEASE.md`, per-track tags, semver bumps, `gh release create` (REST fallback). Stops for my OK before anything ships. `(c261733)`
- `RELEASE.md` draft: the three tracks (`original-v`, `medical-v`, `vibe-v`), pinned install links, rollback steps, release checklist and the planned historic tags. No tag exists yet. `(c261733)`
- Vibe Coding helper 🧱 Stabilize a Prototype (`vc-stabilize`): commit the AI-drafted prototype as a baseline, document it without refactoring, run CONTEXT → CHANGELOG (full) → TRAJECTORY, then mark it ✅ and propose `v0.1.0`. `(c261733)`
- README: "Releases & older versions" section. `(c261733)`

#### Changed
- `userscripts/vibe-coding.user.js` v1.0.0 → v1.1.0: seven doc prompts and eight helpers. The Debug helper now points to Rescue mode for "it worked a few commits ago". `(c261733)`
- `scripts/sync-vibe-prompts.js` copies `generate-release.md` too (`DOC_FILES`); `helpers/` gains `stabilize.md`. `(c261733)`
- `Prompt generator.user.js` and `index.html` keep their older prompt copies, by design (open question in TRAJECTORY). `(c261733)`

### Three userscripts in `userscripts/`

#### Added
- `userscripts/general.user.js` v1.0.0 (`Ctrl/⌘+Shift+P`): the 16 non–vibe coding prompts of the original script.
- General loads prompts from a GitHub repo folder, such as your fork's `all_prompts/` (#1).
  - A window shown once after install asks for `owner/repo` or a folder URL; it's also under ⚙️ → GitHub prompts.
  - Files: one `.md` / `.txt` file per prompt (title = first `# heading`), or `.json` lists; sub-folders become categories.
  - One API call per sync, files from raw.githubusercontent.com, cached for 6 h (the unauthenticated limit is 60 calls/h); clear errors for rate limits and wrong repos.
  - Read-only GETs, limited by `@connect` to api.github.com and raw.githubusercontent.com. Colors from remote files are restricted to hex values.
- `vibe-coding-tools-101/helpers/`: the helper prompts as ready-to-copy `.md` files (#4). `node scripts/sync-vibe-prompts.js` writes them from the userscript, and copies the six doc prompts the other way, from `vibe-coding-tools-101/*.md` into the userscript. The script uses the `__PGV_EXPORT__` hook, the same trick the medical script uses for `index.html`.
- `userscripts/vibe-coding.user.js` v1.0.0 (`Alt/⌥+V`): the six Vibe Coding 101 doc prompts (CONTEXT.md, CHANGELOG.md, TRAJECTORY.md, README.md, TROUBLESHOOTING.md, PROMPTS.md), plus seven helpers.
  - Helpers: Plan Before Code, Debug, Review the Diff, Refactor Safely, Security Check, Manager, Handoff.
  - Each helper reads CONTEXT.md and ends by updating CONTEXT.md §7 and CHANGELOG.md, so no new files are needed. Manager adds `MANAGER.md` (one file per agent at a time), and Handoff writes `HANDOFF.md` (a summary of the chat).
  - `Tab` picks several prompts; `Enter` inserts them as one numbered session. Search ranks title matches first.
  - The six doc prompts now read their text from `vibe-coding-tools-101/*.md`, so each prompt has a single source. The original script and `index.html` keep the old copies.
  - CONTEXT prompt: `CONTEXT.md` is the one real context file. It merges what's true from `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` and adds a "read and update CONTEXT.md" pointer to the ones that exist, without touching their own content. §7 "Next up" points to TRAJECTORY.md. Target ≤ 200 lines.
  - CHANGELOG prompt: keeps the **complete history** (no 600-line cap, no 12-month archive), for AI troubleshooting and human readers. Six buckets (Added, Changed, Fixed, Removed, Security, Broken); `Architectural:` and `Deprecated:` become prefixes under Changed. Quick mode (new commits only) by default; full rebuild on request. Exact error messages are quoted so they can be searched.
  - README prompt: a 3-step **Quick start** line at the top, kept in sync with "Install & run".
  - TRAJECTORY prompt rewritten (#4): it now produces a **final goal plus a to-do list** (Now / Next / Later / Done / Won't Do / Questions), built from the user's requests in the conversation and the repo's GitHub issues, with one cited line per item. Source: `vibe-coding-tools-101/generate-trajectory.md`. The original script keeps the old version.
  - A first draft with 31 prompts and new files (AGENTS.md, MEMORY.md, PRD, ARCHITECTURE…) was dropped before release as too complicated.

#### Changed
- The medical script moved to `userscripts/medical.user.js`, and its `@downloadURL`/`@updateURL` follow it. Installs from the old root URL stop updating; reinstall once from the README link. `@name`/`@namespace` are unchanged, so saved prompts and settings stay. `index.html` loads it from the new path.
- Each split script has its own CSS/id prefix (`pgg-`, `pgv-`, `pgm-`), shortcut and button, so all of them run on the same page without clashing.
- `vibe-coding-tools-101/101.txt` and `102.txt` renamed to `.md` (#4).
- `TRAJECTORY.md` added for this repo, made with the new prompt.
- `Prompt generator.user.js` is unchanged and stays available for existing Greasy Fork installs. Don't run it together with General: both use `Ctrl+Shift+P`.

### Medical userscript — `prompt-med.user.js` v3.1.0 (was `prompt med.js` v3.0.0)

#### Added
- « Mes filtres »: a custom category made of one or more jobs plus hand-picked prompts from other jobs. Can be the default category on open, and prompts can be added from the preview pane.
- Settings tab « Prompts actifs »: switch whole jobs or single prompts off. They leave the palette and the search index (lighter list, faster filtering), and nothing is deleted.
- Desktop three-pane layout (categories | results | preview with highlighted `[placeholders]`), favourites (`Alt+F`), « Récents », `Alt+C` copy, PageUp/PageDown, hotkey choice, floating-button toggle, opt-in memory of form answers, and Tampermonkey menu commands.
- Accent-insensitive, multi-word, ranked search. A query with no hit in the current category falls back to all categories.

#### Fixed
- Both palettes opened together when the main script was also installed. Cause: same `Ctrl+Shift+P`, same element ids (`pg-*`), same `:root` CSS variables and same button corner. Now everything is `pgm-*`, the default hotkey is `Alt+M` and the button sits higher.
- The last 26 of 226 prompts were unreachable under « Tous». Cause: the list was silently capped at 200.
- Filling one `[X]` filled every `[X]` of the prompt (9 prompts, e.g. as-9's five times). Cause: fields were keyed by placeholder text, not occurrence. Fields are now labelled from their line (« Contraintes — petit-déjeuner à ▢ h ») instead of « X ».
- Enter in the first form field inserted a half-filled prompt. It now moves to the next field; `Ctrl+Enter` inserts.
- `Alt+1–9` did nothing on macOS (Option+1 types "¡") and on AZERTY. Cause: matched `e.key`, not the physical `e.code`.
- `Ctrl+C` with text selected in the search box copied the whole prompt. Cause: `getSelection()` doesn't see input selections.
- Inserting into a textarea wiped the user's draft. Cause: the value was replaced, not appended. Also, the textarea setter was called on `<input>` (Illegal invocation).
- A malformed JSON import broke the palette until storage was cleared. CSV split on every comma and ignored Excel FR's `;`.
- Custom prompts only appeared under « Tous » (their `catKey: 'custom'` had no category).
- Every chat page fetched Google Fonts through a CSS `@import`, which CSP blocks on several hosts anyway. Now system fonts; the palette DOM is built on first open.

#### Changed
- Renamed `prompt med.js` → `prompt-med.user.js` so userscript managers offer one-click install; added `@downloadURL`/`@updateURL`. `@name`/`@namespace` deliberately unchanged so existing installs keep their saved prompts.

### Landing page
- New « Prompts médicaux » section: 226 cards with job chips, accent-free search, copy and modal. The data is loaded on demand from `prompt-med.user.js` itself (via a `window.__PGM_EXPORT__` hook), so there is no second copy to drift. The `⌘K` palette searches them too.

### Added
- Four photo-restoration prompts in a new `Image Restoration` category, written for Google Labs Flow (and any image model that takes a reference image): `flow-restore-bw` (B&W → B&W archival repair), `flow-colorize` (B&W → color), `flow-revive-color` (faded 70s–90s prints), `flow-upscale-free` (max-resolution rebuild with no fidelity lock).
- `labs.google` support: new `@match https://labs.google/*` plus a `PROVIDERS` entry, so the palette opens on Flow / Whisk / ImageFX.
- `all_prompts/google-labs-flow-photo-restoration.md` — bilingual (EN + FR) long-form source for the four prompts, plus notes on what was changed from the originals and when *not* to use the no-fidelity one.
- The four new prompts also landed in `index.html`'s `PROMPTS`, copied verbatim from `BUILTIN_PROMPTS` so the two lists don't drift on day one.
- `CONTEXT.md` at repo root — single-page brief so future AI assistants and future-me can pick up the project cold without re-reading 1840 lines of userscript. `(850f910)`
- `index.html` gets a "Vibe Coding 101" section: the six `vc-*` prompts as numbered steps (CONTEXT → CHANGELOG → TRAJECTORY → README → TROUBLESHOOTING → PROMPTS), each with one-click copy and view. They also join the grid under a `Vibe Coding` filter, copied verbatim from `BUILTIN_PROMPTS`.
- `README.md` rewritten for non-technical readers: step-by-step userscript-manager install (incl. Chrome Developer mode + "Allow User Scripts"), Greasy Fork install link, usage, real palette screenshot at `docs/palette.png`.

### Changed
- `findInput()` now walks `provider.sel` one selector at a time and prefers an input that is enabled, writable and actually rendered. Symptom it fixes: on Google Labs the old `document.querySelector(provider.sel)` resolved the comma list in *document* order and landed in a hidden offscreen textarea, so the prompt went nowhere. Falls back to the first match found if nothing is visible, so existing sites behave as before.
- Userscript `@version` 1.4.0 → 1.5.0; `@description` now mentions Google Labs / Flow.
- Userscript `@downloadURL` / `@updateURL` now point at Greasy Fork (script 571159) instead of GitHub raw, so installed copies update from the Greasy Fork listing.

### Fixed
- Landing page scrolled sideways on phones (~400px) — long unbreakable card titles like `(TROUBLESHOOTING.md)` set the grid column's min width. Titles now wrap.
- "Copy" silently failed when `index.html` was opened from disk — `navigator.clipboard` is undefined outside secure contexts. Falls back to `execCommand('copy')`.

### Architectural
- Documented the prompt-list drift: `BUILTIN_PROMPTS` (userscript, 18) and `PROMPTS` (`index.html`, 11) are independent copies; landing page is behind by 7 prompts and carries 3 the userscript doesn't have. No shared source yet. `(850f910)` — still true after this change; the counts are now 22 and 15. Now 22 and 21: the six Vibe Coding prompts were copied over.

---

## 2026-04-27 — v1.4.0

### Added
- Three new "Vibe Coding" prompts wired into the palette: `vc-readme`, `vc-troubleshooting`, `vc-prompts-codex` — completes the 6-tool set (CONTEXT, CHANGELOG, TRAJECTORY, README, TROUBLESHOOTING, PROMPTS). `(1a66963)`
- `generate-readme.md`, `generate-troubleshooting.md`, `generate-prompts-codex.md` long-form sources under `vibe-coding-tools-101/` — palette ships compressed copies, these are canonical. `(1a66963)`
- New `Vibe Coding` category in the palette, surfacing all six meta-prompts for AI-assisted dev workflow. `(1a66963)`

### Changed
- `vibe-coding-tools-101/generate-trajectory.md` rewritten across two passes (107 then 221 lines diff) — sharpened the "trajectory cartographer" prompt into its current form. `(89ad2e0, 30de381, 4e07cf2)`

### Architectural
- New `vibe-coding-tools-101/` directory consolidates all meta-prompt long-form sources; `changelogs builder.md` and `generate context.md` moved in from repo root. Establishes the "long-form source / inline compressed copy in `BUILTIN_PROMPTS`" pattern. `(2bd9ffc, 9560db6)`
- `generate context.txt` → `generate context.md` with substantial rewrite (100 lines added, 69 removed) — markdown is now the working format for prompt sources. `(8a16caf, 25249d0)`
- `DECISIONS prompt.md` renamed to `generate-trajectory.md` to align with the `generate-*` naming convention used by the other meta-prompts. `(6df22ef, 89ad2e0)`
- Added `vibe-coding-tools-101/101.txt` + `102.txt` — short companion notes (intent unclear from diff alone, kept as-is). `(9cf24e5, ec1868d)`

---

## 2026-04-13 — v1.3.0

### Added
- Custom Prompts Manager: "⚙️" button on the palette opens a modal to add, delete, import (JSON file), and export user-defined prompts alongside the built-ins. Persisted under one GM key (`pg_custom_prompts`). `(7a5fa11)`
- `getAllPrompts()` merges built-ins with custom prompts so search and palette navigation treat them uniformly (`Prompt generator.user.js:1324`). `(7a5fa11)`

---

## 2026-04-12 — v1.2.0

### Added
- "Universal Structured Agent" built-in prompt under the Meta category — distilled from four production AI agent system prompts (invoke, review, scheduled-triage, triage). `(34c361b)`
- `all_prompts/model prompt.md` — long-form template + usage guide for the Structured Agent pattern. `(34c361b)`

---

## 2026-04-12 — v1.1.0

### Added
- "Senior Userscript Engineer" built-in prompt covering metadata rules, selector hierarchy, MutationObserver patterns, GM_* storage, security checklist, and performance defaults. `(8c7063e)`
- `@downloadURL` / `@updateURL` headers pointing at GitHub raw on `main` — Tampermonkey now auto-updates installed users on `@version` bumps. `(8c7063e)`

### Security
- XSS hardening in palette rendering: search query and every custom-prompt field (`title`, `cat`, `icon`, `color`) now go through `escapeHtml()` before being interpolated into `innerHTML`. Closes a stored-XSS path where a custom prompt with HTML in its title would execute on every palette render. `(8c7063e)`
- Long-form `senior-userscript-engineer.md` uploaded to `all_prompts/` — encodes the security checklist this commit enforces, so the rule has a documented source. `(dec1eef)`

---

## 2026-03-26 — v1.0.0 — initial public release

### Added
- `Prompt generator.user.js` — first shipping userscript (606 lines). `⌘⇧P` / `Ctrl+Shift+P` palette, hostname-based provider routing for ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Mistral, Grok, Copilot, You.com, Poe; `injectText()` with three code paths (textarea native setter, contenteditable synthetic paste, fallback). `(34a7a31)`
- `index.html` — standalone landing page (941 lines, vanilla JS, fonts from Google CDN, no build step). Independent copy of the prompt library with its own `⌘K` palette and modal. `(d0bd676)`
- README updated to point users at Tampermonkey for installation. `(4d785d6, b91e779)`
- `all_prompts/senior-userscript-engineer.md` uploaded to repo root (later moved into `all_prompts/`) — the system prompt that governs userscript edits in this repo. `(85c811c)`

### Architectural
- Single-file userscript, single-file landing page, zero npm dependencies, zero build tooling — established as the project's permanent shape, not a starting point.

---

## 2026-01-22 → 2026-01-25 — prompt library bootstrap

_Pre-userscript era. Repo was a curated prompt archive only._

### Added
- Initial `all_prompts/` directory with seed prompts: `brutal honest` → `honest.txt` (replacement), `negotiation.txt` (Chris Voss style, refactored across 5 commits for clarity), `Learning.txt`, `expert.txt`, `coach.txt`, `focus.txt`, `social.txt`, `feynmann.txt`, `average search`, `ChatGPT photoshop instructions.txt` + `photoshop ai.jpeg`. `(b91e779, a00896a, 2913cc6, 31f9507, 7975cc6, dec1cb8, 6d30964, da5b7e6, c7a324c, f889250, 66845cd, ee002fb, 7a59770, 54654c7, 3b18d4f, 5f12d05, 1250c18, 340adf8, 2633483)`
- `chatGPT CODES.TXT` at repo root — the Quick Prompt Codes reference (ELI5, TLDR, SWOT, etc.) later compressed into the `prompt-codes` built-in. `(fafc95e)`
- LICENSE (MIT) and initial README. `(b91e779, f0b2162)`

### Architectural
- Migrated `brutal honest` (no extension) → `brutal honest.txt`, then deleted in favor of `honest.txt` — early naming churn, later all prompt files standardized on `.txt` / `.md` extensions. `(2913cc6, 7975cc6, 31f9507)`
- `all_prompts/` directory was created, deleted, and recreated within the same day; treat any pre-`a41519e` paths in old links as stale. `(a41519e, e100060)`

---

<details>
<summary>Archive — entries older than 12 months</summary>

_(Empty — repo's first commit is 2026-01-22, well within the 12-month window from 2026-04-27.)_

</details>

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CHANGELOG.md":
> 1. Find the most recent SHA cited in the existing file.
> 2. Run `git log` and `git diff --stat` for everything since that SHA.
> 3. Apply the WIP Decoder — derive intent from diffs when commit messages are vague.
> 4. Group consecutive same-intent commits into single entries; split when intent changes.
> 5. Skip noise (lockfiles, formatter passes, typos, no-op commits).
> 6. Detect version bumps in `Prompt generator.user.js`'s `@version` header — if found, close `[Unreleased]` into a dated + version-tagged section.
> 7. Append new entries above existing ones. **Never rewrite past entries** except to fix factual errors (and note the correction inline).
> 8. Roll entries older than 12 months from today's date into the `<details>` archive.
> 9. Keep the file under 600 lines and every entry under 2 lines.
