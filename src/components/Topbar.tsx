import { Icon } from './Icon'
import { Pop } from './Pop'

const NOTES = [
  { t: 'Okres księgowy 2026 wymaga potwierdzenia', d: 'dziś' },
  { t: 'Rejestr VAT: brak połączenia z KSeF', d: 'dziś' },
  { t: 'KPiR: brak salda otwarcia', d: 'wczoraj' },
  { t: 'Dane w tej organizacji są demonstracyjne', d: '2 dni temu' },
]

interface Props {
  dark: boolean
  toggleDark: () => void
  onToast: (m: string) => void
  periodHidden: boolean
  periodYear: string
  periodConfirmed: boolean
  restorePeriod: () => void
}

export function Topbar({ dark, toggleDark, onToast, periodHidden, periodYear, periodConfirmed, restorePeriod }: Props) {
  return (
    <header className="topbar">
      <div className="greet-wrap">
        <span className="top-brand" aria-hidden="true">
          <span className="logo"><i /><i /><i /></span>
          <strong>Onsaldo</strong>
        </span>
        <h2 className="greet">Witaj, Preview Reviewer!</h2>
        {periodHidden && (
          <button className={`period-chip ${periodConfirmed ? 'ok' : ''}`} onClick={restorePeriod} title="Pokaż powiadomienie o okresie księgowym">
            <i className="sdot" />
            Okres {periodYear} · {periodConfirmed ? 'Potwierdzony' : 'Wymaga konfiguracji'}
          </button>
        )}
      </div>
      <div className="top-actions">
        <button
          className={`switch ${dark ? 'is-dark' : ''}`}
          role="switch"
          aria-checked={dark}
          onClick={toggleDark}
          aria-label="Motyw ciemny"
          title={dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
        >
          <Icon name="sun" size={15} className="sw-sun" />
          <Icon name="moon" size={15} className="sw-moon" />
          <span className="knob" />
        </button>

        <Pop
          title="Powiadomienia"
          align="right"
          width={340}
          trigger={({ open, toggle, id }) => (
            <button className="icon-btn outlined round bell" onClick={toggle} aria-expanded={open} aria-controls={id} aria-label={`Powiadomienia: ${NOTES.length}`}>
              <Icon name="bell" size={19} />
              <span className="bell-n">{NOTES.length}</span>
            </button>
          )}
        >
          {() => (
            <ul className="notes">
              {NOTES.map((n) => (
                <li key={n.t}><span>{n.t}</span><small>{n.d}</small></li>
              ))}
            </ul>
          )}
        </Pop>

        <Pop
          title="Konto"
          align="right"
          width={260}
          trigger={({ open, toggle, id }) => (
            <button className="user" onClick={toggle} aria-expanded={open} aria-controls={id}>
              <span className="user-tx"><strong>Preview Reviewer</strong><small>Konto użytkownika</small></span>
              <span className="avatar"><Icon name="user" size={20} /></span>
              <Icon name="chevD" size={16} />
            </button>
          )}
        >
          {({ close }) => (
            <div className="menu" role="menu">
              <div className="menu-greet">Witaj, Preview Reviewer!</div>
              <button className="menu-item" role="menuitem" onClick={() => { onToast('Profil · demo'); close() }}>
                <span className="mi-ic"><Icon name="user" size={18} /></span><span className="mi-tx"><strong>Profil</strong><small>Dane konta</small></span>
              </button>
              <button className="menu-item" role="menuitem" onClick={() => { onToast('Ustawienia · demo'); close() }}>
                <span className="mi-ic"><Icon name="settings" size={18} /></span><span className="mi-tx"><strong>Ustawienia</strong><small>Organizacja i preferencje</small></span>
              </button>
              <button className="menu-item" role="menuitem" onClick={() => { onToast('Wylogowanie · demo'); close() }}>
                <span className="mi-ic"><Icon name="logout" size={18} /></span><span className="mi-tx"><strong>Wyloguj</strong><small>Zakończ sesję</small></span>
              </button>
            </div>
          )}
        </Pop>
      </div>
    </header>
  )
}
