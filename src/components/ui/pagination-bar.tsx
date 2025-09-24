import * as React from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export type PaginationBarProps = {
  total: number
  page: number
  limit: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function PaginationBar({ total, page, limit, onPageChange, onLimitChange }: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)))
  const pagesToShow = React.useMemo(() => {
    const arr: (number | '...')[] = []
    const push = (v: number | '...') => arr.push(v)
    const max = totalPages
    if (max <= 7) {
      for (let i = 1; i <= max; i++) push(i)
    } else {
      push(1)
      if (page > 4) push('...')
      const start = Math.max(2, page - 1)
      const end = Math.min(max - 1, page + 1)
      for (let i = start; i <= end; i++) push(i)
      if (page < max - 3) push('...')
      push(max)
    }
    return arr
  }, [page, totalPages])

  if (totalPages <= 1) {
    // Jika hanya 1 halaman, tidak perlu menampilkan pagination sama sekali
    return (
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm whitespace-nowrap bg-muted/30 rounded-md px-3 py-2 w-full sm:w-auto">
          <span className="shrink-0">Total:</span>
          <span className="font-medium shrink-0">{total}</span>
          <span className="ml-2 shrink-0">Per halaman:</span>
          <div className="inline-flex items-center rounded-md border bg-background p-0.5">
            {[5,10,20,50].map((n) => (
              <button
                key={n}
                type="button"
                className={
                  `h-7 px-2 text-xs rounded-sm transition-colors ${
                    n === limit ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                  }`
                }
                onClick={() => onLimitChange?.(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-sm whitespace-nowrap bg-muted/30 rounded-md px-3 py-2 w-full sm:w-auto">
        <span className="shrink-0">Total:</span>
        <span className="font-medium shrink-0">{total}</span>
        <span className="ml-2 shrink-0">Per halaman:</span>
        <div className="inline-flex items-center rounded-md border bg-background p-0.5">
          {[5,10,20,50].map((n) => (
            <button
              key={n}
              type="button"
              className={
                `h-7 px-2 text-xs rounded-sm transition-colors ${
                  n === limit ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                }`
              }
              onClick={() => onLimitChange?.(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange?.(Math.max(1, page - 1))} />
          </PaginationItem>
          {pagesToShow.map((p, idx) => (
            <PaginationItem key={`${p}-${idx}`}>
              {p === '...'
                ? <PaginationEllipsis />
                : (
                  <PaginationLink isActive={p === page} onClick={() => onPageChange?.(p as number)}>
                    {p}
                  </PaginationLink>
                )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange?.(Math.min(totalPages, page + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
