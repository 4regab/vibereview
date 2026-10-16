// vibe reviewer: quiz logic. The question banks live in terms.js, loaded first.
const INFO = {
  research: { tag: "Research", title: "Research", cls: "s-research", art: "research" },
  sia: { tag: "SIA", title: "Systems Integration & Architecture", cls: "s-sia", art: "sia" },
};
const SUBJECT_ORDER = ["research", "sia"]; // Research shows first on the home page
const ROUND_SIZE = 10;
// The "first" clips play first, in order; after that every clip plays once before any repeats.
const SOUNDS = {
  correct: { first: ["correct5"], rest: ["correct1", "correct2", "correct3", "correct4"] },
  wrong: { first: ["wrong0", "wrong7"], rest: ["wrong1", "wrong2", "wrong3", "wrong4", "wrong5", "wrong6", "wrong8", "wrong9", "wrong10", "wrong11"] },
};
const MSG = {
  correct: ["Ang galing!", "Lodi!", "Sakto!", "Petmalu!", "Ganyan nga!", "Henyo!", "Nice one!"],
  recovered: ["Nakuha mo rin!", "Ayan na!", "Sa wakas!", "Got it!"],
  wrong: ["Sayang!", "Hala ka!", "Muntik na!", "Mali!", "Oops!", "Hindi 'yan!"],
  waiting: ["Take your time.", "Basahin mabuti.", "You got this.", "Kaya mo 'yan.", "Isip-isip muna."],
};

/* ---------- Hand-drawn icons (24x24) ---------- */
const S = 'fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  close: `<path ${S} d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,
  check: `<path ${S} d="M5 12.5l4.5 4.5L19 7.5"/>`,
  arrow: `<path ${S} d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>`,
  play: `<path d="M8 5.2v13.6a1 1 0 0 0 1.5.8l10.4-6.8a1 1 0 0 0 0-1.6L9.5 4.4A1 1 0 0 0 8 5.2z" fill="currentColor"/>`,
  home: `<path ${S} d="M4 11 12 4l8 7M6.5 9.5V20h11V9.5M10 20v-5h4v5"/>`,
  gear: `<g ${S} stroke-width="2.4"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/><circle cx="12" cy="12" r="6.6"/></g>`,
  flame: `<path d="M12 2.5c.6 3.2 4.6 5.4 5.6 9.2A6 6 0 0 1 6.3 15c-.4-2.4.6-4.5 2.2-5.8.1 1.7.9 3 2 3.4-.8-3.6.2-7.3 1.5-10.1z" fill="#ff7a00"/><path d="M12 13.5c1.6 1.2 2.4 2.4 2.1 3.8a2.2 2.2 0 0 1-4.3.1c-.2-1.4.8-2.7 2.2-3.9z" fill="#ffc53d"/>`,
  target: `<g ${S}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/></g><circle cx="12" cy="12" r="1.6" fill="currentColor"/>`,
  repeat: `<g ${S}><path d="M4.5 11a7.5 7.5 0 0 1 13-4.6L19 8"/><path d="M19 3.5V8h-4.5"/><path d="M19.5 13a7.5 7.5 0 0 1-13 4.6L5 16"/><path d="M5 20.5V16h4.5"/></g>`,
  save: `<path ${S} d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-4.2-6 4.2v-16a1 1 0 0 1 1-1z"/>`,
  clock: `<g ${S}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></g>`,
  book: `<g ${S} stroke-width="2.4"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></g>`,
};
const icon = (name) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
const sparkSvg = (c) => `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:100%;height:100%;display:block"><path d="M12 1c1 7 4 10 11 11-7 1-10 4-11 11-1-7-4-10-11-11 7-1 10-4 11-11z" fill="${c}"/></svg>`;
const CATHEAD = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 30 L15 6 L31 20 Z M52 30 L49 6 L33 20 Z" fill="#ff8a1f" stroke="#ff8a1f" stroke-width="5" stroke-linejoin="round"/><ellipse cx="32" cy="37" rx="25" ry="21" fill="#e8700a"/><ellipse cx="32" cy="35" rx="25" ry="20" fill="#ff8a1f"/><ellipse cx="32" cy="45" rx="16" ry="10" fill="#ffe9cf"/><ellipse cx="23" cy="33" rx="7" ry="8" fill="#fff"/><ellipse cx="41" cy="33" rx="7" ry="8" fill="#fff"/><circle cx="24" cy="34" r="4.5" fill="#2b2118"/><circle cx="42" cy="34" r="4.5" fill="#2b2118"/><circle cx="25.5" cy="32" r="1.6" fill="#fff"/><circle cx="43.5" cy="32" r="1.6" fill="#fff"/><path d="M29 42h6l-3 3z" fill="#ff8fa6"/></svg>`;
// The streak flame: four layers that flicker at different speeds (see .flame in style.css).
const FLAME = `<span class="flame" aria-hidden="true"><svg viewBox="0 0 32 40">
  <path class="f-outer" d="M16 1C19 9 28 14 28 25A12 12 0 0 1 4 25C4 18 8 14 11 10C11 15 13 17 15 18C13 11 14 6 16 1Z" fill="#ff4d1a"/>
  <path class="f-mid" d="M16 10C18 15 24 19 24 26A8 8 0 0 1 8 26C8 21 11 18 13 16C13 19 14 21 16 22C15 18 15 14 16 10Z" fill="#ff8a00"/>
  <path class="f-inner" d="M16 18C17.5 21 21 23 21 28A5 5 0 0 1 11 28C11 24 14 22 16 18Z" fill="#ffd23d"/>
  <ellipse class="f-core" cx="16" cy="31" rx="2.8" ry="3.4" fill="#fff4c4"/>
</svg></span>`;

const ART = {
  research: `<svg viewBox="0 0 120 100" aria-hidden="true">
    <path d="M30 8h24M36 8v26L14 78a8 8 0 0 0 7 12h42a8 8 0 0 0 7-12L48 34V8" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
    <path d="M24 60h36l10 20a6 6 0 0 1-5 8H21a6 6 0 0 1-5-8z" fill="#2f80ed"/>
    <circle cx="34" cy="72" r="4" fill="#e2eeff"/><circle cx="48" cy="79" r="3" fill="#e2eeff"/>
    <circle cx="86" cy="40" r="20" fill="#ffc53d"/><circle cx="86" cy="40" r="11" fill="#fff"/>
    <path d="M100 55l12 14" stroke="#ffc53d" stroke-width="9" stroke-linecap="round"/></svg>`,
  sia: `<svg viewBox="0 0 120 100" aria-hidden="true">
    <path d="M30 36 L60 62 M90 36 L60 62" stroke="#fff" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round" opacity=".8"/>
    <rect x="8" y="10" width="44" height="30" rx="9" fill="#fff"/><path d="M17 22h18M17 30h10" stroke="#1d5fc2" stroke-width="4" stroke-linecap="round"/>
    <rect x="68" y="10" width="44" height="30" rx="9" fill="#ffc53d"/><circle cx="80" cy="25" r="5" fill="#fff"/><path d="M90 25h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <rect x="34" y="56" width="52" height="17" rx="7" fill="#ff7a00"/><rect x="34" y="76" width="52" height="17" rx="7" fill="#d65f00"/>
    <circle cx="45" cy="64.5" r="3" fill="#fff"/><circle cx="45" cy="84.5" r="3" fill="#fff"/></svg>`,
};

