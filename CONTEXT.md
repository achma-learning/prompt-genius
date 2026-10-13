# Prompt Genius — AI Context File
_Last synced: 2026-10-13 @ a405fc6_

## 1. What This Is (Plain English)
- **In one sentence:** Browser add-on scripts that pop a search box over ChatGPT, Claude, Gemini and other AI chats so you can drop a saved prompt into the chat in two keystrokes. Three scripts in `userscripts/`: general prompts, a 30-prompt vibe coding system, and 226 French prompts for health workers. The original all-in-one script stays at the root for existing installs. There's also a one-page website that reads the prompts from those scripts and shows them with copy buttons.
- **Why it exists:** Good prompts get lost in notes and retyped from memory. This keeps them one shortcut away on whichever AI site is open. The medical script adds a form so you fill the `[brackets]` (patient age, motive…) without editing the prompt by hand.
- **Who uses it:** Public. The main script is on Greasy Fork (script 571159) and both install from GitHub. Strangers run this on their AI chat tabs, so treat selectors, injected HTML and stored data carefully. The medical prompts are used by health professionals: never encourage pasting identifying patient data.
- **Vibe:** Polished personal tool. Zero build step, zero npm. Each script is one drop-in file, and the website is one HTML file.

## 2. How To Run It
- **Setup once:** Install Tampermonkey or Violentmonkey. On Chrome-based browsers, also turn on Developer mode on `chrome://extensions` and **Allow User Scripts** in the extension's Details (README §Install explains this step by step for non-coders).
- **Run dev:** No dev server.
  - Userscripts: paste the file into the Tampermonkey editor (or install from the raw GitHub URL) and reload a chat tab. Main script: `Ctrl+Shift+P`. Medical: `Alt+M`.
  - Website: open `index.html` directly in a browser (`file://` works). It loads all three files in `userscripts/` by relative path, so keep the folder layout.
  - Quick headless check: `for f in userscripts/*.user.js "Prompt generator.user.js"; do node --check "$f"; done`. There is no test suite in the repo. Changes have been verified with throwaway Playwright scripts that inject the userscript into a fake `chatgpt.com` page with GM_* stand-ins; Chromium is preinstalled in cloud sessions.
- **Build / deploy:** None.
  - Original script auto-updates from Greasy Fork (`Prompt generator.user.js:27-28`).
  - `userscripts/general.user.js` and `userscripts/vibe-coding.user.js` auto-update from GitHub raw `main` (lines 27-28).
  - Medical script auto-updates from GitHub raw `main` (`userscripts/medical.user.js:29-30`).
  - Users only get an update when `@version` goes up.
  - **Tags and GitHub Releases** (from 2026-10): each track has its own tag prefix (`original-v`, `medical-v`, `vibe-v`). `RELEASE.md` lists the current versions, pinned install links (`raw/<tag>/<path>`), the rollback steps and the release checklist. Releases are made with the RELEASE prompt, only after the work is merged to `main`. General is not released yet.
  - Whether Greasy Fork pulls the original script from GitHub (webhook or sync URL): _Not yet figured out_ (see `RELEASE.md`).
  - Whether `index.html` is on GitHub Pages: _Not yet figured out_. No Pages config is checked in.
- **Required env vars:** None. No `.env`, no secrets, no backend.

## 3. Tech Stack
- **Language + runtime:** Plain modern JavaScript (ES2020+: optional chaining, `??`) running in the browser. No Node at runtime, no transpiler, no `package.json`, no lockfile.
- **Framework / key libraries:** None. Vanilla DOM plus the userscript-manager APIs:
  - Main script: `GM_addStyle`, `GM_getValue`, `GM_setValue`.
  - Medical script: those three plus `GM_setClipboard` and `GM_registerMenuCommand` (`userscripts/medical.user.js:22-26`).
- **What kind of project:** Three userscripts (plus the original all-in-one) and a static landing page. The repo also doubles as a prompt archive (`all_prompts/`, `vibe-coding-tools-101/`).
- **External services:** Only the AI chat hosts in the `@match` lists. The main script and `index.html` pull Google Fonts; the medical script uses system fonts on purpose. No analytics, no telemetry.

