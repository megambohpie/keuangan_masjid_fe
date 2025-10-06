import { apiClient } from '@/api/client'

export type SortOrder = 'ASC' | 'DESC'

export interface DaerahItem {
  id?: string | number
  kode: string
  nama: string
  regional_id: string | number
  regional_nama?: string
  // allow backend extra fields
  [key: string]: unknown
}

export interface ListDaerahParams {
  search?: string
  regional_id?: string | number
  sortBy?: string
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export interface ListDaerahResponse {
  items: DaerahItem[]
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

function extractNumber(obj: Record<string, unknown>, keys: string[], def: number): number {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string') {
      const n = Number(v)
      if (!Number.isNaN(n)) return n
    }
  }
  return def
}

export async function listDaerah(params: ListDaerahParams = {}): Promise<ListDaerahResponse> {
  const { search, regional_id, sortBy, sortOrder, page = 1, limit = 10 } = params
  
  const queryParams = new URLSearchParams()
  if (search) queryParams.append('search', search)
  if (regional_id) queryParams.append('regional_id', String(regional_id))
  if (sortBy) queryParams.append('sortBy', sortBy)
  if (sortOrder) queryParams.append('sortOrder', sortOrder)
  queryParams.append('page', String(page))
  queryParams.append('limit', String(limit))

  try {
    const response = await apiClient.get<{
      data?: DaerahItem[];
      items?: DaerahItem[];
      results?: DaerahItem[];
      total?: number;
      count?: number;
      totalCount?: number;
      page?: number;
      currentPage?: number;
      current_page?: number;
      limit?: number;
      perPage?: number;
      per_page?: number;
    }>(`/api/daerah?${queryParams.toString()}`)
    const data = response || {}
    
    return {
      items: extractArray(data.data || data.items || data.results || []) as DaerahItem[],
      total: extractNumber(data, ['total', 'count', 'totalCount'], 0),
      page: extractNumber(data, ['page', 'currentPage', 'current_page'], 1),
      limit: extractNumber(data, ['limit', 'perPage', 'per_page'], 10),
    }
  } catch (error) {
    console.error('Error fetching daerah list:', error)
    throw error
  }
}

export async function createDaerah(payload: Omit<DaerahItem, 'id'>): Promise<DaerahItem> {
  try {
    const response = await apiClient.post<DaerahItem, Omit<DaerahItem, 'id'>>('/api/daerah', payload)
    return response as DaerahItem
  } catch (error) {
    console.error('Error creating daerah:', error)
    throw error
  }
}

export async function updateDaerah(id: string | number, payload: Partial<Omit<DaerahItem, 'id'>>): Promise<DaerahItem> {
  try {
    const response = await apiClient.request<DaerahItem, Partial<Omit<DaerahItem, 'id'>>>({
      method: 'PUT',
      path: `/api/daerah/${id}`,
      body: payload
    })
    return response as DaerahItem
  } catch (error) {
    console.error('Error updating daerah:', error)
    throw error
  }
}

export async function getDaerah(id: string | number): Promise<DaerahItem> {
  try {
    const response = await apiClient.get<DaerahItem>(`/api/daerah/${id}`)
    return response as DaerahItem
  } catch (error) {
    console.error('Error fetching daerah:', error)
    throw error
  }
}

export async function deleteDaerah(id: string | number): Promise<boolean> {
  try {
    await apiClient.request({
      method: 'DELETE',
      path: `/api/daerah/${id}`
    })
    return true
  } catch (error) {
    console.error('Error deleting daerah:', error)
    throw error
  }
}
