export type ViewId = 'overview' | 'vat' | 'kpir' | 'ryczalt' | 'books' | 'assets' | 'checks'

export interface Condition { label: string; key: 'period' | 'other' }
export interface Area {
  id: Exclude<ViewId, 'overview'>
  name: string
  group: string
  desc: string
  icon: string
  conditions: Condition[]
}

const period: Condition = { label: 'Okres księgowy potwierdzony', key: 'period' }

export const AREAS: Area[] = [
  { id: 'vat', name: 'Rejestr VAT', group: 'Rejestry i VAT', desc: 'Sprzedaż i zakupy w wybranym okresie', icon: 'receipt',
    conditions: [period, { label: 'Kontekst VAT potwierdzony', key: 'other' }, { label: 'Połączenie z KSeF', key: 'other' }] },
  { id: 'kpir', name: 'KPiR', group: 'Księgowania', desc: 'Księga przychodów i rozchodów', icon: 'book',
    conditions: [period, { label: 'Forma opodatkowania: KPiR', key: 'other' }, { label: 'Saldo otwarcia', key: 'other' }] },
  { id: 'ryczalt', name: 'Ewidencja przychodów', group: 'Księgowania', desc: 'Ewidencja dla ryczałtu', icon: 'wallet',
    conditions: [period, { label: 'Forma opodatkowania: ryczałt', key: 'other' }, { label: 'Stawki ryczałtu', key: 'other' }] },
  { id: 'books', name: 'Pełne księgi', group: 'Księgowania', desc: 'Pełna księgowość i plan kont', icon: 'coins',
    conditions: [period, { label: 'Plan kont', key: 'other' }, { label: 'Salda otwarcia kont', key: 'other' }] },
  { id: 'assets', name: 'Majątek', group: 'Majątek i kontrole', desc: 'Środki trwałe i amortyzacja', icon: 'box',
    conditions: [period, { label: 'Grupy środków trwałych', key: 'other' }, { label: 'Metody amortyzacji', key: 'other' }] },
  { id: 'checks', name: 'Kontrole', group: 'Majątek i kontrole', desc: 'Kontrole spójności danych', icon: 'scan',
    conditions: [period, { label: 'Dane w rejestrach VAT', key: 'other' }, { label: 'Reguły kontroli', key: 'other' }] },
]

export const GROUPS = ['Rejestry i VAT', 'Księgowania', 'Majątek i kontrole']

export const metCount = (a: Area, confirmed: boolean) =>
  a.conditions.filter((c) => (c.key === 'period' ? confirmed : false)).length
export const isReady = (a: Area, confirmed: boolean) => metCount(a, confirmed) === a.conditions.length
