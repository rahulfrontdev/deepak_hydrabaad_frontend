import axiosInstance from './axiosInstance'

/**
 * Align these paths with your Express routes. Common patterns:
 * - /categories, /products, /users with admin-only middleware
 * - or /admin/categories, etc.
 */

/** Categories — POST/PUT body may include optional parentId (Mongo ObjectId) for subcategories */
export const adminCreateCategoryUpload = (formData) => axiosInstance.post('/categories/create', formData)
export const adminFetchCategoryTree = (options = {}) =>
  axiosInstance.get('/categories/tree', { params: options })
export const adminFetchRootCategories = (options = {}) =>
  axiosInstance.get('/categories/getRoot', { params: options })
export const adminFetchCategoryChildren = (id, options = {}) =>
  axiosInstance.get(`/categories/${id}/children`, { params: options })
export const adminUpdateCategory = (id, body) => axiosInstance.put(`/categories/${id}`, body)
export const adminDeleteCategory = (id) => axiosInstance.delete(`/categories/${id}`)
export const adminToggleCategoryStatus = (id) => axiosInstance.patch(`/categories/${id}/toggle-status`)
export const adminEnableCategoryTree = (id) => axiosInstance.patch(`/categories/${id}/enable-tree`)
export const adminDisableCategoryTree = (id) => axiosInstance.patch(`/categories/${id}/disable-tree`)

/** Products */
export const adminFetchProducts = () => axiosInstance.get('/products')
export const adminFetchProductById = (id) => axiosInstance.get(`/products/${id}`)
export const adminFetchProductGstRates = () => axiosInstance.get('/products/gst-rates')
export const adminCreateProduct = (body) => axiosInstance.post('/products', body)
export const adminUpdateProduct = (id, body) => axiosInstance.put(`/products/${id}`, body)
export const adminDeleteProduct = (id) => axiosInstance.delete(`/products/${id}`)

/** Users (admin) */
export const adminFetchUsers = () => axiosInstance.get('/users')
export const adminUpdateUser = (id, body) => axiosInstance.patch(`/users/${id}`, body)