/* Ming the study cat. One head is shared by the full body (home, results) and the peeking pose (quiz).
   The wrapper's data-mood ("idle" | "happy" | "sad") picks the face and the motion. */
const CAT_HEAD = `
  <g class="head">
    <g class="ear ear-l"><path d="M50 86 L58 26 L98 58 Z" fill="#ff8a1f" stroke="#ff8a1f" stroke-width="14" stroke-linejoin="round"/><path d="M63 72 L66 44 L86 60 Z" fill="#ffb1a3" stroke="#ffb1a3" stroke-width="6" stroke-linejoin="round"/></g>
    <g class="ear ear-r"><path d="M150 86 L142 26 L102 58 Z" fill="#ff8a1f" stroke="#ff8a1f" stroke-width="14" stroke-linejoin="round"/><path d="M137 72 L134 44 L114 60 Z" fill="#ffb1a3" stroke="#ffb1a3" stroke-width="6" stroke-linejoin="round"/></g>
    <ellipse cx="100" cy="108" rx="68" ry="58" fill="#e8700a"/>
    <ellipse cx="100" cy="103" rx="67" ry="55" fill="#ff8a1f"/>
    <path d="M89 52 v13 M100 49 v17 M111 52 v13" stroke="#e8700a" stroke-width="7" stroke-linecap="round"/>
    <path d="M36 96 q-6 8 -2 16 M164 96 q6 8 2 16" stroke="#e8700a" stroke-width="6" stroke-linecap="round" fill="none"/>
    <ellipse cx="100" cy="128" rx="44" ry="29" fill="#ffe9cf"/>
    <ellipse cx="60" cy="124" rx="10" ry="6.5" fill="#ff8fa6" opacity=".55"/><ellipse cx="140" cy="124" rx="10" ry="6.5" fill="#ff8fa6" opacity=".55"/>
    <path d="M52 116 L24 110 M53 124 L25 128 M148 116 L176 110 M147 124 L175 128" stroke="#e8700a" stroke-width="3" stroke-linecap="round"/>
    <g class="mood mood-idle">
      <path d="M58 68 q14 -8 28 -2 M142 68 q-14 -8 -28 -2" fill="none" stroke="#2b2118" stroke-width="5" stroke-linecap="round"/>
      <g class="eyes">
        <ellipse cx="74" cy="98" rx="18" ry="21" fill="#fff"/><ellipse cx="126" cy="98" rx="18" ry="21" fill="#fff"/>
        <g class="pupils"><circle cx="76" cy="101" r="12" fill="#2b2118"/><circle cx="128" cy="101" r="12" fill="#2b2118"/>
          <circle cx="80.5" cy="95.5" r="4.6" fill="#fff"/><circle cx="132.5" cy="95.5" r="4.6" fill="#fff"/><circle cx="72" cy="106" r="2" fill="#fff" opacity=".8"/><circle cx="124" cy="106" r="2" fill="#fff" opacity=".8"/></g>
      </g>
    </g>
    <g class="mood mood-happy">
      <path d="M56 64 q16 -12 30 -4 M144 64 q-16 -12 -30 -4" fill="none" stroke="#2b2118" stroke-width="5" stroke-linecap="round"/>
      <path d="M58 102 q16 -22 32 0 M110 102 q16 -22 32 0" fill="none" stroke="#2b2118" stroke-width="7.5" stroke-linecap="round"/>
    </g>
    <g class="mood mood-sad">
      <path d="M58 80 q14 -2 26 -12 M142 80 q-14 -2 -26 -12" fill="none" stroke="#2b2118" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="74" cy="101" rx="16" ry="17" fill="#fff"/><ellipse cx="126" cy="101" rx="16" ry="17" fill="#fff"/>
      <circle cx="74" cy="108" r="9.5" fill="#2b2118"/><circle cx="126" cy="108" r="9.5" fill="#2b2118"/>
      <circle cx="77" cy="104" r="3" fill="#fff"/><circle cx="129" cy="104" r="3" fill="#fff"/>
      <path d="M58 92 q16 -6 32 0 M110 92 q16 -6 32 0" fill="#ff8a1f"/>
      <path d="M143 116 q8 12 0 18 q-8 -6 0 -18z" fill="#6fb6ff"/>
    </g>
    <path d="M92 120 h16 q0 4 -8 9 q-8 -5 -8 -9z" fill="#ff8fa6"/>
    <g class="mood mood-idle"><path d="M86 135 q7 8 14 0 q7 8 14 0" fill="none" stroke="#2b2118" stroke-width="4.5" stroke-linecap="round"/></g>
    <g class="mood mood-happy"><path d="M82 132 h36 q0 25 -18 25 q-18 0 -18 -25z" fill="#8f2a22"/><path d="M90 148 q10 -9 20 0 q-10 9 -20 0" fill="#ff8fa6"/><path d="M84 132 h32 v4 h-32z" fill="#fff"/></g>
    <g class="mood mood-sad"><path d="M88 144 q6 -6 12 -2 q6 -4 12 2" fill="none" stroke="#2b2118" stroke-width="4.5" stroke-linecap="round"/></g>
  </g>`;
