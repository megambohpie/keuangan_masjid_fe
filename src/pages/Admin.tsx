import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminHome from './admin/AdminHome'
import AdminReports from './admin/AdminReports'
import AdminUsers from './admin/AdminUsers'

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}
