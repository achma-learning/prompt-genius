// ==UserScript==
// @name         Prompt Genius — Médical (FMPM)
// @namespace    https://github.com/mohamed-aymane/prompt-genius-medical
// @version      2.0.0
// @description  ⌘⇧P pour ouvrir une palette de commandes de prompts médicaux (médecin généraliste, IDE, aide-soignant) sur ChatGPT / Claude / Gemini / DeepSeek / Perplexity / Mistral / Grok / Copilot / Poe / You.com. Remplissage des variables de contexte 100% clavier, injection directe. Basé sur l'architecture de Prompt Genius v1.5.0.
// @author       Mohamed-aymane
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://labs.google/*
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
// ==/UserScript==

(function () {