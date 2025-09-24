import { useState } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  type AuthLocationState = { from?: { pathname?: string } }
  const location = useLocation() as Location<AuthLocationState>
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
      // Save user name for header display
      const guessedName = email?.split('@')[0] || 'Admin'
      localStorage.setItem('userName', guessedName)

      // Navigate to intended route or admin shell (so header/sidebar appear)
      const redirectTo = location.state?.from?.pathname ?? '/admin'
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-islamic-50 via-white to-islamic-100 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-islamic-100 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-islamic-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-islamic-300 opacity-10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-80 h-80 relative">
              {/* Islamic geometric pattern background */}
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-400 to-islamic-600 rounded-3xl opacity-90"></div>
              <div className="absolute inset-4 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🕌</div>
                  <h1 className="text-2xl font-bold mb-2">Keuangan Masjid</h1>
                  <p className="text-sm opacity-90">Sistem Manajemen Modern</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-islamic-300 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-islamic-500 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-islamic-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🕌</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-gray-600">
                Masuk ke akun Anda untuk melanjutkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 text-base border-gray-200 focus:border-islamic-500 focus:ring-islamic-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 text-base border-gray-200 focus:border-islamic-500 focus:ring-islamic-500"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-islamic-500 hover:bg-islamic-600 text-white border-0"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memproses...
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-gray-600 hover:text-islamic-600 p-0 h-auto"
                  >
                    Lupa Kata Sandi?
                  </Button>
                </div>

                {/* Mobile logo */}
                <div className="lg:hidden text-center pt-4">
                  <div className="inline-flex items-center gap-2 text-islamic-600">
                    <span className="text-2xl">🕌</span>
                    <span className="font-semibold">Keuangan Masjid</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
