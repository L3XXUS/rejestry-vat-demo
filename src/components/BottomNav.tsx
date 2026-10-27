import { Icon } from './Icon'
import { Pop } from './Pop'
import { AREAS, isReady, type Area, type ViewId } from '../areas'

interface Props { view: ViewId; setView: (v: ViewId) => void; confirmed: boolean }

const area = (id: string) => AREAS.find((a) => a.id === id) as Area
const LEDGER = ['kpir', 'ryczalt', 'books']

/** Dolna nawigacja na telefonie: 5 przycisków, „Księgowania" rozwija listę 3 obszarów. */
export function BottomNav({ view, setView, confirmed }: Props) {
  const dot = (ids: string[]) => (ids.every((i) => isReady(area(i), confirmed)) ? 'ok' : 'warn')
  const item = (id: ViewId, label: string, icon: string, dotIds?: string[]) => (
    <button key={id} className={`bn ${view === id ? 'on' : ''}`} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}>
      <span className="bn-ic">
        <Icon name={icon} size={22} />
        {dotIds && <i className={`sdot ${dot(dotIds)}`} />}
      </span>
      <span className="bn-lb">{label}</span>
    </button>
  )
  const ledgerOn = LEDGER.includes(view)

  return (
    <nav className="bottom-nav" aria-label="Obszary księgowe">
      {item('overview', 'Przegląd', 'grid')}
      {item('vat', 'Rejestr VAT', 'receipt', ['vat'])}
      <Pop
        title="Księgowania"
        width={320}
        trigger={({ open, toggle, id }) => (
          <button className={`bn ${ledgerOn ? 'on' : ''}`} onClick={toggle} aria-expanded={open} aria-controls={id}>
            <span className="bn-ic">
              <Icon name="book" size={22} />
              <i className={`sdot ${dot(LEDGER)}`} />
            </span>
            <span className="bn-lb">Księgowania</span>
          </button>
        )}
      >
        {({ close }) => (
          <div className="menu" role="menu">
            {LEDGER.map((id) => {
              const a = area(id)
              return (
                <button key={id} className={`menu-item ${view === id ? 'cur' : ''}`} role="menuitem" onClick={() => { setView(a.id); close() }}>
                  <span className="mi-ic"><Icon name={a.icon} size={18} /></span>
                  <span className="mi-tx"><strong>{a.name}</strong><small>{a.desc}</small></span>
                  <i className={`sdot ${isReady(a, confirmed) ? 'ok' : 'warn'}`} />
                </button>
              )
            })}
          </div>
        )}
      </Pop>
      {item('assets', 'Majątek', 'box', ['assets'])}
      {item('checks', 'Kontrole', 'scan', ['checks'])}
    </nav>
  )
}
