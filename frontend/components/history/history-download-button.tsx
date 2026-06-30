'use client'

import { useState } from 'react'
import { downloadImageFile } from '@/lib/download'

interface HistoryDownloadButtonProps {
  imageUrl: string | null
  downloadFilename: string | null
  disabled?: boolean
}

export function HistoryDownloadButton({
  imageUrl,
  downloadFilename,
  disabled: forceDisabled = false,
}: HistoryDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const disabled = forceDisabled || !imageUrl || !downloadFilename

  async function handleDownload() {
    if (disabled || !imageUrl || !downloadFilename) return
    setDownloading(true)
    setError(null)
    try {
      await downloadImageFile(imageUrl, downloadFilename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || downloading}
        className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {downloading ? 'Downloading…' : 'Download'}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
