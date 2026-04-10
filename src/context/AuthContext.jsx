/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const AUTH_USER_KEY = 'auth_user'

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

/** Works with User schema role enum and any casing from the API */
export function isAdminRole(role) {
  return String(role ?? '').toLowerCase() === 'admin'
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => loadStoredUser())

  const setUser = useCallback((next) => {
    if (next == null) {
      localStorage.removeItem(AUTH_USER_KEY)
      setUserState(null)
      return
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next))
    setUserState(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem(AUTH_USER_KEY)
    setUserState(null)
  }, [])

  const isAdmin = isAdminRole(user?.role)

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      isAdmin,
      isAuthenticated: Boolean(user),
    }),
    [user, setUser, logout, isAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
