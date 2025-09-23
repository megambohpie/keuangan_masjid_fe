export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Admin</li>
          <li>Laporan</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Laporan Keuangan</h2>
          <p className="text-base-content/70">Contoh tabel laporan pemasukan dan pengeluaran.</p>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Deskripsi</th>
                  <th>Tipe</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-09-01</td>
                  <td>Donasi Jumat</td>
                  <td><span className="badge badge-success">Pemasukan</span></td>
                  <td>Rp 5.000.000</td>
                </tr>
                <tr>
                  <td>2025-09-03</td>
                  <td>Listrik</td>
                  <td><span className="badge badge-error">Pengeluaran</span></td>
                  <td>Rp 750.000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary btn-sm">Export</button>
          </div>
        </div>
      </div>
    </div>
  )
}