const CAT = `<svg class="cat" viewBox="0 0 200 232" aria-hidden="true">
  <ellipse cx="100" cy="225" rx="58" ry="7" fill="#2b2118" opacity=".1"/>
  <g class="all">
    <g class="tail">
      <path d="M142 200 C186 196 198 152 172 122" fill="none" stroke="#ff8a1f" stroke-width="18" stroke-linecap="round"/>
      <path d="M142 200 C186 196 198 152 172 122" fill="none" stroke="#e8700a" stroke-width="18" stroke-dasharray="7 15" stroke-dashoffset="-6"/>
      <path d="M180 138 C179 131 176 126 172 122" fill="none" stroke="#ffe9cf" stroke-width="18" stroke-linecap="round"/>
    </g>
    <g class="torso">
      <g class="arm arm-l"><ellipse cx="62" cy="186" rx="13" ry="20" fill="#ff8a1f"/><ellipse cx="62" cy="200" rx="10" ry="7" fill="#ffe9cf"/></g>
      <g class="arm arm-r"><ellipse cx="138" cy="186" rx="13" ry="20" fill="#ff8a1f"/><ellipse cx="138" cy="200" rx="10" ry="7" fill="#ffe9cf"/></g>
      <path d="M54 198 C54 160 76 150 100 150 C124 150 146 160 146 198 C146 216 128 222 100 222 C72 222 54 216 54 198 Z" fill="#ff8a1f"/>
      <path d="M58 206 C70 220 130 220 142 206 C140 216 126 222 100 222 C74 222 60 216 58 206 Z" fill="#e8700a"/>
      <ellipse cx="100" cy="196" rx="26" ry="21" fill="#ffe9cf"/>
      <ellipse cx="80" cy="221" rx="17" ry="8" fill="#ffe9cf"/><ellipse cx="120" cy="221" rx="17" ry="8" fill="#ffe9cf"/>
      <path d="M75 217 v6 M85 217 v6 M115 217 v6 M125 217 v6" stroke="#e2c9ad" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M62 152 Q100 172 138 152 L132 164 Q100 182 68 164 Z" fill="#1d5fc2"/>
      <path d="M86 166 L100 196 L114 166 Z" fill="#2f80ed"/>
      <circle cx="93" cy="174" r="2.4" fill="#e2eeff"/><circle cx="104" cy="182" r="2.4" fill="#e2eeff"/><circle cx="101" cy="171" r="2" fill="#e2eeff"/>
    </g>
    ${CAT_HEAD}
  </g>
</svg>`;
// Peeking pose: the head (clipped at the card edge) and, separately, two paws curled over that edge.
const CAT_PEEK_HEAD = `<svg class="cat" viewBox="0 18 200 152" aria-hidden="true"><g class="all">${CAT_HEAD}</g></svg>`;
const CAT_PEEK_PAWS = `<svg class="cat" viewBox="0 150 200 38" aria-hidden="true">
  <g>
    <g class="paw paw-l"><ellipse cx="62" cy="168" rx="24" ry="16" fill="#ff8a1f"/><ellipse cx="62" cy="173" rx="19" ry="10" fill="#ffe9cf"/><path d="M54 167 v8 M62 166 v9 M70 167 v8" stroke="#e2c9ad" stroke-width="2.5" stroke-linecap="round"/></g>
    <g class="paw paw-r"><ellipse cx="138" cy="168" rx="24" ry="16" fill="#ff8a1f"/><ellipse cx="138" cy="173" rx="19" ry="10" fill="#ffe9cf"/><path d="M130 167 v8 M138 166 v9 M146 167 v8" stroke="#e2c9ad" stroke-width="2.5" stroke-linecap="round"/></g>
  </g>
</svg>`;

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};
// Player settings (Settings panel on the home page). Sounds and memes are on unless the player fought the switch and won.
// Light mode is the default; dark mode only turns on when the player picks it.
const settings = { sound: true, memes: true, dark: false };
try { Object.assign(settings, JSON.parse(store.get("vr_settings")) || {}); } catch {}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Run a Web Animation and resolve when it ends. Reduced motion skips it; a stalled animation can't block the quiz.
function anim(el, frames, opts) {
  if (reduceMotion || !el || !el.animate) return Promise.resolve();
  const limit = (opts.duration || 0) + (opts.delay || 0) + 120;
  return Promise.race([el.animate(frames, opts).finished.catch(() => {}), wait(limit)]);
}
function fillArt(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => { el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)); el.removeAttribute("data-icon"); });
  root.querySelectorAll("[data-cat]").forEach((el) => { el.innerHTML = CAT; el.removeAttribute("data-cat"); });
  root.querySelectorAll("[data-peekhead]").forEach((el) => { el.innerHTML = CAT_PEEK_HEAD; el.removeAttribute("data-peekhead"); });
  root.querySelectorAll("[data-peekpaws]").forEach((el) => { el.innerHTML = CAT_PEEK_PAWS; el.removeAttribute("data-peekpaws"); });
  root.querySelectorAll("[data-cathead]").forEach((el) => { el.innerHTML = CATHEAD; el.removeAttribute("data-cathead"); });
  root.querySelectorAll("[data-flame]").forEach((el) => { el.outerHTML = FLAME; });
}
function setMood(el, mood) {
  el.dataset.mood = "idle";          // reset first so the hop / head shake can replay
  void el.offsetWidth;
  el.dataset.mood = mood;
}
(function splitTitle() {
  const h = $("heroTitle");
  // One sentence per line ("Learn the terms." / "Pass the exam."), each word popping in after the last.
  let k = 0;
  h.innerHTML = h.textContent.split(/(?<=\.)\s+/).map((line, n) => `<span class="line${n ? " hl" : ""}">${line.split(" ").map((w) => `<span class="w" style="animation-delay:${0.15 + k++ * 0.07}s">${w}</span>`).join(" ")}</span>`).join("");
})();

