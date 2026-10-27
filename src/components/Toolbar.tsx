import { useState } from 'react'
import { Icon } from './Icon'
import { Pop } from './Pop'
import { COLUMNS, DEFAULT_COLUMNS, type ColumnConfig } from '../columns'
import { DATA, JPK_CODES, OPERATIONS, SERIES } from '../data'
import { MONTHS, plural } from '../format'
import type { Label } from '../labels'
import { LabelChip } from './LabelChip'
import { panelFilterCount } from '../logic'
import type { Filters, RegisterKind } from '../types'

interface Props {
  kind: RegisterKind
  filters: Filters
  setFilters: (f: Filters) => void
  resultCount: number
  columns: ColumnConfig
  setColumns: (c: ColumnConfig) => void
  disabled: boolean
  onLabels: () => void
  labels: Label[]
  onPrint: () => void
  onExport: () => void
}

export function Toolbar(p: Props) {
  const { filters: f, setFilters, disabled } = p
  const set = (patch: Partial<Filters>) => setFilters({ ...f, ...patch })
  const count = panelFilterCount(f)

  return (
    <div className="toolbar" role="search">
      <label className="search">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Szukaj"
          aria-label="Szukaj"
          disabled={disabled}
        />
        {f.q && (
          <button className="icon-btn sm" onClick={() => set({ q: '' })} aria-label="Wyczyść wyszukiwanie">
            <Icon name="x" size={14} />
          </button>
        )}
      </label>

      <div className="toolbar-row">
        <PeriodPicker f={f} set={set} disabled={disabled} kind={p.kind} />

        <Pop
          title="Filtry"
          align="right"
          width={380}
          trigger={({ open, toggle, id }) => (
            <button
              className={`btn ${count ? 'is-active' : ''}`}
              onClick={toggle}
              aria-expanded={open}
              aria-controls={id}
              disabled={disabled}
            >
              <Icon name="filter" size={17} />
              <span>Filtry</span>
              {count > 0 && <span className="count">{count}</span>}
            </button>
          )}
        >
          {({ close }) => (
            <FiltersPanel {...p} close={close} set={set} />
          )}
        </Pop>

        <Pop
          title="Akcje"
          align="right"
          width={300}
          trigger={({ open, toggle, id }) => (
            <button
              className="btn"
              onClick={toggle}
              aria-label="Akcje: pobierz, drukuj, etykiety, kolumny"
              aria-expanded={open}
              aria-controls={id}
              disabled={disabled}
            >
              <Icon name="more" size={18} />
              <span>Akcje</span>
              <Icon name="chevD" size={15} />
            </button>
          )}
        >
          {({ close }) => <ActionsMenu {...p} close={close} />}
        </Pop>
      </div>
    </div>
  )
}

/* ───────── Okres ───────── */

function PeriodPicker({ f, set, disabled, kind }: { f: Filters; set: (p: Partial<Filters>) => void; disabled: boolean; kind: RegisterKind }) {
  const withData = new Set(DATA[kind].map((d) => { const [y, m] = d.date.split('-'); return `${y}-${Number(m)}` }))
  const allYear = f.month === 'all'
  const label = allYear ? `Cały ${f.year}` : `${MONTHS[Number(f.month) - 1]} ${f.year}`

  const step = (dir: -1 | 1) => {
    if (allYear) return set({ year: String(Number(f.year) + dir) })
    let m = Number(f.month) + dir
    let y = Number(f.year)
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    set({ month: String(m), year: String(y) })
  }

  return (
    <div className="period">
      <button className="icon-btn sm" onClick={() => step(-1)} aria-label="Poprzedni okres" disabled={disabled}>
        <Icon name="chevL" size={16} />
      </button>
      <Pop
        title="Okres"
        width={340}
        trigger={({ open, toggle, id }) => (
          <button className="period-label" onClick={toggle} aria-expanded={open} aria-controls={id} disabled={disabled}>
            <Icon name="calendar" size={16} />
            <span>{label}</span>
            <Icon name="chevD" size={14} />
          </button>
        )}
      >
        {({ close }) => (
          <div className="pop-body">
            <div className="field-label">Rok</div>
            <div className="year-step">
              <button className="icon-btn outlined" onClick={() => set({ year: String(Number(f.year) - 1) })} aria-label="Poprzedni rok">
                <Icon name="chevL" size={18} />
              </button>
              <strong>{f.year}</strong>
              <button className="icon-btn outlined" onClick={() => set({ year: String(Number(f.year) + 1) })} aria-label="Następny rok">
                <Icon name="chevR" size={18} />
              </button>
            </div>
            <div className="field-label">Miesiąc</div>
            <div className="month-grid">
              {MONTHS.map((m, i) => {
                const has = withData.has(`${f.year}-${i + 1}`)
                return (
                  <button
                    key={m}
                    className={`chip ${f.month === String(i + 1) ? 'on' : ''}`}
                    onClick={() => { set({ month: String(i + 1) }); close() }}
                    title={has ? 'Są dokumenty' : 'Brak dokumentów'}
                  >
                    {m.slice(0, 3)}
                    {has && <i className="has-dot" />}
                  </button>
                )
              })}
            </div>
            <button
              className={`chip wide ${allYear ? 'on' : ''}`}
              onClick={() => { set({ month: 'all' }); close() }}
            >
              Cały rok {f.year}
            </button>
            <div className="legend-note"><i className="has-dot" /> miesiące z dokumentami</div>
          </div>
        )}
      </Pop>
      <button className="icon-btn sm" onClick={() => step(1)} aria-label="Następny okres" disabled={disabled}>
        <Icon name="chevR" size={16} />
      </button>
    </div>
  )
}

