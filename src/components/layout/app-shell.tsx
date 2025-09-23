import { useState } from "react"
import type { PropsWithChildren } from "react"
import AppHeader, { type AppHeaderProps } from "./app-header"
import AppSidebar, { type AppSidebarProps } from "./app-sidebar"

export interface AppShellProps extends PropsWithChildren {
  headerProps?: AppHeaderProps
  sidebarProps?: AppSidebarProps
}

export default function AppShell({ headerProps, sidebarProps, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggleSidebar = () => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
    if (isDesktop) {
      setCollapsed((c) => !c)
    } else {
      setMobileOpen((o) => !o)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar {...sidebarProps} collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader {...headerProps} onToggleSidebar={handleToggleSidebar} sidebarCollapsed={collapsed} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
