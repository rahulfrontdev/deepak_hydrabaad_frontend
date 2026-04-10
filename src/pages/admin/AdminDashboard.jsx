import { Link } from 'react-router-dom'
import { LayoutGrid, Package, Tags, Users } from 'lucide-react'

const cards = [
  {
    to: '/admin/categories',
    title: 'Categories',
    description: 'Create and edit product categories.',
    icon: Tags,
    color: 'bg-violet-100 text-violet-700',
  },
  {
    to: '/admin/products',
    title: 'Products',
    description: 'Add, update, or remove catalog items.',
    icon: Package,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    to: '/admin/users',
    title: 'Users',
    description: 'View customers and admins, manage roles.',
    icon: Users,
    color: 'bg-amber-100 text-amber-800',
  },
]

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <LayoutGrid size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage categories, products, and users. Choose a section below.
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const IconCmp = card.icon
          return (
          <li key={card.to}>
            <Link
              to={card.to}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <IconCmp size={20} />
              </span>
              <span className="text-lg font-semibold text-slate-900">{card.title}</span>
              <span className="mt-1 text-sm text-slate-600">{card.description}</span>
              <span className="mt-4 text-sm font-medium text-blue-600">Open →</span>
            </Link>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminDashboard
