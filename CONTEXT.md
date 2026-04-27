# Prompt Genius — AI Context File
_Last synced: 2026-04-27 @ 99e6e50_

## 1. What This Is (Plain English)
- **In one sentence:** A userscript that pops a search box on top of ChatGPT / Claude / Gemini / etc. so you can paste a saved prompt with two keystrokes — plus a small static website that shows off the same prompt library.
- **Why it exists:** You collect prompts that actually work, forget where you put them, and keep retyping them. This makes them a `⌘⇧P` away on whichever AI chat site you happen to be using.
- **Who uses it:** Public — the userscript is installable from GitHub raw, and the website is a marketing/showcase page (`index.html`). Treat external-facing copy and selectors with care; many strangers run this.
- **Vibe:** Polished personal tool. Single-file userscript, single-file landing page, zero build step, zero npm deps. Designed to stay readable in one scroll.

## 2. How To Run It
- **Setup once:** Install Tampermonkey (or Violentmonkey/Greasemonkey) in your browser. Open `Prompt generator.user.js` raw on GitHub — Tampermonkey will offer to install. That's it.
- **Run dev:** No dev server. To iterate on the userscript, paste the file into the Tampermonkey editor (or point it at a local file) and reload an AI chat tab. To preview the landing page, open `index.html` directly in a browser (`file://`) — it has no build step (`index.html:399`, all JS inline).
- **Build / deploy:** None for the userscript — users pull straight from `main` via `@downloadURL`/`@updateURL` (`Prompt generator.user.js:26-27`). The landing page appears intended for GitHub Pages (`README.md:4` says "after make a website") but no Pages config is checked in — _Not yet figured out_ whether it's actually published.
- **Required env vars:** None. No `.env`, no `.env.example`, no secrets anywhere.

## 3. Tech Stack
- **Language + runtime:** Plain ES2020 JavaScript, runs in the browser via Tampermonkey. No Node, no transpiler. No `.nvmrc`, no `package.json`.
- **Framework / key libraries:** None. Vanilla DOM. Userscript uses `GM_addStyle`, `GM_getValue`, `GM_setValue` (`Prompt generator.user.js:21-23`). Fonts pulled from Google Fonts CDN (Outfit + JetBrains Mono).
- **What kind of project:** Userscript (Tampermonkey/Violentmonkey/Greasemonkey) + a sibling static HTML showcase page. The repo also doubles as a curated prompt library — raw `.txt`/`.md` files under `all_prompts/` and `vibe-coding-tools-101/`.
- **External services:** Only the AI chat hosts the script targets — ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Mistral, Grok, Copilot, You.com, Poe (`Prompt generator.user.js:914-929`). No backend, no analytics, no telemetry.

## 4. Code Map (The Important Files Only)
- `Prompt generator.user.js` — The whole product. ~1840 lines, single IIFE. Contains the prompt database, provider map, palette UI, and custom-prompt manager. Open this first.
  - `BUILTIN_PROMPTS` array (line 36) — all 18 shipped prompts, inline as JS strings.
  - `PROVIDERS` map (line 914) — hostname → input selector + injection strategy. Add new chat sites here.
  - `injectText()` (line 1438) — the magic. Three code paths: native value setter for textareas, synthetic paste event for contenteditable (Claude's ProseMirror, Gemini's Quill), fallback to `textContent`.
  - `openManager()` (line 1532) — the "⚙️ Manage Custom Prompts" modal: add/delete/import/export user prompts, persisted under `GM_setValue('pg_custom_prompts', …)` (line 1322).
  - Global keydown handler (line 1791) — owns `⌘⇧P`/`Ctrl+Shift+P`, arrow nav, Enter to insert, `⌘C` to copy.
- `index.html` — Standalone landing page, ~940 lines. CSS + JS inline. Has its own `PROMPTS` array (line 401) and its own `⌘K` command palette. **This is a duplicate prompt list — see §6.**
- `senior-userscript-engineer.md` — The full long-form version of the "Senior Userscript Engineer" system prompt; the userscript ships a compressed copy inline (`BUILTIN_PROMPTS` id `userscript-engineer`).
- `vibe-coding-tools-101/*.md` — Source-of-truth, long-form versions of the six "Vibe Coding" prompts (`generate context.md`, `changelogs builder.md`, `generate-trajectory.md`, `generate-readme.md`, `generate-troubleshooting.md`, `generate-prompts-codex.md`). Compressed copies live in `BUILTIN_PROMPTS` (ids `vc-context`, `vc-changelog`, `vc-trajectory`, `vc-readme`, `vc-troubleshooting`, `vc-prompts-codex`).
- `all_prompts/` — Older free-form prompt archive (`.txt`/`.md`). Some have been promoted into the userscript, some haven't. Treat as a backlog, not as the live registry.
- `LICENSE` — MIT.
- `README.md` — Two lines of notes. Not authoritative; the userscript is.

