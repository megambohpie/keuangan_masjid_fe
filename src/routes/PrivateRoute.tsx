import { Navigate, useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

function isAuthenticated() {
  return Boolean(localStorage.getItem('authToken'))
}

export default function PrivateRoute({ children }: PropsWithChildren) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
