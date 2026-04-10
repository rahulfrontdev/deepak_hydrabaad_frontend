import axiosInstance from './axiosInstance'

/**
 * Align these paths with your Express routes. Common patterns:
 * - /categories, /products, /users with admin-only middleware
 * - or /admin/categories, etc.
 */

/** Categories — POST/PUT body may include optional parentId (Mongo ObjectId) for subcategories */
export const adminFetchCategories = () => axiosInstance.get('/categories')
export const adminCreateCategory = (body) => axiosInstance.post('/categories', body)
export const adminUpdateCategory = (id, body) => axiosInstance.put(`/categories/${id}`, body)
export const adminDeleteCategory = (id) => axiosInstance.delete(`/categories/${id}`)

/** Products */
export const adminFetchProducts = () => axiosInstance.get('/products')
export const adminCreateProduct = (body) => axiosInstance.post('/products', body)
export const adminUpdateProduct = (id, body) => axiosInstance.put(`/products/${id}`, body)
export const adminDeleteProduct = (id) => axiosInstance.delete(`/products/${id}`)

/** Users (admin) */
export const adminFetchUsers = () => axiosInstance.get('/users')
export const adminUpdateUser = (id, body) => axiosInstance.patch(`/users/${id}`, body)
