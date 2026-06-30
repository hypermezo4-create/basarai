'use client'

import { Loader2 } from 'lucide-react'
import type { GenerationHistoryItem } from '@/types'
import type { DeleteGenerationOutcome } from '@/hooks/use-delete-generation'
import { HistoryCard } from './history-card'

interface HistoryListProps {
  items: GenerationHistoryItem[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasNext: boolean
  onLoadMore: () => void
  brandId: string
  search?: string
  filtered?: boolean
  onDelete: (id: string) => Promise<DeleteGenerationOutcome>
}

export function HistoryList({
  items,
  loading,
  loadingMore,
  error,
  hasNext,
  onLoadMore,
  brandId,
  search,
  filtered = false,
  onDelete,
}: HistoryListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">
          {filtered
            ? 'No history items match the selected filters.'
            : 'No generation history yet. Create your first image on the Generator page.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <HistoryCard key={item.id} item={item} brandId={brandId} search={search} onDelete={onDelete} />
        ))}
      </div>
      {hasNext && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
