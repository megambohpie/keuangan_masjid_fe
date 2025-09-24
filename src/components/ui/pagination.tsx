import * as React from "react"
import { cn } from "@/lib/utils"

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav role="navigation" aria-label="pagination" className={cn("mx-auto w-full", className)} {...props} />
  )
}

export function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-row items-center justify-center gap-1", className)} {...props} />
}

export function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />
}

export function PaginationLink({ className, isActive, ...props }: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm transition-colors",
        isActive ? "border-primary text-primary" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border bg-background px-2 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="mdi mdi-chevron-left" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">Previous</span>
    </button>
  )
}

export function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border bg-background px-2 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="sr-only sm:not-sr-only">Next</span>
      <span className="mdi mdi-chevron-right" aria-hidden="true" />
    </button>
  )
}

export function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex h-8 items-center px-2 text-muted-foreground", className)} {...props}>
      <span className="mdi mdi-dots-horizontal" aria-hidden="true" />
      <span className="sr-only">More pages</span>
    </span>
  )
}
