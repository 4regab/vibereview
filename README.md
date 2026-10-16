# vibe reviewer

A quiz site for reviewing **Research** and **SIA** (Systems Integration & Architecture) terms. Ming, the study cat, reads you a definition and you pick the matching term.

**Live site:** https://4regab.github.io/vibereview/

## How it works

- **Rounds of 10.** Each subject has a question bank: 138 Research terms and 293 SIA terms. Every round takes the next 10 terms from the bank.
- **Wrong? Try again.** A wrong pick locks that choice. You keep picking until you find the right answer.
- **Missed terms come back.** A term you get right on the first try leaves the bank. A term you miss goes to the back of the bank and shows up in a later round.
- **Try the round again.** The results screen lets you replay the same 10 questions. First-try answers in a replay also count toward the bank.
- **Progress saves.** Your bank and round number are stored in your browser, so you can stop and come back later. "Restart" on a subject clears its progress.
- **No giveaways.** If a definition contains the answer's own words, those words are blanked out.
- **One screen.** The question and all four choices fit on one screen on phones, tablets and desktops. The few very long definitions scroll inside their card and show a "Scroll for more" hint.

Keyboard: press <kbd>1</kbd> to <kbd>4</kbd> to answer and <kbd>Enter</kbd> for the next question.

## Files

```
index.html   the whole app: layout, styles, the term lists and the quiz logic
sounds/      clips for right (correct*.mp3) and wrong (wrong*.mp3) answers
memes/       reaction pictures for right (good*.jpg) and wrong (bad*.jpg) answers
.nojekyll    tells GitHub Pages to serve the files as they are
```

There is no build step and no dependencies. The only outside request is the Nunito font from Google Fonts.

## Run it locally

Any static file server works. For example, with Python:

```
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk also works, but some browsers block the sounds that way.

## Edit the terms

The terms are in `index.html`, inside `const SUBJECTS = { research: [...], sia: [...] }`. Each entry is a `["Term", "Definition"]` pair. Add, remove or fix entries, then reload the page.

Saved progress stores term positions. If you change a list, press **Restart** on that subject so the saved bank matches the new list. The app also resets the bank by itself if the saved data no longer fits the list.

## Sounds and pictures

- The first wrong answer always plays `wrong0.mp3`, then `wrong7.mp3`. The first right answer always plays `correct5.mp3`.
- After that, every clip plays once before any clip repeats, and the same clip never plays twice in a row. The memes rotate the same way.
- To swap a clip or picture, replace the file and keep the same name.

The sound clips come from [myinstants.com](https://www.myinstants.com) and the reaction pictures from [Pinterest](https://ph.pinterest.com/ideas/memes/921358921047/). They belong to their original creators and are used here for a personal study tool. If you are the owner of one and want it removed, open an issue.

## Deploying

The site is served by GitHub Pages from the `main` branch, root folder. Pushing to `main` publishes the change within a minute or two.
