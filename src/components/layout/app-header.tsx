import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface AppHeaderProps {
  title?: string
  onLogout?: () => void
  rightExtra?: React.ReactNode
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
}

export default function AppHeader({ title = "Keuangan Masjid", onLogout, rightExtra, onToggleSidebar, sidebarCollapsed }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} title={sidebarCollapsed ? 'Show menu' : 'Hide menu'}>
            {sidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
          <Link to="/admin" className="text-lg font-semibold text-primary">
            {title}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {rightExtra}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onLogout} title="Logout">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">🕌</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
