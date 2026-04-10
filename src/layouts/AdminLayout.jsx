import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 text-white">
        <div className="border-b border-slate-800 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</p>
          <p className="mt-1 truncate text-sm font-semibold">{user?.name ?? user?.email ?? 'Admin'}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin navigation">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/categories" className={navLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            Users
          </NavLink>
        </nav>
        <div className="border-t border-slate-800 p-3 space-y-2">
          <Link
            to="/"
            className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-300 ring-1 ring-slate-600 transition hover:bg-slate-800"
          >
            View store
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className="w-full rounded-lg bg-red-600/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="min-h-screen min-w-0 pl-64">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
