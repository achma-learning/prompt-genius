# Changelog

Working journal of notable changes. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**How to read this:**
- Dates are commit dates.
- `(a3f291)` is a short SHA — `git show a3f291` to see the diff.
- Entries explain symptom + cause, not just "fixed."
- The shipping artifact's version is the userscript's `@version` header (`Prompt generator.user.js:11`). There is no `package.json`.

---

## [Unreleased]
_Changes since v1.4.0 (1a66963)._

### Added
- `CONTEXT.md` at repo root — single-page brief so future AI assistants and future-me can pick up the project cold without re-reading 1840 lines of userscript. `(850f910)`

### Architectural
- Documented the prompt-list drift: `BUILTIN_PROMPTS` (userscript, 18) and `PROMPTS` (`index.html`, 11) are independent copies; landing page is behind by 7 prompts and carries 3 the userscript doesn't have. No shared source yet. `(850f910)`

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