## 4. Code Map (The Important Files Only)
- `userscripts/general.user.js` — **General** (v1.1.0, `Ctrl/⌘+Shift+P`, prefix `pgg-`). 17 prompts: the non–vibe coding prompts of the original script, with the landing page's fuller texts, plus the Photoshop guide. Split from the original script, so the engine is the same as below.
  - `__PGG_EXPORT__` hook (line 419) — hands `BUILTIN_PROMPTS` to `index.html` when loaded without GM APIs.
  - GITHUB PROMPTS section: `ghSync()` reads a repo folder (one git-trees API call plus raw downloads, 6 h cache in `pgg_github_cache`; config in `pgg_github`). `openGithubDialog()` runs once after install (`pgg_github_asked`) and from ⚙️. Needs `GM_xmlhttpRequest` and both `@connect` lines.
- `userscripts/vibe-coding.user.js` — **Vibe Coding** (v1.2.0, `Alt+V`, prefix `pgv-`). Seven doc prompts (cat `Docs`, text copied from `vibe-coding-tools-101/*.md`): the six Vibe Coding 101 prompts plus RELEASE (`vc-release`). Eight helpers (cat `Helpers`) that only read/update CONTEXT.md and CHANGELOG.md; the first, Stabilize a Prototype (`vc-stabilize`), turns an AI-drafted prototype into a documented, known-good baseline.
  - `Tab` picks several prompts (`picked` set); `fullText()` joins them as numbered steps in list order.
  - `node scripts/sync-vibe-prompts.js` keeps prompts and files in sync. It copies the seven doc prompts (`DOC_FILES`) from `vibe-coding-tools-101/*.md` (their source) into the userscript, then writes the helpers (source: the userscript) to `vibe-coding-tools-101/helpers/*.md` through the `__PGV_EXPORT__` hook. Run it after editing either side; never edit `helpers/*.md` by hand.
  - `GROUP_LABELS` gives the two list headers. Search ranks title hits, then category, then body text.
- `Prompt generator.user.js` — **Original all-in-one userscript** (v1.5.0, ~1970 lines, one IIFE, English). Kept unchanged for existing Greasy Fork installs. New work goes to `userscripts/`.
  - `BUILTIN_PROMPTS` (line 37) — 22 prompts: general, 6 Vibe Coding, 4 Image Restoration.
  - `PROVIDERS` (line 1030) — hostname → input selector. Add chat sites here **and** in `@match`.
  - `findInput()` (1557) / `injectText()` (1572) — find the visible chat box and inject (native setter or synthetic paste).
  - `openManager()` (1666) — custom prompts (GM key `pg_custom_prompts`, line 1438).
  - Global keydown (1925) — `Ctrl/⌘+Shift+P`, arrows, Enter, `⌘C`.
- `userscripts/medical.user.js` — **Medical userscript** (v3.1.0, ~9300 lines, French UI). Lines 44–7829 are data; the engine starts at ~7831.
  - `CATS` (44) — 21 jobs + « Tous ». `BUILTIN_PROMPTS` (77) — 226 prompts, each `RÔLE / MON CONTEXTE / TA MISSION / MODÈLE / RÈGLES`.
  - `__PGM_EXPORT__` hook (7837) — when loaded as a plain `<script>` (no GM APIs), it hands the data to `index.html` and stops.
  - `HOTKEYS` (7877), `DEFAULT_SETTINGS` (7884) — settings live in GM key `pgm_settings` (disabled cats/ids, favs, recents, filters, startCat, toggles).
  - `getIndex()` (7955) / `search()` (7967) — index of *enabled* prompts only; accent-folded, ranked; full text folded lazily.
  - `parseFields()` (8072) / `buildFilled()` (8114) — one form field per `[placeholder]` **occurrence**, labelled from its line.
  - `ensureUI()` (8394) — the palette DOM is built on first open, not at page load.
  - `injectText()` (8794) — appends after the user's draft instead of replacing it.
  - Settings tabs: `renderFiltersTab()` (8901, « Mes filtres »), `renderPromptsTab()` (9014, on/off), then « Mes prompts » and « Préférences ».
  - Global keydown (9317).
