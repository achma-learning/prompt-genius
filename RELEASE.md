# Releases

What users can install, now and before. History of every change: [`CHANGELOG.md`](./CHANGELOG.md). All releases: [GitHub Releases](https://github.com/achma-learning/prompt-genius/releases). Made with the RELEASE prompt ([`vibe-coding-tools-101/generate-release.md`](./vibe-coding-tools-101/generate-release.md)).

> **Draft.** No tag or GitHub Release exists yet. The tags below are the plan; the pinned links work once the tags are pushed.

## Tracks
Three userscripts, each with its own version and tag prefix. **General** (`userscripts/general.user.js`) is not released yet.

| Track | File | Users get it from | Tag prefix |
|---|---|---|---|
| Original | `Prompt generator.user.js` | [Greasy Fork #571159](https://greasyfork.org/scripts/571159) | `original-v` |
| Medical | `userscripts/medical.user.js` (was `prompt-med.user.js`, and `prompt med.js` before it) | GitHub raw `main` | `medical-v` |
| Vibe Coding | `userscripts/vibe-coding.user.js` | GitHub raw `main` | `vibe-v` |

## Current versions
| Track | Version | Tag | Date | Install latest | Install exactly this version |
|---|---|---|---|---|---|
| Original | v1.5.0 | `original-v1.5.0` | 2026-08-24 | [Greasy Fork](https://update.greasyfork.org/scripts/571159/Prompt%20Genius%20%E2%80%94%20AI%20Prompt%20Injector.user.js) | [v1.5.0](https://github.com/achma-learning/prompt-genius/raw/original-v1.5.0/Prompt%20generator.user.js) |
| Medical | v3.1.0 | `medical-v3.1.0` | 2026-10-12 | [main](https://github.com/achma-learning/prompt-genius/raw/refs/heads/main/userscripts/medical.user.js) | [v3.1.0](https://github.com/achma-learning/prompt-genius/raw/medical-v3.1.0/prompt-med.user.js) |
| Vibe Coding | v1.2.0 | `vibe-v1.2.0` | _on release_ | [main](https://github.com/achma-learning/prompt-genius/raw/refs/heads/main/userscripts/vibe-coding.user.js) | [v1.2.0](https://github.com/achma-learning/prompt-genius/raw/vibe-v1.2.0/userscripts/vibe-coding.user.js) |

Pinned link format: `https://github.com/achma-learning/prompt-genius/raw/<tag>/<path>`, where `<path>` is the file's path **at that tag** (spaces as `%20`).

## Roll back a user
⚠️ **Landmine:** a pinned copy still has its `@updateURL` pointing at `main` (or Greasy Fork). The userscript manager sees a higher `@version` there and **silently updates it back**. So:
1. Install the "exactly this version" link of the version you want. It replaces the current copy (same `@name`/`@namespace`), and saved prompts and settings stay.
2. Turn off updates for that script:
   - **Tampermonkey:** Dashboard → the script → **Settings** tab → untick **Check for updates**.
   - **Violentmonkey:** Dashboard → the script's ⚙️ → untick **Allow update**.
3. To come back later: install the "Install latest" link, then turn updates back on.

Older copies differ: Original v1.0.0 and Medical v2.0.0 / v3.0.0 have no `@updateURL` at all. Medical v3.1.0 at its tag points at `main/prompt-med.user.js`, which no longer exists, so it never updates until the latest link is reinstalled.

## Original script and Greasy Fork
- Users install and update it from **Greasy Fork**: since `b03f1f5` its `@downloadURL`/`@updateURL` point there. The GitHub Release is the archive plus the notes.
- **Is Greasy Fork synced from GitHub?** _Not yet figured out._ What was checked on 2026-10-13:
  - Greasy Fork serves v1.5.0, 105 274 bytes, identical to `main` except the two URL lines, which Greasy Fork rewrites itself.
  - Its `code_updated_at` is 2026-10-13 02:15 UTC, about 4 h after PR #9 reached `main` (2026-10-12 22:25 UTC). That fits a periodic URL sync or a manual upload; a webhook would usually be within minutes.
  - Nothing in the repo shows a webhook (no `.github/`); repo webhooks are only visible to an admin.
  - To settle it: Greasy Fork → script 571159 → **Admin** (sync section), and GitHub → Settings → **Webhooks**.

## Release checklist
- [ ] `for f in userscripts/*.user.js "Prompt generator.user.js"; do node --check "$f"; done` passes.
- [ ] Vibe Coding release: `node scripts/sync-vibe-prompts.js` ran and `git status` shows nothing new.
- [ ] `@version` bumped in the shipped file; `@name`/`@namespace` untouched (CONTEXT §5).
- [ ] CHANGELOG: `[Unreleased]` entries moved under `## [<track> vX.Y.Z] — date`.
- [ ] Work merged to `main` first, so the tag points at a commit on `main`.
- [ ] `git tag -a <tag> <sha> -m "<Track> vX.Y.Z"` → `git push origin <tag>`.
- [ ] `gh release create <tag> <file> --title … --notes-file …` (REST fallback in cloud sessions: `gh api repos/achma-learning/prompt-genius/releases`). GitHub turns spaces in asset names into dots.
- [ ] CHANGELOG heading marked `tag <tag> (<sha>) ✅ known good`; this file updated.
- [ ] Original only: check Greasy Fork shows the new version.

## Release history
Newest first. **Planned** — nothing is tagged yet. Historic versions get tags only; GitHub Releases go to the current version of each track.

| Date | Tag | Commit | Path at that tag | Release? |
|---|---|---|---|---|
| _on release_ | `vibe-v1.2.0` | _merge of the Keep a Changelog PR_ | `userscripts/vibe-coding.user.js` | ✅ |
| 2026-10-13 | `vibe-v1.1.0` | `c261733` | `userscripts/vibe-coding.user.js` | tag only |
| 2026-10-13 | `vibe-v1.0.0` | `6550c38` | `userscripts/vibe-coding.user.js` | tag only |
| 2026-10-12 | `medical-v3.1.0` | `1c2efb7` | `prompt-med.user.js` | ✅ |
| 2026-09-24 | `medical-v3.0.0` | `befa51d` | `prompt med.js` | tag only |
| 2026-09-24 | `medical-v2.0.0` | `4ebd082` | `prompt med.js` | tag only |
| 2026-08-24 | `original-v1.5.0` | `57bd046` | `Prompt generator.user.js` | ✅ |
| 2026-04-27 | `original-v1.4.0` | `1a66963` | `Prompt generator.user.js` | tag only |
| 2026-04-13 | `original-v1.3.0` | `7a5fa11` | `Prompt generator.user.js` | tag only |
| 2026-04-12 | `original-v1.2.0` | `34c361b` | `Prompt generator.user.js` | tag only |
| 2026-04-12 | `original-v1.1.0` | `8c7063e` | `Prompt generator.user.js` | tag only |
| 2026-03-26 | `original-v1.0.0` | `34a7a31` | `Prompt generator.user.js` | tag only |

Same version, later commits: `original-v1.5.0` → `b03f1f5` changed only the update URLs; `medical-v3.1.0` → `6550c38` only moved the file and its URLs; `vibe-v1.0.0` → the 30-prompt first draft, replaced by the 13-prompt version (`2ee8de9`) without a bump. `medical-v2.0.0` is a header-only stub that never ran (`SyntaxError: Unexpected end of input`): tagged so every version has one, never marked ✅.