// Ming's eyes follow the pointer (or the last tap) around the screen.
let lookRaf = 0, lookX = innerWidth / 2, lookY = innerHeight / 3;
function followLook() {
  lookRaf = 0;
  document.querySelectorAll(".cat .mood-idle .pupils").forEach((p) => {
    const r = p.closest(".eyes").getBoundingClientRect();
    if (!r.width) return;
    const dx = lookX - (r.left + r.width / 2), dy = lookY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 220) * 6;
    p.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k * .8}px)`;
  });
}
if (!reduceMotion) addEventListener("pointermove", (e) => { lookX = e.clientX; lookY = e.clientY; if (!lookRaf) lookRaf = requestAnimationFrame(followLook); }, { passive: true });
if (!reduceMotion) addEventListener("pointerdown", (e) => { lookX = e.clientX; lookY = e.clientY; followLook(); }, { passive: true });

/* ---------- Sounds ---------- */
function makeBag({ first, rest }) {
  const load = (n) => { const a = new Audio("assets/sounds/" + n + ".mp3"); a.preload = "auto"; return a; };
  const audios = [...first, ...rest].map(load);
  let queue = [...audios.slice(0, first.length), ...shuffle(audios.slice(first.length))], last = null;
  return () => {
    if (!queue.length) {
      queue = shuffle(audios.slice());
      if (queue[0] === last) queue.push(queue.shift()); // never the same clip twice in a row
    }
    return (last = queue.shift());
  };
}
const nextSound = { correct: makeBag(SOUNDS.correct), wrong: makeBag(SOUNDS.wrong) };
let playing = null;
function stopSound() { if (playing) { playing.pause(); playing.currentTime = 0; playing = null; } }
function playSound(kind) {
  stopSound();
  if (!settings.sound) return;
  playing = nextSound[kind]();
  playing.play().catch(() => {});
}

/* ---------- Reaction memes: happy ones for right answers, "cooked" ones for wrong ones ---------- */
function makeImgBag(prefix, count) {
  const srcs = Array.from({ length: count }, (_, i) => `assets/memes/${prefix}${i + 1}.jpg`);
  srcs.forEach((s) => (new Image().src = s)); // preload so they appear instantly
  let queue = [], last = null;
  return () => {
    if (!queue.length) { queue = shuffle(srcs.slice()); if (queue[0] === last) queue.push(queue.shift()); }
    return (last = queue.shift());
  };
}
const nextMeme = { good: makeImgBag("good", 10), bad: makeImgBag("bad", 11) };
let memeAnim = null;
function showMeme(kind) {
  if (!settings.memes) return;
  const m = $("meme"), card = $("qCard");
  // The picture is centred in the free space between the top bar and the bottom of the card, and zooms from its centre.
  // It is sized so that even at its biggest (EXIT) it never reaches the choices below.
  const EXIT = 1.28, c = card.getBoundingClientRect(), top = document.querySelector(".quiz-top").getBoundingClientRect().bottom + 8, bottom = c.bottom - 6;
  m.style.top = ((top + bottom) / 2 - c.top) + "px";
  card.style.setProperty("--meme-h", Math.max(110, Math.min((bottom - top) / EXIT, innerHeight * .62)) + "px");
  $("memeImg").src = nextMeme[kind]();
  if (memeAnim) memeAnim.cancel();
  const hold = kind === "good" ? 2400 : 1900, enter = 750, exit = 650, total = enter + hold + exit;
  if (reduceMotion || !m.animate) { m.style.opacity = 1; clearTimeout(showMeme.t); showMeme.t = setTimeout(() => (m.style.opacity = 0), hold); return; }
  // One motion only: zoom in from the centre. It grows into view, creeps closer while it holds, then zooms a little more as it fades.
  memeAnim = m.animate([
    { opacity: 0, transform: "translate(-50%, -50%) scale(.3)", easing: "cubic-bezier(.16,1,.3,1)" },
    { opacity: 1, transform: "translate(-50%, -50%) scale(1)", offset: enter / total, easing: "linear" },
    { opacity: 1, transform: "translate(-50%, -50%) scale(1.06)", offset: (enter + hold) / total, easing: "cubic-bezier(.55,0,.75,.3)" },
    { opacity: 0, transform: `translate(-50%, -50%) scale(${EXIT})` },
  ], { duration: total });
}
function hideMeme() { if (memeAnim) memeAnim.cancel(); clearTimeout(showMeme.t); $("meme").style.opacity = 0; }

/* ---------- Particles ---------- */
const canvas = $("confetti"), ctx = canvas.getContext("2d");
let parts = [], raf = 0;
function confetti(n = 120, originY = 0.35) {
  if (reduceMotion) return;
  canvas.width = innerWidth; canvas.height = innerHeight;
  const colors = ["#ff7a00", "#2f80ed", "#ffc53d", "#ff4d5e", "#6fb6ff", "#ffe9cf"];
  for (let i = 0; i < n; i++) parts.push({
    x: innerWidth / 2 + (Math.random() - .5) * 140, y: innerHeight * originY,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 5, s: Math.random() * 8 + 6,
    c: pick(colors), a: Math.random() * 6, va: (Math.random() - .5) * .35, life: 150 + Math.random() * 60,
  });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  parts = parts.filter((p) => p.life-- > 0 && p.y < canvas.height + 40);
  for (const p of parts) {
    p.vy += .38; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.a += p.va;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-p.s / 2, -p.s / 3, p.s, p.s * .6, 2) : ctx.rect(-p.s / 2, -p.s / 3, p.s, p.s * .6); ctx.fill();
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}
// A ring of little stars bursting out of an element.
function burst(el, colors = ["#ffc53d", "#ff7a00", "#2f80ed", "#6fb6ff"]) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.innerHTML = sparkSvg(colors[i % colors.length]);
    s.style.left = cx - 8 + "px"; s.style.top = cy - 8 + "px";
    document.body.append(s);
    const a = (i / 10) * Math.PI * 2 + Math.random() * .5, d = Math.min(r.width, 160) * .55 + Math.random() * 30;
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d * .7;
    s.animate([
      { transform: "translate(0,0) scale(.3) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(1.1) rotate(120deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx * 1.25}px,${dy * 1.25 + 14}px) scale(0) rotate(220deg)`, opacity: 0 },
    ], { duration: 720, easing: "cubic-bezier(.23,1,.32,1)" });
    setTimeout(() => s.remove(), 800);
  }
}
// "+1" flies from the right answer up into the streak flame.
function flyPlus(fromEl, toEl) {
  if (reduceMotion) return;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const p = document.createElement("div");
  p.className = "plus"; p.textContent = "+1";
  p.style.left = a.left + a.width / 2 - 12 + "px"; p.style.top = a.top + "px";
  document.body.append(p);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top - a.top;
  p.animate([
    { transform: "translate(0, 0) scale(.6)", opacity: 0 },
    { transform: "translate(0, -26px) scale(1.25)", opacity: 1, offset: .25 },
    { transform: `translate(${dx}px, ${dy}px) scale(.7)`, opacity: .9 },
  ], { duration: 800, easing: "cubic-bezier(.65,0,.35,1)" });
  setTimeout(() => p.remove(), 820);
}

/* ---------- Question building ---------- */
// Builds a function that hides a term inside its own definition.
// Only the full name is hidden (plus its alternate names and acronym). Single words from a longer
// term are left alone, so "Lightweight Evaluation Alternatives" can still say "evaluation methods".
function makeMasker() {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const flex = (phrase) => phrase.trim().split(/[\s\-\u2011\/]+/).map(esc).join("[\\s\\-\\u2011\\/]+");
  const isAcronym = (p) => /^[A-Z][A-Za-z]*[A-Z]s?$/.test(p) || /^[A-Z]{2,}s?$/.test(p);
  return (term, def) => {
    const base = term.replace(/\s*\([^)]*\)\s*/g, " ").trim();
    const names = new Set([term, base]);
    // Alternate names written into the term, e.g. "ADR, Architecture Decision Record" or "Message Broker / Message Oriented Middleware".
    base.split(/\s*[\/,]\s*/).forEach((p) => (p.split(/\s+/).length > 1 || isAcronym(p)) && names.add(p));
    (term.match(/\(([^)]+)\)/g) || []).forEach((p) => {
      p = p.slice(1, -1);
      if (isAcronym(p) || p.split(/\s+/).length > 1) names.add(p);
    });
    let out = def;
    [...names].filter((p) => p.length > 1).sort((a, b) => b.length - a.length).forEach((p) => {
      out = out.replace(new RegExp("(^|[^A-Za-z0-9])" + flex(p) + "(?:s|es)?(?=$|[^A-Za-z0-9])", "gi"), "$1\u0000");
    });
    return out.replace(/\u0000(?:[\s\-\/]*\u0000)+/g, "\u0000");
  };
}
const maskTerm = makeMasker();
// A bank entry is either a [term, definition] pair or a matching set { match, prompt, pairs }.
const isMatch = (entry) => !Array.isArray(entry);
// Wrong choices come mostly from nearby terms (same topic), so questions aren't too easy.
function pickOptions(index) {
  const near = [];
  for (let d = -12; d <= 12; d++) {
    const j = index + d;
    if (d !== 0 && j >= 0 && j < TERMS.length && !isMatch(TERMS[j])) near.push(j);
  }
  return shuffle([index, ...shuffle(near).slice(0, 3)]);
}
// Grow the definition text as big as the card allows, shrink it for long ones.
function fitQuestion() {
  const body = $("qBody"), t = $("question");
  if (!body.clientHeight) return;
  const max = (current && current.match ? .8 : 1) * (innerWidth >= 1024 ? 28 : innerWidth >= 768 ? 26 : innerWidth >= 640 ? 23 : 20), min = 12;
  let size = max;
  t.style.fontSize = size + "px";
  while (size > min && body.scrollHeight > body.clientHeight + 1) t.style.fontSize = --size + "px";
  body.classList.toggle("scrolls", body.scrollHeight > body.clientHeight + 1);
  updateMore();
}
// "Scroll for more" shows while there is hidden text below, and hides once you reach the end.
function updateMore() {
  const b = $("qBody"), left = b.scrollHeight - b.clientHeight - b.scrollTop;
  $("more").classList.toggle("show", left > 6);
  b.classList.toggle("scrolls", left > 6);
}
$("qBody").addEventListener("scroll", updateMore, { passive: true });
new ResizeObserver(() => fitQuestion()).observe($("qMain") || document.querySelector(".q-main"));

