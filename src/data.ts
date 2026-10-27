import type { Doc, RegisterKind } from './types'

const r2 = (n: number) => Math.round(n * 100) / 100
const pad = (n: number) => String(n).padStart(2, '0')

const OPS = {
  sales: ['Sprzedaż krajowa', 'WDT', 'Eksport', 'Korekta'],
  purchases: ['Zakup krajowy', 'WNT', 'Import usług', 'Korekta'],
}
const JPK = ['GTU_06', 'GTU_12', 'TP', 'Brak']

export const OPERATIONS = OPS
export const JPK_CODES = JPK
export const SERIES = { sales: ['FV', 'KOR'], purchases: ['FZ', 'KOR'] }
export const YEARS = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']

const ksefFor = (kind: RegisterKind, month: number, day: number) =>
  `5260250274-2026${pad(month)}${pad(day)}-${kind === 'sales' ? 'A' : 'B'}${(day * 7919).toString(16).toUpperCase().padStart(5, '0')}-${pad((day * 13) % 97)}`

function build(
  kind: RegisterKind,
  month: number,
  nets: number[],
  opts: { korDay?: number; korNet?: number; ksefDays?: number[]; reduced?: number[] } = {},
): Doc[] {
  const label = kind === 'sales' ? 'Alfa' : 'Beta'
  const code = kind === 'sales' ? 'S' : 'P'
  const prefix = kind === 'sales' ? 'FV' : 'FZ'
  const docs: Doc[] = []
  let ni = 0
  const total = nets.length + (opts.korDay ? 1 : 0)
  for (let d = 1; d <= total; d++) {
    const isKor = opts.korDay === d
    const net = isKor ? (opts.korNet as number) : nets[ni++]
    const series = isKor ? 'KOR' : prefix
    docs.push({
      id: `DEMO-${code}-${d}`,
      counterparty: `Demo ${label} ${pad(d)}`,
      date: `2026-${pad(month)}-${pad(d)}`,
      number: `${series}/${d}/${month}/2026/DEMO`,
      ksef: opts.ksefDays?.includes(d) ? ksefFor(kind, month, d) : null,
      operation: isKor ? 'Korekta' : OPS[kind][d % 3],
      jpk: isKor ? 'Brak' : JPK[d % 4],
      series,
      rate: isKor ? 'np' : opts.reduced?.includes(d) ? '8%' : '23%',
      net,
      vat: isKor ? 0 : r2(net * (opts.reduced?.includes(d) ? 0.08 : 0.23)),
    })
  }
  return docs
}

export const DATA: Record<RegisterKind, Doc[]> = {
  sales: [
    // październik: netto 9 700,00 / VAT 2 323,00 / brutto 12 023,00 (jak na referencji)
    ...build('sales', 10, [1000, 650, 900, 1200, 500, 800, 700, 950, 1100, 600, 850, 450, 400], {
      korDay: 3,
      korNet: -400,
      ksefDays: [2, 6, 9],
    }),
    ...build('sales', 9, [1400, 880, 1250, 700, 990], { ksefDays: [1, 2, 3, 4, 5] }),
  ],
  purchases: [
    ...build('purchases', 10, [2100, 540, 760, 1830, 310, 920, 1480, 650, 1210, 395, 870, 1040], { ksefDays: [1, 4, 7], reduced: [3, 5, 9] }),
    ...build('purchases', 9, [1600, 450, 2300, 830], { ksefDays: [1, 2, 3, 4] }),
  ],
}
