import { apiClient, tokenStorage } from "./client"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken?: string
  refreshToken?: string
  token?: string
  access_token?: string
  refresh_token?: string
  user?: { name?: string }
  message?: string
  // allow any other shape (some APIs wrap data)
  [key: string]: unknown
}

function pickToken(source: unknown, candidates: string[]): string | undefined {
  if (!source || typeof source !== 'object') return undefined
  const obj = source as Record<string, unknown>
  for (const key of candidates) {
    const val = obj[key]
    if (typeof val === 'string' && val.length > 0) return val
  }
  // check nested data
  const nested = obj['data']
  if (nested && typeof nested === 'object') {
    const nobj = nested as Record<string, unknown>
    for (const key of candidates) {
      const val = nobj[key]
      if (typeof val === 'string' && val.length > 0) return val
    }
  }
  return undefined
}

export function extractUserName(source: unknown): string | undefined {
  if (!source || typeof source !== 'object') return undefined
  const obj = source as Record<string, unknown>
  // Try top-level user: { user: { name | nama } }
  const userAny = obj['user']
  if (userAny && typeof userAny === 'object') {
    const u = userAny as Record<string, unknown>
    const name = u['name']
    const nama = u['nama']
    if (typeof name === 'string' && name) return name
    if (typeof nama === 'string' && nama) return nama
  }
  // Try nested under data.user
  const dataAny = obj['data']
  if (dataAny && typeof dataAny === 'object') {
    const dataObj = dataAny as Record<string, unknown>
    const user = dataObj['user']
    if (user && typeof user === 'object') {
      const u = user as Record<string, unknown>
      const name = u['name']
      const nama = u['nama']
      if (typeof name === 'string' && name) return name
      if (typeof nama === 'string' && nama) return nama
    }
  }
  return undefined
}

function extractMenus(source: unknown): { flat?: unknown[]; tree?: unknown[] } | undefined {
  if (!source || typeof source !== 'object') return undefined
  const obj = source as Record<string, unknown>
  const dataAny = obj['data']
  const fromTop = obj['menus']
  const tryObj = (v: unknown) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined)

  // Prefer nested under data.menus
  const dataObj = tryObj(dataAny)
  const menusObj = tryObj(dataObj?.menus ?? fromTop)
  if (!menusObj) return undefined
  const flat = Array.isArray(menusObj.flat) ? (menusObj.flat as unknown[]) : undefined
  const tree = Array.isArray(menusObj.tree) ? (menusObj.tree as unknown[]) : undefined
  if (flat || tree) return { flat, tree }
  return undefined
}

export async function login(payload: LoginPayload) {
  const data = await apiClient.post<LoginResponse, LoginPayload>(
    "/api/users/login",
    payload,
    undefined,
    false
  )
  // Try multiple common shapes (top-level or nested under data)
  const access = pickToken(data, ["accessToken", "token", "access_token"]) 
  const refresh = pickToken(data, ["refreshToken", "refresh_token"]) 

  if (access) tokenStorage.access = access
  if (refresh) tokenStorage.refresh = refresh
  // Save menus if provided by API: data.menus.flat / data.menus.tree
  const menus = extractMenus(data)
  if (menus) {
    try {
      localStorage.setItem('menus', JSON.stringify(menus))
    } catch {
      // ignore quota errors
    }
  }
  return data
}

export async function logout() {
  const refresh = tokenStorage.refresh
  try {
    if (refresh) {
      await apiClient.post(
        "/api/auth/logout",
        { refresh_token: refresh },
        undefined,
        false
      )
    }
  } finally {
    tokenStorage.clear()
  }
}

export async function refreshToken() {
  const refresh = tokenStorage.refresh
  if (!refresh) throw new Error("No refresh token")
  const data = await apiClient.post<LoginResponse>(
    "/api/auth/refresh",
    { refresh_token: refresh },
    undefined,
    false
  )
  const access = data.accessToken || data.token || data.access_token
  if (!access) throw new Error("Refresh failed: no access token in response")
  tokenStorage.access = access
  return access
}
