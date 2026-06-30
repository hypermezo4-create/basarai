'use client'

import { ProviderKey } from '@/types'

interface KeyCardProps {
  keyData: ProviderKey
  onValidate?: (keyId: string) => void
  onActivate?: (keyId: string) => void
  onDelete?: (keyId: string) => void
  isValidating?: boolean
}

export function KeyCard({ keyData, onValidate, onActivate, onDelete, isValidating }: KeyCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            ****{keyData.key_hint || '????'}
          </span>
          {keyData.label && (
            <span className="text-sm text-muted-foreground">— {keyData.label}</span>
          )}
        </div>
        {keyData.is_active && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
      </div>

      {keyData.is_valid !== null && (
        <div className="text-xs text-muted-foreground">
          {keyData.is_valid ? (
            <span className="text-green-600">Valid</span>
          ) : (
            <span className="text-red-600">
              Invalid{keyData.last_validation_error ? `: ${keyData.last_validation_error}` : ''}
            </span>
          )}
          {keyData.last_validated_at && (
            <span className="ml-2">
              (checked {new Date(keyData.last_validated_at).toLocaleDateString()})
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {onValidate && (
          <button
            type="button"
            onClick={() => onValidate(keyData.id)}
            disabled={isValidating}
            className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
        )}
        {onActivate && !keyData.is_active && (
          <button
            type="button"
            onClick={() => onActivate(keyData.id)}
            className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
          >
            Activate
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(keyData.id)}
            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
