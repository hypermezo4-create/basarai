'use client'

import { KitAnswers, ToneOption } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

const TONE_OPTIONS: { value: ToneOption; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'playful', label: 'Playful' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
]

export function StepTone({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 3 of 7 — Tone</h2>
      <p className="text-sm text-muted-foreground">
        What tone should your content have?
      </p>
      <div className="flex flex-wrap gap-3">
        {TONE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ tone: option.value })}
            aria-pressed={answers.tone === option.value}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              answers.tone === option.value
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
