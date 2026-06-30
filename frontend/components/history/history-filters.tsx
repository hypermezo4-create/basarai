'use client'

interface HistoryFiltersProps {
  provider: string | undefined
  status: string | undefined
  onProviderChange: (value: string | undefined) => void
  onStatusChange: (value: string | undefined) => void
}

export function HistoryFilters({
  provider,
  status,
  onProviderChange,
  onStatusChange,
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <label htmlFor="history-provider" className="sr-only">
        Filter by provider
      </label>
      <select
        id="history-provider"
        value={provider ?? ''}
        onChange={(e) => onProviderChange(e.target.value || undefined)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm"
      >
        <option value="">All providers</option>
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
      </select>
      <label htmlFor="history-status" className="sr-only">
        Filter by status
      </label>
      <select
        id="history-status"
        value={status ?? ''}
        onChange={(e) => onStatusChange(e.target.value || undefined)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm"
      >
        <option value="">All statuses</option>
        <option value="succeeded">Succeeded</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  )
}
