export const POLL_INTERVAL = 300_000
export const WIDGET_ATTR = 'data-tsa-widget'

export const STATUS_COLORS: Record<string, string> = {
  HEALTHY: '#22c55e',
  CAUTION: '#eab308',
  ALERT: '#f97316',
  CRITICAL: '#ef4444',
}

export const STATUS_LABELS: Record<string, string> = {
  HEALTHY: 'HEALTHY',
  CAUTION: 'CAUTION',
  ALERT: 'ALERT',
  CRITICAL: 'CRITICAL',
}

export interface BadgeData {
  province: string
  provinceName: string
  score: number
  status: string
  updatedAt: string
}

export interface HealthBarProvince {
  code: string
  name: string
  score: number
  status: string
}

export interface FeedItem {
  id: string
  title: string
  source: string
  category: string
  publishedAt: string
  url: string
}

export interface TickerItem {
  category: string
  title: string
  url: string
}

export interface WidgetApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export function getBaseUrl(): string {
  const scripts = document.querySelectorAll('script[src*="widget-intel"]')
  if (scripts.length > 0) {
    const src = scripts[0].getAttribute('src') || ''
    const match = src.match(/(https?:\/\/[^/]+)/)
    if (match) return match[1]
  }
  return ''
}

export function esc(str: string): string {
  const el = document.createElement('span')
  el.textContent = str
  return el.innerHTML
}
