import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import SiteNavbar from './SiteNavbar'
import './MainLayout.css'
import Announcement from './Annoucement'

const MainLayout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app-layout">
      <Announcement />
      <Header />
      <SiteNavbar />
      <main className={`app-layout__main${isHome ? ' app-layout__main--home' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
