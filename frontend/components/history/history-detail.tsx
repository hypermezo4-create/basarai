'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PLATFORM_PRESETS } from '@/lib/presets'
import type { GenerationDetail } from '@/types'
import type { DeleteGenerationOutcome } from '@/hooks/use-delete-generation'
import { HistoryDownloadButton } from './history-download-button'
import { DeleteGenerationDialog } from './delete-generation-dialog'

interface HistoryDetailProps {
  detail: GenerationDetail
  brandId: string
  backSearch?: string
  onDelete: () => Promise<DeleteGenerationOutcome>
  onDeleted: () => void
}

export function HistoryDetail({ detail, brandId, backSearch, onDelete, onDeleted }: HistoryDetailProps) {
  const preset = PLATFORM_PRESETS[detail.platform_preset]
  const backHref = `/${brandId}/history${backSearch ? `?${backSearch}` : ''}`
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const showImage = Boolean(detail.image_url) && !imageUnavailable
  const shouldShowUnavailable = detail.status === 'succeeded' && !showImage

  useEffect(() => {
    setImageUnavailable(false)
  }, [detail.id, detail.image_url])

  async function handleConfirmDelete() {
    setDeleting(true)
    setDeleteError(null)
    const outcome = await onDelete()
    setDeleting(false)
    if (outcome.ok) {
      onDeleted()
    } else {
      setDeleteError(outcome.message ?? 'Failed to delete. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to History
        </Link>
      </div>

      {showImage && (
        <div className="overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={detail.image_url ?? undefined}
            alt={detail.prompt}
            className="w-full"
            onError={() => setImageUnavailable(true)}
          />
        </div>
      )}

      {shouldShowUnavailable && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed bg-muted p-6 text-center text-sm text-muted-foreground">
          Image unavailable. The saved metadata is still available, but the stored image could not be loaded.
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
          <p className="mt-1 text-sm break-words">{detail.prompt}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Provider</h3>
            <p className="mt-1 text-sm">{detail.provider}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
            <p className="mt-1 text-sm">{detail.model}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Platform Preset</h3>
            <p className="mt-1 text-sm">{preset?.label ?? detail.platform_preset}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Dimensions</h3>
            <p className="mt-1 text-sm">{detail.width} × {detail.height}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Logo Mode</h3>
            <p className="mt-1 text-sm capitalize">{detail.logo_mode.replace('_', ' ')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className={`mt-1 text-sm ${detail.status === 'failed' ? 'text-destructive' : 'text-green-700'}`}>
              {detail.status}
            </p>
          </div>
        </div>

        {detail.status === 'failed' && detail.error_code && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="text-sm font-medium text-destructive">Error</h3>
            <p className="mt-1 text-sm break-words text-destructive">{detail.error_message ?? detail.error_code}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="mt-1 text-sm">{new Date(detail.created_at).toLocaleString()}</p>
          </div>
          {detail.completed_at && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
              <p className="mt-1 text-sm">{new Date(detail.completed_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <HistoryDownloadButton
          imageUrl={detail.image_url}
          downloadFilename={detail.download_filename}
          disabled={imageUnavailable}
        />
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="rounded-md border border-destructive/30 px-4 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/5"
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
    </div>
  )
}
