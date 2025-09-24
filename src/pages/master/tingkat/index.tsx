import * as React from 'react'
import { DataTable, type Column } from '@/components/data/DataTable'
import { listTingkat, type TingkatItem } from '@/api/tingkat'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function MasterTingkatPage() {
  const [items, setItems] = React.useState<TingkatItem[]>([])
  const [total, setTotal] = React.useState(0)

  const [search, setSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState<string>('urutan')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [loading, setLoading] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await listTingkat({ search, sortBy, sortOrder, page, limit })
      setItems(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [search, sortBy, sortOrder, page, limit])

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setPage(1) // reset to first page when searching
      fetchData()
    }, 350)
    return () => clearTimeout(t)
  }, [search, fetchData])

  React.useEffect(() => {
    fetchData()
  }, [sortBy, sortOrder, page, limit, fetchData])

  const onSortChange = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSortBy(key)
      setSortOrder('ASC')
    }
  }

  const columns: Column<TingkatItem>[] = [
    { key: 'nama', header: 'Nama Tingkat', sortable: true, render: (r) => r.nama || r.name || '-' },
    { key: 'urutan', header: 'Urutan', sortable: true, render: (r) => r.urutan ?? '-' },
  ]

  return (
    <div className="space-y-4">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Master</li>
          <li>Tingkat</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h2 className="card-title">Daftar Tingkat</h2>
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

          {loading && (
            <div className="text-sm text-muted-foreground">Memuat data...</div>
          )}

          <DataTable<TingkatItem>
            columns={columns}
            data={items}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(n) => { setLimit(n); setPage(1) }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            emptyMessage={loading ? 'Memuat...' : 'Data tidak ditemukan'}
          />
        </div>
      </div>
    </div>
  )
}

