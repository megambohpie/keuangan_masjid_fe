import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: Location } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Simulate login request
      await new Promise((r) => setTimeout(r, 1200))

      // Simple auth: set a dummy token
      localStorage.setItem('authToken', 'dummy-token')

      // Navigate to intended route or dashboard
      const redirectTo = (location.state?.from as any)?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10">
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold text-primary">Selamat Datang</h1>
          <p className="py-6 text-base-content/80">
            Sistem Keuangan Masjid. Silakan login untuk mengakses dashboard dan halaman admin.
          </p>
        </div>

        <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
          <form className="card-body" onSubmit={onSubmit}>
            <h2 className="card-title justify-center mb-2">Login</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div role="alert" className="alert alert-error mt-2">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control mt-6">
              <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Signing in' : 'Login'}
              </button>
            </div>
            <div className="mt-2 text-center text-sm text-base-content/70">
              Tema: hijau muda & putih. Powered by Tailwind + daisyUI.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
