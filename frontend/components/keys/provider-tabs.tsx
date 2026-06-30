'use client'

import { useState } from 'react'
import { ProviderKey } from '@/types'

type Provider = 'openai' | 'gemini'

interface ProviderTabsProps {
  keys: ProviderKey[]
  children: (filteredKeys: ProviderKey[], activeProvider: Provider) => React.ReactNode
}

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'gemini', label: 'Gemini' },
]

export function ProviderTabs({ keys, children }: ProviderTabsProps) {
  const [activeProvider, setActiveProvider] = useState<Provider>('openai')

  const filteredKeys = keys.filter((k) => k.provider === activeProvider)

  return (
    <div>
      <div className="flex gap-1 border-b mb-4">
        {PROVIDERS.map((p) => {
          const count = keys.filter((k) => k.provider === p.id).length
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveProvider(p.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeProvider === p.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label} ({count})
            </button>
          )
        })}
      </div>
      {children(filteredKeys, activeProvider)}
    </div>
  )
}
