'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import { ProviderKey } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AddKeyModalProps {
  brandId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onKeyAdded: () => void
  defaultProvider?: string
}

export function AddKeyModal({
  brandId,
  open,
  onOpenChange,
  onKeyAdded,
  defaultProvider,
}: AddKeyModalProps) {
  const [provider, setProvider] = useState<'openai' | 'gemini'>(
    defaultProvider === 'openai' || defaultProvider === 'gemini' ? defaultProvider : 'openai'
  )
  const [key, setKey] = useState('')
  const [label, setLabel] = useState('')
  const [makeActive, setMakeActive] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setKey('')
      setLabel('')
      setMakeActive(true)
      setShowKey(false)
      setError(null)
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiRequest<ProviderKey>(`/brands/${brandId}/keys`, {
        method: 'POST',
        body: JSON.stringify({
          provider,
          key: key.trim(),
          label: label.trim() || null,
          make_active: makeActive,
        }),
      })
      onKeyAdded()
      handleOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add key')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
          <DialogDescription>
            Add an API key for an AI image generation provider. The key will be stored securely and never shown again.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Provider</label>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  provider === 'openai'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                OpenAI
              </button>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  provider === 'gemini'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                Gemini
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">API Key</label>
            <div className="relative mt-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={provider === 'openai' ? 'sk-...' : 'AI...'}
                required
                className="w-full rounded-md border px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Label (optional)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Production key"
              maxLength={100}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={makeActive}
              onChange={(e) => setMakeActive(e.target.checked)}
              className="rounded"
            />
            Set as active key for this provider
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Key'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
