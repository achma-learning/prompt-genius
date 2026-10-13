# all_prompts — your prompt library

The **General** userscript (`userscripts/general.user.js`) can load every prompt in this folder, from your own fork. You keep your prompts in GitHub, and they show up on every AI site.

1. [Fork this repository](https://github.com/achma-learning/prompt-genius/fork).
2. Add, edit or delete files in **your fork's** `all_prompts/` folder.
3. On any AI site, press `Ctrl+Shift+P` → ⚙️ → **GitHub prompts…**, then enter `your-name/prompt-genius`. You can also paste this folder's URL. The same window opens once by itself after you install the script.

## File formats

| File | Becomes |
|---|---|
| `something.md` / `.txt` / no extension | one prompt. The title is the first `# heading`, or else the file name. |
| `something.json` | one prompt object, or a list of them: `{"title": "…", "cat": "…", "icon": "🧠", "color": "#4d9fff", "prompt": "…"}` (the same shape the ⚙️ Export produces) |
| `sub-folder/…` | the sub-folder's name is used as the category |

Skipped: `README` files (like this one), images and other binary files, and files over 200 KB. At most 150 files are loaded.

The script only reads from GitHub. It refreshes at most every 6 hours (GitHub allows 60 unauthenticated requests per hour). Click **Load my prompts** to refresh right away. The repository must be public.
