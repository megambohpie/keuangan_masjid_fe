import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-islamic-50 via-white to-islamic-100 p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-9xl font-extrabold text-islamic-600/20 select-none">404</div>
        <h1 className="text-2xl font-bold text-gray-800">Halaman tidak ditemukan</h1>
        <p className="text-gray-600">Link yang Anda buka tidak tersedia atau sudah dipindahkan.</p>
        <div className="pt-2">
          <Link to="/admin">
            <Button className="bg-islamic-600 text-white hover:bg-islamic-700">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
