import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { fmtMoney } from '../format'
import type { Doc, RegisterKind } from '../types'

const ORG = 'Onsaldo Preview Sp. z o.o.'
const fmtDate = (iso: string) => iso.split('-').reverse().join('.')

interface Props {
  doc: Doc
  kind: RegisterKind
  checking: boolean
  onKsef: () => void
  onClose: () => void
  onPrint: () => void
}

export function DocPreview({ doc: d, kind, checking, onKsef, onClose, onPrint }: Props) {
  const sales = kind === 'sales'
  const correction = d.series === 'KOR'
  const title = `${correction ? 'Korekta faktury' : 'Faktura'} ${sales ? 'sprzedaży' : 'zakupu'}`
  const gross = d.net + d.vat

  return (
    <Dialog
      side
      title="Podgląd dokumentu"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Zamknij</button>
          <button className="btn primary" onClick={onPrint}><Icon name="print" size={16} /> Drukuj / zapisz PDF</button>
        </>
      }
    >
      <article className="doc" aria-label={`${title} ${d.number}`}>
        <header className="doc-head">
          <div>
            <div className="doc-kind">{title}</div>
            <h3 className="mono">{d.number}</h3>
          </div>
          <span className="doc-demo">DEMO</span>
        </header>

        <div className="doc-parties">
          <div>
            <small>{sales ? 'Sprzedawca' : 'Nabywca'}</small>
            <strong>{ORG}</strong>
          </div>
          <div>
            <small>{sales ? 'Nabywca' : 'Sprzedawca'}</small>
            <strong>{d.counterparty}</strong>
          </div>
          <div>
            <small>Data wystawienia</small>
            <strong>{fmtDate(d.date)}</strong>
          </div>
          <div>
            <small>Identyfikator</small>
            <strong className="mono">{d.id}</strong>
          </div>
        </div>

        <table className="doc-tbl">
          <thead>
            <tr><th>Opis</th><th>Netto</th><th>Stawka</th><th>VAT</th><th>Brutto</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{d.operation}</td>
              <td>{fmtMoney(d.net)}</td>
              <td>{d.rate}</td>
              <td>{fmtMoney(d.vat)}</td>
              <td>{fmtMoney(gross)}</td>
            </tr>
          </tbody>
        </table>
        <div className="doc-total"><span>Razem brutto</span><strong>{fmtMoney(gross)}</strong></div>

        <dl className="doc-meta">
          <div><dt>Kod JPK V7</dt><dd>{d.jpk}</dd></div>
          <div><dt>Seria</dt><dd>{d.series}</dd></div>
        </dl>

        <section className={`doc-ksef ${d.ksef ? 'ok' : ''}`} aria-live="polite">
          <div>
            <small>Status KSeF</small>
            {d.ksef ? (
              <>
                <strong><Icon name="check" size={15} /> Potwierdzono w KSeF</strong>
                <span className="mono">{d.ksef}</span>
              </>
            ) : (
              <strong>{checking ? 'Sprawdzanie w KSeF…' : 'Brak potwierdzenia'}</strong>
            )}
          </div>
          {!d.ksef && (
            <button className="btn sm" onClick={onKsef} disabled={checking}>
              {checking ? <span className="spin" aria-hidden="true" /> : <Icon name="shield" size={15} />} {checking ? 'Sprawdzam' : 'Potwierdź w KSeF'}
            </button>
          )}
        </section>
        <p className="doc-foot">Dane demonstracyjne. Dokument nie jest fakturą ani ewidencją organizacji.</p>
      </article>
    </Dialog>
  )
}
