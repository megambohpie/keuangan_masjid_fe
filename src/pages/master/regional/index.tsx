import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SmartTable, type SmartColumn } from '@/components/data/SmartTable'
import { PaginationBar } from '@/components/ui/pagination-bar'
import { createRegional, deleteRegional, listRegional, type RegionalItem, updateRegional } from '@/api/regional'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

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
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<{kode?: string; nama?: string}>({})

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

  const handleSortClick = React.useCallback((key: string) => {
    if (sortBy === key) setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    else { setSortBy(key); setSortOrder('ASC') }
  }, [sortBy])

  const crumbs = React.useMemo(() => {
    const path = location.pathname.replace(/^\/+|\/+$/g, '')
    const seg = path.split('/')
    const i = seg.indexOf('admin')
    return (i >= 0 ? seg.slice(i + 1) : seg).map((s) => s.replace(/-/g, ' '))
  }, [location.pathname])

  const openCreate = React.useCallback(() => {
    setDialogMode('create')
    setEditingId(null)
    setFormKode('')
    setFormNama('')
    setFormErrors({})
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((row: RegionalItem) => {
    setDialogMode('edit')
    setEditingId(row.id ?? row.kode)
    setFormKode(String(row.kode ?? ''))
    setFormNama(String(row.nama ?? ''))
    setFormErrors({})
    setDialogOpen(true)
  }, [])

  const validateForm = () => {
    const errors: {kode?: string; nama?: string} = {}
    if (!formKode.trim()) errors.kode = 'Kode harus diisi'
    if (!formNama.trim()) errors.nama = 'Nama harus diisi'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submitDialog = async () => {
    if (!validateForm()) return
    
    const kode = formKode.trim()
    const nama = formNama.trim()
    
    setIsSubmitting(true)
    try {
      if (dialogMode === 'create') {
        await createRegional({ kode, nama })
      } else if (editingId != null) {
        await updateRegional(String(editingId), { kode, nama })
      }
      setDialogOpen(false)
      fetchData()
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = React.useCallback(async (row: RegionalItem) => {
    if (!confirm(`Hapus regional "${row.nama}"?`)) return
    const id = row.id ?? row.kode
    try {
      await deleteRegional(String(id ?? ''))
      await fetchData()
    } catch (error) {
      console.error('Failed to delete regional:', error)
    }
  }, [fetchData])

  const columns: SmartColumn<RegionalItem>[] = [
    { key: 'id', header: 'ID', sortable: true, render: (r) => r.id },
    { key: 'kode', header: 'Kode', sortable: true, render: (r) => r.kode },
    { key: 'nama', header: 'Nama Regional', sortable: true, render: (r) => r.nama },
    { 
      key: 'aksi', 
      header: 'Aksi',
      className: 'w-24',
      render: (r: RegionalItem) => (
        <div className="flex justify-center">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onDelete(r)
            }}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Hapus
          </Button>
        </div>
      )
    }
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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Input 
                placeholder="Cari regional..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full sm:w-64" 
              />
              <Button 
                onClick={openCreate}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 hover:border-emerald-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Regional
                </span>
              </Button>
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
          <form onSubmit={(e) => { e.preventDefault(); submitDialog() }} className="space-y-4">
            <div className="grid gap-1">
              <label htmlFor="kode" className="text-sm font-medium">Kode <span className="text-red-500">*</span></label>
                <Input 
                  id="kode"
                  value={formKode} 
                  onChange={(e) => setFormKode(e.target.value)}
                  onBlur={() => validateForm()}
                  placeholder="R01" 
                  className={`${formErrors.kode ? 'border-red-300 focus-visible:ring-red-200' : 'border-emerald-200 focus-visible:ring-emerald-200'} focus-visible:ring-2 focus-visible:ring-offset-1`}
                />
              {formErrors.kode && <p className="text-sm text-red-500 mt-1">{formErrors.kode}</p>}
            </div>
            <div className="grid gap-1">
              <label htmlFor="nama" className="text-sm font-medium">Nama <span className="text-red-500">*</span></label>
                <Input 
                  id="nama"
                  value={formNama} 
                  onChange={(e) => setFormNama(e.target.value)}
                  onBlur={() => validateForm()}
                  placeholder="Regional Barat" 
                  className={`${formErrors.nama ? 'border-red-300 focus-visible:ring-red-200' : 'border-emerald-200 focus-visible:ring-emerald-200'} focus-visible:ring-2 focus-visible:ring-offset-1`}
                />
              {formErrors.nama && <p className="text-sm text-red-500 mt-1">{formErrors.nama}</p>}
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 hover:border-emerald-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={!formKode.trim() || !formNama.trim() || isSubmitting}
                >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : dialogMode === 'create' ? 'Simpan' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

