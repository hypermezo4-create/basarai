'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiRequest } from '@/lib/api'
import { Brand, BrandListItem } from '@/types'

type BrandSummaryUpdate = Partial<Omit<BrandListItem, 'id'>> & { id: string }

interface BrandsContextValue {
  brands: BrandListItem[]
  loading: boolean
  error: string | null
  refetchBrands: () => Promise<void>
  addBrand: (brand: Brand | BrandListItem) => void
  updateBrand: (brand: Brand | BrandListItem | BrandSummaryUpdate) => void
  removeBrand: (brandId: string) => void
}

const BrandsContext = createContext<BrandsContextValue | undefined>(undefined)

function toBrandListItem(brand: Brand | BrandListItem): BrandListItem {
  return {
    id: brand.id,
    name: brand.name,
    logo_url: brand.logo_url,
    kit_status: brand.kit_status,
    created_at: brand.created_at,
  }
}

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchBrands = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiRequest<BrandListItem[]>('/brands')
      setBrands(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brands')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetchBrands()
  }, [refetchBrands])

  const addBrand = useCallback((brand: Brand | BrandListItem) => {
    const nextBrand = toBrandListItem(brand)
    setBrands((currentBrands) => {
      const existingBrand = currentBrands.find((item) => item.id === nextBrand.id)
      if (existingBrand) {
        return currentBrands.map((item) =>
          item.id === nextBrand.id ? { ...item, ...nextBrand } : item
        )
      }

      return [nextBrand, ...currentBrands]
    })
  }, [])

  const updateBrand = useCallback(
    (brand: Brand | BrandListItem | BrandSummaryUpdate) => {
      setBrands((currentBrands) =>
        currentBrands.map((item) => {
          if (item.id !== brand.id) {
            return item
          }

          if ('updated_at' in brand) {
            return { ...item, ...toBrandListItem(brand) }
          }

          return { ...item, ...brand }
        })
      )
    },
    []
  )

  const removeBrand = useCallback((brandId: string) => {
    setBrands((currentBrands) => currentBrands.filter((brand) => brand.id !== brandId))
  }, [])

  const value = useMemo(
    () => ({
      brands,
      loading,
      error,
      refetchBrands,
      addBrand,
      updateBrand,
      removeBrand,
    }),
    [addBrand, brands, error, loading, refetchBrands, removeBrand, updateBrand]
  )

  return <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
}

export function useBrandsContext() {
  const context = useContext(BrandsContext)

  if (!context) {
    throw new Error('useBrandsContext must be used within a BrandsProvider')
  }

  return context
}
