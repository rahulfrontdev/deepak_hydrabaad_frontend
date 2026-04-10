import axios from 'axios'

/**
 * Set `VITE_API_BASE_URL` in `.env` (e.g. http://localhost:3000/api).
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default axiosInstance
