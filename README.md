# @tenders-sa-org/widget-intel

**Tenders-SA Intelligence Widgets** — Shadow DOM-based embeddable procurement intelligence widgets. Vanilla JS, zero framework dependencies, self-initializing.

## Installation

### Script tag (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@tenders-sa-org/widget-intel@latest/dist/widget-intel.global.js" async></script>
```

### npm

```bash
npm install @tenders-sa-org/widget-intel
```

Then import and call `init()`:

```js
import { init } from '@tenders-sa-org/widget-intel'
init()
```

## Widget Types

| Type                    | Description                          | Attribute Value           |
|-------------------------|--------------------------------------|---------------------------|
| Province Health Badge   | Single province health score circle  | `province-health-badge`   |
| Province Health Bar     | Horizontal bars for multiple provinces| `province-health-bar`     |
| Intelligence Feed       | Scrolling list of intelligence items | `intelligence-feed`       |
| Ticker                  | Horizontal scrolling headlines       | `ticker`                  |
| Province Heatmap        | Grid of all province health scores   | `province-heatmap`        |

## Usage

Place any element with `data-tsa-widget` and `data-token` attributes anywhere on your page. The widget auto-initializes on DOMContentLoaded.

### Province Health Badge

Shows a single province's health score as a color-coded circle with status label.

```html
<div
  data-tsa-widget="province-health-badge"
  data-token="pub_your_token_here"
  data-theme="light"
></div>
```

Supports `data-province` to specify which province (optional — backend resolves from token).

### Province Health Bar

Renders horizontal health bars for multiple provinces. Color-coded by status.

```html
<div
  data-tsa-widget="province-health-bar"
  data-token="pub_your_token_here"
  data-provinces="GP,WC,KZN"
  data-theme="light"
></div>
```

### Intelligence Feed

Displays a feed of procurement intelligence items with title, source, category, and date.

```html
<div
  data-tsa-widget="intelligence-feed"
  data-token="pub_your_token_here"
  data-theme="dark"
></div>
```

### Ticker

Horizontal scrolling ticker of procurement headlines. Pauses on hover.

```html
<div
  data-tsa-widget="ticker"
  data-token="pub_your_token_here"
  data-theme="light"
></div>
```

### Province Heatmap

Shows all province health scores in a responsive grid, color-coded by status.

```html
<div
  data-tsa-widget="province-heatmap"
  data-token="pub_your_token_here"
  data-theme="dark"
></div>
```

## Attributes

| Attribute           | Required | Default  | Description                                    |
|---------------------|----------|----------|------------------------------------------------|
| `data-tsa-widget`   | yes      | —        | Widget type identifier                         |
| `data-token`        | yes      | —        | Publisher token (prefixed `pub_`)              |
| `data-theme`        | no       | `light`  | Theme: `light` or `dark`                       |
| `data-provinces`    | no       | —        | Comma-separated province codes (`GP,WC,KZN`)   |

## JavaScript API

```js
import { init, scanWidgets, TsaBadge, TsaHealthBar, TsaFeed, TsaTicker, TsaHeatmap } from '@tenders-sa-org/widget-intel'

// Manually re-scan for widgets
scanWidgets()

// Initialize (same as auto-init)
init()
```

## Theming

All widgets support `light` and `dark` themes via the `data-theme` attribute. Theme-aware variables are scoped inside Shadow DOM — no global style leakage.

## Impression Tracking

Widgets automatically send a one-time POST impression event to the API on first successful data load.

## Polling

Widgets poll the API every 5 minutes for updated data. Polling automatically refetches and re-renders.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

Requires Shadow DOM v1 and `CustomEvent` support.

## Development

```bash
# Install
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Test
npm run test
```

## License

MIT
