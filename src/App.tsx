import { useCallback, useEffect, useRef, useState } from 'react'

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    on()
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

import { PeriodBar } from './components/PeriodBar'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import type { ViewId } from './areas'
import Overview from './views/Overview'
import Placeholder from './views/Placeholder'
import Register from './views/Register'

const initialView = (): ViewId => (new URLSearchParams(window.location.search).get('view') === 'vat' ? 'vat' : 'overview')

export default function App() {
  const [view, setView] = useState<ViewId>(initialView)
  const [confirmed, setConfirmed] = useState(false)
  const [year, setYear] = useState('2026')
  const [periodHidden, setPeriodHidden] = useState(false)
  const tablet = useMedia('(max-width: 1100px)')
  const phone = useMedia('(max-width: 760px)')
  const rail = tablet && !phone // tablet: zawsze wąski pasek z ikonami
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('side') === '1')
  const effCollapsed = phone ? false : rail ? true : collapsed
  const [dark, setDark] = useState(() => new URLSearchParams(window.location.search).get('theme') === 'dark')
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const showToast = useCallback((m: string) => {
    setToast(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.mode = dark ? 'dark' : 'light'
  }, [dark])

  const go = (v: ViewId) => { setView(v); window.scrollTo({ top: 0 }) }


  return (
    <div className={`shell ${effCollapsed ? 'collapsed' : ''}`}>
      {!phone && <Sidebar view={view} setView={go} confirmed={confirmed} collapsed={effCollapsed} showToggle={!tablet} toggle={() => setCollapsed((c) => { try { localStorage.setItem('side', c ? '0' : '1') } catch { /* ignore */ } return !c })} />}
      <div className="content">
        <div className="orb" aria-hidden="true" />
        <Topbar dark={dark} toggleDark={() => setDark((d) => !d)} onToast={showToast} periodHidden={periodHidden} periodYear={year} periodConfirmed={confirmed} restorePeriod={() => setPeriodHidden(false)} />
        <main className="wrap">
          {!periodHidden && (
            <PeriodBar year={year} confirmed={confirmed} onDismiss={() => setPeriodHidden(true)} onConfirm={(y) => { setYear(y); setConfirmed(true); showToast(`Okres ${y} potwierdzony`) }} />
          )}
          {view === 'overview' && <Overview confirmed={confirmed} year={year} open={go} />}
          {view === 'vat' && <Register showToast={showToast} year={year} />}
          {view !== 'overview' && view !== 'vat' && <Placeholder id={view} confirmed={confirmed} back={() => go('overview')} />}
        </main>
      </div>
      {phone && <BottomNav view={view} setView={go} confirmed={confirmed} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
