# etonia.io

The Etonia website: Next.js (App Router), exported as a static site and served by GitHub Pages at **etonia.io**.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Assets

Everything in `public/tonia`, `public/screens`, `public/brand`, `app/icon.png`, `app/apple-icon.png`,
`app/favicon.ico` and `app/opengraph-image.png` is generated from the app repository (`../Etonia`):

```
# 1. re-render the app screenshots in the current design (in ../Etonia)
flutter test tool/generate_screenshots_test.dart
# 2. rebuild the web assets (here)
npm run assets          # = python scripts/build_assets.py [path/to/Etonia]
```

## Tonia

- `components/Tonia.tsx` plays the app's 12 fps Tonia loops from sprite sheets.
- `components/ToniaHero.tsx` greets visitors in the hero (tap her).
- `components/ToniaGuide.tsx` is the tour guide who follows the reader down the page. Sections opt in with
  `data-guide="<id>"`; demos talk to her through `cueGuide()` in `lib/guide.ts`.
- `components/Waitlist.tsx` has the Tonia who pops up over the sign-up card and celebrates sign-ups.

## Legal

`content/legal/*.md` render at `/support/`, `/privacy/` and `/terms/` (and the old `/legal/...` paths).
