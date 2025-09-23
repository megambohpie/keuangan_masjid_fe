import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { sampleMenu } from "@/data/sampleMenu"

export interface SidebarItem {
  key: string
  label: string
  path: string
  icon?: React.ReactNode
}

export interface AppSidebarProps {
  items?: SidebarItem[]
  footer?: React.ReactNode
  collapsed?: boolean
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export default function AppSidebar({ items = sampleMenu, footer, collapsed = false, mobileOpen = false, onCloseMobile }: AppSidebarProps) {
  const location = useLocation()
  
  const Menu = (
    <>
      {/* Brand */}
      <div className={cn("h-16 px-4 border-b flex items-center", collapsed && "justify-center px-0")}>
        <div className="text-xl font-bold text-primary">S.</div>
        {!collapsed && (
          <div className="ml-2 text-xs text-muted-foreground">Modern Admin Dashboard</div>
        )}
      </div>

      {/* Menu */}
      <nav className={cn("flex-1 p-3", collapsed && "px-2")}>        
        <ul className="space-y-1">
          {items.map((m) => {
            const active = location.pathname === m.path || (location.pathname === "/admin" && m.path === "/admin")
            return (
              <li key={m.key}>
                <NavLink
                  to={m.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-islamic-100 text-islamic-700" : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  end={m.path === "/admin"}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-islamic-600">
                    {m.icon ?? <span className="text-xs">•</span>}
                  </span>
                  {!collapsed && <span className="truncate">{m.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          {footer ?? (
            <Card className="p-3 text-xs text-muted-foreground">
              Please, organize your menus through button below!
            </Card>
          )}
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex shrink-0 flex-col border-r bg-card/60 backdrop-blur-sm transition-[width] duration-200",
        collapsed ? "w-16" : "w-72"
      )}>
        {Menu}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={onCloseMobile} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-xl flex flex-col">
            {/* Close area/header */}
            <div className="h-16 px-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">Menu</div>
              <button onClick={onCloseMobile} className="rounded p-2 hover:bg-accent" aria-label="Close sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {/* In mobile we always show labels */}
              <div className="p-3">
                <ul className="space-y-1">
                  {items.map((m) => {
                    const active = location.pathname === m.path || (location.pathname === "/admin" && m.path === "/admin")
                    return (
                      <li key={m.key}>
                        <NavLink
                          to={m.path}
                          onClick={onCloseMobile}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active ? "bg-islamic-100 text-islamic-700" : "hover:bg-accent hover:text-accent-foreground"
                          )}
                          end={m.path === "/admin"}
                        >
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-islamic-600">
                            {m.icon ?? <span className="text-xs">•</span>}
                          </span>
                          <span className="truncate">{m.label}</span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
