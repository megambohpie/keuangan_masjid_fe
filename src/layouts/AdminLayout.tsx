import { Outlet, useNavigate } from 'react-router-dom'
import { logout as apiLogout } from '@/api/auth'
import AppShell from '@/components/layout/app-shell'
import type { AppHeaderProps } from '@/components/layout/app-header'
import type { AppSidebarProps } from '@/components/layout/app-sidebar'

export default function AdminLayout() {
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore API errors, proceed to local logout/redirect
    } finally {
      navigate('/login', { replace: true })
    }
  }

  // Resolve display name: prefer stored user object (nama/name), fallback to userName
  let displayName: string = 'Admin'
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as { nama?: string; name?: string }
        displayName = user?.nama || user?.name || displayName
      } catch {
        // ignore parse error
      }
    } else {
      displayName = localStorage.getItem('userName') || displayName
    }
  }

  const headerProps: AppHeaderProps = {
    title: '',
    onLogout: onLogout,
    userName: displayName,
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
