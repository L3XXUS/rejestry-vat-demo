export type RegisterKind = 'sales' | 'purchases'
export type DemoState = 'data' | 'empty' | 'error'
export type VatRate = '23%' | '8%' | 'np'
export type SortKey = 'counterparty' | 'date' | 'number' | 'ksef' | 'id'
export type SortDir = 'asc' | 'desc'
export type ColumnKey = SortKey

export interface Doc {
  id: string
  counterparty: string
  date: string // YYYY-MM-DD
  number: string
  ksef: string | null // null = brak potwierdzenia
  operation: string
  jpk: string
  series: string
  rate: VatRate
  net: number
  vat: number
}

export interface Filters {
  year: string
  month: string // '1'..'12' | 'all'
  operation: string
  jpk: string
  series: string[]
  labels: string[]
  q: string
}
