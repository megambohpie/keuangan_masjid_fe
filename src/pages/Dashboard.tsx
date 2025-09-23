export default function Dashboard() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-base-content/70 mt-1">Ringkasan singkat aktivitas dan statistik.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Saldo Saat Ini</div>
            <div className="stat-value text-primary">Rp 120jt</div>
            <div className="stat-desc">+4% dari bulan lalu</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Pemasukan Bulan Ini</div>
            <div className="stat-value text-success">Rp 24jt</div>
            <div className="stat-desc">Derma dan donasi</div>
          </div>
          <div className="stat bg-base-100 shadow">
            <div className="stat-title">Pengeluaran Bulan Ini</div>
            <div className="stat-value text-error">Rp 7jt</div>
            <div className="stat-desc">Operasional & kegiatan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
