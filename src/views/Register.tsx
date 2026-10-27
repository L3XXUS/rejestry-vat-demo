import { useCallback, useEffect, useMemo, useState } from 'react'
import { DocList } from '../components/DocList'
import { Icon } from '../components/Icon'
import { EmptyState, ErrorState, Skeleton } from '../components/States'
import { DocPreview } from '../components/DocPreview'
import { LabelsManager } from '../components/LabelsManager'
import { Summary } from '../components/Summary'
import { DEFAULT_LABELS, loadJson, saveJson, type Label } from '../labels'
import { Toolbar } from '../components/Toolbar'
import { DEFAULT_COLUMNS, type ColumnConfig } from '../columns'
import { DATA } from '../data'
import { MONTHS, plural } from '../format'
import { DEFAULT_FILTERS, applyFilters, panelFilterCount, sortDocs } from '../logic'
import type { DemoState, Doc, Filters, RegisterKind, SortDir, SortKey } from '../types'

const initialState = (): DemoState => {
  const s = new URLSearchParams(window.location.search).get('state')
  return s === 'empty' || s === 'error' ? s : 'data'
}

function exportCsv(docs: Doc[], kind: RegisterKind) {
  const head = ['Kontrahent', 'Data', 'Numer dokumentu', 'Numer KSeF', 'Identyfikator', 'Netto', 'VAT', 'Brutto']
  const rows = docs.map((d) => [
    d.counterparty, d.date, d.number, d.ksef ?? 'Brak potwierdzenia', d.id,
    d.net.toFixed(2).replace('.', ','), d.vat.toFixed(2).replace('.', ','), (d.net + d.vat).toFixed(2).replace('.', ','),
  ])
  const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `rejestr-vat-${kind === 'sales' ? 'sprzedazy' : 'zakupow'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Register({ showToast, year }: { showToast: (m: string) => void; year: string }) {
  const [kind, setKind] = useState<RegisterKind>('sales')
  const [demo, setDemo] = useState<DemoState>(initialState)
  const [demoOpen, setDemoOpen] = useState(false)
  const [labels, setLabels] = useState<Label[]>(() => loadJson('vat.labels', DEFAULT_LABELS))
  const [assigned, setAssigned] = useState<Record<string, string[]>>(() => loadJson('vat.assigned', {}))
  const [labelsOpen, setLabelsOpen] = useState(false)
  const [ksefMap, setKsefMap] = useState<Record<string, string>>({})
  const [checking, setChecking] = useState<Set<string>>(new Set())
  const [previewId, setPreviewId] = useState<string | null>(null)
  useEffect(() => saveJson('vat.labels', labels), [labels])
  useEffect(() => saveJson('vat.assigned', assigned), [assigned])
  const [filters, setFiltersRaw] = useState<Filters>({ ...DEFAULT_FILTERS, year })
  useEffect(() => { setFiltersRaw((f) => ({ ...f, year })) }, [year])
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [columns, setColumns] = useState<ColumnConfig>(DEFAULT_COLUMNS)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // krótki stan ładowania przy zmianie rejestru / stanu demo
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 520)
    return () => window.clearTimeout(t)
  }, [kind, demo])

  const setFilters = (f: Filters) => {
    setFiltersRaw(f)
    setPage(1)
    setExpanded(null)
  }

  const switchKind = (k: RegisterKind) => {
    if (k === kind) return
    setKind(k)
    setFiltersRaw({ ...filters, operation: 'all', jpk: 'all', series: [], labels: [] })
    setPage(1)
    setExpanded(null)
  }

  const switchDemo = (s: DemoState) => {
    setDemo(s)
    const url = new URL(window.location.href)
    s === 'data' ? url.searchParams.delete('state') : url.searchParams.set('state', s)
    window.history.replaceState(null, '', url)
  }

  const base = demo === 'empty' ? [] : DATA[kind]
  const source = useMemo(() => base.map((d) => (ksefMap[d.id] ? { ...d, ksef: ksefMap[d.id] } : d)), [base, ksefMap])
  const filtered = useMemo(() => applyFilters(source, filters, assigned), [source, filters, assigned])
  const sorted = useMemo(() => sortDocs(filtered, sort.key, sort.dir), [filtered, sort])

  const pages = Math.max(1, Math.ceil(sorted.length / perPage))
  const cur = Math.min(page, pages)
  const slice = sorted.slice((cur - 1) * perPage, cur * perPage)
  const from = sorted.length ? (cur - 1) * perPage + 1 : 0
  const to = Math.min(cur * perPage, sorted.length)

  const periodLabel = filters.month === 'all' ? `rok ${filters.year}` : `${MONTHS[Number(filters.month) - 1]} ${filters.year}`
  const anyFilter = panelFilterCount(filters) > 0 || filters.q.trim() !== ''
  const showError = demo === 'error'
  const clearAll = () => setFilters({ ...filters, operation: 'all', jpk: 'all', series: [], labels: [], q: '' })

  const onSort = (k: SortKey) => {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }))
    setPage(1)
  }

  const chips: { label: string; clear: () => void }[] = []
  if (filters.labels.length) chips.push({ label: `Etykiety: ${filters.labels.map((id) => labels.find((l) => l.id === id)?.name ?? id).join(', ')}`, clear: () => setFilters({ ...filters, labels: [] }) })
  if (filters.operation !== 'all') chips.push({ label: filters.operation, clear: () => setFilters({ ...filters, operation: 'all' }) })
  if (filters.jpk !== 'all') chips.push({ label: filters.jpk, clear: () => setFilters({ ...filters, jpk: 'all' }) })
  if (filters.series.length) chips.push({ label: `Serie: ${filters.series.join(', ')}`, clear: () => setFilters({ ...filters, series: [] }) })

  const toggleLabel = (docId: string, labelId: string) =>
    setAssigned((a) => {
      const cur = a[docId] ?? []
      const next = cur.includes(labelId) ? cur.filter((x) => x !== labelId) : [...cur, labelId]
      return { ...a, [docId]: next }
    })
  const addLabel = (name: string, color: string) => {
    setLabels((ls) => [...ls, { id: `l${Date.now().toString(36)}`, name, color }])
    showToast(`Dodano etykietę „${name}”`)
  }
  const removeLabel = (id: string) => {
    setLabels((ls) => ls.filter((l) => l.id !== id))
    setAssigned((a) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.filter((x) => x !== id)])))
    setFiltersRaw((f) => ({ ...f, labels: f.labels.filter((x) => x !== id) }))
  }
  const usage = useMemo(() => {
    const u: Record<string, number> = {}
    for (const ids of Object.values(assigned)) for (const id of ids) u[id] = (u[id] ?? 0) + 1
    return u
  }, [assigned])

  const checkKsef = useCallback((d: Doc) => {
    setChecking((c) => new Set(c).add(d.id))
    window.setTimeout(() => {
      const num = `5260250274-${d.date.replace(/-/g, '')}-${(d.id.length * 7919 + d.number.length * 104729).toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}-${String((d.number.length * 13) % 97).padStart(2, '0')}`
      setKsefMap((m) => ({ ...m, [d.id]: num }))
      setChecking((c) => { const n = new Set(c); n.delete(d.id); return n })
      showToast(`${d.number}: potwierdzono w KSeF`)
    }, 1100)
  }, [showToast])

  const printDoc = () => window.print()
  const previewDoc = previewId ? source.find((d) => d.id === previewId) ?? null : null

  return (
    <>
      <div className="reg">
        <div className="page-head">
          <div className="head-top">
            <span className="crumb">Ewidencje<span className="crumb-org"> · Onsaldo Preview Sp. z o.o.</span></span>
            <div className="status">
              <span className="pill">DEMO</span>
            </div>
          </div>
          <div className="head-row">
            <h1>Rejestry i VAT</h1>
            <div className="tabs" role="tablist" aria-label="Rodzaj rejestru">
          <button role="tab" aria-selected={kind === 'sales'} className={kind === 'sales' ? 'on' : ''} onClick={() => switchKind('sales')}>
            <Icon name="receipt" size={17} />
            <span className="long">Rejestr VAT sprzedaży</span><span className="short">Sprzedaż</span>
          </button>
          <button role="tab" aria-selected={kind === 'purchases'} className={kind === 'purchases' ? 'on' : ''} onClick={() => switchKind('purchases')}>
            <Icon name="cart" size={17} />
            <span className="long">Rejestr VAT zakupów</span><span className="short">Zakupy</span>
          </button>
        </div>
          </div>
          <div className="lede-row">
            <p className="lede">Sprzedaż i zakupy w wybranym okresie — podgląd danych demonstracyjnych.</p>
            <p className="inline-note warn" role="note">
              <Icon name="info" size={15} /> Kontekst VAT wymaga potwierdzenia. Poniżej wyłącznie dane demonstracyjne, nie ewidencja organizacji.
            </p>
          </div>
        </div>

        {!showError && <Summary docs={sorted} periodLabel={periodLabel} dim={loading || sorted.length === 0} />}

        <Toolbar
          kind={kind}
          filters={filters}
          setFilters={setFilters}
          resultCount={sorted.length}
          columns={columns}
          setColumns={setColumns}
          disabled={showError}
          labels={labels}
          onLabels={() => setLabelsOpen(true)}
          onPrint={() => window.print()}
          onExport={() => { exportCsv(sorted, kind); showToast('Pobrano plik CSV') }}
        />

        {(chips.length > 0 || anyFilter) && !showError && (
          <div className="active-chips" aria-label="Aktywne filtry">
            {chips.map((c) => (
              <button key={c.label} className="chip on removable" onClick={c.clear} aria-label={`Usuń filtr: ${c.label}`}>
                {c.label} <Icon name="x" size={13} />
              </button>
            ))}
            <button className="link" onClick={clearAll}>Wyczyść filtry</button>
          </div>
        )}

        <section className="panel" aria-live="polite">
          {showError ? (
            <ErrorState onRetry={() => switchDemo('data')} />
          ) : loading ? (
            <Skeleton />
          ) : sorted.length === 0 ? (
            <EmptyState filtered={anyFilter} onClear={clearAll} periodLabel={periodLabel} />
          ) : (
            <>
              <DocList
                docs={slice}
                columns={columns}
                sort={sort}
                onSort={onSort}
                expanded={expanded}
                setExpanded={setExpanded}
                onToast={showToast}
                labels={labels}
                assigned={assigned}
                onToggleLabel={toggleLabel}
                onManageLabels={() => setLabelsOpen(true)}
                onPreview={(d) => setPreviewId(d.id)}
                onPdf={(d) => { setPreviewId(d.id); window.setTimeout(printDoc, 350) }}
                onKsef={checkKsef}
                checking={checking}
              />
              <footer className="pager">
                <span className="pager-count">
                  {from}–{to} z {sorted.length} {plural(sorted.length, 'zapisu', 'zapisów', 'zapisów')}
                </span>
                <div className="pager-ctrl">
                  <label className="per">
                    <span className="sr">Na stronie</span>
                    <select
                      value={perPage}
                      onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
                      aria-label="Liczba zapisów na stronie"
                    >
                      {[10, 25, 50].map((n) => <option key={n} value={n}>{n} na stronie</option>)}
                    </select>
                  </label>
                  <div className="steps">
                    <button className="icon-btn sm" onClick={() => setPage(cur - 1)} disabled={cur <= 1} aria-label="Poprzednia strona">
                      <Icon name="chevL" size={16} />
                    </button>
                    <span className="pg">{cur} / {pages}</span>
                    <button className="icon-btn sm" onClick={() => setPage(cur + 1)} disabled={cur >= pages} aria-label="Następna strona">
                      <Icon name="chevR" size={16} />
                    </button>
                  </div>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>

      {labelsOpen && <LabelsManager labels={labels} usage={usage} onAdd={addLabel} onRemove={removeLabel} onClose={() => setLabelsOpen(false)} />}
      {previewDoc && (
        <DocPreview doc={previewDoc} kind={kind} checking={checking.has(previewDoc.id)} onKsef={() => checkKsef(previewDoc)} onPrint={printDoc} onClose={() => setPreviewId(null)} />
      )}

      <div className={`demo-switch ${demoOpen ? 'open' : ''}`} role="group" aria-label="Stan demonstracyjny">
        <span>Stan</span>
        {(['data', 'empty', 'error'] as DemoState[]).map((s) => (
          <button
            key={s}
            className={demo === s ? 'on' : ''}
            onClick={() => {
              if (window.matchMedia('(max-width: 760px)').matches && !demoOpen) { setDemoOpen(true); return }
              switchDemo(s)
              setDemoOpen(false)
            }}
            aria-pressed={demo === s}
          >
            {s === 'data' ? 'Dane' : s === 'empty' ? 'Pusto' : 'Błąd'}
          </button>
        ))}
      </div>
    </>
  )
}
