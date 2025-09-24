import { apiClient } from '@/api/client'

export type SortOrder = 'ASC' | 'DESC'

export interface TingkatItem {
  id: number
  key?: string
  nama?: string
  name?: string
  urutan?: number
  [key: string]: unknown
}

export interface ListTingkatParams {
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export interface ListTingkatResponse {
  items: TingkatItem[]
  total: number
  page: number
  limit: number
}

function extractArray(source: unknown): unknown[] {
  if (!source) return []
  if (Array.isArray(source)) return source
  if (typeof source === 'object') {
    const obj = source as Record<string, unknown>
    if (Array.isArray(obj.items)) return obj.items as unknown[]
    if (Array.isArray(obj.data)) return obj.data as unknown[]
    if (Array.isArray(obj.results)) return obj.results as unknown[]
  }
  return []
}

function extractNumber(obj: Record<string, unknown>, keys: string[], defaultValue: number): number {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string') {
      const n = Number(v)
      if (!Number.isNaN(n)) return n
    }
  }
  return defaultValue
}

export async function listTingkat(params: ListTingkatParams): Promise<ListTingkatResponse> {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const data = await apiClient.get<unknown>(`/api/tingkats?${query.toString()}`)

  // Support shapes like { data: { items:[], total, page, limit } } or { items:[], ... } or array w/ meta
  let root: Record<string, unknown> = {}
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    root = (typeof d.data === 'object' && d.data) ? (d.data as Record<string, unknown>) : d
  }

  const items = extractArray(root).map((x) => x as TingkatItem)
  const total = extractNumber(root, ['total', 'count'], items.length)
  const page = extractNumber(root, ['page', 'current_page'], params.page ?? 1)
  const limit = extractNumber(root, ['limit', 'per_page'], params.limit ?? 10)

  return { items, total, page, limit }
}
