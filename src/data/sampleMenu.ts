export type MenuItem = {
  key: string
  label: string
  icon?: string // daisyUI icon placeholders (we can use emoji for now)
  path: string
}

export const sampleMenu: MenuItem[] = [
  { key: 'home', label: 'Beranda', icon: '🏠', path: '/admin' },
  { key: 'reports', label: 'Laporan', icon: '📊', path: '/admin/reports' },
  { key: 'users', label: 'Pengguna', icon: '👤', path: '/admin/users' },
]
