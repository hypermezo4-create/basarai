import Link from 'next/link'

interface ErrorMessageProps {
  code: string
  message: string
  brandId: string
}

export function ErrorMessage({ code, message, brandId }: ErrorMessageProps) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm font-medium text-destructive">
        {message}
      </p>
      {code === 'INVALID_KEY' && (
        <p className="mt-2 text-sm">
          <Link
            href={`/${brandId}/keys`}
            className="text-destructive underline underline-offset-2"
          >
            Review your provider keys
          </Link>
        </p>
      )}
    </div>
  )
}
