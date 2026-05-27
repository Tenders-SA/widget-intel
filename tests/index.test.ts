import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getBaseUrl,
  esc,
  STATUS_COLORS,
  STATUS_LABELS,
  POLL_INTERVAL,
  WIDGET_ATTR,
} from '../src/api'
import { sharedStyles, badgeStyles, healthBarStyles, feedStyles, tickerStyles, heatmapStyles } from '../src/styles'

function createScriptTag(src: string): HTMLScriptElement {
  const s = document.createElement('script')
  s.setAttribute('src', src)
  return s
}

describe('api', () => {
  describe('getBaseUrl', () => {
    afterEach(() => {
      document.querySelectorAll('script[src*="widget-intel"]').forEach((s) => s.remove())
    })

    it('returns empty string when no intel script is found', () => {
      expect(getBaseUrl()).toBe('')
    })

    it('extracts origin from script src attribute', () => {
      const script = createScriptTag('https://unpkg.com/@tenders-sa-org/widget-intel@latest/dist/widget-intel.global.js')
      document.head.appendChild(script)
      expect(getBaseUrl()).toBe('https://unpkg.com')
      script.remove()
    })

    it('handles relative URLs', () => {
      const script = createScriptTag('/widgets/widget-intel.js')
      document.head.appendChild(script)
      const result = getBaseUrl()
      expect(result).toBe('')
      script.remove()
    })
  })

  describe('esc', () => {
    it('escapes HTML special characters', () => {
      expect(esc('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;')
    })

    it('returns safe string unchanged', () => {
      expect(esc('Gauteng')).toBe('Gauteng')
    })

    it('handles ampersands', () => {
      expect(esc('A & B')).toBe('A &amp; B')
    })
  })

  describe('constants', () => {
    it('has POLL_INTERVAL of 5 minutes', () => {
      expect(POLL_INTERVAL).toBe(300000)
    })

    it('defines WIDGET_ATTR', () => {
      expect(WIDGET_ATTR).toBe('data-tsa-widget')
    })

    it('defines STATUS_COLORS for all statuses', () => {
      expect(STATUS_COLORS.HEALTHY).toBe('#22c55e')
      expect(STATUS_COLORS.CAUTION).toBe('#eab308')
      expect(STATUS_COLORS.ALERT).toBe('#f97316')
      expect(STATUS_COLORS.CRITICAL).toBe('#ef4444')
    })

    it('defines STATUS_LABELS for all statuses', () => {
      expect(STATUS_LABELS.HEALTHY).toBe('HEALTHY')
      expect(STATUS_LABELS.CAUTION).toBe('CAUTION')
      expect(STATUS_LABELS.ALERT).toBe('ALERT')
      expect(STATUS_LABELS.CRITICAL).toBe('CRITICAL')
    })
  })
})

describe('styles', () => {
  it('sharedStyles returns CSS with style tag', () => {
    const css = sharedStyles('light')
    expect(css).toContain('<style>')
    expect(css).toContain('</style>')
    expect(css).toContain('.tsa-widget')
    expect(css).toContain('.tsa-loading')
    expect(css).toContain('.tsa-error')
  })

  it('sharedStyles dark theme produces different CSS', () => {
    const light = sharedStyles('light')
    const dark = sharedStyles('dark')
    expect(light).not.toBe(dark)
    expect(dark).toContain('#1e293b')
  })

  it('badgeStyles returns CSS with badge-specific classes', () => {
    const css = badgeStyles('light')
    expect(css).toContain('.tsa-badge-wrapper')
    expect(css).toContain('.tsa-score-circle')
    expect(css).toContain('.tsa-status-badge')
  })

  it('healthBarStyles returns CSS with health bar classes', () => {
    const css = healthBarStyles('light')
    expect(css).toContain('.tsa-heath-bar-wrapper')
    expect(css).toContain('.tsa-heath-bar-track')
    expect(css).toContain('.tsa-heath-bar-fill')
  })

  it('feedStyles returns CSS with feed classes', () => {
    const css = feedStyles()
    expect(css).toContain('.tsa-feed-wrapper')
    expect(css).toContain('.tsa-feed-item')
    expect(css).toContain('.tsa-feed-title')
  })

  it('tickerStyles returns CSS with ticker animation', () => {
    const css = tickerStyles()
    expect(css).toContain('.tsa-ticker-track')
    expect(css).toContain('tsa-ticker-scroll')
  })

  it('heatmapStyles returns CSS with grid layout', () => {
    const css = heatmapStyles()
    expect(css).toContain('.tsa-heatmap-grid')
    expect(css).toContain('grid-template-columns: 1fr 1fr')
    expect(css).toContain('.tsa-heatmap-cell')
  })
})

describe('widget exports', () => {
  it('imports all widget classes without error', async () => {
    // Can't easily test DOM-dependent classes without jsdom, but we can verify the module loads
    const mod = await import('../src/index')
    expect(mod.TsaWidgetBase).toBeDefined()
    expect(mod.TsaBadge).toBeDefined()
    expect(mod.TsaHealthBar).toBeDefined()
    expect(mod.TsaFeed).toBeDefined()
    expect(mod.TsaTicker).toBeDefined()
    expect(mod.TsaHeatmap).toBeDefined()
    expect(mod.WIDGET_MAP).toBeDefined()
    expect(mod.init).toBeDefined()
    expect(mod.scanWidgets).toBeDefined()
  })

  it('WIDGET_MAP has all 5 widget types', async () => {
    const mod = await import('../src/index')
    expect(Object.keys(mod.WIDGET_MAP)).toHaveLength(5)
    expect(mod.WIDGET_MAP['province-health-badge']).toBe(mod.TsaBadge)
    expect(mod.WIDGET_MAP['province-health-bar']).toBe(mod.TsaHealthBar)
    expect(mod.WIDGET_MAP['intelligence-feed']).toBe(mod.TsaFeed)
    expect(mod.WIDGET_MAP['ticker']).toBe(mod.TsaTicker)
    expect(mod.WIDGET_MAP['province-heatmap']).toBe(mod.TsaHeatmap)
  })
})
