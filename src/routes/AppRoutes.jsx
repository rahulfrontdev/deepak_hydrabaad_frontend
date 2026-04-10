import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AccountPage from '../pages/account/AccountPage'
import CategoryPage from '../pages/category/CategoryPage'
import HomePage from '../pages/home/HomePage'
import ProductDetailPage from '../pages/product-detail/ProductDetailPage'
import ProductsPage from '../pages/products/ProductsPage'
import CartPage from '../pages/cart/CartPage'
import WishlistPage from '../pages/wishlist/WishlistPage'
import AccountOrdersPage from '../pages/account/AccountOrdersPage'
import AccountWishlistPage from '../pages/account/AccountWishlistPage'
import AccountProfilePage from '../pages/account/AccountProfilePage'
import AccountMyAddressPage from '../pages/account/AccountMyAddressPage'
import Register from '../pages/Register'
import Login from '../pages/Login'
import RequireAdmin from '../components/admin/RequireAdmin'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminUsers from '../pages/admin/AdminUsers'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="cart" element={<CartPage />} />
        {/* Backwards compatibility (existing link /checkout) */}
        <Route path="checkout" element={<CartPage />} />
        <Route path="account" element={<AccountPage />}>
          <Route index element={<AccountOrdersPage />} />
          <Route path="orders" element={<AccountOrdersPage />} />
          <Route path="wishlist" element={<AccountWishlistPage />} />
          <Route path="profile" element={<AccountProfilePage />} />
          <Route path="my-address" element={<AccountMyAddressPage />} />
        </Route>
        <Route path="wishlist" element={<WishlistPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
