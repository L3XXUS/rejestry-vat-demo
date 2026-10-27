import type { Doc, Filters, SortDir, SortKey, VatRate } from './types'

export const DEFAULT_FILTERS: Filters = {
  year: '2026',
  month: '10',
  operation: 'all',
  jpk: 'all',
  series: [],
  labels: [],
  q: '',
}

/** Liczba aktywnych filtrów w panelu „Filtry” (bez okresu i wyszukiwarki). */
export const panelFilterCount = (f: Filters) =>
  (f.operation !== 'all' ? 1 : 0) + (f.jpk !== 'all' ? 1 : 0) + (f.series.length ? 1 : 0) + (f.labels.length ? 1 : 0)

export const isDefaultPeriod = (f: Filters) => f.year === DEFAULT_FILTERS.year && f.month === DEFAULT_FILTERS.month

export function applyFilters(docs: Doc[], f: Filters, assigned: Record<string, string[]> = {}): Doc[] {
  const q = f.q.trim().toLowerCase()
  return docs.filter((d) => {
    const [y, m] = d.date.split('-')
    if (y !== f.year) return false
    if (f.month !== 'all' && String(Number(m)) !== f.month) return false
    if (f.operation !== 'all' && d.operation !== f.operation) return false
    if (f.jpk !== 'all' && d.jpk !== f.jpk) return false
    if (f.series.length && !f.series.includes(d.series)) return false
    if (f.labels.length && !f.labels.some((l) => assigned[d.id]?.includes(l))) return false
    if (q) {
      const hay = `${d.counterparty} ${d.number} ${d.id} ${d.ksef ?? ''} ${d.date}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function sortDocs(docs: Doc[], key: SortKey, dir: SortDir): Doc[] {
  const get = (d: Doc) =>
    key === 'counterparty' ? d.counterparty
    : key === 'date' ? d.date
    : key === 'number' ? d.number
    : key === 'ksef' ? (d.ksef ? '1' : '0')
    : d.id
  const mul = dir === 'asc' ? 1 : -1
  return [...docs].sort((a, b) => mul * get(a).localeCompare(get(b), 'pl', { numeric: true }))
}

export function totals(docs: Doc[]) {
  const net = docs.reduce((s, d) => s + d.net, 0)
  const vat = docs.reduce((s, d) => s + d.vat, 0)
  const byRate: Record<VatRate, number> = { '23%': 0, '8%': 0, np: 0 }
  for (const d of docs) byRate[d.rate] += d.vat
  const base: Record<VatRate, number> = { '23%': 0, '8%': 0, np: 0 }
  for (const d of docs) base[d.rate] += d.net
  return { net, vat, gross: net + vat, byRate, base }
}