/* ───────── Filtry ───────── */

function FiltersPanel({
  kind, filters: f, set, resultCount, setFilters, close, labels,
}: Props & { set: (p: Partial<Filters>) => void; close: () => void }) {
  const ops = OPERATIONS[kind]
  const series = SERIES[kind]
  const toggleSeries = (s: string) =>
    set({ series: f.series.includes(s) ? f.series.filter((x) => x !== s) : [...f.series, s] })

  return (
    <>
      <div className="pop-body">
        <div className="field-label">Rodzaj operacji</div>
        <div className="chips">
          {['all', ...ops].map((o) => (
            <button key={o} className={`chip ${f.operation === o ? 'on' : ''}`} onClick={() => set({ operation: o })}>
              {o === 'all' ? 'Wszystkie' : o}
            </button>
          ))}
        </div>

        <div className="field-label">Kod JPK V7</div>
        <div className="chips">
          {['all', ...JPK_CODES].map((c) => (
            <button key={c} className={`chip ${f.jpk === c ? 'on' : ''}`} onClick={() => set({ jpk: c })}>
              {c === 'all' ? 'Wszystkie' : c}
            </button>
          ))}
        </div>

        {labels.length > 0 && (
          <>
            <div className="field-label">Etykiety</div>
            <div className="chips">
              {labels.map((l) => (
                <LabelChip
                  key={l.id}
                  label={l}
                  on={f.labels.includes(l.id)}
                  onClick={() => set({ labels: f.labels.includes(l.id) ? f.labels.filter((x) => x !== l.id) : [...f.labels, l.id] })}
                />
              ))}
            </div>
          </>
        )}

        <div className="field-label">Serie dokumentów</div>
        <div className="chips">
          {series.map((s) => (
            <button
              key={s}
              className={`chip ${f.series.includes(s) ? 'on' : ''}`}
              onClick={() => toggleSeries(s)}
              aria-pressed={f.series.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="pop-foot">
        <button
          className="btn ghost"
          onClick={() => setFilters({ ...f, operation: 'all', jpk: 'all', series: [], labels: [] })}
          disabled={panelFilterCount(f) === 0}
        >
          Wyczyść
        </button>
        <button className="btn primary" onClick={close}>
          Pokaż {resultCount} {plural(resultCount, 'zapis', 'zapisy', 'zapisów')}
        </button>
      </div>
    </>
  )
}

/* ───────── Akcje ───────── */

function ActionsMenu({
  columns, setColumns, onLabels, onPrint, onExport, close,
}: Props & { close: () => void }) {
  const [view, setView] = useState<'menu' | 'columns'>('menu')

  if (view === 'columns') {
    const { order, hidden } = columns
    const move = (i: number, d: -1 | 1) => {
      const next = [...order]
      const j = i + d
      if (j < 0 || j >= next.length) return
      ;[next[i], next[j]] = [next[j], next[i]]
      setColumns({ ...columns, order: next })
    }
    const toggle = (k: (typeof order)[number]) =>
      setColumns({
        ...columns,
        hidden: hidden.includes(k) ? hidden.filter((x) => x !== k) : [...hidden, k],
      })
    return (
      <div className="pop-body tight">
        <button className="back" onClick={() => setView('menu')}>
          <Icon name="back" size={16} /> Kolumny i widok
        </button>
        <ul className="col-list">
          {order.map((k, i) => {
            const meta = COLUMNS.find((c) => c.key === k)!
            const locked = k === 'counterparty'
            return (
              <li key={k}>
                <label className={locked ? 'locked' : ''}>
                  <input type="checkbox" checked={!hidden.includes(k)} disabled={locked} onChange={() => toggle(k)} />
                  <span>{meta.label}</span>
                </label>
                <span className="mv">
                  <button className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`${meta.label}: wyżej`}>
                    <Icon name="arrowUp" size={14} />
                  </button>
                  <button className="icon-btn sm" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`${meta.label}: niżej`}>
                    <Icon name="arrowDown" size={14} />
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
        <button className="btn ghost" onClick={() => setColumns(DEFAULT_COLUMNS)}>Przywróć domyślne</button>
      </div>
    )
  }

  const item = (icon: string, label: string, hint: string, fn: () => void, closeAfter = true) => (
    <button
      className="menu-item"
      role="menuitem"
      onClick={() => { fn(); if (closeAfter) close() }}
    >
      <span className="mi-ic"><Icon name={icon} size={18} /></span>
      <span className="mi-tx"><strong>{label}</strong><small>{hint}</small></span>
    </button>
  )

  return (
    <div className="menu" role="menu">
      {item('download', 'Pobierz', 'Eksport widoku do CSV', onExport)}
      {item('print', 'Drukuj', 'Wydruk bieżącego rejestru', onPrint)}
      {item('tag', 'Etykiety', 'Oznaczanie zapisów', onLabels)}
      {item('columns', 'Kolumny i widok', 'Kolejność i widoczność kolumn', () => setView('columns'), false)}
    </div>
  )
}

