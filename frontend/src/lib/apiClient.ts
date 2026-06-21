import axios from 'axios'
import { AUTH_UNAUTHORIZED_EVENT, tokenStorage } from './tokenStorage'

const baseURL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5048/api'
).replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)
