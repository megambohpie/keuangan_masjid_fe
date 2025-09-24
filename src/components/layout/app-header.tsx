import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export interface AppHeaderProps {
  title?: string
  onLogout?: () => void
  rightExtra?: React.ReactNode
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
  userName?: string
}

export default function AppHeader({ title = "Keuangan Masjid", onLogout, rightExtra, onToggleSidebar, sidebarCollapsed, userName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-islamic-600 text-white shadow-md backdrop-blur supports-[backdrop-filter]:bg-islamic-600/95">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} title={sidebarCollapsed ? 'Show menu' : 'Hide menu'} className="text-white hover:bg-white/10">
            {sidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
          <Link to="/admin" className="text-lg font-semibold text-white">
            {title}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {rightExtra}
          {userName && (
            <div className="hidden sm:block text-base md:text-lg font-semibold text-white">
              {userName}
            </div>
          )}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-white hover:bg-white/10" aria-label="Open user menu">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarFallback className="bg-primary text-primary-foreground">🕌</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={8} className="z-50 min-w-[180px] rounded-md border bg-white p-1 text-gray-700 shadow-md">
              <DropdownMenu.Item className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                <Link to="/admin/profile" className="w-full text-left">Profil</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-muted" />
              <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); onLogout?.(); }} className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 focus:text-red-700">
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  )
}
