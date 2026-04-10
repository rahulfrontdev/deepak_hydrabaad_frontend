import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: 'orders', label: 'My Orders' },
  { to: 'wishlist', label: 'Wishlist' },
  { to: 'profile', label: 'Profile' },
  { to: 'my-address', label: 'My Address' },
]

const AccountPage = () => {
  const linkClass = ({ isActive }) =>
    `block rounded-xl px-3 py-2 text-sm transition ${isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-neutral-700 hover:bg-neutral-100'
    }`

  return (
    <div className="mx-auto max-w-8xl px-2 py-2">
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Account</h1>
        <p className="mt-1 text-sm text-neutral-600">Manage orders, wishlist, and profile.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <nav aria-label="Account navigation" className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default AccountPage
