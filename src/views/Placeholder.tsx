import { Icon } from '../components/Icon'
import { AREAS, isReady, type ViewId } from '../areas'

export default function Placeholder({ id, confirmed, back }: { id: ViewId; confirmed: boolean; back: () => void }) {
  const a = AREAS.find((x) => x.id === id)!
  return (
    <>
      <div className="page-head">
        <div className="crumb">Ewidencje · {a.group}</div>
        <h1>{a.name}</h1>
        <p className="lede">{a.desc}</p>
      </div>
      <div className="panel ph">
        <span className="area-ic big"><Icon name={a.icon} size={30} /></span>
        <h3>Ten obszar będzie dostępny po spełnieniu warunków</h3>
        <ul className="conds">
          {a.conditions.map((c) => {
            const ok = c.key === 'period' ? confirmed : false
            return <li key={c.label} className={ok ? 'ok' : ''}><Icon name={ok ? 'checkC' : 'circle'} size={17} /> {c.label}</li>
          })}
        </ul>
        <p className="sm-note">{isReady(a, confirmed) ? 'Gotowy.' : 'Dane pozostają demonstracyjne.'}</p>
        <button className="btn" onClick={back}><Icon name="back" size={16} /> Wróć do przeglądu</button>
      </div>
    </>
  )
}
