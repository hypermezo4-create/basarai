'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useBrand } from '@/hooks/use-brand'
import { useBrands } from '@/hooks/use-brands'
import { apiRequest } from '@/lib/api'
import { DeleteBrandDialog } from '@/components/brand/delete-brand-dialog'
import { Brand, LogoUploadResponse } from '@/types'

export default function BrandSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = Array.isArray(params.brandId) ? params.brandId[0] : params.brandId ?? ''
  const { brand, loading, error, mutate } = useBrand(brandId)
  const { updateBrand, removeBrand } = useBrands()

  const [newName, setNewName] = useState('')
  const [renameLoading, setRenameLoading] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [renameSuccess, setRenameSuccess] = useState(false)
  const nameDirty = useRef(false)

  const [logoLoading, setLogoLoading] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (brand && !nameDirty.current) {
      setNewName(brand.name)
    }
  }, [brand])

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error || !brand) {
    return <p className="text-red-600">Failed to load brand settings.</p>
  }

  const handleRename = async () => {
    setRenameLoading(true)
    setRenameError(null)
    setRenameSuccess(false)
    try {
      const updated = await apiRequest<Brand>(`/brands/${brandId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newName.trim() }),
      })
      mutate(updated)
      updateBrand(updated)
      nameDirty.current = false
      setRenameSuccess(true)
    } catch (err) {
      setRenameError(err instanceof Error ? err.message : 'Failed to rename brand')
    } finally {
      setRenameLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoLoading(true)
    setLogoError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await apiRequest<LogoUploadResponse>(
        `/brands/${brandId}/logo`,
        { method: 'POST', body: formData }
      )
      const updatedBrand = { ...brand, logo_url: result.logo_url }
      mutate(updatedBrand)
      updateBrand(updatedBrand)
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'Failed to upload logo')
    } finally {
      setLogoLoading(false)
      e.target.value = ''
    }
  }

  const handleLogoRemove = async () => {
    setLogoLoading(true)
    setLogoError(null)
    try {
      await apiRequest(`/brands/${brandId}/logo`, { method: 'DELETE' })
      const updatedBrand = { ...brand, logo_url: null }
      mutate(updatedBrand)
      updateBrand(updatedBrand)
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'Failed to remove logo')
    } finally {
      setLogoLoading(false)
    }
  }

  const handleBrandDeleted = () => {
    removeBrand(brandId)
    router.push('/brands')
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Settings</h2>

      {/* Section 1: Brand Name */}
      <div>
        <h3 className="text-sm font-medium">Brand Name</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              nameDirty.current = true
              setRenameSuccess(false)
            }}
            className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleRename}
            disabled={renameLoading || !newName.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {renameLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
        {renameError && <p className="mt-1 text-sm text-red-600">{renameError}</p>}
        {renameSuccess && <p className="mt-1 text-sm text-green-600">Name updated.</p>}
      </div>

      {/* Section 2: Brand Logo */}
      <div>
        <h3 className="text-sm font-medium">Brand Logo</h3>
        <div className="mt-2 flex items-center gap-4">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-500">
              {(brand.name[0] || '?').toUpperCase()}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              {logoLoading ? 'Uploading...' : 'Upload Logo'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                disabled={logoLoading}
                className="hidden"
              />
            </label>
            {brand.logo_url && (
              <button
                type="button"
                onClick={handleLogoRemove}
                disabled={logoLoading}
                className="text-left text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove Logo
              </button>
            )}
          </div>
        </div>
        {logoError && <p className="mt-1 text-sm text-red-600">{logoError}</p>}
      </div>

      {/* Section 3: Danger Zone */}
      <div className="rounded-lg border border-red-200 p-6">
        <h3 className="font-medium text-red-600">Danger Zone</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete this brand and all associated data.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Delete Brand
        </button>
      </div>

      <DeleteBrandDialog
        brand={brand}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onBrandDeleted={handleBrandDeleted}
      />
    </div>
  )
}
