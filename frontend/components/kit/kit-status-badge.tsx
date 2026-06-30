import Link from 'next/link'
import { KitStatus } from '@/types'

const LABELS: Record<KitStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  complete: 'Complete',
}

const CLASSES: Record<KitStatus, string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-800',
  complete: 'bg-green-100 text-green-800',
}

export function KitStatusBadge({ status, brandId }: { status: KitStatus; brandId: string }) {
  return (
    <Link
      href={`/${brandId}/kit`}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CLASSES[status]}`}
      aria-label={`Brand kit status: ${LABELS[status]}. Click to edit.`}
    >
      {LABELS[status]}
    </Link>
  )
}
