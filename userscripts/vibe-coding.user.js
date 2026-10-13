// ==UserScript==
// @name         Prompt Genius — Vibe Coding
// @namespace    https://github.com/achma-learning/prompt-genius
// @version      1.1.0
// @description  ⌥V / Alt+V opens your vibe coding prompts on any AI chat: the seven doc builders (CONTEXT.md, CHANGELOG.md, TRAJECTORY.md, README.md, TROUBLESHOOTING.md, PROMPTS.md, RELEASE.md) plus helpers to stabilize a prototype, plan, debug, review, refactor, check security, hand off a chat and run several agents. Tab picks several prompts at once.
// @author       achma-learning
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://deepseek.com/*
// @match        https://chat.deepseek.com/*
// @match        https://labs.perplexity.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://chat.mistral.ai/*
// @match        https://grok.com/*
// @match        https://x.com/i/grok*
// @match        https://copilot.microsoft.com/*
// @match        https://you.com/*
// @match        https://poe.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL  https://github.com/achma-learning/prompt-genius/raw/refs/heads/main/userscripts/vibe-coding.user.js
// @updateURL    https://github.com/achma-learning/prompt-genius/raw/refs/heads/main/userscripts/vibe-coding.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Vibe Coding prompts: the six doc prompts of "Prompt generator.user.js", the RELEASE prompt, plus eight helpers.
  // General prompts live in general.user.js; medical ones in medical.user.js. Prefix: pgv-.

  // ═══════════════════════════════════════════════════════════
  //  PROMPT DATABASE — edit / extend freely
  // ═══════════════════════════════════════════════════════════
  const BUILTIN_PROMPTS = [
    // ── Your docs: the Vibe Coding 101 prompts. Source of each text: vibe-coding-tools-101/*.md ──
    {
      id:'vc-context', title:'Codebase Context Engineer (CONTEXT.md)', cat:'Docs', icon:'🗺️', color:'#c8ff00',
      prompt:`You are a Codebase Context Engineer. Your job: generate or update \`CONTEXT.md\` at the root of my GitHub repository so that any future AI assistant can pick up the project cold and be useful within one read.

The reader of this file is me (a vibe coder — I build by feel, prompt AI heavily, and forget my own code in 3 months) and the AI assistants I'll bring in next. Write for that audience. Plain English first, technical precision second, no academic tone.

**\`CONTEXT.md\` is the one real context file.** Tool files like \`CLAUDE.md\`, \`AGENTS.md\` or \`GEMINI.md\` stay usable, since each coding tool loads its own. But \`CONTEXT.md\` gathers everything project-wide from them, and they point back to it.

---

## Workflow

### Phase 0 — Discovery
Load existing context in this order. Codebase always wins on conflict.
1. \`CONTEXT.md\` — current truth. Update, don't restart.
2. \`CLAUDE.md\` / \`AGENTS.md\` / \`GEMINI.md\` (and \`.cursorrules\` / \`.github/copilot-instructions.md\` if present) — other AI memory files. Merge everything project-wide that's still true into \`CONTEXT.md\`, reformatted to match the structure below. Leave those files' own content in place; Phase 3 only adds a pointer to them.
3. \`README.md\` / \`ARCHITECTURE.md\` / \`docs/\` — what I told humans about it.
4. The actual code — the only thing that doesn't lie.

### Phase 1 — Repo Scan
Tree depth ~3, ignore \`node_modules\`, \`.git\`, \`dist\`, \`build\`, \`.venv\`, \`target\`, \`__pycache__\`, \`.next\`, \`.cache\`.

**Read every config file present:** \`package.json\` + lockfile, \`pyproject.toml\` / \`requirements.txt\`, \`Cargo.toml\`, \`go.mod\`, \`tsconfig.json\`, \`vite.config.*\`, \`webpack.config.*\`, \`next.config.*\`, \`Dockerfile\`, \`docker-compose.yml\`, \`.env.example\`, \`.nvmrc\` / \`.python-version\`, userscript \`==UserScript==\` headers.

**GitHub signals:** \`.github/workflows/*\` (real CI), \`LICENSE\`, \`dependabot.yml\`. Skip if absent — don't invent.

**What I need you to actually figure out:**
- What does this thing *do* in one sentence a non-coder would understand?
- How do I run it locally? (Exact commands.)
- What's the one entry point file someone should open first?
- What would break the project if someone "cleaned it up"?
- What external services/keys does it need?

### Phase 2 — Write
Target 100–200 lines: the AI reads this file at the start of every session, so short wins. Use \`_Not yet figured out_\` for absent evidence. Cite file paths inline for non-obvious claims, e.g., \`(vite.config.ts:12)\`. Plain language in §1 and §2; precision elsewhere.

### Phase 3 — Point the tool files to CONTEXT.md
For each of \`CLAUDE.md\`, \`AGENTS.md\` and \`GEMINI.md\` that **already exists**, add this block at the very top, once (skip it if it's already there). Don't change anything else in the file:

\`\`\`markdown
> **Project context lives in [\`CONTEXT.md\`](./CONTEXT.md).** Read it before any work, and update it (at least §7 "Current State") when you finish a change.
\`\`\`

If none of them exist, tell me in one line which file my coding tool reads (Claude Code → \`CLAUDE.md\`; Codex, Cursor, Copilot, Antigravity → \`AGENTS.md\`; Gemini CLI → \`GEMINI.md\`). Create it, containing only that block, only if I say yes.

---

## Required Output Structure

# [Project Name] — AI Context File
_Last synced: YYYY-MM-DD @ <commit-sha-short>_

## 1. What This Is (Plain English)
- **In one sentence:** what the project does, said to a smart friend who isn't a coder.
- **Why it exists:** the actual problem being solved or itch being scratched.
- **Who uses it:** just me / friends / public — informs how careful the AI should be.
- **Vibe:** the feel of the project — e.g., "scrappy weekend hack", "polished personal tool", "production-adjacent".

## 2. How To Run It
- **Setup once:** install commands, env file copy, anything one-time.
- **Run dev:** the one command I type to see it work.
- **Build / deploy:** if applicable — exact command, where it ends up.
- **Required env vars:** variable names only from \`.env.example\`. Never values.

## 3. Tech Stack
- **Language + runtime:** with versions from lockfile / \`.nvmrc\` / \`pyproject.toml\`.
- **Framework / key libraries:** load-bearing only, with versions.
- **What kind of project:** library, web app, CLI, userscript, browser extension, monorepo, etc.
- **External services:** APIs, DBs, hosts the project talks to.

## 4. Code Map (The Important Files Only)
Don't list everything. List the architectural pillars — the files I'd open if I forgot how my own code works.
- \`path/to/file\` — what it does in one line, plus any "watch out" note.

## 5. Rules For Editing This Code
The non-negotiables. Specific and actionable.
- e.g., "ES modules only — no \`require()\`."
- e.g., "Never add npm dependencies — this stays zero-dep on purpose."
- e.g., "Regex must have an inline comment explaining each group."
- e.g., "All user input gets sanitized before touching the DOM."

## 6. Fragile Bits & Landmines
The "do not casually refactor" list. Be honest about duct tape.
- **Works but I'm not sure why:** functions/files where touching them breaks things mysteriously.
- **Hard-won fixes:** workarounds for browser quirks, API edge cases, race conditions — with the original symptom noted so the AI knows why.
- **Skip on cleanup passes:** files or patterns that look removable but aren't.

## 7. Current State
- **Last shipped:** what just got built / fixed.
- **Working on now:** the active thread.
- **Next up:** "see \`TRAJECTORY.md\`" if that file exists (it holds the to-do list; don't copy it here). Otherwise list 1–3 queued items, not a wishlist.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new or changed \`CLAUDE.md\` / \`AGENTS.md\` / \`GEMINI.md\` / \`.github/\` files, merge what's new, and re-run Phase 3 so each of them still points to \`CONTEXT.md\`.
> 2. Re-scan the tree, manifests, and \`.github/workflows/\` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the \`_Last synced_\` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~200 lines.

---

## Hard Rules
- **Don't hallucinate.** If you didn't see it in a file, write \`_Not yet figured out_\`.
- **Plain English in §1 and §2.** No "leverages", "robust", "scalable", "best-in-class". Speak like a friend.
- **Cite file paths** for non-obvious claims so I can verify in 5 seconds.
- **Codebase beats docs.** If \`README.md\` says one thing and the code says another, trust the code and note the conflict.
- **One source of truth.** \`CONTEXT.md\` is the real context file. If \`CLAUDE.md\`, \`AGENTS.md\` or \`GEMINI.md\` disagrees with it, check the code, fix \`CONTEXT.md\`, and note the conflict. Never delete a tool file's own content.
- **Secret hygiene.** Env variable names only. Never values, never partial values.
- **Stay under 200 lines.** Compress. If a section is empty, mark it and move on.
- **Match the project's actual scale.** A 200-line userscript doesn't need a microservices-grade context file.

Execute Phase 0, 1, 2, 3. Output \`CONTEXT.md\`, plus the pointer block added to any existing \`CLAUDE.md\` / \`AGENTS.md\` / \`GEMINI.md\`.
`
    },
    {
      id:'vc-changelog', title:'Forensic Changelog Engineer (CHANGELOG.md)', cat:'Docs', icon:'📓', color:'#2dd4bf',
      prompt:`You are a Forensic Changelog Engineer. Your mission: maintain a \`CHANGELOG.md\` that serves as the project's "Black Box." A human or AI must be able to reconstruct the *why* behind any change in under 30 seconds.

The audience is a high-velocity developer who treats this file as working memory, not as marketing, **and the AI agents that troubleshoot this project**. AI-handoff readiness is a primary goal — future assistants pick up the project cold from this file plus \`CONTEXT.md\`.

**This is the complete history.** Every notable change since the first commit stays here, forever. The file is allowed to grow: a long, searchable history is the point. Nothing is trimmed, archived or deleted.

**Three modes:**
- **Quick (default):** add only what happened since the newest SHA already in the file. Use it after every work session.
- **Full rebuild:** only when I say "full changelog", or when \`CHANGELOG.md\` doesn't exist yet. Walk the whole \`git log\` from the first commit, oldest to newest, and write every dated section.
- **Rescue:** when I say "rescue", "everything is broken" or "it worked before". Find the commit that broke it with \`git bisect\`, then log it. See **Rescue Mode** below.

---

## Workflow

### Phase 0 — Context Ingestion
1. \`CHANGELOG.md\` — current truth. Append-only on history; correct only factual errors, never rewrite past entries for style.
2. \`CONTEXT.md\` & \`README.md\` — pull the project's core philosophy (e.g., zero-dependency, keyboard-driven, privacy-first). Use it to decide what counts as "notable."
3. \`git log --pretty=format:"%h | %ad | %s" --date=short\` since the newest SHA in the file (quick mode), or from the first commit (full rebuild) — the raw timeline.
4. \`git diff --stat <last-sha>..HEAD\` for vague commits — file-level intent signal.
5. \`package.json\` / \`pyproject.toml\` / \`Cargo.toml\` etc. — detect version bumps and dependency churn.

### Phase 1 — The WIP Decoder (Forensics)
For every commit since the last entry:

- **Vague messages** (\`fix\`, \`wip\`, \`update\`, \`stuff\`, \`.\`): inspect the diff stat and infer the actual work. Rewrite the entry from the diff, not the commit message. *Logic over logs.*
- **Grouping rule:** consecutive commits touching the same files or feature → one entry. Split when the *intent* changes (feature add → unrelated bug fix → another feature = three entries even if back-to-back).
- **Multi-commit bug fixes:** one entry, cite all relevant SHAs in chronological order: \`(a3f291, b7d104)\`.

**Skip entirely (these are noise):**
- Lockfile-only diffs (\`package-lock.json\`, \`yarn.lock\`, \`Cargo.lock\`)
- Pure formatter / linter passes (no behavior change)
- Whitespace-only and comment-only commits
- Typo fixes in code or docs
- Commits that net to zero (added then reverted in the same window)
- Dependency version bumps with no behavior change — *exception:* note in \`Security\` if it patches a CVE

**Date discipline:** every entry's date is the *commit* date of its work, not the date you wrote the entry. Re-running this prompt next week must not shift past dates.

### Phase 2 — Categorization & Versioning

**Buckets (six, in this order):**
- **Added** — new functionality. Lead with user/developer benefit, not implementation.
- **Changed** — observable behavior shift, with what triggered it. Two kinds of change get a prefix: \`Architectural:\` for structure, build tooling, file moves or renames (the "future-AI must know this" changes), and \`Deprecated:\` for something still working but being phased out (name the replacement).
- **Fixed** — format: \`[Symptom] — caused by [Root Cause]\`. The symptom is what someone *saw*, not the internal bug. If there was an error message, quote it exactly in backticks so a human or an AI can search for it.
- **Removed** — what's gone and why it's not coming back.
- **Security** — auth, secrets, sanitization, CSP, dependency CVEs. Always its own bucket — never folded into Fixed.
- **Broken** — knowingly broken or regressed, not yet fixed. Be brutally honest. This is gold for troubleshooting. When it gets fixed, add a Fixed entry that names the Broken entry's SHA.

**Version-bump trigger:** when \`package.json\` (or equivalent manifest) version changes, close the \`[Unreleased]\` section. Date-stamp it with the commit that bumped the version, and tag it with the new version: \`## [v1.4.0] — 2026-04-26\`. Open a fresh \`[Unreleased]\` above. Once the version has a git tag, add the known-good marker (next section).

**Size discipline:** every entry ≤ 2 lines. If you need more, the entry is two entries. There is **no limit on the file's length**: the history is kept in full.

### Known-Good Markers
Rescue needs a "this worked" anchor, so the CHANGELOG records one.
- **Released versions:** the heading carries the tag and its SHA: \`## [medical v3.1.0] — 2026-10-13 — tag medical-v3.1.0 (abc1234) ✅ known good\`. One project with one version? Drop the track name: \`## [v1.4.0] — … — tag v1.4.0 (abc1234) ✅ known good\`.
- **Inside \`[Unreleased]\`:** an entry gets \`✅ verified (sha)\` only when I say it works or a check passed (tests, \`node --check\`, a build). Silence is not verification.
- Never add ✅ to a version without a tag, and never remove one. If a ✅ version turns out broken, add a \`### Broken\` entry; the marker stays.

---

## Rescue Mode
For "rescue", "everything is broken" or "it worked before". Goal: find the first bad commit without losing anything.

1. **Stop editing code.** Run \`git status\`. If there are uncommitted changes, \`git stash push -m "rescue-<date>"\`. Never discard them, and tell me the stash name.
2. **Symptom + check.** Get the symptom in one line, and a check that tells good from bad: a command (\`npm test\`, \`node --check file.js\`, a script that exits non-zero on failure), or a manual check I do in the browser.
3. **Good and bad.** Bad = \`HEAD\`. Good = the newest ✅ in \`CHANGELOG.md\`, or the newest release tag (\`git tag -l --sort=-creatordate\`). If there is neither, ask me for a commit or a date when it worked.
4. **Bisect.** \`git bisect start\` → \`git bisect bad\` → \`git bisect good <sha>\`.
   - Automatic check: \`git bisect run <check>\`.
   - Manual check: at each step, show me the commit message and its CHANGELOG line, and ask "good or bad?". \`git bisect skip\` if I can't test that commit.
5. **Report** the first bad commit: SHA, its CHANGELOG entry, \`git show --stat <sha>\`, and the likely cause in 1–3 lines. Then \`git bisect reset\`.
6. **Offer two options** and wait for my OK:
   - **Revert:** \`git revert <sha>\` (\`git revert -m 1 <sha>\` for a merge commit). Safe, adds a new commit.
   - **Forward fix:** a new commit that fixes the cause and keeps the good part of the change.
7. **Never:** \`git reset --hard\` on a pushed branch, force-push, rebase pushed commits, delete or move tags. History stays intact.
8. **Log it:**
   - \`### Broken\`: the symptom, the exact error text in backticks, "introduced in \`sha\`, found by bisect".
   - \`### Fixed\`: the same symptom, with the revert or fix SHA, and the Broken entry's SHA.
   - Suggest a \`TROUBLESHOOTING.md\` entry with the exact error, so the next search finds it.
   - If I stashed changes in step 1, remind me: \`git stash list\`, then \`git stash pop\` when ready.

---

## Required Output Structure

# Changelog

Working journal of notable changes. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**How to read this:**
- Newest first. Dates are commit dates. The whole history is here; search it (\`Ctrl+F\`) for an error message, a file name or a feature.
- \`(a3f291)\` is a short SHA — \`git show a3f291\` to see the diff.
- Entries explain symptom + cause, not just "fixed."
- Last known-good commit: search for \`✅\`. The first hit from the top is the newest version or change that was checked and worked.

---

## [Unreleased]
_Changes since the last dated section or version tag._

### Added
### Changed
### Fixed
### Removed
### Security
### Broken

_(Omit empty buckets in the actual output — list them here only as a template reference.)_

---

## [v1.4.0] — YYYY-MM-DD — tag v1.4.0 (sha) ✅ known good
_(Or, without a version: \`## YYYY-MM-DD — [descriptive milestone like "search rewrite"]\`.)_

### Added
- [Feature]: short description + why it was needed. \`(sha)\`

### Fixed
- [Observed symptom] — caused by [root cause in 4-8 words]. \`(sha)\`
  - _Example:_ "Prayer times off by 1 hour during DST — Mawaqit returns UTC, treated as local. \`(a3f291)\`"

### Changed
- Architectural: [what shifted] — why the old structure was insufficient. \`(sha)\`
  - _Example:_ "Architectural: migrated CJS → ESM — needed top-level \`await\` for config loader. \`(b7d104)\`"

### Security
- [What changed] — what threat it closes. \`(sha)\`

### Broken
- [What's broken] — observed regression, current workaround if any. \`(sha)\`

---

## YYYY-MM-DD — [the first commit]
- Project started: [what the first version did]. \`(sha)\`

_(Every dated section from the newest down to the very first commit stays in the file. Nothing is archived or removed.)_

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CHANGELOG.md":
> 1. Quick mode (default): find the most recent SHA cited in the existing file. Full rebuild (only if I ask, or there's no file): start from the first commit.
> 2. Run \`git log\` and \`git diff --stat\` for everything since that SHA.
> 3. Apply the WIP Decoder — derive intent from diffs when commit messages are vague.
> 4. Group consecutive same-intent commits into single entries; split when intent changes.
> 5. Skip noise (lockfiles, formatter passes, typos, no-op commits).
> 6. Detect version bumps in manifests — if found, close \`[Unreleased]\` into a dated + version-tagged section.
> 7. Append new entries above existing ones. **Never rewrite past entries** except to fix factual errors (and note the correction inline).
> 8. Keep every past section, however old. Never trim, archive or delete history.
> 9. Keep every entry under 2 lines. The file itself has no length limit.
> 10. Add ✅ markers only for tagged versions and for changes I confirmed or a check passed. For "rescue", follow Rescue Mode.

---

## Hard Rules
- **No marketing.** Technical, dense, why-focused. No "we're excited," no "robust," no "seamless."
- **Symptom + cause.** "Fixed bug" is banned. Always: what was observed, what caused it.
- **SHA on every entry.** \`(short-sha)\` — multiple SHAs allowed for grouped entries.
- **Logic over logs.** Bad commit messages are decoded from the diff, not echoed.
- **Append-only history.** Old entries are immutable except for factual corrections.
- **Security gets its own bucket.** Never fold into Fixed.
- **Commit dates, not write dates.** Re-running the prompt must not shift past entries.
- **Two-line cap per entry.** Forensic ≠ verbose. If you need a third line, you have two entries.
- **Complete history.** No file-length cap, no archive, no deletion. Old entries are exactly what a troubleshooting AI needs.
- **Searchable.** Exact error messages, file names and feature names go in backticks.
- **Rescue never rewrites history.** No \`reset --hard\` on pushed branches, no force-push, no moved or deleted tags. Revert or fix forward.

Execute Phase 0, 1, 2 and output \`CHANGELOG.md\`.
`
    },
    {
      id:'vc-trajectory', title:'Trajectory — Final Goal & To-Do List (TRAJECTORY.md)', cat:'Docs', icon:'🧭', color:'#a855f7',
      prompt:`You are a Trajectory Keeper. Your mission: maintain **\`TRAJECTORY.md\`** at the root of my GitHub repository.
It answers two questions, and only these two:
1. **Where is this project going?** → the **Final Goal**.
2. **What's left to do to get there?** → the **To-Do List**.

Both are built from **what I asked for** (my requests in our conversations) and **the repo's GitHub issues**. CONTEXT.md is the present, CHANGELOG.md is the past, and TRAJECTORY.md is the future, written as a to-do list.

---

## Workflow

### Phase 0 — Gather
1. **\`TRAJECTORY.md\`** — the current list, if it exists. Keep every item's ID.
2. **My requests** — read this whole conversation, and any notes I paste. Each time I said "add…", "I want…", "make it…", "fix…", "later…" or "don't…", that's a candidate item. My exact words are the best evidence.
3. **GitHub issues**, open and closed:
   \`gh issue list --state all --limit 200 --json number,title,state,stateReason,labels,body,comments,closedAt\`
   If \`gh\` is unavailable, use the GitHub MCP tools; otherwise ask me to paste the list. If issues are unreachable, write \`_Issues skipped this run_\` under the title and continue.
4. **\`CHANGELOG.md\`** (\`[Unreleased]\` and the latest entries) and **\`git log --oneline\`** since the last sync, to find what's already done.
5. **\`CONTEXT.md\`** §1 (what this is) and §7 (current state).
6. **\`TODO\` / \`FIXME\` comments** in the code.

### Phase 1 — Sort
- **Final goal:** merge my requests and the issues into one picture of the finished project. Use my words. Don't add ambitions I never expressed.
- **To-do items:** one item per distinct piece of work. Deduplicate: a request, an issue and a TODO about the same thing are one item, with all three citations.
- **Where each item goes:**
  - not started or in progress → **To Do**, in one of three priority groups: **Now** (being worked on, max 3), **Next** (do soon, max 7, in order), **Later** (someday).
  - finished (merged commit, closed-as-completed issue, or a CHANGELOG entry) → **Done**, ticked.
  - rejected (I said "no / don't / drop it", or the issue was closed as not planned / wontfix) → **Won't Do**, with the reason.
- **Big requests:** split into sub-tasks (indented checkboxes) when one item is more than a day of work.
- **Unclear requests:** don't guess. Put them under **Questions for me**.

### Phase 2 — Write
Follow the structure below exactly. One line per item. Each item has a checkbox, an ID, a short title, a "why" (the request or issue it serves), and a source citation.

---

## Required Output Structure

# TRAJECTORY
_Last synced: YYYY-MM-DD @ [short sha] · built from: my requests (chat) + GitHub issues #… _

## 🎯 Final Goal
[2–4 sentences: what the project will be when it's done, for whom, and why, in my words.]

**Done when:**
- [ ] [measurable outcome 1]
- [ ] [measurable outcome 2]
- [ ] [3–5 outcomes in total]

## ✅ To Do

### Now
- [ ] **T012** — [title] — [why, one line] · \`(#14, chat)\`
  - [ ] [sub-task, if needed]

### Next
- [ ] **T015** — [title] — [why] · \`(#21)\`

### Later
- [ ] **T020** — [title] — [why] · start when: [condition] · \`(chat)\`

## ✔️ Done (latest 10)
- [x] **T009** — [title] · \`(a3f291, #7)\`

## ❌ Won't Do
- **T007** — [title] — why not: [one honest line] · \`(#9)\`

## ❓ Questions for me
- [anything unclear or contradictory that blocks an item]

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** when asked to "Update TRAJECTORY.md":
> 1. Re-run Phase 0: the existing file, this conversation, all GitHub issues, CHANGELOG, git log since the last sync, TODO comments.
> 2. New requests or issues → new items with the next free ID (\`T\` + number). IDs never change and are never reused.
> 3. Finished items → tick them and move them to **Done** with the commit or PR. Keep only the latest 10 there; older ones are already in CHANGELOG.
> 4. An issue closed as not planned, or an item I rejected → move it to **Won't Do** with the reason.
> 5. Re-order **Next** by value to me ÷ effort, and say in one line what moved and why.
> 6. Rewrite the **Final Goal** only if my requests changed the direction. Then say what changed.
> 7. Refresh the \`_Last synced_\` line.

---

## Hard Rules
- **Only real items.** Every item comes from my request, an issue, a TODO, a commit or CONTEXT.md §7. No invented features.
- **My words first.** The Final Goal and item titles reuse my wording whenever possible.
- **One line per item.** Details belong in the issue or the code, not here.
- **Always cite a source:** \`(#N)\` for an issue, \`(chat)\` for a request in conversation, \`(sha)\` for a commit, \`(TODO file:line)\` for a code comment, \`(CONTEXT §7)\` for an item already planned there.
- **Never delete.** Items move between sections (To Do → Done / Won't Do), never disappear.
- **Small "Now".** At most 3 items. More than that means nothing is really "now".
- **Length cap: 200 lines.**

---

**Execute Phase 0, Phase 1 and Phase 2, and output \`TRAJECTORY.md\`.**
**For a vibe coder:** this works without GitHub issues too. Your requests in the conversation and the TODO comments are enough; just note that issues were skipped.
`
    },
    {
      id:'vc-readme', title:'Vibe-Coder README Engineer (README.md)', cat:'Docs', icon:'📖', color:'#ff8c42',
      prompt:`You are a Vibe-Coder README Engineer. Your mission: generate or rewrite \`README.md\` at the root of my GitHub repository so a stranger lands on the page and understands — in under 20 seconds — what this thing is, whether they want it, and how to run it.

The audience is **humans on GitHub** (not future-AI — that's \`CONTEXT.md\`'s job). Recruiters, curious devs, search engines, my future self showing the repo to a friend. Keep the corporate bloat out: no badges-and-tables-of-contents wall, no "leverages cutting-edge", no faux changelog, no roadmap (link to \`TRAJECTORY.md\` for that).

---

## Workflow

### Phase 0 — Audience & Source Truth
Load existing context. Codebase wins on conflict.
1. \`README.md\` — current truth. Refresh, don't restart. Preserve lines a human visibly wrote (jokes, screenshots, opinions). Rewrite the corporate-sounding ones.
2. \`CONTEXT.md\` — the AI snapshot. Pull the one-sentence pitch and run commands; **do not** copy its tone. Translate AI-ese back to human.
3. \`package.json\` / \`pyproject.toml\` / userscript \`==UserScript==\` headers — name, description, license, version, repo URL.
4. \`CHANGELOG.md\` \`[Unreleased]\` + last shipped version — surface the freshest user-visible feature in the README's "What's new" line.
5. The actual entry-point file — confirm the README's claims match runnable reality.

### Phase 1 — The Vibe Filter
Strip everything that doesn't earn its line:
- **Kill:** badges beyond ≤ 3 (build, license, version max), shields.io banners, ASCII art unless it's the project's identity.
- **Kill:** "Why we built this" longer than 2 sentences. Itch first, story second.
- **Kill:** generic "Contributing" / "Code of Conduct" boilerplate unless the project actually has contributors.
- **Kill:** feature lists that mirror the marketing site. The README is for "should I clone this?"
- **Keep:** one screenshot or GIF above the fold. If the project is visual and there's no media, write \`_TODO: add a screenshot here_\` — do not invent one.
- **Keep:** real install/run commands, copy-pasteable, exact versions where they matter.
- **Keep:** the one weird thing about the project. Userscript? Say so. Zero-dep on purpose? Say so. Built in a weekend? Say so.

### Phase 2 — Write
Target 60–180 lines total. Plain English everywhere. Lead with the screenshot/GIF or skip it cleanly. Cite file paths only when a section refers to a specific entry point (\`src/main.ts\`).

---

## Required Output Structure

# [Project Name]

> One sentence. What it does. Said to a smart friend at a bar, not a recruiter on LinkedIn.

**Quick start:** 1. [install / clone] · 2. [run] · 3. [what you'll see].
_(Exactly 3 short steps on one line, for readers who won't scroll. They must match "Install & run" below.)_

![screenshot or GIF](./docs/preview.png)
_(If no media exists yet: \`_TODO: add a screenshot or GIF showing the main flow_\` — never fabricate a path.)_

## What it is

2–4 sentences, plain English. No "leverages", no "robust", no "seamless". What you can do with it. Who it's for. The one design choice that makes it different from the 12 other tools that do the same thing.

## Install & run

\`\`\`bash
# exact commands, in order, copy-pasteable
\`\`\`

If it's a userscript: link to the install button (\`Install\` directly from \`*.user.js\` raw URL) and the supported managers (Tampermonkey / Violentmonkey / Greasemonkey).
If it needs env vars: link to \`.env.example\`, list variable names only — never values.
If it needs a specific runtime version: state it (\`Node 20+\`, \`Python 3.11+\`).

## Usage

The shortest path from "installed" to "got value." One example, fully worked. Screenshot or terminal block. If there's a keyboard shortcut, command palette, or non-obvious entry point — name it here.

## What's new

One line on the most recent shipped change. Pull from \`CHANGELOG.md\`'s top dated section. Link to the full changelog.
- _Example:_ "**v1.4.0** — added vibe-coding prompts pack. [Full changelog →](./CHANGELOG.md)"

## Why I built this

1 short paragraph (≤ 5 lines). The actual itch. Honest. "I got tired of X" beats "to provide a robust solution for Y".

## License

[License name] — see [\`LICENSE\`](./LICENSE).

## See also

- [\`CONTEXT.md\`](./CONTEXT.md) — for AI assistants joining the project
- [\`CHANGELOG.md\`](./CHANGELOG.md) — what shipped when
- [\`TRAJECTORY.md\`](./TRAJECTORY.md) — the final goal and the to-do list
_(Omit links to files that don't exist. Don't list a doc just to look thorough.)_

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update README.md":
> 1. Re-read \`README.md\`, \`CONTEXT.md\`, manifest files, and \`CHANGELOG.md\`'s top section.
> 2. Refresh the "What's new" line from the latest dated \`CHANGELOG.md\` entry.
> 3. Verify install/run commands by reading the entry-point file and \`package.json\` \`scripts\`. If they drift from the README, **trust the code** and rewrite the README. Make the **Quick start** line match.
> 4. Preserve human-written voice (jokes, opinions, the one weird detail). Rewrite only the corporate-sounding sections.
> 5. Keep total length 60–180 lines. If a section is empty, omit it — don't leave headers with no content.
> 6. Never invent screenshots, demo URLs, or stats. \`_TODO_\` placeholders are honest; fabrications poison trust.

---

## Hard Rules
- **Plain English first.** No "leverages", "robust", "scalable", "best-in-class", "seamless", "cutting-edge".
- **Show, don't sell.** One worked example > five bullet points of features.
- **Honest about scale.** A 200-line userscript doesn't need an architecture diagram.
- **No invented media.** Screenshot path must point to a real file or be marked \`_TODO_\`.
- **No env values.** Variable names only.
- **No drift from code.** If \`package.json scripts\` says one thing and the README says another, the code wins.
- **One screenshot above the fold** if the project is visual. None if it isn't.
- **Length cap: 180 lines.** Compress or split out into \`CONTEXT.md\` / \`docs/\`.
- **Never duplicate \`CONTEXT.md\`.** README is for humans deciding whether to clone. CONTEXT is for AI joining the project. ~30% overlap is the ceiling.

Execute Phase 0, 1, 2 and output \`README.md\`.
`
    },
    {
      id:'vc-troubleshooting', title:'Forensic Troubleshooting Archivist (TROUBLESHOOTING.md)', cat:'Docs', icon:'🩺', color:'#ff4d6a',
      prompt:`You are a Forensic Troubleshooting Archivist. Your mission: maintain \`TROUBLESHOOTING.md\` at the root of my GitHub repository. This file is the project's **3 a.m. survival manual** — a searchable index of every bug, error, gotcha, and "it worked yesterday" moment I've already solved, so future-me and future-AI never re-debug the same thing twice.

The audience is **me at midnight** (panicked, low context) and **AI assistants** I paste error messages into. The killer property of this file is **verbatim error strings** — when an AI or my browser's \`Ctrl+F\` searches for \`TypeError: Cannot read property 'foo' of undefined\`, this file must hit on the first match.

---

## Workflow

### Phase 0 — Context Ingestion
Codebase wins on conflict. Conversations and issues are second.
1. \`TROUBLESHOOTING.md\` — current truth. Append-mostly; only edit existing entries to add new symptoms or correct an inaccurate fix.
2. \`CHANGELOG.md\` \`Fixed\` and \`Security\` buckets — every entry is a candidate. The CHANGELOG records *that* it was fixed; this file records *how* and *what to do if it happens again*.
3. \`CONTEXT.md\` — pull the project's "Fragile Bits & Landmines" section. Each landmine deserves at least one troubleshooting entry.
4. Recent \`git log --grep="fix\\|bug\\|hotfix\\|patch"\` since the last entry — surface fixes the CHANGELOG might have skipped.
5. GitHub Issues labeled \`bug\` (open and closed). Closed issues with a fix-in-comment are gold.
6. Recent conversation — moments where I said "ah, the issue was…", "I figured out why…", "it broke because…", or pasted an error message that we then resolved.
7. \`// FIXME\` / \`// HACK\` / \`// XXX\` comments in code — implicit landmines that haven't bitten yet but will.

### Phase 1 — Entry Mining
For every candidate, decide: is this generalizable enough that I (or anyone) could hit it again?

**Include:**
- Errors with copy-pasteable strings (stack traces, console errors, build failures, runtime exceptions).
- Browser/OS/runtime quirks I worked around (Safari date parsing, Node version mismatches, CORS preflights).
- Configuration footguns (env var typos, wrong port, stale lockfile, missing \`@grant\` in userscript header).
- "Worked yesterday" regressions and their root cause.
- Deploy/build failures with non-obvious causes.
- Race conditions, off-by-one timing, hydration mismatches.
- API edge cases that returned an unexpected shape.

**Skip:**
- One-off typos with no diagnostic value ("I had a typo" is not an entry).
- Bugs already fixed in code where the fix is self-explanatory and never recurs.
- Generic "have you tried turning it off and on again" advice.
- Bugs from external dependencies that are now patched upstream — note in CHANGELOG \`Security\`, not here.

### Phase 2 — Synthesis
Every entry follows the same shape. Sort by **frequency-then-severity**, not chronologically. The bugs you hit most often go on top.

- **Verbatim error string** is the entry's title prefix when one exists. AI assistants and \`Ctrl+F\` search by exact string match; truncating the error breaks both.
- **Symptom** is what the user/dev *saw*, not the internal cause. "Page is blank after clicking Submit" — not "useState undefined".
- **Cause** is the root cause in 1–3 lines. If unknown, write \`_root cause unconfirmed — workaround below_\`.
- **Fix** is copy-pasteable steps or a code snippet. If the fix lives in the codebase, cite the SHA where it landed.
- **First seen** is the date you first hit it. Don't shift dates on re-runs.

---

## Required Output Structure

# Troubleshooting

3 a.m. survival manual. Errors, gotchas, regressions, and the fixes that made them go away.

**How to read this:**
- Sorted by frequency-then-severity. Top entries are the ones you'll hit again.
- Error strings are **verbatim** so \`Ctrl+F\` and pasted-into-AI lookups hit on the first match.
- \`(sha)\` cites the commit where the fix landed. \`git show <sha>\` for the diff.

---

## Quick Index
_(Auto-regenerate on every update. One bullet per entry, linking to its anchor. Skip if total entries < 6.)_

- [\`TypeError: Cannot read properties of undefined (reading 'X')\` after SPA navigation](#typeerror-cannot-read-properties-of-undefined-reading-x-after-spa-navigation)
- [Userscript stops firing after 30s on chatgpt.com](#userscript-stops-firing-after-30s-on-chatgptcom)
- _(etc.)_

---

## \`[Verbatim error string, or short symptom if no error]\`

- **First seen:** YYYY-MM-DD | **Frequency:** ▲▲▲ (rare / occasional / weekly) | \`(sha if fix landed)\`
- **Symptom:** What I observed. The user-visible failure. 1–2 lines.
- **Cause:** Root cause in 1–3 lines. If multiple causes can produce the same symptom, list each as a sub-bullet.
- **Fix:**
  \`\`\`bash
  # exact command, code snippet, or click-path
  \`\`\`
  Or: link to the line in the codebase where the fix lives — \`src/foo.ts:42\`.
- **Why this happens (optional):** 1 line of mechanism if it's non-obvious or recurs in similar projects.
- **Related:** \`(other entry anchors, CHANGELOG dates, issue numbers)\` if applicable.

---

### _Example entry — delete after first real entry is added:_

## \`TypeError: Cannot read properties of undefined (reading 'querySelector')\` on page load

- **First seen:** 2026-04-12 | **Frequency:** ▲▲▲ | \`(a3f291)\`
- **Symptom:** Userscript trigger button never appears on first navigation to \`chatgpt.com\`. Refresh fixes it.
- **Cause:** \`@run-at document-idle\` fires before ChatGPT's React tree mounts the prompt textarea. The script queries the DOM, finds nothing, and throws.
- **Fix:**
  \`\`\`js
  // Use waitForElement instead of direct querySelector
  await waitForElement('#prompt-textarea', { timeout: 5000 });
  \`\`\`
  See \`Prompt generator.user.js:614\` for the helper pattern.
- **Why this happens:** SPAs hydrate after \`document-idle\`. Any script that touches their mounted DOM at idle is racing the framework.
- **Related:** \`[CHANGELOG] 2026-04-12 — Fixed\`, \`(#7)\`.

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update TROUBLESHOOTING.md":
> 1. Re-run Phase 0 — read CHANGELOG \`Fixed\`, \`git log --grep="fix"\`, GitHub bug-labeled issues, and recent conversation for "the issue was…" moments.
> 2. For every candidate, apply the include/skip filter from Phase 1.
> 3. **Always preserve verbatim error strings.** Do not paraphrase them. Do not truncate stack traces — keep at least the first 3 frames.
> 4. **Re-sort the file** by frequency-then-severity on every update. New entries do not automatically go on top.
> 5. **Update frequency markers** when you encounter the same entry again — bump from ▲ to ▲▲ to ▲▲▲.
> 6. **Regenerate the Quick Index** if total entries ≥ 6.
> 7. **Never delete entries** — bugs that "can't happen anymore" still help future-AI recognize an old error in a fresh codebase. Mark them \`Status: archived (no longer reproducible since v1.4.0)\` instead.
> 8. **Cite SHAs** for every fix that landed in code. Cite issue numbers for every entry sourced from GitHub Issues.
> 9. Refresh the \`_Last synced_\` line at the top with today's date.
> 10. Keep the file under 800 lines. Roll archived entries (>12 months, no recurrence) into a \`<details>\` block at the bottom.

---

## Hard Rules
- **Verbatim error strings.** Paraphrasing breaks \`Ctrl+F\` and AI semantic search. Quote exactly.
- **Symptom + Cause + Fix.** Every entry needs all three. "Just upgrade Node" is not a fix unless you say which version and why.
- **Frequency-then-severity sort.** The bug I hit weekly belongs above the one I hit once last year. Re-sort on every update.
- **No fabricated errors.** If I haven't actually hit it, it doesn't go in. This is a forensic log, not a brainstorming list.
- **Cite the SHA.** Every fix that landed in code gets \`(sha)\`. Every entry sourced from GitHub gets \`(#N)\`.
- **No deletion.** Outdated entries get marked \`archived\`, not removed.
- **Don't fold into CHANGELOG.** CHANGELOG records *that* it was fixed. This file records *what to do when it happens again*. They serve different audiences.
- **Length cap: 800 lines.** Old archived entries roll into the \`<details>\` block.

Execute Phase 0, 1, 2 and output \`TROUBLESHOOTING.md\`.
`
    },
    {
      id:'vc-prompts-codex', title:'Recursive Prompt Codex (PROMPTS.md)', cat:'Docs', icon:'🪞', color:'#4d9fff',
      prompt:`You are a Recursive Prompt Codex Engineer. Your mission: generate or update \`PROMPTS.md\` at the root of my GitHub repository — a curated registry of every prompt I used to **build, maintain, and document this project**, including the prompts in my vibe-coding toolbox itself.

The audience is **future-me** (returning in 6 months wanting to extend the project in the same style) and **AI assistants** I'll re-prime so their output matches the existing voice and structure. This file is the project's **style fingerprint**: paste the right prompt back into a new chat and you get code/docs that look like they came from the same hand.

---

## Workflow

### Phase 0 — Source Hunt
Codebase wins on conflict. Conversations are second.
1. \`PROMPTS.md\` — current truth. Update, don't restart. Numbers (\`P-001\`, \`P-002\`) are eternal once assigned.
2. Toolbox folders in this repo (e.g., \`vibe-coding-tools-101/\`, \`prompts/\`, \`all_prompts/\`) — every \`.md\` / \`.txt\` prompt is a candidate. The filename is its working name.
3. \`CONTEXT.md\` §5 (Rules For Editing This Code) — surfaces style invariants that the prompts enforce.
4. \`CHANGELOG.md\` \`Architectural\` entries — prompts often produced these structural moves.
5. \`TRAJECTORY.md\` \`Decisions\` — when a Decision was reached via prompt-driven analysis, the prompt deserves an entry.
6. Recent conversation — prompts I pasted inline that produced code now in the repo. Lift the prompt verbatim if I quoted it in chat; reconstruct it from the output if I didn't.
7. Inline \`// AI:\` or \`<!-- prompt: -->\` comments in code — explicit anchors I left for myself.

### Phase 1 — Entry Mining

**Include a prompt if:**
- It produced code, docs, or artifacts currently in the repo (the prompt is **load-bearing**).
- It's reusable — re-running it on similar input would produce comparable output.
- It encodes a non-obvious style choice (tone, structure, constraint set) that I'd want preserved on a re-prime.
- It's part of a documented workflow (\`Update CONTEXT.md\`, \`Update CHANGELOG.md\`, etc.) where the AI needs the original prompt to do the next iteration correctly.

**Skip:**
- One-shot debugging prompts ("why is X undefined") — TROUBLESHOOTING.md territory if they generalize.
- Pure conversation ("explain this concept to me").
- Prompts that produced output later replaced or rejected — record the *replacement*, not the dead end (unless the dead end is a Graveyard-worthy lesson, in which case 1 line in §IV).
- Generic "act as a senior engineer" preambles that aren't anchored to project specifics.

### Phase 2 — Synthesis
One entry per prompt. Use prefix \`P-NNN\`. Numbers are eternal — never renumber, even if a prompt is deprecated.

**Storage rule:** Long prompts (> 40 lines) live in their own file under \`prompts/\` (or the existing toolbox folder) and \`PROMPTS.md\` links to them. Short prompts (≤ 40 lines) embed inline in fenced code blocks.

**Citation:** every entry cites either the file where the prompt lives, the artifact it produced (file path + SHA), or both.

---

## Required Output Structure

# Prompts

The recursive registry. Every prompt that built or maintains this project — so future-me and future-AI can re-prime in the same voice.

**How to read this:**
- Numbers (\`P-001\`) are eternal. A deprecated prompt keeps its number and moves to §IV.
- Long prompts link to their file. Short ones embed below.
- "Used to" tells you when to reach for it. "Last used" tells you whether it's still active.

---

## I. Active Prompts — In Regular Rotation

### P-001 — [Punchy Name, e.g., "Codebase Context Engineer"]
- **File:** [\`vibe-coding-tools-101/generate-context.md\`](./vibe-coding-tools-101/generate-context.md) _(or "embedded below" for short prompts)_
- **Used to:** Generate or update \`CONTEXT.md\`. The "AI memory file" prompt.
- **Last used:** YYYY-MM-DD | **Produces:** \`CONTEXT.md\` \`(sha)\`
- **One-line summary:** Forensic discovery → repo scan → write, with \`_Not yet figured out_\` for missing evidence.
- **When to reach for this:** Onboarding a new AI, or after a significant architectural shift the existing CONTEXT.md hasn't absorbed.

### P-002 — [Name]
- **Embedded:**
  \`\`\`
  [paste the full prompt verbatim, only if ≤ 40 lines]
  \`\`\`
- **Used to:** [Purpose, 1 line]
- **Last used:** YYYY-MM-DD | **Produces:** [artifact]
- **One-line summary:** [what it does]
- **When to reach for this:** [trigger condition]

---

## II. Workflow Chains — Prompts That Run In Sequence

Some files maintain themselves through a chain of prompts. Document the order.

### Chain: Documentation Refresh Cycle
1. **P-001 (Codebase Context Engineer)** → updates \`CONTEXT.md\` first; downstream prompts read from it.
2. **P-002 (Forensic Changelog Engineer)** → updates \`CHANGELOG.md\` from git log + diff stat.
3. **P-003 (Forensic Trajectory Cartographer)** → updates \`TRAJECTORY.md\` from CHANGELOG + issues + chat.
4. **P-00X (Vibe-Coder README Engineer)** → updates \`README.md\` last, pulling from CONTEXT + CHANGELOG.

_Pattern: stateful prompts depend on the file produced by the previous step. Run them in order or accept drift._

---

## III. One-Shot Templates — Used Occasionally

Prompts I reach for less than monthly but want preserved verbatim.

### P-0NN — [Name]
- **Embedded:** \`<fenced block>\` or **File:** \`<path>\`
- **Used for:** [specific situation]
- **Don't use when:** [anti-pattern]

---

## IV. Deprecated — Kept for Reference, Not Active

Prompts replaced by better versions, or whose output is no longer accepted. **Never delete** — they encode lessons.

### P-00Y — [Original name]
- **Status:** Deprecated YYYY-MM-DD | **Replaced by:** P-00Z _(or "no replacement — workflow abandoned")_
- **Why retired:** 1 line. Honest. ("Produced too-corporate output", "Drifted from CONTEXT.md voice", "Output broke on monorepos".)
- **Original prompt:** link to historical file or embedded fenced block.

---

## V. Style Invariants — What Every Prompt In This Repo Enforces

Cross-cutting rules that show up in most prompts. New prompts should respect these.
- **Plain English first** in user-facing artifacts (README, CONTEXT §1–§2).
- **Cite SHAs** on every changelog/trajectory entry that touched code.
- **Append-only history** — past entries are immutable except for factual corrections.
- **\`_Not yet figured out_\`** is the honest placeholder. Never fabricate.
- **No corporate vocabulary** — no "leverages", "robust", "scalable", "seamless".
- _(Add the actual invariants observed across this repo's prompts.)_

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update PROMPTS.md":
> 1. Re-scan toolbox folders for new \`.md\` / \`.txt\` prompt files.
> 2. Re-read recent conversation for prompts pasted inline that produced code/docs now in the repo.
> 3. For every new candidate, apply the include/skip filter from Phase 1.
> 4. Assign the next sequential \`P-number\`. **Never reuse numbers**, even from deprecated entries.
> 5. **Long prompts (> 40 lines):** create a file under \`prompts/\` (or the appropriate existing folder) and link to it. Do not embed.
> 6. **Short prompts (≤ 40 lines):** embed verbatim in a fenced code block.
> 7. **Update \`Last used\` dates** when you see evidence in \`git log\` or conversation that the prompt was re-run.
> 8. **Promotions/demotions:** If an Active prompt hasn't been used in > 6 months and a successor exists, move to §IV with a 1-line "why retired".
> 9. **Workflow chains:** Re-verify the sequence in §II — if a new prompt slots into an existing chain, insert it. If a chain has changed order, rewrite §II.
> 10. **Style invariants:** When you spot a new invariant repeated across ≥ 3 prompts, add it to §V.
> 11. Refresh the \`_Last synced_\` line at the top with today's date.

---

## Hard Rules
- **Numbers are eternal.** \`P-007\` stays \`P-007\` even after deprecation.
- **Verbatim or bust.** Embed prompts exactly as run. Paraphrasing breaks the re-prime guarantee.
- **Long prompts get their own file.** Inline only ≤ 40 lines. PROMPTS.md is an index, not a library.
- **Cite the artifact.** Every active prompt entry must point to the file/SHA it produced.
- **No deletion.** Deprecated prompts move to §IV with a 1-line autopsy. The lesson is the value.
- **No invented prompts.** Only prompts that actually produced something in this repo. This is a forensic registry, not a wishlist.
- **Plain summaries.** "What it does in one line" — no "leverages a multi-phase synthesis approach". Just say what it does.
- **Style invariants are observed, not prescribed.** §V documents what your prompts already enforce, not what you wish they did.
- **Length cap: 400 lines** for the index file itself. Push prompt bodies into linked files.

Execute Phase 0, 1, 2 and output \`PROMPTS.md\`.
`
    },
    {
      id:'vc-release', title:'GitHub Release Manager (RELEASE.md)', cat:'Docs', icon:'🏷️', color:'#facc15',
      prompt:`You are a GitHub Release Manager. Your mission: maintain **\`RELEASE.md\`** at the root of my GitHub repository, and create the git tags and GitHub Releases that go with it.

The reader is me (a vibe coder who mostly pushes to \`main\`), my users, and the AI agents that will rescue this project when something breaks. A tag is a permanent "this version worked" anchor: CHANGELOG Rescue mode bisects from it, and users can install exactly that version from it. CONTEXT.md is the present, CHANGELOG.md is the past, TRAJECTORY.md is the future, and RELEASE.md is **what users can install, now and before**.

**A track** is one thing that ships with its own version: a package, an app, a userscript. One repo can have several tracks. Each track gets its own tag prefix (\`app-v1.2.0\`, \`cli-v0.4.1\`). A repo with one track uses plain \`v1.2.0\`.

---

## Workflow

### Phase 0 — Read
1. **\`RELEASE.md\`** — current truth, if it exists: the tracks, their tag prefixes, the current versions.
2. **\`CHANGELOG.md\`** — the \`[Unreleased]\` section, and the ✅ known-good markers.
3. **Version sources** — \`package.json\`, \`pyproject.toml\`, \`Cargo.toml\`, or the \`@version\` line of each userscript's \`==UserScript==\` header.
4. **Tags** — \`git fetch --tags\`, then \`git tag -l --sort=-creatordate\`.
5. **Releases** — \`gh release list\`. If GraphQL is blocked (it is in Claude Code cloud sessions), use REST: \`gh api repos/{owner}/{repo}/releases\`. If \`gh\` is unavailable, use the GitHub MCP tools; otherwise ask me.
6. **\`CONTEXT.md\`** §2 (build / deploy) and §5 (rules), so the release follows the project's own rules.

### Phase 1 — Decide
For each track:
1. **Did it change?** \`git diff <last-tag>..HEAD -- <path>\`. No diff → no release for that track. No tag yet → compare with the first commit of the file.
2. **Propose a semver bump** from the CHANGELOG entries and the diff:
   - **patch** — fixes only.
   - **minor** — new features, nothing breaks.
   - **major** — breaks saved data, a shortcut, a config file, or the install / update URL.
3. **Version already bumped** in the file but never tagged? Release that version; don't bump twice.

### Phase 2 — Prepare
1. Bump the version in the version source (only if Phase 1 says so).
2. Move the matching \`[Unreleased]\` entries into a dated version section: \`## [<track> vX.Y.Z] — YYYY-MM-DD\`. Keep the entry text; don't rewrite it.
3. Draft short release notes for humans, one file per release (\`/tmp/notes-<tag>.md\`, never committed):

\`\`\`markdown
## What's new
- [user-visible change, one line each]

## Fixes
- [what users saw — now fixed]

## How to install or update
[install link] · already installed? Your manager updates it automatically.

## How to roll back
[pinned install link for the previous tag] + any step needed to stop auto-updates.

**Full changelog:** https://github.com/{owner}/{repo}/compare/<prev-tag>...<new-tag>
\`\`\`

### Phase 3 — STOP
Show me the plan and wait for my OK:

| Track | Old → new | Tag | Commit (SHA) | Asset | Pre-release? |
|---|---|---|---|---|---|

…plus each draft of the release notes. Change nothing on GitHub before I answer.

### Phase 4 — Ship (after my OK)
1. Commit the version bump and the CHANGELOG move: \`release: <track> vX.Y.Z\`. Push to the branch I ship from.
2. Annotated tag on that commit, then push the tag alone:
   \`git tag -a <tag> <sha> -m "<track> vX.Y.Z"\` → \`git push origin <tag>\`.
3. Release, with the shipped file attached as an asset:
   \`gh release create <tag> <file> --title "<Track> vX.Y.Z" --notes-file /tmp/notes-<tag>.md\` (add \`--prerelease\` for anything I call beta).
4. Mark the CHANGELOG heading ✅: \`## [<track> vX.Y.Z] — YYYY-MM-DD — tag <tag> (<sha>) ✅ known good\`.
5. Update \`RELEASE.md\`: the current versions table and the release history.
6. Commit and push those two doc changes: \`docs: record <tag>\`.

**Backfill (first run in a repo that never tagged):** for each track, find every commit where the version changed:
\`git log --follow -G'<version line pattern>' --format='%h %ad %s' --date=short -- <path>\` (add old paths if the file moved). Cross-check with the CHANGELOG headings. Show me the table of proposed historic tags and **create nothing until I say OK**. Historic versions get tags only; a GitHub Release goes only to the current version of each track.

---

## Required Output Structure

# Releases

What users can install, now and before. History of every change: [\`CHANGELOG.md\`](./CHANGELOG.md). All releases: [GitHub Releases](https://github.com/{owner}/{repo}/releases).

## Current versions
| Track | Version | Tag | Date | Install latest | Install exactly this version |
|---|---|---|---|---|---|
| [name] | vX.Y.Z | \`[prefix]X.Y.Z\` | YYYY-MM-DD | [link to \`main\` or the store] | [link pinned to the tag] |

Pinned link format: \`https://github.com/{owner}/{repo}/raw/<tag>/<path>\`.

## Roll back a user
[Exact steps. Include anything that would silently undo the rollback, such as auto-update.]

## [One section per distribution channel that needs notes: a store, a package registry…]
[Where users get it, and how it is kept in sync with GitHub. If you can't tell, write \`_Not yet figured out_\`.]

## Release checklist
- [ ] [this repo's own checks: tests, lint, build…]
- [ ] Version bumped, CHANGELOG section dated
- [ ] Tag pushed, release created with the file attached, CHANGELOG ✅, this file updated

## Release history
Newest first.
| Date | Tag | Commit | Notes |
|---|---|---|---|

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** when asked to "release", "ship" or "update RELEASE.md":
> 1. Re-run Phase 0: RELEASE.md, CHANGELOG \`[Unreleased]\`, version sources, tags, releases.
> 2. Phase 1: which tracks changed since their last tag, and the semver bump for each.
> 3. Phase 2: bump, move CHANGELOG entries, draft notes.
> 4. Phase 3: show me the plan and **stop**.
> 5. After my OK, Phase 4: commit, tag, push the tag, create the release, mark ✅, update RELEASE.md.

---

## Hard Rules
- **Tags are permanent.** Never moved, never reused, never deleted. A bad release gets a new patch version, not a moved tag.
- **One release per track per version.**
- **Nothing on GitHub without my OK.** No tag, no push, no release before Phase 3 is approved.
- **Pre-release flag** (\`--prerelease\`) for anything I call beta, alpha, test or preview.
- **No secrets in the notes**: no tokens, keys, internal URLs or personal data.
- **Tag what users got.** Tag the commit that contains the shipped file, on the branch users install from.
- **Plain notes.** Short, for users: what changed for them, how to update, how to go back.
- **Length cap: ~120 lines** for \`RELEASE.md\`. Old history rows can be shortened to date · tag · commit.

**Execute Phase 0, 1 and 2, then stop at Phase 3 with the plan.**
**For a vibe coder:** no GitHub Releases yet? Start with tags only. The tags alone already give Rescue mode its anchors and users their pinned install links.
`
    },

    // ── Helpers: everyday coding prompts; they only read/update CONTEXT.md and CHANGELOG.md ──
    {
      id:'vc-stabilize', title:'Stabilize a Prototype', cat:'Helpers', icon:'🧱', color:'#facc15',
      prompt:`This project is a prototype an AI drafted with me, and I now want to keep it. Stabilize it: document it as it is, so the doc prompts can take over.

1. Make sure git is initialized (\`git init\` if not). Commit everything as it is: \`git add -A && git commit -m "prototype baseline"\`. Check that no secrets (\`.env\`, keys) get committed; add a \`.gitignore\` first if needed.
2. **Don't refactor or clean up.** No renames, no "small fixes", no new dependencies. Document the prototype as it is. Every weird part (duplicated code, hard-coded values, odd workarounds, things that only work by luck) goes into \`CONTEXT.md\` §6 "Fragile Bits & Landmines".
3. If the CONTEXT, CHANGELOG and TRAJECTORY prompts are pasted below (picked with \`Tab\`), run them in this order:
   - CONTEXT → writes \`CONTEXT.md\`;
   - CHANGELOG in **full-rebuild** mode → writes \`CHANGELOG.md\` from the first commit;
   - TRAJECTORY → writes \`TRAJECTORY.md\` from what I asked for so far.
   If they're not pasted, write a minimal \`CONTEXT.md\` (what it is, how to run it, the main files, the landmines) and tell me to run the full prompts next.
4. Ask me to run the app and confirm it works. Don't assume it does.
5. When I confirm: mark the baseline in \`CHANGELOG.md\` as \`✅ known good (sha)\`, and propose the first release, \`v0.1.0\`, with the RELEASE prompt. Create no tag before my OK.

From now on, every change goes through the helpers and ends with a CHANGELOG line, so this baseline is the first "it worked here" point for Rescue mode.
`
    },
    {
      id:'vc-plan-first', title:'Plan Before Code', cat:'Helpers', icon:'📐', color:'#a855f7',
      prompt:`Don't write code yet. Plan first.

Task: [describe the feature or change, and how I'll know it works]

1. Read \`CONTEXT.md\` first (how to run it, rules for editing, landmines), then the files this task touches.
2. Restate the goal in one sentence and list your assumptions. If something important is unclear, ask me (3 questions max).
3. List every file you'll create or change, with one line on why.
4. Propose the simplest approach that works. If you considered a bigger one, say in one line why you didn't pick it.
5. Split the work into small steps. For each step: what changes · how we check it (test, command, or what I should see) · what could break.
6. Stop and wait for my OK.

After I approve: do the steps one by one and check each before moving on. Don't touch unrelated code.

When done: update \`CONTEXT.md\` §7 "Current State" in 1–2 lines, and add one line to \`CHANGELOG.md\` under \`[Unreleased]\`.
`
    },
    {
      id:'vc-debug', title:'Debug — paste the error', cat:'Helpers', icon:'🔍', color:'#ff4d6a',
      prompt:`Fix this bug. Evidence first, edits second.
Everything is broken, or it worked a few commits ago? Use the CHANGELOG prompt in Rescue mode instead.

What I did: [command or clicks]
What happened (exact error, not shortened):
\`\`\`
[paste the full error / stack trace / log]
\`\`\`
What I expected: [one line]

1. Search \`TROUBLESHOOTING.md\` (if it exists) for this exact error, and read \`CONTEXT.md\` §6 "Fragile Bits & Landmines". If it's a known problem, apply the known fix.
2. Otherwise explain in 1–3 lines what the error means and which line causes it.
3. Reproduce it, then form ONE hypothesis and test it. Change the smallest thing that fixes the cause — not the symptom. No \`@ts-ignore\`, \`any\`, empty \`catch\`, or deleting the failing test.
4. Two failed attempts → stop guessing. List 3 possible causes with the evidence for each and pick the best one.
5. Works locally but not when deployed? Check, in order: environment variables, hard-coded localhost / CORS, case-sensitive file paths, routing fallback, runtime version, database migrations.
6. Re-run what failed and show it passing.

When done: add a line under \`### Fixed\` in \`CHANGELOG.md\` ("[what you saw] — caused by [root cause]"). If this bug could come back, add it to \`TROUBLESHOOTING.md\` with the exact error text. If it revealed a fragile spot, add it to \`CONTEXT.md\` §6.
`
    },
    {
      id:'vc-review', title:'Review the Diff', cat:'Helpers', icon:'🧐', color:'#4d9fff',
      prompt:`Review my current changes like a careful senior developer before I commit. Don't edit anything.

Read the diff and \`CONTEXT.md\` (§5 "Rules For Editing This Code" and §6 "Fragile Bits & Landmines"). Then look for:
- bugs and broken callers;
- missing error handling and edge cases (empty, null, very large, offline, double click);
- security problems: secrets in code, missing permission checks, injection, unescaped user input;
- broken rules from CONTEXT.md, or edits to a landmine without care;
- changes unrelated to the goal.

For each problem: file:line · what triggers it · what goes wrong · how to fix it. Most serious first.
Say clearly what you checked and what you couldn't check. If you find nothing, say so.
Finally, suggest the \`CHANGELOG.md\` line for this change.
`
    },
    {
      id:'vc-refactor', title:'Refactor Safely', cat:'Helpers', icon:'♻️', color:'#2dd4bf',
      prompt:`Refactor [file / function] to [goal: easier to read, remove duplication, split a big file…] WITHOUT changing what it does.

1. Read \`CONTEXT.md\` §5 and §6 first: follow the editing rules and be careful with the landmines.
2. List what the code does now (inputs → outputs, side effects). If no test covers it, write a small test first and make sure it passes.
3. Propose the refactor as small steps and wait for my OK.
4. After each step, run the tests. Show changes as diffs, not whole files.
5. No new features, no new dependencies, no renaming of things other code uses.
6. Found a bug on the way? Don't fix it silently — list it at the end.

When done: if files moved or were split, update \`CONTEXT.md\` §4 "Code Map", and add one line under \`### Architectural\` in \`CHANGELOG.md\`.
`
    },
    {
      id:'vc-security', title:'Security Check', cat:'Helpers', icon:'🔒', color:'#ff8c42',
      prompt:`Check this project for security problems before real people use it. Assume it was built fast.

Read \`CONTEXT.md\` first, then check in this order:
1. **Secrets** — API keys, tokens or passwords in the code, in the browser bundle, or in git history. Move them to environment variables; tell me which ones to change.
2. **Who can do what** — every page, API route and action checks that the user is logged in AND allowed to touch *this* item. Admin actions are checked on the server, not just hidden.
3. **Injection** — no SQL or shell commands built from user text, no \`eval\`, user text is escaped before it's shown.
4. **Input** — the server checks types, lengths and file sizes, not only the form.
5. **Abuse** — rate limits on login, sign-up, password reset, and anything that costs money (AI calls, emails, SMS).
6. **Settings** — debug mode off in production, CORS not open to everyone, packages without known vulnerabilities.

For each problem: how serious · file:line · how someone could abuse it (one line) · the fix. Fix the serious ones; list the rest.

When done: add lines under \`### Security\` in \`CHANGELOG.md\`, and note any risky area in \`CONTEXT.md\` §6.
`
    },
    {
      id:'vc-manager', title:'Manager — several AI agents at once', cat:'Helpers', icon:'🧑‍✈️', color:'#c8ff00',
      prompt:`You are the **Manager**: you coordinate several AI coding agents working on this repository at the same time (Claude Code, Codex, Cursor, Antigravity…). You split the work, hand it out, check it and merge it. You don't write the code yourself.

**The one rule: a file is edited by only one agent at a time.**

1. Read \`CONTEXT.md\` and \`CHANGELOG.md\`. Take my goal: [describe the goal].
2. Split it into tasks that touch **different files**. Two tasks that need the same file run one after the other, never at the same time.
3. Create \`MANAGER.md\`:

\`\`\`markdown
# MANAGER
| Task | Agent | Files it may edit | Branch | Status |
|---|---|---|---|---|
| T1 — … | Agent A | src/auth/** | agent/T1 | todo / working / done / merged |

Only the Manager edits: CONTEXT.md, CHANGELOG.md, TROUBLESHOOTING.md, TRAJECTORY.md, README.md, PROMPTS.md, MANAGER.md, package files and lockfiles.
\`\`\`

4. Write one short brief per task, ready to paste: the task · how we check it's done · the files it may edit · its own branch · "Read CONTEXT.md. Edit only your files. Don't edit CONTEXT.md or CHANGELOG.md — put what should change there in your final report. Need another file? Stop and tell me."
   If this tool can start sub-agents itself, start them with these briefs, each on its own branch; otherwise I'll paste them into separate agents.
5. When an agent reports back: check it only changed its files (otherwise send it back), review it, merge one branch at a time and run the tests after each merge, then mark it merged in MANAGER.md.
6. You alone then update \`CONTEXT.md\` §7 "Current State" and \`CHANGELOG.md\` from the reports.
`
    },
    {
      id:'vc-handoff', title:'Handoff — summarize this chat into HANDOFF.md', cat:'Helpers', icon:'🤝', color:'#4d9fff',
      prompt:`Summarize our current discussion into \`HANDOFF.md\`, so I can continue in a new chat or with another AI (Claude Code, Codex, Cursor, Antigravity…) without the history.

Write only facts from this conversation and the repository; if something wasn't decided, say so. Use this structure:

\`\`\`markdown
# HANDOFF — [project] — [date]

## Goal
What we are trying to achieve, in 1–3 sentences.

## Decisions
- What we chose — why — what we rejected. Include my preferences (style, tools, "keep it simple"…).

## Done
- What was built or changed, with file paths (and commit / PR links if any).

## Not done / open
- Unfinished work, open questions, known problems.

## Next step
One concrete thing to do first in the next session.

## How to continue
"Read HANDOFF.md, CONTEXT.md and CHANGELOG.md, then do the next step above."
\`\`\`

Rules: under 80 lines. No secrets, passwords or personal data. Link files instead of copying them. If \`HANDOFF.md\` already exists, replace it — it's a snapshot, not a log.

When done: update \`CONTEXT.md\` §7 "Current State" in 1–2 lines.
`
    },
  ];

  const GROUP_LABELS = { Docs: 'Your docs — the original 101', Helpers: 'Helpers — use while coding' };

  // One prompt → its text. Several (picked with Tab) → one session with numbered steps.
  function fullText(ps) {
    if (ps.length === 1) return ps[0].prompt;
    return [
      `Run these ${ps.length} prompts in order, as one session. Finish each step before starting the next. If a step says to wait for my OK, stop there and continue after I reply.`,
      ...ps.map((p, i) => `\n## Step ${i + 1} of ${ps.length} — ${p.title}\n\n${p.prompt.trim()}`),
    ].join('\n');
  }

  // Loaded as a plain script (no userscript manager), e.g. by scripts/sync-vibe-prompts.js:
  // hand over the prompts and stop before touching the page.
  if (typeof GM_addStyle === 'undefined' && typeof window !== 'undefined' && typeof window.__PGV_EXPORT__ === 'function') {
    window.__PGV_EXPORT__({ prompts: BUILTIN_PROMPTS, groups: GROUP_LABELS });
    return;
  }

  // ═══════════════════════════════════════════════════════════
  //  PROVIDER DETECTION — maps hostname to input strategy
  // ═══════════════════════════════════════════════════════════
  const PROVIDERS = {
    'chatgpt.com':       { name:'ChatGPT',    sel:'#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"]', type:'contenteditable' },
    'chat.openai.com':   { name:'ChatGPT',    sel:'#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"]', type:'contenteditable' },
    'claude.ai':         { name:'Claude',      sel:'div.ProseMirror[contenteditable="true"]', type:'prosemirror' },
    'gemini.google.com': { name:'Gemini',      sel:'div.ql-editor[contenteditable="true"], rich-textarea .ql-editor', type:'contenteditable' },
    // Google Labs (Flow, Whisk, ImageFX…) — the prompt box is a plain textarea, but the
    // page also carries hidden/offscreen textareas, so findInput() prefers a visible one.
    'labs.google':       { name:'Google Labs', sel:'textarea[placeholder], textarea, div[contenteditable="true"]', type:'textarea' },
    'chat.deepseek.com': { name:'DeepSeek',    sel:'textarea#chat-input, textarea', type:'textarea' },
    'deepseek.com':      { name:'DeepSeek',    sel:'textarea#chat-input, textarea', type:'textarea' },
    'www.perplexity.ai': { name:'Perplexity',  sel:'textarea', type:'textarea' },
    'labs.perplexity.ai':{ name:'Perplexity',  sel:'textarea', type:'textarea' },
    'chat.mistral.ai':   { name:'Mistral',     sel:'textarea', type:'textarea' },
    'grok.com':          { name:'Grok',        sel:'textarea', type:'textarea' },
    'x.com':             { name:'Grok',        sel:'textarea', type:'textarea' },
    'copilot.microsoft.com':{ name:'Copilot',  sel:'textarea, #searchbox', type:'textarea' },
    'you.com':           { name:'You.com',     sel:'textarea', type:'textarea' },
    'poe.com':           { name:'Poe',         sel:'textarea', type:'textarea' },
  };

  const host = location.hostname;
  const provider = PROVIDERS[host] || { name:'Unknown', sel:'textarea, [contenteditable="true"]', type:'auto' };

  // ═══════════════════════════════════════════════════════════
  //  STYLES (updated with manager modal)
  // ═══════════════════════════════════════════════════════════
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --pgv-bg: #111113;
      --pgv-bg2: #1a1a1f;
      --pgv-bg3: #222228;
      --pgv-border: #2a2a32;
      --pgv-text: #f0f0f2;
      --pgv-text2: #b0b0ba;
      --pgv-text3: #707078;
      --pgv-accent: #c8ff00;
      --pgv-radius: 12px;
      --pgv-font: 'Outfit', system-ui, -apple-system, sans-serif;
      --pgv-mono: 'JetBrains Mono', monospace;
      --pgv-shadow: 0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06);
    }

    /* Floating trigger button */
    #pgv-trigger {
      position: fixed;
      bottom: 132px;
      right: 20px;
      z-index: 2147483640;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--pgv-bg);
      border: 1px solid var(--pgv-border);
      color: var(--pgv-accent);
      cursor: pointer;
      display: grid;
      place-items: center;
      font-size: 18px;
      font-family: var(--pgv-font);
      font-weight: 700;
      box-shadow: var(--pgv-shadow);
      transition: all 150ms ease;
      user-select: none;
    }
    #pgv-trigger:hover {
      transform: scale(1.08);
      border-color: var(--pgv-accent);
      box-shadow: 0 0 20px rgba(200,255,0,.15), var(--pgv-shadow);
    }
    #pgv-trigger .pgv-kbd {
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--pgv-bg3);
      border: 1px solid var(--pgv-border);
      border-radius: 5px;
      padding: 1px 5px;
      font-size: 9px;
      font-family: var(--pgv-mono);
      color: var(--pgv-text3);
      pointer-events: none;
    }

    /* Overlay */
    #pgv-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483641;
      background: rgba(0,0,0,.55);
      backdrop-filter: blur(6px);
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: min(12vh, 100px) 16px;
      font-family: var(--pgv-font);
    }
    #pgv-overlay.pgv-open { display: flex; }

    /* Palette */
    #pgv-palette {
      background: var(--pgv-bg);
      border: 1px solid var(--pgv-border);
      border-radius: var(--pgv-radius);
      width: 100%;
      max-width: 540px;
      box-shadow: var(--pgv-shadow);
      overflow: hidden;
      animation: pgSlideIn 150ms ease;
    }
    @keyframes pgSlideIn {
      from { opacity: 0; transform: translateY(10px) scale(.98); }
      to   { opacity: 1; transform: none; }
    }

    /* Input row */
    .pgv-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--pgv-border);
    }
    .pgv-input-row svg { width: 18px; height: 18px; color: var(--pgv-text3); flex-shrink: 0; }
    #pgv-search {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: 15px;
      font-family: var(--pgv-font);
      color: var(--pgv-text);
      caret-color: var(--pgv-accent);
    }
    #pgv-search::placeholder { color: var(--pgv-text3); }
    .pgv-provider-badge {
      font-size: 10px;
      font-family: var(--pgv-mono);
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 6px;
      background: var(--pgv-bg3);
      color: var(--pgv-text3);
      white-space: nowrap;
    }

    /* Manage button */
    #pgv-manage-btn {
      background: none;
      border: none;
      color: var(--pgv-text3);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 16px;
      line-height: 1;
      transition: all 120ms;
      margin-left: 4px;
    }
    #pgv-manage-btn:hover {
      background: var(--pgv-bg3);
      color: var(--pgv-text);
    }

    /* Results */
    #pgv-results {
      max-height: 320px;
      overflow-y: auto;
      padding: 4px;
    }
    #pgv-results::-webkit-scrollbar { width: 5px; }
    #pgv-results::-webkit-scrollbar-thumb { background: var(--pgv-border); border-radius: 3px; }
    .pgv-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .pgv-item:hover, .pgv-item.pgv-sel { background: var(--pgv-bg3); }
    .pgv-item-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: grid;
      place-items: center;
      font-size: 13px;
      flex-shrink: 0;
    }
    .pgv-item-body { flex: 1; min-width: 0; }
    .pgv-item-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--pgv-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pgv-item-cat {
      font-size: 10.5px;
      font-family: var(--pgv-mono);
      color: var(--pgv-text3);
    }
    .pgv-item-action {
      font-size: 10px;
      font-family: var(--pgv-mono);
      color: var(--pgv-text3);
      opacity: 0;
      transition: opacity 120ms;
    }
    .pgv-item:hover .pgv-item-action, .pgv-item.pgv-sel .pgv-item-action { opacity: 1; }
    .pgv-group {
      padding: 10px 12px 4px;
      font-size: 10px;
      font-family: var(--pgv-mono);
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--pgv-accent);
    }
    .pgv-group:first-child { padding-top: 4px; }
    .pgv-pick {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      border: 1px solid var(--pgv-border);
      border-radius: 4px;
      display: grid;
      place-items: center;
      font-size: 11px;
      color: #000;
      cursor: pointer;
    }
    .pgv-picked .pgv-pick { background: var(--pgv-accent); border-color: var(--pgv-accent); }
    .pgv-hints { gap: 12px; flex-wrap: wrap; }
    .pgv-hints span { white-space: nowrap; }
    #pgv-pick-count { margin-left: auto; color: var(--pgv-accent); }
    .pgv-modal-card { font-family: var(--pgv-font); color: var(--pgv-text); }
    .pgv-btn-primary:hover { background: var(--pgv-accent); color: #000; }
    .pgv-empty {
      padding: 24px;
      text-align: center;
      color: var(--pgv-text3);
      font-size: 13px;
    }

    /* Footer hints */
    .pgv-hints {
      padding: 8px 14px;
      border-top: 1px solid var(--pgv-border);
      display: flex;
      gap: 16px;
      font-size: 10.5px;
      font-family: var(--pgv-mono);
      color: var(--pgv-text3);
    }
    .pgv-hints kbd {
      display: inline-block;
      background: var(--pgv-bg3);
      border: 1px solid var(--pgv-border);
      border-radius: 4px;
      padding: 0 4px;
      margin-right: 3px;
      font-size: 10px;
    }

    /* Toast */
    #pgv-toast {
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 2147483642;
      background: var(--pgv-bg2);
      border: 1px solid var(--pgv-border);
      border-radius: 8px;
      padding: 8px 14px;
      font-family: var(--pgv-font);
      font-size: 13px;
      color: var(--pgv-text);
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 6px 20px rgba(0,0,0,.4);
      transform: translateX(200%);
      transition: transform 250ms cubic-bezier(.34,1.56,.64,1);
    }
    #pgv-toast.pgv-show { transform: translateX(0); }
    #pgv-toast svg { width: 14px; height: 14px; color: var(--pgv-accent); }

    /* Manager Modal */
    .pgv-modal {
      position: fixed;
      inset: 0;
      z-index: 2147483643;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .pgv-modal-card {
      background: var(--pgv-bg);
      border: 1px solid var(--pgv-border);
      border-radius: var(--pgv-radius);
      width: 100%;
      max-width: 600px;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--pgv-shadow);
    }
    .pgv-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid var(--pgv-border);
    }
    .pgv-modal-header h3 {
      margin: 0;
      font-weight: 600;
      font-size: 16px;
      color: var(--pgv-text);
    }
    .pgv-modal-close {
      background: none;
      border: none;
      color: var(--pgv-text3);
      font-size: 24px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }
    .pgv-modal-close:hover { color: var(--pgv-text); }
    .pgv-modal-body {
      padding: 16px 18px;
      overflow-y: auto;
      flex: 1;
    }
    .pgv-section-title {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: var(--pgv-text2);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pgv-custom-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--pgv-border);
      border-radius: 8px;
      margin-bottom: 18px;
    }
    .pgv-custom-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--pgv-border);
    }
    .pgv-custom-item:last-child { border-bottom: none; }
    .pgv-custom-info { display: flex; align-items: center; gap: 8px; }
    .pgv-custom-actions button {
      background: none;
      border: none;
      color: var(--pgv-text3);
      cursor: pointer;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .pgv-custom-actions button:hover { background: var(--pgv-bg3); color: var(--pgv-text); }
    .pgv-form-group {
      margin-bottom: 16px;
    }
    .pgv-form-group label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--pgv-text2);
      margin-bottom: 4px;
    }
    .pgv-form-group input, .pgv-form-group textarea, .pgv-form-group select {
      width: 100%;
      background: var(--pgv-bg2);
      border: 1px solid var(--pgv-border);
      border-radius: 6px;
      padding: 8px 10px;
      font-family: var(--pgv-font);
      font-size: 13px;
      color: var(--pgv-text);
      outline: none;
      resize: vertical;
    }
    .pgv-form-group input:focus, .pgv-form-group textarea:focus { border-color: var(--pgv-accent); }
    .pgv-btn {
      background: var(--pgv-bg3);
      border: 1px solid var(--pgv-border);
      border-radius: 6px;
      padding: 6px 12px;
      font-family: var(--pgv-font);
      font-size: 13px;
      color: var(--pgv-text);
      cursor: pointer;
      transition: all 120ms;
    }
    .pgv-btn:hover { background: var(--pgv-bg2); border-color: var(--pgv-accent); }
    .pgv-btn-primary {
      background: var(--pgv-accent);
      border-color: var(--pgv-accent);
      color: #000;
      font-weight: 500;
    }
    .pgv-btn-primary:hover { opacity: 0.9; }
    .pgv-file-input {
      display: block;
      margin-top: 8px;
    }
    .pgv-divider {
      margin: 20px 0;
      border-top: 1px solid var(--pgv-border);
    }
  `;

  GM_addStyle(CSS);

  // ═══════════════════════════════════════════════════════════
  //  CUSTOM PROMPTS (persisted via GM storage)
  // ═══════════════════════════════════════════════════════════
  function getCustomPrompts() {
    try { return JSON.parse(GM_getValue('pg_custom_prompts', '[]')); } catch { return []; }
  }
  function saveCustomPrompts(prompts) {
    GM_setValue('pg_custom_prompts', JSON.stringify(prompts));
  }
  function getAllPrompts() {
    return [...BUILTIN_PROMPTS, ...getCustomPrompts()];
  }

  // ═══════════════════════════════════════════════════════════
  //  DOM CONSTRUCTION
  // ═══════════════════════════════════════════════════════════
  // Trigger button
  const trigger = document.createElement('button');
  trigger.id = 'pgv-trigger';
  trigger.innerHTML = `V<span class="pgv-kbd">⌥V</span>`;
  trigger.title = 'Prompt Genius — Vibe Coding (⌥V / Alt+V)';
  document.body.appendChild(trigger);

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'pgv-overlay';
  overlay.innerHTML = `
    <div id="pgv-palette">
      <div class="pgv-input-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="pgv-search" type="text" placeholder="Search vibe coding prompts — Tab picks several…" autocomplete="off" spellcheck="false">
        <span class="pgv-provider-badge">${provider.name}</span>
        <button id="pgv-manage-btn" title="Manage custom prompts">⚙️</button>
      </div>
      <div id="pgv-results"></div>
      <div class="pgv-hints">
        <span><kbd>↑↓</kbd> navigate</span>
        <span><kbd>Tab</kbd> pick</span>
        <span><kbd>↵</kbd> insert</span>
        <span><kbd>⌘C</kbd> copy</span>
        <span><kbd>Esc</kbd> close</span>
        <span id="pgv-pick-count"></span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Toast
  const toast = document.createElement('div');
  toast.id = 'pgv-toast';
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
  document.body.appendChild(toast);

  const searchInput = document.getElementById('pgv-search');
  const resultsDiv  = document.getElementById('pgv-results');
  const manageBtn   = document.getElementById('pgv-manage-btn');
  let selIndex = 0;
  let currentResults = [];
  const picked = new Set(); // ids picked with Tab, inserted together

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render(query = '') {
    const q = query.toLowerCase().trim();
    const all = getAllPrompts();
    currentResults = q
      // Title hits first, then category, then body text (the long prompts mention almost everything).
      ? all.map(p => ({ p, rank: p.title.toLowerCase().includes(q) ? 0 : p.cat.toLowerCase().includes(q) ? 1
            : p.prompt.toLowerCase().includes(q) ? 2 : -1 }))
          .filter(x => x.rank >= 0).sort((a, b) => a.rank - b.rank).map(x => x.p)
      : all;

    if (!currentResults.length) {
      resultsDiv.innerHTML = `<div class="pgv-empty">No prompts match "${escapeHtml(query)}"</div>`;
      return;
    }

    // Group headers only on the unfiltered list. Headers are not .pgv-item, so selIndex is unaffected.
    let lastCat = null;
    resultsDiv.innerHTML = currentResults.map((p, i) => {
      const head = !q && p.cat !== lastCat ? `<div class="pgv-group">${escapeHtml(GROUP_LABELS[p.cat] || p.cat)}</div>` : '';
      lastCat = p.cat;
      return head + `
      <div class="pgv-item${i === selIndex ? ' pgv-sel' : ''}${picked.has(p.id) ? ' pgv-picked' : ''}" data-i="${i}">
        <span class="pgv-pick" title="Pick (Tab)">${picked.has(p.id) ? '✓' : ''}</span>
        <div class="pgv-item-icon" style="background:${escapeHtml(p.color)}1a;color:${escapeHtml(p.color)}">${escapeHtml(p.icon)}</div>
        <div class="pgv-item-body">
          <div class="pgv-item-title">${highlight(p.title, q)}</div>
          <div class="pgv-item-cat">${escapeHtml(p.cat)}</div>
        </div>
        <span class="pgv-item-action">↵ insert</span>
      </div>
    `;
    }).join('');
    document.getElementById('pgv-pick-count').textContent = picked.size ? `${picked.size} picked · ↵ inserts all` : '';

    resultsDiv.querySelectorAll('.pgv-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const i = parseInt(el.dataset.i);
        if (picked.size || e.target.closest('.pgv-pick')) { togglePick(i); render(searchInput.value); }
        else insertPrompt(i);
      });
      el.addEventListener('mouseenter', () => {
        selIndex = parseInt(el.dataset.i);
        updateSel();
      });
    });
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + `<mark style="background:var(--pgv-accent);color:#000;border-radius:2px;padding:0 1px">${escapeHtml(text.slice(idx, idx + q.length))}</mark>` + escapeHtml(text.slice(idx + q.length));
  }

  function updateSel() {
    resultsDiv.querySelectorAll('.pgv-item').forEach((el, i) => {
      el.classList.toggle('pgv-sel', i === selIndex);
      if (i === selIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  TEXT INJECTION — multi-provider support
  // ═══════════════════════════════════════════════════════════
  // An element is only worth typing into if it is enabled, writable and actually
  // rendered. Google Labs (Flow) keeps hidden textareas in the DOM, and picking
  // the first match in document order lands in one of those instead of the prompt box.
  function isUsableInput(el) {
    if (!el || el.disabled || el.readOnly) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findInput() {
    // provider.sel is a comma-separated list in priority order; querySelector would
    // resolve it in document order instead, so walk the selectors one at a time.
    const selectors = provider.sel.split(',').map(s => s.trim()).filter(Boolean)
      .concat(['textarea', 'div[contenteditable="true"]', '[role="textbox"]']);
    let fallback = null;
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (isUsableInput(el)) return el;
        if (!fallback) fallback = el;
      }
    }
    return fallback;
  }

  function injectText(text) {
    const el = findInput();
    if (!el) { showToast('⚠ Could not find chat input'); return false; }

    el.focus();

    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
                        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (nativeSetter) nativeSetter.call(el, text);
      else el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      el.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      });
      const handled = !el.dispatchEvent(pasteEvent);
      if (!handled) {
        el.textContent = text;
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      }
    }

    try {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {}

    return true;
  }

  // ═══════════════════════════════════════════════════════════
  //  ACTIONS
  // ═══════════════════════════════════════════════════════════
  // Picked prompts keep the list order, not the order they were picked in.
  function targetPrompts(index) {
    if (picked.size) return getAllPrompts().filter(p => picked.has(p.id));
    return currentResults[index] ? [currentResults[index]] : [];
  }
  const label = ps => ps.length > 1 ? `${ps.length} prompts` : `"${ps[0].title}"`;

  function insertPrompt(index) {
    const ps = targetPrompts(index);
    if (!ps.length) return;
    closePalette();
    setTimeout(() => {
      if (injectText(fullText(ps))) {
        picked.clear();
        showToast(`Inserted ${label(ps)}`);
      }
    }, 80);
  }

  function copyPrompt(index) {
    const ps = targetPrompts(index);
    if (!ps.length) return;
    navigator.clipboard.writeText(fullText(ps)).then(() => showToast(`Copied ${label(ps)}`));
  }

  function togglePick(index) {
    const p = currentResults[index];
    if (!p) return;
    if (picked.has(p.id)) picked.delete(p.id); else picked.add(p.id);
  }

  function showToast(msg) {
    toast.querySelector('span').textContent = msg;
    toast.classList.add('pgv-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('pgv-show'), 2200);
  }

  // ═══════════════════════════════════════════════════════════
  //  OPEN / CLOSE
  // ═══════════════════════════════════════════════════════════
  function openPalette() {
    selIndex = 0;
    picked.clear();
    searchInput.value = '';
    render();
    overlay.classList.add('pgv-open');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closePalette() {
    overlay.classList.remove('pgv-open');
  }

  function togglePalette() {
    overlay.classList.contains('pgv-open') ? closePalette() : openPalette();
  }

  // ═══════════════════════════════════════════════════════════
  //  CUSTOM PROMPT MANAGER (NEW FEATURE)
  // ═══════════════════════════════════════════════════════════
  let managerModal = null;

  function openManager() {
    if (managerModal) managerModal.remove();

    const customPrompts = getCustomPrompts();

    const modal = document.createElement('div');
    modal.className = 'pgv-modal';
    modal.innerHTML = `
      <div class="pgv-modal-card">
        <div class="pgv-modal-header">
          <h3>⚙️ Manage Custom Prompts</h3>
          <button class="pgv-modal-close">&times;</button>
        </div>
        <div class="pgv-modal-body">
          <div class="pgv-section-title">Your Custom Prompts</div>
          <div class="pgv-custom-list" id="pgv-custom-list"></div>

          <div class="pgv-section-title">Add New Prompt</div>
          <div class="pgv-form-group">
            <label>Title</label>
            <input type="text" id="pgv-new-title" placeholder="e.g., My Prompt" maxlength="50">
          </div>
          <div class="pgv-form-group">
            <label>Category</label>
            <input type="text" id="pgv-new-cat" placeholder="e.g., Custom" value="Custom">
          </div>
          <div class="pgv-form-group">
            <label>Icon (emoji)</label>
            <input type="text" id="pgv-new-icon" placeholder="📌" maxlength="2" value="📌">
          </div>
          <div class="pgv-form-group">
            <label>Color (hex)</label>
            <input type="text" id="pgv-new-color" placeholder="#c8ff00" value="#c8ff00">
          </div>
          <div class="pgv-form-group">
            <label>Prompt Text</label>
            <textarea id="pgv-new-prompt" rows="5" placeholder="Your prompt content..."></textarea>
          </div>
          <button class="pgv-btn pgv-btn-primary" id="pgv-add-prompt">Add Prompt</button>

          <div class="pgv-divider"></div>

          <div class="pgv-section-title">Import / Export</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="pgv-btn" id="pgv-export-json">Export as JSON</button>
            <label class="pgv-btn" style="cursor:pointer;">
              Import from File
              <input type="file" id="pgv-import-file" accept=".txt,.md,.json,.csv,text/plain,application/json,text/csv" style="display:none;">
            </label>
          </div>
          <p style="font-size:11px; color:var(--pgv-text3); margin-top:10px;">
            Supported: .txt, .md, .json, .csv. <br>
            JSON: array of prompt objects. CSV: columns "title,category,icon,color,prompt".<br>
            Plain text files become a single prompt with filename as title.<br>
            <strong>Note:</strong> .docx is not supported.
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    managerModal = modal;

    const closeBtn = modal.querySelector('.pgv-modal-close');
    const listDiv = modal.querySelector('#pgv-custom-list');
    const addBtn = modal.querySelector('#pgv-add-prompt');
    const exportBtn = modal.querySelector('#pgv-export-json');
    const fileInput = modal.querySelector('#pgv-import-file');

    function renderCustomList() {
      const prompts = getCustomPrompts();
      if (prompts.length === 0) {
        listDiv.innerHTML = `<div class="pgv-empty" style="padding:16px;">No custom prompts yet.</div>`;
        return;
      }
      listDiv.innerHTML = prompts.map((p, idx) => `
        <div class="pgv-custom-item">
          <div class="pgv-custom-info">
            <span style="font-size:18px;">${escapeHtml(p.icon)}</span>
            <span style="font-weight:500;">${escapeHtml(p.title)}</span>
            <span style="font-size:11px;color:var(--pgv-text3);">${escapeHtml(p.cat)}</span>
          </div>
          <div class="pgv-custom-actions">
            <button class="pgv-delete-btn" data-idx="${idx}" title="Delete">🗑️</button>
          </div>
        </div>
      `).join('');
      listDiv.querySelectorAll('.pgv-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          const prompts = getCustomPrompts();
          prompts.splice(idx, 1);
          saveCustomPrompts(prompts);
          renderCustomList();
          render(searchInput.value); // refresh main palette
          showToast('Prompt deleted');
        });
      });
    }
    renderCustomList();

    // Add prompt
    addBtn.addEventListener('click', () => {
      const title = modal.querySelector('#pgv-new-title').value.trim();
      const cat = modal.querySelector('#pgv-new-cat').value.trim() || 'Custom';
      const icon = modal.querySelector('#pgv-new-icon').value.trim() || '📌';
      const color = modal.querySelector('#pgv-new-color').value.trim() || '#c8ff00';
      const promptText = modal.querySelector('#pgv-new-prompt').value.trim();

      if (!title || !promptText) {
        alert('Title and prompt text are required.');
        return;
      }

      const newPrompt = {
        id: 'custom-' + Date.now(),
        title,
        cat,
        icon,
        color,
        prompt: promptText
      };

      const prompts = getCustomPrompts();
      prompts.push(newPrompt);
      saveCustomPrompts(prompts);
      renderCustomList();
      render(searchInput.value);
      showToast(`✓ Added "${title}"`);

      // Clear form
      modal.querySelector('#pgv-new-title').value = '';
      modal.querySelector('#pgv-new-prompt').value = '';
      modal.querySelector('#pgv-new-cat').value = 'Custom';
      modal.querySelector('#pgv-new-icon').value = '📌';
      modal.querySelector('#pgv-new-color').value = '#c8ff00';
    });

    // Export JSON
    exportBtn.addEventListener('click', () => {
      const prompts = getCustomPrompts();
      const json = JSON.stringify(prompts, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prompt-genius-custom.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported custom prompts');
    });

    // Import file
    fileInput.addEventListener('change', (e) => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        const ext = file.name.split('.').pop().toLowerCase();
        let imported = [];

        try {
          if (ext === 'json') {
            imported = JSON.parse(content);
          } else if (ext === 'csv') {
            // Simple CSV parser (assumes header row)
            const lines = content.split(/\r?\n/).filter(l => l.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const obj = {};
              headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
              if (obj.title && obj.prompt) {
                imported.push({
                  id: 'custom-csv-' + Date.now() + i,
                  title: obj.title,
                  cat: obj.category || obj.cat || 'Custom',
                  icon: obj.icon || '📄',
                  color: obj.color || '#c8ff00',
                  prompt: obj.prompt
                });
              }
            }
          } else {
            // Plain text / markdown -> single prompt
            const title = file.name.replace(/\.[^/.]+$/, '');
            imported.push({
              id: 'custom-file-' + Date.now(),
              title: title || 'Imported Prompt',
              cat: 'Imported',
              icon: '📄',
              color: '#c8ff00',
              prompt: content
            });
          }

          if (Array.isArray(imported) && imported.length) {
            const existing = getCustomPrompts();
            const merged = existing.concat(imported);
            saveCustomPrompts(merged);
            renderCustomList();
            render(searchInput.value);
            showToast(`Imported ${imported.length} prompt(s)`);
          } else {
            alert('No valid prompts found in file.');
          }
        } catch (err) {
          alert('Failed to parse file: ' + err.message);
        }
        fileInput.value = ''; // allow re-upload same file
      };
      reader.readAsText(file);
    });

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeManager();
    });
    closeBtn.addEventListener('click', closeManager);
    document.addEventListener('keydown', handleManagerKey);
  }

  function closeManager() {
    if (managerModal) {
      managerModal.remove();
      managerModal = null;
      document.removeEventListener('keydown', handleManagerKey);
    }
  }

  function handleManagerKey(e) {
    if (e.key === 'Escape' && managerModal) {
      e.preventDefault();
      closeManager();
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════
  trigger.addEventListener('click', togglePalette);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePalette();
  });

  manageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePalette(); // close palette before opening manager
    openManager();
  });

  searchInput.addEventListener('input', () => {
    selIndex = 0;
    render(searchInput.value);
  });

  // Global keyboard
  document.addEventListener('keydown', e => {
    // ⌥V / Alt+V. On macOS Option+V types "√", so match the physical key.
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.code === 'KeyV') {
      e.preventDefault();
      e.stopPropagation();
      togglePalette();
      return;
    }

    // Inside palette
    if (!overlay.classList.contains('pgv-open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selIndex = Math.min(selIndex + 1, currentResults.length - 1);
      updateSel();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selIndex = Math.max(selIndex - 1, 0);
      updateSel();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      togglePick(selIndex);
      selIndex = e.shiftKey ? Math.max(selIndex - 1, 0) : Math.min(selIndex + 1, currentResults.length - 1);
      render(searchInput.value);
      updateSel();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      insertPrompt(selIndex);
      return;
    }

    // ⌘C / Ctrl+C when nothing selected in text
    if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection().toString()) {
      e.preventDefault();
      copyPrompt(selIndex);
    }
  }, true);

  // ═══════════════════════════════════════════════════════════
  //  INITIAL STATE
  // ═══════════════════════════════════════════════════════════
  console.log(`[Prompt Genius — Vibe Coding] Loaded for ${provider.name} — ⌥V / Alt+V to open`);

})();
