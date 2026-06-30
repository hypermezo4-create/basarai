'use client'

import { useEffect, useState } from 'react'
import type { GenerationResponse } from '@/types'
import { ErrorMessage } from '@/components/generation/error-message'
import { downloadImageFile } from '@/lib/download'

interface GeneratorResultProps {
  state:
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'success'; result: GenerationResponse }
    | { status: 'error'; code: string; message: string }
  brandId: string
}

export function GeneratorResult({ state, brandId }: GeneratorResultProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  // Clear any stale download error when a new result is shown.
  const resultId = state.status === 'success' ? state.result.id : null
  useEffect(() => {
    setDownloadError(null)
  }, [resultId])

  async function handleDownload(result: GenerationResponse) {
    if (!result.image_url || !result.download_filename) return
    setDownloading(true)
    setDownloadError(null)
    try {
      await downloadImageFile(result.image_url, result.download_filename)
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : 'Download failed. Please try again.',
      )
    } finally {
      setDownloading(false)
    }
  }

  if (state.status === 'idle') {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Your generated image will appear here.
      </div>
    )
  }

  if (state.status === 'submitting') {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Generating…
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <ErrorMessage code={state.code} message={state.message} brandId={brandId} />
    )
  }

  const { result } = state
  return (
    <div className="flex flex-col gap-3">
      {result.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.image_url}
          alt="Generated"
          className="w-full rounded-md border"
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {result.width} × {result.height} · {result.provider} · {result.model}
        </span>
        <button
          type="button"
          onClick={() => handleDownload(result)}
          disabled={downloading || !result.image_url || !result.download_filename}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {downloading ? 'Downloading…' : 'Download'}
        </button>
      </div>
      {downloadError && (
        <p className="text-xs text-destructive">{downloadError}</p>
      )}
    </div>
  )
}
