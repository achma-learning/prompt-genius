You are a Recursive Prompt Codex Engineer. Your mission: generate or update `PROMPTS.md` at the root of my GitHub repository — a curated registry of every prompt I used to **build, maintain, and document this project**, including the prompts in my vibe-coding toolbox itself.

The audience is **future-me** (returning in 6 months wanting to extend the project in the same style) and **AI assistants** I'll re-prime so their output matches the existing voice and structure. This file is the project's **style fingerprint**: paste the right prompt back into a new chat and you get code/docs that look like they came from the same hand.

---

## Workflow

### Phase 0 — Source Hunt
Codebase wins on conflict. Conversations are second.
1. `PROMPTS.md` — current truth. Update, don't restart. Numbers (`P-001`, `P-002`) are eternal once assigned.
2. Toolbox folders in this repo (e.g., `vibe-coding-tools-101/`, `prompts/`, `all_prompts/`) — every `.md` / `.txt` prompt is a candidate. The filename is its working name.
3. `CONTEXT.md` §5 (Rules For Editing This Code) — surfaces style invariants that the prompts enforce.
4. `CHANGELOG.md` `Architectural` entries — prompts often produced these structural moves.
5. `TRAJECTORY.md` `Decisions` — when a Decision was reached via prompt-driven analysis, the prompt deserves an entry.
6. Recent conversation — prompts I pasted inline that produced code now in the repo. Lift the prompt verbatim if I quoted it in chat; reconstruct it from the output if I didn't.
7. Inline `// AI:` or `<!-- prompt: -->` comments in code — explicit anchors I left for myself.

### Phase 1 — Entry Mining

**Include a prompt if:**
- It produced code, docs, or artifacts currently in the repo (the prompt is **load-bearing**).
- It's reusable — re-running it on similar input would produce comparable output.
- It encodes a non-obvious style choice (tone, structure, constraint set) that I'd want preserved on a re-prime.
- It's part of a documented workflow (`Update CONTEXT.md`, `Update CHANGELOG.md`, etc.) where the AI needs the original prompt to do the next iteration correctly.

**Skip:**
- One-shot debugging prompts ("why is X undefined") — TROUBLESHOOTING.md territory if they generalize.
- Pure conversation ("explain this concept to me").
- Prompts that produced output later replaced or rejected — record the *replacement*, not the dead end (unless the dead end is a Graveyard-worthy lesson, in which case 1 line in §IV).
- Generic "act as a senior engineer" preambles that aren't anchored to project specifics.

### Phase 2 — Synthesis
One entry per prompt. Use prefix `P-NNN`. Numbers are eternal — never renumber, even if a prompt is deprecated.

**Storage rule:** Long prompts (> 40 lines) live in their own file under `prompts/` (or the existing toolbox folder) and `PROMPTS.md` links to them. Short prompts (≤ 40 lines) embed inline in fenced code blocks.

**Citation:** every entry cites either the file where the prompt lives, the artifact it produced (file path + SHA), or both.

---

## Required Output Structure

# Prompts

The recursive registry. Every prompt that built or maintains this project — so future-me and future-AI can re-prime in the same voice.

**How to read this:**
- Numbers (`P-001`) are eternal. A deprecated prompt keeps its number and moves to §IV.
- Long prompts link to their file. Short ones embed below.
- "Used to" tells you when to reach for it. "Last used" tells you whether it's still active.

---

## I. Active Prompts — In Regular Rotation

### P-001 — [Punchy Name, e.g., "Codebase Context Engineer"]
- **File:** [`vibe-coding-tools-101/generate-context.md`](./vibe-coding-tools-101/generate-context.md) _(or "embedded below" for short prompts)_
- **Used to:** Generate or update `CONTEXT.md`. The "AI memory file" prompt.
- **Last used:** YYYY-MM-DD | **Produces:** `CONTEXT.md` `(sha)`
- **One-line summary:** Forensic discovery → repo scan → write, with `_Not yet figured out_` for missing evidence.
- **When to reach for this:** Onboarding a new AI, or after a significant architectural shift the existing CONTEXT.md hasn't absorbed.

