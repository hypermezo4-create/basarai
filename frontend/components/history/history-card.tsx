'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { GenerationHistoryItem } from '@/types'
import type { DeleteGenerationOutcome } from '@/hooks/use-delete-generation'
import { PLATFORM_PRESETS } from '@/lib/presets'
import { DeleteGenerationDialog } from './delete-generation-dialog'

interface HistoryCardProps {
  item: GenerationHistoryItem
  brandId: string
  search?: string
  onDelete: (id: string) => Promise<DeleteGenerationOutcome>
}

export function HistoryCard({ item, brandId, search, onDelete }: HistoryCardProps) {
  const preset = PLATFORM_PRESETS[item.platform_preset]
  const href = `/${brandId}/history/${item.id}${search ? `?${search}` : ''}`
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const showImage = Boolean(item.image_url) && !imageUnavailable
  const unavailableText = item.status === 'failed' ? 'Failed' : 'Image unavailable'

  async function handleConfirmDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const outcome = await onDelete(item.id)
      if (!outcome.ok) {
        setDeleteError(outcome.message ?? 'Failed to delete. Please try again.')
      } else {
        setDialogOpen(false)
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="group relative block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <Link href={href} className="block">
          <div className="aspect-square w-full overflow-hidden bg-muted">
            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url ?? undefined}
                alt={item.prompt_excerpt}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                onError={() => setImageUnavailable(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-4 text-center">
                <span className="text-xs text-muted-foreground">{unavailableText}</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="line-clamp-2 break-words text-sm leading-snug">{item.prompt_excerpt}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {item.provider}
              </span>
              {preset && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {preset.label}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                  item.status === 'succeeded'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.status}
              </span>
            </div>
            {item.error_message && (
              <p className="mt-1.5 line-clamp-1 break-words text-xs text-destructive">{item.error_message}</p>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDialogOpen(true) }}
          className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs text-destructive opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100"
        >
          Delete
        </button>
      </div>
      <DeleteGenerationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        error={deleteError}
      />
    </>
  )
}
