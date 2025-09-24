import * as React from 'react'
import { listTingkat, type TingkatItem } from '@/api/tingkat'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SmartTable, type SmartColumn } from '@/components/data/SmartTable'
import { PaginationBar } from '@/components/ui/pagination-bar'
import { useLocation } from 'react-router-dom'

export default function MasterTingkatPage() {
  const location = useLocation()
  const [items, setItems] = React.useState<TingkatItem[]>([])
  const [total, setTotal] = React.useState(0)

  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState<string>('urutan')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [loading, setLoading] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await listTingkat({ search: debouncedSearch, sortBy, sortOrder, page, limit })
      setItems(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, sortBy, sortOrder, page, limit])

  // Debounce search into debouncedSearch only
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  React.useEffect(() => {
    fetchData()
  }, [debouncedSearch, sortBy, sortOrder, page, limit, fetchData])
  const handleSortClick = (key: string) => {
    if (sortBy === key) setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    else { setSortBy(key); setSortOrder('ASC') }
  }

  // Build dynamic breadcrumbs from URL
  const crumbs = React.useMemo(() => {
    const path = location.pathname.replace(/^\/+|\/+$/g, '') // trim slashes
    const segments = path.split('/')
    const adminIdx = segments.indexOf('admin')
    const rel = adminIdx >= 0 ? segments.slice(adminIdx + 1) : segments
    return rel.map((s) => s.replace(/-/g, ' '))
  }, [location.pathname])

  const columns: SmartColumn<TingkatItem>[] = [
    { key: 'nama', header: 'Nama Tingkat', sortable: true, render: (r) => r.nama || r.name || '-' },
    { key: 'urutan', header: 'Urutan', sortable: true, render: (r) => r.urutan ?? '-' },
  ]

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <div className="flex items-center gap-1 whitespace-nowrap">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <span className="font-medium">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              {i < crumbs.length - 1 && <span className="opacity-60">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Daftar Tingkat</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Cari tingkat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" onClick={() => { setSearch(''); setPage(1); }}>Reset</Button>
            </div>
          </div>

          <SmartTable<TingkatItem>
            columns={columns}
            data={items}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortClick}
            loading={loading}
          />

          <PaginationBar
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(n) => { setLimit(n); setPage(1) }}
          />
        </div>
      </div>
    </div>
  )
}

