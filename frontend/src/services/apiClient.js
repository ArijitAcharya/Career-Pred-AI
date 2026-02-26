import axios from 'axios'
import toast from 'react-hot-toast'

import { tokenStorage } from './storage'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue = []

function processQueue(error, token) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  refreshQueue = []
}

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const original = error.config

    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true

      const refresh = tokenStorage.getRefresh()
      if (!refresh) {
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(original))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/accounts/token/refresh/`,
          { refresh },
          { timeout: 30000 }
        )
        const newAccess = res.data?.access
        tokenStorage.setAccess(newAccess)
        processQueue(null, newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        return apiClient(original)
      } catch (e) {
        processQueue(e, null)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
