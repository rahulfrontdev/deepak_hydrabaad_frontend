import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [draftQuery, setDraftQuery] = useState('')

  const onProducts = location.pathname === '/products'
  const qFromUrl = searchParams.get('q') ?? ''
  const searchValue = onProducts ? qFromUrl : draftQuery

  const setSearchValue = (v) => {
    if (onProducts) {
      if (v) setSearchParams({ q: v }, { replace: true })
      else setSearchParams({}, { replace: true })
    } else {
      setDraftQuery(v)
    }
  }

  const { cartCount } = useCart()
  const { isAdmin, user, logout } = useAuth()
  const [showScrollNav, setShowScrollNav] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollNav(window.scrollY > 200)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    const q = searchValue.trim()
    if (onProducts) {
      if (q) setSearchParams({ q }, { replace: true })
      else setSearchParams({}, { replace: true })
    } else if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/products')
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            <img
              src="/Themed_Logo.png"
              alt="Store logo"
              className="site-header__logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />

          </Link>

          <div className="site-header__search-wrap ">
            <form className="site-header__search" onSubmit={onSearch} role="search">
              <input
                type="search"
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products…"
                className="site-header__search-input "
                autoComplete="off"
              />
              <button type="submit" className="bg-[#74BFBF] w-8" aria-label="Search">
                <IconSearch />
              </button>
            </form>
          </div>

          <div className="site-header__actions">
            {isAdmin && (
              <Link to="/admin" className="site-header__icon-link" aria-label="Admin dashboard" title="Admin">
                <LayoutDashboard size={20} strokeWidth={1.75} />
              </Link>
            )}
            {/* {user && (
              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/login', { replace: true })
                }}
                className="site-header__icon-link"
                aria-label="Log out"
                title="Log out"
              >
                <span className="text-[11px] font-bold tracking-tight">Exit</span>
              </button>
            )} */}
            <Link to="/account" className="site-header__icon-link" aria-label="Account">
              <IconUser />
            </Link>
            <Link to="/wishlist" className="site-header__icon-link" aria-label="Wishlist">
              <IconHeart />
            </Link>
            <Link to="/cart" className="site-header__icon-link site-header__cart-link" aria-label="Shopping cart">
              <IconCart />
              {cartCount > 0 && (
                <span className="site-header__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>


      <nav
        className={`fixed top-0 left-0 z-50 w-full bg-[#74BFBF] shadow-sm backdrop-blur text-black transition-all duration-200 ${showScrollNav
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        aria-label="Quick categories"
      >
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/Logo2.png"
              alt="Store Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>

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

          <div className="flex items-center justify-end gap-1">
            <Link to="/account" className="flex h-10 w-10 items-center justify-center text-slate-900" aria-label="Account">
              <IconUser />
            </Link>
            <Link to="/wishlist" className="flex h-10 w-10 items-center justify-center text-slate-900" aria-label="Wishlist">
              <IconHeart />
            </Link>
            <Link to="/cart" className="site-header__icon-link site-header__cart-link" aria-label="Shopping cart">
              <IconCart />
              {cartCount > 0 && (
                <span className="site-header__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          </div>

        </div>
      </nav>

    </>
  )
}

export default Header