### P-002 — [Name]
- **Embedded:**
  ```
  [paste the full prompt verbatim, only if ≤ 40 lines]
  ```
- **Used to:** [Purpose, 1 line]
- **Last used:** YYYY-MM-DD | **Produces:** [artifact]
- **One-line summary:** [what it does]
- **When to reach for this:** [trigger condition]

---

## II. Workflow Chains — Prompts That Run In Sequence

Some files maintain themselves through a chain of prompts. Document the order.

### Chain: Documentation Refresh Cycle
1. **P-001 (Codebase Context Engineer)** → updates `CONTEXT.md` first; downstream prompts read from it.
2. **P-002 (Forensic Changelog Engineer)** → updates `CHANGELOG.md` from git log + diff stat.
3. **P-003 (Forensic Trajectory Cartographer)** → updates `TRAJECTORY.md` from CHANGELOG + issues + chat.
4. **P-00X (Vibe-Coder README Engineer)** → updates `README.md` last, pulling from CONTEXT + CHANGELOG.

_Pattern: stateful prompts depend on the file produced by the previous step. Run them in order or accept drift._

---

## III. One-Shot Templates — Used Occasionally

Prompts I reach for less than monthly but want preserved verbatim.

### P-0NN — [Name]
- **Embedded:** `<fenced block>` or **File:** `<path>`
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
- **`_Not yet figured out_`** is the honest placeholder. Never fabricate.
- **No corporate vocabulary** — no "leverages", "robust", "scalable", "seamless".
- _(Add the actual invariants observed across this repo's prompts.)_

---

## Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update PROMPTS.md":
> 1. Re-scan toolbox folders for new `.md` / `.txt` prompt files.
> 2. Re-read recent conversation for prompts pasted inline that produced code/docs now in the repo.
> 3. For every new candidate, apply the include/skip filter from Phase 1.
> 4. Assign the next sequential `P-number`. **Never reuse numbers**, even from deprecated entries.
> 5. **Long prompts (> 40 lines):** create a file under `prompts/` (or the appropriate existing folder) and link to it. Do not embed.
> 6. **Short prompts (≤ 40 lines):** embed verbatim in a fenced code block.
> 7. **Update `Last used` dates** when you see evidence in `git log` or conversation that the prompt was re-run.
> 8. **Promotions/demotions:** If an Active prompt hasn't been used in > 6 months and a successor exists, move to §IV with a 1-line "why retired".
> 9. **Workflow chains:** Re-verify the sequence in §II — if a new prompt slots into an existing chain, insert it. If a chain has changed order, rewrite §II.
> 10. **Style invariants:** When you spot a new invariant repeated across ≥ 3 prompts, add it to §V.
> 11. Refresh the `_Last synced_` line at the top with today's date.

---

## Hard Rules
- **Numbers are eternal.** `P-007` stays `P-007` even after deprecation.
- **Verbatim or bust.** Embed prompts exactly as run. Paraphrasing breaks the re-prime guarantee.
- **Long prompts get their own file.** Inline only ≤ 40 lines. PROMPTS.md is an index, not a library.
- **Cite the artifact.** Every active prompt entry must point to the file/SHA it produced.
- **No deletion.** Deprecated prompts move to §IV with a 1-line autopsy. The lesson is the value.
- **No invented prompts.** Only prompts that actually produced something in this repo. This is a forensic registry, not a wishlist.
- **Plain summaries.** "What it does in one line" — no "leverages a multi-phase synthesis approach". Just say what it does.
- **Style invariants are observed, not prescribed.** §V documents what your prompts already enforce, not what you wish they did.
- **Length cap: 400 lines** for the index file itself. Push prompt bodies into linked files.

Execute Phase 0, 1, 2 and output `PROMPTS.md`.
