import {
  POLL_INTERVAL,
  WIDGET_ATTR,
  STATUS_COLORS,
  STATUS_LABELS,
  type BadgeData,
  type HealthBarProvince,
  type FeedItem,
  type TickerItem,
  type WidgetApiResponse,
  getBaseUrl,
  esc,
} from './api'
import {
  sharedStyles,
  badgeStyles,
  healthBarStyles,
  feedStyles,
  tickerStyles,
  heatmapStyles,
} from './styles'

/* ── Base Widget Class ─────────────────────────────────── */

class TsaWidgetBase {
  el!: HTMLElement
  token!: string
  theme!: string
  baseUrl!: string
  shadow!: ShadowRoot
  _impressionSent: boolean = false
  _pollTimer: ReturnType<typeof setInterval> | null = null

  init(el: HTMLElement): void {
    this.el = el
    this.token = el.dataset.token || ''
    this.theme = el.dataset.theme || 'light'
    this.baseUrl = getBaseUrl()
    this.shadow = el.attachShadow({ mode: 'open' })
    this._impressionSent = false
    this._pollTimer = null
    this.render()
    this.fetchData()
    this.startPolling()
  }

  render(): void {
    this.shadow.innerHTML = this.getStyles() + this.getLoadingHtml()
  }

  getStyles(): string {
    return sharedStyles(this.theme)
  }

  getLoadingHtml(): string {
    return '<div class="tsa-widget"><div class="tsa-loading">Loading\u2026</div></div>'
  }

  fetchData(): void {
    const url = `${this.baseUrl}/api/intelligence/embed/${this.token}/data`

    fetch(url, { credentials: 'omit' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<WidgetApiResponse<unknown>>
      })
      .then((json) => {
        this.onData(json)
        if (!this._impressionSent) {
          this._impressionSent = true
          this.sendImpression()
        }
      })
      .catch(() => {
        this.onError()
      })
  }

  onData(_json: WidgetApiResponse<unknown>): void {
    // Override in subclass
  }

  onError(): void {
    const widget = this.shadow.querySelector('.tsa-widget')
    if (widget) {
      widget.innerHTML = '<div class="tsa-error">Widget unavailable</div>'
    }
  }

  startPolling(): void {
    this._pollTimer = setInterval(() => {
      this.fetchData()
    }, POLL_INTERVAL)
  }

  sendImpression(): void {
    const url = `${this.baseUrl}/api/intelligence/embed/${this.token}/impression`
    fetch(url, { method: 'POST', credentials: 'omit' }).catch(() => {})
  }

  extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  setWidgetContent(html: string): void {
    const widget = this.shadow.querySelector('.tsa-widget')
    if (widget) {
      widget.innerHTML = html
    }
  }
}

/* ── Province Health Badge Widget ──────────────────────── */

class TsaBadge extends TsaWidgetBase {
  override getStyles(): string {
    return sharedStyles(this.theme) + badgeStyles(this.theme)
  }

  override onData(json: WidgetApiResponse<unknown>): void {
    const d = json.data as BadgeData | undefined
    if (!d) {
      this.setWidgetContent('<div class="tsa-error">No data available</div>')
      return
    }

    const color = STATUS_COLORS[d.status] || STATUS_COLORS.ALERT
    const label = STATUS_LABELS[d.status] || d.status
    const isDark = this.theme === 'dark'
    const statusBg = isDark ? `${color}22` : `${color}18`

    const html = `
<div class="tsa-badge-wrapper tsa-animate">
  <div class="tsa-province-name">${esc(d.provinceName)}</div>
  <div class="tsa-score-circle" style="background:${color}">${d.score}</div>
  <div class="tsa-status-badge" style="background:${statusBg};color:${color}">${label}</div>
  <div class="tsa-label tsa-muted">Province Health</div>
  <div class="tsa-updated tsa-muted">Updated ${formatDate(d.updatedAt)}</div>
</div>`

    this.setWidgetContent(html)
  }
}

/* ── Province Health Bar Widget ────────────────────────── */

class TsaHealthBar extends TsaWidgetBase {
  override getStyles(): string {
    return sharedStyles(this.theme) + healthBarStyles(this.theme)
  }

  override onData(json: WidgetApiResponse<unknown>): void {
    const data = json.data as HealthBarProvince[] | undefined
    if (!data || data.length === 0) {
      this.setWidgetContent('<div class="tsa-empty">No province health data available</div>')
      return
    }

    const items = data.map((p) => {
      const color = STATUS_COLORS[p.status] || STATUS_COLORS.ALERT
      return `
<div class="tsa-heath-bar-item tsa-animate">
  <div class="tsa-heath-bar-row">
    <span class="tsa-heath-bar-name">${esc(p.name)}</span>
    <span class="tsa-heath-bar-score" style="color:${color}">${p.score}</span>
  </div>
  <div class="tsa-heath-bar-track">
    <div class="tsa-heath-bar-fill" style="width:${p.score}%;background:${color}"></div>
  </div>
</div>`
    }).join('')

    const html = `
<div class="tsa-heath-bar-wrapper">
  <div class="tsa-heath-bar-header">Province Health</div>
  ${items}
</div>`

    this.setWidgetContent(html)
  }
}

/* ── Intelligence Feed Widget ──────────────────────────── */

class TsaFeed extends TsaWidgetBase {
  override getStyles(): string {
    return sharedStyles(this.theme) + feedStyles()
  }

