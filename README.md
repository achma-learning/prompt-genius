# Prompt Genius

> Press `Ctrl+Shift+P` on ChatGPT, Claude, Gemini (and 9 other AI sites) and paste any of your saved prompts in two keystrokes.

![The Prompt Genius palette open on a chat page, filtered to the Vibe Coding prompts](./docs/palette.png)

## What it is

A userscript: a small piece of JavaScript your browser runs on the AI chat sites you visit. It adds a search box on top of the chat. Type a few letters, press Enter, and the full prompt lands in the chat input, ready to send.

It ships with 22 prompts I actually use (thinking coaches, the Feynman technique, photo restoration for Google Labs Flow, and six "vibe coding" prompts that write your repo's docs for you). You can add your own, and they stay in your browser. It's one file with no account, no server, no tracking, and nothing to build.

## Install (step by step, no coding needed)

You do this once. It takes about 3 minutes.

### 1. Install a userscript manager

A userscript manager is a browser extension that runs userscripts. Pick one:

| Browser | Extension |
|---|---|
| Chrome / Brave / Edge / Opera | [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) |
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
| Safari | [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |

Click **Add to browser** and accept.

### 2. Let the extension run scripts (Chrome, Edge, Brave and Opera only)

Chrome-based browsers block userscripts until you allow them. Do both steps below; they're harmless:

1. **Turn on Developer mode.** Paste `chrome://extensions` in the address bar (`edge://extensions` on Edge) and press Enter. Switch on **Developer mode** in the top-right corner.
2. **Allow user scripts.** On the same page, find Tampermonkey (or Violentmonkey) and click **Details**. Switch on **Allow User Scripts**. Recent Chrome versions (138+) need this; if you don't see the switch, step 1 is enough.

Firefox and Safari users can skip this step.

### 3. Install Prompt Genius

Click one of these links. Your userscript manager opens a page with an **Install** button. Click it.

- **[Install from Greasy Fork](https://update.greasyfork.org/scripts/571159/Prompt%20Genius%20%E2%80%94%20AI%20Prompt%20Injector.user.js)** (recommended, auto-updates)
- [Install from GitHub](https://github.com/achma-learning/prompt-genius/raw/refs/heads/main/Prompt%20generator.user.js) (same file)

### 4. Check it works

Open [chatgpt.com](https://chatgpt.com) (or reload it if it was already open). A small **P** button should appear in the bottom-right corner. If it doesn't, go back to step 2.

## Usage

1. On any supported site, press **`Ctrl+Shift+P`** (Mac: **`⌘⇧P`**), or click the **P** button in the bottom-right corner.
2. Type to search, e.g. `feynman`.
3. Press **Enter**. The whole prompt appears in the chat box. Add your topic and send.

| Key | Does |
|---|---|
| `↑` `↓` | move through the list |
| `Enter` | insert the prompt into the chat |
| `Ctrl+C` / `⌘C` | copy the prompt instead |
| `Esc` | close |

**Your own prompts:** open the palette and click ⚙️. You can add a prompt, delete one, or import a `.json`, `.csv`, `.txt` or `.md` file. Export saves everything to a JSON file for backup.

If `Ctrl+Shift+P` does something else in your browser (on Firefox it opens a private window), just click the **P** button.

**Works on:** ChatGPT, Claude, Gemini, Google Labs (Flow, Whisk, ImageFX), DeepSeek, Perplexity, Mistral, Grok, Copilot, You.com, Poe.

## No install? Just copy

Download [`index.html`](./index.html) and open it in any browser. It's the same prompt library as a web page. Press `Ctrl+K` to search, and click the copy icon on any card.

The **Vibe Coding 101** section at the top has six prompts, in order, each with a one-click copy button. Paste them into your AI coding assistant (Claude Code, Cursor, Copilot…) with your repo open, and each one writes one file:

1. `CONTEXT.md`: what the project is, for the next AI that opens it
2. `CHANGELOG.md`: what changed and why, decoded from your git history
3. `TRAJECTORY.md`: decisions taken, ideas killed, so AI stops re-suggesting them
4. `README.md`: the page you're reading (made with prompt #4)
5. `TROUBLESHOOTING.md`: every bug you already fixed, searchable by its exact error message
6. `PROMPTS.md`: the prompts that built the repo

The full-length versions live in [`vibe-coding-tools-101/`](./vibe-coding-tools-101).

## What's new

**v1.5.0** adds four photo-restoration prompts for Google Labs Flow (B&W repair, colorize, revive faded color, max-res upscale), plus Google Labs support. The landing page now has the Vibe Coding 101 section. [Full changelog →](./CHANGELOG.md)

## Also in this repo

- [`prompt med.js`](./prompt%20med.js) is a separate userscript in French with 226 medical and paramedical prompts. It uses the same `Ctrl+Shift+P` palette. Its filename doesn't end in `.user.js`, so the one-click install won't trigger. Instead, open Tampermonkey's dashboard, click **+** (new script), paste the file's contents and save.
- [`all_prompts/`](./all_prompts) holds older prompts in plain text, waiting to be promoted into the palette.

## Why I built this

I take prompts I find useful and keep a backup copy here. Then I kept forgetting where I'd put them and retyping them from memory, so I made them one shortcut away on whatever AI site I'm using.

Good place to find more prompts:
[My top 10 most popular ChatGPT prompts (2M+ views)](https://old.reddit.com/r/ChatGPTPromptGenius/comments/1kfzq6c/my_top_10_most_popular_chatgpt_prompts_2m_views/).

## License

MIT. See [`LICENSE`](./LICENSE).

## See also

- [`CONTEXT.md`](./CONTEXT.md) is for AI assistants joining the project
- [`CHANGELOG.md`](./CHANGELOG.md) lists what shipped when
