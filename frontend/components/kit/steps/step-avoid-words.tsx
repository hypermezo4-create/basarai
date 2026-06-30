'use client'

import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepAvoidWords({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 6 of 7 — Avoid Words</h2>
      <p className="text-sm text-muted-foreground">
        Any words or themes to avoid? (optional)
      </p>
      <textarea
        value={answers.avoid_words ?? ''}
        maxLength={500}
        onChange={(e) => onChange({ avoid_words: e.target.value || null })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Enter words or themes to avoid..."
        rows={4}
      />
      <p className="text-xs text-muted-foreground">
        {answers.avoid_words?.length ?? 0}/500
      </p>
    </div>
  )
}
