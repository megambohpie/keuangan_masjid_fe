import * as React from 'react'
import { cn } from '@/lib/utils'

export type Column<T> = {
  key: Extract<keyof T, string> | string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

export type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  total: number
  page: number
  limit: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  onSortChange?: (key: string) => void
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  sortBy,
  sortOrder = 'ASC',
  onSortChange,
  emptyMessage = 'Tidak ada data',
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)))

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return
    onSortChange(key)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              {columns.map((c) => {
                const isSorted = sortBy === c.key
                const arrow = isSorted ? (sortOrder === 'ASC' ? '▲' : '▼') : ''
                return (
                  <th key={String(c.key)} className={cn(c.className)}>
                    <button
                      type="button"
                      onClick={() => handleSort(String(c.key), c.sortable)}
                      className={cn('flex items-center gap-1', c.sortable ? 'cursor-pointer select-none' : 'cursor-default')}
                    >
                      <span>{c.header}</span>
                      {c.sortable && <span className="text-xs opacity-60">{arrow}</span>}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-sm text-muted-foreground py-6">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((c) => {
                    const k = String(c.key)
                    const cellValue = (() => {
                      if (c.render) return c.render(row)
                      const rec = row as unknown as Record<string, unknown>
                      const v = rec[k]
                      return v === undefined || v === null ? '' : String(v)
                    })()
                    return (
                      <td key={k} className={cn(c.className)}>
                        {cellValue}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>Halaman</span>
          <select
            className="select select-bordered select-xs"
            value={page}
            onChange={(e) => onPageChange?.(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <span>dari {totalPages}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan</span>
          <select
            className="select select-bordered select-xs"
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
          >
            {[5,10,20,50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>data</span>
        </div>
      </div>
    </div>
  )
}
