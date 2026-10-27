import type { Label } from '../labels'

export function LabelChip({ label, onClick, on }: { label: Label; onClick?: () => void; on?: boolean }) {
  const style = { ['--lc' as string]: label.color }
  const cls = `lchip ${onClick ? 'btn-like' : ''} ${on ? 'on' : ''}`
  return onClick ? (
    <button className={cls} style={style} onClick={onClick} aria-pressed={on}>
      <i />{label.name}
    </button>
  ) : (
    <span className={cls} style={style}><i />{label.name}</span>
  )
}
