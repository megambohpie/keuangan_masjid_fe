import { apiClient, tokenStorage } from '@/api/client'

export type SortOrder = 'ASC' | 'DESC'

export interface RegionalItem {
  id?: string | number
  kode: string
  nama: string
  // allow backend extra fields
  [key: string]: unknown
}

export interface ListRegionalParams {
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export interface ListRegionalResponse {
  items: RegionalItem[]
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

export async function listRegional(params: ListRegionalParams): Promise<ListRegionalResponse> {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  // Support either /api/regionals or /api/regional from BE
  const data = await apiClient.get<unknown>(`/api/regional?${query.toString()}`)

  let root: Record<string, unknown> = {}
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    root = (typeof d.data === 'object' && d.data) ? (d.data as Record<string, unknown>) : d
  }

  const items = extractArray(root).map((x) => x as RegionalItem)
  const total = extractNumber(root, ['total', 'count'], items.length)
  const page = extractNumber(root, ['page', 'current_page'], params.page ?? 1)
  const limit = extractNumber(root, ['limit', 'per_page', 'pageSize'], params.limit ?? items.length)

  return { items, total, page, limit }
}

export async function createRegional(payload: Pick<RegionalItem, 'kode' | 'nama'>): Promise<RegionalItem> {
  try {
    if (!payload.kode || !payload.nama) {
      throw new Error('Kode dan Nama harus diisi')
    }
    
    // Siapkan headers sesuai dengan yang ada di Postman
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Authorization': `Bearer ${tokenStorage.access}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    
    // Kirim request dengan headers yang sesuai
    const response = await apiClient.post<unknown, typeof payload>(
      '/api/regional', 
      payload,
      headers
    )
    
    if (!response) {
      throw new Error('Tidak ada respons dari server')
    }
    
    // Handle response
    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>
      
      // Cek jika ada error dari server
      if (obj.error) {
        throw new Error(obj.message as string || 'Terjadi kesalahan saat membuat data regional')
      }
      
      // Kembalikan data response
      return {
        id: obj.id as string | number,
        kode: obj.kode as string,
        nama: obj.nama as string,
        ...obj // Sertakan properti tambahan jika ada
      }
    }
    
    throw new Error('Format respons tidak valid')
  } catch (error) {
    console.error('Error in createRegional:', error)
    // Pastikan error yang dilempar memiliki pesan yang jelas
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Terjadi kesalahan yang tidak diketahui saat membuat data regional')
  }
}

export async function updateRegional(id: string | number, payload: Partial<Pick<RegionalItem, 'kode' | 'nama'>>): Promise<RegionalItem> {
  const data = await apiClient.request<unknown, typeof payload>({ method: 'PUT', path: `/api/regional/${id}`, body: payload })
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const inner = (obj.data && typeof obj.data === 'object') ? (obj.data as Record<string, unknown>) : obj
    return inner as unknown as RegionalItem
  }
  return { id, kode: String(payload.kode ?? ''), nama: String(payload.nama ?? '') }
}

export async function getRegional(id: string | number): Promise<RegionalItem> {
  const response = await apiClient.get<unknown>(`/api/regional/${id}`)
  
  if (!response) {
    throw new Error('Tidak ada respons dari server')
  }
  
  if (response && typeof response === 'object') {
    const data = response as Record<string, unknown>
    const regional = (data.data && typeof data.data === 'object' ? data.data : data) as RegionalItem
    
    if (!regional) {
      throw new Error('Data regional tidak ditemukan')
    }
    
    return {
      ...regional, // Include all fields from the response
      id: regional.id,
      kode: regional.kode,
      nama: regional.nama
    }
  }
  
  throw new Error('Format respons tidak valid')
}

export async function deleteRegional(id: string | number): Promise<boolean> {
  await apiClient.request({ method: 'DELETE', path: `/api/regional/${id}` })
  return true
}
