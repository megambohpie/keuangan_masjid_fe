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
  iconName?: string
  children?: SidebarItem[]
}

type ApiMenuNode = {
  id?: number
  key?: string
  name?: string
  label?: string
  icon?: string
  path?: string
  children?: ApiMenuNode[]
}

export interface AppSidebarProps {
  items?: SidebarItem[]
  footer?: React.ReactNode
  collapsed?: boolean
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

function toKebab(s: string) {
  return s.replace(/_/g, '-').toLowerCase()
}

function buildPathFromKey(key: string) {
  if (key === 'dashboard' || key === 'home') return '/admin'
  return `/admin/${toKebab(key)}`
}

function mapApiNodeToItem(node: ApiMenuNode): SidebarItem {
  const key: string = node.key || node.name || `${node.id ?? ''}`
  const label: string = node.name || node.label || key
  const iconName = node.icon
  const icon = undefined
  const path: string = node.path || buildPathFromKey(key)
  const children: SidebarItem[] | undefined = Array.isArray(node.children)
    ? node.children.map((c: ApiMenuNode) => mapApiNodeToItem(c))
    : undefined
  return { key, label, icon, iconName, path, children }
}

function loadMenuFromLocalStorage(): SidebarItem[] | null {
  try {
    const raw = localStorage.getItem('menus')
    if (!raw) return null
    const obj = JSON.parse(raw) as { flat?: unknown[]; tree?: unknown[] }
    const tree = Array.isArray(obj.tree) ? (obj.tree as ApiMenuNode[]) : []
    if (!tree.length) return null
    // Map API tree to SidebarItem[]
    return tree.map((n) => mapApiNodeToItem(n))
  } catch {
    return null
  }
}

export default function AppSidebar({ items, footer, collapsed = false, mobileOpen = false, onCloseMobile }: AppSidebarProps) {
  const location = useLocation()
  const loaded = loadMenuFromLocalStorage()
  const menuItems: SidebarItem[] = items ?? loaded ?? sampleMenu

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const buildKeySignature = (list: SidebarItem[]): string => {
    const keys: string[] = []
    const walk = (arr: SidebarItem[]) => {
      arr.forEach((m) => {
        keys.push(m.key)
        if (m.children && m.children.length) walk(m.children)
      })
    }
    walk(list)
    return keys.join('|')
  }

  const menuSignature = React.useMemo(() => buildKeySignature(menuItems), [menuItems])

  // Initialize expanded state (expand all by default) when menuItems change
  React.useEffect(() => {
    const next: Record<string, boolean> = {}
    const walk = (list: SidebarItem[]) => {
      list.forEach((m) => {
        if (m.children && m.children.length) {
          next[m.key] = true
          walk(m.children)
        }
      })
    }
    walk(menuItems)
    setExpanded(next)
  }, [menuSignature])

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }
  // Removed global expand/collapse controls per request

  const Chevron = ({ open }: { open: boolean }) => (
    <svg className={cn("h-4 w-4 transition-transform", open ? "rotate-90" : "rotate-0")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )

  const renderItems = (list: SidebarItem[], depth = 0) => (
    <ul className={cn("space-y-1", depth > 0 && "ml-4")}>
      {list.map((m) => {
        const active = location.pathname === m.path || (location.pathname === "/admin" && m.path === "/admin")
        const hasChildren = !!(m.children && m.children.length)
        const isParentLike = hasChildren || !m.path
        const isOpen = expanded[m.key] ?? true
        return (
          <li key={m.key}>
            <div className="flex items-center">
              {/* Left icon area (MDI from BE if available) */}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-islamic-600 mr-2">
                {m.iconName ? <i className={`mdi ${m.iconName}`}></i> : (m.icon ?? <span className="text-xs">•</span>)}
              </span>

              {/* Label + interaction */}
              {isParentLike ? (
                <button
                  type="button"
                  className={cn(
                    "flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    isOpen ? "bg-islamic-100 text-islamic-700" : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => toggleExpand(m.key)}
                >
                  {!collapsed && <span className="truncate text-left">{m.label}</span>}
                  {/* Right chevron */}
                  {!collapsed && <Chevron open={isOpen} />}
                </button>
              ) : (
                <NavLink
                  to={m.path || '#'}
                  className={cn(
                    "flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-islamic-100 text-islamic-700" : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  end={m.path === "/admin"}
                >
                  {!collapsed && <span className="truncate text-left">{m.label}</span>}
                </NavLink>
              )}
            </div>
            {/* Render children */}
            {!collapsed && hasChildren && isOpen && (
              <div className="mt-1">{renderItems(m.children as SidebarItem[], depth + 1)}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
  
  const Menu = (
    <>
      {/* Brand */}
      <div className={cn("h-16 px-4 border-b flex items-center", collapsed && "justify-center px-0")}>        
        <div className="text-xl font-bold text-primary">{collapsed ? 'KM' : 'Keuangan Masjid'}</div>
      </div>

      {/* Menu */}
      <nav className={cn("flex-1 p-3", collapsed && "px-2")}>{renderItems(menuItems)}</nav>

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
        "hidden lg:flex shrink-0 flex-col border-r bg-islamic-50/90 shadow-sm backdrop-blur-sm transition-[width] duration-200",
        collapsed ? "w-16" : "w-72"
      )}>
        {Menu}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={onCloseMobile} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-islamic-50 border-r shadow-xl flex flex-col">
            {/* Close area/header */}
            <div className="h-16 px-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">Menu</div>
              <button onClick={onCloseMobile} className="rounded p-2 hover:bg-accent" aria-label="Close sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {/* In mobile we always show labels */}
              <div className="p-3">{renderItems(menuItems)}</div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
