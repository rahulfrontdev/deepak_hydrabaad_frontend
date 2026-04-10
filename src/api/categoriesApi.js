import axiosInstance from './axiosInstance'

export const fetchCategories = () => axiosInstance.get('/categories')

export const fetchCategoryById = (categoryId) =>
  axiosInstance.get(`/categories/${categoryId}`)
