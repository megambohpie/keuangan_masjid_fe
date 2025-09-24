// Axios-based API client with interceptors
// Usage: import { apiClient, tokenStorage } from '@/api/client'

import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const API_BASE_URL: string = (import.meta as ImportMeta).env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const tokenStorage = {
  get access() {
    return localStorage.getItem('authToken') || null
  },
  set access(token: string | null) {
    if (token) localStorage.setItem('authToken', token)
    else localStorage.removeItem('authToken')
  },
  get refresh() {
    return localStorage.getItem('refreshToken') || null
  },
  set refresh(token: string | null) {
    if (token) localStorage.setItem('refreshToken', token)
    else localStorage.removeItem('refreshToken')
  },
  // realm determines which refresh endpoint to use. Expected values: 'admin' | 'level'
  get realm(): 'admin' | 'level' {
    const v = localStorage.getItem('authRealm')
    return v === 'level' ? 'level' : 'admin'
  },
  set realm(v: 'admin' | 'level') {
    localStorage.setItem('authRealm', v)
  },
  clear() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('authRealm')
  },
}

export function setAuthRealm(realm: 'admin' | 'level') {
  tokenStorage.realm = realm
}

function createAxios(): AxiosInstance {
  const instance = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

  // Attach Authorization header
  instance.interceptors.request.use((config) => {
    const skipAuth = (config as unknown as { skipAuth?: boolean }).skipAuth
    const token = tokenStorage.access
    if (!skipAuth && token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return config
  })

  // Refresh token state
  let isRefreshing = false
  let refreshSubscribers: Array<() => void> = []

  // Function to handle token refresh
  const refreshAccessToken = async (): Promise<void> => {
    const refreshToken = tokenStorage.refresh
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      // Use only /api/auth/refresh endpoint
      const resp = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`, 
        { refresh_token: refreshToken }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          } 
        }
      )

      const data = resp.data as Record<string, unknown>
      const newAccess = (data['accessToken'] || data['token'] || data['access_token']) as string | undefined
      const newRefresh = (data['refresh_token'] || data['refreshToken']) as string | undefined
      
      if (!newAccess) {
        throw new Error('No access token in refresh response')
      }

      // Update tokens
      tokenStorage.access = newAccess
      if (newRefresh) {
        tokenStorage.refresh = newRefresh
      }

      return Promise.resolve()
    } catch (error) {
      // Clear tokens on refresh failure
      tokenStorage.clear()
      return Promise.reject(error)
    }
  }

  // Response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as (typeof error)['config'] & { _retry?: boolean }
      
      // If error is not 401 or is a retry, reject
      if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error)
      }

      // If we're already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push(() => {
            // Clone the original request with new token
            instance(originalRequest)
              .then(resolve)
              .catch(reject)
          })
        })
      }

      // Set retry flag and start refresh process
      originalRequest._retry = true
      isRefreshing = true

      try {
        await refreshAccessToken()
        
        // Retry all queued requests
        const subscribers = refreshSubscribers
        refreshSubscribers = []
        await Promise.all(subscribers.map(callback => callback()))
        
        // Retry the original request
        return instance(originalRequest)
      } catch (refreshError) {
        // Clear all pending requests on refresh error
        refreshSubscribers = []
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )

  return instance
}

const axiosInstance = createAxios()

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod
  path: string
  body?: TBody
  headers?: Record<string, string>
  // when true, do not attach Authorization header
  skipAuth?: boolean
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request<TResponse = unknown, TBody = unknown>(opts: RequestOptions<TBody>): Promise<TResponse> {
    const { method = 'GET', path, body, headers, skipAuth } = opts
    const res = await axiosInstance.request<TResponse>({ url: path, method, data: body, headers, ...(skipAuth ? { skipAuth: true } : {}) })
    return res.data
  },

  get<T = unknown>(path: string, headers?: Record<string, string>, opts?: { skipAuth?: boolean }) {
    return this.request<T>({ method: 'GET', path, headers, skipAuth: opts?.skipAuth })
  },
  post<T = unknown, B = unknown>(path: string, body?: B, headers?: Record<string, string>, opts?: { skipAuth?: boolean }) {
    return this.request<T, B>({ method: 'POST', path, body, headers, skipAuth: opts?.skipAuth })
  },
}
