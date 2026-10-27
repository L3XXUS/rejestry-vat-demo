import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

interface PopProps {
  title: string
  align?: 'left' | 'right'
  width?: number
  trigger: (p: { open: boolean; toggle: () => void; id: string }) => ReactNode
  children: (api: { close: () => void }) => ReactNode
}

/** Popover na desktopie, bottom-sheet na telefonie (przełączane w CSS). */
export function Pop({ title, align = 'left', width = 360, trigger, children }: PopProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const [up, setUp] = useState(false)

  useLayoutEffect(() => {
    if (!open || !wrap.current || window.innerWidth <= 760) { setUp(false); return }
    const panel = document.getElementById(id)
    if (!panel) return
    const r = wrap.current.getBoundingClientRect()
    const h = panel.scrollHeight + 16
    setUp(r.bottom + h > window.innerHeight && r.top > window.innerHeight - r.bottom)
  }, [open, id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="pop" ref={wrap}>
      {trigger({ open, toggle: () => setOpen((o) => !o), id })}
      {open && (
        <>
          <div className="pop-backdrop" onClick={close} />
          <div
            id={id}
            className={`pop-panel align-${align} ${up ? 'up' : ''}`}
            style={{ ['--pop-w' as string]: `${width}px` }}
            role="dialog"
            aria-label={title}
          >
            <div className="pop-grab" aria-hidden="true" />
            <div className="pop-head">
              <strong>{title}</strong>
              <button className="icon-btn sm" onClick={close} aria-label="Zamknij">
                <Icon name="x" size={16} />
              </button>
            </div>
            {children({ close })}
          </div>
        </>
      )}
    </div>
  )
}
