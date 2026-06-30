'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Brand } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteBrandDialogProps {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
  onBrandDeleted: () => void
}

export function DeleteBrandDialog({
  brand,
  open,
  onOpenChange,
  onBrandDeleted,
}: DeleteBrandDialogProps) {
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = confirmName === brand.name && !loading

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      await apiRequest(`/brands/${brand.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ confirm_name: confirmName }),
      })
      onBrandDeleted()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmName('')
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Brand</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this brand (generated images, provider keys, brand kit) will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm">
            Type <strong>&quot;{brand.name}&quot;</strong> to confirm deletion:
          </p>
          <input
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Type brand name to confirm"
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Brand'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
