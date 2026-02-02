# Lucky Seven 🎲 Game Dashboard

A Party Crashers–style game dashboard for the **Lucky Seven** dice game. Built for projector/classroom use (16:9, large text, touch-friendly).

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173/** in your browser.

## Build for production

```bash
npm run build
npm run preview   # optional: serve dist/
```

## Features

- **Top bar**: Round counter (e.g. ROUND 5/10), title, sound toggle, reset, rounds progress bar
- **Left column – Scoreboard**: 4 table cards with chip counts; leading table and last winner highlighted
- **Center – Round flow**:
  1. **Selection**: Pick champion (1–4) and selection roll (1–6; 5–6 = reroll), then “LET’S ROLL!”
  2. **Competition**: Enter two dice per table; auto sum and distance from 7; “REVEAL WINNER”
  3. **Winner**: Celebration card, confetti, “AWARD CHIPS” then “NEXT ROUND ➜”
- **Right column**: Selection frequency grid, game stats (times 7, streaks, Fair Game Index), dice probability chart, Export CSV
- **Game over**: After 10 rounds, final scoreboard and “Play Again”
- **Keyboard**: `Space` = next round (when chips awarded), `R` = reset (with confirm), `M` = mute
- **Persistence**: Game state saved to `localStorage`; survives refresh

## Tech stack

- React 19 + Vite 7
- Framer Motion (animations)
- canvas-confetti (celebrations)
- CSS (gradients, table colors, typography)

## Table colors

- Table 1: Hot Pink `#ff006e`
- Table 2: Electric Blue `#00f5ff`
- Table 3: Neon Yellow `#ffbe0b`
- Table 4: Lime Green `#06ffa5`

Enjoy the game show vibes.
