import { Icon } from './Icon'

export function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Ładowanie danych">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="sk-row" key={i}>
          <i style={{ width: `${28 + ((i * 7) % 14)}%` }} />
          <i style={{ width: '12%' }} />
          <i style={{ width: '24%' }} />
          <i style={{ width: '16%' }} />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ filtered, onClear, periodLabel }: { filtered: boolean; onClear: () => void; periodLabel: string }) {
  return (
    <div className="state" role="status">
      <svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true">
        <rect x="22" y="14" width="76" height="68" rx="12" fill="#fff" stroke="#d8d4c6" strokeWidth="2" />
        <rect x="32" y="28" width="38" height="6" rx="3" fill="#e6e2d4" />
        <rect x="32" y="42" width="56" height="6" rx="3" fill="#efece1" />
        <rect x="32" y="56" width="46" height="6" rx="3" fill="#efece1" />
        <circle cx="88" cy="70" r="16" fill="#e4f58a" stroke="#0e5a4b" strokeWidth="2" />
        <path d="m81 70 5 5 9-10" stroke="#0e5a4b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3>{filtered ? 'Brak wyników dla tych filtrów' : 'Brak zapisów w tym okresie'}</h3>
      <p>
        {filtered
          ? 'Zmień wyszukiwanie albo filtry, żeby zobaczyć więcej dokumentów.'
          : `W rejestrze nie ma jeszcze dokumentów za ${periodLabel}.`}
      </p>
      {filtered && (
        <button className="btn primary" onClick={onClear}>Wyczyść filtry</button>
      )}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state error" role="alert">
      <div className="err-ic"><Icon name="alert" size={30} /></div>
      <h3>Nie udało się wczytać rejestru</h3>
      <p>Połączenie z serwerem zostało przerwane. Twoje dane są bezpieczne — spróbuj ponownie za chwilę.</p>
      <button className="btn primary" onClick={onRetry}>
        <Icon name="refresh" size={16} /> Spróbuj ponownie
      </button>
      <small className="mono">kod: REG-503 · demo</small>
    </div>
  )
}
