export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

export function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN').format(value)
}
