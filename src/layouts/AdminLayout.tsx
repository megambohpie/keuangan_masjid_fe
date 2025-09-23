import { Outlet, useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/app-shell'
import type { AppHeaderProps } from '@/components/layout/app-header'
import type { AppSidebarProps } from '@/components/layout/app-sidebar'

export default function AdminLayout() {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login', { replace: true })
  }

  const headerProps: AppHeaderProps = {
    title: 'Keuangan Masjid',
    onLogout: onLogout,
  }

  const sidebarProps: AppSidebarProps = {
    // uses default sampleMenu
  }

  return (
    <AppShell headerProps={headerProps} sidebarProps={sidebarProps}>
      <Outlet />
      <footer className="mt-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Keuangan Masjid. Dibuat dengan Tailwind + shadcn/ui.
      </footer>
    </AppShell>
  )
}
