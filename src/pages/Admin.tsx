import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from './Dashboard'
import AdminReports from './admin/AdminReports'
import AdminUsers from './admin/AdminUsers'
import MasterTingkatPage from './master/tingkat'

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="master/tingkat" element={<MasterTingkatPage />} />
        {/* Alias to support BE key-style path if provided directly */}
        <Route path="master_tingkat" element={<MasterTingkatPage />} />
      </Route>
    </Routes>
  )
}
