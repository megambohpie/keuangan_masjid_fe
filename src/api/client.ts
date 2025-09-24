// Lightweight API client with token storage and auto-refresh support
// Usage: import { apiClient, tokenStorage } from '@/api/client'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Read base URL from Vite env
const API_BASE_URL: string = (import.meta as ImportMeta).env.VITE_API_BASE_URL ?? 'http://localhost:3000'

// Local token storage helpers
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

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod
  path: string
  body?: TBody
  headers?: Record<string, string>
  // When true, will try to refresh token once on 401 and retry request
  tryRefresh?: boolean
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.refresh
  if (!refreshToken) return false
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    const newAccess = data.accessToken || data.token || data.access_token
    if (typeof newAccess === 'string' && newAccess.length > 0) {
      tokenStorage.access = newAccess
      return true
    }
    return false
  } catch {
    return false
  }
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request<TResponse = unknown, TBody = unknown>(opts: RequestOptions<TBody>): Promise<TResponse> {
    const { method = 'GET', path, body, headers = {}, tryRefresh = true } = opts

    const doFetch = async (): Promise<Response> => {
      const h: Record<string, string> = { 'Content-Type': 'application/json', ...headers }
      const token = tokenStorage.access
      if (token) h.Authorization = `Bearer ${token}`
      return fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: h,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
    }

    let res = await doFetch()

    if (res.status === 401 && tryRefresh) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        res = await doFetch()
      }
    }

    if (!res.ok) {
      let message = `HTTP ${res.status}`
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {
        // ignore json errors
      }
      throw new Error(message)
    }

    // parse json
    return (await res.json()) as TResponse
  },

  get<T = unknown>(path: string, headers?: Record<string, string>) {
    return this.request<T>({ method: 'GET', path, headers })
  },
  post<T = unknown, B = unknown>(path: string, body?: B, headers?: Record<string, string>, tryRefresh = false) {
    // For auth endpoints (login/refresh/logout) we usually skip refresh logic
    return this.request<T, B>({ method: 'POST', path, body, headers, tryRefresh })
  },
}
