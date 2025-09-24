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
  clear() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userName')
  },
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

  // Refresh token on 401 once
  let isRefreshing = false
  let pendingQueue: Array<() => void> = []

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (typeof error)['config'] & { _retry?: boolean }
      const status = error.response?.status
      if (status === 401 && original && !original._retry) {
        if (isRefreshing) {
          // queue retry until refresh finished
          await new Promise<void>((resolve) => pendingQueue.push(resolve))
        } else {
          original._retry = true
          isRefreshing = true
          try {
            const refreshToken = tokenStorage.refresh
            if (!refreshToken) throw new Error('No refresh token')
            const resp = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refresh_token: refreshToken }, { headers: { 'Content-Type': 'application/json' } })
            const data = resp.data as Record<string, unknown>
            const newAccess = (data['accessToken'] || data['token'] || data['access_token']) as string | undefined
            if (!newAccess) throw new Error('No access token in refresh response')
            tokenStorage.access = newAccess
          } finally {
            isRefreshing = false
            pendingQueue.forEach((fn) => fn())
            pendingQueue = []
          }
        }
        // retry original request with new token
        return instance(original)
      }
      return Promise.reject(error)
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
