# Language Translation Tool

A simple web-based translation tool I built as my first project during my CodeAlpha internship. You type text, pick a language, hit translate — that's pretty much it.

---

## What it does

- Translates text between 100+ languages using Google Translate
- Can auto-detect what language you're typing in
- Lets you swap source and target languages with one click
- Shows a live character count as you type
- Has a copy button for the translated output
- Works on mobile too

Keyboard shortcut: `Ctrl + Enter` (or `Cmd + Enter` on Mac) to translate without clicking the button.

---

## How to run it

No setup needed. Just open `index.html` in your browser and it works.

If you're using VS Code, the Live Server extension is the easiest way to run it locally.

> One thing to note — the CSS file is linked as `../Design/style.css` in the HTML. Make sure your folder structure matches that, or just update the path to wherever your `style.css` actually lives.

---

## Files

- `index.html` — the page layout
- `app.js` — all the logic (language list, translation, button actions)
- `style.css` — styling and responsive layout

---

## How translation works

It uses Google Translate's free public endpoint — no API key needed. You send the text and language codes in the URL, and it returns the translation. Simple enough for a project like this, though it's not meant for heavy production use.

---

## Built with

Plain HTML, CSS, and JavaScript. No frameworks, no dependencies.

---

Made by **Tushar Suhagpure** — CodeAlpha Internship, Project 1
GitHub: [@Tushar2006a](https://github.com/Tushar2006a)
