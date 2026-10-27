export interface Label { id: string; name: string; color: string }

export const LABEL_COLORS = ['#e0a100', '#2fa36b', '#3d63e0', '#d9473b', '#7a52e0', '#8d8d84']

export const DEFAULT_LABELS: Label[] = [
  { id: 'check', name: 'Do sprawdzenia', color: '#e0a100' },
  { id: 'important', name: 'Ważne', color: '#d9473b' },
]

/** Zapis etykiet w przeglądarce — przeżywa odświeżenie strony. */
export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
export function saveJson(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}
