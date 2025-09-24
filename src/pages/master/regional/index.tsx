import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SmartTable, type SmartColumn } from '@/components/data/SmartTable'
import { PaginationBar } from '@/components/ui/pagination-bar'
import { createRegional, deleteRegional, listRegional, type RegionalItem, updateRegional } from '@/api/regional'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function MasterRegionalPage() {
  const location = useLocation()
  const [items, setItems] = React.useState<RegionalItem[]>([])
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState<string>('nama')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [loading, setLoading] = React.useState(false)
  const lastSigRef = React.useRef<string>('')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create')
  const [formKode, setFormKode] = React.useState('')
  const [formNama, setFormNama] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | number | null>(null)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await listRegional({ search: debouncedSearch, sortBy, sortOrder, page, limit })
      setItems(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, sortBy, sortOrder, page, limit])

  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  React.useEffect(() => {
    const sig = JSON.stringify({ debouncedSearch, sortBy, sortOrder, page, limit })
    if (lastSigRef.current === sig) return
    lastSigRef.current = sig
    fetchData()
  }, [debouncedSearch, sortBy, sortOrder, page, limit, fetchData])

  const handleSortClick = (key: string) => {
    if (sortBy === key) setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    else { setSortBy(key); setSortOrder('ASC') }
  }

  const crumbs = React.useMemo(() => {
    const path = location.pathname.replace(/^\/+|\/+$/g, '')
    const seg = path.split('/')
    const i = seg.indexOf('admin')
    return (i >= 0 ? seg.slice(i + 1) : seg).map((s) => s.replace(/-/g, ' '))
  }, [location.pathname])

  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setFormKode('')
    setFormNama('')
    setDialogOpen(true)
  }

  const openEdit = (row: RegionalItem) => {
    setDialogMode('edit')
    setEditingId(row.id ?? row.kode)
    setFormKode(String(row.kode ?? ''))
    setFormNama(String(row.nama ?? ''))
    setDialogOpen(true)
  }

  const submitDialog = async () => {
    const kode = formKode.trim()
    const nama = formNama.trim()
    if (!kode || !nama) return
    if (dialogMode === 'create') {
      await createRegional({ kode, nama })
    } else if (editingId != null) {
      await updateRegional(String(editingId), { kode, nama })
    }
    setDialogOpen(false)
    fetchData()
  }

  const onDelete = async (row: RegionalItem) => {
    if (!confirm(`Hapus regional "${row.nama}"?`)) return
    const id = row.id ?? row.kode
    await deleteRegional(String(id ?? ''))
    fetchData()
  }

  const columns: SmartColumn<RegionalItem>[] = [
    { key: 'id', header: 'ID', sortable: true, render: (r) => r.id },
    { key: 'kode', header: 'Kode', sortable: true, render: (r) => r.kode },
    { key: 'nama', header: 'Nama Regional', sortable: true, render: (r) => r.nama },
    {
      key: 'aksi', 
      header: 'Aksi',
      className: 'w-24',
      render: (r) => (
        <div className="flex justify-center">
          <Button size="sm" variant="destructive" onClick={() => onDelete(r)}>Hapus</Button>
        </div>
      )
    },
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
            <h2 className="text-2xl font-bold tracking-tight">Daftar Regional</h2>
            <div className="flex items-center gap-2">
              <Input placeholder="Cari regional..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
              <Button onClick={openCreate}>Tambah</Button>
            </div>
          </div>

          <SmartTable<RegionalItem>
            columns={columns}
            data={items}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortClick}
            onRowClick={openEdit}  // Menambahkan handler klik baris
            loading={loading}
            emptyMessage="Tidak ada data regional"
            rowClassName="cursor-pointer hover:bg-muted/60 transition-colors"
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

      {/* Dialog Tambah / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Tambah Regional' : 'Edit Regional'}</DialogTitle>
            <DialogDescription>Isi kode dan nama regional dengan benar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Kode</label>
              <Input value={formKode} onChange={(e) => setFormKode(e.target.value)} placeholder="R01" />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">Nama</label>
              <Input value={formNama} onChange={(e) => setFormNama(e.target.value)} placeholder="Regional Barat" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={submitDialog}>{dialogMode === 'create' ? 'Simpan' : 'Update'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

