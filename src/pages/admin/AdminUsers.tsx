export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Admin</li>
          <li>Pengguna</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Daftar Pengguna</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Peran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Admin Masjid</td>
                  <td>admin@masjid.id</td>
                  <td><span className="badge badge-primary">Administrator</span></td>
                  <td>
                    <button className="btn btn-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Bendahara</td>
                  <td>bendahara@masjid.id</td>
                  <td><span className="badge">Bendahara</span></td>
                  <td>
                    <button className="btn btn-sm">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
