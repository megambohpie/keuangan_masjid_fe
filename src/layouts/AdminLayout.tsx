import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { sampleMenu } from '../data/sampleMenu'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <Link to="/admin" className="text-lg font-semibold text-primary">
                Keuangan Masjid
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">🕌</AvatarFallback>
                  </Avatar>
                </Button>
                <div className="absolute right-0 top-10 z-10 hidden group-hover:block">
                  <Card className="w-52">
                    <CardContent className="p-2">
                      <div className="space-y-1">
                        <Link to="/admin" className="block rounded px-2 py-1 text-sm hover:bg-accent">
                          Beranda
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
                        >
                          Logout
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
          <footer className="mt-10 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Keuangan Masjid. Dibuat dengan Tailwind + shadcn/ui.
          </footer>
        </main>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-72 border-l bg-card lg:block">
        {/* Brand */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">🕌</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-primary">Admin Panel</div>
              <div className="text-xs text-muted-foreground">Halo, selamat datang</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {sampleMenu.map((m) => (
              <li key={m.key}>
                <NavLink
                  to={m.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive || (location.pathname === '/admin' && m.path === '/admin')
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                  end={m.path === '/admin'}
                >
                  <span className="mr-2">{m.icon}</span> {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          Tema: <span className="text-primary font-medium">masjid</span>
        </div>
      </aside>
    </div>
  )
}
