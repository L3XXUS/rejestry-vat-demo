import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

interface Props {
  title: string
  onClose: () => void
  side?: boolean // panel z prawej (desktop) / pełny arkusz (telefon)
  children: ReactNode
  footer?: ReactNode
}

/** Okno modalne: Esc i kliknięcie w tło zamykają, fokus wraca na przycisk, który je otworzył. */
export function Dialog({ title, onClose, side, children, footer }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button:not(:disabled), input, [href], select, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [onClose])

  return createPortal(
    <div className="dlg-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`dlg ${side ? 'side' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <div className="dlg-head">
          <strong>{title}</strong>
          <button className="icon-btn sm" onClick={onClose} aria-label="Zamknij"><Icon name="x" size={18} /></button>
        </div>
        <div className="dlg-body">{children}</div>
        {footer && <div className="dlg-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
