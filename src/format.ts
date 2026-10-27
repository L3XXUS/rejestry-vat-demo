const money = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions)

export const fmtMoney = (n: number) => `${money.format(n).replace(/ /g, ' ')} zł`
export const fmtNum = (n: number) => money.format(n)

export const MONTHS = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
]
export const MONTHS_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru']

export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one
  const m10 = n % 10
  const m100 = n % 100
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few
  return many
}
