import type { ColumnKey } from './types'

export const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'counterparty', label: 'Kontrahent' },
  { key: 'date', label: 'Data' },
  { key: 'number', label: 'Numer dokumentu' },
  { key: 'ksef', label: 'Numer KSeF' },
  { key: 'id', label: 'Identyfikator' },
]

export interface ColumnConfig {
  order: ColumnKey[]
  hidden: ColumnKey[]
}

export const DEFAULT_COLUMNS: ColumnConfig = {
  order: COLUMNS.map((c) => c.key),
  hidden: [],
}
