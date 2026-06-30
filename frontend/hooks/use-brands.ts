'use client'

import { useBrandsContext } from '@/components/providers/brands-provider'

export function useBrands() {
  const { brands, loading, error, refetchBrands, addBrand, updateBrand, removeBrand } =
    useBrandsContext()

  return {
    brands,
    loading,
    error,
    refetch: refetchBrands,
    addBrand,
    updateBrand,
    removeBrand,
  }
}
