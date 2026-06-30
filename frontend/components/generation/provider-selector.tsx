'use client'

import type { Provider } from '@/types'
import type { ActiveKeys } from '@/hooks/use-active-keys'
import { NoKeyNotice } from '@/components/generation/no-key-notice'

interface ProviderSelectorProps {
  value: Provider
  onChange: (value: Provider) => void
  activeKeys: ActiveKeys
  brandId: string
  disabled?: boolean
}

export function ProviderSelector({
  value, onChange, activeKeys, brandId, disabled,
}: ProviderSelectorProps) {
  const currentHasKey =
    (value === 'openai' && activeKeys.openaiActive) ||
    (value === 'gemini' && activeKeys.geminiActive)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Provider</label>
      <div className="flex gap-2">
        {(['openai', 'gemini'] as Provider[]).map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p)}
            className={
              'rounded-md border px-3 py-1.5 text-sm capitalize transition-colors ' +
              (value === p
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background hover:bg-accent')
            }
          >
            {p === 'openai' ? 'OpenAI' : 'Gemini'}
          </button>
        ))}
      </div>
      {!currentHasKey && <NoKeyNotice provider={value} brandId={brandId} />}
    </div>
  )
}
