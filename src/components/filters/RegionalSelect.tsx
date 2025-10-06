import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectValue = string | number | ''

export type SearchableSelectItem = {
  value: SelectValue
  label: string
}

export type SearchableSelectProps = {
  value: SelectValue
  onChange: (value: SelectValue) => void
  items: SearchableSelectItem[]
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  buttonClassName?: string
  onSearchChange?: (q: string) => void
}

export function SearchableSelect({
  value,
  onChange,
  items,
  placeholder = 'Pilih item',
  searchPlaceholder = 'Cari...',
  className,
  buttonClassName,
  onSearchChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const selectedLabel = React.useMemo(() => {
    if (!value) return ''
    const f = items.find(i => String(i.value) === String(value))
    return f?.label ?? ''
  }, [items, value])

  const shownItems = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => i.label.toLowerCase().includes(q))
  }, [items, query])

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between border-emerald-200 text-emerald-800 hover:bg-emerald-50', buttonClassName)}
          >
            {value ? selectedLabel : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput 
              placeholder={searchPlaceholder} 
              value={query}
              onValueChange={(v) => {
                setQuery(v)
                onSearchChange?.(v)
              }}
            />
            <CommandList>
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  value={placeholder}
                  onSelect={() => {
                    onChange('')
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', !value ? 'opacity-100' : 'opacity-0')} />
                  {placeholder}
                </CommandItem>
                {shownItems.map((it) => (
                  <CommandItem
                    key={String(it.value)}
                    value={it.label}
                    onSelect={() => {
                      onChange(String(it.value))
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', String(value) === String(it.value) ? 'opacity-100' : 'opacity-0')} />
                    {it.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default SearchableSelect
