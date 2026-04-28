import axiosInstance from './axiosInstance'

export const fetchCategories = () => axiosInstance.get('/categories')
export const fetchRootCategories = (options = {}) =>
  axiosInstance.get('/categories/getRoot', { params: options })

export const fetchCategoryById = (categoryId) =>
  axiosInstance.get(`/categories/${categoryId}`)
