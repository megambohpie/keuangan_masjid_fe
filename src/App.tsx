import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import PrivateRoute from './routes/PrivateRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={<Navigate to="/admin" replace />}
      />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