/* ---------- Saved progress per subject ----------
   queue = terms not yet answered right on the first try, in the order they will be asked. */
const progKey = (s) => "rm_prog_" + s;
function freshProg(s) { return { queue: shuffle(SUBJECTS[s].map((_, i) => i)), round: 0 }; }
function loadProg(s) {
  const n = SUBJECTS[s].length;
  try {
    const p = JSON.parse(store.get(progKey(s)));
    const ok = p && Array.isArray(p.queue) && Number.isInteger(p.round) &&
      p.queue.every((i) => Number.isInteger(i) && i >= 0 && i < n) && new Set(p.queue).size === p.queue.length;
    if (ok) return p;
  } catch {}
  return freshProg(s);
}
const saveProg = (s, p) => store.set(progKey(s), JSON.stringify(p));

/* ---------- State ---------- */
let subject = "research", TERMS = [], prog = null, retrying = false;
let order = [], pos = 0, score = 0, missed = [], answered = false, current = null, busy = false;
let streak = 0, bestStreak = 0, startedAt = 0;

function show(id) {
  ["home", "quiz", "results"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
  document.body.className = "mode-" + id;
  scrollTo({ top: 0 });
}
// Screen change: an orange circle grows out of the pressed button, Ming pops up, then it closes on the new screen.
async function wipeTo(id, fromEl, before) {
  if (reduceMotion) { before && before(); show(id); return; }
  const w = $("wipe"), r = fromEl.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;
  const cx = innerWidth / 2, cy = innerHeight / 2, R2 = Math.hypot(cx, cy) + 20;
  w.style.clipPath = `circle(0px at ${x}px ${y}px)`;
  w.style.display = "grid";
  const cat = w.firstElementChild;
  setMood(cat, "happy");
  anim(cat, [{ transform: "scale(.3) rotate(-25deg)", opacity: 0 }, { transform: "scale(1.1) rotate(5deg)", opacity: 1, offset: .65 }, { transform: "none", opacity: 1 }], { duration: 560, easing: "cubic-bezier(.23,1,.32,1)" });
  await anim(w, [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }], { duration: 440, easing: "cubic-bezier(.77,0,.175,1)" });
  w.style.clipPath = "none";
  before && before();
  show(id);
  await wait(220);
  await anim(w, [{ clipPath: `circle(${R2}px at ${cx}px ${cy}px)` }, { clipPath: `circle(0px at ${cx}px ${cy}px)` }], { duration: 400, easing: "cubic-bezier(.77,0,.175,1)" });
  w.style.display = "none";
}

/* ---------- Home ---------- */
function renderHome() {
  const box = $("subjects");
  box.replaceChildren();
  let total = 0;
  for (const s of SUBJECT_ORDER) {
    const info = INFO[s], n = SUBJECTS[s].length, p = loadProg(s);
    const left = p.queue.length, done = n - left, cleared = left === 0;
    const status = p.round ? (cleared ? "All rounds done" : `Round ${p.round + 1} next`) : "Not started";
    total += n;
    const card = document.createElement("article");
    card.className = "subject " + info.cls;
    card.innerHTML = `
      <div class="subject-head">
        <div class="subject-title"><small>${n} questions</small><h3>${info.title}</h3></div>
        <div class="subject-art">${ART[info.art]}</div>
      </div>
      <div class="subject-body">
        <div class="bank-row"><span>${status}</span><b>${left} of ${n} left</b></div>
        <div class="bar" role="progressbar" aria-label="${info.tag} terms mastered" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${done}"><div data-to="${done / n}"></div></div>
        <div class="subject-actions">
          <button type="button" class="btn ${s === "sia" ? "btn-blue" : "btn-orange"} btn-play">${icon("play")}${cleared ? "Play again" : p.round ? "Continue" : "Start"}</button>
          ${p.round ? '<button type="button" class="link-btn">Restart</button>' : ""}
        </div>
      </div>`;
    const play = card.querySelector(".btn-play");
    play.addEventListener("click", () => {
      if (cleared) saveProg(s, freshProg(s));
      startRound(s, play);
    });
    const reset = card.querySelector(".link-btn");
    if (reset) reset.addEventListener("click", () => {
      if (confirm(`Restart ${info.tag}? This clears your saved progress for this subject.`)) { saveProg(s, freshProg(s)); renderHome(); }
    });
    box.append(card);
  }
  $("totalTerms").textContent = `${total} terms`;
  setTimeout(() => box.querySelectorAll("[data-to]").forEach((m) => (m.style.transform = `scaleX(${m.dataset.to})`)), 320);
}

/* ---------- Round flow ---------- */
function startRound(s, fromEl, again = false) {
  subject = s; TERMS = SUBJECTS[s]; prog = loadProg(s);
  retrying = again;
  if (!again) { prog.round++; order = prog.queue.slice(0, ROUND_SIZE); }
  saveProg(s, prog);
  pos = 0; score = 0; missed = []; streak = 0; bestStreak = 0; startedAt = Date.now();
  $("progress").setAttribute("aria-valuemax", order.length);
  $("streakNum").textContent = 0;
  $("streak").classList.remove("on", "hot", "blaze");
  wipeTo("quiz", fromEl, () => renderQuestion(false));
}

