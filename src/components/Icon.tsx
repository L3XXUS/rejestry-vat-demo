import type { SVGProps } from 'react'

const P: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.2-4.2',
  x: 'M6 6l12 12M18 6 6 18',
  chevD: 'm6 9 6 6 6-6',
  chevL: 'm15 6-6 6 6 6',
  chevR: 'm9 6 6 6-6 6',
  filter: 'M4 6h16M7 12h10M10 18h4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Zm5-5h.01',
  print: 'M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7v-7Z',
  download: 'M12 4v11m0 0-4-4m4 4 4-4M5 20h14',
  columns: 'M4 5h16v14H4V5Zm5 0v14m6-14v14',
  calendar: 'M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  info: 'M12 11v5m0-8.5h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  sortUp: 'm8 14 4-4 4 4',
  sortDown: 'm8 10 4 4 4-4',
  sort: 'M8 9l4-4 4 4M8 15l4 4 4-4',
  copy: 'M9 9h10v11H9V9Zm-4 6V4h10',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  shield: 'M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6l-8-3Zm-3 9 2.2 2.2L15.5 10',
  file: 'M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6M10 17h6',
  alert: 'M12 8v5m0 3.5h.01M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z',
  refresh: 'M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4',
  arrowUp: 'M12 19V5m0 0-6 6m6-6 6 6',
  arrowDown: 'M12 5v14m0 0 6-6m-6 6-6-6',
  back: 'M19 12H5m0 0 6-6m-6 6 6 6',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  grid: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  bell: 'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 9a2 2 0 0 0 4 0',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  arrowR: 'M5 12h14m0 0-6-6m6 6-6 6',
  circle: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z',
  checkC: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-4 9.5 2.8 2.8L16 9.5',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11M9 8h6',
  wallet: 'M4 7a2 2 0 0 1 2-2h11v4M4 7v10a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2Zm12 6h.01',
  coins: 'M8 8a5 3 0 1 0 0-.01ZM3 8v4c0 1.7 2.2 3 5 3m-5-3v4c0 1.7 2.2 3 5 3m3-9c0-1.7 2.2-3 5-3s5 1.3 5 3-2.2 3-5 3m-5 0v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Zm0 0L12 12m9-4.5L12 12m0 9v-9',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3m8 0h3a1 1 0 0 0 1-1v-3M8 12l3 3 5-6',
  logout: 'M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m5-12 4 4m0 0-4 4m4-4H9',
  settings: 'M4 7h9m4 0h3M4 17h3m4 0h9M15 4v6m-6 4v6',
  cart: 'M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19 8H6.2M9 20h.01M17 20h.01',
}

export function Icon({ name, size = 18, ...rest }: { name: keyof typeof P | string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={P[name]} />
    </svg>
  )
}
