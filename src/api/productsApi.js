import axiosInstance from './axiosInstance'

export const fetchProducts = () => axiosInstance.get('/products')

export const fetchProductById = (productId) =>
  axiosInstance.get(`/products/${productId}`)

export const fetchProductsByCategory = (categoryId) =>
  axiosInstance.get('/products', { params: { categoryId } })