  override onData(json: WidgetApiResponse<unknown>): void {
    const data = json.data as FeedItem[] | undefined
    if (!data || data.length === 0) {
      this.setWidgetContent('<div class="tsa-empty">No intelligence items available</div>')
      return
    }

    const items = data.map((item) => `
<li class="tsa-feed-item tsa-animate">
  <div class="tsa-feed-title">${esc(item.title)}</div>
  <div class="tsa-feed-meta">
    <span class="tsa-feed-source">${esc(item.source)}</span>
    <span class="tsa-feed-category" style="color:${STATUS_COLORS.HEALTHY}">${esc(item.category)}</span>
    <span class="tsa-feed-date">${formatDate(item.publishedAt)}</span>
  </div>
</li>`).join('')

    const html = `
<div class="tsa-feed-wrapper">
  <div class="tsa-feed-header">Intelligence Feed</div>
  <ul class="tsa-feed-list">${items}</ul>
</div>`

    this.setWidgetContent(html)
  }
}

/* ── Ticker Widget ─────────────────────────────────────── */

class TsaTicker extends TsaWidgetBase {
  override getStyles(): string {
    return sharedStyles(this.theme) + tickerStyles()
  }

  override onData(json: WidgetApiResponse<unknown>): void {
    const data = json.data as TickerItem[] | undefined
    if (!data || data.length === 0) {
      this.setWidgetContent('<div class="tsa-ticker-empty">No headlines available</div>')
      return
    }

    const items = data.map((item) => `
<span class="tsa-ticker-item">
  <span class="tsa-ticker-category">${esc(item.category)}</span>
  <span class="tsa-ticker-title">${esc(item.title)}</span>
</span>`).join('')

    const html = `
<div class="tsa-ticker-wrapper">
  <div class="tsa-ticker-header">Procurement Intelligence</div>
  <div class="tsa-ticker-track">${items}${items}</div>
</div>`

    this.setWidgetContent(html)
  }
}

/* ── Province Heatmap Widget ───────────────────────────── */

class TsaHeatmap extends TsaWidgetBase {
  override getStyles(): string {
    return sharedStyles(this.theme) + heatmapStyles()
  }

  override onData(json: WidgetApiResponse<unknown>): void {
    const data = json.data as HealthBarProvince[] | undefined
    if (!data || data.length === 0) {
      this.setWidgetContent('<div class="tsa-empty">No heatmap data available</div>')
      return
    }

    const cells = data.map((p) => {
      const color = STATUS_COLORS[p.status] || STATUS_COLORS.ALERT
      const label = STATUS_LABELS[p.status] || p.status
      const isDark = this.theme === 'dark'
      const bg = isDark ? `${color}22` : `${color}14`

      return `
<div class="tsa-heatmap-cell tsa-animate" style="background:${bg}">
  <div class="tsa-heatmap-cell-name" style="color:${color}">${esc(p.name)}</div>
  <div class="tsa-heatmap-cell-score" style="color:${color}">${p.score}</div>
  <div class="tsa-heatmap-cell-status" style="color:${color}">${label}</div>
</div>`
    }).join('')

    const html = `
<div class="tsa-heatmap-wrapper">
  <div class="tsa-heatmap-header">Province Health Map</div>
  <div class="tsa-heatmap-grid">${cells}</div>
</div>`

    this.setWidgetContent(html)
  }
}

/* ── Widget Registry & Auto-init ───────────────────────── */

const WIDGET_MAP: Record<string, typeof TsaWidgetBase> = {
  'province-health-badge': TsaBadge,
  'province-health-bar': TsaHealthBar,
  'intelligence-feed': TsaFeed,
  'ticker': TsaTicker,
  'province-heatmap': TsaHeatmap,
}

function initWidget(el: HTMLElement): void {
  const type = el.dataset.tsaWidget
  const WidgetClass = WIDGET_MAP[type ?? '']
  if (!WidgetClass) return
  if ((el as HTMLInputElement & { _tsaInit?: boolean })._tsaInit) return
  ;(el as HTMLInputElement & { _tsaInit?: boolean })._tsaInit = true
  const widget = new (WidgetClass as new () => TsaWidgetBase)()
  widget.init(el)
}

function scanWidgets(): void {
  document.querySelectorAll<HTMLElement>(`[${WIDGET_ATTR}]`).forEach(initWidget)
}

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

/* ── Public init function ──────────────────────────────── */

function init(): void {
  scanWidgets()
}

/* ── Auto-init ─────────────────────────────────────────── */

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanWidgets)
  } else {
    scanWidgets()
  }

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue
          const el = node as HTMLElement
          if (el.hasAttribute?.(WIDGET_ATTR)) {
            initWidget(el)
          }
          if (el.querySelectorAll) {
            el.querySelectorAll<HTMLElement>(`[${WIDGET_ATTR}]`).forEach(initWidget)
          }
        }
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
  }
}

/* ── Exports ───────────────────────────────────────────── */

export {
  TsaWidgetBase,
  TsaBadge,
  TsaHealthBar,
  TsaFeed,
  TsaTicker,
  TsaHeatmap,
  WIDGET_MAP,
  init,
  scanWidgets,
}

export type { BadgeData, HealthBarProvince, FeedItem, TickerItem, WidgetApiResponse } from './api'
