import { fmtMoney, fmtNum, plural } from '../format'
import { totals } from '../logic'
import type { Doc, VatRate } from '../types'

const CLS: Record<VatRate, string> = { '23%': 'r23', '8%': 'r8', np: 'rnp' }
interface Part { rate: VatRate; cls: string; value: number }

export function Summary({ docs, periodLabel, dim }: { docs: Doc[]; periodLabel: string; dim?: boolean }) {
  const t = totals(docs)
  const vatTotal = t.byRate['23%'] + t.byRate['8%'] + t.byRate.np
  const rates = (['23%', '8%', 'np'] as VatRate[]).filter((r) => r !== '8%' || t.byRate['8%'] !== 0)
  const parts: Part[] = rates.map((r) => ({ rate: r, cls: CLS[r], value: t.byRate[r] }))
  const pct = (v: number) => (vatTotal > 0 ? Math.round((v / vatTotal) * 100) : 0)

  return (
    <section className={`summary ${dim ? 'dim' : ''}`} aria-label="Podsumowanie">
      <div className="sum-left">
        <div className="eyebrow">
          Brutto · {periodLabel} · {docs.length} {plural(docs.length, 'zapis', 'zapisy', 'zapisów')}
        </div>
        <div className="sum-gross">{fmtMoney(t.gross)}</div>
        <dl className="sum-split">
          <div>
            <dt>Netto</dt>
            <dd>{fmtMoney(t.net)}</dd>
          </div>
          <div>
            <dt>VAT</dt>
            <dd>{fmtMoney(t.vat)}</dd>
          </div>
        </dl>
      </div>

      <div className="sum-rates">
        <Ring parts={parts} total={vatTotal} center={fmtNum(t.vat)} />
        <div className="rates-side">
          <div className="rates-head">
            <span>Kwoty według stawek VAT</span>
            <span className="tag-demo">VAT · DEMO</span>
          </div>
          <ul className="legend">
            {parts.map((r) => (
              <li key={r.rate}>
                <span className={`dot ${r.cls}`} />
                <span className="lg-rate">{r.rate}</span>
                <span className="lg-val">{fmtMoney(r.value)}</span>
                <span className="lg-pct">{pct(r.value)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Ring({ parts, total, center }: { parts: Part[]; total: number; center: string }) {
  const R = 42
  const SW = 12
  const RC = 2 // promień zaokrąglenia rogów
  const GAP = 2.2 // szerokość szczeliny między segmentami
  const active = parts.filter((p) => p.value > 0)
  const multi = total > 0 && active.length > 1

  let acc = 0
  const segs = active.map((p) => {
    const frac = p.value / total
    const seg = { ...p, frac, start: acc }
    acc += frac
    return seg
  })

  // Segment = wycinek pierścienia pomniejszony o RC, potem obrys o grubości 2·RC z zaokrąglonymi łączeniami
  // → rogi o promieniu RC, a krawędzie szczeliny są równoległe (stała szerokość).
  const ro = R + SW / 2 - RC
  const ri = R - SW / 2 + RC
  const d = RC + GAP / 2
  const pt = (r: number, a: number) => `${(50 + r * Math.cos(a)).toFixed(3)} ${(50 + r * Math.sin(a)).toFixed(3)}`

  const sectorPath = (f0: number, f1: number) => {
    const t0 = -Math.PI / 2 + f0 * 2 * Math.PI
    const t1 = -Math.PI / 2 + f1 * 2 * Math.PI
    const dOut = Math.asin(d / ro)
    const dIn = Math.asin(d / ri)
    const o0 = t0 + dOut
    const o1 = Math.max(t1 - dOut, o0 + 0.001)
    const i0 = t0 + dIn
    const i1 = Math.max(t1 - dIn, i0 + 0.001)
    return (
      `M ${pt(ro, o0)} A ${ro} ${ro} 0 ${o1 - o0 > Math.PI ? 1 : 0} 1 ${pt(ro, o1)} ` +
      `L ${pt(ri, i1)} A ${ri} ${ri} 0 ${i1 - i0 > Math.PI ? 1 : 0} 0 ${pt(ri, i0)} Z`
    )
  }

  return (
    <svg className="chart" viewBox="0 0 100 100" role="img" aria-label="Udział stawek VAT">
      {total <= 0 && <circle cx="50" cy="50" r={R} fill="none" strokeWidth={SW} className="ring-bg" />}
      {total > 0 &&
        segs.map((sg) => {
          const title = <title>{`${sg.rate}: ${Math.round(sg.frac * 100)}%`}</title>
          if (!multi) {
            return (
              <circle key={sg.rate} cx="50" cy="50" r={R} fill="none" strokeWidth={SW} className={`ring ${sg.cls}`}>
                {title}
              </circle>
            )
          }
          return (
            <path
              key={sg.rate}
              d={sectorPath(sg.start, sg.start + sg.frac)}
              strokeWidth={RC * 2}
              strokeLinejoin="round"
              className={`seg-fill ${sg.cls}`}
            >
              {title}
            </path>
          )
        })}
      <text x="50" y="52" textAnchor="middle" className="c-big">{center}</text>
      <text x="50" y="64" textAnchor="middle" className="c-small">zł VAT</text>
    </svg>
  )
}
