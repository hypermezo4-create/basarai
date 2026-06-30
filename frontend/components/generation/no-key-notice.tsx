import Link from 'next/link'
import type { Provider } from '@/types'

interface NoKeyNoticeProps {
  provider: Provider
  brandId: string
}

export function NoKeyNotice({ provider, brandId }: NoKeyNoticeProps) {
  const label = provider === 'openai' ? 'OpenAI' : 'Gemini'
  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
      No active {label} key for this brand.{' '}
      <Link
        href={`/${brandId}/keys`}
        className="font-medium underline underline-offset-2"
      >
        Add or activate a key
      </Link>
    </div>
  )
}
