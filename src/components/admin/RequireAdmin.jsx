import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * Renders children only when the logged-in user has role "admin".
 * Expects login API to return `{ token, user: { ..., role: "admin" | "customer" } }`.
 */
const RequireAdmin = ({ children }) => {
  const { isAdmin, user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

export default RequireAdmin
