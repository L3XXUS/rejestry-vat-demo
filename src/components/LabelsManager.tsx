import { useState } from 'react'
import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { plural } from '../format'
import { LABEL_COLORS, type Label } from '../labels'

interface Props {
  labels: Label[]
  usage: Record<string, number>
  onAdd: (name: string, color: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export function LabelsManager({ labels, usage, onAdd, onRemove, onClose }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(LABEL_COLORS[2])
  const trimmed = name.trim()
  const dup = labels.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trimmed || dup) return
    onAdd(trimmed, color)
    setName('')
  }

  return (
    <Dialog title="Etykiety" onClose={onClose} footer={<button className="btn primary" onClick={onClose}>Gotowe</button>}>
      <p className="dlg-hint">Etykiety pomagają oznaczać zapisy. Przypisujesz je w szczegółach wiersza (strzałka przy zapisie), a potem filtrujesz w „Filtry”.</p>

      {labels.length === 0 ? (
        <p className="dlg-empty">Nie masz jeszcze etykiet. Dodaj pierwszą poniżej.</p>
      ) : (
        <ul className="lbl-list">
          {labels.map((l) => (
            <li key={l.id}>
              <span className="lchip" style={{ ['--lc' as string]: l.color }}><i />{l.name}</span>
              <small>{usage[l.id] ? `${usage[l.id]} ${plural(usage[l.id], 'zapis', 'zapisy', 'zapisów')}` : 'nieużywana'}</small>
              <button className="icon-btn sm" onClick={() => onRemove(l.id)} aria-label={`Usuń etykietę ${l.name}`}>
                <Icon name="x" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="lbl-form" onSubmit={submit}>
        <div className="field-label">Nowa etykieta</div>
        <div className="lbl-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa, np. Do zapłaty" maxLength={24} aria-label="Nazwa etykiety" />
          <button className="btn primary" type="submit" disabled={!trimmed || dup}>Dodaj</button>
        </div>
        {dup && <small className="lbl-err">Taka etykieta już istnieje.</small>}
        <div className="swatches" role="radiogroup" aria-label="Kolor etykiety">
          {LABEL_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              role="radio"
              aria-checked={color === c}
              aria-label={`Kolor ${c}`}
              className={`sw ${color === c ? 'on' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </form>
    </Dialog>
  )
}
