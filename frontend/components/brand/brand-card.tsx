'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BrandListItem } from '@/types'

interface BrandCardProps {
  brand: BrandListItem
}

const statusLabels: Record<string, { label: string; className: string }> = {
  not_started: { label: 'Not Started', className: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
  complete: { label: 'Complete', className: 'bg-green-100 text-green-700' },
}

export function BrandCard({ brand }: BrandCardProps) {
  const status = statusLabels[brand.kit_status] || statusLabels.not_started

  return (
    <Link
      href={`/${brand.id}`}
      className="flex items-center gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
    >
      {brand.logo_url ? (
        <Image
          src={brand.logo_url}
          alt={brand.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-500">
          {(brand.name[0] || '?').toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium">{brand.name}</h3>
        <p className="text-xs text-muted-foreground">
          {new Date(brand.created_at).toLocaleDateString()}
        </p>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
        {status.label}
      </span>
    </Link>
  )
}
