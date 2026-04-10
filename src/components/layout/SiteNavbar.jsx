import { Link, NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `inline-block border-b-2 px-0 py-2 text-sm text-slate-900 transition-colors ${isActive
    ? 'border-cyan-600 text-cyan-700'
    : 'border-transparent'
  }`

const SiteNavbar = () => {
  return (
    <nav className="bg-[#74BFBF] p-2" aria-label="Primary navigation">
      <div className="relative flex items-center justify-center gap-4 overflow-visible">

        <Link to="/" className="whitespace-nowrap px-2 py-1 text-sm text-slate-900">
          Home
        </Link>

        <Link to="/products" className="whitespace-nowrap px-2 py-1 text-sm text-slate-900">
          Products
        </Link>

        {/* 🔥 Jewellery with Dropdown */}
        <div className="relative group">
          <span className="cursor-pointer whitespace-nowrap px-2 py-1 text-sm text-slate-900">
            Jewellery ▾
          </span>

          {/* Dropdown */}
          <div className="absolute left-0 top-full z-[60] mt-1 hidden min-w-[150px] bg-white shadow-lg group-hover:block">
            <Link to="/category/jewellery/rings" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Rings
            </Link>
            <Link to="/category/jewellery/necklace" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Necklace
            </Link>
            <Link to="/category/jewellery/earrings" className="block px-4 py-2 text-sm hover:bg-gray-100">
              Earrings
            </Link>
          </div>
        </div>

        <Link to="/category/bags" className="whitespace-nowrap px-2 py-1 text-sm text-slate-900">
          Bags
        </Link>

        <Link to="/category/fashion" className="whitespace-nowrap px-2 py-1 text-sm text-slate-900">
          Accessories
        </Link>

      </div>
    </nav>
  )
}

export default SiteNavbar
