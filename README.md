# vibe reviewer

A quiz site for reviewing **Systems Analysis & Design** terms. Ming, the study cat, gives you a definition and you pick the matching term.

**Live site:** https://4regab.github.io/vibereview/

## How it works

- **Rounds of 10.** The question bank has 146 Systems Analysis & Design questions. Every round takes the next 10 from the bank.
- **Definition questions.** Each question shows a definition with four possible terms. The app can also show a **matching set** (tap a left tile, then its match). The current bank has none, see "Edit the questions".
- **Wrong? Try again.** A wrong pick locks that choice, and a wrong pair shakes and unlocks. You keep going until you get it right.
- **Missed questions come back.** A question you get right on the first try leaves the bank. A question you miss goes to the back of the bank and shows up in a later round.
- **Try the round again.** The results screen lets you replay the same 10 questions. First-try answers in a replay also count toward the bank.
- **Progress saves.** Your bank and round number are stored in your browser, so you can stop and come back later. "Restart" on a subject clears its progress.
- **No giveaways.** If a definition contains the answer's own words, those words are blanked out. An entry can list extra phrases to blank (an acronym, a singular form), see "Edit the questions".
- **One screen.** The question and its choices fit on one screen on phones, tablets and desktops. The few very long definitions scroll inside their card and show a "Scroll for more" hint.
- **Settings (gear, top right of the home page).** Switches for sounds and meme pictures. Turning one off is a little game: the switch runs to a random spot the first 9 times you tap it, and the 10th tap turns it off. Turning it back on takes one tap. The choice is saved in your browser.

Keyboard: press <kbd>1</kbd> to <kbd>4</kbd> to answer and <kbd>Enter</kbd> for the next question.

## Files

```
index.html             page layout
assets/css/style.css   all styles
assets/js/terms.js     the question banks (edit this to change questions)
assets/js/app.js       quiz logic, animations, Ming the cat
assets/sounds/         clips for right (correct*.mp3) and wrong (wrong*.mp3) answers
assets/memes/          reaction pictures for right (good*.jpg) and wrong (bad*.jpg) answers
.nojekyll              tells GitHub Pages to serve the files as they are
```

There is no build step and no dependencies. The only outside request is the Nunito font from Google Fonts.

## Run it locally

Any static file server works. For example, with Python:

```
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk also works, but some browsers block the sounds that way.

## Edit the questions

Open `assets/js/terms.js`. Each subject is a list. An entry is a term and its definition:

```js
["Circuit Breaker", "Stops calling a failing service to prevent cascading failures."],
```

The term's own name is blanked out of its definition by itself. If the definition hides the answer in a form the app cannot match (an acronym like "PIO", a singular form, a short phrase from the name), add those words as a third item:

```js
["Public Information Officer", "The Public Information Officer manages ... only one PIO should be designated.", ["PIO"]],
```

An entry can also be a matching set. Each pair is `[left tile, small hint, right tile]`:

```js
{ match: "Company and tech", prompt: "Match each company to the tech it is known for.",
  pairs: [["Netflix", "graceful failure handling", "Circuit Breaker"], ...] },
```

Saved progress stores question positions. If you change a list, press **Restart** on that subject so the saved bank matches the new list. The app also resets the bank by itself if the saved data no longer fits the list.

## Sounds and pictures

- The first wrong answer always plays `wrong0.mp3`, then `wrong7.mp3`. The first right answer always plays `correct5.mp3`.
- After that, every clip plays once before any clip repeats, and the same clip never plays twice in a row. The pictures rotate the same way.
- To swap a clip or picture, replace the file and keep the same name.

The sound clips come from [myinstants.com](https://www.myinstants.com) and the reaction pictures from [Pinterest](https://ph.pinterest.com/ideas/memes/921358921047/). They belong to their original creators and are used here for a personal study tool. If you own one and want it removed, open an issue.

## Deploying

The site is served by GitHub Pages from the `main` branch, root folder. Pushing to `main` publishes the change within a minute or two.

GitHub Pages lets browsers cache files for 10 minutes. `index.html` loads the CSS and JS with a `?v=` version, for example `app.js?v=202610162043`. Change that number whenever you change a CSS or JS file, so browsers fetch the new files instead of an old cached copy.
