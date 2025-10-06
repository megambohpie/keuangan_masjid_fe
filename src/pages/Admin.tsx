import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from './Dashboard'
import AdminReports from './admin/AdminReports'
import AdminUsers from './admin/AdminUsers'
import MasterTingkatPage from './master/tingkat'
import MasterRegionalPage from './master/regional'
import MasterDaerahPage from './master/daerah'
import NotFound from './NotFound'

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="master/tingkat" element={<MasterTingkatPage />} />
        <Route path="master/regional" element={<MasterRegionalPage />} />
        <Route path="master/daerah" element={<MasterDaerahPage />} />
        {/* Catch-all for unknown admin routes -> 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
