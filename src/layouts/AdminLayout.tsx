import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { sampleMenu } from '../data/sampleMenu'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/login', { replace: true })
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-20">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </label>
          </div>
          <div className="flex-1">
            <Link to="/admin" className="btn btn-ghost text-xl text-primary">Keuangan Masjid</Link>
          </div>
          <div className="flex-none gap-2">
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Main content */}
        <main className="p-4 lg:p-6 flex-1 bg-base-200">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300">
          <div className="mb-4">
            <div className="font-bold text-lg text-primary">Admin</div>
            <div className="text-sm text-base-content/60">Halo, selamat datang</div>
          </div>
          <ul className="menu">
            {sampleMenu.map((m) => (
              <li key={m.key}>
                <NavLink
                  to={m.path}
                  className={({ isActive }: { isActive: boolean }) => (isActive || (location.pathname === '/admin' && m.path === '/admin')) ? 'active' : ''}
                  end={m.path === '/admin'}
                >
                  <span className="mr-2">{m.icon}</span> {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