- `index.html` — Landing page, one file, CSS + JS inline. **No prompt text of its own.**
  - `SOURCES` (line 491) + `loadPrompts()` (576) — load General and Vibe Coding at startup through `loadScript()` (554) and their `__PGG_EXPORT__` / `__PGV_EXPORT__` hooks. A missing file shows an error with "Try again".
  - `DESCRIPTIONS` / `VIBE_STEPS` (498) — page copy only: card blurbs and "when to run it" lines, by prompt id. A prompt without a blurb gets its first line.
  - `renderVibe()` (832) — the seven doc prompts as numbered steps, then the helpers.
  - `loadMedical()` (872) — lazy-loads `userscripts/medical.user.js` for the « Prompts médicaux » section.
  - `copyToClipboard()` (784) has a `file://` fallback.
- `vibe-coding-tools-101/*.md` — the source of the seven Vibe Coding doc prompts. The Vibe Coding script gets them through `sync-vibe-prompts.js`; the original script still carries the older copies of the first six (ids `vc-*`), plus `101.md`/`102.md` (planning notes). `vibe-coding-tools-101/helpers/` is generated (see above).
  - `changelogs builder.md` follows [Keep a Changelog](https://keepachangelog.com/en/) 1.1.0 (bucket order + `Broken`, `## [track vX.Y.Z] — date` headings, link references at the bottom) and has three modes: Quick, Full rebuild, and **Rescue** (`git bisect` from the newest ✅ known-good marker or release tag; never rewrites history).
  - `generate-release.md` — the RELEASE prompt (GitHub Release Manager): works on any repo and in any AI: 🤖 Agent mode does the release itself, 🧭 Manual mode (chatbot) guides me with file cards and GitHub-website steps. Asks which files ship (`apk`, `zip`, `js`, `pdf`…), then tracks, bump, tags, release with those files attached, `RELEASE.md`. Stops for my OK before shipping.
- `all_prompts/` — older prompt archive, plus the bilingual source of the Image Restoration prompts (`google-labs-flow-photo-restoration.md`).
- `docs/*.png` — real screenshots used by `README.md`, taken by running the scripts headless. Retake them rather than editing by hand.
- `README.md` (human install guide), `CHANGELOG.md` (what shipped), `RELEASE.md` (current versions, tags, pinned install links, rollback, release checklist), `TRAJECTORY.md` (goal + to-do), `LICENSE` (MIT).

## 5. Rules For Editing This Code
- **Zero dependencies, zero build.** Each userscript stays a single drop-in `.user.js`; `index.html` stays a single openable file.
- **Bump `@version`** on every shipping change to a userscript, or installed copies never update.
- **Every shipped version gets a tag** (`<track>-vX.Y.Z`, annotated, on a commit on `main`), made with the RELEASE prompt. Tags are permanent: never moved, reused or deleted. They are the known-good anchors for CHANGELOG Rescue mode.
- **Never change `@name` or `@namespace`** of any script (`userscripts/medical.user.js:2-3`). The manager identifies scripts by them; changing them installs a second copy that can't see the user's saved prompts and settings.
- **Never rename GM storage keys.**
  - Main: `pg_custom_prompts`.
  - Medical: `pg_med_custom_prompts` (kept from v3.0 on purpose), `pgm_settings`, `pgm_field_memory`.
  - Read them with defaults and type checks (`loadJSON` in the medical script).
- **Untrusted strings never hit `innerHTML` unescaped.** Use `escapeHtml()` or `textContent`/`el()`. Colours from custom prompts go through `safeColor()` before reaching a `style` attribute. `8c7063e` was an XSS fix; don't regress.
- **No `eval`, `new Function`, `setTimeout(string)`** in shipped code.
- **Prefix everything per script.** The main script owns `pg-*` ids/classes and `--pg-*` variables on `:root`. The medical script owns `pgm-*`, with variables scoped to `.pgm-scope`. They run on the same pages at the same time.
- **Distinct hotkeys:** main `Ctrl/⌘+Shift+P`, medical `Alt+M` by default (user-changeable). Alt-combos inside the medical palette match `e.code` (physical key) so macOS Option and AZERTY work.
- **New chat site = `PROVIDERS` entry + `@match` line**, in each script that should support it.
- **Selectors:** `#id` > `data-*`/`aria-*`/`role` > stable classes. Never CSS-module hashes.
- **Medical prompt text is verbatim catalogue content.** Don't reword prompts while touching the engine. Only `[brackets]` inside « **MON CONTEXTE** » become form fields, by design (brackets elsewhere are output templates for the AI).

## 6. Fragile Bits & Landmines
- **`index.html` runs the userscripts as plain scripts.** It has no prompt copy: all three scripts hand their data over through `__PGG_EXPORT__` / `__PGV_EXPORT__` / `__PGM_EXPORT__`. Keep each hook *before* any `GM_*` call and before the script touches the page (`userscripts/general.user.js:419`, `vibe-coding.user.js:1261`, `medical.user.js:7837`), or the landing page breaks. Prompt colours must stay `#rrggbb`: the page appends `22` for a tinted background.
  - The only other copy left is the original `Prompt generator.user.js` (22 prompts, older texts), frozen for Greasy Fork users.
- **Synthetic paste is duct tape.** Rich editors (ProseMirror on ChatGPT/Claude, Quill on Gemini) ignore `textContent` changes. Original symptom: the text showed but Send stayed disabled. Both scripts fire a fake `ClipboardEvent('paste')`.
  - The medical script falls back to `execCommand('insertText')`, then `textContent`.
  - The main script still falls back straight to `textContent`, which replaces the draft.
- **Hidden inputs on Google Labs.** `findInput()` walks the selectors one by one and prefers a visible, writable element. `document.querySelector(list)` picked a hidden offscreen textarea, so prompts vanished.
- **Capture-phase keydown** on `document` (third arg `true`) lets the hotkeys beat site shortcuts. The medical overlay also stops keyboard events from bubbling to the host page. Switching to bubble phase lets ChatGPT eat the keys.
- **Hotkey quirks:** `Ctrl+Shift+P` opens a private window on Firefox and may not be overridable there. The floating button (and, for the medical script, the Tampermonkey menu) is the fallback.
- **Field labels come from line parsing.** `parseFields()` reads `- Label : … [x] …` and splits on commas outside brackets. A catalogue line with an odd shape gets a weaker label but still works. 9 prompts repeat the same placeholder text (`[X]`, `[oui / non]`, `[liste]`), which is why fields are per occurrence.
- **No re-injection on SPA teardown.** The buttons and overlays are inserted once. If a site replaces `<body>`, the UI disappears until reload. Intentional; wait for a real bug report.
- **Pinned installs auto-update back.** A copy installed from a tag link (`raw/<tag>/…`) keeps its `@updateURL` pointing at `main` (or Greasy Fork), so the manager silently updates it to the latest. Rolling a user back = install the pinned link **and** turn off "Check for updates" for that script (`RELEASE.md` §Roll back).
- **Same version, different code.** Some versions changed after their bump without a new one: `vibe-v1.0.0` was a 30-prompt draft before the 13-prompt version, and Original v1.5.0 / Medical v3.1.0 later changed their update URLs. Bump on every shipping change so tags stay meaningful.
- **Look removable but aren't:** `vibe-coding-tools-101/*.md` and `senior-userscript-engineer.md` (canonical long-form sources); `all_prompts/photoshop ai.jpeg` (goes with the `photoshop-chatgpt` page prompt); `chatGPT CODES.TXT` (source of « Prompt Power Codes»; odd filename, don't rename); `docs/*.png` (README images).

## 7. Current State
- **Last shipped:** the three userscripts in `userscripts/` (PRs #11 and #12, merged as `d61dfc0`).
- **Last merged:** PR #15 (RELEASE prompt for any repo, Agent and Manual modes, Vibe Coding v1.3.0).
- **Working on now:** branch `claude/lucid-einstein-5x4nxp`: `index.html` loads its prompts from the userscripts (T016), General v1.1.0.
- **After merge:** on "release", backfill the historic tags and create the GitHub Releases for Original v1.5.0, Medical v3.1.0 and Vibe Coding v1.3.0 (plan in `RELEASE.md` §Release history), then mark the CHANGELOG headings ✅.
- **To-do list and next up:** `TRAJECTORY.md`.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.
