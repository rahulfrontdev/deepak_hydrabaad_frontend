import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SiteNavbar = () => {
  const location = useLocation()
  const jewelleryDetailsRef = useRef(null)

  useEffect(() => {
    const el = jewelleryDetailsRef.current
    if (el) el.open = false
  }, [location.pathname, location.search])

  return (
    <nav className="site-navbar-primary" aria-label="Primary navigation">
      <div className="site-navbar-primary__inner">
        <Link to="/" className="site-navbar-primary__link">
          Home
        </Link>

        <Link to="/products" className="site-navbar-primary__link">
          Products
        </Link>

        <details ref={jewelleryDetailsRef} className="site-navbar-primary__details">
          <summary className="site-navbar-primary__summary">Jewellery ▾</summary>
          <div className="site-navbar-primary__panel">
            <Link to="/category/jewellery/rings">Rings</Link>
            <Link to="/category/jewellery/necklace">Necklace</Link>
            <Link to="/category/jewellery/earrings">Earrings</Link>
          </div>
        </details>

        <Link to="/category/bags" className="site-navbar-primary__link">
          Bags
        </Link>

        <Link to="/category/fashion" className="site-navbar-primary__link">
          Accessories
        </Link>
      </div>
    </nav>
  )
}

export default SiteNavbar