## 5. Rules For Editing This Code
- **Keep it zero-dependency.** No npm, no bundler, no framework. The userscript must remain a single drop-in `.user.js`. The landing page must remain a single openable `.html`.
- **Bump `@version` on every shipping change** to the userscript (`Prompt generator.user.js:11`). Tampermonkey only auto-updates users when the semver bumps.
- **Never use `innerHTML` with prompt content or user input.** Use `textContent` / `createElement`. The `escapeHtml()` helper (line 1375) exists for one reason — search highlighting — and that's the only place untrusted strings get into HTML. `8c7063e` was an explicit XSS fix; do not regress.
- **No `eval`, no `new Function`, no `setTimeout(string)`.** Standard userscript hygiene.
- **Adding a new prompt = add it to `BUILTIN_PROMPTS`** with a unique `id`, plus `title`, `cat`, `icon`, `color`, `prompt`. If there's a long-form source file, drop it under `vibe-coding-tools-101/` (vibe-coding flavor) or `all_prompts/` (everything else) and keep the inline copy compressed.
- **Adding a new chat site = add it to `PROVIDERS`** (line 914) AND add a matching `@match` directive in the metadata block (line 7). Both, or it won't load.
- **Selector preference order:** `#id` > `data-*`/`aria-*`/`role` > stable class combos. Never auto-generated CSS-module hashes — they break on every redeploy.
- **Custom prompts persist under one GM key** (`pg_custom_prompts`, JSON-stringified). Don't fragment storage across keys.
- **The landing page `PROMPTS` array is a separate copy** from the userscript's `BUILTIN_PROMPTS`. If you only update one, you create drift (you already have — see §6).

## 6. Fragile Bits & Landmines
- **Two prompt lists, one truth.** `Prompt generator.user.js` has 18 prompts (`BUILTIN_PROMPTS`); `index.html` has 11 (`PROMPTS`, line 401) and includes three that *aren't* in the userscript (`average-search`, `chatgpt-codes`, `photoshop-chatgpt`). The website is behind. Adding a prompt to one without the other is the default failure mode — there's no shared source.
- **`injectText()` for contenteditable is duct tape.** It dispatches a synthetic `ClipboardEvent('paste')` with a `DataTransfer` payload because directly setting `textContent` doesn't notify React/ProseMirror/Quill of the change. If a target site stops honoring synthetic paste, the fallback (`textContent` + `InputEvent`) leaves the editor in an inconsistent state on some sites. Original symptom: prompt appeared visually but Send button stayed disabled because the framework's internal state was empty. (`Prompt generator.user.js:1451-1465`)
- **Provider selectors rot.** `chatgpt.com` uses `#prompt-textarea`, Claude uses `div.ProseMirror[contenteditable="true"]`, Gemini uses `div.ql-editor` (`Prompt generator.user.js:915-928`). These break whenever the host site reships their editor. The fallback chain in `findInput()` (line 1428) catches most regressions, but specific sites need targeted fixes.
- **`@match https://x.com/i/grok*`** (line 17) — Grok-on-X has moved before; if Grok stops working there first, suspect this match pattern, not the selector.
- **No MutationObserver-based re-injection.** The trigger button + overlay are inserted once at `document-idle`. On heavy SPA navigations the host site usually leaves `<body>` intact so this works, but a full DOM teardown will lose the UI until reload. This is intentional simplicity, not an oversight — don't "fix" it without a real bug report.
- **`document` keydown listener uses capture phase** (`Prompt generator.user.js:1834`, third arg `true`) so `⌘⇧P` beats site shortcuts. If you switch to bubbling phase, ChatGPT's own bindings will eat the keys.
- **Look removable but aren't:** `senior-userscript-engineer.md` and the files under `vibe-coding-tools-101/` look like duplicates of inline `BUILTIN_PROMPTS` strings. They're the *long-form* sources — the inline copies are compressed for size. Deleting them loses the canonical version.
- **`all_prompts/photoshop ai.jpeg`** is a 250 KB image. It's referenced indirectly by the `photoshop-chatgpt` prompt on the landing page. Don't `git rm` during cleanup.
- **`chatGPT CODES.TXT`** at the repo root is the source for the "Prompt Power Codes" prompt. Filename has a space and uppercase — fine, just don't auto-rename.

## 7. Current State
- **Last shipped:** PR #5 (`1a66963`) — added three Vibe Coding prompts (`vc-readme`, `vc-troubleshooting`, `vc-prompts-codex`) and wired all six vibe-coding prompts into the palette. Userscript is at `v1.4.0`.
- **Working on now:** Adding this `CONTEXT.md` (branch `claude/add-context-documentation-pwpwX`) so future AI assistants can pick up the project cold.
- **Next up:**
  1. Reconcile `index.html`'s prompt list with `BUILTIN_PROMPTS` (or extract a shared JSON both can read).
  2. Decide whether the landing page goes live on GitHub Pages.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.
