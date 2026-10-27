import { useState } from 'react'
import { Icon } from './Icon'
import { Pop } from './Pop'

interface Props { year: string; confirmed: boolean; onConfirm: (year: string) => void; onDismiss: () => void }

export function PeriodBar({ year, confirmed, onConfirm, onDismiss }: Props) {
  const [pick, setPick] = useState(year)
  return (
    <section className={`period-bar ${confirmed ? 'ok' : ''}`} aria-label="Okres księgowy">
      <span className="pb-ic"><Icon name={confirmed ? 'checkC' : 'calendar'} size={22} /></span>
      <div className="pb-tx">
        <div className="pb-title">
          <strong>Okres księgowy · {year}</strong>
          <span className={`badge ${confirmed ? 'okb' : 'warnb'}`}>{confirmed ? 'Potwierdzony' : 'Wymaga konfiguracji'}</span>
        </div>
        <p>{confirmed
          ? 'Rok rozliczeniowy potwierdzony. Pozostałe warunki obszarów nadal wymagają konfiguracji.'
          : 'Orientacyjny rok rozliczeniowy aktywnej organizacji. Wymaga potwierdzenia przed uruchomieniem operacji księgowych.'}</p>
      </div>
      <Pop
        title="Okres księgowy"
        align="right"
        width={320}
        trigger={({ open, toggle, id }) => (
          <button className={`btn ${confirmed ? '' : 'primary'}`} onClick={() => { setPick(year); toggle() }} aria-expanded={open} aria-controls={id}>
            {confirmed ? 'Zmień okres' : 'Potwierdź okres'}
          </button>
        )}
      >
        {({ close }) => (
          <>
            <div className="pop-body">
              <div className="field-label">Rok rozliczeniowy</div>
              <div className="chips">
                {['2025', '2026', '2027'].map((y) => (
                  <button key={y} className={`chip ${pick === y ? 'on' : ''}`} onClick={() => setPick(y)}>{y}</button>
                ))}
              </div>
            </div>
            <div className="pop-foot">
              <button className="btn ghost" onClick={close}>Anuluj</button>
              <button className="btn primary" onClick={() => { onConfirm(pick); close() }}>Potwierdź {pick}</button>
            </div>
          </>
        )}
      </Pop>
      <button className="icon-btn sm bar-close" onClick={onDismiss} aria-label="Zamknij powiadomienie o okresie" title="Zamknij">
        <Icon name="x" size={16} />
      </button>
    </section>
  )
}
