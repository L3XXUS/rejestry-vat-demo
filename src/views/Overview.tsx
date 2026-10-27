import { useState } from 'react'
import { Icon } from '../components/Icon'
import { AREAS, isReady, metCount, type ViewId } from '../areas'

export default function Overview({ confirmed, year, open }: { confirmed: boolean; year: string; open: (v: ViewId) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const total = AREAS.reduce((s, a) => s + a.conditions.length, 0)
  const met = AREAS.reduce((s, a) => s + metCount(a, confirmed), 0)

  return (
    <>
      <div className="page-head">
        <div className="crumb">Ewidencje</div>
        <h1>Obszary księgowe</h1>
        <div className="lede-row">
          <p className="lede">Mapa dostępnych obszarów księgowych dla aktywnej organizacji.</p>
          <p className="inline-note"><Icon name="info" size={15} /> To jest mapa zakresu, a nie uruchomienie księgowania. Dane pozostają demonstracyjne.</p>
        </div>
      </div>

      <section aria-labelledby="avail">
        <div className="sec-head">
          <div>
            <h3 id="avail">Dostępność obszarów</h3>
            <p>Status pokazuje gotowość warunków, ale nie uruchamia księgowania ani operacji zewnętrznych.</p>
          </div>
          <div className="meter" aria-label={`Spełnione warunki: ${met} z ${total}`}>
            <div className="meter-bar"><i style={{ width: `${(met / total) * 100}%` }} /></div>
            <span><b>{met}</b> z {total} warunków · {year}</span>
          </div>
        </div>

        <div className="areas">
          {AREAS.map((a) => {
            const ready = isReady(a, confirmed)
            const isOpen = expanded === a.id
            return (
              <article key={a.id} className={`area ${isOpen ? 'open' : ''}`}>
                <div className="area-top">
                  <span className="area-ic"><Icon name={a.icon} size={22} /></span>
                  <span className={`badge ${ready ? 'okb' : 'warnb'}`}>{ready ? 'Gotowy' : 'Wymaga konfiguracji'}</span>
                </div>
                <h4>{a.name}</h4>
                <p>{a.desc}</p>
                {isOpen && (
                  <ul className="conds">
                    {a.conditions.map((c) => {
                      const ok = c.key === 'period' ? confirmed : false
                      return (
                        <li key={c.label} className={ok ? 'ok' : ''}>
                          <Icon name={ok ? 'checkC' : 'circle'} size={17} /> {c.label}
                        </li>
                      )
                    })}
                  </ul>
                )}
                <div className="area-foot">
                  <button className="link-btn" onClick={() => setExpanded(isOpen ? null : a.id)} aria-expanded={isOpen}>
                    Warunki {metCount(a, confirmed)}/{a.conditions.length}
                    <Icon name="chevD" size={16} className="chev" />
                  </button>
                  <button className="btn sm" onClick={() => open(a.id)}>Otwórz <Icon name="arrowR" size={15} /></button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
