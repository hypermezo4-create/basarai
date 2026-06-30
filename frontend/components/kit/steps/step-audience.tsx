'use client'

import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepAudience({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 4 of 7 — Audience</h2>
      <p className="text-sm text-muted-foreground">
        Who is your target audience?
      </p>
      <label htmlFor="kit-audience" className="text-sm font-medium">
        Audience
      </label>
      <textarea
        id="kit-audience"
        value={answers.audience ?? ''}
        maxLength={500}
        onChange={(e) => onChange({ audience: e.target.value || null })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Describe your target audience..."
        rows={4}
      />
      <p className="text-xs text-muted-foreground">
        {answers.audience?.length ?? 0}/500
      </p>
    </div>
  )
}
