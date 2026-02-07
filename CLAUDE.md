# Memento Vivere — Vanilla JS Web App

## What is this?
A static web app converted from a Streamlit Python app (`~/reposmy/memento/memento.py`).
It takes a user's date of birth and shows 3 tabs: cosmic distance traveled, dayversaries, and a Memento Mori life calendar (Plotly heatmap).

## Tech Stack
- Vanilla HTML/CSS/JS — no framework, no build tools, no backend
- ES6 modules (browser-native `import`/`export`)
- Plotly.js v2.35.2 via CDN (heatmap chart)
- PWA with service worker for offline support

## File Structure
```
index.html           — Single page: form + 3-tab navigation
css/style.css        — Dark theme (#0E1117 bg, #FF6B35 accent), responsive
js/constants.js      — Physical/time constants
js/calculations.js   — Pure functions (no DOM): daysAlive, cosmicDistance, buildCalendarMatrix, etc.
js/chart.js          — Plotly heatmap rendering (renderMementoMori)
js/app.js            — Entry point: event handlers, DOM updates, orchestration
sw.js                — Service worker (cache-first offline)
static/manifest.json — PWA manifest
static/icon-*.png    — PWA icons
images/              — galaxy.jpg, ants.jpg, cell.gif
```

## How to run locally
```bash
npx serve .
```
Then open http://localhost:3000. (ES6 modules require a server — `file://` won't work.)

## Design Rules
- `calculations.js` must stay pure — no DOM access, only math and dates
- `app.js` is the only file that reads/writes the DOM
- `chart.js` depends only on `calculations.js` + the Plotly global
- Keep it vanilla — no npm dependencies, no build step
- The original Streamlit app in `~/reposmy/memento/` must stay untouched
