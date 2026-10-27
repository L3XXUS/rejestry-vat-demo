import { Fragment } from 'react'
import { Icon } from './Icon'
import { COLUMNS, type ColumnConfig } from '../columns'
import { LabelChip } from './LabelChip'
import { fmtMoney } from '../format'
import type { Label } from '../labels'
import type { ColumnKey, Doc, SortDir, SortKey } from '../types'

interface Props {
  docs: Doc[]
  columns: ColumnConfig
  sort: { key: SortKey; dir: SortDir }
  onSort: (k: SortKey) => void
  expanded: string | null
  setExpanded: (id: string | null) => void
  onToast: (msg: string) => void
  labels: Label[]
  assigned: Record<string, string[]>
  onToggleLabel: (docId: string, labelId: string) => void
  onManageLabels: () => void
  onPreview: (d: Doc) => void
  onPdf: (d: Doc) => void
  onKsef: (d: Doc) => void
  checking: Set<string>
}

const fmtDate = (iso: string) => iso.split('-').reverse().join('.')

function KsefCell({ d, compact }: { d: Doc; compact?: boolean }) {
  if (!d.ksef) return <span className="badge muted"><i />Brak potwierdzenia</span>
  return (
    <span className="ksef-ok" title={d.ksef}>
      <Icon name="check" size={14} />
      <span className={compact ? '' : 'mono trunc'}>{compact ? 'Potwierdzono w KSeF' : d.ksef}</span>
    </span>
  )
}

function cell(k: ColumnKey, d: Doc, hiddenId: boolean, chips: React.ReactNode) {
  switch (k) {
    case 'counterparty':
      return (
        <td key={k} className="c-name">
          <strong>{d.counterparty}</strong>
          {!hiddenId && <small className="sub-id mono">{d.id}</small>}
          {chips}
        </td>
      )
    case 'date':
      return <td key={k} className="c-date col-date">{fmtDate(d.date)}</td>
    case 'number':
      return <td key={k} className="mono col-number">{d.number}</td>
    case 'ksef':
      return <td key={k} className="col-ksef"><KsefCell d={d} /></td>
    case 'id':
      return <td key={k} className="col-id mono">{d.id}</td>
  }
}

export function DocList({ docs, columns, sort, onSort, expanded, setExpanded, onToast, labels, assigned, onToggleLabel, onManageLabels, onPreview, onPdf, onKsef, checking }: Props) {
  const chipsFor = (d: Doc) => {
    const ls = labels.filter((l) => assigned[d.id]?.includes(l.id))
    return ls.length ? <span className="lchips">{ls.map((l) => <LabelChip key={l.id} label={l} />)}</span> : null
  }
  const visible = columns.order.filter((k) => !columns.hidden.includes(k))
  const idHidden = columns.hidden.includes('id')
  const toggle = (id: string) => setExpanded(expanded === id ? null : id)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      onToast(`Skopiowano: ${text}`)
    } catch {
      onToast('Nie udało się skopiować')
    }
  }

  const Details = ({ d }: { d: Doc }) => (
    <div className="details">
      <dl>
        <div><dt>Netto</dt><dd>{fmtMoney(d.net)}</dd></div>
        <div><dt>VAT ({d.rate})</dt><dd>{fmtMoney(d.vat)}</dd></div>
        <div><dt>Brutto</dt><dd>{fmtMoney(d.net + d.vat)}</dd></div>
        <div><dt>Rodzaj operacji</dt><dd>{d.operation}</dd></div>
        <div><dt>Kod JPK V7</dt><dd>{d.jpk}</dd></div>
        <div><dt>Seria</dt><dd>{d.series}</dd></div>
        <div className="wide"><dt>Numer KSeF</dt><dd className="mono">{d.ksef ?? 'Brak potwierdzenia'}</dd></div>
        <div><dt>Identyfikator</dt><dd className="mono">{d.id}</dd></div>
      </dl>
      <div className="d-labels">
        <span className="d-labels-t">Etykiety</span>
        {labels.map((l) => (
          <LabelChip key={l.id} label={l} on={!!assigned[d.id]?.includes(l.id)} onClick={() => onToggleLabel(d.id, l.id)} />
        ))}
        <button className="link-btn" onClick={onManageLabels}>{labels.length ? 'Zarządzaj' : '+ Dodaj etykietę'}</button>
      </div>
      <div className="d-actions">
        <button className="btn sm" onClick={() => onPreview(d)}>
          <Icon name="eye" size={15} /> Podgląd
        </button>
        {d.ksef ? (
          <button className="btn sm" onClick={() => onToast(`Potwierdzono w KSeF: ${d.ksef}`)}>
            <Icon name="shield" size={15} /> Status KSeF
          </button>
        ) : (
          <button className="btn sm" onClick={() => onKsef(d)} disabled={checking.has(d.id)}>
            {checking.has(d.id) ? <span className="spin" aria-hidden="true" /> : <Icon name="shield" size={15} />}{' '}
            {checking.has(d.id) ? 'Sprawdzam…' : 'Potwierdź w KSeF'}
          </button>
        )}
        <button className="btn sm" onClick={() => copy(d.id)}>
          <Icon name="copy" size={15} /> Kopiuj ID
        </button>
        <button className="btn sm" onClick={() => onPdf(d)}>
          <Icon name="file" size={15} /> PDF
        </button>
      </div>
    </div>
  )

  return (
    <div className="doclist">
      {/* Desktop / tablet */}
      <table className="tbl">
        <thead>
          <tr>
            {visible.map((k) => {
              const meta = COLUMNS.find((c) => c.key === k)!
              const active = sort.key === k
              return (
                <th
                  key={k}
                  className={`col-${k}`}
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button className="th-btn" onClick={() => onSort(k)}>
                    {meta.label}
                    <Icon name={active ? (sort.dir === 'asc' ? 'sortUp' : 'sortDown') : 'sort'} size={14} />
                  </button>
                </th>
              )
            })}
            <th className="c-act"><span className="sr">Akcje</span></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => {
            const open = expanded === d.id
            return (
              <Fragment key={d.id}>
                <tr className={open ? 'open' : ''}>
                  {visible.map((k) => cell(k, d, idHidden, chipsFor(d)))}
                  <td className="c-act">
                    <button
                      className={`icon-btn sm rot ${open ? 'on' : ''}`}
                      onClick={() => toggle(d.id)}
                      aria-expanded={open}
                      aria-label={`Szczegóły i akcje: ${d.number}`}
                    >
                      <Icon name="chevD" size={18} />
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr className="detail-row">
                    <td colSpan={visible.length + 1}><Details d={d} /></td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      {/* Telefon */}
      <ul className="cards">
        {docs.map((d) => {
          const open = expanded === d.id
          return (
            <li key={d.id} className={`card ${open ? 'open' : ''}`}>
              <button className="card-head" onClick={() => toggle(d.id)} aria-expanded={open}>
                <span className="card-top">
                  <strong>{d.counterparty}</strong>
                  <Icon name="chevD" size={18} className="chev" />
                </span>
                <span className="mono card-num">{d.number}</span>
                <span className="card-meta">
                  <span>{fmtDate(d.date)}</span>
                  <span className="mono">{d.id}</span>
                </span>
                <span className="card-ksef"><KsefCell d={d} compact /></span>
                {chipsFor(d)}
              </button>
              {open && (
                <>
                  <Details d={d} />
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
