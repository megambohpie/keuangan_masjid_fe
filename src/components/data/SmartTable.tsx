import * as React from 'react'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type SmartColumn<T> = {
  key: Extract<keyof T, string> | string
  header: string
  sortable?: boolean
  className?: string
  render?: (row: T) => React.ReactNode
}

export type SmartTableProps<T> = {
  columns: SmartColumn<T>[]
  data: T[]
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  onSortChange?: (key: string) => void
  loading?: boolean
  emptyMessage?: string
  headerClassName?: string
  striped?: boolean
}

export function SmartTable<T extends Record<string, unknown>>({
  columns,
  data,
  sortBy,
  sortOrder = 'ASC',
  onSortChange,
  loading = false,
  emptyMessage = 'Data tidak ditemukan',
  headerClassName,
  striped = true,
}: SmartTableProps<T>) {
  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return
    onSortChange(key)
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={cn('bg-emerald-700 text-white hover:bg-emerald-700', headerClassName)}>
            {columns.map((c) => (
              <TableHead key={String(c.key)} className={cn('py-3 px-3 text-white bg-transparent', c.className)}>
                <button
                  className={cn('flex items-center gap-1', c.sortable ? 'cursor-pointer select-none' : 'cursor-default')}
                  onClick={() => handleSort(String(c.key), c.sortable)}
                >
                  <span>{c.header}</span>
                  {c.sortable && (
                    <span className="text-xs opacity-90">
                      {sortBy === c.key ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
                    </span>
                  )}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && !loading && (
            <TableRow className={striped ? 'odd:bg-white even:bg-muted/40' : undefined}>
              <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground py-6">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow className={striped ? 'odd:bg-white even:bg-muted/40' : undefined}>
              <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground py-6">
                Memuat data...
              </TableCell>
            </TableRow>
          )}
          {!loading && data.map((row, idx) => (
            <TableRow key={idx} className={striped ? 'odd:bg-white even:bg-muted/40' : undefined}>
              {columns.map((c) => {
                const k = String(c.key)
                const content = c.render
                  ? c.render(row)
                  : (() => {
                      const v = (row as Record<string, unknown>)[k]
                      return v === undefined || v === null ? '' : String(v)
                    })()
                return (
                  <TableCell key={k} className={cn('py-3 px-3', c.className)}>
                    {content}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
