# @tenders-sa-org/widget-intel — Agent Instructions

**Path**: `widgets/widget-intel/` | **Published**: [npm](https://npmjs.com/package/@tenders-sa-org/widget-intel)

## What It Is
Most complex widget — 5 embeddable sub-widgets (Badge, HealthBar, Feed, Ticker, Heatmap) for procurement intelligence. Uses Shadow DOM, auto-polling, and impression tracking.

## Quick Start
```bash
npm install
npm run build     # tsup: esm + iife (global: TendersaIntel)
npm test          # vitest (jsdom)
npm version patch && npm publish   # manual publish
```

## Key Files
| File | Purpose |
|------|---------|
| `src/index.ts` | 5 sub-classes extending `TsaWidgetBase` (372 lines) |
| `src/api.ts` | Data URLs, status colors, polling interval |
| `src/styles.ts` | Per-widget CSS template strings |

## Architecture Notes
- **Uses Shadow DOM** (`el.attachShadow({ mode: 'open' })`) — unlike all other widgets
- **5 widget types** in one package: `province-health-badge`, `province-health-bar`, `intelligence-feed`, `ticker`, `province-heatmap`
- **Auto-registers** via `[data-tsa-widget]` attribute + `MutationObserver`
- **Polling**: auto-polls every `POLL_INTERVAL` for live data
- **Impression tracking**: `POST /api/intelligence/embed/{token}/impression`
- Uses `credentials: 'omit'` (public embed, no auth)
- Strict tsconfig: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`

## Published
- v0.1.1 (current — highest of all widgets)
