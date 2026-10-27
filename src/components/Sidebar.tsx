import { useState } from 'react'
import { Icon } from './Icon'
import { AREAS, GROUPS, isReady, metCount, type Area, type ViewId } from '../areas'

interface Props {
  view: ViewId
  setView: (v: ViewId) => void
  confirmed: boolean
  collapsed: boolean
  toggle: () => void
  showToggle: boolean
}

interface Tip { x: number; y: number; title: string; text: string }

export function Sidebar({ view, setView, confirmed, collapsed, toggle, showToggle }: Props) {
  const [tip, setTip] = useState<Tip | null>(null)

  const status = (a: Area) => {
    const ready = isReady(a, confirmed)
    return {
      ready,
      title: ready ? 'Gotowy' : 'Wymaga konfiguracji',
      text: `Spełnione warunki: ${metCount(a, confirmed)}/${a.conditions.length}`,
    }
  }
  const tipFor = (a: Area, withName: boolean) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      const s = status(a)
      setTip({ x: e.clientX, y: e.clientY, title: withName ? `${a.name} · ${s.title}` : s.title, text: s.text })
    },
    onMouseMove: (e: React.MouseEvent) => setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t)),
    onMouseLeave: () => setTip(null),
  })

  return (
    <aside className={`side ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="brand">
        <span className="logo" aria-hidden="true"><i /><i /><i /></span>
        <div className="brand-tx"><strong>Onsaldo</strong><small>Preview Sp. z o.o.</small></div>
      </div>

      <nav aria-label="Obszary księgowe">
        <button
          className={`nav ${view === 'overview' ? 'on' : ''}`}
          onClick={() => setView('overview')}
          aria-current={view === 'overview' ? 'page' : undefined}
          aria-label="Przegląd"
          onMouseEnter={collapsed ? (e) => setTip({ x: e.clientX, y: e.clientY, title: 'Przegląd', text: 'Wszystkie obszary księgowe' }) : undefined}
          onMouseMove={collapsed ? (e) => setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t)) : undefined}
          onMouseLeave={() => setTip(null)}
        >
          <Icon name="grid" size={19} /> <span className="nav-label">Przegląd</span>
        </button>

        {GROUPS.map((g) => (
          <div key={g} className="nav-group">
            <div className="nav-title"><span>{g}</span></div>
            {AREAS.filter((a) => a.group === g).map((a) => {
              const s = status(a)
              return (
                <button
                  key={a.id}
                  className={`nav ${view === a.id ? 'on' : ''}`}
                  onClick={() => setView(a.id)}
                  aria-current={view === a.id ? 'page' : undefined}
                  aria-label={`${a.name}, ${s.title}`}
                  {...(collapsed ? tipFor(a, true) : {})}
                >
                  <Icon name={a.icon} size={19} />
                  <span className="nav-label">{a.name}</span>
                  <span className="dot-hit" {...(collapsed ? {} : tipFor(a, false))}>
                    <i className={`sdot ${s.ready ? 'ok' : 'warn'}`} />
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <span className="side-legend"><i className="sdot warn" /> Wymaga konfiguracji</span>
        {showToggle && <button
          className="icon-btn outlined collapse"
          onClick={toggle}
          aria-label={collapsed ? 'Rozwiń menu' : 'Zwiń menu'}
          aria-expanded={!collapsed}
          onMouseEnter={(e) => setTip({ x: e.clientX, y: e.clientY, title: collapsed ? 'Rozwiń menu' : 'Zwiń menu', text: '' })}
          onMouseMove={(e) => setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t))}
          onMouseLeave={() => setTip(null)}
        >
          <Icon name={collapsed ? 'chevR' : 'chevL'} size={18} />
        </button>}
      </div>

      {tip && (
        <div className="tip" role="tooltip" style={{ left: Math.min(tip.x + 16, window.innerWidth - 270), top: tip.y + 18 }}>
          <strong>{tip.title}</strong>
          {tip.text && <span>{tip.text}</span>}
        </div>
      )}
    </aside>
  )
}
