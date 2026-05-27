export function sharedStyles(theme: string): string {
  const isDark = theme === 'dark'
  const bg = isDark ? '#1e293b' : '#ffffff'
  const text = isDark ? '#f1f5f9' : '#1e293b'
  const muted = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#e2e8f0'
  const cardBg = isDark ? '#0f172a' : '#f8fafc'

  return `
<style>
:host {
  all: initial;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.tsa-widget {
  background: ${bg};
  color: ${text};
  border: 1px solid ${border};
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
}
.tsa-card {
  background: ${cardBg};
  border: 1px solid ${border};
  border-radius: 8px;
  padding: 12px;
}
.tsa-muted { color: ${muted}; font-size: 12px; }
.tsa-loading { color: ${muted}; font-size: 13px; padding: 20px; text-align: center; }
.tsa-error { color: ${muted}; font-size: 13px; padding: 12px; text-align: center; }
.tsa-empty { color: ${muted}; font-size: 13px; padding: 20px; text-align: center; }
@keyframes tsa-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.tsa-animate {
  animation: tsa-fade-in 0.3s ease-out;
}
</style>`
}

export function badgeStyles(_theme: string): string {
  return `
.tsa-badge-wrapper { text-align: center; }
.tsa-province-name {
  font-size: 14px; font-weight: 600; margin-bottom: 12px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.tsa-score-circle {
  width: 80px; height: 80px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  margin: 0 auto 12px; font-size: 28px; font-weight: 700; color: #fff;
  transition: background 0.3s ease;
}
.tsa-status-badge {
  font-size: 12px; font-weight: 700; letter-spacing: 1px;
  padding: 4px 12px; border-radius: 4px; display: inline-block; margin-bottom: 8px;
}
.tsa-label { font-size: 11px; margin-top: 4px; }
.tsa-updated {
  font-size: 10px; margin-top: 8px; opacity: 0.6;
}`
}

export function healthBarStyles(theme: string): string {
  const isDark = theme === 'dark'
  const barBg = isDark ? '#334155' : '#e2e8f0'

  return `
.tsa-heath-bar-wrapper { text-align: left; }
.tsa-heath-bar-header {
  font-size: 14px; font-weight: 600; margin-bottom: 16px;
  text-transform: uppercase; letter-spacing: 0.5px; text-align: center;
}
.tsa-heath-bar-item { margin-bottom: 14px; }
.tsa-heath-bar-item:last-child { margin-bottom: 0; }
.tsa-heath-bar-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 4px;
}
.tsa-heath-bar-name {
  font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
}
.tsa-heath-bar-score { font-size: 12px; font-weight: 700; }
.tsa-heath-bar-track {
  height: 8px; background: ${barBg}; border-radius: 4px; overflow: hidden;
}
.tsa-heath-bar-fill {
  height: 100%; border-radius: 4px; transition: width 0.6s ease;
}`
}

export function feedStyles(): string {
  return `
.tsa-feed-wrapper { text-align: left; }
.tsa-feed-header {
  font-size: 14px; font-weight: 600; margin-bottom: 16px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.tsa-feed-list { list-style: none; }
.tsa-feed-item {
  padding: 10px 0; border-bottom: 1px solid var(--tsa-border, #e2e8f0);
  transition: background 0.15s ease;
}
.tsa-feed-item:last-child { border-bottom: none; }
.tsa-feed-title {
  font-size: 13px; font-weight: 600; margin-bottom: 4px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tsa-feed-meta { font-size: 11px; display: flex; gap: 8px; flex-wrap: wrap; }
.tsa-feed-source { opacity: 0.7; }
.tsa-feed-category {
  font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;
}
.tsa-feed-date { opacity: 0.5; }`
}

export function tickerStyles(): string {
  return `
.tsa-ticker-wrapper {
  overflow: hidden; white-space: nowrap; width: 100%;
  padding: 0 4px;
}
.tsa-ticker-header {
  font-size: 12px; font-weight: 600; margin-bottom: 8px;
  text-transform: uppercase; letter-spacing: 0.5px; text-align: center;
}
.tsa-ticker-track {
  display: inline-block; white-space: nowrap;
  animation: tsa-ticker-scroll 30s linear infinite;
  padding-right: 40px;
}
.tsa-ticker-track:hover { animation-play-state: paused; }
.tsa-ticker-item {
  display: inline-block; margin-right: 36px; font-size: 13px;
  vertical-align: middle;
}
.tsa-ticker-category {
  font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;
  margin-right: 6px;
}
.tsa-ticker-title { opacity: 0.85; }
@keyframes tsa-ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes tsa-ticker-fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.tsa-ticker-empty {
  text-align: center; padding: 12px; font-size: 13px; opacity: 0.6;
}`
}

export function heatmapStyles(): string {
  return `
.tsa-heatmap-wrapper { text-align: left; }
.tsa-heatmap-header {
  font-size: 14px; font-weight: 600; margin-bottom: 16px;
  text-transform: uppercase; letter-spacing: 0.5px; text-align: center;
}
.tsa-heatmap-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.tsa-heatmap-cell {
  padding: 10px 12px; border-radius: 8px; text-align: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.tsa-heatmap-cell:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.tsa-heatmap-cell-name {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.3px; margin-bottom: 4px;
}
.tsa-heatmap-cell-score {
  font-size: 18px; font-weight: 700;
}
.tsa-heatmap-cell-status {
  font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; margin-top: 2px;
}`
}
