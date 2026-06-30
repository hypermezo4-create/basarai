'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBrands } from '@/hooks/use-brands'
import { CreateBrandModal } from '@/components/brand/create-brand-modal'
import { BrandCard } from '@/components/brand/brand-card'
import { Brand } from '@/types'

export default function BrandsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { brands, loading, error, addBrand } = useBrands()
  const router = useRouter()

  const handleBrandCreated = (brand: Brand) => {
    addBrand(brand)
    router.push(`/${brand.id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Create Brand
        </button>
      </div>

      {loading && <p className="mt-4 text-muted-foreground">Loading...</p>}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && !error && brands.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            No brands yet. Create your first brand to get started.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Create Brand
          </button>
        </div>
      )}

      {!loading && brands.length > 0 && (
        <div className="mt-4 grid gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}

      <CreateBrandModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onBrandCreated={handleBrandCreated}
      />
    </div>
  )
}
