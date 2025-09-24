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
    title: '',
    onLogout: onLogout,
    userName: (typeof window !== 'undefined' && localStorage.getItem('userName')) || 'Admin',
  }

  const sidebarProps: AppSidebarProps = {
    // uses default sampleMenu
  }

  return (
    <AppShell headerProps={headerProps} sidebarProps={sidebarProps}>
      <div className="min-h-full flex flex-col">
        <Outlet />
        <footer className="mt-auto pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Keuangan Masjid. Dibuat dengan Tailwind + shadcn/ui.
        </footer>
      </div>
    </AppShell>
  )
}