function setFoot(state, title, sub) {
  const foot = $("foot");
  foot.className = "foot" + (state === "idle" ? "" : " " + state);
  $("footTitle").textContent = title;
  $("footSub").textContent = sub;
  if (state === "idle") {
    // A small ring showing how much of the whole bank is mastered.
    const n = TERMS.length, done = n - prog.queue.length, C = 2 * Math.PI * 19;
    $("footIcon").innerHTML = `<svg class="ring" viewBox="0 0 46 46"><circle cx="23" cy="23" r="19" fill="none" style="stroke: var(--line)" stroke-width="5"/><circle cx="23" cy="23" r="19" fill="none" stroke="#ff7a00" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - done / n)}"/></svg><span class="ring-num">${Math.round((done / n) * 100)}%</span>`;
    return;
  }
  $("footIcon").innerHTML = state === "ok" ? `<svg viewBox="0 0 24 24"><path class="draw" pathLength="1" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg viewBox="0 0 24 24"><path class="draw" pathLength="1" d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>`;
  // The new colour spreads out from the icon like ink.
  const r = $("footIcon").getBoundingClientRect(), f = foot.getBoundingClientRect();
  const x = r.left - f.left + r.width / 2, y = r.top - f.top + r.height / 2;
  anim($("footFill"), [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${f.width * 1.1}px at ${x}px ${y}px)` }], { duration: 520, easing: "cubic-bezier(.23,1,.32,1)" });
  anim($("footIcon"), [{ transform: "scale(.5) rotate(-30deg)" }, { transform: "scale(1.15) rotate(6deg)", offset: .6 }, { transform: "none" }], { duration: 460, easing: "cubic-bezier(.23,1,.32,1)" });
}

function renderQuestion(animateIn = true) {
  stopSound();
  hideMeme();
  answered = false;
  const idx = order[pos];
  const entry = TERMS[idx];
  current = { idx, options: isMatch(entry) ? [] : pickOptions(idx), misses: 0, match: isMatch(entry) };
  $("progressBar").style.transform = `scaleX(${pos / order.length})`;
  $("progress").setAttribute("aria-valuenow", pos);
  $("nextBtn").classList.add("hidden");
  setFoot("idle", `Question ${pos + 1} of ${order.length}`, `${retrying ? "Retry" : "Round " + prog.round} · ${prog.queue.length} left in the bank · ${pick(MSG.waiting)}`);
  $("qLabel").lastChild.textContent = current.match ? "Match the pairs" : "Which term fits?";

  const q = $("question");
  q.replaceChildren();
  if (current.match) q.textContent = entry.prompt;
  else maskTerm(entry[0], entry[1]).split("\u0000").forEach((part, i) => {
    if (i) { const b = document.createElement("span"); b.className = "blank"; b.setAttribute("aria-label", "blank"); q.append(b); }
    q.append(part);
  });
  $("qBody").scrollTop = 0;

  const box = $("options");
  box.replaceChildren();
  box.className = current.match ? "options match" : "options";
  $("qCard").classList.toggle("is-match", current.match);
  $("qCard").classList.remove("compact");
  if (current.match) buildMatch(entry, box);
  else current.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    const key = document.createElement("span");
    key.className = "key"; key.textContent = i + 1;
    const text = document.createElement("span");
    // Let long names break after a slash ("Hypothesis/Research") instead of mid-word.
    TERMS[opt][0].split("/").forEach((part, k, all) => {
      text.append(part + (k < all.length - 1 ? "/" : ""));
      if (k < all.length - 1) text.append(document.createElement("wbr"));
    });
    b.append(key, text);
    b.addEventListener("click", () => answer(i));
    box.append(b);
  });
  fitQuestion();
  if (current.match && box.scrollHeight > box.clientHeight + 1) { $("qCard").classList.add("compact"); fitQuestion(); }

  // Ming moves to a new spot on the card each question, then pops up from behind it.
  const peek = $("peek"), cat = $("quizCat");
  peek.classList.remove("duck");
  peek.dataset.mood = "idle";
  peek.dataset.side = pick(["l", "r", "c"].filter((s) => s !== peek.dataset.side));
  const d = animateIn ? 0 : 140;
  anim($("qCard"), [{ opacity: 0, transform: "translateY(-28px) rotate(-1.5deg)" }, { opacity: 1, transform: "translateY(6px)", offset: .6 }, { opacity: 1, transform: "none" }], { duration: 480, delay: d, easing: "cubic-bezier(.23,1,.32,1)", fill: "backwards" });
  anim(cat, [{ transform: "translateY(105%)" }, { transform: "translateY(105%)", offset: .4 }, { transform: "translateY(-10%)", offset: .8 }, { transform: "none" }], { duration: 760, delay: d, easing: "cubic-bezier(.23,1,.32,1)", fill: "backwards" });
  box.querySelectorAll(".opt, .tile").forEach((b, i) => anim(b, [{ opacity: 0, transform: "translateY(18px) scale(.92)" }, { opacity: 1, transform: "none" }], { duration: 440, delay: d + 160 + i * 45, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
  setTimeout(followLook, d + 800);
}

/* ---------- Matching question: tap a company, then the tech it is known for ---------- */
function buildMatch(entry, box) {
  current.left = null; current.right = null; current.done = 0; current.total = entry.pairs.length;
  const make = ([id, title, note], side) => {
    const t = document.createElement("button");
    t.type = "button";
    t.className = "tile " + side;
    t.dataset.id = id;
    const b = document.createElement("b"); b.textContent = title; t.append(b);
    if (note) { const s = document.createElement("small"); s.textContent = note; t.append(s); }
    t.addEventListener("click", () => pickTile(t, side));
    return t;
  };
  // Companies on the left, techs on the right, each column shuffled; rows share a height so the grid stays even.
  const left = shuffle(entry.pairs.map((p, i) => [i, p[0], null]));
  const right = shuffle(entry.pairs.map((p, i) => [i, p[2], p[1]]));
  left.forEach((l, k) => box.append(make(l, "left"), make(right[k], "right")));
}

function pickTile(tile, side) {
  if (answered || busy || tile.disabled) return;
  const prev = current[side];
  if (prev) prev.classList.remove("sel");
  current[side] = prev === tile ? null : tile;
  if (current[side]) {
    tile.classList.add("sel");
    anim(tile, [{ transform: "scale(.96)" }, { transform: "scale(1.03)" }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(.23,1,.32,1)" });
  }
  const a = current.left, b = current.right;
  if (!a || !b) return;
  current.left = current.right = null;
  a.classList.remove("sel"); b.classList.remove("sel");
  const peek = $("peek");
  if (a.dataset.id === b.dataset.id) {
    // A correct pair locks in blue and both tiles pop.
    [a, b].forEach((t) => {
      t.disabled = true;
      t.classList.add("done");
      anim(t, [{ transform: "scale(1)" }, { transform: "scale(1.08)", offset: .4 }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)" });
    });
    burst(b);
    current.done++;
    if (current.done === current.total) return resolveCorrect(current.misses === 0, b);
    setMood($("peek"), "happy");
    peek.classList.remove("duck");
    setFoot("idle", `${current.done} of ${current.total} matched`, current.misses ? "Keep going." : "Nice. Keep going.");
    return;
  }
  // Wrong pair: both tiles flash red and shake, then unlock so you can try again.
  [a, b].forEach((t) => {
    t.classList.add("bad");
    anim(t, [{ transform: "none" }, { transform: "translateX(-9px)" }, { transform: "translateX(8px)" }, { transform: "translateX(-4px)" }, { transform: "none" }], { duration: 400, easing: "ease-out" });
    setTimeout(() => t.classList.remove("bad"), 650);
  });
  registerMiss();
  setFoot("bad", pick(MSG.wrong) + " Not a match.", "Try another pair.");
}

// Shared by both question types: a first miss breaks the streak and sends the item to the back of the bank.
function registerMiss() {
  current.misses++;
  if (current.misses === 1) { missed.push(current.idx); streak = 0; updateStreak(false); }
  playSound("wrong");
  showMeme("bad");
  if (navigator.vibrate) navigator.vibrate(60);
  setMood($("peek"), "sad");
  $("peek").classList.add("duck");
}

function updateStreak(bump) {
  const el = $("streak"), num = $("streakNum");
  num.textContent = streak;
  el.setAttribute("aria-label", `Streak: ${streak}`);
  el.classList.toggle("on", streak > 0);
  el.classList.toggle("hot", streak >= 3);
  el.classList.toggle("blaze", streak >= 7);
  if (bump) {
    // The number rolls up, and the flame flares when the "+1" lands on it.
    anim(num, [{ transform: "translateY(80%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, delay: 600, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
    anim(el.querySelector(".flame"), [{ transform: "scale(1)", filter: "brightness(1)" }, { transform: "scale(1.6) translateY(-3px)", filter: "brightness(1.5)", offset: .35 }, { transform: "scale(1.14)", filter: "brightness(1)" }], { duration: 560, delay: 600, easing: "cubic-bezier(.23,1,.32,1)" });
    if (streak >= 3) setTimeout(() => burst(el, ["#ff7a00", "#ffc53d", "#ffd23d"]), 650);
  }
}

function toast(text) {
  const t = $("toast");
  t.innerHTML = FLAME;
  const parts = text.split(/(\d+)/);
  parts.forEach((s, i) => { if (!s) return; if (i % 2) { const b = document.createElement("b"); b.textContent = s; t.append(b); } else t.append(s); });
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
}

function answer(i) {
  if (answered || busy || current.match) return;
  const buttons = [...$("options").children];
  if (!buttons[i] || buttons[i].disabled) return;
  const correctPos = current.options.indexOf(current.idx);

  // Wrong pick: lock that choice and let them try again until they find the right one.
  if (i !== correctPos) {
    buttons[i].disabled = true;
    buttons[i].classList.add("wrong");
    buttons[i].querySelector(".key").innerHTML = icon("close");
    anim(buttons[i], [{ transform: "none" }, { transform: "translateX(-10px) rotate(-2deg)" }, { transform: "translateX(9px) rotate(2deg)" }, { transform: "translateX(-5px)" }, { transform: "none" }], { duration: 400, easing: "ease-out" });
    anim($("qCard"), [{ transform: "none" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 300 });
    registerMiss();
    setFoot("bad", pick(MSG.wrong) + " Try again.", "That's not it. Pick another answer.");
    return;
  }

  buttons.forEach((b, k) => { b.disabled = true; if (k !== correctPos && !b.classList.contains("wrong")) b.classList.add("dim"); });
  const right = buttons[correctPos];
  right.classList.add("correct");
  right.querySelector(".key").innerHTML = icon("check");
  anim(right, [{ transform: "scale(1)" }, { transform: "scale(1.07) rotate(-1deg)", offset: .4 }, { transform: "none" }], { duration: 440, easing: "cubic-bezier(.34,1.56,.64,1)" });
  burst(right);
  resolveCorrect(current.misses === 0, right);
}

// The question is solved (a right choice, or the last matching pair).
function resolveCorrect(firstTry, anchor) {
  answered = true;
  const peek = $("peek");
  // Update the saved bank: first-try answers leave it, missed ones go to the back.
  const at = prog.queue.indexOf(current.idx);
  if (at >= 0) prog.queue.splice(at, 1);
  if (!firstTry) prog.queue.push(current.idx);
  saveProg(subject, prog);

  let sub;
  if (firstTry) {
    score++; streak++; bestStreak = Math.max(bestStreak, streak);
    sub = streak >= 3 ? `${streak} in a row. Tuloy-tuloy lang!` : current.match ? "All pairs matched." : "That term is mastered.";
    flyPlus(anchor, $("streak"));
    if (streak >= 5 && streak % 5 === 0) { toast(`${streak} in a row!`); confetti(90); }
    else if (streak === 3) toast("3 in a row! On fire!");
  } else {
    sub = "This one will come back in a later round.";
  }
  playSound("correct");
  showMeme("good");
  updateStreak(firstTry);
  peek.classList.remove("duck");
  setMood($("peek"), "happy");
  // Ming thumps the card with his paws.
  anim($("qCard"), [{ transform: "none" }, { transform: "translateY(3px)", offset: .2 }, { transform: "none", offset: .4 }, { transform: "translateY(3px)", offset: .6 }, { transform: "none" }], { duration: 520, delay: 120 });
  const bar = $("progress");
  $("progressBar").style.transform = `scaleX(${(pos + 1) / order.length})`;
  bar.classList.remove("shine"); void bar.offsetWidth; bar.classList.add("shine");
  bar.setAttribute("aria-valuenow", pos + 1);
  setFoot("ok", pick(firstTry ? MSG.correct : MSG.recovered), sub);
  const nb = $("nextBtn");
  nb.innerHTML = pos + 1 < order.length ? "Continue" : "See results";
  nb.classList.remove("hidden", "pop"); void nb.offsetWidth; nb.classList.add("pop");
  nb.focus({ preventScroll: true });
}

async function next() {
  if (!answered || busy) return;
  busy = true;
  stopSound();
  if (pos + 1 >= order.length) { pos++; busy = false; return finishRound($("nextBtn")); }
  // Ming ducks, the card drops away, the next one falls in.
  hideMeme();
  anim($("quizCat"), [{ transform: "none" }, { transform: "translateY(105%)" }], { duration: 200, easing: "cubic-bezier(.23,1,.32,1)", fill: "forwards" });
  await Promise.all([
    anim($("qCard"), [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(30px) rotate(1.5deg) scale(.97)" }], { duration: 220, easing: "cubic-bezier(.23,1,.32,1)" }),
    anim($("options"), [{ opacity: 1 }, { opacity: 0, transform: "translateY(12px)" }], { duration: 180, easing: "ease-out" }),
  ]);
  $("quizCat").getAnimations().forEach((a) => a.cancel());
  pos++;
  renderQuestion(true);
  busy = false;
}

function finishRound(fromEl) {
  wipeTo("results", fromEl, renderResults).then(celebrate);
}

function renderResults() {
  const total = pos, pct = total ? Math.round((score / total) * 100) : 0;
  const n = TERMS.length, left = prog.queue.length, cleared = left === 0;
  renderResults.pct = pct; renderResults.cleared = cleared;
  $("resultTag").textContent = `${INFO[subject].tag} · ${retrying ? "Retry of round " : "Round "}${prog.round}`;
  $("resultCat").dataset.mood = "idle";
  $("eyebrow").textContent = total < order.length ? "Round ended early" : retrying ? "Retry complete" : "Round complete";
  const tier = cleared ? ["Bank cleared!", `You mastered all ${n} ${INFO[subject].tag} terms. Lodi!`]
    : pct >= 90 ? ["Ang galing mo!", "Almost perfect. Keep the streak going."]
    : pct >= 70 ? ["Nice round!", "Konting push na lang."]
    : pct >= 50 ? ["Pwede na!", "The missed terms will come back. Bawi ka next round."]
    : ["Review pa tayo", "Okay lang. Try the round again or keep going."];
  $("resultTitle").textContent = tier[0];
  $("resultTitle").classList.toggle("meh", pct < 70 && !cleared);
  $("resultSub").textContent = `${score} of ${total} right on the first try. ${tier[1]}`;
  $("bankSubject").textContent = `${INFO[subject].tag} question bank`;
  $("bankLeftText").textContent = `${left} left`;
  $("bankMeter").style.transform = "scaleX(0)";
  $("bankMeter").dataset.to = (n - left) / n;
  $("bankMeter").style.background = subject === "sia" ? "var(--blue)" : "var(--orange)";
  $("bankMastered").textContent = `${n - left} of ${n} terms mastered`;
  const secs = Math.round((Date.now() - startedAt) / 1000);
  $("statCorrect").textContent = score;
  $("statWrong").textContent = missed.length;
  $("statStreak").textContent = bestStreak;
  $("statTime").textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  $("stats").classList.remove("pop-stagger");
  $("nextRoundBtn").innerHTML = cleared ? icon("repeat") + "Start over" : `Next round${icon("arrow")}`;
  $("review").classList.toggle("hidden", !missed.length);
  const list = $("missedList");
  list.replaceChildren();
  missed.forEach((idx) => {
    const item = document.createElement("div");
    item.className = "review-item";
    const b = document.createElement("b"), p = document.createElement("p");
    const entry = TERMS[idx];
    b.textContent = isMatch(entry) ? entry.match : entry[0];
    p.textContent = isMatch(entry) ? entry.pairs.map(([co, use, term]) => `${co}: ${term} (${use})`).join(" · ") : entry[1];
    item.append(b, p);
    list.append(item);
  });
}

// Runs once the results screen is visible: Ming cheers, tiles pop, meter fills, confetti.
function celebrate() {
  const { pct, cleared } = renderResults;
  setMood($("resultCat"), pct >= 50 || cleared ? "happy" : "sad");
  void $("stats").offsetWidth; $("stats").classList.add("pop-stagger");
  setTimeout(() => ($("bankMeter").style.transform = `scaleX(${$("bankMeter").dataset.to})`), 300);
  if (cleared) confetti(240, 0.3);
  else if (pct >= 70 && pos) confetti(pct >= 90 ? 180 : 110, 0.3);
  setTimeout(followLook, 300);
  $("nextRoundBtn").focus({ preventScroll: true });
}

/* ---------- Wiring ---------- */
fillArt();
renderHome();
$("nextBtn").addEventListener("click", next);
$("quitBtn").addEventListener("click", () => {
  stopSound();
  hideMeme();
  if (answered) pos++;
  else if (current && current.misses) missed.pop(); // unfinished question: don't count it
  if (pos === 0) { if (!retrying) { prog.round--; saveProg(subject, prog); } wipeTo("home", $("quitBtn"), renderHome); }
  else finishRound($("quitBtn"));
});
$("nextRoundBtn").addEventListener("click", () => {
  if (!prog.queue.length) saveProg(subject, freshProg(subject));
  startRound(subject, $("nextRoundBtn"));
});
// Replay the same questions. First-try answers in the replay still count toward mastering the bank.
$("retryBtn").addEventListener("click", () => { order = shuffle(order.slice()); startRound(subject, $("retryBtn"), true); });
const goHome = (e) => wipeTo("home", e.currentTarget, renderHome);
$("homeBtn").addEventListener("click", goHome);
$("homeTopBtn").addEventListener("click", goHome);
document.fonts && document.fonts.ready.then(fitQuestion);

/* ---------- Settings: a switch runs to a random spot the first 9 times you try to turn it off ---------- */
const TEASE = ["Ayaw ko!", "Sure ka? Sayang ang vibes.", "Habol ka muna!", "Hindi mo ako mahuhuli.", "Bakit mo ako ginaganito?", "Ang kulit mo ha.", "Sige, takbo pa ako.", "Pagod na ako...", "Last na talaga?"];
const TAPS_TO_OFF = 10;
const tries = { sound: 0, memes: 0 };
const setMsg = (text) => { $("setMsg").textContent = text; anim($("setMsg"), [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out" }); };
const syncSwitches = () => document.querySelectorAll(".switch").forEach((sw) => sw.setAttribute("aria-checked", String(settings[sw.dataset.key])));
function applyTheme(fromEl) {
  const set = () => {
    document.documentElement.dataset.theme = settings.dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]').content = settings.dark ? "#15100c" : "#fff8f0";
  };
  if (!fromEl || reduceMotion || !document.startViewTransition) return set();
  const r = fromEl.getBoundingClientRect();
  document.documentElement.style.setProperty("--vt-x", r.left + r.width / 2 + "px");
  document.documentElement.style.setProperty("--vt-y", r.top + r.height / 2 + "px");
  document.startViewTransition(set);
}
applyTheme();
function sendHome(sw) { sw.style.transform = ""; sw.dx = sw.dy = 0; sw.classList.remove("fled"); }
function flee(sw) {
  // Pick a spot that keeps the whole switch on screen and is far from where it is now.
  const r = sw.getBoundingClientRect(), pad = 14;
  const homeX = r.left - (sw.dx || 0), homeY = r.top - (sw.dy || 0);
  let x, y, n = 0;
  do {
    x = pad + Math.random() * (innerWidth - r.width - pad * 2);
    y = pad + Math.random() * (innerHeight - r.height - pad * 2);
  } while (Math.hypot(x - r.left, y - r.top) < Math.min(160, innerWidth / 3) && ++n < 20);
  sw.dx = x - homeX; sw.dy = y - homeY;
  sw.classList.add("fled");
  sw.style.transform = `translate(${sw.dx}px, ${sw.dy}px) rotate(${(Math.random() * 24 - 12).toFixed(1)}deg)`;
}
document.querySelectorAll(".switch").forEach((sw) => sw.addEventListener("click", () => {
  const key = sw.dataset.key, cat = $("setCat"), name = key === "sound" ? "Sounds" : "Memes";
  // Dark mode is a normal switch: one tap, with the new colours spreading out from it.
  if ("plain" in sw.dataset) {
    settings[key] = !settings[key];
    store.set("vr_settings", JSON.stringify(settings)); syncSwitches();
    applyTheme(sw);
    setMood(cat, "happy");
    return setMsg(settings.dark ? "Dark mode on. Ang ganda!" : "Light mode on. Ang liwanag!");
  }
  if (!settings[key]) {
    settings[key] = true; tries[key] = 0;
    store.set("vr_settings", JSON.stringify(settings)); syncSwitches(); setMood(cat, "happy");
    return setMsg(`Yay! ${name} are back.`);
  }
  tries[key]++;
  if (tries[key] < TAPS_TO_OFF) {
    flee(sw); setMood(cat, "sad");
    return setMsg(TEASE[(tries[key] - 1) % TEASE.length]);
  }
  settings[key] = false; tries[key] = 0;
  if (key === "sound") stopSound();
  store.set("vr_settings", JSON.stringify(settings)); syncSwitches(); sendHome(sw); setMood(cat, "sad");
  setMsg(key === "sound" ? "Fine. Sounds off. Ang tahimik..." : "Fine. No more memes. Boring.");
}));
function openSettings() {
  syncSwitches();
  $("settings").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("setCat").dataset.mood = "idle";
  $("setMsg").textContent = "Sounds and memes make the review fun. Sure ka?";
  anim(document.querySelector(".settings-card"), [{ opacity: 0, transform: "scale(.85) translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)" });
  $("swSound").focus();
}
function closeSettings() {
  document.querySelectorAll(".switch").forEach(sendHome);
  tries.sound = tries.memes = 0;
  $("settings").classList.add("hidden");
  document.body.style.overflow = "";
  $("settingsBtn").focus();
}
$("settingsBtn").addEventListener("click", openSettings);
$("settingsDone").addEventListener("click", closeSettings);
$("settingsClose").addEventListener("click", closeSettings);
$("settings").addEventListener("click", (e) => { if (e.target === $("settings")) closeSettings(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("settings").classList.contains("hidden")) closeSettings(); });

document.addEventListener("keydown", (e) => {
  if ($("quiz").classList.contains("hidden") || e.ctrlKey || e.metaKey || e.altKey) return;
  if (!answered && !current.match && e.key >= "1" && e.key <= "4") answer(+e.key - 1);
  else if (answered && e.key === "Enter" && document.activeElement !== $("nextBtn")) { e.preventDefault(); next(); }
});
