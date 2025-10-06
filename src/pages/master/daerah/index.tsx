import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SmartTable, type SmartColumn } from '@/components/data/SmartTable'
import { PaginationBar } from '@/components/ui/pagination-bar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, X } from 'lucide-react'
import SearchableSelect from '@/components/ui/searchable-select'
import { listDaerah, createDaerah, updateDaerah, deleteDaerah, type DaerahItem, type ListDaerahParams } from '@/api/daerah'
import { listRegional } from '@/api/regional'

export default function MasterDaerahPage() {
  const [items, setItems] = React.useState<DaerahItem[]>([])
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState<string>('nama')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create')
  const [formKode, setFormKode] = React.useState('')
  const [formNama, setFormNama] = React.useState('')
  const [formRegionalId, setFormRegionalId] = React.useState<string | number>('')
  const [editingId, setEditingId] = React.useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<{kode?: string; nama?: string; regional_id?: string}>({})
  const [regionals, setRegionals] = React.useState<Array<{id: string | number; nama: string}>>([])
  const [selectedRegional, setSelectedRegional] = React.useState<string | number>('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [regionalSearch, setRegionalSearch] = React.useState('')
  const [debouncedRegionalSearch, setDebouncedRegionalSearch] = React.useState('')
  
  const regionalItems = React.useMemo(() => (
    regionals.map(r => ({ value: String(r.id), label: r.nama }))
  ), [regionals])

  const handleSortChange = React.useCallback((key: string) => {
    setSortBy(key)
    setSortOrder(prev => (key === sortBy ? (prev === 'ASC' ? 'DESC' : 'ASC') : 'ASC'))
  }, [sortBy])

  // Debounce regional search typing
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedRegionalSearch(regionalSearch), 300)
    return () => clearTimeout(t)
  }, [regionalSearch])

  // Fetch regionals for dropdown with search
  React.useEffect(() => {
    const fetchRegionals = async () => {
      try {
        const response = await listRegional({ page: 1, limit: 100, search: debouncedRegionalSearch || undefined })
        setRegionals(response.items.map(item => ({
          id: item.id || item.kode,
          nama: item.nama
        })))
      } catch (error) {
        console.error('Error fetching regionals:', error)
      }
    }
    fetchRegionals()
  }, [debouncedRegionalSearch])

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page when search changes
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch data
  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const params: ListDaerahParams = {
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
        regional_id: selectedRegional || undefined
      }
      const data = await listDaerah(params)
      setItems(data.items)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, sortBy, sortOrder, page, limit, selectedRegional])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Dialog handlers
  const openCreate = React.useCallback(() => {
    setDialogMode('create')
    setEditingId(null)
    setFormKode('')
    setFormNama('')
    setFormRegionalId('')
    setFormErrors({})
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((row: DaerahItem) => {
    setDialogMode('edit')
    setEditingId(row.id ?? row.kode)
    setFormKode(String(row.kode ?? ''))
    setFormNama(String(row.nama ?? ''))
    setFormRegionalId(row.regional_id ?? '')
    setFormErrors({})
    setDialogOpen(true)
  }, [])

  // Form validation
  const validateForm = () => {
    const errors: {kode?: string; nama?: string; regional_id?: string} = {}
    if (!formKode.trim()) errors.kode = 'Kode harus diisi'
    if (!formNama.trim()) errors.nama = 'Nama harus diisi'
    if (!formRegionalId) errors.regional_id = 'Regional harus dipilih'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit form
  const submitDialog = async () => {
    if (!validateForm()) return
    
    const payload = {
      kode: formKode.trim(),
      nama: formNama.trim(),
      regional_id: Number(formRegionalId)
    }
    
    setIsSubmitting(true)
    try {
      if (dialogMode === 'create') {
        await createDaerah(payload)
      } else if (editingId != null) {
        await updateDaerah(editingId, payload)
      }
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete handler
  const onDelete = React.useCallback(async (row: DaerahItem) => {
    if (!confirm(`Hapus daerah "${row.nama}"?`)) return
    const id = row.id ?? row.kode
    try {
      await deleteDaerah(String(id ?? ''))
      await fetchData()
    } catch (error) {
      console.error('Failed to delete daerah:', error)
    }
  }, [fetchData])

  // Table columns
  const columns: SmartColumn<DaerahItem>[] = [
    { key: 'kode', header: 'Kode', sortable: true, render: (r) => r.kode },
    { key: 'nama', header: 'Nama Daerah', sortable: true, render: (r) => r.nama },
    { 
      key: 'regional', 
      header: 'Regional', 
      render: (r) => r.regional_nama || 'N/A'
    },
    { 
      key: 'aksi', 
      header: 'Aksi',
      className: 'w-32',
      render: (r: DaerahItem) => (
        <div className="flex justify-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              openEdit(r)
            }}
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Master Daerah</h2>
            <p className="text-muted-foreground">
              Kelola data daerah
            </p>
          </div>
          <Button 
            onClick={openCreate}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 hover:border-emerald-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Daerah
            </span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari daerah..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="w-full sm:w-64">
            <SearchableSelect
              value={selectedRegional}
              items={regionalItems}
              placeholder="Semua Regional"
              searchPlaceholder="Cari regional..."
              onSearchChange={setRegionalSearch}
              onChange={(v) => {
                setSelectedRegional(v as string | number)
                setPage(1)
              }}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <SmartTable<DaerahItem>
            columns={columns}
            data={items}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onRowClick={openEdit}
            loading={isLoading}
          />
        </div>

        <PaginationBar 
          total={total} 
          page={page} 
          limit={limit} 
          onPageChange={setPage} 
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }} 
        />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Tambah' : 'Edit'} Daerah</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Tambahkan data daerah baru' 
                : 'Ubah data daerah yang dipilih'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); submitDialog() }} className="space-y-4">
            <div className="grid gap-1">
              <label htmlFor="regional" className="text-sm font-medium">Regional <span className="text-red-500">*</span></label>
              <SearchableSelect
                value={formRegionalId}
                items={regionalItems}
                placeholder="Pilih Regional"
                searchPlaceholder="Cari regional..."
                onChange={(v) => {
                  setFormRegionalId(v as string | number)
                }}
              />
              {formErrors.regional_id && <p className="text-sm text-red-500 mt-1">{formErrors.regional_id}</p>}
            </div>
            
            <div className="grid gap-1">
              <label htmlFor="kode" className="text-sm font-medium">Kode <span className="text-red-500">*</span></label>
              <Input 
                id="kode"
                value={formKode} 
                onChange={(e) => setFormKode(e.target.value)}
                onBlur={() => validateForm()}
                placeholder="D01" 
                className={`${formErrors.kode ? 'border-red-300 focus-visible:ring-red-200' : 'border-emerald-200 focus-visible:ring-emerald-200'} focus-visible:ring-2 focus-visible:ring-offset-1`}
                disabled={isSubmitting}
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
                placeholder="Nama Daerah" 
                className={`${formErrors.nama ? 'border-red-300 focus-visible:ring-red-200' : 'border-emerald-200 focus-visible:ring-emerald-200'} focus-visible:ring-2 focus-visible:ring-offset-1`}
                disabled={isSubmitting}
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
                disabled={!formKode.trim() || !formNama.trim() || !formRegionalId || isSubmitting}
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