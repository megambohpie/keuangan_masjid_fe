export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Admin</li>
          <li>Beranda</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Pemasukan</h2>
            <p className="text-base-content/70">Ringkasan pemasukan terbaru.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Detail</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Pengeluaran</h2>
            <p className="text-base-content/70">Ringkasan pengeluaran terbaru.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-secondary btn-sm">Detail</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Agenda Kegiatan</h2>
            <p className="text-base-content/70">Jadwal kegiatan mendatang.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-outline btn-sm">Lihat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
